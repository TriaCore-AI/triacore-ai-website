import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// "Wat een goede AI-oplossing nodig heeft" op AI-oplossingen. Alles staat op één grote witte kaart met afgeronde
// hoeken, de titel bovenaan. Niets staat vast tijdens het scrollen (vraag Lucas, 20/11: de vroegere vastgezette
// versie met een lijst en één wisselende kaart vond hij vervelend).
// Vanaf 1024px: per onderdeel één blok met bovenaan het nummer en de naam, dan de visual (`beeld`, gemaakt met
// ChatGPT, als WebP in src/assets/oplossingen) en daaronder de uitleg. De blokken staan afwisselend links en
// rechts, en elk volgend blok begint op de hoogte van het midden van het vorige: Kennis links bovenaan, Gegevens
// rechts vanaf het midden van Kennis, Invoer links vanaf het midden van Gegevens, enzovoort. Elk blok zweeft als
// geheel binnen, een linkse van links en een rechtse van rechts, en pas als het bijna midden in het scherm staat
// (vraag Lucas, 20/11: niet te vroeg tonen). Speelt één keer.
// Op gsm en tablet: per onderdeel één lichtgroen kaartje, gewoon onder elkaar.
// Wat AI daarmee kan, staat in een eigen sectie eronder (vermogens-sectie.jsx).

const TUSSEN = 48; // px: minstens zoveel ruimte tussen twee blokken in dezelfde kolom
const AFSTAND = 96; // px: van zo ver opzij zweeft een blok binnen
const START = 'center 60%'; // een blok komt binnen zodra zijn midden 60% van de schermhoogte bereikt
const START_EERSTE = 'top 80%'; // het eerste blok al zodra het in beeld schuift, anders staat er onder de titel even een leeg vlak

// Waar elk blok staat. Blok i begint op het midden van blok i-1 (de zigzag), plus de helft van TUSSEN: zo is
// elke stap even groot en zit er tussen twee blokken in dezelfde kolom precies TUSSEN ruimte. Is het blok erboven
// in dezelfde kolom (i-2) veel hoger, dan schuift blok i verder naar beneden, zodat ze nooit overlappen
function berekenPlaatsen(hoogtes) {
    const tops = [];
    hoogtes.forEach((_, i) => {
        let top = 0;
        if (i >= 1) top = tops[i - 1] + (hoogtes[i - 1] + TUSSEN) / 2;
        if (i >= 2) top = Math.max(top, tops[i - 2] + hoogtes[i - 2] + TUSSEN);
        tops.push(Math.round(top));
    });
    const totaal = Math.max(0, ...hoogtes.map((h, i) => tops[i] + h));
    return { tops, totaal };
}

function Zigzag({ onderdelen, leeg }) {
    const blokRefs = useRef([]);
    const [plaats, setPlaats] = useState({ tops: [], totaal: 0 });

    // Meten vóór het tekenen (useLayoutEffect), zodat de blokken nooit even op elkaar staan. Opnieuw meten als een
    // blok van hoogte verandert: een andere schermbreedte, of de letters die later inladen
    useLayoutEffect(() => {
        const meet = () => {
            const hoogtes = blokRefs.current.map((el) => el?.offsetHeight || 0);
            const nieuw = berekenPlaatsen(hoogtes);
            setPlaats((oud) => (oud.totaal === nieuw.totaal && oud.tops.join() === nieuw.tops.join() ? oud : nieuw));
        };
        meet();
        const ro = new ResizeObserver(meet);
        blokRefs.current.forEach((el) => el && ro.observe(el));
        return () => ro.disconnect();
    }, [onderdelen]);

    // Verandert de hoogte van de sectie, dan schuift alles eronder op. De scrollanimaties (ook die van deze blokken
    // zelf) rekenen dan hun startpunt opnieuw uit, anders zouden ze te vroeg, te laat of nooit starten
    useEffect(() => {
        if (!plaats.totaal) return undefined;
        const id = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => cancelAnimationFrame(id);
    }, [plaats]);

    // Het binnenzweven: zacht uitlopend (power3.out), enkel opzij en in doorzichtigheid, zonder op- of neerwaartse
    // beweging. Wie in het systeem minder beweging vraagt, ziet alles meteen
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        const ctx = gsap.context(() => {
            blokRefs.current.forEach((el, i) => {
                if (!el) return;
                gsap.fromTo(el,
                    { x: i % 2 === 1 ? AFSTAND : -AFSTAND, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: i === 0 ? START_EERSTE : START, once: true } });
            });
        });
        return () => ctx.revert();
    }, [onderdelen]);

    return (
        <ol className="relative" style={{ height: plaats.totaal || undefined }}>
            {onderdelen.map((o, i) => {
                const rechts = i % 2 === 1;
                return (
                    <li
                        key={o.id}
                        ref={(el) => { blokRefs.current[i] = el; }}
                        className="absolute w-[calc(50%-2.5rem)] xl:w-[calc(50%-3.5rem)]"
                        style={{ top: plaats.tops[i] ?? 0, [rechts ? 'right' : 'left']: 0 }}
                    >
                        <div className="flex items-baseline gap-3">
                            <span className="text-sm font-medium text-accent tabular-nums">0{i + 1}</span>
                            <h3 className="text-2xl xl:text-3xl font-medium text-foreground leading-tight">{o.naam}</h3>
                        </div>
                        {/* De visual, altijd 4:3 zoals de beelden, zodat er niets wordt afgeknipt */}
                        <div className="mt-5 w-full aspect-[4/3] rounded-3xl bg-[#fafafa] border border-foreground/[0.08] overflow-hidden">
                            {o.beeld
                                ? <img src={o.beeld} alt={o.alt || ''} loading="lazy" decoding="async" className="w-full h-full object-contain" />
                                : <p className="h-full flex items-end p-10 text-sm text-foreground/30">{leeg}</p>}
                        </div>
                        <div className="mt-6 flex flex-col gap-3">
                            {o.tekst.map((t, j) => (
                                <p key={j} className="text-base text-foreground/70 leading-relaxed">{t}</p>
                            ))}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

export default function NodigSectie({ titel, intro, onderdelen, leeg }) {
    return (
        <section id="nodig" className="relative scroll-mt-28 pb-24 md:pb-32">
            {/* Vanaf 1024px: de titel en de zigzag op één grote witte kaart, met links en rechts een smalle marge tot
                de rand van het scherm. De ruimte erboven geeft de afstand tot de hero */}
            <div className="hidden lg:block pt-24 overflow-x-clip">
                <div className="mx-4 xl:mx-6 px-20 py-16 xl:py-20 bg-white rounded-[2.5rem]">
                    <div data-reveal-head className="max-w-6xl mx-auto mb-16 xl:mb-20">
                        <h2 className="rv-fade hero-title text-foreground text-6xl leading-[1.08]">{titel}</h2>
                        {intro && <p className="rv-fade mt-4 text-foreground/60 text-xl leading-relaxed max-w-xl">{intro}</p>}
                    </div>
                    <div className="max-w-6xl mx-auto">
                        <Zigzag onderdelen={onderdelen} leeg={leeg} />
                    </div>
                </div>
            </div>

            {/* Gsm en tablet: per onderdeel één witte kaart met het nummer, de naam, de uitleg en het beeld. Elke kaart
                komt zacht op zodra ze in beeld schuift (data-reveal-head en rv-fade, uitgevoerd door useReveal op de
                pagina) */}
            {/* Net als op desktop staat de hele sectie op één grote witte kaart met afgeronde hoeken, over de volle
                breedte, zodat duidelijk is waar ze begint en eindigt. De kaartjes per onderdeel erin zijn lichtgroen,
                zonder rand, zodat ze zich zacht van de grote kaart onderscheiden */}
            <div className="lg:hidden pt-10 md:pt-14">
                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] px-3 md:px-6 pt-12 md:pt-16 pb-3 md:pb-6">
                    <div className="px-3 md:px-4 mb-10 md:mb-12">
                        <h2 className="hero-title text-foreground text-4xl md:text-5xl leading-[1.08]">{titel}</h2>
                        {intro && <p className="mt-4 text-foreground/60 text-lg md:text-xl leading-relaxed max-w-xl">{intro}</p>}
                    </div>
            <div className="flex flex-col gap-3 md:gap-4">
                {onderdelen.map((o, i) => (
                    <div key={o.id} data-reveal-head>
                        <article className="rv-fade rounded-3xl bg-[#f2f6f3] p-5 md:p-7">
                            <p className="text-sm font-medium text-accent tabular-nums">0{i + 1}</p>
                            <h3 className="mt-2 text-2xl md:text-3xl font-medium text-foreground leading-tight">{o.naam}</h3>
                            <div className="mt-4 flex flex-col gap-3">
                                {o.tekst.map((t, j) => (
                                    <p key={j} className="text-base md:text-lg text-foreground/70 leading-relaxed">{t}</p>
                                ))}
                            </div>
                            {o.beeld
                                ? <img src={o.beeld} alt={o.alt || ''} className="mt-6 w-full aspect-[4/3] object-cover rounded-2xl" />
                                : (
                                    <div className="mt-6 min-h-[220px] rounded-2xl bg-[#fafafa] p-8 flex items-end">
                                        <p className="text-sm text-foreground/30">{leeg}</p>
                                    </div>
                                )}
                        </article>
                    </div>
                ))}
            </div>
                </div>
            </div>
        </section>
    );
}
