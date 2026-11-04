import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../../context/LanguageContext';

// De visual onder de hero van Custom tools: in het midden een lichte kaart met het logo, en aan beide kanten
// een trechter met gebogen randen, breed aan de buitenkant en smal waar hij de kaart raakt.
// Links staan de woorden van het handwerk dat we wegnemen (Excel, overtypen, papieren werkbonnen ...),
// verspreid in verschillende maten en tinten: de chaos die in de kaart samenkomt. Hoe dichter bij de kaart,
// hoe kleiner en vager. Op een gsm staat de trechter rechtop (zie FunnelVertical): daar is de hoogte er wel
// en de breedte niet. In de kaart het logo met "Uw tool op maat" eronder.
// De woorden en de resultaten staan stil. Enkel over de bogen lopen dunne groene lijntjes, tegelijk boven en
// onder, in één vloeiende beweging rond de kaart en achter de tekst (zie FlowLines).
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
// ze volledig in beeld kan staan
const fitHeight = (w) => {
    const room = window.innerHeight - navBottom() - 16;
    return Math.round(w < VERTICAL_BELOW ? Math.max(480, Math.min(680, room)) : Math.max(460, Math.min(FULL.h, room)));
};

// De groene lijntjes: hoe lang ze zijn (als deel van het hele pad), hoeveel seconden één tocht duurt, om de
// hoeveel seconden er een nieuw vertrekt, en hoe sterk de kleur is op haar sterkst. Vertrekken ze sneller na
// elkaar dan één tocht duurt, dan lopen er meerdere tegelijk op een boog (copies)
const FLOW = { segment: 0.16, duration: 5, every: 3, opacity: 0.5 };
const FLOW_COPIES = Math.ceil(FLOW.duration / FLOW.every);
// De straal van de hoeken van de kaart (rounded-3xl)
const CARD_RADIUS = 24;

// Dunne groene lijntjes die tegelijk over de bogen en rond de kaart lopen, vanaf de buitenkant door naar de
// andere kant. Ze blijven altijd in beweging en vervagen naar de uiteinden toe, zodat ze zacht opkomen en
// wegvallen. Ze staan boven de kaart maar achter de tekst. Wie minder beweging vraagt, ziet ze niet
function FlowLines({ w, h, paths, vertical }) {
    const ref = useRef(null);
    const pathsKey = paths.join('|');

    useLayoutEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        const ctx = gsap.context(() => {
            gsap.utils.toArray('path', ref.current).forEach((el) => {
                gsap.fromTo(el,
                    { attr: { 'stroke-dashoffset': FLOW.segment } },
                    {
                        attr: { 'stroke-dashoffset': -1 },
                        duration: FLOW.duration,
                        ease: 'none',
                        repeat: -1,
                        repeatDelay: FLOW_COPIES * FLOW.every - FLOW.duration,
                        delay: Number(el.dataset.copy) * FLOW.every
                    });
            });
        }, ref);
        return () => ctx.revert();
    }, [pathsKey]);

    return (
        <svg ref={ref} className="pointer-events-none absolute inset-0 w-full h-full overflow-visible" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <defs>
                <linearGradient id="fv-flow" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={vertical ? 0 : w} y2={vertical ? h : 0}>
                    <stop offset="0" stopColor="#628f69" stopOpacity="0" />
                    <stop offset="0.25" stopColor="#628f69" stopOpacity={FLOW.opacity} />
                    <stop offset="0.75" stopColor="#628f69" stopOpacity={FLOW.opacity} />
                    <stop offset="1" stopColor="#628f69" stopOpacity="0" />
                </linearGradient>
            </defs>
            {paths.flatMap((path) => Array.from({ length: FLOW_COPIES }, (_, copy) => (
                <path
                    key={`${path}-${copy}`}
                    data-copy={copy}
                    d={path}
                    pathLength="1"
                    fill="none"
                    stroke="url(#fv-flow)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={`${FLOW.segment} 2`}
                    strokeDashoffset={FLOW.segment}
                />
            )))}
        </svg>
    );
}

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

// De trechter rechtop, voor een gsm. Bovenaan is hij breed en wordt hij smal naar de kaart toe, onderaan gaat
// hij weer open. Boven staan de woorden, verspreid; onder de resultaten, om de beurt links en rechts. De
// bogen vertrekken op de boven- en onderkant van de kaart, op een kwart van de breedte naar binnen, en lopen
// tot de rand.

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
        return { text, x, m, size: wd.size, bold: !!PLACES[wd.i].b, tone: base * (0.75 + 0.25 * wd.v) };
    });

    const resultGap = (h - cB - 16) / RESULT_TEXT[language].length;
    // De resultaten staan om de beurt links en rechts, elk op een eigen hoogte, en mogen buiten de trechter vallen
    const results = RESULT_TEXT[language].map((text, i, all) => {
        const half = text.length * 15 * 0.27;
        return {
            text,
            x: mid + (i % 2 ? 1 : -1) * 0.6 * Math.max(0, screenHalf - half),
            y: cB + resultGap * (i + 0.6),
            accent: i === all.length - 1
        };
    });

    return (
        <div className="absolute inset-0">
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

            {/* De kaart in het midden, met het logo */}
            <div
                className="absolute flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur-sm border border-foreground/[0.07]"
                style={{ left: cL, top: cT, width: cw, height: ch }}
            >
                <div className="flex flex-col items-center">
                    <img src="/logo/TriaCore%20Logo%20Zwart.svg" alt="" className="h-11 w-auto" />
                    <span className="mt-1 text-xs text-foreground/60 whitespace-nowrap">
                        {language === 'nl' ? 'Uw tool op maat' : 'Your custom tool'}
                    </span>
                </div>
            </div>

            {/* De lijntjes lopen van boven naar onder: de ene om de linkerkant van de kaart, de andere om de rechterkant.
                Ze staan voor de woorden en de resultaten in de code, dus achter de tekst */}
            <FlowLines
                w={w}
                h={h}
                vertical
                paths={[
                    `${arc(0, 0, mL, cT)} H${cL + CARD_RADIUS} A${CARD_RADIUS} ${CARD_RADIUS} 0 0 0 ${cL} ${cT + CARD_RADIUS} V${cB - CARD_RADIUS} A${CARD_RADIUS} ${CARD_RADIUS} 0 0 0 ${cL + CARD_RADIUS} ${cB} H${mL} ${arcBack(mL, cB, 0, h)}`,
                    `${arc(w, 0, mR, cT)} H${cL + cw - CARD_RADIUS} A${CARD_RADIUS} ${CARD_RADIUS} 0 0 1 ${cL + cw} ${cT + CARD_RADIUS} V${cB - CARD_RADIUS} A${CARD_RADIUS} ${CARD_RADIUS} 0 0 1 ${cL + cw - CARD_RADIUS} ${cB} H${mR} ${arcBack(mR, cB, w, h)}`
                ]}
            />

            {words.map((wd) => (
                <span
                    key={`${language}-${wd.text}`}
                    className={`absolute left-0 top-0 whitespace-nowrap text-foreground ${wd.bold ? 'font-semibold' : ''}`}
                    style={{ fontSize: wd.size, opacity: wd.tone, transform: `translate(${wd.x}px, ${wd.m}px) translate(-50%, -50%)` }}
                >
                    {wd.text}
                </span>
            ))}

            {results.map((r) => (
                <span
                    key={`${language}-${r.text}`}
                    className={`absolute left-0 top-0 whitespace-nowrap font-medium text-[15px] ${r.accent ? 'text-accent' : 'text-foreground'}`}
                    style={{ transform: `translate(${r.x}px, ${r.y}px) translate(-50%, -50%)` }}
                >
                    {r.text}
                </span>
            ))}
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
        return { text: WORDS[language][i], x, y: d.h / 2 + dy, size, tone, bold: !!pl.b };
    }) : [];

    // De resultaten rechts, onder elkaar in één kolom, op gelijke afstand rond het midden. Op een kleiner scherm
    // krijgt een regel als maximale breedte de ruimte tot aan de rand van het scherm, zodat hij eventueel over
    // twee lijnen loopt
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
            x: d.cR + resultXr,
            y: d.h / 2 + dy,
            size: resultStyle.size,
            accent: i === all.length - 1
        };
    }) : [];

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

                    {/* De kaart in het midden, met het logo */}
                    <div
                        className="absolute flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur-sm border border-foreground/[0.07]"
                        style={{ left: d.cL, top: d.cT, width: d.cw, height: d.ch }}
                    >
                        <div className="flex flex-col items-center">
                            <img src="/logo/TriaCore%20Logo%20Zwart.svg" alt="" className="w-auto" style={{ height: 96 * d.s }} />
                            <span className="mt-2 text-foreground/60 whitespace-nowrap" style={{ fontSize: Math.max(12, 15 * d.s) }}>
                                {language === 'nl' ? 'Uw tool op maat' : 'Your custom tool'}
                            </span>
                        </div>
                    </div>

                    {/* De lijntjes lopen van links naar rechts: de ene over de bovenste boog en de bovenkant van de
                        kaart, de andere over de onderste boog en de onderkant. Ze staan voor de woorden en de
                        resultaten in de code, dus achter de tekst */}
                    <FlowLines
                        w={d.w}
                        h={d.h}
                        paths={[
                            `${fromOuter(0, d.pad, d.cL, d.mT)} V${d.cT + CARD_RADIUS} A${CARD_RADIUS} ${CARD_RADIUS} 0 0 1 ${d.cL + CARD_RADIUS} ${d.cT} H${d.cR - CARD_RADIUS} A${CARD_RADIUS} ${CARD_RADIUS} 0 0 1 ${d.cR} ${d.cT + CARD_RADIUS} V${d.mT} ${toOuter(d.cR, d.mT, d.w, d.pad)}`,
                            `${fromOuter(0, d.h - d.pad, d.cL, d.mB)} V${d.cB - CARD_RADIUS} A${CARD_RADIUS} ${CARD_RADIUS} 0 0 0 ${d.cL + CARD_RADIUS} ${d.cB} H${d.cR - CARD_RADIUS} A${CARD_RADIUS} ${CARD_RADIUS} 0 0 0 ${d.cR} ${d.cB - CARD_RADIUS} V${d.mB} ${toOuter(d.cR, d.mB, d.w, d.h - d.pad)}`
                        ]}
                    />

                    {/* De woorden van het handwerk */}
                    {/* Niet afgeknipt: aan de buitenkant mogen de woorden een beetje uit de trechter lopen */}
                    <div className="absolute inset-0">
                        {words.map((wd) => (
                            <span
                                key={`${language}-${wd.text}`}
                                className={`absolute left-0 top-0 whitespace-nowrap text-foreground ${wd.bold ? 'font-semibold' : ''}`}
                                style={{ fontSize: wd.size, opacity: wd.tone, transform: `translate(${wd.x}px, ${wd.y}px) translate(-50%, -50%)` }}
                            >
                                {wd.text}
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
                                {r.text}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
