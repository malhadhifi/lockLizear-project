<?php

namespace Modules\ReaderApp\Services\License;

use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\Library\Models\Document;
use Modules\ReaderApp\Http\Resources\LicensePayloadResource;

class LicensePayloadBuilderService
{
    /**
     * بناء كائن البيانات الكامل المُراد إرجاعه لتطبيق القارئ
     */
    public function buildPayload(int $licenseId, int $readerId, int $voucherID = null)
    {
        // 1. جلب الرخصة مع العلاقات
        $license = CustomerLicense::with([
            'publisher',
            'publications',
            'documents' => function ($q) {
                $q->where('license_documents.status', '!=', 'revoked')
                    ->with(['securityControls', 'key']);
            }
        ])->findOrFail($licenseId);

        // 2. تصفية المنشورات
        $filteredPublications = collect();
        $publicationIds = [];

        foreach ($license->publications as $pub) {
            $status = $pub->pivot->status;
            if ($status === 'revoked' || $status === 'suspend') {
                continue;
            }

            // 🌟 التعديل هنا: حقن رقم الرخصة داخل المنشور لكي يقرأه القالب
            $pub->setAttribute('license_id', $license->id);

            $publicationIds[$pub->id] = $pub->pivot;
            $filteredPublications->push($pub);
        }

        // 3. تجميع الملفات وتجهيزها للقالب
        $documentsList = collect();

        // أ) ملفات المنشورات (Obey rule)
        if (!empty($publicationIds)) {
            $pubDocs = Document::with(['securityControls', 'key'])
                ->notExpired()
                ->whereIn('publication_id', array_keys($publicationIds))
                ->get();

            foreach ($pubDocs as $doc) {

                if ($doc->publication && $doc->publication->obey && $license->valid_from) {
                    if (strtotime($doc->published_at) < strtotime($license->valid_from)) {
                        continue;
                    }
                }

                $documentsList->push([
                    'document' => $doc,
                    'source_type' => 'publication',
                    'pivot' => null,
                    'publication_id' => $doc->publication_id,
                    'license_id' => null
                ]);
            }
        }

        // ب) الملفات المباشرة (Selected Customers)
        foreach ($license->documents as $doc) {
            $pivot = $doc->pivot;
            $shouldSkip = false;

            // 🌟 إعادة حماية الملفات المسحوبة (التي حذفتها أنت بالخطأ)
            if ($pivot->status === 'revoked') {
                continue;
            }

            if ($pivot->access_mode === 'limited') {
                if ($pivot->valid_until && now()->greaterThan(\Carbon\Carbon::parse($pivot->valid_until))) {
                    $shouldSkip = true;
                }
            } elseif ($pivot->access_mode === 'baselimited') {
                if (method_exists($doc, 'isExpired') && $doc->isExpired()) {
                    $shouldSkip = true;
                }
            }

            if ($shouldSkip) {
                continue;
            }

            $documentsList->push([
                'document' => $doc,
                'source_type' => 'selected_customers',
                'pivot' => $pivot,
                'publication_id' => null,
                'license_id' => $license->id
            ]);
        }

        // ج) ملفات (All Customers) لنفس الناشر
        $allCustomersDocs = Document::with(['securityControls', 'key'])
            ->where('publisher_id', $license->publisher_id)
            ->where('access_scope', 'all_customers')
            ->notExpired()
            ->get();

        foreach ($allCustomersDocs as $doc) {
            $documentsList->push([
                'document' => $doc,
                'source_type' => 'all_customers',
                'pivot' => null,
                'publication_id' => null,
                'license_id' => null
            ]);
        }

        // 4. تسليم البيانات للقالب الرئيسي
        return new LicensePayloadResource([
            'license' => $license,
            'publications' => $filteredPublications,
            'documents' => $documentsList,
        ]);
    }
}
