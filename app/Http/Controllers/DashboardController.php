<?php

namespace App\Http\Controllers;

use App\Models\Title;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Busca os títulos com as plataformas, ordenados pelos mais recentes
        $titles = Title::with('platforms')->latest()->paginate(10);

        return Inertia::render('dashboard', [
            'titles' => $titles
        ]);
    }

    public function sync()
    {
        // Dispara o nosso comando inteligente do TMDB silenciosamente
        Artisan::call('tmdb:auto-sync');

        return redirect()->back();
    }

    public function destroy($id)
    {
        $title = Title::findOrFail($id);
        
        // Remove as relações com as plataformas na tabela pivô primeiro
        $title->platforms()->detach();
        
        // Exclui o título
        $title->delete();

        return redirect()->back();
    }
}