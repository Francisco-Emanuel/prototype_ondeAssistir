import { Head, router } from '@inertiajs/react';

// Tipagens
interface Platform { id: number; name: string; pivot: { monetization_type: string; url: string; }; }
interface Title { id: number; name: string; external_api_id: string; platforms: Platform[]; }
interface PaginationLink { url: string | null; label: string; active: boolean; }
interface PaginatedTitles { data: Title[]; links: PaginationLink[]; current_page: number; last_page: number; total: number; }

export default function Dashboard({ titles }: { titles: PaginatedTitles }) {
    
    // Função que aciona a exclusão
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Tem certeza que deseja excluir "${name}" do seu catálogo?`)) {
            router.delete(`/titulo/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Painel de Controle" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Catálogo de Títulos</h1>
                        <p className="text-sm text-gray-500 mt-1">Total de {titles.total} títulos indexados no banco de dados.</p>
                    </div>
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