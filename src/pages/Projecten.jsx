import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import PageHeader from '../components/ui/page-header';
import ClientCard from '../components/ui/client-card';
import { useLanguage } from '../context/LanguageContext';
import { klantKaarten } from '../data/klanten';

gsap.registerPlugin(ScrollTrigger);

// Projecten, in de nieuwe stijl: dezelfde header als de andere pagina's en dezelfde klantkaarten als op
// de homepage, in een raster van twee kolommen. Bij het scrollen komen de kaarten na elkaar binnen en
// tekent de lijn zich.
export default function Projecten() {
    const { language } = useLanguage();
    const nl = language === 'nl';
    const gridRef = useRef(null);
    const kaarten = klantKaarten(language);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const wide = window.matchMedia('(min-width: 768px)').matches;
            gsap.utils.toArray('.klantcases-card').forEach((card, i) => {
                const offset = wide ? (i % 2) * 0.12 : 0;
                const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%', once: true } }).timeScale(0.7);
                tl.from(card, { y: 48, opacity: 0, duration: 1.4, ease: 'expo.out' }, offset);
                const line = card.querySelector('.rv-line');
                if (line) tl.from(line, { scaleX: 0, duration: 1.2, ease: 'power3.inOut' }, offset + 0.35);
            });
        }, gridRef);
        return () => ctx.revert();
    }, [language]);

    return (
        <div className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo
                title={nl ? 'Projecten | TriaCore AI' : 'Projects | TriaCore AI'}
                description={nl
                    ? 'Ontdek hoe bedrijven als Croes NV en A&M Group hun processen herbouwden met TriaCore AI, en voor wie we workshops gaven.'
                    : 'Discover how companies like Croes NV and A&M Group rebuilt their processes with TriaCore AI, and who we gave workshops to.'}
            />
            <Navbar />
            <main className="relative flex-grow">
                <PageHeader
                    title={nl ? 'Onze projecten.' : 'Our projects.'}
                    intro={nl ? 'Organisaties die we verder hielpen met AI, van een eerste workshop tot software op maat.' : 'Organisations we helped move forward with AI, from a first workshop to custom software.'}
                />

                <section className="px-6 md:px-16 lg:px-24 pb-16 md:pb-24">
                    <div className="max-w-7xl mx-auto">
                        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                            {kaarten.map((c) => (
                                <ClientCard key={c.key} card={c} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
