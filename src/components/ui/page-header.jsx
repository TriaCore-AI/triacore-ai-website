import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// De header van elke pagina in de nieuwe stijl: een grote titel, links uitgelijnd zoals op de homepage,
// eventueel met één zin uitleg en iets eronder (bv. een knop). De titel onthult zich vloeiend van links
// naar rechts, daarna komt de rest zacht op. Start pas als de lettertypes geladen zijn.
// De maten van titel en uitleg zijn die van elke hero op de site (titel-hero en tekst-hero in index.css).
// titleSize voegt enkel nog iets toe voor een uitzondering, bv. een titel die op een heel smal scherm niet past.
// aside: optioneel iets rechts naast de titel (vanaf 1024px; op kleinere schermen eronder), bv. het
// inschrijfformulier op de kennisbank. Zonder aside blijft de header zoals op alle andere pagina's.
export default function PageHeader({ title, intro, children, aside, titleSize = '' }) {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const tl = gsap.timeline({ paused: true });
            tl.fromTo('.ph-title',
                { clipPath: 'inset(-20% 100% -35% -5%)', x: -16 },
                { clipPath: 'inset(-20% -5% -35% -5%)', x: 0, duration: 1.8, ease: 'power2.inOut', clearProps: 'clipPath' });
            if (ref.current.querySelector('.ph-fade')) {
                tl.from('.ph-fade', { y: 10, opacity: 0, duration: 1.4, ease: 'power2.out', stagger: 0.12 }, 1.1);
            }
            const play = () => tl.play();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
            else play();
        }, ref);
        return () => ctx.revert();
    }, [title]);

    // Op een liggende gsm (laag scherm) minder ruimte boven de titel, zoals bij de hero van de homepage
    return (
        <section ref={ref} className="px-6 md:px-16 lg:px-24 pt-40 md:pt-48 max-xl:[@media(max-height:500px)]:pt-32 pb-20 md:pb-28">
            <div className={`max-w-7xl mx-auto ${aside ? 'grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10' : ''}`}>
                <div className={aside ? 'lg:col-span-7' : ''}>
                    <h1 className={`ph-title hero-title titel-hero text-foreground ${titleSize}`}>
                        {title}
                    </h1>
                    {intro && (
                        <p className="ph-fade mt-8 md:mt-10 tekst-hero text-foreground/70 max-w-2xl">
                            {intro}
                        </p>
                    )}
                    {children && <div className="ph-fade mt-10">{children}</div>}
                </div>
                {/* Onderaan gelijk met de intro; de titel blijft altijd bovenaan, ook als de aside hoger is */}
                {aside && <div className="ph-fade lg:col-span-5 lg:self-end lg:justify-self-end w-full lg:max-w-md">{aside}</div>}
            </div>
        </section>
    );
}
