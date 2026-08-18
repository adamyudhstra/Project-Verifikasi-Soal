<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('soal_clo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('soal_id')->constrained()->cascadeOnDelete();
            $table->foreignId('clo_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['soal_id', 'clo_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('soal_clo');
    }
};
