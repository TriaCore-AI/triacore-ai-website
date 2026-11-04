import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// "Wat het u oplevert." op de pagina Tweede brein: vier kaarten in een raster, elk met een belofte, een klein
// fragment uit het werk dat de belofte concreet maakt, en één zin uitleg. Alle fragmenten gaan over dezelfde
// klant als de vergelijking erboven (Greenfield, een verzonnen logistiek bedrijf), zodat het één verhaal is.
// Ze komen uit het voorbeeld van de demo (src/data/tweede-brein-demo.js): klopt iets daar niet meer, pas dan
// beide aan. Dezelfde kaartstijl als de vergelijking, maar in rust: de kaarten komen op als ze in beeld
// schuiven, verder beweegt er niets. Wie minder beweging vraagt, ziet meteen alles.

const tekst = {
    nl: {
        title: 'Wat het u oplevert.',
        sub: 'Uw team werkt sneller en met minder fouten, en de kennis blijft in uw bedrijf.',
        punch: ['Uw AI hoeft niet slimmer te worden.', 'Ze moet u leren kennen.'],
        cards: [
            {
                title: 'Minder uitleggen, minder zoeken.',
                text: 'De tijd die vandaag naar opzoeken en context geven gaat, gaat naar het werk zelf.',
                question: 'Bereid mijn gesprek met Greenfield voor.',
                reply: 'Alles wat ik nodig heb, staat in uw tweede brein.'
            },
            {
                title: 'Het eerste werk ligt al klaar.',
                text: 'Een offerte, een gespreksvoorbereiding of een verslag begint niet meer op een leeg blad, maar bij een eerste versie die u alleen nog nakijkt.',
                doc: 'Voorbereiding Greenfield',
                status: 'Eerste versie',
                rows: [['Contactpersoon', 'Sarah Claes'], ['Beslissing', 'CFO, eind november'], ['Offerte', '€ 22.200']]
            },
            {
                title: 'Antwoorden waarop u kunt rekenen.',
                text: 'AI werkt met uw klanten, prijzen en afspraken, en toont waar ze die vandaan haalt. Zo ziet u meteen of het klopt.',
                answer: 'Greenfield is geen vaste klant: tot 5% korting mag u zelf geven. Daarboven beslist de manager.',
                file: 'Kennis/Kortingsregels.md'
            },
            {
                title: 'Kennis die blijft.',
                text: 'Wat een collega weet, vertrekt niet mee. Een nieuwe collega vindt het zelf terug, zonder het iedereen te moeten vragen.',
                note: 'Greenfield',
                body: 'Logistiek bedrijf met tachtig medewerkers. Sarah Claes beslist mee over de aankoop.',
                file: 'Dossiers/Klanten/Greenfield.md'
            }
        ]
    },
    en: {
        title: 'What it gives you.',
        sub: 'Your team works faster and makes fewer mistakes, and the knowledge stays in your business.',
        punch: ['Your AI does not need to get smarter.', 'It needs to get to know you.'],
        cards: [
            {
                title: 'Less explaining, less searching.',
                text: 'The time that now goes to looking things up and giving context goes to the work itself.',
                question: 'Prepare my meeting with Greenfield.',
                reply: 'Everything I need is in your second brain.'
            },
            {
                title: 'The first draft is already there.',
                text: 'A quote, a meeting briefing or meeting notes no longer start on a blank page, but with a first version you only need to review.',
                doc: 'Briefing Greenfield',
                status: 'First version',
                rows: [['Contact', 'Sarah Claes'], ['Decision', 'CFO, end of November'], ['Quote', '€ 22,200']]
            },
            {
                title: 'Answers you can rely on.',
                text: 'AI works with your clients, prices and agreements, and shows where it found them. So you can see right away whether it is correct.',
                answer: 'Greenfield is not a regular client: you can give up to 5% discount yourself. Above that, the manager decides.',
                file: 'Knowledge/Discount rules.md'
            },
            {
                title: 'Knowledge that stays.',
                text: 'What a colleague knows does not leave with them. A new colleague finds it without having to ask everyone.',
                note: 'Greenfield',
                body: 'Logistics company with eighty employees. Sarah Claes is involved in purchasing.',
                file: 'Records/Clients/Greenfield.md'
            }
        ]
    }
};

export default function TweedeBreinImpact({ language }) {
    const ref = useRef(null);
    const tx = tekst[language];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            // De rechterkaart van een rij komt een fractie later dan de linker
            gsap.utils.toArray('.imp-card').forEach((card, i) => {
                gsap.from(card, {
                    y: 24, opacity: 0, duration: 1.2, ease: 'power3.out', delay: (i % 2) * 0.12,
                    scrollTrigger: { trigger: card, start: 'top 88%', once: true }
                });
            });
            // De slotzin: regel per regel omhoog uit een masker, zoals de koppen op de homepage
            gsap.from('.imp-punch-line', {
                yPercent: 110, duration: 1.3, ease: 'power3.out', stagger: 0.2,
                scrollTrigger: { trigger: '.imp-punch', start: 'top 85%', once: true }
            });
        }, ref);
        return () => ctx.revert();
    }, [language]);

    const [uitleg, eersteWerk, antwoord, kennis] = tx.cards;

    return (
        <section id="oplevert" ref={ref} className="px-6 md:px-16 lg:px-24 pb-24 md:pb-32">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14 md:mb-20">
                    <h2 className="hero-title text-foreground text-4xl md:text-5xl lg:text-6xl pb-3 mb-3">{tx.title}</h2>
                    <p className="text-foreground/60 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">{tx.sub}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
                    <Card card={uitleg}>
                        <div className="flex justify-end">
                            <p className="max-w-[90%] rounded-2xl rounded-br-md bg-foreground/[0.05] px-4 py-2 text-[15px] text-foreground/85">{uitleg.question}</p>
                        </div>
                        <p className="mt-4 flex items-start gap-2.5 text-[15px] leading-relaxed text-foreground/75">
                            <img src="/logo/claude.svg" alt="" className="w-4 h-4 mt-1 shrink-0" />
                            {uitleg.reply}
                        </p>
                    </Card>

                    <Card card={eersteWerk}>
                        <div className="flex items-baseline justify-between gap-4">
                            <p className="text-[15px] font-medium text-foreground">{eersteWerk.doc}</p>
                            <p className="shrink-0 text-[13px] text-foreground/45">{eersteWerk.status}</p>
                        </div>
                        <div className="mt-3 text-[14px]">
                            {eersteWerk.rows.map(([k, v]) => (
                                <div key={k} className="flex justify-between gap-4 py-2 border-t border-foreground/[0.06]">
                                    <span className="text-foreground/55">{k}</span>
                                    <span className="text-foreground/85 tabular-nums">{v}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card card={antwoord}>
                        <p className="flex items-start gap-2.5 text-[15px] leading-relaxed text-foreground/75">
                            <img src="/logo/claude.svg" alt="" className="w-4 h-4 mt-1 shrink-0" />
                            {antwoord.answer}
                        </p>
                        <FilePath>{antwoord.file}</FilePath>
                    </Card>

                    <Card card={kennis}>
                        <p className="text-[15px] font-medium text-foreground">{kennis.note}</p>
                        <p className="mt-1.5 text-[15px] leading-relaxed text-foreground/70">{kennis.body}</p>
                        <FilePath>{kennis.file}</FilePath>
                    </Card>
                </div>

                {/* De slotzin, in het groot. De tweede regel schuin en groen, zoals de titel op de homepage */}
                <p className="imp-punch hero-title mt-24 md:mt-36 text-center text-balance text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]">
                    {/* De ruimte rond elke regel houdt de staarten en de schuine letters binnen het masker */}
                    <span className="block overflow-hidden px-2 pb-[0.14em]">
                        <span className="imp-punch-line block">{tx.punch[0]}</span>
                    </span>
                    <span className="block overflow-hidden px-2 pb-[0.14em]">
                        <span className="imp-punch-line block italic text-accent">{tx.punch[1]}</span>
                    </span>
                </p>
            </div>
        </section>
    );
}

// Een kaart met dezelfde opbouw als de vergelijking erboven: de titel, het fragment in een wit vlak, en de
// omschrijving eronder. De witte vlakken zijn allemaal even hoog (de hoogte van het fragment met de
// voorbereiding, het langste). Enkel als een fragment op een smal scherm meer plaats nodig heeft, groeit het.
// Vanaf md delen de kaarten in een rij hun rijen (subgrid): is een titel twee regels lang, dan blijven de
// witte vlakken en de omschrijvingen naast elkaar toch op dezelfde lijn staan
function Card({ card, children }) {
    return (
        <div className="imp-card flex flex-col md:grid md:grid-rows-subgrid md:row-span-3 md:gap-y-0 rounded-[1.75rem] p-3 md:p-4 bg-foreground/[0.035] border border-foreground/[0.06]">
            <h3 className="px-3 pt-3 pb-4 md:px-4 md:pt-4 md:pb-5 text-2xl font-medium text-foreground leading-tight">{card.title}</h3>
            <div className="flex flex-col justify-center min-h-56 lg:min-h-0 lg:h-52 rounded-[1.25rem] p-5 md:p-6 bg-white border border-foreground/[0.05] shadow-[0_12px_30px_-22px_rgba(15,23,42,0.2)]">
                {children}
            </div>
            <p className="px-3 pt-4 pb-3 md:px-4 md:pt-5 md:pb-4 text-base md:text-lg text-foreground/60 leading-relaxed">{card.text}</p>
        </div>
    );
}

// Waar de informatie vandaan komt, als bestandspad op een klein glazen label
function FilePath({ children }) {
    return (
        <p className="mt-4 self-start max-w-full truncate rounded-md px-2 py-0.5 font-mono text-[12px] tracking-tight text-foreground/55 bg-gradient-to-b from-white to-white/60 shadow-[inset_0_1px_0_#fff,0_0_0_1px_rgba(15,23,42,0.07),0_2px_6px_-3px_rgba(15,23,42,0.18)]">
            {children}
        </p>
    );
}
