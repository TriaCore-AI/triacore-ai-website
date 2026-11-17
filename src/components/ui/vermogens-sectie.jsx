import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScanText, Workflow } from 'lucide-react';
import { AntwoordenVisual, ControlerenVisual } from './vermogen-visuals';
import CornerTrace from './corner-trace';

gsap.registerPlugin(ScrollTrigger);

// "Wat AI daarmee kan" op Oplossingen (v2), onder de sectie met de onderdelen (nodig-sectie.jsx). Per vermogen
// een kaart met de naam en één zin.
// Vanaf 1024px: bovenaan de twee kaarten met een kleine interface (Antwoorden en Controleren, zie
// vermogen-visuals.jsx) naast elkaar, eronder de drie andere met enkel tekst. Op tablet twee per rij.
// Komt de sectie in beeld, dan schuiven de kaarten één voor één vanuit een andere richting op hun plaats, als
// puzzelstukken (VAN). Zodra een kaart met interface ligt, speelt die één keer af; met de muis erover speelt ze
// opnieuw, ten vroegste een paar seconden na de vorige keer. Wie minder beweging vraagt, ziet meteen alles.

// De volgorde in het raster, de plaats van elke kaart en de interface (als die er is). Vanaf 1024px een
// dambord: Antwoorden links met Lezen en Uitvoeren rechts ernaast, daaronder Voorstellen links (met de
// kernzin groot) en Controleren rechts. Zo staan de twee interfaces schuin tegenover elkaar
const RASTER = [
    // Antwoorden wisselt zelf tussen drie situaties (lus), dus daar speelt de muis niets opnieuw af
    { id: 'antwoorden', klasse: 'md:col-span-2 lg:col-span-7 lg:row-span-2', Visual: AntwoordenVisual, lus: true },
    // De twee smalle kaarten: bovenaan een icoontje, onderaan de naam en de zin
    { id: 'lezen', klasse: 'lg:col-span-5', Icoon: ScanText },
    { id: 'uitvoeren', klasse: 'lg:col-span-5', Icoon: Workflow },
    { id: 'voorstellen', klasse: 'md:col-span-2 lg:col-span-5 lg:row-span-2' },
    { id: 'controleren', klasse: 'md:col-span-2 lg:col-span-7 lg:row-span-2', Visual: ControlerenVisual }
];

// Van waar elk puzzelstuk komt (in px en graden)
const VAN = [
    { x: -100, y: -30, rotation: -2 },
    { x: 100, y: -50, rotation: 2 },
    { x: 110, y: 20, rotation: 1.5 },
    { x: -100, y: 60, rotation: -1.5 },
    { x: 100, y: 80, rotation: 1.5 }
];

const OPNIEUW_NA = 10000; // ms voor een interface bij hover opnieuw mag spelen (Antwoorden duurt ongeveer 9 s)

export default function VermogensSectie({ titel, intro, vermogens, nl }) {
    const rasterRef = useRef(null);
    const kaartRefs = useRef([]);
    const laatst = useRef(RASTER.map(() => 0));
    const [runs, setRuns] = useState(() => RASTER.map(() => -1)); // -1: nog niet gespeeld

    const speel = (i) => {
        laatst.current[i] = Date.now();
        setRuns((r) => r.map((v, j) => (j === i ? v + 1 : v)));
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                ScrollTrigger.create({ trigger: rasterRef.current, start: 'top 80%', once: true, onEnter: () => RASTER.forEach((_, i) => speel(i)) });
                return;
            }
            const kaarten = kaartRefs.current;
            kaarten.forEach((el, i) => gsap.set(el, { ...VAN[i], opacity: 0 }));
            const tl = gsap.timeline({ paused: true });
            kaarten.forEach((el, i) => {
                const t = i * 0.24;
                tl.to(el, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1.15, ease: 'power3.out', clearProps: 'transform' }, t);
                if (RASTER[i].Visual) tl.call(() => speel(i), null, t + 0.75);
            });
            ScrollTrigger.create({ trigger: rasterRef.current, start: 'top 75%', once: true, onEnter: () => tl.play() });
        }, rasterRef);
        return () => ctx.revert();
    }, []);

    const perId = Object.fromEntries(vermogens.map((v) => [v.id, v]));

    return (
        <section id="vermogens" className="relative scroll-mt-28 overflow-x-clip px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 md:mb-16">
                    <h2 className="hero-title text-foreground text-4xl md:text-5xl lg:text-6xl leading-[1.08]">{titel}</h2>
                    {intro && <p className="mt-4 text-foreground/60 text-lg md:text-xl leading-relaxed max-w-xl">{intro}</p>}
                </div>
                <div ref={rasterRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
                    {RASTER.map((plek, i) => {
                        const v = perId[plek.id];
                        const Visual = plek.Visual;
                        const Icoon = plek.Icoon;
                        return (
                            // Het omhulsel knipt niets af, zodat de L-lijn (CornerTrace) net buiten de kaart kan
                            // lopen; de kaart zelf erin knipt haar inhoud wel af aan de afgeronde rand
                            <article
                                key={plek.id}
                                ref={(el) => { kaartRefs.current[i] = el; }}
                                onMouseEnter={() => { if (Visual && !plek.lus && runs[i] >= 0 && Date.now() - laatst.current[i] > OPNIEUW_NA) speel(i); }}
                                className={`${plek.klasse} group relative flex`}
                            >
                                <CornerTrace />
                                <div className="flex-1 flex flex-col rounded-3xl border border-foreground/[0.08] bg-[#fafafa] overflow-hidden transition-colors duration-500 group-hover:bg-white group-hover:border-foreground/15">
                                <div className={`p-7 md:p-8 ${Visual ? '' : 'flex-1 flex flex-col'}`}>
                                    {/* Smalle kaarten: het icoontje bovenaan, de naam en de zin onderaan */}
                                    {Icoon && (
                                        <span aria-hidden="true" className="mb-10 w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                                            <Icoon size={22} strokeWidth={1.5} />
                                        </span>
                                    )}
                                    <h3 className={`text-2xl font-medium text-foreground leading-tight ${Icoon ? 'mt-auto' : ''}`}>{v.naam}</h3>
                                    <p className="mt-3 text-base text-foreground/70 leading-relaxed max-w-md">{v.tekst}</p>
                                    {/* De kernzin, groot onderaan de hoge kaart zonder interface */}
                                    {v.zin && (
                                        <p className="mt-auto pt-10 hero-title text-foreground text-3xl md:text-4xl leading-[1.1]">
                                            {v.zin[0]}<br /><span className="italic text-accent">{v.zin[1]}</span>
                                        </p>
                                    )}
                                </div>
                                {Visual && <Visual key={runs[i]} aan={runs[i] >= 0} nl={nl} />}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
