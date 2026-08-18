<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Verifikasi extends Model
{
    use HasFactory;

    protected $fillable = ['soal_version_id', 'verifikator_id', 'action', 'catatan'];

    protected $casts = [
        'action' => \App\Enums\VerifikasiAction::class,
    ];

    public function soalVersion()
    {
        return $this->belongsTo(SoalVersion::class);
    }

    public function verifikator()
    {
        return $this->belongsTo(User::class, 'verifikator_id');
    }
}
