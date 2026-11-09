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
import VeegRij from './components/ui/veeg-rij';
import AanpakKlein from './components/ui/aanpak-klein';
import { useLanguage } from './context/LanguageContext';
import { AutoImage } from './components/ui/auto-image';
import { projecten } from './data/projecten';
import { klantKaarten, workshopKlanten } from './data/klanten';
import ClientCard from './components/ui/client-card';
import medtronicLogo from './assets/klantcases/medtronic.png';
import theBoxLogo from './assets/klantcases/the-box.png';
import naomiPhoto from './assets/quotes/naomi-clear.png';
import estherPhoto from './assets/quotes/esther-vandebroek.png';
import QuoteStage from './components/ui/quote-stage';
import SectionNav from './components/ui/section-nav';
import FaqList from './components/ui/faq-list';
import Seo from './components/ui/seo';
import HeroScene from './components/ui/hero-scene';

gsap.registerPlugin(ScrollTrigger);

// Klantquotes. Een foto is optioneel. Elke quote staat in de taal waarin de klant ze gaf (Medtronic in het
// Engels, letterlijk; Croes NV in het Nederlands, samengevoegd uit een vragenlijst en licht geredigeerd,
// zonder iets toe te voegen). De andere taal is een vrije vertaling.
// Plaatshouders (placeholder: true) verschijnen enkel op de lokale dev server, nooit op de echte site:
// een verzonnen getuigenis van een echte klant mag niet live gaan.
const klantQuotes = [
  {
    key: 'croes',
    company: 'Croes NV',
    logo: projecten.find((p) => p.slug === 'croes-nv')?.logo,
    name: 'Alain Vangeebergen',
    role: 'Planner · Croes NV',
    quote: {
      nl: 'Met de app zien we snel op welke werf er grond verzet wordt, met hoeveel en met welke vrachtwagens. Vroeger moesten we wachten op de bonnen, die pas veel later binnenkwamen, en hadden we geen zicht op wat er die dag gebeurde. Omdat de app op maat van ons bedrijf gemaakt is, hadden we hem meteen onder de knie. Ook de chauffeurs zijn enthousiast: ze moeten geen grondbankbonnen meer schrijven. TriaCore luisterde altijd naar onze feedback, dacht mee en was steeds bereikbaar. Door hun gedrevenheid en hun service zal ik hen zeker aanbevelen aan andere bedrijven.',
      en: 'With the app we can quickly see on which site soil is being moved, how much and with which trucks. We used to wait for the transport notes, which came in much later, and we had no view of what was happening that day. Because the app was built around our company, we got the hang of it right away. The drivers are enthusiastic too: they no longer have to write out soil transport notes. TriaCore always listened to our feedback, thought along with us and was always reachable. Thanks to their drive and their service, I will certainly recommend them to other companies.'
    }
  },
  {
    key: 'medtronic',
    company: 'Medtronic',
    logo: medtronicLogo,
    photo: naomiPhoto,
    name: 'Naomi Clear',
    role: 'Business Director North Europe, UK & Ireland, Nordics, Benelux, Germany & Alpine · Neurovascular',
    quote: {
      nl: 'Lucas van TriaCore gaf ons sales- en marketingteam voor UKI en BeneNord een bijzonder waardevolle AI-training van anderhalf uur. We gingen aan de slag met praktische toepassingen van AI, waaronder het concept van een “Second Brain”, om workflows te stroomlijnen, productiever te werken en onze dagelijkse manier van werken te verbeteren. We hebben nu een praktisch draaiboek om wat we leerden te verankeren in ons dagelijks werk. Ik kan Lucas en TriaCore van harte aanbevelen voor elk team dat echt praktisch voordeel wil halen uit AI.',
      en: 'Lucas from TriaCore delivered an extremely valuable 90-minute AI training session to our UKI and BeneNord Sales and Marketing team. The session explored practical applications of AI, including the “Second Brain” concept, to streamline workflows, improve productivity and enhance day-to-day ways of working. We now have a practical playbook to help embed these learnings into our daily activities. I would highly recommend Lucas and TriaCore to any team looking to maximise the practical benefits of AI.'
    }
  },
  {
    // Esther schreef in het Nederlands: hier is de Nederlandse versie de hare (samengesteld uit haar
    // antwoorden van oktober 2026) en de Engelse een vrije vertaling. Staat ook op de workshoppagina
    key: 'the-box',
    company: 'The Box',
    logo: theBoxLogo,
    photo: estherPhoto,
    name: 'Esther Vandebroek',
    role: {
      nl: 'Beleidsmedewerker Ondernemen Stebo vzw · Projectmanager The Box Vlaanderen',
      en: 'Entrepreneurship Policy Officer, Stebo vzw · Project Manager, The Box Vlaanderen'
    },
    quote: {
      nl: 'Een schot in de roos! Tijdens vier leer- & netwerkavonden van The Box Vlaanderen inspireerden Lucas en Rian van TriaCore AI meer dan 70 startende ondernemers in Hasselt, Turnhout, Antwerpen en Aarschot. We werkten eerder al met andere sprekers rond AI, maar voor onze doelgroep was deze workshop echt spot on. Geen ingewikkelde theorie, maar concrete tools waarmee ondernemers meteen aan de slag kunnen, ongeacht hun kennisniveau. Een absolute aanrader!',
      en: 'Spot on! Across four learning and networking evenings for The Box Vlaanderen, Lucas and Rian of TriaCore AI inspired more than 70 starting entrepreneurs in Hasselt, Turnhout, Antwerp and Aarschot. We had worked with other AI speakers before, but for our audience this workshop was exactly right. No complicated theory, just practical tools entrepreneurs can put to work straight away, whatever their level. Highly recommended!'
    }
  }
].filter((q) => !q.placeholder || import.meta.env.DEV);

// Veelgestelde vragen (overgenomen van de vorige homepage)
const faqVragen = [
  {
    q: { nl: 'Waarom zouden we niet gewoon ChatGPT gebruiken?', en: 'Why wouldn\'t we just use ChatGPT?' },
    a: {
      nl: 'Voor veel taken is dat een prima begin, en we leren je team graag hoe het er meer uit haalt. Maar een proces met veel mensen, stappen en gegevens los je niet op met één prompt. Daarvoor is meer structuur nodig, en soms een tool op maat.',
      en: 'For many tasks that is a great start, and we are happy to teach your team how to get more out of it. But a process with many people, steps and data is not something you solve with one prompt. That takes more structure, and sometimes a custom tool.'
    }
  },
  {
    q: { nl: 'Wat kost een custom tool?', en: 'What does a custom tool cost?' },
    a: {
      nl: 'De kostprijs hangt af van de complexiteit van het probleem, het aantal gebruikers en de technieken die we inzetten. We werken nooit met een vast prijskaartje omdat elke tool anders is. Na een eerste gesprek maken we een duidelijke inschatting zonder verborgen kosten.',
      en: 'The cost depends on the complexity of the problem, the number of users and the techniques we use. We never work with a fixed price tag because every tool is different. After an initial conversation, we give you a clear estimate with no hidden costs.'
    }
  },
  {
    q: { nl: 'Hoe lang duurt het om een custom tool te bouwen?', en: 'How long does it take to build a custom tool?' },
    a: {
      nl: 'Een eerste werkende versie bouwen we doorgaans in zes tot twaalf weken. We werken iteratief: je ziet vroeg resultaat en geeft feedback voor we verder bouwen.',
      en: 'We typically build a first working version in six to twelve weeks. We work iteratively: you see results early and give feedback before we build further.'
    }
  },
  {
    q: { nl: 'Bouwen jullie altijd custom of raden jullie soms een bestaande tool aan?', en: 'Do you always build custom, or do you sometimes recommend an existing tool?' },
    a: {
      nl: 'Niet elk probleem vraagt om maatwerk. Als een bestaande tool jouw probleem oplost, zeggen we dat eerlijk en helpen we je op weg. We bouwen een custom tool alleen als het de juiste keuze is.',
      en: 'Not every problem calls for custom software. If an existing tool solves your problem, we say so honestly and help you get started. We only build a custom tool when it is the right choice.'
    }
  },
  {
    q: { nl: 'Moet ik meteen een volledig systeem bouwen of kan ik stapsgewijs starten?', en: 'Do I need to build a complete system straight away, or can I start step by step?' },
    a: {
      nl: 'Je hoeft niet alles in één keer te bouwen. We starten vaak met één concreet proces, bewijzen de waarde en bouwen daarna verder. Zo hou je controle over de investering en zie je snel resultaat.',
      en: 'You do not have to build everything at once. We often start with one concrete process, prove its value and then build further. That way you stay in control of the investment and see results quickly.'
    }
  },
  {
    q: { nl: 'Werkt dit samen met de systemen die we al gebruiken?', en: 'Does this work with the systems we already use?' },
    a: {
      nl: 'Dat bekijken we altijd vooraf. Waar het kan, koppelen we aan je bestaande systemen, zodat je team gegevens niet dubbel hoeft in te geven.',
      en: 'We always check that up front. Where possible, we connect to your existing systems, so your team does not have to enter data twice.'
    }
  }
];

// De klantkaarten op de homepage: op gsm een veegrij, vanaf tablet de doorlopende rij.
// Dezelfde grens (768px) als de hero en de scrollanimaties
function KlantenRij({ kaarten }) {
  const [gsm, setGsm] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = (e) => setGsm(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (gsm) {
    return <VeegRij>{kaarten.map((c) => <ClientCard key={c.key} card={c} compact />)}</VeegRij>;
  }
  return (
    <CardCarousel autoplay={42} controls={false}>
      {kaarten.map((c) => <ClientCard key={c.key} card={c} className="shrink-0 w-[400px]" />)}
    </CardCarousel>
  );
}

// De secties in het snelmenu linksonder, in de volgorde van de pagina
const snelmenu = {
  nl: [
    { id: 'home', label: 'Home' },
    { id: 'klantcases', label: 'Bewezen in de praktijk' },
    { id: 'oplossingen', label: 'Onze oplossingen' },
    { id: 'aanpak', label: 'Onze aanpak' },
    { id: 'quotes', label: 'Wat klanten zeggen' },
    { id: 'team', label: 'Ons team' },
    { id: 'faq', label: 'Veelgestelde vragen' },
    { id: 'gesprek', label: 'Plan een gesprek' }
  ],
  en: [
    { id: 'home', label: 'Home' },
    { id: 'klantcases', label: 'Proven in practice' },
    { id: 'oplossingen', label: 'Our solutions' },
    { id: 'aanpak', label: 'Our approach' },
    { id: 'quotes', label: 'What clients say' },
    { id: 'team', label: 'Our team' },
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
    { word: 'Deliver', desc: 'We build your solution and support you along the way.' }
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
        gsap.utils.toArray('.klantcases-card').forEach((card) => {
          // Kaarten op één rij krijgen een kleine verschuiving, zodat ze na elkaar binnenkomen. Geteld binnen
          // de eigen rij: de carousel zet kopieën voor en na het origineel, die tellen apart
          const i = [...card.parentElement.children].indexOf(card);
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
          // Lucas en Rian staan naast elkaar en komen kort na elkaar binnen; Jorn staat een rij lager
          const offset = wide && i === 1 ? 0.15 : 0;
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
          // binnenkomt en is af als het nog ruim in beeld staat (bovenkant op 30% van het scherm), zodat ook
          // de derde pijler op tijd volledig staat. De scrub laat het kort naijlen. De drie pijlers duren even
          // lang, dus ze gaan alle drie even snel. Bewust subtiel: de balken groeien met een zachte start en
          // stop, de tekst schuift maar een paar pixels en komt vooral zacht op.
          // Eén keer volledig afgespeeld, blijft het staan: terugscrollen speelt niets meer achteruit.
          // aanpakDone onthoudt dat ook als de animaties opnieuw opgebouwd worden (bv. bij een taalwissel)
          const tl = gsap.timeline({
            defaults: { ease: 'sine.inOut' },
            paused: aanpakDone.current,
            scrollTrigger: aanpakDone.current ? undefined : {
              trigger: '.aanpak-diagram', start: 'top 92%', end: 'top 30%', scrub: 0.8,
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
          ? "AI voor bedrijven met veel mensen, veel materieel en veel administratie. TriaCore AI uit Hasselt bouwt software op maat met AI en geeft AI-workshops."
          : "AI for businesses with lots of people, lots of equipment and lots of paperwork. TriaCore AI from Hasselt builds custom software with AI and runs AI workshops."}
      />

      <Navbar />
      <SectionNav
        items={snelmenu[language]}
        onBeforeJump={(id) => {
          // Spring je voorbij Onze aanpak terwijl die nog niet afgespeeld is, rond ze dan eerst af,
          // anders speelt het hele schema tussenin af en klopt de bestemming niet
          const order = snelmenu.nl.map((s) => s.id);
          if (order.indexOf(id) > order.indexOf('aanpak')) {
            finishAanpak.current?.();
            // Ook de kleine versie (onder 1280) mag dan niet meer stoppen onderweg
            window.dispatchEvent(new Event('aanpak-klaar'));
          }
        }}
      />

      {/* B. HERO SECTION */}
      {/* Rustig en gecentreerd: één korte titel, één zin, één knop. Daaronder stil bewijs, op een vaste
          afstand (niet onderaan een schermhoge hero, waar de logo's los van de rest kwamen te staan) */}
      {/* Gsm liggend (lage schermen onder 1280): minder ruimte boven de titel, anders staat enkel de titel in beeld.
          Op gsm (onder 768) is alles compacter (titel, ondertitel, knoppen, logo's), zodat de hero niet hoger wordt
          dan het scherm: dan valt de staaf van de 3D-scène net onder de knoppen, achter de logo's, en zie je ze meteen */}
      <section id="home" className="relative flex flex-col min-h-svh overflow-x-clip px-6 md:px-16 lg:px-24 pt-36 sm:pt-40 md:pt-48 max-xl:[@media(max-height:500px)]:pt-32 pb-8 md:pb-[72px]">
        <HeroScene />
        <div className="relative max-w-7xl mx-auto w-full flex flex-col">
          <div className="max-w-6xl mx-auto text-center">
            {/* Regel per regel: elke regel komt als geheel binnen uit zijn eigen richting (data-from).
                Elke regel is zo breed als zijn tekst, zodat de veeg op de tekst zelf loopt en niet op lege ruimte.
                Tussen 1024 en 1280 schaalt de titel mee, zodat de eerste regel op één lijn blijft */}
            <h1 className="hero-title text-foreground text-[clamp(2.5rem,12vw,3rem)] sm:text-6xl md:text-7xl lg:text-[7.5rem] lg:max-xl:text-[min(7.5rem,10.2vw)] leading-[1.02]">
              <span className="hero-row block w-fit mx-auto" data-from="left">
                {language === 'nl' ? 'AI voor operationele' : 'AI for operational'}
              </span>
              <span className="hero-row block w-fit mx-auto italic font-bold text-accent" data-from="right">
                {language === 'nl' ? 'vooruitgang' : 'progress'}
              </span>
            </h1>

            {/* Eerst voor wie (breed genoeg voor een aannemer, een autogroep en een verhuurder), dan wat we doen:
                nieuwe software bouwen of koppelen aan wat er al is, met AI waar het rendeert. Kort gehouden, zodat de
                klantlogo's eronder in beeld blijven */}
            <p className="hero-fade mt-5 sm:mt-8 md:mt-10 mx-auto text-base sm:text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-2xl text-balance">
              {language === 'nl'
                ? 'Voor bedrijven met planning, mensen op de baan en veel administratief werk. Wij bouwen software op maat of koppelen aan wat je al gebruikt, met AI waar het rendeert.'
                : 'For businesses with schedules to manage, people on the road and a lot of paperwork. We build custom software or connect to what you already use, with AI where it pays off.'}
            </p>

            {/* Op gsm is de tekstlink 44px hoog om op te tikken; de kleinere rijafstand houdt de witruimte gelijk */}
            {/* data-schijven-rust: rond deze knoppen reageren de schijven achter de hero niet op de muis */}
            <div data-schijven-rust className="hero-fade mt-7 sm:mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 max-md:gap-y-3">
              <CTAButton to="/contact" size="md">
                {language === 'nl' ? 'Plan een gesprek' : 'Book a call'}
              </CTAButton>
              <Link to="/custom-oplossingen" className="group/hero-link inline-flex items-center gap-2 max-md:py-2 text-base sm:text-lg font-medium text-foreground/70 hover:text-accent transition-colors duration-300">
                {language === 'nl' ? 'Bekijk onze tools' : 'View our tools'}
                <ArrowRight size={18} className="transition-transform duration-300 group-hover/hero-link:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Stil bewijs: logo's van klanten, in kleur, boven de schijven. Pas vanaf 1280 staat "Onder meer voor"
              naast de logo's; op tablet staat het erboven, anders wringen de logo's zich in drie rijen */}
          <div data-schijven-rust className="hero-logorij mt-5 sm:mt-16 md:mt-24 flex flex-col xl:flex-row items-center justify-center gap-3 sm:gap-6 xl:gap-12">
            <span className="hero-fade text-base sm:text-xl md:text-2xl text-foreground/70 shrink-0">
              {language === 'nl' ? 'Onder meer voor' : 'Trusted by'}
            </span>
            {/* Op desktop één rustige rij. Op gsm schuiven ze op één lijn zonder einde door: daarvoor staan de
                logo's er drie keer, en de kopieën zijn verborgen op desktop en voor schermlezers */}
            <div className="hero-logos flex flex-wrap items-center justify-center gap-x-[52px] md:max-lg:gap-x-10 gap-y-6">
              {[0, 1, 2].flatMap((set) => [
                ...projecten.map((p) => ({ name: p.client, logo: p.logo })),
                ...workshopKlanten.map((w) => ({ name: w.name, logo: w.logo }))
              ].map((c) => (
                <img
                  key={`${c.name}-${set}`}
                  src={c.logo}
                  alt={set === 0 ? c.name : ''}
                  aria-hidden={set > 0 ? 'true' : undefined}
                  className={`hero-logo h-[54px] w-auto max-w-[190px] object-contain mix-blend-multiply ${set > 0 ? 'hero-logo-kopie' : ''}`}
                />
              )))}
            </div>
          </div>
        </div>
      </section>

      <div>
      {/* C2. KLANTCASES SECTION */}
      <section id="klantcases" className="relative pt-16 md:pt-20 pb-24 md:pb-32 px-6 md:px-16 lg:px-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <div data-reveal-head className="text-center mb-14 md:mb-16">
            <div className="overflow-hidden pb-3 mb-3">
              <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                {language === 'nl' ? 'Bewezen in de praktijk.' : 'Proven in practice.'}
              </h2>
            </div>
            <p className="rv-fade section-subtitle text-foreground/60 text-lg md:text-xl max-w-xl mx-auto">
              {language === 'nl'
                ? 'Bedrijven die we verder hielpen, met een tool op maat of een workshop voor hun team.'
                : 'Companies we helped move forward, with a custom tool or a workshop for their team.'}
            </p>
          </div>

          {/* Lichte kaarten naast elkaar. De lijst komt uit src/data/klanten.jsx (projecten en
              workshopklanten), zodat homepage en projectenpagina altijd hetzelfde tonen.
              Op de computer schuift de rij vanzelf, op gsm veegt de bezoeker er zelf door */}
          <KlantenRij kaarten={klantKaarten(language)} />

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
                title: language === 'nl' ? 'Custom tools' : 'Custom tools',
                desc: language === 'nl'
                  ? 'Processen met veel mensen, stappen en gegevens los je niet op met één prompt. Daarvoor bouwen we een tool op maat van jouw bedrijf, waarin AI veilig met je data werkt en stappen overneemt.'
                  : 'Processes with many people, steps and data cannot be solved with a single prompt. That is why we build a tool tailored to your business, in which AI works safely with your data and takes steps off your hands.'
              },
              {
                to: '/workshops',
                title: 'Workshops',
                desc: language === 'nl'
                  ? 'Meer dan wat chatten met ChatGPT. Jouw team leert AI structureel inzetten in het eigen werk, en er meer uit halen dan een snel antwoord.'
                  : 'More than a bit of chatting with ChatGPT. Your team learns to use AI in a structured way in their own work, and to get more out of it than a quick answer.'
              }
              // De rij over AI-agents (/ai-begeleiding) is tijdelijk weg tot er genoeg bewijs is (beslissing
              // Lucas, 6/11). Ze komt later terug als derde rij
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
                  {/* Op aanraakschermen is er geen hover: daar staat het pijltje er altijd, zodat de rij als link herkenbaar is */}
                  <div className="rv-fade mt-8 lg:mt-auto flex items-center gap-3 text-sm text-foreground/40">
                    <span className="tabular-nums">/{String(i + 1).padStart(2, '0')}</span>
                    <ArrowRight size={16} className="opacity-0 -translate-x-2 transition-all duration-300 text-accent group-hover:opacity-100 group-hover:translate-x-0 max-xl:pointer-coarse:opacity-100 max-xl:pointer-coarse:translate-x-0" />
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
          Op kleinere schermen klapt elke balk tijdens het scrollen open tot zijn pijler */}
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

          {/* Kleinere schermen: het logo, waarvan de balken tijdens het scrollen één voor één openklappen */}
          <AanpakKlein pijlers={aanpakPijlers[language]} />
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
      {/* Redactionele opmaak: titel links, grote portretten rechts in een zigzag. Lucas linksboven, Jorn links
          onder Lucas, Rian rechts over beide rijen en verticaal gecentreerd, dus precies halverwege tussen hen.
          Bij het scrollen komt eerst Lucas, dan Rian, dan Jorn. De volgorde in de code blijft Lucas, Rian, Jorn.
          De L lijn rond de foto's knipoogt naar de klantcases, zonder dezelfde kaarten te herhalen */}
      <section id="team" className="relative pt-16 md:pt-24 pb-20 md:pb-28 px-6 md:px-16 lg:px-24">
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">
          <div data-reveal-head className="lg:col-span-4 lg:sticky lg:top-36">
            <div className="overflow-hidden pb-3 mb-3">
              <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                {language === 'nl' ? 'Ons team.' : 'Our team.'}
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
              { name: 'Lucas Curto', role: language === 'nl' ? 'AI & Strategie' : 'AI & Strategy', image: '/team/lucas', desc: language === 'nl' ? 'Vertaalt nieuwe AI-mogelijkheden naar wat ze voor jouw bedrijf betekenen.' : 'Translates new AI possibilities into what they mean for your business.' },
              { name: 'Rian Mathijs', role: language === 'nl' ? 'Sales & Klantrelaties' : 'Sales & Client Relations', image: '/team/rian', desc: language === 'nl' ? 'Eerste aanspreekpunt voor klanten en zorgt voor duidelijke afstemming en opvolging.' : 'First point of contact for clients, ensuring clear alignment and follow-up.' },
              { name: 'Jorn Van Breemaat', role: language === 'nl' ? 'Softwareontwikkeling & ICT-advies' : 'Software Development & IT Advisory', image: '/team/jorn', desc: language === 'nl' ? 'Ontwerpt en bouwt onze oplossingen en adviseert op technisch en ICT-vlak.' : 'Designs and builds our solutions and advises on technical and IT matters.' }
            ].map((member, i) => (
              <Link
                key={member.name}
                to="/team"
                className={`team-card group block ${i === 1 ? 'team-parallax sm:col-start-2 sm:row-start-1 sm:row-span-2 sm:self-center' : ''} ${i === 2 ? 'sm:col-start-1 sm:row-start-2' : ''}`}
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
              ? 'Vertel ons hoe jouw bedrijf werkt. We luisteren eerst en tonen dan wat mogelijk is.'
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
                  Rian Mathijs <span className="font-normal text-foreground/50">· {language === 'nl' ? 'je eerste aanspreekpunt' : 'your first point of contact'}</span>
                </p>
                {/* Op gsm past dit niet op één regel: mail en telefoon dan onder elkaar, zonder het puntje */}
                <p className="mt-1 text-sm text-foreground/60 max-sm:mt-1.5 max-sm:flex max-sm:flex-col max-sm:items-start max-sm:gap-1">
                  <a href="mailto:rian.mathijs@triacore.be" className="hover:text-accent transition-colors">rian.mathijs@triacore.be</a>
                  <span className="mx-2 text-foreground/30 max-sm:hidden">·</span>
                  <a href="tel:+32499874662" className="hover:text-accent transition-colors">+32 499 87 46 62</a>
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
