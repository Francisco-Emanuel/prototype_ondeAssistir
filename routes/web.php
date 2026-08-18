<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\DashboardController;
use App\Http\Middleware\CheckAdmin;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

// Rotas Públicas
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/titulo/{id}', [HomeController::class, 'show'])->name('title.show');

// Rotas Restritas (Administrador) - Agora protegidas pelo nosso Middleware!
Route::middleware(['auth', 'verified', CheckAdmin::class])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/dashboard/sync', [DashboardController::class, 'sync'])->name('dashboard.sync');
    Route::delete('/titulo/{id}', [DashboardController::class, 'destroy'])->name('title.destroy');
});

require __DIR__.'/settings.php';
