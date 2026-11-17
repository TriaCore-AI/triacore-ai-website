import React, { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// "Wat een goede AI-oplossing nodig heeft" op Oplossingen (v2). De titel staat gecentreerd boven alles.
// Vanaf 1024px: de sectie is hoger dan het scherm en terwijl je erdoor scrolt, blijven de lijst en één kaart
// vast in beeld staan. Per onderdeel scrol je ongeveer driekwart scherm (STAP). Links klapt het actieve
// onderdeel open met zijn uitleg; rechts wisselt de inhoud van de kaart met een zachte overgang. Klikken op
// een naam scrolt naar dat onderdeel. In de kaart komt enkel de visual (`beeld`, gemaakt met ChatGPT, als
// WebP in src/assets/oplossingen), geen nummer of titel. Zonder beeld staat er een plaatshouder.
// Op gsm en tablet: per onderdeel de naam, de uitleg en daaronder een kaart, gewoon onder elkaar.
// Wat AI daarmee kan, staat in een eigen sectie eronder (vermogens-sectie.jsx).

const STAP = 75; // vh scrollen per onderdeel
const NAV = 112; // px: hoogte van de navigatiebalk bovenaan; de vastgezette inhoud komt nooit hoger

const MARGE = 16; // px vrij onder de kaart als ze tot onderaan het scherm moet

// Waar de vastgezette inhoud stopt met meeschuiven. Past ze tussen de navigatiebalk en de onderrand, dan precies
// in het midden van het scherm. Is ze hoger (een laag scherm), dan schuift ze tijdens het scrollen zelf mee: bij
// het eerste onderdeel staat de bovenkant net onder de navigatiebalk, bij het laatste staat de onderkant net
// boven de onderrand. Zo is alles altijd te zien. voortgang gaat van 0 (eerste onderdeel) tot 1 (laatste)
const pastIn = (h) => h <= window.innerHeight - NAV - MARGE;
const startTop = (h) => (pastIn(h) ? Math.max(NAV, Math.round((window.innerHeight - h) / 2)) : NAV);
const vastTop = (h, voortgang = 0) => {
    if (pastIn(h)) return startTop(h);
    const eind = window.innerHeight - MARGE - h;
    return Math.round(NAV + (eind - NAV) * voortgang);
};

export default function NodigSectie({ titel, intro, onderdelen, leeg }) {
    const [actief, setActief] = useState(0);
    const vastRef = useRef(null);
    const inhoudRef = useRef(null);
    const n = onderdelen.length;

    // De vastgezette inhoud is zo hoog als nodig (niet een volledig scherm), zodat er na het laatste onderdeel
    // geen lege ruimte overblijft en de volgende sectie op de gewone afstand volgt. De hoogte wordt gemeten; de
    // grootste meting telt, zodat de sectie niet verspringt als een uitleg open- of dichtklapt. Bij een andere
    // schermgrootte wordt opnieuw gemeten. De plaats (top) zetten we rechtstreeks op het element, omdat ze bij
    // een hoge kaart bij elke scrollbeweging verandert
    const [inhoudH, setInhoudH] = useState(0);
    const zetTop = (voortgang = 0) => {
        const el = inhoudRef.current;
        if (el) el.style.top = `${vastTop(el.offsetHeight, voortgang)}px`;
    };
    const voortgangRef = useRef(0);

    useEffect(() => {
        const el = inhoudRef.current;
        if (!el) return undefined;
        const meet = () => {
            setInhoudH((h) => Math.max(h, el.offsetHeight));
            zetTop(voortgangRef.current);
        };
        const opnieuw = () => {
            setInhoudH(el.offsetHeight);
            zetTop(voortgangRef.current);
        };
        const ro = new ResizeObserver(meet);
        ro.observe(el);
        window.addEventListener('resize', opnieuw);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', opnieuw);
        };
    }, []);

    // Verandert de hoogte van deze sectie (na het meten), dan schuift alles eronder op. De scrollanimaties verderop
    // (de kaarten van Wat AI daarmee kan, de titels die opkomen) hadden hun startpunt dan al berekend op de oude
    // hoogte en zouden te laat of nooit starten: daarom rekenen ze hier opnieuw
    useEffect(() => {
        if (!inhoudH) return undefined;
        const id = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => cancelAnimationFrame(id);
    }, [inhoudH]);

    // Welk onderdeel is actief? Hangt af van hoe ver je door de vastgezette sectie gescrold bent. Bij een kaart
    // die hoger is dan het scherm schuift ze hier ook mee (zetTop)
    useEffect(() => {
        let raf = 0;
        const bereken = () => {
            raf = 0;
            const el = vastRef.current;
            if (!el || el.offsetParent === null) return;
            const r = el.getBoundingClientRect();
            const h = inhoudRef.current?.offsetHeight || window.innerHeight;
            const bereik = r.height - h;
            if (bereik <= 0) return;
            const voortgang = Math.min(0.9999, Math.max(0, (startTop(h) - r.top) / bereik));
            voortgangRef.current = voortgang;
            zetTop(voortgang);
            setActief(Math.floor(voortgang * n));
        };
        const opScroll = () => { if (!raf) raf = requestAnimationFrame(bereken); };
        bereken();
        window.addEventListener('scroll', opScroll, { passive: true });
        window.addEventListener('resize', opScroll);
        return () => {
            window.removeEventListener('scroll', opScroll);
            window.removeEventListener('resize', opScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [n]);

    // Naar het midden van de scrollzone van onderdeel i
    const ga = (i) => {
        const el = vastRef.current;
        if (!el) return;
        const h = inhoudRef.current?.offsetHeight || window.innerHeight;
        const bereik = el.offsetHeight - h;
        const doel = el.getBoundingClientRect().top + window.scrollY - startTop(h) + ((i + 0.5) / n) * bereik;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: doel, behavior: reduce ? 'auto' : 'smooth' });
    };

    return (
        <section id="nodig" className="relative scroll-mt-28 pb-24 md:pb-32">
            {/* Gsm en tablet: de titel gewoon boven de onderdelen */}

            {/* Vanaf 1024px: titel, lijst en één kaart, samen vastgezet terwijl je door de sectie scrolt, in het
                midden van het scherm (vastTop). Op een laag scherm (minder dan 900 px hoog) is alles iets compacter;
                is de kaart dan nog hoger dan het scherm, dan schuift ze tijdens het scrollen zacht mee, zodat zowel
                de titel als de onderkant in beeld komen. De ruimte boven de sectie geeft de afstand tot de hero */}
            <div aria-hidden="true" className="hidden lg:block h-24" />
            <div ref={vastRef} className="hidden lg:block relative" style={{ height: inhoudH ? `calc(${inhoudH}px + ${n * STAP}vh)` : `calc(100vh + ${n * STAP}vh)` }}>
                {/* De hele sectie staat op één grote witte kaart met afgeronde hoeken, met links en rechts een smalle
                    marge tot de rand van het scherm, en mee vastgezet */}
                <div ref={inhoudRef} className="sticky top-28 mx-4 xl:mx-6 flex flex-col justify-start px-6 md:px-16 lg:px-20 py-14 xl:py-16 [@media(max-height:900px)]:py-9 bg-white rounded-[2.5rem]">
                    <div className="max-w-7xl w-full mx-auto mb-12 md:mb-16 [@media(max-height:900px)]:mb-7">
                        <h2 className="hero-title text-foreground text-6xl [@media(max-height:900px)]:text-5xl leading-[1.08]">{titel}</h2>
                        {intro && <p className="mt-4 [@media(max-height:900px)]:mt-2 text-foreground/60 text-xl [@media(max-height:900px)]:text-lg leading-relaxed max-w-xl">{intro}</p>}
                    </div>
                    <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-16 items-center">
                        {/* Links: de lijst. Het actieve onderdeel klapt open */}
                        <ol className="col-span-5 flex flex-col">
                            {onderdelen.map((o, i) => {
                                const open = actief === i;
                                return (
                                    <li key={o.id} className="border-t border-foreground/10 last:border-b">
                                        <button
                                            type="button"
                                            onClick={() => ga(i)}
                                            aria-expanded={open}
                                            className="group w-full flex items-center py-4 [@media(max-height:900px)]:py-3 text-left"
                                        >
                                            <span className={`text-xl transition-colors duration-500 ${open ? 'text-foreground font-medium' : 'text-foreground/40 group-hover:text-foreground/70'}`}>
                                                {o.naam}
                                            </span>
                                        </button>
                                        {/* De uitleg klapt open en dicht met de hoogte mee */}
                                        <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                            <div className="overflow-hidden min-h-0">
                                                <div className="pb-6 [@media(max-height:900px)]:pb-4 flex flex-col gap-3 [@media(max-height:900px)]:gap-2">
                                                    {o.tekst.map((t, j) => (
                                                        <p key={j} className="text-base [@media(max-height:900px)]:text-[15px] text-foreground/70 leading-relaxed [@media(max-height:900px)]:leading-normal">{t}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>

                        {/* Rechts: één kaart. De inhoud per onderdeel ligt op elkaar en wisselt met een overgang */}
                        <div className="col-span-7">
                            {/* Altijd in de verhouding van de beelden (4:3), zodat er niets wordt afgeknipt. De breedte
                                is begrensd, zodat de kaart nooit hoger wordt dan ongeveer de helft van het scherm; op een
                                laag scherm wordt ze dus kleiner, maar blijft ze 4:3 */}
                            <div className="relative mx-auto w-full aspect-[4/3] max-w-[calc(min(52vh,540px)*4/3)] [@media(max-height:900px)]:max-w-[calc(min(46vh,440px)*4/3)] rounded-3xl bg-[#fafafa] border border-foreground/[0.08] overflow-hidden">
                                {onderdelen.map((o, i) => (
                                    <div
                                        key={o.id}
                                        aria-hidden={actief !== i}
                                        className={`absolute inset-0 flex flex-col transition-all duration-700 ease-out motion-reduce:transition-none ${actief === i ? 'opacity-100 translate-y-0' : i < actief ? 'opacity-0 -translate-y-6' : 'opacity-0 translate-y-6'}`}
                                    >
                                        {o.beeld
                                            ? <img src={o.beeld} alt={o.alt || ''} className="w-full h-full object-contain" />
                                            : <p className="mt-auto p-10 text-sm text-foreground/30">{leeg}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
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
