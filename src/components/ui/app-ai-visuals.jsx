import React from 'react';
import { ArrowRight, Check, FileText, Sparkles, Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage, PhoneFrame, ChatWindow, ChatFromAi, ChatFromPerson } from './tool-visual-parts';

// Twee visuals bij de AI-acties van de tool App voor op de baan: op de baan de gsm van de chauffeur, op
// kantoor de chat op het grote scherm. Alle gegevens zijn verzonnen. De gedeelde onderdelen staan in
// tool-visual-parts.jsx.

// ---------- Foto wordt bon: de AI leest de foto, vult de velden in en merkt op wat ontbreekt ----------

const PHOTO_LAYOUTS = {
    wide: {
        W: 720, H: 540,
        // De papieren bon zoals de chauffeur hem fotografeert, en rechts daarvan de gsm
        paper: { x: 62, y: 92, w: 264, h: 356 },
        arrow: { x: 340, y: 256 },
        phone: { x: 406, y: 22, w: 252, h: 496 },
        thumb: false
    },
    narrow: {
        W: 400, H: 400,
        paper: null,
        arrow: null,
        phone: { x: 70, y: 8, w: 260, h: 384 },
        thumb: true
    }
};

const PHOTO_TEXT = {
    nl: {
        label: 'Een chauffeur fotografeert een papieren bon. De AI leest de foto en vult op de gsm het nummer, de locatie, het materiaal en het gewicht in. Ze merkt ook op dat er een handtekening ontbreekt op de bon, zodat de chauffeur dat ter plaatse kan oplossen.',
        bon: 'Weegbon',
        number: 'Bonnummer',
        place: 'Locatie',
        placeValue: 'Werf Noord',
        material: 'Materiaal',
        materialValue: 'Steenslag',
        weight: 'Gewicht',
        signature: 'Handtekening',
        screen: 'Nieuwe bon',
        photo: 'Foto van de bon',
        filled: 'Ingevuld door de AI',
        missing: 'Op deze bon ontbreekt een handtekening.',
        missingNext: 'Laat tekenen en neem een nieuwe foto.',
        again: 'Nieuwe foto'
    },
    en: {
        label: 'A driver takes a photo of a paper slip. The AI reads the photo and fills in the number, location, material and weight on the phone. It also notices that a signature is missing from the slip, so the driver can fix this on the spot.',
        bon: 'Weighing slip',
        number: 'Slip number',
        place: 'Location',
        placeValue: 'Site North',
        material: 'Material',
        materialValue: 'Crushed stone',
        weight: 'Weight',
        signature: 'Signature',
        screen: 'New slip',
        photo: 'Photo of the slip',
        filled: 'Filled in by the AI',
        missing: 'A signature is missing from this slip.',
        missingNext: 'Have it signed and take a new photo.',
        again: 'New photo'
    }
};

const fieldsOf = (t) => [
    [t.number, '20461'],
    [t.place, t.placeValue],
    [t.material, t.materialValue],
    [t.weight, '18,4 t']
];

// De bon op papier, licht schuin, met de hoeken van de camera eromheen
function PaperSlip({ paper, t }) {
    return (
        <div className="absolute" style={{ left: u(paper.x), top: u(paper.y), width: u(paper.w), height: u(paper.h) }}>
            {[['left-0 top-0', 'border-l-2 border-t-2'], ['right-0 top-0', 'border-r-2 border-t-2'], ['left-0 bottom-0', 'border-l-2 border-b-2'], ['right-0 bottom-0', 'border-r-2 border-b-2']].map(([place, sides]) => (
                <span key={place} aria-hidden="true" className={`absolute ${place} ${sides} border-accent`} style={{ width: u(22), height: u(22) }} />
            ))}
            <div
                className="absolute bg-white border border-foreground/[0.08] rotate-[-2deg]"
                style={{ left: u(16), right: u(16), top: u(16), bottom: u(16), padding: u(18), borderRadius: u(4), boxShadow: `0 ${u(14)} ${u(34)} ${u(-16)} rgba(15,23,42,0.24)` }}
            >
                <p className="font-medium text-foreground tracking-tight" style={{ fontSize: u(18) }}>{t.bon}</p>
                <div style={{ marginTop: u(10) }}>
                    {fieldsOf(t).map(([label, value]) => (
                        <div key={label} className="border-t border-foreground/[0.1]" style={{ paddingTop: u(6), paddingBottom: u(6) }}>
                            <span className="block text-foreground/55 leading-tight" style={{ fontSize: u(9.5) }}>{label}</span>
                            <span className="block text-foreground leading-tight" style={{ marginTop: u(1), fontSize: u(12) }}>{value}</span>
                        </div>
                    ))}
                </div>
                <p className="text-foreground/55 leading-tight" style={{ marginTop: u(4), fontSize: u(9.5) }}>{t.signature}</p>
                <span aria-hidden="true" className="block border-b border-dashed border-foreground/35" style={{ marginTop: u(26) }} />
            </div>
        </div>
    );
}

function Phone({ phone, thumb, t }) {
    return (
        <PhoneFrame phone={phone}>
            <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(14), fontSize: u(18) }}>{t.screen}</p>

            {/* Op gsm is er geen plaats voor de papieren bon ernaast: dan staat de foto op het scherm */}
            {thumb && (
                <div className="flex items-center rounded-lg bg-white border border-foreground/[0.09]" style={{ marginTop: u(10), padding: u(7), gap: u(9) }}>
                    <span className="flex items-center justify-center shrink-0 rounded bg-foreground/[0.06] text-foreground/60" style={{ width: u(30), height: u(36) }}>
                        <FileText strokeWidth={1.5} style={{ width: u(15), height: u(15) }} />
                    </span>
                    <span className="text-foreground/70" style={{ fontSize: u(11.5) }}>{t.photo}</span>
                </div>
            )}

            <p className="flex items-center font-medium text-accent" style={{ marginTop: u(12), marginBottom: u(5), gap: u(5), fontSize: u(11) }}>
                <Sparkles strokeWidth={1.5} style={{ width: u(12), height: u(12) }} />{t.filled}
            </p>
            <div className="rounded-lg bg-white border border-foreground/[0.09]" style={{ paddingLeft: u(10), paddingRight: u(10) }}>
                {/* Op gsm drie velden in plaats van vier */}
                {fieldsOf(t).filter(([label]) => !thumb || label !== t.material).map(([label, value], i) => (
                    <div key={label} className={`flex items-center justify-between whitespace-nowrap ${i ? 'border-t border-foreground/[0.07]' : ''}`} style={{ height: u(35) }}>
                        <span className="text-foreground/60" style={{ fontSize: u(11) }}>{label}</span>
                        <span className="font-medium text-foreground" style={{ fontSize: u(12) }}>{value}</span>
                    </div>
                ))}
            </div>

            {/* Wat de AI opmerkt, terwijl de chauffeur nog ter plaatse is */}
            <div className="rounded-lg border border-accent bg-white" style={{ marginTop: u(10), padding: `${u(9)} ${u(10)}` }}>
                <p className="font-medium text-foreground tracking-tight" style={{ fontSize: u(13), lineHeight: 1.25 }}>{t.missing}</p>
                {!thumb && <p className="text-foreground/70" style={{ marginTop: u(3), fontSize: u(11), lineHeight: 1.3 }}>{t.missingNext}</p>}
            </div>

            <span className="flex items-center justify-center shrink-0 mt-auto rounded-lg bg-foreground text-white font-medium" style={{ height: u(36), fontSize: u(12) }}>{t.again}</span>
        </PhoneFrame>
    );
}

function PhotoStage({ layout, t }) {
    const { W, H, paper, arrow, phone, thumb } = layout;
    return (
        <ToolStage W={W} H={H}>
            {paper && <PaperSlip paper={paper} t={t} />}
            {arrow && (
                <span className="absolute text-foreground/50" style={{ left: u(arrow.x), top: u(arrow.y) }}>
                    <ArrowRight strokeWidth={1.5} style={{ width: u(40), height: u(28) }} />
                </span>
            )}
            <Phone phone={phone} thumb={thumb} t={t} />
        </ToolStage>
    );
}

export function AppPhotoVisual() {
    const { language } = useLanguage();
    const t = PHOTO_TEXT[language];
    return <ToolVisual label={t.label} narrow={<PhotoStage layout={PHOTO_LAYOUTS.narrow} t={t} />} wide={<PhotoStage layout={PHOTO_LAYOUTS.wide} t={t} />} />;
}

// ---------- Stel vragen aan uw registraties: de vraag vanop kantoor en het antwoord, met de bonnen erbij ----------

const ASK_LAYOUTS = {
    wide: { W: 720, H: 540, win: { x: 26, y: 26, w: 668, h: 450 }, pad: 16, heading: 22, sub: 14, bubble: 480, title: 15, text: 12.5, rowH: 31, showDay: true, slips: 4 },
    // Op gsm twee bonnen in plaats van vier, zonder de dag en zonder de balk om te typen
    narrow: { W: 400, H: 400, win: { x: 12, y: 12, w: 376, h: 368 }, pad: 14, heading: 20, sub: 13, bubble: 314, title: 14.5, text: 12.5, rowH: 30, showDay: false, slips: 2, compact: true }
};

const ASK_TEXT = {
    nl: {
        label: 'Een chat op het kantoorscherm. Iemand op kantoor vraagt hoeveel er deze week naar werf Noord ging. De AI antwoordt meteen: 73,2 ton, met de vier bonnen en hun chauffeurs erbij. Alle bonnen zijn in orde, en Karim B. en Els M. zijn onderaannemers.',
        heading: 'Registraties',
        assistant: 'AI-assistent',
        placeholder: 'Stel een vraag aan uw registraties',
        office: 'Op kantoor',
        question: 'Hoeveel ging er deze week naar werf Noord?',
        answer: 'Deze week ging er 73,2 ton naar werf Noord.',
        bon: 'Bon',
        days: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag'],
        moreSlips: 'En nog 2 bonnen',
        fine: 'Alle bonnen zijn in orde.',
        subcontractors: 'Karim B. en Els M. zijn onderaannemers.'
    },
    en: {
        label: 'A chat on the office screen. Someone at the office asks how much went to Site North this week. The AI answers right away: 73.2 tonnes, with the four slips and their drivers attached. All slips are in order, and Karim B. and Els M. are subcontractors.',
        heading: 'Records',
        assistant: 'AI assistant',
        placeholder: 'Ask your records a question',
        office: 'At the office',
        question: 'How much went to Site North this week?',
        answer: '73.2 tonnes went to Site North this week.',
        bon: 'Slip',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        moreSlips: 'And 2 more slips',
        fine: 'All slips are in order.',
        subcontractors: 'Karim B. and Els M. are subcontractors.'
    }
};

const SLIPS = [
    { nr: '20461', driver: 'Tom V.', nl: '18,4 t', en: '18.4 t' },
    { nr: '20478', driver: 'Karim B.', nl: '19,1 t', en: '19.1 t' },
    { nr: '20490', driver: 'Jan R.', nl: '17,3 t', en: '17.3 t' },
    { nr: '20502', driver: 'Els M.', nl: '18,4 t', en: '18.4 t' }
];

function AskStage({ layout, t, language }) {
    const { W, H, win, pad, heading, sub, bubble, title, text, rowH, showDay, slips, compact } = layout;
    return (
        <ToolStage W={W} H={H}>
            <ChatWindow win={win} pad={pad} heading={t.heading} sub={t.assistant} headingSize={heading} subSize={sub} placeholder={t.placeholder} compact={compact}>
                <ChatFromPerson label={t.office}>{t.question}</ChatFromPerson>

                <ChatFromAi label={t.assistant} width={bubble}>
                    <p className="font-medium text-foreground tracking-tight" style={{ fontSize: u(title), lineHeight: 1.25 }}>{t.answer}</p>
                    <div style={{ marginTop: u(8) }}>
                        {SLIPS.slice(0, slips).map((slip, i) => (
                            <div key={slip.nr} className="flex items-center border-t border-foreground/[0.08] whitespace-nowrap" style={{ height: u(rowH), gap: u(8), fontSize: u(text) }}>
                                <FileText strokeWidth={1.5} className="shrink-0 text-foreground/60" style={{ width: u(14), height: u(14) }} />
                                <span className="shrink-0 text-foreground/60" style={{ width: u(74) }}>{t.bon} {slip.nr}</span>
                                <span className="flex-1 min-w-0 text-foreground">{slip.driver}</span>
                                {/* Op gsm is er geen plaats voor de dag */}
                                {showDay && <span className="shrink-0 text-foreground/60" style={{ width: u(84) }}>{t.days[i]}</span>}
                                <span className="shrink-0 text-right font-medium text-foreground" style={{ width: u(44) }}>{slip[language]}</span>
                            </div>
                        ))}
                        {slips < SLIPS.length && (
                            <p className="border-t border-foreground/[0.08] text-foreground/60 flex items-center" style={{ height: u(rowH - 4), fontSize: u(text) }}>{t.moreSlips}</p>
                        )}
                    </div>

                    {/* In één oogopslag: is alles in orde, en wie reed er als onderaannemer */}
                    <div className="border-t border-foreground/[0.08] text-foreground/70" style={{ paddingTop: u(8), fontSize: u(text) }}>
                        <div className="flex items-center" style={{ gap: u(7) }}>
                            <span className="flex items-center justify-center shrink-0 rounded-full bg-accent text-white" style={{ width: u(14), height: u(14) }}>
                                <Check strokeWidth={3} style={{ width: u(9), height: u(9) }} />
                            </span>
                            {t.fine}
                        </div>
                        <div className="flex items-center" style={{ marginTop: u(4), gap: u(7) }}>
                            <Users strokeWidth={1.5} className="shrink-0 text-foreground/60" style={{ width: u(14), height: u(14) }} />
                            {t.subcontractors}
                        </div>
                    </div>
                </ChatFromAi>
            </ChatWindow>
        </ToolStage>
    );
}

export function AppAskVisual() {
    const { language } = useLanguage();
    const t = ASK_TEXT[language];
    return <ToolVisual label={t.label} narrow={<AskStage layout={ASK_LAYOUTS.narrow} t={t} language={language} />} wide={<AskStage layout={ASK_LAYOUTS.wide} t={t} language={language} />} />;
}
