import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// De wolk over de eerste sectie na een hero, zoals op de pagina Tweede brein: bij het laden volledig
// verborgen, op elk formaat. Bij het scrollen trekt de wolk zacht weg, van boven naar onder.
// Alles boven --lift - 30% is zichtbaar, vanaf --lift is alles weg. --lift gaat bij het scrollen van 0%
// (alles verborgen) naar 130% (alles zichtbaar). Zonder animatie is alles zichtbaar.
const LIFT_END = 130;
const liftMask = 'linear-gradient(to bottom, #000 calc(var(--lift) - 30%), transparent var(--lift))';

// Tot welke scrollpositie de wolk wegtrekt: tot de sectie op ongeveer 60% van het venster staat, maar
// altijd over minstens een kwart van het venster, zodat het ook op een groot scherm rustig gaat
const fogEnd = (el) => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    return Math.max(top - window.innerHeight * 0.6, window.innerHeight * 0.25);
};

export default function FogLift({ children }) {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            gsap.fromTo(ref.current, { '--lift': '0%' }, {
                '--lift': `${LIFT_END}%`,
                ease: 'none',
                scrollTrigger: {
                    start: 0,
                    end: () => fogEnd(ref.current),
                    invalidateOnRefresh: true,
                    scrub: 0.6
                }
            });
            // De lettertypes veranderen de hoogte van de tekst, en dus de plaats van de sectie
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} style={{ '--lift': `${LIFT_END}%`, WebkitMaskImage: liftMask, maskImage: liftMask }}>
            {children}
        </div>
    );
}
