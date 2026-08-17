import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

// Tipagens
interface Platform { id: number; name: string; pivot: { monetization_type: string; url: string; }; }
interface Title { id: number; name: string; external_api_id: string; platforms: Platform[]; }
interface PaginationLink { url: string | null; label: string; active: boolean; }
interface PaginatedTitles { data: Title[]; links: PaginationLink[]; current_page: number; last_page: number; total: number; }

export default function Dashboard({ titles }: { titles: PaginatedTitles }) {
    const [isSyncing, setIsSyncing] = useState(false);
    
    // Função para excluir
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Tem certeza que deseja excluir "${name}" do seu catálogo?`)) {
            router.delete(`/titulo/${id}`, {
                preserveScroll: true,
            });
        }
    };

    // Função para acionar a sincronização
    const handleSync = () => {
        setIsSyncing(true);
        router.post('/dashboard/sync', {}, {
            preserveScroll: true,
            onFinish: () => setIsSyncing(false),
        });
    };

    return (
        <>
            <Head title="Painel de Controle" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                
                {/* Cabeçalho e Botão de Sincronização */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Catálogo de Títulos</h1>
                        <p className="text-sm text-gray-500 mt-1">Total de {titles.total} títulos indexados no banco de dados.</p>
                    </div>
                    
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
                    >
                        {isSyncing ? (
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        )}
                        {isSyncing ? 'Sincronizando...' : 'Sincronizar Tendências'}
                    </button>
                </div>

                {/* Tabela de Gerenciamento */}
                <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="bg-gray-50 dark:bg-gray-950/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome do Título</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plataformas</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID Externo (TMDB)</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                                {titles.data.map((title) => (
                                    <tr key={title.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">#{title.id}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-100">{title.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${title.platforms.length > 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'}`}>
                                                {title.platforms.length} Opções
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{title.external_api_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => handleDelete(title.id, title.name)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 transition-colors bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-md"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Paginação */}
                {titles.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-1 flex-wrap">
                        {titles.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${                                     link.active                                          ? 'bg-indigo-600 border-indigo-600 text-white'                                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'                                 } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}