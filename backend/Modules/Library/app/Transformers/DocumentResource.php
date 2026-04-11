<?php
namespace Modules\Library\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class DocumentResource extends JsonResource
{
    public function toArray($request)
    {
        $controls = $this->securityControls;

        // حساب تاريخ الانتهاء إذا وجد
        $expiryDate = null;
        if ($controls && $controls->expiry_mode === 'fixed_date' && $controls->expiry_date) {
            $expiryDate = Carbon::parse($controls->expiry_date)->format('Y-m-d');
        }

        // حساب انتهاء الصلاحية للعرض في القائمة
        $expiredDate = null;
        if ($expiryDate && Carbon::parse($expiryDate)->isPast()) {
            $expiredDate = $expiryDate;
        }

        return [
            'id'                 => $this->id,
            'type'               => $this->type,
            'title'              => $this->title,
            'note'               => $this->description,
            'status'             => $this->status,
            'published'          => $this->published_at
                ? Carbon::parse($this->published_at)->format('Y-m-d')
                : null,

            // معلومات الانتهاء
            'expired'            => $expiredDate,
            'expiry_date'        => $expiryDate,
            'expiry_mode'        => $controls?->expiry_mode,
            'expiry_days'        => $controls?->expiry_days,

            // عداد العملاء والمنشورات (withCount يجب أن يكون في الاستعلام)
            'customers_count'    => $this->customerlicense_count ?? 0,
            'publication_count'  => $this->publication_count     ?? 0,
        ];
    }
}
