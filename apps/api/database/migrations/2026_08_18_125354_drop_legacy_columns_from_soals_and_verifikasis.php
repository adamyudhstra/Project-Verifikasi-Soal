<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('soals', function (Blueprint $table) {
            $table->dropColumn(['file_path', 'version', 'status', 'catatan']);
        });

        Schema::table('verifikasis', function (Blueprint $table) {
            $table->dropForeign(['soal_id']);
            $table->dropColumn('soal_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('soals', function (Blueprint $table) {
            $table->string('file_path')->nullable();
            $table->integer('version')->default(1);
            $table->string('status')->nullable();
            $table->text('catatan')->nullable();
        });

        Schema::table('verifikasis', function (Blueprint $table) {
            $table->foreignId('soal_id')->nullable()->constrained('soals')->restrictOnDelete();
        });
    }
};
