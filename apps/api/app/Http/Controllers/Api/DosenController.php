<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Http\Resources\DosenResource;
use Illuminate\Http\Request;

class DosenController extends Controller
{
    public function index(Request $request)
    {
        $query = Dosen::query();
        if ($request->has('with_user')) {
            $query->with('user');
        }
        return DosenResource::collection($query->paginate($request->get('per_page', 15)));
    }

    public function show($id)
    {
        $dosen = Dosen::with('user')->findOrFail($id);
        return new DosenResource($dosen);
    }
}
