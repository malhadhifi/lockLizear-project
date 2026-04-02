<?php

namespace Modules\ReaderApp\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Helpers\ApiEnumMapper;

class PublicationResource extends JsonResource
{
    public function toArray($request)
    {
        $pivot = $this->pivot;
        $accessModeStr = $pivot ? $pivot->access_mode : 'unlimited';

        return [
            'publication_id' => $this->id,
            'license_id' => $this->license_id,
            'status' => ApiEnumMapper::status($this->status), // دائماً active في الإنشاء بناءً على منطقك
            'name' => $this->name,
            'access_mode' => ApiEnumMapper::expiryMode($accessModeStr),
            'valid_from' => $pivot ? $pivot->valid_from : null,
            'valid_until' => $pivot ? $pivot->valid_until : null,
        ];
    }
}
