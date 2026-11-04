import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// "Zo werkt het." op de pagina Tweede brein: in drie stappen hoe een tweede brein werkt, net genoeg om
// de demo eronder te snappen. Van uw kennis, via uw AI, naar AI die meewerkt.
// Een dunne lijn loopt door drie glazen bolletjes, zoals de stappen in het chatvenster van de demo: komt
// de sectie in beeld, dan tekent de lijn zich van links naar rechts en vult elk bolletje zich met groen
// wanneer de lijn het bereikt, en komt de stap eronder op. Op een gsm staan de stappen onder elkaar en
// loopt de lijn verticaal. Wie minder beweging vraagt, ziet meteen alles.

const stappen = {
    nl: [
        {
            title: 'Uw kennis op één plek',
            text: 'Klanten, prijzen, afspraken en werkwijzen staan geordend in gewone notities. We bouwen ze op uit de documenten en notities die er al zijn.'
        },
        {
            title: 'Verbonden met uw AI',
            text: 'Claude of ChatGPT krijgt toegang tot die notities, met duidelijke regels: waar alles staat, wat het mag aanpassen en hoe het met uw gegevens omgaat.'
        },
        {
            title: 'AI die meewerkt',
            text: 'U vraagt iets zoals u het aan een collega zou vragen. De AI zoekt zelf op wat het nodig heeft, en doet het zoals u het zou doen.'
        }
    ],
    en: [
        {
            title: 'Your knowledge in one place',
            text: 'Clients, prices, agreements and ways of working, organised in plain notes. We build them from the documents and notes you already have.'
        },
        {
            title: 'Connected to your AI',
            text: 'Claude or ChatGPT gets access to those notes, with clear rules: where everything is, what it may change and how it handles your data.'
        },
        {
            title: 'AI that works with you',
            text: 'You ask something the way you would ask a colleague. The AI looks up what it needs by itself, and does it the way you would.'
        }
    ]
};

// Hoe lang de lijn over alle drie de stappen doet; elk bolletje vult zich wanneer de lijn het bereikt
const DRAW = 2.2;

export default function TweedeBreinStappen({ language }) {
    const ref = useRef(null);
    const items = stappen[language];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            // Op de pagina Tweede brein zit deze sectie bij het laden onder een wolk die bij het scrollen
            // wegtrekt. De animatie start pas als er al wat gescrold is, ook als de sectie al hoog in
            // beeld staat, anders speelt ze onzichtbaar af onder de wolk
            const start = () => {
                const top = ref.current.getBoundingClientRect().top + window.scrollY;
                return Math.max(top - window.innerHeight * 0.64, window.innerHeight * 0.2);
            };
            const tl = gsap.timeline({
                paused: true,
                scrollTrigger: { start, once: true, invalidateOnRefresh: true }
            });
            tl.from('.ts-title', { yPercent: 105, duration: 1.2, ease: 'power3.out' })
                .from('.ts-line', { scaleX: 0, scaleY: 0, duration: DRAW, ease: 'power1.inOut' }, 0.4);
            // De lijn loopt van het eerste naar het laatste bolletje: die bereikt ze na 0, 1/2 en 2/2 van de tijd
            items.forEach((_, i) => {
                const at = 0.4 + (DRAW * i) / (items.length - 1);
                tl.from(`.ts-fill-${i}`, { scale: 0.3, opacity: 0, duration: 0.7, ease: 'power2.out' }, at)
                    .from(`.ts-step-${i}`, { y: 14, opacity: 0, duration: 1.1, ease: 'power2.out' }, at - 0.15);
            });
        }, ref);
        return () => ctx.revert();
    }, [language, items]);

    return (
        <section ref={ref} className="px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
            <div className="max-w-7xl mx-auto">
                <div className="overflow-hidden pb-3 mb-14 md:mb-20 text-center">
                    <h2 className="ts-title hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                        {language === 'nl' ? 'Zo werkt het.' : 'How it works.'}
                    </h2>
                </div>

                <ol className="relative grid gap-12 md:grid-cols-3 md:gap-[var(--gap)] md:[--gap:2.5rem] lg:[--gap:4rem] pl-10 md:pl-0">
                    {/* De lijn: op een gsm verticaal langs de bolletjes, vanaf md horizontaal erdoor.
                        Ze loopt van het midden van het eerste tot het midden van het laatste bolletje:
                        het midden van een kolom ligt op (breedte - 2 tussenruimtes) / 6 van de rand */}
                    <span aria-hidden="true" className="ts-line absolute left-[7px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-accent/60 to-accent/25 md:hidden" />
                    <span
                        aria-hidden="true"
                        className="ts-line hidden md:block absolute top-[7px] h-px origin-left bg-gradient-to-r from-accent/60 via-accent/40 to-accent/25"
                        style={{ left: 'calc((100% - 2 * var(--gap)) / 6)', right: 'calc((100% - 2 * var(--gap)) / 6)' }}
                    />
                    {items.map((s, i) => (
                        <li key={s.title} className="relative md:text-center md:flex md:flex-col md:items-center">
                            <Bead index={i} />
                            <div className={`ts-step-${i} md:mt-10`}>
                                <h3 className="text-xl md:text-2xl font-medium text-foreground">{s.title}</h3>
                                <p className="mt-3 text-base md:text-lg text-foreground/60 leading-relaxed max-w-sm md:mx-auto">{s.text}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

// Een glazen bolletje op de lijn, dat zich met groen vult (ts-fill-i) wanneer de lijn het bereikt
function Bead({ index }) {
    return (
        <span
            aria-hidden="true"
            className="absolute -left-10 top-[0.4rem] md:relative md:left-0 md:top-0 shrink-0 w-[15px] h-[15px] rounded-full bg-white/80 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.12),0_1px_3px_rgba(15,23,42,0.1)]"
        >
            <span
                className={`ts-fill-${index} absolute inset-0 rounded-full bg-accent shadow-[inset_0_0_0_1px_rgba(98,143,105,0.4),inset_0_-1px_2px_rgba(15,23,42,0.18),0_1px_5px_rgba(98,143,105,0.4)]`}
                style={{ backgroundImage: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0) 70%)' }}
            />
        </span>
    );
}
