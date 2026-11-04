import React, { Children, useRef, useState } from 'react';

// Kaarten op gsm: een rij van schermrand tot schermrand waar de bezoeker zelf door veegt. Elke veeg gaat één
// kaart verder en die klikt in het midden vast, met links en rechts een stukje van de buren. De rij beweegt
// nooit vanzelf en vervaagt niet, dus de kaart die je leest staat stil en is volledig scherp.
// De rij bepaalt de breedte van de kaarten en gaat ervan uit dat haar ouder 24px binnenmarge heeft (px-6).
export default function VeegRij({ children }) {
    const rijRef = useRef(null);
    const [actief, setActief] = useState(0);

    // De kaart waarvan het midden het dichtst bij het midden van de rij ligt, krijgt het volle bolletje
    const onScroll = () => {
        const el = rijRef.current;
        const midden = el.scrollLeft + el.clientWidth / 2;
        let beste = 0;
        let kleinste = Infinity;
        [...el.firstElementChild.children].forEach((kaart, i) => {
            const afstand = Math.abs(kaart.offsetLeft + kaart.offsetWidth / 2 - midden);
            if (afstand < kleinste) {
                kleinste = afstand;
                beste = i;
            }
        });
        setActief(beste);
    };

    return (
        <div style={{ '--veeg-kaart': 'clamp(260px, 75vw, 400px)' }}>
            {/* De kleine ruimte boven en onder (py-3, gecompenseerd met -my-3) geeft de L lijn rond de kaarten plaats */}
            <div
                ref={rijRef}
                onScroll={onScroll}
                className="no-scrollbar relative -mx-6 -my-3 py-3 overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory"
            >
                <div className="flex w-max gap-4 px-[calc(50vw-var(--veeg-kaart)/2)] [&>*]:shrink-0 [&>*]:w-[var(--veeg-kaart)] [&>*]:snap-center [&>*]:snap-always">
                    {children}
                </div>
            </div>
            <div className="mt-8 flex justify-center gap-2" aria-hidden="true">
                {Children.map(children, (_, i) => (
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === actief ? 'bg-foreground/60' : 'bg-foreground/15'}`} />
                ))}
            </div>
        </div>
    );
}
