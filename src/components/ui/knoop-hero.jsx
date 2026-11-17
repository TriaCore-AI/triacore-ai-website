import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import HalftoneAchtergrond from './halftone-achtergrond';

// Hero van Oplossingen (v2): "de knoop". Eén lijn vertelt het verhaal.
// 1. De eerste titelregel (het probleem) veegt open, en een grijze, verwarde knoop tekent zich van links
//    naar rechts.
// 2. De knoop wordt strakgetrokken zoals een touw: de uiteinden eerst, het midden als laatste. De lijn
//    kleurt groen en de tweede titelregel (daar beginnen wij) komt op.
// 3. Daarna komen de korte zin en de knop. Achter alles ligt een stilstaand raster van kleine puntjes.
// De knoop en de rechte lijn zijn dezelfde reeks punten, zodat de ene vloeiend in de andere overgaat
// zonder extra plug-in. Tekenen gebeurt punt per punt (geen streepjestruc), zodat het op elk scherm even
// snel gaat. Wie minder beweging vraagt, ziet meteen de rechte groene lijn.

const W = 1200;          // breedte van het tekenvlak (viewBox); het rekt mee met de pagina
const H = 220;           // hoogte van het tekenvlak
const CY = H / 2;        // hoogte van de rechte lijn
const N = 420;           // aantal punten op de lijn
const GRIJS = '#94a3b8';
const GROEN = '#628f69';

// De verwarde knoop: één doorlopende lijn van links naar rechts. In het midden krult ze in onregelmatige
// lussen, naar de randen toe dooft dat uit (een klokvorm), zodat de uiteinden recht en los liggen.
// Vaste formules, dus elke keer dezelfde knoop.
function knoopPunt(t) {
    const klok = Math.exp(-Math.pow((t - 0.5) / 0.17, 2));     // 1 in het midden, bijna 0 aan de randen
    const a = t * Math.PI * 2;
    const dx = Math.sin(a * 10) * 80 + Math.sin(a * 17 + 1.3) * 30;
    const dy = Math.cos(a * 10) * 58 + Math.sin(a * 13 + 0.4) * 24;
    return [t * W + dx * klok, CY + dy * klok];
}

const KNOOP = Array.from({ length: N }, (_, i) => knoopPunt(i / (N - 1)));

// Bij het strektrekken bewegen de punten aan de uiteinden eerst en het midden als laatste
const VERTRAGING = KNOOP.map((_, i) => 1 - Math.abs(i / (N - 1) - 0.5) * 2);   // 0 aan de randen, 1 in het midden

const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// Het pad: `strak` gaat van 0 (knoop) tot 1 (rechte lijn), `getekend` is welk deel al getekend is (0 tot 1)
function pad(strak, getekend = 1) {
    const tot = Math.max(2, Math.round(getekend * N));
    let d = '';
    for (let i = 0; i < tot; i++) {
        const e = easeInOut(Math.min(1, Math.max(0, strak * 1.6 - VERTRAGING[i] * 0.6)));
        const x = KNOOP[i][0] + ((i / (N - 1)) * W - KNOOP[i][0]) * e;
        const y = KNOOP[i][1] + (CY - KNOOP[i][1]) * e;
        d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
}

export default function KnoopHero({ titelProbleem, titelAntwoord, intro, children }) {
    const ref = useRef(null);
    const lijnRef = useRef(null);

    useLayoutEffect(() => {
        const lijn = lijnRef.current;
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const staat = { strak: 0, getekend: 0 };
            const teken = () => lijn.setAttribute('d', pad(staat.strak, staat.getekend));
            teken();
            gsap.set(lijn, { stroke: GRIJS, opacity: 0 });

            const tl = gsap.timeline({ paused: true });

            // 1. Het probleem: titelregel en de knoop die zich tekent
            tl.fromTo('.kh-probleem',
                { clipPath: 'inset(-20% 100% -35% -5%)', x: -16 },
                { clipPath: 'inset(-20% -5% -35% -5%)', x: 0, duration: 1.6, ease: 'power2.inOut', clearProps: 'clipPath' }, 0)
                .set(lijn, { opacity: 1 }, 0.3)
                .to(staat, { getekend: 1, duration: 1.9, ease: 'power1.inOut', onUpdate: teken }, 0.3)

            // 2. Strektrekken, de lijn kleurt groen en het antwoord komt op
                .to(staat, { strak: 1, duration: 1.7, ease: 'power2.inOut', onUpdate: teken }, 2.4)
                .to(lijn, { stroke: GROEN, duration: 1.2, ease: 'power1.inOut' }, 2.8)
                .fromTo('.kh-antwoord',
                    { clipPath: 'inset(-20% 100% -35% -5%)', x: -16 },
                    { clipPath: 'inset(-20% -5% -35% -5%)', x: 0, duration: 1.5, ease: 'power2.inOut', clearProps: 'clipPath' }, 3.1)

            // 3. De zin en de knop
                .from('.kh-fade', { y: 10, opacity: 0, duration: 1.3, ease: 'power2.out', stagger: 0.12 }, 4.0);

            const play = () => tl.play();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
            else play();
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} className="relative px-6 md:px-16 lg:px-24 pt-40 md:pt-48 max-xl:[@media(max-height:500px)]:pt-32 pb-20 md:pb-28">
            {/* Achtergrond: stilstaand raster van kleine, doorzichtige groene puntjes over de hele hero */}
            <HalftoneAchtergrond />
            <div className="relative max-w-7xl mx-auto">
                <h1 className="hero-title text-foreground text-[2.6rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.02]">
                    <span className="kh-probleem block">{titelProbleem}</span>
                    <span className="kh-antwoord block italic text-accent">{titelAntwoord}</span>
                </h1>

                {/* De lijn over de volle breedte van de inhoud: eerst een knoop, dan strakgetrokken. De lijndikte
                    blijft gelijk, ook al rekt het tekenvlak mee */}
                <div aria-hidden="true" className="relative mt-6 md:mt-8 h-[120px] md:h-[180px]">
                    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
                        <path
                            ref={lijnRef}
                            d={pad(1)}
                            fill="none"
                            stroke={GROEN}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                </div>

                <div className="mt-6 md:mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <p className="kh-fade text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-xl">{intro}</p>
                    {children && <div className="kh-fade shrink-0">{children}</div>}
                </div>
            </div>
        </section>
    );
}
