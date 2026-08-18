<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verifica se o usuário está logado e se possui o e-mail do dono do projeto
        if ($request->user() && $request->user()->email === 'seu@email.com') { // <-- COLOQUE SEU E-MAIL AQUI
            return $next($request);
        }

        // Se tentar bancar o espertinho, toma um Erro 403 (Acesso Negado)
        abort(403, 'Acesso negado. Esta área é restrita aos administradores do sistema.');
    }
}