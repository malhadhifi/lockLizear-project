<?php

namespace Modules\ReaderApp\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LicensePayloadResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'license' => new LicenseResource($this->resource['license']),
            'publications' => PublicationResource::collection($this->resource['publications']),
            'documents' => DocumentResource::collection($this->resource['documents']),
        ];
    }
}
