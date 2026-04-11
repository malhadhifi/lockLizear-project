<?php

namespace Modules\ReaderApp\Services\License;

use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\CustomerManagement\Models\Voucher;
use Modules\Library\Models\Document;
use Modules\CustomerManagement\Models\CustomerDevice;
use Modules\ReaderApp\Http\Resources\SyncPayloadResource;

use Carbon\Carbon;
use Exception;

class LicenseSyncService
{
    public function sync($reader, array $data)
    {
        $lastSync = Carbon::parse($data['last_sync_at']);
        $hardwareId = $data['hardware_id'];

        // 1. بوابة الأمان الكبرى
        $device = CustomerDevice::where('hardware_id', $hardwareId)->where('reader_id', $reader->id)->first();
        if (!$device)
            throw new Exception('device_not_found', 2001);

        $license = $this->validateAndGetLicense($data['license_type'], $data['license_id'], $device, $reader);

        // 2. الهيكل الخام للبيانات
        $payloadRaw = [
            'license' => $license,
            'create' => ['publications' => [], 'documents' => []],
            'update' => ['publications' => [], 'documents' => []],
            'deleted' => ['publications' => [], 'documents' => []]
        ];

        // =================================================================
        // أ) معالجة المنشورات (Publications)
        // =================================================================
        $publications = $license->publications()->withTrashed()->get();
        $publicationIds = [];

        foreach ($publications as $pub) {
            $pivot = $pub->pivot;
            $publicationIds[$pub->id] = $pivot;

            $createdAt = Carbon::parse($pivot->created_at);
            $pubUpdated = Carbon::parse($pub->updated_at);
            $pivotUpdated = Carbon::parse($pivot->updated_at);
            $updatedAt = $pubUpdated->max($pivotUpdated);
            $deletedAt = $pub->deleted_at ? Carbon::parse($pub->deleted_at) : null;

            // 1. المحذوفة
            if ($deletedAt && $deletedAt->greaterThan($lastSync)) {
                $payloadRaw['deleted']['publications'][] = $pub->id;
            }
            // 2. الجديدة
            elseif (!$deletedAt && $createdAt->greaterThan($lastSync)) {
                // منطقك: تخطي المسحوب أو المعلق من الإنشاء
                if (($pivot && $pivot->status === 'revoked') || $pub->status === 'suspend' || ($pivot && $pivot->status === 'suspend')) {
                    continue;
                }
                $payloadRaw['create']['publications'][] = ['publication' => $pub, 'pivot' => $pivot, 'license_id' => $license->id];
            }
            // 3. المحدثة
            elseif (!$deletedAt && $updatedAt->greaterThan($lastSync) && $createdAt->lessThanOrEqualTo($lastSync)) {
                $payloadRaw['update']['publications'][] = ['publication' => $pub, 'pivot' => $pivot];
            }
        }

        // =================================================================
        // ب) معالجة الملفات (Documents)
        // =================================================================
        if (!empty($publicationIds)) {
            $pubDocs = Document::withTrashed()->with(['securityControls', 'key'])
                ->whereIn('publication_id', array_keys($publicationIds))->get();
            $this->distributeDocuments($pubDocs, $lastSync, $license, 'publication', $publicationIds, $payloadRaw);
        }

        $directDocs = $license->documents()->withTrashed()->with(['securityControls', 'key'])->get();
        $this->distributeDocuments($directDocs, $lastSync, $license, 'selected_customers', null, $payloadRaw);

        $allDocs = Document::withTrashed()->with(['securityControls', 'key'])
            ->where('publisher_id', $license->publisher_id)
            ->where('access_scope', 'all_customers')->get();
        //ركز على حقل$license
        $this->distributeDocuments($allDocs, $lastSync, $license, 'all_customers', null, $payloadRaw);

        // إرسال البيانات الخام للقالب ليعيد تشكيلها
        return ['code' => 1040, 'data' => new SyncPayloadResource($payloadRaw)];
    }

    private function distributeDocuments($documents, $lastSync, $license, $sourceType, $pubPivots, &$payloadRaw)
    {
        foreach ($documents as $doc) {
            $createdAt = Carbon::parse($doc->created_at);
            $pivot = null;
            if ($sourceType === 'publication')
                $pivot = $pubPivots[$doc->publication_id];

            elseif ($sourceType === 'selected_customers')
                {
               $pivot = $doc->pivot;
                $createdAt = Carbon::parse( $pivot->created_at);
                }

            // قاعدة Obey
            if ($sourceType === 'publication' && $doc->publication && $doc->publication->obey && $license->valid_from) {
                if (strtotime($doc->published_at) < strtotime($license->valid_from)) {
                    continue;
                }
            }

            $deletedAt = $doc->deleted_at ? Carbon::parse($doc->deleted_at) : null;

            $docUpdated = Carbon::parse($doc->updated_at);
            $pivotUpdated = $pivot ? Carbon::parse($pivot->updated_at) : $docUpdated;
            $controlsUpdated = $doc->securityControls ? Carbon::parse($doc->securityControls->updated_at) : $docUpdated;
            $updatedAt = $docUpdated->max($pivotUpdated)->max($controlsUpdated);

            // استخراج المعرف الفريد للملف لاستخدامه كمفتاح مانع للتكرار
            $uuid = $doc->document_uuid;

            if ($deletedAt && $deletedAt->greaterThan($lastSync)) {
                if (!in_array($uuid, $payloadRaw['deleted']['documents'])) {
                    $payloadRaw['deleted']['documents'][] = $uuid;
                }
            } elseif (!$deletedAt && $createdAt->greaterThan($lastSync)) {
                // تخطي الملفات المسحوبة أو المنتهية من الإنشاء
                if (($pivot && $pivot->status === 'revoked') || $doc->status === 'expired') {
                    continue;
                }

                // 🌟 التعديل هنا: استخدام uuid كمفتاح لسلة الإنشاء
                $payloadRaw['create']['documents'][$uuid] = [
                    'document' => $doc,
                    'pivot' => $pivot,
                    'source_type' => $sourceType,
                    'license_id' => $license->id
                ];

            } elseif (!$deletedAt && $updatedAt->greaterThan($lastSync) && $createdAt->lessThanOrEqualTo($lastSync)) {

                // 🌟 التعديل هنا: استخدام uuid كمفتاح لسلة التحديث
                $payloadRaw['update']['documents'][$uuid] = [
                    'document' => $doc,
                    'pivot' => $pivot,
                    'source_type' => $sourceType
                ];

            }
        }
    }

    private function validateAndGetLicense($type, $id, $device, $reader)
    {
        if ($type === 'voucher') {
            // 🌟 التعديل: نبحث عن الكرت الذي يتبع الرخصة الممررة + يخص هذا الطالب + على هذا الجهاز
            // أضفنا withTrashed لكي نلتقط الكروت المحذوفة ونرجع الخطأ المناسب
            $voucher = Voucher::with('license')
                ->withTrashed()
                ->where('customer_license_id', $id)
                ->where('used_by_customer_id', $reader->id)
                ->where('customer_devices_id', $device->id)
                ->first();

            if (!$voucher)
                throw new Exception('not_found', 4030);
            if ($voucher->status === 'revoked')
                throw new Exception('voucher_revoked', 4041);
            if ($voucher->deleted_at)
                throw new Exception('deleted', 4030);

            $this->validateLicenseDates($voucher->license);
            return $voucher->license;

        } else {
            // حالة الرخصة الفردية أو الجماعية المباشرة
            $license = CustomerLicense::withTrashed()->find($id);

            if (!$license || $license->deleted_at)
                throw new Exception('not_found', 4030);

            // 🛡️ الفحص الأمني القاتل للثغرة (Ownership Check)
            if ($license->customer_devices_id != $device->id || $license->reader_id != $reader->id) {
                throw new Exception('not_found', 4030);
            }

            $this->validateLicenseDates($license);
            return $license;
        }
    }

    private function validateLicenseDates($license)
    {
        if ($license->status === 'suspend')
            throw new Exception('suspend', 4036);
        if (!$license->never_expires && $license->valid_until && now()->isAfter($license->valid_until)) {
            throw new Exception('expired', 4032);
        }
    }


    public function getDeltaSync(array $data)
    {
        $lastSyncAt = $data['last_sync_at'] ?? null;

        // 2. بناء الاستعلام
        $query = Document::with('publisher')
            ->whereNotNull('download_url')
            ->where('status', 'valid');

        // 3. 🌟 السر هنا: إذا أرسل تاريخاً، نجلب فقط ما تم تحديثه بعد هذا التاريخ
        if ($lastSyncAt) {
            $query->where('created_at', '>', $lastSyncAt);
        }

        $documents = $query->get();

        // 4. تنسيق الرد
        $formattedCatalog = $documents->map(function ($doc) {
            return [
                'uuid' => $doc->document_uuid,
                'title' => $doc->title,
                'publisher_name' => $doc->publisher->name ?? 'Unknown',
                'file_size' => $doc->file_hash,
                'download_url' => url("api/reader/download/{$doc->document_uuid}"),
                'created_at' => $doc->created_at->toDateTimeString(), // لكي يخزنه المشغل للمرة القادمة
            ];
        });

        return [
            'sync_time' => now()->toDateTimeString(), // هذا التاريخ سيخزنه المشغل كـ last_sync_at للمرة القادمة
            'count' => $documents->count(),
            'files' => $formattedCatalog
        ];
    }

}
