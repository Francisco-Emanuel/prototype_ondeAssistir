<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use App\Models\Title;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');$query = Title::with('platforms')->latest();

        if ($search) {
            $query->where('name', 'like', "\%{$search}%");
            $titles =$query->get();

            // Se o nosso banco não achou nada (ou achou pouco), acionamos o TMDB silenciosamente
            if ($titles->isEmpty()) {
                $this->searchAndSyncFromTmdb($search);
                
                // Refaz a busca local agora que o banco foi alimentado
                $titles = Title::with('platforms')
                    ->where('name', 'like', "%{$search}%")
                    ->latest()
                    ->get();
            }
        } else {
            // Se não houver pesquisa, mostra os 20 últimos adicionados
            $titles =$query->take(20)->get();
        }

        return Inertia::render('welcome', [
            'titles' => $titles,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Busca os 3 principais resultados do TMDB e salva no MySQL instantaneamente
     */
    private function searchAndSyncFromTmdb(string $searchQuery)
    {
        $apiKey = env('TMDB_API_KEY');                  // 1. Busca os termos gerais no TMDB
        $response = Http::get("https://api.themoviedb.org/3/search/multi", [
            'api_key' => $apiKey,
            'query' => $searchQuery,
            'language' => 'pt-BR',
            'page' => 1
        ]);

        if ($response->failed()) return;

        // Pega apenas filmes e séries, e limita aos 3 primeiros para a resposta ser rápida pro usuário
        $results = collect($response->json('results'))
            ->filter(fn($item) => in_array($item['media_type'], ['movie', 'tv']))
            ->take(3);

        foreach ($results as $item) {             // 2. Para cada um, busca onde assistir e salva no banco
            $detailResponse = Http::get("https://api.themoviedb.org/3/{$item['media_type']}/{$item['id']}", [
                'api_key' => $apiKey,
                'append_to_response' => 'watch/providers',
                'language' => 'pt-BR'
            ]);

            if ($detailResponse->failed()) continue;

            $data =$detailResponse->json();
            $titleName =$item['media_type'] === 'movie' ? ($data['title'] ?? '') : ($data['name'] ?? '');
            
            if (empty($titleName)) continue;

            $posterUrl = !empty($data['poster_path']) ? "https://image.tmdb.org/t/p/w500{$data['poster_path']}" : null;

            $title = Title::updateOrCreate(
                ['external_api_id' => 'tmdb_' . $data['id']],
                ['name' => $titleName, 'poster_url' =>$posterUrl]
            );

            $providersData =$data['watch/providers']['results']['BR'] ?? null;
            if (!$providersData) continue;

            $syncData = [];$linkDireto = $providersData['link'] ?? '';$monetizationMap = ['flatrate' => 'sub', 'free' => 'free', 'rent' => 'rent', 'buy' => 'buy'];

            foreach ($monetizationMap as $tmdbType =>$ourType) {
                if (isset($providersData[$tmdbType])) {
                    foreach ($providersData[$tmdbType] as$provider) {
                        $platform = Platform::updateOrCreate(['name' =>$provider['provider_name']]);
                        $syncData[$platform->id] = [
                            'monetization_type' => $ourType,
                            'url' => $linkDireto,
                        ];
                    }
                }
            }

            $title->platforms()->sync($syncData);
        }
    }
    public function show($id)
    {
        // Busca o título pelo ID e já traz as plataformas
        $title = Title::with('platforms')->findOrFail($id);

        return Inertia::render('title', [
            'title' => $title
        ]);
    }
}