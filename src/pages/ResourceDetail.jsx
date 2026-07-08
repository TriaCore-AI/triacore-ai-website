import React, { useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowDown } from 'lucide-react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import CTAButton from '../components/ui/cta-button';
import Seo from '../components/ui/seo';
import { useLanguage } from '../context/LanguageContext';
import { getResourceBySlug, CATEGORIES, formatDate, getReadingTime } from '../data/resources';
import { ContentBlock } from '../components/content/ContentBlocks';
import gsap from 'gsap';

export default function ResourceDetail() {
    const { slug } = useParams();
    const { language } = useLanguage();
    const containerRef = useRef(null);
    const resource = getResourceBySlug(slug);

    useEffect(() => {
        if (!resource) return;
        let ctx = gsap.context(() => {
            gsap.fromTo(
                '.detail-stagger',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [resource]);

    // Onbestaande slug → terug naar overzicht.
    if (!resource) {
        return <Navigate to="/resources" replace />;
    }

    const category = CATEGORIES[resource.category];
    const readingTime = getReadingTime(resource, language);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">

            <Seo
                title={`${resource.title[language]} | TriaCore AI`}
                description={resource.description[language]}
                image={resource.thumbnail ? `https://triacore.be${resource.thumbnail}` : undefined}
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

            <div className="relative z-10 flex-1">
                <article className="max-w-3xl mx-auto px-6 md:px-8 pt-40 md:pt-48 pb-24">
                    {/* Back link */}
                    <Link
                        to="/resources"
                        className="detail-stagger inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors duration-300 mb-12"
                    >
                        <ArrowLeft size={14} />
                        {language === 'nl' ? 'Alle resources' : 'All resources'}
                    </Link>

                    {/* Header */}
                    <div className="detail-stagger flex items-center gap-4 mb-6">
                        {category && (
                            <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-accent">
                                {category[language]}
                            </span>
                        )}
                        <span className="text-foreground/30">·</span>
                        <span className="text-[12px] text-foreground/40 font-light">
                            {formatDate(resource.date, language)}
                        </span>
                        <span className="text-foreground/30">·</span>
                        <span className="text-[12px] text-foreground/40 font-light">
                            {language === 'nl' ? `${readingTime} min lezen` : `${readingTime} min read`}
                        </span>
                    </div>

                    <h1 className="detail-stagger font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-foreground mb-8">
                        {resource.title[language]}
                    </h1>

                    <p className={`detail-stagger text-xl text-foreground/60 font-light leading-relaxed ${resource.headerCta ? 'mb-7' : 'mb-12 pb-12 border-b border-foreground/10'}`}>
                        {resource.description[language]}
                    </p>

                    {resource.headerCta && (
                        <div className="detail-stagger mb-12 pb-12 border-b border-foreground/10">
                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .getElementById(resource.headerCta.target)
                                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                }
                                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-accent text-white text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/25"
                            >
                                {resource.headerCta[language]}
                                <ArrowDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                            </button>
                        </div>
                    )}

                    {/* Content blocks */}
                    <div className="detail-stagger">
                        {resource.blocks.map((block, i) => (
                            <ContentBlock key={i} block={block} language={language} />
                        ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-20 pt-12 border-t border-foreground/10 text-center">
                        <p className="font-serif text-2xl md:text-3xl text-foreground mb-3">
                            {language === 'nl'
                                ? 'Hier verder over praten?'
                                : 'Want to take this further?'}
                        </p>
                        <p className="text-foreground/55 font-light mb-8 max-w-lg mx-auto">
                            {language === 'nl'
                                ? 'Wilt u dit toepassen in uw eigen bedrijf of er dieper op ingaan? Plan gerust een gesprek, we denken graag met u mee.'
                                : 'Want to apply this in your own company or dig deeper? Book a call, we are happy to think along.'}
                        </p>
                        <div className="flex justify-center">
                            <CTAButton to="/contact" variant="primary">
                                {language === 'nl' ? 'Plan een gesprek' : 'Book a call'}
                            </CTAButton>
                        </div>
                    </div>
                </article>
            </div>

            <Footer />
        </div>
    );
}
