import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScreenMockup from './screen-mockup';
import BrowserWindow from './browser-window';
import SecondBrainDemo from './second-brain-demo';

gsap.registerPlugin(ScrollTrigger);

// "Probeer het zelf.": het klikbare tweede brein op een scherm dat bij het scrollen uit de wolk komt.
// Staat bewust niet meer op de pagina Tweede brein: bezoekers hebben genoeg aan de vergelijking en de
// impact. Bewaard om in een gesprek te tonen (Rian). Terugzetten kan door <TweedeBreinProbeer language={language} />
// op een pagina te zetten.

// De wolk over het scherm: een masker dat bovenaan helemaal zichtbaar is en naar onder en opzij zacht
// wegvloeit in het papier. --mist is de hoogte van de wolkenrand: klein = het scherm zit grotendeels in
// de wolk, groot = het scherm is volledig zichtbaar
const MIST_START = 55;
const MIST_END = 420;
const mistMask = 'radial-gradient(ellipse 140% var(--mist) at 50% 0%, #000 55%, transparent 100%)';

export default function TweedeBreinProbeer({ language }) {
    const nl = language === 'nl';
    const ref = useRef(null);

    // Bij het scrollen trekt de wolk zich rustig terug van het scherm, schuift het scherm een fractie op
    // en wordt het iets groter, en glijdt er één keer een lichtstreep over het glazen kader. Wie terug naar
    // boven scrolt, ziet het scherm weer in de wolk verdwijnen. Wie minder beweging vraagt, ziet meteen alles
    useLayoutEffect(() => {
        // De scrollpositie waarop het scherm op zijn grootst staat: zijn midden precies halfweg tussen de
        // onderkant van de navigatiebalk en de onderkant van het venster. offsetTop en offsetHeight negeren
        // transformaties, dus de verkleining tijdens de animatie telt niet mee
        const screenEnd = () => {
            const screen = ref.current.querySelector('.tb-screen');
            let top = 0;
            for (let el = screen; el; el = el.offsetParent) top += el.offsetTop;
            const pill = document.querySelector('nav')?.firstElementChild;
            const navBottom = pill ? pill.getBoundingClientRect().bottom : 0;
            const target = navBottom + (window.innerHeight - navBottom) / 2;
            return Math.max(0, top + screen.offsetHeight / 2 - target);
        };
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            gsap.timeline({ scrollTrigger: { trigger: '.tb-demo-head', start: 'top 80%', once: true } })
                .from('.tb-demo-title', { yPercent: 105, duration: 1.2, ease: 'power3.out' })
                .from('.tb-demo-sub', { y: 10, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0.3);

            const reveal = gsap.timeline({
                defaults: { ease: 'sine.inOut' },
                scrollTrigger: {
                    trigger: '.tb-screen-wrap',
                    start: 'top 95%',
                    end: screenEnd,
                    invalidateOnRefresh: true,
                    scrub: 0.8
                }
            });
            reveal.fromTo('.tb-screen-wrap', { '--mist': `${MIST_START}%` }, { '--mist': `${MIST_END}%`, duration: 1 }, 0)
                .fromTo('.tb-screen', { scale: 0.94, y: 24 }, { scale: 1, y: 0, duration: 1 }, 0)
                .fromTo('.sm-sheen-band', { left: '-50%' }, { left: '120%', duration: 0.7, ease: 'power1.inOut' }, 0.3);
        }, ref);
        return () => ctx.revert();
    }, [language]);

    return (
        <section ref={ref} className="px-6 md:px-16 lg:px-24 pt-8 md:pt-12 pb-24 md:pb-32">
            <div className="max-w-7xl mx-auto">
                <div className="tb-demo-head text-center">
                    <div className="overflow-hidden pb-3 mb-3">
                        <h2 className="tb-demo-title hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                            {nl ? 'Probeer het zelf.' : 'Try it yourself.'}
                        </h2>
                    </div>
                    <p className="tb-demo-sub text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        {nl
                            ? 'Dit is het tweede brein van Jan, verkoper bij Werkplek Pro. Klik door zijn notities, bekijk de verbanden, of stel Claude rechtsonder een vraag.'
                            : 'This is the second brain of Jan, a salesperson at Werkplek Pro. Click through his notes, explore the connections, or ask Claude something at the bottom right.'}
                    </p>
                </div>

                {/* Het masker zit op een omhulsel, zodat de wolk ook de rand van het scherm meeneemt.
                    Het omhulsel is rondom ruimer dan het scherm (met negatieve marges gecompenseerd),
                    zodat de schaduw nooit tegen de rand van het masker afgesneden wordt en er geen
                    lijn zichtbaar is. Zonder animatie staat --mist op het eindpunt en is alles zichtbaar */}
                <div
                    className="tb-screen-wrap mt-10 md:mt-14 -mx-6 px-6 md:-mx-12 md:px-12 pt-6 md:pt-12 -mb-24 pb-24"
                    style={{ '--mist': `${MIST_END}%`, WebkitMaskImage: mistMask, maskImage: mistMask }}
                >
                    <ScreenMockup className="tb-screen origin-top">
                        <BrowserWindow url="triacore.be/tweede-brein">
                            <SecondBrainDemo />
                        </BrowserWindow>
                    </ScreenMockup>
                </div>
            </div>
        </section>
    );
}
