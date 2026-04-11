<?php

namespace Modules\Library\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class PublicationDetailsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            // التأكد من إرجاع القيمة كـ Boolean لتفادي أخطاء React
            'obey' => (bool) $this->obey,

            // 🚀 إضافة الحالة (تأكد أن اسم العمود في جدول publications هو status)
            'status' => $this->status,

            // المتغيرات الحسابية (Counters)
            'customersCount' => $this->customerlicenses_count ?? 0,
            'docsCount' => $this->documents_count ?? 0,

            // 🚀 إضافة المتغيرات الجديدة الخاصة بالـ PDF والفيديو
            'pdfCount' => $this->pdf_count ?? 0,
            'videoCount' => $this->video_count ?? 0,

            'createdAt' => Carbon::parse($this->created_at)->format('Y-m-d'),
        ];
    }
}
