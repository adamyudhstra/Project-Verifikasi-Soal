<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DosenController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\SemesterController;
use App\Http\Controllers\Api\PloController;
use App\Http\Controllers\Api\CloController;
use App\Http\Controllers\Api\KoordinatorAssignmentController;
use App\Http\Controllers\Api\PenugasanVerifikatorController;
use App\Http\Controllers\Api\SoalController;
use App\Http\Controllers\Api\AuthController;

Route::post('/v1/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Read-only Master Data
    Route::apiResource('dosens', DosenController::class)->only(['index', 'show']);
    Route::apiResource('courses', CourseController::class)->only(['index', 'show']);
    Route::apiResource('semesters', SemesterController::class)->only(['index', 'show']);
    Route::apiResource('plos', PloController::class)->only(['index', 'show']);
    Route::apiResource('clos', CloController::class)->only(['index', 'show']);

    // Assignments
    Route::apiResource('koordinator-assignments', KoordinatorAssignmentController::class)->only(['index', 'store', 'destroy']);
    Route::apiResource('penugasan-verifikators', PenugasanVerifikatorController::class)->only(['index', 'store', 'destroy']);

    // Soal / Verification
    Route::get('reports/berita-acara', [SoalController::class, 'beritaAcara']);
    Route::get('soals/template', [SoalController::class, 'template']);
    Route::get('soals/{id}/download', [SoalController::class, 'download']);
    Route::post('soals/{id}/verify', [SoalController::class, 'verify']);
    Route::apiResource('soals', SoalController::class)->only(['index', 'store', 'show']);
});
