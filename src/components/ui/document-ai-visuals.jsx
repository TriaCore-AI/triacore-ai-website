import React from 'react';
import { ArrowRight, Bell, Check, FileText, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage, ToolWindow, AssistantCard, AssistantTitle, ChatWindow, ChatFromAi, ChatFromPerson } from './tool-visual-parts';

// Drie visuals bij de AI-acties van de tool Documentbeheer, elk met één boodschap. Alle gegevens zijn verzonnen.
// De gedeelde onderdelen staan in tool-visual-parts.jsx.

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
        fonts: { file: 12, seen: 11.5, chip: 11 }
    },
    narrow: {
        ...WINDOWS.narrow,
        x: 26, w: 348, firstRow: 72, rowH: 50, rowGap: 5, chipW: 84, sideBySide: false,
        bubble: { left: 26, right: 6, top: 300, caret: 289, title: 16, text: 12, pad: 14 },
        fonts: { file: 11.5, seen: 10.5, chip: 10 }
    }
};

const SORT_TEXT = {
    nl: {
        label: 'Vier nieuwe bestanden met onduidelijke namen. De AI leest ze, herkent een keuring, een verzekeringsattest en een factuur en zet die in de juiste map. Bij het vierde twijfelt de AI tussen contract en offerte, en vraagt ze het aan een mens.',
        heading: 'Documenten',
        sub: 'Nieuw binnengekomen',
        files: [
            { file: 'scan_0412.pdf', seen: 'Keuring hoogtewerker', folder: 'Keuringen' },
            { file: 'IMG_2087.jpg', seen: 'Verzekeringsattest', folder: 'Verzekeringen' },
            { file: 'doc_nov_final.pdf', seen: 'Factuur leverancier', folder: 'Facturen' },
            { file: 'document (3).pdf', seen: 'Contract of offerte?', folder: 'Nakijken', doubt: true }
        ],
        assistant: 'AI-assistent',
        doubt: 'Ik twijfel: is dit een contract of een offerte?',
        options: ['Contract', 'Offerte']
    },
    en: {
        label: 'Four new files with unclear names. The AI reads them, recognises an inspection, an insurance certificate and an invoice and puts them in the right folder. With the fourth, the AI is unsure between contract and quote, and asks a person.',
        heading: 'Documents',
        sub: 'Just in',
        files: [
            { file: 'scan_0412.pdf', seen: 'Aerial lift inspection', folder: 'Inspections' },
            { file: 'IMG_2087.jpg', seen: 'Insurance certificate', folder: 'Insurance' },
            { file: 'doc_nov_final.pdf', seen: 'Supplier invoice', folder: 'Invoices' },
            { file: 'document (3).pdf', seen: 'Contract or quote?', folder: 'To check', doubt: true }
        ],
        assistant: 'AI assistant',
        doubt: 'I am unsure: is this a contract or a quote?',
        options: ['Contract', 'Quote']
    }
};

function SortRow({ item, top, layout }) {
    const { x, w, rowH, chipW, sideBySide, fonts } = layout;
    const { file, seen, folder, doubt } = item;
    return (
        <div
            className={`absolute flex items-center rounded-lg bg-white border whitespace-nowrap ${doubt ? 'border-accent' : 'border-foreground/[0.08]'}`}
            style={{ left: u(x), top: u(top), width: u(w), height: u(rowH), paddingLeft: u(10), paddingRight: u(10), gap: u(8) }}
        >
            <FileText strokeWidth={1.5} className="shrink-0 text-foreground/50" style={{ width: u(15), height: u(15) }} />
            {sideBySide ? (
                <>
                    <span className="shrink-0 text-foreground/60" style={{ width: u(126), fontSize: u(fonts.file) }}>{file}</span>
                    <span className="flex-1 min-w-0 font-medium text-foreground" style={{ fontSize: u(fonts.seen + 1) }}>{seen}</span>
                </>
            ) : (
                <span className="flex-1 min-w-0">
                    <span className="block font-medium text-foreground leading-tight" style={{ fontSize: u(fonts.file) }}>{seen}</span>
                    <span className="block text-foreground/60 leading-tight" style={{ marginTop: u(2), fontSize: u(fonts.seen) }}>{file}</span>
                </span>
            )}
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

// ---------- Gegevens uitlezen: het document, wat de AI eruit haalt, en het seintje voor de vervaldag ----------

const READ_LAYOUTS = {
    wide: {
        ...WINDOWS.wide,
        paper: { x: 42, y: 92, w: 296, h: 368, pad: 20, title: 18, filler: 3 },
        panel: { left: 366, right: 8, top: 112, pad: 14, rowH: 33, rows: 5 }
    },
    narrow: {
        ...WINDOWS.narrow,
        paper: { x: 26, y: 72, w: 348, h: 124, pad: 12, title: 15, filler: 0, brief: true },
        panel: { left: 26, right: 6, top: 208, pad: 14, rowH: 30, rows: 4 }
    }
};

const READ_TEXT = {
    nl: {
        label: 'Een keuringsattest van hoogtewerker 2. De AI haalt het soort document, het toestel, de keuringsdatum, de vervaldag en de kostprijs eruit, en geeft op 14 november een seintje omdat de keuring op 14 december vervalt.',
        heading: 'Documenten',
        sub: 'Keuring hoogtewerker 2',
        paper: 'Keuringsattest',
        device: 'Toestel',
        deviceValue: 'Hoogtewerker 2',
        done: 'Gekeurd op',
        doneValue: '14 juni 2026',
        until: 'Geldig tot',
        untilValue: '14 december 2026',
        cost: 'Kostprijs',
        costValue: '€ 185,00',
        kind: 'Soort',
        kindValue: 'Keuring',
        expires: 'Vervalt op',
        assistant: 'AI-assistent',
        title: 'Dit heb ik uit het document gehaald.',
        reminder: 'U krijgt op 14 november een seintje, een maand voor de keuring vervalt.'
    },
    en: {
        label: 'An inspection certificate for aerial lift 2. The AI pulls out the document type, the device, the inspection date, the expiry date and the cost, and sends a reminder on 14 November because the inspection expires on 14 December.',
        heading: 'Documents',
        sub: 'Aerial lift inspection 2',
        paper: 'Inspection certificate',
        device: 'Device',
        deviceValue: 'Aerial lift 2',
        done: 'Inspected on',
        doneValue: '14 June 2026',
        until: 'Valid until',
        untilValue: '14 December 2026',
        cost: 'Cost',
        costValue: '€ 185.00',
        kind: 'Type',
        kindValue: 'Inspection',
        expires: 'Expires on',
        assistant: 'AI assistant',
        title: 'This is what I found in the document.',
        reminder: 'You will get a reminder on 14 November, a month before the inspection expires.'
    }
};

function FillerLines({ count }) {
    return (
        <div style={{ marginTop: u(10), marginBottom: u(10) }}>
            {Array.from({ length: count }, (_, i) => (
                <span key={i} aria-hidden="true" className="block rounded-full bg-foreground/[0.07]" style={{ height: u(5), marginTop: u(6), width: i === count - 1 ? '62%' : '100%' }} />
            ))}
        </div>
    );
}

// Eén gegeven op het document, met de waarde gemarkeerd zoals de AI ze las
function PaperField({ label, value, size }) {
    return (
        <div className="flex items-center justify-between whitespace-nowrap" style={{ marginTop: u(7), fontSize: u(size) }}>
            <span className="text-foreground/60">{label}</span>
            <span className="rounded bg-accent/15 text-foreground" style={{ padding: `${u(2)} ${u(6)}` }}>{value}</span>
        </div>
    );
}

function ReadStage({ layout, t }) {
    const { W, H, win, pad, heading, sub, paper, panel } = layout;
    const fields = [[t.kind, t.kindValue], [t.device, t.deviceValue], [t.done, t.doneValue], [t.expires, t.untilValue], [t.cost, t.costValue]];
    const shown = panel.rows === 5 ? fields : fields.slice(1);
    return (
        <ToolStage W={W} H={H}>
            <ToolWindow win={win} pad={pad} heading={t.heading} sub={t.sub} headingSize={heading} subSize={sub} />

            {/* Het document zelf. Op gsm toont het enkel wat in de kleine ruimte past */}
            <div className="absolute overflow-hidden bg-white border border-foreground/[0.08]" style={{ left: u(paper.x), top: u(paper.y), width: u(paper.w), height: u(paper.h), padding: u(paper.pad), borderRadius: u(6) }}>
                <p className="font-medium text-foreground tracking-tight" style={{ fontSize: u(paper.title) }}>{t.paper}</p>
                {paper.filler > 0 && <FillerLines count={paper.filler} />}
                {!paper.brief && <PaperField label={t.device} value={t.deviceValue} size={12} />}
                {!paper.brief && <PaperField label={t.done} value={t.doneValue} size={12} />}
                <PaperField label={t.until} value={t.untilValue} size={12} />
                <PaperField label={t.cost} value={t.costValue} size={12} />
                {paper.filler > 0 && <FillerLines count={paper.filler + 1} />}
            </div>

            {/* Wat de AI eruit haalde */}
            <div className="absolute bg-white border border-foreground/[0.07]" style={{ left: u(panel.left), right: u(panel.right), top: u(panel.top), padding: u(panel.pad), borderRadius: u(16), boxShadow: `0 ${u(20)} ${u(46)} ${u(-20)} rgba(15,23,42,0.22)` }}>
                <div className="flex items-center font-medium text-accent" style={{ gap: u(5), fontSize: u(11.5) }}>
                    <Sparkles strokeWidth={1.5} style={{ width: u(13), height: u(13) }} />{t.assistant}
                </div>
                <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(6), marginBottom: u(8), fontSize: u(15), lineHeight: 1.25 }}>{t.title}</p>
                {shown.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between border-t border-foreground/[0.08] whitespace-nowrap" style={{ height: u(panel.rowH) }}>
                        <span className="text-foreground/60" style={{ fontSize: u(11.5) }}>{label}</span>
                        <span className="font-medium text-foreground" style={{ fontSize: u(12) }}>{value}</span>
                    </div>
                ))}
                <div className="flex items-start rounded-lg border border-accent" style={{ marginTop: u(6), padding: `${u(8)} ${u(10)}`, gap: u(8) }}>
                    <Bell strokeWidth={1.5} className="shrink-0 text-accent" style={{ marginTop: u(1), width: u(14), height: u(14) }} />
                    <span className="text-foreground" style={{ fontSize: u(11.5), lineHeight: 1.3 }}>{t.reminder}</span>
                </div>
            </div>
        </ToolStage>
    );
}

export function DocumentReadVisual() {
    const { language } = useLanguage();
    const t = READ_TEXT[language];
    return <ToolVisual label={t.label} narrow={<ReadStage layout={READ_LAYOUTS.narrow} t={t} />} wide={<ReadStage layout={READ_LAYOUTS.wide} t={t} />} />;
}

// ---------- Stel vragen aan uw documenten: de vraag en meteen het antwoord, met de documenten erbij ----------

const ASK_LAYOUTS = {
    wide: { ...WINDOWS.wide, bubble: 480, title: 15, text: 12.5, rowH: 36 },
    narrow: { ...WINDOWS.narrow, bubble: 314, title: 14.5, text: 12, rowH: 34 }
};

const ASK_TEXT = {
    nl: {
        label: 'Een chat. Een medewerker vraagt welke keuringen volgende maand vervallen. De AI antwoordt meteen met drie keuringen, hun vervaldag en de documenten om te openen.',
        heading: 'Documenten',
        assistant: 'AI-assistent',
        placeholder: 'Stel een vraag aan uw documenten',
        person: 'Uw medewerker',
        question: 'Welke keuringen vervallen volgende maand?',
        answer: 'Volgende maand vervallen drie keuringen.',
        open: 'Open',
        docs: [['Keuring heftruck 3', '4 dec'], ['Keuring kraan 14', '11 dec'], ['Keuring hoogtewerker 2', '14 dec']]
    },
    en: {
        label: 'A chat. An employee asks which inspections expire next month. The AI answers right away with three inspections, their expiry dates and the documents to open.',
        heading: 'Documents',
        assistant: 'AI assistant',
        placeholder: 'Ask your documents a question',
        person: 'Your employee',
        question: 'Which inspections expire next month?',
        answer: 'Three inspections expire next month.',
        open: 'Open',
        docs: [['Forklift inspection 3', '4 Dec'], ['Crane inspection 14', '11 Dec'], ['Aerial lift inspection 2', '14 Dec']]
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
                        {t.docs.map(([name, date]) => (
                            <div key={name} className="flex items-center border-t border-foreground/[0.08] whitespace-nowrap" style={{ height: u(rowH), gap: u(8), fontSize: u(text) }}>
                                <FileText strokeWidth={1.5} className="shrink-0 text-foreground/60" style={{ width: u(14), height: u(14) }} />
                                <span className="flex-1 min-w-0 text-foreground">{name}</span>
                                <span className="shrink-0 text-foreground/60">{date}</span>
                                <span className="shrink-0 text-right text-foreground underline underline-offset-2" style={{ width: u(36) }}>{t.open}</span>
                            </div>
                        ))}
                    </div>
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
