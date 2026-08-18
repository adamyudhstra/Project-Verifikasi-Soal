<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Dosen;
use App\Models\Course;
use App\Models\Semester;

class MasterDataApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_cannot_access_master_data()
    {
        $response = $this->getJson('/api/v1/dosens');
        $response->assertStatus(401);
    }

    public function test_authenticated_can_list_dosens()
    {
        $user = User::factory()->create();
        Dosen::create(['kode_dosen' => 'D01', 'nama' => 'Dosen 1']);
        
        $response = $this->actingAs($user)->getJson('/api/v1/dosens');
        $response->assertStatus(200)
                 ->assertJsonStructure(['data' => [['id', 'kode_dosen', 'nama']]]);
    }

    public function test_authenticated_can_list_courses_with_clos()
    {
        $user = User::factory()->create();
        $course = Course::create(['course_code' => 'MK01', 'course_name' => 'Test MK', 'credits' => 3, 'semester' => 1]);
        
        $response = $this->actingAs($user)->getJson('/api/v1/courses?with_clos=1');
        $response->assertStatus(200)
                 ->assertJsonStructure(['data' => [['id', 'course_code', 'clos']]]);
    }

    public function test_authenticated_can_list_semesters()
    {
        $user = User::factory()->create();
        Semester::create(['code' => 'TEST_SEM', 'name' => 'Test Sem']);
        
        $response = $this->actingAs($user)->getJson('/api/v1/semesters');
        $response->assertStatus(200)
                 ->assertJsonStructure(['data' => [['id', 'code', 'name']]]);
    }
}
