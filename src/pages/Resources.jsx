import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import { seoVoor } from '../data/seo';
import PageHeader from '../components/ui/page-header';
import ResourceCard from '../components/ui/resource-card';
import NewsletterSignup from '../components/ui/newsletter-signup';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORIES, categoryLabel, resources } from '../data/resources';

gsap.registerPlugin(ScrollTrigger);

// De kennisbank (/kennisbank, in het Engels "Resources"): artikels met ideeën, prompts en tips. De header
// staat hier in de code; de artikels zelf komen uit src/content/resources/ en worden beheerd vanuit de ERP.
// Filter op categorie (enkel de categorieën die in gebruik zijn), nieuwste eerst, kaarten in een raster van
// drie. De inschrijving op de nieuwsbrief staat rechts naast de titel.
export default function Resources() {
    const { language } = useLanguage();
    const nl = language === 'nl';
    const gridRef = useRef(null);
    const [filter, setFilter] = useState('alles');

    const inGebruik = useMemo(
        () => Object.keys(CATEGORIES).filter((key) => resources.some((r) => r.category === key)),
        [],
    );
    const zichtbaar = filter === 'alles' ? resources : resources.filter((r) => r.category === filter);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const wide = window.matchMedia('(min-width: 1024px)').matches;
            gsap.utils.toArray('.resource-card').forEach((card, i) => {
                gsap.from(card, {
                    y: 48,
                    opacity: 0,
                    duration: 1.4,
                    ease: 'expo.out',
                    delay: wide ? (i % 3) * 0.1 : 0,
                    scrollTrigger: { trigger: card, start: 'top 88%', once: true },
                });
            });
        }, gridRef);
        return () => ctx.revert();
    }, [language, filter]);

    const knop = (actief) =>
        `rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
            actief ? 'bg-foreground text-background' : 'border border-foreground/15 text-foreground/70 hover:border-accent hover:text-accent'
        }`;

    return (
        <div className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo {...seoVoor('/kennisbank', language)} />
            <Navbar />
            <main className="relative flex-grow">
                <PageHeader
                    title={nl ? 'Kennisbank.' : 'Resources.'}
                    intro={
                        nl
                            ? 'Ideeën, prompts en tips om zelf meer uit AI te halen. Kort, concreet en meteen bruikbaar.'
                            : 'Ideas, prompts and tips to get more out of AI yourself. Short, concrete and ready to use.'
                    }
                    aside={
                        // Inschrijven op de nieuwsbrief, rechts naast de titel: compact en zonder kaart, onderaan
                        // gelijk met de intro, zodat de titel bovenaan blijft staan zoals op elke andere pagina
                        <div className="max-w-md">
                            <h2 className="text-xl font-medium text-foreground">
                                {nl ? 'Mis geen nieuw artikel.' : 'Never miss a new article.'}
                            </h2>
                            <p className="mt-2 mb-6 text-[15px] text-foreground/60 leading-relaxed">
                                {nl
                                    ? 'Elk nieuw artikel uit de kennisbank in je mailbox.'
                                    : 'Every new article straight to your inbox.'}
                            </p>
                            <NewsletterSignup tone="light" />
                        </div>
                    }
                />

                <section className="px-6 md:px-16 lg:px-24 pb-16 md:pb-24">
                    <div className="max-w-7xl mx-auto">
                        {inGebruik.length > 1 && (
                            <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label={nl ? 'Filter op categorie' : 'Filter by category'}>
                                <button type="button" className={knop(filter === 'alles')} aria-pressed={filter === 'alles'} onClick={() => setFilter('alles')}>
                                    {nl ? 'Alles' : 'All'}
                                </button>
                                {inGebruik.map((key) => (
                                    <button key={key} type="button" className={knop(filter === key)} aria-pressed={filter === key} onClick={() => setFilter(key)}>
                                        {categoryLabel(key, language)}
                                    </button>
                                ))}
                            </div>
                        )}

                        {zichtbaar.length === 0 ? (
                            <p className="text-lg text-foreground/60">
                                {nl ? 'Binnenkort verschijnen hier de eerste artikels.' : 'The first articles will appear here soon.'}
                            </p>
                        ) : (
                            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                                {zichtbaar.map((r) => (
                                    <ResourceCard key={r.slug} resource={r} language={language} to={`/kennisbank/${r.slug}`} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
