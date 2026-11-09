import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import CTAButton from '../ui/cta-button';
import CornerTrace from '../ui/corner-trace';
import { useLanguage } from '../../context/LanguageContext';
import zaalFoto from '../../assets/workshops/box-vlaanderen-zaal.jpg';
import slideFoto from '../../assets/workshops/box-vlaanderen-slide.jpg';
import sprekerFoto from '../../assets/workshops/box-vlaanderen-spreker.jpg';

// De hero van de workshoppagina: links de titel, één zin en één knop, rechts drie echte foto's van een
// workshop (The Box Vlaanderen, Hasselt) in één blok. De liggende zaalfoto staat bovenaan; de twee staande
// foto's staan eronder: de linker valt met een stuk over de hoek linksonder, de rechter staat lager en valt
// maar een randje over de zaalfoto en over de linker. Een smalle rand in de kleur van de achtergrond houdt
// ze uit elkaar, zonder schaduw.
// Bij het laden veegt de titel binnen zoals in PageHeader en komt de tekst zacht op; de foto's onthullen
// zich na elkaar van onder naar boven en zoomen licht uit. Start pas als de lettertypes geladen zijn.
// De foto's staan in grijstinten en lichten om de beurt rustig op: in kleur, met de L lijn errond. Hover
// over een foto neemt het over; bij weggaan loopt de volgorde verder met de foto erna.

// Hoe lang een foto oplicht, hoe lang het daarna rustig blijft, en wanneer de eerste oplicht (tijdens de intro,
// zodra de zaalfoto zo goed als open is), in ms
const AAN = 3500;
const RUST = 2200;
const START = 1200;
const AANTAL = 3;

// Eén foto. De L lijn van CornerTrace reageert normaal op hover; hier zetten we ze vanuit `on`, zodat
// ze ook oplicht als de beurt automatisch aan deze foto is. Kleur en lijn lopen samen, in hetzelfde
// trage tempo en met dezelfde zachte S curve. `spiegel` tekent de L linksonder in plaats
// van rechtsonder, voor een foto waarvan de rechterkant achter een andere foto valt
function Foto({ src, alt, position = '', staand, spiegel, on, onEnter, onLeave, className }) {
    return (
        <div
            onPointerEnter={(e) => e.pointerType === 'mouse' && onEnter()}
            onPointerLeave={(e) => e.pointerType === 'mouse' && onLeave()}
            className={`absolute [&>svg_path]:duration-[1600ms] ${className} ${on ? '[&>svg_path]:[stroke-dashoffset:0]' : ''} ${spiegel ? '[&>svg]:[transform:scaleX(-1)]' : ''}`}
        >
            <div
                className={staand ? 'wh-reveal wh-frame bg-grain p-1.5 rounded-[30px]' : 'wh-reveal'}
                data-radius={staand ? 30 : 24}
            >
                <div className={`${staand ? 'aspect-[4/5]' : 'aspect-[16/9]'} rounded-3xl overflow-hidden bg-foreground/5`}>
                    <div className="wh-zoom w-full h-full">
                        <img
                            src={src}
                            alt={alt}
                            className={`w-full h-full object-cover transition duration-[1600ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${on ? 'grayscale-0 scale-[1.03]' : 'grayscale'} ${position}`}
                        />
                    </div>
                </div>
            </div>
            <CornerTrace radius={staand ? 30 : 24} />
        </div>
    );
}

export default function WorkshopsHero() {
    const { language } = useLanguage();
    const nl = language === 'nl';
    const ref = useRef(null);

    // Welke foto oplicht: de foto onder de muis gaat voor, anders die van de automatische beurt
    const [hover, setHover] = useState(null);
    const [beurt, setBeurt] = useState(null);
    const volgende = useRef(0);
    const geladen = useRef(Date.now());
    const actief = hover ?? beurt;

    // De automatische beurt: oplichten, rusten, de volgende. Staat stil zolang er een foto onder de muis is.
    // Wie in het systeem minder beweging vraagt, krijgt enkel het oplichten bij hover
    useEffect(() => {
        if (hover !== null) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let t;
        const licht = () => {
            setBeurt(volgende.current);
            t = setTimeout(() => {
                setBeurt(null);
                volgende.current = (volgende.current + 1) % AANTAL;
                t = setTimeout(licht, RUST);
            }, AAN);
        };
        const verstreken = Date.now() - geladen.current;
        t = setTimeout(licht, verstreken < START ? START - verstreken : RUST);
        return () => clearTimeout(t);
    }, [hover]);

    const enter = (i) => {
        setBeurt(null);
        setHover(i);
    };
    const leave = (i) => {
        volgende.current = (i + 1) % AANTAL;
        setHover(null);
    };

    // De rand rond de staande foto's toont exact het verloop van de pagina op die hoogte, zodat ze leest
    // als een uitsparing in de zaalfoto en niet als een lijstje
    useEffect(() => {
        const frames = [...ref.current.querySelectorAll('.wh-frame')];
        const page = ref.current.closest('.bg-grain');
        if (!frames.length || !page) return;
        const align = () => {
            const pageTop = page.getBoundingClientRect().top;
            frames.forEach((f) => {
                f.style.backgroundPosition = `0 ${pageTop - f.getBoundingClientRect().top}px`;
            });
        };
        align();
        const ro = new ResizeObserver(align);
        ro.observe(page);
        window.addEventListener('resize', align);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', align);
        };
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const tl = gsap.timeline({ paused: true });
            tl.fromTo('.wh-title',
                { clipPath: 'inset(-20% 100% -35% -5%)', x: -16 },
                { clipPath: 'inset(-20% -5% -35% -5%)', x: 0, duration: 1.8, ease: 'power2.inOut', clearProps: 'clipPath' })
                .from('.wh-fade', { y: 10, opacity: 0, duration: 1.4, ease: 'power2.out', stagger: 0.12 }, 1.1);
            gsap.utils.toArray('.wh-reveal').forEach((el, i) => {
                const r = el.dataset.radius;
                const at = 0.1 + i * 0.2;
                tl.fromTo(el,
                    { clipPath: `inset(100% 0% 0% 0% round ${r}px)` },
                    { clipPath: `inset(0% 0% 0% 0% round ${r}px)`, duration: 1.5, ease: 'power4.inOut', clearProps: 'clipPath' }, at)
                    .from(el.querySelector('.wh-zoom'), { scale: 1.25, duration: 2.2, ease: 'expo.out' }, at);
            });
            const play = () => tl.play();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
            else play();
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={ref} id="workshops" className="px-6 md:px-16 lg:px-24 pt-40 md:pt-48 pb-20 md:pb-28">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[10fr_12fr] gap-14 lg:gap-20 items-center">
                <div>
                    <h1 className="wh-title hero-title text-foreground text-5xl sm:text-6xl md:text-7xl xl:text-[7.5rem] leading-[1.02]">
                        Workshops
                    </h1>
                    <p className="wh-fade mt-8 md:mt-10 text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-xl">
                        {nl
                            ? 'Jouw team leert zelf werken met AI. Praktisch, op maat van je sector en met voorbeelden uit het eigen werk.'
                            : 'Your team learns to work with AI themselves. Practical, tailored to your sector and with examples from their own work.'}
                    </p>
                    <div className="wh-fade mt-10 md:mt-12 flex">
                        <CTAButton to="/contact" size="md">
                            {nl ? 'Plan een workshop' : 'Plan a workshop'}
                        </CTAButton>
                    </div>
                </div>

                {/* Eén blok. De maten hangen samen, alles in verhouding tot de breedte W van dit vak (hoogte 0,905 W):
                    zaalfoto bovenaan rechts, 88% breed in 16:9, dus van 12% tot 100% en onderkant op 0,495 W.
                    Staand links: 36% breed in 4:5 (hoogte 0,45 W), van 6% tot 42% en van 0,37 W tot 0,82 W; valt met
                    een stuk over de hoek linksonder van de zaalfoto (12% tot 42%, 0,125 W hoog). Zijn L staat
                    gespiegeld, linksonder, want zijn rechterkant valt achter de rechter foto.
                    Staand rechts: 36% breed, van 39% tot 75%, onderaan (vanaf 0,455 W); valt 0,04 W over de zaalfoto
                    en 3% over de linker. Hoe verder naar rechts, hoe hoger in de stapel */}
                <div className="relative w-full aspect-[100/90.5]">
                    <Foto
                        src={zaalFoto}
                        alt={nl ? 'Een workshop van TriaCore AI voor The Box Vlaanderen in Hasselt' : 'A TriaCore AI workshop for The Box Vlaanderen in Hasselt'}
                        on={actief === 0}
                        onEnter={() => enter(0)}
                        onLeave={() => leave(0)}
                        className="top-0 right-0 w-[88%]"
                    />
                    <Foto
                        staand
                        spiegel
                        src={slideFoto}
                        alt={nl ? 'Lucas Curto bij de slide "AI voor je winkel"' : 'Lucas Curto at the slide "AI voor je winkel"'}
                        position="object-[50%_55%]"
                        on={actief === 1}
                        onEnter={() => enter(1)}
                        onLeave={() => leave(1)}
                        className="z-10 w-[36%] left-[6%] top-[41%]"
                    />
                    <Foto
                        staand
                        src={sprekerFoto}
                        alt={nl ? 'Lucas Curto aan het woord tijdens de workshop' : 'Lucas Curto speaking during the workshop'}
                        position="object-[50%_42%]"
                        on={actief === 2}
                        onEnter={() => enter(2)}
                        onLeave={() => leave(2)}
                        className="z-20 w-[36%] left-[39%] bottom-0"
                    />
                </div>
            </div>
        </section>
    );
}
