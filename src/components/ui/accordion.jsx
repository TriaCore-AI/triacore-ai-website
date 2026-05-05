import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function AccordionItem({ title, children, defaultOpen = false, variant = 'light' }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const isLight = variant === 'light';

    const borderClass = isLight ? 'border-foreground/10' : 'border-white/10';
    const bgClass = isLight ? 'bg-foreground/5' : 'bg-[#0a0a1a]/40 backdrop-blur-xl';
    const bgHoverClass = isLight ? 'hover:bg-foreground/10' : 'hover:bg-white/5';
    const textTitleClass = isLight ? 'text-foreground' : 'text-white';
    const textIconClass = isLight ? 'text-foreground/50' : 'text-white/40';
    const textContentClass = isLight ? 'text-foreground/70' : 'text-white/60';

    return (
        <div className={`border ${borderClass} mb-3 rounded-3xl overflow-hidden ${bgClass} transition-all duration-300 ${bgHoverClass}`}>
            <button
                type="button"
                className="w-full px-6 py-5 md:px-8 md:py-6 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`font-medium text-base md:text-lg ${textTitleClass}`}>{title}</span>
                <ChevronDown
                    size={18}
                    className={`${textIconClass} transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
            >
                <div className="overflow-hidden">
                    <div className={`px-6 pb-6 md:px-8 md:pb-8 ${textContentClass} text-sm md:text-base leading-relaxed`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
