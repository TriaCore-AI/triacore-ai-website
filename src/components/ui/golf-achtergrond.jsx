import React, { useEffect, useRef } from 'react';

// Golvend vlak van puntjes in perspectief als achtergrond (eerst in de hero van Oplossingen v2), naar een
// donker voorbeeld met een zee van stipjes, hier licht en in het groen. Een raster van punten ligt als een vloer
// onder een camera: vooraan grotere puntjes, naar de horizon toe kleiner en vager. Drie trage golven lopen
// erdoor, zodat het vlak rustig deint; op de golftoppen zijn de puntjes iets duidelijker.
// Getekend op een canvas, aan 30 beelden per seconde (de beweging is traag genoeg) en enkel zolang het in beeld
// is. Om vlot te blijven worden de puntjes per sterkte samen getekend, en de kleinste als vierkantjes.
// Wie minder beweging vraagt, ziet één stilstaand beeld. De vorige achtergrond met losse deeltjes staat in
// deeltjes-achtergrond.jsx.

const KLEUR = '98, 143, 105'; // accent #628f69
const X_BEREIK = 9;
const X_STAP = 0.08; // kleiner = dichter raster, maar meer werk per beeld (nu ongeveer 17.000 puntjes)
const Z_MIN = 1.1;
const Z_MAX = 15;
const Z_STAP = 0.13;
const CAMERA = 1; // hoogte van de camera boven het vlak
const HORIZON = 0.36; // waar de horizon ligt, als deel van de hoogte
const GOLF = 0.44; // grootste uitslag van de drie golven samen
const NIVEAUS = 14; // aantal sterktes waarin de puntjes samen getekend worden
const BEELD_MS = 1000 / 30;

function hoogte(x, z, t) {
    return 0.22 * Math.sin(x * 0.85 + t * 0.00032)
        + 0.16 * Math.sin(z * 0.65 - t * 0.00024 + x * 0.3)
        + 0.06 * Math.sin((x - z) * 1.5 + t * 0.00045);
}

export default function GolfAchtergrond({ className = '' }) {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let w = 0;
        let h = 0;
        let raf = 0;
        let vorige = 0;
        let inBeeld = true;

        const teken = (t) => {
            ctx.clearRect(0, 0, w, h);
            const f = Math.max(w, 900) * 0.55; // brandpunt in px
            const hor = h * HORIZON;
            const cx = w / 2;
            const grens = h * 0.24; // daarboven is alles weggemaskeerd
            const paden = Array.from({ length: NIVEAUS }, () => new Path2D());

            for (let z = Z_MAX; z >= Z_MIN; z -= Z_STAP) {
                const diepte = Math.pow(1 - (z - Z_MIN) / (Z_MAX - Z_MIN), 0.85);
                if (diepte < 0.02) continue;
                const schaal = f / z;
                if (hor + (CAMERA + GOLF) * schaal < grens) continue;
                const r = Math.max(0.4, 0.0045 * schaal);
                const klein = r < 1.1;
                for (let x = -X_BEREIK; x <= X_BEREIK; x += X_STAP) {
                    const sx = cx + x * schaal;
                    if (sx < -10 || sx > w + 10) continue;
                    const y = hoogte(x, z, t);
                    const sy = hor + (CAMERA - y) * schaal;
                    if (sy > h + 10 || sy < grens) continue;
                    const top = (y + GOLF) / (2 * GOLF);
                    const lx = sx / w - 0.18;
                    const ly = sy / h - 1;
                    const vlek = Math.exp(-(lx * lx + ly * ly) / 0.12);
                    const a = Math.min(0.75, diepte * (0.4 + 0.45 * top * top + 0.5 * vlek));
                    const niveau = Math.min(NIVEAUS - 1, Math.floor((a / 0.75) * NIVEAUS));
                    if (niveau < 1) continue;
                    const pad = paden[niveau];
                    if (klein) {
                        pad.rect(sx - r, sy - r * 0.6, r * 2, r * 1.2);
                    } else {
                        pad.moveTo(sx + r * 1.25, sy);
                        pad.ellipse(sx, sy, r * 1.25, r * 0.7, 0, 0, Math.PI * 2);
                    }
                }
            }

            for (let n = 1; n < NIVEAUS; n += 1) {
                ctx.fillStyle = `rgba(${KLEUR}, ${((n + 0.5) / NIVEAUS) * 0.75})`;
                ctx.fill(paden[n]);
            }
        };

        const stap = (tijd) => {
            raf = requestAnimationFrame(stap);
            if (tijd - vorige < BEELD_MS) return;
            vorige = tijd;
            teken(tijd);
        };
        const start = () => {
            if (rustig || raf || !inBeeld) return;
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
            if (nieuwW === w && nieuwH === h) return;
            w = nieuwW;
            h = nieuwH;
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            teken(rustig ? 20000 : performance.now());
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
                // Bovenaan lost het vlak op in de horizon, onderaan vloeit het uit in de volgende sectie
                maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 24%, #000 40%, #000 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 24%, #000 40%, #000 80%, transparent 100%)'
            }}
        />
    );
}
