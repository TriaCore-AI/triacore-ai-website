import React, { useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import CTAButton from '../components/ui/cta-button';
import Seo from '../components/ui/seo';
import { useLanguage } from '../context/LanguageContext';
import { getAnyProjectBySlug } from '../data/projecten';
import { ContentBlock } from '../components/content/ContentBlocks';

// Een casepagina, in de nieuwe stijl. Eén leeskolom, gecentreerd op het scherm, met de tekst links
// uitgelijnd. Bovenaan logo en sector, dan de titel groot in de titelletter, de korte samenvatting,
// en de tekstblokken van de case. Onderaan een rustige oproep.
export default function ProjectDetail() {
    const { slug } = useParams();
    const { language } = useLanguage();
    const nl = language === 'nl';
    const ref = useRef(null);
    const project = getAnyProjectBySlug(slug);

    // Binnenkomst: de titel onthult zich van links naar rechts, de rest komt zacht op
    useEffect(() => {
        if (!project) return;
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const tl = gsap.timeline({ paused: true });
            tl.from('.detail-fade-top', { y: 10, opacity: 0, duration: 1.2, ease: 'power2.out', stagger: 0.1 })
                .fromTo('.detail-title',
                    { clipPath: 'inset(-20% 100% -35% -5%)', x: -16 },
                    { clipPath: 'inset(-20% -5% -35% -5%)', x: 0, duration: 1.8, ease: 'power2.inOut', clearProps: 'clipPath' }, 0.2)
                .from('.detail-fade', { y: 12, opacity: 0, duration: 1.4, ease: 'power2.out', stagger: 0.12 }, 1.1);
            const play = () => tl.play();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
            else play();
        }, ref);
        return () => ctx.revert();
    }, [project, language]);

    // Onbestaande slug: terug naar het overzicht
    if (!project) {
        return <Navigate to="/projecten" replace />;
    }

    return (
        <div ref={ref} className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo title={`${project.title[language]} | TriaCore AI`} description={project.description[language]} />
            <Navbar />

            <main className="relative flex-grow px-6 md:px-16 lg:px-24 pt-36 md:pt-44 pb-16 md:pb-24">
                {/* De leeskolom staat gecentreerd op het scherm, de tekst erin links uitgelijnd */}
                <div className="max-w-3xl mx-auto">
                    <Link
                        to="/projecten"
                        className="detail-fade-top group inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-accent transition-colors duration-300"
                    >
                        <ArrowLeft size={16} strokeWidth={1.75} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                        {nl ? 'Alle projecten' : 'All projects'}
                    </Link>

                    <div className="detail-fade-top mt-12 flex items-center gap-4">
                        <img src={project.logo} alt={project.client} className="h-10 w-auto max-w-[140px] object-contain mix-blend-multiply" />
                        <span className="text-sm text-foreground/50">{project.client} · {project.sector[language]}</span>
                    </div>

                    <article>
                        {project.status === 'soon' ? (
                            <p className="detail-title mt-10 hero-title text-foreground text-4xl md:text-6xl leading-[1.05]">
                                {nl ? 'Binnenkort beschikbaar.' : 'Coming soon.'}
                            </p>
                        ) : (
                            <>
                                <h1 className="detail-title mt-10 hero-title text-foreground text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                                    {project.title[language]}
                                </h1>
                                <p className="detail-fade mt-8 text-xl md:text-2xl text-foreground/70 leading-relaxed">
                                    {project.description[language]}
                                </p>
                                <div className="detail-fade mt-14 pt-14 border-t border-foreground/15">
                                    {(project.blocks || []).map((block, i) => (
                                        <ContentBlock key={i} block={block} language={language} theme="nieuw" />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Rustige oproep onderaan */}
                        <div className="mt-20 pt-14 border-t border-foreground/15">
                            <p className="hero-title text-foreground text-3xl md:text-4xl">
                                {nl ? 'Ook processen die vastlopen?' : 'Processes getting stuck too?'}
                            </p>
                            <p className="mt-4 text-lg text-foreground/60 leading-relaxed max-w-lg">
                                {nl ? 'Plan een gesprek en we denken vrijblijvend met u mee.' : 'Book a call and we will think along, no strings attached.'}
                            </p>
                            <div className="mt-8">
                                <CTAButton to="/contact">{nl ? 'Plan een gesprek' : 'Book a call'}</CTAButton>
                            </div>
                        </div>
                    </article>
                </div>
            </main>
            <Footer />
        </div>
    );
}
