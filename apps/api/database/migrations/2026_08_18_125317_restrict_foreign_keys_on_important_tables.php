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
        Schema::table('koordinator_assignments', function (Blueprint $table) {
            $table->dropForeign(['course_id']);
            $table->dropForeign(['semester_id']);
            $table->foreign('course_id')->references('id')->on('courses')->restrictOnDelete();
            $table->foreign('semester_id')->references('id')->on('semesters')->restrictOnDelete();
        });

        Schema::table('penugasan_verifikators', function (Blueprint $table) {
            $table->dropForeign(['semester_id']);
            $table->foreign('semester_id')->references('id')->on('semesters')->restrictOnDelete();
        });
        
        Schema::table('soal_clo', function (Blueprint $table) {
            $table->dropForeign(['soal_id']);
            $table->foreign('soal_id')->references('id')->on('soals')->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('koordinator_assignments', function (Blueprint $table) {
            $table->dropForeign(['course_id']);
            $table->dropForeign(['semester_id']);
            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            $table->foreign('semester_id')->references('id')->on('semesters')->cascadeOnDelete();
        });

        Schema::table('penugasan_verifikators', function (Blueprint $table) {
            $table->dropForeign(['semester_id']);
            $table->foreign('semester_id')->references('id')->on('semesters')->cascadeOnDelete();
        });
        
        Schema::table('soal_clo', function (Blueprint $table) {
            $table->dropForeign(['soal_id']);
            $table->foreign('soal_id')->references('id')->on('soals')->cascadeOnDelete();
        });
    }
};
