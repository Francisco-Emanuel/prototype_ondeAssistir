import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { getCleanPlatforms, getTypeColorClass, translateType } from '@/lib/platforms';

interface Platform { id: number; name: string; pivot: { monetization_type: string; url: string; }; }
interface Title { id: number; name: string; poster_url: string; synopsis: string; cast: string; rating: number; release_date: string | null; platforms: Platform[]; }

export default function TitleDetails({ title }: { title: Title }) {

    

    const renderStars = (rating: number) => {
        const score = (rating / 2).toFixed(1);
        return (
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md w-fit px-4 py-2 rounded-xl border border-white/10 shadow-inner">
                <svg className="w-5 h-5 text-yellow-400 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-yellow-400 font-extrabold text-lg">{score} <span className="text-gray-400 text-sm font-medium">/ 5</span></span>
            </div>
        );
    };

    // Calcula o status do filme baseado na data
    const getBadgeInfo = (title: Title, isAvailable: boolean) => {
        if (isAvailable) return null;

        if (!title.release_date) {
            return { text: "Indisponível no BR", style: "bg-red-500/90 text-white border-red-400/50" };
        }

        const release = new Date(title.release_date);
        const today = new Date();
        const diffDays = (today.getTime() - release.getTime()) / (1000 * 3600 * 24);

        if (diffDays < 0) {
            return { text: "Em Breve", style: "bg-yellow-500/90 text-yellow-950 border-yellow-400/50 text-shadow-none" };
        } else if (diffDays <= 90) { // Janela de 3 meses de cinema
            return { text: "Ainda nos cinemas", style: "bg-yellow-500/90 text-yellow-950 border-yellow-400/50 text-shadow-none" };
        } else {
            return { text: "Indisponível no BR", style: "bg-red-500/90 text-white border-red-400/50" };
        }
    };

    return (
        <div className="min-h-screen relative bg-[#080B12] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
            <Head title={`${title.name} - Onde Assistir`} />

            {/* Fundo Ambiente Dinâmico (Efeito Blur) */}
            {title.poster_url && (
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <img
                        src={title.poster_url}
                        alt="Background"
                        className={`w-full h-full object-cover transform scale-110 blur-[80px] opacity-30 ${!isAvailable ? 'grayscale' : ''}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/80 to-[#080B12]/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#080B12]/90 via-[#080B12]/60 to-transparent"></div>
                </div>
            )}

            {/* Conteúdo Principal */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen flex flex-col justify-center">
                <Link href="/" className="inline-flex items-center text-indigo-300 hover:text-white font-semibold mb-8 transition-colors drop-shadow-md w-fit bg-black/20 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar para a busca
                </Link>

                {/* Card Glassmorphism com Flex (Capa na Esquerda, Texto na Direita) */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 md:gap-12 items-start">

                    {/* Chamada Dinâmica do Selo */}
                    {!isAvailable && (
                        <div className={`absolute top-4 right-4 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg backdrop-blur-md border ${getBadgeInfo(title, isAvailable)?.style} z-20`}>
                            {getBadgeInfo(title, isAvailable)?.text}
                        </div>
                    )}

                    {/* Coluna da Esquerda: A Capa (Pôster) */}
                    <div className="w-full md:w-1/3 flex-shrink-0 relative z-10">
                        {title.poster_url ? (
                            <img
                                src={title.poster_url}
                                alt={`Pôster de ${title.name}`}
                                className={`w-full rounded-2xl shadow-2xl border border-white/10 object-cover aspect-[2/3] ${!isAvailable ? 'grayscale opacity-70' : ''}`}
                            />
                        ) : (
                            <div className="w-full aspect-[2/3] bg-gray-800/50 rounded-2xl border border-white/10 flex items-center justify-center text-gray-500 font-medium">
                                Sem Pôster
                            </div>
                        )}
                    </div>

                    {/* Coluna da Direita: Informações */}
                    <div className="w-full md:w-2/3 flex flex-col z-10">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-xl leading-tight">
                            {title.name}
                        </h1>

                        {title.rating && renderStars(title.rating)}

                        <div className="mt-8 space-y-8">
                            {title.synopsis && (
                                <div>
                                    <h3 className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-3 drop-shadow">Sinopse</h3>
                                    <p className="text-gray-200 text-lg leading-relaxed drop-shadow-sm font-light">{title.synopsis}</p>
                                </div>
                            )}

                            {title.cast && (
                                <div>
                                    <h3 className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-3 drop-shadow">Elenco Principal</h3>
                                    <p className="text-gray-300 text-base drop-shadow-sm font-medium">{title.cast}</p>
                                </div>
                            )}

                            <div className="pt-8 border-t border-white/10">
                                <h3 className="text-2xl font-black text-white mb-6 drop-shadow-md">Onde Assistir:</h3>

                                {isAvailable ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {cleanPlatforms.map((platform) => {
                                            const colorClass = typeColors[platform.pivot.monetization_type] || typeColors.sub;
                                            return (
                                                <a key={platform.id} href={platform.pivot.url} target="_blank" rel="noreferrer" className={`flex flex-col px-5 py-4 rounded-xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg ${colorClass}`}>
                                                    <span className="font-bold text-lg mb-1 truncate drop-shadow-sm text-white">{platform.name}</span>
                                                    <span className="text-xs uppercase tracking-widest font-black opacity-90 drop-shadow-sm">{translateType(platform.pivot.monetization_type)}</span>
                                                </a>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="bg-black/30 border border-white/5 rounded-2xl p-8 text-center backdrop-blur-md shadow-inner">
                                        <p className="text-gray-300 font-medium text-lg">Este título não está disponível em nenhum serviço de streaming brasileiro no momento.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Remove o layout padrão do repositório
TitleDetails.layout = (page: React.ReactNode) => <>{page}</>;