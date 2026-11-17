import React from 'react';
import { ArrowRight, FileText, Mail, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage, ToolWindow } from './tool-visual-parts';

// De visual bij de oplossing Orders automatisch verwerken (hero van Oplossingen v2): links een mail met een
// bestelling als pdf, rechts het ordervenster in het bestaande ERP, waar de AI de order al klaarzette: de klant,
// de leverdatum en de artikelen herkend. Een medewerker keurt goed met één klik. Op gsm staat enkel het venster,
// met de mail klein bovenaan. Zelfde stijl en onderdelen als de visuals van Custom tools (tool-visual-parts.jsx).
// Alle gegevens zijn verzonnen.

const LAYOUTS = {
    wide: {
        W: 720, H: 540,
        mail: { x: 34, y: 168, w: 262 },
        arrow: { x: 306, y: 256 },
        win: { x: 356, y: 34, w: 334, h: 472 },
        pad: 16, compact: false, regels: 3
    },
    narrow: {
        W: 400, H: 400,
        mail: null,
        arrow: null,
        win: { x: 12, y: 12, w: 376, h: 376 },
        pad: 14, compact: true, regels: 2
    }
};

const TEXT = {
    nl: {
        label: 'Een klant mailt een bestelling als pdf. De AI leest ze en zet in het ERP een order klaar: de klant, de leverdatum en de artikelen met hun aantallen zijn herkend. Een medewerker keurt goed met één klik.',
        from: 'Van',
        client: 'Vermeulen Bouw',
        subject: 'Bestelling week 47',
        body: 'Hallo, in bijlage onze bestelling. Graag levering op donderdag.',
        file: 'bestelling-4471.pdf',
        heading: 'Orders',
        sub: 'Nieuwe order',
        clientLabel: 'Klant',
        dateLabel: 'Levering',
        date: 'Do 20 nov',
        article: 'Artikel',
        qty: 'Aantal',
        lines: [['Gipsplaat 12,5 mm', '40 st'], ['Profiel CW 50', '60 st'], ['Schroeven 3,5 × 25', '8 doos']],
        more: '+ 1 artikel',
        ai: 'Klant en artikelen herkend, leverdatum uit de mail gehaald.',
        approve: 'Keur goed',
        adjust: 'Pas aan'
    },
    en: {
        label: 'A client emails an order as a PDF. The AI reads it and prepares an order in the ERP: the client, the delivery date and the items with their quantities are recognised. An employee approves with one click.',
        from: 'From',
        client: 'Vermeulen Construction',
        subject: 'Order week 47',
        body: 'Hello, please find our order attached. Delivery on Thursday, please.',
        file: 'order-4471.pdf',
        heading: 'Orders',
        sub: 'New order',
        clientLabel: 'Client',
        dateLabel: 'Delivery',
        date: 'Thu 20 Nov',
        article: 'Item',
        qty: 'Qty',
        lines: [['Plasterboard 12.5 mm', '40 pcs'], ['CW 50 profile', '60 pcs'], ['Screws 3.5 × 25', '8 boxes']],
        more: '+ 1 item',
        ai: 'Client and items recognised, delivery date taken from the email.',
        approve: 'Approve',
        adjust: 'Adjust'
    }
};

// De mail zoals ze binnenkwam, met de pdf als bijlage
function MailKaart({ mail, t }) {
    return (
        <div className="absolute bg-white border border-foreground/[0.08]" style={{ left: u(mail.x), top: u(mail.y), width: u(mail.w), padding: u(16), borderRadius: u(16), boxShadow: `0 ${u(16)} ${u(40)} ${u(-20)} rgba(15,23,42,0.22)` }}>
            <div className="flex items-center" style={{ gap: u(9) }}>
                <span className="flex items-center justify-center shrink-0 rounded-full bg-foreground/[0.06] text-foreground/70" style={{ width: u(30), height: u(30) }}>
                    <Mail strokeWidth={1.5} style={{ width: u(14), height: u(14) }} />
                </span>
                <div className="min-w-0">
                    <p className="text-foreground/55 whitespace-nowrap" style={{ fontSize: u(10) }}>{t.from}</p>
                    <p className="font-medium text-foreground whitespace-nowrap" style={{ fontSize: u(12.5) }}>{t.client}</p>
                </div>
            </div>
            <p className="font-medium text-foreground" style={{ marginTop: u(12), fontSize: u(13) }}>{t.subject}</p>
            <p className="text-foreground/70" style={{ marginTop: u(4), fontSize: u(11.5), lineHeight: 1.45 }}>{t.body}</p>
            <div className="flex items-center rounded-lg border border-foreground/[0.1] bg-[#fafafa]" style={{ marginTop: u(12), padding: `${u(7)} ${u(9)}`, gap: u(8) }}>
                <span className="flex items-center justify-center shrink-0 rounded bg-[#fbe9e7] text-[#c2410c]" style={{ width: u(24), height: u(28) }}>
                    <FileText strokeWidth={1.5} style={{ width: u(13), height: u(13) }} />
                </span>
                <span className="text-foreground/80 whitespace-nowrap" style={{ fontSize: u(11) }}>{t.file}</span>
            </div>
        </div>
    );
}

function Venster({ layout, t }) {
    const { win, pad, compact, regels } = layout;
    const rij = 'flex items-center justify-between whitespace-nowrap';
    return (
        <ToolWindow win={win} pad={pad} heading={t.heading} sub={t.sub} headingSize={compact ? 19 : 20} subSize={13}>
            <div className="absolute flex flex-col" style={{ left: u(pad), right: u(pad), top: u(64), bottom: u(pad) }}>
                {/* Op gsm is er geen plaats voor de mail ernaast: dan staat ze klein bovenaan */}
                {compact && (
                    <div className="flex items-center rounded-lg bg-white border border-foreground/[0.09]" style={{ padding: u(7), gap: u(8), marginBottom: u(10) }}>
                        <Mail strokeWidth={1.5} className="shrink-0 text-foreground/60" style={{ width: u(14), height: u(14) }} />
                        <span className="flex-1 min-w-0 truncate text-foreground/80" style={{ fontSize: u(11.5) }}>{t.subject}</span>
                        <span className="shrink-0 text-foreground/55" style={{ fontSize: u(10.5) }}>{t.file}</span>
                    </div>
                )}

                {/* De kop van de order */}
                <div className="rounded-lg bg-white border border-foreground/[0.09]" style={{ paddingLeft: u(10), paddingRight: u(10) }}>
                    <div className={rij} style={{ height: u(34) }}>
                        <span className="text-foreground/60" style={{ fontSize: u(11) }}>{t.clientLabel}</span>
                        <span className="font-medium text-foreground" style={{ fontSize: u(12) }}>{t.client}</span>
                    </div>
                    <div className={`${rij} border-t border-foreground/[0.07]`} style={{ height: u(34) }}>
                        <span className="text-foreground/60" style={{ fontSize: u(11) }}>{t.dateLabel}</span>
                        <span className="font-medium text-foreground" style={{ fontSize: u(12) }}>{t.date}</span>
                    </div>
                </div>

                {/* De artikelen */}
                <div className="rounded-lg bg-white border border-foreground/[0.09]" style={{ marginTop: u(10), paddingLeft: u(10), paddingRight: u(10) }}>
                    {/* Op gsm zonder kolomkoppen en zonder de regel met het extra artikel, anders past het niet */}
                    {!compact && (
                        <div className={rij} style={{ height: u(28) }}>
                            <span className="text-foreground/50" style={{ fontSize: u(10) }}>{t.article}</span>
                            <span className="text-foreground/50" style={{ fontSize: u(10) }}>{t.qty}</span>
                        </div>
                    )}
                    {t.lines.slice(0, regels).map(([naam, aantal], i) => (
                        <div key={naam} className={`${rij} ${compact && i === 0 ? '' : 'border-t border-foreground/[0.07]'}`} style={{ height: u(32), gap: u(8) }}>
                            <span className="text-foreground" style={{ fontSize: u(11.5) }}>{naam}</span>
                            <span className="font-medium text-foreground" style={{ fontSize: u(12) }}>{aantal}</span>
                        </div>
                    ))}
                    {!compact && <div className="border-t border-foreground/[0.07] flex items-center text-foreground/55" style={{ height: u(28), fontSize: u(11) }}>{t.more}</div>}
                </div>

                {/* Wat de AI deed, en de medewerker die beslist */}
                <div className="rounded-lg border border-accent bg-white" style={{ marginTop: 'auto', padding: `${u(10)} ${u(11)}` }}>
                    <p className="flex items-start text-foreground" style={{ gap: u(6), fontSize: u(11.5), lineHeight: 1.35 }}>
                        <Sparkles strokeWidth={1.5} className="shrink-0 text-accent" style={{ width: u(13), height: u(13), marginTop: u(1) }} />
                        {t.ai}
                    </p>
                    <div className="flex items-center" style={{ marginTop: u(10), gap: u(14) }}>
                        <span className="rounded-full bg-foreground text-white font-medium whitespace-nowrap" style={{ padding: `${u(6)} ${u(16)}`, fontSize: u(11.5) }}>{t.approve}</span>
                        <span className="text-foreground underline underline-offset-2 whitespace-nowrap" style={{ fontSize: u(11.5) }}>{t.adjust}</span>
                    </div>
                </div>
            </div>
        </ToolWindow>
    );
}

function Podium({ layout, t }) {
    const { W, H, mail, arrow } = layout;
    return (
        <ToolStage W={W} H={H}>
            {mail && <MailKaart mail={mail} t={t} />}
            {arrow && (
                <span className="absolute text-foreground/50" style={{ left: u(arrow.x), top: u(arrow.y) }}>
                    <ArrowRight strokeWidth={1.5} style={{ width: u(40), height: u(28) }} />
                </span>
            )}
            <Venster layout={layout} t={t} />
        </ToolStage>
    );
}

export function OrderVisual() {
    const { language } = useLanguage();
    const t = TEXT[language];
    return <ToolVisual label={t.label} narrow={<Podium layout={LAYOUTS.narrow} t={t} />} wide={<Podium layout={LAYOUTS.wide} t={t} />} />;
}
