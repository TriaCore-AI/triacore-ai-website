import React, { useRef } from 'react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import SectionNav from '../components/ui/section-nav';
import WorkshopsHero from '../components/workshops/workshops-hero';
import WorkshopsProbleem from '../components/workshops/workshops-probleem';
import WorkshopsLeren from '../components/workshops/workshops-leren';
import WorkshopsQuotes from '../components/workshops/workshops-quotes';
import WorkshopsOfferte from '../components/workshops/workshops-offerte';
import useReveal from '../components/workshops/use-reveal';
import { useLanguage } from '../context/LanguageContext';

// De secties in het snelmenu linksonder, in de volgorde van de pagina (ids staan op de secties zelf)
const snelmenu = {
    nl: [
        { id: 'workshops', label: 'Workshops' },
        { id: 'uitdaging', label: 'De uitdaging' },
        { id: 'leren', label: 'Wat uw team leert' },
        { id: 'quotes', label: 'Wat klanten zeggen' },
        { id: 'offerte', label: 'Offerte aanvragen' }
    ],
    en: [
        { id: 'workshops', label: 'Workshops' },
        { id: 'uitdaging', label: 'The challenge' },
        { id: 'leren', label: 'What your team learns' },
        { id: 'quotes', label: 'What clients say' },
        { id: 'offerte', label: 'Request a quote' }
    ]
};

// Workshops, in de nieuwe stijl. De scrollanimaties van alle secties komen uit useReveal (blokken met
// data-reveal); het snelmenu linksonder is hetzelfde als op de homepage
export default function Workshops() {
    const { language } = useLanguage();
    const nl = language === 'nl';
    const mainRef = useRef(null);
    useReveal(mainRef);

    return (
        <div className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo
                title="Workshops | TriaCore AI"
                description={nl
                    ? 'Praktische AI-workshops van TriaCore AI: uw team leert zelf werken met AI, op maat van uw sector en met voorbeelden uit het eigen werk.'
                    : 'Practical AI workshops by TriaCore AI: your team learns to work with AI themselves, tailored to your sector and with examples from their own work.'}
            />
            <Navbar />
            <SectionNav items={snelmenu[language]} />
            <main ref={mainRef} className="relative flex-grow">
                <WorkshopsHero />
                <WorkshopsProbleem />
                <WorkshopsLeren />
                <WorkshopsQuotes />
                <WorkshopsOfferte />
            </main>
            <Footer />
        </div>
    );
}
