<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Plo extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'description'];

    public function clos()
    {
        return $this->belongsToMany(Clo::class, 'clo_plo');
    }
}
