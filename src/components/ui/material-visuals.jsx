import React from 'react';
import { ArrowRight, BellRing, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage, ToolWindow, PhoneFrame, AssistantCard, AssistantTitle, AssistantActions, ChatWindow, ChatFromAi, ChatFromPerson } from './tool-visual-parts';

// De vier visuals bij de kaartjes van de tool Materiaalbeheer, elk met één boodschap: twee met AI en twee met
// gewone automatisering (daar staat bewust geen AI-assistent in). Alle gegevens zijn verzonnen. De gedeelde
// onderdelen staan in tool-visual-parts.jsx.

const WINDOWS = {
    wide: { W: 720, H: 540, win: { x: 26, y: 26, w: 668, h: 450 }, pad: 16, heading: 22, sub: 14 },
    narrow: { W: 400, H: 400, win: { x: 12, y: 12, w: 376, h: 368 }, pad: 14, heading: 20, sub: 13 }
};

function SmallCheck() {
    return (
        <span className="flex items-center justify-center shrink-0 rounded-full bg-accent text-white" style={{ width: u(14), height: u(14) }}>
            <Check strokeWidth={3} style={{ width: u(9), height: u(9) }} />
        </span>
    );
}

// ---------- Foto bij uitgifte en terugkomst: de AI vergelijkt voor en na en wijst op nieuwe schade ----------

// Een eenvoudige tekening van een minikraan in plaats van een foto: we hebben geen echte, en een tekening kan
// niet doorgaan voor bewijs bij een echte klant. Met damage staat de nieuwe schade erop, omcirkeld
function MiniExcavator({ damage }) {
    return (
        <svg viewBox="0 0 200 140" className="w-full h-full text-foreground/55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 124H192" className="text-foreground/20" />
            <rect x="26" y="102" width="92" height="22" rx="11" />
            <circle cx="40" cy="113" r="5" />
            <circle cx="72" cy="113" r="5" />
            <circle cx="104" cy="113" r="5" />
            <rect x="36" y="76" width="74" height="26" rx="4" />
            <path d="M46 76V40H84L98 76" />
            <path d="M54 48H80L88 68H54Z" />
            <path d="M110 88L146 46L172 84" strokeWidth="5" />
            <path d="M172 84L166 104L186 102L190 86Z" />
            {damage && (
                <>
                    <path d="M62 84L70 90L65 94L77 96" className="text-foreground" strokeWidth="2.5" />
                    <circle cx="69" cy="89" r="15" stroke="#628f69" strokeWidth="2" />
                </>
            )}
        </svg>
    );
}

const PHOTO_LAYOUTS = {
    wide: {
        ...WINDOWS.wide,
        frames: { top: 88, h: 198, labelH: 24, left: 42, right: 366, w: 312 },
        // Het puntje van de kaart wijst naar de foto met de schade
        bubble: { left: 250, right: 8, top: 308, caret: 272, title: 20, text: 12, pad: 14 }
    },
    narrow: {
        ...WINDOWS.narrow,
        frames: { top: 64, h: 136, labelH: 22, left: 26, right: 206, w: 168 },
        bubble: { left: 20, right: 4, top: 212, caret: 270, title: 18, text: 12.5, pad: 14 }
    }
};

const PHOTO_TEXT = {
    nl: {
        label: 'Twee foto\'s van dezelfde minikraan, bij de uitgifte en bij de terugkomst. De AI vergelijkt ze en wijst op nieuwe schade aan de romp. U kiest: de schade doorrekenen of aangeven dat er geen schade is.',
        heading: 'Materiaalbeheer',
        sub: 'Minikraan 4',
        before: 'Bij uitgifte',
        after: 'Bij terugkomst',
        assistant: 'AI-assistent',
        title: 'Ik zie nieuwe schade aan de romp.',
        detail: 'Bij de uitgifte was die er nog niet.',
        charge: 'Doorrekenen',
        none: 'Geen schade'
    },
    en: {
        label: 'Two photos of the same mini excavator, at handover and at return. The AI compares them and points out new damage to the body. You choose: charge for the damage or mark it as no damage.',
        heading: 'Equipment management',
        sub: 'Mini excavator 4',
        before: 'At handover',
        after: 'At return',
        assistant: 'AI assistant',
        title: 'I see new damage to the body.',
        detail: 'It was not there at handover.',
        charge: 'Charge for it',
        none: 'No damage'
    }
};

function PhotoStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, frames, bubble } = layout;
    const photos = [{ label: t.before, x: frames.left, damage: false }, { label: t.after, x: frames.right, damage: true }];
    return (
        <ToolStage W={W} H={H}>
            <ToolWindow win={win} pad={pad} heading={t.heading} sub={t.sub} headingSize={heading} subSize={sub} />
            {photos.map((photo) => (
                <div key={photo.label} className="absolute" style={{ left: u(photo.x), top: u(frames.top), width: u(frames.w) }}>
                    <p className="text-foreground/70 whitespace-nowrap" style={{ height: u(frames.labelH), fontSize: u(12) }}>{photo.label}</p>
                    <div className={`rounded-lg bg-white border ${photo.damage ? 'border-accent' : 'border-foreground/[0.08]'}`} style={{ height: u(frames.h - frames.labelH), padding: u(8) }}>
                        <MiniExcavator damage={photo.damage} />
                    </div>
                </div>
            ))}
            <AssistantCard bubble={bubble} label={t.assistant}>
                <AssistantTitle bubble={bubble}>{t.title}</AssistantTitle>
                <p className="text-foreground/70" style={{ marginTop: u(5), fontSize: u(bubble.text) }}>{t.detail}</p>
                <AssistantActions bubble={bubble} primary={t.charge} secondary={t.none} />
            </AssistantCard>
        </ToolStage>
    );
}

export function MaterialPhotoVisual() {
    const { language } = useLanguage();
    const t = PHOTO_TEXT[language];
    return <ToolVisual label={t.label} narrow={<PhotoStage layout={PHOTO_LAYOUTS.narrow} t={t} />} wide={<PhotoStage layout={PHOTO_LAYOUTS.wide} t={t} />} />;
}

// ---------- Stel vragen aan uw materiaal: de vraag en meteen waar de machine staat, bij wie en tot wanneer ----------

const ASK_LAYOUTS = {
    wide: { ...WINDOWS.wide, bubble: 480, title: 15, text: 12.5, rowH: 36 },
    narrow: { ...WINDOWS.narrow, bubble: 314, title: 14.5, text: 12.5, rowH: 36, compact: true }
};

const ASK_TEXT = {
    nl: {
        label: 'Een chat. Een medewerker vraagt waar de minikraan staat. De AI antwoordt meteen: op werf Noord, bij Jan R., tot vrijdag 6 november, en vrij vanaf maandag 9 november.',
        heading: 'Materiaalbeheer',
        assistant: 'AI-assistent',
        placeholder: 'Stel een vraag aan uw materiaal',
        person: 'Uw medewerker',
        question: 'Waar staat de minikraan?',
        answer: 'De minikraan staat op werf Noord.',
        rows: [['Bij', 'Jan R.'], ['Tot', 'Vrijdag 6 november'], ['Weer vrij', 'Maandag 9 november']]
    },
    en: {
        label: 'A chat. An employee asks where the mini excavator is. The AI answers right away: at Site North, with Jan R., until Friday 6 November, and free from Monday 9 November.',
        heading: 'Equipment management',
        assistant: 'AI assistant',
        placeholder: 'Ask your equipment a question',
        person: 'Your employee',
        question: 'Where is the mini excavator?',
        answer: 'The mini excavator is at Site North.',
        rows: [['With', 'Jan R.'], ['Until', 'Friday 6 November'], ['Free again', 'Monday 9 November']]
    }
};

function AskStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, bubble, title, text, rowH, compact } = layout;
    return (
        <ToolStage W={W} H={H}>
            <ChatWindow win={win} pad={pad} heading={t.heading} sub={t.assistant} headingSize={heading} subSize={sub} placeholder={t.placeholder} compact={compact}>
                <ChatFromPerson label={t.person}>{t.question}</ChatFromPerson>
                <ChatFromAi label={t.assistant} width={bubble}>
                    <p className="font-medium text-foreground tracking-tight" style={{ fontSize: u(title), lineHeight: 1.25 }}>{t.answer}</p>
                    <div style={{ marginTop: u(8) }}>
                        {t.rows.map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between border-t border-foreground/[0.08] whitespace-nowrap" style={{ height: u(rowH), fontSize: u(text) }}>
                                <span className="text-foreground/60">{label}</span>
                                <span className="font-medium text-foreground">{value}</span>
                            </div>
                        ))}
                    </div>
                </ChatFromAi>
            </ChatWindow>
        </ToolStage>
    );
}

export function MaterialAskVisual() {
    const { language } = useLanguage();
    const t = ASK_TEXT[language];
    return <ToolVisual label={t.label} narrow={<AskStage layout={ASK_LAYOUTS.narrow} t={t} />} wide={<AskStage layout={ASK_LAYOUTS.wide} t={t} />} />;
}

// ---------- Uitgifte met één scan: de code op de machine, en de gegevens staan meteen juist ----------

const SCAN_LAYOUTS = {
    wide: {
        W: 720, H: 540,
        // Links de code op de machine, rechts de gsm
        tag: { x: 96, y: 168, w: 210 },
        arrow: { x: 330, y: 254 },
        phone: { x: 406, y: 22, w: 252, h: 496 },
        codeOnPhone: false
    },
    narrow: {
        W: 400, H: 400,
        tag: null,
        arrow: null,
        phone: { x: 70, y: 8, w: 260, h: 384 },
        codeOnPhone: true
    }
};

const SCAN_TEXT = {
    nl: {
        label: 'Een code op de minikraan wordt gescand met de gsm. Meteen staat er wie de machine heeft, waar ze naartoe gaat en tot wanneer.',
        machine: 'Minikraan 4',
        screen: 'Uitgifte',
        scanned: 'Gescand',
        fields: [['Aan', 'Jan R.'], ['Naar', 'Werf Noord'], ['Tot', 'Vrijdag 6 november']],
        confirm: 'Bevestigen'
    },
    en: {
        label: 'A code on the mini excavator is scanned with the phone. Right away it shows who has the machine, where it is going and until when.',
        machine: 'Mini excavator 4',
        screen: 'Handover',
        scanned: 'Scanned',
        fields: [['To', 'Jan R.'], ['Going to', 'Site North'], ['Until', 'Friday 6 November']],
        confirm: 'Confirm'
    }
};

// Een vast patroon dat op een code lijkt; het is geen echte code die je kan scannen
const CODE = [
    '111101111', '100101001', '101100101', '100111001', '111010111',
    '001101100', '111011010', '100110101', '111101011'
];

function ScanCode({ size }) {
    return (
        <span className="grid shrink-0" style={{ gridTemplateColumns: 'repeat(9, 1fr)', width: u(size), height: u(size) }} aria-hidden="true">
            {CODE.join('').split('').map((cell, i) => <span key={i} className={cell === '1' ? 'bg-foreground' : ''} />)}
        </span>
    );
}

function ScanStage({ layout, t }) {
    const { W, H, tag, arrow, phone, codeOnPhone } = layout;
    return (
        <ToolStage W={W} H={H}>
            {tag && (
                <div className="absolute flex flex-col items-center bg-white border border-foreground/[0.07]" style={{ left: u(tag.x), top: u(tag.y), width: u(tag.w), padding: u(20), borderRadius: u(16), boxShadow: `0 ${u(18)} ${u(44)} ${u(-22)} rgba(15,23,42,0.2)` }}>
                    <ScanCode size={126} />
                    <p className="font-medium text-foreground tracking-tight whitespace-nowrap" style={{ marginTop: u(14), fontSize: u(16) }}>{t.machine}</p>
                </div>
            )}
            {arrow && (
                <span className="absolute text-foreground/50" style={{ left: u(arrow.x), top: u(arrow.y) }}>
                    <ArrowRight strokeWidth={1.5} style={{ width: u(44), height: u(28) }} />
                </span>
            )}

            <PhoneFrame phone={phone}>
                <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(14), fontSize: u(18) }}>{t.screen}</p>

                <div className="flex items-center rounded-lg bg-white border border-accent" style={{ marginTop: u(12), padding: u(10), gap: u(10) }}>
                    {codeOnPhone && <ScanCode size={44} />}
                    <span className="min-w-0">
                        <span className="flex items-center text-foreground/60" style={{ gap: u(5), fontSize: u(11) }}><SmallCheck />{t.scanned}</span>
                        <span className="block font-medium text-foreground tracking-tight whitespace-nowrap" style={{ marginTop: u(4), fontSize: u(14) }}>{t.machine}</span>
                    </span>
                </div>

                <div className="rounded-lg bg-white border border-foreground/[0.09]" style={{ marginTop: u(10), paddingLeft: u(10), paddingRight: u(10) }}>
                    {t.fields.map(([label, value], i) => (
                        <div key={label} className={`flex items-center justify-between whitespace-nowrap ${i ? 'border-t border-foreground/[0.07]' : ''}`} style={{ height: u(46), gap: u(8) }}>
                            <span className="text-foreground/60" style={{ fontSize: u(11.5) }}>{label}</span>
                            <span className="font-medium text-foreground" style={{ fontSize: u(12.5) }}>{value}</span>
                        </div>
                    ))}
                </div>

                <span className="flex items-center justify-center shrink-0 mt-auto rounded-lg bg-foreground text-white font-medium" style={{ height: u(36), fontSize: u(12) }}>{t.confirm}</span>
            </PhoneFrame>
        </ToolStage>
    );
}

export function MaterialScanVisual() {
    const { language } = useLanguage();
    const t = SCAN_TEXT[language];
    return <ToolVisual label={t.label} narrow={<ScanStage layout={SCAN_LAYOUTS.narrow} t={t} />} wide={<ScanStage layout={SCAN_LAYOUTS.wide} t={t} />} />;
}

// ---------- Waarschuwing bij verhuur en stilstand: wat over tijd is of stilstaat, valt meteen op ----------

const ALERT_LAYOUTS = {
    wide: { ...WINDOWS.wide, x: 42, w: 636, firstRow: 96, rowH: 96, rowGap: 12, title: 15, text: 12 },
    narrow: { ...WINDOWS.narrow, x: 26, w: 348, firstRow: 66, rowH: 88, rowGap: 8, title: 14.5, text: 12 }
};

const ALERT_TEXT = {
    nl: {
        label: 'Een lijst met drie machines. Hoogtewerker 2 is drie dagen over tijd, graafmachine 7 staat al vijf weken ongebruikt op werf Noord, en minikraan 4 is op schema.',
        heading: 'Materiaalbeheer',
        sub: 'Waarschuwingen',
        items: [
            { name: 'Hoogtewerker 2', detail: 'Verhuurd tot 1 november', status: '3 dagen over tijd', alert: true },
            { name: 'Graafmachine 7', detail: 'Staat op werf Noord', status: '5 weken ongebruikt', alert: true },
            { name: 'Minikraan 4', detail: 'Bij Jan R., tot 6 november', status: 'Op schema', alert: false }
        ]
    },
    en: {
        label: 'A list of three machines. Aerial lift 2 is three days overdue, excavator 7 has been sitting unused at Site North for five weeks, and mini excavator 4 is on schedule.',
        heading: 'Equipment management',
        sub: 'Alerts',
        items: [
            { name: 'Aerial lift 2', detail: 'Rented out until 1 November', status: '3 days overdue', alert: true },
            { name: 'Excavator 7', detail: 'At Site North', status: '5 weeks unused', alert: true },
            { name: 'Mini excavator 4', detail: 'With Jan R., until 6 November', status: 'On schedule', alert: false }
        ]
    }
};

function AlertStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, x, w, firstRow, rowH, rowGap, title, text } = layout;
    return (
        <ToolStage W={W} H={H}>
            <ToolWindow win={win} pad={pad} heading={t.heading} sub={t.sub} headingSize={heading} subSize={sub} />
            {t.items.map((item, i) => (
                <div
                    key={item.name}
                    className={`absolute flex items-center justify-between rounded-lg bg-white border whitespace-nowrap ${item.alert ? 'border-accent' : 'border-foreground/[0.08]'}`}
                    style={{ left: u(x), top: u(firstRow + i * (rowH + rowGap)), width: u(w), height: u(rowH), paddingLeft: u(14), paddingRight: u(14), gap: u(10) }}
                >
                    <span className="min-w-0">
                        <span className="block font-medium text-foreground tracking-tight leading-tight" style={{ fontSize: u(title) }}>{item.name}</span>
                        <span className="block text-foreground/60 leading-tight" style={{ marginTop: u(4), fontSize: u(text) }}>{item.detail}</span>
                    </span>
                    <span className={`flex items-center shrink-0 ${item.alert ? 'font-medium text-foreground' : 'text-foreground/60'}`} style={{ gap: u(7), fontSize: u(text) }}>
                        {item.alert
                            ? <BellRing strokeWidth={1.5} className="shrink-0 text-accent" style={{ width: u(15), height: u(15) }} />
                            : <SmallCheck />}
                        {item.status}
                    </span>
                </div>
            ))}
        </ToolStage>
    );
}

export function MaterialAlertVisual() {
    const { language } = useLanguage();
    const t = ALERT_TEXT[language];
    return <ToolVisual label={t.label} narrow={<AlertStage layout={ALERT_LAYOUTS.narrow} t={t} />} wide={<AlertStage layout={ALERT_LAYOUTS.wide} t={t} />} />;
}
