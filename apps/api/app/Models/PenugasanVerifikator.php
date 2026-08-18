<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PenugasanVerifikator extends Model
{
    use HasFactory;

    protected $fillable = ['semester_id', 'user_id', 'status'];

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
