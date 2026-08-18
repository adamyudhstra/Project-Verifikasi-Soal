<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('verifikasis', function (Blueprint $table) {
            $table->foreignId('soal_version_id')->nullable()->constrained('soal_versions')->onDelete('cascade');
        });

        $verifikasis = DB::table('verifikasis')->get();
        foreach ($verifikasis as $verif) {
            $version = DB::table('soal_versions')
                ->where('soal_id', $verif->soal_id)
                ->orderByDesc('version')
                ->first();
            
            if ($version) {
                DB::table('verifikasis')->where('id', $verif->id)->update([
                    'soal_version_id' => $version->id
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('verifikasis', function (Blueprint $table) {
            $table->dropForeign(['soal_version_id']);
            $table->dropColumn('soal_version_id');
        });
    }
};
