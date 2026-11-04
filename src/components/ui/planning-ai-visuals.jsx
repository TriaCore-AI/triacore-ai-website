import React from 'react';
import { ArrowRight, Check, Sparkles, Truck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage, ToolWindow, ChatWindow, ChatFromAi, ChatFromPerson } from './tool-visual-parts';

// Twee visuals bij de AI-acties van de tool Planning. Het planningsvoorstel zelf staat in planning-visual.jsx.
// Alle gegevens zijn verzonnen. De gedeelde onderdelen staan in tool-visual-parts.jsx.

const WINDOWS = {
    wide: { W: 720, H: 540, win: { x: 26, y: 26, w: 668, h: 450 }, pad: 16, heading: 22, sub: 14 },
    narrow: { W: 400, H: 500, win: { x: 14, y: 14, w: 372, h: 450 }, pad: 12, heading: 21, sub: 13 }
};

// ---------- Leert van uw planner: de voorgestelde transporten, de aanpassing, en wat de AI onthoudt ----------

const LEARN_LAYOUTS = {
    wide: {
        ...WINDOWS.wide,
        x: 42, w: 636, firstRow: 88, rowH: 46, rowGap: 6, buttonW: 78, wideRow: true,
        // Het puntje van het paneel wijst naar de knop van het gekozen transport
        panel: { left: 250, right: 8, top: 298, caret: 379, pad: 14 },
        fonts: { truck: 12.5, route: 11.5, load: 14, button: 10.5, title: 14.5, text: 12 }
    },
    narrow: {
        ...WINDOWS.narrow,
        x: 26, w: 348, firstRow: 72, rowH: 46, rowGap: 5, buttonW: 62, wideRow: false,
        panel: { left: 26, right: 6, top: 279, caret: 307, pad: 13 },
        fonts: { truck: 11.5, route: 10, load: 13, button: 9.5, title: 14, text: 12 }
    }
};

const LEARN_TEXT = {
    nl: {
        label: 'De AI stelt vier transporten voor, elk met een knop om aan te passen. De planner past vrachtwagen 12 aan van 24 naar 18 ton, met de opmerking dat deze vrachtwagen maar 18 ton kan laden. De AI antwoordt dat ze dat onthouden heeft voor de volgende keer.',
        sub: 'Voorstel van de AI',
        truck: 'Vrachtwagen',
        day: 'ma',
        adjust: 'Aanpassen',
        load: 'Lading',
        note: 'Uw opmerking',
        feedback: 'Deze vrachtwagen kan maar 18 ton laden.',
        assistant: 'AI-assistent',
        title: 'Oké, dit heb ik onthouden voor de volgende keer.',
        rule: 'Vrachtwagen 12: maximaal 18 ton'
    },
    en: {
        label: 'The AI proposes four transports, each with a button to adjust it. The planner changes truck 12 from 24 to 18 tonnes, noting that this truck can only carry 18 tonnes. The AI replies that it has remembered this for next time.',
        sub: 'Proposal from the AI',
        truck: 'Truck',
        day: 'Mon',
        adjust: 'Adjust',
        load: 'Load',
        note: 'Your note',
        feedback: 'This truck can only carry 18 tonnes.',
        assistant: 'AI assistant',
        title: 'OK, I have remembered this for next time.',
        rule: 'Truck 12: 18 tonnes maximum'
    }
};

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
            {from}<ArrowRight strokeWidth={1.75} className="shrink-0" style={{ width: u(10), height: u(10) }} />{to}
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

            <p className="text-foreground/70" style={{ marginTop: u(9), marginBottom: u(4), fontSize: u(fonts.text - 1) }}>{t.note}</p>
            <div className="flex items-center rounded-md border border-foreground/15 text-foreground whitespace-nowrap" style={{ height: u(32), paddingLeft: u(10), fontSize: u(fonts.text + 0.5) }}>
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
    const { W, H, win, pad, heading, sub, firstRow, rowH, rowGap } = layout;
    return (
        <ToolStage W={W} H={H}>
            <ToolWindow win={win} pad={pad} heading="Planning" sub={t.sub} headingSize={heading} subSize={sub} />
            {TRANSPORTS.map((transport, i) => (
                <TransportRow key={transport.nr} transport={transport} top={firstRow + i * (rowH + rowGap)} layout={layout} t={t} />
            ))}
            <AdjustPanel layout={layout} t={t} />
        </ToolStage>
    );
}

export function PlanningLearnVisual() {
    const { language } = useLanguage();
    const t = LEARN_TEXT[language];
    return <ToolVisual label={t.label} narrow={<LearnStage layout={LEARN_LAYOUTS.narrow} t={t} />} wide={<LearnStage layout={LEARN_LAYOUTS.wide} t={t} />} />;
}

// ---------- Stel vragen aan uw planning: de vraag van de planner, het antwoord en een suggestie van de AI ----------

const ASK_LAYOUTS = {
    wide: { ...WINDOWS.wide, bubble: 480, title: 15, text: 12.5, nameW: 52, rowH: 34 },
    narrow: { ...WINDOWS.narrow, bubble: 314, title: 14.5, text: 12, nameW: 46, rowH: 32 }
};

const ASK_TEXT = {
    nl: {
        label: 'Een chat. De planner vraagt wie morgen nog ruimte heeft. De AI antwoordt meteen met een overzicht: Wim P. heeft nog 9 ton vrij, Tom V. 6 ton en Els M. 4 ton. Daarna stelt de AI voor om te helpen met optimaal beladen.',
        assistant: 'AI-assistent',
        placeholder: 'Stel een vraag aan uw planning',
        planner: 'Uw planner',
        question: 'Wie heeft morgen nog ruimte?',
        answer: 'Morgen hebben drie chauffeurs nog ruimte.',
        free: 'vrij',
        suggestion: 'Zal ik u helpen om optimaal te beladen?',
        yes: 'Ja, graag'
    },
    en: {
        label: 'A chat. The planner asks who still has room tomorrow. The AI answers right away with an overview: Wim P. has 9 tonnes free, Tom V. 6 tonnes and Els M. 4 tonnes. The AI then offers to help with optimal loading.',
        assistant: 'AI assistant',
        placeholder: 'Ask your planning a question',
        planner: 'Your planner',
        question: 'Who still has room tomorrow?',
        answer: 'Three drivers still have room tomorrow.',
        free: 'free',
        suggestion: 'Shall I help you load optimally?',
        yes: 'Yes, please'
    }
};

// Per chauffeur: geladen en vrij, op een vrachtwagen van 24 ton
const ROOM = [
    { name: 'Wim P.', initials: 'WP', used: 15, free: 9 },
    { name: 'Tom V.', initials: 'TV', used: 18, free: 6 },
    { name: 'Els M.', initials: 'EM', used: 20, free: 4 }
];

function AskStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, bubble, title, text, nameW, rowH } = layout;
    return (
        <ToolStage W={W} H={H}>
            <ChatWindow win={win} pad={pad} heading="Planning" sub={t.assistant} headingSize={heading} subSize={sub} placeholder={t.placeholder}>
                <ChatFromPerson label={t.planner}>{t.question}</ChatFromPerson>

                <ChatFromAi label={t.assistant} width={bubble}>
                    <p className="font-medium text-foreground tracking-tight" style={{ fontSize: u(title), lineHeight: 1.25 }}>{t.answer}</p>
                    <div style={{ marginTop: u(8) }}>
                        {ROOM.map((driver) => (
                            <div key={driver.name} className="flex items-center border-t border-foreground/[0.08]" style={{ height: u(rowH), gap: u(8) }}>
                                <span className="flex items-center justify-center shrink-0 rounded-full border border-foreground/20 text-foreground/70" style={{ width: u(22), height: u(22), fontSize: u(8.5) }}>
                                    {driver.initials}
                                </span>
                                <span className="shrink-0 whitespace-nowrap text-foreground" style={{ width: u(nameW), fontSize: u(text) }}>{driver.name}</span>
                                {/* De balk toont de lading, het groene deel is de ruimte die nog vrij is */}
                                <span className="flex flex-1 min-w-0" style={{ height: u(6), gap: u(2) }}>
                                    <span className="rounded-full bg-foreground/15" style={{ flexGrow: driver.used, flexBasis: 0 }} />
                                    <span className="rounded-full bg-accent" style={{ flexGrow: driver.free, flexBasis: 0 }} />
                                </span>
                                <span className="shrink-0 whitespace-nowrap text-right font-medium text-foreground" style={{ width: u(50), fontSize: u(text) }}>{driver.free} t {t.free}</span>
                            </div>
                        ))}
                    </div>

                    {/* De suggestie van de AI, met de knop om erop in te gaan */}
                    <div className="flex flex-wrap items-center justify-between border-t border-foreground/[0.08]" style={{ paddingTop: u(9), gap: u(6) }}>
                        <span className="text-foreground" style={{ fontSize: u(text + 0.5) }}>{t.suggestion}</span>
                        <span className="rounded-md bg-foreground text-white font-medium whitespace-nowrap" style={{ padding: `${u(5)} ${u(11)}`, fontSize: u(10.5) }}>{t.yes}</span>
                    </div>
                </ChatFromAi>
            </ChatWindow>
        </ToolStage>
    );
}

export function PlanningAskVisual() {
    const { language } = useLanguage();
    const t = ASK_TEXT[language];
    return <ToolVisual label={t.label} narrow={<AskStage layout={ASK_LAYOUTS.narrow} t={t} />} wide={<AskStage layout={ASK_LAYOUTS.wide} t={t} />} />;
}
