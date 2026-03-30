<?php

namespace Modules\ReaderApp\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Helpers\ApiEnumMapper;

class PingPayloadResource extends JsonResource
{
    public function toArray($request)
    {
        $doc = $this->resource['document'];
        $pivot = $this->resource['pivot'];
        $scope = $this->resource['access_scope'];
        $controls = $doc->securityControls;

        $expiryModeStr = 'never';
        $expiryDate = null;
        $expiryDays = null;
        $maxViews = null;

        if ($scope === 'selected_customers' && $pivot) {
            if ($pivot->access_mode === 'baselimited') {
                $expiryModeStr = $controls->expiry_mode ?? 'never';
                $expiryDate = $controls->expiry_date;
                $expiryDays = $controls->expiry_days;
                $maxViews = $controls->max_views_allowed;
            } else {
                $expiryModeStr = ($pivot->access_mode === 'unlimited') ? 'never' : 'fixed_date';
                $expiryDate = ($pivot->access_mode === 'unlimited') ? null : $pivot->valid_until;
                $expiryDays = null;
                $maxViews = $pivot->views_override;
            }
        } else {
            // All Customers أو المنشورات
            $expiryModeStr = $controls->expiry_mode ?? 'never';
            $expiryDate = $controls->expiry_date;
            $expiryDays = $controls->expiry_days;
            $maxViews = $controls->max_views_allowed;
        }

        return [
            'document_uuid' => $doc->document_uuid,
            // نمرر valid دائماً هنا، لأنه لو كان معلقاً، الخدمة سترمي Exception قبل أن تصل للقالب
            'status' => ApiEnumMapper::status('valid'),
            'expiry_mode' => ApiEnumMapper::expiryMode($expiryModeStr),
            'expiry_date' => $expiryDate,
            'expiry_days' => $expiryDays,
            'max_views' => $maxViews,
        ];
    }
}
