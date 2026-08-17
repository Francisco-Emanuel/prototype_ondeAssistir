import { Head } from '@inertiajs/react';

// Tipagem do TypeScript para o nosso banco de dados
interface Platform {
    id: number;
    name: string;
    pivot: {
        monetization_type: string;
        url: string;
    };
}

interface Title {
    id: number;
    name: string;
    poster_url: string;
    platforms: Platform[];
}

export default function Welcome({ titles }: { titles: Title[] }) {
    // Dicionário visual para traduzir o tipo de monetização
    const translateType = (type: string) => {
        const types: Record<string, string> = {
            sub: 'Assinatura',
            free: 'Gratuito',
            rent: 'Aluguel',
            buy: 'Compra'
        };
        return types[type] || type;
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
            <Head title="Onde Assistir" />
            
            <header className="max-w-7xl mx-auto mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-500 mb-4 tracking-tight">
                    Onde Assistir?
                </h1>
                <p className="text-gray-400 text-lg">
                    Descubra em qual plataforma seu filme favorito está disponível.
                </p>
            </header>

            {/* Grid Responsivo de Filmes */}
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {titles.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 py-12">
                        Nenhum filme encontrado no banco de dados.
                    </div>
                ) : (
                    titles.map((title) => (
                        <article key={title.id} className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800 transition-transform hover:-translate-y-1 hover:shadow-indigo-500/20">
                            {title.poster_url ? (
                                <img 
                                    src={title.poster_url} 
                                    alt={`Pôster de ${title.name}`} 
                                    className="w-full h-[400px] object-cover" 
                                />
                            ) : (
                                <div className="w-full h-[400px] bg-gray-800 flex items-center justify-center">
                                    <span className="text-gray-500">Sem Pôster</span>
                                </div>
                            )}
                            
                            <div className="p-5 flex flex-col h-full">
                                <h2 className="text-xl font-bold text-gray-100 mb-4 line-clamp-2">
                                    {title.name}
                                </h2>
                                
                                <div className="space-y-3 mt-auto">
                                    {title.platforms.map(platform => (
                                        <a 
                                            key={platform.id} 
                                            href={platform.pivot.url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="group flex flex-col items-center justify-center w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg transition-all duration-200"
                                        >
                                            <span className="font-semibold text-sm">
                                                {platform.name}
                                            </span>
                                            <span className="text-xs text-indigo-200 group-hover:text-white uppercase tracking-wider mt-0.5">
                                                {translateType(platform.pivot.monetization_type)}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </main>
        </div>
    );
}