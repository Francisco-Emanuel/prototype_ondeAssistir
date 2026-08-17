import { Head, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

export default function ResetPassword({ token, email }: { token: string, email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/reset-password', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen relative bg-[#080B12] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Redefinir Senha" />

            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div className="absolute top-[20%] left-[40%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
            </div>

            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 sm:p-12 shadow-2xl">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                        Nova Senha
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                        Crie uma nova senha segura para sua conta.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-xs font-bold text-gray-400 mb-2 tracking-wide uppercase">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-gray-400 focus:outline-none transition-all cursor-not-allowed opacity-70"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            readOnly
                        />
                        {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-bold text-gray-400 mb-2 tracking-wide uppercase">Nova Senha</label>
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
                        <label htmlFor="password_confirmation" className="block text-xs font-bold text-gray-400 mb-2 tracking-wide uppercase">Confirmar Nova Senha</label>
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
                        {processing ? 'Redefinindo...' : 'Redefinir Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
}

ResetPassword.layout = (page: React.ReactNode) => <>{page}</>;