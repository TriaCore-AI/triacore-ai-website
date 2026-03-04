import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Terminal, Layers, Activity, ShieldCheck, Shield, FileCheck, Mail, Search, Layout, RefreshCw } from 'lucide-react';
import TriacoreRadar from './components/ui/triacore-radar';
import TriacoreRoadmap from './components/ui/triacore-roadmap';
import TriacoreLoop from './components/ui/triacore-loop';
import ImageGallery from './components/ui/image-gallery';
import Footer from './components/ui/footer';
import Navbar from './components/ui/navbar';
import CTAButton from './components/ui/cta-button';
import { AccordionItem } from './components/ui/accordion';
import { useLanguage } from './context/LanguageContext';
import { useAutoImage, AutoImage } from './components/ui/auto-image';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { language } = useLanguage();
  const teamHeroImg = useAutoImage('/team/TriaCore AI Team', ['webp', 'jpg', 'png', 'jpeg']);
  const finalCtaImg = useAutoImage('/images/final-cta', ['webp', 'png', 'jpg', 'jpeg']);
  const heroFinalImg = useAutoImage('/media/ai_agents_hero_final', ['webp', 'png', 'jpg', 'jpeg']);
  const containerRef = useRef(null);

  useEffect(() => {
    document.title = language === 'nl' ? 'TriaCore AI — Digitale Fundamenten' : 'TriaCore AI — Digital Foundations';
  }, [language]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Setup hero animations
      gsap.fromTo(
        '.hero-stagger',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.2
        }
      );

      // Scroll animations for cards and other elements
      const scrollElements = gsap.utils.toArray('.scroll-card, .scroll-animate');
      scrollElements.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
          }
        );
      });

      // Philosophy word reveal
      const philoText = document.querySelector('.philo-reveal');
      if (philoText) {
        // Simple word split for animation
        const words = philoText.innerText.split(' ');
        philoText.innerHTML = '';
        words.forEach(word => {
          const span = document.createElement('span');
          span.className = 'inline-block opacity-0 translate-y-4 mr-[0.3em]';
          span.innerText = word;
          philoText.appendChild(span);
        });

        gsap.to(philoText.children, {
          scrollTrigger: {
            trigger: philoText,
            start: 'top 80%',
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
        });
      }

      // Protocol pinning and stacking
      const protocolCards = gsap.utils.toArray('.protocol-card');
      protocolCards.forEach((card, i) => {
        if (i === protocolCards.length - 1) return; // don't fade the last one

        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            pin: true,
            pinSpacing: false,
          },
          scale: 0.95,
          opacity: 0.5,
          filter: 'blur(4px)',
          ease: 'none',
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">

      {/* GLOBAL NOISE OVERLAY */}
      <svg className="noise-overlay" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      <Navbar />

      {/* B. HERO SECTION */}
      <section className="relative pt-40 pb-24 px-6 md:px-16 overflow-hidden bg-background min-h-[85dvh] flex flex-col justify-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* Abstract structural lines placeholder - Full Section Grid */}
          <div className="absolute left-1/4 top-0 w-px h-full bg-foreground"></div>
          <div className="absolute left-2/4 top-0 w-px h-full bg-foreground"></div>
          <div className="absolute left-3/4 top-0 w-px h-full bg-foreground"></div>
          <div className="absolute top-1/3 left-0 w-full h-px bg-foreground"></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-foreground"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          {/* Left Column: Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <p className="hero-stagger section-label mb-4">
              {language === 'nl' ? 'Structuur voor een' : 'Structure for an'}
            </p>
            <h1 className="hero-stagger hero-title text-foreground text-5xl sm:text-6xl md:text-7xl lg:text-7xl mb-8 leading-[1.1]">
              {language === 'nl' ? 'AI-gedreven toekomst.' : 'AI-driven future.'}
            </h1>
            <p className="hero-stagger max-w-xl text-lg text-foreground/60 mb-12 leading-relaxed">
              {language === 'nl'
                ? 'Wij ontwerpen oplossingen die uw systemen verbeteren en AI logisch inzetten, zodat AI een vaste plaats krijgt binnen uw organisatie.'
                : 'We design solutions that improve your systems and deploy AI logically, so that AI gets a permanent place within your organization.'}
            </p>
            <div className="hero-stagger">
              <CTAButton href="#aanpak">
                {language === 'nl' ? 'Ontdek onze aanpak' : 'Discover our approach'}
              </CTAButton>
            </div>
          </div>

          {/* Right Column: Team Photo Visual Container */}
          <div className="hero-stagger w-full lg:w-[45%] flex justify-center lg:justify-end">
            <div className="group relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-foreground/5 shadow-xl shadow-foreground/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-foreground/10">
              <img
                src={teamHeroImg}
                alt="TriaCore AI Team"
                className="w-full h-full object-cover object-center saturate-[0.85] transition-all duration-700 group-hover:saturate-100 group-hover:scale-105"
              />
              {/* Subtle inner shadow overlay */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.05)]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* C. FOUNDATIONS & INTEGRATION (Twee Trajecten) */}
      <section id="fundamenten" className="py-32 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="hero-title text-foreground text-4xl md:text-5xl mb-6 scroll-animate">{language === 'nl' ? 'Twee trajecten. Eén doel.' : 'Two paths. One goal.'}</h2>
            <p className="section-subtitle text-foreground/60 text-xl max-w-2xl mx-auto scroll-animate">{language === 'nl' ? 'Afhankelijk van waar uw organisatie vandaag staat, begeleiden we u via één van deze trajecten.' : 'Depending on where your organization is today, we guide you through one of these paths.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">

            {/* Traject 1 */}
            <div className="scroll-card rounded-[2rem] bg-background border border-border/40 px-6 py-8 lg:px-10 flex flex-col h-auto lg:h-[460px]">
              <div className="mb-6 p-4 rounded-xl bg-foreground/5 inline-table scroll-animate">
                <Layers className="text-foreground" size={32} />
              </div>
              <h3 className="section-title text-foreground text-2xl mb-4 scroll-animate">{language === 'nl' ? 'Bouw van een digitale basis' : 'Building a digital foundation'}</h3>
              <p className="text-foreground/60 mb-auto leading-relaxed scroll-animate">
                {language === 'nl' ? (
                  <>Voor organisaties met versnipperde systemen of verouderde software bouwen we een schaalbare digitale structuur. Data, processen en mensen komen samen in één logisch geheel.<br /><br />Zo ontstaat een stevig fundament dat rust en overzicht brengt. Een basis die klaar is voor duurzame AI-integratie.</>
                ) : (
                  <>For organizations with fragmented systems or outdated software, we build a scalable digital structure. Data, processes, and people come together in one logical whole.<br /><br />This creates a solid foundation that brings peace and clarity. A foundation ready for sustainable AI integration.</>
                )}
              </p>
            </div>

            {/* Traject 2 */}
            <div className="scroll-card bg-dark-section text-background rounded-[2rem] px-6 py-8 lg:px-10 flex flex-col h-auto lg:h-[460px]">
              <div className="mb-6 p-4 rounded-xl bg-background/10 inline-table scroll-animate">
                <Terminal className="text-background" size={32} />
              </div>
              <h3 className="section-title text-background text-2xl mb-4 scroll-animate">{language === 'nl' ? 'AI-integratie binnen bestaande systemen' : 'AI integration within existing systems'}</h3>
              <p className="text-background/80 mb-auto leading-relaxed scroll-animate">
                {language === 'nl' ? (
                  <>Heeft u al een bestaande digitale omgeving? Dan analyseren we uw huidige structuur en bekijken we waar AI echt waarde toevoegt.<br /><br />We integreren AI zonder uw systemen te verstoren. Zo versterken we workflows zonder extra complexiteit te creëren.</>
                ) : (
                  <>Do you already have an existing digital environment? We analyze your current structure and see where AI truly adds value.<br /><br />We integrate AI without disrupting your systems. We strengthen workflows without creating extra complexity.</>
                )}
              </p>
            </div>

          </div>

          {/* Central CTA */}
          <div className="mt-16 flex justify-center scroll-card">
            <CTAButton to="/trajecten">
              {language === 'nl' ? 'Ontdek welk traject bij uw organisatie past' : 'Discover which path suits your organization'}
            </CTAButton>
          </div>
        </div>
      </section>


      {/* D. AI AGENTS CAROUSEL */}
      <section
        id="ai-agents"
        className="py-32 px-0 text-background relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #ffffff 0%, #020617 100px, #020617 calc(100% - 100px), #ffffff 100%)'
        }}
      >

        <div className="absolute inset-0 opacity-5">
          {/* Architectural bg lines */}
          <div className="w-[200vw] h-px bg-background transform rotate-45 absolute top-1/2 -left-1/2"></div>
          <div className="w-[200vw] h-px bg-background transform -rotate-45 absolute top-1/2 -left-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center mb-16 px-6">
          <h2 className="hero-title text-4xl md:text-5xl text-white mb-6 scroll-animate">
            {language === 'nl' ? 'Geïntegreerde AI-agents.' : 'Integrated AI agents.'}
          </h2>
          <p className="section-subtitle text-white/60 max-w-2xl mx-auto scroll-animate">
            {language === 'nl'
              ? 'Digitale collega’s die naadloos samenwerken met uw team en uw bestaande software. Ze nemen repetitief werk over en creëren directe tijdswinst.'
              : 'Digital colleagues that collaborate seamlessly with your team and your existing software. They take over repetitive work and create an immediate time saving.'}
          </p>
        </div>

        {/* Infinite Carousel Container */}
        <div className="w-full relative flex overflow-hidden group">
          <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused]">

            {/* Set 1 */}
            <div className="flex gap-8 px-4 items-center">
              {[
                { name: "Business Analist", src: "/agents/business%20analist" },
                { name: "Data Analist", src: "/agents/data%20analist" },
                { name: "Klantenheld", src: "/agents/klantenheld" },
                { name: "Notulist", src: "/agents/notulist" },
                { name: "Strategisch Analist", src: "/agents/strategisch%20analist" },
                { name: "Projectleider", src: "/agents/operations%20agent" },
                { name: "Inboxmanager", src: "/agents/inboxmanager" },
                { name: "CRM Specialist", src: "/agents/CRM%20specialist" }
              ].map((agent, i) => (
                <div key={`set1-${i}`} className="w-64 h-80 rounded-[2rem] bg-background/5 border border-background/10 shrink-0 flex items-center justify-center p-6 shadow-xl transition-transform duration-300 hover:scale-105">
                  <AutoImage basePath={agent.src} alt={agent.name} className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
              ))}
            </div>

            {/* Set 2 (Duplicate for seamless loop) */}
            <div className="flex gap-8 px-4 items-center">
              {[
                { name: "Business Analist", src: "/agents/business%20analist" },
                { name: "Data Analist", src: "/agents/data%20analist" },
                { name: "Klantenheld", src: "/agents/klantenheld" },
                { name: "Notulist", src: "/agents/notulist" },
                { name: "Strategisch Analist", src: "/agents/strategisch%20analist" },
                { name: "Projectleider", src: "/agents/operations%20agent" },
                { name: "Inboxmanager", src: "/agents/inboxmanager" },
                { name: "CRM Specialist", src: "/agents/CRM%20specialist" }
              ].map((agent, i) => (
                <div key={`set2-${i}`} className="w-64 h-80 rounded-[2rem] bg-background/5 border border-background/10 shrink-0 flex items-center justify-center p-6 shadow-xl transition-transform duration-300 hover:scale-105">
                  <AutoImage basePath={agent.src} alt={agent.name} className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center relative z-10">
          <CTAButton to="/ai-agents" size="sm">
            {language === 'nl' ? 'Ontdek wat ze kunnen doen' : 'Discover what they can do'}
          </CTAButton>
        </div>
      </section>

      {/* E. PROTOCOL */}
      <section id="aanpak" className="bg-background relative">
        {/* Card 1 */}
        <div className="protocol-card min-h-[100dvh] md:h-screen w-full flex items-center py-24 md:py-0 px-6 md:px-16 bg-white border-b border-foreground/5 sticky top-0">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="flex flex-col">
              <div className="section-label mb-4">{language === 'nl' ? '01 — ANALYSE' : '01 — ANALYSIS'}</div>
              <h2 className="section-title text-foreground text-4xl md:text-6xl mb-6 leading-tight">{language === 'nl' ? 'Knelpunten, opportuniteiten en roadmap' : 'Bottlenecks, opportunities, and roadmap'}</h2>
              <p className="section-subtitle text-foreground/60 text-lg max-w-lg">
                {language === 'nl'
                  ? 'We brengen systemen, data en processen scherp in kaart. Je krijgt een heldere lijst met knelpunten en opportuniteiten, plus een roadmap die prioriteiten en impact concreet maakt.'
                  : 'We clearly map systems, data, and processes. You receive a clear list of bottlenecks and opportunities, plus a roadmap that makes priorities and impact concrete.'}
              </p>
            </div>
            <div className="w-full aspect-square">
              <TriacoreRadar className="h-full w-full border-none shadow-none bg-transparent p-0" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="protocol-card min-h-[100dvh] md:h-screen w-full flex items-center py-24 md:py-0 px-6 md:px-16 bg-background sticky top-0">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="flex flex-col">
              <div className="section-label mb-4">{language === 'nl' ? '02 — REALISATIE' : '02 — REALIZATION'}</div>
              <h2 className="section-title text-foreground text-4xl md:text-6xl mb-6 leading-tight">{language === 'nl' ? 'Van roadmap naar implementatie' : 'From roadmap to implementation'}</h2>
              <p className="section-subtitle text-foreground/60 text-lg max-w-lg">
                {language === 'nl'
                  ? 'Op basis van de roadmap zorgen we voor een doordachte implementatie in je systemen en processen. Integraties, flows en architectuur worden concreet opgezet zodat alles logisch en stabiel samenwerkt.'
                  : 'Based on the roadmap, we ensure a thoughtful implementation in your systems and processes. Integrations, flows, and architecture are set up concretely so that everything works together logically and stably.'}
              </p>
            </div>
            <div className="w-full aspect-square">
              <TriacoreRoadmap className="h-full w-full border-none shadow-none bg-transparent p-0" />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="protocol-card min-h-[100dvh] md:h-screen w-full flex items-center py-24 md:py-0 px-6 md:px-16 bg-[#f0f4f8] sticky top-0">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="flex flex-col">
              <div className="section-label mb-4">{language === 'nl' ? '03 — OPVOLGING' : '03 — FOLLOW-UP'}</div>
              <h2 className="section-title text-foreground text-4xl md:text-6xl mb-6 leading-tight">{language === 'nl' ? 'Doorlopende samenwerking' : 'Continuous collaboration'}</h2>
              <p className="section-subtitle text-foreground/60 text-lg max-w-lg">
                {language === 'nl'
                  ? 'Onze samenwerking stopt niet na oplevering. We begeleiden u verder en zorgen dat uw digitale omgeving mee evolueert met uw organisatie.'
                  : 'Our collaboration does not stop after delivery. We continue to guide you and ensure that your digital environment evolves with your organization.'}
              </p>
            </div>
            <div className="w-full aspect-square">
              <TriacoreLoop className="h-full w-full border-none shadow-none bg-transparent p-0" />
            </div>
          </div>
        </div>
      </section>

      <ImageGallery />

      {/* G. TEAM SECTION */}
      <section id="team" className="py-32 px-6 md:px-16 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="hero-title text-foreground text-4xl md:text-5xl mb-4 scroll-animate">
              {language === 'nl' ? 'Het team achter TriaCore AI.' : 'The team behind TriaCore AI.'}
            </h2>
            <p className="section-subtitle text-foreground/60 text-lg max-w-2xl mx-auto scroll-animate">
              {language === 'nl' ? 'Een complementair team dat structuur brengt in elke implementatie.' : 'A complementary team that brings structure to every implementation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 px-4 md:px-0">
            {[
              {
                name: "Rian",
                role: language === 'nl' ? "Sales & Klantrelaties" : "Sales & Client Relations",
                image: "/team/rian",
                desc: language === 'nl' ? "Eerste aanspreekpunt voor klanten en zorgt voor duidelijke afstemming en opvolging." : "First point of contact for clients, ensuring clear alignment and follow-up."
              },
              {
                name: "Lucas",
                role: language === 'nl' ? "Operationeel & Technische Architectuur" : "Operations & Technical Architecture",
                image: "/team/lucas",
                desc: language === 'nl' ? "Ontwerpt de technische architectuur en schaalbare AI-systemen." : "Designs the technical architecture and scalable AI systems."
              },
              {
                name: "Staf",
                role: language === 'nl' ? "Marketing & Positionering" : "Marketing & Positioning",
                image: "/team/staf",
                desc: language === 'nl' ? "Verantwoordelijk voor positionering, communicatie en visuele uitwerking." : "Responsible for positioning, communication, and visual execution."
              }
            ].map((member, i) => (
              <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-foreground/5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-foreground/5 flex flex-col items-center text-center">
                <div className="w-48 h-48 mb-8 rounded-full overflow-hidden border-2 border-foreground/5 shadow-inner">
                  <AutoImage
                    basePath={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out scale-110 group-hover:scale-100"
                  />
                </div>
                <h3 className="section-title text-foreground text-2xl mb-1">{member.name}</h3>
                <div className="section-label mb-4">{member.role}</div>
                <p className="text-foreground/60 leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <CTAButton to="/team">
              {language === 'nl' ? 'Ontmoet het volledige team' : 'Meet the entire team'}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* H. FAQ SECTION */}
      <section
        id="faq"
        className="py-32 px-6 md:px-16 relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #f8fafc 0%, #020617 100px)'
        }}
      >

        <div className="max-w-4xl mx-auto relative z-20">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="section-title text-white text-4xl md:text-5xl">{language === 'nl' ? 'Veelgestelde vragen' : 'Frequently Asked Questions'}</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AccordionItem title={language === 'nl' ? "Kan ik klein starten of moet ik meteen een volledig traject aangaan?" : "Can I start small or do I have to commit to a full trajectory immediately?"} variant="dark">
              {language === 'nl'
                ? "U kan perfect klein starten. Tijdens een eerste gesprek kijken we waar een snelle en concrete meerwaarde mogelijk is. Zo bouwen we stap voor stap verder op wat werkt."
                : "You can perfectly start small. During an initial conversation, we look for areas where quick and concrete value is possible. This way, we build step by step on what works."}
            </AccordionItem>

            <AccordionItem title={language === 'nl' ? "Wat kunnen AI-agents zelfstandig beslissen?" : "What can AI agents decide independently?"} variant="dark">
              {language === 'nl'
                ? "Dat hangt af van uw voorkeur. AI-agents werken binnen duidelijke richtlijnen. U bepaalt zelf welke acties automatisch verlopen en waar menselijke validatie nodig is. Belangrijke beslissingen kunnen altijd eerst gecontroleerd worden."
                : "That depends on your preference. AI agents work within strict guidelines. You determine which actions are automatic and where human validation is needed. Important decisions can always be checked first."}
            </AccordionItem>

            <AccordionItem title={language === 'nl' ? "Blijft mijn data eigendom van mijn organisatie?" : "Does my data remain property of my organization?"} variant="dark">
              {language === 'nl'
                ? "Ja. Uw data blijft volledig van u en wordt nooit gebruikt om externe AI-modellen te trainen. Indien nodig bouwen we een aparte database binnen uw omgeving."
                : "Yes. Your data remains fully yours and is never used to train external AI models. If necessary, we build a separate database within your environment."}
            </AccordionItem>

            <AccordionItem title={language === 'nl' ? "Hoe wordt veiligheid en privacy aangepakt?" : "How are security and privacy handled?"} variant="dark">
              {language === 'nl'
                ? "Veiligheid en privacy zijn standaard ingebouwd in elk project. We werken conform GDPR-richtlijnen en controleren onze software continu op kwetsbaarheden via Aikido."
                : "Security and privacy are built into every project by default. We work in accordance with GDPR guidelines and continuously check our software for vulnerabilities using Aikido."}
            </AccordionItem>

            <AccordionItem title={language === 'nl' ? "Wat gebeurt er na oplevering?" : "What happens after delivery?"} variant="dark">
              {language === 'nl'
                ? "Onze samenwerking stopt niet na oplevering. We blijven betrokken met vaste opvolging en ondersteuning, zodat uw digitale omgeving mee evolueert met uw organisatie."
                : "Our collaboration does not stop after delivery. We stay involved with regular follow-ups and support, ensuring your digital environment evolves with your organization."}
            </AccordionItem>

            <AccordionItem title={language === 'nl' ? "Heeft mijn team technische kennis nodig?" : "Does my team need technical knowledge?"} variant="dark">
              {language === 'nl'
                ? "Nee. Wij zorgen dat de oplossingen intuïtief en gebruiksvriendelijk zijn. De technische complexiteit beheren wij achter de schermen."
                : "No. We ensure that the solutions are intuitive and user-friendly. We manage the technical complexity behind the scenes."}
            </AccordionItem>
          </div>
        </div>
      </section>



      {/* I. FINAL STRATEGIC CTA */}
      <section className="py-24 md:py-32 px-6 md:px-16 bg-dark-section">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-[#070b19] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl min-h-[500px] flex items-center">

            {/* Unified Background Component with Fade */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute inset-0 bg-white/[0.03] animate-pulse"></div>
              <img
                src={finalCtaImg}
                alt="Digital Maturity Vision"
                className="absolute inset-0 w-full h-full object-cover object-[95%_center] md:object-center opacity-90 transition-all duration-700 hover:opacity-100"
              />
              {/* Subtle dark overlay for blending */}
              <div className="absolute inset-0 bg-black/20"></div>
              {/* Smooth horizontal gradient to blend seamlessly into the left side of the card */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#070b19] via-[#070b19]/80 to-transparent hidden md:block"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#070b19] via-[#070b19]/90 to-transparent md:hidden"></div>
            </div>

            {/* Content (layered cleanly over background) */}
            <div className="relative z-10 w-full p-10 md:p-16 lg:p-24 flex flex-col justify-center items-start md:max-w-[48%] lg:max-w-[42%]">
              <h2 className="section-title text-2xl md:text-4xl lg:text-[2.75rem] text-white mb-6 leading-[1.1] max-w-[15ch] md:max-w-none scroll-animate">
                {language === 'nl' ? 'De volgende stap in digitale volwassenheid' : 'The next step in digital maturity'}
              </h2>
              <p className="section-subtitle text-base md:text-lg text-white/60 mb-10 leading-snug font-light max-w-lg scroll-animate">
                {language === 'nl'
                  ? 'AI rendeert pas wanneer ze structureel verankerd is in je processen, mensen en systemen. Wij helpen je dat fundament bouwen.'
                  : 'AI only yields returns when it is structurally anchored in your processes, people, and systems. We help you build that foundation.'}
              </p>

              <CTAButton to="/contact">
                {language === 'nl' ? 'Plan een kennismaking' : 'Schedule an introduction'}
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default App;
