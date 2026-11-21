import React, { useEffect, useState } from 'react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import ResourceArticle from '../components/content/ResourceArticle';
import ResourceCard from '../components/ui/resource-card';
import { resources } from '../data/resources';

// Voorbeeld voor de ERP (Marketing → Resources). De ERP toont deze pagina in een venster en stuurt het
// concept met postMessage; hier wordt het getoond met exact dezelfde onderdelen als de echte pagina's.
// Er wordt niets bewaard of opgehaald. Enkel berichten van de ERP-adressen hieronder tellen; welke sites
// deze pagina in een venster mogen tonen, staat in netlify.toml (frame-ancestors). Niet in Google (noindex).
const ERP_ORIGINS = [
    'https://management-triacore.netlify.app',
    'https://cedar-index-8k2m.netlify.app',
    'http://localhost:3001',
    'http://localhost:3002',
];

export default function ResourcePreview() {
    const [state, setState] = useState(null);

    useEffect(() => {
        const ready = (target, origin) =>
            target?.postMessage({ source: 'triacore-website', type: 'resource-preview-ready' }, origin);
        function onMessage(event) {
            if (!ERP_ORIGINS.includes(event.origin)) return;
            const data = event.data;
            if (!data || data.source !== 'triacore-erp') return;
            // De ERP vraagt of de pagina er is (ze kan vroeger geladen zijn dan de ERP luisterde)
            if (data.type === 'resource-preview-hello') {
                ready(event.source, event.origin);
                return;
            }
            if (data.type !== 'resource-preview') return;
            setState({ resource: data.resource, language: data.language === 'en' ? 'en' : 'nl', view: data.view === 'card' ? 'card' : 'article' });
        }
        window.addEventListener('message', onMessage);
        // Laat de ERP weten dat de pagina klaar is om een concept te ontvangen
        ready(window.parent, '*');
        return () => window.removeEventListener('message', onMessage);
    }, []);

    if (!state) {
        return (
            <div className="min-h-screen bg-grain flex items-center justify-center font-sans text-foreground/50">
                <Seo title="Voorbeeld | TriaCore AI" noindex />
                Voorbeeld laden…
            </div>
        );
    }

    const { resource, language, view } = state;
    return (
        <div className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans">
            <Seo title="Voorbeeld | TriaCore AI" noindex />
            {/* Links in het voorbeeld doen niets: het blijft het voorbeeld */}
            <div className="pointer-events-none">
                <Navbar />
            </div>
            {view === 'card' ? (
                <main className="relative flex-grow px-6 md:px-16 lg:px-24 pt-36 md:pt-44 pb-16 md:pb-24">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        <ResourceCard resource={resource} language={language} />
                        {resources
                            .filter((r) => r.slug !== resource.slug)
                            .slice(0, 2)
                            .map((r) => (
                                <div key={r.slug} className="opacity-50">
                                    <ResourceCard resource={r} language={language} />
                                </div>
                            ))}
                    </div>
                </main>
            ) : (
                <main className="relative flex-grow px-6 md:px-16 lg:px-24 pt-36 md:pt-44 pb-16 md:pb-24">
                    <ResourceArticle resource={resource} language={language} preview />
                </main>
            )}
            <div className="pointer-events-none">
                <Footer />
            </div>
        </div>
    );
}
