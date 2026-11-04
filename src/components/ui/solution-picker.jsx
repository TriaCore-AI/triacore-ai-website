import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Kiezer met voorbeelden: bovenaan de namen naast elkaar als tabs, daaronder over de volle breedte
// links een interface en rechts de uitleg. De gekozen naam staat volledig, met een dunne groene lijn
// eronder die meeschuift; de andere staan doorzichtig en licht vervaagd, maar blijven leesbaar.
// Alle panelen staan in dezelfde rastercel op elkaar, zodat de hoogte niet verspringt bij het wisselen.
// Zonder eigen visual toont een paneel een rustige plaatshouder. Op gsm schuift de rij met namen opzij.
// Bij het binnenscrollen komen de namen op, tekent de lijn zich en komt het paneel op.
export default function SolutionPicker({ items, label, placeholder, aiLabel, moreLabel }) {
    const ref = useRef(null);
    const scrollerRef = useRef(null);
    const tabRefs = useRef([]);
    const [active, setActive] = useState(0);
    const [bar, setBar] = useState({ left: 0, width: 0 });
    const namesKey = items.map((item) => item.name).join('|');

    // De lijn onder de gekozen naam: positie en breedte opnieuw meten bij een andere keuze,
    // een andere taal, een andere schermbreedte en zodra de lettertypes geladen zijn
    useLayoutEffect(() => {
        const measure = () => {
            const el = tabRefs.current[active];
            if (el) setBar({ left: el.offsetLeft, width: el.offsetWidth });
        };
        measure();
        document.fonts?.ready.then(measure);
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [active, namesKey]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } })
                .timeScale(0.7)
                .from('.sp-base', { scaleX: 0, duration: 1.4, ease: 'power3.inOut' })
                .from('.sp-tab', { y: 16, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 }, 0.2)
                .from('.sp-bar', { opacity: 0, duration: 1, ease: 'power2.out' }, 0.7)
                .from('.sp-panel', { y: 16, opacity: 0, duration: 1.4, ease: 'expo.out' }, 0.5);
        }, ref);
        return () => ctx.revert();
    }, []);

    // Kiezen; op gsm schuift de rij mee zodat de gekozen naam in beeld staat
    const select = (i) => {
        setActive(i);
        const el = tabRefs.current[i];
        scrollerRef.current?.scrollTo({ left: Math.max(0, el.offsetLeft - 24), behavior: 'smooth' });
    };

    // Pijltjestoetsen, Home en End verspringen tussen de namen, zoals bij gewone tabs
    const onKeyDown = (e) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        let next;
        if (step !== undefined) next = (active + step + items.length) % items.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = items.length - 1;
        else return;
        e.preventDefault();
        select(next);
        tabRefs.current[next]?.focus();
    };

    return (
        <div ref={ref}>
            <div className="relative">
                <span aria-hidden="true" className="sp-base absolute inset-x-0 bottom-0 h-px bg-foreground/15 origin-left" />
                <div ref={scrollerRef} className="no-scrollbar overflow-x-auto">
                    <div
                        role="tablist"
                        aria-label={label}
                        onKeyDown={onKeyDown}
                        className="relative flex w-max gap-8 2xl:gap-12"
                    >
                        {items.map((item, i) => {
                            const on = i === active;
                            return (
                                <button
                                    key={item.key}
                                    ref={(el) => { tabRefs.current[i] = el; }}
                                    type="button"
                                    role="tab"
                                    id={`sp-tab-${item.key}`}
                                    aria-selected={on}
                                    aria-controls={`sp-panel-${item.key}`}
                                    tabIndex={on ? 0 : -1}
                                    onClick={() => select(i)}
                                    className="sp-tab group shrink-0 pb-5 md:pb-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                                >
                                    <span className={`block whitespace-nowrap text-2xl md:text-3xl font-normal tracking-tight leading-tight transition-[color,filter] duration-500 ${on ? 'text-foreground' : 'text-foreground/30 blur-[1px] group-hover:text-foreground/60 group-hover:blur-none'}`}>
                                        {item.name}
                                    </span>
                                </button>
                            );
                        })}
                        <span
                            aria-hidden="true"
                            className="sp-bar absolute bottom-0 h-px bg-accent transition-[left,width] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
                            style={{ left: bar.left, width: bar.width }}
                        />
                    </div>
                </div>
            </div>

            <div className="sp-panel mt-12 md:mt-16 grid">
                {items.map((item, i) => (
                    <Panel
                        key={item.key}
                        item={item}
                        on={i === active}
                        placeholder={placeholder}
                        aiLabel={aiLabel}
                        moreLabel={moreLabel}
                    />
                ))}
            </div>
        </div>
    );
}

// Hoelang één AI-actie in beeld blijft voor de volgende aan de beurt is
const HOLD_SECONDS = 9;

// Altijd vier kaartjes per paneel, zodat elke tab dezelfde vorm heeft. Zijn er minder acties, dan blijven de
// andere kaartjes leeg.
const CARD_COUNT = 4;

// Eén paneel: links de kop, de uitleg en de interface, rechts de kaartjes. Heeft elke AI-actie een eigen visual,
// dan wisselen die vanzelf. De groene lijn onderaan het kaartje toont hoe lang de actie nog in beeld blijft.
// Met de muis op het paneel of de toetsenbordfocus erin blijft alles staan, en wie op een actie klikt of tikt,
// houdt die in beeld tot hij zelf een andere kiest. Het wisselen loopt enkel als de visual in beeld is, en niet
// bij wie minder beweging vraagt.
function Panel({ item, on, placeholder, aiLabel, moreLabel }) {
    const rotates = Boolean(item.ai?.some((a) => a.visual));
    const count = item.ai?.length ?? 0;
    const [current, setCurrent] = useState(0);
    const [held, setHeld] = useState(false);
    const [pinned, setPinned] = useState(false);
    const [inView, setInView] = useState(false);
    const slotRef = useRef(null);
    const lineRefs = useRef([]);
    const tweenRef = useRef(null);
    const running = rotates && on && inView && !held && !pinned;

    useEffect(() => {
        if (!rotates || !slotRef.current) return undefined;
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
        observer.observe(slotRef.current);
        return () => observer.disconnect();
    }, [rotates]);

    // De lijn van de actie in beeld loopt vol, en daarna is de volgende aan de beurt
    useEffect(() => {
        if (!rotates || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        const tween = gsap.fromTo(
            lineRefs.current[current],
            { scaleX: 0 },
            { scaleX: 1, duration: HOLD_SECONDS, ease: 'none', paused: true, onComplete: () => setCurrent((c) => (c + 1) % count) }
        );
        tweenRef.current = tween;
        return () => {
            tween.kill();
            tweenRef.current = null;
        };
    }, [rotates, current, count]);

    // Starten en stoppen. Staat een actie stil die pas gekozen is, dan staat haar lijn volledig
    useEffect(() => {
        const tween = tweenRef.current;
        if (!tween) return;
        if (running) {
            tween.play();
            return;
        }
        tween.pause();
        if (pinned || tween.progress() === 0) gsap.set(lineRefs.current[current], { scaleX: 1 });
    }, [running, pinned, current]);

    const hold = rotates ? {
        onPointerEnter: (e) => { if (e.pointerType === 'mouse') setHeld(true); },
        onPointerLeave: (e) => { if (e.pointerType === 'mouse') setHeld(false); },
        onFocus: () => setHeld(true),
        onBlur: () => setHeld(false)
    } : {};

    const choose = {
        current,
        setLine: (i, el) => { lineRefs.current[i] = el; },
        onHover: setCurrent,
        onPick: (i) => {
            setCurrent(i);
            setPinned(true);
        }
    };
    const emptyCards = Math.max(0, CARD_COUNT - count);

    return (
        <div
            role="tabpanel"
            id={`sp-panel-${item.key}`}
            aria-labelledby={`sp-tab-${item.key}`}
            aria-hidden={!on}
            inert={!on}
            {...hold}
            className={`[grid-area:1/1] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'opacity-100 translate-y-0 delay-150' : 'opacity-0 translate-y-3 pointer-events-none'}`}
        >
            <div className="lg:col-span-6">
                <h3 className="text-2xl font-medium text-foreground leading-tight">{item.lead}</h3>
                <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed">{item.desc}</p>
                <div ref={slotRef} className="relative mt-6 aspect-[4/5] sm:aspect-[4/3] rounded-3xl bg-[#fafafa] border border-foreground/[0.07] overflow-hidden flex items-center justify-center">
                    {rotates
                        ? item.ai.map((a, i) => (
                            // De nieuwe visual komt boven de vorige op, en die verdwijnt pas als de overgang klaar is
                            <div
                                key={a.name}
                                aria-hidden={i !== current}
                                className={`absolute inset-0 flex items-center justify-center transition-opacity ${i === current ? 'z-10 opacity-100 duration-700' : 'z-0 opacity-0 duration-0 delay-700'}`}
                            >
                                {a.visual || <span className="text-sm text-foreground/40">{placeholder}</span>}
                            </div>
                        ))
                        : (item.visual || <span className="text-sm text-foreground/40">{placeholder}</span>)}
                </div>
            </div>

            <div className="lg:col-span-6">
                <h4 className="text-xl font-medium text-foreground leading-tight">{aiLabel}</h4>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 sm:auto-rows-fr gap-4">
                    {item.ai.map((a, i) => <AiCard key={a.name} item={a} index={i} choose={rotates ? choose : null} />)}
                    {/* De lege kaartjes houden de vorm gelijk; op gsm staan de kaartjes onder elkaar en vallen ze weg */}
                    {Array.from({ length: emptyCards }, (_, i) => (
                        <li key={i} aria-hidden="true" className="hidden sm:block rounded-2xl bg-white border border-foreground/[0.07]" />
                    ))}
                </ul>
                {moreLabel && <p className="mt-5 text-base text-foreground/60">{moreLabel}</p>}
            </div>
        </div>
    );
}

// Icoon, soort (AI of automatisering), titel en omschrijving van een kaartje
function CardBody({ item }) {
    const Icon = item.icon;
    return (
        <>
            <span className="flex items-start justify-between gap-3">
                <span className="flex items-center justify-center shrink-0 w-9 h-9 rounded-full border border-foreground/15 text-accent">
                    <Icon strokeWidth={1.5} className="w-[18px] h-[18px]" />
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap ${item.isAi ? 'border-accent/40 text-accent' : 'border-foreground/15 text-foreground/60'}`}>
                    {item.kind}
                </span>
            </span>
            <span className="mt-4 block text-base font-medium text-foreground leading-snug">{item.name}</span>
            <span className="mt-2 block text-[15px] text-foreground/60 leading-relaxed">{item.desc}</span>
        </>
    );
}

// Eén toepassing als wit kaartje. Hoort er per actie een visual bij, dan is het kaartje een knop die haar toont.
function AiCard({ item, index, choose }) {
    if (!choose) {
        return (
            <li className="rounded-2xl bg-white border border-foreground/[0.07] p-5">
                <CardBody item={item} />
            </li>
        );
    }

    const active = index === choose.current;
    return (
        <li>
            <button
                type="button"
                aria-pressed={active}
                onClick={() => choose.onPick(index)}
                onFocus={() => choose.onHover(index)}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') choose.onHover(index); }}
                className={`relative block w-full h-full overflow-hidden rounded-2xl bg-white border p-5 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${active ? 'border-accent/40' : 'border-foreground/[0.07]'}`}
            >
                <CardBody item={item} />
                <span
                    ref={(el) => { choose.setLine(index, el); }}
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-0.5 bg-accent origin-left transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}
                />
            </button>
        </li>
    );
}
