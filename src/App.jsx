import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowDown, Terminal, Layers, Activity, ShieldCheck, Shield, FileCheck, Mail, Search, Layout, RefreshCw, Star, Users, Check, Smartphone, Zap, X, Plus, Sparkles, Cog } from 'lucide-react';
import TriacoreRadar from './components/ui/triacore-radar';
import TriacoreRoadmap from './components/ui/triacore-roadmap';
import TriacoreLoop from './components/ui/triacore-loop';
import Footer from './components/ui/footer';
import Navbar from './components/ui/navbar';
import CTAButton from './components/ui/cta-button';
import { AccordionItem } from './components/ui/accordion';
import { useLanguage } from './context/LanguageContext';
import { useAutoImage, AutoImage } from './components/ui/auto-image';

gsap.registerPlugin(ScrollTrigger);

const TypedHeroTitle = React.memo(({ language, onTypingDone, skipAnimation = false }) => {
  const fullText1 = language === 'nl' ? "De AI-partner waar groeiende bedrijven op " : "The AI partner growing companies ";
  const fullText2 = language === 'nl' ? "bouwen." : "build on.";
  const totalLength = fullText1.length + fullText2.length;
  
  const [typedCount, setTypedCount] = useState(skipAnimation ? totalLength : 0);
  
  useEffect(() => {
    if (skipAnimation) {
      onTypingDone(true);
      return;
    }

    if (typedCount < totalLength) {
      const timeout = setTimeout(() => {
        setTypedCount((prev) => prev + 1);
      }, 60);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        onTypingDone(true);
        sessionStorage.setItem('triacore_hero_seen', 'true');
      }, 150);
    }
  }, [typedCount, language, onTypingDone, skipAnimation, totalLength]);

  return (
    <h1 className="hero-title text-foreground text-4xl sm:text-5xl md:text-7xl lg:text-[5.25rem] mb-6 leading-[1.05] min-h-[1.1em] tracking-tight">
      {language === 'nl' ? (
        <>
          {"De AI-partner waar groeiende bedrijven op ".substring(0, typedCount)}
          {typedCount >= "De AI-partner waar groeiende bedrijven op ".length && (
            <span className="text-accent whitespace-nowrap">
              {"bouwen.".substring(0, typedCount - "De AI-partner waar groeiende bedrijven op ".length)}
            </span>
          )}
        </>
      ) : (
        <>
          {"The AI partner growing companies ".substring(0, typedCount)}
          {typedCount >= "The AI partner growing companies ".length && (
            <span className="text-accent whitespace-nowrap">
              {"build on.".substring(0, typedCount - "The AI partner growing companies ".length)}
            </span>
          )}
        </>
      )}
      <span className="type-cursor inline-block w-[2px] h-[0.7em] bg-accent ml-1 align-middle animate-blink" />
    </h1>
  );
});

function App() {
  const { language } = useLanguage();
  const [activePainPoint, setActivePainPoint] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(() => {
    return sessionStorage.getItem('triacore_hero_seen') === 'true';
  });
  
  // Media state for Solevo
  const [solevoMedia, setSolevoMedia] = useState(null);
  const [solevoError, setSolevoError] = useState(false);
  const [isMobileAppModalOpen, setIsMobileAppModalOpen] = useState(false);
  const [isWebplatformModalOpen, setIsWebplatformModalOpen] = useState(false);
  const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);



  const painPointsRef = useRef(null);
  const timelineFillRef = useRef(null);
  const teamHeroImg = useAutoImage('/team/TriaCore AI Team', ['webp', 'jpg', 'png', 'jpeg']);
  const finalCtaImg = useAutoImage('/images/final-cta', ['webp', 'png', 'jpg', 'jpeg']);
  const heroFinalImg = useAutoImage('/media/ai_agents_hero_final', ['webp', 'png', 'jpg', 'jpeg']);
  const containerRef = useRef(null);

  useEffect(() => {
    document.title = language === 'nl' ? 'TriaCore AI — Digitale Fundamenten' : 'TriaCore AI — Digital Foundations';
  }, [language]);

  // Scroll lock while typing or when modal is open
  useEffect(() => {
    if (!isTypingDone || isMobileAppModalOpen || isWebplatformModalOpen || isAutomationModalOpen || isAIModalOpen) {
      if (!isTypingDone) window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isTypingDone, isMobileAppModalOpen, isWebplatformModalOpen, isAutomationModalOpen, isAIModalOpen]);

  useEffect(() => {
    const checkFile = async (url) => {
      try {
        const resp = await fetch(url, { method: 'HEAD' });
        return resp.ok;
      } catch {
        return false;
      }
    };

    const findMedia = async () => {
      if (await checkFile('/images/solevo-visual/visual.mp4')) {
        setSolevoMedia({ type: 'video', url: '/images/solevo-visual/visual.mp4' });
      } else if (await checkFile('/images/solevo-visual/visual.mp4.mp4')) {
        setSolevoMedia({ type: 'video', url: '/images/solevo-visual/visual.mp4.mp4' });
      } else if (await checkFile('/images/solevo-visual/visual.jpg')) {
        setSolevoMedia({ type: 'image', url: '/images/solevo-visual/visual.jpg' });
      } else if (await checkFile('/images/solevo-visual/visual.png')) {
        setSolevoMedia({ type: 'image', url: '/images/solevo-visual/visual.png' });
      } else {
        setSolevoError(true);
      }
    };

    findMedia();
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero subtitle and buttons stagger
      gsap.fromTo(
        '.hero-sub-stagger',
        { y: 40 },
        {
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 1.2
        }
      );

      // Refined animations for News section (Ons verhaal)
      gsap.fromTo('#solevo-case-card', 
        { x: -100, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '#solevo-case-card',
            start: 'top 85%',
            once: true
          },
          x: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'power4.out'
        }
      );

      gsap.fromTo('.news-card-stagger', 
        { x: 60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.news-card-stagger',
            start: 'top 85%',
            once: true
          },
          x: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out'
        }
      );

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

      // Specific animations for Aanpak section
      gsap.fromTo('.scroll-card-aanpak-left', 
        { x: -60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.scroll-card-aanpak-left',
            start: 'top 75%',
            once: true
          },
          x: 0,
          opacity: 1,
          duration: 1.5,
          delay: 0.2,
          ease: 'power3.out'
        }
      );

      gsap.fromTo('.scroll-card-aanpak-right', 
        { x: 60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.scroll-card-aanpak-right',
            start: 'top 75%',
            once: true
          },
          x: 0,
          opacity: 1,
          duration: 1.5,
          delay: 0.2,
          ease: 'power3.out'
        }
      );

      gsap.fromTo('.scroll-card-aanpak-bottom', 
        { y: 80, scale: 0.98, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.scroll-card-aanpak-bottom',
            start: 'top 80%',
            once: true
          },
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.5,
          delay: 0.3,
          stagger: 0.2,
          ease: 'power2.out'
        }
      );



      // Refresh ScrollTrigger after site reveals
      if (isTypingDone) {
        ScrollTrigger.refresh();
      }

      // Pain points highlight logic (Split Sticky)
      const points = gsap.utils.toArray('.pain-point-item');
      points.forEach((point, i) => {
        ScrollTrigger.create({
          trigger: point,
          start: 'top 40%',
          end: 'bottom 60%',
          onToggle: (self) => {
            if (self.isActive) setActivePainPoint(i);
          }
        });
      });



    }, containerRef);
    return () => ctx.revert();
  }, [language, isTypingDone]);

  const painPointsData = [
    {
      num: '01',
      title: language === 'nl' ? 'AI rendeert niet.' : 'AI does not pay off.',
      body: language === 'nl' ? 'Hier en daar wordt wat tijd gewonnen, maar de processen daarachter blijven ongewijzigd.' : 'Time is saved here and there, but the processes behind it remain unchanged.'
    },
    {
      num: '02',
      title: language === 'nl' ? 'Geen structuur in AI-gebruik.' : 'No structure in AI usage.',
      body: language === 'nl' ? 'Elke medewerker doet zijn eigen ding met AI. Zonder gedeelde aanpak en integraties blijft het een verzameling losse gewoontes zonder impact op het geheel.' : 'Each employee does their own thing with AI. Without a shared approach and integrations, it remains a collection of loose habits without impact on the whole.'
    },
    {
      num: '03',
      title: language === 'nl' ? 'Uw systemen praten niet met elkaar.' : 'Your systems don\'t talk to each other.',
      body: language === 'nl' ? 'Uw team schakelt tussen tools die niets van elkaar weten en typt data manueel over.' : 'Your team switches between tools that know nothing about each other and manually types data over.'
    },
    {
      num: '04',
      title: language === 'nl' ? 'Geen tool past op uw probleem.' : 'No tool fits your problem.',
      body: language === 'nl' ? 'Uw sector heeft regels en processen die geen generieke tool begrijpt.' : 'Your sector has rules and processes that no generic tool understands.'
    },
    {
      num: '05',
      title: language === 'nl' ? 'Angst voor de foute investering.' : 'Fear of the wrong investment.',
      body: language === 'nl' ? 'U heeft al eerder geïnvesteerd in software die beloofde het verschil te maken en tegenviel.' : 'You have previously invested in software that promised to make the difference and fell short.'
    }
  ];
  
  const MobileAppModal = () => {
    if (!isMobileAppModalOpen) return null;
    
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-12">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500" 
          onClick={() => setIsMobileAppModalOpen(false)}
        />
        
        {/* Modal Content - White Background & Scrollable */}
        <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col overflow-hidden">
          {/* Subtle Noise Overlay for White BG */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          {/* Close Button - Fixed in top right */}
          <button 
            onClick={() => setIsMobileAppModalOpen(false)}
            className="absolute top-6 right-6 p-4 rounded-full bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all duration-300 z-[60]"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          
          <div className="relative z-10 overflow-y-auto p-8 md:p-12 pt-16 md:pt-12">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">{language === 'nl' ? 'Mobiele app' : 'Mobile app'}</h2>
            </div>
            
            <p className="text-slate-600 text-base font-light leading-relaxed mb-8 max-w-2xl">
              {language === 'nl' 
                ? 'Een mobiele app die uw mensen op locatie, onderweg of in het veld de juiste tools geeft om hun taken volledig uit te voeren via gsm.'
                : 'A mobile app that gives your people in the field, on the road or on-site the right tools to fully perform their tasks via mobile phone.'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Voor wie' : 'For whom'}</h3>
                  <ul className="space-y-2">
                    {(language === 'nl' ? [
                      'Chauffeurs en transportmedewerkers',
                      'Arbeiders en techniekers op locatie',
                      'Vertegenwoordigers onderweg',
                      'Iedereen die werkt buiten een vaste werkplek'
                    ] : [
                      'Drivers and transport staff',
                      'Workers and technicians on location',
                      'Sales reps on the road',
                      'Anyone who works outside a fixed workplace'
                    ]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                        <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#628f69]/40 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het oplevert' : 'What it delivers'}</h3>
                  <ul className="space-y-3">
                    {(language === 'nl' ? [
                      'Taken worden afgerond waar ze plaatsvinden',
                      'Geen papier en geen manuele verwerking achteraf',
                      'Realtime data beschikbaar voor kantoor',
                      'Minder fouten door digitale registratie op het moment zelf'
                    ] : [
                      'Tasks are completed where they take place',
                      'No paper and no manual processing afterwards',
                      'Real-time data available for the office',
                      'Fewer errors due to digital registration at the moment itself'
                    ]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                        <Check size={14} className="text-[#628f69] mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het doet' : 'What it does'}</h3>
              <p className="text-slate-500 text-base font-light leading-relaxed max-w-3xl">
                {language === 'nl'
                  ? 'Uw mensen hebben via gsm toegang tot alles wat ze nodig hebben om hun taken ter plaatse af te ronden. Geen papier, geen telefoontjes naar kantoor, geen manuele verwerking achteraf.'
                  : 'Your people have access via mobile phone to everything they need to complete their tasks on-site. No paper, no phone calls to the office, no manual processing afterwards.'}
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsMobileAppModalOpen(false)}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-all duration-300"
              >
                {language === 'nl' ? 'Sluiten' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const WebplatformModal = () => {
    if (!isWebplatformModalOpen) return null;
    
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-12">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500" 
          onClick={() => setIsWebplatformModalOpen(false)}
        />
        
        {/* Modal Content - White Background & Scrollable */}
        <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col overflow-hidden">
          {/* Subtle Noise Overlay for White BG */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          {/* Close Button - Fixed in top right */}
          <button 
            onClick={() => setIsWebplatformModalOpen(false)}
            className="absolute top-6 right-6 p-4 rounded-full bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all duration-300 z-[60]"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          
          <div className="relative z-10 overflow-y-auto p-8 md:p-12 pt-16 md:pt-12">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">{language === 'nl' ? 'Webplatform' : 'Web platform'}</h2>
            </div>
            
            <p className="text-slate-600 text-base font-light leading-relaxed mb-8 max-w-2xl">
              {language === 'nl' 
                ? 'Een centrale omgeving waar beheerders alle lopende processen, taken en data in realtime opvolgen en beheren via de browser.'
                : 'A central environment where managers monitor and manage all ongoing processes, tasks and data in real time — accessible from any browser.'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Voor wie' : 'For whom'}</h3>
                  <ul className="space-y-2">
                    {(language === 'nl' ? [
                      'Operations managers',
                      'Zaakvoerders die overzicht willen',
                      'Administratieve medewerkers',
                      'Iedereen die processen opvolgt vanuit kantoor'
                    ] : [
                      'Operations managers',
                      'Business owners who want full oversight',
                      'Administrative staff',
                      'Anyone who manages processes from the office'
                    ]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                        <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#628f69]/40 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het oplevert' : 'What it delivers'}</h3>
                  <ul className="space-y-3">
                    {(language === 'nl' ? [
                      'Geen versnipperde informatie meer',
                      'Realtime zicht op wat er gebeurt',
                      'Minder manuele opvolging',
                      'Betere beslissingen op basis van live data'
                    ] : [
                      'No more scattered information',
                      'Real-time visibility of what is happening',
                      'Less manual follow-up',
                      'Better decisions based on live data'
                    ]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                        <Check size={14} className="text-[#628f69] mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het doet' : 'What it does'}</h3>
              <p className="text-slate-500 text-base font-light leading-relaxed max-w-3xl">
                {language === 'nl'
                  ? 'Uw beheerders hebben vanuit de browser een volledig beeld van wat er gebeurt in het bedrijf. Taken, statussen, AI-handelingen en data op één centrale plek, altijd up-to-date.'
                  : 'Your managers have a complete view from the browser of what is happening in the company. Tasks, statuses, AI actions and data in one central place, always up-to-date.'}
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsWebplatformModalOpen(false)}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-all duration-300"
              >
                {language === 'nl' ? 'Sluiten' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AutomationModal = () => {
    if (!isAutomationModalOpen) return null;
    
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-12">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500" 
          onClick={() => setIsAutomationModalOpen(false)}
        />
        
        {/* Modal Content - White Background & Scrollable */}
        <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col overflow-hidden">
          {/* Subtle Noise Overlay for White BG */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          {/* Close Button - Fixed in top right */}
          <button 
            onClick={() => setIsAutomationModalOpen(false)}
            className="absolute top-6 right-6 p-4 rounded-full bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all duration-300 z-[60]"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          
          <div className="relative z-10 overflow-y-auto p-8 md:p-12 pt-16 md:pt-12">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">{language === 'nl' ? 'Automatisering' : 'Automation'}</h2>
            </div>
            
            <p className="text-slate-600 text-base font-light leading-relaxed mb-8 max-w-2xl">
              {language === 'nl' 
                ? 'Stappen die altijd op dezelfde manier verlopen worden volledig geautomatiseerd, zonder manuele tussenkomst of opvolging.'
                : 'Steps that always follow the same pattern are fully automated, without manual intervention or follow-up.'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Voor wie' : 'For whom'}</h3>
                  <ul className="space-y-2">
                    {(language === 'nl' ? [
                      'Bedrijven met veel repetitieve administratieve taken',
                      'Teams die tijd verliezen aan manuele verwerking',
                      'Organisaties met complexe of foutgevoelige workflows',
                      'Bedrijven die hun processen willen laten lopen zonder constante opvolging'
                    ] : [
                      'Companies with many repetitive administrative tasks',
                      'Teams losing time to manual processing',
                      'Organizations with complex or error-prone workflows',
                      'Companies that want their processes to run without constant follow-up'
                    ]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                        <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#628f69]/40 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het oplevert' : 'What it delivers'}</h3>
                  <ul className="space-y-3">
                    {(language === 'nl' ? [
                      'Geen vergeten stappen meer',
                      'Minder fouten door manuele verwerking',
                      'Processen die doorlopen zonder manuele tussenkomst',
                      'Meer tijd voor werk dat echt aandacht vraagt'
                    ] : [
                      'No more forgotten steps',
                      'Fewer errors through manual processing',
                      'Processes that continue without manual intervention',
                      'More time for work that truly requires attention'
                    ]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                        <Check size={14} className="text-[#628f69] mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het doet' : 'What it does'}</h3>
              <p className="text-slate-500 text-base font-light leading-relaxed max-w-3xl">
                {language === 'nl'
                  ? 'Alles wat zich herhaalt in uw workflow wordt automatisch afgehandeld. Van documentverwerking tot meldingen en rapportage, zonder dat iemand er telkens tussen moet komen.'
                  : 'Everything that repeats in your workflow is handled automatically. From document processing to notifications and reporting, without anyone having to intervene every time.'}
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsAutomationModalOpen(false)}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-all duration-300"
              >
                {language === 'nl' ? 'Sluiten' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AIModal = () => {
    if (!isAIModalOpen) return null;
    
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-12">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500" 
          onClick={() => setIsAIModalOpen(false)}
        />
        
        {/* Modal Content - White Background & Scrollable */}
        <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col overflow-hidden">
          {/* Subtle Noise Overlay for White BG */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          {/* Close Button - Fixed in top right */}
          <button 
            onClick={() => setIsAIModalOpen(false)}
            className="absolute top-6 right-6 p-4 rounded-full bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all duration-300 z-[60]"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          
          <div className="relative z-10 overflow-y-auto p-8 md:p-12 pt-16 md:pt-12">
            <div className="flex items-center gap-4 mb-3">
              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">{language === 'nl' ? 'AI-integratie' : 'AI integration'}</h2>
            </div>
            <p className="text-slate-600 text-base font-light leading-relaxed mb-8 max-w-2xl">
              {language === 'nl' 
                ? 'AI wordt slim geïntegreerd in uw bestaande processen, daar waar het uw mensen tijd uitspaart en uw bedrijf efficiënter maakt.'
                : 'AI is smartly integrated into your existing processes, right where it saves your people time and makes your business more efficient.'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Voor wie' : 'For whom'}</h3>
                  <ul className="space-y-2">
                    {(language === 'nl' ? [
                      'Bedrijven met repetitieve of foutgevoelige processen',
                      'Teams die tijd verliezen aan manuele beslissingen en verwerkingen',
                      'Organisaties die meer willen doen met dezelfde mensen',
                      'Bedrijven die AI willen inzetten waar het echt rendeert'
                    ] : [
                      'Companies with repetitive or error-prone processes',
                      'Teams losing time to manual decisions and processing',
                      'Organisations that want to do more with the same headcount',
                      'Businesses that want to deploy AI where it truly pays off'
                    ]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                        <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#628f69]/40 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het oplevert' : 'What it delivers'}</h3>
                  <ul className="space-y-3">
                    {(language === 'nl' ? [
                      'Snellere verwerking van complexe taken',
                      'Minder fouten door manuele tussenkomst',
                      'Processen die lopen zonder constante manuele opvolging',
                      'Meer ruimte voor werk dat er echt toe doet'
                    ] : [
                      'Faster processing of complex tasks',
                      'Fewer errors from manual intervention',
                      'Processes that run without constant manual follow-up',
                      'More room for work that truly matters'
                    ]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-500 text-base font-light leading-relaxed">
                        <Check size={14} className="text-[#628f69] mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#628f69] mb-3">{language === 'nl' ? 'Wat het doet' : 'What it does'}</h3>
              <p className="text-slate-500 text-base font-light leading-relaxed max-w-3xl">
                {language === 'nl'
                  ? 'AI neemt taken over die altijd op dezelfde manier verlopen, ondersteunt beslissingen op basis van data en verwerkt informatie sneller dan manueel mogelijk is. Niet als losstaand hulpmiddel, maar diep ingebouwd in de manier waarop uw bedrijf werkt.'
                  : 'AI takes over tasks that always follow the same pattern, supports data-driven decision-making, and processes information faster than manually possible. Not as a standalone tool, but deeply embedded in how your company operates.'}
              </p>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsAIModalOpen(false)}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-all duration-300"
              >
                {language === 'nl' ? 'Sluiten' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      <MobileAppModal />
      <WebplatformModal />
      <AutomationModal />
      <AIModal />

      {/* B. HERO SECTION */}
      <section className="relative pt-40 pb-8 px-6 md:px-16 overflow-hidden bg-background flex flex-col items-center">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{
               backgroundImage: `linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)`,
               backgroundSize: '4rem 4rem'
             }}>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center">
          <p className="hero-stagger section-label mb-4">
            {language === 'nl' ? 'TriaCore AI' : 'TriaCore AI'}
          </p>
          <TypedHeroTitle language={language} onTypingDone={setIsTypingDone} skipAnimation={isTypingDone} />
          
          <div className={`transition-all duration-[1000ms] ease-[cubic-bezier(0.2,0,0,1)] ${isTypingDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="hero-sub-stagger max-w-3xl text-base md:text-lg text-foreground/60 mb-8 leading-relaxed font-sans">
              {language === 'nl'
                ? 'TriaCore bouwt bedrijfssoftware op maat van uw processen en uw team. AI wordt geïntegreerd in de processen waar het echt het verschil maakt.'
                : 'TriaCore builds custom business software tailored to your processes and team. AI is integrated where it truly makes a difference.'}
            </p>

            <div className="hero-sub-stagger flex flex-wrap gap-3 items-center justify-center mb-12">
              {[
                { nl: 'AI-integraties', en: 'AI Integrations' },
                { nl: 'Mobiele apps', en: 'Mobile apps' },
                { nl: 'Webapplicaties', en: 'Web applications' },
                { nl: 'Automatisering', en: 'Automation' }
              ].map((badge, idx) => (
                <span key={idx} className="px-4 py-1.5 bg-accent/5 border border-accent/10 rounded-full text-[10px] font-bold tracking-widest text-accent uppercase">
                  {language === 'nl' ? badge.nl : badge.en}
                </span>
              ))}
            </div>

            <div className="hero-sub-stagger flex flex-wrap gap-8 items-center justify-center mb-16">
              <CTAButton to="/contact" size="sm">
                {language === 'nl' ? 'Plan een gesprek' : 'Book a call'}
              </CTAButton>
              <a href="#aanpak" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 text-base font-medium transition-all duration-300 hover:gap-4 group/aanpak">
                {language === 'nl' ? 'Bekijk onze aanpak' : 'View our approach'} 
                <ArrowRight size={20} className="group-hover/aanpak:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>
        </div>

        {/* PARTNERS / TRUSTED BY SECTION */}
        <div className={`relative z-10 w-full max-w-7xl pt-12 pb-12 mx-auto transition-all duration-[1000ms] delay-500 ease-[cubic-bezier(0.2,0,0,1)] ${isTypingDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px flex-1 bg-foreground/10"></div>
            <span className="text-[11px] font-bold tracking-[0.3em] text-foreground/40 uppercase whitespace-nowrap">
              {language === 'nl' ? 'Bedrijven die op ons bouwen' : 'Companies building with us'}
            </span>
            <div className="h-px flex-1 bg-foreground/10"></div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-12 transition-all duration-1000 ease-in-out">
            {/* 
               DYNAMIC LOGO LOADING: 
               Vite automatically picks up any image files in src/assets/partners/
            */}
            {Object.entries(import.meta.glob('./assets/partners/*.{png,jpg,jpeg,svg,webp}', { eager: true }))
              .filter(([path]) => {
                const filename = path.split('/').pop().toLowerCase();
                return !filename.includes('atl');
              })
              .map(([path, module]) => {
                const filename = path.split('/').pop();
                const companyName = filename.split('.')[0];
                
                const partnerLinks = {
                  'a&m group': 'https://anmgroup.be/nl/',
                  'croes nv': 'https://www.croesnv.be/'
                };
                const link = partnerLinks[companyName.toLowerCase()];

                const cardContent = (
                  <>
                    <img src={module.default} alt={companyName} className="h-full w-auto object-contain" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] md:text-[11px] text-slate-900 font-bold opacity-100 transition-all duration-300 whitespace-nowrap bg-white px-4 py-1.5 rounded-full shadow-xl border border-slate-200 z-50 capitalize">
                      {companyName.replace(/[-_]/g, ' ')}
                    </span>
                  </>
                );

                if (link) {
                  return (
                    <a 
                      key={path}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/partner relative h-16 md:h-20 w-auto flex flex-col items-center justify-center transition-transform hover:scale-105 duration-500 px-4 cursor-pointer"
                    >
                      {cardContent}
                    </a>
                  );
                }

                return (
                  <div key={path} className="group/partner relative h-16 md:h-20 w-auto flex flex-col items-center justify-center transition-transform hover:scale-105 duration-500 px-4">
                    {cardContent}
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* STAGED CONTENT CONTAINER - Smoother fade with longer duration and delay */}
      <div className={`transition-all duration-[1500ms] delay-700 ease-in-out ${isTypingDone ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* C. NEWS GRID SECTION */}
      <section id="verhaal" className="relative pb-24 px-6 md:px-16 bg-background text-foreground overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{
               backgroundImage: `linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)`,
               backgroundSize: '4rem 4rem'
             }}>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12 scroll-animate">
            <span className="text-foreground/40 text-[11px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">{language === 'nl' ? 'Ons verhaal tot nu' : 'Our story so far'}</span>
            <div className="h-px w-full bg-foreground/10"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div id="solevo-case-card" 
                 className="lg:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-[#070b19] p-10 lg:p-14 flex flex-col min-h-[500px] shadow-sm hover:shadow-xl">
              {/* Background Visual Wrapper */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="relative w-full h-full z-0">
                  {solevoError ? (
                    <div className="absolute inset-0 flex items-center justify-center p-12 text-center border-2 border-dashed border-white/10 m-6 rounded-[2rem]">
                      <p className="text-white/30 text-[10px] sm:text-xs uppercase tracking-widest leading-loose">
                        Voeg een visual toe aan<br />public/images/solevo-visual/<br />(noem het visual.jpg of visual.mp4)
                      </p>
                    </div>
                  ) : solevoMedia?.type === 'video' ? (
                    <video 
                      key={solevoMedia.url}
                      src={solevoMedia.url} 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      preload="auto" 
                      onLoadedData={(e) => {
                        e.target.play().catch(err => console.log("Autoplay blocked:", err));
                      }}
                      onCanPlay={(e) => {
                        e.target.play().catch(err => console.log("Autoplay blocked:", err));
                      }}
                      onPause={(e) => {
                        e.target.play();
                      }}
                      className="w-full h-full object-cover" 
                    />
                  ) : solevoMedia?.type === 'image' ? (
                    <img src={solevoMedia.url} alt="Solevo Visual" className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="absolute inset-0 bg-black/60 z-10"></div>
              </div>

              {/* Content - Explicitly on top */}
              <div className="relative z-20 h-full flex flex-col">
                {/* Label removed per request */}
                
                
                <h3 className="hero-title text-4xl md:text-5xl lg:text-5xl mb-8 max-w-md text-white">
                  <span className="solevo-brand block">
                    <span className="text-sol">Sol</span><span className="text-evo">evo</span>
                  </span>
                </h3>
                
                <p className="text-white/70 text-lg md:text-xl max-w-md mb-12 leading-relaxed font-light">
                  {language === 'nl' 
                    ? 'Grond- en afbraakbedrijven verloren dagelijks tijd aan papieren vrachtbonnen. TriaCore bouwde een maatwerkplatform dat het volledige proces digitaliseert, van werf tot archief. We noemden het Solevo.'
                    : 'Earthmoving and demolition companies lost time daily on paper transport notes. TriaCore built a custom platform that digitizes the entire process, from site to archive. We called it Solevo.'}
                </p>
                
                <div className="mt-auto flex flex-col gap-4 items-start">
                  <a href="https://solevo.io" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent text-lg font-medium transition-all duration-300 group/case">
                    {language === 'nl' ? 'Bekijk de case' : 'View the case'} 
                    <ArrowRight size={20} className="inline-block ml-2 group-hover/case:ml-4 transition-all duration-300" />
                  </a>
                  <Link to="/custom-oplossingen" className="text-white/50 hover:text-accent text-lg font-medium transition-all duration-300 group/sector">
                    {language === 'nl' ? (
                      <>Ontdek custom <br className="md:hidden" /> oplossingen</>
                    ) : (
                      <>Discover custom <br className="md:hidden" /> solutions</>
                    )}
                    <ArrowRight size={20} className="inline-block ml-2 group-hover/sector:ml-4 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <a href="https://www.made-in.be/limburg/trio-toont-bedrijven-wat-ai-allemaal-mogelijk-maakt/" target="_blank" rel="noopener noreferrer" className="news-card-stagger group rounded-[2.5rem] bg-white border border-foreground/5 p-8 flex flex-col hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/30"></div>
                  <span className="text-accent/50 text-[10px] font-bold uppercase tracking-[0.2em]">MADE IN LIMBURG</span>
                </div>
                <h4 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors leading-snug">
                  {language === 'nl' ? 'Trio toont bedrijven wat AI allemaal mogelijk maakt' : 'Trio shows companies what AI makes possible'}
                </h4>
                <p className="text-foreground/50 text-sm leading-relaxed mb-8">
                  {language === 'nl' ? 'Rian Mathijs, Lucas Curto en Staf Wynants richtten TriaCore op en ontwikkelen AI-oplossingen op maat van bedrijven.' : 'Rian Mathijs, Lucas Curto and Staf Wynants founded TriaCore and develop custom AI solutions for companies.'}
                </p>
                <div className="mt-auto flex items-center justify-between text-foreground/20 text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-foreground/5">
                  <span>{language === 'nl' ? 'Lees het artikel' : 'Read the article'}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              <a href="https://www.made-in.be/limburg/jonge-truienaars-maken-appje-voor-een-vrachtbon/" target="_blank" rel="noopener noreferrer" className="news-card-stagger group rounded-[2.5rem] bg-white border border-foreground/5 p-8 flex flex-col hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/30"></div>
                  <span className="text-accent/50 text-[10px] font-bold uppercase tracking-[0.2em]">MADE IN LIMBURG</span>
                </div>
                <h4 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors leading-snug">
                  {language === 'nl' ? 'Jonge Truienaars maken appje voor een vrachtbon' : 'Young Limburgers create app for a transport note'}
                </h4>
                <p className="text-foreground/50 text-sm leading-relaxed mb-8">
                  {language === 'nl' ? 'Met Solevo brengt TriaCore een digitale vrachtbon op de markt voor de grondverzetsector, voor snellere en overzichtelijkere administratie op de werf.' : 'With Solevo, TriaCore brings a digital transport note to the market for the earthmoving sector, for faster and clearer administration on site.'}
                </p>
                <div className="mt-auto flex items-center justify-between text-foreground/20 text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-foreground/5">
                  <span>{language === 'nl' ? 'Lees het artikel' : 'Read the article'}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              <a href="https://www.vrt.be/vrtmax/luister/radio/r/radio-2-middag-in-limburg~23-3/radio-2-middag-in-limburg~23-20477-0/fragment~ba9a9797-be1e-4e54-b5c9-9dff908e5e13/" target="_blank" rel="noopener noreferrer" className="news-card-stagger group rounded-[2.5rem] bg-white border border-foreground/5 p-8 flex flex-col hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/30"></div>
                  <span className="text-accent/50 text-[10px] font-bold uppercase tracking-[0.2em]">RADIO 2</span>
                </div>
                <h4 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors leading-snug">
                  {language === 'nl' ? '3 jonge Limburgers helpen uw bedrijf met AI' : '3 young Limburgers help your business with AI'}
                </h4>
                <p className="text-foreground/50 text-sm leading-relaxed mb-8">
                  {language === 'nl' ? 'Rian Mathijs, Lucas Curto en Staf Wynants startten TriaCore, een onderneming die AI-oplossingen aanbiedt op maat van bedrijven.' : 'Rian Mathijs, Lucas Curto and Staf Wynants started TriaCore, a company that offers AI solutions tailored to companies.'}
                </p>
                <div className="mt-auto flex items-center justify-between text-foreground/20 text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-foreground/5">
                  <span>{language === 'nl' ? 'Beluister het fragment' : 'Listen to the fragment'}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>
          </div>

          {/* FOUNDER MISSION SECTION - Cinematic 2-column layout (Platter version) */}
          <div className="mt-6 mb-16 scroll-animate w-full">
            <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#070b19] border border-white/5 p-8 md:p-10 transition-all duration-500 hover:bg-[#090e21]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left: Photos side-by-side (Square for platter look) */}
                <div className="flex gap-4">
                  <div className="flex-1 aspect-square rounded-[2rem] overflow-hidden grayscale border border-white/10 shadow-2xl transition-all duration-700 hover:grayscale-0 hover:scale-[1.02]">
                    <AutoImage basePath="/team/lucas" alt="Lucas Curto" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 aspect-square rounded-[2rem] overflow-hidden grayscale border border-white/10 shadow-2xl transition-all duration-700 hover:grayscale-0 hover:scale-[1.02]">
                    <AutoImage basePath="/team/rian" alt="Rian Mathijs" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Right: Mission content vertically stacked */}
                <div className="flex flex-col h-full justify-center">
                  <div className="space-y-4">
                    <span className="text-[11px] text-white/50 uppercase tracking-[0.3em] font-bold block">
                      {language === 'nl' ? 'De missie van twee Vlaamse twintigers' : 'The mission of two Flemish twentysomethings'}
                    </span>
                    <div className="h-px w-20 bg-[#628f69]"></div>
                    <p className="text-white text-base lg:text-lg leading-relaxed font-light">
                      {language === 'nl' 
                        ? "De meeste bedrijven gebruiken AI vandaag aan de oppervlakte. Het echte potentieel van AI ligt dieper: in de processen die bepalen hoe snel, hoe accuraat en hoe efficiënt een organisatie werkt. Dat potentieel blijft voor de meeste bedrijven onbenut. Het omzetten in iets concreets en meetbaars, dat is wat TriaCore doet."
                        : "Most companies use AI on the surface today. The true potential of AI lies deeper: in the processes that determine how fast, how accurate, and how efficient an organization operates. That potential remains untapped for most companies. Turning it into something concrete and measurable, that is what TriaCore does."}
                    </p>
                  </div>
                  
                  <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <a href="#aanpak" className="flex items-center gap-2 text-white hover:text-accent transition-all duration-300 group/cta w-fit">
                      <span className="font-medium border-b border-transparent group-hover/cta:border-accent transition-all">
                        {language === 'nl' ? 'Ontdek hoe we dit doen' : 'Discover how we do this'}
                      </span>
                      <ArrowRight size={18} className="group-hover/cta:translate-x-1 transition-transform" />
                    </a>
                    
                    <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
                      <span className="hover:text-accent transition-colors duration-300">Lucas Curto</span>
                      <span className="hover:text-accent transition-colors duration-300">Rian Mathijs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Follow our story - Right aligned with line to the left */}
          <div className="flex items-center gap-6 mt-16 scroll-animate">
            <div className="h-px w-full bg-foreground/10"></div>
            <div className="flex items-center gap-4 whitespace-nowrap">
              <span className="text-foreground/40 text-[11px] font-bold tracking-[0.2em] uppercase">{language === 'nl' ? 'Volg ons verhaal' : 'Follow our story'}</span>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/triacore.ai/" target="_blank" rel="noopener noreferrer" className="text-foreground/20 hover:text-accent transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
                <a href="https://be.linkedin.com/company/triacore-ai" target="_blank" rel="noopener noreferrer" className="text-foreground/20 hover:text-accent transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* D. CHALLENGES (SPLIT STICKY) */}
      <section id="uitdagingen" className="relative bg-dark-section py-32 px-6 md:px-16 lg:px-24 border-b border-white/5 overflow-visible">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-start">
            
            {/* Left side - Fixed/Sticky */}
            <div className="md:sticky md:top-32 self-start text-center md:text-left flex flex-col items-center md:items-start z-10">
              <div className="section-label mb-6">{language === 'nl' ? 'UITDAGINGEN' : 'CHALLENGES'}</div>
              <h2 className="hero-title text-white text-4xl md:text-6xl mb-6 scroll-animate">
                {language === 'nl' ? 'Veel bedrijven zitten met dezelfde vragen.' : 'Many companies have the same questions.'}
              </h2>
              <p className="section-subtitle text-white/60 text-lg md:text-xl max-w-sm mx-auto md:mx-0 scroll-animate">
                {language === 'nl' 
                  ? 'Dit zijn de uitdagingen die wij dagelijks tegenkomen bij bedrijven.' 
                  : 'These are the challenges we encounter daily at companies.'}
              </p>
            </div>

            {/* Right side - Scrolling cards */}
            <div className="flex flex-col gap-8 pb-12 md:pb-16">
              {painPointsData.map((pt, i) => (
                <div 
                  key={i} 
                  className="pain-point-item scroll-animate group relative"
                >
                  {/* The Card - Now Rectangular with increased vertical breathing room */}
                  <div className={`relative overflow-hidden rounded-none bg-[#0a0a1a]/40 backdrop-blur-xl border transition-all duration-700 pt-20 pb-24 px-10 md:pt-32 md:pb-40 md:px-16 
                    ${activePainPoint === i ? 'border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)]' : 'border-white/5 opacity-40 scale-[0.98]'}`}
                  >
                    {/* Liquid Background Effect - Animated radial glow */}
                    {activePainPoint === i && (
                      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute -inset-[100%] bg-[radial-gradient(circle_at_center,rgba(98,143,105,0.12)_0%,transparent_60%)] animate-liquid-flow opacity-70" />
                        <div className="absolute -inset-[100%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_50%)] animate-liquid-flow opacity-50" style={{ animationDirection: 'reverse', animationDuration: '20s' }} />
                      </div>
                    )}

                    {/* Sharper Architectural Corner Accents - Closer to edges and smaller */}
                    <div className={`absolute top-5 left-5 w-4 h-4 border-t border-l transition-all duration-700 ${activePainPoint === i ? 'border-accent/60 w-6 h-6' : 'border-white/10'}`} />
                    <div className={`absolute top-5 right-5 w-4 h-4 border-t border-r transition-all duration-700 ${activePainPoint === i ? 'border-accent/60 w-6 h-6' : 'border-white/10'}`} />
                    <div className={`absolute bottom-5 left-5 w-4 h-4 border-b border-l transition-all duration-700 ${activePainPoint === i ? 'border-accent/60 w-6 h-6' : 'border-white/10'}`} />
                    <div className={`absolute bottom-5 right-5 w-4 h-4 border-b border-r transition-all duration-700 ${activePainPoint === i ? 'border-accent/60 w-6 h-6' : 'border-white/10'}`} />

                    <div className="relative z-10 flex flex-col w-full">
                      <span className={`font-mono text-[10px] uppercase tracking-[0.4em] mb-8 transition-colors duration-500 ${activePainPoint === i ? 'text-accent' : 'text-white/20'}`}>
                        // {pt.num}
                      </span>
                      
                      <h3 className={`text-xl md:text-2xl font-medium mb-4 leading-tight transition-colors duration-500 ${activePainPoint === i ? 'text-white' : 'text-white/70'}`}>
                        {pt.title}
                      </h3>
                      
                      <p className={`text-base md:text-lg font-light leading-relaxed transition-colors duration-500 ${activePainPoint === i ? 'text-white/60' : 'text-white/30'}`}>
                        {pt.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="relative w-full bg-dark-section">
        {/* E. SOLUTIONS (OUR APPROACH) */}
        <section id="aanpak" className="relative pt-16 md:pt-24 pb-12 md:pb-20 bg-dark-section border-t border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto text-center mb-20 md:mb-24">
              <h2 className="hero-title text-white text-4xl md:text-6xl mb-6 scroll-animate">
                {language === 'nl' ? 'Onze aanpak.' : 'Our approach.'}
              </h2>
              <p className="section-subtitle text-white/60 text-lg md:text-xl max-w-3xl mx-auto scroll-animate">
                {language === 'nl' 
                  ? 'Niet elke uitdaging vraagt om dezelfde oplossing. Wij bieden de structuur die past bij uw ambitie.' 
                  : 'Not every challenge requires the same solution. We provide the structure that fits your ambition.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 — volledig breed, 3 kolommen */}
              <div className="md:col-span-3 scroll-card-aanpak-left group relative bg-[#0a0a1a]/40 backdrop-blur-xl border border-white/10 p-10 md:p-14 flex flex-col items-center text-center justify-center min-h-[400px]">
                <div className="absolute top-5 left-5 w-4 h-4 border-t border-l border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                <div className="absolute top-5 right-5 w-4 h-4 border-t border-r border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                <div className="absolute bottom-5 left-5 w-4 h-4 border-b border-l border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                <div className="absolute bottom-5 right-5 w-4 h-4 border-b border-r border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] mb-8 text-accent">
                  // {language === 'nl' ? 'WAT IS EEN CUSTOM OPLOSSING?' : 'WHAT IS A CUSTOM SOLUTION?'}
                </span>
                <h3 className="text-xl md:text-2xl font-medium leading-relaxed text-white max-w-2xl">
                  {language === 'nl' 
                    ? 'Een custom oplossing is software op maat, volledig gebouwd rond uw processen en uw mensen. We integreren AI waar het rendeert en pakken het probleem aan dat u vandaag tijd, geld of fouten kost.'
                    : 'A custom solution is tailored software, built entirely around your processes and your people. We integrate AI where it pays off and tackle the problem that currently costs you time, money, or errors.'}
                </h3>
              </div>


              {/* Card 2 — volledig breed, 3 kolommen */}
              <div className="md:col-span-3 scroll-card-aanpak-right group relative bg-[#0a0a1a]/40 backdrop-blur-xl border border-white/10 p-10 md:p-14 overflow-hidden">
                <div className="absolute top-5 left-5 w-4 h-4 border-t border-l border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                <div className="absolute top-5 right-5 w-4 h-4 border-t border-r border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                <div className="absolute bottom-5 left-5 w-4 h-4 border-b border-l border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                <div className="absolute bottom-5 right-5 w-4 h-4 border-b border-r border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />

                <span className="font-mono text-[10px] uppercase tracking-[0.4em] mb-12 block text-accent">
                  // {language === 'nl' ? 'HOE WIJ UW PROBLEEM OPLOSSEN' : 'HOW WE SOLVE YOUR PROBLEM'}
                </span>
                
                <div className="flex flex-col items-center w-full py-6 md:py-10">
                  {/* TOP FLOW - Centered Grid for perfect alignment */}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-6 md:gap-8 w-full">
                    {/* 01: Problem */}
                    <div className="flex justify-center md:justify-end">
                      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 text-center w-full md:w-[280px] min-h-[120px] flex flex-col justify-center relative group/flow">
                        <span className="block font-mono text-[10px] text-white/30 mb-2 tracking-[0.2em] uppercase">// 01</span>
                        <span className="text-white font-medium text-lg md:text-xl leading-tight">{language === 'nl' ? 'Uw probleem' : 'Your problem'}</span>
                      </div>
                    </div>
                    
                    <ArrowRight size={24} className="text-white/10 mx-auto rotate-90 md:rotate-0" />
                    
                    {/* 02: Custom Solution + Connection Line */}
                    <div className="flex flex-col items-center">
                      <div className="bg-accent rounded-[2rem] p-6 text-center w-full md:w-[280px] min-h-[120px] flex flex-col justify-center shadow-2xl shadow-accent/20 relative scale-105 md:scale-110 z-10">
                        <span className="block font-mono text-[10px] text-black/50 mb-2 tracking-[0.2em] uppercase font-bold">// 02</span>
                        <span className="text-black font-bold text-lg md:text-xl leading-tight">{language === 'nl' ? 'Custom oplossing' : 'Custom solution'}</span>
                      </div>
                      {/* VERTICAL LINE - Now inside the same column for perfect alignment */}
                      <div className="hidden md:block h-20 w-px bg-white/10 -mb-20 mt-4 relative z-0"></div>
                    </div>
                    
                    <ArrowRight size={24} className="text-white/10 mx-auto rotate-90 md:rotate-0" />
                    
                    {/* 03: Result */}
                    <div className="flex justify-center md:justify-start">
                      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 text-center w-full md:w-[280px] min-h-[120px] flex flex-col justify-center relative group/flow">
                        <span className="block font-mono text-[10px] text-white/30 mb-2 tracking-[0.2em] uppercase">// 03</span>
                        <span className="text-white font-medium text-lg md:text-xl leading-tight">{language === 'nl' ? 'Uw bedrijf werkt efficiënter' : 'Your business works more efficiently'}</span>
                      </div>
                    </div>
                  </div>

                  {/* SPACING BEFORE PILLARS */}
                  <div className="h-24 md:h-32"></div>

                  {/* SUBTITLE */}
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-16 font-bold text-center">
                    {language === 'nl' ? 'WAT WE GEBRUIKEN OM HET PROBLEEM OP TE LOSSEN' : 'WHAT WE USE TO SOLVE THE PROBLEM'}
                  </span>

                  {/* GRID / PILLARS */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 w-full relative">
                    {/* Connection Lines (Desktop only) */}
                    <div className="hidden md:block absolute top-[-40px] left-1/2 -translate-x-1/2 w-[75%] h-px bg-white/10"></div>
                    <div className="hidden md:block absolute top-[-40px] left-[12.5%] w-px h-[40px] bg-white/10"></div>
                    <div className="hidden md:block absolute top-[-40px] left-[37.5%] w-px h-[40px] bg-white/10"></div>
                    <div className="hidden md:block absolute top-[-40px] left-[62.5%] w-px h-[40px] bg-white/10"></div>
                    <div className="hidden md:block absolute top-[-40px] left-[87.5%] w-px h-[40px] bg-white/10"></div>

                    {[
                      { 
                        icon: <Sparkles size={20} />, 
                        title: language === 'nl' ? "AI-integratie" : "AI integration", 
                        sub: language === 'nl' ? "Slim ingebouwd" : "Smartly integrated",
                        clickable: true,
                        modal: 'ai'
                      },
                      { 
                        icon: <Smartphone size={20} />, 
                        title: language === 'nl' ? "Mobiele app" : "Mobile app", 
                        sub: language === 'nl' ? "Voor taken onderweg" : "For tasks on the go",
                        clickable: true
                      },
                      { 
                        icon: <Layout size={20} />, 
                        title: language === 'nl' ? "Webplatform" : "Web platform", 
                        sub: language === 'nl' ? "Centraal beheer" : "Central management",
                        clickable: true,
                        modal: 'web'
                      },
                      { 
                        icon: <Cog size={20} />, 
                        title: language === 'nl' ? "Automatisering" : "Automation", 
                        sub: language === 'nl' ? "Minder manueel werk" : "Less manual work",
                        clickable: true,
                        modal: 'auto'
                      },
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        onClick={item.clickable ? 
                          (item.modal === 'web' ? () => setIsWebplatformModalOpen(true) : 
                           item.modal === 'auto' ? () => setIsAutomationModalOpen(true) : 
                           item.modal === 'ai' ? () => setIsAIModalOpen(true) :
                           () => setIsMobileAppModalOpen(true)) 
                          : undefined}
                        className={`flex flex-col items-center text-center group/item transition-all duration-300 ${item.clickable ? 'cursor-pointer hover:-translate-y-1' : ''}`}
                      >
                        <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent mb-5 group-hover/item:bg-accent/20 group-hover/item:border-accent/50 transition-all duration-500 shadow-xl shadow-black/20 ${item.clickable ? 'group-hover/item:scale-110' : ''}`}>
                          {item.icon}
                        </div>
                        <span className="text-white font-medium mb-1.5 block md:text-lg group-hover/item:text-accent transition-colors duration-300">{item.title}</span>
                        <span className="text-white/30 text-[11px] md:text-xs font-light uppercase tracking-wider mb-4 min-h-[2rem] md:min-h-[2.5rem] flex items-start justify-center px-2">
                          {item.sub}
                        </span>
                        
                        {item.clickable && (
                          <div className="inline-flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest group-hover/item:gap-4 transition-all duration-300">
                            {language === 'nl' ? 'Meer info' : 'More info'} <ArrowRight size={14} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 3 — smal, 1 kolom */}
              <div className="md:col-span-1 scroll-card-aanpak-bottom group relative bg-[#0a0a1a]/40 backdrop-blur-xl border border-white/10 p-10 md:p-12 flex flex-col h-full min-h-[350px]">
                <div className="absolute top-5 left-5 w-4 h-4 border-t border-l border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                <div className="absolute top-5 right-5 w-4 h-4 border-t border-r border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                <div className="absolute bottom-5 left-5 w-4 h-4 border-b border-l border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                <div className="absolute bottom-5 right-5 w-4 h-4 border-b border-r border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />

                <h3 className="text-2xl font-medium text-white mb-4">Solevo</h3>

                <p className="text-white/40 text-base leading-relaxed mb-8 flex-grow">
                  {language === 'nl' 
                    ? 'Grond- en afbraakbedrijven verloren dagelijks tijd aan papieren vrachtbonnen. TriaCore bouwde een maatwerkplatform dat het volledige proces digitaliseert, van werf tot archief. We noemden het Solevo.'
                    : 'Earthmoving and demolition companies lost time daily on paper transport notes. TriaCore built a custom platform that digitizes the entire process, from site to archive. We called it Solevo.'}
                </p>
                <a href="https://solevo.io" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent font-medium hover:gap-4 transition-all duration-300">
                  {language === 'nl' ? 'Bekijk de case' : 'View the case'} <ArrowRight size={18} />
                </a>
              </div>

              {/* Card 4 — breed, 2 kolommen */}
              <div className="md:col-span-2 scroll-card-aanpak-bottom group relative bg-[#0a0a1a]/40 backdrop-blur-xl border border-white/10 py-16 px-10 md:py-24 md:px-16 flex flex-col justify-center min-h-[450px]">
                <div className="absolute top-5 left-5 w-4 h-4 border-t border-l border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                <div className="absolute top-5 right-5 w-4 h-4 border-t border-r border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                <div className="absolute bottom-5 left-5 w-4 h-4 border-b border-l border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />
                <div className="absolute bottom-5 right-5 w-4 h-4 border-b border-r border-white/10 group-hover:border-accent/60 group-hover:w-6 group-hover:h-6 transition-all duration-700" />

                <div className="max-w-2xl">
                  <p className="text-white/60 italic text-lg md:text-2xl leading-relaxed mb-12">
                    {language === 'nl'
                      ? '"Chatten met AI is niet waar uw bedrijf het verschil mee maakt. AI die diep geïntegreerd is in uw processen, dat is waar de echte winst gemaakt wordt. Daarom bouwen wij custom oplossingen die AI enkel inzetten waar het een optimale return heeft voor uw bedrijf."'
                      : '"Chatting with AI is not where your company makes the difference. AI that is deeply integrated into your processes, that is where the real profit is made. That is why we build custom solutions that only deploy AI where it has an optimal return for your company."'}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 grayscale border border-white/10">
                      <AutoImage basePath="/team/lucas" alt="Lucas Curto" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg">Lucas Curto</p>
                      <p className="text-white/30 text-xs uppercase tracking-wider">co-founder TriaCore AI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-20">
              <CTAButton to="/custom-oplossingen" variant="light">
                {language === 'nl' ? 'Ontdek meer over custom oplossingen' : 'Discover more about custom solutions'} 
              </CTAButton>
            </div>
          </div>
        </section>


        <div className="h-[5vh] md:h-[10vh] pointer-events-none"></div>

      </div>
      



      {/* G. TEAM SECTION */}
      <section id="team" className="relative pt-16 md:pt-20 pb-20 px-6 md:px-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 md:mb-24">
            <h2 className="hero-title text-foreground text-4xl md:text-6xl mb-6 scroll-animate">
              {language === 'nl' ? 'Het team achter TriaCore AI.' : 'The team behind TriaCore AI.'}
            </h2>
            <p className="section-subtitle text-foreground/60 text-lg md:text-xl max-w-3xl mx-auto scroll-animate">
              {language === 'nl' ? 'Een complementair team dat structuur brengt in elke implementatie.' : 'A complementary team that brings structure to every implementation.'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-16 px-4 md:px-0 max-w-4xl mx-auto">
            {[
              { name: "Rian", role: language === 'nl' ? "Sales & Klantrelaties" : "Sales & Client Relations", image: "/team/rian", desc: language === 'nl' ? "Eerste aanspreekpunt voor klanten en zorgt voor duidelijke afstemming en opvolging." : "First point of contact for clients, ensuring clear alignment and follow-up." },
              { name: "Lucas", role: language === 'nl' ? "Operationeel & Technische Architectuur" : "Operations & Technical Architecture", image: "/team/lucas", desc: language === 'nl' ? "Ontwerpt de technische architectuur en schaalbare AI-systemen." : "Designs the technical architecture and scalable AI systems." }
            ].map((member, i) => (
              <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-foreground/5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-foreground/5 flex flex-col items-center text-center">
                <div className="w-48 h-48 mb-8 rounded-full overflow-hidden border-2 border-foreground/5 shadow-inner">
                  <AutoImage basePath={member.image} alt={member.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out scale-110 group-hover:scale-100" />
                </div>
                <h3 className="section-title text-foreground text-2xl mb-1">{member.name}</h3>
                <div className="section-label mb-4">{member.role}</div>
                <p className="text-foreground/60 leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <CTAButton to="/team">{language === 'nl' ? 'Leer ons team kennen' : 'Get to know our team'}</CTAButton>
          </div>
        </div>
      </section>

      {/* H. FAQ SECTION */}
      <section id="faq" className="pt-20 pb-32 px-6 md:px-16 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="text-center mb-20 md:mb-24 scroll-animate">
            <h2 className="hero-title text-foreground text-4xl md:text-6xl mb-6">
              {language === 'nl' ? 'Veelgestelde vragen' : 'Frequently Asked Questions'}
            </h2>
            <p className="section-subtitle text-foreground/60 text-lg md:text-xl max-w-3xl mx-auto">
              {language === 'nl' ? 'De antwoorden op uw vragen over onze aanpak en technologie.' : 'Answers to your questions about our approach and technology.'}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-4">
            <AccordionItem title={language === 'nl' ? "Wat kost een custom oplossing?" : "What does a custom solution cost?"}>
              {language === 'nl' 
                ? "De kostprijs hangt af van de complexiteit van het probleem, het aantal gebruikers en de technieken die we inzetten. We werken nooit met een vast prijskaartje omdat elke oplossing anders is. Na een eerste gesprek maken we een duidelijke inschatting zonder verborgen kosten." 
                : "The cost price depends on the complexity of the problem, the number of users, and the techniques we deploy. We never work with a fixed price tag because every solution is different. After an initial conversation, we make a clear estimate without hidden costs."}
            </AccordionItem>
            <AccordionItem title={language === 'nl' ? "Hoe lang duurt het om een custom oplossing te bouwen?" : "How long does it take to build a custom solution?"}>
              {language === 'nl' 
                ? "Een eerste werkende versie bouwen we doorgaans in zes tot twaalf weken. We werken iteratief: u ziet vroeg resultaat en geeft feedback voor we verder bouwen." 
                : "We typically build an initial working version in six to twelve weeks. We work iteratively: you see results early and provide feedback before we build further."}
            </AccordionItem>
            <AccordionItem title={language === 'nl' ? "Bouwen jullie altijd custom of raden jullie soms een bestaande tool aan?" : "Do you always build custom or do you sometimes recommend an existing tool?"}>
              {language === 'nl' 
                ? "Niet elk probleem vraagt om maatwerk. Als een bestaande tool uw probleem oplost, zeggen we dat eerlijk en helpen we u op weg. We bouwen een custom oplossing alleen als het de juiste keuze is." 
                : "Not every problem requires custom work. If an existing tool solves your problem, we say so honestly and help you get started. We only build a custom solution if it is the right choice."}
            </AccordionItem>
            <AccordionItem title={language === 'nl' ? "Wat gebeurt er als mijn bedrijf groeit of iets wil aanpassen?" : "What happens if my company grows or wants to adjust something?"}>
              {language === 'nl' 
                ? "Uw oplossing is gebouwd om mee te groeien. We documenteren alles en bouwen zo dat aanpassingen en uitbreidingen later mogelijk zijn zonder alles opnieuw te bouwen." 
                : "Your solution is built to grow with you. We document everything and build it so that adjustments and expansions are possible later without having to rebuild everything."}
            </AccordionItem>
            <AccordionItem title={language === 'nl' ? "Moet ik meteen een volledig systeem bouwen of kan ik stapsgewijs starten?" : "Do I have to build a full system immediately or can I start step-by-step?"}>
              {language === 'nl' 
                ? "U hoeft niet alles in één keer te bouwen. We starten vaak met één concreet proces, bewijzen de waarde en bouwen daarna verder. Zo houdt u controle over de investering en ziet u snel resultaat." 
                : "You don't have to build everything at once. We often start with one concrete process, prove the value, and then build further. This way you maintain control over the investment and see results quickly."}
            </AccordionItem>
            <AccordionItem title={language === 'nl' ? "Hoe beveiligen jullie de software die jullie bouwen?" : "How do you secure the software you build?"}>
              {language === 'nl' 
                ? (
                  <span>
                    Wij beveiligen onze software via <a href="https://www.aikido.dev/" target="_blank" rel="noopener noreferrer" className="text-[#628f69] hover:underline font-medium">Aikido</a>, een gespecialiseerd beveiligingsplatform dat continu onze code en systemen scant op kwetsbaarheden. Zo is uw oplossing van dag één beschermd tegen bekende risico's.
                  </span>
                )
                : (
                  <span>
                    We secure our software via <a href="https://www.aikido.dev/" target="_blank" rel="noopener noreferrer" className="text-[#628f69] hover:underline font-medium">Aikido</a>, a specialized security platform that continuously scans our code and systems for vulnerabilities. This way your solution is protected against known risks from day one.
                  </span>
                )}
            </AccordionItem>
            </div>
          </div>
        </div>
      </section>



      </div> {/* END STAGED CONTENT CONTAINER */}
      <Footer />
    </div>
  );
}

export default App;
