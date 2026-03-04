import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Terminal, Layers } from 'lucide-react';
import CTAButton from '../components/ui/cta-button';
import { AccordionItem } from '../components/ui/accordion';
import Footer from '../components/ui/footer';
import Navbar from '../components/ui/navbar';
import { useLanguage } from '../context/LanguageContext';
import { useAutoImage } from '../components/ui/auto-image';

gsap.registerPlugin(ScrollTrigger);

export default function Trajecten() {
    const { language } = useLanguage();
    const ricoImg = useAutoImage('/media/rico_centered', ['webp', 'png', 'jpg', 'jpeg']);
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Setup hero animations
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

            gsap.fromTo(
                '.fade-up-layer',
                { y: 30, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: '.layers-container',
                        start: 'top 80%',
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power3.out'
                }
            );

        }, containerRef);
        return () => ctx.revert();
    }, []);

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

            {/* HERO SECTION */}
            <section className="relative pt-48 pb-24 px-6 md:px-16 overflow-hidden bg-background min-h-[50dvh] flex flex-col justify-center">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute left-1/4 top-0 w-px h-full bg-foreground"></div>
                    <div className="absolute left-2/4 top-0 w-px h-full bg-foreground"></div>
                    <div className="absolute left-3/4 top-0 w-px h-full bg-foreground"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-foreground"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <h1 className="hero-stagger text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight font-semibold mb-6 text-foreground">
                        {language === 'nl' ? <p>Twee trajecten.<br /> Eén doel.</p> : <p>Two paths.<br /> One goal.</p>}
                    </h1>
                    <p className="hero-stagger text-xl md:text-2xl font-medium text-foreground/70 tracking-tight max-w-2xl mx-auto">
                        {language === 'nl' ? "Afhankelijk van waar uw organisatie vandaag staat, starten we met structuur of optimalisatie." : "Depending on where your organization is today, we start with structure or optimization."}
                    </p>
                </div>
            </section>

            {/* SECTION 1 - TWO TRAJECTS */}
            <section className="py-24 px-6 md:px-16 bg-white relative z-10 border-t border-foreground/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                        {/* CARD 1 - Light */}
                        <div className="scroll-card bg-white border border-foreground/10 text-foreground rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-foreground/5 flex flex-col h-full">
                            <div className="mb-8 p-4 rounded-xl bg-foreground/5 inline-table w-max scroll-animate">
                                <Layers className="text-foreground" size={32} />
                            </div>
                            <h3 className="text-3xl font-semibold mb-6 tracking-tight scroll-animate">{language === 'nl' ? 'Bouw van een digitale basis' : 'Building a digital foundation'}</h3>
                            <p className="text-foreground/70 mb-10 text-lg scroll-animate">
                                {language === 'nl' ? 'Wanneer structuur ontbreekt, bouwen we een schaalbare digitale fundering.' : 'When structure is missing, we build a scalable digital foundation.'}
                            </p>

                            <div className="flex-1 flex flex-col w-full mt-auto">
                                <AccordionItem title={language === 'nl' ? "Voor wie is dit bedoeld?" : "Who is this for?"} variant="light">
                                    {language === 'nl' ? 'Organisaties waar processen en data verspreid zitten over verschillende tools zonder duidelijke samenhang. Er is geen vaste architectuur waarop verder gebouwd kan worden.' : 'Organizations where processes and data are scattered across different tools without clear coherence. There is no fixed architecture to build upon.'}
                                </AccordionItem>
                                <AccordionItem title={language === 'nl' ? "Welke signalen wijzen hierop?" : "What are the signs?"} variant="light">
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>{language === 'nl' ? 'Data zit verspreid in meerdere systemen' : 'Data is scattered across multiple systems'}</li>
                                        <li>{language === 'nl' ? 'Er is geen centraal overzicht van processen' : 'There is no central overview of processes'}</li>
                                        <li>{language === 'nl' ? 'Nieuwe initiatieven creëren extra complexiteit' : 'New initiatives create extra complexity'}</li>
                                        <li>{language === 'nl' ? 'AI-ideeën lopen vast door gebrek aan structuur' : 'AI ideas get stuck due to a lack of structure'}</li>
                                    </ul>
                                </AccordionItem>
                                <AccordionItem title={language === 'nl' ? "Wat doen wij concreet?" : "What do we do concretely?"} variant="light">
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>{language === 'nl' ? 'Analyse van huidige processen en systemen' : 'Analysis of current processes and systems'}</li>
                                        <li>{language === 'nl' ? 'Ontwerp van een duidelijke digitale architectuur' : 'Design of a clear digital architecture'}</li>
                                        <li>{language === 'nl' ? 'Structureren van datastromen en workflows' : 'Structuring of data flows and workflows'}</li>
                                        <li>{language === 'nl' ? 'Vastleggen van een schaalbare basis' : 'Establishing a scalable foundation'}</li>
                                    </ul>
                                </AccordionItem>
                                <AccordionItem title={language === 'nl' ? "Wat levert dit op?" : "What are the results?"} variant="light">
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>{language === 'nl' ? 'Overzicht en controle' : 'Overview and control'}</li>
                                        <li>{language === 'nl' ? 'Stabiliteit in processen' : 'Stability in processes'}</li>
                                        <li>{language === 'nl' ? 'Minder afhankelijkheid van manuele schakels' : 'Less dependency on manual links'}</li>
                                        <li>{language === 'nl' ? 'Een fundament klaar voor verdere integratie en automatisatie' : 'A foundation ready for further integration and automation'}</li>
                                    </ul>
                                </AccordionItem>
                            </div>
                        </div>

                        {/* CARD 2 - Dark */}
                        <div className="scroll-card bg-dark-section text-background rounded-[2rem] p-8 md:p-12 border border-background/10 shadow-2xl shadow-background/5 flex flex-col h-full">
                            <div className="mb-8 p-4 rounded-xl bg-background/10 inline-table w-max scroll-animate">
                                <Terminal className="text-background" size={32} />
                            </div>
                            <h3 className="text-3xl font-semibold mb-6 tracking-tight scroll-animate">{language === 'nl' ? 'Integratie binnen bestaande systemen' : 'Integration within existing systems'}</h3>
                            <p className="text-background/70 mb-10 text-lg scroll-animate">
                                {language === 'nl' ? 'Wanneer een digitale structuur aanwezig is, zorgen we ervoor dat systemen logisch samenwerken.' : 'When a digital structure is present, we ensure that systems work together logically.'}
                            </p>

                            <div className="flex-1 flex flex-col w-full mt-auto">
                                <AccordionItem title={language === 'nl' ? "Voor wie is dit bedoeld?" : "Who is this for?"} variant="dark">
                                    {language === 'nl' ? 'Organisaties met een bestaand ERP-, CRM- of softwaresysteem die merken dat hun tools niet optimaal op elkaar aansluiten.' : 'Organizations with an existing ERP, CRM, or software system that notice their tools do not connect optimally.'}
                                </AccordionItem>
                                <AccordionItem title={language === 'nl' ? "Welke signalen wijzen hierop?" : "What are the signs?"} variant="dark">
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>{language === 'nl' ? 'Systemen werken naast elkaar in plaats van samen' : 'Systems work alongside each other instead of together'}</li>
                                        <li>{language === 'nl' ? 'Manuele overdracht tussen tools is noodzakelijk' : 'Manual transfer between tools is necessary'}</li>
                                        <li>{language === 'nl' ? 'Rapportering kost veel tijd' : 'Reporting takes a lot of time'}</li>
                                        <li>{language === 'nl' ? 'Er ontstaan dubbele of inconsistente gegevens' : 'Duplicate or inconsistent data arises'}</li>
                                    </ul>
                                </AccordionItem>
                                <AccordionItem title={language === 'nl' ? "Wat doen wij concreet?" : "What do we do concretely?"} variant="dark">
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>{language === 'nl' ? 'Analyse van het bestaande digitale ecosysteem' : 'Analysis of the existing digital ecosystem'}</li>
                                        <li>{language === 'nl' ? 'Koppelen van systemen via API’s en workflows' : 'Connecting systems via APIs and workflows'}</li>
                                        <li>{language === 'nl' ? 'Optimaliseren van datastromen' : 'Optimizing data flows'}</li>
                                        <li>{language === 'nl' ? 'Wegwerken van manuele processen' : 'Eliminating manual processes'}</li>
                                    </ul>
                                </AccordionItem>
                                <AccordionItem title={language === 'nl' ? "Wat is het resultaat?" : "What is the result?"} variant="dark">
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>{language === 'nl' ? 'Eén samenhangend digitaal geheel' : 'One cohesive digital whole'}</li>
                                        <li>{language === 'nl' ? 'Betrouwbare en consistente data' : 'Reliable and consistent data'}</li>
                                        <li>{language === 'nl' ? 'Minder manuele handelingen' : 'Fewer manual actions'}</li>
                                        <li>{language === 'nl' ? 'Klaar voor intelligente automatisatie' : 'Ready for intelligent automation'}</li>
                                    </ul>
                                </AccordionItem>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 2 - DARK ARCHITECTURE SECTION */}
            <section
                className="py-48 md:py-64 px-6 md:px-16 text-background overflow-hidden relative"
                style={{
                    background: 'linear-gradient(to bottom, #ffffff 0%, #020617 100px, #020617 calc(100% - 100px), #ffffff 100%)'
                }}
            >
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
                    <div className="md:w-1/2 scroll-card">
                        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 scroll-animate">{language === 'nl' ? 'Structuur bepaalt wat mogelijk wordt.' : 'Structure determines what is possible.'}</h2>
                        <p className="text-xl text-background/60 max-w-lg leading-relaxed scroll-animate">
                            {language === 'nl' ? 'Integratie en automatisatie bouwen voort op een stabiele digitale basis. Zonder fundament ontstaat complexiteit.' : 'Integration and automation build upon a stable digital foundation. Without a foundation, complexity arises.'}
                        </p>
                    </div>

                    <div className="md:w-1/2 w-full flex justify-center lg:justify-end">
                        <div className="layers-container flex flex-col items-center w-full max-w-md gap-3">
                            {/* Top Layer */}
                            <div className="fade-up-layer w-[60%] bg-white/5 text-background/80 py-4 px-6 rounded-md border border-white/10 text-center font-medium tracking-wide relative z-30">
                                {language === 'nl' ? 'AI & Automatisatie' : 'AI & Automation'}
                            </div>

                            {/* Middle Layer */}
                            <div className="fade-up-layer w-[80%] bg-white/5 text-background/90 py-5 px-6 rounded-lg border border-white/10 text-center font-medium tracking-wide relative z-20">
                                {language === 'nl' ? 'Integratie' : 'Integration'}
                            </div>

                            {/* Bottom Layer */}
                            <div className="fade-up-layer w-full bg-white/10 text-background py-6 px-8 rounded-xl border border-white/20 text-center font-semibold tracking-wide text-lg shadow-sm relative z-10">
                                {language === 'nl' ? 'Digitale basis' : 'Digital foundation'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3 - AI AS NEXT STEP */}
            <section className="py-20 md:py-32 px-6 md:px-16 bg-white overflow-hidden relative border-t border-foreground/5">
                <div className="max-w-6xl mx-auto">
                    <div className="scroll-card bg-white rounded-[3rem] border border-foreground/5 shadow-2xl shadow-foreground/5 overflow-hidden flex flex-col md:flex-row items-stretch min-h-0 md:min-h-[500px]">

                        {/* Enlarged Rico Column - Hidden on mobile */}
                        <div className="hidden md:flex md:w-1/2 justify-center items-end bg-foreground/[0.02] pt-12 md:pt-0">
                            <img
                                src={ricoImg}
                                alt="Rico AI Agent"
                                className="w-[85%] max-w-md object-contain origin-bottom"
                            />
                        </div>

                        {/* Minimalist Content Column */}
                        <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center items-start text-left">
                            <p className="text-xl md:text-2xl text-foreground/60 mb-12 leading-relaxed max-w-md scroll-animate">
                                {language === 'nl' ? 'Wanneer structuur en integratie op orde zijn, wordt AI een logische versterking van uw werking.' : 'When structure and integration are in order, AI becomes a logical enhancement to your operations.'}
                            </p>

                            <CTAButton to="/ai-agents">
                                {language === 'nl' ? 'Ontdek onze AI-agents' : 'Discover our AI agents'}
                            </CTAButton>
                        </div>

                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}
