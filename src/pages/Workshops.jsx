import React, { useRef } from 'react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import { seoVoor } from '../data/seo';
import WorkshopsHero from '../components/workshops/workshops-hero';
import WorkshopsProbleem from '../components/workshops/workshops-probleem';
import WorkshopsLeren from '../components/workshops/workshops-leren';
import WorkshopsQuotes from '../components/workshops/workshops-quotes';
import WorkshopsOfferte from '../components/workshops/workshops-offerte';
import useReveal from '../components/workshops/use-reveal';
import { useLanguage } from '../context/LanguageContext';

// Workshops, in de nieuwe stijl. De scrollanimaties van alle secties komen uit useReveal (blokken met
// data-reveal). Geen snelmenu linksonder: dat staat enkel op de homepage (beslissing Lucas, 20/11). Terugzetten:
// importeer SectionNav uit components/ui/section-nav en geef een lijst met { id, label } per taal mee
export default function Workshops() {
    const { language } = useLanguage();
    const mainRef = useRef(null);
    useReveal(mainRef);

    return (
        <div className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo {...seoVoor('/workshops', language)} />
            <Navbar />
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
