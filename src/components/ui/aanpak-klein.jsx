import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Onze aanpak op kleinere schermen: het logo als geheel, waarvan de balken tijdens het scrollen één voor één
// openklappen. Klapt de volgende open, dan klapt de vorige dicht; de derde blijft open staan. Terugscrollen
// werkt omgekeerd. De pagina staat nooit vast: de stand hangt af van waar het logo in beeld staat, en het
// open- en dichtklappen zelf loopt op eigen tempo, zodat een pijler nooit half open blijft hangen.
// De hoogte ligt vast en er staat telkens maar één pijler open, dus wat eronder staat verspringt niet.
// Bij "minder beweging" in het systeem staan alle pijlers gewoon open.

// De maten van het logo: 406.72 breed en 249.46 hoog, balken van 291.56 x 48.57, 51.88 tussenruimte
const KOLOM = 'min(72vw, 340px)';
const LOGO_HOOGTE = 249.46 / 406.72;
const PANEEL = 136;   // hoogte van een open pijler in pixels, genoeg voor een titel en drie regels uitleg

export default function AanpakKlein({ pijlers }) {
    const wrapRef = useRef(null);
    const [actief, setActief] = useState(-1);
    const [rustig] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    useEffect(() => {
        if (rustig) return undefined;
        const stand = (self) => setActief(self.progress <= 0 ? -1 : Math.min(2, Math.floor(self.progress * 3)));
        // Van bovenkant op 58% van het scherm tot helemaal bovenaan. Het logo staat dus eerst volledig in beeld
        // voor de eerste pijler opent, en de derde opent als het logo nog ruim zichtbaar is
        const st = ScrollTrigger.create({
            trigger: wrapRef.current,
            start: 'top 58%',
            end: 'top 0%',
            onUpdate: stand,
            onRefresh: stand
        });
        return () => st.kill();
    }, [rustig]);

    return (
        <div ref={wrapRef} data-reveal-head className="xl:hidden">
            <ol
                className="rv-fade mx-auto"
                style={{
                    width: KOLOM,
                    minHeight: rustig ? undefined : `calc(${KOLOM} * ${LOGO_HOOGTE} + ${PANEEL}px)`
                }}
            >
                {pijlers.map((p, i) => {
                    const open = rustig || i === actief;
                    const rechts = i === 1;
                    return (
                        <li key={p.word} className={rechts ? 'text-right' : 'text-left'} style={{ marginTop: i > 0 ? '12.76%' : 0 }}>
                            <span
                                className={`block rounded-full bg-foreground ${rechts ? 'ml-auto' : ''}`}
                                style={{ width: '71.69%', aspectRatio: '291.56 / 48.57' }}
                                aria-hidden="true"
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
        </div>
    );
}
