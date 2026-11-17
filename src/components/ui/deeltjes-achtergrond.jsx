import React, { useEffect, useRef } from 'react';

// Rustige deeltjes als achtergrond (eerst in de hero van Oplossingen v2). Kleine puntjes over de volle breedte,
// meest in het groen en enkele in het donkerblauw, die elk op hun eigen trage ritme zacht oplichten en weer
// vervagen, en heel langzaam naar boven drijven. Boven- en onderaan vloeien ze uit in de pagina.
// Ze tekenen op een canvas en lopen enkel zolang de achtergrond in beeld is. Wie minder beweging vraagt, ziet
// een stilstaand, zwak patroon.

const KLEUREN = { groen: '98, 143, 105', donker: '15, 23, 42' };
const DICHTHEID = 6500; // px² per deeltje: hoe hoger, hoe minder deeltjes

function maakDeeltjes(w, h) {
    const n = Math.round((w * h) / DICHTHEID);
    return Array.from({ length: n }, () => {
        const groen = Math.random() < 0.7;
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            r: 0.7 + Math.random() * 1.1,
            kleur: groen ? KLEUREN.groen : KLEUREN.donker,
            max: groen ? 0.3 + Math.random() * 0.45 : 0.12 + Math.random() * 0.2,
            periode: 5000 + Math.random() * 9000, // ms voor één keer oplichten en vervagen
            fase: Math.random() * Math.PI * 2,
            dx: (Math.random() - 0.5) * 0.004, // px per ms
            dy: -(0.002 + Math.random() * 0.005)
        };
    });
}

export default function DeeltjesAchtergrond({ className = '' }) {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let w = 0;
        let h = 0;
        let deeltjes = [];
        let raf = 0;
        let vorige = 0;
        let inBeeld = true;

        const teken = (t) => {
            ctx.clearRect(0, 0, w, h);
            for (const p of deeltjes) {
                // Het grootste deel van de tijd bijna onzichtbaar, dan zacht oplichten en weer uitdoven
                const golf = rustig ? 0.5 : Math.max(0, Math.sin((t / p.periode) * Math.PI * 2 + p.fase));
                const a = p.max * golf * golf;
                if (a < 0.01) continue;
                ctx.fillStyle = `rgba(${p.kleur}, ${a * 0.18})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = `rgba(${p.kleur}, ${a})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        const stap = (t) => {
            const dt = vorige ? Math.min(t - vorige, 50) : 16;
            vorige = t;
            for (const p of deeltjes) {
                p.x += p.dx * dt;
                p.y += p.dy * dt;
                if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
                if (p.x < -6) p.x = w + 6;
                else if (p.x > w + 6) p.x = -6;
            }
            teken(t);
            raf = requestAnimationFrame(stap);
        };

        const start = () => {
            if (rustig || raf || !inBeeld) return;
            vorige = 0;
            raf = requestAnimationFrame(stap);
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };

        const maat = () => {
            const box = canvas.getBoundingClientRect();
            const nieuwW = Math.round(box.width);
            const nieuwH = Math.round(box.height);
            // Op gsm verandert de hoogte bij het scrollen (adresbalk): enkel bij een echte wijziging opnieuw verdelen
            if (nieuwW === w && Math.abs(nieuwH - h) < 80) return;
            w = nieuwW;
            h = nieuwH;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            deeltjes = maakDeeltjes(w, h);
            if (rustig) teken(0);
        };

        maat();
        const ro = new ResizeObserver(maat);
        ro.observe(canvas);
        const io = new IntersectionObserver(([e]) => {
            inBeeld = e.isIntersecting;
            if (inBeeld) start();
            else stop();
        });
        io.observe(canvas);
        start();

        return () => {
            stop();
            ro.disconnect();
            io.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={ref}
            aria-hidden="true"
            className={`pointer-events-none ${className}`}
            style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, #000 18%, #000 72%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 18%, #000 72%, transparent 100%)'
            }}
        />
    );
}
