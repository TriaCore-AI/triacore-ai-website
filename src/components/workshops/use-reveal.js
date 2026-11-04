import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Dezelfde rustige scrollanimaties als op de homepage, voor de secties van de workshoppagina.
// Elk blok met data-reveal speelt één keer zodra het in beeld komt: titels schuiven op uit hun masker
// (.rv-mask-inner), lijnen tekenen zich van links naar rechts (.rv-line), kaarten komen na elkaar binnen
// (.rv-card), de rest komt zacht op (.rv-fade).
// Wie in het systeem minder beweging vraagt, krijgt alles meteen te zien.
export default function useReveal(ref) {
    useEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const EASE = 'expo.out';
            const LINE_EASE = 'power3.inOut';
            // Tempo zoals op de homepage: lager is trager
            const PACE = 0.7;

            gsap.utils.toArray('[data-reveal]').forEach((block) => {
                const tl = gsap.timeline({ scrollTrigger: { trigger: block, start: 'top 85%', once: true } }).timeScale(PACE);
                const masks = block.querySelectorAll('.rv-mask-inner');
                const lines = block.querySelectorAll('.rv-line');
                const fades = block.querySelectorAll('.rv-fade');
                const cards = block.querySelectorAll('.rv-card');
                if (cards.length) tl.from(cards, { y: 48, opacity: 0, duration: 1.4, ease: EASE, stagger: 0.12 }, 0);
                if (masks.length) tl.from(masks, { yPercent: 110, duration: 1.4, ease: EASE }, 0);
                if (lines.length) tl.from(lines, { scaleX: 0, transformOrigin: 'left center', duration: 1.4, ease: LINE_EASE, stagger: 0.15 }, 0);
                if (fades.length) tl.from(fades, { y: 16, opacity: 0, duration: 1.2, ease: EASE, stagger: 0.1 }, masks.length || lines.length ? 0.3 : 0);
            });
        }, ref);
        return () => ctx.revert();
    }, [ref]);
}
