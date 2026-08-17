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
        $response = Http::get("https://api.themoviedb.org/3/{$this->type}/{$this->tmdbId}", [
            'api_key' => $apiKey,
            'append_to_response' => 'watch/providers',
            'language' => 'pt-BR'
        ]);

        if ($response->failed()) {
            Log::error("TMDB API falhou para o ID: {$this->tmdbId}");
            return;
        }

        $data =$response->json();

        // 1. Grava ou Atualiza o Título
        // TMDB usa 'title' para filmes e 'name' para séries
        $titleName = $this->type === 'movie' ?$data['title'] : $data['name'];$posterUrl = $data['poster_path'] ? "https://image.tmdb.org/t/p/w500{$data['poster_path']}" : null;

        $title = Title::updateOrCreate(
            ['external_api_id' => 'tmdb_' . $data['id']], // Prefixo para não chocar com o Watchmode
            [
                'name' => $titleName,
                'poster_url' => $posterUrl,
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