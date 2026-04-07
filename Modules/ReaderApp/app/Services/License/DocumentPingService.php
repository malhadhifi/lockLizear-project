<?php

namespace Modules\ReaderApp\Services\License;

use Modules\CustomerManagement\Models\Voucher;
use Modules\Library\Models\Document;
use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\CustomerManagement\Models\CustomerDevice;
use Modules\ReaderApp\Http\Resources\PingPayloadResource;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;

class DocumentPingService
{
    public function pingDocument($reader, array $data)
    {
        // 1. جلب الملف الأصلي مع إعدادات الأمان
        $document = Document::with('securityControls')->where('document_uuid', $data['document_uuid'])->first();

        if (!$document) {
            throw new Exception('not_found', 4001);
        }

        // 2. إذا كان الملف محذوفاً أو معلقاً من الجذور، نرفض فوراً
        if ($document->status === 'suspend') {
            throw new Exception('suspended', 4002);
        }

        // $licenseIdToUse = null;
        // $pivotData = null;
        // $pivotUpdatedAt = null;
        // $device = CustomerDevice::where('hardware_id', $data['hardware_id'])->where('reader_id', $reader->id)->first();
        // if (!$device) {
        //     throw new Exception('device_not_found', 2001);
        // }
        // $licenseIdToUse = $this->validateLicenseAndDevice($data['license_type'], $data['license_id'], $device, $reader);
        // // 3. التحقق المسبق من الجهاز (مطلوب لأي ملف غير متاح للجميع)
        // $device = null;
        // if ($document->access_scope !== 'all_customers') {


        //     // // 🌟 الفحص الأمني القوي للرخصة أو الكرت
        // }

        // // 4. توجيه مسار الفحص بناءً على نوع وصول الملف
        // if ($document->access_scope === 'publication' && $document->publication_id) {
        //     $pivotData = $this->validatePublication($document->publication_id, $licenseIdToUse);

        // } elseif ($document->access_scope === 'selected_customers') {
        //     $pivotData = $this->validateDirectDocument($document->id, $licenseIdToUse);
        //     $pivotUpdatedAt = Carbon::parse($pivotData->updated_at);
        // }


        $licenseIdToUse = null;
        $pivotData = null;
        $pivotUpdatedAt = null;
        
        // جلب الجهاز باستخدام ?? null لحماية الكود من أخطاء Undefined key
        $hardwareId = $data['hardware_id'] ?? null;
        $device = CustomerDevice::where('hardware_id', $hardwareId)->where('reader_id', $reader->id)->first();
        
        if (!$device) {
            throw new Exception('device_not_found', 2001);
        }

        // ==========================================================
        // 🌟 التعديل هنا: فحص الرخصة يتم فقط إذا كان الملف ليس متاحاً للجميع
        // ==========================================================
        if ($document->access_scope !== 'all_customers') {
            
            // استخدام ?? null يحمي النظام في حال لم يتم إرسال هذه المتغيرات
            $licenseType = $data['license_type'] ?? null;
            $licenseId   = $data['license_id'] ?? null;

            // إذا كان الملف يحتاج رخصة ولكن التطبيق لم يرسلها، نرفض الطلب
            if (!$licenseType || !$licenseId) {
                throw new Exception('license_missing', 4000); 
            }

            $licenseIdToUse = $this->validateLicenseAndDevice($licenseType, $licenseId, $device, $reader);
        }

        // 4. توجيه مسار الفحص بناءً على نوع وصول الملف
        if ($document->access_scope === 'publication' && $document->publication_id) {
            $pivotData = $this->validatePublication($document->publication_id, $licenseIdToUse);

        } elseif ($document->access_scope === 'selected_customers') {
            $pivotData = $this->validateDirectDocument($document->id, $licenseIdToUse);
            $pivotUpdatedAt = Carbon::parse($pivotData->updated_at);
        }
        
        // ... (باقي الكود كما هو بالأسفل) ...

        // 5. فحص التعليق من الجدول الوسيط
        if ($pivotData && isset($pivotData->status) &&( $pivotData->status === 'suspended'|| $pivotData->status === 'suspend')) {
            throw new Exception('suspended', 4002);
        }

        // 6. مقصلة التاريخ الثابت
        $controls = $document->securityControls;
        $expiryDate = null;

        if ($document->access_scope === 'selected_customers' && $pivotData) {
            if ($pivotData->access_mode === 'limited') {
                $expiryDate = $pivotData->valid_until;
            } elseif ($pivotData->access_mode === 'baselimited') {
                $expiryDate = $controls->expiry_date ?? null;
            }
        } else {
            $expiryDate = $controls->expiry_date ?? null;
        }

        if ($expiryDate && now()->greaterThan(Carbon::parse($expiryDate))) {
            throw new Exception('document_expired', 4003);
        }

        // =================================================================

        // 7. المقارنة الزمنية الدقيقة (هل يوجد تحديث؟)
        $lastConnected = Carbon::parse($data['last_connected_at']);
        $docUpdatedAt = Carbon::parse($document->updated_at);
        $controlsUpdatedAt = $document->securityControls ? Carbon::parse($document->securityControls->updated_at) : clone $docUpdatedAt;

        // إذا كان تاريخ الموبايل أحدث من أو يساوي آخر تعديل للملف الأصلي وإعداداته (والجدول الوسيط إن وُجد)
        if (
            $lastConnected->greaterThanOrEqualTo($docUpdatedAt) &&
            $lastConnected->greaterThanOrEqualTo($controlsUpdatedAt) &&
            (!$pivotUpdatedAt || $lastConnected->greaterThanOrEqualTo($pivotUpdatedAt))
        ) {
            // لا يوجد تحديث
            return ['code' => 1030, 'data' => null];
        }

        // 8. بناء بيانات التحديث وتسليمها للقالب
        $payloadRaw = [
            'document' => $document,
            'pivot' => $pivotData,
            'access_scope' => $document->access_scope
        ];

        return ['code' => 1031, 'data' => new PingPayloadResource($payloadRaw)];
    }

    // =================================================================
    // دالة بوابة الأمان (مع منطق الكروت المحدث)
    // =================================================================
    private function validateLicenseAndDevice($type, $licenseId, $device, $reader)
    {
        if ($type === 'voucher') {
            // 🌟 التعديل المطلوب: نبحث عن الكرت الذي يتبع الرخصة الممررة + يخص هذا الطالب + على هذا الجهاز
            $voucher = Voucher::with('license')
                ->where('customer_license_id', $licenseId)
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
            return $voucher->license->id; // نرجع رقم الرخصة الأب كما يتطلب باقي الكود

        } else {
            // حالة الرخصة الفردية أو الجماعية
            $license = CustomerLicense::withTrashed()->find($licenseId);

            if (!$license || $license->deleted_at)
                throw new Exception('not_found', 4030);
            if ($license->customer_devices_id != $device->id || $license->reader_id != $reader->id) {
                throw new Exception('not_found', 4030);
            }

            $this->validateLicenseDates($license);
            return $license->id;
        }
    }

    private function validateLicenseDates($license)
    {
        if ($license->status === 'suspend')
            throw new Exception('suspended', 4036);
        if (!$license->never_expires && $license->valid_until && now()->isAfter($license->valid_until)) {
            throw new Exception('expired', 4032);
        }
    }

    private function validatePublication($publicationId, $licenseId)
    {
        $publication = DB::table('publications')->where('id', $publicationId)->whereNull('deleted_at')->first();
        if (!$publication || $publication->status === 'suspend')
            throw new Exception('pub_suspended', 4040);

        $pivot = DB::table('license_publications')
            ->where('customer_license_id', $licenseId)
            ->where('publication_id', $publicationId)
            ->first();

        if (!$pivot || $pivot->status === 'revoked')
            throw new Exception('pub_revoked', 4040);

        if ($pivot->access_mode !== 'unlimited' && $pivot->valid_until) {
            if (now()->greaterThan(Carbon::parse($pivot->valid_until))) {
                throw new Exception('pub_expired', 4042);
            }
        }

        return $pivot;
    }

    private function validateDirectDocument($documentId, $licenseId)
    {
        $pivot = DB::table('license_documents')
            ->where('customer_license_id', $licenseId)
            ->where('document_id', $documentId)
            ->first();

        if (!$pivot || $pivot->status === 'revoked')
            throw new Exception('doc_revoked', 4004);

        return $pivot;
    }
}
