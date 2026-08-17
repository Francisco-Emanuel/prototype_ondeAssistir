import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

export default function Login({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen relative bg-[#080B12] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Entrar" />

            {/* Fundo Cinemático (Orbes de Luz Desfocados) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
                <div className="absolute bottom-[20%] right-[30%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
            </div>

            {/* Card Glassmorphism */}
            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 sm:p-12 shadow-2xl">
                
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                        Bem-vindo de volta
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                        Acesse seu painel administrativo.
                    </p>
                </div>

                {status && <div className="mb-6 font-medium text-sm text-emerald-400 text-center">{status}</div>}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="seu@email.com"
                        />
                        {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="password" className="block text-sm font-bold text-gray-300 tracking-wide uppercase">Senha</label>
                            <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                Esqueceu a senha?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="remember"
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-white/10 bg-black/30 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900 w-4 h-4 transition-colors"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-400 select-none cursor-pointer">
                            Lembrar de mim
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all disabled:opacity-50 tracking-wider uppercase"
                    >
                        {processing ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Ainda não tem conta?{' '}
                    <Link href="/register" className="font-bold text-white hover:text-indigo-400 transition-colors">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}

// Ignora o layout padrão
Login.layout = (page: React.ReactNode) => <>{page}</>;