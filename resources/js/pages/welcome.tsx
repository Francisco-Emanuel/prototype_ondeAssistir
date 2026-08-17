import { Head, router, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface Platform { id: number; name: string; pivot: { monetization_type: string; url: string; }; }
interface Title { id: number; name: string; poster_url: string; release_date: string | null; platforms: Platform[]; }

export default function Welcome({ titles, filters }: { titles: Title[], filters: { search?: string } }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== filters.search) {
                setIsSearching(true);
                router.get('/', { search: searchTerm }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    onFinish: () => setIsSearching(false)
                });
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filters.search]);

    // O "Pente Fino": Normaliza os nomes e remove as repetições de planos
    const getCleanPlatforms = (platforms: Platform[]) => {
        const unique = new Map<string, Platform>();

        platforms.forEach(p => {
            let cleanName = p.name;
            const lowerName = p.name.toLowerCase();

            // Intercepta e padroniza as maiores do Brasil
            if (lowerName.includes('netflix')) cleanName = 'Netflix';
            else if (lowerName.includes('prime video')) cleanName = 'Prime Video';
            else if (lowerName.includes('disney')) cleanName = 'Disney+';
            else if (lowerName.includes('max') && !lowerName.includes('climax')) cleanName = 'Max';
            else if (lowerName.includes('apple tv')) cleanName = 'Apple TV+';
            else if (lowerName.includes('globoplay')) cleanName = 'Globoplay';
            else if (lowerName.includes('paramount')) cleanName = 'Paramount+';
            else if (lowerName.includes('crunchyroll')) cleanName = 'Crunchyroll';
            else {
                // Se for outra, remove apenas os sufixos de plano com Regex
                cleanName = cleanName.replace(/\s*(basic|standard|premium|com anúncios|ads|plan).*$/i, '').trim();
            }

            // A chave única é o Nome Limpo + O Tipo (Assinatura, Aluguel, etc)
            const key = `${cleanName}-${p.pivot.monetization_type}`;

            if (!unique.has(key)) {
                unique.set(key, { ...p, name: cleanName });
            }
        });

        return Array.from(unique.values());
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
        <div className="min-h-screen bg-[#0B0F19] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white pb-20">
            <Head title="Onde Assistir" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-12 text-center flex flex-col items-center gap-6">
                    <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
                        Onde <span className="text-indigo-500">Assistir?</span>
                    </h1>

                    <div className="relative w-full max-w-2xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Busque por um filme ou série..."
                            className="block w-full pl-11 pr-4 py-4 bg-gray-900/80 border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xl"
                        />
                        {isSearching && (
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                            </div>
                        )}
                    </div>
                </header>

                <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {titles.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-500">
                            <p className="text-lg">Nenhum título encontrado para "{searchTerm}".</p>
                        </div>
                    ) : (
                        titles.map((title) => {
                            const cleanPlatforms = getCleanPlatforms(title.platforms);
                            const isAvailable = cleanPlatforms.length > 0;

                            return (
                                <Link
                                    href={`/titulo/${title.id}`}
                                    key={title.id}
                                    className="group relative flex flex-col bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 cursor-pointer"
                                >
                                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-800">
                                        {title.poster_url ? (
                                            <img
                                                src={title.poster_url}
                                                alt={title.name}
                                                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!isAvailable ? 'grayscale opacity-60' : ''}`}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600 font-medium">Sem Pôster</div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent opacity-90"></div>

                                        <div className="absolute bottom-0 w-full p-4">
                                            <h2 className={`text-lg font-bold line-clamp-2 leading-tight drop-shadow-md ${!isAvailable ? 'text-gray-300' : 'text-white'}`}>
                                                {title.name}
                                            </h2>
                                            {/* Chamada Dinâmica do Selo */}
                                            {isAvailable ? (
                                                <p className="text-xs text-indigo-400 mt-1 font-medium tracking-wide uppercase">
                                                    {cleanPlatforms.length} {cleanPlatforms.length === 1 ? 'Opção' : 'Opções'}
                                                </p>
                                            ) : (
                                                <div className={`mt-2 inline-block text-[10px] font-black px-2 py-1 rounded border uppercase tracking-widest shadow-sm backdrop-blur-md ${getBadgeInfo(title, isAvailable)?.style}`}>
                                                    {getBadgeInfo(title, isAvailable)?.text}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </main>
            </div>
        </div>
    );
}