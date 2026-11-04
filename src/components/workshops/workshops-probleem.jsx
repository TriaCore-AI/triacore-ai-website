import React from 'react';
import CornerTrace from '../ui/corner-trace';
import VisualTools from './visual-tools';
import VisualChatten from './visual-chatten';
import robotVraag from '../../assets/workshops/robot-vraag.webp';
import { useLanguage } from '../../context/LanguageContext';

// Sectie 1: het probleem, als herkenning en niet als verwijt. Drie situaties die een kleine trap vormen,
// dezelfde die de workshop volgt: eerst één werkwijze, dan context, dan AI laten werken. Sectie 2 antwoordt
// erop met wat uw team leert.
// Elke situatie krijgt een beeld (foto of animatie) in `beelden`, in dezelfde volgorde. Zolang dat er niet
// is, blijft het vak leeg; op de dev server staat er "Beeld volgt" in.
const beelden = [
    <VisualTools key="tools" />,
    <img key="robot" src={robotVraag} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />,
    <VisualChatten key="chatten" />
];

const situaties = {
    nl: [
        {
            title: 'Iedereen doet zijn eigen ding',
            desc: 'De een gebruikt ChatGPT, de ander Copilot, een derde nog niets. Wat werkt, blijft bij één persoon hangen.'
        },
        {
            title: 'Elke keer opnieuw uitleggen',
            desc: 'AI weet niets over uw klanten, uw producten of uw manier van werken. Dus krijgt uw team algemene antwoorden, of begint het elk gesprek van nul.'
        },
        {
            title: 'Chatten in plaats van laten werken',
            desc: 'Vraag, antwoord, kopiëren, plakken, bijsturen. Het helpt, maar het eigenlijke werk blijft bij uw team liggen.'
        }
    ],
    en: [
        {
            title: 'Everyone does their own thing',
            desc: 'One person uses ChatGPT, another Copilot, a third nothing yet. What works stays with one person.'
        },
        {
            title: 'Explaining it all again, every time',
            desc: 'AI knows nothing about your customers, your products or the way you work. So your team gets generic answers, or starts every conversation from scratch.'
        },
        {
            title: 'Chatting instead of letting it work',
            desc: 'Question, answer, copy, paste, adjust. It helps, but the actual work stays with your team.'
        }
    ]
};

export default function WorkshopsProbleem() {
    const { language } = useLanguage();
    const nl = language === 'nl';

    return (
        <section id="uitdaging" className="px-6 md:px-16 lg:px-24 pt-16 md:pt-24 pb-24 md:pb-32">
            <div className="max-w-7xl mx-auto">
                <div data-reveal className="overflow-hidden pb-3 mb-12 md:mb-16">
                    <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                        {nl ? 'AI is er. De werkwijze nog niet.' : 'AI is here. The way of working is not yet.'}
                    </h2>
                </div>

                {/* Drie lichte kaarten naast elkaar, op gsm onder elkaar: nummer en titel, een vak voor een foto of
                    animatie, dan de uitleg. De titel is altijd twee regels hoog, zodat de beeldvakken op één lijn staan.
                    Bij hover wordt de kaart wit en tekent de L lijn zich, zoals de andere kaarten op de site */}
                <div data-reveal className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                    {situaties[language].map((s, i) => (
                        <div
                            key={i}
                            className="rv-card group relative flex flex-col rounded-3xl bg-[#fafafa] border border-foreground/[0.07] p-8 md:p-9 transition-colors duration-500 hover:bg-white hover:border-foreground/15"
                        >
                            <CornerTrace />
                            <span className="text-sm text-accent tabular-nums">/{String(i + 1).padStart(2, '0')}</span>
                            <h3 className="mt-3 min-h-[2.5em] text-2xl font-medium text-foreground leading-tight">{s.title}</h3>
                            <div className="relative mt-6 aspect-[4/3] rounded-2xl overflow-hidden bg-foreground/[0.04] flex items-center justify-center">
                                {beelden[i] || (import.meta.env.DEV && (
                                    <span className="text-sm text-foreground/30">{nl ? 'Beeld volgt' : 'Visual to follow'}</span>
                                ))}
                            </div>
                            <p className="mt-7 text-foreground/60 text-base leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
