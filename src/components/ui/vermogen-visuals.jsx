import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, ArrowUp, Check, ChevronRight, FileText, Mail, Sparkles } from 'lucide-react';
import { u } from './tool-visual-unit';

// De kleine interfaces in de kaarten van "Wat AI daarmee kan" (vermogens-sectie.jsx). Elke interface is echte
// tekst op een vast canvas (W x H) dat meeschaalt met de breedte van de kaart, in dezelfde stijl als de
// visuals van Custom tools (v1). Ze spelen één keer af zodra `aan` waar wordt: een reeks stappen op vaste
// tijden (TIJDEN, in ms). Opnieuw afspelen gebeurt door de interface opnieuw te laten mounten (andere key).
// Wie minder beweging vraagt, ziet meteen het eindbeeld. Alle gegevens zijn verzonnen.

// Begint in de kleur van de kaart (#fafafa), zodat de tekst erboven zonder rand overloopt in het groen
const VERLOOP = 'linear-gradient(to bottom, #fafafa 0%, #f5f7f6 22%, #eef3ef 50%, #e7eee8 78%, #e2eae3 100%)';
const SCHADUW = `0 ${u(18)} ${u(50)} ${u(-24)} rgba(15,23,42,0.16)`;
const SCHADUW_KAART = `0 ${u(20)} ${u(46)} ${u(-20)} rgba(15,23,42,0.22)`;
const ZACHT = 'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';
const toon = (aan, weg = 'opacity-0 translate-y-2') => (aan ? 'opacity-100 translate-y-0' : weg);

// Telt de stappen af zodra `aan` waar is. Geeft het aantal bereikte stappen terug
function useStappen(aan, tijden) {
    const [stap, setStap] = useState(0);
    useEffect(() => {
        if (!aan) return undefined;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ids = tijden.map((t, i) => setTimeout(() => setStap(i + 1), reduce ? 0 : t));
        return () => ids.forEach(clearTimeout);
    }, [aan, tijden]);
    return stap;
}

// Het canvas onderaan de kaart: vult de rest van de kaart, met de interface verticaal in het midden
function Podium({ W, H, label, children }) {
    return (
        <div role="img" aria-label={label} className="relative flex-1 flex items-center overflow-hidden [container-type:inline-size]" style={{ background: VERLOOP }}>
            <div aria-hidden="true" className="relative w-full" style={{ '--u': `calc(100cqw / ${W})`, height: u(H) }}>
                {children}
            </div>
        </div>
    );
}

function Paneel({ x, y, w, h, className = '', style, children }) {
    return (
        <div
            className={`absolute bg-[#fafafa] border border-foreground/[0.07] ${className}`}
            style={{ left: u(x), top: u(y), width: u(w), height: h ? u(h) : undefined, borderRadius: u(14), boxShadow: SCHADUW, ...style }}
        >
            {children}
        </div>
    );
}

// Titel van een venster met de aanvulling ernaast, zoals in de tools van v1
function Kop({ titel, sub, pad = 16 }) {
    return (
        <div className="absolute flex items-center" style={{ left: u(pad), top: u(14), gap: u(9) }}>
            <span className="font-medium text-foreground tracking-tight" style={{ fontSize: u(16) }}>{titel}</span>
            {sub && <span aria-hidden="true" className="w-px bg-foreground/15" style={{ height: u(14) }} />}
            {sub && <span className="text-foreground/60" style={{ fontSize: u(12) }}>{sub}</span>}
        </div>
    );
}

function AiLabel({ nl }) {
    return (
        <div className="flex items-center" style={{ gap: u(7) }}>
            <span className="flex items-center justify-center rounded-full border border-foreground/15 text-accent" style={{ width: u(22), height: u(22) }}>
                <Sparkles strokeWidth={1.5} style={{ width: u(12), height: u(12) }} />
            </span>
            <span className="font-medium text-accent" style={{ fontSize: u(11.5) }}>{nl ? 'AI-assistent' : 'AI assistant'}</span>
        </div>
    );
}

// Een groen vinkje dat opploft
function Vinkje({ aan, maat = 15 }) {
    return (
        <span
            className={`flex items-center justify-center shrink-0 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${aan ? 'bg-accent text-white scale-100' : 'bg-foreground/[0.06] text-transparent scale-90'}`}
            style={{ width: u(maat), height: u(maat) }}
        >
            <Check strokeWidth={3} style={{ width: u(maat * 0.6), height: u(maat * 0.6) }} />
        </span>
    );
}

/* ------------------------------------------------------------------ Voorstellen */

const T_VOORSTELLEN = [200, 1100, 1700, 2300, 2600, 2900, 3400];

const RITTEN = {
    nl: [
        { naam: 'Tom V.', ritten: [['Graan', 'Aalst', '07:00', 24], 'plek', ['Meel', 'Aalst', '08:00', 22]] },
        { naam: 'Sofie D.', ritten: [['Zand', 'Genk', '06:00', 28], ['Grond', 'Hasselt', '07:00', 26], ['Zand', 'Lommel', '06:30', 28]] },
        { naam: 'Karim B.', ritten: [['Schroot', 'Luik', '06:30', 22], null, ['Afval', 'Beringen', '07:00', 20]] }
    ],
    en: [
        { naam: 'Tom V.', ritten: [['Grain', 'Aalst', '07:00', 24], 'plek', ['Flour', 'Aalst', '08:00', 22]] },
        { naam: 'Sofie D.', ritten: [['Sand', 'Genk', '06:00', 28], ['Soil', 'Hasselt', '07:00', 26], ['Sand', 'Lommel', '06:30', 28]] },
        { naam: 'Karim B.', ritten: [['Scrap', 'Liège', '06:30', 22], null, ['Waste', 'Beringen', '07:00', 20]] }
    ]
};

function Rit({ rit, accent }) {
    const [wat, naar, uur, ton] = rit;
    return (
        <div className="h-full flex flex-col justify-center" style={{ paddingLeft: u(9) }}>
            <span className={`flex items-center whitespace-nowrap leading-tight ${accent ? 'text-accent font-medium' : 'text-foreground'}`} style={{ fontSize: u(11.5), gap: u(3) }}>
                {wat}<ArrowRight strokeWidth={1.75} style={{ width: u(9), height: u(9) }} />{naar}
            </span>
            <span className={`whitespace-nowrap leading-tight ${accent ? 'text-accent/80' : 'text-foreground/50'}`} style={{ marginTop: u(3), fontSize: u(10.5) }}>{uur} · {ton} t</span>
        </div>
    );
}

export function VoorstellenVisual({ aan, nl }) {
    const stap = useStappen(aan, T_VOORSTELLEN);
    const dagen = nl ? ['Maandag', 'Dinsdag', 'Woensdag'] : ['Monday', 'Tuesday', 'Wednesday'];
    const redenen = nl
        ? ['Silo gereinigd na de laatste vracht', 'Past binnen zijn rijtijd', 'Retourvracht vanuit Aalst mogelijk']
        : ['Silo cleaned after the last load', 'Fits within his driving time', 'Return load from Aalst possible'];
    let n = 0; // volgnummer van de ritten, voor het na elkaar verschijnen

    return (
        <Podium W={700} H={430} label={nl
            ? 'Een weekplanning met een lege plek. De AI-assistent stelt Tom voor, met drie redenen, en de planner kiest: overnemen of aanpassen.'
            : 'A weekly schedule with an open slot. The AI assistant suggests Tom, with three reasons, and the planner chooses: accept or adjust.'}>
            <Paneel x={24} y={20} w={560} h={300}>
                <Kop titel="Planning" sub={nl ? 'Week 46' : 'Week 46'} />
                <div className="absolute" style={{ left: u(16), right: u(16), top: u(52) }}>
                    <div className="grid" style={{ marginLeft: u(76), gridTemplateColumns: 'repeat(3, 1fr)', columnGap: u(6), height: u(22) }}>
                        {dagen.map((d) => <span key={d} className="font-medium text-foreground" style={{ fontSize: u(11), paddingLeft: u(2) }}>{d}</span>)}
                    </div>
                    {RITTEN[nl ? 'nl' : 'en'].map((rij) => (
                        <div key={rij.naam} className="flex items-center border-t border-foreground/[0.08]" style={{ height: u(74) }}>
                            <div className="flex items-center shrink-0" style={{ width: u(76), gap: u(6) }}>
                                <span className="flex items-center justify-center shrink-0 rounded-full border border-foreground/20 text-foreground/70" style={{ width: u(22), height: u(22), fontSize: u(8.5) }}>
                                    {rij.naam.replace('.', '').split(' ').map((p) => p[0]).join('')}
                                </span>
                                <span className="whitespace-nowrap text-foreground" style={{ fontSize: u(11) }}>{rij.naam.split(' ')[0]}</span>
                            </div>
                            <div className="grid flex-1" style={{ gridTemplateColumns: 'repeat(3, 1fr)', columnGap: u(6), height: u(58) }}>
                                {rij.ritten.map((rit, c) => {
                                    if (rit === 'plek') {
                                        // De lege plek: eerst gemarkeerd, op het einde met het voorstel erin
                                        return (
                                            <div
                                                key={c}
                                                className={`relative rounded-md border border-dashed transition-all duration-700 motion-reduce:transition-none ${stap >= 2 ? 'border-accent/60 bg-accent/[0.05]' : 'border-foreground/15 bg-transparent'}`}
                                            >
                                                <div className={`h-full ${ZACHT} ${toon(stap >= 7, 'opacity-0 translate-y-1')}`}>
                                                    <Rit rit={nl ? ['Graan', 'Gent', '06:30', 24] : ['Grain', 'Ghent', '06:30', 24]} accent />
                                                </div>
                                            </div>
                                        );
                                    }
                                    const i = n++;
                                    return (
                                        <div
                                            key={c}
                                            className={`relative overflow-hidden rounded-md ${rit ? 'bg-white border border-foreground/[0.08]' : 'bg-foreground/[0.035]'} ${ZACHT} ${toon(stap >= 1, 'opacity-0 translate-x-2')}`}
                                            style={{ transitionDelay: stap >= 1 && stap < 2 ? `${i * 70}ms` : '0ms' }}
                                        >
                                            {rit ? (
                                                <>
                                                    <span aria-hidden="true" className="absolute left-0 inset-y-0 bg-accent" style={{ width: u(2) }} />
                                                    <Rit rit={rit} />
                                                </>
                                            ) : (
                                                <span className="h-full flex items-center text-foreground/35" style={{ paddingLeft: u(9), fontSize: u(10.5) }}>{nl ? 'Vrij' : 'Off'}</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </Paneel>

            {/* De assistent met het voorstel */}
            <div
                className={`absolute bg-white border border-foreground/[0.07] ${ZACHT} ${toon(stap >= 3, 'opacity-0 translate-y-4')}`}
                style={{ left: u(300), top: u(190), width: u(376), padding: u(16), borderRadius: u(16), boxShadow: SCHADUW_KAART }}
            >
                <AiLabel nl={nl} />
                <p className="text-foreground/60" style={{ marginTop: u(9), fontSize: u(11.5), lineHeight: 1.3 }}>
                    {nl ? 'Wie kan dinsdag 24 ton graan naar Gent rijden?' : 'Who can haul 24 tonnes of grain to Ghent on Tuesday?'}
                </p>
                <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(5), fontSize: u(19), lineHeight: 1.15 }}>
                    {nl ? 'Tom V. kan het.' : 'Tom V. can do it.'}
                </p>
                <div style={{ marginTop: u(8) }}>
                    {redenen.map((r, i) => (
                        <div key={r} className="flex items-center text-foreground/70" style={{ gap: u(7), marginTop: u(4), fontSize: u(11.5) }}>
                            <Vinkje aan={stap >= 4 + i} maat={14} />
                            {r}
                        </div>
                    ))}
                </div>
                <div className={`flex items-center ${ZACHT} ${toon(stap >= 7, 'opacity-0 translate-y-1')}`} style={{ marginTop: u(12), gap: u(14) }}>
                    <span className="rounded-full bg-foreground text-white font-medium whitespace-nowrap" style={{ padding: `${u(6)} ${u(16)}`, fontSize: u(11.5) }}>{nl ? 'Neem over' : 'Accept'}</span>
                    <span className="text-foreground underline underline-offset-2 whitespace-nowrap" style={{ fontSize: u(11.5) }}>{nl ? 'Pas aan' : 'Adjust'}</span>
                </div>
            </div>
        </Podium>
    );
}

/* ------------------------------------------------------------------ Lezen */

const T_LEZEN = [200, 650, 1100, 1550, 1900];

export function LezenVisual({ aan, nl }) {
    const stap = useStappen(aan, T_LEZEN);
    const velden = [
        { label: nl ? 'Datum' : 'Date', waarde: '12-11-2026' },
        { label: nl ? 'Klant' : 'Client', waarde: 'Peeters Bouw' },
        { label: nl ? 'Netto' : 'Net', waarde: '24.380 kg' }
    ];

    return (
        <Podium W={520} H={300} label={nl
            ? 'Een foto van een weegbon wordt gelezen: datum, klant en gewicht komen vanzelf in de rit terecht.'
            : 'A photo of a weighbridge slip is read: date, client and weight land in the trip on their own.'}>
            {/* De weegbon, licht gedraaid zoals een foto */}
            <div
                className="absolute bg-white border border-foreground/[0.08] overflow-hidden"
                style={{ left: u(34), top: u(30), width: u(190), height: u(240), borderRadius: u(6), transform: 'rotate(-3deg)', boxShadow: SCHADUW, padding: u(16) }}
            >
                <p className="text-foreground/50 font-medium tracking-[0.18em]" style={{ fontSize: u(9.5) }}>{nl ? 'WEEGBON' : 'WEIGH SLIP'}</p>
                <span className="block bg-foreground/10" style={{ height: u(1), marginTop: u(8), marginBottom: u(8) }} />
                {velden.map((v, i) => (
                    <div key={v.label} className={`rounded transition-colors duration-500 ${stap >= 2 + i ? 'bg-accent/[0.1]' : 'bg-transparent'}`} style={{ padding: `${u(4)} ${u(6)}`, marginLeft: u(-6), marginRight: u(-6), marginTop: u(4) }}>
                        <p className="text-foreground/45" style={{ fontSize: u(9), lineHeight: 1.2 }}>{v.label}</p>
                        <p className="text-foreground font-medium" style={{ fontSize: u(12), lineHeight: 1.3 }}>{v.waarde}</p>
                    </div>
                ))}
                <span className="block bg-foreground/[0.07] rounded-full" style={{ height: u(5), width: '80%', marginTop: u(14) }} />
                <span className="block bg-foreground/[0.07] rounded-full" style={{ height: u(5), width: '55%', marginTop: u(6) }} />

                {/* De leeslijn die over de bon schuift */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 motion-reduce:hidden"
                    style={{
                        top: 0,
                        transform: `translateY(${stap >= 1 ? u(232) : u(-30)})`,
                        opacity: stap >= 1 && stap < 5 ? 1 : 0,
                        transition: 'transform 1.6s cubic-bezier(0.45,0,0.55,1), opacity 0.4s ease'
                    }}
                >
                    <div style={{ height: u(26), background: 'linear-gradient(to bottom, rgba(98,143,105,0), rgba(98,143,105,0.16))' }} />
                    <div className="bg-accent" style={{ height: u(1.5) }} />
                </div>
            </div>

            {/* De rit waarin de gegevens terechtkomen */}
            <Paneel x={262} y={46} w={226} h={208}>
                <Kop titel={nl ? 'Rit 2041' : 'Trip 2041'} />
                <div className="absolute" style={{ left: u(16), right: u(16), top: u(50) }}>
                    {velden.map((v, i) => (
                        <div key={v.label} style={{ marginTop: i ? u(10) : 0 }}>
                            <p className="text-foreground/50" style={{ fontSize: u(10), marginBottom: u(4) }}>{v.label}</p>
                            <div className="flex items-center justify-between bg-white border border-foreground/[0.1]" style={{ height: u(30), borderRadius: u(7), paddingLeft: u(10), paddingRight: u(8) }}>
                                <span className={`text-foreground ${ZACHT} ${toon(stap >= 2 + i, 'opacity-0 translate-x-1')}`} style={{ fontSize: u(12) }}>{v.waarde}</span>
                                <Vinkje aan={stap >= 2 + i} maat={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </Paneel>
        </Podium>
    );
}

/* ------------------------------------------------------------------ Antwoorden */

// Zoals een echte chat met een AI-assistent, telkens in vier stappen:
// 1. De vraag wordt letter per letter in de balk getypt en verstuurd.
// 2. De assistent zegt "Bezig" en raadpleegt drie bronnen, onder elkaar langs een dunne lijn: elke stap draait
//    eerst en krijgt dan een vinkje.
// 3. Die lijn klapt in tot één regel, en het antwoord wordt woord per woord uitgeschreven.
// 4. Daaronder verschijnen de bronnen.
// Er zijn drie situaties (SITUATIES), elk met een ander soort bron. Na een antwoord blijft het beeld even staan
// (PAUZE), vervaagt het en begint de volgende situatie. Dat gaat enkel door zolang de kaart in beeld is. Wie
// minder beweging vraagt, ziet enkel het eindbeeld van de eerste situatie.
// Alles hangt aan één klok (ms sinds de start van de situatie). Alle gegevens zijn verzonnen.

const TYPEN_START = 500;   // ms tot het typen begint
const PER_LETTER = 42;     // ms per letter van de vraag
const PER_STAP = 850;      // ms per bron die de assistent raadpleegt
const PER_WOORD = 70;      // ms per woord van het antwoord
const PAUZE = 3200;        // ms dat een antwoord blijft staan
const VERVAGEN = 700;      // ms om het beeld te laten vervagen voor de volgende situatie

const SITUATIES = {
    nl: [
        {
            vraag: 'Welke voorwaarden gelden als een klant annuleert?',
            stappen: ['Doorzoekt de algemene voorwaarden', 'Leest de raamcontracten', 'Bekijkt mails over annuleringen'],
            antwoord: 'Tot 48 uur vooraf kan het kosteloos. Daarna rekenen we 25% van het bedrag aan.',
            bronnen: ['Algemene voorwaarden', 'Raamcontract 2025', '+ 3'],
            aantal: 5
        },
        {
            vraag: 'Hoeveel korting mogen we geven op een grote bestelling?',
            stappen: ['Leest het prijsbeleid', 'Bekijkt eerdere kortingen', 'Leest de afspraken met de zaakvoerder'],
            antwoord: 'Tot 8% zonder akkoord. Daarboven moet de zaakvoerder tekenen.',
            bronnen: ['Prijsbeleid 2026', 'Verslag directieoverleg', '+ 1'],
            aantal: 3
        },
        {
            vraag: 'Wat hebben we vorig jaar aan Janssens aangeboden?',
            stappen: ['Zoekt de klant in het CRM', 'Leest de offertes van vorig jaar', 'Bekijkt de mails met Janssens'],
            antwoord: 'Een onderhoudscontract van drie jaar, aan € 4.200 per jaar. Ze hebben toen niet getekend.',
            bronnen: ['Offerte OF-2025-118', 'CRM: Janssens', '+ 2'],
            aantal: 4
        }
    ],
    en: [
        {
            vraag: 'Which terms apply when a client cancels?',
            stappen: ['Searching the terms and conditions', 'Reading the framework contracts', 'Checking emails about cancellations'],
            antwoord: 'Free of charge up to 48 hours in advance. After that we charge 25% of the amount.',
            bronnen: ['Terms and conditions', 'Framework contract 2025', '+ 3'],
            aantal: 5
        },
        {
            vraag: 'How much discount can we give on a large order?',
            stappen: ['Reading the pricing policy', 'Checking earlier discounts', 'Reading the agreements with the owner'],
            antwoord: 'Up to 8% without approval. Above that, the owner has to sign.',
            bronnen: ['Pricing policy 2026', 'Management meeting notes', '+ 1'],
            aantal: 3
        },
        {
            vraag: 'What did we offer Janssens last year?',
            stappen: ['Finding the client in the CRM', 'Reading last year\'s quotes', 'Checking the emails with Janssens'],
            antwoord: 'A three-year maintenance contract at € 4,200 a year. They did not sign at the time.',
            bronnen: ['Quote OF-2025-118', 'CRM: Janssens', '+ 2'],
            aantal: 4
        }
    ]
};

const verminderd = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Een klok die loopt zodra `aan` waar is, tot `einde`, en opnieuw begint bij elke nieuwe `ronde`. Wie minder
// beweging vraagt, staat meteen op het einde
function useKlok(aan, einde, ronde = 0) {
    const [stand, setStand] = useState({ ronde: -1, ms: 0 });
    useEffect(() => {
        if (!aan) return undefined;
        if (verminderd()) {
            const id = setTimeout(() => setStand({ ronde, ms: einde }), 0);
            return () => clearTimeout(id);
        }
        const start = performance.now();
        let raf = 0;
        const tik = (nu) => {
            const e = nu - start;
            setStand({ ronde, ms: Math.min(e, einde) });
            if (e < einde) raf = requestAnimationFrame(tik);
        };
        raf = requestAnimationFrame(tik);
        return () => cancelAnimationFrame(raf);
    }, [aan, einde, ronde]);
    return stand.ronde === ronde ? stand.ms : 0;
}

function Draaier() {
    return <span className="block rounded-full border-accent/25 border-t-accent animate-spin" style={{ width: u(12), height: u(12), borderWidth: u(1.75) }} />;
}

export function AntwoordenVisual({ aan, nl }) {
    const [ronde, setRonde] = useState(0);
    const [uit, setUit] = useState(false);
    const [zichtbaar, setZichtbaar] = useState(true);
    const balkRef = useRef(null);
    const situaties = SITUATIES[nl ? 'nl' : 'en'];
    const { vraag, stappen, antwoord, bronnen, aantal } = situaties[ronde % situaties.length];
    const woorden = antwoord.split(' ');

    // Het verloop in de tijd
    const verstuurd = TYPEN_START + vraag.length * PER_LETTER + 400;
    const aiStart = verstuurd + 450;
    const stapStart = (i) => aiStart + 350 + i * PER_STAP;
    const ingeklapt = stapStart(stappen.length) + 250;
    const antwoordStart = ingeklapt + 450;
    const bronnenStart = antwoordStart + woorden.length * PER_WOORD + 300;
    const einde = bronnenStart + 900;

    const ms = useKlok(aan, einde, ronde);
    const klaar = aan && ms >= einde;

    // Houdt bij of de kaart in beeld is, zodat de situaties enkel wisselen als iemand kijkt
    useEffect(() => {
        const el = balkRef.current;
        if (!el || !('IntersectionObserver' in window)) return undefined;
        const io = new IntersectionObserver(([e]) => setZichtbaar(e.isIntersecting), { threshold: 0.2 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Na een antwoord: even laten staan, vervagen en de volgende situatie beginnen
    useEffect(() => {
        if (!klaar || !zichtbaar || verminderd()) return undefined;
        let id2 = 0;
        const id1 = setTimeout(() => {
            setUit(true);
            id2 = setTimeout(() => { setRonde((r) => r + 1); setUit(false); }, VERVAGEN);
        }, PAUZE);
        return () => { clearTimeout(id1); clearTimeout(id2); };
    }, [klaar, zichtbaar]);

    const getypt = ms >= verstuurd ? '' : vraag.slice(0, Math.max(0, Math.floor((ms - TYPEN_START) / PER_LETTER)));
    const aanHetTypen = ms >= TYPEN_START && ms < verstuurd;
    const aantalWoorden = Math.max(0, Math.min(woorden.length, Math.floor((ms - antwoordStart) / PER_WOORD) + 1));
    const schrijft = ms >= antwoordStart && aantalWoorden < woorden.length;

    return (
        <Podium W={560} H={320} label={nl
            ? 'Een chat met een AI-assistent. Iemand typt een vraag, de assistent raadpleegt drie bronnen en schrijft het antwoord uit met de bronnen erbij. Drie voorbeelden wisselen elkaar af: annuleringsvoorwaarden, korting en een oude offerte.'
            : 'A chat with an AI assistant. Someone types a question, the assistant consults three sources and writes out the answer with the sources. Three examples take turns: cancellation terms, discounts and an old quote.'}>
            {/* De vraag en het antwoord. Bij elke nieuwe situatie opnieuw opgebouwd (key), na het vervagen */}
            <div key={ronde} className={`absolute inset-0 transition-opacity duration-700 ease-out ${uit ? 'opacity-0' : 'opacity-100'}`}>
                {/* De vraag, rechts zoals in elke chat, zodra ze verstuurd is */}
                <div className={`absolute flex flex-col items-end ${ZACHT} ${toon(ms >= verstuurd)}`} style={{ right: u(28), top: u(18) }}>
                    <p className="text-foreground/60" style={{ fontSize: u(10.5), marginBottom: u(4) }}>{nl ? 'Jij' : 'You'}</p>
                    <div className="bg-foreground text-white whitespace-nowrap" style={{ padding: `${u(9)} ${u(14)}`, fontSize: u(12.5), lineHeight: 1.35, borderRadius: `${u(14)} ${u(4)} ${u(14)} ${u(14)}` }}>
                        {vraag}
                    </div>
                </div>

                {/* De assistent */}
                <div className={`absolute flex items-start ${ZACHT} ${toon(ms >= aiStart)}`} style={{ left: u(28), right: u(28), top: u(92), gap: u(9) }}>
                    <span className="flex items-center justify-center shrink-0 rounded-full border border-foreground/15 text-accent bg-[#fafafa]" style={{ width: u(26), height: u(26) }}>
                        <Sparkles strokeWidth={1.5} style={{ width: u(13), height: u(13) }} />
                    </span>
                    <div className="flex-1 min-w-0" style={{ paddingTop: u(5) }}>
                        {/* Bovenaan: eerst "Bezig" met puntjes, na het inklappen één regel met wat er geraadpleegd is */}
                        <p className="flex items-center text-foreground/55" style={{ fontSize: u(11.5), height: u(16), gap: u(5) }}>
                            {ms < ingeklapt ? (
                                <>
                                    {nl ? 'Bezig' : 'Working'}
                                    <span className="flex items-center" style={{ gap: u(3), marginTop: u(3) }}>
                                        {[0, 1, 2].map((i) => (
                                            <span key={i} className="rounded-full bg-foreground/40 animate-pulse" style={{ width: u(3.5), height: u(3.5), animationDelay: `${i * 200}ms` }} />
                                        ))}
                                    </span>
                                </>
                            ) : (
                                <>
                                    {nl ? `${aantal} bronnen geraadpleegd` : `${aantal} sources consulted`}
                                    <ChevronRight strokeWidth={2} style={{ width: u(11), height: u(11) }} />
                                </>
                            )}
                        </p>

                        {/* De bronnen die het raadpleegt, langs een dunne lijn. Klapt in zodra het klaar is */}
                        <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${ms < ingeklapt ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden min-h-0">
                                <div className="border-l border-foreground/15" style={{ marginTop: u(8), marginLeft: u(5), paddingLeft: u(12) }}>
                                    {stappen.map((s, i) => {
                                        const bezig = ms >= stapStart(i) && ms < stapStart(i + 1);
                                        const af = ms >= stapStart(i + 1);
                                        return (
                                            <div
                                                key={s}
                                                className={`flex items-center transition-all duration-500 motion-reduce:transition-none ${ms >= stapStart(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'} ${af ? 'text-foreground/55' : 'text-foreground/80'}`}
                                                style={{ gap: u(8), height: u(22), fontSize: u(11.5) }}
                                            >
                                                <span className="flex items-center justify-center shrink-0" style={{ width: u(12), height: u(12) }}>
                                                    {af
                                                        ? <Check strokeWidth={2.5} className="text-accent" style={{ width: u(12), height: u(12) }} />
                                                        : bezig ? <Draaier /> : null}
                                                </span>
                                                {s}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Het antwoord, woord per woord, met een cursor zolang het schrijft */}
                        {ms >= antwoordStart && (
                            <p className="text-foreground" style={{ marginTop: u(8), fontSize: u(12.5), lineHeight: 1.5, maxWidth: u(420) }}>
                                {woorden.slice(0, aantalWoorden).join(' ')}
                                {schrijft && <span aria-hidden="true" className="inline-block align-middle bg-foreground/60 animate-pulse" style={{ width: u(1.5), height: u(13), marginLeft: u(2) }} />}
                            </p>
                        )}

                        {/* De bronnen waaruit het antwoord komt */}
                        <div className="flex flex-wrap" style={{ marginTop: u(9), gap: u(6) }}>
                            {bronnen.map((b, i) => (
                                <span
                                    key={b}
                                    className={`inline-flex items-center border border-accent/30 text-accent bg-accent/[0.05] whitespace-nowrap ${ZACHT} ${toon(ms >= bronnenStart, 'opacity-0 translate-y-1')}`}
                                    style={{ gap: u(5), padding: `${u(4)} ${u(9)}`, borderRadius: u(999), fontSize: u(10.5), transitionDelay: ms >= bronnenStart ? `${i * 90}ms` : '0ms' }}
                                >
                                    {i < bronnen.length - 1 && <FileText strokeWidth={1.75} style={{ width: u(11), height: u(11) }} />}
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* De balk waarin de vraag getypt wordt. De verstuurknop wordt donker zodra er tekst staat */}
            <div ref={balkRef} className="absolute flex items-center justify-between rounded-xl bg-white border border-foreground/15" style={{ left: u(28), right: u(28), bottom: u(18), height: u(38), paddingLeft: u(14), paddingRight: u(5) }}>
                <span className="flex items-center whitespace-nowrap overflow-hidden" style={{ fontSize: u(12) }}>
                    {getypt
                        ? <span className="text-foreground">{getypt}</span>
                        : <span className="text-foreground/45">{nl ? 'Stel een vraag...' : 'Ask a question...'}</span>}
                    {aanHetTypen && <span aria-hidden="true" className="inline-block bg-foreground/70 animate-pulse" style={{ width: u(1.5), height: u(14), marginLeft: u(1) }} />}
                </span>
                <span className={`flex items-center justify-center shrink-0 rounded-lg text-white transition-colors duration-300 ${getypt ? 'bg-foreground' : 'bg-foreground/25'}`} style={{ width: u(28), height: u(28) }}>
                    <ArrowUp strokeWidth={2} style={{ width: u(13), height: u(13) }} />
                </span>
            </div>
        </Podium>
    );
}

/* ------------------------------------------------------------------ Controleren */

// Een bestelling en een factuur naast elkaar, regel per regel vergeleken. De inhoud zijn grijze balkjes: het
// gaat om de handeling, niet om wat er op staat. Eén regel wijkt af.
const T_CONTROLEREN = [300, 750, 1200, 1650, 2200];
const AMBER = { tekst: 'text-[#a16207]', vlak: 'bg-[#fbf1df]', rand: 'border-[#efd9b0]', balk: 'bg-[#e9c98f]' };
const REGELS = [{ breed: 62 }, { breed: 46 }, { breed: 70, fout: true }, { breed: 52 }];

function Document({ x, titel, stap }) {
    return (
        <Paneel x={x} y={22} w={214} h={252}>
            <div className="absolute flex items-center" style={{ left: u(16), top: u(16), gap: u(7) }}>
                <FileText strokeWidth={1.5} className="text-foreground/60" style={{ width: u(14), height: u(14) }} />
                <span className="font-medium text-foreground" style={{ fontSize: u(13) }}>{titel}</span>
            </div>
            {REGELS.map((r, i) => {
                const fout = r.fout && stap >= 1 + i;
                return (
                    <div
                        key={i}
                        className={`absolute flex items-center justify-between transition-colors duration-500 ${fout ? AMBER.vlak : 'bg-transparent'}`}
                        style={{ left: u(10), right: u(10), top: u(54 + i * 46), height: u(34), paddingLeft: u(6), paddingRight: u(6), borderRadius: u(7) }}
                    >
                        <span className="rounded-full bg-foreground/[0.1]" style={{ width: `${r.breed}%`, height: u(6) }} />
                        <span className={`rounded-full transition-colors duration-500 ${fout ? AMBER.balk : 'bg-foreground/[0.18]'}`} style={{ width: u(30), height: u(6) }} />
                    </div>
                );
            })}
        </Paneel>
    );
}

export function ControlerenVisual({ aan, nl }) {
    const stap = useStappen(aan, T_CONTROLEREN);

    return (
        <Podium W={560} H={320} label={nl
            ? 'Een bestelling en een factuur worden regel per regel vergeleken. Drie regels kloppen, één wijkt af.'
            : 'An order and an invoice are compared line by line. Three lines match, one deviates.'}>
            <Document x={30} titel={nl ? 'Bestelling' : 'Order'} stap={stap} />
            <Document x={316} titel={nl ? 'Factuur' : 'Invoice'} stap={stap} />

            {/* Tussen de twee documenten: per regel een lijntje en het resultaat */}
            {REGELS.map((r, i) => {
                const klaar = stap >= 1 + i;
                const midden = 22 + 54 + i * 46 + 17;
                return (
                    <div key={i} className="absolute flex items-center" style={{ left: u(244), width: u(72), top: u(midden - 11), height: u(22) }}>
                        <span className={`flex-1 transition-colors duration-500 ${klaar ? (r.fout ? 'bg-[#e9c98f]' : 'bg-accent/50') : 'bg-foreground/10'}`} style={{ height: u(1.5) }} />
                        {r.fout ? (
                            <span className={`flex items-center justify-center shrink-0 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${klaar ? `${AMBER.vlak} ${AMBER.tekst} border ${AMBER.rand} scale-100` : 'bg-foreground/[0.06] text-transparent scale-90'}`} style={{ width: u(22), height: u(22) }}>
                                <AlertTriangle strokeWidth={2} style={{ width: u(11), height: u(11) }} />
                            </span>
                        ) : (
                            <Vinkje aan={klaar} maat={22} />
                        )}
                        <span className={`flex-1 transition-colors duration-500 ${klaar ? (r.fout ? 'bg-[#e9c98f]' : 'bg-accent/50') : 'bg-foreground/10'}`} style={{ height: u(1.5) }} />
                    </div>
                );
            })}

            {/* Het besluit onderaan */}
            <div className="absolute inset-x-0 flex justify-center" style={{ top: u(286) }}>
                <span className={`inline-flex items-center border ${AMBER.vlak} ${AMBER.rand} ${AMBER.tekst} ${ZACHT} ${toon(stap >= 5, 'opacity-0 translate-y-1')}`} style={{ gap: u(6), padding: `${u(5)} ${u(12)}`, borderRadius: u(999), fontSize: u(11.5) }}>
                    <AlertTriangle strokeWidth={2} style={{ width: u(12), height: u(12) }} />
                    {nl ? '1 verschil: het bedrag op de factuur wijkt af' : '1 difference: the amount on the invoice deviates'}
                </span>
            </div>
        </Podium>
    );
}

/* ------------------------------------------------------------------ Uitvoeren */

const T_UITVOEREN = [200, 800, 1300, 1800, 2300, 2900];

export function UitvoerenVisual({ aan, nl }) {
    const stap = useStappen(aan, T_UITVOEREN);
    const stappen = nl
        ? ['Aanvraag gelezen', 'Gegevens nagekeken', 'Order klaargezet: rit 2044']
        : ['Request read', 'Details checked', 'Order prepared: trip 2044'];

    return (
        <Podium W={700} H={290} label={nl
            ? 'Een nieuwe aanvraag per mail wordt gelezen, nagekeken en als order klaargezet. Daarna wacht ze op jouw akkoord.'
            : 'A new request by email is read, checked and prepared as an order. Then it waits for your approval.'}>
            {/* De mail met de aanvraag */}
            <Paneel x={30} y={44} w={240} h={200} className={`${ZACHT} ${toon(stap >= 1, 'opacity-0 -translate-x-2')}`}>
                <div className="absolute flex items-center" style={{ left: u(16), top: u(16), gap: u(8) }}>
                    <span className="flex items-center justify-center rounded-full border border-foreground/15 text-foreground/70" style={{ width: u(24), height: u(24) }}>
                        <Mail strokeWidth={1.5} style={{ width: u(12), height: u(12) }} />
                    </span>
                    <div>
                        <p className="font-medium text-foreground" style={{ fontSize: u(12.5), lineHeight: 1.2 }}>{nl ? 'Nieuwe aanvraag' : 'New request'}</p>
                        <p className="text-foreground/50" style={{ fontSize: u(10), lineHeight: 1.3 }}>{nl ? 'Van: Peeters Bouw' : 'From: Peeters Bouw'}</p>
                    </div>
                </div>
                <span className="absolute bg-foreground/10" style={{ left: u(16), right: u(16), top: u(58), height: u(1) }} />
                <div className="absolute text-foreground/80" style={{ left: u(16), right: u(16), top: u(70), fontSize: u(12), lineHeight: 1.75 }}>
                    <p>{nl ? '24 t graan' : '24 t of grain'}</p>
                    <p className="flex items-center" style={{ gap: u(4) }}>Aalst<ArrowRight strokeWidth={1.75} style={{ width: u(10), height: u(10) }} />{nl ? 'Gent' : 'Ghent'}</p>
                    <p>{nl ? 'Dinsdag, 06:30' : 'Tuesday, 06:30'}</p>
                </div>
            </Paneel>

            {/* De lijn van de mail naar de assistent */}
            <span
                aria-hidden="true"
                className="absolute bg-accent origin-left transition-transform duration-700 ease-out motion-reduce:transition-none"
                style={{ left: u(270), top: u(144), width: u(36), height: u(1.5), transform: `scaleX(${stap >= 2 ? 1 : 0})` }}
            />

            {/* De assistent werkt de stappen af en wacht dan op jou */}
            <Paneel x={306} y={34} w={366} h={220}>
                <div className="absolute" style={{ left: u(16), top: u(16) }}><AiLabel nl={nl} /></div>
                <div className="absolute" style={{ left: u(16), right: u(16), top: u(54) }}>
                    {stappen.map((s, i) => (
                        <div key={s} className={`flex items-center transition-colors duration-500 ${stap >= 3 + i ? 'text-foreground' : 'text-foreground/35'}`} style={{ gap: u(9), height: u(32), fontSize: u(12.5) }}>
                            <Vinkje aan={stap >= 3 + i} maat={17} />
                            {s}
                        </div>
                    ))}
                </div>
                <div className={`absolute flex items-center justify-between border-t border-foreground/[0.08] ${ZACHT} ${toon(stap >= 6, 'opacity-0 translate-y-1')}`} style={{ left: u(16), right: u(16), top: u(160), paddingTop: u(12) }}>
                    <span className="text-foreground/60" style={{ fontSize: u(12) }}>{nl ? 'Wacht op jouw akkoord' : 'Waiting for your approval'}</span>
                    <span className="rounded-full bg-foreground text-white font-medium whitespace-nowrap" style={{ padding: `${u(6)} ${u(14)}`, fontSize: u(11.5) }}>{nl ? 'Keur goed' : 'Approve'}</span>
                </div>
            </Paneel>
        </Podium>
    );
}
