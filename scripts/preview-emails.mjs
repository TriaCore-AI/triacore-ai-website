// Genereert een lokale preview van de mails (welkomstmail + resource-broadcast)
// zodat je de opmaak in je browser kunt bekijken.
//   npm run preview-emails   ->  schrijft email-preview.html in de projectmap
//
// Gebruikt exact dezelfde builders als de echte mails (welcomeEmail /
// resourceBroadcast), dus de preview kan niet uit de pas lopen.
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { welcomeEmail, resourceBroadcast, unsubscribePage, SITE_URL } from '../lib/email-template.js';
import { loadResources } from './load-resources.mjs';

// Lokaal bestand als data-URI, zodat logo/thumbnail tonen ook al staan ze nog
// niet live op www.triacore.be.
const dataUri = (path, mime) =>
    existsSync(path) ? `data:${mime};base64,${readFileSync(path).toString('base64')}` : '';

const { resources, CATEGORIES } = await loadResources();
const r = [...resources].sort((a, b) => (a.date < b.date ? 1 : -1))[0];

const welcome = welcomeEmail('nl', { unsubscribeUrl: `${SITE_URL}/uitschrijven-voorbeeld` }).html;
const broadcast = r
    ? resourceBroadcast({
          title: r.title?.nl || r.title,
          description: r.description?.nl || r.description || '',
          thumbnail: r.thumbnail,
          slug: r.slug,
          categoryLabel: CATEGORIES[r.category]?.nl,
      }).html
    : '<p style="color:#fff;text-align:center;">Geen resource gevonden om te tonen.</p>';

let page = `<!doctype html><html><head><meta charset="utf-8"><title>Mail preview</title>
<style>body{margin:0;background:#1e293b;font-family:Arial,sans-serif}h2{color:#fff;text-align:center;padding:24px 0 0;margin:0}</style></head>
<body>
  <h2>1 &mdash; Welkomstmail</h2>
  ${welcome}
  <h2>2 &mdash; Nieuwe resource (broadcast)</h2>
  ${broadcast}
  <h2>3 &mdash; Uitschrijf-pagina (na klikken op "Uitschrijven")</h2>
  <iframe title="uitschrijfpagina" style="display:block;margin:24px auto;width:100%;max-width:560px;height:360px;border:0;border-radius:12px;background:#fff;" srcdoc="${unsubscribePage('nl', true).replaceAll('"', '&quot;')}"></iframe>
</body></html>`;

// Live-URL's vervangen door lokale afbeeldingen voor de preview.
page = page.replaceAll(`${SITE_URL}/logo/triacore-mark.png`, dataUri('public/logo/triacore-mark.png', 'image/png'));
if (r?.thumbnail) {
    page = page.replaceAll(`${SITE_URL}${r.thumbnail}`, dataUri(`public${r.thumbnail}`, 'image/webp'));
}

const out = 'email-preview.html';
writeFileSync(out, page);
console.log('Preview geschreven naar:', out, '\nOpen dit bestand in je browser.');
