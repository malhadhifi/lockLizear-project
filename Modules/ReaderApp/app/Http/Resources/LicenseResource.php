<?php

namespace Modules\ReaderApp\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Helpers\ApiEnumMapper; // الفهرس الذي أنشأناه

class LicenseResource extends JsonResource
{
    public function toArray($request)
    {
        $validModeStr = $this->never_expires ? 'never' : 'fixed_date';

        return [
            'id' => $this->id,
            'type' => ApiEnumMapper::licenseType($this->type),
            'status' => ApiEnumMapper::status($this->status),
            'valid_mode' => ApiEnumMapper::expiryMode($validModeStr),
            'valid_from' => $this->valid_from,
            'valid_until' => $this->never_expires ? null : $this->valid_until,
            'publisher' => new PublisherResource($this->whenLoaded('publisher')),
        ];
    }
}
