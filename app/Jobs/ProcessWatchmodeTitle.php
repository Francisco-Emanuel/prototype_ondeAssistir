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

class ProcessWatchmodeTitle implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Se a API cair ou der timeout, o Laravel tenta de novo até 3 vezes
    public $tries = 3;

    public function __construct(public string $externalApiId)
    {
    }

    public function handle(): void
    {
        $apiKey = env('WATCHMODE_API_KEY');
        
        $response = Http::get("https://api.watchmode.com/v1/title/{$this->externalApiId}/details/", [
            'apiKey' => $apiKey,
            'append_to_response' => 'sources',
            'regions' => 'BR'
        ]);

        if ($response->failed()) {
            Log::error("Watchmode API falhou para o ID: {$this->externalApiId}");
            return;
        }

        $data =$response->json();

        // 1. Grava ou Atualiza o Título
        $title = Title::updateOrCreate(
            ['external_api_id' => $data['id']],
            [
                'name' => $data['title'],
                'poster_url' => $data['poster'] ?? null,
            ]
        );

        // Se não houver fontes de streaming, para por aqui
        if (empty($data['sources'])) {
            return;
        }

        $syncData = [];

        foreach ($data['sources'] as $source) {             // 2. Grava ou Atualiza a Plataforma (Ex: Netflix)
            $platform = Platform::updateOrCreate(
                ['name' => $source['name']]
            );

            $type = in_array($source['type'], ['sub', 'free', 'rent', 'buy']) ?$source['type'] : 'sub';

            // 3. Prepara os dados extras para a tabela pivô
            $syncData[$platform->id] = [
                'monetization_type' => $type,
                'url' => $source['web_url'] ?? '',
            ];
        }

        // 4. Salva a relação entre o Filme e a Plataforma
        $title->platforms()->sync($syncData);
    }
}