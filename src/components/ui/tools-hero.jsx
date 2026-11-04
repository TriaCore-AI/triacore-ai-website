import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import FunnelVisual from './funnel-visual';

// De hero van Custom tools: gecentreerd de titel, de ondertitel en de knop, en daaronder de trechter
// (funnel-visual.jsx): het handwerk links gaat in de kaart met het logo. De eerste sectie erna zit bij
// het laden onder een wolk (fog-lift.jsx).
// Bij het laden veegt de titel open van links naar rechts en komen de ondertitel en de knop zacht op,
// zoals op de andere pagina's. De trechter staat stil. Start pas als de lettertypes geladen zijn. Wie
// minder beweging vraagt, ziet meteen alles.
// De vorige versie met zwevende pictogrammen (custom-tools-achtergrond.jsx) staat nog in de code.
export default function ToolsHero({ title, intro, children }) {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const intro = gsap.timeline({ paused: true });
            intro.fromTo('.th-title',
                { clipPath: 'inset(-20% 100% -35% -5%)', x: -16 },
                { clipPath: 'inset(-20% -5% -35% -5%)', x: 0, duration: 1.8, ease: 'power2.inOut', clearProps: 'clipPath' })
                .from('.th-fade', { y: 10, opacity: 0, duration: 1.4, ease: 'power2.out', stagger: 0.12 }, 1.1);
            const play = () => intro.play();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
            else play();
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} id="custom-tools" className="relative px-6 md:px-16 lg:px-24 pt-40 md:pt-48 pb-20 md:pb-28">
            <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
                <h1 className="th-title hero-title text-foreground text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] leading-[1.02]">
                    {title}
                </h1>
                {/* Iets kleiner dan de intro van de andere pagina's, omdat de tekst langer is */}
                <p className="th-fade mt-8 md:mt-10 max-w-3xl text-lg md:text-xl text-foreground/70 leading-relaxed">
                    {intro}
                </p>
                {children && <div className="th-fade mt-10 md:mt-12">{children}</div>}
            </div>
            {/* Dicht onder de knop (de visual zet zelf haar marge). Klikken op de knop gaat er gewoon door */}
            <div className="pointer-events-none relative max-w-7xl mx-auto">
                <FunnelVisual />
            </div>
        </section>
    );
}
