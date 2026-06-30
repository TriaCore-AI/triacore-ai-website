import React, { useEffect, useRef } from 'react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import ContactForm from '../components/ui/contact-form';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
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

            // Scroll animations
            const scrollElements = gsap.utils.toArray('.scroll-animate');
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

    return (
        <div ref={containerRef} className="relative min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">

            {/* NOISE OVERLAY */}
            <svg className="noise-overlay pointer-events-none fixed inset-0 z-50 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            <Navbar />

            {/* GLOBAL GRID BACKGROUND (architectural style like homepage) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
                 style={{
                   backgroundImage: `linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)`,
                   backgroundSize: '4rem 4rem',
                 }}>
            </div>

            <div className="relative z-10 flex flex-col w-full">
                {/* HERO SECTION */}
                <section className="relative pt-48 pb-12 px-6 md:px-16 overflow-hidden flex flex-col items-center justify-start">
                    <div className="max-w-5xl mx-auto text-center scroll-animate">
                        <span className="hero-stagger inline-flex items-center gap-3 mb-6">
                            <span className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-accent/70" />
                            <span className="uppercase tracking-[0.25em] text-xs md:text-sm font-bold text-accent">CONTACT</span>
                            <span className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-accent/70" />
                        </span>
                        <h1 className="hero-stagger font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6 text-foreground">
                            {language === 'nl' ? 'Plan uw gesprek.' : 'Book a call.'}
                        </h1>
                        <p className="hero-stagger max-w-2xl text-lg md:text-xl text-foreground/60 mb-8 font-light leading-relaxed mx-auto">
                            {language === 'nl'
                                ? 'We luisteren, analyseren en geven helder advies over de beste volgende stap.'
                                : 'We listen, analyze, and provide clear advice on the best next step.'}
                        </p>
                    </div>
                </section>

                <main className="flex-grow pb-32">
                    <ContactForm />
                </main>
            </div>

            <Footer />
        </div>
    );
}
