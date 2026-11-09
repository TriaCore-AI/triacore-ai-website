import React from 'react';
import { ArrowRight, Check, FileText, Lock, Mail } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage, ToolWindow, AssistantCard, AssistantTitle, AssistantActions, ChatWindow, ChatFromAi, ChatFromPerson } from './tool-visual-parts';

// De vier visuals bij de kaartjes van de tool Klantenportaal, elk met één boodschap: twee met AI en twee met
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

// ---------- Aanmeldingen nakijken: de AI leest de documenten en merkt op wat niet in orde is ----------

const CHECK_LAYOUTS = {
    wide: {
        ...WINDOWS.wide,
        x: 42, w: 636, docs: [0, 1, 2], applicantY: 84, firstRow: 134, rowH: 46, rowGap: 6, short: false,
        // Het puntje van de kaart wijst naar het document dat niet in orde is
        bubble: { left: 250, right: 8, top: 304, caret: 340, title: 20, text: 12, pad: 14 },
        fonts: { name: 12.5, status: 11.5 }
    },
    narrow: {
        ...WINDOWS.narrow,
        // Op gsm twee documenten in plaats van drie: een dat in orde is en het rijbewijs
        x: 26, w: 348, docs: [1, 2], applicantY: 62, firstRow: 104, rowH: 44, rowGap: 6, short: true,
        bubble: { left: 20, right: 4, top: 210, caret: 303, title: 19, text: 12.5, pad: 14 },
        fonts: { name: 13, status: 12 }
    }
};

const CHECK_TEXT = {
    nl: {
        label: 'Een onderaannemer meldt een nieuwe chauffeur aan met drie documenten. De AI leest ze: de identiteitskaart en de code 95 zijn in orde, maar het rijbewijs is vervallen op 2 oktober. Jij kiest: een nieuw rijbewijs vragen of toch goedkeuren.',
        heading: 'Klantenportaal',
        sub: 'Nieuwe aanmelding',
        applicant: 'Bram L., nieuwe chauffeur',
        by: 'Ingediend door je onderaannemer',
        docs: [
            { name: 'Identiteitskaart', status: 'Geldig tot 2031', short: 'Tot 2031' },
            { name: 'Code 95', status: 'Geldig tot 2028', short: 'Tot 2028' },
            { name: 'Rijbewijs C', status: 'Vervallen op 2 oktober 2026', short: 'Vervallen 2 okt', expired: true }
        ],
        assistant: 'AI-assistent',
        title: 'Het rijbewijs is vervallen.',
        rest: 'De andere documenten zijn in orde.',
        ask: 'Vraag nieuw rijbewijs',
        approve: 'Keur toch goed'
    },
    en: {
        label: 'A subcontractor registers a new driver with three documents. The AI reads them: the ID card and Code 95 are in order, but the driving licence expired on 2 October. You choose: request a new licence or approve it anyway.',
        heading: 'Client portal',
        sub: 'New registration',
        applicant: 'Bram L., new driver',
        by: 'Submitted by your subcontractor',
        docs: [
            { name: 'ID card', status: 'Valid until 2031', short: 'Until 2031' },
            { name: 'Code 95', status: 'Valid until 2028', short: 'Until 2028' },
            { name: 'C licence', status: 'Expired on 2 October 2026', short: 'Expired 2 Oct', expired: true }
        ],
        assistant: 'AI assistant',
        title: 'The licence has expired.',
        rest: 'The other documents are in order.',
        ask: 'Request new licence',
        approve: 'Approve anyway'
    }
};

function CheckStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, x, w, docs, applicantY, firstRow, rowH, rowGap, short, bubble, fonts } = layout;
    return (
        <ToolStage W={W} H={H}>
            <ToolWindow win={win} pad={pad} heading={t.heading} sub={t.sub} headingSize={heading} subSize={sub} />

            <div className="absolute flex items-center" style={{ left: u(x), top: u(applicantY), gap: u(9) }}>
                <span className="flex items-center justify-center shrink-0 rounded-full border border-foreground/20 text-foreground/70" style={{ width: u(32), height: u(32), fontSize: u(10.5) }}>BL</span>
                <div className="whitespace-nowrap">
                    <span className="block font-medium text-foreground leading-tight" style={{ fontSize: u(13.5) }}>{t.applicant}</span>
                    <span className="block text-foreground/60 leading-tight" style={{ marginTop: u(2), fontSize: u(11) }}>{t.by}</span>
                </div>
            </div>

            {docs.map((d) => t.docs[d]).map((doc, i) => (
                <div
                    key={doc.name}
                    className={`absolute flex items-center rounded-lg bg-white border whitespace-nowrap ${doc.expired ? 'border-accent' : 'border-foreground/[0.08]'}`}
                    style={{ left: u(x), top: u(firstRow + i * (rowH + rowGap)), width: u(w), height: u(rowH), paddingLeft: u(11), paddingRight: u(11), gap: u(8) }}
                >
                    <FileText strokeWidth={1.5} className="shrink-0 text-foreground/50" style={{ width: u(15), height: u(15) }} />
                    <span className="flex-1 min-w-0 text-foreground" style={{ fontSize: u(fonts.name) }}>{doc.name}</span>
                    <span className={doc.expired ? 'font-medium text-foreground' : 'text-foreground/60'} style={{ fontSize: u(fonts.status) }}>{short ? doc.short : doc.status}</span>
                    {!doc.expired && <SmallCheck />}
                </div>
            ))}

            <AssistantCard bubble={bubble} label={t.assistant}>
                <AssistantTitle bubble={bubble}>{t.title}</AssistantTitle>
                <p className="text-foreground/70" style={{ marginTop: u(5), fontSize: u(bubble.text) }}>{t.rest}</p>
                <AssistantActions bubble={bubble} primary={t.ask} secondary={t.approve} />
            </AssistantCard>
        </ToolStage>
    );
}

export function PortalCheckVisual() {
    const { language } = useLanguage();
    const t = CHECK_TEXT[language];
    return <ToolVisual label={t.label} narrow={<CheckStage layout={CHECK_LAYOUTS.narrow} t={t} />} wide={<CheckStage layout={CHECK_LAYOUTS.wide} t={t} />} />;
}

// ---------- Antwoord op de vragen van uw partners: het antwoord toont enkel wat die partner mag zien ----------

const ASK_LAYOUTS = {
    wide: { ...WINDOWS.wide, bubble: 480, title: 15, text: 12.5, nameW: 64, rowH: 36 },
    narrow: { ...WINDOWS.narrow, bubble: 314, title: 14.5, text: 12.5, nameW: 50, rowH: 36, compact: true }
};

const ASK_TEXT = {
    nl: {
        label: 'Een chat in het portaal. Een onderaannemer vraagt welke ritten er morgen zijn. De AI antwoordt meteen met twee ritten van de eigen chauffeurs, en vermeldt dat die onderaannemer enkel de eigen ritten ziet.',
        heading: 'Klantenportaal',
        assistant: 'AI-assistent',
        placeholder: 'Stel je vraag',
        person: 'Je onderaannemer',
        question: 'Welke ritten hebben we morgen?',
        answer: 'Morgen staan er twee ritten voor jou gepland.',
        rows: [['Bram L.', 'Hasselt → Luik', '06:30'], ['Sara K.', 'Genk → Gent', '07:15']],
        only: 'Je ziet enkel je eigen ritten.'
    },
    en: {
        label: 'A chat in the portal. A subcontractor asks which trips are planned for tomorrow. The AI answers right away with two trips by their own drivers, and notes that this subcontractor only sees their own trips.',
        heading: 'Client portal',
        assistant: 'AI assistant',
        placeholder: 'Ask your question',
        person: 'Your subcontractor',
        question: 'Which trips do we have tomorrow?',
        answer: 'You have two trips planned for tomorrow.',
        rows: [['Bram L.', 'Hasselt → Liège', '06:30'], ['Sara K.', 'Genk → Ghent', '07:15']],
        only: 'You only see your own trips.'
    }
};

function AskStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, bubble, title, text, nameW, rowH, compact } = layout;
    return (
        <ToolStage W={W} H={H}>
            <ChatWindow win={win} pad={pad} heading={t.heading} sub={t.assistant} headingSize={heading} subSize={sub} placeholder={t.placeholder} compact={compact}>
                <ChatFromPerson label={t.person}>{t.question}</ChatFromPerson>

                <ChatFromAi label={t.assistant} width={bubble}>
                    <p className="font-medium text-foreground tracking-tight" style={{ fontSize: u(title), lineHeight: 1.25 }}>{t.answer}</p>
                    <div style={{ marginTop: u(8) }}>
                        {t.rows.map(([name, route, time]) => (
                            <div key={name} className="flex items-center border-t border-foreground/[0.08] whitespace-nowrap" style={{ height: u(rowH), gap: u(8), fontSize: u(text) }}>
                                <span className="shrink-0 text-foreground" style={{ width: u(nameW) }}>{name}</span>
                                <span className="flex-1 min-w-0 text-foreground/60">{route}</span>
                                <span className="shrink-0 text-right font-medium text-foreground">{time}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center border-t border-foreground/[0.08] text-foreground/70" style={{ paddingTop: u(9), gap: u(7), fontSize: u(text) }}>
                        <Lock strokeWidth={1.5} className="shrink-0 text-accent" style={{ width: u(14), height: u(14) }} />
                        {t.only}
                    </div>
                </ChatFromAi>
            </ChatWindow>
        </ToolStage>
    );
}

export function PortalAskVisual() {
    const { language } = useLanguage();
    const t = ASK_TEXT[language];
    return <ToolVisual label={t.label} narrow={<AskStage layout={ASK_LAYOUTS.narrow} t={t} />} wide={<AskStage layout={ASK_LAYOUTS.wide} t={t} />} />;
}

// ---------- Aanvragen bij de juiste persoon: elke aanvraag gaat vanzelf naar de juiste dienst en het juiste dossier ----------

const ROUTE_LAYOUTS = {
    wide: {
        ...WINDOWS.wide,
        x: 42, w: 636, firstRow: 100, rowH: 80, rowGap: 12, stacked: false, leftW: 280,
        noteY: 392
    },
    narrow: {
        ...WINDOWS.narrow,
        // Op gsm per rij enkel de aanvraag en de bestemming, zonder wie ze stuurde en zonder het dossier
        x: 26, w: 348, firstRow: 70, rowH: 56, rowGap: 8, stacked: true, leftW: 348,
        noteY: 272
    }
};

const ROUTE_TEXT = {
    nl: {
        label: 'Drie aanvragen in het portaal. Een nieuwe chauffeur gaat vanzelf naar de planning, een registratie naar de administratie en een factuur naar de boekhouding, elk in het juiste dossier. Niemand moet iets doorsturen.',
        heading: 'Klantenportaal',
        sub: 'Aanvragen',
        rows: [
            { title: 'Nieuwe chauffeur', from: 'Van je onderaannemer', to: 'Planning', dossier: 'Dossier Bram L.' },
            { title: 'Registratie week 45', from: 'Van je klant', to: 'Administratie', dossier: 'Dossier werf Noord' },
            { title: 'Factuur oktober', from: 'Van je leverancier', to: 'Boekhouding', dossier: 'Dossier leverancier' }
        ],
        note: 'Niemand moest iets doorsturen.'
    },
    en: {
        label: 'Three requests in the portal. A new driver goes to planning automatically, a registration to admin and an invoice to accounting, each in the right file. Nobody has to forward anything.',
        heading: 'Client portal',
        sub: 'Requests',
        rows: [
            { title: 'New driver', from: 'From your subcontractor', to: 'Planning', dossier: 'Bram L.\'s file' },
            { title: 'Week 45 registration', from: 'From your client', to: 'Admin', dossier: 'Site North file' },
            { title: 'October invoice', from: 'From your supplier', to: 'Accounting', dossier: 'Supplier file' }
        ],
        note: 'Nobody had to forward anything.'
    }
};

function RouteStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, x, w, firstRow, rowH, rowGap, stacked, leftW, noteY } = layout;
    return (
        <ToolStage W={W} H={H}>
            <ToolWindow win={win} pad={pad} heading={t.heading} sub={t.sub} headingSize={heading} subSize={sub} />

            {t.rows.map((row, i) => {
                const top = firstRow + i * (rowH + rowGap);
                const request = (
                    <>
                        <span className="block font-medium text-foreground leading-tight" style={{ fontSize: u(13) }}>{row.title}</span>
                        <span className="block text-foreground/60 leading-tight" style={{ marginTop: u(3), fontSize: u(11) }}>{row.from}</span>
                    </>
                );
                const target = (
                    <span className="flex items-center" style={{ gap: u(8) }}>
                        <SmallCheck />
                        <span>
                            <span className="block font-medium text-foreground leading-tight" style={{ fontSize: u(13) }}>{row.to}</span>
                            <span className="block text-foreground/60 leading-tight" style={{ marginTop: u(3), fontSize: u(11) }}>{row.dossier}</span>
                        </span>
                    </span>
                );

                // Op gsm staat alles in één kaart, op één regel
                if (stacked) {
                    return (
                        <div key={row.title} className="absolute flex items-center rounded-lg bg-white border border-foreground/[0.08] whitespace-nowrap" style={{ left: u(x), top: u(top), width: u(w), height: u(rowH), paddingLeft: u(12), paddingRight: u(12), gap: u(8) }}>
                            <span className="flex-1 min-w-0 font-medium text-foreground" style={{ fontSize: u(13) }}>{row.title}</span>
                            <ArrowRight strokeWidth={1.5} className="shrink-0 text-foreground/40" style={{ width: u(14), height: u(14) }} />
                            <span className="flex items-center shrink-0 text-foreground" style={{ gap: u(6), fontSize: u(13) }}><SmallCheck />{row.to}</span>
                        </div>
                    );
                }

                return (
                    <React.Fragment key={row.title}>
                        <div className="absolute flex flex-col justify-center rounded-lg bg-white border border-foreground/[0.08] whitespace-nowrap" style={{ left: u(x), top: u(top), width: u(leftW), height: u(rowH), paddingLeft: u(14) }}>
                            {request}
                        </div>
                        <span className="absolute flex items-center justify-center text-foreground/45" style={{ left: u(x + leftW), width: u(w - leftW * 2), top: u(top), height: u(rowH) }}>
                            <ArrowRight strokeWidth={1.5} style={{ width: u(20), height: u(20) }} />
                        </span>
                        <div className="absolute flex items-center rounded-lg bg-white border border-accent whitespace-nowrap" style={{ left: u(x + w - leftW), top: u(top), width: u(leftW), height: u(rowH), paddingLeft: u(14) }}>
                            {target}
                        </div>
                    </React.Fragment>
                );
            })}

            <p className="absolute font-medium text-foreground tracking-tight" style={{ left: u(x), top: u(noteY), fontSize: u(15) }}>{t.note}</p>
        </ToolStage>
    );
}

export function PortalRouteVisual() {
    const { language } = useLanguage();
    const t = ROUTE_TEXT[language];
    return <ToolVisual label={t.label} narrow={<RouteStage layout={ROUTE_LAYOUTS.narrow} t={t} />} wide={<RouteStage layout={ROUTE_LAYOUTS.wide} t={t} />} />;
}

// ---------- Vanzelf opgevolgd: de tijdlijn tot wat ontbrak binnen is, en de mail die vanzelf vertrok ----------

const FOLLOW_LAYOUTS = {
    wide: {
        ...WINDOWS.wide,
        steps: [0, 1, 2, 3],
        line: { x: 42, top: 112, w: 280, rowH: 76 },
        mail: { left: 340, right: 8, top: 150, pad: 16, title: 15 }
    },
    narrow: {
        ...WINDOWS.narrow,
        // Op gsm drie stappen in plaats van vier
        steps: [0, 2, 3],
        line: { x: 26, top: 70, w: 348, rowH: 46 },
        mail: { left: 20, right: 4, top: 214, pad: 14, title: 14.5 }
    }
};

const FOLLOW_TEXT = {
    nl: {
        label: 'Een tijdlijn. De registratie van week 45 ontbreekt nog. Op 9 en 11 november gaat er vanzelf een herinnering naar de partner, op 12 november is de registratie ingediend, zonder telefoontje, en daarna kan de factuur vertrekken.',
        heading: 'Klantenportaal',
        sub: 'Opvolging',
        steps: [
            { date: '9 november', text: 'Herinnering verstuurd', done: true },
            { date: '11 november', text: 'Tweede herinnering verstuurd', done: true },
            { date: '12 november', text: 'Registratie ingediend, zonder telefoontje', done: true },
            { date: 'Volgende stap', text: 'Factuur kan vertrekken', done: false }
        ],
        auto: 'Vanzelf verstuurd',
        subject: 'De registratie van week 45 ontbreekt nog',
        body: 'Vul ze hier in, dan is alles in orde.',
        button: 'Registratie invullen'
    },
    en: {
        label: 'A timeline. The registration for week 45 is still missing. On 9 and 11 November, a reminder goes to the partner automatically. On 12 November the registration is submitted, without a phone call, and then the invoice can go out.',
        heading: 'Client portal',
        sub: 'Follow-up',
        steps: [
            { date: '9 November', text: 'Reminder sent', done: true },
            { date: '11 November', text: 'Second reminder sent', done: true },
            { date: '12 November', text: 'Registration submitted, without a phone call', done: true },
            { date: 'Next step', text: 'Invoice can go out', done: false }
        ],
        auto: 'Sent automatically',
        subject: 'The registration for week 45 is still missing',
        body: 'Fill it in here and you are all set.',
        button: 'Fill in registration'
    }
};

function FollowStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, steps, line, mail } = layout;
    return (
        <ToolStage W={W} H={H}>
            <ToolWindow win={win} pad={pad} heading={t.heading} sub={t.sub} headingSize={heading} subSize={sub} />

            {/* De tijdlijn: de lijn loopt van het eerste tot het laatste bolletje */}
            <div className="absolute" style={{ left: u(line.x), top: u(line.top), width: u(line.w) }}>
                <span aria-hidden="true" className="absolute w-px bg-foreground/15" style={{ left: u(7), top: u(8), bottom: u(line.rowH - 14) }} />
                {steps.map((s) => t.steps[s]).map((step) => (
                    <div key={step.date} className="relative flex items-start" style={{ height: u(line.rowH), gap: u(11) }}>
                        {step.done
                            ? <SmallCheck />
                            : <span className="shrink-0 rounded-full border border-foreground/30 bg-[#fafafa]" style={{ width: u(14), height: u(14) }} />}
                        <span className="min-w-0" style={{ marginTop: u(-2) }}>
                            <span className="block text-foreground/60 leading-tight" style={{ fontSize: u(11) }}>{step.date}</span>
                            <span className={`block leading-snug ${step.done ? 'font-medium text-foreground' : 'text-foreground/60'}`} style={{ marginTop: u(2), fontSize: u(12.5) }}>{step.text}</span>
                        </span>
                    </div>
                ))}
            </div>

            {/* De mail die vanzelf vertrok */}
            <div className="absolute bg-white border border-foreground/[0.07]" style={{ left: u(mail.left), right: u(mail.right), top: u(mail.top), padding: u(mail.pad), borderRadius: u(16), boxShadow: `0 ${u(20)} ${u(46)} ${u(-20)} rgba(15,23,42,0.22)` }}>
                <div className="flex items-center text-foreground/60" style={{ gap: u(6), fontSize: u(11) }}>
                    <Mail strokeWidth={1.5} style={{ width: u(13), height: u(13) }} />{t.auto}
                </div>
                <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(7), fontSize: u(mail.title), lineHeight: 1.25 }}>{t.subject}</p>
                <p className="text-foreground/70" style={{ marginTop: u(6), fontSize: u(12), lineHeight: 1.35 }}>{t.body}</p>
                <span className="inline-block rounded-full bg-foreground text-white font-medium whitespace-nowrap" style={{ marginTop: u(11), padding: `${u(6)} ${u(16)}`, fontSize: u(11.5) }}>{t.button}</span>
            </div>
        </ToolStage>
    );
}

export function PortalFollowVisual() {
    const { language } = useLanguage();
    const t = FOLLOW_TEXT[language];
    return <ToolVisual label={t.label} narrow={<FollowStage layout={FOLLOW_LAYOUTS.narrow} t={t} />} wide={<FollowStage layout={FOLLOW_LAYOUTS.wide} t={t} />} />;
}
