import React, { useEffect, useRef } from 'react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { AutoImage } from '../components/ui/auto-image';
import Seo from '../components/ui/seo';

gsap.registerPlugin(ScrollTrigger);

const TEAM_DATA = {
    nl: [
        {
            name: "Rian Mathijs",
            role: "Sales & Klantrelaties",
            image: "/team/rian",
            p1: "Rian is het eerste aanspreekpunt voor onze klanten en bewaakt de volledige samenwerking van begin tot eind. Met een sterke focus op duidelijke communicatie en lange termijnrelaties zorgt hij ervoor dat verwachtingen, doelstellingen en uitvoering perfect op elkaar afgestemd blijven.",
            p2: "Hij vertaalt bedrijfsuitdagingen naar concrete trajecten en bewaakt de strategische lijn tijdens het volledige project. Voor onze klanten is hij het vaste referentiepunt dat structuur en overzicht brengt.",
            linkedin: "https://www.linkedin.com/in/rian-mathijs-6a4350356/",
            email: "rian.mathijs@triacore.be",
            phone: "0499 87 46 62"
        },
        {
            name: "Lucas Curto",
            role: "Operationeel & Technische Architectuur",
            image: "/team/lucas",
            p1: "Lucas staat in voor de technische uitwerking binnen TriaCore AI. Hij ontwerpt schaalbare architecturen die organisaties helpen groeien zonder hun systemen telkens te moeten herdenken.",
            p2: "Bedrijfsprocessen vertaalt hij naar efficiënte AI-oplossingen en automatisaties, met focus op stabiliteit, overzicht en toekomstbestendigheid.",
            linkedin: "https://www.linkedin.com/in/lucas-curto-67555a377/",
            email: "lucas.curto@triacore.be",
            phone: "0468 27 50 82"
        },

    ],
    en: [
        {
            name: "Rian Mathijs",
            role: "Sales & Client Relations",
            image: "/team/rian",
            p1: "Rian is the first point of contact for our clients and oversees the entire collaboration from start to finish. With a strong focus on clear communication and long-term relationships, he ensures that expectations, goals, and execution are perfectly aligned.",
            p2: "He translates business challenges into concrete trajectories and monitors the strategic line throughout the entire project. For our clients, he is the fixed point of reference that brings structure and overview.",
            linkedin: "https://www.linkedin.com/in/rian-mathijs-6a4350356/",
            email: "rian.mathijs@triacore.be",
            phone: "0499 87 46 62"
        },
        {
            name: "Lucas Curto",
            role: "Operations & Technical Architecture",
            image: "/team/lucas",
            p1: "Lucas is responsible for the technical realization within TriaCore AI. He designs scalable architectures that help organizations grow without having to rethink their systems every time.",
            p2: "He translates business processes into efficient AI solutions and automations, focusing on stability, overview, and future-proofing.",
            linkedin: "https://www.linkedin.com/in/lucas-curto-67555a377/",
            email: "lucas.curto@triacore.be",
            phone: "0468 27 50 82"
        },

    ]
};

export default function Team() {
    const { language } = useLanguage();
    const containerRef = useRef(null);
    const teamMembers = TEAM_DATA[language];

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Hero animation
            gsap.fromTo(
                '.hero-stagger',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: 'power3.out',
                    delay: 0.2
                }
            );

            // Card animations (smooth reveal)
            const teamCards = gsap.utils.toArray('.team-card');
            teamCards.forEach((el) => {
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 100, scale: 0.98 },
                    {
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        },
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1.2,
                        ease: 'power3.out'
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">

            <Seo
                title={language === 'nl' ? 'Ons team | TriaCore AI' : 'Our team | TriaCore AI'}
                description={language === 'nl'
                    ? 'Maak kennis met het team achter TriaCore AI. Rian bewaakt de samenwerking van begin tot eind, Lucas vertaalt uw processen naar schaalbare software en AI-oplossingen.'
                    : 'Meet the team behind TriaCore AI. Rian oversees the collaboration from start to finish, Lucas translates your processes into scalable software and AI solutions.'}
            />

            {/* NOISE OVERLAY */}
            <svg className="noise-overlay pointer-events-none fixed inset-0 z-50 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            <Navbar />

            {/* GLOBAL GRID BACKGROUND (architectural style like homepage) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" 
                 style={{
                   backgroundImage: `linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)`,
                   backgroundSize: '4rem 4rem',
                 }}>
            </div>

            <div className="relative z-10">
                {/* HERO SECTION */}
                <section className="relative pt-48 pb-12 px-6 md:px-16 overflow-hidden flex flex-col items-center justify-start">
                    <div className="max-w-5xl mx-auto text-center scroll-animate">
                        <span className="hero-stagger inline-flex items-center mb-6 px-4 py-1.5 rounded-lg border border-accent/20 bg-accent/5 font-mono uppercase tracking-[0.15em] text-xs md:text-sm font-bold text-accent">
                            <span className="text-accent/40">[</span>TEAM<span className="text-accent/40">]</span>
                        </span>
                        <h1 className="hero-stagger font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6 text-foreground">
                            {language === 'nl' ? 'Klein team. Grote impact.' : 'Small team. Big impact.'}
                        </h1>
                        <p className="hero-stagger max-w-2xl text-lg md:text-xl text-foreground/60 mb-8 font-light leading-relaxed mx-auto">
                            {language === 'nl' ? 'Maak kennis met het team achter TriaCore AI.' : 'Meet the team behind TriaCore AI.'}
                        </p>
                    </div>
                </section>

                {/* STACKING TEAM CARDS */}
                <section className="px-6 md:px-16 pb-40 relative z-10 max-w-7xl mx-auto w-full">
                    <div className="space-y-24">
                        {teamMembers.map((member, i) => (
                            <div
                                key={i}
                                className="team-card relative mb-12 md:mb-24 bg-white/70 backdrop-blur-xl border border-foreground/5 shadow-2xl shadow-foreground/[0.03] rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row items-stretch"
                            >
                                {/* Photo - Stack on md, side-by-side on lg */}
                                <div className="w-full lg:w-[40%] aspect-[4/5] overflow-hidden">
                                    <AutoImage
                                        basePath={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Text - Stack on md, side-by-side on lg */}
                                <div className="w-full lg:w-[60%] p-10 md:p-14 lg:p-16 flex flex-col justify-center scroll-animate">
                                    <div className="mb-8">
                                        <div className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-3">
                                            {member.role}
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground">
                                            {member.name}
                                        </h2>
                                    </div>
                                    <div className="space-y-6 text-lg text-foreground/70 leading-relaxed font-light mb-10">
                                        <p>{member.p1}</p>
                                        <p>{member.p2}</p>
                                    </div>

                                    {/* CONTACT INFO */}
                                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-10 border-t border-foreground/5">
                                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground/60 hover:text-accent transition-all group">
                                            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-accent/10">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                            </div>
                                            <span className="text-sm font-medium tracking-tight">LinkedIn</span>
                                        </a>
                                        <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-foreground/60 hover:text-accent transition-all group">
                                            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-accent/10">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                            </div>
                                            <span className="text-sm font-medium tracking-tight">{member.email}</span>
                                        </a>
                                        <a href={`tel:${member.phone.replace(/ /g, '')}`} className="flex items-center gap-3 text-foreground/60 hover:text-accent transition-all group">
                                            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-accent/10">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                            </div>
                                            <span className="text-sm font-medium tracking-tight">{member.phone}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}
