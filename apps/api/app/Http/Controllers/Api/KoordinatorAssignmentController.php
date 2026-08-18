<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KoordinatorAssignment;
use App\Http\Resources\KoordinatorAssignmentResource;
use App\Http\Requests\StoreKoordinatorAssignmentRequest;
use Illuminate\Http\Request;

class KoordinatorAssignmentController extends Controller
{
    public function index(Request $request)
    {
        $query = KoordinatorAssignment::with(['course', 'semester', 'user']);
        
        // Filter by user context if needed, but for now we list all for SUPER_ADMIN or self for others
        // (Assuming policy limits who can call index, we'll just return all paginated)
        return KoordinatorAssignmentResource::collection($query->paginate($request->get('per_page', 15)));
    }

    public function store(StoreKoordinatorAssignmentRequest $request)
    {
        // Additional business logic for unique constraint handling
        $exists = KoordinatorAssignment::where('course_id', $request->course_id)
            ->where('semester_id', $request->semester_id)
            ->first();

        if ($exists) {
            return response()->json([
                'message' => 'Assignment already exists for this course and semester.'
            ], 409);
        }

        // Strictly checking if user has KOORDINATOR role
        $user = \App\Models\User::find($request->user_id);
        if ($user->role !== 'KOORDINATOR') {
            return response()->json([
                'message' => 'The assigned user does not have KOORDINATOR role.'
            ], 422);
        }

        $assignment = KoordinatorAssignment::create($request->validated());

        return new KoordinatorAssignmentResource($assignment->load(['course', 'semester', 'user']));
    }

    public function destroy($id)
    {
        $assignment = KoordinatorAssignment::findOrFail($id);
        
        $this->authorize('deleteKoordinatorAssignment');

        $assignment->delete();

        return response()->json(null, 204);
    }
}
