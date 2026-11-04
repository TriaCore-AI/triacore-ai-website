import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import VisualAchtergrond from './visual-achtergrond';
import copilotLogo from '../../assets/workshops/logos/copilot.png';
import claudeLogo from '../../assets/workshops/logos/claude.png';
import chatgptLogo from '../../assets/workshops/logos/chatgpt.png';

// Beeld bij "Iedereen doet zijn eigen ding": de logo's van Copilot, Claude en ChatGPT zweven los van elkaar
// boven een zacht groen vlak met een fijn raster dat in perspectief naar achteren wegloopt (VisualAchtergrond).
// Elk logo staat op een wit tegeltje met een echte dikte (een paar lagen erachter), licht gekanteld in 3D.
// De tegeltjes zweven traag op en neer en kantelen daarbij een fractie, elk in zijn eigen tempo, zodat ze
// nooit samen bewegen. Geen schaduw. Wie in het systeem minder beweging vraagt, ziet ze stilstaan.

// Plaats en breedte in procent van het vak (4:3), de kanteling in graden, en het tempo in seconden
const TEGELS = [
    { src: copilotLogo, alt: 'Microsoft Copilot', left: '13%', top: '15%', w: '25%', rx: 14, ry: 24, rz: -9, dur: 5.6, delay: 0 },
    { src: claudeLogo, alt: 'Claude', left: '61%', top: '11%', w: '27%', rx: 10, ry: -22, rz: 8, dur: 6.8, delay: -2.4 },
    { src: chatgptLogo, alt: 'ChatGPT', left: '41%', top: '51%', w: '23%', rx: 20, ry: 6, rz: -4, dur: 7.4, delay: -4.6 }
];

// Dikte van een tegeltje: lagen achter de voorkant, dieper is iets donkerder
const DIKTE = [2, 4, 6, 8];

export default function VisualTools() {
    const ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            gsap.utils.toArray('.vt-tegel').forEach((el, i) => {
                const t = TEGELS[i];
                gsap.set(el, { rotationX: t.rx, rotationY: t.ry, rotation: t.rz });
                if (still) return;
                gsap.to(el, {
                    y: -10,
                    rotationX: t.rx - 6,
                    rotationY: t.ry + (t.ry > 0 ? -8 : 8),
                    rotation: t.rz * 0.6,
                    duration: t.dur,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                    delay: t.delay
                });
            });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={ref} className="absolute inset-0 overflow-hidden">
            <VisualAchtergrond />

            <div className="absolute inset-0" style={{ perspective: '700px' }}>
                {TEGELS.map((t) => (
                    <div
                        key={t.alt}
                        className="vt-tegel absolute"
                        style={{ left: t.left, top: t.top, width: t.w, transformStyle: 'preserve-3d' }}
                    >
                        {DIKTE.map((z) => (
                            <span
                                key={z}
                                aria-hidden="true"
                                className="absolute inset-0 rounded-[24%]"
                                style={{ transform: `translateZ(-${z}px)`, background: z > 4 ? '#cdd9d0' : '#dde6df' }}
                            />
                        ))}
                        <div
                            className="relative aspect-square rounded-[24%] border border-foreground/[0.06] flex items-center justify-center"
                            style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f5f7f6 100%)' }}
                        >
                            <img src={t.src} alt={t.alt} draggable="false" className="w-[56%] h-[56%] object-contain select-none" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
