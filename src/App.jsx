import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import Footer from './components/ui/footer';
import Navbar from './components/ui/navbar';
import CTAButton from './components/ui/cta-button';
import CornerTrace from './components/ui/corner-trace';
import CardCarousel from './components/ui/card-carousel';
import { useLanguage } from './context/LanguageContext';
import { AutoImage } from './components/ui/auto-image';
import { projecten } from './data/projecten';
import medtronicLogo from './assets/klantcases/medtronic.png';
import theBoxLogo from './assets/klantcases/the-box.png';
import naomiPhoto from './assets/quotes/naomi-clear.png';
import QuoteStage from './components/ui/quote-stage';
import SectionNav from './components/ui/section-nav';
import FaqList from './components/ui/faq-list';
import Seo from './components/ui/seo';

gsap.registerPlugin(ScrollTrigger);

// Klanten voor wie we een workshop gaven. Ze staan bij de klantcases en in de logorij van de hero,
// maar hebben geen eigen projectpagina
const workshopKlanten = [
  { key: 'medtronic', name: 'Medtronic', logo: medtronicLogo, sector: { nl: 'Medische technologie', en: 'Medical technology' } },
  { key: 'the-box', name: 'The Box', logo: theBoxLogo, sector: { nl: 'Vastgoed', en: 'Real estate' } }
];

// Klantquotes. Een foto is optioneel. De Engelse versie staat er letterlijk zoals de klant ze gaf,
// de Nederlandse is een vrije vertaling.
// Plaatshouders (placeholder: true) verschijnen enkel op de lokale dev server, nooit op de echte site:
// een verzonnen getuigenis van een echte klant mag niet live gaan.
const klantQuotes = [
  {
    key: 'medtronic',
    company: 'Medtronic',
    logo: medtronicLogo,
    photo: naomiPhoto,
    name: 'Naomi Clear',
    role: 'Business Director North Europe, UK & Ireland, Nordics, Benelux, Germany & Alpine · Neurovascular',
    quote: {
      nl: 'Lucas van TriaCore gaf ons Sales en Marketing team voor UKI en BeneNord een bijzonder waardevolle AI training van anderhalf uur. We gingen aan de slag met praktische toepassingen van AI, waaronder het concept van een “Second Brain”, om workflows te stroomlijnen, productiever te werken en onze dagelijkse manier van werken te verbeteren. We hebben nu een praktisch draaiboek om wat we leerden te verankeren in ons dagelijks werk. Ik kan Lucas en TriaCore van harte aanbevelen voor elk team dat echt praktisch voordeel wil halen uit AI.',
      en: 'Lucas from TriaCore delivered an extremely valuable 90-minute AI training session to our UKI and BeneNord Sales and Marketing team. The session explored practical applications of AI, including the “Second Brain” concept, to streamline workflows, improve productivity and enhance day-to-day ways of working. We now have a practical playbook to help embed these learnings into our daily activities. I would highly recommend Lucas and TriaCore to any team looking to maximise the practical benefits of AI.'
    }
  },
  {
    key: 'croes',
    placeholder: true,
    company: 'Croes NV',
    logo: projecten.find((p) => p.slug === 'croes-nv')?.logo,
    name: 'Naam volgt',
    role: 'Functie volgt · Croes NV',
    quote: { nl: '[Plaatshouder] De quote van Croes NV volgt.', en: '[Placeholder] The quote from Croes NV will follow.' }
  },
  {
    key: 'the-box',
    placeholder: true,
    company: 'The Box',
    logo: theBoxLogo,
    name: 'Naam volgt',
    role: 'Functie volgt · The Box',
    quote: { nl: '[Plaatshouder] De quote van The Box volgt.', en: '[Placeholder] The quote from The Box will follow.' }
  }
].filter((q) => !q.placeholder || import.meta.env.DEV);

// Veelgestelde vragen (overgenomen van de vorige homepage)
const faqVragen = [
  {
    q: { nl: 'Wat kost een custom oplossing?', en: 'What does a custom solution cost?' },
    a: {
      nl: 'De kostprijs hangt af van de complexiteit van het probleem, het aantal gebruikers en de technieken die we inzetten. We werken nooit met een vast prijskaartje omdat elke oplossing anders is. Na een eerste gesprek maken we een duidelijke inschatting zonder verborgen kosten.',
      en: 'The cost depends on the complexity of the problem, the number of users and the techniques we use. We never work with a fixed price tag because every solution is different. After a first conversation, we make a clear estimate without hidden costs.'
    }
  },
  {
    q: { nl: 'Hoe lang duurt het om een custom oplossing te bouwen?', en: 'How long does it take to build a custom solution?' },
    a: {
      nl: 'Een eerste werkende versie bouwen we doorgaans in zes tot twaalf weken. We werken iteratief: u ziet vroeg resultaat en geeft feedback voor we verder bouwen.',
      en: 'We typically build a first working version in six to twelve weeks. We work iteratively: you see results early and give feedback before we build further.'
    }
  },
  {
    q: { nl: 'Bouwen jullie altijd custom of raden jullie soms een bestaande tool aan?', en: 'Do you always build custom or do you sometimes recommend an existing tool?' },
    a: {
      nl: 'Niet elk probleem vraagt om maatwerk. Als een bestaande tool uw probleem oplost, zeggen we dat eerlijk en helpen we u op weg. We bouwen een custom oplossing alleen als het de juiste keuze is.',
      en: 'Not every problem needs custom work. If an existing tool solves your problem, we say so honestly and help you get started. We only build a custom solution when it is the right choice.'
    }
  },
  {
    q: { nl: 'Moet ik meteen een volledig systeem bouwen of kan ik stapsgewijs starten?', en: 'Do I have to build a full system right away or can I start step by step?' },
    a: {
      nl: 'U hoeft niet alles in één keer te bouwen. We starten vaak met één concreet proces, bewijzen de waarde en bouwen daarna verder. Zo houdt u controle over de investering en ziet u snel resultaat.',
      en: 'You do not have to build everything at once. We often start with one concrete process, prove its value and then build further. That way you stay in control of the investment and see results quickly.'
    }
  },
  {
    q: { nl: 'Hoe beveiligen jullie de software die jullie bouwen?', en: 'How do you secure the software you build?' },
    a: (language) => language === 'nl' ? (
      <>Wij beveiligen onze software via <a href="https://www.aikido.dev/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Aikido</a>, een gespecialiseerd beveiligingsplatform dat continu onze code en systemen scant op kwetsbaarheden. Zo is uw oplossing van dag één beschermd tegen bekende risico's.</>
    ) : (
      <>We secure our software with <a href="https://www.aikido.dev/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Aikido</a>, a specialised security platform that continuously scans our code and systems for vulnerabilities. That way your solution is protected against known risks from day one.</>
    )
  }
];

// De secties in het snelmenu linksonder, in de volgorde van de pagina
const snelmenu = {
  nl: [
    { id: 'home', label: 'Home' },
    { id: 'klantcases', label: 'Bewezen in de praktijk' },
    { id: 'oplossingen', label: 'Onze oplossingen' },
    { id: 'aanpak', label: 'Onze aanpak' },
    { id: 'quotes', label: 'Wat klanten zeggen' },
    { id: 'team', label: 'Het team' },
    { id: 'faq', label: 'Veelgestelde vragen' },
    { id: 'gesprek', label: 'Plan een gesprek' }
  ],
  en: [
    { id: 'home', label: 'Home' },
    { id: 'klantcases', label: 'Proven in practice' },
    { id: 'oplossingen', label: 'Our solutions' },
    { id: 'aanpak', label: 'Our approach' },
    { id: 'quotes', label: 'What clients say' },
    { id: 'team', label: 'The team' },
    { id: 'faq', label: 'FAQ' },
    { id: 'gesprek', label: 'Book a call' }
  ]
};

// Onze aanpak: de drie pijlers, één per balk van het logo
const aanpakPijlers = {
  nl: [
    { word: 'Begrijpen', desc: 'We leren jouw uitdagingen echt kennen.' },
    { word: 'Vertalen', desc: 'We vertalen jouw uitdaging naar een concreet plan.' },
    { word: 'Waarmaken', desc: 'We realiseren je oplossing en begeleiden je onderweg.' }
  ],
  en: [
    { word: 'Understand', desc: 'We get to know your challenges inside out.' },
    { word: 'Translate', desc: 'We turn your challenge into an actionable plan.' },
    { word: 'Deliver', desc: 'We deliver your solution and guide you along the way.' }
  ]
};

// Maten van het logoschema in pixels, afgeleid van het logo (viewBox 406.72 x 249.46, balken 291.56 x 48.57).
// Alles staat ten opzichte van het midden van de sectie
// Op schermen smaller dan totalW wordt het hele schema evenredig kleiner geschaald
const AANPAK = (() => {
  const logoW = 440;
  const s = logoW / 406.72;
  const barW = 291.56 * s, barH = 48.57 * s;
  const left = -logoW / 2;
  const lineFrom = left + barW + 20;   // de lijn vertrekt net naast het uiteinde van de balk
  const lineLen = 90;
  const textFrom = lineFrom + lineLen + 20;
  const textW = 380;
  return {
    barW, barH,
    logoH: 249.46 * s,
    bars: [
      { left, top: 0 },
      { left: left + 115.16 * s, top: 100.45 * s },
      { left, top: 200.89 * s }
    ],
    lineFrom, lineLen, textFrom, textW,
    totalW: 2 * (textFrom + textW)
  };
})();

function App() {
  const { language } = useLanguage();
  const containerRef = useRef(null);
  // Of het aanpakschema al eens volledig afgespeeld is; daarna blijft het staan
  const aanpakDone = useRef(false);
  // Rondt het aanpakschema meteen af (gebruikt door het snelmenu); wordt gezet door de animatie hieronder
  const finishAanpak = useRef(null);

  // Schaal van het aanpakschema: 1 als het past, kleiner op smallere schermen (192px = de zijmarges)
  const [aanpakScale, setAanpakScale] = useState(1);
  useEffect(() => {
    const fit = () => setAanpakScale(Math.min(1, (document.documentElement.clientWidth - 192) / AANPAK.totalW));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // General scroll animations (movement AND opacity for smoothness)
      const scrollElements = gsap.utils.toArray('.scroll-animate');
      scrollElements.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true
            },
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
          }
        );
      });

      // Rustige scrollanimaties voor klantcases, oplossingen en team.
      // Overal dezelfde uitloop en drie bewegingen: titels schuiven op uit een masker,
      // lijnen tekenen zich van links naar rechts, foto's onthullen zich van onder naar boven.
      // Wie in het systeem minder beweging vraagt, krijgt alles meteen te zien.
      mm.add({
        motion: '(prefers-reduced-motion: no-preference)',
        wide: '(min-width: 768px)',
        xl: '(min-width: 1280px)'
      }, (context) => {
        const { motion, wide, xl } = context.conditions;
        if (!motion) return;

        const EASE = 'expo.out';
        const LINE_EASE = 'power3.inOut';
        // Tempo van alle animaties: lager is trager (1 is het originele tempo)
        const PACE = 0.7;
        const onEnter = (trigger, start = 'top 85%') => ({ trigger, start, once: true });
        const reveal = (trigger, start) => gsap.timeline({ scrollTrigger: onEnter(trigger, start) }).timeScale(PACE);

        // Hero bij het laden: elke regel onthult zich vloeiend van links naar rechts, als een zachte veeg,
        // met een kleine meegaande beweging. De clip loopt wat buiten de regel, zodat staartjes en
        // schuine letters nooit afgeknipt worden. Daarna volgen zin, knoppen en logo's.
        // Start pas als de lettertypes geladen zijn, anders verspringt de tekst midden in de animatie.
        const heroTl = gsap.timeline({ paused: true });
        gsap.utils.toArray('.hero-row').forEach((row, i) => {
          heroTl.fromTo(row,
            { clipPath: 'inset(-20% 100% -35% -5%)', x: -16 },
            { clipPath: 'inset(-20% -5% -35% -5%)', x: 0, duration: 1.8, ease: 'power2.inOut', clearProps: 'clipPath' },
            i * 0.35);
        });
        heroTl
          .from('.hero-fade', { y: 10, opacity: 0, duration: 1.4, ease: 'power2.out', stagger: 0.12 }, 1.1)
          .from('.hero-logo', { opacity: 0, duration: 1.4, ease: 'power2.out', stagger: 0.1 }, 1.5);
        const playHero = () => heroTl.play();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(playHero);
        else playHero();

        // Titelblokken: titel uit het masker, daarna de rest zacht omhoog
        gsap.utils.toArray('[data-reveal-head]').forEach((head) => {
          const tl = reveal(head);
          const masks = head.querySelectorAll('.rv-mask-inner');
          const fades = head.querySelectorAll('.rv-fade');
          if (masks.length) tl.from(masks, { yPercent: 110, duration: 1.4, ease: EASE });
          if (fades.length) tl.from(fades, { y: 16, opacity: 0, duration: 1.2, ease: EASE, stagger: 0.1 }, masks.length ? 0.25 : 0);
        });

        // Klantcases: kaarten komen na elkaar binnen, de lijn in elke kaart tekent zich daarna
        gsap.utils.toArray('.klantcases-card').forEach((card, i) => {
          // Kaarten op één rij krijgen een kleine verschuiving, zodat ze na elkaar binnenkomen
          const offset = wide ? Math.min(i, 3) * 0.12 : 0;
          const tl = reveal(card, 'top 88%');
          tl.from(card, { y: 48, opacity: 0, duration: 1.4, ease: EASE }, offset);
          const line = card.querySelector('.rv-line');
          if (line) tl.from(line, { scaleX: 0, duration: 1.2, ease: LINE_EASE }, offset + 0.35);
        });

        // Oplossingen: per rij eerst de lijn, dan de grote titel uit het masker, dan de uitleg
        gsap.utils.toArray('.oplossing-row').forEach((row) => {
          const tl = reveal(row);
          tl.from(row.querySelector('.rv-line'), { scaleX: 0, duration: 1.4, ease: LINE_EASE })
            .from(row.querySelector('.rv-mask-inner'), { yPercent: 110, duration: 1.4, ease: EASE }, 0.3)
            .from(row.querySelectorAll('.rv-fade'), { y: 16, opacity: 0, duration: 1.2, ease: EASE, stagger: 0.1 }, 0.45);
        });
        reveal('.oplossing-end', 'top 92%').from('.oplossing-end', { scaleX: 0, duration: 1.4, ease: LINE_EASE });
        // Team: foto onthult zich van onder naar boven en zoomt tegelijk rustig uit, tekst volgt
        gsap.utils.toArray('.team-card').forEach((card, i) => {
          const offset = wide ? i * 0.15 : 0;
          const tl = reveal(card, 'top 88%');
          tl.fromTo(card.querySelector('.rv-photo'),
            { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.4, ease: 'power4.inOut' }, offset)
            .from(card.querySelector('.rv-photo-img'), { scale: 1.25, duration: 2, ease: EASE }, offset)
            .from(card.querySelectorAll('.rv-fade'), { y: 16, opacity: 0, duration: 1.2, ease: EASE, stagger: 0.1 }, offset + 0.7);
        });

        // Onze aanpak (grote schermen): niets staat vast, de sectie scrolt gewoon mee naar boven.
        // Terwijl het schema door het beeld schuift, komen de pijlers er één voor één bij: de balk groeit
        // (de middelste van rechts, richting zijn lijn naar links), de lijn loopt door en de tekst komt op.
        // Wat er al stond, blijft volledig zichtbaar.
        if (xl) {
          const bars = gsap.utils.toArray('.aanpak-bar');
          const lines = gsap.utils.toArray('.aanpak-line');
          const texts = gsap.utils.toArray('.aanpak-text');
          // Het verloop hangt aan de plaats van het schema in beeld: het begint zodra het schema onderaan
          // binnenkomt en is pas af als het bijna bovenaan staat, zodat de pijlers rustig over een lange
          // scrollafstand verschijnen. De scrub laat het zacht naijlen. Bewust subtiel: de balken groeien
          // met een zachte start en stop, de tekst schuift maar een paar pixels en komt vooral zacht op.
          // Eén keer volledig afgespeeld, blijft het staan: terugscrollen speelt niets meer achteruit.
          // aanpakDone onthoudt dat ook als de animaties opnieuw opgebouwd worden (bv. bij een taalwissel)
          const tl = gsap.timeline({
            defaults: { ease: 'sine.inOut' },
            paused: aanpakDone.current,
            scrollTrigger: aanpakDone.current ? undefined : {
              trigger: '.aanpak-diagram', start: 'top 92%', end: 'bottom 25%', scrub: 1.2,
              onUpdate: (self) => {
                if (self.progress < 0.97 || aanpakDone.current) return;
                aanpakDone.current = true;
                self.kill(false, true);
                gsap.to(tl, { progress: 1, duration: 0.8, ease: 'sine.out' });
              }
            }
          });
          texts.forEach((text, i) => {
            const at = `pijler${i}`;
            const toRight = i !== 1;
            tl.addLabel(at, i === 0 ? '+=0' : '+=0.4');
            tl.fromTo(bars[i],
              { scaleX: 0, opacity: 0, transformOrigin: toRight ? 'left center' : 'right center' },
              { scaleX: 1, opacity: 1, duration: 1.6, ease: 'power2.inOut' }, at)
              .fromTo(lines[i], { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'sine.inOut' }, `${at}+=1`)
              .fromTo(text,
                { opacity: 0, x: toRight ? -10 : 10 },
                { opacity: 1, x: 0, duration: 1.4, ease: 'sine.out' }, `${at}+=1.5`);
          });
          if (aanpakDone.current) tl.progress(1);
          finishAanpak.current = () => {
            if (aanpakDone.current) return;
            aanpakDone.current = true;
            tl.scrollTrigger?.kill(false, true);
            tl.progress(1);
          };
        }

        // Team: de verspringende foto schuift iets trager mee, voor wat diepte
        if (wide) {
          gsap.fromTo('.team-parallax', { y: 40 }, {
            y: -40,
            ease: 'none',
            scrollTrigger: { trigger: '#team', start: 'top bottom', end: 'bottom top', scrub: 1 }
          });
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, [language]);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-grain text-foreground font-sans selection:bg-foreground selection:text-background">

      <Seo
        title={language === 'nl'
          ? 'TriaCore AI | AI voor operationele vooruitgang'
          : 'TriaCore AI | AI for operational progress'}
        description={language === 'nl'
          ? "AI die in uw processen werkt, niet ernaast. TriaCore AI uit Hasselt bouwt software op maat, geeft AI workshops en begeleidt teams bij het inzetten van AI."
          : "AI that works inside your processes, not next to them. TriaCore AI from Hasselt builds custom software, runs AI workshops and guides teams in putting AI to work."}
      />

      <Navbar />
      <SectionNav
        items={snelmenu[language]}
        onBeforeJump={(id) => {
          // Spring je voorbij Onze aanpak terwijl die nog niet afgespeeld is, rond ze dan eerst af,
          // anders speelt het hele schema tussenin af en klopt de bestemming niet
          const order = snelmenu.nl.map((s) => s.id);
          if (order.indexOf(id) > order.indexOf('aanpak')) finishAanpak.current?.();
        }}
      />

      {/* B. HERO SECTION */}
      {/* Rustig en links uitgelijnd: één korte titel, één zin, één knop. Onderaan stil bewijs */}
      <section id="home" className="relative min-h-[100svh] flex flex-col overflow-x-clip px-6 md:px-16 lg:px-24 pt-40 md:pt-48 pb-12 md:pb-16">
        <div className="relative max-w-7xl mx-auto w-full flex-1 flex flex-col">
          <div className="max-w-6xl">
            {/* Regel per regel: elke regel komt als geheel binnen uit zijn eigen richting (data-from) */}
            <h1 className="hero-title text-foreground text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] leading-[1.02]">
              <span className="hero-row block" data-from="left">
                {language === 'nl' ? 'AI voor operationele' : 'AI for operational'}
              </span>
              <span className="hero-row block italic text-accent" data-from="right">
                {language === 'nl' ? 'vooruitgang' : 'progress'}
              </span>
            </h1>

            <p className="hero-fade mt-8 md:mt-10 text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-xl">
              {language === 'nl'
                ? 'AI die in uw processen werkt, niet ernaast. Met software op maat, workshops en begeleiding.'
                : 'AI that works inside your processes, not next to them. With custom software, workshops and guidance.'}
            </p>

            <div className="hero-fade mt-10 md:mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
              <CTAButton to="/contact" size="md">
                {language === 'nl' ? 'Plan een gesprek' : 'Book a call'}
              </CTAButton>
              <a href="#oplossingen" className="group/hero-link inline-flex items-center gap-2 text-lg font-medium text-foreground/70 hover:text-accent transition-colors duration-300">
                {language === 'nl' ? 'Bekijk onze oplossingen' : 'View our solutions'}
                <ArrowRight size={18} className="transition-transform duration-300 group-hover/hero-link:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Stil bewijs: logo's van klanten, in kleur */}
          <div className="mt-auto pt-20 flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <span className="hero-fade text-sm text-foreground/50 shrink-0">
              {language === 'nl' ? 'Onder meer voor' : 'Trusted by'}
            </span>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
              {[
                ...projecten.map((p) => ({ name: p.client, logo: p.logo })),
                ...workshopKlanten.map((w) => ({ name: w.name, logo: w.logo }))
              ].map((c) => (
                <span key={c.name} className="hero-logo inline-flex">
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="h-8 md:h-10 w-auto max-w-[150px] object-contain mix-blend-multiply"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div>
      {/* C2. KLANTCASES SECTION */}
      <section id="klantcases" className="relative pt-20 md:pt-28 pb-24 md:pb-32 px-6 md:px-16 lg:px-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <div data-reveal-head className="text-center mb-14 md:mb-16">
            <div className="overflow-hidden pb-3 mb-3">
              <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                {language === 'nl' ? 'Bewezen in de praktijk.' : 'Proven in practice.'}
              </h2>
            </div>
            <p className="rv-fade section-subtitle text-foreground/60 text-lg md:text-xl max-w-xl mx-auto">
              {language === 'nl'
                ? 'Bedrijven waarmee we processen herbouwden, geen losstaande experimenten.'
                : 'Companies whose processes we rebuilt, not standalone experiments.'}
            </p>
          </div>

          {/* Lichte kaarten naast elkaar. De projecten komen uit src/data/projecten.jsx,
              zodat homepage en projectenpagina altijd hetzelfde vertellen. De workshopklanten
              (zie workshopKlanten bovenaan) hebben geen projectpagina.
              Kaarten hebben een vaste breedte en staan altijd gecentreerd; wat niet past, bereik je met de pijltjes */}
          <CardCarousel>
            {[
              ...projecten.map((p) => ({
                key: p.slug,
                to: `/projecten/${p.slug}`,
                logo: p.logo,
                client: p.client,
                sector: p.sector[language],
                description: p.description[language],
                cta: language === 'nl' ? 'Bekijk de case' : 'View the case'
              })),
              ...workshopKlanten.map((w) => ({
                key: w.key,
                to: '/workshops',
                logo: w.logo,
                client: w.name,
                sector: w.sector[language],
                description: language === 'nl'
                  ? `We gaven het team van ${w.name} een workshop over AI: wat het vandaag kan en hoe je het concreet inzet in je werk.`
                  : `We gave the ${w.name} team a workshop on AI: what it can do today and how to put it to concrete use in your work.`,
                cta: language === 'nl' ? 'Bekijk onze workshops' : 'View our workshops'
              }))
            ].map((c) => (
              <Link
                key={c.key}
                to={c.to}
                className="klantcases-card group relative shrink-0 w-[82vw] sm:w-[400px] flex flex-col min-h-[360px] rounded-3xl bg-[#fafafa] border border-foreground/[0.07] p-8 md:p-10 transition-colors duration-500 hover:bg-white hover:border-foreground/15"
              >
                <CornerTrace />
                {/* Vaste hoogte, zodat logo's en namen over de drie kaarten op één lijn staan.
                    Multiply laat een witte logoachtergrond wegvallen tegen de kaart */}
                <div className="h-16 flex items-center mb-8">
                  <img
                    src={c.logo}
                    alt={c.client}
                    className="max-h-12 max-w-[140px] w-auto object-contain mix-blend-multiply"
                  />
                </div>
                <h3 className="text-2xl font-medium text-foreground leading-tight">
                  {c.client}
                </h3>
                <span className="mt-1 text-sm text-foreground/50">{c.sector}</span>
                <span className="rv-line block h-px mt-8 bg-foreground/10 origin-left" />
                <p className="mt-8 text-foreground/60 text-[15px] leading-relaxed">
                  {c.description}
                </p>
                <div className="mt-auto pt-10 flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors duration-300 group-hover:text-accent">
                  {c.cta}
                  <ArrowRight size={16} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </CardCarousel>

          <div data-reveal-head className="flex justify-center mt-12 md:mt-16">
            <div className="rv-fade">
              <CTAButton to="/projecten" size="sm">
                {language === 'nl' ? 'Bekijk al onze projecten' : 'View all our projects'}
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* C3. OPLOSSINGEN SECTION */}
      {/* Grote rijen: uitleg links, titel rechts in het groot */}
      <section id="oplossingen" className="relative pt-16 md:pt-24 pb-24 md:pb-32 px-6 md:px-16 lg:px-24">
        <div className="relative max-w-7xl mx-auto">
          <div data-reveal-head className="overflow-hidden pb-3 mb-11 md:mb-17">
            <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
              {language === 'nl' ? 'Onze oplossingen.' : 'Our solutions.'}
            </h2>
          </div>

          <div>
            {[
              {
                to: '/custom-oplossingen',
                title: language === 'nl' ? 'Custom oplossingen' : 'Custom solutions',
                desc: language === 'nl'
                  ? 'Software rond uw processen, met AI waar het rendeert. Een platform, een app of een automatisering, gebouwd rond hoe uw bedrijf echt werkt.'
                  : 'Software built around your processes, with AI where it pays off. A platform, an app or an automation, built around how your business really works.'
              },
              {
                to: '/workshops',
                title: 'Workshops',
                desc: language === 'nl'
                  ? 'Uw team leert zelf werken met AI. Praktisch, op maat van uw sector en met voorbeelden uit het eigen werk.'
                  : 'Your team learns to work with AI themselves. Practical, tailored to your sector and with examples from their own work.'
              },
              {
                to: '/contact',
                title: language === 'nl' ? 'AI begeleiding' : 'AI guidance',
                desc: language === 'nl'
                  ? 'We zetten AI volledig voor u op: het juiste plan in ChatGPT of Claude, workflows en connectoren, MCP tools en skills. Zo kan uw team er meteen mee aan de slag.'
                  : 'We set up AI for you from start to finish: the right ChatGPT or Claude plan, workflows and connectors, MCP tools and skills. So your team can get going right away.'
              }
            ].map((s, i) => (
              <Link
                key={s.to}
                to={s.to}
                className="oplossing-row group relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-10 md:py-14 lg:min-h-[300px]"
              >
                <span className="rv-line absolute inset-x-0 top-0 h-px bg-foreground/15 origin-left" />

                {/* Op gsm eerst de titel, op desktop rechts in het groot */}
                <div className="lg:order-2 lg:col-span-7 overflow-hidden pb-[0.12em]">
                  <h3 className="rv-mask-inner lg:text-right text-5xl md:text-7xl xl:text-8xl font-normal tracking-tight leading-[0.95] text-foreground transition-colors duration-500 group-hover:text-accent">
                    {s.title}
                  </h3>
                </div>

                <div className="lg:order-1 lg:col-span-5 flex flex-col">
                  <p className="rv-fade text-lg text-foreground/70 leading-relaxed max-w-sm">{s.desc}</p>
                  <div className="rv-fade mt-8 lg:mt-auto flex items-center gap-3 text-sm text-foreground/40">
                    <span className="tabular-nums">/{String(i + 1).padStart(2, '0')}</span>
                    <ArrowRight size={16} className="opacity-0 -translate-x-2 transition-all duration-300 text-accent group-hover:opacity-100 group-hover:translate-x-0" />
                  </div>
                </div>
              </Link>
            ))}
            <span className="rv-line oplossing-end block h-px bg-foreground/15 origin-left" />
          </div>
        </div>
      </section>

      {/* C4. AANPAK SECTION */}
      {/* Het logo als schema: elke balk is een pijler. Op grote schermen scrolt de sectie gewoon mee, en
          terwijl ze door het beeld schuift, krijgt elke balk om beurten een lijn naar zijn pijler
          (de middelste balk naar links, de andere naar rechts). Tot slot staat alles weer volledig.
          Op kleinere schermen een gewone lijst, met de balkjes als opsommingsteken */}
      <section id="aanpak" className="relative px-6 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="flex flex-col justify-center max-w-7xl mx-auto">
          <div data-reveal-head className="text-center mb-14 xl:mb-16">
            <div className="overflow-hidden pb-3">
              <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                {language === 'nl' ? 'Onze aanpak.' : 'Our approach.'}
              </h2>
            </div>
          </div>

          {/* Grote schermen: het schema, geschaald zodat het altijd past */}
          <div className="aanpak-diagram hidden xl:block relative w-full" style={{ height: AANPAK.logoH * aanpakScale }}>
          <div className="absolute left-1/2 top-0" style={{ width: AANPAK.totalW, height: AANPAK.logoH, marginLeft: -AANPAK.totalW / 2, transform: `scale(${aanpakScale})`, transformOrigin: 'top center' }}>
            {AANPAK.bars.map((b, i) => (
              <span
                key={i}
                className="aanpak-bar absolute rounded-full bg-foreground"
                style={{ left: `calc(50% + ${b.left}px)`, top: b.top, width: AANPAK.barW, height: AANPAK.barH }}
              />
            ))}
            {aanpakPijlers[language].map((p, i) => {
              const toRight = i !== 1;
              const rowY = AANPAK.bars[i].top + AANPAK.barH / 2;
              return (
                <React.Fragment key={p.word}>
                  <span
                    className="aanpak-line absolute h-px bg-foreground/25"
                    style={{
                      top: rowY,
                      width: AANPAK.lineLen,
                      left: toRight ? `calc(50% + ${AANPAK.lineFrom}px)` : `calc(50% - ${AANPAK.lineFrom + AANPAK.lineLen}px)`,
                      transformOrigin: toRight ? 'left center' : 'right center'
                    }}
                  />
                  <div
                    className={`aanpak-text absolute ${toRight ? 'text-left' : 'text-right'}`}
                    style={{
                      top: rowY - 22,
                      width: AANPAK.textW,
                      [toRight ? 'left' : 'right']: `calc(50% + ${AANPAK.textFrom}px)`
                    }}
                  >
                    <div className={`flex items-baseline gap-3 ${toRight ? '' : 'justify-end'}`}>
                      <span className="text-base text-accent tabular-nums">/0{i + 1}</span>
                      <span className="text-4xl font-medium text-foreground leading-[44px]">{p.word}</span>
                    </div>
                    <p className="mt-2 text-lg text-foreground/60 leading-relaxed">{p.desc}</p>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          </div>

          {/* Kleinere schermen: een lijst, de balkjes verspringen zoals in het logo */}
          <div className="xl:hidden">
            <ol data-reveal-head className="max-w-xl mx-auto space-y-10">
              {aanpakPijlers[language].map((p, i) => (
                <li key={p.word} className="rv-fade flex gap-5">
                  <span className={`mt-3 h-2.5 w-12 shrink-0 rounded-full bg-foreground ${i === 1 ? 'ml-4' : 'mr-4'}`} aria-hidden="true" />
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm text-accent tabular-nums">/0{i + 1}</span>
                      <span className="text-2xl font-medium text-foreground">{p.word}</span>
                    </div>
                    <p className="mt-1 text-[15px] text-foreground/60 leading-relaxed">{p.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* C5. QUOTES SECTION */}
      {/* Eén quote tegelijk, rustig. De logo's onderaan zijn tegelijk de tabs.
          De quote gebruikt de volle inhoudsbreedte, net als de secties erboven */}
      <section id="quotes" className="relative pt-16 md:pt-24 pb-8 md:pb-12 px-6 md:px-16 lg:px-24">
        <div className="relative max-w-7xl mx-auto">
          <div data-reveal-head className="overflow-hidden pb-3 mb-6 md:mb-8">
            <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
              {language === 'nl' ? 'Wat klanten zeggen.' : 'What clients say.'}
            </h2>
          </div>
          <div data-reveal-head>
            <div className="rv-fade">
              <QuoteStage items={klantQuotes} />
            </div>
          </div>
        </div>
      </section>

      {/* C6. TEAM SECTION */}
      {/* Redactionele opmaak: titel links, twee grote portretten rechts die in hoogte verspringen.
          De L lijn rond de foto's knipoogt naar de klantcases, zonder dezelfde kaarten te herhalen */}
      <section id="team" className="relative pt-16 md:pt-24 pb-20 md:pb-28 px-6 md:px-16 lg:px-24">
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">
          <div data-reveal-head className="lg:col-span-4 lg:sticky lg:top-36">
            <div className="overflow-hidden pb-3 mb-3">
              <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                {language === 'nl' ? 'Het team achter TriaCore AI.' : 'The team behind TriaCore AI.'}
              </h2>
            </div>
            <p className="rv-fade section-subtitle text-foreground/60 text-lg md:text-xl max-w-sm">
              {language === 'nl' ? 'Een complementair team dat structuur brengt in elke implementatie.' : 'A complementary team that brings structure to every implementation.'}
            </p>
            <div className="rv-fade mt-10 flex">
              <CTAButton to="/team" size="sm">{language === 'nl' ? 'Leer ons team kennen' : 'Get to know our team'}</CTAButton>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-14 sm:gap-10 md:gap-14">
            {[
              { name: 'Lucas Curto', role: language === 'nl' ? 'Operationeel & Technische Architectuur' : 'Operations & Technical Architecture', image: '/team/lucas', desc: language === 'nl' ? 'Ontwerpt de technische architectuur en schaalbare AI-systemen.' : 'Designs the technical architecture and scalable AI systems.' },
              { name: 'Rian Mathijs', role: language === 'nl' ? 'Sales & Klantrelaties' : 'Sales & Client Relations', image: '/team/rian', desc: language === 'nl' ? 'Eerste aanspreekpunt voor klanten en zorgt voor duidelijke afstemming en opvolging.' : 'First point of contact for clients, ensuring clear alignment and follow-up.' }
            ].map((member, i) => (
              <Link
                key={member.name}
                to="/team"
                className={`team-card group block ${i === 1 ? 'team-parallax sm:mt-28' : ''}`}
              >
                <div className="relative">
                  <div className="rv-photo aspect-[4/5] rounded-3xl overflow-hidden bg-foreground/5">
                    <div className="rv-photo-img w-full h-full">
                      <AutoImage
                        basePath={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale transition duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                  <CornerTrace />
                </div>
                <div className="rv-fade mt-8 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-medium text-foreground leading-tight">{member.name}</h3>
                    <span className="mt-1 block text-sm text-foreground/50">{member.role}</span>
                  </div>
                  <ArrowRight size={18} className="mt-1.5 shrink-0 text-foreground/30 transition-all duration-300 group-hover:text-accent group-hover:translate-x-1" />
                </div>
                <p className="rv-fade mt-5 text-foreground/60 text-[15px] leading-relaxed max-w-sm">
                  {member.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* C7. FAQ SECTION */}
      {/* Vijf korte vragen die mensen tegenhouden om contact op te nemen, vlak voor de oproep */}
      <section id="faq" className="relative pt-8 pb-8 md:pb-12 px-6 md:px-16 lg:px-24">
        <div className="relative max-w-7xl mx-auto">
          <div data-reveal-head className="overflow-hidden pb-3 mb-8 md:mb-12">
            <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
              {language === 'nl' ? 'Veelgestelde vragen.' : 'Frequently asked questions.'}
            </h2>
          </div>
          <div data-reveal-head>
            <FaqList
              items={faqVragen.map((f) => ({
                q: f.q[language],
                a: typeof f.a === 'function' ? f.a(language) : f.a[language]
              }))}
            />
          </div>
        </div>
      </section>

      {/* C8. OPROEP SECTION */}
      {/* De afsluiter: één duidelijke volgende stap, met een gezicht als eerste aanspreekpunt */}
      <section id="gesprek" className="relative pt-16 md:pt-24 pb-24 md:pb-32 px-6 md:px-16 lg:px-24">
        <div data-reveal-head className="relative max-w-4xl mx-auto text-center">
          <div className="overflow-hidden pb-3 mb-3">
            <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
              {language === 'nl' ? 'Klaar voor de volgende stap?' : 'Ready for the next step?'}
            </h2>
          </div>
          <p className="rv-fade section-subtitle text-foreground/60 text-lg md:text-xl max-w-xl mx-auto">
            {language === 'nl'
              ? 'Vertel ons hoe uw bedrijf werkt. We luisteren eerst en tonen dan wat mogelijk is.'
              : 'Tell us how your business works. We listen first, then show you what is possible.'}
          </p>
          <div className="rv-fade mt-10 flex justify-center">
            <CTAButton to="/contact" size="md">
              {language === 'nl' ? 'Plan een gesprek' : 'Book a call'}
            </CTAButton>
          </div>
          <div className="rv-fade mt-14 flex justify-center">
            <div className="inline-flex items-center gap-4 text-left">
              <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden bg-foreground/5">
                <AutoImage basePath="/team/rian" alt="Rian Mathijs" className="w-full h-full object-cover grayscale" />
              </div>
              <div>
                <p className="text-base font-medium text-foreground leading-tight">
                  Rian Mathijs <span className="font-normal text-foreground/50">· {language === 'nl' ? 'uw eerste aanspreekpunt' : 'your first point of contact'}</span>
                </p>
                <p className="mt-1 text-sm text-foreground/60">
                  <a href="mailto:rian.mathijs@triacore.be" className="hover:text-accent transition-colors">rian.mathijs@triacore.be</a>
                  <span className="mx-2 text-foreground/30">·</span>
                  <a href="tel:+32499874662" className="hover:text-accent transition-colors">0499 87 46 62</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </div>
  );
}

export default App;
