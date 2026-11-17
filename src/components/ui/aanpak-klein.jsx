import React, { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Onze aanpak op kleinere schermen (onder 1280): het logo als geheel, waarvan telkens één balk openklapt tot zijn
// pijler. De pagina wordt nergens vastgehouden: je scrolt altijd vrij (de vorige versie hield de pagina even
// vast en haperde op gsm; vraag van Lucas, 17/11). Zo werkt het:
// - Scrol je naar beneden en komt het logo in beeld, dan klapt "Begrijpen" open.
// - Met twee subtiele pijltjes onder het logo ga je een pijler verder of terug: "Vertalen", dan "Waarmaken".
//   Een tik op een balk opent ook die pijler.
// - Scrol je verder naar beneden, voorbij het blok, dan klapt het weer dicht.
// - Kom je van onderen terug naar boven, dan klapt "Waarmaken" open en ga je met de pijltjes terug.
// De hoogte ligt vast en er staat telkens maar één pijler open, dus wat eronder staat verspringt niet.
// Bij "minder beweging" in het systeem staan alle pijlers gewoon open, zonder pijltjes.

// De maten van het logo: 406.72 breed en 249.46 hoog, balken van 291.56 x 48.57, 51.88 tussenruimte
const KOLOM = 'min(72vw, 340px)';
const LOGO_HOOGTE = 249.46 / 406.72;
const PANEEL = 136;   // hoogte van een open pijler in pixels, genoeg voor een titel en drie regels uitleg

export default function AanpakKlein({ pijlers }) {
    const wrapRef = useRef(null);
    const [actief, setActief] = useState(-1);
    const [rustig] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const laatste = pijlers.length - 1;

    useEffect(() => {
        if (rustig) return undefined;
        // Het blok telt als "in beeld" zolang het logo rond het midden van het scherm staat
        const st = ScrollTrigger.create({
            trigger: wrapRef.current,
            start: 'top 65%',
            end: 'bottom 25%',
            onEnter: () => setActief(0),            // van boven binnen: de eerste pijler
            onEnterBack: () => setActief(laatste),  // van onderen terug: de laatste pijler
            onLeave: () => setActief(-1),           // voorbij naar beneden: dicht
            onLeaveBack: () => setActief(-1)        // terug naar boven voorbij: dicht
        });
        return () => st.kill();
    }, [rustig, laatste]);

    const naar = (i) => setActief(Math.max(0, Math.min(laatste, i)));

    return (
        <div ref={wrapRef} data-reveal-head className="xl:hidden">
            <div className="rv-fade mx-auto" style={{ width: KOLOM }}>
                <ol style={{ minHeight: rustig ? undefined : `calc(${KOLOM} * ${LOGO_HOOGTE} + ${PANEEL}px)` }}>
                    {pijlers.map((p, i) => {
                        const open = rustig || i === actief;
                        const rechts = i === 1;
                        return (
                            <li key={p.word} className={rechts ? 'text-right' : 'text-left'} style={{ marginTop: i > 0 ? '12.76%' : 0 }}>
                                {/* Een tik op een balk opent die pijler */}
                                <button
                                    type="button"
                                    onClick={() => naar(i)}
                                    aria-expanded={open}
                                    aria-label={p.word}
                                    className={`block rounded-full bg-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${rechts ? 'ml-auto' : ''}`}
                                    style={{ width: '71.69%', aspectRatio: '291.56 / 48.57' }}
                                />
                                <div
                                    className="grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
                                    style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                                >
                                    <div className="min-h-0 overflow-hidden">
                                        <div
                                            className={`pt-4 transition-opacity ${open ? 'opacity-100 duration-500 delay-200' : 'opacity-0 duration-200'}`}
                                            style={{ height: rustig ? undefined : PANEEL }}
                                        >
                                            <div className={`flex items-baseline gap-3 ${rechts ? 'justify-end' : ''}`}>
                                                <span className="text-sm text-accent tabular-nums">/0{i + 1}</span>
                                                <span className="text-3xl font-medium text-foreground">{p.word}</span>
                                            </div>
                                            <p className="mt-1.5 text-base text-foreground/60 leading-relaxed">{p.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>

                {/* De pijltjes: een pijler terug of verder, met ertussen waar je bent. Klein en rustig */}
                {!rustig && (
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => naar(actief - 1)}
                            disabled={actief <= 0}
                            aria-label="Vorige pijler"
                            className="w-11 h-11 rounded-full border border-foreground/15 flex items-center justify-center text-foreground/70 transition-colors duration-300 hover:border-foreground/40 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                            <ChevronUp size={18} strokeWidth={1.5} />
                        </button>
                        <span className="min-w-[3rem] text-center text-sm text-foreground/50 tabular-nums" aria-live="polite">
                            {actief >= 0 ? `${actief + 1} / ${pijlers.length}` : ''}
                        </span>
                        <button
                            type="button"
                            onClick={() => naar(actief + 1)}
                            disabled={actief >= laatste}
                            aria-label="Volgende pijler"
                            className="w-11 h-11 rounded-full border border-foreground/15 flex items-center justify-center text-foreground/70 transition-colors duration-300 hover:border-foreground/40 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                            <ChevronDown size={18} strokeWidth={1.5} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
