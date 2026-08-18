<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Dosen;
use App\Models\User;
use App\Models\Semester;
use App\Models\Course;
use App\Models\Plo;
use App\Models\Clo;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Database\Seeders\SemesterSeeder;
use Illuminate\Support\Facades\Storage;

class DataFoundationAuditTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Assume json files are already present in storage/app by python script.
    }

    public function test_dosen_model_and_user_relationship()
    {
        $dosen = Dosen::create([
            'kode_dosen' => 'TEST01',
            'nama' => 'Test Dosen',
        ]);

        $user = User::factory()->create([
            'dosen_id' => $dosen->id,
        ]);

        $this->assertEquals($dosen->id, $user->dosen->id);
        $this->assertEquals($user->id, $dosen->user->id);
    }

    public function test_null_on_delete_dosen_user()
    {
        $dosen = Dosen::create([
            'kode_dosen' => 'TEST02',
            'nama' => 'Test Dosen 2',
        ]);

        $user = User::factory()->create([
            'dosen_id' => $dosen->id,
        ]);

        $dosen->delete();

        $user->refresh();
        $this->assertNull($user->dosen_id);
    }

    public function test_semester_seeder_is_idempotent()
    {
        $this->seed(SemesterSeeder::class);
        $count1 = Semester::count();
        $this->assertEquals(4, $count1);

        // Run again
        $this->seed(SemesterSeeder::class);
        $count2 = Semester::count();
        
        $this->assertEquals($count1, $count2);
        
        $this->assertDatabaseHas('semesters', ['code' => 'GANJIL_24_25']);
        $this->assertDatabaseHas('semesters', ['code' => 'GENAP_24_25']);
        $this->assertDatabaseHas('semesters', ['code' => 'GANJIL_25_26']);
        $this->assertDatabaseHas('semesters', ['code' => 'GENAP_25_26']);
    }

    public function test_import_command_is_idempotent()
    {
        $this->seed(SemesterSeeder::class);
        
        Artisan::call('data:import');
        
        $dosenCount1 = Dosen::count();
        $courseCount1 = Course::count();
        $ploCount1 = Plo::count();
        $cloCount1 = Clo::count();
        $courseCloCount1 = DB::table('course_clo')->count();
        $cloPloCount1 = DB::table('clo_plo')->count();
        
        // Ensure data is imported
        $this->assertGreaterThan(0, $dosenCount1);
        $this->assertGreaterThan(0, $courseCount1);
        
        // Run again
        Artisan::call('data:import');
        
        $this->assertEquals($dosenCount1, Dosen::count(), 'Dosen count changed on second import');
        $this->assertEquals($courseCount1, Course::count(), 'Course count changed on second import');
        $this->assertEquals($ploCount1, Plo::count(), 'PLO count changed on second import');
        $this->assertEquals($cloCount1, Clo::count(), 'CLO count changed on second import');
        $this->assertEquals($courseCloCount1, DB::table('course_clo')->count(), 'Course-CLO pivot count changed');
        $this->assertEquals($cloPloCount1, DB::table('clo_plo')->count(), 'CLO-PLO pivot count changed');
    }

    public function test_import_transaction_rollback()
    {
        $this->seed(SemesterSeeder::class);
        
        // We will mock the getJson method or force an exception by removing a json file temporarily
        $path = storage_path('app/courses.json');
        $backup = storage_path('app/courses.json.bak');
        
        rename($path, $backup);
        
        try {
            Artisan::call('data:import');
        } catch (\Exception $e) {
            // Error handled
        }
        
        // Database should be empty for dosens since courses.json failed and rolled back everything
        $this->assertEquals(0, Dosen::count());
        
        // Restore
        rename($backup, $path);
    }
}
