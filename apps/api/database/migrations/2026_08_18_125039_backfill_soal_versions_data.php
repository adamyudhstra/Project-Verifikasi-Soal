<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $soals = DB::table('soals')->get();

        foreach ($soals as $soal) {
            $versionId = DB::table('soal_versions')->insertGetId([
                'soal_id' => $soal->id,
                'version' => $soal->version ?? 1,
                'file_path' => $soal->file_path,
                'status' => $soal->status ?? 'SUBMITTED',
                'uploader_id' => $soal->uploader_id,
                'created_at' => $soal->created_at,
                'updated_at' => $soal->updated_at,
            ]);

            DB::table('soals')->where('id', $soal->id)->update([
                'current_version_id' => $versionId,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('soals')->update(['current_version_id' => null]);
        DB::table('soal_versions')->truncate();
    }
};
