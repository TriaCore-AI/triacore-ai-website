import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// Hoe lang één quote blijft staan voor de volgende komt (in ms)
const DURATION = 10000;

// Klantquotes, één tegelijk. Alle quotes staan in dezelfde rastercel op elkaar, zodat de hoogte
// gelijk blijft aan de langste quote en er niets verspringt bij het wisselen.
// Onderaan staan de bedrijfslogo's als tabs; boven het actieve logo loopt een dunne lijn vol,
// en daarna komt de volgende quote. Bij hover pauzeert het wisselen.
// Een foto is optioneel: zonder foto staan de initialen in een rustig cirkeltje.
export default function QuoteStage({ items }) {
    const { language } = useLanguage();
    const [active, setActive] = useState(0);
    const [reduced, setReduced] = useState(false);
    const many = items.length > 1;

    useEffect(() => {
        setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }, []);

    const next = () => setActive((a) => (a + 1) % items.length);

    return (
        <div className="group/quotes">
            <div className="grid">
                {items.map((q, i) => {
                    const on = i === active;
                    return (
                        <figure
                            key={q.key}
                            aria-hidden={!on}
                            className={`[grid-area:1/1] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-3 pointer-events-none'}`}
                        >
                            <span className="block font-serif italic text-accent text-6xl leading-none h-8 select-none" aria-hidden="true">&ldquo;</span>
                            <blockquote className="font-serif text-xl md:text-2xl leading-snug text-foreground">
                                {q.quote[language] || q.quote.en}
                            </blockquote>
                            <figcaption className="mt-7 flex items-center gap-4">
                                {q.photo ? (
                                    <img src={q.photo} alt={q.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
                                ) : (
                                    <span className="w-11 h-11 rounded-full border border-foreground/15 flex items-center justify-center text-xs font-medium text-foreground/60 shrink-0" aria-hidden="true">
                                        {q.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <p className="text-base font-medium text-foreground leading-tight">{q.name}</p>
                                    <p className="mt-0.5 text-sm text-foreground/50 leading-snug">{q.role}</p>
                                </div>
                            </figcaption>
                        </figure>
                    );
                })}
            </div>

            {many && (
                <div className={`mt-10 grid gap-6 ${['grid-cols-1', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4'][Math.min(items.length, 4)]}`}>
                    {items.map((q, i) => {
                        const on = i === active;
                        return (
                            <button
                                key={q.key}
                                type="button"
                                onClick={() => setActive(i)}
                                aria-label={q.company}
                                aria-pressed={on}
                                className="group/tab text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                            >
                                <span className="relative block h-px bg-foreground/10 overflow-hidden">
                                    {on && (
                                        <span
                                            key={`${active}-${language}`}
                                            className="absolute inset-y-0 left-0 bg-foreground/70 group-hover/quotes:[animation-play-state:paused]"
                                            style={reduced ? { width: '100%' } : { animation: `quote-progress ${DURATION}ms linear forwards` }}
                                            onAnimationEnd={next}
                                        />
                                    )}
                                </span>
                                <span className="mt-4 flex h-8 items-center">
                                    <img
                                        src={q.logo}
                                        alt=""
                                        className={`max-h-7 max-w-[100px] w-auto object-contain mix-blend-multiply transition duration-500 ${on ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale group-hover/tab:opacity-70'}`}
                                    />
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
