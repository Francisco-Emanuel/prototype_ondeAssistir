<?php

namespace App\Console\Commands;

use App\Jobs\ProcessTmdbTitle;
use Illuminate\Console\Command;

class SyncTmdb extends Command
{
    protected $signature = 'tmdb:sync';
    protected $description = 'Despacha Jobs para sincronizar títulos do TMDB com suporte ao JustWatch';

    public function handle()
    {
        $this->info('Iniciando integração de alta performance com o TMDB...');

        // IDs reais do TMDB (Filmes)
        $titulosParaTestar = [
            155, // O Cavaleiro das Trevas
            550, // Clube da Luta
            122, // O Senhor dos Anéis
            27205 // A Origem (Inception)
        ];

        foreach ($titulosParaTestar as $tmdbId) {
            // Despachamos avisando que são filmes ('movie')
            ProcessTmdbTitle::dispatch($tmdbId, 'movie');
            $this->line("Job TMDB enviado para a fila: ID {$tmdbId}");
        }

        $this->newLine();
        $this->info('Todos os Jobs TMDB foram despachados!');
    }
}