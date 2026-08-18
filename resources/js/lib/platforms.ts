export interface Platform {
    id: number;
    name: string;
    pivot: {
        monetization_type: string;
        url: string;
    };
}

export const getCleanPlatforms = (platforms: Platform[]): Platform[] => {
    const unique = new Map<string, Platform>();

    platforms.forEach(p => {
        let cleanName = p.name;
        const lowerName = p.name.toLowerCase();

        if (lowerName.includes('netflix')) cleanName = 'Netflix';
        else if (lowerName.includes('prime video')) cleanName = 'Prime Video';
        else if (lowerName.includes('disney')) cleanName = 'Disney+';
        else if (lowerName.includes('max') && !lowerName.includes('climax')) cleanName = 'Max';
        else if (lowerName.includes('apple tv')) cleanName = 'Apple TV+';
        else if (lowerName.includes('globoplay')) cleanName = 'Globoplay';
        else if (lowerName.includes('paramount')) cleanName = 'Paramount+';
        else if (lowerName.includes('crunchyroll')) cleanName = 'Crunchyroll';
        else {
            cleanName = cleanName.replace(/\s*(basic|standard|premium|com anúncios|ads|plan).*$/i, '').trim();
        }

        const key = `${cleanName}-${p.pivot.monetization_type}`;
        if (!unique.has(key)) {
            unique.set(key, { ...p, name: cleanName });
        }
    });

    return Array.from(unique.values());
};

export const translateType = (type: string): string => {
    const types: Record<string, string> = { 
        sub: 'Assinatura', 
        free: 'Gratuito', 
        rent: 'Aluguel', 
        buy: 'Compra' 
    };
    return types[type] || type;
};

export const getTypeColorClass = (type: string): string => {
    const typeColors: Record<string, string> = {
        sub: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30',
        free: 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30',
        rent: 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30',
        buy: 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30',
    };
    return typeColors[type] || typeColors.sub;
};