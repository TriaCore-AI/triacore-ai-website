import React, { useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import CTAButton from '../components/ui/cta-button';
import Seo from '../components/ui/seo';
import { useLanguage } from '../context/LanguageContext';
import { getAnyProjectBySlug } from '../data/projecten';
import { ContentBlock } from '../components/content/ContentBlocks';
import gsap from 'gsap';

// Playfair Display's staande "&" oogt zwaar/gedrongen — in DM Sans (de
// site's eigen sans) is die veel cleaner. Enkel toegepast waar tekst in
// font-serif wordt getoond.
function withCleanAmpersand(text) {
    return text.split('&').map((part, i, arr) =>
        i < arr.length - 1 ? (
            <React.Fragment key={i}>
                {part}
                <span className="font-sans">&amp;</span>
            </React.Fragment>
        ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
        )
    );
}

export default function ProjectDetail() {
    const { slug } = useParams();
    const { language } = useLanguage();
    const containerRef = useRef(null);
    const project = getAnyProjectBySlug(slug);

    useEffect(() => {
        if (!project) return;
        let ctx = gsap.context(() => {
            gsap.fromTo(
                '.detail-stagger',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [project]);

    // Onbestaande of nog niet beschikbare slug → terug naar overzicht.
    if (!project) {
        return <Navigate to="/projecten" replace />;
    }

    return (
        <div ref={containerRef} className="relative min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">

            <Seo
                title={`${project.title[language]} | TriaCore AI`}
                description={project.description[language]}
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
                        to="/projecten"
                        className="detail-stagger inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors duration-300 mb-12"
                    >
                        <ArrowLeft size={14} />
                        {language === 'nl' ? 'Alle projecten' : 'All projects'}
                    </Link>

                    {/* Header */}
                    <div className="detail-stagger flex items-center gap-4 mb-6">
                        <img src={project.logo} alt={project.client} className="h-7 w-auto object-contain" />
                        <span className="text-foreground/30">·</span>
                        <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-accent">
                            {project.sector[language]}
                        </span>
                    </div>

                    {project.status === 'soon' ? (
                        /* Nog geen case, enkel een duidelijke statusmelding — geen uitleg vooruitlopen. */
                        <div className="detail-stagger py-16 md:py-20 text-center border-y border-foreground/10">
                            <p className="font-serif text-4xl md:text-5xl tracking-tight text-foreground">
                                {language === 'nl' ? 'Binnenkort beschikbaar' : 'Coming soon'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <h1 className="detail-stagger font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.08] tracking-tight text-foreground mb-8">
                                {withCleanAmpersand(project.title[language])}
                            </h1>

                            <p className="detail-stagger text-xl text-foreground/60 font-light leading-relaxed mb-12 pb-12 border-b border-foreground/10">
                                {project.description[language]}
                            </p>

                            {/* Content blocks — zelfde bloksysteem als resources */}
                            <div className="detail-stagger">
                                {(project.blocks || []).map((block, i) => (
                                    <ContentBlock key={i} block={block} language={language} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Footer CTA */}
                    <div className="mt-20 pt-12 border-t border-foreground/10 text-center">
                        <p className="font-serif text-2xl md:text-3xl text-foreground mb-3">
                            {language === 'nl' ? 'Ook processen die vastlopen?' : 'Also dealing with stuck processes?'}
                        </p>
                        <p className="text-foreground/55 font-light mb-8 max-w-lg mx-auto">
                            {language === 'nl'
                                ? 'Plan een gesprek en we denken vrijblijvend met u mee.'
                                : 'Book a call and we will think along, no strings attached.'}
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
