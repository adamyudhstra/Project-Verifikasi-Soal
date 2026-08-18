<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PenugasanVerifikator;
use App\Http\Resources\PenugasanVerifikatorResource;
use App\Http\Requests\StorePenugasanVerifikatorRequest;
use Illuminate\Http\Request;

class PenugasanVerifikatorController extends Controller
{
    public function index(Request $request)
    {
        $query = PenugasanVerifikator::with(['semester', 'user']);
        return PenugasanVerifikatorResource::collection($query->paginate($request->get('per_page', 15)));
    }

    public function store(StorePenugasanVerifikatorRequest $request)
    {
        // Unique constraint check
        $exists = PenugasanVerifikator::where('semester_id', $request->semester_id)
            ->where('user_id', $request->user_id)
            ->first();

        if ($exists) {
            return response()->json([
                'message' => 'Verifikator is already assigned for this semester.'
            ], 409);
        }

        // Check VERIFIKATOR role
        $user = \App\Models\User::find($request->user_id);
        if ($user->role !== 'VERIFIKATOR') {
            return response()->json([
                'message' => 'The assigned user does not have VERIFIKATOR role.'
            ], 422);
        }

        $assignment = PenugasanVerifikator::create($request->validated());

        return new PenugasanVerifikatorResource($assignment->load(['semester', 'user']));
    }

    public function destroy($id)
    {
        $assignment = PenugasanVerifikator::findOrFail($id);
        
        $this->authorize('deletePenugasanVerifikator');

        $assignment->delete();

        return response()->json(null, 204);
    }
}
