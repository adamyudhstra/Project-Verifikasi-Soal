<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Dosen;
use App\Models\Course;
use App\Models\Plo;
use App\Models\Clo;
use Illuminate\Support\Str;

class ImportMasterDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'data:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import Master Data from JSON (Excel exports) deterministically';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Starting Data Foundation Import...");
        DB::beginTransaction();

        try {
            $this->importDosen();
            $this->importCourses();
            $this->importPloClo();
            $this->mapCourseClo();
            $this->auditCpmk();

            DB::commit();
            $this->info("Import successfully completed (Committed).");
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Import failed: " . $e->getMessage());
        }
    }

    private function getJson($filename)
    {
        $path = storage_path('app/' . $filename);
        if (!file_exists($path)) {
            throw new \Exception("File $filename not found at $path.");
        }
        return json_decode(file_get_contents($path), true);
    }

    private function importDosen()
    {
        $this->info("\n--- IMPORTING DOSEN ---");
        $data = $this->getJson('dosen.json');

        $totalSource = count($data);
        $imported = 0;
        $nullKode = 0;
        $duplicates = 0;

        foreach ($data as $row) {
            $kode = $row['kode_dosen'];
            $nama = $row['nama'];
            
            if (!$kode) {
                $nullKode++;
                // Check if name already exists
                $existing = Dosen::where('nama', $nama)->first();
                if ($existing) {
                    $duplicates++;
                    continue; // Skip exact duplicate by name if no code
                }
                Dosen::create([
                    'kode_dosen' => null,
                    'nama' => $nama,
                    'jfa' => $row['jfa'],
                    'no_hp' => $row['no_hp']
                ]);
                $imported++;
            } else {
                $existing = Dosen::where('kode_dosen', $kode)->first();
                if ($existing) {
                    $duplicates++;
                    // Update historical metadata if needed, but we keep idempotent
                    $existing->update([
                        'nama' => $nama,
                        'jfa' => $row['jfa'] ?? $existing->jfa,
                        'no_hp' => $row['no_hp'] ?? $existing->no_hp
                    ]);
                } else {
                    Dosen::create([
                        'kode_dosen' => $kode,
                        'nama' => $nama,
                        'jfa' => $row['jfa'],
                        'no_hp' => $row['no_hp']
                    ]);
                    $imported++;
                }
            }
        }

        $this->info("Total Source: $totalSource");
        $this->info("Imported/Created: $imported");
        $this->info("Null Kode Dosen: $nullKode");
        $this->info("Duplicate Candidates/Updated: $duplicates");
    }

    private function importCourses()
    {
        $this->info("\n--- IMPORTING MATA KULIAH ---");
        $data = $this->getJson('courses.json');

        $total = count($data);
        $imported = 0;

        foreach ($data as $row) {
            $kode = $row['Kode MK'] ?? null;
            if (!$kode) continue;

            Course::updateOrCreate(
                ['course_code' => $kode],
                [
                    'course_name' => $row['Nama MK (INA)'],
                    'credits' => $row['SKS'],
                    'semester' => $row['Semester'],
                    'category' => $row['Basis Evaluasi'] ?? null
                ]
            );
            $imported++;
        }

        $this->info("Total Source: $total");
        $this->info("Imported/Updated: $imported");
    }

    private function importPloClo()
    {
        $this->info("\n--- IMPORTING PLO & CLO ---");
        $data = $this->getJson('plo_clo.json');
        
        $ploCount = 0;
        $cloCount = 0;
        $pivotCount = 0;

        foreach ($data as $row) {
            $ploCode = $row['PLO Kode'];
            $cloCode = $row['CPMK/CLO'];
            $cloDesc = $row['CPMK \/ CLO'] ?? $row['CPMK / CLO']; // Handle escape in python JSON
            $bloom = $row['Bloom'] ?? null;

            if ($ploCode) {
                $plo = Plo::updateOrCreate(
                    ['code' => $ploCode],
                    ['description' => 'From Mapping Data'] // No explicit PLO description provided in source
                );
                $ploCount++;
            }

            if ($cloCode) {
                $clo = Clo::updateOrCreate(
                    ['code' => $cloCode],
                    ['description' => $cloDesc, 'bloom_taxonomy' => $bloom]
                );
                $cloCount++;
            }

            // Pivot PLO-CLO
            if (isset($plo) && isset($clo)) {
                $plo->clos()->syncWithoutDetaching([$clo->id]);
                $pivotCount++;
            }
        }

        $this->info("Processed Rows: " . count($data));
        $this->info("PLO Upserted: " . Plo::count());
        $this->info("CLO Upserted: " . Clo::count());
    }

    private function mapCourseClo()
    {
        $this->info("\n--- CONTROLLED COURSE-CLO MAPPING ---");
        $data = $this->getJson('mapping.json');

        $exact = 0;
        $unresolved = 0;
        $ambiguous = 0;

        // Fetch all courses for lookup
        $courses = Course::all();

        foreach ($data as $row) {
            $cloCode = $row['CPMK/CLO'];
            $rawName = $row['Mata Kuliah'];
            
            // Controlled Lookup Rule: Trim and replace '*'
            $normalizedName = trim(str_replace('*', '', $rawName));
            
            // Find candidates
            $candidates = $courses->filter(function($c) use ($normalizedName) {
                return strtolower(trim($c->course_name)) === strtolower($normalizedName);
            });

            if ($candidates->count() === 1) {
                $course = $candidates->first();
                $clo = Clo::where('code', $cloCode)->first();
                if ($clo) {
                    $course->clos()->syncWithoutDetaching([$clo->id]);
                    $exact++;
                }
            } elseif ($candidates->count() > 1) {
                $ambiguous++;
                $this->warn("AMBIGUOUS: raw '$rawName', normalized '$normalizedName'");
            } else {
                $unresolved++;
                $this->warn("UNRESOLVED: raw '$rawName', normalized '$normalizedName' - No match found.");
            }
        }

        $this->info("Total Mappings Checked: " . count($data));
        $this->info("Exact Matches: $exact");
        $this->info("Unresolved Matches: $unresolved");
        $this->info("Ambiguous Matches: $ambiguous");
    }

    private function auditCpmk()
    {
        $this->info("\n--- CPMK AUDIT LOG ---");
        $data = $this->getJson('cpmk.json');
        
        $missingKodeMk = 0;
        foreach ($data as $row) {
            if (empty($row['Kode MK'])) {
                $missingKodeMk++;
            }
        }
        $this->info("Total Source Records in CPMK: " . count($data));
        $this->info("Missing Kode MK: $missingKodeMk (These records cannot be automatically integrated)");
    }
}
