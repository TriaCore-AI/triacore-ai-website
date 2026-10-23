import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollToPlugin);

// Hoe breed de vervaging aan een rand van de rij maximaal is
const FADE = 140;

// Horizontale rij kaarten met vaste kaartbreedte. De rij blijft binnen de inhoudsbreedte, zodat er
// links en rechts altijd dezelfde afstand tot de schermrand is (dezelfde als bij de rest van de pagina).
// Past alles, dan staan de kaarten in het midden en verdwijnen de pijltjes. Past het niet, dan start
// de rij altijd links, bij de eerste kaart, en schuif je met de pijltjes telkens één kaart op.
// Waar nog kaarten voorbij de rand liggen, vervaagt de rij vloeiend naar die rand toe. De vervaging
// eindigt precies op de inhoudsrand en groeit en krimpt mee met het scrollen.
// Geef de kinderen zelf hun vaste breedte mee, bv. `shrink-0 w-[82vw] sm:w-[400px]`.
export default function CardCarousel({ children }) {
    const { language } = useLanguage();
    const frameRef = useRef(null);
    const trackRef = useRef(null);
    const tweenRef = useRef(null);
    const [state, setState] = useState({ prev: false, next: false, progress: 0, visible: 1 });

    const update = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        const x = el.scrollLeft;
        // Vervaging per kant: nul aan het uiteinde, groeit tot FADE zodra er iets voorbij de rand ligt
        el.style.setProperty('--fade-l', `${Math.min(FADE, Math.max(0, x))}px`);
        el.style.setProperty('--fade-r', `${Math.min(FADE, Math.max(0, max - x))}px`);
        setState({
            prev: x > 4,
            next: x < max - 4,
            progress: max > 0 ? x / max : 0,
            visible: el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1
        });
    }, []);

    // De scrollpositie waarop een kaart in het midden staat, met links en rechts evenveel ruimte
    // voor de buren. Aan de uiteinden kan dat niet; daar wordt het gewoon helemaal links of rechts
    const centeredStop = (card) => {
        const el = trackRef.current;
        const max = el.scrollWidth - el.clientWidth;
        const track = el.getBoundingClientRect();
        const r = card.getBoundingClientRect();
        const center = el.scrollLeft + (r.left - track.left) + r.width / 2;
        return Math.max(0, Math.min(max, center - el.clientWidth / 2));
    };

    // Alle verschillende rustposities van de pijltjes, van links naar rechts
    const allStops = () => {
        const row = trackRef.current?.firstElementChild;
        const stops = [...(row?.children || [])].map(centeredStop).sort((a, b) => a - b);
        return stops.filter((p, i) => i === 0 || p - stops[i - 1] > 2);
    };

    // Vloeiend naar een scrollpositie
    const glideTo = (x, duration = 1.1, ease = 'power3.inOut') => {
        const el = trackRef.current;
        const max = el.scrollWidth - el.clientWidth;
        tweenRef.current?.kill();
        tweenRef.current = gsap.to(el, {
            scrollTo: { x: Math.max(0, Math.min(max, x)), autoKill: true },
            duration,
            ease
        });
    };

    // Pijltjes: naar de volgende of vorige rustpositie, gerekend vanaf waar de rij nu is (of naartoe gaat)
    const scrollByCard = (dir) => {
        const el = trackRef.current;
        const base = tweenRef.current?.isActive() ? tweenRef.current.vars.scrollTo.x : el.scrollLeft;
        const stops = allStops();
        const target = dir > 0 ? stops.find((p) => p > base + 2) : [...stops].reverse().find((p) => p < base - 2);
        if (target !== undefined) glideTo(target);
    };

    // Slepen met de muis: klik, hou vast en trek opzij. Je stopt waar je wil; bij het loslaten loopt
    // de rij nog even uit in de richting van de beweging. Na een sleep opent een kaart niet per ongeluk.
    // Vegen met trackpad of vinger doet de browser zelf, ook volledig vrij
    const dragRef = useRef(null);
    const suppressClick = useRef(false);
    const onPointerDown = (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        const el = trackRef.current;
        if (el.scrollWidth <= el.clientWidth) return;
        tweenRef.current?.kill();
        dragRef.current = { startX: e.clientX, left: el.scrollLeft, moved: false, lastX: e.clientX, lastT: performance.now(), v: 0 };
    };

    // Bij elke maatwijziging de pijltjes, voortgang en vervaging opnieuw berekenen,
    // en de muisbeweging volgen zolang er gesleept wordt
    useEffect(() => {
        update();
        const ro = new ResizeObserver(() => requestAnimationFrame(update));
        ro.observe(frameRef.current);

        const onMove = (e) => {
            const d = dragRef.current;
            const el = trackRef.current;
            if (!d || !el) return;
            const dx = e.clientX - d.startX;
            if (!d.moved && Math.abs(dx) > 5) {
                d.moved = true;
                el.classList.add('cursor-grabbing', 'select-none');
            }
            if (!d.moved) return;
            el.scrollLeft = d.left - dx;
            const now = performance.now();
            d.v = (e.clientX - d.lastX) / Math.max(1, now - d.lastT);
            d.lastX = e.clientX;
            d.lastT = now;
        };
        const onUp = () => {
            const d = dragRef.current;
            const el = trackRef.current;
            dragRef.current = null;
            if (!d || !el || !d.moved) return;
            el.classList.remove('cursor-grabbing', 'select-none');
            suppressClick.current = true;
            setTimeout(() => { suppressClick.current = false; }, 0);
            // Even uitlopen, zonder vast punt
            if (Math.abs(d.v) > 0.05) glideTo(el.scrollLeft - d.v * 250, 0.7, 'power3.out');
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);

        return () => {
            ro.disconnect();
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            tweenRef.current?.kill();
            clearTimeout(hoverTimer.current);
        };
    }, [update]);

    // Hover over een kaart die deels buiten beeld (vervaagd) staat: de rij schuift tot die kaart in het
    // midden staat (of helemaal aan de rand, als het de eerste of laatste is). Alleen voor die
    // uitpiepende kaart zelf, en pas na een korte rust, zodat er niets schuift als je er gewoon overheen beweegt
    const hoverTimer = useRef(null);
    const hoverCard = useRef(null);
    const onCardHover = (e) => {
        const row = trackRef.current?.firstElementChild;
        const card = [...(row?.children || [])].find((c) => c.contains(e.target));
        if (card === hoverCard.current) return;   // nog altijd op dezelfde kaart
        hoverCard.current = card;
        clearTimeout(hoverTimer.current);
        if (!card || dragRef.current || tweenRef.current?.isActive()) return;
        hoverTimer.current = setTimeout(() => {
            if (dragRef.current || tweenRef.current?.isActive()) return;
            const frame = frameRef.current.getBoundingClientRect();
            const r = card.getBoundingClientRect();
            if (r.right > frame.right + 1 || r.left < frame.left - 1) glideTo(centeredStop(card));
        }, 150);
    };
    const onRowLeave = () => {
        clearTimeout(hoverTimer.current);
        hoverCard.current = null;
    };

    const scrollable = state.prev || state.next;
    const fade = 'linear-gradient(to right, transparent 0, #000 var(--fade-l, 0px), #000 calc(100% - var(--fade-r, 0px)), transparent 100%)';

    return (
        <div ref={frameRef}>
            {/* De rij blijft binnen de inhoudsbreedte. De binnenste rij is zo breed als de kaarten en staat
                met mx-auto in het midden zolang alles past. De kleine binnenruimte rondom (10px, gecompenseerd
                met negatieve marges) geeft de L lijn rond de kaarten plaats, zonder dat ze afgeknipt wordt */}
            <div
                ref={trackRef}
                onScroll={update}
                onPointerDown={onPointerDown}
                onClickCapture={(e) => { if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); } }}
                className={`no-scrollbar overflow-x-auto overflow-y-hidden -mx-2.5 -my-3 py-3 ${scrollable ? 'cursor-grab' : ''}`}
                style={{ WebkitMaskImage: fade, maskImage: fade }}
            >
                <div
                    className="flex w-max mx-auto gap-8 md:gap-10 px-2.5"
                    onMouseOver={onCardHover}
                    onMouseLeave={onRowLeave}
                    onDragStart={(e) => e.preventDefault()}
                >
                    {children}
                </div>
            </div>

            {scrollable && (
                <div className="mt-10 flex items-center gap-8">
                    <div className="relative h-px flex-1 bg-foreground/10 overflow-hidden" aria-hidden="true">
                        <div
                            className="absolute inset-y-0 bg-foreground/60"
                            style={{ width: `${state.visible * 100}%`, left: `${state.progress * (1 - state.visible) * 100}%` }}
                        />
                    </div>
                    <div className="flex gap-3">
                        <ArrowButton
                            onClick={() => scrollByCard(-1)}
                            disabled={!state.prev}
                            label={language === 'nl' ? 'Vorige' : 'Previous'}
                            icon={ArrowLeft}
                            nudge="group-hover:-translate-x-0.5"
                        />
                        <ArrowButton
                            onClick={() => scrollByCard(1)}
                            disabled={!state.next}
                            label={language === 'nl' ? 'Volgende' : 'Next'}
                            icon={ArrowRight}
                            nudge="group-hover:translate-x-0.5"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function ArrowButton({ onClick, disabled, label, icon: Icon, nudge }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className="group w-12 h-12 rounded-full border border-foreground/15 bg-transparent flex items-center justify-center text-foreground/70 transition-all duration-300 hover:bg-foreground hover:border-foreground hover:text-white disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
            <Icon size={18} strokeWidth={1.5} className={`transition-transform duration-300 ${nudge}`} />
        </button>
    );
}
