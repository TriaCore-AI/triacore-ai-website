import React, { useRef } from 'react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import SectionNav from '../components/ui/section-nav';
import ToolsHero from '../components/ui/tools-hero';
import FogLift from '../components/ui/fog-lift';
import CTAButton from '../components/ui/cta-button';
import SolutionPicker from '../components/ui/solution-picker';
import ProcessSteps from '../components/ui/process-steps';
import FaqList from '../components/ui/faq-list';
import { AutoImage } from '../components/ui/auto-image';
import { useLanguage } from '../context/LanguageContext';
import useReveal from '../hooks/use-reveal';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projecten } from '../data/projecten';
import PlanningVisual from '../components/ui/planning-visual';
import { PlanningLearnVisual, PlanningAskVisual } from '../components/ui/planning-ai-visuals';
import DocumentVisual from '../components/ui/document-visual';
import PortalVisual from '../components/ui/portal-visual';

// De secties in het snelmenu linksonder, in de volgorde van de pagina (ids staan op de secties zelf)
const snelmenu = {
    nl: [
        { id: 'custom-tools', label: 'Custom tools' },
        { id: 'oplossingen', label: 'Enkele voorbeelden' },
        { id: 'klanten', label: 'Onze klanten' },
        { id: 'traject', label: 'Zo verloopt een traject' },
        { id: 'faq', label: 'Veelgestelde vragen' },
        { id: 'gesprek', label: 'Plan een gesprek' }
    ],
    en: [
        { id: 'custom-tools', label: 'Custom tools' },
        { id: 'oplossingen', label: 'A few examples' },
        { id: 'klanten', label: 'Our clients' },
        { id: 'traject', label: 'How a project runs' },
        { id: 'faq', label: 'FAQ' },
        { id: 'gesprek', label: 'Book a call' }
    ]
};

// De vier tools in de kiezer. `desc` beschrijft de software, `ai` wat de AI erin doet
// (een tool kan meerdere AI-toepassingen hebben). Heeft een AI-toepassing een eigen `visual`, dan wisselen die
// in de kiezer vanzelf. Anders toont de tool haar eigen `visual`, of zonder visual nog een plaatshouder.
const oplossingen = [
    {
        key: 'planning',
        name: { nl: 'Planning', en: 'Planning' },
        lead: { nl: 'Uw hele operatie live op één scherm.', en: 'Your entire operation, live on one screen.' },
        desc: {
            nl: 'Ritten, voertuigen, ploegen en onderaannemers staan in één planning. Verandert er iets, dan zien kantoor en chauffeurs het meteen.',
            en: 'Trips, vehicles, crews and subcontractors are all in one planning. If something changes, the office and drivers see it right away.'
        },
        ai: [
            {
                name: { nl: 'Planningsvoorstel', en: 'Planning proposal' },
                visual: <PlanningVisual />,
                desc: {
                    nl: 'Stelt een planning voor op basis van beschikbaarheid, belading en routes, ook als er onderweg iets wijzigt. Ook rijtijden, openingsuren en andere regels van uw bedrijf neemt de AI mee. U beslist wat er doorgaat.',
                    en: 'Proposes a planning based on availability, load and routes, even when something changes along the way. The AI also takes driving times, opening hours and your company\'s other rules into account. You decide what goes ahead.'
                }
            },
            {
                name: { nl: 'Leert van uw planner', en: 'Learns from your planner' },
                visual: <PlanningLearnVisual />,
                desc: {
                    nl: 'Onthoudt hoe uw planner werkt en wat die aanpast, zodat elk voorstel beter aansluit.',
                    en: 'Remembers how your planner works and what they change, so every proposal fits better.'
                }
            },
            {
                name: { nl: 'Stel vragen aan uw planning', en: 'Ask your planning questions' },
                visual: <PlanningAskVisual />,
                desc: {
                    nl: 'U vraagt in gewone taal wie morgen nog ruimte heeft of hoeveel er deze week vervoerd werd, en de AI antwoordt meteen.',
                    en: 'You ask in plain language who still has room tomorrow or how much was transported this week, and the AI answers right away.'
                }
            }
        ]
    },
    {
        key: 'app',
        name: { nl: 'App voor op de baan', en: 'App for the road' },
        lead: { nl: 'Wat onderweg gebeurt, staat meteen op kantoor.', en: 'What happens on the road reaches the office right away.' },
        desc: {
            nl: 'Uw chauffeurs, technici en verkopers registreren bonnen en ronden taken af, ook zonder bereik. De app synchroniseert vanzelf zodra er weer verbinding is, en niets moet achteraf nog overgetypt worden.',
            en: 'Your drivers, technicians and sales reps register notes and complete tasks, even without reception. The app syncs by itself as soon as there is a connection again, and nothing needs retyping afterwards.'
        },
        ai: [
            {
                name: { nl: 'Controle bij het indienen', en: 'Check on submission' },
                desc: {
                    nl: 'Merkt op wat ontbreekt of niet klopt, nog voor de registratie op kantoor is.',
                    en: 'Spots what is missing or does not add up, before the registration reaches the office.'
                }
            },
            {
                name: { nl: 'Factuurvoorstel', en: 'Invoice proposal' },
                desc: {
                    nl: 'Zet uit de registraties een factuur of afrekening klaar. U kijkt na en keurt goed.',
                    en: 'Prepares an invoice or settlement from the registrations. You review and approve.'
                }
            },
            {
                name: { nl: 'Offerte ter plaatse', en: 'Quote on site' },
                desc: {
                    nl: 'Maakt uit wat de verkoper ingeeft meteen een offerte op, klaar om te versturen.',
                    en: 'Turns what the sales rep enters into a quote right away, ready to send.'
                }
            }
        ]
    },
    {
        key: 'documenten',
        name: { nl: 'Documentbeheer', en: 'Document management' },
        visual: <DocumentVisual />,
        lead: { nl: 'Elk document meteen terug te vinden.', en: 'Every document, found in seconds.' },
        desc: {
            nl: 'Alles wat verspreid op schijven en in mappen staat, komt samen in één geordend archief, met rollen en een logboek van wie wat deed. Het origineel blijft altijd onaangeroerd.',
            en: 'Everything scattered across drives and folders comes together in one organised archive, with roles and a log of who did what. The original always stays untouched.'
        },
        ai: [
            {
                name: { nl: 'Automatisch ordenen', en: 'Automatic sorting' },
                desc: {
                    nl: 'Leest elk nieuw document, herkent wat het is en zet het op de juiste plaats. Twijfelt ze, dan kijkt een mens het na.',
                    en: 'Reads every new document, recognises what it is and puts it in the right place. When in doubt, a person checks it.'
                }
            },
            {
                name: { nl: 'Gegevens uitlezen', en: 'Data extraction' },
                desc: {
                    nl: 'Haalt datums, bedragen en vervaldagen uit elk document, zodat u geen vervaldatum meer mist.',
                    en: 'Pulls dates, amounts and expiry dates from every document, so you never miss a deadline again.'
                }
            },
            {
                name: { nl: 'Vragen aan uw documenten', en: 'Ask your documents' },
                desc: {
                    nl: 'Vraag welke keuringen volgende maand vervallen en u krijgt de lijst, met de documenten erbij.',
                    en: 'Ask which inspections expire next month and you get the list, with the documents attached.'
                }
            }
        ]
    },
    {
        key: 'portaal',
        name: { nl: 'Klantenportaal', en: 'Client portal' },
        visual: <PortalVisual />,
        lead: { nl: 'Externen werken in uw omgeving, onder uw regels.', en: 'External parties work in your environment, under your rules.' },
        desc: {
            nl: 'Klanten, onderaannemers en leveranciers krijgen een eigen toegang. Ze registreren, vragen aan of volgen op wat hen aanbelangt, en u bepaalt wie wat ziet. Zo gaan er minder mails en bijlagen heen en weer.',
            en: 'Clients, subcontractors and suppliers get their own access. They register, request or follow up on what concerns them, and you decide who sees what. That means fewer emails and attachments going back and forth.'
        },
        ai: [
            {
                name: { nl: 'Vragen van externen', en: 'Questions from partners' },
                desc: {
                    nl: 'Beantwoordt de vragen die klanten en partners het vaakst stellen, op basis van uw eigen regels en documenten.',
                    en: 'Answers the questions clients and partners ask most often, based on your own rules and documents.'
                }
            },
            {
                name: { nl: 'Aanmelden en goedkeuren', en: 'Onboarding and approval' },
                desc: {
                    nl: 'Controleert wat een partner indient, zoals een nieuwe chauffeur, en zet het klaar om goed te keuren.',
                    en: 'Checks what a partner submits, such as a new driver, and prepares it for approval.'
                }
            }
        ]
    },
    {
        key: 'materiaal',
        name: { nl: 'Materiaalbeheer', en: 'Equipment management' },
        lead: { nl: 'Weet altijd waar elke wagen en machine staat.', en: 'Always know where every vehicle and machine is.' },
        desc: {
            nl: 'Op het terrein, op een werf of verhuurd: per wagen of machine ziet u waar ze staat, bij wie en tot wanneer, samen met onderhoud, keuringen en schade.',
            en: 'On your premises, on a site or rented out: for every vehicle or machine you see where it is, with whom and until when, along with maintenance, inspections and damage.'
        },
        ai: [
            {
                name: { nl: 'Vragen aan uw materiaal', en: 'Ask your equipment' },
                desc: {
                    nl: 'Vraag in gewone taal waar de minikraan staat of wat er volgende week nog vrij is.',
                    en: 'Ask in plain language where the mini excavator is or what is still free next week.'
                }
            },
            {
                name: { nl: 'Foto bij uitgifte en terugkomst', en: 'Photo on handover and return' },
                desc: {
                    nl: 'Vergelijkt de foto\'s van voor en na en wijst op nieuwe schade. U beslist wat ermee gebeurt.',
                    en: 'Compares the photos from before and after and points out new damage. You decide what happens next.'
                }
            },
            {
                name: { nl: 'Waarschuwen voor wat stilligt of te laat is', en: 'Alerts for what sits idle or runs late' },
                desc: {
                    nl: 'Meldt een verhuur die over tijd is, of een machine die al weken ongebruikt op een werf staat.',
                    en: 'Flags a rental that is overdue, or a machine that has been sitting unused on a site for weeks.'
                }
            }
        ]
    }
];

// Zo verloopt een traject: de pijlers Begrijpen, Vertalen en Waarmaken, met Waarmaken opgesplitst
// in bouwen en begeleiden
const trajectStappen = {
    nl: [
        { word: 'Begrijpen', desc: 'U vertelt waar het stroef loopt en geeft ons enkele voorbeelden. Wij praten met de mensen die er elke dag mee werken.' },
        { word: 'Vertalen', desc: 'We zetten die inzichten om in een concreet plan, met een vrijblijvende demo die toont hoe we uw probleem op maat aanpakken.' },
        { word: 'Bouwen', desc: 'We bouwen de tool stap voor stap uit. Een eerste werkende versie staat er doorgaans binnen zes tot twaalf weken.' },
        { word: 'Begeleiden', desc: 'Na de oplevering blijven we erbij. We begeleiden uw team bij de start en sturen bij waar het beter kan.' }
    ],
    en: [
        { word: 'Understand', desc: 'You tell us where things get stuck and share a few examples. We talk to the people who work with it every day.' },
        { word: 'Translate', desc: 'We turn those insights into a concrete plan, with a no-obligation demo that shows how we tackle your problem.' },
        { word: 'Build', desc: 'We build the tool step by step. A first working version is usually ready within six to twelve weeks.' },
        { word: 'Guide', desc: 'After delivery we stay involved. We guide your team through the start and fine-tune where things can improve.' }
    ]
};

// Veelgestelde vragen over custom tools: de vragen die we in gesprekken het vaakst krijgen
const faqVragen = [
    {
        q: { nl: 'Wat kost een custom tool?', en: 'What does a custom tool cost?' },
        a: {
            nl: 'Dat hangt af van wat de tool moet doen, hoeveel mensen ermee werken en met welke systemen ze moet praten. Daarom hangen we er geen vast prijskaartje aan. Na een eerste gesprek krijgt u een duidelijke inschatting, zonder verborgen kosten, en u ziet de vrijblijvende demo voor u ergens aan vastzit.',
            en: 'That depends on what the tool needs to do, how many people work with it and which systems it has to talk to. That is why we do not put a fixed price tag on it. After a first conversation you get a clear estimate, without hidden costs, and you see the no-obligation demo before you commit to anything.'
        }
    },
    {
        q: { nl: 'Wanneer is een custom tool de juiste keuze?', en: 'When is a custom tool the right choice?' },
        a: {
            nl: 'Wanneer een proces door veel handen gaat en geen standaardpakket past bij hoe u werkt. Vaak loopt het vandaag via papier, Excel en overtypen, en werken er ook mensen buiten het kantoor of externe partijen aan mee. Lost een bestaande tool uw probleem op, dan zeggen we dat eerlijk.',
            en: 'When a process passes through many hands and no standard package fits how you work. Today it often runs on paper, spreadsheets and retyping, with people outside the office or external partners involved. If an existing tool solves your problem, we will tell you honestly.'
        }
    },
    {
        q: { nl: 'Hoe verloopt de ontwikkeling van mijn custom tool?', en: 'How does the development of my custom tool work?' },
        a: {
            nl: 'We bouwen in sprints: korte periodes van twee weken. Na elke sprint tonen we u wat er klaar is en stuurt u bij. Zo sluit de tool aan op wat u echt nodig hebt, en staat u achteraf niet voor verrassingen.',
            en: 'We build in sprints: short periods of two weeks. After every sprint we show you what is ready and you steer where needed. That way the tool fits what you really need, and there are no surprises afterwards.'
        }
    },
    {
        q: { nl: 'Kunnen we koppelen met ons ERP-systeem?', en: 'Can we connect to our ERP system?' },
        a: {
            nl: 'In de meeste gevallen wel. We koppelen aan uw ERP en bestaande software, zodat niemand gegevens dubbel moet ingeven. Uw ERP vervangen doen we niet: we bouwen wat ontbreekt. Of een koppeling kan, hangt af van wat uw systeem toelaat. Dat bekijken we samen in het eerste gesprek.',
            en: 'In most cases, yes. We connect to your ERP and existing software, so nobody has to enter data twice. We do not replace your ERP: we build what is missing. Whether a connection is possible depends on what your system allows. We look at that together in the first conversation.'
        }
    }
];

// Klanten die al voor een custom tool kozen: de projecten met een eigen casepagina
const customKlanten = projecten.filter((p) => p.status === 'live' && (p.types || ['custom']).includes('custom'));

// Custom tools (vroeger "Custom oplossingen"), in de nieuwe stijl: een header, de kiezer met de tools
// een smalle strook met de klanten die al voor een custom tool kozen en hoe een traject verloopt.
// De vorige versie van deze pagina staat bewaard in CustomOplossingenOud.jsx (niet meer gekoppeld aan een route).
export default function CustomOplossingen() {
    const { language } = useLanguage();
    const nl = language === 'nl';
    const pageRef = useRef(null);
    useReveal(pageRef);

    return (
        <div ref={pageRef} className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo
                title={nl ? 'Custom tools | TriaCore AI' : 'Custom tools | TriaCore AI'}
                description={nl
                    ? 'Software op maat rond uw processen, met AI waar het rendeert. Een planning, een app voor op de baan, documentbeheer of een klantenportaal, gebouwd rond hoe uw bedrijf echt werkt.'
                    : 'Custom software built around your processes, with AI where it pays off. A planning, an app for the road, document management or a client portal, built around how your business really works.'}
            />
            <Navbar />
            <SectionNav items={snelmenu[language]} />
            <main className="relative flex-grow">
                {/* Hero: gecentreerd, met daaronder de trechter waarin het handwerk verdwijnt. Terugdraaien naar
                    de eenvoudige, links uitgelijnde header: vervang ToolsHero door PageHeader (zelfde props) */}
                <ToolsHero
                    title={nl ? 'Custom tools' : 'Custom tools'}
                    intro={nl
                        ? 'Processen met veel mensen, veel stappen en veel gegevens krijgt u niet opgelost met één prompt. Wel met een tool op maat van uw bedrijf, waarin AI veilig met uw data werkt en stappen overneemt.'
                        : 'Processes with many people, many steps and lots of data cannot be solved with a single prompt. They can with a tool tailored to your business, where AI works safely with your data and takes over steps.'}
                >
                    <CTAButton to="/contact" size="md">
                        {nl ? 'Plan een gesprek' : 'Book a call'}
                    </CTAButton>
                </ToolsHero>

                {/* Enkele voorbeelden: de tools als tabs naast elkaar, daaronder links de interface en rechts
                    de software en de AI, over de volle breedte. Zit bij het laden onder de wolk, die bij het
                    scrollen wegtrekt, zoals op de pagina Tweede brein */}
                <FogLift>
                <section id="oplossingen" className="relative scroll-mt-28 px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
                    <div className="max-w-7xl mx-auto">
                        <div data-reveal-head className="overflow-hidden pb-3 mb-10 md:mb-14">
                            <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                                {nl ? 'Enkele voorbeelden.' : 'A few examples.'}
                            </h2>
                        </div>
                        <SolutionPicker
                            label={nl ? 'Onze tools' : 'Our tools'}
                            placeholder={nl ? 'Visual volgt' : 'Visual coming soon'}
                            aiLabel={nl
                                ? <>Wat de <span className="text-accent">AI</span> voor u doet</>
                                : <>What the <span className="text-accent">AI</span> does for you</>}
                            items={oplossingen.map((o) => ({
                                key: o.key,
                                name: o.name[language],
                                lead: o.lead[language],
                                desc: o.desc[language],
                                visual: o.visual,
                                ai: o.ai.map((a) => ({ name: a.name[language], desc: a.desc[language], visual: a.visual }))
                            }))}
                        />

                        {/* Voor wie iets anders in gedachten heeft dan de voorbeelden hierboven */}
                        <div className="mt-16 md:mt-20 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-12">
                            <div className="max-w-2xl">
                                <h3 className="text-2xl font-medium text-foreground leading-tight">
                                    {nl ? 'Staat uw idee er niet bij?' : 'Is your idea not listed?'}
                                </h3>
                                <p className="mt-3 text-base md:text-lg text-foreground/70 leading-relaxed">
                                    {nl
                                        ? 'Dit zijn enkele voorbeelden. Vertel ons wat u in gedachten hebt, dan bekijken we samen wat mogelijk is.'
                                        : 'These are just a few examples. Tell us what you have in mind, and we will look at what is possible together.'}
                                </p>
                            </div>
                            <CTAButton to="/contact" size="md" variant="secondary" className="self-start md:self-auto shrink-0">
                                {nl ? 'Bespreek uw idee' : 'Discuss your idea'}
                            </CTAButton>
                        </div>
                    </div>
                </section>
                </FogLift>

                {/* Smalle strook tussen twee dunne lijnen: wie al voor een custom tool koos, met per logo een
                    link naar de case */}
                <section id="klanten" className="relative px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
                    <div data-reveal-head className="relative max-w-7xl mx-auto py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                        <span aria-hidden="true" className="rv-line absolute inset-x-0 top-0 h-px bg-foreground/10 origin-left" />
                        <span aria-hidden="true" className="rv-line absolute inset-x-0 bottom-0 h-px bg-foreground/10 origin-left" />
                        <div className="rv-fade">
                            <p className="hero-title text-3xl md:text-4xl text-foreground">
                                {nl
                                    ? <>Zij kozen al voor een <span className="italic text-accent">custom tool</span>.</>
                                    : <>They already chose a <span className="italic text-accent">custom tool</span>.</>}
                            </p>
                            <p className="mt-3 text-[15px] text-foreground/60 leading-relaxed max-w-md">
                                {nl
                                    ? 'Lees hoe we te werk gingen, wat we bouwden en wat het hun concreet opleverde.'
                                    : 'Read how we went about it, what we built and what it delivered for them.'}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-start gap-x-14 gap-y-8">
                            {customKlanten.map((k) => (
                                <Link key={k.slug} to={`/projecten/${k.slug}`} className="rv-fade group flex flex-col items-start gap-3">
                                    <span className="h-10 flex items-center">
                                        <img src={k.logo} alt={k.client} className="max-h-10 max-w-[130px] w-auto object-contain mix-blend-multiply" />
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-sm text-foreground/50 transition-colors duration-300 group-hover:text-accent">
                                        {nl ? 'Lees de case' : 'Read the case'}
                                        <ArrowRight size={14} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Zo verloopt een traject: vier stappen op één lijn die zich tekent */}
                <section id="traject" className="relative px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
                    <div className="max-w-7xl mx-auto">
                        <div data-reveal-head className="overflow-hidden pb-3 mb-12 md:mb-16">
                            <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                                {nl ? 'Zo verloopt een traject.' : 'How a project runs.'}
                            </h2>
                        </div>
                        <ProcessSteps steps={trajectStappen[language]} />
                    </div>
                </section>

                {/* Veelgestelde vragen over custom tools */}
                <section id="faq" className="relative px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
                    <div className="max-w-7xl mx-auto">
                        <div data-reveal-head className="overflow-hidden pb-3 mb-8 md:mb-12">
                            <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                                {nl ? 'Veelgestelde vragen.' : 'Frequently asked questions.'}
                            </h2>
                        </div>
                        <div data-reveal-head>
                            <FaqList items={faqVragen.map((f) => ({ q: f.q[language], a: f.a[language] }))} />
                        </div>
                    </div>
                </section>

                {/* Afsluiter: de eerste twee stappen van het traject zijn vrijblijvend, met één knop en Rian als
                    eerste aanspreekpunt */}
                <section id="gesprek" className="relative px-6 md:px-16 lg:px-24 pt-8 md:pt-12 pb-24 md:pb-32">
                    <div data-reveal-head className="relative max-w-4xl mx-auto text-center">
                        <div className="overflow-hidden pb-3 mb-3">
                            <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                                {nl ? 'Eerst zien, dan beslissen.' : 'See first, then decide.'}
                            </h2>
                        </div>
                        <p className="rv-fade section-subtitle text-foreground/60 text-lg md:text-xl max-w-xl mx-auto">
                            {nl
                                ? 'Een eerste gesprek en een demo op maat zijn volledig vrijblijvend. U investeert pas als het plaatje klopt.'
                                : 'A first conversation and a tailored demo come with no obligation at all. You only invest once the picture is right.'}
                        </p>

                        <div className="rv-fade mt-10 md:mt-12 flex justify-center">
                            <CTAButton to="/contact" size="md">
                                {nl ? 'Plan een gesprek' : 'Book a call'}
                            </CTAButton>
                        </div>
                        <div className="rv-fade mt-10 flex justify-center">
                            <div className="inline-flex items-center gap-4 text-left">
                                <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden bg-foreground/5">
                                    <AutoImage basePath="/team/rian" alt="Rian Mathijs" className="w-full h-full object-cover grayscale" />
                                </div>
                                <div>
                                    <p className="text-base font-medium text-foreground leading-tight">
                                        Rian Mathijs <span className="font-normal text-foreground/50">· {nl ? 'uw eerste aanspreekpunt' : 'your first point of contact'}</span>
                                    </p>
                                    <p className="mt-1 text-sm text-foreground/60">
                                        <a href="mailto:rian.mathijs@triacore.be" className="hover:text-accent transition-colors">rian.mathijs@triacore.be</a>
                                        <span className="mx-2 text-foreground/30">·</span>
                                        <a href="tel:+32499874662" className="hover:text-accent transition-colors">+32 499 87 46 62</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
