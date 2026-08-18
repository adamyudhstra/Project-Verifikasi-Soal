<?php

namespace Database\Factories;

use App\Models\Soal;
use App\Models\Course;
use App\Models\Semester;
use App\Models\User;
use App\Enums\ExamCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class SoalFactory extends Factory
{
    public function definition(): array
    {
        return [
            'course_id' => Course::factory(),
            'semester_id' => Semester::factory(),
            'uploader_id' => User::factory(),
            'exam_category' => ExamCategory::UTS,
            'current_version_id' => null,
        ];
    }
}
