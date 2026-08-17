<?php

namespace App\Console\Commands;

use App\Jobs\ProcessWatchmodeTitle;
use Illuminate\Console\Command;

class SyncWatchmode extends Command
{
    protected $signature = 'watchmode:sync';
    protected $description = 'Despacha os Jobs para sincronizar títulos da Watchmode';

    public function handle()
    {
        $this->info('Iniciando o despachante de sincronização...');

        // IDs reais do Watchmode para testarmos o MVP
        $titulosParaTestar = [
            '3173903', // Batman
            '345534',  // Game of Thrones
            '1161242'  // The Office
        ];

        foreach ($titulosParaTestar as $externalId) {
            ProcessWatchmodeTitle::dispatch($externalId);
            $this->line("Job enviado para a fila: Título ID {$externalId}");
        }

        $this->newLine();
        $this->info('Todos os Jobs foram despachados com sucesso!');
    }
}