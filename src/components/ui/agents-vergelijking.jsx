import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, Check, Clock, FileSpreadsheet, MessageCircleQuestion, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// "Dezelfde opdracht. Een ander resultaat." op de pagina AI-agents, direct onder de header. Vervangt de
// vergelijking van het tweede brein (tweede-brein-vergelijking.jsx, bewaard). Beantwoordt de gedachte van de
// bezoeker "dat kan ik zelf aan ChatGPT of Claude vragen": beide kanten gebruiken dezelfde AI, het verschil
// zit in de werkwijze.
// - Links een snelle prompt: de vraag wordt getypt, en er komt vlot een antwoord dat er volledig uitziet maar
//   algemeen blijft, met een cijfer zonder herkomst. Na het antwoord verschijnt daar een vraagteken "Bron?".
// - Rechts een gerichte agent: geen chat, maar een werkwijze die stap voor stap afloopt. Eerst uw eigen
//   bedrijf, dan de websites van de concurrenten (een teller loopt op), dan uw criteria, dan een twijfel die
//   aan u wordt voorgelegd, dan een eigen controle, en tot slot het resultaat met bron en zekerheid per
//   gegeven, als bestand in uw gedeelde map. Wat niet gevonden is, blijft leeg.
// Beide starten tegelijk. Links is sneller klaar, en dat is net het punt: snel tegenover grondig.
// Onder elke kaart vier punten die elkaar spiegelen, en onderaan de samenvatting: snel resultaat tegenover
// kwalitatief resultaat. De zekerheid is geen percentage van de AI zelf, maar volgt uit vaste regels
// (officiële of recente bron, een tweede bron), zie de brainstorm van 6/11.
// Elk venster heeft van bij het begin zijn eindhoogte: de volledige inhoud staat onzichtbaar in dezelfde cel,
// zodat niets verspringt. De animatie speelt één keer. Wie minder beweging vraagt, ziet meteen alles.
// Alle namen en cijfers zijn verzonnen voorbeeldgegevens.

const tekst = {
    nl: {
        title: 'Dezelfde opdracht. Een ander resultaat.',
        sub: 'Beide keren dezelfde AI. Het verschil zit in de werkwijze.',
        prompt: 'Een snelle prompt',
        agent: 'Een gerichte AI-agent',
        question: 'Maak een concurrentieanalyse voor mijn bedrijf.',
        placeholder: 'Stel een vraag',
        thinking: 'Denkt na',
        intro: 'Graag! Hier is een concurrentieanalyse voor uw sector.',
        head1: 'Belangrijkste spelers',
        list1: ['Grote landelijke spelers met een breed aanbod', 'Lokale specialisten die inzetten op service', 'De marktleider heeft zo\'n **35% marktaandeel**'],
        head2: 'Kansen voor u',
        list2: ['Investeer in online zichtbaarheid', 'Onderscheid u met persoonlijke service'],
        head3: 'Aanbevelingen',
        list3: ['Volg de prijzen van uw concurrenten op', 'Bouw sterke klantrelaties uit', 'Speel in op duurzaamheid'],
        end: 'Wilt u dat ik er een SWOT-analyse bij maak?',
        source: 'Bron?',
        agentName: 'Concurrentieanalyse',
        schedule: 'Elke eerste maandag, 07:00',
        own: ['Uw bedrijf gelezen', 'Uw diensten, prijzen en ideale klant'],
        crawl: ['Websites van 14 concurrenten doorlopen', (n) => `${n.toLocaleString('nl-BE')} pagina's gelezen, 101 punten per concurrent`],
        criteria: ['Getoetst aan uw criteria', 'Regio, grootte en aanbod'],
        ask: { label: 'Vraag aan u', q: 'Vos Techniek lijkt sinds 2025 gestopt. Meenemen?', yes: 'Meenemen', no: 'Overslaan' },
        check: ['Zelf nagekeken', 'Elk cijfer met een tweede bron vergeleken'],
        cols: ['Concurrent', 'Instapprijs', 'Zekerheid'],
        rows: [
            { name: 'Peeters & Co', price: '€ 1.450', src: 'Website, 3/11', level: 'sure' },
            { name: 'Lambrechts BV', price: '€ 1.290', src: 'Offerte uit 2024', level: 'check' },
            { name: 'Jansen Service', price: null, src: 'Nergens vermeld', level: 'none' }
        ],
        levels: { sure: 'Zeker', check: 'Na te kijken', none: 'Niet gevonden' },
        file: 'Concurrentieanalyse november.xlsx',
        fileWhere: 'Klaar in uw gedeelde map',
        promptPoints: ['Weet niet wie u bent', 'Vult zelf aan wat het niet weet', 'Cijfers zonder bron', 'Morgen een ander antwoord'],
        agentPoints: ['Vertrekt van uw bedrijf en uw criteria', 'Legt twijfels eerst aan u voor', 'Bron en zekerheid bij elk gegeven', 'Elke keer dezelfde werkwijze'],
        fast: ['Snel resultaat.', 'Goed voor een eerste idee.'],
        quality: ['Kwalitatief resultaat.', 'Goed om op te beslissen.']
    },
    en: {
        title: 'The same task. A different result.',
        sub: 'The same AI both times. The difference is in the way of working.',
        prompt: 'A quick prompt',
        agent: 'A focused AI agent',
        question: 'Make a competitor analysis for my business.',
        placeholder: 'Ask a question',
        thinking: 'Thinking',
        intro: 'Happy to! Here is a competitor analysis for your industry.',
        head1: 'Key players',
        list1: ['Large national players with a broad offering', 'Local specialists who focus on service', 'The market leader has about **35% market share**'],
        head2: 'Opportunities for you',
        list2: ['Invest in online visibility', 'Stand out with personal service'],
        head3: 'Recommendations',
        list3: ['Keep an eye on competitor pricing', 'Build strong client relationships', 'Respond to sustainability'],
        end: 'Would you like me to add a SWOT analysis?',
        source: 'Source?',
        agentName: 'Competitor analysis',
        schedule: 'Every first Monday, 07:00',
        own: ['Read your business', 'Your services, prices and ideal client'],
        crawl: ['Went through the websites of 14 competitors', (n) => `Read ${n.toLocaleString('en-GB')} pages, 101 points per competitor`],
        criteria: ['Checked against your criteria', 'Region, size and offering'],
        ask: { label: 'Question for you', q: 'Vos Techniek seems to have stopped in 2025. Include it?', yes: 'Include', no: 'Skip' },
        check: ['Checked its own work', 'Compared every figure with a second source'],
        cols: ['Competitor', 'Entry price', 'Certainty'],
        rows: [
            { name: 'Peeters & Co', price: '€ 1,450', src: 'Website, 3/11', level: 'sure' },
            { name: 'Lambrechts BV', price: '€ 1,290', src: 'Quote from 2024', level: 'check' },
            { name: 'Jansen Service', price: null, src: 'Not mentioned anywhere', level: 'none' }
        ],
        levels: { sure: 'Certain', check: 'To verify', none: 'Not found' },
        file: 'Competitor analysis November.xlsx',
        fileWhere: 'Ready in your shared folder',
        promptPoints: ['Does not know who you are', 'Fills in what it does not know', 'Figures without a source', 'A different answer tomorrow'],
        agentPoints: ['Starts from your business and criteria', 'Asks you first when in doubt', 'Source and certainty for every figure', 'The same way of working every time'],
        fast: ['Quick result.', 'Good for a first idea.'],
        quality: ['Quality result.', 'Good to base decisions on.']
    }
};

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

// Snelheden, in milliseconden
const CHAR = 34;      // per letter van de vraag
const WORD = 30;      // per woord van het antwoord
const SEND = 350;     // de vraag staat er, even wachten voor verzenden
const PAGES = 1284;   // pagina's die de agent leest
const TICKS = 26;     // in zoveel stappen loopt de teller op

// Tekst met **vet** omzetten naar woorden. `glue` betekent: zonder spatie aan het vorige woord vast
const parse = (str) => {
    const out = [];
    let prevSpace = true;
    str.split(/(\*\*[^*]+\*\*)/).forEach((part) => {
        if (!part) return;
        const bold = part.startsWith('**') && part.endsWith('**');
        const body = bold ? part.slice(2, -2) : part;
        body.split(' ').forEach((w, i) => {
            if (!w) return;
            out.push({ w, b: bold, glue: i === 0 && out.length > 0 && !prevSpace && !body.startsWith(' ') });
        });
        prevSpace = body.endsWith(' ');
    });
    return out;
};

// Een reeks stappen. Elke stap heeft een aantal eenheden (letters, woorden, tikken) die er een voor een
// bijkomen, met `per` milliseconden ertussen, en daarna `after` milliseconden pauze. Geeft terug in welke
// stap het gesprek zit (`stage`) en per stap hoeveel eenheden er al staan (`p(k)`)
function useScript(steps, run, instant) {
    const [pos, setPos] = useState({ i: 0, n: 0 });
    const { i, n } = instant ? { i: steps.length, n: 0 } : pos;
    useEffect(() => {
        if (instant || !run || i >= steps.length) return;
        const s = steps[i];
        const id = n < s.count
            ? setTimeout(() => setPos({ i, n: n + 1 }), s.per)
            : setTimeout(() => setPos({ i: i + 1, n: 0 }), s.after || 0);
        return () => clearTimeout(id);
    }, [run, instant, i, n, steps]);
    return { stage: i, p: (k) => (i > k ? steps[k].count : i === k ? n : 0) };
}

// De volledige inhoud, voor de onzichtbare kopie die de eindhoogte bepaalt
const FULL = { stage: Infinity, p: () => Infinity };

export default function AgentsVergelijking({ language }) {
    const ref = useRef(null);
    const tx = tekst[language];
    const [run, setRun] = useState(false);
    const [instant] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (instant) return;
            // Deze sectie zit bij het laden onder een wolk die bij het scrollen wegtrekt. De animatie start
            // pas als er al wat gescrold is, ook als de sectie al hoog in beeld staat, anders speelt ze
            // onzichtbaar af onder de wolk
            const start = () => {
                const top = ref.current.getBoundingClientRect().top + window.scrollY;
                return Math.max(top - window.innerHeight * 0.6, window.innerHeight * 0.22);
            };
            gsap.from('.avg-card', {
                y: 24, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.12,
                scrollTrigger: { start, once: true, invalidateOnRefresh: true, onEnter: () => setRun(true) }
            });
        }, ref);
        return () => ctx.revert();
    }, [instant]);

    return (
        <section ref={ref} className="px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14 md:mb-20">
                    <h2 className="hero-title text-foreground text-4xl md:text-5xl lg:text-6xl pb-3 mb-3">{tx.title}</h2>
                    <p className="text-foreground/60 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">{tx.sub}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
                    <Card label={tx.prompt} points={tx.promptPoints}>
                        <PromptChat tx={tx} run={run} instant={instant} />
                    </Card>
                    <Card accent label={tx.agent} points={tx.agentPoints}>
                        <AgentRun tx={tx} run={run} instant={instant} />
                    </Card>
                </div>

                {/* De samenvatting: twee helften met een dunne lijn ertussen, links stil, rechts in het groen */}
                <div data-reveal-head className="relative mt-16 md:mt-24 grid md:grid-cols-2">
                    <span aria-hidden="true" className="rv-line absolute inset-x-0 top-0 h-px bg-foreground/10 origin-left" />
                    <span aria-hidden="true" className="rv-line absolute inset-x-0 bottom-0 h-px bg-foreground/10 origin-left" />
                    <div className="rv-fade py-8 md:py-12 md:pr-10 text-center">
                        <p className="hero-title text-3xl md:text-4xl text-foreground/45">{tx.fast[0]}</p>
                        <p className="mt-2 text-base md:text-lg text-foreground/50">{tx.fast[1]}</p>
                    </div>
                    <div className="rv-fade relative py-8 md:py-12 md:pl-10 text-center">
                        <span aria-hidden="true" className="absolute left-1/2 md:left-0 top-0 md:top-1/2 -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 w-16 h-px md:w-px md:h-16 bg-foreground/10" />
                        <p className="hero-title text-3xl md:text-4xl text-foreground"><span className="italic text-accent">{tx.quality[0]}</span></p>
                        <p className="mt-2 text-base md:text-lg text-foreground/70">{tx.quality[1]}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

// De snelle prompt: typen, kort nadenken, een antwoord dat volledig oogt, en dan het vraagteken bij het cijfer
function PromptChat({ tx, run, instant }) {
    const blocks = useMemo(() => [
        parse(tx.intro),
        parse(tx.head1), ...tx.list1.map(parse),
        parse(tx.head2), ...tx.list2.map(parse),
        parse(tx.head3), ...tx.list3.map(parse),
        parse(tx.end)
    ], [tx]);
    const total = blocks.reduce((s, b) => s + b.length, 0);
    const steps = useMemo(() => [
        { count: 1, per: 700 },                                // even wachten tot de kaart staat
        { count: tx.question.length, per: CHAR, after: SEND }, // de vraag typen
        { count: 1, per: 650 },                                // denkt kort na
        { count: total, per: WORD, after: 500 },               // het antwoord
        { count: 1, per: 1 }                                   // het vraagteken bij het cijfer
    ], [tx, total]);
    const at = useScript(steps, run, instant);

    // Stappen: 0 wachten, 1 typen, 2 denkt na, 3 antwoord, 4 vraagteken
    const render = ({ stage, p }) => {
        let left = p(3);
        const counts = blocks.map((b) => { const c = Math.min(left, b.length); left -= c; return c; });
        const n1 = tx.list1.length;
        const iHead2 = 2 + n1;
        const iHead3 = iHead2 + 1 + tx.list2.length;
        const list = (items, from) => (
            <ul className="mt-1.5 space-y-1">
                {items.map((_, i) => counts[from + i] > 0 && (
                    <li key={i} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-[0.6em] w-1 h-1 rounded-full bg-foreground/30 shrink-0" />
                        <span>
                            <Words tokens={blocks[from + i]} count={counts[from + i]} />
                            {/* Het cijfer zonder herkomst: na het antwoord verschijnt er een vraagteken bij */}
                            {from === 2 && i === n1 - 1 && (
                                <span className={`ml-2 inline-flex items-center rounded-full border border-dashed border-foreground/30 px-2 py-px text-[12px] text-foreground/55 align-[1px] transition-[opacity,transform] duration-500 ${EASE} ${stage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                                    {tx.source}
                                </span>
                            )}
                        </span>
                    </li>
                ))}
            </ul>
        );
        return (
            <Panel muted typed={stage === 1 ? tx.question.slice(0, p(1)) : ''} placeholder={tx.placeholder}>
                {stage >= 2 && <Bubble>{tx.question}</Bubble>}
                {stage === 2 && <p className="text-foreground/40 animate-pulse">{tx.thinking}</p>}
                {counts[0] > 0 && <p><Words tokens={blocks[0]} count={counts[0]} /></p>}
                {counts[1] > 0 && <p className="mt-3 font-semibold text-foreground/70"><Words tokens={blocks[1]} count={counts[1]} /></p>}
                {list(tx.list1, 2)}
                {counts[iHead2] > 0 && <p className="mt-3 font-semibold text-foreground/70"><Words tokens={blocks[iHead2]} count={counts[iHead2]} /></p>}
                {list(tx.list2, iHead2 + 1)}
                {counts[iHead3] > 0 && <p className="mt-3 font-semibold text-foreground/70"><Words tokens={blocks[iHead3]} count={counts[iHead3]} /></p>}
                {list(tx.list3, iHead3 + 1)}
                {counts[blocks.length - 1] > 0 && <p className="mt-3"><Words tokens={blocks[blocks.length - 1]} count={counts[blocks.length - 1]} /></p>}
            </Panel>
        );
    };
    return <Stack ghost={render(FULL)} live={render(at)} />;
}

// De gerichte agent: de werkwijze loopt stap voor stap af, en eindigt bij het resultaat als bestand
function AgentRun({ tx, run, instant }) {
    const steps = useMemo(() => [
        { count: 1, per: 700 },                   // 0 even wachten tot de kaart staat
        { count: 1, per: 900 },                   // 1 uw bedrijf lezen
        { count: TICKS, per: 62, after: 250 },    // 2 de websites, de teller loopt op
        { count: 1, per: 850 },                   // 3 uw criteria
        { count: 1, per: 350, after: 1100 },      // 4 de vraag aan u verschijnt, en wacht
        { count: 1, per: 1, after: 600 },         // 5 u kiest
        { count: 1, per: 900 },                   // 6 zelf nakijken
        { count: 4, per: 320, after: 300 },       // 7 de tabel: kop en drie rijen
        { count: 1, per: 1 }                      // 8 het bestand staat klaar
    ], []);
    const at = useScript(steps, run, instant);

    const render = ({ stage, p }) => {
        const state = (k) => (stage > k ? 'done' : stage === k ? 'busy' : 'hidden');
        const pages = Math.round((PAGES * Math.min(p(2), TICKS)) / TICKS);
        const rows = Math.min(p(7), 4);
        return (
            <Panel agent tx={tx}>
                <ol className="space-y-3">
                    <Step state={state(1)} title={tx.own[0]} sub={tx.own[1]} />
                    <Step state={state(2)} title={tx.crawl[0]} sub={tx.crawl[1](stage > 2 ? PAGES : pages)} />
                    <Step state={state(3)} title={tx.criteria[0]} sub={tx.criteria[1]} />

                    {/* De twijfel gaat eerst naar de mens: de agent wacht tot u kiest */}
                    {stage >= 4 && (
                        <li className="rounded-xl border border-accent/25 bg-accent/[0.05] px-3.5 py-3">
                            <p className="flex items-center gap-2 text-[12px] font-medium text-accent">
                                <MessageCircleQuestion size={14} strokeWidth={2} />
                                {tx.ask.label}
                            </p>
                            <p className="mt-1.5 text-[13.5px] text-foreground/80 leading-snug">{tx.ask.q}</p>
                            <div className="mt-2.5 flex gap-2 text-[12.5px]">
                                <span className="rounded-full border border-foreground/15 bg-white px-3 py-1 text-foreground/55">{tx.ask.yes}</span>
                                <span className={`rounded-full border px-3 py-1 transition-colors duration-300 ${stage >= 5
                                    ? 'border-foreground bg-foreground text-white'
                                    : 'border-foreground/15 bg-white text-foreground/55'}`}>
                                    {tx.ask.no}
                                </span>
                            </div>
                        </li>
                    )}

                    <Step state={state(6)} title={tx.check[0]} sub={tx.check[1]} />
                </ol>

                {/* Het resultaat: per gegeven de bron en een zekerheid volgens vaste regels. Niet gevonden blijft leeg */}
                {rows > 0 && (
                    <div className="mt-4 rounded-xl border border-foreground/[0.07] overflow-hidden text-[13px]">
                        {/* Elke rij is een eigen raster: de laatste kolom heeft daarom een vaste breedte, zodat de
                            prijzen onder elkaar staan, hoe lang het label ook is. Op gsm is er geen plaats voor drie
                            kolommen: daar staan de prijs en de bron onder de naam */}
                        <div className="grid grid-cols-[1fr_6.5rem] sm:grid-cols-[1.25fr_1fr_6.5rem] gap-3 px-3.5 py-2 bg-foreground/[0.025] text-[11.5px] text-foreground/45">
                            {tx.cols.map((c, i) => <span key={c} className={i === 2 ? 'justify-self-end' : i === 1 ? 'hidden sm:block' : ''}>{c}</span>)}
                        </div>
                        {tx.rows.slice(0, rows - 1).map((r) => (
                            <div key={r.name} className="grid grid-cols-[1fr_6.5rem] sm:grid-cols-[1.25fr_1fr_6.5rem] items-center gap-3 px-3.5 py-2 border-t border-foreground/[0.06]">
                                <span className="min-w-0">
                                    <span className="block text-foreground/85 truncate">{r.name}</span>
                                    <span className="sm:hidden flex items-center gap-1.5 min-w-0 text-[11px] text-foreground/40">
                                        {r.price
                                            ? <span className="tabular-nums text-foreground/70">{r.price}</span>
                                            : <span aria-hidden="true" className="shrink-0 h-3 w-8 rounded border border-dashed border-foreground/20" />}
                                        <span className="truncate">{r.src}</span>
                                    </span>
                                </span>
                                <span className="hidden sm:block min-w-0">
                                    {r.price
                                        ? <span className="block tabular-nums text-foreground/85">{r.price}</span>
                                        : <span aria-hidden="true" className="block h-[1.2em] w-12 rounded border border-dashed border-foreground/20" />}
                                    <span className="block text-[11px] text-foreground/40 truncate">{r.src}</span>
                                </span>
                                <Level level={r.level} label={tx.levels[r.level]} />
                            </div>
                        ))}
                    </div>
                )}

                {stage >= 8 && (
                    <div className="mt-3 flex items-center gap-2.5 text-[13px]">
                        <span className="w-7 h-7 shrink-0 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                            <FileSpreadsheet size={15} strokeWidth={1.75} />
                        </span>
                        <span className="min-w-0">
                            <span className="block text-foreground/85 truncate">{tx.file}</span>
                            <span className="block text-[11.5px] text-foreground/45">{tx.fileWhere}</span>
                        </span>
                    </div>
                )}
            </Panel>
        );
    };
    return <Stack ghost={render(FULL)} live={render(at)} />;
}

// Een stap van de werkwijze: eerst een draaiend rondje, daarna een vinkje
function Step({ state, title, sub }) {
    if (state === 'hidden') return null;
    const done = state === 'done';
    return (
        <li className="flex gap-3">
            <span className={`mt-px w-5 h-5 shrink-0 rounded-full flex items-center justify-center transition-colors duration-300 ${done ? 'bg-accent/15 text-accent' : ''}`}>
                {done
                    ? <Check size={12} strokeWidth={2.5} />
                    : <span className="w-3.5 h-3.5 rounded-full border-[1.5px] border-accent/25 border-t-accent animate-spin" />}
            </span>
            <span className="min-w-0">
                <span className={`block text-[14px] leading-snug ${done ? 'text-foreground/85' : 'text-foreground/60'}`}>{title}</span>
                <span className="block text-[12.5px] text-foreground/45 leading-snug tabular-nums">{sub}</span>
            </span>
        </li>
    );
}

// De zekerheid als label: zeker in het groen, na te kijken neutraal, niet gevonden met een stippellijn
function Level({ level, label }) {
    const style = level === 'sure'
        ? 'bg-accent/10 text-accent border-transparent'
        : level === 'check'
            ? 'bg-white text-foreground/60 border-foreground/15'
            : 'bg-white text-foreground/40 border-dashed border-foreground/25';
    return <span className={`justify-self-end whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11.5px] ${style}`}>{label}</span>;
}

// De volledige inhoud onzichtbaar en de lopende inhoud in dezelfde rastercel: de cel heeft zo altijd de
// eindhoogte, en de inhoud groeit erin zonder dat de kaart verspringt
function Stack({ ghost, live }) {
    return (
        <div className="grid flex-1">
            <div aria-hidden="true" className="invisible [grid-area:1/1] flex flex-col">{ghost}</div>
            <div className="[grid-area:1/1] flex flex-col">{live}</div>
        </div>
    );
}

// Een grote kaart per kant: bovenaan de titel, in het midden het venster, onderaan vier punten die elkaar
// links en rechts spiegelen. De prompt in een neutrale grijze tint, de agent in een zachte groene tint
function Card({ accent, label, points, children }) {
    return (
        <div
            className={`avg-card flex flex-col rounded-[1.75rem] p-3 md:p-4 border ${accent
                ? 'bg-accent/[0.08] border-accent/15'
                : 'bg-foreground/[0.035] border-foreground/[0.06]'}`}
        >
            <h3 className="px-3 pt-3 pb-4 md:px-4 md:pt-4 md:pb-5 text-2xl font-medium text-foreground leading-tight">
                {label}
            </h3>
            {children}
            <ul className="px-3 pt-5 pb-3 md:px-4 md:pt-6 md:pb-4 space-y-2.5">
                {points.map((pt) => (
                    <li key={pt} className={`flex items-start gap-3 text-base md:text-[17px] leading-snug ${accent ? 'text-foreground' : 'text-foreground/55'}`}>
                        <span className={`mt-[0.2em] w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${accent ? 'bg-accent/15 text-accent' : 'bg-foreground/[0.06] text-foreground/40'}`}>
                            {accent ? <Check size={12} strokeWidth={2.5} /> : <X size={12} strokeWidth={2.5} />}
                        </span>
                        {pt}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Het venster. Voor de prompt een chatvenster met onderaan de chatbalk waarin de vraag getypt wordt; voor de
// agent een venster met de naam van de werkwijze en wanneer ze vanzelf start, zonder chatbalk.
// Beide tonen bovenaan dezelfde AI: het verschil moet uit de werkwijze komen
function Panel({ muted, agent, tx, typed, placeholder, children }) {
    return (
        <div
            className={`relative flex-1 flex flex-col rounded-[1.25rem] p-5 md:p-6 border ${muted
                ? 'bg-white/70 border-foreground/[0.05] shadow-[0_12px_30px_-22px_rgba(15,23,42,0.2)]'
                : 'bg-white border-accent/15 shadow-[0_16px_36px_-22px_rgba(98,143,105,0.45)]'}`}
        >
            {/* Op een smal scherm schuift het tijdstip onder de naam, in plaats van de naam af te knippen */}
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-[13px] font-medium text-foreground/70">
                <span className="flex items-center gap-2 min-w-0">
                    <img src="/logo/claude.svg" alt="" className="w-4 h-4 shrink-0" />
                    <span className="truncate">{agent ? tx.agentName : 'Claude'}</span>
                </span>
                {agent && (
                    <span className="flex items-center gap-1.5 shrink-0 rounded-full bg-foreground/[0.04] px-2.5 py-1 text-[11.5px] font-normal text-foreground/55">
                        <Clock size={12} strokeWidth={2} />
                        {tx.schedule}
                    </span>
                )}
            </div>
            <div className={`flex-1 mt-5 text-[15px] leading-relaxed ${muted ? 'text-foreground/55' : 'text-foreground/75'}`}>
                {children}
            </div>
            {/* De chatbalk: enkel om te kijken, de bezoeker typt zelf niets */}
            {!agent && (
                <div aria-hidden="true" className="mt-5 flex items-center gap-2 rounded-xl border border-foreground/10 bg-white pl-3.5 pr-1.5 h-10">
                    <p className="flex-1 min-w-0 truncate text-[14px]">
                        {typed
                            ? <span className="text-foreground/85">{typed}<span className="inline-block w-px h-4 -mb-0.5 ml-px bg-foreground/70 animate-pulse" /></span>
                            : <span className="text-foreground/35">{placeholder}</span>}
                    </p>
                    <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-colors duration-300 ${typed ? 'bg-foreground text-white' : 'bg-foreground/[0.08] text-foreground/35'}`}>
                        <ArrowUp size={14} strokeWidth={2} />
                    </span>
                </div>
            )}
        </div>
    );
}

function Bubble({ children }) {
    return (
        <div className="flex justify-end mb-4">
            <p className="max-w-[85%] rounded-2xl rounded-br-md bg-foreground/[0.05] px-4 py-2 text-[15px] text-foreground/85">{children}</p>
        </div>
    );
}

// De eerste `count` woorden, met vet waar dat in de tekst staat
function Words({ tokens, count }) {
    return tokens.slice(0, count).map((t, i) => (
        <React.Fragment key={i}>
            {i > 0 && !t.glue ? ' ' : ''}
            {t.b ? <strong className="font-semibold text-foreground">{t.w}</strong> : t.w}
        </React.Fragment>
    ));
}
