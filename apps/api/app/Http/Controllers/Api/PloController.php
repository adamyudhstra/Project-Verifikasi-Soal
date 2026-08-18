<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plo;
use App\Http\Resources\PloResource;
use Illuminate\Http\Request;

class PloController extends Controller
{
    public function index(Request $request)
    {
        return PloResource::collection(Plo::paginate($request->get('per_page', 15)));
    }

    public function show($id)
    {
        return new PloResource(Plo::findOrFail($id));
    }
}
