<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PenugasanVerifikatorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'semester' => new SemesterResource($this->whenLoaded('semester')),
            'user' => [
                'id' => $this->user_id,
                'name' => $this->whenLoaded('user', fn() => $this->user->name),
                'email' => $this->whenLoaded('user', fn() => $this->user->email),
            ],
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
