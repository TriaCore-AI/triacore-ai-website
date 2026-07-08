// Laadt de resource-data uit src/data/resources.jsx in een node-script.
// node kan .jsx niet rechtstreeks importeren, dus esbuild (al aanwezig via Vite)
// transpileert het naar JS dat we via een data-URL importeren.
import { build } from 'esbuild';

export async function loadResources(file = 'src/data/resources.jsx') {
    const result = await build({
        entryPoints: [file],
        bundle: false,
        write: false,
        format: 'esm',
        platform: 'node',
        logLevel: 'silent',
    });
    const code = result.outputFiles[0].text;
    const mod = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
    return { resources: mod.resources || [], CATEGORIES: mod.CATEGORIES || {}, getReadingTime: mod.getReadingTime };
}
