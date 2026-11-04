import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Truck, CalendarDays, Smartphone, Files, Users, ClipboardCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// De achtergrond van de hero op de pagina Custom tools, in dezelfde vorm als die van Tweede brein
// (tweede-brein-achtergrond.jsx): een paar grote pictogrammen, zonder kader en zonder kleur, die rustig
// zweven rond de titel. Een vrachtwagen, een planning, een gsm, documenten, een bon en mensen. Samen: de
// operatie buiten het kantoor, de stappen en de vele handen waarvoor we tools bouwen.
// - De lijnen blijven even dun, hoe groot het pictogram ook is (absoluteStrokeWidth): groot maar licht.
// - Ze staan langs de randen, zodat de titel en de tekst vrij blijven. Op een kleiner scherm vallen de
//   pictogrammen dichter bij het midden weg.
// - Onderaan vloeien ze weg in een wolk (een masker met --fog).
// - Bij het scrollen schuiven ze mee omhoog, elk op zijn eigen diepte (verder weg = trager), en trekt de
//   wolk dicht tot ze verdwenen zijn. Terug naar boven scrollen draait dat om.
// - Wie minder beweging vraagt, ziet ze stil staan.
// Zet dit als eerste kind in een section met `relative`; de inhoud erboven heeft `relative` nodig.

// x en y: het midden, in procent van het eerste scherm. s: de grootte in px op een groot scherm.
// d: de diepte, van 0 (ver weg: lichter, trager) tot 1 (dichtbij).
// from: vanaf welk formaat het pictogram te zien is (die dicht bij de tekst pas op een groter scherm)
// Dezelfde zigzag als bij Tweede brein: van linksonder naar rechtsboven, telkens afwisselend links en
// rechts en telkens iets hoger. De mensen (laagst, diep in de wolk), de documenten, de bon, de gsm, de
// vrachtwagen en de planning rechtsboven. Het vlak is precies één scherm hoog, dus wat onderaan staat,
// vervaagt altijd onderaan het scherm, boven de eerste sectie die daar onder een wolk zit
const ITEMS = [
    { icon: Users, x: 19, y: 80, s: 124, d: 0.6, from: 'md' },
    { icon: Files, x: 82, y: 71, s: 180, d: 0.7, from: 'all' },
    { icon: ClipboardCheck, x: 7, y: 59, s: 150, d: 0.45, from: 'md' },
    { icon: Smartphone, x: 93, y: 46, s: 160, d: 0.5, from: 'md' },
    { icon: Truck, x: 14, y: 32, s: 240, d: 1, from: 'all' },
    { icon: CalendarDays, x: 86, y: 20, s: 200, d: 0.9, from: 'all' }
];

const SHOW = { all: 'block', md: 'hidden md:block', lg: 'hidden lg:block' };

// De wolk: tot 55% van --fog is alles zichtbaar, op --fog is alles weg (in procent van het vlak).
// Na het scrollen voorbij de hero zit alles in de wolk
const FOG_START = 96;
const FOG_END = 30;
const fogMask = 'radial-gradient(ellipse 150% var(--fog) at 50% 0%, #000 55%, transparent 100%)';

export default function CustomToolsAchtergrond() {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const items = gsap.utils.toArray('.cta-item');
            const rand = gsap.utils.random;

            // Ze komen zacht op, een voor een, terwijl de titel openveegt
            gsap.from(items, { opacity: 0, duration: 2, ease: 'power2.out', stagger: 0.15, delay: 0.5 });

            // Zweven: elk in zijn eigen tempo, dichtbij iets ruimer dan ver weg
            items.forEach((el) => {
                const d = Number(el.dataset.depth);
                gsap.to(el.querySelector('.cta-float'), {
                    y: rand(10, 18) * (0.5 + d),
                    rotation: rand(-5, 5),
                    duration: rand(5, 8),
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                    delay: -rand(0, 6)
                });
            });

            // Scrollen: meeschuiven op diepte, en de wolk trekt dicht
            const scroll = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: { trigger: ref.current.parentElement, start: 'top top', end: 'bottom top', scrub: 0.6 }
            });
            scroll.fromTo(ref.current, { '--fog': `${FOG_START}%` }, { '--fog': `${FOG_END}%` }, 0);
            items.forEach((el) => scroll.to(el, { y: -60 - Number(el.dataset.depth) * 180 }, 0));
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[100svh] overflow-hidden text-foreground [--k:0.5] md:[--k:0.75] lg:[--k:1]"
            style={{ '--fog': `${FOG_START}%`, WebkitMaskImage: fogMask, maskImage: fogMask }}
        >
            {ITEMS.map((it, i) => (
                <div
                    key={i}
                    data-depth={it.d}
                    className={`cta-item absolute ${SHOW[it.from]}`}
                    style={{
                        left: `${it.x}%`,
                        top: `${it.y}%`,
                        width: `calc(var(--k) * ${it.s}px)`,
                        height: `calc(var(--k) * ${it.s}px)`,
                        marginLeft: `calc(var(--k) * ${it.s / -2}px)`,
                        marginTop: `calc(var(--k) * ${it.s / -2}px)`,
                        opacity: 0.2 + it.d * 0.1
                    }}
                >
                    <div className="cta-float w-full h-full flex items-center justify-center">
                        {React.createElement(it.icon, { absoluteStrokeWidth: true, strokeWidth: 1.25, style: { width: '100%', height: '100%' } })}
                    </div>
                </div>
            ))}
        </div>
    );
}
