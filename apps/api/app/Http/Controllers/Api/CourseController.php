<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Http\Resources\CourseResource;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::query();
        if ($request->has('with_clos')) {
            $query->with('clos.plos');
        }
        return CourseResource::collection($query->paginate($request->get('per_page', 15)));
    }

    public function show($id)
    {
        $course = Course::with('clos.plos')->findOrFail($id);
        return new CourseResource($course);
    }
}
