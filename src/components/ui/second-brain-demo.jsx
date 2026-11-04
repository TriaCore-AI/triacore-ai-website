import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight, FilePlus, Search, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { mappen, systeemMappen, notities, verbanden, mapVan } from '../../data/tweede-brein-demo';
import VaultGraph from './vault-graph';
import BrainAssistant from './brain-assistant';

// Een klikbaar tweede brein, in de geest van Obsidian maar in de stijl van TriaCore.
// Links de mappen met de notities. Rechts twee panelen naast elkaar: de verbanden (de graph) en de
// notitie die je aanklikt, in de zijbalk of in de verbanden. Elk paneel sluit je met een kruisje; staat
// er niets meer open, dan nodigt het venster uit om een notitie of de verbanden te openen.
// Bedoeld om in een BrowserWindow in een ScreenMockup te zetten: alle maten staan in cqw, dus alles
// schaalt mee met het scherm. De inhoud komt uit src/data/tweede-brein-demo.js (verzonnen voorbeeld).

// Inspringen per niveau in de zijbalk, en de afstand van de rij tot de linkerrand
const INDENT = 1.15;
const PAD = 0.7;
// Waar een rij in een map begint: net rechts van de gidslijn van die map, zodat de markering van een
// open of aangewezen rij nooit over de lijn valt. De gidslijn staat op PAD + (diepte - 1) * INDENT + 0.42
const GUIDE = 0.42;
const rowInset = (depth) => (depth ? PAD + (depth - 1) * INDENT + GUIDE + 0.42 : 0);
// De maten van een rij: ingesprongen tot na de gidslijn, met de tekst op `textAt` vanaf de linkerrand
const rowStyle = (depth, textAt) => {
    const inset = rowInset(depth);
    return { marginLeft: `${inset}cqw`, width: `calc(100% - ${inset}cqw)`, paddingLeft: `${textAt - inset}cqw` };
};

const tekst = {
    nl: {
        folders: 'Mappen',
        graph: 'Verbanden',
        graphLabel: 'Verbanden tussen de notities',
        graphHint: 'Elke bol is een notitie, elke lijn een verwijzing tussen twee notities. Sleep, zoom of klik een bol aan.',
        controls: { zoomIn: 'Inzoomen', zoomOut: 'Uitzoomen', center: 'Centreren' },
        close: 'Sluiten',
        backlinks: 'Notities die hiernaar verwijzen',
        emptyTitle: 'Open een notitie of bekijk de verbanden.',
        emptyText: 'De verbanden tonen in één beeld hoe al uw notities naar elkaar verwijzen.',
        openGraph: 'Bekijk de verbanden',
        pickNote: 'Kies links een notitie',
        role: 'Verkoop'
    },
    en: {
        folders: 'Folders',
        graph: 'Connections',
        graphLabel: 'Connections between the notes',
        graphHint: 'Each dot is a note, each line a reference between two notes. Drag, zoom or click a dot.',
        controls: { zoomIn: 'Zoom in', zoomOut: 'Zoom out', center: 'Center' },
        close: 'Close',
        backlinks: 'Notes that refer to this one',
        emptyTitle: 'Open a note or view the connections.',
        emptyText: 'The connections show in one view how all your notes refer to each other.',
        openGraph: 'View the connections',
        pickNote: 'Pick a note on the left',
        role: 'Sales'
    }
};

export default function SecondBrainDemo() {
    const { language } = useLanguage();
    const tx = tekst[language];
    const [open, setOpen] = useState(() => new Set(['projecten', 'dossiers', 'klanten']));
    const [note, setNote] = useState(null);
    const [graphOpen, setGraphOpen] = useState(true);
    // "Kies links een notitie" wijst naar de zijbalk: zolang je erover hovert, lichten de notities daar
    // zacht op, zodat de bezoeker zelf een notitie kiest. Klikken doet niets, het is een verwijzing
    const [pointing, setPointing] = useState(false);

    const nodes = useMemo(
        () => Object.entries(notities).map(([id, n]) => ({ id, label: n.title[language] })),
        [language]
    );

    // Een notitie openen klapt ook de mappen open waarin ze staat, zodat ze in de zijbalk zichtbaar is
    const openNote = (id) => {
        setNote(id);
        const walk = (items, trail) => items.forEach((item) => {
            if (typeof item === 'string') {
                if (item === id) setOpen((prev) => new Set([...prev, ...trail]));
            } else walk(item.children, [...trail, item.id]);
        });
        walk([...mappen, ...systeemMappen], []);
    };

    const toggle = (id) => setOpen((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
    });

    const renderItems = (items, depth) => items.map((item) => {
        if (typeof item === 'string') {
            return <NoteRow key={item} label={notities[item].title[language]} depth={depth} on={note === item} hint={pointing} onClick={() => openNote(item)} />;
        }
        const isOpen = open.has(item.id);
        return (
            <div key={item.id}>
                <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    className="group flex items-center h-[2.1cqw] rounded-[0.45cqw] pr-[0.6cqw] text-left text-foreground/80 transition-colors duration-300 hover:bg-foreground/[0.04] hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
                    style={rowStyle(depth, PAD + depth * INDENT)}
                >
                    <ChevronRight
                        style={{ width: '0.85cqw', height: '0.85cqw', strokeWidth: 2 }}
                        className={`shrink-0 text-foreground/40 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'rotate-90' : ''}`}
                    />
                    {item.nr && <span className="ml-[0.45cqw] w-[1.5cqw] shrink-0 text-[0.85cqw] text-foreground/35 tabular-nums">{item.nr}</span>}
                    <span className={`${item.nr ? '' : 'ml-[0.45cqw]'} truncate text-[1.02cqw] font-medium`}>{item.name[language]}</span>
                </button>
                {/* Openklappen zoals de veelgestelde vragen: de rasterrij groeit van 0 naar de echte hoogte */}
                <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="relative overflow-hidden">
                        {/* Een dunne gidslijn langs de notities van deze map */}
                        <span
                            aria-hidden="true"
                            className="absolute top-0 bottom-[0.3cqw] w-px bg-foreground/10"
                            style={{ left: `${PAD + depth * INDENT + GUIDE}cqw` }}
                        />
                        {renderItems(item.children, depth + 1)}
                    </div>
                </div>
            </div>
        );
    });

    const crumbs = note ? ['Werkplek Pro', ...mapVan[note].map((n) => n[language])].join(' / ') : '';

    return (
        <div className="absolute inset-0 flex font-sans text-foreground">
            {/* De zijbalk is een tint grijzer dan de notitie, zoals in Obsidian: zo zie je meteen waar de
                mappen ophouden en het bestand begint */}
            <aside className="w-[21cqw] shrink-0 flex flex-col bg-[#f6f7f7] border-r border-foreground/[0.08]">
                <div className="h-[3.1cqw] shrink-0 flex items-center justify-between px-[1.2cqw] border-b border-foreground/[0.06]">
                    <span className="text-[1.08cqw] font-medium text-foreground">Werkplek Pro</span>
                    <div className="flex items-center gap-[0.9cqw] text-foreground/40" aria-hidden="true">
                        <Search style={{ width: '1cqw', height: '1cqw', strokeWidth: 1.75 }} />
                        <FilePlus style={{ width: '1cqw', height: '1cqw', strokeWidth: 1.75 }} />
                    </div>
                </div>

                <nav className="no-scrollbar flex-1 overflow-y-auto px-[0.5cqw] py-[0.8cqw]" aria-label={tx.folders}>
                    {renderItems(mappen, 0)}
                    <span aria-hidden="true" className="block h-px my-[0.7cqw] mx-[0.7cqw] bg-foreground/[0.07]" />
                    {renderItems(systeemMappen, 0)}
                </nav>

                <div className="h-[3.6cqw] shrink-0 flex items-center gap-[0.7cqw] px-[1.2cqw] border-t border-foreground/[0.06]">
                    <span className="w-[1.9cqw] h-[1.9cqw] shrink-0 rounded-full border border-foreground/15 flex items-center justify-center text-[0.75cqw] font-medium text-foreground/60" aria-hidden="true">
                        JP
                    </span>
                    <div className="min-w-0 leading-tight">
                        <p className="text-[0.95cqw] font-medium text-foreground truncate">Jan Peeters</p>
                        <p className="text-[0.8cqw] text-foreground/50 truncate">{tx.role}</p>
                    </div>
                </div>
            </aside>

            <div className="relative flex-1 min-w-0 flex bg-grain">
                {graphOpen && (
                    <Pane title={tx.graph} closeLabel={tx.close} onClose={() => setGraphOpen(false)} className="flex-1 min-w-0">
                        <VaultGraph nodes={nodes} links={verbanden} activeId={note} onSelect={openNote} label={tx.graphLabel} controls={tx.controls} />
                        <p className="pointer-events-none absolute left-[1.4cqw] bottom-[1.2cqw] max-w-[24cqw] text-[0.82cqw] leading-snug text-foreground/45">
                            {tx.graphHint}
                        </p>
                    </Pane>
                )}

                {note && (
                    <Pane
                        key={note}
                        title={crumbs}
                        closeLabel={tx.close}
                        onClose={() => setNote(null)}
                        className={`bg-white ${graphOpen ? 'w-[34cqw] shrink-0 border-l border-foreground/[0.07]' : 'flex-1 min-w-0'}`}
                    >
                        <NoteView id={note} language={language} backlinksLabel={tx.backlinks} onOpen={openNote} />
                    </Pane>
                )}

                {!graphOpen && !note && (
                    <FadeIn className="absolute inset-0 flex flex-col items-center justify-center text-center px-[5cqw]">
                        <p className="text-[1.45cqw] font-medium text-foreground leading-snug">{tx.emptyTitle}</p>
                        <p className="mt-[0.6cqw] max-w-[32cqw] text-[1cqw] text-foreground/55 leading-relaxed">{tx.emptyText}</p>
                        <div className="mt-[1.8cqw] flex items-center gap-[1.6cqw]">
                            <button
                                type="button"
                                onClick={() => setGraphOpen(true)}
                                className="group inline-flex items-center gap-[0.5cqw] rounded-full bg-foreground px-[1.5cqw] py-[0.75cqw] text-[0.98cqw] font-medium text-background transition-colors duration-500 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                                {tx.openGraph}
                                <ArrowRight style={{ width: '1cqw', height: '1cqw', strokeWidth: 1.75 }} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                            </button>
                            <span
                                onPointerEnter={() => setPointing(true)}
                                onPointerLeave={() => setPointing(false)}
                                className="group inline-flex items-center gap-[0.4cqw] cursor-default text-[0.98cqw] font-medium text-foreground/70 transition-colors duration-300 hover:text-accent"
                            >
                                <ArrowLeft style={{ width: '1cqw', height: '1cqw', strokeWidth: 1.75 }} className="transition-transform duration-300 group-hover:-translate-x-1" />
                                {tx.pickNote}
                            </span>
                        </div>
                    </FadeIn>
                )}

                <BrainAssistant onOpenNote={openNote} />
            </div>
        </div>
    );
}

// Komt zacht op wanneer het verschijnt
function FadeIn({ className = '', children }) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setShown(true));
        return () => cancelAnimationFrame(id);
    }, []);
    return (
        <div className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[0.6cqw]'} ${className}`}>
            {children}
        </div>
    );
}

// Een paneel met een kopregel (titel en kruisje). De kopregel is even hoog als die van de zijbalk,
// zodat de lijnen eronder over het hele scherm op één hoogte liggen
function Pane({ title, closeLabel, onClose, className = '', children }) {
    return (
        <FadeIn className={`relative flex flex-col ${className}`}>
            <div className="h-[3.1cqw] shrink-0 flex items-center justify-between gap-[1cqw] pl-[1.4cqw] pr-[0.7cqw] border-b border-foreground/[0.06]">
                <span className="truncate text-[0.9cqw] text-foreground/55">{title}</span>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={closeLabel}
                    className="w-[1.8cqw] h-[1.8cqw] shrink-0 rounded-full flex items-center justify-center text-foreground/45 transition-colors duration-300 hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
                >
                    <X style={{ width: '1cqw', height: '1cqw', strokeWidth: 1.75 }} />
                </button>
            </div>
            <div className="relative flex-1 min-h-0">{children}</div>
        </FadeIn>
    );
}

// De notitie zelf: titel, de metadata als rustige lijst, de tekst met klikbare verwijzingen, en onderaan
// de notities die naar deze notitie verwijzen
function NoteView({ id, language, backlinksLabel, onOpen }) {
    const n = notities[id];
    const backlinks = verbanden
        .filter(([a, b]) => b === id || a === id)
        .map(([a, b]) => (a === id ? b : a))
        .filter((other) => notities[other].body.some((p) => p.nl.includes(`[[${id}]]`)));

    const renderText = (text) => text.split(/(\[\[[a-z0-9-]+\]\])/g).map((part, i) => {
        const m = part.match(/^\[\[([a-z0-9-]+)\]\]$/);
        if (!m) return <React.Fragment key={i}>{part}</React.Fragment>;
        return (
            <button
                key={i}
                type="button"
                onClick={() => onOpen(m[1])}
                className="text-accent underline decoration-accent/30 underline-offset-[0.2em] transition-colors duration-300 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-accent"
            >
                {notities[m[1]].title[language]}
            </button>
        );
    });

    // Een leeskolom met een vaste maximale breedte, in het midden: naast de graph vult ze het smalle
    // paneel, alleen staat ze gecentreerd met rustige marges, zoals een tekst in Obsidian
    return (
        <div className="no-scrollbar absolute inset-0 overflow-y-auto px-[2.2cqw] pt-[2cqw] pb-[5.5cqw]">
            <div className="mx-auto max-w-[44cqw]">
                <h3 className="text-[1.9cqw] font-medium leading-tight text-foreground">{n.title[language]}</h3>
                <dl className="mt-[1.2cqw] py-[0.8cqw] border-y border-foreground/[0.07] grid grid-cols-[auto_1fr] gap-x-[1.6cqw] gap-y-[0.35cqw] text-[0.88cqw]">
                    {n.meta.map(([k, v]) => (
                        <React.Fragment key={k.en}>
                            <dt className="text-foreground/45">{k[language]}</dt>
                            <dd className="text-foreground/75">{typeof v === 'string' ? v : v[language]}</dd>
                        </React.Fragment>
                    ))}
                </dl>
                <div className="mt-[1.4cqw] space-y-[0.9cqw] text-[1.05cqw] leading-relaxed text-foreground/70">
                    {n.body.map((p, i) => <p key={i}>{renderText(p[language])}</p>)}
                </div>
                {backlinks.length > 0 && (
                    <div className="mt-[2cqw]">
                        <p className="text-[0.85cqw] text-foreground/45">{backlinksLabel}</p>
                        <ul className="mt-[0.5cqw] space-y-[0.25cqw]">
                            {backlinks.map((b) => (
                                <li key={b}>
                                    <button
                                        type="button"
                                        onClick={() => onOpen(b)}
                                        className="text-[0.95cqw] text-foreground/70 transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                                    >
                                        {notities[b].title[language]}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

// Een notitie in de zijbalk. Met `hint` licht ze zacht op, wanneer het lege venster naar de zijbalk wijst
function NoteRow({ label, depth, on, hint, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-current={on ? 'true' : undefined}
            className={`flex items-center h-[2.1cqw] rounded-[0.45cqw] pr-[0.6cqw] text-left text-[1.02cqw] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-accent ${on ? 'bg-accent/10 text-accent' : hint ? 'bg-accent/[0.06] text-accent' : 'text-foreground/55 hover:bg-foreground/[0.04] hover:text-foreground'}`}
            style={rowStyle(depth, PAD + depth * INDENT + 0.2)}
        >
            <span className="truncate">{label}</span>
        </button>
    );
}
