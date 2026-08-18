<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Soal;
use App\Models\Verifikasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SoalController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Soal::with(['course', 'semester', 'uploader', 'verifikasis.verifikator']);

        // Role-based filtering
        if ($user->role === 'KOORDINATOR') {
            $query->where('uploader_id', $user->id);
        } else if ($user->role === 'VERIFIKATOR') {
            // Verifikator only sees soals from semesters they are assigned to verify
            $semesterIds = \App\Models\PenugasanVerifikator::where('user_id', $user->id)->pluck('semester_id');
            $query->whereIn('semester_id', $semesterIds);
            
            // Optionally, only those that are SUBMITTED or REVISION or APPROVED, but typically they see all in their semester.
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
        }

        return response()->json([
            'data' => $query->latest()->paginate($request->get('per_page', 15))
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'semester_id' => 'required|exists:semesters,id',
            'exam_category' => 'required|string',
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // max 10MB
        ]);

        $user = $request->user();

        // Check if user is Koordinator for this course and semester
        if ($user->role !== 'SUPER_ADMIN') {
            $isKoordinator = \App\Models\KoordinatorAssignment::where('course_id', $request->course_id)
                ->where('semester_id', $request->semester_id)
                ->where('user_id', $user->id)
                ->exists();

            if (!$isKoordinator) {
                return response()->json(['message' => 'You are not assigned as Koordinator for this course in this semester.'], 403);
            }
        }

        $path = $request->file('file')->store('soals', 'public');

        // Check if there's an existing soal
        $existing = Soal::where('course_id', $request->course_id)
            ->where('semester_id', $request->semester_id)
            ->where('exam_category', $request->exam_category)
            ->first();

        if ($existing) {
            // Check if it's in REVISION status. If APPROVED, they shouldn't re-upload.
            if ($existing->status === 'APPROVED') {
                return response()->json(['message' => 'Cannot upload. Soal is already APPROVED.'], 409);
            }

            // Update existing
            $existing->update([
                'file_path' => $path,
                'version' => $existing->version + 1,
                'status' => 'SUBMITTED',
                'uploader_id' => $user->id,
            ]);

            return response()->json(['data' => $existing->load(['course', 'semester', 'uploader'])]);
        }

        $soal = Soal::create([
            'course_id' => $request->course_id,
            'semester_id' => $request->semester_id,
            'uploader_id' => $user->id,
            'exam_category' => $request->exam_category,
            'file_path' => $path,
            'version' => 1,
            'status' => 'SUBMITTED',
        ]);

        return response()->json(['data' => $soal->load(['course', 'semester', 'uploader'])], 201);
    }

    public function show($id)
    {
        $soal = Soal::with(['course', 'semester', 'uploader', 'verifikasis.verifikator'])->findOrFail($id);
        return response()->json(['data' => $soal]);
    }

    public function download($id)
    {
        $soal = Soal::findOrFail($id);
        
        if (!Storage::disk('public')->exists($soal->file_path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        return Storage::disk('public')->download($soal->file_path);
    }

    public function template()
    {
        // For now, return a 404 or a dummy template URL
        return response()->json(['message' => 'Template feature not implemented yet.'], 404);
    }

    public function verify(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:APPROVED,REVISION,REJECTED',
            'notes' => 'required_if:status,REVISION,REJECTED|string|nullable',
        ]);

        $soal = Soal::findOrFail($id);
        $user = $request->user();

        // Check if user is Verifikator for this semester
        if ($user->role !== 'SUPER_ADMIN') {
            $isVerifikator = \App\Models\PenugasanVerifikator::where('semester_id', $soal->semester_id)
                ->where('user_id', $user->id)
                ->exists();

            if (!$isVerifikator) {
                return response()->json(['message' => 'You are not assigned as Verifikator for this semester.'], 403);
            }
        }

        $soal->update([
            'status' => $request->status,
            'catatan' => $request->notes,
        ]);

        Verifikasi::create([
            'soal_id' => $soal->id,
            'verifikator_id' => $user->id,
            'action' => $request->status,
            'catatan' => $request->notes,
        ]);

        return response()->json(['data' => $soal->load(['course', 'semester', 'uploader', 'verifikasis.verifikator'])]);
    }

    public function beritaAcara(Request $request)
    {
        $user = $request->user();
        // Return summary of all verified soals in a semester
        $semesterId = $request->query('semester_id');
        
        if (!$semesterId) {
            return response()->json(['message' => 'semester_id query parameter is required.'], 422);
        }

        $soals = Soal::with(['course', 'uploader'])
            ->where('semester_id', $semesterId)
            ->get();

        $summary = [
            'total' => $soals->count(),
            'approved' => $soals->where('status', 'APPROVED')->count(),
            'revision' => $soals->where('status', 'REVISION')->count(),
            'rejected' => $soals->where('status', 'REJECTED')->count(),
            'submitted' => $soals->where('status', 'SUBMITTED')->count(),
            'details' => $soals,
        ];

        return response()->json(['data' => $summary]);
    }
}
