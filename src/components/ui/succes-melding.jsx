import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Het venstertje na het versturen van een formulier (contact en workshopofferte): klein, in het midden van
// het scherm, met de bevestiging dat we ermee aan de slag gaan en binnen 24 uur antwoorden.
// Komt zacht op en verdwijnt weer zacht. Sluiten kan met de knop, een klik naast het venster of Escape.
export default function SuccesMelding({ open, onClose }) {
    const { language } = useLanguage();
    const nl = language === 'nl';
    const [actief, setActief] = useState(open);
    const [toon, setToon] = useState(false);
    const knopRef = useRef(null);

    // Openen: eerst in de pagina zetten, dan een beeld later laten opkomen. Sluiten: eerst vervagen, dan weg
    useEffect(() => {
        if (open) {
            setActief(true);
            const id = requestAnimationFrame(() => requestAnimationFrame(() => setToon(true)));
            return () => cancelAnimationFrame(id);
        }
        setToon(false);
        const t = setTimeout(() => setActief(false), 300);
        return () => clearTimeout(t);
    }, [open]);

    useEffect(() => {
        if (!toon) return undefined;
        knopRef.current?.focus({ preventScroll: true });
        const opToets = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', opToets);
        return () => document.removeEventListener('keydown', opToets);
    }, [toon, onClose]);

    if (!actief) return null;

    return createPortal(
        <div
            className={`fixed inset-0 z-[120] flex items-center justify-center p-6 bg-foreground/15 backdrop-blur-[2px] transition-opacity duration-300 ${toon ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="succes-titel"
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-sm rounded-3xl bg-white border border-foreground/[0.07] px-8 py-9 text-center transition-all duration-300 ease-out ${toon ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.98]'}`}
            >
                <span className="mx-auto w-12 h-12 rounded-full border border-accent/40 text-accent flex items-center justify-center">
                    <Check size={22} strokeWidth={1.75} />
                </span>
                <h3 id="succes-titel" className="mt-6 hero-title text-foreground text-3xl">
                    {nl ? 'Bedankt, we gaan ermee aan de slag.' : 'Thank you, we are on it.'}
                </h3>
                <p className="mt-3 text-[15px] text-foreground/60 leading-relaxed">
                    {nl
                        ? 'We hebben je aanvraag goed ontvangen. Je hoort binnen 24 uur van ons.'
                        : 'We have received your request. You will hear from us within 24 hours.'}
                </p>
                <button
                    ref={knopRef}
                    type="button"
                    onClick={onClose}
                    className="mt-7 px-5 py-2.5 max-xl:py-3 rounded-full border border-foreground/15 text-sm font-medium text-foreground/70 transition-colors duration-300 hover:border-foreground/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                    {nl ? 'Sluiten' : 'Close'}
                </button>
            </div>
        </div>,
        document.body
    );
}
