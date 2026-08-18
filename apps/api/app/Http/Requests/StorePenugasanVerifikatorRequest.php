<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePenugasanVerifikatorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('createPenugasanVerifikator');
    }

    public function rules(): array
    {
        return [
            'semester_id' => 'required|exists:semesters,id',
            'user_id' => 'required|exists:users,id',
        ];
    }
}
