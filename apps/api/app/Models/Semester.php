<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Semester extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'start_date', 'end_date', 'is_active'];

    public function koordinatorAssignments()
    {
        return $this->hasMany(KoordinatorAssignment::class);
    }

    public function penugasanVerifikators()
    {
        return $this->hasMany(PenugasanVerifikator::class);
    }

    public function soals()
    {
        return $this->hasMany(Soal::class);
    }
}
