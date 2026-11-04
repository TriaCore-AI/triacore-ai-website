import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage, PhoneFrame } from './tool-visual-parts';

// Twee visuals bij de automatiseringen van de tool App voor op de baan, elk met één boodschap. Hier staat bewust
// geen AI-assistent in: dit is gewone automatisering. Alle gegevens zijn verzonnen. De gedeelde onderdelen staan
// in tool-visual-parts.jsx.

function SmallCheck() {
    return (
        <span className="flex items-center justify-center shrink-0 rounded-full bg-accent text-white" style={{ width: u(14), height: u(14) }}>
            <Check strokeWidth={3} style={{ width: u(9), height: u(9) }} />
        </span>
    );
}

// ---------- Laden en lossen vastgelegd: één tik, het uur en de plaats staan juist, enkel de hoeveelheid is nog werk ----------

const TAP_LAYOUTS = {
    wide: {
        W: 720, H: 540,
        // Links wat er met die ene tik gebeurt, rechts de gsm
        side: { x: 44, y: 142, w: 300 },
        phone: { x: 406, y: 22, w: 252, h: 496 }
    },
    narrow: {
        W: 400, H: 400,
        side: null,
        phone: { x: 70, y: 8, w: 260, h: 384 }
    }
};

const TAP_TEXT = {
    nl: {
        label: 'Op de gsm tikt de chauffeur op Gelost. Het uur en de plaats staan er meteen, en de chauffeur vult enkel nog de hoeveelheid in.',
        screen: 'Rit van vandaag',
        destination: 'Luik',
        loaded: 'Geladen',
        unloaded: 'Gelost',
        time: 'Uur',
        place: 'Plaats',
        placeValue: 'Werf Noord',
        amount: 'Hoeveelheid',
        amountValue: '18,4 t',
        filled: 'Vanzelf ingevuld',
        confirm: 'Bevestigen',
        sideTitle: 'Eén tik, en dit staat juist',
        sideDriver: 'De chauffeur vult enkel nog in'
    },
    en: {
        label: 'On the phone, the driver taps Unloaded. The time and place appear right away, and the driver only has to fill in the quantity.',
        screen: 'Today\'s trip',
        destination: 'Liège',
        loaded: 'Loaded',
        unloaded: 'Unloaded',
        time: 'Time',
        place: 'Place',
        placeValue: 'Site North',
        amount: 'Quantity',
        amountValue: '18.4 t',
        filled: 'Filled in by itself',
        confirm: 'Confirm',
        sideTitle: 'One tap, and this is right',
        sideDriver: 'The driver only fills in'
    }
};

function TapStage({ layout, t }) {
    const { W, H, side, phone } = layout;
    const auto = [[t.time, '08:41'], [t.place, t.placeValue]];
    return (
        <ToolStage W={W} H={H}>
            {side && (
                <div className="absolute bg-white border border-foreground/[0.07]" style={{ left: u(side.x), top: u(side.y), width: u(side.w), padding: u(16), borderRadius: u(16), boxShadow: `0 ${u(18)} ${u(44)} ${u(-22)} rgba(15,23,42,0.2)` }}>
                    <p className="font-medium text-foreground tracking-tight" style={{ marginBottom: u(10), fontSize: u(17) }}>{t.sideTitle}</p>
                    {auto.map(([label, value]) => (
                        <div key={label} className="flex items-center border-t border-foreground/[0.08] whitespace-nowrap" style={{ height: u(38), gap: u(8), fontSize: u(12.5) }}>
                            <SmallCheck />
                            <span className="flex-1 text-foreground/70">{label}</span>
                            <span className="font-medium text-foreground">{value}</span>
                        </div>
                    ))}
                    <p className="border-t border-foreground/[0.08] text-foreground/60" style={{ paddingTop: u(11), fontSize: u(11.5) }}>{t.sideDriver}</p>
                    <div className="flex items-center justify-between rounded-md border border-accent whitespace-nowrap" style={{ marginTop: u(6), height: u(34), paddingLeft: u(10), paddingRight: u(10), fontSize: u(12.5) }}>
                        <span className="text-foreground/70">{t.amount}</span>
                        <span className="font-medium text-foreground">{t.amountValue}</span>
                    </div>
                </div>
            )}

            <PhoneFrame phone={phone}>
                <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(14), fontSize: u(18) }}>{t.screen}</p>
                <span className="flex items-center text-foreground/70 whitespace-nowrap" style={{ marginTop: u(1), gap: u(3), fontSize: u(12) }}>
                    Hasselt<ArrowRight strokeWidth={1.75} className="shrink-0" style={{ width: u(11), height: u(11) }} />{t.destination}
                </span>

                {/* De twee knoppen: geladen is al afgetikt, gelost is net aangetikt */}
                <div className="grid grid-cols-2" style={{ marginTop: u(12), gap: u(7) }}>
                    <span className="flex flex-col items-center justify-center rounded-lg bg-white border border-foreground/[0.09] text-foreground" style={{ height: u(62), gap: u(2) }}>
                        <span className="flex items-center font-medium" style={{ gap: u(5), fontSize: u(12) }}><SmallCheck />{t.loaded}</span>
                        <span className="text-foreground/60" style={{ fontSize: u(11) }}>06:52</span>
                    </span>
                    <span className="flex items-center justify-center rounded-lg bg-foreground text-white font-medium" style={{ height: u(62), fontSize: u(13) }}>{t.unloaded}</span>
                </div>

                <p className="text-foreground/60" style={{ marginTop: u(13), marginBottom: u(5), fontSize: u(11) }}>{t.filled}</p>
                <div className="rounded-lg bg-white border border-foreground/[0.09]" style={{ paddingLeft: u(10), paddingRight: u(10) }}>
                    {auto.map(([label, value], i) => (
                        <div key={label} className={`flex items-center whitespace-nowrap ${i ? 'border-t border-foreground/[0.07]' : ''}`} style={{ height: u(36), gap: u(7) }}>
                            <SmallCheck />
                            <span className="flex-1 text-foreground/60" style={{ fontSize: u(11) }}>{label}</span>
                            <span className="font-medium text-foreground" style={{ fontSize: u(12) }}>{value}</span>
                        </div>
                    ))}
                </div>

                {/* Het enige wat de chauffeur nog moet doen */}
                <div className="flex items-center justify-between rounded-lg bg-white border border-accent whitespace-nowrap" style={{ marginTop: u(9), height: u(42), paddingLeft: u(10), paddingRight: u(10) }}>
                    <span className="text-foreground/70" style={{ fontSize: u(11.5) }}>{t.amount}</span>
                    <span className="font-medium text-foreground" style={{ fontSize: u(14) }}>{t.amountValue}</span>
                </div>

                <span className="flex items-center justify-center shrink-0 mt-auto rounded-lg bg-foreground text-white font-medium" style={{ height: u(36), fontSize: u(12) }}>{t.confirm}</span>
            </PhoneFrame>
        </ToolStage>
    );
}

export function AppTapVisual() {
    const { language } = useLanguage();
    const t = TAP_TEXT[language];
    return <ToolVisual label={t.label} narrow={<TapStage layout={TAP_LAYOUTS.narrow} t={t} />} wide={<TapStage layout={TAP_LAYOUTS.wide} t={t} />} />;
}

// ---------- Altijd de juiste velden: elk soort werk zijn eigen velden, en verzenden kan pas als alles is ingevuld ----------

const FIELD_LAYOUTS = {
    wide: {
        W: 720, H: 540,
        phones: [{ x: 74, y: 40, w: 270, h: 460 }, { x: 376, y: 40, w: 270, h: 460 }],
        rowH: 56, label: 11, value: 13, title: 19
    },
    narrow: {
        // Op gsm één gsm in plaats van twee: de keuze bovenaan toont dat elk soort werk eigen velden heeft
        W: 400, H: 400,
        phones: [{ x: 70, y: 8, w: 260, h: 384 }],
        rowH: 48, label: 11, value: 13, title: 18, single: true
    }
};

const FIELD_TEXT = {
    nl: {
        label: 'Twee gsm-schermen. Voor een levering vraagt de app om klant, locatie, gewicht en handtekening, voor een herstelling om toestel, probleem, uren en onderdelen. Bij de herstelling ontbreken de onderdelen nog, dus verzenden kan daar nog niet.',
        send: 'Verzenden',
        open: 'Nog in te vullen',
        forms: [
            {
                title: 'Levering',
                fields: [['Klant', 'Bouwwerf Noord'], ['Locatie', 'Hasselt'], ['Gewicht', '18,4 t'], ['Handtekening', 'Getekend']]
            },
            {
                title: 'Herstelling',
                fields: [['Toestel', 'Heftruck 3'], ['Probleem', 'Lekkende slang'], ['Uren', '1,5 u'], ['Onderdelen', null]]
            }
        ]
    },
    en: {
        label: 'Two phone screens. For a delivery the app asks for customer, location, weight and signature, for a repair for machine, problem, hours and parts. The parts are still missing on the repair, so it cannot be sent yet.',
        send: 'Send',
        open: 'Still to fill in',
        forms: [
            {
                title: 'Delivery',
                fields: [['Customer', 'Site North'], ['Location', 'Hasselt'], ['Weight', '18.4 t'], ['Signature', 'Signed']]
            },
            {
                title: 'Repair',
                fields: [['Machine', 'Forklift 3'], ['Problem', 'Leaking hose'], ['Hours', '1.5 h'], ['Parts', null]]
            }
        ]
    }
};

function FieldPhone({ phone, form, layout, t }) {
    const { rowH, label, value, title, single } = layout;
    const complete = form.fields.every(([, val]) => val);
    return (
        <PhoneFrame phone={phone}>
            {single ? (
                <div className="grid grid-cols-2 rounded-lg bg-foreground/[0.05] whitespace-nowrap" style={{ marginTop: u(14), marginBottom: u(10), padding: u(3), fontSize: u(12) }}>
                    {t.forms.map((option) => (
                        <span key={option.title} className={`flex items-center justify-center rounded-md ${option === form ? 'bg-white font-medium text-foreground' : 'text-foreground/60'}`} style={{ height: u(26) }}>{option.title}</span>
                    ))}
                </div>
            ) : (
                <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(14), marginBottom: u(10), fontSize: u(title) }}>{form.title}</p>
            )}
            {form.fields.map(([name, val]) => (
                <div
                    key={name}
                    className={`flex flex-col justify-center rounded-lg bg-white border whitespace-nowrap ${val ? 'border-foreground/[0.09]' : 'border-accent'}`}
                    style={{ height: u(rowH - 6), marginBottom: u(6), paddingLeft: u(10), paddingRight: u(8) }}
                >
                    <span className="text-foreground/60 leading-tight" style={{ fontSize: u(label) }}>{name}</span>
                    <span className={`leading-tight ${val ? 'font-medium text-foreground' : 'text-foreground/50'}`} style={{ marginTop: u(2), fontSize: u(value) }}>{val || t.open}</span>
                </div>
            ))}
            {/* Pas actief als elk veld is ingevuld */}
            <span
                className={`flex items-center justify-center shrink-0 mt-auto rounded-lg font-medium ${complete ? 'bg-foreground text-white' : 'bg-foreground/[0.08] text-foreground/45'}`}
                style={{ height: u(36), fontSize: u(12) }}
            >
                {t.send}
            </span>
        </PhoneFrame>
    );
}

function FieldStage({ layout, t }) {
    return (
        <ToolStage W={layout.W} H={layout.H}>
            {layout.single
                ? <FieldPhone phone={layout.phones[0]} form={t.forms[1]} layout={layout} t={t} />
                : t.forms.map((form, i) => <FieldPhone key={form.title} phone={layout.phones[i]} form={form} layout={layout} t={t} />)}
        </ToolStage>
    );
}

export function AppFieldVisual() {
    const { language } = useLanguage();
    const t = FIELD_TEXT[language];
    return <ToolVisual label={t.label} narrow={<FieldStage layout={FIELD_LAYOUTS.narrow} t={t} />} wide={<FieldStage layout={FIELD_LAYOUTS.wide} t={t} />} />;
}
