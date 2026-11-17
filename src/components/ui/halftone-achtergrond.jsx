import React from 'react';

// Achtergrond van puntjes over het volledige vlak, in het groen van de huisstijl. Allemaal even klein en
// doorzichtig, zonder lege plekken en zonder beweging. Twee rasters die een halve stap verspringen, zoals
// een drukraster. Enkel helemaal onderaan vloeit het zacht uit in de pagina, zodat er geen harde rand is.
// Vult de dichtstbijzijnde ouder met position: relative.

const KLEUR = 'rgba(98, 143, 105, 0.35)';
const AFSTAND = 10;      // px tussen twee puntjes in dezelfde rij
const STRAAL = 1.1;      // px

export default function HalftoneAchtergrond({ className = '' }) {
    const punt = `radial-gradient(circle, ${KLEUR} ${STRAAL}px, transparent ${STRAAL + 0.4}px)`;
    return (
        <div
            aria-hidden="true"
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{
                backgroundImage: `${punt}, ${punt}`,
                backgroundSize: `${AFSTAND}px ${AFSTAND}px`,
                backgroundPosition: `0 0, ${AFSTAND / 2}px ${AFSTAND / 2}px`,
                maskImage: 'linear-gradient(to bottom, black 85%, transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent)'
            }}
        />
    );
}
