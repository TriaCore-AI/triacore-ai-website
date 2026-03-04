import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/ui/navbar';
import { useLanguage } from '../context/LanguageContext';
import { AutoImage, useAutoImage } from '../components/ui/auto-image';

import IntegrationGrid from '../components/ui/integration-grid';
import AiCalculator from '../components/ui/ai-calculator';
import Footer from '../components/ui/footer';

gsap.registerPlugin(ScrollTrigger);

const AGENTS_DATA = {
    nl: [
        {
            name: "Mail & Agenda Agent",
            image: "/agents/inboxmanager",
            description: "Brengt rust in je inbox en structuur in je agenda.",
            doet: [
                "Sorteert en prioriteert e-mails automatisch",
                "Detecteert acties en zet ze om in taken",
                "Plant afspraken op basis van beschikbaarheid",
                "Herinnert aan belangrijke opvolgingen"
            ]
        },
        {
            name: "Flow Agent",
            image: "/agents/operations%20agent",
            description: "Laat interne processen automatisch samenwerken.",
            doet: [
                "Verbindt werkstromen tussen teams",
                "Stuurt taken automatisch door",
                "Bewaakt deadlines en opvolging",
                "Vermindert manuele administratie"
            ]
        },
        {
            name: "Docs & Admin Agent",
            image: "/agents/notulist",
            description: "Structureert documenten en administratieve taken.",
            doet: [
                "Verwerkt inkomende documenten automatisch",
                "Vat documenten samen",
                "Classificeert en archiveert correct",
                "Maakt administratie overzichtelijk en doorzoekbaar"
            ]
        },
        {
            name: "Insights Agent",
            image: "/agents/data%20analist",
            description: "Zet cijfers om in heldere inzichten.",
            doet: [
                "Maakt automatische rapporten",
                "Analyseert prestaties",
                "Detecteert trends en afwijkingen",
                "Geeft concrete aanbevelingen"
            ]
        },
        {
            name: "Support Agent",
            image: "/agents/klantenheld",
            description: "Beantwoordt klantvragen snel en consistent.",
            doet: [
                "Verwerkt binnenkomende vragen",
                "Geeft directe antwoorden op veelgestelde vragen",
                "Vat gesprekken samen",
                "Schakelt complexe vragen door"
            ]
        },
        {
            name: "CRM Agent",
            image: "/agents/CRM%20specialist",
            description: "Houdt klantinformatie gestructureerd en up-to-date.",
            doet: [
                "Beheert contactgegevens",
                "Registreert interacties automatisch",
                "Houdt opvolging bij",
                "Geeft overzicht per klant of dossier"
            ]
        },
        {
            name: "Sales Agent",
            image: "/agents/business%20analist",
            description: "Ondersteunt je verkoopproces met automatische opvolging.",
            doet: [
                "Volgt leads automatisch op",
                "Herinnert aan offertes en opvolgmomenten",
                "Structureert het verkooptraject",
                "Geeft inzicht in openstaande opportuniteiten"
            ]
        },
        {
            name: "Marketing Agent",
            image: "/agents/strategisch%20analist",
            description: "Zorgt voor consistente marketing die blijft draaien.",
            doet: [
                "Plant en publiceert content",
                "Volgt leads op vanuit campagnes",
                "Analyseert marketingprestaties",
                "Geeft optimalisatiesuggesties"
            ]
        }
    ],
    en: [
        {
            name: "Mail & Agenda Agent",
            image: "/agents/inboxmanager",
            description: "Brings peace to your inbox and structure to your schedule.",
            doet: [
                "Automatically sorts and prioritizes emails",
                "Detects actions and converts them into tasks",
                "Schedules appointments based on availability",
                "Reminds you of important follow-ups"
            ]
        },
        {
            name: "Flow Agent",
            image: "/agents/operations%20agent",
            description: "Makes internal processes work together automatically.",
            doet: [
                "Connects workflows across teams",
                "Automatically forwards tasks",
                "Monitors deadlines and follow-ups",
                "Reduces manual administration"
            ]
        },
        {
            name: "Docs & Admin Agent",
            image: "/agents/notulist",
            description: "Structures documents and administrative tasks.",
            doet: [
                "Automatically processes incoming documents",
                "Summarizes documents",
                "Classifies and archives correctly",
                "Makes administration clear and searchable"
            ]
        },
        {
            name: "Insights Agent",
            image: "/agents/data%20analist",
            description: "Turns numbers into clear insights.",
            doet: [
                "Creates automatic reports",
                "Analyzes performance",
                "Detects trends and anomalies",
                "Provides concrete recommendations"
            ]
        },
        {
            name: "Support Agent",
            image: "/agents/klantenheld",
            description: "Answers customer questions quickly and consistently.",
            doet: [
                "Processes incoming questions",
                "Provides direct answers to frequently asked questions",
                "Summarizes conversations",
                "Forwards complex questions"
            ]
        },
        {
            name: "CRM Agent",
            image: "/agents/CRM%20specialist",
            description: "Keeps customer information structured and up-to-date.",
            doet: [
                "Manages contact details",
                "Automatically logs interactions",
                "Tracks follow-ups",
                "Provides an overview per customer or file"
            ]
        },
        {
            name: "Sales Agent",
            image: "/agents/business%20analist",
            description: "Supports your sales process with automated follow-ups.",
            doet: [
                "Automatically follows up on leads",
                "Reminds you of quotes and follow-up moments",
                "Structures the sales funnel",
                "Provides insight into open opportunities"
            ]
        },
        {
            name: "Marketing Agent",
            image: "/agents/strategisch%20analist",
            description: "Ensures consistent marketing that keeps running.",
            doet: [
                "Plans and publishes content",
                "Follows up on leads from campaigns",
                "Analyzes marketing performance",
                "Provides optimization suggestions"
            ]
        }
    ]
};


export default function AiAgents() {
    const { language } = useLanguage();
    const containerRef = useRef(null);
    const [activeAgentIdx, setActiveAgentIdx] = useState(0);

    // Derived state so it updates when language changes
    const AGENTS = AGENTS_DATA[language];
    const activeAgent = AGENTS[activeAgentIdx];
    const heroFinalImg = useAutoImage('/media/ai_agents_hero_final', ['webp', 'png', 'jpg', 'jpeg']);

    const handleNext = () => setActiveAgentIdx((prev) => (prev + 1) % AGENTS.length);
    const handlePrev = () => setActiveAgentIdx((prev) => (prev - 1 + AGENTS.length) % AGENTS.length);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(
                '.hero-animate',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.1 }
            );

            gsap.fromTo(
                '.spotlight-container',
                { y: 60, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: '#agents-spotlight',
                        start: 'top 80%',
                    },
                    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out'
                }
            );

            // Scroll animations for cards and other elements
            const scrollElements = gsap.utils.toArray('.scroll-card, .scroll-animate');
            scrollElements.forEach((el) => {
                gsap.fromTo(
                    el,
                    { y: 60, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                        },
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power3.out',
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Fade animation on switch
    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(
                '.spotlight-content',
                { opacity: 0, filter: "blur(4px)" },
                { opacity: 1, filter: "blur(0px)", duration: 0.4, ease: 'power2.out' }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [activeAgentIdx]);

    return (
        <div ref={containerRef} className="relative w-full min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">

            {/* GLOBAL NOISE OVERLAY */}
            <svg className="noise-overlay pointer-events-none fixed inset-0 z-50 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            {/* NAVBAR */}
            <Navbar />

            {/* 1. HERO / HEADER SECTIE */}
            <section className="relative min-h-[80vh] w-full flex flex-col items-center justify-center pt-32 pb-16 px-6 md:px-16 bg-white overflow-hidden">

                {/* Structural Grid Background - Same as landing page */}
                <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
                    <div className="absolute left-1/4 top-0 w-px h-full bg-foreground"></div>
                    <div className="absolute left-2/4 top-0 w-px h-full bg-foreground"></div>
                    <div className="absolute left-3/4 top-0 w-px h-full bg-foreground"></div>
                    <div className="absolute top-1/3 left-0 w-full h-px bg-foreground"></div>
                    <div className="absolute top-2/3 left-0 w-full h-px bg-foreground"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
                    {/* Header Text */}
                    <div className="text-center mb-12 hero-animate">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-semibold tracking-tight text-foreground mb-6">
                            AI Agents
                        </h1>
                        <p className="text-xl md:text-2xl font-medium text-foreground/60 max-w-3xl leading-relaxed">
                            {language === 'nl'
                                ? 'Digitale collega’s die repetitief werk overnemen en naadloos samenwerken met uw team en systemen.'
                                : 'Digital colleagues that take over repetitive work and collaborate seamlessly with your team and systems.'}
                        </p>
                    </div>

                    {/* Visual Container with Liquid Glass Card Overlay */}
                    <div className="relative w-full max-w-[1100px] group">

                        {/* The Desk Photo - Clean & Sharp */}
                        <div className="rounded-[2.5rem] overflow-hidden border border-foreground/5 shadow-2xl shadow-foreground/5 bg-white">
                            <img
                                src={heroFinalImg}
                                alt="AI Agents at work"
                                className="w-full h-auto block transform transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* No spacer needed anymore to allow the grid to flow nicely */}

            {/* No spacer needed anymore to allow the gradient to flow into the dark section */}

            {/* 2. AGENT SPOTLIGHT SECTIE */}
            <section id="agents-spotlight" className="pt-24 pb-32 px-6 md:px-16 bg-dark-section text-background">
                <div className="max-w-[1400px] mx-auto">

                    <div className="text-center mb-16 hero-animate scroll-animate">
                        <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-6">
                            {language === 'nl' ? 'TriaCore AI Ecosysteem' : 'TriaCore AI Ecosystem'}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-background">
                            {language === 'nl' ? 'GEÏNTEGREERDE AI-AGENTS' : 'INTEGRATED AI AGENTS'}
                        </h2>
                        <p className="text-lg md:text-xl text-background/60 max-w-2xl mx-auto leading-relaxed mt-4">
                            {language === 'nl'
                                ? 'Ontdek welke taken onze AI-agents uit handen nemen in jouw dagelijkse werking.'
                                : 'Discover which tasks our AI agents take off your hands in your daily operations.'}
                        </p>
                    </div>

                    <div className="spotlight-container w-full max-w-[1200px] flex flex-col items-center mx-auto">

                        {/* 1) SPOTLIGHT CARD COMPONENT */}
                        <div className="relative w-full mb-16 flex items-center group">

                            {/* Previous Arrow */}
                            <button
                                onClick={handlePrev}
                                className="flex absolute left-2 md:-left-6 lg:-left-12 z-30 w-12 h-12 rounded-full bg-background/20 backdrop-blur-md border border-background/20 items-center justify-center text-background hover:text-accent hover:bg-background/30 transition-all shadow-xl hover:scale-110 active:scale-95"
                                aria-label="Previous Agent"
                            >
                                <ChevronLeft size={28} />
                            </button>

                            {/* Main Card */}
                            <div className="w-full bg-background/5 rounded-[2.5rem] overflow-hidden p-8 md:p-14 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center spotlight-content">

                                {/* Left Kant - Visual */}
                                <div className="w-full lg:w-[35%] aspect-[4/3] lg:aspect-square flex items-center justify-center overflow-hidden">
                                    {activeAgent.image ? (
                                        <AutoImage basePath={activeAgent.image} alt={activeAgent.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-background/30 text-sm font-mono tracking-widest uppercase">Visual</span>
                                    )}
                                </div>

                                {/* Rechter Kant - Info */}
                                <div className="w-full lg:w-[65%] lg:pl-16 flex flex-col">
                                    <h3 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight text-background">{activeAgent.name}</h3>
                                    <p className="text-lg md:text-xl text-background/60 mb-10 leading-relaxed font-medium">
                                        {activeAgent.description}
                                    </p>

                                    <div className="flex flex-col">
                                        {/* Wat deze agent doet */}
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-accent mb-6 flex items-center gap-2">
                                                <CheckCircle2 size={16} /> {language === 'nl' ? 'Wat deze agent doet' : 'What this agent does'}
                                            </h4>
                                            <ul className="space-y-4 max-w-xl">
                                                {activeAgent.doet.map((item, i) => (
                                                    <li key={i} className="text-sm md:text-base text-background/80 pl-6 relative before:content-[''] before:absolute before:left-0 before:top-[10px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent/80 leading-snug">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Next Arrow */}
                            <button
                                onClick={handleNext}
                                className="flex absolute right-2 md:-right-6 lg:-right-12 z-30 w-12 h-12 rounded-full bg-background/20 backdrop-blur-md border border-background/20 items-center justify-center text-background hover:text-accent hover:bg-background/30 transition-all shadow-xl hover:scale-110 active:scale-95"
                                aria-label="Next Agent"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </div>

                        {/* 2) AGENT DOCK (CLEAN SAAST STIJL) */}
                        <div className="w-full overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing pb-8">
                            <div className="flex flex-row gap-4 md:justify-center px-4 min-w-max mx-auto">
                                {AGENTS.map((agent, i) => {
                                    const isActive = i === activeAgentIdx;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setActiveAgentIdx(i)}
                                            className={`flex flex-col items-center gap-3 p-3 rounded-[1rem] transition-all duration-300 w-[100px] flex-shrink-0 ${isActive
                                                ? 'bg-background/10 scale-105'
                                                : 'hover:bg-background/5 opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 flex items-center justify-center overflow-hidden transition-colors`}>
                                                {agent.image ? (
                                                    <AutoImage basePath={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-background/20 text-[9px] font-mono tracking-widest uppercase">IMG</span>
                                                )}
                                            </div>
                                            <span className={`text-[11px] tracking-wide text-center leading-tight transition-colors ${isActive ? 'text-background font-medium' : 'text-background/50'}`}>
                                                {agent.name.replace(' Agent', '')}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* INSCHATTING / CALCULATOR SECTIE */}
            <AiCalculator />

            {/* 3. INTEGRATIES SECTIE */}
            <IntegrationGrid />

            {/* FOOTER */}
            <Footer />
        </div>
    );
}

