import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Check, RotateCw } from 'lucide-react';
import VisualAchtergrond from './visual-achtergrond';

// Beeld bij "Chatten in plaats van laten werken": een kleine chat die eindeloos heen en weer gaat.
// Jij typt (rechts, blauw), AI denkt even (drie bolletjes) en antwoordt (links, wit). Dat gaat drie keer
// heen en weer; het pilletje rechtsboven telt hoe vaak jij tussenbeide moest komen. Pas dan komt er een
// output naar voren, met een groen vinkje. Even stil, alles vervaagt, en het begint opnieuw.
// Geen echte woorden, enkel tekstbalkjes: rustig, en in elke taal hetzelfde.
// Ontworpen op een vaste maat (320 x 240, zoals het vak in 4:3) en meegeschaald met het vak.
// Speelt enkel zolang het in beeld is. Wie in het systeem minder beweging vraagt, ziet het eindbeeld stilstaan.

const BREED = 320;
const VENSTER = { left: 28, top: 44, w: 264, h: 180 };
const TUSSEN = 8;

// De berichten, van boven naar onder: van wie, hoe breed, en de lengte van elk tekstbalkje (px)
const BERICHTEN = [
    { van: 'jij', w: 150, lijnen: [118, 76] },
    { van: 'ai', w: 196, lijnen: [164, 150, 92] },
    { van: 'jij', w: 112, lijnen: [80] },
    { van: 'ai', w: 184, lijnen: [152, 128, 140] },
    { van: 'jij', w: 132, lijnen: [100] },
    { van: 'ai', w: 172, lijnen: [140, 104] }
];

// Hoogte van een bericht: binnenruimte boven en onder, balkjes van 6 px met 6 px ertussen
const hoogte = (n) => 12 + 12 * n;
let _y = 0;
const LIJST = BERICHTEN.map((b) => {
    const top = _y;
    const h = hoogte(b.lijnen.length);
    _y += h + TUSSEN;
    // Hoeveel de lijst omhoog moet om dit bericht volledig in beeld te houden
    return { ...b, top, h, scroll: Math.max(0, top + h - VENSTER.h) };
});

// Breedte en hoogte van een AI-bericht zolang het nog "denkt"
const DENKT = { w: 46, h: 24 };

export default function VisualChatten() {
    const ref = useRef(null);
    const podiumRef = useRef(null);
    const tellerRef = useRef(null);

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
            const lijst = q('.vc-lijst');
            const venster = q('.vc-venster');
            const pil = q('.vc-pil');
            const output = q('.vc-output');
            const vinkje = q('.vc-vinkje');
            const tel = (n) => () => { tellerRef.current.textContent = n; };

            const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: 'power2.out' } });

            // Beginstand: meteen bij het laden, en in de timeline zodat ze bij elke ronde terugkomt
            const begin = [
                [lijst, { y: 0 }],
                [venster, { opacity: 1 }],
                [pil, { opacity: 0, y: -4 }],
                [output, { opacity: 0, y: 24, scale: 0.96 }],
                [vinkje, { scale: 0 }],
                [q('.vc-bericht'), { opacity: 0, y: 10 }],
                [q('.vc-lijn'), { scaleX: 0 }],
                [q('.vc-ai'), { width: DENKT.w, height: DENKT.h }],
                [q('.vc-bolletjes'), { opacity: 1 }]
            ];
            begin.forEach(([el, v]) => {
                gsap.set(el, v);
                tl.set(el, v, 0);
            });
            tl.to({}, { duration: 0.5 });

            let beurt = 0;
            let scroll = 0;
            LIJST.forEach((b, i) => {
                const el = q('.vc-bericht')[i];
                const lijnen = el.querySelectorAll('.vc-lijn');
                const schuif = () => {
                    if (b.scroll === scroll) return;
                    scroll = b.scroll;
                    tl.to(lijst, { y: -b.scroll, duration: 0.6, ease: 'power2.inOut' }, '<');
                };

                if (b.van === 'jij') {
                    beurt += 1;
                    tl.to(el, { opacity: 1, y: 0, duration: 0.45 });
                    schuif();
                    tl.call(tel(beurt), null, '<');
                    if (beurt === 1) tl.to(pil, { opacity: 1, y: 0, duration: 0.5 }, '<');
                    // Typen: de balkjes lopen vol, een na een
                    tl.to(lijnen, { scaleX: 1, duration: 0.5, ease: 'power1.inOut', stagger: 0.25 }, '<0.15')
                        .to({}, { duration: 0.35 });
                } else {
                    const bolletjes = el.querySelectorAll('.vc-bol');
                    tl.to(el, { opacity: 1, y: 0, duration: 0.4 })
                        // Denken: de bolletjes deinen een paar keer
                        .to(bolletjes, { y: -3, duration: 0.22, ease: 'sine.inOut', stagger: 0.1, yoyo: true, repeat: 5 })
                        .to(el.querySelector('.vc-bolletjes'), { opacity: 0, duration: 0.2 })
                        .to(el, { width: b.w, height: b.h, duration: 0.5, ease: 'power2.inOut' }, '<');
                    schuif();
                    tl.to(lijnen, { scaleX: 1, duration: 0.45, ease: 'power2.out', stagger: 0.08 }, '>-0.15')
                        .to({}, { duration: 0.5 });
                }
            });

            // Eindelijk een resultaat: de chat treedt terug, de output komt naar voren
            tl.to(venster, { opacity: 0.25, duration: 0.6, ease: 'power2.inOut' })
                .to(output, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'expo.out' }, '<0.15')
                .to(q('.vc-output .vc-lijn'), { scaleX: 1, duration: 0.5, stagger: 0.08 }, '<0.2')
                .to(vinkje, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, '<0.3')
                .addLabel('klaar')
                .to({}, { duration: 2 })
                .to([venster, output, pil], { opacity: 0, duration: 0.6, ease: 'power2.inOut' })
                .to({}, { duration: 0.3 });

            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                tl.seek('klaar').pause();
                tellerRef.current.textContent = beurt;
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
    }, []);

    return (
        <div ref={ref} className="absolute inset-0 overflow-hidden">
            <VisualAchtergrond />

            <div ref={podiumRef} className="absolute top-0 left-0 w-[320px] h-[240px] origin-top-left">
                {/* Hoe vaak jij tussenbeide kwam */}
                <div className="vc-pil absolute top-3 right-3 flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-white border border-foreground/[0.07] text-[11px] font-medium text-foreground/70 tabular-nums">
                    <RotateCw size={11} strokeWidth={2} aria-hidden="true" />
                    <span ref={tellerRef}>1</span>
                </div>

                {/* Het chatvenster: wat bovenaan wegschuift, vervaagt */}
                <div
                    className="vc-venster absolute overflow-hidden"
                    style={{
                        left: VENSTER.left, top: VENSTER.top, width: VENSTER.w, height: VENSTER.h,
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 24px)',
                        maskImage: 'linear-gradient(to bottom, transparent 0, #000 24px)'
                    }}
                >
                    <div className="vc-lijst absolute inset-x-0 top-0">
                        {LIJST.map((b, i) => (b.van === 'jij' ? (
                            <div
                                key={i}
                                className="vc-bericht absolute right-0 rounded-[12px] rounded-br-[4px] bg-foreground"
                                style={{ top: b.top, width: b.w, height: b.h }}
                            >
                                <div className="absolute left-3 top-[9px] flex flex-col gap-[6px]">
                                    {b.lijnen.map((l, j) => (
                                        <span key={j} className="vc-lijn block h-[6px] rounded-full bg-white/40 origin-left" style={{ width: l }} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div
                                key={i}
                                className="vc-bericht vc-ai absolute left-0 overflow-hidden rounded-[12px] rounded-bl-[4px] bg-white border border-foreground/[0.07]"
                                style={{ top: b.top, width: b.w, height: b.h }}
                            >
                                <div className="vc-bolletjes absolute left-3 top-[9px] flex gap-[4px]">
                                    {[0, 1, 2].map((d) => (
                                        <span key={d} className="vc-bol block w-[5px] h-[5px] rounded-full bg-foreground/35" />
                                    ))}
                                </div>
                                <div className="absolute left-3 top-[9px] flex flex-col gap-[6px]">
                                    {b.lijnen.map((l, j) => (
                                        <span key={j} className="vc-lijn block h-[6px] rounded-full bg-foreground/[0.12] origin-left" style={{ width: l }} />
                                    ))}
                                </div>
                            </div>
                        )))}
                    </div>
                </div>

                {/* De output, pas na al dat heen en weer */}
                <div className="vc-output absolute left-1/2 top-[62px] -ml-[80px] w-[160px] h-[124px] rounded-[14px] bg-white border border-foreground/[0.08] p-4">
                    <div className="flex items-center gap-2">
                        <span className="block w-3.5 h-3.5 rounded-[4px] bg-accent/80" />
                        <span className="vc-lijn block h-[6px] w-[64px] rounded-full bg-foreground/25 origin-left" />
                    </div>
                    <div className="mt-4 flex flex-col gap-[7px]">
                        {[120, 104, 116, 72].map((l, j) => (
                            <span key={j} className="vc-lijn block h-[6px] rounded-full bg-foreground/[0.12] origin-left" style={{ width: l }} />
                        ))}
                    </div>
                    <span className="vc-vinkje absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center">
                        <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                    </span>
                </div>
            </div>
        </div>
    );
}
