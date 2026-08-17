<?php

namespace App\Jobs;

use App\Models\Platform;
use App\Models\Title;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProcessTmdbTitle implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    // Adicionamos o 'type' porque o TMDB separa Filmes (movie) de Séries (tv)
    public function __construct(public string $tmdbId, public string$type = 'movie')
    {
    }

    public function handle(): void
    {
        $apiKey = env('TMDB_API_KEY');

        // Bate na API do TMDB pedindo detalhes em PT-BR e incluindo os provedores de streaming
        // 1. Pede também os 'credits' (elenco)
        $response = Http::get("https://api.themoviedb.org/3/{$this->type}/{$this->tmdbId}", [
            'api_key' => $apiKey,
            'append_to_response' => 'watch/providers,credits',
            'language' => 'pt-BR'
        ]);

        if ($response->failed()) return;

        $data =$response->json();

        $titleName = $this->type === 'movie' ? ($data['title'] ?? '') : ($data['name'] ?? '');$posterUrl = !empty($data['poster_path']) ? "https://image.tmdb.org/t/p/w500{$data['poster_path']}" : null;
        
        // Extrai os novos dados (mantenha os que já existem)
        $synopsis = $data['overview'] ?? null;
        $rating = $data['vote_average'] ?? null;
        $cast = isset($data['credits']['cast']) ? collect($data['credits']['cast'])->take(5)->pluck('name')->join(', ') : null;
        
        // Pega a data dependendo se é filme ou série
        $rawDate = $this->type === 'movie' ? ($data['release_date'] ?? null) : ($data['first_air_date'] ?? null);
        $releaseDate = empty($rawDate) ? null : $rawDate;

        // Salva no banco
        $title = Title::updateOrCreate(
            ['external_api_id' => 'tmdb_' . $data['id']],
            [
                'name' => $titleName,
                'poster_url' => $posterUrl,
                'synopsis' => $synopsis,
                'cast' => $cast,
                'rating' => $rating,
                'release_date' => $releaseDate, // <- Passando a data para o banco
            ]
        );

        // 2. Extrai os provedores de streaming apenas do Brasil (BR)
        $providersData =$data['watch/providers']['results']['BR'] ?? null;
        
        if (!$providersData) {
            return; // Se não estiver disponível em lugar nenhum no BR, paramos aqui.
        }

        $syncData = [];
        $linkDireto =$providersData['link'] ?? ''; // O TMDB fornece um link unificado do JustWatch

        // 3. Mapeia como o TMDB chama a monetização para como nós salvamos no MySQL
        $monetizationMap = [
            'flatrate' => 'sub',
            'free' => 'free',
            'rent' => 'rent',
            'buy' => 'buy'
        ];

        // 4. Varre os provedores e prepara os dados
        foreach ($monetizationMap as $tmdbType =>$ourType) {
            if (isset($providersData[$tmdbType])) {
                foreach ($providersData[$tmdbType] as $provider) {$platform = Platform::updateOrCreate(
                        ['name' => $provider['provider_name']]
                    );

                    $syncData[$platform->id] = [
                        'monetization_type' => $ourType,
                        'url' => $linkDireto,
                    ];
                }
            }
        }

        // 5. Salva na Tabela Pivô
        $title->platforms()->sync($syncData);
    }
}