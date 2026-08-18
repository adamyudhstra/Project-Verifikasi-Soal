<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Course;
use App\Models\Semester;

class ErrorContractApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_401_format()
    {
        $response = $this->getJson('/api/v1/dosens');
        $response->assertStatus(401)
                 ->assertExactJson(['message' => 'Unauthenticated.']);
    }

    public function test_403_format()
    {
        $user = User::factory()->create(['role' => 'KOORDINATOR']);
        $response = $this->actingAs($user)->postJson('/api/v1/koordinator-assignments', []);
        $response->assertStatus(403)
                 ->assertExactJson(['message' => 'This action is unauthorized.']);
    }

    public function test_404_format()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->getJson('/api/v1/dosens/99999');
        $response->assertStatus(404)
                 ->assertExactJson(['message' => 'Resource not found.']);
    }

    public function test_422_format()
    {
        $admin = User::factory()->create(['role' => 'SUPER_ADMIN']);
        $response = $this->actingAs($admin)->postJson('/api/v1/koordinator-assignments', []);
        
        $response->assertStatus(422)
                 ->assertJsonStructure([
                     'message',
                     'errors' => ['course_id', 'semester_id', 'user_id']
                 ]);
    }

    public function test_409_format()
    {
        $admin = User::factory()->create(['role' => 'SUPER_ADMIN']);
        $koorUser = User::factory()->create(['role' => 'KOORDINATOR']);
        $course = Course::create(['course_code' => 'MK01', 'course_name' => 'Test MK', 'credits' => 3, 'semester' => 1]);
        $semester = Semester::create(['code' => 'SEM01', 'name' => 'Sem 1']);

        // Insert first
        $this->actingAs($admin)->postJson('/api/v1/koordinator-assignments', [
            'course_id' => $course->id,
            'semester_id' => $semester->id,
            'user_id' => $koorUser->id,
        ]);

        // Duplicate
        $response = $this->actingAs($admin)->postJson('/api/v1/koordinator-assignments', [
            'course_id' => $course->id,
            'semester_id' => $semester->id,
            'user_id' => $koorUser->id,
        ]);

        $response->assertStatus(409)
                 ->assertExactJson(['message' => 'Assignment already exists for this course and semester.']);
    }
}
