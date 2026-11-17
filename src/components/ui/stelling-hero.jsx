import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';

// Hero van Oplossingen (v2) in de geest van Distyl: één zelfzekere stelling, geen beeld, veel witruimte,
// alles gecentreerd.
// De stelling groot, één zin die de grootste twijfel wegneemt, een tekstlink in
// plaats van een knop, en onderaan stil bewijs: de logo's van wie al een tool op maat liet bouwen.
// Geen achtergrondpatroon, enkel de gewone achtergrond van de pagina. De titel veegt open zoals op de andere pagina's, de rest
// komt zacht op; wie minder beweging vraagt, ziet meteen alles.
// De vorige hero met de knoop staat in knoop-hero.jsx.

export default function StellingHero({ titel, zin, link, bewijsLabel, logos }) {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const tl = gsap.timeline({ paused: true });
            tl.fromTo('.sh-titel',
                    { clipPath: 'inset(-20% 100% -35% -5%)', x: -16 },
                    { clipPath: 'inset(-20% -5% -35% -5%)', x: 0, duration: 1.8, ease: 'power2.inOut', clearProps: 'clipPath' }, 0.2)
                .from('.sh-fade', { y: 10, opacity: 0, duration: 1.3, ease: 'power2.out', stagger: 0.14 }, 1.3);
            const play = () => tl.play();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
            else play();
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="relative min-h-[100svh] flex flex-col px-6 md:px-16 lg:px-24 pt-40 md:pt-48 pb-12 md:pb-16">
            <div className="relative max-w-7xl w-full mx-auto flex-1 flex flex-col items-center text-center">
                <h1 className="sh-titel hero-title text-foreground text-[2.9rem] sm:text-6xl md:text-7xl lg:text-[6.5rem] leading-[1.02] max-w-5xl">
                    {titel}
                </h1>
                <p className="sh-fade mt-8 md:mt-10 text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-2xl">{zin}</p>
                <Link
                    to={link.to}
                    className="sh-fade group mt-10 md:mt-12 inline-flex items-center gap-2 text-lg font-medium text-foreground border-b border-foreground/25 pb-1 transition-colors duration-300 hover:text-accent hover:border-accent"
                >
                    {link.label}
                    <ArrowRight size={18} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                {/* Stil bewijs, onderaan de hero, gescheiden door een dunne lijn */}
                <div className="sh-fade mt-auto pt-16 md:pt-20 w-full">
                    <div className="border-t border-foreground/10 pt-6 md:pt-8 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10">
                        <span className="text-sm text-foreground/50 shrink-0">{bewijsLabel}</span>
                        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
                            {logos.map((l) => (
                                <img key={l.naam} src={l.logo} alt={l.naam} className="h-9 md:h-10 w-auto max-w-[150px] object-contain mix-blend-multiply" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
