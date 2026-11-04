import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { notities, mapVan } from '../../data/tweede-brein-demo';
import { gesprekken } from '../../data/tweede-brein-gesprek';

// De AI-assistent van de demo: een knop rechtsonder met het logo van Claude en van ChatGPT. Een klik
// opent een rustig chatvenster met drie vragen als pillen. Kies je er een, dan speelt het gesprek af:
// 1. In de chatbalk onderaan wordt de vraag getypt en verstuurd ("Maak een offerte op voor Greenfield.")
// 2. Claude denkt even na en zegt wat hij gaat doen
// 3. Langs een verticale lijn verschijnen de stappen die hij doorloopt, met de notities die hij leest of bewerkt
// 4. Het antwoord verschijnt woord per woord, opgemaakt (vet, tussentitels, opsommingen), met de bronnen
// Een bron aanklikken opent die notitie, ook in de verbanden. De gesprekken staan in src/data/tweede-brein-gesprek.js.
// Sluiten zet alles terug: wie het venster opnieuw opent, ziet altijd weer de drie pillen.
// Wie minder beweging vraagt, ziet meteen het volledige gesprek. Alle maten in cqw, zoals de rest van de demo.

// Het verloop, in fasen. Per fase telt `n` wat er al staat (letters, woorden of stappen)
const TYPE = 0;      // de vraag wordt getypt
const SENT = 1;      // verstuurd, Claude denkt na
const INTRO = 2;     // Claude zegt wat hij gaat doen
const STEPS = 3;     // de stappen, een voor een
const ANSWER = 4;    // het antwoord
const DONE = 5;

const TIMING = {
    startDelay: 350,  // na de klik op een pil, voor het typen begint
    char: 38,         // per letter van de vraag
    beforeSend: 450,  // de vraag staat er, even wachten voor verzenden
    thinking: 1100,   // "denkt na"
    introWord: 32,
    step: 1050,       // per stap
    afterSteps: 450,
    answerWord: 20
};

const tekst = {
    nl: {
        launcher: 'Stel een vraag',
        chat: 'Chat met uw tweede brein',
        pick: 'Kies een vraag en kijk hoe Claude ze uitvoert.',
        placeholder: 'Stel een vraag',
        thinking: 'Denkt na',
        sources: 'Bronnen',
        close: 'Sluiten'
    },
    en: {
        launcher: 'Ask a question',
        chat: 'Chat with your second brain',
        pick: 'Pick a question and watch Claude carry it out.',
        placeholder: 'Ask a question',
        thinking: 'Thinking',
        sources: 'Sources',
        close: 'Close'
    }
};

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

// Tekst met **vet** omzetten naar woorden. `glue` betekent: zonder spatie aan het vorige woord vast
// (bv. een komma na een vet woord)
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

// Een gesprek klaarzetten: de intro als woorden, en het antwoord als blokken met woorden, met per blok
// vanaf welk woord het begint (zo verschijnt het antwoord woord per woord over alle blokken heen)
const prepare = (id, language) => {
    const gesprek = gesprekken.find((g) => g.id === id) || gesprekken[0];
    const answer = [];
    let start = 0;
    for (const block of gesprek.antwoord) {
        const lines = block.type === 'ul' ? block.items.map((it) => parse(it[language])) : [parse(block.text[language])];
        answer.push({ type: block.type, lines, start });
        start += lines.reduce((s, l) => s + l.length, 0);
    }
    return { gesprek, intro: parse(gesprek.intro[language]), answer };
};

export default function BrainAssistant({ onOpenNote }) {
    const { language } = useLanguage();
    const tx = tekst[language];
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(null); // het gekozen gesprek, null = de pillen
    const [phase, setPhase] = useState(null);   // null = nog niet gestart
    const [n, setN] = useState(0);
    const scrollRef = useRef(null);

    const { gesprek, intro, answer } = useMemo(() => prepare(active, language), [active, language]);
    const vraag = gesprek.vraag[language];
    const answerTotal = answer.reduce((s, b) => s + b.lines.reduce((x, l) => x + l.length, 0), 0);
    const stepsTotal = gesprek.stappen.length;

    // Sluiten zet alles terug, zodat bij het openen altijd weer de drie pillen staan.
    // Het venster vervaagt eerst, pas daarna verdwijnt het gesprek (anders springt de inhoud tijdens het sluiten)
    const resetRef = useRef(0);
    const close = () => {
        setOpen(false);
        clearTimeout(resetRef.current);
        resetRef.current = setTimeout(() => {
            setActive(null);
            setPhase(null);
            setN(0);
        }, 500);
    };
    const toggle = () => {
        if (open) return close();
        clearTimeout(resetRef.current);
        setActive(null);
        setPhase(null);
        setN(0);
        setOpen(true);
    };
    useEffect(() => () => clearTimeout(resetRef.current), []);

    const start = (id) => {
        setActive(id);
        setPhase(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? DONE : TYPE);
        setN(0);
    };

    // Het verloop: elke stap wacht even en zet dan de volgende letter, het volgende woord of de volgende fase
    useEffect(() => {
        if (!open || phase === null || phase === DONE) return;
        const next = (ms, fn) => {
            const id = setTimeout(fn, ms);
            return () => clearTimeout(id);
        };
        const go = (p) => { setPhase(p); setN(0); };
        if (phase === TYPE) {
            if (n === 0) return next(TIMING.startDelay, () => setN(1));
            if (n < vraag.length) return next(TIMING.char, () => setN(n + 1));
            return next(TIMING.beforeSend, () => go(SENT));
        }
        if (phase === SENT) return next(TIMING.thinking, () => go(INTRO));
        if (phase === INTRO) {
            if (n < intro.length) return next(TIMING.introWord, () => setN(n + 1));
            return next(300, () => go(STEPS));
        }
        if (phase === STEPS) {
            if (n < stepsTotal) return next(TIMING.step, () => setN(n + 1));
            return next(TIMING.afterSteps, () => go(ANSWER));
        }
        if (phase === ANSWER) {
            if (n < answerTotal) return next(TIMING.answerWord, () => setN(n + 1));
            return next(0, () => go(DONE));
        }
    }, [open, phase, n, vraag.length, intro.length, stepsTotal, answerTotal]);

    // Het nieuwste blijft in beeld
    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [phase, n]);

    const started = phase !== null;
    const sent = started && phase >= SENT;
    const typed = phase === TYPE ? vraag.slice(0, n) : '';
    const introShown = phase === INTRO ? n : phase > INTRO ? intro.length : 0;
    const stepsDone = phase === STEPS ? n : phase > STEPS ? stepsTotal : 0;
    const answerShown = phase === ANSWER ? n : phase === DONE ? answerTotal : 0;

    return (
        <div className="absolute right-[1.4cqw] bottom-[1.4cqw] z-20 flex flex-col items-end">
            <style href="brain-assistant" precedence="default">{STYLES}</style>
            {/* Het venster groeit open vanuit de knop */}
            <div
                role="dialog"
                aria-label={tx.chat}
                aria-hidden={!open}
                inert={!open}
                className={`mb-[0.8cqw] w-[30cqw] h-[40cqw] flex flex-col overflow-hidden rounded-[1.1cqw] bg-white border border-foreground/[0.08] shadow-[0_1.5cqw_4cqw_-1.5cqw_rgba(15,23,42,0.22)] origin-bottom-right transition-[opacity,transform] duration-500 ${EASE} ${open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-[0.6cqw] pointer-events-none'}`}
            >
                <div className="h-[3.1cqw] shrink-0 flex items-center justify-between gap-[1cqw] pl-[1.2cqw] pr-[0.6cqw] border-b border-foreground/[0.06]">
                    <span className="flex items-center gap-[0.5cqw] text-[0.9cqw] font-medium text-foreground">
                        <ModelLogo size={1.1} />
                        Claude
                    </span>
                    <button
                        type="button"
                        onClick={close}
                        aria-label={tx.close}
                        className="w-[1.8cqw] h-[1.8cqw] shrink-0 rounded-full flex items-center justify-center text-foreground/45 transition-colors duration-300 hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
                    >
                        <X style={{ width: '1cqw', height: '1cqw', strokeWidth: 1.75 }} />
                    </button>
                </div>

                {/* Het gesprek */}
                <div ref={scrollRef} className="no-scrollbar flex-1 min-h-0 overflow-y-auto px-[1.4cqw] py-[1.3cqw]">
                    {!sent && (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <ModelLogo size={2.2} />
                            <p className="mt-[0.8cqw] text-[1.1cqw] font-medium text-foreground">{tx.chat}</p>
                            {/* De drie vragen als glazen pillen. Na een keuze vervagen ze, en wordt de vraag getypt */}
                            <div className={`transition-opacity duration-500 ${EASE} ${active ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                <p className="mt-[0.4cqw] text-[0.86cqw] text-foreground/50">{tx.pick}</p>
                                <div className="mt-[1.4cqw] flex flex-col items-center gap-[0.5cqw]">
                                    {gesprekken.map((g) => (
                                        <button
                                            key={g.id}
                                            type="button"
                                            onClick={() => start(g.id)}
                                            tabIndex={active ? -1 : 0}
                                            className={`ba-glass rounded-full px-[1.1cqw] py-[0.5cqw] text-[0.88cqw] text-foreground/75 transition-[color,transform,box-shadow] duration-500 ${EASE} hover:-translate-y-[0.08cqw] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
                                        >
                                            {g.vraag[language]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {sent && (
                        <div className="space-y-[1.1cqw]">
                            <Appear className="flex justify-end">
                                <p className="max-w-[85%] rounded-[0.9cqw] rounded-br-[0.3cqw] bg-foreground/[0.05] px-[0.9cqw] py-[0.55cqw] text-[0.92cqw] leading-snug text-foreground/85">
                                    {vraag}
                                </p>
                            </Appear>

                            <div className="flex gap-[0.6cqw]">
                                <span className="mt-[0.15cqw] shrink-0"><ModelLogo size={1.2} /></span>
                                <div className="min-w-0 flex-1 text-[0.92cqw] leading-relaxed text-foreground/75">
                                    {phase === SENT && (
                                        <p className="text-foreground/45 animate-pulse">{tx.thinking}</p>
                                    )}
                                    {introShown > 0 && <p><Words tokens={intro} count={introShown} /></p>}

                                    {/* De stappen, onder elkaar. Is een stap klaar, dan vloeit er een groene lijn
                                        van haar bolletje naar dat van de volgende stap */}
                                    {phase >= STEPS && (
                                        <ol className="mt-[0.9cqw] mb-[1.1cqw] ml-[0.45cqw] pl-[1.25cqw] space-y-[0.85cqw]">
                                            {gesprek.stappen.map((s, i) => {
                                                if (i > stepsDone) return null;
                                                const done = i < stepsDone;
                                                return (
                                                    <Appear as="li" key={i} className="relative">
                                                        {done && i < stepsTotal - 1 && <Flow />}
                                                        <Bead done={done} />
                                                        <p className={`text-[0.86cqw] leading-snug transition-colors duration-700 ${done ? 'text-foreground/50' : 'ba-shimmer'}`}>
                                                            {s.tekst[language]}
                                                        </p>
                                                        {/* De notities die gelezen of bewerkt zijn, als ruwe bestandspaden op glas.
                                                            Een bewerkte notitie staat in het groen, met een plusje ervoor */}
                                                        <Reveal show={done}>
                                                            <div className="mt-[0.4cqw] flex flex-wrap gap-[0.3cqw]">
                                                                {[...(s.gelezen || []).map((id) => [id, false]), ...(s.bewerkt || []).map((id) => [id, true])].map(([id, edited], j) => (
                                                                    <span
                                                                        key={id}
                                                                        className={`ba-glass rounded-[0.45cqw] px-[0.5cqw] py-[0.15cqw] font-mono text-[0.7cqw] tracking-tight transition-[opacity,transform] duration-700 ${EASE} ${edited ? 'text-accent' : 'text-foreground/55'} ${done ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[0.3cqw]'}`}
                                                                        style={{ transitionDelay: done ? `${120 + j * 110}ms` : '0ms' }}
                                                                    >
                                                                        {edited && '+ '}{notePath(id, language)}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </Reveal>
                                                    </Appear>
                                                );
                                            })}
                                        </ol>
                                    )}

                                    {/* Het antwoord, opgemaakt zoals Markdown */}
                                    {answerShown > 0 && (
                                        <div className="space-y-[0.6cqw]">
                                            {answer.map((b, i) => {
                                                const left = answerShown - b.start;
                                                if (left <= 0) return null;
                                                if (b.type === 'h') {
                                                    return <p key={i} className="pt-[0.3cqw] text-[0.98cqw] font-medium text-foreground"><Words tokens={b.lines[0]} count={left} /></p>;
                                                }
                                                if (b.type === 'ul') {
                                                    let rest = left;
                                                    return (
                                                        <ul key={i} className="space-y-[0.3cqw]">
                                                            {b.lines.map((line, j) => {
                                                                const c = rest;
                                                                rest -= line.length;
                                                                if (c <= 0) return null;
                                                                return (
                                                                    <li key={j} className="relative pl-[1cqw]">
                                                                        <span aria-hidden="true" className="absolute left-[0.2cqw] top-[0.62cqw] w-[0.28cqw] h-[0.28cqw] rounded-full bg-foreground/35" />
                                                                        <Words tokens={line} count={c} />
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    );
                                                }
                                                return <p key={i}><Words tokens={b.lines[0]} count={left} /></p>;
                                            })}
                                        </div>
                                    )}

                                    {/* De bronnen, pas als het antwoord er volledig staat */}
                                    <Reveal show={phase === DONE}>
                                        <p className="mt-[1.1cqw] text-[0.78cqw] text-foreground/45">{tx.sources}</p>
                                        <div className="mt-[0.4cqw] flex flex-wrap gap-[0.35cqw]">
                                            {gesprek.bronnen.map((id) => (
                                                <button
                                                    key={id}
                                                    type="button"
                                                    onClick={() => onOpenNote(id)}
                                                    tabIndex={phase === DONE ? 0 : -1}
                                                    className="rounded-full border border-accent/25 bg-accent/[0.06] px-[0.6cqw] py-[0.2cqw] text-[0.78cqw] text-accent transition-colors duration-300 hover:bg-accent hover:border-accent hover:text-white focus-visible:outline-2 focus-visible:outline-accent"
                                                >
                                                    {notities[id].title[language]}
                                                </button>
                                            ))}
                                        </div>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* De chatbalk: hier wordt de vraag getypt. Enkel om te kijken, de bezoeker typt zelf niets */}
                <div className="shrink-0 px-[1cqw] pb-[1cqw]" aria-hidden="true">
                    <div className="flex items-center gap-[0.6cqw] rounded-[1cqw] border border-foreground/10 bg-white pl-[1cqw] pr-[0.45cqw] h-[3cqw] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                        <p className="flex-1 min-w-0 truncate text-[0.92cqw]">
                            {typed
                                ? <span className="text-foreground/85">{typed}<span className="inline-block w-px h-[1.05cqw] -mb-[0.15cqw] ml-px bg-foreground/70 animate-pulse" /></span>
                                : <span className="text-foreground/35">{tx.placeholder}</span>}
                        </p>
                        <span className={`w-[2.1cqw] h-[2.1cqw] shrink-0 rounded-full flex items-center justify-center transition-colors duration-300 ${typed ? 'bg-foreground text-white' : 'bg-foreground/[0.08] text-foreground/35'}`}>
                            <ArrowUp style={{ width: '1cqw', height: '1cqw', strokeWidth: 2 }} />
                        </span>
                    </div>
                </div>
            </div>

            {/* De knop: de logo's van Claude en ChatGPT, licht over elkaar */}
            <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                className={`group flex items-center gap-[0.6cqw] h-[2.8cqw] rounded-full bg-white border border-foreground/[0.09] pl-[0.4cqw] pr-[1cqw] shadow-[0_0.6cqw_1.6cqw_-0.6cqw_rgba(15,23,42,0.25)] transition-[box-shadow,transform] duration-500 ${EASE} hover:-translate-y-[0.1cqw] hover:shadow-[0_0.9cqw_2cqw_-0.7cqw_rgba(15,23,42,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
            >
                <span className="flex items-center" aria-hidden="true">
                    <span className="w-[2cqw] h-[2cqw] rounded-full bg-[#faf9f5] border border-foreground/[0.07] flex items-center justify-center">
                        <ModelLogo size={1.15} />
                    </span>
                    <span className="-ml-[0.6cqw] w-[2cqw] h-[2cqw] rounded-full bg-white border border-foreground/[0.07] flex items-center justify-center">
                        <img src="/logo/chatgpt.webp" alt="" draggable="false" className="block object-contain" style={{ width: '1.1cqw', height: '1.1cqw' }} />
                    </span>
                </span>
                <span className="text-[0.95cqw] font-medium text-foreground">{tx.launcher}</span>
            </button>
        </div>
    );
}

// Het pad van een notitie in het tweede brein, zoals een bestand: "Dossiers/Klanten/Greenfield.md"
const notePath = (id, language) => {
    const title = notities[id].title[language];
    const file = /\.[a-z]+$/i.test(title) ? title : `${title}.md`;
    return [...mapVan[id].map((m) => m[language]), file].join('/');
};

// Een glazen bolletje op de lijn. Zolang de stap loopt, ademt er een zachte ring rond; is de stap
// klaar, dan vult het bolletje zich met het groen van de lijn. Geen vinkje: rustiger
function Bead({ done }) {
    return (
        <span aria-hidden="true" className="absolute -left-[1.25cqw] top-[0.17cqw] -translate-x-1/2 w-[0.85cqw] h-[0.85cqw]">
            {!done && <span className="ba-breathe absolute inset-0 rounded-full border border-accent/40" />}
            <span className={`ba-bead absolute inset-0 rounded-full transition-[background-color,box-shadow] duration-700 ${EASE} ${done ? 'bg-accent/80 ba-bead-done' : 'bg-white/70'}`} />
        </span>
    );
}

// Het stukje lijn van een afgeronde stap naar de volgende: het vloeit van boven naar onder vol.
// Van het midden van dit bolletje (0.17 + 0.425, op de hoogte van de eerste tekstregel) tot het midden
// van het volgende, één tussenruimte (0.85) lager dan de onderkant van deze stap
function Flow() {
    const [full, setFull] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setFull(true));
        return () => cancelAnimationFrame(id);
    }, []);
    return (
        <span aria-hidden="true" className="absolute -left-[1.25cqw] top-[0.595cqw] -bottom-[1.445cqw] w-px -translate-x-1/2 bg-foreground/[0.08] overflow-hidden">
            <span
                className={`absolute inset-0 origin-top bg-gradient-to-b from-accent/70 to-accent/35 transition-transform duration-1000 ${EASE} ${full ? 'scale-y-100' : 'scale-y-0'}`}
            />
        </span>
    );
}

// De animaties en het glas van het chatvenster. Hier en niet in index.css, omdat dat bestand gedeeld is
const STYLES = `
.ba-glass {
    background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.55));
    box-shadow: inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(15,23,42,0.04), 0 0 0 1px rgba(15,23,42,0.07), 0 2px 6px -3px rgba(15,23,42,0.18);
}
.ba-bead {
    background-image: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0) 70%);
    box-shadow: inset 0 0 0 1px rgba(15,23,42,0.12), 0 1px 3px rgba(15,23,42,0.12);
}
.ba-bead-done {
    box-shadow: inset 0 0 0 1px rgba(98,143,105,0.35), inset 0 -1px 2px rgba(15,23,42,0.15), 0 1px 4px rgba(98,143,105,0.35);
}
.ba-shimmer {
    color: transparent;
    background: linear-gradient(90deg, rgba(15,23,42,0.42) 0%, rgba(15,23,42,0.42) 35%, rgba(15,23,42,0.92) 50%, rgba(15,23,42,0.42) 65%, rgba(15,23,42,0.42) 100%);
    background-size: 250% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    animation: ba-shimmer 1.8s linear infinite;
}
.ba-breathe { animation: ba-breathe 1.6s cubic-bezier(0.22,1,0.36,1) infinite; }
@keyframes ba-shimmer { from { background-position: 100% 0; } to { background-position: 0% 0; } }
@keyframes ba-breathe { 0% { transform: scale(1); opacity: 0.9; } 100% { transform: scale(2.1); opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
    .ba-shimmer, .ba-breathe { animation: none; }
    .ba-shimmer { color: rgba(15,23,42,0.8); background: none; }
}
`;

// De eerste `count` woorden, met vet waar dat in de tekst staat
function Words({ tokens, count }) {
    return tokens.slice(0, count).map((t, i) => (
        <React.Fragment key={i}>
            {i > 0 && !t.glue ? ' ' : ''}
            {t.b ? <strong className="font-semibold text-foreground">{t.w}</strong> : t.w}
        </React.Fragment>
    ));
}

// Komt zacht op wanneer het verschijnt
function Appear({ as = 'div', className = '', children }) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setShown(true));
        return () => cancelAnimationFrame(id);
    }, []);
    return React.createElement(
        as,
        { className: `transition-[opacity,transform] duration-500 ${EASE} ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[0.4cqw]'} ${className}` },
        children
    );
}

// Klapt zacht open, zoals de veelgestelde vragen
function Reveal({ show, children }) {
    return (
        <div className={`grid transition-[grid-template-rows,opacity] duration-500 ${EASE} ${show ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">{children}</div>
        </div>
    );
}

function ModelLogo({ size }) {
    return (
        <img
            src="/logo/claude.svg"
            alt=""
            draggable="false"
            className="block shrink-0 object-contain"
            style={{ width: `${size}cqw`, height: `${size}cqw` }}
        />
    );
}
