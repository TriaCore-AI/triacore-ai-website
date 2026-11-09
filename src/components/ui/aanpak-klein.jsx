import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Onze aanpak op kleinere schermen (onder 1280): het logo als geheel, waarvan de balken één voor één openklappen
// tot hun pijler. Zo begeleid dat niemand er snel overheen scrolt (vraag van Lucas, 9/11):
// - Komt het logo in het midden van het scherm, dan stopt de pagina even en klapt "Begrijpen" open.
// - Wie verder scrolt of veegt, stopt bij "Vertalen"; nog eens verder en "Waarmaken" klapt open, waarna je
//   meteen weer vrij doorscrolt. Tijdens het openklappen telt een nieuwe veeg niet mee, zodat het nooit
//   twee stappen ineens neemt. Omhoog scrollen gaat een stap terug, en voorbij "Begrijpen" weer vrij omhoog.
// - Het loopt één keer. Daarna blijft "Waarmaken" open en kan je op een balk tikken om die pijler te openen.
// Enkel op dit blok staat de pagina dus even stil, bewust: elders op de site nooit.
// De hoogte ligt vast en er staat telkens maar één pijler open, dus wat eronder staat verspringt niet.
// Bij "minder beweging" in het systeem staan alle pijlers gewoon open en stopt er niets.

// De maten van het logo: 406.72 breed en 249.46 hoog, balken van 291.56 x 48.57, 51.88 tussenruimte
const KOLOM = 'min(72vw, 340px)';
const LOGO_HOOGTE = 249.46 / 406.72;
const PANEEL = 136;   // hoogte van een open pijler in pixels, genoeg voor een titel en drie regels uitleg
const OPENKLAPPEN = 800;   // zo lang (ms) telt een nieuwe veeg niet mee: de duur van het openklappen

export default function AanpakKlein({ pijlers }) {
    const wrapRef = useRef(null);
    const [actief, setActief] = useState(-1);
    const actiefRef = useRef(-1);
    const bezigRef = useRef(false);
    const [rustig] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const zet = (i) => {
        actiefRef.current = i;
        setActief(i);
    };

    useEffect(() => {
        if (rustig) return undefined;
        let klaar = false;
        let timer = null;

        // Houdt de pagina op haar plaats zolang het blok stilstaat (ook als er nog vaart in het scrollen zit)
        const vast = ScrollTrigger.observe({
            type: 'wheel,scroll',
            preventDefault: true,
            allowClicks: true,
            onEnable: (self) => { self.savedScroll = self.scrollY(); },
            onChangeY: (self) => self.scrollY(self.savedScroll)
        });
        vast.disable();

        const los = () => {
            intentie.disable();
            vast.disable();
        };

        // Eén stap vooruit (+1) of terug (-1)
        const stap = (richting) => {
            if (bezigRef.current) return;
            const volgende = actiefRef.current + richting;
            if (volgende < 0) {
                zet(-1);
                los();
                return;
            }
            if (volgende > 2) {
                klaar = true;
                los();
                return;
            }
            zet(volgende);
            bezigRef.current = true;
            clearTimeout(timer);
            timer = setTimeout(() => {
                bezigRef.current = false;
                // Bij "Waarmaken" ben je door: de pagina scrolt weer vrij
                if (volgende === 2 && richting > 0) {
                    klaar = true;
                    los();
                }
            }, OPENKLAPPEN);
        };

        // Wat de bezoeker wil: verder (naar beneden) of terug. Wiel en vinger in dezelfde richting
        const intentie = ScrollTrigger.observe({
            type: 'wheel,touch',
            wheelSpeed: -1,
            tolerance: 10,
            preventDefault: true,
            onUp: () => stap(1),
            onDown: () => stap(-1)
        });
        intentie.disable();

        // Het stoppunt: het logo staat iets boven het midden van het scherm. Enkel naar beneden, enkel onder 1280
        // (daarboven staat het grote schema) en maar één keer
        const st = ScrollTrigger.create({
            trigger: wrapRef.current,
            start: 'center 55%',
            onEnter: (self) => {
                if (klaar || vast.isEnabled || !window.matchMedia('(max-width: 1279px)').matches) return;
                self.scroll(self.start);
                vast.enable();
                intentie.enable();
                stap(1);
            }
        });

        // Springt het snelmenu voorbij dit blok, dan mag het onderweg niet stoppen: meteen afronden
        const afronden = () => {
            klaar = true;
            los();
            if (actiefRef.current < 2) zet(2);
        };
        window.addEventListener('aanpak-klaar', afronden);

        return () => {
            window.removeEventListener('aanpak-klaar', afronden);
            clearTimeout(timer);
            st.kill();
            intentie.kill();
            vast.kill();
            bezigRef.current = false;
        };
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
                            {/* Een tik op een balk opent die pijler */}
                            <button
                                type="button"
                                onClick={() => { if (!bezigRef.current) zet(i); }}
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
        </div>
    );
}
