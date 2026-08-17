import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <div className="min-h-screen relative bg-[#080B12] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Esqueceu a Senha" />

            {/* Fundo Cinemático */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div className="absolute top-[30%] right-[40%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
            </div>

            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 sm:p-12 shadow-2xl">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black tracking-tight text-white mb-4">
                        Recuperar Senha
                    </h1>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">
                        Esqueceu sua senha? Sem problemas. Basta nos informar seu endereço de e-mail e nós enviaremos um link de redefinição.
                    </p>
                </div>

                {status && <div className="mb-6 font-bold text-sm text-emerald-400 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-center">{status}</div>}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">Email cadastrado</label>
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

                    <div className="flex flex-col gap-4 mt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all disabled:opacity-50 tracking-wider uppercase"
                        >
                            {processing ? 'Enviando...' : 'Enviar Link de Recuperação'}
                        </button>
                        
                        <Link href="/login" className="text-center text-sm text-gray-400 hover:text-white transition-colors font-medium">
                            Voltar para o Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

ForgotPassword.layout = (page: React.ReactNode) => <>{page}</>;