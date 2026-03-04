import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function AccordionItem({ title, children, defaultOpen = false, variant = 'light' }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const isLight = variant === 'light';

    const borderClass = isLight ? 'border-foreground/10' : 'border-background/10';
    const bgClass = isLight ? 'bg-foreground/5' : 'bg-background/5';
    const bgHoverClass = isLight ? 'hover:bg-foreground/10' : 'hover:bg-background/10';
    const textTitleClass = isLight ? 'text-foreground' : 'text-background';
    const textIconClass = isLight ? 'text-foreground/50' : 'text-background/50';
    const textContentClass = isLight ? 'text-foreground/70' : 'text-background/70';

    return (
        <div className={`border ${borderClass} mb-3 rounded-2xl overflow-hidden ${bgClass} transition-colors ${bgHoverClass}`}>
            <button
                type="button"
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`font-semibold text-lg ${textTitleClass}`}>{title}</span>
                <ChevronDown
                    size={20}
                    className={`${textIconClass} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
            >
                <div className="overflow-hidden">
                    <div className={`px-6 pb-6 ${textContentClass} text-base leading-relaxed`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
