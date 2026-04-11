<?php

namespace Modules\Library\Transformers;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class PublicationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'obey' => (bool)$this->obey,
            // المتغيرات الحسابية للكاونتر (تولدها دالة withCount في لارافيل)
            'customersCount' => $this->customerlicense_count ?? 0,
            'docsCount' => $this->documents_count ?? 0,
            'createdAt' => Carbon::parse($this->created_at)->format('Y-m-d'),
            'status' => $this->status,

        ];
    }
}
