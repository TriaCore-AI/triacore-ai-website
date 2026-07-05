// Genereert public/sitemap.xml op basis van de statische routes plus alle
// gepubliceerde resources en projecten. Draait automatisch voor elke build
// (zie "prebuild" in package.json) zodat de sitemap nooit achterloopt.
import { writeFile } from 'fs/promises';
import { loadResources } from './load-resources.mjs';
import { build } from 'esbuild';

const SITE_URL = 'https://triacore.be';

async function loadProjecten() {
    // bundle:true zodat de logo-imports (png/webp) worden meegenomen; die
    // beelden zelf hebben we niet nodig voor de sitemap, dus loader 'empty'.
    const result = await build({
        entryPoints: ['src/data/projecten.jsx'],
        bundle: true,
        write: false,
        format: 'esm',
        platform: 'node',
        logLevel: 'silent',
        loader: { '.png': 'empty', '.webp': 'empty', '.jpg': 'empty', '.jpeg': 'empty', '.svg': 'empty' },
    });
    const code = result.outputFiles[0].text;
    const mod = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
    return mod.projecten || [];
}

const STATIC_ROUTES = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/custom-oplossingen', priority: '0.8', changefreq: 'monthly' },
    { path: '/team', priority: '0.6', changefreq: 'monthly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/projecten', priority: '0.8', changefreq: 'weekly' },
    { path: '/resources', priority: '0.8', changefreq: 'weekly' },
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
    const { resources } = await loadResources();
    const projecten = await loadProjecten();

    const entries = [
        ...STATIC_ROUTES.map((r) => urlEntry(r.path, r)),
        ...resources.map((r) => urlEntry(`/resources/${r.slug}`, {
            priority: '0.6',
            changefreq: 'monthly',
            lastmod: r.date,
        })),
        ...projecten
            .filter((p) => p.status === 'live')
            .map((p) => urlEntry(`/projecten/${p.slug}`, { priority: '0.7', changefreq: 'monthly' })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

    await writeFile('public/sitemap.xml', xml, 'utf-8');
    console.log(`sitemap.xml gegenereerd met ${entries.length} URLs`);
}

main();
