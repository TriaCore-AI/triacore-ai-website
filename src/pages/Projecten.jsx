import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import CTAButton from '../components/ui/cta-button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { projecten } from '../data/projecten';
import Seo from '../components/ui/seo';

gsap.registerPlugin(ScrollTrigger);

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

function ProjectThumbnail({ project }) {
    return (
        <div className="relative w-full aspect-square overflow-hidden bg-slate-100 flex items-center justify-center p-10 md:p-12">
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 border border-foreground/10 text-[11px] font-bold uppercase tracking-wider text-foreground/70">
                {project.client}
            </span>
            <img src={project.logo} alt={project.client} className="max-h-20 md:max-h-24 w-auto object-contain" />
        </div>
    );
}

function ProjectCard({ project, language }) {
    const isLive = project.status === 'live';

    const cardClasses = `project-card group flex flex-col bg-white border rounded-[1.5rem] overflow-hidden transition-all duration-500 ${
        isLive
            ? 'border-foreground/10 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-foreground/5 hover:border-accent/40'
            : 'border-dashed border-foreground/15 opacity-70 hover:opacity-90 hover:border-foreground/30'
    }`;

    const body = isLive ? (
        <>
            <ProjectThumbnail project={project} />
            <div className="flex flex-col flex-1 p-6">
                <span className="uppercase tracking-[0.2em] text-[10px] font-bold mb-4 text-accent">
                    {project.sector[language]}
                </span>

                <h3 className="font-serif text-xl md:text-2xl leading-snug tracking-tight text-foreground mb-3">
                    {withCleanAmpersand(project.title[language])}
                </h3>

                <p className="text-sm text-foreground/55 font-light leading-relaxed line-clamp-3 mb-6">
                    {project.description[language]}
                </p>

                <span className="mt-auto inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground/70 group-hover:text-accent transition-colors duration-300">
                    {language === 'nl' ? 'Lees de case' : 'Read the case'}
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
            </div>
        </>
    ) : (
        <>
            <ProjectThumbnail project={project} />
            <div className="flex flex-col flex-1 items-center justify-center p-6 text-center">
                <span className="uppercase tracking-[0.2em] text-[10px] font-bold mb-3 text-foreground/40">
                    {project.client}
                </span>
                <p className="font-serif text-xl md:text-2xl tracking-tight text-foreground/60">
                    {language === 'nl' ? 'Binnenkort beschikbaar' : 'Coming soon'}
                </p>
            </div>
        </>
    );

    return (
        <Link to={`/projecten/${project.slug}`} className={cardClasses}>
            {body}
        </Link>
    );
}

export default function Projecten() {
    const containerRef = useRef(null);
    const { language } = useLanguage();

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(
                '.hero-stagger',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
            );

            gsap.utils.toArray('.project-card').forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { y: 24, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        delay: (i % 4) * 0.05,
                        scrollTrigger: { trigger: card, start: 'top bottom-=40' },
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, [language]);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">

            <Seo
                title={language === 'nl' ? 'Projecten | TriaCore AI' : 'Projects | TriaCore AI'}
                description={language === 'nl'
                    ? 'Ontdek hoe bedrijven als Croes NV en A&M Group hun administratie en processen optimaliseerden met TriaCore AI. Concrete klantcases met meetbaar resultaat.'
                    : 'Discover how companies like Croes NV and A&M Group optimized their administration and processes with TriaCore AI. Concrete client cases with measurable results.'}
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

            <div className="relative z-10 flex flex-col flex-1">
                {/* HERO SECTION */}
                <section className="relative pt-48 pb-12 px-6 md:px-16 overflow-hidden flex flex-col items-center justify-start">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className="hero-stagger inline-flex items-center mb-6 px-4 py-1.5 rounded-lg border border-accent/20 bg-accent/5 font-mono uppercase tracking-[0.15em] text-xs md:text-sm font-bold text-accent">
                            <span className="text-accent/40">[</span>
                            {language === 'nl' ? 'PROJECTEN' : 'PROJECTS'}
                            <span className="text-accent/40">]</span>
                        </span>
                        <h1 className="hero-stagger font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6 text-foreground">
                            {language === 'nl' ? 'Onze projecten.' : 'Our projects.'}
                        </h1>
                        <p className="hero-stagger max-w-2xl text-lg md:text-xl text-foreground/60 mb-10 font-light leading-relaxed mx-auto">
                            {language === 'nl'
                                ? 'Een goede partner denkt mee: deze projecten zijn samen met klanten tot stand gekomen.'
                                : 'A good partner thinks along: these projects came to life together with our clients.'}
                        </p>
                        <div className="hero-stagger flex flex-wrap gap-6 items-center justify-center">
                            <CTAButton to="/contact" variant="primary" size="sm">
                                {language === 'nl' ? 'Plan een gesprek' : 'Book a call'}
                            </CTAButton>
                        </div>
                    </div>
                </section>

                {/* GRID SECTION */}
                <section className="relative px-6 md:px-16 pb-32 flex-1">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {projecten.map((project) => (
                                <ProjectCard key={project.slug} project={project} language={language} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}
