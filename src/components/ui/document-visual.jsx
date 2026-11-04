import React from 'react';
import { Check, FileText, FolderPlus, Sparkles, Upload } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage, ToolWindow, HeaderButton, AssistantCard, AssistantTitle, AssistantActions, FloatingCard } from './tool-visual-parts';

// De visual van de tool Documentbeheer: een archief met mappen en documenten. Uit de knop AI-assistent komt
// het antwoord op een vraag, met de documenten erbij. Linksonder hangt een nieuw document dat de AI zelf in
// de juiste map zette en waaruit ze de vervaldatum las. Dezelfde opbouw als Planning; alle gegevens zijn
// verzonnen.
const LAYOUTS = {
    wide: {
        W: 720, H: 540,
        win: { x: 26, y: 26, w: 668, h: 450 },
        pad: 16, sidebarW: 108, rowH: 44, listY: 88,
        selected: 6,
        bubble: { left: 394, right: 8, top: 84, caret: 50, title: 20, text: 11, pad: 14 },
        floating: { left: 176, top: 418, width: 214 },
        fonts: { name: 11, meta: 10, heading: 22, sub: 14 }
    },
    narrow: {
        W: 400, H: 500,
        win: { x: 14, y: 14, w: 372, h: 450 },
        pad: 12, sidebarW: 0, rowH: 52, listY: 74,
        selected: null,
        bubble: { left: 26, right: 6, top: 72, caret: 298, title: 23, text: 12, pad: 16 },
        fonts: { name: 12.5, meta: 11, heading: 21, sub: 13 }
    }
};

const TEXT = {
    nl: {
        label: 'Documentarchief met mappen en een lijst keuringen. De AI-assistent beantwoordt de vraag welke keuringen volgende maand vervallen met drie documenten. Een nieuw document is automatisch in de juiste map gezet, met de vervaldatum erbij.',
        heading: 'Documenten',
        sub: 'Keuringen',
        assistant: 'AI-assistent',
        upload: 'Uploaden',
        newFolder: 'Nieuwe map',
        folders: ['Keuringen', 'Contracten', 'Facturen', 'Verzekeringen', 'Personeel', 'Leveranciers'],
        columns: ['Naam', 'Toegevoegd', 'Vervalt'],
        question: 'Welke keuringen vervallen volgende maand?',
        answer: 'Drie keuringen vervallen in december.',
        open: 'Open de documenten',
        ask: 'Stel een andere vraag',
        sorted: 'Automatisch geordend',
        folderLabel: 'Map',
        expiresLabel: 'Vervalt op',
        // Naam, toegevoegd, vervalt
        documents: [
            ['Keuring heftruck 3.pdf', '12 nov 2025', '4 dec 2026'],
            ['Keuring kraan 14.pdf', '3 dec 2025', '11 dec 2026'],
            ['Keuring schaarlift 1.pdf', '20 jan 2026', '22 jan 2027'],
            ['Keuring graafmachine 7.pdf', '6 feb 2026', '9 feb 2027'],
            ['Keuring kraan 9.pdf', '2 mrt 2026', '3 mrt 2027'],
            ['Keuring heftruck 5.pdf', '15 apr 2026', '18 apr 2027'],
            ['Keuring hoogtewerker 2.pdf', 'Vandaag', '14 dec 2026'],
            ['Keuring vrachtwagen 4.pdf', '4 mei 2026', '6 mei 2027']
        ],
        expiring: [0, 1, 6]
    },
    en: {
        label: 'Document archive with folders and a list of inspections. The AI assistant answers which inspections expire next month with three documents. A new document was automatically placed in the right folder, with its expiry date.',
        heading: 'Documents',
        sub: 'Inspections',
        assistant: 'AI assistant',
        upload: 'Upload',
        newFolder: 'New folder',
        folders: ['Inspections', 'Contracts', 'Invoices', 'Insurance', 'Staff', 'Suppliers'],
        columns: ['Name', 'Added', 'Expires'],
        question: 'Which inspections expire next month?',
        answer: 'Three inspections expire in December.',
        open: 'Open the documents',
        ask: 'Ask another question',
        sorted: 'Sorted automatically',
        folderLabel: 'Folder',
        expiresLabel: 'Expires on',
        documents: [
            ['Inspection forklift 3.pdf', '12 Nov 2025', '4 Dec 2026'],
            ['Inspection crane 14.pdf', '3 Dec 2025', '11 Dec 2026'],
            ['Inspection scissor lift 1.pdf', '20 Jan 2026', '22 Jan 2027'],
            ['Inspection excavator 7.pdf', '6 Feb 2026', '9 Feb 2027'],
            ['Inspection crane 9.pdf', '2 Mar 2026', '3 Mar 2027'],
            ['Inspection forklift 5.pdf', '15 Apr 2026', '18 Apr 2027'],
            ['Inspection aerial lift 2.pdf', 'Today', '14 Dec 2026'],
            ['Inspection truck 4.pdf', '4 May 2026', '6 May 2027']
        ],
        expiring: [0, 1, 6]
    }
};

// Eén rij in de lijst: op gsm enkel de naam en de vervaldatum
function DocumentRow({ doc, selected, height, fonts, compact }) {
    const [name, added, expires] = doc;
    return (
        <div
            className={`grid items-center ${selected ? 'rounded-md border border-accent bg-white' : 'border-t border-foreground/[0.08]'}`}
            style={{ height: u(height), gridTemplateColumns: compact ? '1fr auto' : `1fr ${u(100)} ${u(84)}`, paddingLeft: u(4), paddingRight: u(4) }}
        >
            <span className="flex items-center whitespace-nowrap text-foreground" style={{ gap: u(6), fontSize: u(fonts.name) }}>
                <FileText strokeWidth={1.5} className="shrink-0 text-foreground/50" style={{ width: u(12), height: u(12) }} />
                {name}
            </span>
            {!compact && <span className="whitespace-nowrap text-foreground/50" style={{ fontSize: u(fonts.meta) }}>{added}</span>}
            <span className="whitespace-nowrap text-foreground/50" style={{ fontSize: u(fonts.meta) }}>{expires}</span>
        </div>
    );
}

function Stage({ layout, t }) {
    const { W, H, win, pad, sidebarW, rowH, listY, fonts, selected, bubble, floating } = layout;
    const compact = layout === LAYOUTS.narrow;
    const listLeft = compact ? pad : pad + sidebarW + 12;
    const newDocument = t.documents[6];

    return (
        <ToolStage W={W} H={H}>
            <ToolWindow
                win={win}
                pad={pad}
                heading={t.heading}
                sub={t.sub}
                headingSize={fonts.heading}
                subSize={fonts.sub}
                buttons={
                    <>
                        <HeaderButton icon={Sparkles} width={100} accent dropdown>{t.assistant}</HeaderButton>
                        {/* Op gsm is er enkel plaats voor de AI-knop */}
                        {!compact && <HeaderButton icon={Upload} width={92}>{t.upload}</HeaderButton>}
                        {!compact && <HeaderButton icon={FolderPlus} width={80}>{t.newFolder}</HeaderButton>}
                    </>
                }
            >
                {/* De mappen, niet op gsm */}
                {!compact && (
                    <div className="absolute border-r border-foreground/[0.08]" style={{ left: u(pad), top: u(listY - 22), width: u(sidebarW), bottom: u(pad) }}>
                        {t.folders.map((folder, i) => (
                            <div
                                key={folder}
                                className={`rounded-md whitespace-nowrap ${i === 0 ? 'bg-foreground/[0.05] text-foreground font-medium' : 'text-foreground/60'}`}
                                style={{ marginRight: u(8), marginBottom: u(3), padding: `${u(6)} ${u(8)}`, fontSize: u(fonts.name) }}
                            >
                                {folder}
                            </div>
                        ))}
                    </div>
                )}

                {/* De documenten */}
                <div className="absolute" style={{ left: u(listLeft), right: u(pad), top: u(compact ? listY : listY - 22) }}>
                    {!compact && (
                        <div className="grid items-center font-medium text-foreground" style={{ height: u(22), gridTemplateColumns: `1fr ${u(100)} ${u(84)}`, paddingLeft: u(4), paddingRight: u(4), fontSize: u(fonts.meta) }}>
                            {t.columns.map((column) => <span key={column}>{column}</span>)}
                        </div>
                    )}
                    {(compact ? t.documents.slice(0, 7) : t.documents).map((doc, i) => (
                        <DocumentRow
                            key={doc[0]}
                            doc={doc}
                            selected={i === selected}
                            height={rowH}
                            fonts={fonts}
                            compact={compact}
                        />
                    ))}
                </div>
            </ToolWindow>

            {/* Het antwoord van de assistent, met de documenten erbij */}
            <AssistantCard bubble={bubble} label={t.assistant}>
                <p className="rounded-md bg-foreground/[0.04] text-foreground/70" style={{ marginTop: u(8), padding: `${u(5)} ${u(8)}`, fontSize: u(bubble.text) }}>{t.question}</p>
                <AssistantTitle bubble={bubble}>{t.answer}</AssistantTitle>
                <div style={{ marginTop: u(6) }}>
                    {t.expiring.map((index) => (
                        <div key={index} className="flex items-center justify-between text-foreground/70" style={{ gap: u(10), marginTop: u(3), fontSize: u(bubble.text) }}>
                            <span className="flex items-center whitespace-nowrap" style={{ gap: u(6) }}>
                                <FileText strokeWidth={1.5} className="shrink-0 text-accent" style={{ width: u(12), height: u(12) }} />
                                {t.documents[index][0]}
                            </span>
                            <span className="whitespace-nowrap text-foreground/50">{t.documents[index][2]}</span>
                        </div>
                    ))}
                </div>
                <AssistantActions bubble={bubble} primary={t.open} secondary={t.ask} />
            </AssistantCard>

            {/* Het nieuwe document dat de AI zelf ordende, niet op gsm: daar is de ruimte te klein */}
            {floating && (
                <FloatingCard left={floating.left} top={floating.top} width={floating.width} padding={9}>
                    <div className="flex items-center font-medium text-accent" style={{ gap: u(5), fontSize: u(10) }}>
                        <span className="flex items-center justify-center shrink-0 rounded-full bg-accent text-white" style={{ width: u(12), height: u(12) }}>
                            <Check strokeWidth={3} style={{ width: u(7), height: u(7) }} />
                        </span>
                        {t.sorted}
                    </div>
                    <p className="font-medium text-foreground whitespace-nowrap" style={{ marginTop: u(4), fontSize: u(11) }}>{newDocument[0]}</p>
                    <div className="border-t border-foreground/[0.08]" style={{ marginTop: u(5), paddingTop: u(4), fontSize: u(10) }}>
                        <div className="flex justify-between text-foreground/50"><span>{t.folderLabel}</span><span className="text-foreground">{t.sub}</span></div>
                        <div className="flex justify-between text-foreground/50"><span>{t.expiresLabel}</span><span className="text-foreground">{newDocument[2]}</span></div>
                    </div>
                </FloatingCard>
            )}
        </ToolStage>
    );
}

export default function DocumentVisual() {
    const { language } = useLanguage();
    const t = TEXT[language];
    return <ToolVisual label={t.label} narrow={<Stage layout={LAYOUTS.narrow} t={t} />} wide={<Stage layout={LAYOUTS.wide} t={t} />} />;
}
