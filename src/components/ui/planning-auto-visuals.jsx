import React from 'react';
import { AlertTriangle, ArrowLeftRight, ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage, ToolWindow, PhoneFrame } from './tool-visual-parts';

// Twee visuals bij de automatiseringen van de tool Planning, elk met één boodschap. Hier staat bewust geen
// AI-assistent in: dit is gewone automatisering. Alle gegevens zijn verzonnen. De gedeelde onderdelen staan in
// tool-visual-parts.jsx.

function SmallCheck() {
    return (
        <span className="flex items-center justify-center shrink-0 rounded-full bg-accent text-white" style={{ width: u(14), height: u(14) }}>
            <Check strokeWidth={3} style={{ width: u(9), height: u(9) }} />
        </span>
    );
}

function Route({ from, to, size }) {
    return (
        <span className="flex items-center whitespace-nowrap" style={{ gap: u(3), fontSize: u(size) }}>
            {from}<ArrowRight strokeWidth={1.75} className="shrink-0" style={{ width: u(size - 1), height: u(size - 1) }} />{to}
        </span>
    );
}

// ---------- Ritten meteen bij de chauffeur: de rit op de gsm, en wat de chauffeur registreert, staat op kantoor ----------

const DRIVER_LAYOUTS = {
    wide: {
        W: 720, H: 540,
        // Links de planning op kantoor, rechts de gsm
        office: { x: 44, y: 150, w: 290 },
        arrow: { x: 346, y: 256 },
        phone: { x: 406, y: 22, w: 252, h: 496 },
        note: false
    },
    narrow: {
        W: 400, H: 500,
        office: null,
        arrow: null,
        phone: { x: 72, y: 10, w: 256, h: 480 },
        note: true
    }
};

const DRIVER_TEXT = {
    nl: {
        label: 'Op de gsm van de chauffeur staat de rit van Hasselt naar Luik, met geladen en gelost afgevinkt. Wat de chauffeur registreert, staat meteen op de juiste plaats in de planning op kantoor, zonder papier of telefoontje.',
        screen: 'Mijn ritten',
        today: 'Vandaag',
        loaded: 'Geladen',
        unloaded: 'Gelost',
        signed: 'Bon getekend',
        next: 'Volgende rit',
        finish: 'Rit afronden',
        office: 'Planning op kantoor',
        driver: 'Tom V.',
        recorded: 'Meteen geregistreerd',
        none: 'Zonder papier of telefoontje',
        note: 'Staat meteen in de planning op kantoor.'
    },
    en: {
        label: 'The driver\'s phone shows the trip from Hasselt to Liège, with loaded and unloaded ticked off. What the driver registers appears right away in the right place in the planning at the office, without paper or a phone call.',
        screen: 'My trips',
        today: 'Today',
        loaded: 'Loaded',
        unloaded: 'Unloaded',
        signed: 'Slip signed',
        next: 'Next trip',
        finish: 'Finish trip',
        office: 'Planning at the office',
        driver: 'Tom V.',
        recorded: 'Registered right away',
        none: 'Without paper or a phone call',
        note: 'Appears right away in the planning at the office.'
    }
};

function DriverStage({ layout, t, language }) {
    const { W, H, office, arrow, phone, note } = layout;
    const destination = language === 'nl' ? 'Luik' : 'Liège';
    const steps = [[t.loaded, '06:52'], [t.unloaded, '08:41']];
    return (
        <ToolStage W={W} H={H}>
            {/* De planning op kantoor. Op gsm is er geen plaats naast de gsm: daar staat dit als zin op het scherm */}
            {office && (
                <div className="absolute bg-white border border-foreground/[0.07]" style={{ left: u(office.x), top: u(office.y), width: u(office.w), padding: u(16), borderRadius: u(16), boxShadow: `0 ${u(18)} ${u(44)} ${u(-22)} rgba(15,23,42,0.2)` }}>
                    <p className="font-medium text-foreground tracking-tight" style={{ fontSize: u(17) }}>{t.office}</p>
                    <div className="rounded-lg border border-accent" style={{ marginTop: u(12), padding: `${u(10)} ${u(12)}` }}>
                        <span className="block font-medium text-foreground" style={{ fontSize: u(12.5) }}>{t.driver}</span>
                        <span className="block text-foreground/70" style={{ marginTop: u(2) }}><Route from="Hasselt" to={destination} size={11.5} /></span>
                    </div>
                    {steps.map(([label, time]) => (
                        <div key={label} className="flex items-center justify-between border-b border-foreground/[0.08] whitespace-nowrap" style={{ height: u(34), fontSize: u(12) }}>
                            <span className="text-foreground/70">{label}</span>
                            <span className="font-medium text-foreground">{time}</span>
                        </div>
                    ))}
                    <div className="flex items-center text-foreground" style={{ marginTop: u(11), gap: u(7), fontSize: u(12) }}>
                        <SmallCheck />{t.recorded}
                    </div>
                    <p className="text-foreground/60" style={{ marginTop: u(3), marginLeft: u(21), fontSize: u(11) }}>{t.none}</p>
                </div>
            )}

            {arrow && (
                <span className="absolute text-foreground/50" style={{ left: u(arrow.x), top: u(arrow.y) }}>
                    <ArrowLeftRight strokeWidth={1.5} style={{ width: u(44), height: u(28) }} />
                </span>
            )}

            <PhoneFrame phone={phone}>
                <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(14), fontSize: u(18) }}>{t.screen}</p>
                <p className="text-foreground/60" style={{ fontSize: u(11.5) }}>{t.today}</p>

                <div className="rounded-lg bg-white border border-foreground/[0.09]" style={{ marginTop: u(10), padding: `${u(10)} ${u(11)} ${u(4)}` }}>
                    <span className="block font-medium text-foreground"><Route from="Hasselt" to={destination} size={13.5} /></span>
                    <span className="block text-foreground/60" style={{ marginTop: u(2), marginBottom: u(6), fontSize: u(11) }}>06:30, 22 t</span>
                    {steps.map(([label, time]) => (
                        <div key={label} className="flex items-center border-t border-foreground/[0.07] whitespace-nowrap" style={{ height: u(32), gap: u(8), fontSize: u(12) }}>
                            <SmallCheck />
                            <span className="flex-1 text-foreground">{label}</span>
                            <span className="text-foreground/60">{time}</span>
                        </div>
                    ))}
                    <div className="flex items-center border-t border-foreground/[0.07] whitespace-nowrap" style={{ height: u(32), gap: u(8), fontSize: u(12) }}>
                        <span className="shrink-0 rounded-full border border-foreground/30" style={{ width: u(14), height: u(14) }} />
                        <span className="text-foreground/70">{t.signed}</span>
                    </div>
                </div>

                <div className="rounded-lg border border-foreground/[0.09]" style={{ marginTop: u(8), padding: `${u(8)} ${u(11)}` }}>
                    <span className="block text-foreground/60" style={{ fontSize: u(10.5) }}>{t.next}</span>
                    <span className="block text-foreground" style={{ marginTop: u(1) }}><Route from={destination} to="Genk" size={12} /></span>
                </div>

                {note && (
                    <div className="flex items-start rounded-lg border border-accent" style={{ marginTop: u(8), padding: `${u(8)} ${u(10)}`, gap: u(7) }}>
                        <SmallCheck />
                        <span className="text-foreground" style={{ fontSize: u(11.5), lineHeight: 1.3 }}>{t.note}</span>
                    </div>
                )}

                <span className="flex items-center justify-center shrink-0 mt-auto rounded-lg bg-foreground text-white font-medium" style={{ height: u(36), fontSize: u(12) }}>{t.finish}</span>
            </PhoneFrame>
        </ToolStage>
    );
}

export function PlanningDriverVisual() {
    const { language } = useLanguage();
    const t = DRIVER_TEXT[language];
    return <ToolVisual label={t.label} narrow={<DriverStage layout={DRIVER_LAYOUTS.narrow} t={t} language={language} />} wide={<DriverStage layout={DRIVER_LAYOUTS.wide} t={t} language={language} />} />;
}

// ---------- Fouten meteen zichtbaar: in de planning vallen twee ritten op, en daaronder staat waarom ----------

const CHECK_LAYOUTS = {
    wide: {
        W: 720, H: 540, win: { x: 26, y: 26, w: 668, h: 450 }, pad: 16, heading: 22, sub: 14,
        // Alle drie de dagen uit de gegevens
        columns: [0, 1, 2], gridY: 66, dayH: 24, rowH: 58, cardH: 50, nameW: 72, gap: 6,
        panel: { left: 120, right: 8, top: 354, pad: 14 },
        fonts: { route: 11, meta: 10.5, title: 16, text: 12 }
    },
    narrow: {
        W: 400, H: 500, win: { x: 14, y: 14, w: 372, h: 450 }, pad: 12, heading: 21, sub: 13,
        // Op gsm enkel de twee dagen met een fout
        columns: [1, 2], gridY: 58, dayH: 22, rowH: 50, cardH: 44, nameW: 30, gap: 5,
        panel: { left: 26, right: 6, top: 302, pad: 13 },
        fonts: { route: 10.5, meta: 10, title: 15.5, text: 11.5 }
    }
};

const CHECK_TEXT = {
    nl: {
        label: 'Een weekplanning waarin twee ritten opvallen. Karim B. heeft op dinsdag om 06:30 twee ritten, en de rit van Els M. op woensdag lijkt niet te kloppen: 38 ton op een wagen van 24 ton. De planner kan beide aanpassen voor ze doorgaan.',
        sub: 'Week 46',
        days: ['Maandag', 'Dinsdag', 'Woensdag'],
        off: 'Vrij',
        twoTrips: '2 ritten, 06:30',
        title: 'Twee ritten kloppen niet.',
        adjust: 'Pas aan',
        issues: [
            ['Dubbele boeking:', 'Karim B. heeft dinsdag om 06:30 twee ritten.'],
            ['Lijkt niet te kloppen:', 'woensdag 38 t voor Els M., op een wagen van 24 t.']
        ]
    },
    en: {
        label: 'A weekly schedule in which two trips stand out. Karim B. has two trips on Tuesday at 06:30, and the trip of Els M. on Wednesday does not seem right: 38 tonnes on a 24-tonne truck. The planner can change both before they go ahead.',
        sub: 'Week 46',
        days: ['Monday', 'Tuesday', 'Wednesday'],
        off: 'Off',
        twoTrips: '2 trips, 06:30',
        title: 'Two trips do not add up.',
        adjust: 'Adjust',
        issues: [
            ['Double booking:', 'Karim B. has two trips on Tuesday at 06:30.'],
            ['Does not seem right:', 'Wednesday 38 t for Els M., on a 24 t truck.']
        ]
    }
};

// Per rit: vertrek, bestemming, uur en lading. null is een vrije dag; double en flag zijn de twee fouten
const ROWS = [
    { name: 'Tom V.', initials: 'TV', trips: [['Hasselt', 'Genk', '07:00', 18], ['Hasselt', 'Leuven', '06:30', 22], ['Genk', 'Gent', '07:00', 20]] },
    { name: 'Karim B.', initials: 'KB', trips: [['Genk', 'Gent', '06:00', 20], ['Hasselt', 'Aalst', '06:30', 21, 'double'], null] },
    { name: 'Els M.', initials: 'EM', trips: [['Hasselt', 'Leuven', '08:30', 12], ['Lommel', 'Gent', '06:00', 22], ['Hasselt', 'Aalst', '07:00', 38, 'flag']] },
    { name: 'Jan R.', initials: 'JR', trips: [['Lommel', 'Genk', '07:30', 14], null, ['Beringen', 'Aalst', '07:00', 18]] }
];

function CheckTrip({ trip, fonts, t }) {
    if (!trip) {
        return (
            <div className="h-full flex items-center rounded-md bg-foreground/[0.035] text-foreground/35" style={{ paddingLeft: u(9), fontSize: u(fonts.meta) }}>
                {t.off}
            </div>
        );
    }
    const [from, to, time, load, problem] = trip;
    return (
        <div className={`h-full flex flex-col justify-center overflow-hidden rounded-md bg-white border ${problem ? 'border-accent' : 'border-foreground/[0.08]'}`} style={{ paddingLeft: u(9) }}>
            <span className="text-foreground leading-tight"><Route from={from} to={to} size={fonts.route} /></span>
            <span className={`whitespace-nowrap leading-tight ${problem ? 'font-medium text-foreground' : 'text-foreground/50'}`} style={{ marginTop: u(2), fontSize: u(fonts.meta) }}>
                {problem === 'double' ? t.twoTrips : `${time}, ${load} t`}
            </span>
        </div>
    );
}

function CheckStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, columns, gridY, dayH, rowH, cardH, nameW, gap, panel, fonts } = layout;
    const template = `repeat(${columns.length}, 1fr)`;
    return (
        <ToolStage W={W} H={H}>
            <ToolWindow win={win} pad={pad} heading="Planning" sub={t.sub} headingSize={heading} subSize={sub}>
                <div className="absolute" style={{ left: u(pad), right: u(pad), top: u(gridY) }}>
                    <div className="grid" style={{ marginLeft: u(nameW), gridTemplateColumns: template, columnGap: u(gap), height: u(dayH) }}>
                        {columns.map((c) => <span key={c} className="font-medium text-foreground" style={{ fontSize: u(11.5), paddingLeft: u(2) }}>{t.days[c]}</span>)}
                    </div>
                    {ROWS.map((row) => (
                        <div key={row.name} className="flex items-center border-t border-foreground/[0.08]" style={{ height: u(rowH) }}>
                            <div className="flex items-center shrink-0" style={{ width: u(nameW), gap: u(6) }}>
                                <span className="flex items-center justify-center shrink-0 rounded-full border border-foreground/20 text-foreground/70" style={{ width: u(22), height: u(22), fontSize: u(8.5) }}>{row.initials}</span>
                                {nameW > 40 && <span className="whitespace-nowrap text-foreground" style={{ fontSize: u(11) }}>{row.name.split(' ')[0]}</span>}
                            </div>
                            <div className="grid flex-1" style={{ gridTemplateColumns: template, columnGap: u(gap), height: u(cardH) }}>
                                {columns.map((c) => <CheckTrip key={c} trip={row.trips[c]} fonts={fonts} t={t} />)}
                            </div>
                        </div>
                    ))}
                </div>
            </ToolWindow>

            {/* De waarschuwing, met telkens wat er aan de hand is en de keuze om het aan te passen */}
            <div className="absolute bg-white border border-foreground/[0.07]" style={{ left: u(panel.left), right: u(panel.right), top: u(panel.top), padding: u(panel.pad), borderRadius: u(16), boxShadow: `0 ${u(20)} ${u(46)} ${u(-20)} rgba(15,23,42,0.22)` }}>
                <p className="flex items-center font-medium text-foreground tracking-tight" style={{ gap: u(7), fontSize: u(fonts.title) }}>
                    <AlertTriangle strokeWidth={1.5} className="shrink-0 text-accent" style={{ width: u(17), height: u(17) }} />{t.title}
                </p>
                {t.issues.map(([kind, text]) => (
                    <div key={kind} className="flex items-center justify-between border-t border-foreground/[0.08]" style={{ marginTop: u(8), paddingTop: u(8), gap: u(12), fontSize: u(fonts.text), lineHeight: 1.3 }}>
                        <span className="text-foreground/70"><span className="font-medium text-foreground">{kind}</span> {text}</span>
                        <span className="shrink-0 text-foreground underline underline-offset-2 whitespace-nowrap">{t.adjust}</span>
                    </div>
                ))}
            </div>
        </ToolStage>
    );
}

export function PlanningCheckVisual() {
    const { language } = useLanguage();
    const t = CHECK_TEXT[language];
    return <ToolVisual label={t.label} narrow={<CheckStage layout={CHECK_LAYOUTS.narrow} t={t} />} wide={<CheckStage layout={CHECK_LAYOUTS.wide} t={t} />} />;
}
