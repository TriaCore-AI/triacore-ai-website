import React from 'react';
import { Check, FileText, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage } from './tool-visual-parts';

// De visual van de tool Klantenportaal, bewust anders opgebouwd dan Planning en Documentbeheer: een portaal
// heeft twee kanten. Links wat de onderaannemer ziet (een chauffeur aanmelden en een vraag stellen aan de
// AI), rechts eroverheen wat u ziet (de aanvraag, door de AI nagekeken en klaar om goed te keuren), en
// bovenaan wie wat mag zien. Alle gegevens zijn verzonnen. Op gsm enkel de twee kanten onder elkaar.
const LAYOUTS = {
    wide: {
        W: 720, H: 540,
        portal: { left: 22, top: 22, width: 400, height: 456, contentWidth: 250 },
        office: { left: 296, top: 160, width: 408 },
        access: { left: 404, top: 28, width: 300 },
        title: 20, text: 11, heading: 20
    },
    narrow: {
        W: 400, H: 500,
        portal: { left: 14, top: 14, width: 372, height: 240, contentWidth: 344 },
        office: { left: 30, top: 200, width: 362 },
        access: null,
        title: 22, text: 12, heading: 20
    }
};

const TEXT = {
    nl: {
        label: 'Twee kanten van een portaal. Een onderaannemer meldt een nieuwe chauffeur aan en krijgt van de AI-assistent antwoord op zijn vraag. U ziet de aanvraag, door de AI nagekeken en klaar om goed te keuren, en u bepaalt wie wat ziet.',
        assistant: 'AI-assistent',
        portal: {
            caption: 'Wat uw onderaannemer ziet',
            heading: 'Mijn portaal',
            tabs: ['Chauffeurs', 'Ritten', 'Facturen'],
            form: 'Nieuwe chauffeur',
            nameLabel: 'Naam',
            submit: 'Indienen',
            question: 'Welke documenten heb ik nodig?',
            answer: 'Voor een nieuwe chauffeur: rijbewijs C, code 95 en een medisch attest.',
            input: 'Stel uw vraag'
        },
        fields: [
            ['Rijbewijs C', 'rijbewijs.pdf'],
            ['Code 95', 'code-95.pdf'],
            ['Medisch attest', 'attest.pdf']
        ],
        office: {
            caption: 'Wat u ziet',
            heading: 'Goed te keuren',
            count: '3 open',
            person: 'Nieuwe chauffeur, van uw onderaannemer',
            title: 'Alles nagekeken en in orde.',
            checks: ['Rijbewijs C geldig tot 2031', 'Code 95 geldig tot 2029', 'Medisch attest geldig tot 2028'],
            approve: 'Keur goed',
            review: 'Bekijk zelf',
            others: [['Extra rit aangevraagd', 'van een klant'], ['Nieuwe factuur', 'van een leverancier']]
        },
        access: {
            title: 'Wie ziet wat',
            role: 'Onderaannemer',
            rows: [['Eigen chauffeurs', true], ['Eigen ritten en facturen', true], ['Gegevens van andere partners', false]]
        }
    },
    en: {
        label: 'Two sides of a portal. A subcontractor registers a new driver and gets an answer from the AI assistant. You see the request, checked by the AI and ready for approval, and you decide who sees what.',
        assistant: 'AI assistant',
        portal: {
            caption: 'What your subcontractor sees',
            heading: 'My portal',
            tabs: ['Drivers', 'Trips', 'Invoices'],
            form: 'New driver',
            nameLabel: 'Name',
            submit: 'Submit',
            question: 'Which documents do I need?',
            answer: 'For a new driver: a C licence, code 95 and a medical certificate.',
            input: 'Ask your question'
        },
        fields: [
            ['C licence', 'licence.pdf'],
            ['Code 95', 'code-95.pdf'],
            ['Medical certificate', 'certificate.pdf']
        ],
        office: {
            caption: 'What you see',
            heading: 'To approve',
            count: '3 open',
            person: 'New driver, from your subcontractor',
            title: 'All checked and in order.',
            checks: ['C licence valid until 2031', 'Code 95 valid until 2029', 'Medical certificate valid until 2028'],
            approve: 'Approve',
            review: 'Review yourself',
            others: [['Extra trip requested', 'from a client'], ['New invoice', 'from a supplier']]
        },
        access: {
            title: 'Who sees what',
            role: 'Subcontractor',
            rows: [['Own drivers', true], ['Own trips and invoices', true], ['Data of other partners', false]]
        }
    }
};

function Panel({ box, front, children }) {
    return (
        <div
            className={`absolute border border-foreground/[0.07] ${front ? 'bg-white' : 'bg-[#fafafa]'}`}
            style={{
                left: u(box.left),
                top: u(box.top),
                width: u(box.width),
                height: box.height ? u(box.height) : undefined,
                padding: u(14),
                borderRadius: u(14),
                boxShadow: front
                    ? `0 ${u(20)} ${u(46)} ${u(-20)} rgba(15,23,42,0.22)`
                    : `0 ${u(18)} ${u(50)} ${u(-24)} rgba(15,23,42,0.16)`
            }}
        >
            {children}
        </div>
    );
}

const Caption = ({ children }) => <p className="text-foreground/50" style={{ fontSize: u(10.5) }}>{children}</p>;

function GreenCheck({ size }) {
    return (
        <span className="flex items-center justify-center shrink-0 rounded-full bg-accent text-white" style={{ width: u(size), height: u(size) }}>
            <Check strokeWidth={3} style={{ width: u(size * 0.62), height: u(size * 0.62) }} />
        </span>
    );
}

function AiLabel({ label }) {
    return (
        <div className="flex items-center" style={{ gap: u(7) }}>
            <span className="flex items-center justify-center rounded-full border border-foreground/15 text-accent" style={{ width: u(22), height: u(22) }}>
                <Sparkles strokeWidth={1.5} style={{ width: u(12), height: u(12) }} />
            </span>
            <span className="font-medium text-accent" style={{ fontSize: u(11.5) }}>{label}</span>
        </div>
    );
}

// De kant van de onderaannemer: enkel wat hem aanbelangt, met op groot scherm ook een vraag aan de AI
function PortalSide({ layout, t, compact }) {
    const p = t.portal;
    const rowStyle = { height: u(compact ? 25 : 28), fontSize: u(layout.text) };
    return (
        <Panel box={layout.portal}>
            <div style={{ width: u(layout.portal.contentWidth) }}>
                <Caption>{p.caption}</Caption>
                <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(3), fontSize: u(layout.heading) }}>{p.heading}</p>

                {!compact && (
                    <div className="flex border-b border-foreground/[0.1]" style={{ marginTop: u(8), gap: u(16), fontSize: u(11) }}>
                        {p.tabs.map((tab, i) => (
                            <span key={tab} className={i === 0 ? 'text-foreground font-medium border-b border-accent' : 'text-foreground/50'} style={{ paddingBottom: u(5), marginBottom: -1 }}>{tab}</span>
                        ))}
                    </div>
                )}

                <p className="font-medium text-foreground" style={{ marginTop: u(compact ? 5 : 12), marginBottom: u(3), fontSize: u(13) }}>{p.form}</p>

                <div className="flex items-center justify-between border-t border-foreground/[0.08]" style={rowStyle}>
                    <span className="text-foreground/50">{p.nameLabel}</span>
                    <span className="text-foreground">Jan R.</span>
                </div>
                {t.fields.map(([label, file]) => (
                    <div key={label} className="flex items-center justify-between border-t border-foreground/[0.08]" style={rowStyle}>
                        <span className="text-foreground/50">{label}</span>
                        <span className="flex items-center text-foreground" style={{ gap: u(5) }}>
                            <FileText strokeWidth={1.5} className="text-foreground/50" style={{ width: u(11), height: u(11) }} />
                            {file}
                            <GreenCheck size={11} />
                        </span>
                    </div>
                ))}

                {!compact && (
                    <>
                        <span className="inline-block rounded-full bg-foreground text-white font-medium" style={{ marginTop: u(8), padding: `${u(5)} ${u(14)}`, fontSize: u(11) }}>{p.submit}</span>

                        <div className="border-t border-foreground/[0.1]" style={{ marginTop: u(12), paddingTop: u(10) }}>
                            <AiLabel label={t.assistant} />
                            <p className="rounded-md bg-foreground/[0.04] text-foreground/70" style={{ marginTop: u(7), padding: `${u(5)} ${u(8)}`, fontSize: u(11) }}>{p.question}</p>
                            <p className="text-foreground leading-snug" style={{ marginTop: u(6), fontSize: u(11) }}>{p.answer}</p>
                        </div>
                    </>
                )}
            </div>
        </Panel>
    );
}

// Uw kant: de aanvraag die de AI nakeek, en de mens die beslist. Daaronder wat er nog meer binnenkwam.
function OfficeSide({ layout, t, compact }) {
    const o = t.office;
    return (
        <Panel box={layout.office} front>
            <Caption>{o.caption}</Caption>
            <div className="flex items-baseline justify-between" style={{ marginTop: u(3) }}>
                <p className="font-medium text-foreground tracking-tight" style={{ fontSize: u(layout.heading) }}>{o.heading}</p>
                <span className="text-foreground/50" style={{ fontSize: u(11) }}>{o.count}</span>
            </div>

            <div className="flex items-center border-y border-foreground/[0.08]" style={{ marginTop: u(8), padding: `${u(7)} 0`, gap: u(8) }}>
                <span className="flex items-center justify-center shrink-0 rounded-full border border-foreground/20 text-foreground/70" style={{ width: u(24), height: u(24), fontSize: u(9) }}>JR</span>
                <span style={{ fontSize: u(layout.text) }}>
                    <span className="block font-medium text-foreground leading-tight">Jan R.</span>
                    <span className="block text-foreground/50 leading-tight">{o.person}</span>
                </span>
            </div>

            <div style={{ marginTop: u(10) }}>
                <AiLabel label={t.assistant} />
            </div>
            <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(7), fontSize: u(layout.title), lineHeight: 1.12 }}>{o.title}</p>
            <div style={{ marginTop: u(5) }}>
                {o.checks.map((check) => (
                    <div key={check} className="flex items-center text-foreground/70" style={{ gap: u(7), marginTop: u(3), fontSize: u(layout.text) }}>
                        <GreenCheck size={13} />
                        {check}
                    </div>
                ))}
            </div>

            <div className="flex items-center" style={{ marginTop: u(10), gap: u(14) }}>
                <span className="rounded-full bg-foreground text-white font-medium whitespace-nowrap" style={{ padding: `${u(6)} ${u(16)}`, fontSize: u(layout.text) }}>{o.approve}</span>
                <span className="text-foreground underline underline-offset-2 whitespace-nowrap" style={{ fontSize: u(layout.text) }}>{o.review}</span>
            </div>

            {!compact && (
                <div style={{ marginTop: u(12) }}>
                    {o.others.map(([what, from]) => (
                        <div key={what} className="flex items-center justify-between border-t border-foreground/[0.08]" style={{ height: u(26), fontSize: u(layout.text) }}>
                            <span className="text-foreground">{what}</span>
                            <span className="text-foreground/50">{from}</span>
                        </div>
                    ))}
                </div>
            )}
        </Panel>
    );
}

// Wie ziet wat: per soort externe bepaalt u zelf de toegang
function AccessCard({ layout, t }) {
    const a = t.access;
    return (
        <Panel box={layout.access} front>
            <div className="flex items-baseline justify-between" style={{ fontSize: u(12) }}>
                <span className="font-medium text-foreground">{a.title}</span>
                <span className="text-foreground/50" style={{ fontSize: u(10.5) }}>{a.role}</span>
            </div>
            <div style={{ marginTop: u(5) }}>
                {a.rows.map(([label, on]) => (
                    <div key={label} className="flex items-center justify-between" style={{ height: u(22), fontSize: u(11) }}>
                        <span className={on ? 'text-foreground' : 'text-foreground/50'}>{label}</span>
                        <span className={`relative shrink-0 rounded-full ${on ? 'bg-accent' : 'bg-foreground/15'}`} style={{ width: u(22), height: u(12) }}>
                            <span className="absolute rounded-full bg-white" style={{ width: u(9), height: u(9), top: u(1.5), left: u(on ? 11.5 : 1.5) }} />
                        </span>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

function Stage({ layout, t }) {
    const compact = layout === LAYOUTS.narrow;
    return (
        <ToolStage W={layout.W} H={layout.H}>
            <PortalSide layout={layout} t={t} compact={compact} />
            <OfficeSide layout={layout} t={t} compact={compact} />
            {layout.access && <AccessCard layout={layout} t={t} />}
        </ToolStage>
    );
}

export default function PortalVisual() {
    const { language } = useLanguage();
    const t = TEXT[language];
    return <ToolVisual label={t.label} narrow={<Stage layout={LAYOUTS.narrow} t={t} />} wide={<Stage layout={LAYOUTS.wide} t={t} />} />;
}
