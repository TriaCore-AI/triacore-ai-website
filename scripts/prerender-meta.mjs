// Maakt na de build per pagina een eigen HTML-bestand met de juiste titel, omschrijving, canonical en
// og:url (dist/workshops.html, dist/projecten/croes-nv.html, ...). De site is een React-app: zonder dit
// krijgt elke URL dezelfde index.html, en LinkedIn, WhatsApp, Slack en co. (die geen JavaScript uitvoeren)
// tonen dan voor elke gedeelde link de homepage. Google zag bovendien eerst de canonical van de homepage.
//
// Netlify serveert /workshops rechtstreeks uit workshops.html; de regel "/* /index.html 200" in
// public/_redirects vangt de rest op. De teksten komen uit src/data/seo.js en het veld "seo" in
// src/data/projecten.jsx, dezelfde bron als de pagina's zelf. Draait vanzelf na "vite build" (package.json).
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { SITE_URL, paginaSeo } from '../src/data/seo.js';
import { loadProjecten } from './load-projecten.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Vervangt één tag en stopt de build als die tag niet (meer) in index.html staat, zodat een pagina nooit
// stilletjes de gegevens van de homepage houdt
function vervang(html, patroon, nieuw, naam) {
    if (!patroon.test(html)) throw new Error(`prerender-meta: ${naam} niet gevonden in dist/index.html`);
    return html.replace(patroon, nieuw);
}

function metMeta(html, { path, title, description }) {
    const url = SITE_URL + path;
    html = vervang(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`, 'title');
    html = vervang(html, /(<meta\s+name="description"\s+content=")[^"]*"/, `$1${esc(description)}"`, 'description');
    html = vervang(html, /(<meta\s+property="og:title"\s+content=")[^"]*"/, `$1${esc(title)}"`, 'og:title');
    html = vervang(html, /(<meta\s+property="og:description"\s+content=")[^"]*"/, `$1${esc(description)}"`, 'og:description');
    html = vervang(html, /(<meta\s+property="og:url"\s+content=")[^"]*"/, `$1${url}"`, 'og:url');
    html = vervang(html, /(<link\s+rel="canonical"\s+href=")[^"]*"/, `$1${url}"`, 'canonical');
    return html;
}

const basis = await readFile('dist/index.html', 'utf-8');
const projecten = (await loadProjecten()).filter((p) => p.status === 'live');

const paginas = [
    ...Object.entries(paginaSeo).map(([path, teksten]) => ({ path, ...teksten.nl })),
    ...projecten.map((p) => ({
        path: `/projecten/${p.slug}`,
        title: p.seo?.nl?.title ?? `${p.title.nl} | TriaCore AI`,
        description: p.seo?.nl?.description ?? p.description.nl,
    })),
];

for (const p of paginas) {
    const bestand = p.path === '/' ? 'dist/index.html' : `dist${p.path}.html`;
    await mkdir(dirname(bestand), { recursive: true });
    await writeFile(bestand, metMeta(basis, p));
}
console.log(`prerender-meta: ${paginas.length} pagina's met eigen titel en omschrijving`);
