import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import { useLanguage } from '../context/LanguageContext';

// Custom oplossingen, in de nieuwe stijl. Voorlopig enkel de header; de inhoud bouwen we stap voor stap op.
// De vorige versie van deze pagina staat bewaard in CustomOplossingenOud.jsx (niet meer gekoppeld aan een route).
export default function CustomOplossingen() {
    const containerRef = useRef(null);
    const { language } = useLanguage();

    // Zelfde binnenkomst als de titel op de homepage: de titel onthult zich vloeiend van links naar rechts.
    // Start pas als de lettertypes geladen zijn, anders verspringt de tekst midden in de animatie
    useEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const tl = gsap.timeline({ paused: true });
            tl.fromTo('.page-title',
                { clipPath: 'inset(-20% 100% -35% -5%)', x: -16 },
                { clipPath: 'inset(-20% -5% -35% -5%)', x: 0, duration: 1.8, ease: 'power2.inOut', clearProps: 'clipPath' });
            const play = () => tl.play();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
            else play();
        }, containerRef);
        return () => ctx.revert();
    }, [language]);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo
                title={language === 'nl' ? 'Custom oplossingen | TriaCore AI' : 'Custom solutions | TriaCore AI'}
                description={language === 'nl'
                    ? 'Software op maat rond uw processen, met AI waar het rendeert. Een platform, een app of een automatisering, gebouwd rond hoe uw bedrijf echt werkt.'
                    : 'Custom software built around your processes, with AI where it pays off. A platform, an app or an automation, built around how your business really works.'}
            />
            <Navbar />

            <main className="relative flex-grow">
                {/* HEADER */}
                <section className="px-6 md:px-16 lg:px-24 pt-40 md:pt-48 pb-24 md:pb-32">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="page-title hero-title text-foreground text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] leading-[1.02]">
                            {language === 'nl' ? 'Custom oplossingen' : 'Custom solutions'}
                        </h1>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
