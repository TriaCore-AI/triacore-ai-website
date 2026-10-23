import React, { useState } from 'react';
import { Plus } from 'lucide-react';

// Veelgestelde vragen als rustige lijst met dunne lijnen, in de stijl van de oplossingen.
// Eén vraag tegelijk open. Het antwoord schuift zacht open (de rasterrij groeit van 0 naar de echte
// hoogte), het plusje draait een kwartslag naar een kruisje. Bij hover kleurt de vraag groen.
export default function FaqList({ items }) {
    const [open, setOpen] = useState(null);

    return (
        <div>
            {items.map((item, i) => {
                const on = open === i;
                return (
                    <div key={i} className="rv-fade relative">
                        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-foreground/15" />
                        <button
                            type="button"
                            onClick={() => setOpen(on ? null : i)}
                            aria-expanded={on}
                            className="group w-full flex items-center justify-between gap-8 py-7 md:py-8 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                        >
                            <span className={`text-xl md:text-2xl leading-snug transition-colors duration-300 ${on ? 'text-accent' : 'text-foreground group-hover:text-accent'}`}>
                                {item.q}
                            </span>
                            <span
                                aria-hidden="true"
                                className={`shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'rotate-45 border-accent text-accent' : 'border-foreground/15 text-foreground/60 group-hover:border-foreground/40 group-hover:text-foreground'}`}
                            >
                                <Plus size={18} strokeWidth={1.5} />
                            </span>
                        </button>
                        <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <div className="overflow-hidden">
                                <p className={`pb-8 max-w-3xl text-base md:text-lg text-foreground/60 leading-relaxed transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0'}`}>
                                    {item.a}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
            <span aria-hidden="true" className="block h-px bg-foreground/15" />
        </div>
    );
}
