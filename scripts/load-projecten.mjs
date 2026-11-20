// Leest de projecten uit src/data/projecten.jsx in Node, voor de bouwscripts (sitemap en meta per pagina).
import { build } from 'esbuild';

export async function loadProjecten() {
    // bundle:true zodat de logo-imports (png/webp) worden meegenomen; die
    // beelden zelf hebben we niet nodig, dus loader 'empty'.
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
