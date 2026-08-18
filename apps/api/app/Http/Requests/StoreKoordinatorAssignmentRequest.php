<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKoordinatorAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('createKoordinatorAssignment');
    }

    public function rules(): array
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'semester_id' => 'required|exists:semesters,id',
            'user_id' => 'required|exists:users,id',
        ];
    }
}
