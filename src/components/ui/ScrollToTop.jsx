import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Elke nieuwe pagina begint bovenaan. Lucas merkte (20/11) dat hij na het wisselen van de homepage naar
// AI-oplossingen soms op dezelfde hoogte uitkwam als waar hij op de homepage was. Daarom, bij elke paginawissel:
// - de browser zet zelf geen oude scrollpositie meer terug (scrollRestoration manual); de site springt
//   sowieso naar boven, ook bij terug en vooruit;
// - het geheugen van ScrollTrigger (GSAP) wordt gewist: dat onthoudt de scrollpositie bij elke herberekening
//   en kan de positie van de vorige pagina terugzetten zodra de nieuwe pagina haar animaties klaarzet;
// - de sprong gebeurt in useLayoutEffect, dus nog voor de nieuwe pagina haar scrollanimaties opbouwt (dit
//   onderdeel staat in main.jsx voor de routes), en voor de zekerheid nog eens net na het tekenen.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        ScrollTrigger.clearScrollMemory('manual');
        window.scrollTo(0, 0);
        let tweede = 0;
        const eerste = requestAnimationFrame(() => {
            tweede = requestAnimationFrame(() => window.scrollTo(0, 0));
        });
        return () => {
            cancelAnimationFrame(eerste);
            cancelAnimationFrame(tweede);
        };
    }, [pathname]);

    return null;
}
