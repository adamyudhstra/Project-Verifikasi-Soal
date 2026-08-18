<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penugasan_verifikators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('semester_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('ACTIVE');
            $table->timestamps();

            $table->unique(['semester_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penugasan_verifikators');
    }
};
