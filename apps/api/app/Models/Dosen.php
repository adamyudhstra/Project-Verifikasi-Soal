<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Dosen extends Model
{
    use HasFactory;

    protected $fillable = ['kode_dosen', 'nama', 'jfa', 'no_hp'];

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
