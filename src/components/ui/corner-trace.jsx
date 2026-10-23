import React, { useEffect, useRef, useState } from 'react';

// L-lijn rond de hoek rechtsonder van een kaart, op een kleine afstand ervan.
// Start onderaan op 20% van links, loopt naar rechts, gaat rond de hoek en
// loopt omhoog tot 20% onder de bovenkant. Tekent zich uit bij hover op de
// ouder (die moet `group` en `relative` hebben) en trekt zich terug bij weggaan.
export default function CornerTrace({ radius = 24, gap = 8, start = 0.2 }) {
    const ref = useRef(null);
    const [size, setSize] = useState(null);

    useEffect(() => {
        const card = ref.current?.parentElement;
        if (!card) return;
        const measure = () => setSize({ w: card.offsetWidth, h: card.offsetHeight });
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(card);
        return () => ro.disconnect();
    }, []);

    let d = '';
    if (size) {
        const { w, h } = size;
        const r = radius + gap;
        const right = w + 2 * gap;
        const bottom = h + 2 * gap;
        d = `M ${gap + w * start} ${bottom} H ${right - r} A ${r} ${r} 0 0 0 ${right} ${bottom - r} V ${gap + h * start}`;
    }

    return (
        <svg
            ref={ref}
            aria-hidden="true"
            className="pointer-events-none absolute overflow-visible"
            style={{ top: -gap, left: -gap, width: `calc(100% + ${2 * gap}px)`, height: `calc(100% + ${2 * gap}px)` }}
        >
            {d && (
                <path
                    d={d}
                    pathLength="1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="1"
                    className="text-accent [stroke-dashoffset:1] group-hover:[stroke-dashoffset:0] transition-[stroke-dashoffset] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
                />
            )}
        </svg>
    );
}
