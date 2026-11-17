import React from 'react';
import glasDonker from '../../assets/oplossingen/hero-glas-donker.webp';
import ruimteLicht from '../../assets/oplossingen/hero-ruimte-licht.webp';
import panelenLicht from '../../assets/oplossingen/hero-panelen-licht.webp';
import lagenLicht from '../../assets/oplossingen/hero-lagen-licht.webp';
import korrel from '../../assets/oplossingen/korrel.png';

// Achtergronden voor de hero van Oplossingen (v2), oplossingen-hero.jsx. Elke achtergrond vult haar ouder
// volledig (absolute inset-0). De varianten naast elkaar bekijken: localhost/hero-varianten (enkel lokaal,
// HeroVarianten.jsx). Bij elke achtergrond hoort een toon voor de tekst erboven: "donker" (witte tekst) of
// "licht" (donkere tekst); die staat in de lijst op de testpagina en wordt aan de hero meegegeven.

// Fijne korrel als klein herhaald tegeltje, zodat de beelden zelf licht blijven
export function Korrel({ className = 'opacity-[0.16] mix-blend-overlay' }) {
    return <div aria-hidden="true" className={`absolute inset-0 ${className}`} style={{ backgroundImage: `url(${korrel})`, backgroundSize: '200px 200px' }} />;
}

// 1. Geribbeld glas, donker: diepgroene verticale banen met een schuine lichtstreep die per baan verspringt.
// Gemaakt met Herontwerp officieel/hero-glas/glas-render.cjs
export function GlasDonker() {
    return (
        <>
            <img src={glasDonker} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
            <Korrel />
        </>
    );
}

// 2. Lichte ruimte: een helder gewelf, een wand met scherpe lichtlijnen in een boog (het dal links van het
// midden, rechts hoger), een horizon en een glanzende vloer met een zwakke spiegeling, wit met een vleugje
// saliegroen. Gemaakt met Herontwerp officieel/hero-glas/ruimte-render.cjs
export function RuimteLicht() {
    return <img src={ruimteLicht} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />;
}

// 3. Panelenruimte: een lichte architectuurruimte met een achterwand vol panelen in verschillende maten (fijne
// witte voegen), glazen panelen aan de zijkanten, een tegelvloer in perspectief en zonlicht dat van links in
// banen over de vloer valt. Gemaakt met Herontwerp officieel/hero-glas/panelen-render.cjs
export function PanelenLicht() {
    return <img src={panelenLicht} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />;
}

// 4. Zijden lagen: grote, zachte lagen die als zijde over elkaar vallen, in bogen van linksboven naar
// rechtsonder over de volle breedte, elk met een scherpe witte rand en een zachte schaduw eronder.
// Gemaakt met Herontwerp officieel/hero-glas/lagen-render.cjs
// Op gsm zou "cover" op een smal, hoog scherm maar een smalle strook van het beeld tonen (te ver ingezoomd).
// Daarom staat het beeld daar bovenaan, 2,5 keer zo breed als het scherm, zodat je meer van de bogen ziet; de
// onderkant van het beeld vloeit zacht uit in de pagina
export function LagenLicht() {
    return (
        <img
            src={lagenLicht}
            alt=""
            aria-hidden="true"
            className="absolute max-md:left-1/2 max-md:top-0 max-md:w-[250%] max-md:max-w-none max-md:h-auto max-md:-translate-x-1/2 max-md:[mask-image:linear-gradient(to_bottom,#000_65%,transparent)] md:inset-0 md:w-full md:h-full md:object-cover"
        />
    );
}
