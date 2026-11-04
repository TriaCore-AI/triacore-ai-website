import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// "Dezelfde vraag. Een ander antwoord." op de pagina Tweede brein: twee keer dezelfde AI krijgt dezelfde
// vraag. Links zonder tweede brein: een vriendelijk antwoord dat niets weet en alles terugvraagt. Rechts met
// een tweede brein: de AI zoekt eerst op, en geeft dan een concreet antwoord met uw klant en uw prijzen.
// Het verschil zit niet in de AI, maar in de context. Daarom staan in beide vensters hetzelfde logo en
// dezelfde vraag, en verschilt de opmaak bijna niet: het verschil moet uit de inhoud komen.
// Dezelfde vraag als in het chatvenster van de demo, zodat de bezoeker die daar herkent.
//
// De animatie speelt één keer, als de sectie in beeld komt. De twee kaarten komen op, en daarna speelt in
// beide een echt gesprek af, zoals in het chatvenster van de demo:
// - links: de vraag wordt getypt en verstuurd, de AI denkt even na en schrijft dan haar antwoord
// - rechts: de vraag wordt getypt en verstuurd, de AI zegt dat ze in het tweede brein gaat kijken, somt
//   op wat ze leest, klapt die lijst dicht en schrijft dan haar antwoord
// De tekst wordt echt aangevuld (niet vooraf geplaatst en opgelicht). Elk venster heeft van bij het begin
// zijn eindhoogte: het volledige gesprek staat onzichtbaar in dezelfde cel, zodat niets verspringt.
// De titel, de kaarttitels en de conclusies bewegen niet. Wie minder beweging vraagt, ziet meteen alles.

const tekst = {
    nl: {
        title: 'Dezelfde vraag. Een ander antwoord.',
        sub: 'Het verschil zit niet in de AI, maar in wat ze over uw bedrijf weet.',
        without: 'Zonder tweede brein',
        with: 'Met een tweede brein',
        question: 'Maak een offerte op voor Greenfield.',
        placeholder: 'Stel een vraag',
        thinking: 'Denkt na',
        generic: 'Graag! Om een offerte op te maken, heb ik eerst wat meer informatie nodig:',
        asks: [
            'Wie is Greenfield, en wie is uw contactpersoon?',
            'Welke producten en aantallen wilt u opnemen?',
            'Wat zijn uw prijzen, en geeft u korting?'
        ],
        genericEnd: 'Dan stel ik meteen een voorstel op.',
        intro: 'Geen probleem. Ik kijk eerst in uw tweede brein wat ik al over Greenfield terugvind.',
        searching: 'Zoekt in uw tweede brein',
        searched: (n) => `${n} notities gelezen`,
        answer: 'Hier is de offerte voor **Greenfield**, met de prijzen uit uw prijslijst.',
        rows: [['20 zit-sta-bureaus', '€ 13.800'], ['20 Premium-stoelen', '€ 8.400']],
        total: ['Totaal', '€ 22.200'],
        note: 'Greenfield is geen vaste klant: tot **5% korting** mag u zelf geven.',
        captionWithout: 'U begint opnieuw met uitleggen.',
        captionWith: 'Uw klant, uw prijzen, uw afspraken. Klaar om te versturen.',
        files: ['Dossiers/Klanten/Greenfield.md', 'Kennis/Prijslijst 2026.md', 'Kennis/Kortingsregels.md']
    },
    en: {
        title: 'Same question. A different answer.',
        sub: 'The difference is not the AI, but what it knows about your business.',
        without: 'Without a second brain',
        with: 'With a second brain',
        question: 'Draft a quote for Greenfield.',
        placeholder: 'Ask a question',
        thinking: 'Thinking',
        generic: 'Happy to! To draft a quote, I first need a bit more information:',
        asks: [
            'Who is Greenfield, and who is your contact person?',
            'Which products and quantities should it include?',
            'What are your prices, and do you give a discount?'
        ],
        genericEnd: 'Then I will draft a proposal right away.',
        intro: 'No problem. Let me first check your second brain for what I can find on Greenfield.',
        searching: 'Searching your second brain',
        searched: (n) => `Read ${n} notes`,
        answer: 'Here is the quote for **Greenfield**, with the prices from your price list.',
        rows: [['20 sit-stand desks', '€ 13,800'], ['20 Premium chairs', '€ 8,400']],
        total: ['Total', '€ 22,200'],
        note: 'Greenfield is not a regular client: you can give up to **5% discount** yourself.',
        captionWithout: 'You start explaining all over again.',
        captionWith: 'Your client, your prices, your agreements. Ready to send.',
        files: ['Records/Clients/Greenfield.md', 'Knowledge/Price list 2026.md', 'Knowledge/Discount rules.md']
    }
};

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

// Snelheden, in milliseconden
const CHAR = 38;      // per letter van de vraag
const WORD = 34;      // per woord van een antwoord
const SEND = 400;     // de vraag staat er, even wachten voor verzenden
const THINK = 1000;   // "denkt na"
const READ = 750;     // per notitie die de AI leest

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

// Een gesprek als een reeks stappen. Elke stap heeft een aantal eenheden (letters, woorden, notities) die
// er een voor een bijkomen, met `per` milliseconden ertussen, en daarna `after` milliseconden pauze.
// Geeft terug in welke stap het gesprek zit (`stage`) en per stap hoeveel eenheden er al staan (`p(k)`)
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

// Het volledige gesprek, voor de onzichtbare kopie die de eindhoogte bepaalt
const FULL = { stage: Infinity, p: () => Infinity };

export default function TweedeBreinVergelijking({ language }) {
    const ref = useRef(null);
    const tx = tekst[language];
    const [run, setRun] = useState(false);
    const [instant] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (instant) return;
            // Op de pagina Tweede brein zit deze sectie bij het laden onder een wolk die bij het scrollen
            // wegtrekt. De animatie start pas als er al wat gescrold is, ook als de sectie al hoog in
            // beeld staat, anders speelt ze onzichtbaar af onder de wolk
            const start = () => {
                const top = ref.current.getBoundingClientRect().top + window.scrollY;
                return Math.max(top - window.innerHeight * 0.6, window.innerHeight * 0.22);
            };
            // Enkel de kaarten komen op; daarna start het gesprek in beide
            gsap.from('.cmp-card', {
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
                    <Card label={tx.without} caption={tx.captionWithout}>
                        <WithoutChat tx={tx} run={run} instant={instant} />
                    </Card>
                    <Card accent label={tx.with} caption={tx.captionWith}>
                        <WithChat tx={tx} run={run} instant={instant} />
                    </Card>
                </div>
            </div>
        </section>
    );
}

// Zonder tweede brein: typen, denken, en een antwoord dat alles terugvraagt
function WithoutChat({ tx, run, instant }) {
    const blocks = useMemo(() => [parse(tx.generic), ...tx.asks.map(parse), parse(tx.genericEnd)], [tx]);
    const total = blocks.reduce((s, b) => s + b.length, 0);
    const steps = useMemo(() => [
        { count: 1, per: 700 },                                // even wachten tot de kaart staat
        { count: tx.question.length, per: CHAR, after: SEND }, // de vraag typen
        { count: 1, per: THINK },                              // denkt na
        { count: total, per: WORD }                            // het antwoord
    ], [tx, total]);
    const at = useScript(steps, run, instant);

    // Stappen: 0 wachten, 1 typen, 2 denkt na, 3 antwoord
    const render = ({ stage, p }) => {
        let left = p(3);
        const take = (b) => { const c = Math.min(left, b.length); left -= c; return c; };
        const counts = blocks.map(take);
        return (
            <Panel muted typed={stage === 1 ? tx.question.slice(0, p(1)) : ''} placeholder={tx.placeholder}>
                {stage >= 2 && <Bubble>{tx.question}</Bubble>}
                {stage === 2 && <Thinking>{tx.thinking}</Thinking>}
                {counts[0] > 0 && <p><Words tokens={blocks[0]} count={counts[0]} /></p>}
                <ol className="mt-3 space-y-1.5">
                    {tx.asks.map((_, i) => counts[i + 1] > 0 && (
                        <li key={i} className="flex gap-2.5">
                            <span className="tabular-nums text-foreground/35">{i + 1}.</span>
                            <span><Words tokens={blocks[i + 1]} count={counts[i + 1]} /></span>
                        </li>
                    ))}
                </ol>
                {counts[4] > 0 && <p className="mt-3"><Words tokens={blocks[4]} count={counts[4]} /></p>}
            </Panel>
        );
    };
    return <Stack ghost={render(FULL)} live={render(at)} />;
}

// Met een tweede brein: typen, zeggen wat ze gaat doen, opzoeken (en die lijst dichtklappen), antwoorden
function WithChat({ tx, run, instant }) {
    const intro = useMemo(() => parse(tx.intro), [tx]);
    const answer = useMemo(() => parse(tx.answer), [tx]);
    const note = useMemo(() => parse(tx.note), [tx]);
    // Het antwoord: de inleiding woord per woord, dan de twee regels en het totaal, dan de opmerking
    const answerUnits = answer.length + tx.rows.length + 1 + note.length;
    const steps = useMemo(() => [
        { count: 1, per: 700 },
        { count: tx.question.length, per: CHAR, after: SEND },
        { count: 1, per: THINK * 0.7 },
        { count: intro.length, per: WORD, after: 350 },          // zegt wat ze gaat doen
        { count: tx.files.length, per: READ, after: 600 },       // leest de notities
        { count: 1, per: 450 },                                  // klapt de lijst dicht
        { count: answerUnits, per: WORD }                        // het antwoord
    ], [tx, intro.length, answerUnits]);
    const at = useScript(steps, run, instant);

    // Stappen: 0 wachten, 1 typen, 2 denkt na, 3 zegt wat ze gaat doen, 4 leest, 5 klapt dicht, 6 antwoord
    const render = ({ stage, p }) => {
        const reading = Math.min(p(4), tx.files.length);
        const searching = stage === 4;
        const collapsed = stage >= 5;
        let left = p(6);
        const take = (len) => { const c = Math.min(left, len); left -= c; return c; };
        const cAnswer = take(answer.length);
        const cRows = take(tx.rows.length + 1);
        const cNote = take(note.length);
        return (
            <Panel typed={stage === 1 ? tx.question.slice(0, p(1)) : ''} placeholder={tx.placeholder}>
                {stage >= 2 && <Bubble>{tx.question}</Bubble>}
                {stage === 2 && <Thinking>{tx.thinking}</Thinking>}
                {p(3) > 0 && <p><Words tokens={intro} count={p(3)} /></p>}

                {/* Wat de AI opzoekt: een lijstje dat openklapt, de notities een voor een, en weer dichtklapt */}
                {stage >= 4 && (
                    <div className="mt-3 rounded-xl border border-foreground/[0.07] bg-foreground/[0.02] text-[13px]">
                        <div className="flex items-center gap-2 px-3 py-2 text-foreground/55">
                            <ChevronRight size={14} strokeWidth={2} className={`transition-transform duration-500 ${EASE} ${collapsed ? '' : 'rotate-90'}`} />
                            <span className={collapsed ? '' : 'animate-pulse'}>{collapsed ? tx.searched(tx.files.length) : tx.searching}</span>
                        </div>
                        <div className={`grid transition-[grid-template-rows] duration-500 ${EASE} ${collapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
                            <div className="overflow-hidden">
                                <ul className="px-3 pb-2.5 space-y-1.5">
                                    {tx.files.slice(0, reading + (reading < tx.files.length && searching ? 1 : 0)).map((f, i) => (
                                        <li key={f} className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${i < reading ? 'bg-accent' : 'bg-foreground/30 animate-pulse'}`} />
                                            <span className={`font-mono text-[12px] tracking-tight ${i < reading ? 'text-foreground/55' : 'text-foreground/40'}`}>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {cAnswer > 0 && <p className="mt-4"><Words tokens={answer} count={cAnswer} /></p>}
                {cRows > 0 && (
                    <div className="mt-4 rounded-xl border border-foreground/[0.07] overflow-hidden text-[14px]">
                        {tx.rows.slice(0, cRows).map(([k, v]) => (
                            <div key={k} className="flex justify-between gap-4 px-4 py-2 border-b border-foreground/[0.06]">
                                <span>{k}</span>
                                <span className="tabular-nums">{v}</span>
                            </div>
                        ))}
                        {cRows > tx.rows.length && (
                            <div className="flex justify-between gap-4 px-4 py-2.5 bg-accent/[0.06] font-semibold text-foreground">
                                <span>{tx.total[0]}</span>
                                <span className="tabular-nums">{tx.total[1]}</span>
                            </div>
                        )}
                    </div>
                )}
                {cNote > 0 && <p className="mt-4"><Words tokens={note} count={cNote} /></p>}
            </Panel>
        );
    };
    return <Stack ghost={render(FULL)} live={render(at)} />;
}

// Het volledige gesprek onzichtbaar en het lopende gesprek in dezelfde rastercel: de cel heeft zo altijd
// de eindhoogte, en het lopende gesprek groeit erin zonder dat de kaart verspringt
function Stack({ ghost, live }) {
    return (
        <div className="grid flex-1">
            <div aria-hidden="true" className="invisible [grid-area:1/1] flex flex-col">{ghost}</div>
            <div className="[grid-area:1/1] flex flex-col">{live}</div>
        </div>
    );
}

// Een grote kaart per kant: bovenaan de titel, in het midden het chatvenster, onderaan de conclusie.
// Zonder tweede brein in een neutrale grijze tint, met een tweede brein in een zachte groene tint
function Card({ accent, label, caption, children }) {
    return (
        <div
            className={`cmp-card flex flex-col rounded-[1.75rem] p-3 md:p-4 border ${accent
                ? 'bg-accent/[0.08] border-accent/15'
                : 'bg-foreground/[0.035] border-foreground/[0.06]'}`}
        >
            {/* Dezelfde titelstijl als de kaarten elders op de site (bv. de klantkaarten) */}
            <h3 className="px-3 pt-3 pb-4 md:px-4 md:pt-4 md:pb-5 text-2xl font-medium text-foreground leading-tight">
                {label}
            </h3>
            {children}
            <p className={`px-3 pt-4 pb-3 md:px-4 md:pt-5 md:pb-4 text-base md:text-lg leading-snug ${accent ? 'text-foreground' : 'text-foreground/55'}`}>
                {caption}
            </p>
        </div>
    );
}

// Een chatvenster in de stijl van de demo: het logo, het gesprek, en onderaan de chatbalk waarin de vraag
// getypt wordt. Het stille venster (muted) is iets doorschijnender en lichter; het andere helder wit
function Panel({ muted, typed, placeholder, children }) {
    return (
        <div
            className={`relative flex-1 flex flex-col rounded-[1.25rem] p-5 md:p-6 border ${muted
                ? 'bg-white/70 border-foreground/[0.05] shadow-[0_12px_30px_-22px_rgba(15,23,42,0.2)]'
                : 'bg-white border-accent/15 shadow-[0_16px_36px_-22px_rgba(98,143,105,0.45)]'}`}
        >
            <div className="flex items-center gap-2 text-[13px] font-medium text-foreground/70">
                <img src="/logo/claude.svg" alt="" className="w-4 h-4" />
                Claude
            </div>
            <div className={`flex-1 mt-5 text-[15px] leading-relaxed ${muted ? 'text-foreground/55' : 'text-foreground/75'}`}>
                {children}
            </div>
            {/* De chatbalk: enkel om te kijken, de bezoeker typt zelf niets */}
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

function Thinking({ children }) {
    return <p className="text-foreground/40 animate-pulse">{children}</p>;
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
