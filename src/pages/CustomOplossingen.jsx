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
import { ArrowRight, BellRing, Brain, CalendarCheck, Camera, FileCheck, FileSearch, FolderInput, MessageCircle } from 'lucide-react';
import { projecten } from '../data/projecten';
import PlanningVisual from '../components/ui/planning-visual';
import { PlanningLearnVisual, PlanningAskVisual } from '../components/ui/planning-ai-visuals';
import { AppPhotoVisual, AppAskVisual } from '../components/ui/app-ai-visuals';
import { DocumentSortVisual, DocumentReadVisual, DocumentAskVisual } from '../components/ui/document-ai-visuals';
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

// De tools in de kiezer. `desc` beschrijft de software, `ai` wat automatisering en AI erin doen: elk wordt een
// wit kaartje, dus hou de tekst kort (maximaal vier regels). Het pilletje op het kaartje zegt AI, tenzij
// `automation` aanstaat: vaste regels zijn geen AI. Heeft een toepassing een eigen `visual`, dan wisselen
// die in de kiezer vanzelf. Anders toont de tool haar eigen `visual`, of zonder visual nog een plaatshouder.
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
                icon: CalendarCheck,
                name: { nl: 'Planningsvoorstel', en: 'Planning proposal' },
                visual: <PlanningVisual />,
                desc: {
                    nl: 'Plant op basis van beschikbaarheid, belading, routes en uw regels, ook bij wijzigingen. U beslist.',
                    en: 'Plans based on availability, load, routes and your rules, even when things change. You decide.'
                }
            },
            {
                icon: Brain,
                name: { nl: 'Leert van uw planner', en: 'Learns from your planner' },
                visual: <PlanningLearnVisual />,
                desc: {
                    nl: 'Onthoudt hoe uw planner werkt en wat die aanpast, zodat elk voorstel beter aansluit.',
                    en: 'Remembers how your planner works and what they change, so every proposal fits better.'
                }
            },
            {
                icon: MessageCircle,
                name: { nl: 'Stel vragen aan uw planning', en: 'Ask your planning questions' },
                visual: <PlanningAskVisual />,
                desc: {
                    nl: 'U vraagt in gewone taal wie morgen nog ruimte heeft, en de AI antwoordt meteen.',
                    en: 'You ask in plain language who still has room tomorrow, and the AI answers right away.'
                }
            }
        ]
    },
    {
        key: 'app',
        name: { nl: 'App voor op de baan', en: 'App for the road' },
        lead: { nl: 'Wat onderweg gebeurt, staat meteen op kantoor.', en: 'What happens on the road reaches the office right away.' },
        desc: {
            nl: 'Uw chauffeurs, technici en verkopers registreren hun werk in de app, ook zonder bereik. Op kantoor komt alles vanzelf binnen, en niemand moet nog iets overtypen.',
            en: 'Your drivers, technicians and sales reps register their work in the app, even without reception. Everything reaches the office by itself, and nobody has to retype anything.'
        },
        ai: [
            {
                icon: Camera,
                name: { nl: 'Foto wordt bon', en: 'Photo becomes slip' },
                visual: <AppPhotoVisual />,
                desc: {
                    nl: 'Leest een foto van een bon en vult de velden in. Ontbreekt er iets, dan ziet uw chauffeur het meteen.',
                    en: 'Reads a photo of a slip and fills in the fields. If something is missing, your driver sees it right away.'
                }
            },
            {
                icon: MessageCircle,
                name: { nl: 'Stel vragen aan uw registraties', en: 'Ask your records questions' },
                visual: <AppAskVisual />,
                desc: {
                    nl: 'Zie op kantoor in één oogopslag, voor de juiste periode en chauffeurs, of alles in orde is.',
                    en: 'See at a glance at the office, for the right period and drivers, whether everything is in order.'
                }
            }
        ]
    },
    {
        key: 'documenten',
        name: { nl: 'Documentbeheer', en: 'Document management' },
        lead: { nl: 'Elk document meteen terug te vinden.', en: 'Every document, found in seconds.' },
        desc: {
            nl: 'Alles wat nu verspreid of ongeordend staat, komt samen in één doorzoekbare kennisbank. Zo vinden uw medewerkers altijd alles terug en verliezen ze geen tijd meer aan zoeken.',
            en: 'Everything that is now scattered or unorganised comes together in one searchable knowledge base. So your employees always find everything and no longer lose time searching.'
        },
        ai: [
            {
                icon: FolderInput,
                name: { nl: 'Automatisch ordenen', en: 'Automatic sorting' },
                visual: <DocumentSortVisual />,
                desc: {
                    nl: 'Leest elk nieuw document en zet het op de juiste plaats. Twijfelt de AI, dan kijkt een mens het na.',
                    en: 'Reads every new document and puts it in the right place. If the AI is unsure, a person checks it.'
                }
            },
            {
                icon: FileSearch,
                name: { nl: 'Gegevens uitlezen', en: 'Data extraction' },
                visual: <DocumentReadVisual />,
                desc: {
                    nl: 'Haalt datums en bedragen uit elk document, en geeft een seintje voor een keuring of contract vervalt.',
                    en: 'Pulls dates and amounts from every document, and reminds you before an inspection or contract expires.'
                }
            },
            {
                icon: MessageCircle,
                name: { nl: 'Stel vragen aan uw documenten', en: 'Ask your documents questions' },
                visual: <DocumentAskVisual />,
                desc: {
                    nl: 'U vraagt welke keuringen volgende maand vervallen, en de AI antwoordt meteen, met de documenten erbij.',
                    en: 'You ask which inspections expire next month, and the AI answers right away, with the documents attached.'
                }
            }
        ]
    },
    {
        key: 'portaal',
        name: { nl: 'Klantenportaal', en: 'Client portal' },
        visual: <PortalVisual />,
        lead: { nl: 'Klanten en partners werken mee, onder uw regels.', en: 'Clients and partners work along, under your rules.' },
        desc: {
            nl: 'Klanten, onderaannemers en leveranciers krijgen een eigen toegang en zien enkel wat hen aanbelangt. Zo gaan er minder mails en bijlagen heen en weer.',
            en: 'Clients, subcontractors and suppliers get their own access and only see what concerns them. That means fewer emails and attachments going back and forth.'
        },
        ai: [
            {
                icon: FileCheck,
                name: { nl: 'Aanmeldingen nakijken', en: 'Checking submissions' },
                desc: {
                    nl: 'Leest wat een partner indient, zoals een attest, en merkt op wat ontbreekt of vervallen is. U beslist.',
                    en: 'Reads what a partner submits, such as a certificate, and spots what is missing or expired. You decide.'
                }
            },
            {
                icon: FolderInput,
                name: { nl: 'Alles in het juiste dossier', en: 'Everything in the right file' },
                desc: {
                    nl: 'Zet wat een partner oplaadt vanzelf in het juiste dossier, zonder doorsturen of overzetten.',
                    en: 'Puts what a partner uploads in the right file by itself, without forwarding or transferring.'
                }
            },
            {
                icon: BellRing,
                automation: true,
                name: { nl: 'Vanzelf herinneren', en: 'Automatic reminders' },
                desc: {
                    nl: 'Vraagt partners op tijd om een nieuw attest. Niemand moet er nog achteraan bellen.',
                    en: 'Asks partners for a new certificate in time. Nobody has to chase it by phone anymore.'
                }
            },
            {
                icon: MessageCircle,
                name: { nl: 'Antwoord op de vragen van uw partners', en: 'Answers to your partners\' questions' },
                desc: {
                    nl: 'Antwoordt in gewone taal, met enkel wat die partner mag zien. Anders gaat de vraag naar uw team.',
                    en: 'Answers in plain language, with only what that partner may see. Otherwise the question goes to your team.'
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
                icon: Camera,
                name: { nl: 'Foto bij uitgifte en terugkomst', en: 'Photo on handover and return' },
                desc: {
                    nl: 'Vergelijkt de foto\'s van voor en na en wijst op nieuwe schade. U beslist wat ermee gebeurt.',
                    en: 'Compares the photos from before and after and points out new damage. You decide what happens next.'
                }
            },
            {
                icon: BellRing,
                automation: true,
                name: { nl: 'Waarschuwen voor wat stilligt of te laat is', en: 'Alerts for what sits idle or runs late' },
                desc: {
                    nl: 'Meldt een verhuur die over tijd is, of een machine die al weken ongebruikt op een werf staat.',
                    en: 'Flags a rental that is overdue, or a machine that has been sitting unused on a site for weeks.'
                }
            },
            {
                icon: MessageCircle,
                name: { nl: 'Stel vragen aan uw materiaal', en: 'Ask your equipment questions' },
                desc: {
                    nl: 'U vraagt in gewone taal waar de minikraan staat of wat er volgende week nog vrij is.',
                    en: 'You ask in plain language where the mini excavator is or what is still free next week.'
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
                                ? <>Wat automatisering en <span className="text-accent">AI</span> voor u doen</>
                                : <>What automation and <span className="text-accent">AI</span> do for you</>}
                            moreLabel={nl ? 'En nog veel meer...' : 'And much more...'}
                            items={oplossingen.map((o) => ({
                                key: o.key,
                                name: o.name[language],
                                lead: o.lead[language],
                                desc: o.desc[language],
                                visual: o.visual,
                                ai: o.ai.map((a) => ({
                                    name: a.name[language],
                                    desc: a.desc[language],
                                    visual: a.visual,
                                    icon: a.icon,
                                    isAi: !a.automation,
                                    kind: a.automation ? (nl ? 'Automatisering' : 'Automation') : 'AI'
                                }))
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
