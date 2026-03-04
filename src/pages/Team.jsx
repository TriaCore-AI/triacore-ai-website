import React, { useEffect, useRef } from 'react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { AutoImage } from '../components/ui/auto-image';

gsap.registerPlugin(ScrollTrigger);

const TEAM_DATA = {
    nl: [
        {
            name: "Rian Mathijs",
            role: "Sales & Klantrelaties",
            image: "/team/rian",
            p1: "Rian is het eerste aanspreekpunt voor onze klanten en bewaakt de volledige samenwerking van begin tot eind. Met een sterke focus op duidelijke communicatie en lange termijnrelaties zorgt hij ervoor dat verwachtingen, doelstellingen en uitvoering perfect op elkaar afgestemd blijven.",
            p2: "Hij vertaalt bedrijfsuitdagingen naar concrete trajecten en bewaakt de strategische lijn tijdens het volledige project. Voor onze klanten is hij het vaste referentiepunt dat structuur en overzicht brengt."
        },
        {
            name: "Lucas Curto",
            role: "Operationeel & Technische Architectuur",
            image: "/team/lucas",
            p1: "Lucas staat in voor de technische uitwerking binnen TriaCore AI. Hij ontwerpt schaalbare architecturen die organisaties helpen groeien zonder hun systemen telkens te moeten herdenken.",
            p2: "Bedrijfsprocessen vertaalt hij naar efficiënte AI-oplossingen en automatisaties, met focus op stabiliteit, overzicht en toekomstbestendigheid."
        },
        {
            name: "Staf Wynants",
            role: "Marketing & Positionering",
            image: "/team/staf",
            p1: "Staf zorgt ervoor dat strategie en technologie ook helder en krachtig naar buiten worden gebracht. Hij vertaalt technische oplossingen naar begrijpbare communicatie en visuele helderheid.",
            p2: "Van merkpositionering tot projectdocumentatie en visuele uitwerking: hij zorgt ervoor dat elke oplossing niet alleen functioneert, maar ook professioneel gepresenteerd wordt."
        }
    ],
    en: [
        {
            name: "Rian Mathijs",
            role: "Sales & Client Relations",
            image: "/team/rian",
            p1: "Rian is the first point of contact for our clients and oversees the entire collaboration from start to finish. With a strong focus on clear communication and long-term relationships, he ensures that expectations, goals, and execution are perfectly aligned.",
            p2: "He translates business challenges into concrete trajectories and monitors the strategic line throughout the entire project. For our clients, he is the fixed point of reference that brings structure and overview."
        },
        {
            name: "Lucas Curto",
            role: "Operations & Technical Architecture",
            image: "/team/lucas",
            p1: "Lucas is responsible for the technical realization within TriaCore AI. He designs scalable architectures that help organizations grow without having to rethink their systems every time.",
            p2: "He translates business processes into efficient AI solutions and automations, focusing on stability, overview, and future-proofing."
        },
        {
            name: "Staf Wynants",
            role: "Marketing & Positioning",
            image: "/team/staf",
            p1: "Staf ensures that strategy and technology are also communicated clearly and powerfully to the outside world. He translates technical solutions into understandable communication and visual clarity.",
            p2: "From brand positioning to project documentation and visual execution: he ensures that every solution not only functions but is also professionally presented."
        }
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

            // Card animations (optional but nice)
            const scrollElements = gsap.utils.toArray('.team-card, .scroll-animate');
            scrollElements.forEach((el) => {
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 50 },
                    {
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 90%',
                            toggleActions: 'play none none none'
                        },
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out'
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">

            {/* NOISE OVERLAY */}
            <svg className="noise-overlay pointer-events-none fixed inset-0 z-50 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            <Navbar />

            {/* HERO SECTION (Grid Background) */}
            <section className="relative pt-64 pb-32 px-6 md:px-16 overflow-hidden bg-background min-h-[50dvh] flex flex-col justify-center">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute left-1/4 top-0 w-px h-full bg-foreground"></div>
                    <div className="absolute left-2/4 top-0 w-px h-full bg-foreground"></div>
                    <div className="absolute left-3/4 top-0 w-px h-full bg-foreground"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-foreground"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <h1 className="hero-stagger text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight font-semibold mb-6 text-foreground">
                        Team
                    </h1>
                    <p className="hero-stagger text-xl md:text-2xl font-medium text-foreground/70 tracking-tight max-w-2xl mx-auto">
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
                            className="team-card relative mb-12 md:mb-24 bg-white rounded-[2.5rem] border border-foreground/5 shadow-2xl shadow-foreground/[0.03] overflow-hidden flex flex-col lg:flex-row items-stretch"
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
                                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
                                        {member.name}
                                    </h2>
                                </div>
                                <div className="space-y-6 text-lg text-foreground/70 leading-relaxed font-light">
                                    <p>{member.p1}</p>
                                    <p>{member.p2}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
