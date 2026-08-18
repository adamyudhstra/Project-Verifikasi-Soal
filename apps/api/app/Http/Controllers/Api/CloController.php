<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Clo;
use App\Http\Resources\CloResource;
use Illuminate\Http\Request;

class CloController extends Controller
{
    public function index(Request $request)
    {
        $query = Clo::query();
        if ($request->has('with_plos')) {
            $query->with('plos');
        }
        return CloResource::collection($query->paginate($request->get('per_page', 15)));
    }

    public function show($id)
    {
        $clo = Clo::with('plos')->findOrFail($id);
        return new CloResource($clo);
    }
}
