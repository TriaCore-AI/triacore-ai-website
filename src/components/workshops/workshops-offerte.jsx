import React, { useState } from 'react';
import { Check } from 'lucide-react';
import CTAButton from '../ui/cta-button';
import { AutoImage } from '../ui/auto-image';
import { useLanguage } from '../../context/LanguageContext';

// De afsluiter van de workshoppagina: links de oproep en Rian als aanspreekpunt, rechts meteen een kort
// formulier om een offerte aan te vragen. Zelfde stijl als het contactformulier: witte velden, de keuze
// voor de locatie als knoppen, één primaire knop.
// Verstuurt naar het bestaande Netlify-formulier "contact" (zodat index.html niet aangepast moet worden),
// met als onderwerp "Workshop". Aantal personen en locatie komen in het berichtveld, altijd in het
// Nederlands, zodat elke aanvraag in dezelfde inbox herkenbaar binnenkomt.
const LOCATIES = [
    { value: 'Ja', nl: 'Ja, bij ons', en: 'Yes, at our place' },
    { value: 'Liever elders', nl: 'Liever elders', en: 'Rather elsewhere' },
    { value: 'Weet ik nog niet', nl: 'Weet ik nog niet', en: 'Not sure yet' }
];

const fieldClass = 'w-full bg-white border border-foreground/10 rounded-2xl px-5 py-3.5 text-foreground placeholder:text-foreground/35 outline-none transition-colors duration-300 hover:border-foreground/20 focus:border-foreground/40';
const labelClass = 'block mb-2 text-sm text-foreground/60';

const leeg = { company: '', name: '', email: '', phone: '', aantal: '', locatie: '' };

export default function WorkshopsOfferte() {
    const { language } = useLanguage();
    const nl = language === 'nl';
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [data, setData] = useState(leeg);

    const geldig = data.company && data.name && data.email;

    const wijzig = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const verstuur = async (e) => {
        e.preventDefault();
        if (!geldig) return;
        setStatus('loading');
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
                setStatus('success');
                setData(leeg);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <section id="offerte" className="px-6 md:px-16 lg:px-24 pt-16 md:pt-24 pb-24 md:pb-32">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">
                <div data-reveal className="lg:col-span-5">
                    <div className="overflow-hidden pb-3 mb-3">
                        <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                            {nl ? 'Een workshop voor uw team?' : 'A workshop for your team?'}
                        </h2>
                    </div>
                    <p className="rv-fade text-foreground/60 text-lg md:text-xl leading-relaxed max-w-md">
                        {nl
                            ? 'Laat uw gegevens achter en we bezorgen u een offerte op maat. We nemen binnen 24 uur contact met u op.'
                            : 'Leave your details and we will send you a tailored quote. We will get back to you within 24 hours.'}
                    </p>
                    <div className="rv-fade mt-12 inline-flex items-center gap-4">
                        <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden bg-foreground/5">
                            <AutoImage basePath="/team/rian" alt="Rian Mathijs" className="w-full h-full object-cover grayscale" />
                        </div>
                        <div>
                            <p className="text-base font-medium text-foreground leading-tight">
                                Rian Mathijs <span className="font-normal text-foreground/50">· {nl ? 'uw eerste aanspreekpunt' : 'your first point of contact'}</span>
                            </p>
                            <p className="mt-1 text-sm text-foreground/60">
                                <a href="mailto:rian.mathijs@triacore.be" className="hover:text-accent transition-colors">rian.mathijs@triacore.be</a>
                                <span className="mx-2 text-foreground/30">·</span>
                                <a href="tel:+32499874662" className="hover:text-accent transition-colors">+32 499 87 46 62</a>
                            </p>
                        </div>
                    </div>
                </div>

                <div data-reveal className="lg:col-span-7">
                    <div className="rv-fade">
                        {status === 'success' ? (
                            <div className="py-8">
                                <span className="w-14 h-14 rounded-full border border-accent/40 text-accent flex items-center justify-center">
                                    <Check size={24} strokeWidth={1.75} />
                                </span>
                                <h3 className="mt-8 font-serif text-4xl text-foreground">{nl ? 'Bedankt.' : 'Thank you.'}</h3>
                                <p className="mt-4 text-lg text-foreground/60 max-w-md leading-relaxed">
                                    {nl ? 'We hebben uw aanvraag goed ontvangen en nemen binnen 24 uur contact met u op.' : 'We have received your request and will get back to you within 24 hours.'}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setStatus('idle')}
                                    className="mt-8 text-sm font-medium text-foreground/70 hover:text-accent transition-colors"
                                >
                                    {nl ? 'Nog een aanvraag sturen' : 'Send another request'}
                                </button>
                            </div>
                        ) : (
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
                                    <p className={labelClass}>{nl ? 'Workshop op uw locatie?' : 'Workshop at your location?'}</p>
                                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={nl ? 'Workshop op uw locatie?' : 'Workshop at your location?'}>
                                        {LOCATIES.map((l) => {
                                            const on = data.locatie === l.value;
                                            return (
                                                <button
                                                    key={l.value}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={on}
                                                    onClick={() => setData((prev) => ({ ...prev, locatie: on ? '' : l.value }))}
                                                    className={`px-4 py-2 rounded-full border text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${on ? 'bg-foreground border-foreground text-background' : 'bg-transparent border-foreground/15 text-foreground/70 hover:border-foreground/40 hover:text-foreground'}`}
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
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
