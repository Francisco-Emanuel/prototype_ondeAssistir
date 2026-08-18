<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use App\Models\Title;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Pool; // <-- Importação necessária para o Pooling
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $query = Title::with('platforms')->latest();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
            $titles = $query->get();

            // Se o nosso banco não achou nada, acionamos o TMDB silenciosamente
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
            $titles = $query->take(20)->get();
        }

        return Inertia::render('welcome', [
            'titles' => $titles,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Busca os resultados do TMDB e salva no MySQL instantaneamente usando concorrência
     */
    private function searchAndSyncFromTmdb(string $searchQuery)
    {
        $apiKey = env('TMDB_API_KEY');
        
        // 1. Busca os termos gerais no TMDB
        $response = Http::get("https://api.themoviedb.org/3/search/multi", [
            'api_key' => $apiKey,
            'query' => $searchQuery,
            'language' => 'pt-BR',
            'page' => 1
        ]);

        if ($response->failed()) return;

        // Pega apenas filmes e séries, e limita aos 3 primeiros
        $results = collect($response->json('results'))
            ->filter(fn($item) => in_array($item['media_type'], ['movie', 'tv']))
            ->take(3);

        if ($results->isEmpty()) return;

        // 2. BUSCA PARALELA (Concorrente): Dispara todas as requisições ao mesmo tempo
        $responses = Http::pool(function (Pool $pool) use ($results, $apiKey) {
            foreach ($results as $item) {
                // Usamos o formato "tipo_id" como chave para sabermos quem é quem na resposta
                $key = "{$item['media_type']}_{$item['id']}";
                
                $pool->as($key)->get("https://api.themoviedb.org/3/{$item['media_type']}/{$item['id']}", [
                    'api_key' => $apiKey,
                    'append_to_response' => 'watch/providers,credits',
                    'language' => 'pt-BR'
                ]);
            }
        });

        // 3. Processa as respostas que chegaram juntas
        foreach ($responses as $key => $response) {
            // Se uma das 3 requisições falhou, ignoramos ela e salvamos as outras
            if ($response instanceof \Exception || $response->failed()) continue;

            $data = $response->json();
            
            // Extrai o tipo de mídia e o ID original da chave que criamos
            [$mediaType, $tmdbId] = explode('_', $key);
            
            $titleName = $mediaType === 'movie' ? ($data['title'] ?? '') : ($data['name'] ?? '');
            if (empty($titleName)) continue;

            $posterUrl = !empty($data['poster_path']) ? "https://image.tmdb.org/t/p/w500{$data['poster_path']}" : null;
            $synopsis = $data['overview'] ?? null;
            $rating = $data['vote_average'] ?? null;
            $cast = isset($data['credits']['cast']) ? collect($data['credits']['cast'])->take(5)->pluck('name')->join(', ') : null;

            $rawDate = $mediaType === 'movie' ? ($data['release_date'] ?? null) : ($data['first_air_date'] ?? null);
            $releaseDate = empty($rawDate) ? null : $rawDate;

            // Salva o título no nosso banco
            $title = Title::updateOrCreate(
                ['external_api_id' => 'tmdb_' . $data['id']],
                [
                    'name' => $titleName,
                    'poster_url' => $posterUrl,
                    'synopsis' => $synopsis,
                    'cast' => $cast,
                    'rating' => $rating,
                    'release_date' => $releaseDate,
                ]
            );

            // Relaciona as plataformas de streaming
            $providersData = $data['watch/providers']['results']['BR'] ?? null;
            if (!$providersData) continue;

            $syncData = [];
            $linkDireto = $providersData['link'] ?? '';
            $monetizationMap = ['flatrate' => 'sub', 'free' => 'free', 'rent' => 'rent', 'buy' => 'buy'];

            foreach ($monetizationMap as $tmdbType => $ourType) {
                if (isset($providersData[$tmdbType])) {
                    foreach ($providersData[$tmdbType] as $provider) {
                        $platform = Platform::updateOrCreate(['name' => $provider['provider_name']]);
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
}