import React from 'react';
import { ArrowUp, ChevronDown, Sparkles } from 'lucide-react';
import { u } from './tool-visual-unit';

// De gedeelde onderdelen van de visuals in de kiezer van Custom tools. Elke visual is echte tekst op een
// vast canvas (W x H) dat meeschaalt met de breedte. Op gsm krijgt elke visual een eigen, eenvoudiger
// indeling. De visuals staan stil en je kan er niets aanklikken.

// De visual als geheel: voor schermlezers één beschreven beeld, met per schermformaat een eigen canvas
export function ToolVisual({ label, narrow, wide }) {
    return (
        <div role="img" aria-label={label} className="w-full [container-type:inline-size]">
            <div aria-hidden="true" className="sm:hidden">{narrow}</div>
            <div aria-hidden="true" className="hidden sm:block">{wide}</div>
        </div>
    );
}

// Het canvas met het verloop van de huisstijl
export function ToolStage({ W, H, children }) {
    return (
        <div className="relative w-full overflow-hidden" style={{ '--u': `calc(100cqw / ${W})`, height: u(H), background: 'linear-gradient(to bottom, #f5f7f6 0%, #f2f5f3 25%, #ecf1ed 50%, #e5ece6 75%, #e2eae3 100%)' }}>
            {children}
        </div>
    );
}

// Het venster van de tool: de drie bolletjes, de titel met de aanvulling ernaast, en rechts de knoppen
export function ToolWindow({ win, pad, heading, sub, headingSize, subSize, buttons, children }) {
    return (
        <div
            className="absolute bg-[#fafafa] border border-foreground/[0.07]"
            style={{ left: u(win.x), top: u(win.y), width: u(win.w), height: u(win.h), borderRadius: u(14), boxShadow: `0 ${u(18)} ${u(50)} ${u(-24)} rgba(15,23,42,0.16)` }}
        >
            <div className="absolute flex" style={{ left: u(pad), top: u(9), gap: u(4) }}>
                {[0, 1, 2].map((i) => <span key={i} className="rounded-full bg-foreground/15" style={{ width: u(6), height: u(6) }} />)}
            </div>

            <div className="absolute flex items-center justify-between" style={{ left: u(pad), right: u(pad), top: u(24), height: u(28) }}>
                <div className="flex items-center" style={{ gap: u(10) }}>
                    <span className="font-medium text-foreground tracking-tight" style={{ fontSize: u(headingSize) }}>{heading}</span>
                    <span aria-hidden="true" className="w-px bg-foreground/15" style={{ height: u(16) }} />
                    <span className="text-foreground/70" style={{ fontSize: u(subSize) }}>{sub}</span>
                </div>
                <div className="flex" style={{ gap: u(6) }}>{buttons}</div>
            </div>

            {children}
        </div>
    );
}

// Een knop bovenaan het venster, met een vaste breedte zodat de kaart altijd precies onder de AI-knop hangt
export function HeaderButton({ icon, width, accent, dropdown, children }) {
    const Icon = icon;
    return (
        <span
            className={`flex items-center justify-center whitespace-nowrap rounded-md border ${accent ? 'border-accent text-accent font-medium' : 'border-foreground/15 text-foreground'}`}
            style={{ width: u(width), height: u(26), gap: u(5), fontSize: u(10.5) }}
        >
            <Icon strokeWidth={1.75} className="shrink-0" style={{ width: u(11), height: u(11) }} />{children}
            {dropdown && <ChevronDown strokeWidth={2} className="shrink-0" style={{ width: u(10), height: u(10) }} />}
        </span>
    );
}

// De AI-assistent: een dropdown onder zijn knop, met een klein puntje dat naar de knop wijst.
// bubble geeft de plaats en de maten: left, right, top, caret (midden van de knop vanaf de linkerrand van
// de kaart), title, text en pad.
export function AssistantCard({ bubble, label, children }) {
    return (
        <div
            className="absolute bg-white border border-foreground/[0.07]"
            style={{ left: u(bubble.left), right: u(bubble.right), top: u(bubble.top), padding: u(bubble.pad), borderRadius: u(16), boxShadow: `0 ${u(20)} ${u(46)} ${u(-20)} rgba(15,23,42,0.22)` }}
        >
            <span
                aria-hidden="true"
                className="absolute bg-white border-l border-t border-foreground/[0.07] rotate-45"
                style={{ left: u(bubble.caret - 5), top: u(-5.5), width: u(10), height: u(10) }}
            />
            <div className="flex items-center" style={{ gap: u(7) }}>
                <span className="flex items-center justify-center rounded-full border border-foreground/15 text-accent" style={{ width: u(22), height: u(22) }}>
                    <Sparkles strokeWidth={1.5} style={{ width: u(12), height: u(12) }} />
                </span>
                <span className="font-medium text-accent" style={{ fontSize: u(11.5) }}>{label}</span>
            </div>
            {children}
        </div>
    );
}

export function AssistantTitle({ bubble, children }) {
    return <p className="font-medium text-foreground tracking-tight" style={{ marginTop: u(8), fontSize: u(bubble.title), lineHeight: 1.12 }}>{children}</p>;
}

// De twee keuzes onderaan de kaart: de mens beslist altijd zelf
export function AssistantActions({ bubble, primary, secondary }) {
    return (
        <div className="flex items-center" style={{ marginTop: u(10), gap: u(14) }}>
            <span className="rounded-full bg-foreground text-white font-medium whitespace-nowrap" style={{ padding: `${u(6)} ${u(16)}`, fontSize: u(bubble.text) }}>{primary}</span>
            <span className="text-foreground underline underline-offset-2 whitespace-nowrap" style={{ fontSize: u(bubble.text) }}>{secondary}</span>
        </div>
    );
}

// De gsm van de chauffeur of de technicus: een rand, bovenaan het streepje, en de inhoud onder elkaar.
// phone geeft de plaats en de maten: x, y, w en h
export function PhoneFrame({ phone, children }) {
    return (
        <div
            className="absolute flex flex-col bg-[#fafafa] border border-foreground/15"
            style={{ left: u(phone.x), top: u(phone.y), width: u(phone.w), height: u(phone.h), padding: `${u(12)} ${u(14)} ${u(14)}`, borderRadius: u(30), boxShadow: `0 ${u(22)} ${u(50)} ${u(-22)} rgba(15,23,42,0.28)` }}
        >
            <span aria-hidden="true" className="self-center shrink-0 rounded-full bg-foreground/15" style={{ width: u(54), height: u(5) }} />
            {children}
        </div>
    );
}

// Een chat in het venster van de tool: de berichten in het midden en onderaan de balk om te typen.
// De AI staat links, de mens rechts, zoals in elke chat. Met compact (op gsm) valt de balk weg, zodat de berichten
// de ruimte krijgen.
export function ChatWindow({ win, pad, heading, sub, headingSize, subSize, placeholder, compact, children }) {
    return (
        <ToolWindow win={win} pad={pad} heading={heading} sub={sub} headingSize={headingSize} subSize={subSize}>
            <div className="absolute flex flex-col justify-center" style={{ left: u(pad), right: u(pad), top: u(60), bottom: u(compact ? pad : pad + 52), gap: u(14) }}>
                {children}
            </div>
            {!compact && (
                <div className="absolute flex items-center justify-between rounded-xl bg-white border border-foreground/15" style={{ left: u(pad), right: u(pad), bottom: u(pad), height: u(44), paddingLeft: u(14), paddingRight: u(7) }}>
                    <span className="text-foreground/50 whitespace-nowrap" style={{ fontSize: u(12.5) }}>{placeholder}</span>
                    <span className="flex items-center justify-center shrink-0 rounded-lg bg-foreground text-white" style={{ width: u(30), height: u(30) }}>
                        <ArrowUp strokeWidth={2} style={{ width: u(14), height: u(14) }} />
                    </span>
                </div>
            )}
        </ToolWindow>
    );
}

// Een bericht van de AI: links, met haar teken en haar naam erboven
export function ChatFromAi({ label, width, children }) {
    return (
        <div className="flex items-start self-start" style={{ gap: u(8) }}>
            <span className="flex items-center justify-center shrink-0 rounded-full border border-foreground/15 text-accent" style={{ width: u(26), height: u(26) }}>
                <Sparkles strokeWidth={1.5} style={{ width: u(13), height: u(13) }} />
            </span>
            <div style={{ width: u(width) }}>
                <p className="font-medium text-accent whitespace-nowrap" style={{ fontSize: u(11.5), lineHeight: 1.2, marginBottom: u(4) }}>{label}</p>
                <div className="bg-white border border-foreground/[0.09]" style={{ padding: `${u(10)} ${u(13)}`, borderRadius: `${u(4)} ${u(14)} ${u(14)} ${u(14)}` }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

// Een bericht van de mens: rechts, in de donkere kleur, met de naam erboven
export function ChatFromPerson({ label, children }) {
    return (
        <div className="flex flex-col items-end self-end">
            <p className="text-foreground/70 whitespace-nowrap" style={{ fontSize: u(11.5), lineHeight: 1.2, marginBottom: u(4) }}>{label}</p>
            <div className="bg-foreground text-white whitespace-nowrap" style={{ padding: `${u(9)} ${u(14)}`, fontSize: u(13.5), lineHeight: 1.25, borderRadius: `${u(14)} ${u(4)} ${u(14)} ${u(14)}` }}>
                {children}
            </div>
        </div>
    );
}
