<?php

namespace Modules\ReaderApp\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Helpers\ApiEnumMapper;
use Modules\ReaderApp\Trait\DocumentDynamicStatusTrait;

class SyncPayloadResource extends JsonResource
{
    use DocumentDynamicStatusTrait;

    public function toArray($request)
    {
        $payload = $this->resource;
        $license = $payload['license'];

        return [
            'license_id' => $license->id,
            'expiry_mode' => ApiEnumMapper::expiryMode($license->never_expires ? 'never' : 'fixed_date'),
            'expiry_date' => $license->never_expires ? null : $license->valid_until,

            'create' => [
                'publications' => collect($payload['create']['publications'])->map(fn($item) => $this->formatPublicationCreate($item))->filter()->values(),
                'documents' => collect($payload['create']['documents'])->map(fn($item) => $this->formatDocumentCreate($item))->filter()->values(),
            ],
            'update' => [
                'publications' => collect($payload['update']['publications'])->map(fn($item) => $this->formatPublicationUpdate($item))->values(),
                'documents' => collect($payload['update']['documents'])->map(fn($item) => $this->formatDocumentUpdate($item))->values(),
            ],
            'deleted' => $payload['deleted']
        ];
    }

    // =================================================================
    // دوال التنسيق (تم نقلها من الخدمة وتحديثها لتستخدم الفهرس الرقمي)
    // =================================================================

    private function formatPublicationCreate($item)
    {
        $pub = $item['publication'];
        $pivot = $item['pivot'];

        return [
            'publication_id' => $pub->id,
            'license_id' => $item['license_id'],
            'name' => $pub->name,
            'description' => $pub->description,
            'status' => ApiEnumMapper::status($pub->status), // دائماً active في الإنشاء بناءً على منطقك
            'valid_mode' => ApiEnumMapper::expiryMode(($pivot->access_mode === 'unlimited')),
            'valid_from' => $pivot ? $pivot->valid_from : null,
            'valid_until' => $pivot ? $pivot->valid_until : null,
        ];
    }

    private function formatPublicationUpdate($item)
    {
        $pub = $item['publication'];
        $pivot = $item['pivot'];

        $statusStr = 'active';
        if ($pivot && $pivot->status === 'revoked') {
            $statusStr = 'revoked';
        } elseif ($pub->status === 'suspend' || ($pivot && $pivot->status === 'suspend')) {
            $statusStr = 'suspend';
        }

        return [
            'publication_id' => $pub->id,
            'status' => ApiEnumMapper::status($statusStr),
            'valid_mode' => ApiEnumMapper::expiryMode(($pivot->access_mode === 'unlimited') ? 'never' : 'fixed_date'),
            'valid_until' => $pivot->valid_until,
        ];
    }

    private function formatDocumentCreate($item)
    {
        $doc = $item['document'];
        $pivot = $item['pivot'];
        $sourceType = $item['source_type'];
        $controls = $doc->securityControls;

        $statusStr = ($doc->status === 'suspend' || ($pivot && $pivot->status === 'suspend')) ? 'suspend' : 'valid';
        $isNotValid = ($statusStr === 'suspend');

        $formatted = [
            'document_uuid' => $doc->document_uuid,
            'id' => $doc->id,
            'type' => ApiEnumMapper::documentType($doc->type),
            'title' => $doc->title,
            'file_hash' => $doc->file_hash,
            'access_scope'=>ApiEnumMapper::accessScope($doc->access_scope),
            'publisher_id' => $doc->publisher_id,
            'publication_id' => $doc->publication_id,
            'license_id' => ($sourceType === 'selected_customers') ? $item['license_id'] : null,
            'status' => ApiEnumMapper::status($statusStr),
            'encrypted_key' => ($isNotValid || !$doc->key) ? null : $doc->key->encrypted_key,
            'verify_mode' => ApiEnumMapper::verifyMode($controls->verify_mode ?? 'never'),
            'verify_frequency_days' => $controls->verify_frequency_days,
            'grace_period_days' => $controls->grace_period_days,
        ];

        if ($sourceType === 'selected_customers' && $pivot) {
            if ($pivot->access_mode === 'baselimited') {
                $formatted['expiry_mode'] = ApiEnumMapper::expiryMode($controls->expiry_mode ?? 'never');
                $formatted['expiry_date'] = $controls->expiry_date;
                $formatted['expiry_days'] = $controls->expiry_days;
                $formatted['max_views'] = $controls->max_views_allowed;
            } else {
                $formatted['expiry_mode'] = ApiEnumMapper::expiryMode(($pivot->access_mode === 'unlimited') ? 'never' : 'fixed_date');
                $formatted['expiry_date'] = ($pivot->access_mode === 'unlimited') ? null : $pivot->valid_until;
                $formatted['expiry_days'] = null;
                $formatted['max_views'] = $pivot->views_override;
            }
        } else {
            $formatted['expiry_mode'] = ApiEnumMapper::expiryMode($controls->expiry_mode ?? 'never');
            $formatted['expiry_date'] = $controls->expiry_date;
            $formatted['expiry_days'] = $controls->expiry_days;
            $formatted['max_views'] = $controls->max_views_allowed;
        }

        return $formatted;
    }

    private function formatDocumentUpdate($item)
    {
        $doc = $item['document'];
        $pivot = $item['pivot'];
        $sourceType = $item['source_type'];

        // استخدام الـ Trait لفحص الحالة الديناميكية
        $statusStr = $this->evaluateDynamicStatus($doc, $pivot, $sourceType);

        $data = [
            'document_uuid' => $doc->document_uuid,
            'status' => ApiEnumMapper::status($statusStr),
        ];

        // ميزتك: إرجاع الحالة والـ UUID فقط إذا لم يكن صالحاً
        if ($statusStr !== 'valid') {
            return $data;
        }

        $controls = $doc->securityControls;

        if ($sourceType === 'selected_customers' && $pivot) {
            if ($pivot->access_mode === 'baselimited') {
                $data['expiry_mode'] = ApiEnumMapper::expiryMode($controls->expiry_mode ?? 'never');
                $data['expiry_date'] = $controls->expiry_date;
                $data['expiry_days'] = $controls->expiry_days;
                $data['max_views'] = $controls->max_views_allowed;
            } else {
                $data['expiry_mode'] = ApiEnumMapper::expiryMode(($pivot->access_mode === 'unlimited') ? 'never' : 'fixed_date');
                $data['expiry_date'] = ($pivot->access_mode === 'unlimited') ? null : $pivot->valid_until;
                $data['expiry_days'] = null;
                $data['max_views'] = $pivot->views_override;
            }
        } else {
            $data['expiry_mode'] = ApiEnumMapper::expiryMode($controls->expiry_mode ?? 'never');
            $data['expiry_date'] = $controls->expiry_date;
            $data['expiry_days'] = $controls->expiry_days;
            $data['max_views'] = $controls->max_views_allowed;
        }

        return $data;
    }
}
