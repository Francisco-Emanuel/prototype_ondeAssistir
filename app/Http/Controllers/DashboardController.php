<?php

namespace App\Http\Controllers;

use App\Models\Title;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Busca os títulos com as plataformas, ordenados pelos mais recentes, paginando de 10 em 10
        $titles = Title::with('platforms')->latest()->paginate(10);

        return Inertia::render('dashboard', [
            'titles' => $titles
        ]);
    }

    public function destroy($id)
    {
        $title = Title::findOrFail($id);
        
        // Remove as relações com as plataformas na tabela pivô primeiro
        $title->platforms()->detach();
        
        // Exclui o título
        $title->delete();

        // Volta para a página atual do painel
        return redirect()->back();
    }
}