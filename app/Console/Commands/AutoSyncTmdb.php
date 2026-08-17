<?php

namespace App\Console\Commands;

use App\Jobs\ProcessTmdbTitle;
use App\Models\Title;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class AutoSyncTmdb extends Command
{
    // Nome do comando no terminal
    protected $signature = 'tmdb:auto-sync';
    protected $description = 'Busca tendências no TMDB e atualiza o banco de forma inteligente economizando processamento.';

    public function handle()
    {
        $this->info('Buscando títulos em alta (Trending) na semana...');
        $apiKey = env('TMDB_API_KEY');

        // Bate no endpoint de tendências da semana (Traz o que tá hypado no momento)
        $response = Http::get("https://api.themoviedb.org/3/trending/all/week", [
            'api_key' => $apiKey,
            'language' => 'pt-BR'
        ]);

        if ($response->failed()) {
            $this->error('Falha ao conectar com a API do TMDB.');
            return;
        }

        // Filtra para pegar apenas filmes e séries
        $results = collect($response->json('results'))->filter(function ($item) {
            return in_array($item['media_type'], ['movie', 'tv']);
        });

        $despachados = 0;
        $ignorados = 0;

        foreach ($results as $item) {
            $apiId = 'tmdb_' . $item['id'];
            
            // Procura o título no nosso banco local
            $title = Title::where('external_api_id', $apiId)->first();

            // A MÁGICA DA ECONOMIA AQUI:
            // Só despachamos para a fila se o título NÃO existir no nosso banco,
            // OU se existir, mas a última atualização foi há 7 dias ou mais.
            if (!$title || $title->updated_at->diffInDays(Carbon::now()) >= 7) {
                
                ProcessTmdbTitle::dispatch($item['id'], $item['media_type']);
                $despachados++;
                $this->line("-> Despachado: {$item['id']} ({$item['media_type']})");
                
            } else {
                $ignorados++;
            }
        }

        $this->newLine();
        $this->info("✅ Processo concluído!");
        $this->info("🚀 $despachados títulos enviados para a fila.");
        $this->info("🛡️ $ignorados ignorados (já atualizados recentemente).");
    }
}