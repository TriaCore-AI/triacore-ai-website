import React, { useEffect, useRef, useState } from 'react';
import { Plus, Minus, X, Check, Sparkles, Cog, User, Settings, Database, ArrowRight } from 'lucide-react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import { useLanguage } from '../context/LanguageContext';
import CTAButton from '../components/ui/cta-button';
import { AutoImage } from '../components/ui/auto-image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- HELPER COMPONENTS (Defined before use to avoid hoisting issues) ---



const Visual1 = () => {
    const { language } = useLanguage();
    return (
        <div className="flex flex-col items-center gap-6 md:gap-10 w-full max-w-[280px] md:max-w-sm scale-90 md:scale-100">
            <div className="flex justify-between w-full">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg overflow-hidden">
                        <AutoImage basePath="/logo/chatgpt" alt="ChatGPT" className="w-8 h-8 object-contain" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">ChatGPT</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg overflow-hidden">
                        <AutoImage basePath="/logo/claude" alt="Claude" className="w-8 h-8 object-contain" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Claude</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg overflow-hidden">
                        <AutoImage basePath="/logo/gemini" alt="Gemini" className="w-8 h-8 object-contain" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Gemini</span>
                </div>
            </div>
            
            {/* Connection Lines */}
            <div className="relative w-full h-12">
                <div className="absolute top-0 left-7 w-px h-full bg-white/15"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-white/15"></div>
                <div className="absolute top-0 right-7 w-px h-full bg-white/15"></div>
                <div className="absolute bottom-0 left-7 right-7 h-px bg-white/15"></div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-6 bg-[#628f69]/60"></div>
            </div>

            <div className="bg-[#628f69]/25 border border-[#628f69]/50 px-8 py-4 rounded-[1.5rem] shadow-2xl shadow-[#628f69]/20 relative group">
                <div className="absolute inset-0 bg-[#628f69]/20 blur-2xl rounded-full"></div>
                <span className="text-[#a5d1aa] font-bold text-sm uppercase tracking-widest relative z-10">
                    {language === 'nl' ? 'AI-integratie' : 'AI integration'}
                </span>
            </div>
        </div>
    );
};

const Visual2 = () => {
    const { language } = useLanguage();
    return (
        <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden scale-[0.85] md:scale-100">
            {/* Connection Lines (Subtle background) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 400 300">
                <path d="M 120 80 L 180 120" stroke="white" strokeWidth="0.5" fill="none" />
                <path d="M 280 100 L 220 140" stroke="white" strokeWidth="0.5" fill="none" />
                <path d="M 100 220 L 180 180" stroke="white" strokeWidth="0.5" fill="none" />
            </svg>

            {/* The Device (Centered) */}
            <div className="relative z-10 w-40 h-72 md:w-48 md:h-88 bg-[#020617] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-3 md:p-4 flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Notch */}
                <div className="w-20 h-5 bg-[#161b22] rounded-full mb-6 flex items-center justify-center shrink-0">
                    <div className="w-1 h-1 rounded-full bg-white/20 mr-2" />
                    <div className="w-8 h-1 rounded-full bg-white/10" />
                </div>
                
                <div className="w-full flex-1 flex flex-col space-y-4 px-2 overflow-hidden">
                    {/* Header Area */}
                    <div className="flex justify-between items-center mb-2 shrink-0">
                        <div className="w-12 h-2 bg-white/10 rounded-full" />
                        <div className="w-4 h-4 rounded-full bg-[#628f69]/20 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#628f69]" />
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="w-full h-24 bg-white/5 rounded-2xl border border-white/5 p-3 flex flex-col justify-between shrink-0">
                        <div className="space-y-2">
                            <div className="w-3/4 h-2 bg-white/20 rounded-full" />
                            <div className="w-1/2 h-1.5 bg-white/10 rounded-full" />
                        </div>
                        <div className="w-full h-8 bg-[#628f69]/20 rounded-xl border border-[#628f69]/30 flex items-center justify-center">
                            <span className="text-[8px] uppercase tracking-widest text-[#a5d1aa] font-bold">
                                {language === 'nl' ? 'TAAK' : 'TASK'}
                            </span>
                        </div>
                    </div>

                    {/* List Items */}
                    <div className="space-y-3 flex-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                                    <div className="w-3 h-3 border border-white/20 rounded-sm" />
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <div className="w-full h-1.5 bg-white/10 rounded-full" />
                                    <div className="w-2/3 h-1 bg-white/5 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Floating Detail Modules */}
            <div className="absolute top-[8%] left-[0%] md:left-[5%] w-28 md:w-36 bg-[#161b22]/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex flex-col gap-2 shadow-2xl z-20">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#628f69] animate-pulse" />
                    <div className="w-16 h-2 bg-white/20 rounded-full" />
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full" />
                <div className="flex justify-between items-center">
                    <div className="w-8 h-1.5 bg-white/10 rounded-full" />
                    <div className="w-10 h-3 bg-[#628f69]/10 rounded-full" />
                </div>
            </div>

            <div className="absolute bottom-[10%] right-[0%] md:right-[5%] w-24 md:w-32 bg-[#161b22]/90 backdrop-blur-md border border-[#628f69]/20 rounded-2xl p-3 flex flex-col gap-2 shadow-2xl z-20">
                <div className="w-10 h-2 bg-[#628f69]/40 rounded-full" />
                <div className="space-y-1.5">
                    <div className="w-full h-1 bg-white/10 rounded-full" />
                    <div className="w-2/3 h-1 bg-white/10 rounded-full" />
                </div>
            </div>
        </div>
    );
};

const Visual3 = () => {
    const { language } = useLanguage();
    return (
        <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden scale-[0.95] md:scale-100">
            {/* Main Dashboard Window */}
            <div className="relative z-10 w-full max-w-[340px] md:max-w-[440px] h-56 md:h-64 bg-[#020617] border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
                <div className="w-full h-10 border-b border-white/5 bg-white/5 flex items-center justify-between px-4">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <div className="w-24 h-2 bg-white/10 rounded-full" />
                </div>
                <div className="flex-1 p-4 flex gap-4">
                    {/* Sidebar mockup */}
                    <div className="w-16 md:w-28 h-full space-y-3">
                        <div className="w-full h-8 bg-white/5 rounded-lg border border-white/5" />
                        <div className="space-y-2 px-1">
                            <div className="w-full h-1.5 bg-white/10 rounded-full" />
                            <div className="w-3/4 h-1.5 bg-white/5 rounded-full" />
                            <div className="w-1/2 h-1.5 bg-white/5 rounded-full" />
                        </div>
                        <div className="w-full h-12 bg-[#628f69]/5 border border-[#628f69]/10 rounded-lg mt-auto" />
                    </div>
                    
                    {/* Content area mockup */}
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="w-24 h-3 bg-white/20 rounded-full" />
                            <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-md bg-white/5 border border-white/5" />
                                <div className="w-6 h-6 rounded-md bg-white/5 border border-white/5" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                            <div className="h-14 bg-[#628f69]/10 border border-[#628f69]/20 rounded-xl flex flex-col p-2 gap-1.5">
                                <div className="w-8 h-1 bg-[#628f69]/60 rounded-full" />
                                <div className="w-full h-4 bg-[#628f69]/5 rounded-md" />
                            </div>
                            <div className="h-14 bg-white/5 border border-white/5 rounded-xl flex flex-col p-2 gap-1.5">
                                <div className="w-8 h-1 bg-white/20 rounded-full" />
                                <div className="w-full h-4 bg-white/5 rounded-md" />
                            </div>
                            <div className="h-14 bg-white/5 border border-white/10 rounded-xl flex flex-col p-2 gap-1.5">
                                <div className="w-8 h-1 bg-white/20 rounded-full" />
                                <div className="w-full h-4 bg-white/5 rounded-md" />
                            </div>
                        </div>
                        
                        <div className="h-20 md:h-28 bg-[#0a0a1a] border border-white/5 rounded-xl relative overflow-hidden">
                            <div className="absolute inset-0 flex flex-col p-3 gap-2">
                                <div className="w-1/3 h-2 bg-white/10 rounded-full" />
                                <div className="w-full h-px bg-white/5" />
                                {[1, 2].map(i => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="w-24 h-1.5 bg-white/5 rounded-full" />
                                        <div className="w-8 h-3 bg-[#628f69]/20 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating UI Elements (Contained within viewport) */}
            <div className="absolute top-[5%] right-[5%] w-32 md:w-40 bg-[#161b22]/95 backdrop-blur-xl border border-[#628f69]/30 rounded-2xl p-4 shadow-2xl z-20">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#628f69]/20 border border-[#628f69]/40 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#628f69]" />
                    </div>
                    <div className="space-y-1">
                        <div className="w-16 h-2 bg-white/20 rounded-full" />
                        <div className="w-10 h-1.5 bg-white/10 rounded-full" />
                    </div>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full mb-3" />
                <div className="flex gap-2">
                    <div className="w-full h-4 bg-[#628f69]/10 rounded-lg" />
                    <div className="w-full h-4 bg-white/5 rounded-lg" />
                </div>
            </div>

            <div className="absolute bottom-[5%] left-[5%] w-36 md:w-44 bg-[#161b22]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-20">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <div className="w-20 h-2 bg-white/30 rounded-full" />
                        <div className="w-2 h-2 rounded-full bg-[#628f69]" />
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className={`h-6 rounded-md ${i < 5 ? 'bg-[#628f69]/40' : 'bg-white/5'}`} />
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Decorative Corner Accents (Inside the visual area) */}
            <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-white/5 pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-white/5 pointer-events-none" />
        </div>
    );
};


const Visual4 = () => (
    <div className="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden py-4 md:py-8 px-4 md:px-6 scale-[0.85] md:scale-100">
        {/* SVG Background Connections (Static) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 300">
            {/* Trunk Path: N1 -> N2 -> Split */}
            <path d="M 60 150 L 140 150 L 230 150" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none" />
            
            {/* Branch Path Top: Split -> Top Right */}
            <path d="M 230 150 L 320 70" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none" />
            
            {/* Branch Path Bottom: Split -> Bottom Right */}
            <path d="M 230 150 L 320 230" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none" />
        </svg>

        {/* Node 1: Person (Start) */}
        <div className="absolute left-[10%] top-1/2 -translate-y-1/2 z-20">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#020617] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                <User size={24} className="text-white/40" />
            </div>
        </div>

        {/* Node 2: Gear (Processing) */}
        <div className="absolute left-[35%] top-1/2 -translate-y-1/2 z-20">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#020617] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                <Settings size={24} className="text-white/40" />
            </div>
        </div>

        {/* Top Right Node: Data */}
        <div className="absolute top-[12%] right-[10%] z-20">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#020617] border border-accent/20 rounded-2xl flex items-center justify-center shadow-2xl">
                <Database size={24} className="text-accent/60" />
            </div>
        </div>

        {/* Bottom Right Node: AI */}
        <div className="absolute bottom-[12%] right-[10%] z-20">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#020617] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles size={24} className="text-accent/60" />
            </div>
        </div>
    </div>
);
const DecisionCriteria = () => {
    const { language } = useLanguage();
    const sectionRef = useRef(null);
    const [openIndices, setOpenIndices] = useState([]);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const items = gsap.utils.toArray('.decision-item-anim');
            items.forEach((item, index) => {
                const isRight = item.classList.contains('decision-item-right');
                
                // Entrance animation
                gsap.fromTo(
                    item,
                    { 
                        x: isRight ? 60 : -60, 
                        opacity: 0 
                    },
                    {
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 85%',
                        },
                        x: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: 'power3.out'
                    }
                );

                // Auto-open accordion on scroll (both mobile and desktop)
                ScrollTrigger.create({
                    trigger: item,
                    start: 'top 50%',
                    onEnter: () => setOpenIndices(prev => prev.includes(index) ? prev : [...prev, index]),
                });
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const criteria = [
        {
            num: '// 01',
            title: language === 'nl' ? 'U wil structurele tijdswinst op procesniveau' : 'You want structural time savings at the process level',
            desc: language === 'nl' 
                ? 'Niet een tool die individuen iets sneller maakt, maar een systeem dat een heel proces digitaliseert of automatiseert.' 
                : 'Not a tool that makes individuals slightly faster, but a system that digitizes or automates an entire process.'
        },
        {
            num: '// 02',
            title: language === 'nl' ? 'Uw processen zijn te complex voor een standaardtool' : 'Your processes are too complex for a standard tool',
            desc: language === 'nl'
                ? 'Uw werkwijze heeft meerdere stappen, afhankelijkheden en bedrijfsspecifieke regels die geen enkel standaardpakket aankan.'
                : 'Your workflow has multiple steps, dependencies, and business-specific rules that no off-the-shelf tool supports.'
        },
        {
            num: '// 03',
            title: language === 'nl' ? 'Uw systemen moeten met elkaar communiceren' : 'Your systems must communicate with each other',
            desc: language === 'nl'
                ? 'Meerdere gebruikers, rollen en systemen die geïntegreerd moeten werken in één geheel.'
                : 'Multiple users, roles, and systems that need to work integrated into a single whole.'
        },
        {
            num: '// 04',
            title: language === 'nl' ? 'U wil AI inzetten waar het echt rendeert' : 'You want to use AI where it truly pays off',
            desc: language === 'nl'
                ? 'Chatten met AI bespaart minuten. AI ingebouwd in uw processen bespaart uren, elke dag opnieuw.'
                : 'Chatting with AI saves minutes. AI built into your processes saves hours, every single day.'
        },
        {
            num: '// 05',
            title: language === 'nl' ? 'Uw sector heeft specifieke regelgeving' : 'Your industry has specific regulations',
            desc: language === 'nl'
                ? 'Uw bedrijf werkt met wettelijke verplichtingen, compliance-eisen of sectorregels die maatwerksoftware vereisen.'
                : 'Your company works with legal obligations, compliance requirements, or industry rules that require custom software.'
        }
    ];

    return (
        <section ref={sectionRef} className="pt-32 pb-12 px-6 md:px-16 bg-background relative z-10 overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                 style={{
                   backgroundImage: `linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)`,
                   backgroundSize: '4rem 4rem'
                 }}>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-20 md:mb-24 opacity-0 decision-item-anim">
                    <h2 className="hero-title text-foreground text-4xl md:text-6xl mb-6">
                        {language === 'nl' ? 'Wanneer kiest u voor een custom oplossing?' : 'When to choose a custom solution?'}
                    </h2>
                    <p className="section-subtitle text-foreground/60 text-lg md:text-xl max-w-3xl mx-auto">
                        {language === 'nl'
                            ? 'Elk bedrijf heeft een punt waarop generieke tools niet meer volstaan. Dit zijn de meest voorkomende signalen.'
                            : 'The decision for custom software is rarely impulsive. These are the signals that indicate it is time.'}
                    </p>
                </div>
                
                <div className="flex flex-col gap-4 md:gap-0">
                    {criteria.map((item, i) => {
                        const isEven = i % 2 === 1;
                        return (
                            <div 
                                key={i}
                                onClick={() => {
                                    setOpenIndices(prev => 
                                        prev.includes(i) ? prev.filter(idx => idx !== i) : [...prev, i]
                                    );
                                }}
                                className={`flex flex-col w-full opacity-0 decision-item-anim
                                    ${isEven ? 'md:items-end decision-item-right' : 'md:items-start decision-item-left'}
                                    cursor-pointer md:cursor-default group mb-8 md:mb-0
                                `}
                            >
                                <div className={`w-full md:w-[60%] flex flex-col py-12 md:py-20 border-b border-foreground/10 transition-colors duration-700 group-last:border-0`}>
                                    <div className="flex items-center justify-between w-full gap-8 mb-6">
                                        <div className="flex items-center gap-6">
                                            <span className="font-mono text-lg text-[#628f69]/80 group-hover:text-[#628f69] transition-colors duration-500 whitespace-nowrap">
                                                {item.num}
                                            </span>
                                            <h3 className={`text-foreground text-xl md:text-3xl font-medium tracking-tight transition-all duration-700 ${isEven ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                                                {item.title}
                                            </h3>
                                        </div>
                                        {/* Mobile Plus/Minus Icon */}
                                        <div className="md:hidden">
                                            {openIndices.includes(i) ? (
                                                <Minus className="w-5 h-5 text-[#628f69]" />
                                            ) : (
                                                <Plus className="w-5 h-5 text-foreground/40" />
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Description: Accordion on Mobile, Always Visible on Desktop */}
                                    <div 
                                        className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                                            ${openIndices.includes(i) ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}
                                        `}
                                    >
                                        <p className={`text-foreground/50 text-lg md:text-xl font-light leading-relaxed max-w-2xl`}>
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const FacetBlock = ({ number, title, description, solevoText, visual, reverse = false, onMoreInfo }) => {
    const { language } = useLanguage();
    const [isVisible, setIsVisible] = React.useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        if (domRef.current) observer.observe(domRef.current);
        return () => {
            if (domRef.current) observer.unobserve(domRef.current);
        };
    }, []);

    return (
        <div 
            ref={domRef}
            className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24 py-16 md:py-32 border-b border-white/5 last:border-0 transition-all duration-[800ms] ease-out ${
                isVisible 
                ? 'opacity-100 translate-x-0' 
                : `opacity-0 ${reverse ? 'translate-x-[30px]' : 'translate-x-[-30px]'}`
            }`}
        >
            <div className="w-full md:w-1/2 flex justify-center">
                <div 
                    onClick={onMoreInfo}
                    className={`w-full aspect-[4/5] md:aspect-[4/3] min-h-[380px] md:min-h-0 bg-[#0a0a1a]/40 backdrop-blur-xl border border-white/10 rounded-none p-6 md:p-8 flex items-center justify-center relative overflow-hidden group shadow-2xl ${onMoreInfo ? 'cursor-pointer' : ''}`}
                >
                    {/* Architectural Corner Accents */}
                    <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/10 group-hover:border-[#628f69]/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                    <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/10 group-hover:border-[#628f69]/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                    <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/10 group-hover:border-[#628f69]/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                    <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/10 group-hover:border-[#628f69]/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                    
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    {visual}
                </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
                    {number}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight leading-tight">
                    {title}
                </h2>
                <p className="text-white/60 text-lg font-light leading-relaxed max-w-xl">
                    {description}
                </p>
                
                    <button 
                        onClick={onMoreInfo}
                        className="w-fit inline-flex items-center gap-2 text-[#628f69] text-[10px] font-bold uppercase tracking-widest hover:gap-4 transition-all duration-300 group/link"
                    >
                        {language === 'nl' ? 'Meer info' : 'More info'} <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </button>

                <div className="mt-4 p-8 bg-[#628f69]/5 border border-[#628f69]/20 rounded-[2rem] relative overflow-hidden group/solevo">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#628f69] px-3 py-1 bg-[#628f69]/10 rounded-md border border-[#628f69]/20">
                            {language === 'nl' ? 'CONCREET VOORBEELD SOLEVO' : 'CONCRETE EXAMPLE SOLEVO'}
                        </span>
                    </div>
                    <p className="text-white/80 text-base leading-relaxed italic font-light">
                        {solevoText}
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

const CustomOplossingen = () => {
    const { language } = useLanguage();
    const containerRef = useRef(null);
    
    // Modal states
    const [isMobileAppModalOpen, setIsMobileAppModalOpen] = useState(false);
    const [isWebplatformModalOpen, setIsWebplatformModalOpen] = useState(false);
    const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);

    // Scroll lock when modal is open
    useEffect(() => {
        if (isMobileAppModalOpen || isWebplatformModalOpen || isAutomationModalOpen || isAIModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileAppModalOpen, isWebplatformModalOpen, isAutomationModalOpen, isAIModalOpen]);

    useEffect(() => {
        let ctx = gsap.context(() => {
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
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const MobileAppModal = () => {
        if (!isMobileAppModalOpen) return null;
        
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-12">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500" 
                    onClick={() => setIsMobileAppModalOpen(false)}
                />
                
                {/* Modal Content - White Background & Scrollable */}
                <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col overflow-hidden">
                    {/* Subtle Noise Overlay for White BG */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    
                    {/* Close Button - Fixed in top right */}
                    <button 
                        onClick={() => setIsMobileAppModalOpen(false)}
                        className="absolute top-6 right-6 p-4 rounded-full bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all duration-300 z-[60]"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                    
                    <div className="relative z-10 overflow-y-auto p-8 md:p-12 pt-16 md:pt-12">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">
                                {language === 'nl' ? 'Mobiele app' : 'Mobile app'}
                            </h2>
                        </div>
                        
                        <p className="text-slate-600 text-base font-light leading-relaxed mb-8 max-w-2xl">
                            {language === 'nl' 
                                ? 'Een mobiele app die uw mensen op locatie, onderweg of in het veld de juiste tools geeft om hun taken volledig uit te voeren via gsm.'
                                : 'A mobile app that gives your people in the field, on the road or on-site the right tools to fully perform their tasks via mobile phone.'}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Voor wie' : 'For whom'}</h3>
                                    <ul className="space-y-2">
                                        {(language === 'nl' ? [
                                            'Chauffeurs en transportmedewerkers',
                                            'Arbeiders en techniekers op locatie',
                                            'Vertegenwoordigers onderweg',
                                            'Iedereen die werkt buiten een vaste werkplek'
                                        ] : [
                                            'Drivers and transport staff',
                                            'Workers and technicians on location',
                                            'Sales reps on the road',
                                            'Anyone who works outside a fixed workplace'
                                        ]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                                                <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#628f69]/40 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het oplevert' : 'What it delivers'}</h3>
                                    <ul className="space-y-3">
                                        {(language === 'nl' ? [
                                            'Taken worden afgerond waar ze plaatsvinden',
                                            'Geen papier en geen manuele verwerking achteraf',
                                            'Realtime data beschikbaar voor kantoor',
                                            'Minder fouten door digitale registratie op het moment zelf'
                                        ] : [
                                            'Tasks are completed where they take place',
                                            'No paper and no manual processing afterwards',
                                            'Real-time data available for the office',
                                            'Fewer errors due to digital registration at the moment itself'
                                        ]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                                                <Check size={14} className="text-[#628f69] mt-1 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het doet' : 'What it does'}</h3>
                            <p className="text-slate-500 text-base font-light leading-relaxed max-w-3xl">
                                {language === 'nl'
                                    ? 'Uw mensen hebben via gsm toegang tot alles wat ze nodig hebben om hun taken ter plaatse af te ronden. Geen papier, geen telefoontjes naar kantoor, geen manuele verwerking achteraf.'
                                    : 'Your people have access via mobile phone to everything they need to complete their tasks on-site. No paper, no phone calls to the office, no manual processing afterwards.'}
                            </p>
                        </div>
                        
                        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={() => setIsMobileAppModalOpen(false)}
                                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-all duration-300"
                            >
                                {language === 'nl' ? 'Sluiten' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    const WebplatformModal = () => {
        if (!isWebplatformModalOpen) return null;
        
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-12">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500" 
                    onClick={() => setIsWebplatformModalOpen(false)}
                />
                
                {/* Modal Content - White Background & Scrollable */}
                <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col overflow-hidden">
                    {/* Subtle Noise Overlay for White BG */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    
                    {/* Close Button - Fixed in top right */}
                    <button 
                        onClick={() => setIsWebplatformModalOpen(false)}
                        className="absolute top-6 right-6 p-4 rounded-full bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all duration-300 z-[60]"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                    
                    <div className="relative z-10 overflow-y-auto p-8 md:p-12 pt-16 md:pt-12">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">
                                {language === 'nl' ? 'Webplatform' : 'Web platform'}
                            </h2>
                        </div>
                        
                        <p className="text-slate-600 text-base font-light leading-relaxed mb-8 max-w-2xl">
                            {language === 'nl' 
                                ? 'Een centrale omgeving waar beheerders alle lopende processen, taken en data in realtime opvolgen en beheren via de browser.'
                                : 'A central environment where managers monitor and manage all ongoing processes, tasks and data in real time — accessible from any browser.'}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Voor wie' : 'For whom'}</h3>
                                    <ul className="space-y-2">
                                        {(language === 'nl' ? [
                                            'Operations managers',
                                            'Zaakvoerders die overzicht willen',
                                            'Administratieve medewerkers',
                                            'Iedereen die processen opvolgt vanuit kantoor'
                                        ] : [
                                            'Operations managers',
                                            'Business owners who want full oversight',
                                            'Administrative staff',
                                            'Anyone who manages processes from the office'
                                        ]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                                                <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#628f69]/40 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het oplevert' : 'What it delivers'}</h3>
                                    <ul className="space-y-3">
                                        {(language === 'nl' ? [
                                            'Geen versnipperde informatie meer',
                                            'Realtime zicht op wat er gebeurt',
                                            'Minder manuele opvolging',
                                            'Betere beslissingen op basis van live data'
                                        ] : [
                                            'No more scattered information',
                                            'Real-time visibility of what is happening',
                                            'Less manual follow-up',
                                            'Better decisions based on live data'
                                        ]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                                                <Check size={14} className="text-[#628f69] mt-1 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het doet' : 'What it does'}</h3>
                            <p className="text-slate-500 text-base font-light leading-relaxed max-w-3xl">
                                {language === 'nl'
                                    ? 'Uw beheerders hebben vanuit de browser een volledig beeld van wat er gebeurt in het bedrijf. Taken, statussen, AI-handelingen en data op één centrale plek, altijd up-to-date.'
                                    : 'Your managers have a complete view from the browser of what is happening in the company. Tasks, statuses, AI actions and data in one central place, always up-to-date.'}
                            </p>
                        </div>
                        
                        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={() => setIsWebplatformModalOpen(false)}
                                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-all duration-300"
                            >
                                {language === 'nl' ? 'Sluiten' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    const AutomationModal = () => {
        if (!isAutomationModalOpen) return null;
        
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-12">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500" 
                    onClick={() => setIsAutomationModalOpen(false)}
                />
                
                {/* Modal Content - White Background & Scrollable */}
                <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col overflow-hidden">
                    {/* Subtle Noise Overlay for White BG */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    
                    {/* Close Button - Fixed in top right */}
                    <button 
                        onClick={() => setIsAutomationModalOpen(false)}
                        className="absolute top-6 right-6 p-4 rounded-full bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all duration-300 z-[60]"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                    
                    <div className="relative z-10 overflow-y-auto p-8 md:p-12 pt-16 md:pt-12">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">
                                {language === 'nl' ? 'Automatisering' : 'Automation'}
                            </h2>
                        </div>
                        
                        <p className="text-slate-600 text-base font-light leading-relaxed mb-8 max-w-2xl">
                            {language === 'nl' 
                                ? 'Stappen die altijd op dezelfde manier verlopen worden volledig geautomatiseerd, zonder manuele tussenkomst of opvolging.'
                                : 'Steps that always follow the same pattern are fully automated, without manual intervention or follow-up.'}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Voor wie' : 'For whom'}</h3>
                                    <ul className="space-y-2">
                                        {(language === 'nl' ? [
                                            'Bedrijven met veel repetitieve administratieve taken',
                                            'Teams die tijd verliezen aan manuele verwerking',
                                            'Organisaties met complexe of foutgevoelige workflows',
                                            'Bedrijven die hun processen willen laten lopen zonder constante opvolging'
                                        ] : [
                                            'Companies with many repetitive administrative tasks',
                                            'Teams losing time to manual processing',
                                            'Organizations with complex or error-prone workflows',
                                            'Companies that want their processes to run without constant follow-up'
                                        ]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                                                <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#628f69]/40 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het oplevert' : 'What it delivers'}</h3>
                                    <ul className="space-y-3">
                                        {(language === 'nl' ? [
                                            'Geen vergeten stappen meer',
                                            'Minder fouten door manuele verwerking',
                                            'Processen die doorlopen zonder manuele tussenkomst',
                                            'Meer tijd voor werk dat echt aandacht vraagt'
                                        ] : [
                                            'No more forgotten steps',
                                            'Fewer errors through manual processing',
                                            'Processes that continue without manual intervention',
                                            'More time for work that truly requires attention'
                                        ]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                                                <Check size={14} className="text-[#628f69] mt-1 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het doet' : 'What it does'}</h3>
                            <p className="text-slate-500 text-base font-light leading-relaxed max-w-3xl">
                                {language === 'nl'
                                    ? 'Alles wat zich herhaalt in uw workflow wordt automatisch afgehandeld. Van documentverwerking tot meldingen en rapportage, zonder dat iemand er telkens tussen moet komen.'
                                    : 'Everything that repeats in your workflow is handled automatically. From document processing to notifications and reporting, without anyone having to intervene every time.'}
                            </p>
                        </div>
                        
                        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={() => setIsAutomationModalOpen(false)}
                                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-all duration-300"
                            >
                                {language === 'nl' ? 'Sluiten' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    const AIModal = () => {
        if (!isAIModalOpen) return null;
        
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-12">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500" 
                    onClick={() => setIsAIModalOpen(false)}
                />
                
                {/* Modal Content - White Background & Scrollable */}
                <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col overflow-hidden">
                    {/* Subtle Noise Overlay for White BG */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    
                    {/* Close Button - Fixed in top right */}
                    <button 
                        onClick={() => setIsAIModalOpen(false)}
                        className="absolute top-6 right-6 p-4 rounded-full bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all duration-300 z-[60]"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                    
                    <div className="relative z-10 overflow-y-auto p-8 md:p-12 pt-16 md:pt-12">
                        <div className="flex items-center gap-4 mb-3">
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">{language === 'nl' ? 'AI-integratie' : 'AI integration'}</h2>
                        </div>
                        <p className="text-slate-600 text-base font-light leading-relaxed mb-8 max-w-2xl">
                            {language === 'nl' 
                                ? 'AI wordt slim geïntegreerd in uw bestaande processen, daar waar het uw mensen tijd uitspaart en uw bedrijf efficiënter maakt.'
                                : 'AI is smartly integrated into your existing processes, right where it saves your people time and makes your business more efficient.'}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Voor wie' : 'For whom'}</h3>
                                    <ul className="space-y-2">
                                        {(language === 'nl' ? [
                                            'Bedrijven met repetitieve of foutgevoelige processen',
                                            'Teams die tijd verliezen aan manuele beslissingen en verwerkingen',
                                            'Organisaties die meer willen doen met dezelfde mensen',
                                            'Bedrijven die AI willen inzetten waar het echt rendeert'
                                        ] : [
                                            'Companies with repetitive or error-prone processes',
                                            'Teams losing time to manual decisions and processing',
                                            'Organisations that want to do more with the same headcount',
                                            'Businesses that want to deploy AI where it truly pays off'
                                        ]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                                                <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#628f69]/40 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het oplevert' : 'What it delivers'}</h3>
                                    <ul className="space-y-3">
                                        {(language === 'nl' ? [
                                            'Snellere verwerking van complexe taken',
                                            'Minder fouten door manuele tussenkomst',
                                            'Processen die lopen zonder constante manuele opvolging',
                                            'Meer ruimte voor werk dat er echt toe doet'
                                        ] : [
                                            'Faster processing of complex tasks',
                                            'Fewer errors from manual intervention',
                                            'Processes that run without constant manual follow-up',
                                            'More room for work that truly matters'
                                        ]).map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                                                <Check size={14} className="text-[#628f69] mt-1 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het doet' : 'What it does'}</h3>
                            <p className="text-slate-500 text-base font-light leading-relaxed max-w-3xl">
                                {language === 'nl'
                                    ? 'AI neemt taken over die altijd op dezelfde manier verlopen, ondersteunt beslissingen op basis van data en verwerkt informatie sneller dan manueel mogelijk is. Niet als losstaand hulpmiddel, maar diep ingebouwd in de manier waarop uw bedrijf werkt.'
                                    : 'AI takes over tasks that always follow the same pattern, supports data-driven decision-making, and processes information faster than manually possible. Not as a standalone tool, but deeply embedded in how your company operates.'}
                            </p>
                        </div>
                        
                        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={() => setIsAIModalOpen(false)}
                                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-all duration-300"
                            >
                                {language === 'nl' ? 'Sluiten' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div ref={containerRef} className="relative w-full min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
            <Navbar />
            
            <MobileAppModal />
            <WebplatformModal />
            <AutomationModal />
            <AIModal />

            <section className="relative pt-48 pb-16 px-6 md:px-16 overflow-hidden bg-background flex flex-col items-center justify-start">
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                     style={{
                       backgroundImage: `linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)`,
                       backgroundSize: '4rem 4rem'
                     }}>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center w-full">
                    <span className="hero-stagger uppercase tracking-[0.3em] text-[10px] font-bold mb-8 text-accent block">
                        {language === 'nl' ? 'Custom oplossingen' : 'Custom solutions'}
                    </span>
                    <h1 className="hero-stagger font-serif text-foreground text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-8">
                        {language === 'nl' ? (
                            <>Uw processen geoptimaliseerd met <span className="text-accent">software op maat.</span></>
                        ) : (
                            <>Your processes optimized with <span className="text-accent">custom software.</span></>
                        )}
                    </h1>
                    <p className="hero-stagger max-w-2xl text-lg md:text-xl text-foreground/60 mb-12 font-light leading-relaxed mx-auto">
                        {language === 'nl'
                            ? 'Sommige inefficiënties zitten zo diep in uw werkwijze dat geen enkel standaardpakket ze wegneemt. Maatwerk dat AI op de juiste plaats inzet wel.'
                            : 'Some inefficiencies are so deep in your workflow that no standard package can remove them. Custom work that uses AI in the right place does.'}
                    </p>
                    <div className="hero-stagger flex flex-wrap gap-6 items-center justify-center">
                        <CTAButton to="/contact" variant="primary">
                            {language === 'nl' ? 'Plan een gesprek' : 'Book a call'}
                        </CTAButton>
                    </div>
                </div>
            </section>

            <DecisionCriteria />

            <section className="relative pt-32 pb-32 px-6 md:px-16 bg-[#020617] z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
                        <h2 className="hero-title text-white text-4xl md:text-6xl mb-6">
                            {language === 'nl' ? 'De tools die we inzetten.' : 'The tools we deploy.'}
                        </h2>
                        <p className="section-subtitle text-white/60 text-lg md:text-xl max-w-3xl mx-auto">
                            {language === 'nl' 
                                ? 'Elk probleem vraagt om de juiste aanpak. Dit zijn de bouwstenen waarmee we werken.' 
                                : 'Every problem requires the right approach. These are the building blocks we work with.'}
                        </p>
                    </div>

                    <FacetBlock 
                        number={language === 'nl' ? "// 01 — AI-integratie" : "// 01 — AI integration"}
                        title={language === 'nl' ? 'AI ingebouwd in uw processen' : 'AI built into your processes'}
                        description={language === 'nl' 
                            ? 'Van eenvoudige herhaaltaken tot complexe verwerkingen: AI wordt slim geïntegreerd waar het uw mensen tijd uitspaart en processen efficiënter maakt.'
                            : 'From simple repetitive tasks to complex processing: AI is smartly integrated where it saves your people time and makes processes more efficient.'}
                        solevoText={language === 'nl'
                            ? 'Planningen worden automatisch opgesteld op basis van beschikbare chauffeurs, taken en locaties. De admin wijst niet meer handmatig toe.'
                            : 'Schedules are automatically drawn up based on available drivers, tasks, and locations. The admin no longer assigns manually.'}
                        visual={<Visual1 />}
                        reverse={false}
                        onMoreInfo={() => setIsAIModalOpen(true)}
                    />

                    <FacetBlock 
                        number={language === 'nl' ? "// 02 — Mobiele app" : "// 02 — Mobile app"}
                        title={language === 'nl' ? 'Ontworpen voor wie niet achter een bureau zit.' : 'Designed for those who are not behind a desk.'}
                        description={language === 'nl'
                            ? 'Op locatie of onderweg: uw mensen kunnen hun taken volledig uitvoeren via gsm, zonder afhankelijk te zijn van kantoor.'
                            : 'On site or on the road: your people can fully perform their tasks via mobile phone, without being dependent on the office.'}
                        solevoText={language === 'nl'
                            ? 'Chauffeurs registreren ritten en vullen vrachtbonnen in via hun gsm. Geen papier, geen handmatige verwerking achteraf.'
                            : 'Drivers register trips and fill out transport notes via their mobile phones. No paper, no manual processing afterwards.'}
                        visual={<Visual2 />}
                        reverse={true}
                        onMoreInfo={() => setIsMobileAppModalOpen(true)}
                    />

                    <FacetBlock 
                        number={language === 'nl' ? '// 03 — Webplatform' : '// 03 — Web platform'}
                        title={language === 'nl' ? 'Volledig overzicht en beheer vanuit één centrale plek.' : 'Full overview and management from one central place.'}
                        description={language === 'nl'
                            ? 'Alle lopende taken, AI-handelingen en data op één plek. Uw beheerders hebben altijd het volledige beeld, op elk moment.'
                            : 'All ongoing tasks, AI actions, and data in one place. Your administrators always have the full picture, at any moment.'}
                        solevoText={language === 'nl'
                            ? 'Admins zien in realtime welke taken lopen, welke chauffeurs actief zijn en welke bonnen al zijn afgerond.'
                            : 'Admins see in real-time which tasks are running, which drivers are active, and which notes have already been completed.'}
                        visual={<Visual3 />}
                        reverse={false}
                        onMoreInfo={() => setIsWebplatformModalOpen(true)}
                    />

                    <FacetBlock 
                        number={language === 'nl' ? "// 04 — Automatisering" : "// 04 — Automation"}
                        title={language === 'nl' ? 'Repetitieve processen volledig uit handen.' : 'Repetitive processes completely handled.'}
                        description={language === 'nl'
                            ? 'Stappen die altijd op dezelfde manier verlopen worden geautomatiseerd. Geen manuele opvolging, geen vergeten stappen, geen fouten.'
                            : 'Steps that always proceed in the same way are automated. No manual follow-up, no forgotten steps, no errors.'}
                        solevoText={language === 'nl'
                            ? 'Een afgesloten bon wordt automatisch omgezet naar een officiële conforme PDF. Geen manuele stap, geen fouten.'
                            : 'A closed note is automatically converted into an official compliant PDF. No manual step, no errors.'}
                        visual={<Visual4 />}
                        reverse={true}
                        onMoreInfo={() => setIsAutomationModalOpen(true)}
                    />
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CustomOplossingen;
