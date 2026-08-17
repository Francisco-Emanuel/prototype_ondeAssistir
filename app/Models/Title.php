<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Title extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_api_id',
        'name',
        'poster_url',
        'synopsis',
        'cast',
        'rating',
        'release_date',
    ];

    public function platforms(): BelongsToMany
    {
        return $this->belongsToMany(Platform::class)
                    ->withPivot('monetization_type', 'url')
                    ->withTimestamps();
    }
}