// Leest de resources (src/content/resources/*.json, beheerd vanuit de ERP) in Node, voor de bouwscripts
// (sitemap en meta per pagina).
import { readdir, readFile } from 'fs/promises';

export async function loadResources(dir = 'src/content/resources') {
    const namen = (await readdir(dir)).filter((naam) => naam.endsWith('.json'));
    const lijst = await Promise.all(namen.map(async (naam) => JSON.parse(await readFile(`${dir}/${naam}`, 'utf-8'))));
    return lijst.sort((a, b) => b.date.localeCompare(a.date));
}
