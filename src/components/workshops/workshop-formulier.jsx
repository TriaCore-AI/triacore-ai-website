import React, { useState } from 'react';
import CTAButton from '../ui/cta-button';
import { useLanguage } from '../../context/LanguageContext';

// Het formulier om een workshop-offerte aan te vragen. Staat op de workshoppagina (workshops-offerte.jsx) en op
// de contactpagina als iemand "Workshop" kiest (contact-form.jsx), zodat het overal hetzelfde is.
// De ouder houdt de gegevens bij (data, setData) en toont zelf het bedankbericht (onSucces).
// Verstuurt naar het bestaande Netlify-formulier "contact" (zodat index.html niet aangepast moet worden),
// met als onderwerp "Workshop". Aantal personen en locatie komen in het berichtveld, altijd in het
// Nederlands, zodat elke aanvraag in dezelfde inbox herkenbaar binnenkomt.
const LOCATIES = [
    { value: 'Ja', nl: 'Ja, bij ons', en: 'Yes, at our premises' },
    { value: 'Liever elders', nl: 'Liever elders', en: 'Preferably elsewhere' },
    { value: 'Weet ik nog niet', nl: 'Weet ik nog niet', en: 'Not sure yet' }
];

const fieldClass = 'w-full bg-white border border-foreground/10 rounded-2xl px-5 py-3.5 text-foreground placeholder:text-foreground/35 outline-none transition-colors duration-300 hover:border-foreground/20 focus:border-foreground/40';
const labelClass = 'block mb-2 text-sm text-foreground/60';

export const LEEG_WORKSHOP = { company: '', name: '', email: '', phone: '', aantal: '', locatie: '' };

export default function WorkshopFormulier({ data, setData, onSucces }) {
    const { language } = useLanguage();
    const nl = language === 'nl';
    const [status, setStatus] = useState('idle'); // idle, loading, error

    const geldig = data.company && data.name && data.email;

    const wijzig = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const verstuur = async (e) => {
        e.preventDefault();
        if (!geldig) return;
        setStatus('loading');
        // Lokaal (npm run dev) bestaat Netlify Forms niet: daar doen we alsof het lukte, zodat je het
        // bevestigingsvenster kan bekijken. Er wordt dan niets verstuurd
        if (import.meta.env.DEV) {
            setStatus('idle');
            onSucces();
            return;
        }
        const message = [
            'Offerteaanvraag workshop',
            `Aantal personen: ${data.aantal || 'niet ingevuld'}`,
            `Op locatie bij de klant: ${data.locatie || 'niet ingevuld'}`
        ].join('\n');
        try {
            const res = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'form-name': 'contact',
                    name: data.name,
                    company: data.company,
                    email: data.email,
                    phone: data.phone,
                    topic: 'Workshop',
                    message
                }).toString()
            });
            if (res.ok) {
                setStatus('idle');
                onSucces();
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <form onSubmit={verstuur} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="wo-company" className={labelClass}>{nl ? 'Bedrijfsnaam *' : 'Company name *'}</label>
                    <input required id="wo-company" name="company" type="text" autoComplete="organization" value={data.company} onChange={wijzig} className={fieldClass} placeholder={nl ? 'Bedrijfsnaam' : 'Company name'} />
                </div>
                <div>
                    <label htmlFor="wo-name" className={labelClass}>{nl ? 'Naam *' : 'Name *'}</label>
                    <input required id="wo-name" name="name" type="text" autoComplete="name" value={data.name} onChange={wijzig} className={fieldClass} placeholder={nl ? 'Voor- en achternaam' : 'First and last name'} />
                </div>
                <div>
                    <label htmlFor="wo-email" className={labelClass}>{nl ? 'E-mail *' : 'Email *'}</label>
                    <input required id="wo-email" name="email" type="email" autoComplete="email" value={data.email} onChange={wijzig} className={fieldClass} placeholder={nl ? 'naam@bedrijf.be' : 'name@company.com'} />
                </div>
                <div>
                    <label htmlFor="wo-phone" className={labelClass}>{nl ? 'Telefoon' : 'Phone'}</label>
                    <input id="wo-phone" name="phone" type="tel" autoComplete="tel" value={data.phone} onChange={wijzig} className={fieldClass} placeholder={nl ? 'Telefoonnummer' : 'Phone number'} />
                </div>
                <div>
                    <label htmlFor="wo-aantal" className={labelClass}>{nl ? 'Aantal personen' : 'Number of people'}</label>
                    <input id="wo-aantal" name="aantal" type="number" min="1" inputMode="numeric" value={data.aantal} onChange={wijzig} className={fieldClass} placeholder={nl ? 'bv. 12' : 'e.g. 12'} />
                </div>
            </div>

            <div>
                <p className={labelClass}>{nl ? 'Workshop op jouw locatie?' : 'Workshop at your location?'}</p>
                {/* Onder 1280 px zijn de knoppen iets hoger: een tikdoel van 44 px op gsm en tablet */}
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={nl ? 'Workshop op jouw locatie?' : 'Workshop at your location?'}>
                    {LOCATIES.map((l) => {
                        const on = data.locatie === l.value;
                        return (
                            <button
                                key={l.value}
                                type="button"
                                role="radio"
                                aria-checked={on}
                                onClick={() => setData((prev) => ({ ...prev, locatie: on ? '' : l.value }))}
                                className={`px-4 py-2 max-xl:py-3 rounded-full border text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${on ? 'bg-foreground border-foreground text-background' : 'bg-transparent border-foreground/15 text-foreground/70 hover:border-foreground/40 hover:text-foreground'}`}
                            >
                                {l[language]}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-5 mt-2">
                <CTAButton type="submit" disabled={!geldig || status === 'loading'} className="w-full md:w-auto">
                    {status === 'loading' ? (nl ? 'Even geduld...' : 'One moment...') : (nl ? 'Vraag een offerte aan' : 'Request a quote')}
                </CTAButton>
                {status === 'error' && (
                    <p className="text-sm text-red-600">
                        {nl ? 'Er ging iets mis. Probeer opnieuw of mail naar' : 'Something went wrong. Try again or email'} <a href="mailto:info@triacore.be" className="underline">info@triacore.be</a>.
                    </p>
                )}
            </div>
        </form>
    );
}
