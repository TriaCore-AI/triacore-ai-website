import React, { useEffect, useRef } from 'react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';

export default function Workshops() {
    const containerRef = useRef(null);
    const { language } = useLanguage();

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

    return (
        <div ref={containerRef} className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">

            <Seo
                title={language === 'nl' ? 'Workshops | TriaCore AI' : 'Workshops | TriaCore AI'}
                description={language === 'nl'
                    ? 'Praktische AI workshops van TriaCore AI voor uw team.'
                    : 'Practical AI workshops by TriaCore AI for your team.'}
            />
            <Navbar />

            <main className="relative z-10 flex flex-col w-full flex-grow">
                {/* HEADER */}
                <section className="relative pt-48 pb-32 px-6 md:px-16 overflow-hidden flex flex-col items-center justify-start">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className="hero-stagger inline-flex items-center mb-6 px-4 py-1.5 rounded-lg border border-accent/20 bg-accent/5 font-mono uppercase tracking-[0.15em] text-xs md:text-sm font-bold text-accent">
                            <span className="text-accent/40">[</span>WORKSHOPS<span className="text-accent/40">]</span>
                        </span>
                        <h1 className="hero-stagger font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6 text-foreground">
                            {language === 'nl' ? 'Workshops.' : 'Workshops.'}
                        </h1>
                        <p className="hero-stagger max-w-2xl text-lg md:text-xl text-foreground/60 mb-8 font-light leading-relaxed mx-auto">
                            {language === 'nl'
                                ? 'Praktische AI workshops voor uw team.'
                                : 'Practical AI workshops for your team.'}
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
