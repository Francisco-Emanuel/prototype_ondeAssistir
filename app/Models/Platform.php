<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Platform extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function titles(): BelongsToMany
    {
        return $this->belongsToMany(Title::class)
                    ->withPivot('monetization_type', 'url')
                    ->withTimestamps();
    }
}