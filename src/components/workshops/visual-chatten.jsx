import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUp, Copy, MousePointer2 } from 'lucide-react';
import VisualAchtergrond from './visual-achtergrond';
import { useLanguage } from '../../context/LanguageContext';

// Beeld bij "Chatten in plaats van laten werken": een gewone chat, met echte tekst. Jij typt onderaan een vraag en
// verstuurt ze (rechts, in een grijs wolkje), AI denkt even (drie bolletjes) en schrijft zijn antwoord (links, zonder
// wolkje). Daarna stuur jij bij, en nog eens. De laatste handeling is kopiëren: het werk blijft bij jou liggen,
// dus er komt geen vinkje. Even stil, de chat vervaagt, en het begint opnieuw.
// Elke regel is met de hand afgebroken, zodat alle hoogtes vastliggen.
// Ontworpen op een vaste maat (320 x 240, zoals het vak in 4:3) en meegeschaald met het vak.
// Speelt enkel zolang het in beeld is. Wie in het systeem minder beweging vraagt, ziet het eindbeeld stilstaan.

const BREED = 320;
const VENSTER = { left: 16, top: 16, w: 288, h: 208 };
const LIJST = { left: 12, top: 10, w: 264, h: 154 };

const LIJN = 16;
const TUSSEN = 10;
const WOLK = 12;
const RIJ = 30;

// Het eerste antwoord bevat met opzet een gedachtestreepje: daar stuurt de gebruiker in de volgende vraag op bij
const TEKST = {
    nl: {
        plaats: 'Stel een vraag',
        kopieer: 'Kopiëren',
        gekopieerd: 'Gekopieerd',
        berichten: [
            { van: 'jij', tekst: 'Kan je mijn mail aan Peter schrijven?' },
            {
                van: 'ai',
                intro: 'Natuurlijk! Hier is een voorstel:',
                mail: ['Beste Peter, ik hoop dat deze mail u goed', 'bereikt. Graag kom ik terug op onze', 'afspraak — past vrijdag voor u?']
            },
            { van: 'jij', tekst: 'Geen gedachtestreepjes gebruiken.' },
            {
                van: 'ai',
                intro: 'Begrepen! Hier is de nieuwe versie:',
                mail: ['Beste Peter, ik hoop dat deze mail u goed', 'bereikt. Graag kom ik terug op onze', 'afspraak. Past vrijdag voor u?']
            },
            { van: 'jij', tekst: 'Mag het korter? ‘Graag’ zeg ik nooit.' },
            {
                van: 'ai',
                intro: 'Je hebt gelijk! Een kortere versie:',
                mail: ['Beste Peter, past vrijdag nog voor onze', 'afspraak?']
            }
        ]
    },
    en: {
        plaats: 'Ask anything',
        kopieer: 'Copy',
        gekopieerd: 'Copied',
        berichten: [
            { van: 'jij', tekst: 'Can you write my email to Peter?' },
            {
                van: 'ai',
                intro: 'Of course! Here is a draft:',
                mail: ['Dear Peter, I hope this email finds you', 'well. I would love to follow up on our', 'meeting — does Friday work for you?']
            },
            { van: 'jij', tekst: 'Please don’t use em dashes.' },
            {
                van: 'ai',
                intro: 'Understood! Here is the new version:',
                mail: ['Dear Peter, I hope this email finds you', 'well. I would love to follow up on our', 'meeting. Does Friday work for you?']
            },
            { van: 'jij', tekst: 'Shorter? And I never say ‘love’.' },
            {
                van: 'ai',
                intro: 'You are right! A shorter version:',
                mail: ['Dear Peter, does Friday still work for', 'our meeting?']
            }
        ]
    }
};

// Waar elk bericht in de lijst staat, en hoever de lijst dan omhoog moet: na een vraag zodat de bolletjes eronder
// nog in beeld passen, na een antwoord zodat het hele antwoord in beeld staat
const opmaak = (berichten) => {
    let y = 0;
    return berichten.map((b, i) => {
        const top = y;
        const h = b.van === 'jij'
            ? LIJN + WOLK
            : LIJN + 4 + b.mail.length * LIJN + (i === berichten.length - 1 ? RIJ : 0);
        y += h + TUSSEN;
        const onder = b.van === 'jij' ? top + h + TUSSEN + LIJN : top + h;
        return { ...b, top, h, scroll: Math.max(0, onder - LIJST.h) };
    });
};

export default function VisualChatten() {
    const { language } = useLanguage();
    const tekst = TEKST[language];
    const lijst = opmaak(tekst.berichten);
    const laatste = lijst[lijst.length - 1];

    const ref = useRef(null);
    const podiumRef = useRef(null);

    // Het podium van 320 px breed meeschalen met het vak
    useEffect(() => {
        const root = ref.current;
        const fit = () => { podiumRef.current.style.transform = `scale(${root.clientWidth / BREED})`; };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(root);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const root = ref.current;
        let io;
        const ctx = gsap.context(() => {
            const q = gsap.utils.selector(root);
            const schuiflijst = q('.vc-lijst');
            const plaats = q('.vc-plaats');
            const cursor = q('.vc-cursor');
            const dicht = 'inset(0 100% 0 0)';
            const open = 'inset(0 0% 0 0)';

            const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: 'power2.out' } });

            // Beginstand: meteen bij het laden, en in de timeline zodat ze bij elke ronde terugkomt
            const begin = [
                [schuiflijst, { y: 0, opacity: 1 }],
                [plaats, { opacity: 1 }],
                [q('.vc-invoer'), { opacity: 0, clipPath: dicht }],
                [q('.vc-bericht'), { opacity: 0, y: 8 }],
                [q('.vc-bolletjes'), { opacity: 0 }],
                [q('.vc-regel'), { clipPath: dicht }],
                [q('.vc-rij'), { opacity: 0 }],
                [q('.vc-knop'), { backgroundColor: 'rgba(15, 23, 42, 0)' }],
                [q('.vc-kopieer'), { opacity: 1 }],
                [q('.vc-gekopieerd'), { opacity: 0 }],
                [cursor, { opacity: 0, x: 56, y: 30, scale: 1 }]
            ];
            begin.forEach(([el, v]) => {
                gsap.set(el, v);
                tl.set(el, v, 0);
            });
            tl.to({}, { duration: 0.6 });

            let scroll = 0;
            lijst.forEach((b, i) => {
                const el = q('.vc-bericht')[i];
                const nieuw = b.scroll !== scroll;
                scroll = b.scroll;

                if (b.van === 'jij') {
                    const invoer = q(`.vc-invoer[data-i="${i}"]`);
                    const tekens = b.tekst.length;
                    // Typen: de tekst komt teken per teken in het invoerveld
                    tl.set(plaats, { opacity: 0 })
                        .set(invoer, { opacity: 1 })
                        .to(invoer, { clipPath: open, duration: tekens * 0.04, ease: `steps(${tekens})` })
                        .to({}, { duration: 0.35 })
                        // Versturen: het invoerveld is weer leeg en de vraag staat in de chat
                        .set(invoer, { opacity: 0 })
                        .set(plaats, { opacity: 1 })
                        .to(el, { opacity: 1, y: 0, duration: 0.4 });
                    if (nieuw) tl.to(schuiflijst, { y: -b.scroll, duration: 0.5, ease: 'power2.inOut' }, '<');
                    tl.to({}, { duration: 0.25 });
                } else {
                    const regels = el.querySelectorAll('.vc-regel');
                    const bolletjes = el.querySelector('.vc-bolletjes');
                    const duur = gsap.utils.toArray(regels).map((r) => r.textContent.length * 0.022);
                    // Denken: de bolletjes deinen een paar keer
                    tl.set(el, { opacity: 1, y: 0 })
                        .to(bolletjes, { opacity: 1, duration: 0.2 })
                        .to(el.querySelectorAll('.vc-bol'), { y: -3, duration: 0.2, ease: 'sine.inOut', stagger: 0.09, yoyo: true, repeat: 3 }, '<')
                        .to(bolletjes, { opacity: 0, duration: 0.15 });
                    // Schrijven: de regels lopen na elkaar vol, terwijl de lijst rustig meeschuift
                    if (nieuw) {
                        tl.to(schuiflijst, { y: -b.scroll, duration: duur.reduce((a, d) => a + d, 0), ease: 'sine.inOut' }, '>');
                        tl.addLabel(`schrijf${i}`, '<');
                    } else {
                        tl.addLabel(`schrijf${i}`, '>');
                    }
                    let t = 0;
                    regels.forEach((r, j) => {
                        tl.to(r, { clipPath: open, duration: duur[j], ease: 'none' }, `schrijf${i}+=${t}`);
                        t += duur[j];
                    });
                    // Tijd om te lezen, behalve na het laatste antwoord: daar wacht de kopieerknop
                    if (i < lijst.length - 1) tl.to({}, { duration: 1.1 });
                }
            });

            // De laatste handeling: het antwoord kopiëren
            tl.to(q('.vc-rij'), { opacity: 1, duration: 0.4 })
                .to({}, { duration: 0.6 })
                .to(cursor, { opacity: 1, duration: 0.3 })
                .to(cursor, { x: 0, y: 0, duration: 0.9, ease: 'power2.inOut' }, '<')
                .to(cursor, { scale: 0.82, duration: 0.1, ease: 'power1.out' }, '>0.1')
                .to(cursor, { scale: 1, duration: 0.18, ease: 'power1.out' })
                .to(q('.vc-knop'), { backgroundColor: 'rgba(15, 23, 42, 0.06)', duration: 0.2 }, '<')
                .to(q('.vc-kopieer'), { opacity: 0, duration: 0.2 }, '<')
                .to(q('.vc-gekopieerd'), { opacity: 1, duration: 0.2 }, '<')
                .addLabel('klaar')
                .to({}, { duration: 2.2 })
                .to([schuiflijst, cursor], { opacity: 0, duration: 0.6, ease: 'power2.inOut' })
                .to({}, { duration: 0.3 });

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                tl.seek('klaar').pause();
                return;
            }
            // Enkel spelen zolang het vak in beeld is
            io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()));
            io.observe(root);
        }, ref);
        return () => {
            io?.disconnect();
            ctx.revert();
        };
    }, [language]);

    return (
        <div ref={ref} aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <VisualAchtergrond />

            <div ref={podiumRef} className="absolute top-0 left-0 w-[320px] h-[240px] origin-top-left text-[11px] leading-4">
                <div
                    className="absolute rounded-[14px] bg-white border border-foreground/[0.07]"
                    style={{ left: VENSTER.left, top: VENSTER.top, width: VENSTER.w, height: VENSTER.h }}
                >
                    {/* De berichten: wat bovenaan wegschuift, vervaagt */}
                    <div
                        className="absolute overflow-hidden"
                        style={{
                            left: LIJST.left, top: LIJST.top, width: LIJST.w, height: LIJST.h,
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 14px)',
                            maskImage: 'linear-gradient(to bottom, transparent 0, #000 14px)'
                        }}
                    >
                        <div className="vc-lijst absolute inset-x-0 top-0">
                            {lijst.map((b, i) => (b.van === 'jij' ? (
                                <div
                                    key={i}
                                    className="vc-bericht absolute right-0 rounded-[12px] bg-foreground/[0.06] px-2.5 py-1.5 whitespace-nowrap text-foreground/80"
                                    style={{ top: b.top, height: b.h }}
                                >
                                    {b.tekst}
                                </div>
                            ) : (
                                <div key={i} className="vc-bericht absolute left-0 right-0 whitespace-nowrap" style={{ top: b.top, height: b.h }}>
                                    <div className="vc-bolletjes absolute left-0 top-[6px] flex gap-[4px]">
                                        {[0, 1, 2].map((d) => (
                                            <span key={d} className="vc-bol block w-[5px] h-[5px] rounded-full bg-foreground/35" />
                                        ))}
                                    </div>
                                    <p className="vc-regel text-foreground/50 mb-1">{b.intro}</p>
                                    {b.mail.map((regel, j) => (
                                        <p key={j} className="vc-regel text-foreground/80">{regel}</p>
                                    ))}
                                    {i === lijst.length - 1 && (
                                        <div className="vc-rij absolute left-0 bottom-0">
                                            <span className="vc-knop inline-flex items-center gap-1 h-6 px-2 rounded-md border border-foreground/10 text-foreground/60">
                                                <Copy size={11} strokeWidth={1.75} />
                                                <span className="grid">
                                                    <span className="vc-kopieer [grid-area:1/1]">{tekst.kopieer}</span>
                                                    <span className="vc-gekopieerd [grid-area:1/1]">{tekst.gekopieerd}</span>
                                                </span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )))}
                        </div>
                    </div>

                    {/* Het invoerveld, met per vraag de tekst die er getypt wordt */}
                    <div className="absolute left-3 right-3 bottom-2 h-7 rounded-full border border-foreground/10">
                        <span className="vc-plaats absolute left-3 top-[5px] text-foreground/35">{tekst.plaats}</span>
                        {lijst.map((b, i) => b.van === 'jij' && (
                            <span key={i} data-i={i} className="vc-invoer absolute left-3 top-[5px] whitespace-nowrap text-foreground/80">{b.tekst}</span>
                        ))}
                        <span className="absolute right-1 top-1 w-[18px] h-[18px] rounded-full bg-foreground/10 text-foreground/60 flex items-center justify-center">
                            <ArrowUp size={11} strokeWidth={2} />
                        </span>
                    </div>
                </div>

                {/* De muis die het antwoord kopieert. Staat boven de chat en landt op de kopieerknop */}
                <MousePointer2
                    size={16}
                    strokeWidth={1.5}
                    className="vc-cursor absolute text-foreground fill-white"
                    style={{
                        left: VENSTER.left + LIJST.left + 26,
                        top: VENSTER.top + LIJST.top + (laatste.top + laatste.h - laatste.scroll) - 14
                    }}
                />
            </div>
        </div>
    );
}
