import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Compass, Brain, ListChecks, Plug, Workflow } from 'lucide-react';
import CornerTrace from '../ui/corner-trace';
import { useLanguage } from '../../context/LanguageContext';

// Sectie 2: wat uw team leert. Zes onderwerpen van basis naar gevorderd als kaarten naast elkaar, in de geest
// van "See what Notion can do": bovenaan een icoontje, daaronder de titel met één korte regel. Titel en uitleg
// hebben een vaste hoogte, zodat alles over de kaarten netjes uitlijnt, hoe lang de tekst ook is. Op grote schermen
// alle zes op één rij, daaronder drie, twee of één per rij.
// Licht, zonder schaduw; bij hover wordt de kaart wit en tekent de L lijn zich. De kaarten komen na elkaar
// binnen via useReveal (.rv-card).
// Een onderwerp met `link` krijgt onderaan een tekstlink met pijltje, en dan is de hele kaart klikbaar.

// De pagina van het tweede brein staat voorlopig nog op de route van AI-begeleiding
const TWEEDE_BREIN = '/ai-begeleiding';

const onderwerpen = {
    nl: [
        { icon: ShieldCheck, title: 'Veilig werken', desc: 'Wat mag, wat niet, en wat u altijd nakijkt.' },
        { icon: Compass, title: 'Juiste tools', desc: 'Welke tool waarvoor, en wat bij uw bedrijf past.' },
        { icon: Brain, title: 'Tweede brein', desc: 'Uw kennis op één plek, zodat AI uw werk kent.', link: { to: TWEEDE_BREIN, label: 'Ontdek het tweede brein' } },
        { icon: ListChecks, title: 'Skills', desc: 'Taken één keer uitleggen, daarna in uw stijl.' },
        { icon: Plug, title: 'Connectoren', desc: 'AI die zelf in uw mail, agenda en CRM kijkt.' },
        { icon: Workflow, title: 'AI laten werken', desc: 'AI voert taken zelf uit, van begin tot eind.' }
    ],
    en: [
        { icon: ShieldCheck, title: 'Working safely', desc: 'What is allowed, what is not, what you check.' },
        { icon: Compass, title: 'The right tools', desc: 'Which tool for what, and what fits your business.' },
        { icon: Brain, title: 'A second brain', desc: 'Your knowledge in one place, so AI knows your work.', link: { to: TWEEDE_BREIN, label: 'Discover the Second Brain' } },
        { icon: ListChecks, title: 'Skills', desc: 'Explain a task once, then always in your style.' },
        { icon: Plug, title: 'Connectors', desc: 'AI that looks into your email, calendar and CRM.' },
        { icon: Workflow, title: 'Letting AI work', desc: 'AI carries out tasks itself, start to finish.' }
    ]
};

export default function WorkshopsLeren() {
    const { language } = useLanguage();
    const nl = language === 'nl';

    return (
        <section id="leren" className="px-6 md:px-16 lg:px-24 pt-8 md:pt-12 pb-16 md:pb-24">
            <div className="max-w-7xl mx-auto">
                <div data-reveal className="mb-12 md:mb-16">
                    <div className="overflow-hidden pb-3 mb-3">
                        <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                            {nl ? 'Wat uw team leert.' : 'What your team learns.'}
                        </h2>
                    </div>
                    <p className="rv-fade text-foreground/60 text-lg md:text-xl leading-relaxed max-w-xl">
                        {nl
                            ? 'We stellen elke workshop samen uit deze onderwerpen, afgestemd op het niveau van uw team en met voorbeelden uit het eigen werk.'
                            : "We build every workshop from these topics, tailored to your team's level and with examples from their own work."}
                    </p>
                </div>

                <ol data-reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-5">
                    {onderwerpen[language].map((o, i) => {
                        const Icon = o.icon;
                        return (
                            <li
                                key={i}
                                className="rv-card group relative flex flex-col rounded-3xl bg-[#fafafa] border border-foreground/[0.07] p-6 transition-colors duration-500 hover:bg-white hover:border-foreground/15"
                            >
                                <CornerTrace />
                                <div className="flex items-start justify-between">
                                    <span className="w-11 h-11 rounded-full border border-foreground/10 flex items-center justify-center text-accent transition-colors duration-500 group-hover:border-accent/40">
                                        <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                                    </span>
                                    <span className="text-sm text-foreground/30 tabular-nums">/{String(i + 1).padStart(2, '0')}</span>
                                </div>
                                {/* Titel op een vaste afstand onder het icoontje en altijd twee regels hoog (een korte titel
                                    laat de tweede leeg), uitleg altijd drie regels hoog: zo begint de uitleg over alle kaarten
                                    op dezelfde hoogte, ook op smallere schermen waar sommige titels wel twee regels nodig hebben */}
                                <h3 className="mt-12 min-h-[2.75em] text-lg font-medium text-foreground leading-snug">{o.title}</h3>
                                <p className="mt-2 min-h-[4.875em] text-sm text-foreground/60 leading-relaxed">{o.desc}</p>
                                {/* De link rekt zich over de hele kaart uit (after:inset-0), zodat de kaart zelf klikbaar is */}
                                {o.link && (
                                    <Link
                                        to={o.link.to}
                                        className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors duration-300 group-hover:text-accent after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                                    >
                                        {o.link.label}
                                        <ArrowRight size={14} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
