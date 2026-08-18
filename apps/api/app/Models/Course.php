<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['course_code', 'course_name', 'credits', 'semester', 'category'];

    public function clos()
    {
        return $this->belongsToMany(Clo::class, 'course_clo');
    }

    public function koordinatorAssignments()
    {
        return $this->hasMany(KoordinatorAssignment::class);
    }

    public function soals()
    {
        return $this->hasMany(Soal::class);
    }
}
