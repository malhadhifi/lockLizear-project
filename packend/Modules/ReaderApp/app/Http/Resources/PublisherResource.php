<?php

namespace Modules\ReaderApp\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PublisherResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
        ];
    }
}
