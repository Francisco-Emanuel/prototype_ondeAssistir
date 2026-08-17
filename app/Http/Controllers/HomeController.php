<?php

namespace App\Http\Controllers;

use App\Models\Title;
use Inertia\Inertia;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        // Busca os últimos títulos adicionados no banco de dados e já traz as plataformas junto (Eager Loading)
        $titles = Title::with('platforms')->latest()->get();

        // Envia a variável $titles para o componente React localizado em resources/js/pages/welcome.tsx
        return Inertia::render('welcome', [
            'titles' => $titles
        ]);
    }
}