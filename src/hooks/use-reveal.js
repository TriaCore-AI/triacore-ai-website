import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Scrollanimaties voor een pagina, in dezelfde taal als de homepage. Elk blok met data-reveal-head
// speelt één keer zodra het in beeld komt: titels schuiven op uit hun masker (.rv-mask-inner),
// lijnen tekenen zich van links naar rechts (.rv-line) en de rest komt zacht op (.rv-fade).
// Wie in het systeem minder beweging vraagt, krijgt alles meteen te zien.
export default function useReveal(scopeRef) {
    useEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            gsap.utils.toArray('[data-reveal-head]').forEach((head) => {
                const tl = gsap.timeline({ scrollTrigger: { trigger: head, start: 'top 85%', once: true } }).timeScale(0.7);
                const masks = head.querySelectorAll('.rv-mask-inner');
                const lines = head.querySelectorAll('.rv-line');
                const fades = head.querySelectorAll('.rv-fade');
                if (masks.length) tl.from(masks, { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.1 }, 0);
                if (lines.length) tl.from(lines, { scaleX: 0, duration: 1.4, ease: 'power3.inOut', stagger: 0.12 }, masks.length ? 0.15 : 0);
                if (fades.length) tl.from(fades, { y: 16, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1 }, masks.length || lines.length ? 0.3 : 0);
            });
        }, scopeRef);
        return () => ctx.revert();
    }, [scopeRef]);
}
