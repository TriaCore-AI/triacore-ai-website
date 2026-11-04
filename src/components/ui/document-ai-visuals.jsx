import React from 'react';
import { ArrowRight, Bell, Check, FileText, Mail } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage, ToolWindow, AssistantCard, AssistantTitle, ChatWindow, ChatFromAi, ChatFromPerson } from './tool-visual-parts';

// De vier visuals bij de kaartjes van de tool Documentbeheer, elk met één boodschap: twee met AI en twee met
// gewone automatisering (daar staat bewust geen AI-assistent in). Alle gegevens zijn verzonnen. De gedeelde
// onderdelen staan in tool-visual-parts.jsx.

const WINDOWS = {
    wide: { W: 720, H: 540, win: { x: 26, y: 26, w: 668, h: 450 }, pad: 16, heading: 22, sub: 14 },
    narrow: { W: 400, H: 500, win: { x: 14, y: 14, w: 372, h: 450 }, pad: 12, heading: 21, sub: 13 }
};

function SmallCheck() {
    return (
        <span className="flex items-center justify-center shrink-0 rounded-full bg-accent text-white" style={{ width: u(14), height: u(14) }}>
            <Check strokeWidth={3} style={{ width: u(9), height: u(9) }} />
        </span>
    );
}

// ---------- Automatisch ordenen: onduidelijke bestanden, wat de AI erin leest, en de juiste map ----------

const SORT_LAYOUTS = {
    wide: {
        ...WINDOWS.wide,
        x: 42, w: 636, firstRow: 88, rowH: 46, rowGap: 6, chipW: 104, sideBySide: true,
        // Het puntje van de kaart wijst naar het document waar de AI over twijfelt
        bubble: { left: 250, right: 8, top: 310, caret: 342, title: 16, text: 12, pad: 14 },
        fonts: { file: 12, seen: 12.5, data: 10.5, chip: 11 }
    },
    narrow: {
        ...WINDOWS.narrow,
        x: 26, w: 348, firstRow: 72, rowH: 50, rowGap: 5, chipW: 84, sideBySide: false,
        bubble: { left: 26, right: 6, top: 300, caret: 296, title: 16, text: 12, pad: 14 },
        fonts: { file: 11.5, seen: 11.5, data: 10.5, chip: 10 }
    }
};

const SORT_TEXT = {
    nl: {
        label: 'Vier nieuwe bestanden met onduidelijke namen. De AI leest ze, herkent een bon, een rijbewijs en een contract, haalt de gegevens eruit en zet ze in de juiste map. Bij het vierde twijfelt de AI tussen contract en offerte, en vraagt ze het aan een mens.',
        heading: 'Documenten',
        sub: 'Nieuw binnengekomen',
        files: [
            { file: 'scan_0412.pdf', seen: 'Bon 20461', data: 'Werf Noord, 18,4 t', folder: 'Bonnen' },
            { file: 'IMG_2087.jpg', seen: 'Rijbewijs Tom V.', data: 'Geldig tot 2031', folder: 'Rijbewijzen' },
            { file: 'doc_nov_final.pdf', seen: 'Contract leverancier', data: 'Loopt tot 30 juni 2027', folder: 'Contracten' },
            { file: 'document (3).pdf', seen: 'Contract of offerte?', data: 'Nog na te kijken', folder: 'Nakijken', doubt: true }
        ],
        assistant: 'AI-assistent',
        doubt: 'Ik twijfel: is dit een contract of een offerte?',
        options: ['Contract', 'Offerte']
    },
    en: {
        label: 'Four new files with unclear names. The AI reads them, recognises a slip, a licence and a contract, pulls out the data and puts them in the right folder. With the fourth, the AI is unsure between contract and quote, and asks a person.',
        heading: 'Documents',
        sub: 'Just in',
        files: [
            { file: 'scan_0412.pdf', seen: 'Slip 20461', data: 'Site North, 18.4 t', folder: 'Slips' },
            { file: 'IMG_2087.jpg', seen: 'Licence Tom V.', data: 'Valid until 2031', folder: 'Licences' },
            { file: 'doc_nov_final.pdf', seen: 'Supplier contract', data: 'Runs until 30 June 2027', folder: 'Contracts' },
            { file: 'document (3).pdf', seen: 'Contract or quote?', data: 'Still to check', folder: 'To check', doubt: true }
        ],
        assistant: 'AI assistant',
        doubt: 'I am unsure: is this a contract or a quote?',
        options: ['Contract', 'Quote']
    }
};

function SortRow({ item, top, layout }) {
    const { x, w, rowH, chipW, sideBySide, fonts } = layout;
    const { file, seen, data, folder, doubt } = item;
    return (
        <div
            className={`absolute flex items-center rounded-lg bg-white border whitespace-nowrap ${doubt ? 'border-accent' : 'border-foreground/[0.08]'}`}
            style={{ left: u(x), top: u(top), width: u(w), height: u(rowH), paddingLeft: u(10), paddingRight: u(10), gap: u(8) }}
        >
            <FileText strokeWidth={1.5} className="shrink-0 text-foreground/50" style={{ width: u(15), height: u(15) }} />
            {/* Op gsm is er geen plaats voor de naam van het bestand */}
            {sideBySide && <span className="shrink-0 text-foreground/60" style={{ width: u(126), fontSize: u(fonts.file) }}>{file}</span>}
            <span className="flex-1 min-w-0">
                <span className="block font-medium text-foreground leading-tight" style={{ fontSize: u(fonts.seen) }}>{seen}</span>
                <span className="block text-foreground/60 leading-tight" style={{ marginTop: u(2), fontSize: u(fonts.data) }}>{data}</span>
            </span>
            <ArrowRight strokeWidth={1.5} className="shrink-0 text-foreground/40" style={{ width: u(13), height: u(13) }} />
            <span
                className={`flex items-center justify-center shrink-0 rounded-md ${doubt ? 'border border-accent font-medium text-accent' : 'bg-foreground/[0.05] text-foreground'}`}
                style={{ width: u(chipW), height: u(26), fontSize: u(fonts.chip) }}
            >
                {folder}
            </span>
            {/* Op gsm is er geen plaats voor het vinkje */}
            {sideBySide && <span className="flex justify-center shrink-0" style={{ width: u(14) }}>{!doubt && <SmallCheck />}</span>}
        </div>
    );
}

function SortStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, firstRow, rowH, rowGap, bubble } = layout;
    return (
        <ToolStage W={W} H={H}>
            <ToolWindow win={win} pad={pad} heading={t.heading} sub={t.sub} headingSize={heading} subSize={sub} />
            {t.files.map((item, i) => (
                <SortRow key={item.file} item={item} top={firstRow + i * (rowH + rowGap)} layout={layout} />
            ))}
            <AssistantCard bubble={bubble} label={t.assistant}>
                <AssistantTitle bubble={bubble}>{t.doubt}</AssistantTitle>
                <div className="flex" style={{ marginTop: u(10), gap: u(8) }}>
                    {t.options.map((option) => (
                        <span key={option} className="flex items-center justify-center rounded-md border border-foreground/15 text-foreground" style={{ width: u(84), height: u(28), fontSize: u(bubble.text) }}>{option}</span>
                    ))}
                </div>
            </AssistantCard>
        </ToolStage>
    );
}

export function DocumentSortVisual() {
    const { language } = useLanguage();
    const t = SORT_TEXT[language];
    return <ToolVisual label={t.label} narrow={<SortStage layout={SORT_LAYOUTS.narrow} t={t} />} wide={<SortStage layout={SORT_LAYOUTS.wide} t={t} />} />;
}

// ---------- Stel vragen aan uw documenten: de vraag en meteen het juiste document ----------

const ASK_LAYOUTS = {
    wide: { ...WINDOWS.wide, bubble: 480, title: 15, text: 12.5, rowH: 36 },
    narrow: { ...WINDOWS.narrow, bubble: 314, title: 14.5, text: 12, rowH: 34 }
};

const ASK_TEXT = {
    nl: {
        label: 'Een chat. Een medewerker vraagt waar de bon van werf Noord van maandag is. De AI toont meteen de juiste bon, met het nummer, de datum en het gewicht, en een knop om ze te openen.',
        heading: 'Documenten',
        assistant: 'AI-assistent',
        placeholder: 'Stel een vraag aan uw documenten',
        person: 'Uw medewerker',
        question: 'Waar is de bon van werf Noord van maandag?',
        answer: 'Dit is de bon die u zoekt.',
        rows: [['Bon', '20461'], ['Datum', 'Maandag 2 november'], ['Gewicht', '18,4 t']],
        open: 'Open de bon'
    },
    en: {
        label: 'A chat. An employee asks where Monday\'s slip for Site North is. The AI shows the right slip right away, with the number, date and weight, and a button to open it.',
        heading: 'Documents',
        assistant: 'AI assistant',
        placeholder: 'Ask your documents a question',
        person: 'Your employee',
        question: 'Where is Monday\'s slip for Site North?',
        answer: 'This is the slip you are looking for.',
        rows: [['Slip', '20461'], ['Date', 'Monday 2 November'], ['Weight', '18.4 t']],
        open: 'Open the slip'
    }
};

function AskStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, bubble, title, text, rowH } = layout;
    return (
        <ToolStage W={W} H={H}>
            <ChatWindow win={win} pad={pad} heading={t.heading} sub={t.assistant} headingSize={heading} subSize={sub} placeholder={t.placeholder}>
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
                    <span className="inline-flex items-center rounded-md bg-foreground text-white font-medium whitespace-nowrap" style={{ marginTop: u(6), padding: `${u(6)} ${u(12)}`, gap: u(6), fontSize: u(11.5) }}>
                        <FileText strokeWidth={1.75} style={{ width: u(13), height: u(13) }} />{t.open}
                    </span>
                </ChatFromAi>
            </ChatWindow>
        </ToolStage>
    );
}

export function DocumentAskVisual() {
    const { language } = useLanguage();
    const t = ASK_TEXT[language];
    return <ToolVisual label={t.label} narrow={<AskStage layout={ASK_LAYOUTS.narrow} t={t} />} wide={<AskStage layout={ASK_LAYOUTS.wide} t={t} />} />;
}

// ---------- Wat ontbreekt, meteen zichtbaar: per chauffeur en per document een vinkje of een leeg vak ----------

const MISSING_LAYOUTS = {
    wide: {
        ...WINDOWS.wide,
        x: 42, w: 636, top: 80, headH: 30, rowH: 50, nameW: 96, columns: 4,
        summary: { top: 386, h: 62 },
        fonts: { head: 11.5, name: 12.5, tag: 11, title: 15, text: 12 }
    },
    narrow: {
        ...WINDOWS.narrow,
        x: 26, w: 348, top: 62, headH: 30, rowH: 46, nameW: 58, columns: 3,
        summary: { top: 330, h: 104 },
        fonts: { head: 10.5, name: 11.5, tag: 10, title: 14.5, text: 11.5 }
    }
};

const MISSING_TEXT = {
    nl: {
        label: 'Een overzicht met vijf chauffeurs en hun documenten. Bijna overal staat een vinkje, maar de code 95 van Els M. en het contract van Jan R. ontbreken.',
        heading: 'Documenten',
        sub: 'Wat ontbreekt',
        columns: ['Rijbewijs', 'Code 95', 'Contract', 'Medische keuring'],
        missing: 'Ontbreekt',
        title: 'Twee documenten ontbreken.',
        text: 'De code 95 van Els M. en het contract van Jan R.'
    },
    en: {
        label: 'An overview of five drivers and their documents. Almost everything has a tick, but the code 95 of Els M. and the contract of Jan R. are missing.',
        heading: 'Documents',
        sub: 'What is missing',
        columns: ['Licence', 'Code 95', 'Contract', 'Medical check'],
        missing: 'Missing',
        title: 'Two documents are missing.',
        text: 'The code 95 of Els M. and the contract of Jan R.'
    }
};

// Per chauffeur de kolommen die ontbreken
const STAFF = [
    { name: 'Tom V.', missing: [] },
    { name: 'Karim B.', missing: [] },
    { name: 'Els M.', missing: [1] },
    { name: 'Jan R.', missing: [2] },
    { name: 'Wim P.', missing: [] }
];

function MissingStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, x, w, top, headH, rowH, nameW, columns, summary, fonts } = layout;
    const shown = t.columns.slice(0, columns);
    const template = `${u(nameW)} repeat(${columns}, 1fr)`;
    return (
        <ToolStage W={W} H={H}>
            <ToolWindow win={win} pad={pad} heading={t.heading} sub={t.sub} headingSize={heading} subSize={sub} />

            <div className="absolute" style={{ left: u(x), top: u(top), width: u(w) }}>
                <div className="grid items-center text-foreground/60 text-center" style={{ gridTemplateColumns: template, height: u(headH), fontSize: u(fonts.head) }}>
                    <span />
                    {shown.map((col) => <span key={col} className="whitespace-nowrap">{col}</span>)}
                </div>
                {STAFF.map((person) => (
                    <div key={person.name} className="grid items-center border-t border-foreground/[0.08]" style={{ gridTemplateColumns: template, height: u(rowH) }}>
                        <span className="font-medium text-foreground whitespace-nowrap" style={{ fontSize: u(fonts.name) }}>{person.name}</span>
                        {shown.map((col, c) => (
                            <span key={col} className="flex justify-center">
                                {person.missing.includes(c)
                                    ? <span className="flex items-center rounded-md border border-accent font-medium text-foreground whitespace-nowrap" style={{ height: u(26), paddingLeft: u(8), paddingRight: u(8), fontSize: u(fonts.tag) }}>{t.missing}</span>
                                    : <SmallCheck />}
                            </span>
                        ))}
                    </div>
                ))}
            </div>

            <div className="absolute flex flex-col justify-center rounded-lg bg-white border border-foreground/[0.08]" style={{ left: u(x), top: u(summary.top), width: u(w), height: u(summary.h), paddingLeft: u(14), paddingRight: u(14) }}>
                <p className="font-medium text-foreground tracking-tight" style={{ fontSize: u(fonts.title), lineHeight: 1.25 }}>{t.title}</p>
                <p className="text-foreground/70" style={{ marginTop: u(3), fontSize: u(fonts.text), lineHeight: 1.3 }}>{t.text}</p>
            </div>
        </ToolStage>
    );
}

export function DocumentMissingVisual() {
    const { language } = useLanguage();
    const t = MISSING_TEXT[language];
    return <ToolVisual label={t.label} narrow={<MissingStage layout={MISSING_LAYOUTS.narrow} t={t} />} wide={<MissingStage layout={MISSING_LAYOUTS.wide} t={t} />} />;
}

// ---------- Vervaldagen opgevolgd: wat binnenkort vervalt, met het seintje dat vanzelf vertrekt ----------

const EXPIRY_LAYOUTS = {
    wide: {
        ...WINDOWS.wide,
        x: 42, w: 636, firstRow: 88, rowH: 56, rowGap: 6, stacked: false,
        mail: { left: 250, right: 8, top: 298, pad: 16, title: 15 },
        fonts: { name: 13, date: 12, status: 11.5 }
    },
    narrow: {
        ...WINDOWS.narrow,
        x: 26, w: 348, firstRow: 72, rowH: 58, rowGap: 5, stacked: true,
        mail: { left: 26, right: 6, top: 274, pad: 14, title: 14.5 },
        fonts: { name: 12, date: 11.5, status: 10.5 }
    }
};

const EXPIRY_TEXT = {
    nl: {
        label: 'Een lijst met wat binnenkort vervalt: de keuring van heftruck 3 op 4 december, het rijbewijs van Karim B. op 9 december en een contract op 31 januari. Voor elk ervan vertrekt een maand op voorhand vanzelf een seintje.',
        heading: 'Documenten',
        sub: 'Vervaldagen',
        items: [
            { name: 'Keuring heftruck 3', date: '4 december 2026', status: 'Seintje verstuurd', sent: true },
            { name: 'Rijbewijs Karim B.', date: '9 december 2026', status: 'Seintje op 9 november' },
            { name: 'Contract leverancier', date: '31 januari 2027', status: 'Seintje op 31 december' }
        ],
        auto: 'Vanzelf verstuurd',
        subject: 'De keuring van heftruck 3 vervalt op 4 december',
        body: 'U hebt nog een maand om de nieuwe keuring in te plannen.'
    },
    en: {
        label: 'A list of what expires soon: the inspection of forklift 3 on 4 December, the licence of Karim B. on 9 December and a contract on 31 January. For each of them a reminder goes out automatically a month in advance.',
        heading: 'Documents',
        sub: 'Expiry dates',
        items: [
            { name: 'Forklift 3 inspection', date: '4 December 2026', status: 'Reminder sent', sent: true },
            { name: 'Licence Karim B.', date: '9 December 2026', status: 'Reminder on 9 November' },
            { name: 'Supplier contract', date: '31 January 2027', status: 'Reminder on 31 December' }
        ],
        auto: 'Sent automatically',
        subject: 'The inspection of forklift 3 expires on 4 December',
        body: 'You have one more month to schedule the new inspection.'
    }
};

function ExpiryStatus({ item, size }) {
    return (
        <span className="flex items-center shrink-0 whitespace-nowrap" style={{ gap: u(6), fontSize: u(size) }}>
            {item.sent ? <SmallCheck /> : <Bell strokeWidth={1.5} className="shrink-0 text-foreground/50" style={{ width: u(14), height: u(14) }} />}
            <span className={item.sent ? 'font-medium text-foreground' : 'text-foreground/60'}>{item.status}</span>
        </span>
    );
}

function ExpiryStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, x, w, firstRow, rowH, rowGap, stacked, mail, fonts } = layout;
    return (
        <ToolStage W={W} H={H}>
            <ToolWindow win={win} pad={pad} heading={t.heading} sub={t.sub} headingSize={heading} subSize={sub} />

            {t.items.map((item, i) => (
                <div
                    key={item.name}
                    className={`absolute flex items-center rounded-lg bg-white border whitespace-nowrap ${item.sent ? 'border-accent' : 'border-foreground/[0.08]'}`}
                    style={{ left: u(x), top: u(firstRow + i * (rowH + rowGap)), width: u(w), height: u(rowH), paddingLeft: u(12), paddingRight: u(12), gap: u(10) }}
                >
                    {stacked ? (
                        <span className="flex-1 min-w-0">
                            <span className="flex items-center justify-between" style={{ gap: u(8) }}>
                                <span className="font-medium text-foreground" style={{ fontSize: u(fonts.name) }}>{item.name}</span>
                                <span className="text-foreground/60" style={{ fontSize: u(fonts.date) }}>{item.date}</span>
                            </span>
                            <span className="block" style={{ marginTop: u(5) }}><ExpiryStatus item={item} size={fonts.status} /></span>
                        </span>
                    ) : (
                        <>
                            <span className="flex-1 min-w-0 font-medium text-foreground" style={{ fontSize: u(fonts.name) }}>{item.name}</span>
                            <span className="shrink-0 text-foreground/60" style={{ width: u(120), fontSize: u(fonts.date) }}>{item.date}</span>
                            <span className="flex justify-start shrink-0" style={{ width: u(170) }}><ExpiryStatus item={item} size={fonts.status} /></span>
                        </>
                    )}
                </div>
            ))}

            {/* Het seintje dat al vertrokken is */}
            <div className="absolute bg-white border border-foreground/[0.07]" style={{ left: u(mail.left), right: u(mail.right), top: u(mail.top), padding: u(mail.pad), borderRadius: u(16), boxShadow: `0 ${u(20)} ${u(46)} ${u(-20)} rgba(15,23,42,0.22)` }}>
                <div className="flex items-center text-foreground/60" style={{ gap: u(6), fontSize: u(11) }}>
                    <Mail strokeWidth={1.5} style={{ width: u(13), height: u(13) }} />{t.auto}
                </div>
                <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(7), fontSize: u(mail.title), lineHeight: 1.25 }}>{t.subject}</p>
                <p className="text-foreground/70" style={{ marginTop: u(5), fontSize: u(12), lineHeight: 1.35 }}>{t.body}</p>
            </div>
        </ToolStage>
    );
}

export function DocumentExpiryVisual() {
    const { language } = useLanguage();
    const t = EXPIRY_TEXT[language];
    return <ToolVisual label={t.label} narrow={<ExpiryStage layout={EXPIRY_LAYOUTS.narrow} t={t} />} wide={<ExpiryStage layout={EXPIRY_LAYOUTS.wide} t={t} />} />;
}
