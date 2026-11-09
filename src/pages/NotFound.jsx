import React from 'react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import PageHeader from '../components/ui/page-header';
import CTAButton from '../components/ui/cta-button';
import { useLanguage } from '../context/LanguageContext';

// De 404-pagina: voor elk adres dat niet bestaat. Zelfde header als de andere pagina's, met twee wegen terug.
// Netlify stuurt elk adres naar de site (public/_redirects), dus deze pagina vangt alles op wat geen route heeft.
// Niet in Google (noindex).
export default function NotFound() {
    const { language } = useLanguage();
    const nl = language === 'nl';

    return (
        <div className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo
                title={nl ? 'Pagina niet gevonden | TriaCore AI' : 'Page not found | TriaCore AI'}
                description={nl ? 'Deze pagina bestaat niet of is verhuisd.' : 'This page does not exist or has moved.'}
                noindex
            />
            <Navbar />
            <main className="relative flex-grow">
                <PageHeader
                    title={nl ? 'Pagina niet gevonden.' : 'Page not found.'}
                    intro={nl
                        ? 'Deze pagina bestaat niet of is verhuisd. Geen probleem: hieronder vind je de weg terug.'
                        : 'This page does not exist or has moved. No problem: you can find your way back below.'}
                >
                    <div className="flex flex-wrap items-center gap-4">
                        <CTAButton to="/" size="md">{nl ? 'Naar de homepage' : 'Go to the homepage'}</CTAButton>
                        <CTAButton to="/contact" size="md" variant="secondary">{nl ? 'Plan een gesprek' : 'Book a call'}</CTAButton>
                    </div>
                </PageHeader>
            </main>
            <Footer />
        </div>
    );
}
