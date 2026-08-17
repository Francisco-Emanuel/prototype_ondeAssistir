<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\DashboardController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/titulo/{id}', [HomeController::class, 'show'])->name('title.show');

// Rotas Restritas (Administrador)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::delete('/titulo/{id}', [DashboardController::class, 'destroy'])->name('title.destroy');
});

require __DIR__.'/settings.php';
