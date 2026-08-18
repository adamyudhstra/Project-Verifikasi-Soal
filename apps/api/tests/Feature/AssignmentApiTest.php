<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Course;
use App\Models\Semester;
use App\Models\KoordinatorAssignment;

class AssignmentApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Setup base models
        $this->course = Course::create(['course_code' => 'MK01', 'course_name' => 'Test MK', 'credits' => 3, 'semester' => 1]);
        $this->semester = Semester::create(['code' => 'SEM01', 'name' => 'Sem 1']);
    }

    public function test_koordinator_cannot_create_assignment()
    {
        $user = User::factory()->create(['role' => 'KOORDINATOR']);
        
        $response = $this->actingAs($user)->postJson('/api/v1/koordinator-assignments', [
            'course_id' => $this->course->id,
            'semester_id' => $this->semester->id,
            'user_id' => $user->id,
        ]);
        
        $response->assertStatus(403);
    }

    public function test_super_admin_can_create_koordinator_assignment()
    {
        $admin = User::factory()->create(['role' => 'SUPER_ADMIN']);
        $koorUser = User::factory()->create(['role' => 'KOORDINATOR']);

        $response = $this->actingAs($admin)->postJson('/api/v1/koordinator-assignments', [
            'course_id' => $this->course->id,
            'semester_id' => $this->semester->id,
            'user_id' => $koorUser->id,
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['data' => ['id', 'status', 'user']]);
    }

    public function test_validation_prevents_wrong_role_for_koordinator()
    {
        $admin = User::factory()->create(['role' => 'SUPER_ADMIN']);
        $wrongUser = User::factory()->create(['role' => 'VERIFIKATOR']); // Wrong role

        $response = $this->actingAs($admin)->postJson('/api/v1/koordinator-assignments', [
            'course_id' => $this->course->id,
            'semester_id' => $this->semester->id,
            'user_id' => $wrongUser->id,
        ]);

        $response->assertStatus(422)
                 ->assertJsonFragment(['message' => 'The assigned user does not have KOORDINATOR role.']);
    }

    public function test_cannot_create_duplicate_koordinator_assignment()
    {
        $admin = User::factory()->create(['role' => 'SUPER_ADMIN']);
        $koorUser = User::factory()->create(['role' => 'KOORDINATOR']);

        KoordinatorAssignment::create([
            'course_id' => $this->course->id,
            'semester_id' => $this->semester->id,
            'user_id' => $koorUser->id,
        ]);

        $response = $this->actingAs($admin)->postJson('/api/v1/koordinator-assignments', [
            'course_id' => $this->course->id,
            'semester_id' => $this->semester->id,
            'user_id' => $koorUser->id,
        ]);

        $response->assertStatus(409);
    }
}
