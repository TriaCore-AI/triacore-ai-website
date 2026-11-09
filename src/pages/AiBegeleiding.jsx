import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import SectionNav from '../components/ui/section-nav';
import CTAButton from '../components/ui/cta-button';
import AgentsVergelijking from '../components/ui/agents-vergelijking';
import TweedeBreinImpact from '../components/ui/tweede-brein-impact';
import TweedeBreinAchtergrond from '../components/ui/tweede-brein-achtergrond';
import ProcessSteps from '../components/ui/process-steps';
import FaqList from '../components/ui/faq-list';
import { AutoImage } from '../components/ui/auto-image';
import useReveal from '../hooks/use-reveal';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

// De secties in het snelmenu linksonder, in de volgorde van de pagina (ids staan op de secties zelf)
const snelmenu = {
    nl: [
        { id: 'tweede-brein', label: 'Tweede brein' },
        { id: 'verschil', label: 'Het verschil' },
        { id: 'oplevert', label: 'Wat het oplevert' },
        { id: 'opzet', label: 'Zo zetten we het op' },
        { id: 'faq', label: 'Veelgestelde vragen' },
        { id: 'gesprek', label: 'Plan een gesprek' }
    ],
    en: [
        { id: 'tweede-brein', label: 'Second Brain' },
        { id: 'verschil', label: 'The difference' },
        { id: 'oplevert', label: 'What it gives you' },
        { id: 'opzet', label: 'How we set it up' },
        { id: 'faq', label: 'Frequently asked questions' },
        { id: 'gesprek', label: 'Book a call' }
    ]
};

// Zo zetten we het op: dezelfde vorm als het traject bij Custom tools. De inhoud volgt het interne aanbod.
// Nog na te kijken voor het live gaat: de intake met de AI-assistent is nog niet getest
const opzetStappen = {
    nl: [
        { word: 'Tonen', desc: 'In een gratis kennismaking laten we met voorbeelden uit uw bedrijfstak zien wat er mogelijk is.' },
        { word: 'Begrijpen', desc: 'Elke medewerker chat ongeveer een kwartier met een AI-assistent over het dagelijkse werk. U krijgt daarna een eerlijk voorstel, ook als iets niet nodig blijkt.' },
        { word: 'Inrichten', desc: 'We ordenen uw kennis uit wat er al is, en spreken af wat AI zelf mag, wat met toestemming en wat nooit. Die keuze blijft bij u.' },
        { word: 'Begeleiden', desc: 'Uw team leert ermee werken met voorbeelden uit het eigen werk. Daarna houden wij alles up-to-date en kijken we elke maand wat beter kan.' }
    ],
    en: [
        { word: 'Show', desc: 'In a free introduction, we use examples from your industry to show what is possible.' },
        { word: 'Understand', desc: 'Each employee chats with an AI assistant for about fifteen minutes about their daily work. You then get an honest proposal, even if something turns out not to be needed.' },
        { word: 'Set up', desc: 'We organise your knowledge from what is already there, and agree on what AI may do by itself, what needs permission and what never. That choice stays with you.' },
        { word: 'Guide', desc: 'Your team learns to work with it using examples from their own work. After that, we keep everything up to date and check each month what can be better.' }
    ]
};

// Veelgestelde vragen. De vraag met welke AI-tool het werkt (ChatGPT, Claude, Copilot) ontbreekt bewust:
// die keuze ligt nog bij Lucas. Geen technische details over de beveiliging, zo spraken we af
const faqVragen = [
    {
        q: { nl: 'Wat is een tweede brein precies?', en: 'What exactly is a second brain?' },
        a: {
            nl: 'Een geordende verzameling notities met wat uw bedrijf weet: klanten, prijzen, afspraken en werkwijzen. AI leest die notities en werkt ermee, zodat u niet telkens opnieuw hoeft uit te leggen hoe het bij u zit.',
            en: 'An organised collection of notes with what your business knows: clients, prices, agreements and ways of working. AI reads those notes and works with them, so you do not have to explain how things work every time.'
        }
    },
    {
        q: { nl: 'Moeten we eerst alles opruimen?', en: 'Do we need to tidy everything up first?' },
        a: {
            nl: 'Nee. We vertrekken van de documenten en notities die er al zijn, en brengen daar structuur in. Het hoeft niet perfect te zijn om te beginnen.',
            en: 'No. We start from the documents and notes you already have, and bring structure to them. It does not have to be perfect to get started.'
        }
    },
    {
        q: { nl: 'Wie houdt het bij?', en: 'Who keeps it up to date?' },
        a: {
            nl: 'Nieuwe informatie komt eerst in een inbox. AI zet ze op de juiste plaats volgens vaste regels, en u kijkt na wat belangrijk is. Wij kijken elke maand mee en passen aan waar het beter kan.',
            en: 'New information goes to an inbox first. AI puts it in the right place following fixed rules, and you check what matters. We review it with you every month and adjust where things can improve.'
        }
    },
    {
        q: { nl: 'Zijn onze gegevens veilig?', en: 'Is our data safe?' },
        a: {
            nl: 'We werken veilig en GDPR-conform, en uw gegevens blijven van u. Samen spreken we af wie wat mag zien, en wat AI zelf mag, wat met toestemming en wat nooit. Bijzondere persoonsgegevens, zoals gezondheidsgegevens, horen er niet in.',
            en: 'We work securely and in line with the GDPR, and your data stays yours. Together we agree on who may see what, and what AI may do by itself, what needs permission and what never. Special categories of personal data, such as health data, do not belong in it.'
        }
    },
    {
        q: { nl: 'Wat kost het?', en: 'What does it cost?' },
        a: {
            nl: 'Dat hangt af van hoeveel mensen ermee werken, hoeveel kennis er al is en met welke systemen het moet samenwerken. Daarom hangen we er geen vast prijskaartje aan. Na een eerste gesprek krijgt u een duidelijke inschatting, zonder verborgen kosten. De licenties van uw AI-tool betaalt u rechtstreeks.',
            en: 'That depends on how many people work with it, how much knowledge is already there and which systems it has to work with. That is why we do not put a fixed price tag on it. After a first conversation you get a clear estimate, without hidden costs. You pay the licences for your AI tool directly.'
        }
    }
];

// De wolk over de eerste sectie na de hero: alles boven --lift - 30% is zichtbaar, vanaf --lift is alles
// weg. --lift gaat bij het scrollen van 0% (alles verborgen) naar 130% (alles zichtbaar)
const LIFT_END = 130;
const liftMask = 'linear-gradient(to bottom, #000 calc(var(--lift) - 30%), transparent var(--lift))';

// Tot welke scrollpositie de wolk wegtrekt: tot de sectie op ongeveer 60% van het venster staat, maar
// altijd over minstens een kwart van het venster, zodat het ook op een groot scherm rustig gaat.
// De animatie van de sectie zelf (tweede-brein-vergelijking.jsx) start net voor de wolk helemaal weg is
const fogEnd = (el) => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    return Math.max(top - window.innerHeight * 0.6, window.innerHeight * 0.25);
};

// Tweede brein (vroeger AI-begeleiding), in de nieuwe stijl. Eerst het probleem en de belofte; dan dezelfde
// vraag aan AI zonder en met een tweede brein, zodat het verschil meteen zichtbaar is; dan wat het oplevert,
// hoe we het opzetten, de veelgestelde vragen en de afsluiter. De klikbare demo staat in tweede-brein-probeer.jsx.
export default function AiBegeleiding() {
    const { language } = useLanguage();
    const nl = language === 'nl';
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const heroContentRef = useRef(null);

    useReveal(pageRef);

    // De hero (titel, ondertitel en knop) staat precies in het midden tussen de onderkant van de
    // navigatiebalk en de onderkant van het venster, op elk formaat. Dat gebeurt met de ruimte erboven;
    // de ruimte eronder blijft die van de andere pagina's, dus de eerste sectie staat op de gewone afstand
    // (en zit bij het laden onder de wolk). Past het blok niet, dan blijft er minstens de gewone ruimte.
    // Opnieuw berekend als de breedte of de hoogte van het blok verandert (niet bij elke hoogteverandering
    // van het venster: op een gsm schuift de adresbalk in en uit, en dan zou de hero verspringen)
    useLayoutEffect(() => {
        const hero = heroRef.current;
        const content = heroContentRef.current;
        let lastWidth = 0;
        const center = () => {
            const pill = document.querySelector('nav')?.firstElementChild;
            // De navigatiebalk staat vast bovenaan en verdwijnt nooit, dus dit klopt ook na scrollen
            const navBottom = pill ? pill.getBoundingClientRect().bottom : 0;
            const min = window.innerWidth >= 768 ? 192 : 160;
            const free = window.innerHeight - navBottom - content.offsetHeight;
            hero.style.paddingTop = `${Math.max(min, navBottom + free / 2)}px`;
            ScrollTrigger.refresh();
        };
        center();
        const onResize = () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            center();
        };
        lastWidth = window.innerWidth;
        const ro = new ResizeObserver(center);
        ro.observe(content);
        window.addEventListener('resize', onResize);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', onResize);
        };
    }, []);

    // Bij het laden veegt de titel open van links naar rechts, en komen de ondertitel en de knop zacht op.
    // Bij het scrollen trekt de wolk weg van de eerste sectie; terug naar boven scrollen draait dat om.
    // Wie minder beweging vraagt, ziet meteen alles
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const intro = gsap.timeline({ paused: true });
            intro.fromTo('.tb-title',
                { clipPath: 'inset(-20% 100% -35% -5%)', x: -16 },
                { clipPath: 'inset(-20% -5% -35% -5%)', x: 0, duration: 1.8, ease: 'power2.inOut', clearProps: 'clipPath' })
                .from('.tb-fade', { y: 10, opacity: 0, duration: 1.4, ease: 'power2.out', stagger: 0.12 }, 1.1);
            const play = () => intro.play();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
            else play();

            gsap.fromTo('.tb-fog', { '--lift': '0%' }, {
                '--lift': `${LIFT_END}%`,
                ease: 'none',
                scrollTrigger: {
                    start: 0,
                    end: () => fogEnd(pageRef.current.querySelector('.tb-fog')),
                    invalidateOnRefresh: true,
                    scrub: 0.6
                }
            });
            // De lettertypes veranderen de hoogte van de tekst, en dus de plaats van de secties
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
        }, pageRef);
        return () => ctx.revert();
    }, [language]);

    return (
        <div ref={pageRef} className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo
                title={nl ? 'Tweede brein | TriaCore AI' : 'Second Brain | TriaCore AI'}
                description={nl
                    ? 'We zetten AI volledig voor u op: het juiste plan in ChatGPT of Claude, workflows en connectoren, MCP-tools en skills. Zo kan uw team er meteen mee aan de slag.'
                    : 'We set up AI for you from start to finish: the right ChatGPT or Claude plan, workflows and connectors, MCP tools and skills. So your team can get going right away.'}
            />
            <Navbar />
            <SectionNav items={snelmenu[language]} />
            <main className="relative flex-grow">
                {/* Hero: de titel in het midden, eerst het probleem dat iedereen herkent en dan wat een
                    tweede brein eraan verandert, en een knop voor een gesprek */}
                {/* Onderaan dezelfde ruimte als de header op de andere pagina's (PageHeader, ToolsHero), dus ook
                    dezelfde afstand tot de eerste sectie. Die staat er al, maar zit bij het laden onder de wolk
                    (zie tb-fog). De ruimte bovenaan wordt berekend zodat het blok in het midden staat */}
                <section id="tweede-brein" ref={heroRef} className="relative px-6 md:px-16 lg:px-24 pt-40 md:pt-48 pb-20 md:pb-28">
                    {/* Op de achtergrond: zwevende pictogrammen die onderaan in de wolk vervagen */}
                    <TweedeBreinAchtergrond />
                    <div ref={heroContentRef} className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
                        <h1 className="tb-title hero-title text-foreground text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] leading-[1.02]">
                            {/* Vanaf md op twee regels, met het resultaat in het groen zoals "vooruitgang" op de homepage */}
                            <span className="md:block">{nl ? 'AI-agents die' : 'AI agents that'}</span>{' '}
                            <span className="md:block">
                                <span className="italic font-bold text-accent">{nl ? 'resultaten' : 'deliver'}</span>{' '}
                                {nl ? 'leveren' : 'results'}
                            </span>
                        </h1>
                        {/* Iets kleiner dan de intro van de andere pagina's, omdat de tekst langer is. Zelfzeker:
                            eerst drie stukken werk die indruk maken, dan het verschil tussen een snel antwoord
                            uit één prompt en werk waarop u kunt bouwen (verder uitgelegd lager op de pagina) */}
                        <p className="tb-fade mt-8 md:mt-10 max-w-3xl text-lg md:text-xl text-foreground/70 leading-relaxed">
                            {nl
                                ? 'Uw concurrenten vergeleken op honderd punten. Elke ochtend de aanbestedingen die bij u passen. Al uw contracten doorgelezen. Een prompt geeft u snel een antwoord, onze agents leveren werk waarop u kunt bouwen.'
                                : 'Your competitors compared on a hundred points. Every morning, the tenders that suit you. All your contracts read through. A prompt gives you a quick answer, our agents deliver work you can build on.'}
                        </p>
                        <div className="tb-fade mt-10 md:mt-12">
                            <CTAButton to="/contact" size="md">
                                {nl ? 'Plan een gesprek' : 'Book a call'}
                            </CTAButton>
                        </div>
                    </div>
                </section>

                {/* De wolk over de eerste sectie: bij het laden volledig verborgen, op elk formaat. Bij het
                    scrollen trekt de wolk zacht weg, van boven naar onder. Zonder animatie is alles zichtbaar.
                    De vergelijking van het tweede brein (tweede-brein-vergelijking.jsx) is vervangen door die
                    tussen een snelle prompt en een gerichte agent, maar blijft bewaard */}
                <div id="verschil" className="tb-fog" style={{ '--lift': `${LIFT_END}%`, WebkitMaskImage: liftMask, maskImage: liftMask }}>
                    <AgentsVergelijking language={language} />
                </div>

                <TweedeBreinImpact language={language} />

                {/* Zo zetten we het op: vier stappen op één lijn die zich tekent, zoals bij Custom tools */}
                <section id="opzet" className="relative px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
                    <div className="max-w-7xl mx-auto">
                        <div data-reveal-head className="overflow-hidden pb-3 mb-12 md:mb-16">
                            <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                                {nl ? 'Zo zetten we het op.' : 'How we set it up.'}
                            </h2>
                        </div>
                        <ProcessSteps steps={opzetStappen[language]} />
                    </div>
                </section>

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

                {/* Afsluiter: een vrijblijvend eerste gesprek, met één knop en Rian als eerste aanspreekpunt.
                    Dezelfde opbouw als bij Custom tools */}
                <section id="gesprek" className="relative px-6 md:px-16 lg:px-24 pt-8 md:pt-12 pb-24 md:pb-32">
                    <div data-reveal-head className="relative max-w-4xl mx-auto text-center">
                        <div className="overflow-hidden pb-3 mb-3">
                            <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                                {nl ? 'Begin met een gesprek.' : 'Start with a conversation.'}
                            </h2>
                        </div>
                        <p className="rv-fade section-subtitle text-foreground/60 text-lg md:text-xl max-w-xl mx-auto">
                            {nl
                                ? 'Een eerste gesprek is volledig vrijblijvend. We tonen wat een tweede brein voor uw bedrijf kan doen, en u beslist daarna.'
                                : 'A first conversation comes with no obligation at all. We show what a second brain can do for your business, and you decide afterwards.'}
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
