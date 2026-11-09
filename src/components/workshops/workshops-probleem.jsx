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
            desc: 'Je ene collega gebruikt ChatGPT, de andere Copilot, een derde niets. Iedereen zoekt het zelf uit en niemand weet wat de ander doet.'
        },
        {
            title: 'Elke keer opnieuw uitleggen',
            desc: 'Elke nieuwe chat begint bij nul. Je typt telkens opnieuw wat je bedrijf doet, voor wie, en hoe je het graag hebt.'
        },
        {
            title: 'Chatten in plaats van laten werken',
            desc: 'Je stelt een vraag, past het antwoord drie keer aan en kopieert het dan in je mail. AI helpt, maar het meeste werk doe je nog altijd zelf.'
        }
    ],
    en: [
        {
            title: 'Everyone does their own thing',
            desc: 'One colleague uses ChatGPT, another Copilot, a third nothing at all. Everyone figures it out alone and nobody knows what the others do.'
        },
        {
            title: 'Explaining it all again, every time',
            desc: 'Every new chat starts from scratch. You type out again and again what your company does, for whom, and how you like things done.'
        },
        {
            title: 'Chatting instead of letting it work',
            desc: 'You ask a question, adjust the answer three times and then copy it into your email. AI helps, but you still do most of the work yourself.'
        }
    ]
};

export default function WorkshopsProbleem() {
    const { language } = useLanguage();
    const nl = language === 'nl';

    return (
        <section id="uitdaging" className="px-6 md:px-16 lg:px-24 pt-16 md:pt-24 pb-24 md:pb-32">
            <div className="max-w-7xl mx-auto">
                <div data-reveal className="mb-12 md:mb-16">
                    <div className="overflow-hidden pb-3 mb-3">
                        <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                            {nl ? 'Herkenbaar?' : 'Sound familiar?'}
                        </h2>
                    </div>
                    <p className="rv-fade text-foreground/60 text-lg md:text-xl leading-relaxed max-w-xl">
                        {nl
                            ? 'Drie dingen die we in bijna elk bedrijf tegenkomen, bij kleine en grote teams.'
                            : 'Three things we come across in almost every company, in small and large teams alike.'}
                    </p>
                </div>

                {/* Drie lichte kaarten naast elkaar, op gsm onder elkaar: nummer en titel, een vak voor een foto of
                    animatie, dan de uitleg. De titel is altijd twee regels hoog, zodat de beeldvakken op één lijn staan.
                    Bij hover wordt de kaart wit en tekent de L lijn zich, zoals de andere kaarten op de site.
                    Naast elkaar pas vanaf 1280 px: op tablet en kleine laptop (768 tot 1279) staan de kaarten onder
                    elkaar en liggend, met de tekst links en het beeld rechts, zodat de visuals hun leesbare maat houden */}
                <div data-reveal className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-10">
                    {situaties[language].map((s, i) => (
                        <div
                            key={i}
                            className="rv-card group relative flex flex-col rounded-3xl bg-[#fafafa] border border-foreground/[0.07] p-8 md:p-9 transition-colors duration-500 hover:bg-white hover:border-foreground/15 md:max-xl:grid md:max-xl:grid-cols-2 md:max-xl:grid-rows-[auto_auto_1fr] md:max-xl:gap-x-10 md:max-xl:items-start"
                        >
                            <CornerTrace />
                            <span className="text-sm text-accent tabular-nums">/{String(i + 1).padStart(2, '0')}</span>
                            <h3 className="mt-3 min-h-[2.5em] max-xl:min-h-0 text-2xl font-medium text-foreground leading-tight">{s.title}</h3>
                            <div className="relative mt-6 md:max-xl:mt-0 md:max-xl:[grid-column:2] md:max-xl:[grid-row:1/4] aspect-[4/3] rounded-2xl overflow-hidden bg-foreground/[0.04] flex items-center justify-center">
                                {beelden[i] || (import.meta.env.DEV && (
                                    <span className="text-sm text-foreground/30">{nl ? 'Beeld volgt' : 'Visual to follow'}</span>
                                ))}
                            </div>
                            <p className="mt-7 md:max-xl:mt-4 text-foreground/60 text-base leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
