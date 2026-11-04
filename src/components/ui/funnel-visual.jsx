import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

// De visual onder de hero van Custom tools: in het midden een lichte kaart met het logo, en aan beide kanten
// een trechter met gebogen randen, breed aan de buitenkant en smal waar hij de kaart raakt.
// Links staan de woorden van het handwerk dat we wegnemen (Excel, overtypen, papieren werkbonnen ...),
// verspreid in verschillende maten en tinten: de chaos die in de kaart samenkomt. Hoe dichter bij de kaart,
// hoe kleiner en vager. Op een gsm staat de trechter rechtop (zie FunnelVertical): daar is de hoogte er wel
// en de breedte niet. In de kaart het logo met "Uw tool op maat" eronder. De kaart en de bogen staan er meteen en bewegen niet.
// Bij het laden staat er verder niets (op vraag van Lucas: anders is het te druk). Bij het scrollen komen de
// woorden links op, glijden ze langs de bogen de kaart in, en komen de resultaten rechts uit de kaart.
// Alles hangt aan de scroll: wie stopt met scrollen, ziet niets meer bewegen, en terug naar boven scrollen
// draait het om. De hero staat zolang even vast. Wie minder beweging vraagt, ziet meteen beide kanten, stil.
// De trechter is enkel een zacht lichter vlak met dunne randen, zonder gloed (zie de branding bible).

// Elk woord heeft een vaste plaats, met de hand gekozen op de volle breedte (de linkerkant van de kaart op
// 520 px): x is het midden van het woord, dy de afstand boven (-) of onder (+) het midden van de trechter.
// Drie zones: aan de buitenkant, waar de trechter het wijdst is, de lange woorden over de volle hoogte (ze
// mogen er een beetje uit lopen, waar de bogen vervagen); in het midden de middellange; bij de kaart de
// korte. Woorden die horizontaal overlappen, liggen minstens 50 px uit elkaar in de hoogte; woorden op
// ongeveer dezelfde hoogte raken elkaar horizontaal niet. Een paar woorden staan iets groter en vet (b).
// Op een kleiner scherm blijven de woorden in dezelfde verhouding staan (zie placeWords)
const PLACES = [
    { x: 95, dy: -250, size: 16 },
    { x: 110, dy: -60, size: 19, b: true },
    { x: 120, dy: 60, size: 16 },
    { x: 140, dy: 170, size: 18, b: true },
    { x: 95, dy: 255, size: 15 },
    { x: 150, dy: -165, size: 15 },
    { x: 290, dy: -115, size: 15 },
    { x: 300, dy: 120, size: 15 },
    { x: 300, dy: -35, size: 17, b: true },
    { x: 455, dy: -15, size: 16, b: true },
    { x: 470, dy: 35, size: 14 },
    { x: 265, dy: 45, size: 19, b: true },
    { x: 400, dy: -50, size: 15 },
    { x: 395, dy: 40, size: 15 },
    { x: 497, dy: -40, size: 13 }
];

const SHOW_WORDS = true;

const WORDS = {
    nl: [
        'Verspreide documenten', 'Wachten op goedkeuring', 'Manuele verwerking',
        'Papieren werkbonnen', 'Kopiëren en plakken', 'Dubbele registratie',
        'Bellen naar kantoor', 'Onvolledige bonnen', 'Losse mails',
        'Excel', 'Zoeken', 'Overtypen',
        'Papierwerk', 'Dubbel werk', 'Fouten'
    ],
    en: [
        'Scattered documents', 'Waiting for approval', 'Manual processing',
        'Paper work orders', 'Copy and paste', 'Double entry',
        'Calling the office', 'Incomplete notes', 'Loose emails',
        'Excel', 'Searching', 'Retyping',
        'Paperwork', 'Double work', 'Errors'
    ]
};

// Rechts: wat eruit komt. Bewust het tegendeel van links: geen chaos maar orde. Alle resultaten even groot,
// donker en links uitgelijnd, onder elkaar in één kolom, op gelijke afstand en verticaal gecentreerd op de
// kaart. De volgorde loopt van concreet naar het eindresultaat, dat in het groen staat. Op elk scherm staan
// ze er allemaal, en op een kleiner scherm blijven ze goed leesbaar: de kolom mag dan buiten de trechter
// vallen en lange regels lopen over twee lijnen, zolang alles binnen het scherm past
const RESULT_STYLE = {
    3: { xr: (cL) => 240 * (cL / 520), gap: 50, size: 18 },
    2: { xr: (cL) => 0.3 * cL, gap: 52, size: 17 },
    1: { xr: (cL) => 0.25 * cL, gap: 50, size: 16 }
};
const RESULT_TEXT = {
    nl: ['Live overzicht', 'Alles op één plek', 'Meteen terug te vinden', 'Correcte facturen', 'Minder fouten', 'Tijd voor het echte werk'],
    en: ['Live overview', 'Everything in one place', 'Found right away', 'Correct invoices', 'Fewer errors', 'Time for the real work']
};

// Een vaste, licht wisselende tint en dikte per woord. Een vaste reeks, zodat het er bij elk bezoek
// hetzelfde uitziet
const rnd = (i, k) => {
    const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
    return x - Math.floor(x);
};

// De volle maten van de compositie: daarvoor zijn de plaatsen in PLACES gekozen
const FULL = { w: 1280, h: 760 };
// Onder deze breedte staat de trechter rechtop
const VERTICAL_BELOW = 640;

// De onderkant van de navigatiebalk
const navBottom = () => {
    const pill = document.querySelector('nav')?.firstElementChild;
    return pill ? pill.getBoundingClientRect().bottom : 0;
};

// De hoogte van de compositie: ze past altijd tussen de navigatiebalk en de onderrand van het venster, zodat
// ze volledig in beeld staat als de hero vaststaat
const fitHeight = (w) => {
    const room = window.innerHeight - navBottom() - 16;
    return Math.round(w < VERTICAL_BELOW ? Math.max(480, Math.min(680, room)) : Math.max(460, Math.min(FULL.h, room)));
};

// Zet de hero vast zodra het midden van de visual midden tussen de navigatiebalk en de onderrand van het
// venster staat, en laat de animatie afspelen op de scroll (bewuste uitzondering op de regel uit de branding
// bible, op vraag van Lucas). Terug naar boven scrollen draait alles om
const heroPin = (frame, distance) => {
    const hero = frame.closest('section');
    return {
        trigger: hero,
        pin: hero,
        start: () => {
            const nav = navBottom();
            const target = nav + (window.innerHeight - nav) / 2;
            const center = frame.getBoundingClientRect().top + window.scrollY + frame.offsetHeight / 2;
            return Math.max(0, center - target);
        },
        end: `+=${distance}`,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        // Eerst berekend, zodat de secties eronder rekening houden met de extra scrollafstand
        refreshPriority: 1,
        scrub: 0.6
    };
};

// Twee dunne groene lijnen lopen tegelijk rond de kaart, van boog naar boog. De kop loopt voorop, de staart
// volgt zacht en haalt ze op het einde in, zodat de lijn daar uitloopt. Ze hangen aan de scroll zoals de rest:
// wie pauzeert, ziet ze stilstaan, wie doorscrolt, laat ze lopen
const addTrace = (tl, traceEls) => {
    const line = { head: 0, tail: 0 };
    const draw = () => {
        const length = line.head - line.tail;
        traceEls.forEach((el) => {
            el.style.opacity = length > 0.002 ? '1' : '0';
            el.setAttribute('stroke-dasharray', `${length} 2`);
            el.setAttribute('stroke-dashoffset', String(-line.tail));
        });
    };
    draw();
    tl.to(line, { head: 1, duration: 3.2, ease: 'sine.inOut', onUpdate: draw }, 4.4)
        .to(line, { tail: 1, duration: 3.2, ease: 'sine.inOut', onUpdate: draw }, 5);
};

// De twee groene lijnen als pad in een svg bovenop de kaart
const TraceLines = ({ w, h, paths }) => (
    <svg className="pointer-events-none absolute inset-0 w-full h-full overflow-visible" viewBox={`0 0 ${w} ${h}`}>
        {paths.map((path) => (
            <path
                key={path}
                className="fv-trace text-accent opacity-0"
                d={path}
                pathLength="1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        ))}
    </svg>
);

// De maten van de compositie. Ze schaalt als één geheel mee met de breedte en de hoogte (s), zodat alles op
// elk scherm op dezelfde manier ten opzichte van elkaar staat. De trechters komen niet op de hoeken van de
// kaart samen, maar op de zijkant, op gelijke afstand van de boven- en onderkant (mT en mB, een kwart van de
// hoogte van de kaart naar binnen). De hoogte van het vlak bepaalt hoe ver de uiteinden van de bovenste
// en de onderste boog uit elkaar liggen: hoe hoger, hoe wijder de trechter aan de buitenkant opengaat
const layout = (w, h) => {
    const hk = h / FULL.h;
    const s = Math.max(0.62, Math.min(1, w / FULL.w, hk));
    const cw = 240 * s;
    const ch = 210 * s;
    const pad = 16;
    const cL = (w - cw) / 2;
    const cT = (h - ch) / 2;
    const inset = ch * 0.25;
    return { w, h, hk, s, cw, ch, pad, cL, cR: cL + cw, cT, cB: cT + ch, mT: cT + inset, mB: cT + ch - inset, vertical: w < VERTICAL_BELOW };
};

// De rand van een trechter is één boog zonder knik: hij vertrekt vlak uit de zijkant van de kaart en loopt
// steeds steiler naar de buitenkant, tot hij hoog (of laag) eindigt en daar vervaagt. Een kwadratische
// curve met het stuurpunt op de hoogte van de kaart, op BEND van de buitenkant: hoe kleiner, hoe langer
// de boog vlak blijft en hoe steiler hij op het einde opgaat. Hoog, zodat het smalste stuk bij de kaart
// heel kort is en de trechter meteen breder wordt
const BEND = 0.72;
// STEEP: hoe steil de boog al uit de kaart vertrekt. 0 is vlak uit de zijkant; hoger maakt het dal bij de
// kaart dieper en scherper. Het stuurpunt ligt dan niet op de hoogte van de kaart, maar een stuk richting
// het uiteinde, zodat de boog meteen omhoog (of omlaag) gaat, nog altijd zonder knik
const STEEP = 0;
const ctrlX = (xo, xc) => xo + BEND * (xc - xo);
const ctrlY = (yo, yc) => yc + STEEP * (yo - yc);
// Van de buitenkant (xo, yo) naar de kaart (xc, yc), als nieuw pad
const fromOuter = (xo, yo, xc, yc) => `M${xo} ${yo} Q${ctrlX(xo, xc)} ${ctrlY(yo, yc)} ${xc} ${yc}`;
// Van de kaart terug naar de buitenkant, als vervolg van een pad
const toOuter = (xc, yc, xo, yo) => `Q${ctrlX(xo, xc)} ${ctrlY(yo, yc)} ${xo} ${yo}`;

// Hoe ver de linker trechter op horizontale positie x boven en onder het midden reikt (de halve hoogte),
// precies volgens de boog hierboven
const halfAt = (d, x) => {
    const qx = ctrlX(0, d.cL);
    const qy = ctrlY(d.pad, d.mT);
    const a = d.cL - 2 * qx;
    const b = 2 * qx;
    const u = Math.min(1, Math.max(0, Math.abs(a) < 1e-6 ? x / b : (-b + Math.sqrt(b * b + 4 * a * x)) / (2 * a)));
    const top = (1 - u) * (1 - u) * d.pad + 2 * u * (1 - u) * qy + u * u * d.mT;
    return d.h / 2 - top;
};

// Welke woorden als eerste een plaats krijgen, verwijzend naar WORDS. Eerst de vette, verspreid over de
// trechter, dan telkens een woord uit een andere zone, zodat wat overblijft ook met minder woorden
// gelijkmatig verspreid staat
const PRIORITY = [1, 3, 8, 11, 9, 6, 7, 10, 0, 4, 5, 2, 12, 13, 14];

// Elk woord op dezelfde plaats als op een groot scherm, in verhouding tot de compositie. Past een woord daar
// niet zonder een ander te raken, of niet tussen de rand van het scherm en de kaart, dan valt het weg
const placeWords = (d, texts) => {
    const k = d.cL / 520;
    const edge = 10 - (window.innerWidth - d.w) / 2;
    const placed = [];
    PRIORITY.forEach((i) => {
        const pl = PLACES[i];
        const size = Math.round((pl.size + 1) * Math.max(0.85, d.s));
        const half = texts[i].length * size * (pl.b ? 0.29 : 0.27);
        const min = edge + half;
        const max = d.cL - 10 - half;
        if (min > max) return;
        const x = Math.max(min, Math.min(max, pl.x * k));
        const room = Math.max(0, halfAt(d, x) - size);
        const dy = Math.max(-room, Math.min(room, pl.dy * d.hk));
        const clash = placed.some((o) => Math.abs(o.x - x) < o.half + half + 2 && Math.abs(o.dy - dy) < (o.size + size) / 2 + 6);
        if (!clash) placed.push({ i, x, dy, size, half });
    });
    return placed;
};

// Hoeveel px er gescrold wordt terwijl de hero vaststaat: hoe meer, hoe trager de animatie
const FLOW_DISTANCE = { horizontal: 880, vertical: 550 };

// De trechter rechtop, voor een gsm. Bovenaan is hij breed en wordt hij smal naar de kaart toe, onderaan gaat
// hij weer open. Boven staan de woorden, verspreid; onder de resultaten, om de beurt links en rechts. De
// bogen vertrekken op de boven- en onderkant van de kaart, op een kwart van de breedte naar binnen, en lopen
// tot de rand. De animatie is dezelfde als op een groter scherm, maar dan van boven naar onder.

// De woorden, verwijzend naar WORDS: v is de plaats van boven (0) naar de kaart (1), c de plaats van links (-1)
// naar rechts (1) over de volle breedte van het scherm. Telkens een eigen hoogte of ver genoeg uit elkaar, de
// korte woorden bij de kaart
const VERTICAL_WORDS = [
    { i: 0, v: 0.08, c: -0.55, size: 13 },
    { i: 9, v: 0.2, c: -0.8, size: 15 },
    { i: 7, v: 0.2, c: 0.45, size: 13 },
    { i: 1, v: 0.32, c: -0.1, size: 15 },
    { i: 10, v: 0.44, c: -0.75, size: 13 },
    { i: 12, v: 0.44, c: 0.7, size: 13 },
    { i: 8, v: 0.56, c: -0.2, size: 15 },
    { i: 11, v: 0.68, c: 0.45, size: 15 },
    { i: 13, v: 0.8, c: -0.35, size: 13 },
    { i: 14, v: 0.92, c: 0.1, size: 13 }
];

function FunnelVertical({ w, h }) {
    const { language } = useLanguage();
    const ref = useRef(null);
    const cw = 170;
    const ch = 110;
    const cL = (w - cw) / 2;
    const cT = (h - ch) / 2;
    const cB = cT + ch;
    const mL = cL + cw * 0.25;
    const mR = cL + cw * 0.75;
    const mid = w / 2;

    // Elke boog: van de rand naar de kaart, met het stuurpunt recht boven of onder het raakpunt op de kaart
    const arc = (xo, yo, xc, yc) => `M${xo} ${yo} Q${xc} ${yo + BEND * (yc - yo)} ${xc} ${yc}`;
    const arcBack = (xc, yc, xo, yo) => `Q${xc} ${yo + BEND * (yc - yo)} ${xo} ${yo}`;

    // De woorden gebruiken de volle breedte van het scherm: ze mogen gerust buiten de trechter vallen
    const screenHalf = window.innerWidth / 2 - 10;
    const words = VERTICAL_WORDS.map((wd) => {
        const text = WORDS[language][wd.i];
        const half = text.length * wd.size * (PLACES[wd.i].b ? 0.29 : 0.27);
        const m = wd.v * cT;
        const x = mid + wd.c * Math.max(0, screenHalf - half);
        const base = PLACES[wd.i].b ? 0.85 : 0.65;
        return { text, x, m, size: wd.size, bold: !!PLACES[wd.i].b, tone: base * (0.75 + 0.25 * wd.v), order: 1 - wd.v };
    });

    const resultGap = (h - cB - 16) / RESULT_TEXT[language].length;
    // De resultaten staan om de beurt links en rechts, elk op een eigen hoogte, en mogen buiten de trechter vallen
    const results = RESULT_TEXT[language].map((text, i, all) => {
        const half = text.length * 15 * 0.27;
        return {
            text,
            x: mid + (i % 2 ? 1 : -1) * 0.6 * Math.max(0, screenHalf - half),
            y: cB + resultGap * (i + 0.6),
            accent: i === all.length - 1,
            order: i
        };
    });

    useLayoutEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const root = ref.current;
        const byOrder = (a, b) => Number(a.dataset.order) - Number(b.dataset.order);
        const wordEls = [...root.querySelectorAll('.fv-word')].sort(byOrder);
        const resultEls = [...root.querySelectorAll('.fv-result')].sort(byOrder);
        const traceEls = [...root.querySelectorAll('.fv-trace')];

        // Een woord zakt naar de kaart en schuift daarbij naar het midden
        const renderWord = (el, st) => {
            const x0 = Number(el.dataset.x);
            const m0 = Number(el.dataset.m);
            const m = m0 + (cT + 6 - m0) * st.p;
            const x = x0 + (mid - x0) * st.p;
            const rise = (1 - st.a) * 8;
            el.style.opacity = String(st.a * Math.min(1, (1 - st.p) / 0.3));
            el.style.transform = `translate(${x - x0}px, ${m - m0 + rise}px) scale(${1 - 0.4 * st.p})`;
        };
        // Een resultaat komt onderaan uit het midden van de kaart en schuift naar zijn plaats
        const renderResult = (el, st) => {
            const x0 = Number(el.dataset.x);
            const y0 = Number(el.dataset.y);
            el.style.opacity = String(Math.min(1, st.p / 0.35));
            el.style.transform = `translate(${(mid - x0) * (1 - st.p)}px, ${(cB - y0) * (1 - st.p)}px) scale(${0.7 + 0.3 * st.p})`;
        };

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ scrollTrigger: heroPin(root, FLOW_DISTANCE.vertical) });
            const step = (i, n, span) => (n > 1 ? (i / (n - 1)) * span : 0);
            wordEls.forEach((el, i) => {
                const st = { a: 0, p: 0 };
                const draw = () => renderWord(el, st);
                draw();
                tl.to(st, { a: 1, duration: 1, ease: 'power1.out', onUpdate: draw }, step(i, wordEls.length, 2.4));
                tl.to(st, { p: 1, duration: 2.2, ease: 'power2.in', onUpdate: draw }, 3.6 + step(i, wordEls.length, 1.6));
            });
            resultEls.forEach((el, i) => {
                const st = { p: 0 };
                const draw = () => renderResult(el, st);
                draw();
                tl.to(st, { p: 1, duration: 2.2, ease: 'power2.out', onUpdate: draw }, 7 + step(i, resultEls.length, 1.6));
            });
            addTrace(tl, traceEls);
            tl.to({}, { duration: 0.8 });
            ScrollTrigger.refresh();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
        }, root);
        return () => {
            ctx.revert();
            [...wordEls, ...resultEls, ...traceEls].forEach((el) => {
                el.style.opacity = '';
                el.style.transform = '';
            });
        };
    }, [w, h, language]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div ref={ref} className="absolute inset-0">
            <svg className="absolute inset-0 w-full h-full" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                <defs>
                    <linearGradient id="fv-fill-t" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                        <stop offset="1" stopColor="#ffffff" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="fv-fill-b" x1="0" x2="0" y1="1" y2="0">
                        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                        <stop offset="1" stopColor="#ffffff" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="fv-line-t" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2={cT}>
                        <stop offset="0" stopColor="#0f172a" stopOpacity="0" />
                        <stop offset="1" stopColor="#0f172a" stopOpacity="0.14" />
                    </linearGradient>
                    <linearGradient id="fv-line-b" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={h} y2={cB}>
                        <stop offset="0" stopColor="#0f172a" stopOpacity="0" />
                        <stop offset="1" stopColor="#0f172a" stopOpacity="0.14" />
                    </linearGradient>
                </defs>

                {/* Boven: het vlak en de twee randen */}
                <path d={`${arc(0, 0, mL, cT)} L${mR} ${cT} ${arcBack(mR, cT, w, 0)} Z`} fill="url(#fv-fill-t)" />
                <path d={arc(0, 0, mL, cT)} fill="none" stroke="url(#fv-line-t)" strokeWidth="1" />
                <path d={arc(w, 0, mR, cT)} fill="none" stroke="url(#fv-line-t)" strokeWidth="1" />

                {/* Onder: gespiegeld */}
                <path d={`${arc(0, h, mL, cB)} L${mR} ${cB} ${arcBack(mR, cB, w, h)} Z`} fill="url(#fv-fill-b)" />
                <path d={arc(0, h, mL, cB)} fill="none" stroke="url(#fv-line-b)" strokeWidth="1" />
                <path d={arc(w, h, mR, cB)} fill="none" stroke="url(#fv-line-b)" strokeWidth="1" />
            </svg>

            {words.map((wd) => (
                <span
                    key={`${language}-${wd.text}`}
                    className={`absolute left-0 top-0 whitespace-nowrap text-foreground ${wd.bold ? 'font-semibold' : ''}`}
                    style={{ fontSize: wd.size, opacity: wd.tone, transform: `translate(${wd.x}px, ${wd.m}px) translate(-50%, -50%)` }}
                >
                    <span className="fv-word inline-block" data-order={wd.order} data-x={wd.x} data-m={wd.m}>{wd.text}</span>
                </span>
            ))}

            {results.map((r) => (
                <span
                    key={`${language}-${r.text}`}
                    className={`absolute left-0 top-0 whitespace-nowrap font-medium text-[15px] ${r.accent ? 'text-accent' : 'text-foreground'}`}
                    style={{ transform: `translate(${r.x}px, ${r.y}px) translate(-50%, -50%)` }}
                >
                    <span className="fv-result inline-block" data-order={r.order} data-x={r.x} data-y={r.y}>{r.text}</span>
                </span>
            ))}

            {/* De kaart in het midden, met het logo en de groene lijnen langs de linker- en rechterkant */}
            <div
                className="absolute flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur-sm border border-foreground/[0.07]"
                style={{ left: cL, top: cT, width: cw, height: ch }}
            >
                <TraceLines
                    w={cw}
                    h={ch}
                    paths={[
                        `M${cw * 0.25} 0 H24 A24 24 0 0 0 0 24 V${ch - 24} A24 24 0 0 0 24 ${ch} H${cw * 0.25}`,
                        `M${cw * 0.75} 0 H${cw - 24} A24 24 0 0 1 ${cw} 24 V${ch - 24} A24 24 0 0 1 ${cw - 24} ${ch} H${cw * 0.75}`
                    ]}
                />
                <div className="flex flex-col items-center">
                    <img src="/logo/TriaCore%20Logo%20Zwart.svg" alt="" className="h-11 w-auto" />
                    <span className="mt-1 text-xs text-foreground/60 whitespace-nowrap">
                        {language === 'nl' ? 'Uw tool op maat' : 'Your custom tool'}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function FunnelVisual() {
    const { language } = useLanguage();
    const frameRef = useRef(null);
    const [dims, setDims] = useState(null);

    useLayoutEffect(() => {
        const measure = () => {
            const w = frameRef.current.offsetWidth;
            const h = fitHeight(w);
            setDims((prev) => (prev && prev.w === w && prev.h === h ? prev : layout(w, h)));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(frameRef.current);
        // Ook bij een andere vensterhoogte, behalve op aanraakschermen: daar schuift de adresbalk in en uit
        const onResize = () => {
            if (window.matchMedia('(pointer: fine)').matches) measure();
        };
        window.addEventListener('resize', onResize);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', onResize);
        };
    }, []);

    // Elk woord op zijn plaats (zie placeWords)
    const d = dims;
    const level = d && (d.cL >= 440 ? 3 : d.cL >= 280 ? 2 : 1);
    const horizontal = d && !d.vertical;
    const words = horizontal && SHOW_WORDS ? placeWords(d, WORDS[language]).map(({ i, x, dy, size }) => {
        const pl = PLACES[i];
        // De vette woorden staan donkerder. Bij de kaart staan de woorden vol; naar de buitenkant toe vervagen
        // ze een heel klein beetje, mee met de bogen (tot een kwart lichter helemaal aan de rand)
        const base = pl.b ? 0.8 + rnd(i, 3) * 0.15 : 0.55 + rnd(i, 3) * 0.25;
        const tone = base * (0.75 + 0.25 * Math.max(0, Math.min(1, x / (d.cL * 0.5))));
        return { text: WORDS[language][i], x, dy, y: d.h / 2 + dy, size, tone, bold: !!pl.b, order: Math.hypot(d.cL - x, dy) };
    }) : [];

    // De resultaten rechts, onder elkaar in één kolom, op gelijke afstand rond het midden. De volgorde van boven
    // naar onder is ook de volgorde waarin ze uit de kaart komen. Op een kleiner scherm krijgt een regel als
    // maximale breedte de ruimte tot aan de rand van het scherm, zodat hij eventueel over twee lijnen loopt
    const resultStyle = horizontal ? RESULT_STYLE[level] : null;
    const resultXr = horizontal ? resultStyle.xr(d.cL) : 0;
    const resultRoom = horizontal && level < 3
        ? d.cL - resultXr + (window.innerWidth - d.w) / 2 - 12
        : null;
    // De afstand schaalt mee met de hoogte, maar lange regels over twee lijnen moeten altijd passen
    const resultLines = resultRoom
        ? Math.max(...RESULT_TEXT[language].map((t) => Math.ceil((t.length * resultStyle.size * 0.52) / resultRoom)))
        : 1;
    const resultGap = horizontal ? Math.max(resultStyle.gap * d.hk, resultStyle.size * 1.25 * resultLines + 8) : 0;
    const results = horizontal ? RESULT_TEXT[language].map((text, i, all) => {
        const dy = (i - (all.length - 1) / 2) * resultGap;
        return {
            text,
            xr: resultXr,
            dy,
            x: d.cR + resultXr,
            y: d.h / 2 + dy,
            size: resultStyle.size,
            accent: i === all.length - 1,
            order: i
        };
    }) : [];

    // De trechter aan het werk, volledig op de scroll: de woorden komen links op, glijden langs de bogen de
    // kaart in en verdwijnen, en daarna komen de resultaten rechts uit de kaart en schuiven ze naar hun plek.
    // De delen overlappen, zodat het als één beweging leest. Binnen elk deel eerst wat het dichtst bij de
    // kaart staat. De hero staat ondertussen vast (zie heroPin). Wie minder beweging vraagt, ziet beide
    // kanten stil, zonder vastzetten. Op een gsm doet FunnelVertical dit zelf
    const width = horizontal ? d.w : null;
    const height = horizontal ? d.h : null;
    useLayoutEffect(() => {
        if (!width || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const frame = frameRef.current;
        const dm = layout(width, height);
        const byOrder = (a, b) => Number(a.dataset.order) - Number(b.dataset.order);
        const wordEls = [...frame.querySelectorAll('.fv-word')].sort(byOrder);
        const resultEls = [...frame.querySelectorAll('.fv-result')].sort(byOrder);
        const traceEls = [...frame.querySelectorAll('.fv-trace')];
        const clear = () => [...wordEls, ...resultEls, ...traceEls].forEach((el) => {
            el.style.opacity = '';
            el.style.transform = '';
        });

        // Een woord: a is hoe ver het opgekomen is, p hoe ver het op weg is naar de kaart. Het volgt de boog:
        // zijn afstand tot het midden krimpt mee met de hoogte van de trechter op die plaats
        const renderWord = (el, st) => {
            const x0 = Number(el.dataset.x);
            const dy = Number(el.dataset.dy);
            const x = x0 + (dm.cL + 6 - x0) * st.p;
            const y = dy * (halfAt(dm, Math.min(x, dm.cL)) / halfAt(dm, x0));
            const rise = (1 - st.a) * 8;
            el.style.opacity = String(st.a * Math.min(1, (1 - st.p) / 0.3));
            el.style.transform = `translate(${x - x0}px, ${y - dy + rise}px) scale(${1 - 0.4 * st.p})`;
        };
        // Een resultaat: p is hoe ver het uit de kaart gekomen is, gespiegeld langs de rechter boog
        const renderResult = (el, st) => {
            const xr = Number(el.dataset.xr);
            const dy = Number(el.dataset.dy);
            const now = xr * st.p;
            const y = dy * (halfAt(dm, dm.cL - now) / halfAt(dm, dm.cL - xr));
            el.style.opacity = String(Math.min(1, st.p / 0.35));
            el.style.transform = `translate(${now - xr}px, ${y - dy}px) scale(${0.7 + 0.3 * st.p})`;
        };

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ scrollTrigger: heroPin(frame, FLOW_DISTANCE.horizontal) });
            const step = (i, n, span) => (n > 1 ? (i / (n - 1)) * span : 0);
            wordEls.forEach((el, i) => {
                const st = { a: 0, p: 0 };
                const draw = () => renderWord(el, st);
                draw();
                tl.to(st, { a: 1, duration: 1, ease: 'power1.out', onUpdate: draw }, step(i, wordEls.length, 2.4));
                tl.to(st, { p: 1, duration: 2.2, ease: 'power2.in', onUpdate: draw }, 3.6 + step(i, wordEls.length, 1.6));
            });
            resultEls.forEach((el, i) => {
                const st = { p: 0 };
                const draw = () => renderResult(el, st);
                draw();
                tl.to(st, { p: 1, duration: 2.2, ease: 'power2.out', onUpdate: draw }, 7 + step(i, resultEls.length, 1.6));
            });
            // Terwijl de woorden door de kaart gaan, lopen de groene lijnen rond de kaart
            addTrace(tl, traceEls);
            // Een korte rust op het einde, zodat de resultaten even blijven staan voor de pagina verdergaat
            tl.to({}, { duration: 0.8 });
            ScrollTrigger.refresh();
            // De lettertypes veranderen de hoogte van de hero, en dus de plaats van de visual
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
        }, frame);
        return () => {
            ctx.revert();
            clear();
        };
    }, [width, height, language]);

    return (
        // Bovenaan is het midden van de visual leeg, dus ze mag een stuk onder de knop schuiven, in verhouding
        // tot haar hoogte, zodat de kaart op elk scherm op dezelfde afstand van de knop blijft
        <div
            ref={frameRef}
            aria-hidden="true"
            className="relative w-full select-none"
            style={{ height: d ? d.h : 400, marginTop: d ? (d.vertical ? 24 : -160 * d.hk) : 0 }}
        >
            {d?.vertical && <FunnelVertical w={d.w} h={d.h} />}
            {horizontal && (
                <>
                    <svg className="absolute inset-0 w-full h-full" width={d.w} height={d.h} viewBox={`0 0 ${d.w} ${d.h}`}>
                        <defs>
                            <linearGradient id="fv-fill-l" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                                <stop offset="1" stopColor="#ffffff" stopOpacity="0.7" />
                            </linearGradient>
                            <linearGradient id="fv-fill-r" x1="1" x2="0" y1="0" y2="0">
                                <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                                <stop offset="1" stopColor="#ffffff" stopOpacity="0.7" />
                            </linearGradient>
                            <linearGradient id="fv-line-l" gradientUnits="userSpaceOnUse" x1="0" x2={d.cL} y1="0" y2="0">
                                <stop offset="0" stopColor="#0f172a" stopOpacity="0" />
                                <stop offset="1" stopColor="#0f172a" stopOpacity="0.14" />
                            </linearGradient>
                            <linearGradient id="fv-line-r" gradientUnits="userSpaceOnUse" x1={d.w} x2={d.cR} y1="0" y2="0">
                                <stop offset="0" stopColor="#0f172a" stopOpacity="0" />
                                <stop offset="1" stopColor="#0f172a" stopOpacity="0.14" />
                            </linearGradient>
                        </defs>

                        {/* Links: het vlak, en de boven- en onderrand */}
                        <path
                            d={`${fromOuter(0, d.pad, d.cL, d.mT)} L${d.cL} ${d.mB} ${toOuter(d.cL, d.mB, 0, d.h - d.pad)} Z`}
                            fill="url(#fv-fill-l)"
                        />
                        <path d={fromOuter(0, d.pad, d.cL, d.mT)} fill="none" stroke="url(#fv-line-l)" strokeWidth="1" />
                        <path d={fromOuter(0, d.h - d.pad, d.cL, d.mB)} fill="none" stroke="url(#fv-line-l)" strokeWidth="1" />

                        {/* Rechts: gespiegeld */}
                        <path
                            d={`${fromOuter(d.w, d.pad, d.cR, d.mT)} L${d.cR} ${d.mB} ${toOuter(d.cR, d.mB, d.w, d.h - d.pad)} Z`}
                            fill="url(#fv-fill-r)"
                        />
                        <path d={fromOuter(d.w, d.pad, d.cR, d.mT)} fill="none" stroke="url(#fv-line-r)" strokeWidth="1" />
                        <path d={fromOuter(d.w, d.h - d.pad, d.cR, d.mB)} fill="none" stroke="url(#fv-line-r)" strokeWidth="1" />
                    </svg>

                    {/* De woorden van het handwerk */}
                    {/* Niet afgeknipt: aan de buitenkant mogen de woorden een beetje uit de trechter lopen */}
                    <div className="absolute inset-0">
                        {words.map((wd) => (
                            <span
                                key={`${language}-${wd.text}`}
                                className={`absolute left-0 top-0 whitespace-nowrap text-foreground ${wd.bold ? 'font-semibold' : ''}`}
                                style={{ fontSize: wd.size, opacity: wd.tone, transform: `translate(${wd.x}px, ${wd.y}px) translate(-50%, -50%)` }}
                            >
                                <span className="fv-word inline-block" data-order={wd.order} data-x={wd.x} data-dy={wd.dy}>{wd.text}</span>
                            </span>
                        ))}
                    </div>

                    {/* De resultaten: geordend, even groot en donker */}
                    <div className="absolute inset-0">
                        {results.map((r) => (
                            <span
                                key={`${language}-${r.text}`}
                                className={`absolute left-0 top-0 font-medium leading-tight ${resultRoom ? '' : 'whitespace-nowrap'} ${r.accent ? 'text-accent' : 'text-foreground'}`}
                                style={{ fontSize: r.size, maxWidth: resultRoom || undefined, width: resultRoom ? 'max-content' : undefined, transform: `translate(${r.x}px, ${r.y}px) translateY(-50%)` }}
                            >
                                <span className="fv-result inline-block origin-left" data-order={r.order} data-xr={r.xr} data-dy={r.dy}>{r.text}</span>
                            </span>
                        ))}
                    </div>

                    {/* De kaart in het midden, met het logo */}
                    <div
                        className="absolute flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur-sm border border-foreground/[0.07]"
                        style={{ left: d.cL, top: d.cT, width: d.cw, height: d.ch }}
                    >
                        {/* De groene lijnen rond de kaart: van waar de bovenste en de onderste boog de kaart links raken,
                            over de boven- en onderkant, tot waar diezelfde bogen rechts vertrekken */}
                        <TraceLines
                            w={d.cw}
                            h={d.ch}
                            paths={[
                                `M0 ${d.ch * 0.25} V24 A24 24 0 0 1 24 0 H${d.cw - 24} A24 24 0 0 1 ${d.cw} 24 V${d.ch * 0.25}`,
                                `M0 ${d.ch * 0.75} V${d.ch - 24} A24 24 0 0 0 24 ${d.ch} H${d.cw - 24} A24 24 0 0 0 ${d.cw} ${d.ch - 24} V${d.ch * 0.75}`
                            ]}
                        />
                        <div className="flex flex-col items-center">
                            <img src="/logo/TriaCore%20Logo%20Zwart.svg" alt="" className="w-auto" style={{ height: 96 * d.s }} />
                            <span className="mt-2 text-foreground/60 whitespace-nowrap" style={{ fontSize: Math.max(12, 15 * d.s) }}>
                                {language === 'nl' ? 'Uw tool op maat' : 'Your custom tool'}
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
