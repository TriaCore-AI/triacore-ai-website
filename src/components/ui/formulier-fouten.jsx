import React from 'react';

// Gedeeld door het contactformulier en het workshopformulier. De verstuurknop is altijd aan te klikken; ontbreekt
// er nog iets, dan zie je onder elk veld wat er nog moet gebeuren, krijgt dat veld een rode rand en springt de
// cursor naar het eerste veld dat nog niet klopt. Pas na een eerste poging tot versturen, zodat niemand al
// fouten ziet terwijl hij nog aan het invullen is; daarna verdwijnt een melding zodra het veld klopt.

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// Rode rand voor een veld met een fout, in plaats van de gewone grijze
export const foutRand = (fout) => (fout ? '!border-red-400 hover:!border-red-500 focus:!border-red-500' : '');

export function FoutTekst({ id, children }) {
    if (!children) return null;
    return <p id={id} className="mt-2 text-sm text-red-600" role="alert">{children}</p>;
}

// Zet de cursor op het eerste veld met een fout. De fouten zijn opgeslagen per id van het veld; volgorde is de
// lijst van die id's zoals ze op het scherm staan
export const naarEersteFout = (fouten, volgorde) => {
    const eerste = volgorde.find((id) => fouten[id]);
    if (!eerste) return;
    const el = document.getElementById(eerste);
    el?.focus({ preventScroll: true });
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
