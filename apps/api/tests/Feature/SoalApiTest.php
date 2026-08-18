<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\KoordinatorAssignment;
use App\Models\PenugasanVerifikator;
use App\Models\Semester;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SoalApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_koordinator_can_upload_soal()
    {
        $koordinator = User::factory()->create(['role' => 'KOORDINATOR']);
        $course = Course::create(['course_code' => 'IF101', 'course_name' => 'Intro', 'credits' => 3, 'semester' => 1, 'category' => 'Wajib']);
        $semester = Semester::create(['code' => 'S1', 'name' => 'Sem 1', 'is_active' => true]);

        KoordinatorAssignment::create([
            'course_id' => $course->id,
            'semester_id' => $semester->id,
            'user_id' => $koordinator->id,
        ]);

        $file = UploadedFile::fake()->create('soal.pdf', 100, 'application/pdf');

        $response = $this->actingAs($koordinator)->postJson('/api/v1/soals', [
            'course_id' => $course->id,
            'semester_id' => $semester->id,
            'exam_category' => 'UTS',
            'file' => $file,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('soals', [
            'course_id' => $course->id,
            'semester_id' => $semester->id,
            'status' => 'SUBMITTED',
            'uploader_id' => $koordinator->id,
        ]);
        
        Storage::disk('public')->assertExists($response->json('data.file_path'));
    }

    public function test_unauthorized_user_cannot_upload()
    {
        $unauthorized = User::factory()->create(['role' => 'KOORDINATOR']);
        $course = Course::create(['course_code' => 'IF101', 'course_name' => 'Intro', 'credits' => 3, 'semester' => 1, 'category' => 'Wajib']);
        $semester = Semester::create(['code' => 'S1', 'name' => 'Sem 1', 'is_active' => true]);

        $file = UploadedFile::fake()->create('soal.pdf');

        $response = $this->actingAs($unauthorized)->postJson('/api/v1/soals', [
            'course_id' => $course->id,
            'semester_id' => $semester->id,
            'exam_category' => 'UTS',
            'file' => $file,
        ]);

        $response->assertStatus(403);
    }

    public function test_verifikator_can_verify_soal()
    {
        $verifikator = User::factory()->create(['role' => 'VERIFIKATOR']);
        $koordinator = User::factory()->create(['role' => 'KOORDINATOR']);
        $course = Course::create(['course_code' => 'IF101', 'course_name' => 'Intro', 'credits' => 3, 'semester' => 1, 'category' => 'Wajib']);
        $semester = Semester::create(['code' => 'S1', 'name' => 'Sem 1', 'is_active' => true]);

        PenugasanVerifikator::create([
            'semester_id' => $semester->id,
            'user_id' => $verifikator->id,
        ]);

        $soal = \App\Models\Soal::create([
            'course_id' => $course->id,
            'semester_id' => $semester->id,
            'uploader_id' => $koordinator->id,
            'exam_category' => 'UTS',
            'file_path' => 'fake_path.pdf',
            'status' => 'SUBMITTED',
            'version' => 1,
        ]);

        $response = $this->actingAs($verifikator)->postJson("/api/v1/soals/{$soal->id}/verify", [
            'status' => 'REVISION',
            'notes' => 'Tolong perbaiki cover',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('soals', [
            'id' => $soal->id,
            'status' => 'REVISION',
        ]);
        $this->assertDatabaseHas('verifikasis', [
            'soal_id' => $soal->id,
            'action' => 'REVISION',
            'catatan' => 'Tolong perbaiki cover',
        ]);
    }
}
