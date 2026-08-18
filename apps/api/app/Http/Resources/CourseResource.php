<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'course_code' => $this->course_code,
            'course_name' => $this->course_name,
            'credits' => $this->credits,
            'semester' => $this->semester,
            'category' => $this->category,
            'clos' => CloResource::collection($this->whenLoaded('clos')),
        ];
    }
}
