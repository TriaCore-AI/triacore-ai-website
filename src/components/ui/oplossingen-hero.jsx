import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import CTAButton from './cta-button';
import { GlasDonker } from './hero-achtergronden';

// Hero van Oplossingen (v2). Vanaf 1024px links, verticaal gecentreerd, de titel met een korte ondertitel en
// één knop; rechts groot de interface van een oplossing die we bouwen (dezelfde visuals als op Custom tools).
// De visuals wisselen vanzelf. Onder de visual per oplossing een dunne lijn met haar naam: de actieve lijn vult
// zich zolang ze getoond wordt, een klik toont die oplossing meteen. Met de muis op de visual staat het
// wisselen stil. Op gsm en tablet staat de visual onder de knop.
// Achtergrond: over de volle breedte en tot bovenaan; onderaan vloeit ze zacht uit in de pagina. De achtergrond
// zelf komt als laag binnen (standaard het geribbelde glas, op Oplossingen v2 de zijden lagen, zie
// hero-achtergronden.jsx), met een toon voor de tekst: "donker" (witte tekst) of "licht" (donkere tekst).
// Wie minder beweging vraagt, krijgt geen automatische wissel: enkel klikken.
// Vorige achtergronden: GolfAchtergrond (golf-achtergrond.jsx) en DeeltjesAchtergrond (deeltjes-achtergrond.jsx).
// Vorige hero (enkel de twee regels, gecentreerd): LeidingHero (leiding-hero.jsx).

gsap.registerPlugin(ScrollToPlugin);

const DUUR = 9000; // ms per oplossing

const STIJL = {
    donker: {
        boven: 'text-[#cfe3d4]',
        noot: 'text-white/50',
        titel: 'text-white [&_.text-accent]:text-[#cfe3d4]',
        intro: 'text-white/75',
        knop: 'light',
        lijn: 'bg-white/20',
        vul: 'bg-white',
        naamAan: 'text-white',
        naamUit: 'text-white/55 group-hover:text-white/80'
    },
    licht: {
        boven: 'text-accent',
        noot: 'text-foreground/45',
        titel: 'text-foreground',
        intro: 'text-foreground/60',
        knop: 'primary',
        lijn: 'bg-foreground/15',
        vul: 'bg-accent',
        naamAan: 'text-foreground',
        naamUit: 'text-foreground/45 group-hover:text-foreground/70'
    }
};

export default function OplossingenHero({ boven, regels, intro, noot, meer, klanten, klantenLabel, knop, oplossingen, laag = <GlasDonker />, toon = 'donker' }) {
    const ref = useRef(null);
    const [actief, setActief] = useState(0);
    const [stil, setStil] = useState(false);
    const [rustig] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const s = STIJL[toon] || STIJL.donker;

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (rustig) return;
            const tl = gsap.timeline({ paused: true });
            if (ref.current.querySelector('.oh-boven')) tl.from('.oh-boven', { opacity: 0, y: 8, duration: 1, ease: 'power2.out' }, 0);
            tl.fromTo('.oh-regel',
                { clipPath: 'inset(-20% 100% -35% -5%)', x: -16 },
                { clipPath: 'inset(-20% -5% -35% -5%)', x: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.35, clearProps: 'clipPath' }, 0.2);
            tl.from('.oh-fade', { opacity: 0, y: 12, duration: 1.2, ease: 'expo.out', stagger: 0.12 }, 1.1);
            tl.from('.oh-beeld', { opacity: 0, y: 24, scale: 0.97, duration: 1.6, ease: 'expo.out' }, 0.7);
            const play = () => tl.play();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
            else play();
        }, ref);
        return () => ctx.revert();
    }, [rustig]);

    const metBeeld = Boolean(oplossingen && oplossingen.length);
    const volgende = () => setActief((a) => (a + 1) % (oplossingen?.length || 1));

    return (
        <section ref={ref} className="relative">
            {/* Volle breedte en tot bovenaan tegen de rand */}
            <div className="relative overflow-hidden">
                {/* De achtergrond. Onderaan vloeit ze zacht uit in de pagina (een masker, dus ze gaat over in
                    welke achtergrond er ook onder ligt), zonder harde rand naar de volgende sectie */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                        maskImage: 'linear-gradient(to bottom, #000 0%, #000 62%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 62%, transparent 100%)'
                    }}
                >
                    {laag}
                </div>

                <div className={`relative px-5 md:px-14 lg:px-22 pt-36 md:pt-44 pb-16 md:pb-24 ${metBeeld
                    ? 'lg:pt-[max(9rem,calc(50svh-16rem))] lg:pb-[max(6rem,calc(50svh-19rem))]'
                    : klanten && klanten.length
                        ? 'lg:pt-[max(9rem,calc(50svh-16rem))] lg:pb-[max(6rem,calc(50svh-19rem))]'
                        : 'lg:pt-[max(10rem,calc(50svh-12rem))] lg:pb-[max(7rem,calc(50svh-15rem))]'}`}>
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-10 xl:gap-x-14 gap-y-14 lg:items-center">
                        {/* Een kleine bovenregel, de titel (elke regel vast op zijn eigen regel), de ondertitel en de
                            knop. Titel en ondertitel hebben de vaste hero-maten van de site (titel-hero, tekst-hero).
                            Met een visual staat dit links in een halve kolom (breed genoeg voor een titelregel van een
                            vijftiental tekens); zonder visual staat alles gecentreerd over de volle breedte */}
                        <div className={metBeeld ? 'lg:col-span-6' : 'lg:col-span-12 text-center'}>
                            {boven && (
                                <p className={`oh-boven mb-5 md:mb-6 text-[13px] tracking-[0.16em] uppercase font-medium ${s.boven}`}>{boven}</p>
                            )}
                            {metBeeld ? (
                                <h1 className={`hero-title titel-hero ${s.titel}`}>
                                    {regels.map((r, i) => (
                                        <span key={i} className="oh-regel block whitespace-nowrap">{r}</span>
                                    ))}
                                </h1>
                            ) : (
                                // Zonder visual staat de titel op twee regels, in de vaste hero-maat: alle regels
                                // behalve de laatste samen op de eerste ("Wij bouwen voor bedrijven die"), de laatste
                                // ("vooruit durven denken.") eronder. Vanaf 1024 px breken ze niet verder af; op gsm en
                                // tablet loopt de eerste regel gewoon door als hij niet past
                                <h1 className={`hero-title titel-hero ${s.titel}`}>
                                    <span className="oh-regel block w-fit max-w-full mx-auto lg:whitespace-nowrap">
                                        {regels.slice(0, -1).map((r, i) => (
                                            <React.Fragment key={i}>{i > 0 && ' '}{r}</React.Fragment>
                                        ))}
                                    </span>
                                    <span className="oh-regel block w-fit max-w-full mx-auto">{regels[regels.length - 1]}</span>
                                </h1>
                            )}
                            <p className={`oh-fade mt-6 md:mt-8 tekst-hero ${metBeeld ? 'max-w-md' : 'max-w-2xl mx-auto'} ${s.intro}`}>{intro}</p>
                            <div className={`oh-fade mt-9 md:mt-10 ${metBeeld ? '' : 'flex justify-center'}`}>
                                <CTAButton to={knop.to} size="md" variant={s.knop}>{knop.tekst}</CTAButton>
                            </div>
                            {/* Stil bewijs: de logo's van klanten waar een AI-oplossing van ons draait, elk met een link
                                naar de case. Hoogtes per logo, zodat ze optisch even zwaar ogen */}
                            {klanten && klanten.length > 0 && (
                                <div className={`oh-fade mt-14 md:mt-16 flex flex-col gap-5 ${metBeeld ? 'items-start' : 'items-center'}`}>
                                    {klantenLabel && <p className={`text-sm ${s.intro}`}>{klantenLabel}</p>}
                                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
                                        {klanten.map((k) => (
                                            <Link key={k.naam} to={k.to} aria-label={k.naam} className="transition-opacity duration-300 hover:opacity-70">
                                                <img src={k.logo} alt={k.naam} className="w-auto object-contain mix-blend-multiply" style={{ height: k.hoogte }} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Rechts: de interface van de oplossing in beeld, met eronder per oplossing een lijn en haar naam.
                            Enkel als er oplossingen meegegeven zijn */}
                        {metBeeld && (
                        <div className="oh-beeld lg:col-span-6">
                            <div
                                className="relative aspect-square sm:aspect-[4/3] rounded-3xl bg-[#fafafa] border border-white/40 overflow-hidden shadow-[0_40px_90px_-30px_rgba(2,6,23,0.45)]"
                                onMouseEnter={() => setStil(true)}
                                onMouseLeave={() => setStil(false)}
                            >
                                {oplossingen.map((o, i) => {
                                    const aan = i === actief;
                                    return (
                                        <div
                                            key={o.id}
                                            aria-hidden={!aan}
                                            className={`absolute inset-0 flex items-center justify-center transition-all ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${aan ? 'z-10 opacity-100 scale-100 duration-1000' : 'z-0 opacity-0 scale-[1.02] duration-700'}`}
                                        >
                                            {o.visual}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Per oplossing een lijn met haar naam, en als laatste een link naar de rest van de pagina:
                                er is meer mogelijk dan deze voorbeelden */}
                            <div className="mt-6 grid gap-6" style={{ gridTemplateColumns: `repeat(${oplossingen.length + (meer ? 1 : 0)}, minmax(0, 1fr))` }}>
                                <div role="tablist" className="contents">
                                {oplossingen.map((o, i) => {
                                    const aan = i === actief;
                                    return (
                                        <button
                                            key={o.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={aan}
                                            onClick={() => setActief(i)}
                                            className="group text-left focus-visible:outline-none"
                                        >
                                            <span className={`block h-px overflow-hidden ${s.lijn}`}>
                                                {aan && (
                                                    <span
                                                        key={actief}
                                                        className={`block h-full ${s.vul}`}
                                                        onAnimationEnd={volgende}
                                                        style={rustig
                                                            ? { width: '100%' }
                                                            : { animation: `quote-progress ${DUUR}ms linear forwards`, animationPlayState: stil ? 'paused' : 'running' }}
                                                    />
                                                )}
                                            </span>
                                            <span className={`mt-3 block text-sm transition-colors duration-300 group-focus-visible:underline ${aan ? s.naamAan : s.naamUit}`}>
                                                {o.naam}
                                            </span>
                                        </button>
                                    );
                                })}
                                </div>
                                {meer && (
                                    <a
                                        href={`#${meer.naar}`}
                                        onClick={(e) => {
                                            const doel = document.getElementById(meer.naar);
                                            if (!doel) return;
                                            e.preventDefault();
                                            // Een trage, zachte rit naar beneden die net boven de sectie stopt
                                            if (rustig) doel.scrollIntoView({ block: 'start' });
                                            else gsap.to(window, { scrollTo: { y: doel, offsetY: 96, autoKill: true }, duration: 1.6, ease: 'power2.inOut' });
                                        }}
                                        className="group text-left focus-visible:outline-none"
                                    >
                                        <span className={`block h-px ${s.lijn}`} />
                                        <span className={`mt-3 inline-flex items-center gap-1.5 text-sm transition-colors duration-300 group-focus-visible:underline ${s.naamUit}`}>
                                            {meer.tekst}
                                            <ArrowDown size={14} strokeWidth={1.75} className="transition-transform duration-500 ease-out group-hover:translate-y-px" />
                                        </span>
                                    </a>
                                )}
                            </div>

                            {/* Kleine kanttekening: de visuals zijn voorbeelden, geen vast aanbod */}
                            {noot && <p className={`mt-6 text-[13px] italic leading-relaxed ${s.noot}`}>{noot}</p>}
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
