<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CloResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'description' => $this->description,
            'bloom_taxonomy' => $this->bloom_taxonomy,
            'plos' => PloResource::collection($this->whenLoaded('plos')),
        ];
    }
}
