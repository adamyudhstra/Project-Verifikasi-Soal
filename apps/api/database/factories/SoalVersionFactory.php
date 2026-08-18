<?php

namespace Database\Factories;

use App\Models\Soal;
use App\Models\User;
use App\Enums\SoalStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class SoalVersionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'soal_id' => Soal::factory(),
            'version' => 1,
            'file_path' => 'private/soals/mock_file.pdf',
            'status' => SoalStatus::SUBMITTED,
            'uploader_id' => User::factory(),
        ];
    }
}
