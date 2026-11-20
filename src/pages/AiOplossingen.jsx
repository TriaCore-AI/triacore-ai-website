import React, { useRef } from 'react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import { seoVoor } from '../data/seo';
import OplossingenHero from '../components/ui/oplossingen-hero';
import { heroTeksten } from '../data/oplossingen-hero';
import { LagenLicht } from '../components/ui/hero-achtergronden';
import NodigSectie from '../components/ui/nodig-sectie';
import VermogensSectie from '../components/ui/vermogens-sectie';
import ProcessSteps from '../components/ui/process-steps';
import FaqList from '../components/ui/faq-list';
import CTAButton from '../components/ui/cta-button';
import useReveal from '../hooks/use-reveal';
import kennisBeeld from '../assets/oplossingen/kennis.webp';
import gegevensBeeld from '../assets/oplossingen/gegevens.webp';
import invoerBeeld from '../assets/oplossingen/invoer.webp';
import koppelingenBeeld from '../assets/oplossingen/koppelingen.webp';
import controleBeeld from '../assets/oplossingen/controle.webp';
import feedbackBeeld from '../assets/oplossingen/feedback.webp';
import { useLanguage } from '../context/LanguageContext';

// AI-oplossingen (/ai-oplossingen), de opvolger van Custom tools (vroeger /custom-oplossingen, dat nu hierheen
// doorstuurt). Volgorde: hero met voorbeelden, wat een goede AI-oplossing nodig heeft, wat AI daarmee kan, hoe
// we werken, de veelgestelde vragen en een korte afsluiter. Nog te doen: bewijs met klanten.

// Wat een goede AI-oplossing nodig heeft. Per onderdeel twee of drie korte zinnen, neutraal en toegankelijk,
// zonder concrete voorbeelden: wat het voor je bedrijf betekent, zodat iedereen denkt "ah ja, dat is dat"
// (gekozen door Lucas, 20/11; lange uitleg wordt niet gelezen)
const onderdelen = {
    nl: [
        { id: 'kennis', naam: 'Kennis', beeld: kennisBeeld, alt: 'Een geordende kast met mappen en documenten, waarvan één groene map met het teken van de AI, en erboven een tekstballonnetje', tekst: [
            'Wat jullie weten, zit verspreid over mensen en documenten. Wij brengen het samen, zodat niemand het telkens opnieuw moet uitleggen. Zo antwoordt AI als een collega die je bedrijf door en door kent, en gaat er geen kennis verloren als iemand vertrekt.'
        ] },
        { id: 'gegevens', naam: 'Gegevens', beeld: gegevensBeeld, alt: 'Een databank met bovenop een nette tabel waarin één rij groen oplicht, met ernaast een klokje met een vinkje', tekst: [
            'Goede beslissingen vragen juiste cijfers. Wij zorgen dat AI altijd met de meest recente gegevens werkt. Alles staat op één plek, zodat iedereen met dezelfde informatie werkt en je op de antwoorden kan vertrouwen.'
        ] },
        { id: 'invoer', naam: 'Invoer', beeld: invoerBeeld, alt: 'Een gsm met de foto van een bon en daaronder de velden die vanzelf ingevuld zijn, met ernaast een werfhelm', tekst: [
            'Hoe vlotter je mensen informatie doorgeven, hoe meer AI ermee kan. Wij maken dat zo licht mogelijk. Wat één keer is ingegeven, hoeft niemand nog over te typen, en het is meteen beschikbaar voor wie het nodig heeft.'
        ] },
        { id: 'koppelingen', naam: 'Koppelingen', beeld: koppelingenBeeld, alt: 'Puzzelstukken voor het ERP, de boekhouding en de planning die in elkaar passen rond een groen stuk met het teken van de AI, met ernaast een los stukje', tekst: [
            'AI die enkel antwoorden geeft, helpt een beetje. AI die in je systemen werkt, neemt echt werk over. Wij zorgen voor die verbinding. Je hoeft niets te vervangen: we bouwen verder op de software die je vandaag al gebruikt.'
        ] },
        { id: 'controle', naam: 'Controle', beeld: controleBeeld, alt: 'Een tablet met een voorstel van AI en de knoppen goedkeuren en afwijzen; een hand staat op het punt goed te keuren, met ernaast een slotje', tekst: [
            'Vertrouwen groeit stap voor stap. AI begint met voorstellen, en jij beslist hoeveel ze zelf mag afhandelen. Zo hou je altijd zelf de touwtjes in handen.'
        ] },
        { id: 'feedback', naam: 'Feedback', beeld: feedbackBeeld, alt: 'Drie voorstellen van AI op een rij: het achterste heeft twee verbeteringen, het middelste één, en het voorste is juist', tekst: [
            'Een AI-oplossing is niet af op de dag van de oplevering. Ze leert van wie ermee werkt en wordt elke dag beter. Elke aanpassing van je team wordt bewaard, zodat dezelfde fout geen tweede keer gebeurt.'
        ] }
    ],
    en: [
        { id: 'kennis', naam: 'Knowledge', beeld: kennisBeeld, alt: 'A tidy shelf with binders and documents, one green binder carrying the sign of the AI, and a speech bubble above it', tekst: [
            'What you know is spread across people and documents. We bring it together, so nobody has to explain it over and over again. So AI answers like a colleague who knows your business inside out, and no knowledge is lost when someone leaves.'
        ] },
        { id: 'gegevens', naam: 'Data', beeld: gegevensBeeld, alt: 'A database with a neat table on top in which one row is highlighted green, with a clock and a check mark beside it', tekst: [
            'Good decisions need the right figures. We make sure AI always works with the most recent data. Everything is in one place, so everyone works with the same information and you can rely on the answers.'
        ] },
        { id: 'invoer', naam: 'Input', beeld: invoerBeeld, alt: 'A phone showing the photo of a slip with the fields below filled in automatically, with a safety helmet beside it', tekst: [
            'The more easily your people pass on information, the more AI can do with it. We make that as effortless as possible. What is entered once never has to be retyped, and it is immediately available to whoever needs it.'
        ] },
        { id: 'koppelingen', naam: 'Integrations', beeld: koppelingenBeeld, alt: 'Puzzle pieces for the ERP, the accounting and the schedule fitting together around a green piece with the sign of the AI, with one loose piece beside them', tekst: [
            'AI that only gives answers helps a little. AI that works inside your systems takes real work off your hands. We make that connection. You do not have to replace anything: we build on the software you already use today.'
        ] },
        { id: 'controle', naam: 'Control', beeld: controleBeeld, alt: 'A tablet showing a proposal from AI with approve and reject buttons; a hand is about to approve, with a padlock beside it', tekst: [
            'Trust grows step by step. AI starts by making suggestions, and you decide how much it may handle on its own. That way you always stay in control.'
        ] },
        { id: 'feedback', naam: 'Feedback', beeld: feedbackBeeld, alt: 'Three AI proposals in a row: the back one has two corrections, the middle one has one, and the front one is right', tekst: [
            'An AI solution is not finished on delivery day. It learns from the people who use it and gets better every day. Every adjustment your team makes is kept, so the same mistake does not happen twice.'
        ] }
    ]
};

// Wat AI kan zodra de onderdelen hierboven er staan (naar slide 9 van de presentatie voor Vanschoonbeek).
// Voorspellen staat er bewust niet bij: dat hebben we nog bij geen klant geleverd.
const vermogens = {
    nl: [
        { id: 'lezen', naam: 'Lezen', tekst: 'Haalt de gegevens uit mails, pdf\'s en foto\'s van bonnen en attesten, en zet ze meteen op de juiste plaats.' },
        { id: 'antwoorden', naam: 'Antwoorden', tekst: 'Beantwoordt vragen in gewone taal, uit al je documenten en gegevens, en toont waar het antwoord vandaan komt.' },
        { id: 'controleren', naam: 'Controleren', tekst: 'Legt documenten, gegevens en afspraken naast elkaar en toont wat afwijkt, ontbreekt of bijna vervalt.' },
        { id: 'voorstellen', naam: 'Voorstellen', zin: ['AI stelt voor.', 'Jouw mensen beslissen.'], tekst: 'Stelt een planning of een combinatie van ritten voor, volgens jouw regels. Je planner beslist.' },
        { id: 'uitvoeren', naam: 'Uitvoeren', tekst: 'Werkt een taak af over meerdere stappen: een aanvraag lezen, nakijken en een order klaarzetten. Jij keurt goed.' }
    ],
    en: [
        { id: 'lezen', naam: 'Read', tekst: 'Pulls the data from emails, PDFs and photos of slips and certificates, and puts it straight in the right place.' },
        { id: 'antwoorden', naam: 'Answer', tekst: 'Answers questions in plain language, from all your documents and data, and shows where the answer comes from.' },
        { id: 'controleren', naam: 'Check', tekst: 'Puts documents, data and agreements side by side and shows what deviates, is missing or is about to expire.' },
        { id: 'voorstellen', naam: 'Suggest', zin: ['AI suggests.', 'Your people decide.'], tekst: 'Suggests a schedule or a combination of trips, following your rules. Your planner decides.' },
        { id: 'uitvoeren', naam: 'Act', tekst: 'Works through a task in several steps: reading a request, checking it and preparing an order. You approve.' }
    ]
};

// Hoe we werken (naar slide 10 van de presentatie voor Vanschoonbeek, herschreven): eerst het geheel in kaart
// en een volledig plan, dan proces per proces bouwen zodat elk resultaat meetbaar is, en daarna verder
// bouwen en begeleiden. Bewust zonder doorlooptijd
const werkwijze = {
    nl: [
        { word: 'In kaart brengen', desc: 'We brengen je hele werking in kaart en maken samen één plan. Daarna bouwen we proces per proces, zodat je telkens meet wat het oplevert.' },
        { word: 'De waarde bewijzen', desc: 'We starten met het proces dat het meeste oplevert. Je ziet zwart op wit wat het verandert, en beslist pas dan over de volgende stap.' },
        { word: 'Bouwen en begeleiden', desc: 'Daarna bouwen we stap voor stap verder op dezelfde basis. We begeleiden je mensen en sturen samen bij waar het beter kan.' }
    ],
    en: [
        { word: 'Map it out', desc: 'We map your entire operation and draw up one plan together. Then we build process by process, so you measure what each one delivers.' },
        { word: 'Prove the value', desc: 'We start with the process that delivers the most. You see in black and white what it changes, and only then decide on the next step.' },
        { word: 'Build and guide', desc: 'From there we keep building step by step on the same foundation. We guide your people and fine-tune together where things can be better.' }
    ]
};

// Veelgestelde vragen over een AI-oplossing. De antwoorden blijven bij wat elders op de pagina al staat;
// de prijsvraag volgt het antwoord van de vroegere pagina Custom tools
const faq = {
    nl: [
        { q: 'Wat kunnen jullie allemaal bouwen?', a: 'Van een app voor je mensen op de baan of de werf tot een volledig platform voor op kantoor, met AI die documenten leest, vragen beantwoordt, planningen voorstelt of taken afwerkt. Alles bouwen we op maat. Daarom kijken we altijd eerst even samen hoe je bedrijf werkt en waar het het meeste oplevert, voor we iets voorstellen.' },
        { q: 'Moeten mijn gegevens eerst op orde zijn?', a: 'Nee. In de meeste bedrijven zitten gegevens verspreid over mails, Excel, pdf\'s en een paar systemen. Ze samenbrengen hoort bij ons werk: we zetten alles op één plek, met vaste afspraken over wat wat betekent, zodat AI met de juiste feiten werkt.' },
        { q: 'Moet ik mijn huidige software vervangen?', a: 'Nee. We koppelen aan je ERP, je boekhouding en de software die je al gebruikt, zodat niemand iets dubbel moet ingeven. We bouwen wat ontbreekt. Of een koppeling kan, hangt af van wat je systeem toelaat. Dat bekijken we samen in het eerste gesprek.' },
        { q: 'Moeten mijn mensen technisch zijn?', a: 'Nee. We bouwen het scherm op maat van wie ermee werkt, zo eenvoudig dat iedereen er meteen mee weg kan. Een vraag stellen gaat zoals een bericht sturen naar een collega. Bij de start begeleiden we je mensen.' },
        { q: 'Wat gebeurt er met onze gegevens?', a: 'Je gegevens blijven van jou. Je mensen zien enkel wat voor hen bedoeld is, en AI werkt binnen de grenzen die jij vastlegt. Hoe en waar alles bewaard wordt, spreken we vooraf samen af.' },
        { q: 'Wat kost een AI-oplossing?', a: 'Dat hangt af van wat ze moet doen, hoeveel mensen ermee werken en met welke systemen ze moet praten. Daarom hangen we er geen vast prijskaartje aan. Na een eerste gesprek krijg je een duidelijke inschatting, zonder verborgen kosten, en je ziet een vrijblijvende demo voor je ergens aan vastzit.' }
    ],
    en: [
        { q: 'What can you build?', a: 'From an app for your people on the road or on site to a complete platform for the office, with AI that reads documents, answers questions, suggests schedules or completes tasks. Everything is built to measure. That is why we always first take a quick look together at how your business works and where it delivers the most, before we propose anything.' },
        { q: 'Does my data need to be in order first?', a: 'No. In most companies data is scattered across emails, spreadsheets, PDFs and a few systems. Bringing it together is part of our job: we put everything in one place, with fixed definitions of what means what, so AI works with the right facts.' },
        { q: 'Do I have to replace my current software?', a: 'No. We connect to your ERP, your accounting and the software you already use, so nobody has to enter anything twice. We build what is missing. Whether a connection is possible depends on what your system allows. We look at that together in the first conversation.' },
        { q: 'Do my people need to be technical?', a: 'No. We build the screen around the people who use it, so simple that everyone can get going right away. Asking a question works like sending a message to a colleague. We guide your people through the start.' },
        { q: 'What happens to our data?', a: 'Your data stays yours. Everyone only sees what is meant for them, and AI works within the limits you set. How and where everything is stored, we agree on together in advance.' },
        { q: 'What does an AI solution cost?', a: 'That depends on what it needs to do, how many people work with it and which systems it has to talk to. That is why we do not put a fixed price tag on it. After an initial conversation you get a clear estimate with no hidden costs, and you see a no-obligation demo before you commit to anything.' }
    ]
};

export default function AiOplossingen() {
    const { language } = useLanguage();
    const nl = language === 'nl';
    const pageRef = useRef(null);
    useReveal(pageRef);

    return (
        <div ref={pageRef} className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo {...seoVoor('/ai-oplossingen', language)} />
            <Navbar />
            <main className="relative flex-grow">
                {/* Hero: gecentreerd de bovenregel, de titel, een korte ondertitel en een knop, op de zijden lagen.
                    Zonder visual (beslissing Lucas, 17/11). De voorbeelden met hun interfaces terugzetten in de hero:
                    geef oplossingen={heroOplossingen[language]} mee (data/oplossingen-hero.jsx), dan staan ze rechts
                    en de tekst links */}
                {/* Logo's van klanten onder de knop kan met klanten={...} en klantenLabel (oplossingen-hero.jsx);
                    op 17/11 even geprobeerd en weer weggelaten */}
                <OplossingenHero {...heroTeksten[language]} laag={<LagenLicht />} toon="licht" />

                {/* Wat een goede AI-oplossing nodig heeft: per onderdeel naam, visual en uitleg, op desktop in een
                    zigzag (links, rechts, links, ...), zonder iets vast te zetten */}
                <NodigSectie
                    titel={nl ? 'Wat een goede AI-oplossing nodig heeft.' : 'What a good AI solution needs.'}
                    intro={nl
                        ? 'AI is maar zo sterk als wat eronder ligt. Deze zes onderdelen bouwen we bij elke oplossing mee.'
                        : 'AI is only as strong as what lies beneath it. We build these six parts into every solution.'}
                    onderdelen={onderdelen[language]}
                    leeg={nl ? 'Visual volgt' : 'Visual coming soon'}
                />

                {/* Wat AI daarmee kan: per vermogen een kaart, twee ervan met een kleine interface */}
                <VermogensSectie
                    titel={nl
                        ? <>Zo wordt AI <span className="italic text-accent">een vaste kracht in je bedrijf.</span></>
                        : <>How AI becomes <span className="italic text-accent">a permanent member of your team.</span></>}
                    intro={nl
                        ? 'Staat de basis er, dan neemt AI echt werk over: van een vraag beantwoorden tot een taak volledig afwerken.'
                        : 'Once the foundation is in place, AI takes real work off your hands: from answering a question to completing a task.'}
                    nl={nl}
                    vermogens={vermogens[language]}
                />

                {/* Hoe we werken: drie stappen op één lijn die zich tekent (process-steps.jsx) */}
                <section id="werkwijze" className="relative scroll-mt-28 px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
                    <div className="max-w-7xl mx-auto">
                        <div data-reveal-head className="mb-12 md:mb-16">
                            <div className="overflow-hidden pb-3 mb-3">
                                <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl leading-[1.08]">
                                    {nl
                                        ? <>Eén volledig plan, <span className="italic text-accent">proces per proces gebouwd.</span></>
                                        : <>One complete plan, <span className="italic text-accent">built process by process.</span></>}
                                </h2>
                            </div>
                            <p className="rv-fade text-foreground/60 text-lg md:text-xl leading-relaxed max-w-xl">
                                {nl
                                    ? 'Geen groot project in één keer, maar stap voor stap, met resultaat dat je kan meten.'
                                    : 'Not one big project at once, but step by step, with results you can measure.'}
                            </p>
                        </div>
                        <ProcessSteps steps={werkwijze[language]} />
                    </div>
                </section>

                {/* Veelgestelde vragen over een AI-oplossing */}
                {/* Gecentreerd: titel, ondertitel en de lijst met vragen in het midden van de pagina */}
                <section id="faq" className="relative scroll-mt-28 px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
                    <div className="max-w-5xl mx-auto">
                        <div data-reveal-head className="mb-8 md:mb-12 text-center">
                            <div className="overflow-hidden pb-3 mb-3">
                                <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                                    {nl ? 'Veelgestelde vragen.' : 'Frequently asked questions.'}
                                </h2>
                            </div>
                            <p className="rv-fade text-foreground/60 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
                                {nl
                                    ? 'Wat zaakvoerders ons het vaakst vragen voor we starten.'
                                    : 'What business owners ask us most before we start.'}
                            </p>
                        </div>
                        <div data-reveal-head>
                            <FaqList items={faq[language]} />
                        </div>
                    </div>
                </section>

                {/* Korte afsluiter: één zin en één knop */}
                <section id="gesprek" className="relative px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
                    <div data-reveal-head className="max-w-3xl mx-auto text-center">
                        <div className="overflow-hidden pb-3 mb-3">
                            <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl leading-[1.08]">
                                {nl
                                    ? <>Eerst zien, <span className="italic text-accent">dan beslissen.</span></>
                                    : <>See first, <span className="italic text-accent">then decide.</span></>}
                            </h2>
                        </div>
                        <p className="rv-fade text-foreground/60 text-lg md:text-xl leading-relaxed">
                            {nl
                                ? 'Een eerste gesprek en een demo op maat zijn vrijblijvend.'
                                : 'An initial conversation and a tailored demo come with no obligation.'}
                        </p>
                        <div className="rv-fade mt-9 flex justify-center">
                            <CTAButton to="/contact" size="md">{nl ? 'Plan een gesprek' : 'Book a call'}</CTAButton>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
