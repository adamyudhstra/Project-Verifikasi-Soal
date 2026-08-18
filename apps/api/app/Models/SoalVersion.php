<?php

namespace App\Models;

use App\Enums\SoalStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Exception;

class SoalVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'soal_id',
        'version',
        'file_path',
        'status',
        'uploader_id',
    ];

    protected $casts = [
        'status' => SoalStatus::class,
    ];

    protected static function booted()
    {
        static::updating(function ($soalVersion) {
            if ($soalVersion->isDirty(['soal_id', 'version', 'file_path', 'uploader_id'])) {
                throw new Exception('Cannot update immutable fields.');
            }
        });
    }

    public function soal()
    {
        return $this->belongsTo(Soal::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }

    public function verifikasis()
    {
        return $this->hasMany(Verifikasi::class);
    }
}
