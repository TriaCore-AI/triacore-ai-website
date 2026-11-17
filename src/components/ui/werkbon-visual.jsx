import React from 'react';
import { ArrowRight, Check, Mic, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { u } from './tool-visual-unit';
import { ToolVisual, ToolStage, PhoneFrame } from './tool-visual-parts';

// De visual bij de oplossing Werkbonnen inspreken (hero van Oplossingen v2): links het spraakbericht dat iemand op
// de werf inspreekt, met wat er gezegd werd; rechts de gsm met de werkbon die de AI daarvan maakt, klaar om te
// bevestigen. Bewust een werf en geen technieker: het werkt voor iedereen die buiten werkt. Op gsm staat enkel
// de gsm, met het spraakbericht bovenaan. Zelfde stijl en onderdelen als de visuals van Custom tools
// (tool-visual-parts.jsx). Alle gegevens zijn verzonnen.

const LAYOUTS = {
    wide: {
        W: 720, H: 540,
        voice: { x: 40, y: 172, w: 300 }, // ongeveer even hoog als het midden van de gsm
        arrow: { x: 352, y: 256 },
        phone: { x: 410, y: 22, w: 252, h: 496 },
        compact: false
    },
    narrow: {
        W: 400, H: 400,
        voice: null,
        arrow: null,
        phone: { x: 70, y: 8, w: 260, h: 384 },
        compact: true
    }
};

const TEXT = {
    nl: {
        label: 'Een medewerker op de werf spreekt in wat er vandaag gedaan is. De AI maakt er op de gsm een volledige werkbon van, met de werf, het uitgevoerde werk, de uren, het materiaal en wat er nog moet gebeuren. De medewerker bevestigt met één tik.',
        voice: 'Spraakbericht',
        where: 'Ingesproken op de werf',
        said: '"Hal 2 in Genk: vloer gestort, met twee man, zes uur. Twaalf zakken egaline gebruikt. Morgen nog de randen afwerken."',
        screen: 'Werkbon',
        filled: 'Opgesteld door de AI',
        fields: [['Werf', 'Hal 2, Genk'], ['Uitgevoerd', 'Vloer gestort'], ['Uren', '2 man × 6 u'], ['Materiaal', '12 zakken egaline'], ['Nog te doen', 'Randen afwerken']],
        confirm: 'Bevestig werkbon'
    },
    en: {
        label: 'A worker on site records what was done today. The AI turns it into a complete work order on the phone, with the site, the work done, the hours, the materials and what still needs doing. The worker confirms with one tap.',
        voice: 'Voice message',
        where: 'Recorded on site',
        said: '"Hall 2 in Genk: floor poured, two people, six hours. Twelve bags of levelling compound used. Edges still to finish tomorrow."',
        screen: 'Work order',
        filled: 'Drafted by the AI',
        fields: [['Site', 'Hall 2, Genk'], ['Done', 'Floor poured'], ['Hours', '2 people × 6 h'], ['Materials', '12 bags of compound'], ['To do', 'Finish the edges']],
        confirm: 'Confirm work order'
    }
};

// Vaste hoogtes voor de golfvorm van het spraakbericht (geen toeval, zodat het beeld altijd gelijk is)
const GOLF = [6, 10, 16, 9, 20, 26, 14, 8, 18, 28, 22, 12, 7, 15, 24, 30, 19, 11, 6, 13, 21, 27, 17, 9, 14, 23, 16, 8, 12, 18, 10, 6];

function Golf({ aantal, hoogte }) {
    return (
        <div className="flex items-center flex-1" style={{ gap: u(2.5), height: u(hoogte) }}>
            {GOLF.slice(0, aantal).map((h, i) => (
                <span key={i} className={`rounded-full ${i < aantal * 0.62 ? 'bg-accent' : 'bg-foreground/20'}`} style={{ width: u(3), height: u((h / 30) * hoogte) }} />
            ))}
        </div>
    );
}

// Het spraakbericht zoals het op de werf ingesproken werd, met wat er gezegd is
function Spraakbericht({ voice, t }) {
    return (
        <div className="absolute" style={{ left: u(voice.x), top: u(voice.y), width: u(voice.w) }}>
            <div className="bg-white border border-foreground/[0.08]" style={{ padding: u(16), borderRadius: u(16), boxShadow: `0 ${u(16)} ${u(40)} ${u(-20)} rgba(15,23,42,0.22)` }}>
                <div className="flex items-center" style={{ gap: u(10) }}>
                    <span className="flex items-center justify-center shrink-0 rounded-full bg-accent text-white" style={{ width: u(32), height: u(32) }}>
                        <Mic strokeWidth={1.75} style={{ width: u(15), height: u(15) }} />
                    </span>
                    <Golf aantal={32} hoogte={26} />
                    <span className="shrink-0 tabular-nums text-foreground/60" style={{ fontSize: u(11) }}>0:24</span>
                </div>
                <p className="text-foreground/80 italic" style={{ marginTop: u(14), fontSize: u(12.5), lineHeight: 1.45 }}>{t.said}</p>
            </div>
            <p className="text-foreground/55" style={{ marginTop: u(8), marginLeft: u(4), fontSize: u(10.5) }}>{t.where}</p>
        </div>
    );
}

function Gsm({ phone, compact, t }) {
    // Op gsm drie velden in plaats van vijf
    const velden = compact ? [t.fields[0], t.fields[2], t.fields[3]] : t.fields;
    return (
        <PhoneFrame phone={phone}>
            <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(14), fontSize: u(18) }}>{t.screen}</p>

            {/* Op gsm is er geen plaats voor het spraakbericht ernaast: dan staat het klein bovenaan */}
            {compact && (
                <div className="flex items-center rounded-lg bg-white border border-foreground/[0.09]" style={{ marginTop: u(10), padding: u(7), gap: u(8) }}>
                    <span className="flex items-center justify-center shrink-0 rounded-full bg-accent text-white" style={{ width: u(24), height: u(24) }}>
                        <Mic strokeWidth={1.75} style={{ width: u(12), height: u(12) }} />
                    </span>
                    <Golf aantal={22} hoogte={18} />
                    <span className="shrink-0 tabular-nums text-foreground/60" style={{ fontSize: u(10.5) }}>0:24</span>
                </div>
            )}

            <p className="flex items-center font-medium text-accent" style={{ marginTop: u(12), marginBottom: u(5), gap: u(5), fontSize: u(11) }}>
                <Sparkles strokeWidth={1.5} style={{ width: u(12), height: u(12) }} />{t.filled}
            </p>
            <div className="rounded-lg bg-white border border-foreground/[0.09]" style={{ paddingLeft: u(10), paddingRight: u(10) }}>
                {velden.map(([label, value], i) => (
                    <div key={label} className={`flex items-center justify-between whitespace-nowrap ${i ? 'border-t border-foreground/[0.07]' : ''}`} style={{ height: u(compact ? 36 : 40), gap: u(8) }}>
                        <span className="text-foreground/60" style={{ fontSize: u(11) }}>{label}</span>
                        <span className="font-medium text-foreground" style={{ fontSize: u(12) }}>{value}</span>
                    </div>
                ))}
            </div>

            <span className="flex items-center justify-center shrink-0 mt-auto rounded-lg bg-foreground text-white font-medium" style={{ height: u(36), gap: u(6), fontSize: u(12) }}>
                <Check strokeWidth={2.25} style={{ width: u(13), height: u(13) }} />{t.confirm}
            </span>
        </PhoneFrame>
    );
}

function Podium({ layout, t }) {
    const { W, H, voice, arrow, phone, compact } = layout;
    return (
        <ToolStage W={W} H={H}>
            {voice && <Spraakbericht voice={voice} t={t} />}
            {arrow && (
                <span className="absolute text-foreground/50" style={{ left: u(arrow.x), top: u(arrow.y) }}>
                    <ArrowRight strokeWidth={1.5} style={{ width: u(40), height: u(28) }} />
                </span>
            )}
            <Gsm phone={phone} compact={compact} t={t} />
        </ToolStage>
    );
}

export function WerkbonVisual() {
    const { language } = useLanguage();
    const t = TEXT[language];
    return <ToolVisual label={t.label} narrow={<Podium layout={LAYOUTS.narrow} t={t} />} wide={<Podium layout={LAYOUTS.wide} t={t} />} />;
}
