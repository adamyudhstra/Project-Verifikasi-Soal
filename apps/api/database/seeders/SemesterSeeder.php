<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Semester;

class SemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $semesters = [
            ['code' => 'GANJIL_24_25', 'name' => 'Ganjil 24/25'],
            ['code' => 'GENAP_24_25', 'name' => 'Genap 24/25'],
            ['code' => 'GANJIL_25_26', 'name' => 'Ganjil 25/26'],
            ['code' => 'GENAP_25_26', 'name' => 'Genap 25/26'],
        ];

        foreach ($semesters as $semester) {
            Semester::updateOrCreate(
                ['code' => $semester['code']],
                ['name' => $semester['name'], 'is_active' => false]
            );
        }
    }
}
