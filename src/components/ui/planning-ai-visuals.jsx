import React from 'react';
import { ArrowRight, Check, Sparkles, Truck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage, ToolWindow } from './tool-visual-parts';

// De visual bij de AI-actie Leert van uw planner. Het planningsvoorstel zelf staat in planning-visual.jsx, de
// automatiseringen in planning-auto-visuals.jsx. Alle gegevens zijn verzonnen. De gedeelde onderdelen staan in
// tool-visual-parts.jsx.

const WINDOWS = {
    wide: { W: 720, H: 540, win: { x: 26, y: 26, w: 668, h: 450 }, pad: 16, heading: 22, sub: 14 },
    narrow: { W: 400, H: 400, win: { x: 12, y: 12, w: 376, h: 368 }, pad: 14, heading: 20, sub: 13 }
};

// ---------- Leert van uw planner: de voorgestelde transporten, de aanpassing, en wat de AI onthoudt ----------

const LEARN_LAYOUTS = {
    wide: {
        ...WINDOWS.wide,
        x: 42, w: 636, rows: 4, firstRow: 88, rowH: 46, rowGap: 6, buttonW: 78, wideRow: true,
        // Het puntje van het paneel wijst naar de knop van het gekozen transport
        panel: { left: 250, right: 8, top: 298, caret: 379, pad: 14 },
        fonts: { truck: 12.5, route: 11.5, load: 14, button: 10.5, title: 14.5, text: 12 }
    },
    narrow: {
        ...WINDOWS.narrow,
        // Op gsm: twee transporten in plaats van vier, en het paneel zonder het opschrift bij de opmerking
        x: 26, w: 348, rows: 2, firstRow: 66, rowH: 48, rowGap: 6, buttonW: 70, wideRow: false, compact: true,
        panel: { left: 20, right: 4, top: 180, caret: 311, pad: 13 },
        fonts: { truck: 13, route: 11.5, load: 14, button: 11, title: 14.5, text: 12.5 }
    }
};

const LEARN_TEXT = {
    nl: {
        label: 'De AI stelt vier transporten voor, elk met een knop om aan te passen. De planner past vrachtwagen 12 aan van 24 naar 18 ton, met de opmerking dat deze vrachtwagen maar 18 ton kan laden. De AI antwoordt dat ze dat onthouden heeft voor de volgende keer.',
        heading: 'Planning',
        sub: 'Voorstel van de AI',
        truck: 'Vrachtwagen',
        day: 'ma',
        adjust: 'Aanpassen',
        load: 'Lading',
        note: 'Jouw opmerking',
        feedback: 'Deze vrachtwagen kan maar 18 ton laden.',
        assistant: 'AI-assistent',
        title: 'Oké, dit heb ik onthouden voor de volgende keer.',
        rule: 'Vrachtwagen 12: maximaal 18 ton'
    },
    en: {
        label: 'The AI suggests four trips, each with a button to adjust it. The planner changes truck 12 from 24 to 18 tonnes, noting that this truck can only carry 18 tonnes. The AI replies that it will remember this for next time.',
        heading: 'Schedule',
        sub: 'AI suggestion',
        truck: 'Truck',
        day: 'Mon',
        adjust: 'Adjust',
        load: 'Load',
        note: 'Your note',
        feedback: 'This truck can only carry 18 tonnes.',
        assistant: 'AI assistant',
        title: 'Got it, I will remember this for next time.',
        rule: 'Truck 12: 18 tonnes maximum'
    }
};

// Steden die in het Engels een eigen naam hebben
const CITY_EN = { Luik: 'Liège', Antwerpen: 'Antwerp', Gent: 'Ghent' };

// Het gekozen transport staat onderaan, zodat het paneel de andere niet bedekt
const TRANSPORTS = [
    { nr: 4, from: 'Genk', to: 'Antwerpen', time: '07:00', load: 20 },
    { nr: 7, from: 'Lommel', to: 'Gent', time: '06:00', load: 22 },
    { nr: 9, from: 'Hasselt', to: 'Leuven', time: '08:00', load: 16 },
    { nr: 12, from: 'Hasselt', to: 'Luik', time: '06:30', load: 24, selected: true }
];

function TransportRow({ transport, top, layout, t }) {
    const { x, w, rowH, buttonW, wideRow, fonts } = layout;
    const { nr, from, to, time, load, selected } = transport;
    const route = (
        <span className="flex items-center whitespace-nowrap text-foreground/60 leading-tight" style={{ gap: u(3), fontSize: u(fonts.route) }}>
            {(t.en && CITY_EN[from]) || from}<ArrowRight strokeWidth={1.75} className="shrink-0" style={{ width: u(10), height: u(10) }} />{(t.en && CITY_EN[to]) || to}
        </span>
    );
    return (
        <div
            className={`absolute flex items-center rounded-lg bg-white border ${selected ? 'border-accent' : 'border-foreground/[0.08]'}`}
            style={{ left: u(x), top: u(top), width: u(w), height: u(rowH), paddingLeft: u(8), paddingRight: u(8), gap: u(wideRow ? 10 : 8) }}
        >
            <span className="flex items-center justify-center shrink-0 rounded-full border border-foreground/15 text-foreground/70" style={{ width: u(28), height: u(28) }}>
                <Truck strokeWidth={1.5} style={{ width: u(14), height: u(14) }} />
            </span>
            {wideRow ? (
                <>
                    <span className="shrink-0 font-medium text-foreground whitespace-nowrap" style={{ width: u(112), fontSize: u(fonts.truck) }}>{t.truck} {nr}</span>
                    <span className="flex-1 min-w-0">{route}</span>
                    <span className="shrink-0 whitespace-nowrap text-foreground/60" style={{ width: u(66), fontSize: u(fonts.route) }}>{t.day} {time}</span>
                </>
            ) : (
                <span className="flex-1 min-w-0">
                    <span className="block font-medium text-foreground whitespace-nowrap leading-tight" style={{ fontSize: u(fonts.truck), marginBottom: u(2) }}>{t.truck} {nr}</span>
                    {route}
                </span>
            )}
            <span className="shrink-0 text-right font-medium text-foreground whitespace-nowrap tracking-tight" style={{ width: u(36), fontSize: u(fonts.load) }}>{load} t</span>
            <span
                className={`flex items-center justify-center shrink-0 rounded-md border whitespace-nowrap ${selected ? 'bg-foreground border-foreground text-white' : 'border-foreground/15 text-foreground'}`}
                style={{ width: u(buttonW), height: u(26), fontSize: u(fonts.button) }}
            >
                {t.adjust}
            </span>
        </div>
    );
}

// Wat opent onder de knop: de planner past de lading aan en licht toe, en de AI onthoudt het
function AdjustPanel({ layout, t }) {
    const { panel, fonts } = layout;
    return (
        <div
            className="absolute bg-white border border-foreground/[0.07]"
            style={{ left: u(panel.left), right: u(panel.right), top: u(panel.top), padding: u(panel.pad), borderRadius: u(16), boxShadow: `0 ${u(20)} ${u(46)} ${u(-20)} rgba(15,23,42,0.22)` }}
        >
            <span
                aria-hidden="true"
                className="absolute bg-white border-l border-t border-foreground/[0.07] rotate-45"
                style={{ left: u(panel.caret - 5), top: u(-5.5), width: u(10), height: u(10) }}
            />

            <div className="flex items-center" style={{ gap: u(8), fontSize: u(fonts.text) }}>
                <span className="text-foreground/70" style={{ marginRight: u(6) }}>{t.load}</span>
                <span className="text-foreground/50 line-through">24 t</span>
                <ArrowRight strokeWidth={1.75} className="shrink-0 text-foreground/50" style={{ width: u(12), height: u(12) }} />
                <span className="flex items-center rounded-md border border-accent font-medium text-foreground" style={{ height: u(26), paddingLeft: u(10), paddingRight: u(10) }}>18 t</span>
            </div>

            {!layout.compact && <p className="text-foreground/70" style={{ marginTop: u(9), marginBottom: u(4), fontSize: u(fonts.text - 1) }}>{t.note}</p>}
            <div className="flex items-center rounded-md border border-foreground/15 text-foreground whitespace-nowrap" style={{ marginTop: layout.compact ? u(9) : 0, height: u(32), paddingLeft: u(10), fontSize: u(fonts.text + 0.5) }}>
                {t.feedback}
            </div>

            <div className="border-t border-foreground/[0.08]" style={{ marginTop: u(12), paddingTop: u(10) }}>
                <div className="flex items-center font-medium text-accent" style={{ gap: u(5), fontSize: u(11) }}>
                    <Sparkles strokeWidth={1.5} style={{ width: u(12), height: u(12) }} />{t.assistant}
                </div>
                <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(4), fontSize: u(fonts.title), lineHeight: 1.25 }}>{t.title}</p>
                <div className="flex items-center text-foreground/70" style={{ marginTop: u(5), gap: u(7), fontSize: u(fonts.text) }}>
                    <span className="flex items-center justify-center shrink-0 rounded-full bg-accent text-white" style={{ width: u(13), height: u(13) }}>
                        <Check strokeWidth={3} style={{ width: u(8), height: u(8) }} />
                    </span>
                    {t.rule}
                </div>
            </div>
        </div>
    );
}

function LearnStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, rows, firstRow, rowH, rowGap } = layout;
    return (
        <ToolStage W={W} H={H}>
            <ToolWindow win={win} pad={pad} heading={t.heading} sub={t.sub} headingSize={heading} subSize={sub} />
            {TRANSPORTS.slice(-rows).map((transport, i) => (
                <TransportRow key={transport.nr} transport={transport} top={firstRow + i * (rowH + rowGap)} layout={layout} t={t} />
            ))}
            <AdjustPanel layout={layout} t={t} />
        </ToolStage>
    );
}

export function PlanningLearnVisual() {
    const { language } = useLanguage();
    const t = { ...LEARN_TEXT[language], en: language === 'en' };
    return <ToolVisual label={t.label} narrow={<LearnStage layout={LEARN_LAYOUTS.narrow} t={t} />} wide={<LearnStage layout={LEARN_LAYOUTS.wide} t={t} />} />;
}

