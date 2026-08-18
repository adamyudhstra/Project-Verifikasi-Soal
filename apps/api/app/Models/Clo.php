<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Clo extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'description', 'bloom_taxonomy'];

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_clo');
    }

    public function plos()
    {
        return $this->belongsToMany(Plo::class, 'clo_plo');
    }

    public function soals()
    {
        return $this->belongsToMany(Soal::class);
    }
}
