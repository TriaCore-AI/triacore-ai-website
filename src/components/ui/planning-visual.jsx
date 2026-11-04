import React from 'react';
import { ArrowRight, Check, Plus, Sparkles, Upload } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage, ToolWindow, HeaderButton, AssistantCard, AssistantTitle, AssistantActions } from './tool-visual-parts';

// De visual bij de AI-actie Planningsvoorstel: een venster met de weekplanning, en daarin de AI-assistent als
// dropdown die uit zijn knop opent en rechts buiten het venster uitsteekt. Echte tekst in plaats van een
// afbeelding, dus altijd scherp en tweetalig. Alle gegevens zijn verzonnen. Op gsm komt een eenvoudiger
// indeling (minder dagen, enkel de bestemming), omdat de volledige planning daar onleesbaar wordt. De gedeelde
// onderdelen staan in tool-visual-parts.jsx.

const LAYOUTS = {
    wide: {
        W: 720, H: 540, days: 5, rows: 4,
        win: { x: 26, y: 26, w: 668, h: 450 },
        pad: 16, nameW: 72, gap: 6, rowH: 84, cardH: 68, gridY: 88,
        // De kaart opent net onder de knop; caret is het midden van de knop, gemeten vanaf de linkerrand van de kaart
        bubble: { left: 394, right: 8, top: 84, caret: 50, title: 20, text: 11, pad: 14 },
        fonts: { route: 10.5, meta: 10, name: 11, day: 11, heading: 22, week: 14 }
    },
    narrow: {
        // Op gsm: twee dagen en twee chauffeurs, met de kaart eronder in plaats van erover
        W: 400, H: 400, days: 2, rows: 2,
        win: { x: 12, y: 12, w: 376, h: 368 },
        pad: 14, nameW: 34, gap: 6, rowH: 56, cardH: 48, gridY: 76,
        bubble: { left: 20, right: 4, top: 206, caret: 60, title: 18, text: 12.5, pad: 14 },
        fonts: { route: 12.5, meta: 11.5, name: 11, day: 12.5, heading: 20, week: 13 }
    }
};

const TEXT = {
    nl: {
        label: 'Weekplanning van de chauffeurs van maandag tot vrijdag, met een assistent die de optimale planning voorstelt op basis van beschikbaarheid, belading, routes, rijtijden en openingsuren. De planner kiest: overnemen of handmatig aanpassen.',
        days: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'],
        add: 'Rit toevoegen',
        export: 'Exporteren',
        off: 'Vrij',
        assistant: 'AI-assistent',
        title: 'Dit is de optimale planning voor deze week.',
        basis: 'Ik heb deze planning ingesteld op basis van:',
        basisShort: 'Op basis van beschikbaarheid, belading en routes.',
        reasons: ['Beschikbaarheid van de chauffeurs', 'Optimale belading van de vrachtwagens', 'Optimale routes', 'Rijtijden en openingsuren'],
        accept: 'Neem over',
        adjust: 'Pas handmatig aan'
    },
    en: {
        label: 'Weekly schedule for the drivers from Monday to Friday, with an assistant proposing the optimal planning based on availability, load, routes, driving times and opening hours. The planner chooses: accept it or adjust it manually.',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        add: 'Add trip',
        export: 'Export',
        off: 'Off',
        assistant: 'AI assistant',
        title: 'This is the optimal planning for this week.',
        basis: 'I set up this planning based on:',
        basisShort: 'Based on availability, load and routes.',
        reasons: ['Driver availability', 'Optimal truck loading', 'Optimal routes', 'Driving times and opening hours'],
        accept: 'Accept',
        adjust: 'Adjust manually'
    }
};

// Per rit: vertrek, bestemming, uur en lading. null is een vrije dag.
const DRIVERS = [
    { name: 'Tom V.', trips: [['Hasselt', 'Genk', '07:00', 18], ['Hasselt', 'Luik', '06:30', 22], ['Genk', 'Antwerpen', '07:00', 20], null, ['Hasselt', 'Leuven', '08:00', 16]] },
    { name: 'Sofie D.', trips: [['Hasselt', 'Gent', '06:00', 24], ['Hasselt', 'Gent', '07:00', 23], ['Hasselt', 'Aalst', '08:00', 12], ['Lommel', 'Luik', '07:00', 19], ['Hasselt', 'Genk', '07:30', 18]] },
    { name: 'Karim B.', trips: [['Beringen', 'Aalst', '06:30', 21], ['Genk', 'Luik', '06:30', 21], null, ['Hasselt', 'Luik', '06:30', 22], ['Genk', 'Gent', '06:00', 20]] },
    { name: 'Wim P.', trips: [null, ['Genk', 'Leuven', '08:00', 15], ['Hasselt', 'Luik', '07:00', 19], ['Hasselt', 'Aalst', '06:30', 24], null] },
    { name: 'Els M.', trips: [['Hasselt', 'Leuven', '08:30', 12], ['Lommel', 'Gent', '06:00', 22], ['Hasselt', 'Luik', '07:00', 21], ['Genk', 'Antwerpen', '07:00', 20], ['Hasselt', 'Gent', '07:30', 17]] },
    { name: 'Jan R.', trips: [['Lommel', 'Genk', '07:30', 14], ['Hasselt', 'Aalst', '06:30', 20], null, ['Beringen', 'Luik', '07:00', 18], ['Hasselt', 'Genk', '08:00', 15]] }
];

const initials = (name) => name.replace('.', '').split(' ').map((part) => part[0]).join('');

function Trip({ trip, fonts, off }) {
    if (!trip) {
        return (
            <div className="h-full flex items-center rounded-md bg-foreground/[0.035] text-foreground/35" style={{ paddingLeft: u(9), fontSize: u(fonts.meta) }}>
                {off}
            </div>
        );
    }
    const [from, to, time, load] = trip;
    return (
        <div className="relative h-full flex flex-col justify-center overflow-hidden rounded-md bg-white border border-foreground/[0.08]" style={{ paddingLeft: u(9) }}>
            <span aria-hidden="true" className="absolute left-0 inset-y-0 bg-accent" style={{ width: u(2) }} />
            <span className="flex items-center whitespace-nowrap text-foreground leading-tight" style={{ fontSize: u(fonts.route), gap: u(3) }}>
                {from}<ArrowRight strokeWidth={1.75} style={{ width: u(9), height: u(9) }} />{to}
            </span>
            <span className="whitespace-nowrap text-foreground/50 leading-tight" style={{ marginTop: u(2), fontSize: u(fonts.meta) }}>
                {time}, {load} t
            </span>
        </div>
    );
}

// Eén indeling op haar eigen canvas. De kaart hangt als dropdown aan de knop AI-assistent.
function Stage({ layout, t }) {
    const { W, H, win, pad, nameW, gap, rowH, cardH, gridY, fonts, bubble } = layout;
    const compact = layout === LAYOUTS.narrow;

    return (
        <ToolStage W={W} H={H}>
            <ToolWindow
                win={win}
                pad={pad}
                heading="Planning"
                sub="Week 46"
                headingSize={fonts.heading}
                subSize={fonts.week}
                buttons={
                    <>
                        <HeaderButton icon={Sparkles} width={100} accent dropdown>{t.assistant}</HeaderButton>
                        {/* Op gsm is er enkel plaats voor de AI-knop */}
                        {!compact && <HeaderButton icon={Plus} width={92}>{t.add}</HeaderButton>}
                        {!compact && <HeaderButton icon={Upload} width={80}>{t.export}</HeaderButton>}
                    </>
                }
            >
                <div className="absolute" style={{ left: u(pad), right: u(pad), top: u(gridY - 22) }}>
                    {/* De dagen */}
                    <div className="grid" style={{ marginLeft: u(nameW), gridTemplateColumns: `repeat(${layout.days}, 1fr)`, columnGap: u(gap), height: u(22) }}>
                        {t.days.slice(0, layout.days).map((day) => (
                            <span key={day} className="font-medium text-foreground" style={{ fontSize: u(fonts.day), paddingLeft: u(2) }}>{day}</span>
                        ))}
                    </div>

                    {/* De chauffeurs met hun ritten */}
                    {DRIVERS.slice(0, layout.rows).map((driver) => (
                        <div key={driver.name} className="flex items-center border-t border-foreground/[0.08]" style={{ height: u(rowH) }}>
                            <div className="flex items-center shrink-0" style={{ width: u(nameW), gap: u(6) }}>
                                <span className="flex items-center justify-center shrink-0 rounded-full border border-foreground/20 text-foreground/70" style={{ width: u(22), height: u(22), fontSize: u(8.5) }}>
                                    {initials(driver.name)}
                                </span>
                                {!compact && <span className="whitespace-nowrap text-foreground" style={{ fontSize: u(fonts.name) }}>{driver.name.split(' ')[0]}</span>}
                            </div>
                            <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${layout.days}, 1fr)`, columnGap: u(gap), height: u(cardH) }}>
                                {driver.trips.slice(0, layout.days).map((trip, c) => (
                                    <Trip
                                        key={c}
                                        trip={trip}
                                        fonts={fonts}
                                        off={t.off}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ToolWindow>

            {/* De assistent: een dropdown onder zijn knop */}
            <AssistantCard bubble={bubble} label={t.assistant}>
                <AssistantTitle bubble={bubble}>{t.title}</AssistantTitle>
                {/* Op gsm één zin in plaats van de lijst met redenen */}
                {compact ? (
                    <p className="text-foreground/70" style={{ marginTop: u(6), fontSize: u(bubble.text), lineHeight: 1.3 }}>{t.basisShort}</p>
                ) : (
                    <>
                        <p className="text-foreground/70" style={{ marginTop: u(7), fontSize: u(bubble.text) }}>{t.basis}</p>
                        <div style={{ marginTop: u(5) }}>
                            {t.reasons.map((reason) => (
                                <div key={reason} className="flex items-center text-foreground/70" style={{ gap: u(7), marginTop: u(3), fontSize: u(bubble.text) }}>
                                    <span className="flex items-center justify-center shrink-0 rounded-full bg-accent text-white" style={{ width: u(13), height: u(13) }}>
                                        <Check strokeWidth={3} style={{ width: u(8), height: u(8) }} />
                                    </span>
                                    {reason}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <AssistantActions bubble={bubble} primary={t.accept} secondary={t.adjust} />
            </AssistantCard>
        </ToolStage>
    );
}

export default function PlanningVisual() {
    const { language } = useLanguage();
    const t = TEXT[language];
    return <ToolVisual label={t.label} narrow={<Stage layout={LAYOUTS.narrow} t={t} />} wide={<Stage layout={LAYOUTS.wide} t={t} />} />;
}
