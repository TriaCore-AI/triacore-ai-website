import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LocateFixed, Minus, Plus } from 'lucide-react';

// De verbanden tussen notities, zoals de graph van Obsidian maar rustig en in de stijl van TriaCore:
// elke bol is een notitie, elke lijn een verwijzing. Hoe meer verwijzingen, hoe groter de bol.
// Een eigen, kleine krachtensimulatie (geen extra bibliotheek): bollen stoten elkaar af, lijnen trekken
// ze naar elkaar toe, en alles wordt zacht naar het midden getrokken. Na een paar seconden komt het tot rust.
//
// Bewegen in de graph:
// - bollen slepen; een klik (zonder slepen) opent de notitie
// - de achtergrond slepen om te verschuiven
// - zoomen met het scrollwiel, door te knijpen op een trackpad of met de knoppen rechtsboven
//   (rechtsonder staat de knop van de AI-assistent)
//   (boven de graph scrolt de pagina dus niet mee)
// - centreren met de knop: alles komt vloeiend en precies in het midden in beeld
// Zolang niemand zelf zoomt of verschuift, centreert de graph zichzelf: terwijl hij tot rust komt en
// wanneer het paneel van breedte verandert (bv. als er een notitie naast opent).
//
// Bij hover of een open notitie lichten de notitie en haar buren op, de rest wordt stiller.
// Alle maten staan in cqw-eenheden (1 = 1% van de schermbreedte), zodat de graph meeschaalt met het scherm.

// Instellingen van de simulatie, in cqw-eenheden
// (Afgesteld door de simulatie los door te rekenen voor een breed en een smal paneel.)
const REPEL = 0.9;          // afstoting tussen bollen
const LINK_LENGTH = 7;      // gewenste lengte van een lijn
const LINK_STRENGTH = 0.5;  // hoe stevig een lijn trekt (gedeeld door het aantal lijnen van de drukste kant)
const CENTER = 0.025;       // trek naar het midden
const FRICTION = 0.6;       // hoeveel snelheid er per stap overblijft
const ALPHA_DECAY = 0.025;  // hoe snel de beweging uitdooft
const SEED = 11;            // vaste startspreiding: elke keer hetzelfde, maar niet netjes geordend

// Zoomen en centreren
const ZOOM_MIN = 0.4;
const ZOOM_MAX = 3;
const ZOOM_STEP = 1.35;     // per klik op + of -
const GLIDE = 0.14;         // hoe snel het beeld naar zijn doel glijdt (per frame)
const FIT_PAD = 2;          // vrije rand rondom bij het centreren
const HINT_SPACE = 3.5;     // onderaan vrij voor de uitleg en de knoppen
const LABEL_HALF = 4.5;     // halve breedte van een lang label, zodat labels nooit buiten beeld vallen

// Een kleine, voorspelbare toevalsgenerator (mulberry32)
const seeded = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Het oplichten bij hover: traag en zacht uitlopend, in dezelfde curve als de rest van de site
const SOFT = 'duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]';

export default function VaultGraph({ nodes, links, activeId, onSelect, label, controls }) {
    const wrapRef = useRef(null);
    const unitRef = useRef(null);
    const svgRef = useRef(null);
    const sizeRef = useRef(null);                 // het paneel, in eenheden
    const worldRef = useRef(null);                // het midden waar de simulatie naartoe trekt
    const simRef = useRef({ pos: new Map(), alpha: 1, alphaTarget: 0 });
    const viewRef = useRef({ k: 1, tx: 0, ty: 0 }); // het huidige beeld: zoom en verschuiving
    const targetRef = useRef(null);               // waar het beeld naartoe glijdt
    const followRef = useRef(true);               // centreert de graph zichzelf?
    const runningRef = useRef(false);
    const rafRef = useRef(0);
    const dragRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [hover, setHover] = useState(null);
    const [, setFrame] = useState(0);

    const neighbors = useMemo(() => {
        const map = new Map(nodes.map((n) => [n.id, new Set()]));
        links.forEach(([a, b]) => { map.get(a)?.add(b); map.get(b)?.add(a); });
        return map;
    }, [nodes, links]);

    // Eén stap van de simulatie
    const tick = () => {
        const s = simRef.current;
        const { w, h } = worldRef.current;
        s.alpha += (s.alphaTarget - s.alpha) * ALPHA_DECAY;
        const pts = nodes.map((n) => s.pos.get(n.id));

        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const a = pts[i], b = pts[j];
                const dx = b.x - a.x, dy = b.y - a.y;
                const d2 = Math.max(dx * dx + dy * dy, 0.5);
                const f = (REPEL * s.alpha) / d2;
                a.vx -= dx * f; a.vy -= dy * f;
                b.vx += dx * f; b.vy += dy * f;
            }
        }
        // Een lijn naar een druk knooppunt trekt zachter, zoals in Obsidian: de knooppunten zakken naar het
        // midden, de notities met weinig verwijzingen waaieren uit naar de rand
        links.forEach(([ia, ib]) => {
            const a = s.pos.get(ia), b = s.pos.get(ib);
            const dx = b.x - a.x, dy = b.y - a.y;
            const l = Math.sqrt(dx * dx + dy * dy) || 0.01;
            const strength = LINK_STRENGTH / Math.min(neighbors.get(ia).size, neighbors.get(ib).size);
            const k = ((l - LINK_LENGTH) / l) * s.alpha * strength * 0.5;
            a.vx += dx * k; a.vy += dy * k;
            b.vx -= dx * k; b.vy -= dy * k;
        });
        pts.forEach((p) => {
            // Het scherm is breder dan hoog: verticaal trekt het midden iets sterker
            p.vx += (w / 2 - p.x) * CENTER * s.alpha;
            p.vy += (h / 2 - p.y) * CENTER * 1.3 * s.alpha;
            if (p.fx != null) {
                p.x = p.fx; p.y = p.fy; p.vx = 0; p.vy = 0;
                return;
            }
            p.vx *= FRICTION; p.vy *= FRICTION;
            p.x += p.vx; p.y += p.vy;
        });
    };

    // Het beeld waarin alle bollen en labels precies in het midden passen, met wat ruimte rondom
    // en onderaan plaats voor de uitleg en de knoppen
    const fit = () => {
        const { w, h } = sizeRef.current;
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        simRef.current.pos.forEach((p) => {
            x0 = Math.min(x0, p.x - LABEL_HALF); x1 = Math.max(x1, p.x + LABEL_HALF);
            y0 = Math.min(y0, p.y - 1.5); y1 = Math.max(y1, p.y + 2);
        });
        const aw = w - 2 * FIT_PAD;
        const ah = h - 2 * FIT_PAD - HINT_SPACE;
        const k = clamp(Math.min(aw / (x1 - x0), ah / (y1 - y0)), ZOOM_MIN, ZOOM_MAX);
        return { k, tx: w / 2 - ((x0 + x1) / 2) * k, ty: FIT_PAD + ah / 2 - ((y0 + y1) / 2) * k };
    };

    // Eén beeld: een stap van de simulatie (zolang die beweegt) en het beeld een stukje naar zijn doel
    const frame = () => {
        const s = simRef.current;
        const simActive = s.alpha > 0.005 || s.alphaTarget > 0;
        if (simActive) tick();
        if (followRef.current && dragRef.current?.type !== 'node') targetRef.current = fit();

        let gliding = false;
        const v = viewRef.current;
        const to = targetRef.current;
        if (to) {
            v.k += (to.k - v.k) * GLIDE;
            v.tx += (to.tx - v.tx) * GLIDE;
            v.ty += (to.ty - v.ty) * GLIDE;
            gliding = Math.abs(to.k - v.k) > 0.0005 || Math.abs(to.tx - v.tx) > 0.01 || Math.abs(to.ty - v.ty) > 0.01;
            if (!gliding) {
                Object.assign(v, to);
                if (!followRef.current) targetRef.current = null;
            }
        }
        setFrame((f) => f + 1);
        if (simActive || gliding) rafRef.current = requestAnimationFrame(frame);
        else runningRef.current = false;
    };

    const kick = () => {
        if (runningRef.current || !sizeRef.current) return;
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(frame);
    };

    const heat = (alpha) => {
        const s = simRef.current;
        s.alpha = Math.max(s.alpha, alpha);
        kick();
    };

    // Maten: de breedte van het paneel in cqw-eenheden. De verborgen span is 100cqw breed
    useEffect(() => {
        const sim = simRef.current;
        const measure = () => {
            const u = unitRef.current.offsetWidth / 100;
            const el = wrapRef.current;
            if (!u || !el.clientWidth) return;
            const next = { w: el.clientWidth / u, h: el.clientHeight / u };
            const first = !sizeRef.current;
            sizeRef.current = next;
            if (first) {
                // Startposities verspreid over het midden, met een vaste toevalsreeks; de simulatie zoekt
                // daarna zelf haar evenwicht, zodat het geheel organisch en wat door elkaar oogt
                worldRef.current = next;
                const rand = seeded(SEED);
                nodes.forEach((n) => {
                    sim.pos.set(n.id, {
                        x: next.w / 2 + (rand() - 0.5) * next.w * 0.55,
                        y: next.h / 2 + (rand() - 0.5) * next.h * 0.55,
                        vx: 0, vy: 0, fx: null, fy: null
                    });
                });
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    for (let i = 0; i < 300; i++) tick();
                    sim.alpha = 0;
                }
                Object.assign(viewRef.current, fit());
                setReady(true);
                kick();
                return;
            }
            // Een ander formaat (bv. een notitie die ernaast opent): opnieuw vloeiend centreren
            followRef.current = true;
            kick();
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(wrapRef.current);
        ro.observe(unitRef.current);
        return () => {
            ro.disconnect();
            cancelAnimationFrame(rafRef.current);
            runningRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Zoomen rond een punt op het scherm (in eenheden van het paneel)
    const zoomAround = (base, factor, sx, sy) => {
        const k = clamp(base.k * factor, ZOOM_MIN, ZOOM_MAX);
        return { k, tx: sx - (sx - base.tx) * (k / base.k), ty: sy - (sy - base.ty) * (k / base.k) };
    };

    // Scrollen of knijpen boven de graph: meteen zoomen rond de muis, de pagina scrolt niet mee.
    // Knijpen (dat de browser als Ctrl + scroll doorgeeft) geeft kleine stapjes, een scrollwiel grote:
    // die laatste rekenen we zachter, zodat één tik op het wiel ongeveer één klik op + of - is
    useEffect(() => {
        const el = wrapRef.current;
        const onWheel = (e) => {
            if (!sizeRef.current) return;
            e.preventDefault();
            const { sx, sy } = toPane(e);
            const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
            const speed = e.ctrlKey || e.metaKey ? 0.01 : 0.002;
            followRef.current = false;
            targetRef.current = null;
            Object.assign(viewRef.current, zoomAround(viewRef.current, Math.exp(-delta * speed), sx, sy));
            setFrame((f) => f + 1);
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    // Van een muispositie naar eenheden in het paneel. Rekent met de echte maat op het scherm,
    // zodat het ook klopt terwijl het scherm nog geschaald wordt door de scrollanimatie
    const toPane = (e) => {
        const r = wrapRef.current.getBoundingClientRect();
        return { sx: ((e.clientX - r.left) / r.width) * sizeRef.current.w, sy: ((e.clientY - r.top) / r.height) * sizeRef.current.h };
    };
    const toWorld = (e) => {
        const { sx, sy } = toPane(e);
        const v = viewRef.current;
        return { x: (sx - v.tx) / v.k, y: (sy - v.ty) / v.k };
    };

    const onNodeDown = (e, id) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        svgRef.current.setPointerCapture(e.pointerId);
        const { x, y } = toWorld(e);
        dragRef.current = { type: 'node', id, x, y, moved: false };
        simRef.current.alphaTarget = 0.25;
        heat(0.25);
    };
    const onBackgroundDown = (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        svgRef.current.setPointerCapture(e.pointerId);
        const { sx, sy } = toPane(e);
        const v = viewRef.current;
        dragRef.current = { type: 'pan', sx, sy, tx: v.tx, ty: v.ty };
        followRef.current = false;
        targetRef.current = null;
    };
    const onMove = (e) => {
        const d = dragRef.current;
        if (!d) return;
        if (d.type === 'pan') {
            const { sx, sy } = toPane(e);
            viewRef.current.tx = d.tx + (sx - d.sx);
            viewRef.current.ty = d.ty + (sy - d.sy);
            setFrame((f) => f + 1);
            return;
        }
        const { x, y } = toWorld(e);
        if (!d.moved && Math.hypot(x - d.x, y - d.y) > 0.4) d.moved = true;
        if (!d.moved) return;
        const p = simRef.current.pos.get(d.id);
        p.fx = x; p.fy = y;
    };
    const onUp = () => {
        const d = dragRef.current;
        if (!d) return;
        dragRef.current = null;
        if (d.type === 'pan') {
            setFrame((f) => f + 1);
            return;
        }
        const p = simRef.current.pos.get(d.id);
        p.fx = null; p.fy = null;
        simRef.current.alphaTarget = 0;
        if (!d.moved) onSelect(d.id);
        kick();
    };

    // De knoppen: zoomen rond het midden van het paneel, of alles vloeiend centreren
    const zoomBy = (factor) => {
        const { w, h } = sizeRef.current;
        followRef.current = false;
        targetRef.current = zoomAround(targetRef.current || viewRef.current, factor, w / 2, (h - HINT_SPACE) / 2);
        kick();
    };
    const center = () => {
        followRef.current = true;
        kick();
    };

    // Hover laat pas na een kort ogenblik los: wie van de ene bol naar de andere gaat, ziet de graph
    // niet tussendoor even helemaal oplichten
    const hoverTimer = useRef(0);
    const enter = (id) => {
        clearTimeout(hoverTimer.current);
        setHover(id);
    };
    const leave = () => {
        clearTimeout(hoverTimer.current);
        hoverTimer.current = setTimeout(() => setHover(null), 120);
    };
    useEffect(() => () => clearTimeout(hoverTimer.current), []);

    const focus = hover || activeId;
    const lit = focus ? new Set([focus, ...(neighbors.get(focus) || [])]) : null;
    const pos = simRef.current.pos;
    const size = sizeRef.current;
    const v = viewRef.current;
    const panning = dragRef.current?.type === 'pan';

    return (
        <div ref={wrapRef} className="absolute inset-0">
            <span ref={unitRef} aria-hidden="true" className="absolute invisible h-0" style={{ width: '100cqw' }} />
            {ready && (
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${size.w} ${size.h}`}
                    preserveAspectRatio="none"
                    className={`absolute inset-0 w-full h-full select-none ${panning ? 'cursor-grabbing' : 'cursor-grab'}`}
                    role="img"
                    aria-label={label}
                    onPointerDown={onBackgroundDown}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                >
                    <g transform={`translate(${v.tx} ${v.ty}) scale(${v.k})`}>
                        {links.map(([a, b]) => {
                            const pa = pos.get(a), pb = pos.get(b);
                            const on = focus && (a === focus || b === focus);
                            return (
                                <line
                                    key={`${a}|${b}`}
                                    x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                                    strokeWidth={on ? 0.08 : 0.06}
                                    className={`transition-[stroke,opacity,stroke-width] ${SOFT} ${on ? 'stroke-accent/55' : 'stroke-foreground/[0.13]'} ${focus && !on ? 'opacity-60' : 'opacity-100'}`}
                                />
                            );
                        })}
                        {nodes.map((n) => {
                            const p = pos.get(n.id);
                            const r = 0.3 + Math.sqrt(neighbors.get(n.id).size) * 0.17;
                            const isFocus = n.id === focus;
                            const dim = lit && !lit.has(n.id);
                            // De bollen zijn volledig dekkend: een lijn stopt waar ze de bol raakt.
                            // Daarom kleuren we een stillere bol lichter in plaats van hem doorzichtig te maken.
                            // De bol onder de muis wordt een tint donkerder grijs, niet zwart: rustig, niet hard
                            const fill = n.id === activeId ? 'fill-accent' : isFocus ? 'fill-[#5f666d]' : dim ? 'fill-[#cdd2d2]' : 'fill-[#969ca1]';
                            return (
                                <g
                                    key={n.id}
                                    transform={`translate(${p.x} ${p.y})`}
                                    className="cursor-pointer"
                                    style={{ touchAction: 'none' }}
                                    onPointerDown={(e) => onNodeDown(e, n.id)}
                                    onPointerEnter={() => enter(n.id)}
                                    onPointerLeave={leave}
                                >
                                    <circle r={r + 1.2} fill="transparent" />
                                    {/* Een randje in de kleur van het papier maakt de bol los van de lijnen */}
                                    <circle
                                        r={r}
                                        strokeWidth={0.18}
                                        className={`stroke-[#f2f2f2] transition-[fill] ${SOFT} ${fill}`}
                                    />
                                    <text
                                        y={r + 1.1}
                                        textAnchor="middle"
                                        fontSize="0.72"
                                        className={`transition-[fill,opacity] ${SOFT} ${isFocus || n.id === activeId ? 'fill-foreground/80' : 'fill-foreground/45'} ${dim ? 'opacity-40' : 'opacity-100'}`}
                                    >
                                        {n.label}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            )}

            {/* Zoomen en centreren, rechtsboven */}
            <div className="absolute right-[1.2cqw] top-[1.2cqw] flex flex-col gap-[0.4cqw]">
                <ControlButton label={controls.zoomIn} onClick={() => zoomBy(ZOOM_STEP)}><Plus style={iconStyle} /></ControlButton>
                <ControlButton label={controls.zoomOut} onClick={() => zoomBy(1 / ZOOM_STEP)}><Minus style={iconStyle} /></ControlButton>
                <ControlButton label={controls.center} onClick={center}><LocateFixed style={iconStyle} /></ControlButton>
            </div>
        </div>
    );
}

const iconStyle = { width: '1cqw', height: '1cqw', strokeWidth: 1.75 };

function ControlButton({ label, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            title={label}
            className="w-[2.2cqw] h-[2.2cqw] rounded-full border border-foreground/15 bg-[#fafafa]/80 flex items-center justify-center text-foreground/60 transition-colors duration-300 hover:bg-foreground hover:border-foreground hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
            {children}
        </button>
    );
}
