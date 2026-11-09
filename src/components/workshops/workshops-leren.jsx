import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Compass, Brain, ListChecks, Plug, Workflow } from 'lucide-react';
import CornerTrace from '../ui/corner-trace';
import { useLanguage } from '../../context/LanguageContext';

// Sectie 2: wat uw team leert. Zes onderwerpen van basis naar gevorderd als kaarten naast elkaar, in de geest
// van "See what Notion can do": bovenaan een icoontje, daaronder de titel met twee of drie korte zinnen uitleg. De
// titel heeft een vaste hoogte, zodat de uitleg over de kaarten op dezelfde hoogte begint. Op grote schermen
// alle zes op één rij, daaronder drie, twee of één per rij.
// Licht, zonder schaduw; bij hover wordt de kaart wit en tekent de L lijn zich. De kaarten komen na elkaar
// binnen via useReveal (.rv-card).
// Een onderwerp met `link` krijgt onderaan een tekstlink met pijltje, en dan is de hele kaart klikbaar.

// Het onderwerp Tweede brein linkte naar de pagina op /ai-begeleiding. Die is tijdelijk offline (6/11), dus de
// link is weg. Terugzetten: link: { to: '/ai-begeleiding', label: 'Ontdek het tweede brein' }

const onderwerpen = {
    nl: [
        { icon: ShieldCheck, title: 'Veilig werken', desc: 'Welke gegevens je in AI mag zetten en welke niet. En hoe je een antwoord nakijkt voor je het gebruikt.' },
        { icon: Compass, title: 'Juiste tools', desc: 'ChatGPT, Copilot, Claude: waarin ze verschillen en waarvoor elk het best werkt. Zo kies je wat bij jouw bedrijf past.' },
        { icon: Brain, title: 'Tweede brein', desc: 'Je klanten, producten en werkwijze op één plek, in een vorm die AI kan lezen. Zo hoef je niet elke keer opnieuw uit te leggen wie je bent.' },
        { icon: ListChecks, title: 'Skills', desc: 'Een skill is een vaste taak die je één keer goed uitlegt, zoals een offerte of een verslag. Daarna doet AI ze telkens op dezelfde manier.' },
        { icon: Plug, title: 'Connectoren', desc: 'Je koppelt AI aan je mail, agenda of CRM. Dan zoekt AI de informatie zelf op en hoef je niets meer te kopiëren en plakken.' },
        { icon: Workflow, title: 'AI laten werken', desc: 'Je geeft een opdracht in plaats van een vraag. AI voert de stappen zelf uit, en jij kijkt het resultaat na.' }
    ],
    en: [
        { icon: ShieldCheck, title: 'Working safely', desc: 'Which data you can put into AI and which you cannot. And how to check an answer before you use it.' },
        { icon: Compass, title: 'The right tools', desc: 'ChatGPT, Copilot, Claude: how they differ and what each does best. So you choose what fits your business.' },
        { icon: Brain, title: 'A second brain', desc: 'Your customers, products and way of working in one place, in a form AI can read. So you stop explaining who you are every time.' },
        { icon: ListChecks, title: 'Skills', desc: 'A skill is a recurring task you explain properly once, like a quote or a report. After that, AI does it the same way every time.' },
        { icon: Plug, title: 'Connectors', desc: 'You connect AI to your email, calendar or CRM. It then looks up the information itself, with no more copying and pasting.' },
        { icon: Workflow, title: 'Letting AI work', desc: 'You give an assignment instead of asking a question. AI carries out the steps itself, and you check the result.' }
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
                            {nl ? 'Wat je team leert.' : 'What your team learns.'}
                        </h2>
                    </div>
                    <p className="rv-fade text-foreground/60 text-lg md:text-xl leading-relaxed max-w-xl">
                        {nl
                            ? 'We stellen elke workshop samen uit deze onderwerpen, afgestemd op het niveau van je team en met voorbeelden uit het eigen werk.'
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
                                    laat de tweede leeg): zo begint de uitleg over alle kaarten op dezelfde hoogte, ook op
                                    smallere schermen waar sommige titels wel twee regels nodig hebben. Op gsm (één kaart
                                    per rij) valt er niets uit te lijnen: daar geen lege regel en iets minder ruimte */}
                                <h3 className="mt-12 min-h-[2.75em] max-sm:mt-8 max-sm:min-h-0 text-lg font-medium text-foreground leading-snug">{o.title}</h3>
                                <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{o.desc}</p>
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
