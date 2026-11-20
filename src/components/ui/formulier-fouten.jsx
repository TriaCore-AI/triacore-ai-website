import React from 'react';
import { emailVoorstel } from './formulier-controle';

// De schermonderdelen bij de controle van het contactformulier en het workshopformulier. Hoe de controle werkt,
// staat in formulier-controle.js.

export function FoutTekst({ id, children }) {
    if (!children) return null;
    return <p id={id} className="mt-2 text-sm text-red-600" role="alert">{children}</p>;
}

// Onder het e-mailveld: "Bedoel je ...?", met een knop om de verbetering over te nemen. Geen fout, enkel een hint
export function EmailVoorstel({ waarde, onKies, nl }) {
    const voorstel = emailVoorstel(waarde);
    if (!voorstel) return null;
    return (
        <p className="mt-2 text-sm text-foreground/70">
            {nl ? 'Bedoel je ' : 'Did you mean '}
            <button type="button" onClick={() => onKies(voorstel)} className="font-medium text-accent underline underline-offset-2 hover:text-foreground transition-colors">
                {voorstel}
            </button>
            ?
        </p>
    );
}

// Naast de verstuurknop: hoeveel velden nog aandacht vragen
export function FoutenSamenvatting({ aantal, nl }) {
    if (!aantal) return null;
    const tekst = nl
        ? `Nog ${aantal} ${aantal === 1 ? 'veld' : 'velden'} aan te vullen of te verbeteren.`
        : `${aantal} ${aantal === 1 ? 'field still needs' : 'fields still need'} your attention.`;
    return <p className="text-sm text-red-600" role="status">{tekst}</p>;
}
