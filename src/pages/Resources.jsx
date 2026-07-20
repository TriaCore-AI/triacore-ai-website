import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { getSortedResources, CATEGORIES, formatDate, getReadingTime } from '../data/resources';
import NewsletterSignup from '../components/ui/newsletter-signup';
import Seo from '../components/ui/seo';

gsap.registerPlugin(ScrollTrigger);

// Uniforme thumbnail: gebruikt een afbeelding indien aanwezig, anders een
// merk-tegel met de categorie. Altijd dezelfde verhouding (4:3).
function ResourceThumbnail({ resource, language }) {
    const category = CATEGORIES[resource.category];

    if (resource.thumbnail) {
        return (
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#020617]">
                <img
                    src={resource.thumbnail}
                    alt={resource.title[language]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#020617] flex items-center justify-center">
            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                    backgroundSize: '2rem 2rem',
                }}
            />
            {/* Accent glow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-accent/20 blur-[60px] rounded-full transition-opacity duration-700 group-hover:opacity-80" />
            {/* Corner accents */}
            <div className="absolute top-6 left-6 w-5 h-5 border-t border-l border-white/15 transition-all duration-500 group-hover:border-accent/60" />
            <div className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-white/15 transition-all duration-500 group-hover:border-accent/60" />

            <span className="relative z-10 font-serif text-2xl md:text-3xl text-white/90 italic text-center px-6">
                {category ? category[language] : ''}
            </span>
        </div>
    );
}

// Klein rond label, gebruikt voor de categorie- en sorteerfilters.
function FilterPill({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-300 border ${
                active
                    ? 'bg-accent text-white border-accent'
                    : 'bg-transparent text-foreground/55 border-foreground/15 hover:border-accent/40 hover:text-foreground'
            }`}
        >
            {children}
        </button>
    );
}

function ResourceCard({ resource, language }) {
    const category = CATEGORIES[resource.category];

    return (
        <Link
            to={`/resources/${resource.slug}`}
            className="resource-card group flex flex-col bg-white border border-foreground/10 rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-foreground/5 hover:border-accent/40"
        >
            <ResourceThumbnail resource={resource} language={language} />

            <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                    {category && (
                        <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-accent">
                            {category[language]}
                        </span>
                    )}
                    <span className="text-[11px] text-foreground/40 font-light whitespace-nowrap">
                        {formatDate(resource.date, language)}
                        {` · ${getReadingTime(resource, language)} min`}
                    </span>
                </div>

                <h3 className="font-serif text-xl md:text-2xl leading-snug tracking-tight text-foreground mb-3">
                    {resource.title[language]}
                </h3>

                <p className="text-sm text-foreground/55 font-light leading-relaxed line-clamp-3 mb-6">
                    {resource.description[language]}
                </p>

                <span className="mt-auto inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground/70 group-hover:text-accent transition-colors duration-300">
                    {language === 'nl' ? 'Lees meer' : 'Read more'}
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
            </div>
        </Link>
    );
}

export default function Resources() {
    const containerRef = useRef(null);
    const { language } = useLanguage();
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

    const allItems = getSortedResources(); // altijd nieuwste eerst
    // Enkel categorieën tonen die effectief een post hebben, geen lege filters.
    const usedCategoryKeys = [...new Set(allItems.map((r) => r.category))];
    const filteredItems = activeCategory === 'all'
        ? allItems
        : allItems.filter((r) => r.category === activeCategory);
    const items = sortOrder === 'newest' ? filteredItems : [...filteredItems].reverse();

    // Titel, subtitel en inschrijfblok animeren één keer bij het laden van de
    // pagina. Los van de kaarten-animatie, zodat filteren of sorteren ze niet
    // opnieuw laat "herladen".
    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(
                '.hero-stagger',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
            );
        }, containerRef);

        return () => ctx.revert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Kaarten animeren bij elke wijziging van de getoonde lijst (taal, filter,
    // sortering), onafhankelijk van de hero hierboven.
    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.utils.toArray('.resource-card').forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { y: 24, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        delay: (i % 4) * 0.05,
                        // Triggert zodra de kaart het scherm binnenkomt (onderaan),
                        // zodat de inhoud op tijd zichtbaar is en niet "leeg" lijkt.
                        scrollTrigger: { trigger: card, start: 'top bottom-=40' },
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, [language, activeCategory, sortOrder]);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">

            <Seo
                title={language === 'nl' ? 'Resources | TriaCore AI' : 'Resources | TriaCore AI'}
                description={language === 'nl'
                    ? "Gratis AI-kennis voor bedrijven: betere prompts schrijven, het juiste model kiezen en AI slim inzetten. Praktisch en in gewone taal."
                    : "Free AI knowledge for businesses: writing better prompts, choosing the right model and using AI smartly. Practical and in plain language."}
            />

            {/* NOISE OVERLAY */}
            <svg className="noise-overlay pointer-events-none fixed inset-0 z-50 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            <Navbar />

            {/* GRID BACKGROUND */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.02] z-0"
                style={{
                    backgroundImage: `linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)`,
                    backgroundSize: '4rem 4rem',
                }}
            />

            <div className="relative z-10">
                {/* HERO SECTION */}
                <section className="relative pt-48 pb-12 px-6 md:px-16 overflow-hidden flex flex-col items-center justify-start">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className="hero-stagger inline-flex items-center mb-6 px-4 py-1.5 rounded-lg border border-accent/20 bg-accent/5 font-mono uppercase tracking-[0.15em] text-xs md:text-sm font-bold text-accent">
                            <span className="text-accent/40">[</span>
                            {language === 'nl' ? 'GRATIS RESOURCES' : 'FREE RESOURCES'}
                            <span className="text-accent/40">]</span>
                        </span>
                        <h1 className="hero-stagger font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6 text-foreground">
                            Resources
                        </h1>
                        <p className="hero-stagger max-w-2xl text-lg md:text-xl text-foreground/60 mb-10 font-light leading-relaxed mx-auto">
                            {language === 'nl'
                                ? 'Duik in praktische gidsen, promptvoorbeelden en ideeën. Onze kennis over AI, open en gratis gedeeld.'
                                : 'Dive into practical guides, prompt examples and ideas. Our knowledge of AI, shared openly and for free.'}
                        </p>
                        <div className="hero-stagger">
                            <NewsletterSignup variant="inline" hideInvite size="sm" />
                        </div>

                        <div className="hero-stagger mt-8 flex flex-wrap items-center justify-center gap-2">
                            <FilterPill active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
                                {language === 'nl' ? 'Alles' : 'All'}
                            </FilterPill>
                            {usedCategoryKeys.map((key) => (
                                <FilterPill
                                    key={key}
                                    active={activeCategory === key}
                                    onClick={() => setActiveCategory(key)}
                                >
                                    {CATEGORIES[key] ? CATEGORIES[key][language] : key}
                                </FilterPill>
                            ))}

                            {/* Op mobiel staan de twee filtergroepen dicht op elkaar door de
                                flex-wrap, dus krijgen ze daar een eigen, volle breedte lijntje.
                                Vanaf 'sm' is er ruimte genoeg en volstaat de verticale streep. */}
                            <div className="w-full h-px my-1.5 bg-foreground/10 sm:hidden" aria-hidden="true" />
                            <span className="hidden sm:block mx-1 h-4 w-px bg-foreground/15" aria-hidden="true" />

                            <FilterPill active={sortOrder === 'newest'} onClick={() => setSortOrder('newest')}>
                                {language === 'nl' ? 'Nieuwste eerst' : 'Newest first'}
                            </FilterPill>
                            <FilterPill active={sortOrder === 'oldest'} onClick={() => setSortOrder('oldest')}>
                                {language === 'nl' ? 'Oudste eerst' : 'Oldest first'}
                            </FilterPill>
                        </div>
                    </div>
                </section>

                {/* GRID SECTION */}
                <section className="relative px-6 md:px-16 pb-32">
                    <div className="max-w-7xl mx-auto">
                        {items.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                {items.map((resource) => (
                                    <ResourceCard key={resource.slug} resource={resource} language={language} />
                                ))}
                            </div>
                        ) : (
                            <div className="max-w-xl mx-auto text-center py-24 border border-dashed border-foreground/15 rounded-[2rem]">
                                <p className="font-serif text-2xl md:text-3xl text-foreground/70 mb-3">
                                    {language === 'nl' ? 'Binnenkort meer' : 'More coming soon'}
                                </p>
                                <p className="text-foreground/50 font-light">
                                    {language === 'nl'
                                        ? 'We werken aan de eerste resources. Kom binnenkort terug.'
                                        : 'We are working on the first resources. Check back soon.'}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}
