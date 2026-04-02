<?php

namespace Modules\ReaderApp\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Helpers\ApiEnumMapper;

class DocumentResource extends JsonResource
{
    public function toArray($request)
    {
        // نستخرج البيانات من المصفوفة المُمررة
        $doc = $this->resource['document'];
        $sourceType = $this->resource['source_type'];
        $pivot = $this->resource['pivot'] ?? null;
        $licenseID = $this->resource['license_id'] ?? null;
        $publictionId = $this->resource['publication_id'] ?? null;

        $controls = $doc->securityControls;
        $isSuspended = ($doc->status === 'suspended' || ($pivot && $pivot->status === 'suspended'));
        $statusStr = $isSuspended ? 'suspended' : 'valid';

        // 1. الإعدادات الافتراضية من الملف نفسه
        $expiryModeStr = $controls->expiry_mode ?? 'never';
        $expiryDate = $controls->expiry_date ?? null;
        $expiryDays = $controls->expiry_days ?? null;
        $maxViews = $controls->max_views_allowed ?? null;

        // 2. تطبيق الاستثناءات (Overrides) إذا كان مربوطاً برخصة مباشرة
        if ($sourceType === 'selected_customers' && $pivot) {
            if ($pivot->access_mode === 'limited') {
                $expiryModeStr = 'fixed_date';
                $expiryDate = $pivot->valid_until;
                $expiryDays = null;
                $maxViews = $pivot->views_override;
            } elseif ($pivot->access_mode === 'unlimited') {
                $expiryModeStr = 'never';
                $expiryDate = null;
                $expiryDays = null;
                $maxViews = $pivot->views_override;
            }
        }

        return [

            'document_uuid' => $doc->document_uuid,
            'publication_id'=>$publictionId,
            'publisher_id' => $doc->publisher_id,
            'license_id'=>$licenseID,
            'title' => $doc->title,
            'type' => ApiEnumMapper::documentType($doc->type),
            'file_hash' => $doc->file_hash,
            'encrypted_key' => ($isSuspended || !$doc->key) ? null : $doc->key->encrypted_key,
            'status' => ApiEnumMapper::status($statusStr),
            'expiry_mode' => ApiEnumMapper::expiryMode($expiryModeStr),
            'expiry_date' => $expiryDate,
            'expiry_days' => $expiryDays,
            'verify_mode' => ApiEnumMapper::verifyMode($controls->verify_mode ?? 'never'),
            'verify_frequency_days' => $controls->verify_frequency_days ?? null,
            'grace_period_days' => $controls->grace_period_days ?? null,
            'max_views' => $maxViews,
            'access_scope'=>$doc->access_scope,
        ];
    }
}
