<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('titles', function (Blueprint $table) {
            $table->id();
            $table->string('external_api_id')->unique()->index();
            $table->string('name');
            $table->string('poster_url')->nullable();
            $table->text('synopsis')->nullable();
            $table->text('cast')->nullable(); // Guardaremos os 5 atores principais como texto
            $table->decimal('rating', 3, 1)->nullable(); // Nota de 0.0 a 10.0
            $table->date('release_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('titles');
    }
};
