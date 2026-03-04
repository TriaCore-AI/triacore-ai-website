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
        <div ref={containerRef} className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">

            {/* NOISE OVERLAY */}
            <svg className="noise-overlay pointer-events-none fixed inset-0 z-50 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            <Navbar />

            {/* HERO SECTION (Grid Background like Trajecten) */}
            <section className="relative pt-48 pb-16 px-6 md:px-16 overflow-hidden bg-background min-h-[40dvh] flex flex-col justify-center">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute left-1/4 top-0 w-px h-full bg-foreground"></div>
                    <div className="absolute left-2/4 top-0 w-px h-full bg-foreground"></div>
                    <div className="absolute left-3/4 top-0 w-px h-full bg-foreground"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-foreground"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center scroll-animate">
                    <h1 className="hero-stagger text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight font-semibold mb-6 text-foreground">
                        {language === 'nl' ? 'Plan je gesprek' : 'Book a call'}
                    </h1>
                    <p className="hero-stagger text-xl md:text-2xl font-medium text-foreground/70 tracking-tight max-w-3xl mx-auto">
                        {language === 'nl'
                            ? 'We luisteren, analyseren en geven helder advies over de beste volgende stap.'
                            : 'We listen, analyze, and provide clear advice on the best next step.'}
                    </p>
                </div>
            </section>

            <main className="flex-grow pb-32">
                <ContactForm />
            </main>

            <Footer />
        </div>
    );
}
