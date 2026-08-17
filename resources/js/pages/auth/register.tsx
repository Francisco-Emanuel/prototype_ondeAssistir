import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen relative bg-[#080B12] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Cadastro" />

            {/* Fundo Cinemático */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div className="absolute top-[20%] right-[30%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
                <div className="absolute bottom-[20%] left-[30%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
            </div>

            {/* Card Glassmorphism */}
            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 sm:p-12 shadow-2xl">
                
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                        Criar Conta
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                        Junte-se ao sistema de gerenciamento.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-xs font-bold text-gray-400 mb-2 tracking-wide uppercase">Nome Completo</label>
                        <input
                            id="name"
                            name="name"
                            value={data.name}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Seu nome"
                        />
                        {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-xs font-bold text-gray-400 mb-2 tracking-wide uppercase">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="seu@email.com"
                        />
                        {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-bold text-gray-400 mb-2 tracking-wide uppercase">Senha</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-xs font-bold text-gray-400 mb-2 tracking-wide uppercase">Confirmar Senha</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                        />
                        {errors.password_confirmation && <p className="mt-2 text-sm text-red-400">{errors.password_confirmation}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-3.5 px-4 mt-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all disabled:opacity-50 tracking-wider uppercase"
                    >
                        {processing ? 'Cadastrando...' : 'Criar Conta'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Já possui conta?{' '}
                    <Link href="/login" className="font-bold text-white hover:text-indigo-400 transition-colors">
                        Fazer Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

// Ignora o layout padrão
Register.layout = (page: React.ReactNode) => <>{page}</>;