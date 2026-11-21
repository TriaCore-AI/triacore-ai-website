// Resources: elk artikel is een JSON-bestand in src/content/resources/, beheerd vanuit de ERP
// (Marketing → Resources). Zie src/content/resources/README.md voor het formaat.

const bestanden = import.meta.glob('../content/resources/*.json', { eager: true, import: 'default' });

// Dezelfde sleutels kent de ERP. Een nieuwe categorie: hier én in de ERP toevoegen.
export const CATEGORIES = {
    prompting: { nl: 'Prompting', en: 'Prompting' },
    tools: { nl: 'Tools en modellen', en: 'Tools and models' },
    'ai-nieuws': { nl: 'AI-nieuws', en: 'AI news' },
    automatisering: { nl: 'Automatisering', en: 'Automation' },
    'ai-kennis': { nl: 'AI-kennis', en: 'AI knowledge' },
    ideeen: { nl: 'Ideeën', en: 'Ideas' },
};

// Nieuwste eerst
export const resources = Object.values(bestanden).sort(
    (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
);

export function getResource(slug) {
    return resources.find((r) => r.slug === slug) ?? null;
}

// De tekst in de gekozen taal; valt terug op Nederlands als die taal ontbreekt
export function inTaal(resource, language) {
    return resource[language] ?? resource.nl;
}

export function categoryLabel(key, language) {
    return CATEGORIES[key]?.[language] ?? CATEGORIES[key]?.nl ?? key;
}

export function formatDate(iso, language) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(language === 'nl' ? 'nl-BE' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    });
}
