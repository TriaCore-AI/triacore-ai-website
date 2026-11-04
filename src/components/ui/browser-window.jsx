import React from 'react';
import { ChevronLeft, ChevronRight, Copy, Lock, PanelLeft, Plus, Share } from 'lucide-react';

// Een browservenster in de stijl van Safari op macOS: de drie gekleurde knopjes, de pijltjes, een
// adresbalk in het midden en de knoppen rechts. Bedoeld om in een ScreenMockup te zetten: alle maten
// staan in cqw, dus het venster schaalt mee met het scherm zoals een echte schermafbeelding.
// De pagina zelf geef je mee als kinderen.
const SYSTEM_FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "Helvetica Neue", sans-serif';

const icon = { width: '1.15cqw', height: '1.15cqw', strokeWidth: 1.6 };

export default function BrowserWindow({ url = 'triacore.be', children }) {
    return (
        <div className="absolute inset-0 flex flex-col bg-white" style={{ fontFamily: SYSTEM_FONT }}>
            <div className="relative shrink-0 h-[3.3cqw] flex items-center px-[1.1cqw] bg-[#f6f6f7] border-b border-black/[0.09] text-[#6e6e73]">
                <div className="flex items-center gap-[0.62cqw]" aria-hidden="true">
                    <span className="w-[0.92cqw] h-[0.92cqw] rounded-full bg-[#ff5f57] ring-[0.05cqw] ring-inset ring-black/10" />
                    <span className="w-[0.92cqw] h-[0.92cqw] rounded-full bg-[#febc2e] ring-[0.05cqw] ring-inset ring-black/10" />
                    <span className="w-[0.92cqw] h-[0.92cqw] rounded-full bg-[#28c840] ring-[0.05cqw] ring-inset ring-black/10" />
                </div>
                <div className="ml-[1.6cqw] flex items-center gap-[1.1cqw]" aria-hidden="true">
                    <PanelLeft style={icon} />
                    <div className="flex items-center gap-[0.5cqw]">
                        <ChevronLeft style={icon} />
                        <ChevronRight style={icon} className="opacity-40" />
                    </div>
                </div>

                {/* Adresbalk, in het midden van het venster */}
                <div className="absolute left-1/2 -translate-x-1/2 w-[34cqw] h-[2.05cqw] rounded-[0.55cqw] bg-black/[0.055] flex items-center justify-center gap-[0.4cqw]">
                    <Lock style={{ width: '0.8cqw', height: '0.8cqw', strokeWidth: 2 }} />
                    <span className="text-[0.98cqw] leading-none text-[#1d1d1f]">{url}</span>
                </div>

                <div className="ml-auto flex items-center gap-[1.3cqw]" aria-hidden="true">
                    <Share style={icon} />
                    <Plus style={icon} />
                    <Copy style={icon} />
                </div>
            </div>
            <div className="relative flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
