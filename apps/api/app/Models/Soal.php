<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Soal extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'semester_id',
        'uploader_id',
        'exam_category',
        'file_path',
        'version',
        'status',
        'catatan'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }

    public function clos()
    {
        return $this->belongsToMany(Clo::class);
    }

    public function verifikasis()
    {
        return $this->hasMany(Verifikasi::class);
    }
}
