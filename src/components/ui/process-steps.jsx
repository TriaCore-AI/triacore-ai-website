import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Stappen van een traject. Op grotere schermen naast elkaar op één dunne lijn, met bij elke stap een
// klein groen streepje: bij het binnenscrollen tekent de lijn zich van links naar rechts en komt elke
// stap op zodra de lijn ze bereikt. Op gsm onder elkaar, met een dunne verticale lijn links van elke stap.
// De animatie speelt één keer; wie in het systeem minder beweging vraagt, krijgt alles meteen te zien.
export default function ProcessSteps({ steps }) {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const mm = gsap.matchMedia();
            mm.add('(min-width: 768px)', () => {
                const gap = 0.55;
                gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } })
                    .from('.ps-line', { scaleX: 0, duration: 2.4, ease: 'power2.inOut' })
                    .from('.ps-tick', { scaleY: 0, duration: 0.6, ease: 'power2.out', stagger: gap }, 0.15)
                    .from('.ps-content', { y: 16, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: gap }, 0.3);
            });
            mm.add('(max-width: 767px)', () => {
                gsap.utils.toArray('.ps-content').forEach((el) => {
                    gsap.from(el, { y: 16, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
                });
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} className="relative">
            <span aria-hidden="true" className="ps-line hidden md:block absolute inset-x-0 top-0 h-px bg-foreground/15 origin-left" />
            <ol className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 lg:gap-12">
                {steps.map((s, i) => (
                    <li key={s.word} className="relative pl-6 md:pl-0 md:pt-10">
                        <span aria-hidden="true" className="ps-tick hidden md:block absolute left-0 -top-1.5 h-3 w-px bg-accent" />
                        <span aria-hidden="true" className="md:hidden absolute left-0 top-1 bottom-1 w-px bg-foreground/15" />
                        <div className="ps-content">
                            <span className="block text-sm text-accent tabular-nums">/{String(i + 1).padStart(2, '0')}</span>
                            <h3 className="mt-3 text-3xl lg:text-4xl font-medium text-foreground leading-tight">{s.word}</h3>
                            <p className="mt-4 text-base text-foreground/60 leading-relaxed max-w-xs">{s.desc}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
