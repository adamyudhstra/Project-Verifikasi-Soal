<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Semester;
use App\Http\Resources\SemesterResource;

class SemesterController extends Controller
{
    public function index()
    {
        return SemesterResource::collection(Semester::all());
    }

    public function show($id)
    {
        return new SemesterResource(Semester::findOrFail($id));
    }
}
