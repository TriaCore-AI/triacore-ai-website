import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Hero van Oplossingen (v2), naar het voorbeeld van Distyl (opbouw) en Morningside (tekst): twee regels,
// gecentreerd, zonder bovenregel, knop of beeld. De tweede regel staat in het groene, schuine accent. Daaronder een tabbalk tussen twee dunne lijnen met de onderdelen van een goede AI-oplossing.
// De inhoud per tab volgt nog: op de lokale dev server staat er een plaatshouder, op de echte site niets.
// Vorige hero's: StellingHero (stelling-hero.jsx) en KnoopHero (knoop-hero.jsx).

export default function LeidingHero({ regels, tabs }) {
    const ref = useRef(null);
    const [actief, setActief] = useState(0);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const tl = gsap.timeline({ paused: true });
            tl.fromTo('.lh-regel',
                { clipPath: 'inset(-20% 100% -35% -5%)', x: -16 },
                { clipPath: 'inset(-20% -5% -35% -5%)', x: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.35, clearProps: 'clipPath' }, 0);
            if (ref.current.querySelector('.lh-tabs')) tl.from('.lh-tabs', { opacity: 0, y: 8, duration: 1.2, ease: 'power2.out' }, 1.4);
            const play = () => tl.play();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
            else play();
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="relative">
            {/* Vanaf 1024px staat de titel ongeveer in het midden van het scherm (half scherm min de halve
                titelhoogte), maar nooit hoger dan bij de andere pagina's. Onderaan dezelfde ruimte als bij Workshops */}
            <div className="px-6 md:px-16 lg:px-24 pt-40 md:pt-52 lg:pt-[max(13rem,calc(50svh-5rem))] pb-20 md:pb-28">
                <h1 className="max-w-6xl mx-auto text-center hero-title text-foreground text-[2.2rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08]">
                    {regels.map((r, i) => (
                        <span key={i} className="lh-regel block">{r}</span>
                    ))}
                </h1>
            </div>

            {/* Tabbalk zoals bij Distyl (enkel als er tabs meegegeven zijn): over de volle breedte tussen twee
                dunne lijnen. Op een smal scherm schuift de rij horizontaal, zonder af te breken */}
            {tabs && tabs.length > 0 && (<>
            <div className="lh-tabs border-y border-foreground/10">
                <div role="tablist" aria-label="Onderdelen" className="max-w-7xl mx-auto flex md:justify-center gap-1 overflow-x-auto px-6 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {tabs.map((t, i) => (
                        <button
                            key={t}
                            type="button"
                            role="tab"
                            aria-selected={actief === i}
                            onClick={() => setActief(i)}
                            className={`shrink-0 px-3 py-1.5 text-[13px] tracking-[0.14em] uppercase transition-colors duration-300 ${actief === i ? 'bg-foreground/[0.07] text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plaatshouder voor de inhoud van de actieve tab, enkel lokaal */}
            {import.meta.env.DEV && (
                <div role="tabpanel" className="px-6 py-16 md:py-24 text-center text-sm text-foreground/40">
                    Inhoud van de tab "{tabs[actief]}" volgt (enkel zichtbaar op localhost)
                </div>
            )}
            </>)}
        </section>
    );
}
