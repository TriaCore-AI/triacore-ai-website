// Genereert public/sitemap.xml op basis van de statische routes plus alle
// gepubliceerde projecten. Draait automatisch voor elke build
// (zie "build" in package.json) zodat de sitemap nooit achterloopt.
import { writeFile } from 'fs/promises';
import { loadProjecten } from './load-projecten.mjs';

const SITE_URL = 'https://triacore.be';

const STATIC_ROUTES = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/ai-oplossingen', priority: '0.8', changefreq: 'monthly' },
    { path: '/workshops', priority: '0.8', changefreq: 'monthly' },
    // /ai-begeleiding (AI-agents) is tijdelijk offline en staat daarom niet in de sitemap (6/11)
    { path: '/team', priority: '0.6', changefreq: 'monthly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/projecten', priority: '0.8', changefreq: 'weekly' },
    { path: '/privacybeleid', priority: '0.3', changefreq: 'yearly' },
    { path: '/cookiebeleid', priority: '0.3', changefreq: 'yearly' },
];

function urlEntry(loc, { priority, changefreq, lastmod }) {
    return [
        '  <url>',
        `    <loc>${SITE_URL}${loc}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
    ].filter(Boolean).join('\n');
}

async function main() {
    const projecten = await loadProjecten();

    const entries = [
        ...STATIC_ROUTES.map((r) => urlEntry(r.path, r)),
        ...projecten
            .filter((p) => p.status === 'live')
            .map((p) => urlEntry(`/projecten/${p.slug}`, { priority: '0.7', changefreq: 'monthly' })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

    await writeFile('public/sitemap.xml', xml, 'utf-8');
    console.log(`sitemap.xml gegenereerd met ${entries.length} URLs`);
}

main();
