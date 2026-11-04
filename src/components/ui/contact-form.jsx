import React, { useState } from 'react';
import { Check } from 'lucide-react';
import CTAButton from './cta-button';
import { useLanguage } from '../../context/LanguageContext';

// Het contactformulier, in de nieuwe stijl: witte velden zonder kader eromheen, een keuze voor het
// onderwerp als witte knoppen die groen worden bij hover of als ze gekozen zijn, en één primaire knop.
// Het formulier rekt mee in de hoogte (het berichtveld groeit), zodat het even hoog kan staan als de
// kolom ernaast. Verstuurt naar Netlify Forms (formulier "contact").
// Let op: elk veld moet ook in het verborgen formulier in index.html staan, anders laat Netlify het weg.
const TOPICS = [
    { value: 'Custom tool', nl: 'Custom tool', en: 'Custom tool' },
    { value: 'Workshop', nl: 'Workshop', en: 'Workshop' },
    { value: 'AI-begeleiding', nl: 'AI-begeleiding', en: 'AI guidance' },
    { value: 'Weet ik nog niet', nl: 'Weet ik nog niet', en: 'Not sure yet' }
];

const fieldClass = 'w-full bg-white border border-foreground/10 rounded-2xl px-5 py-3.5 text-foreground placeholder:text-foreground/35 outline-none transition-colors duration-300 hover:border-foreground/20 focus:border-foreground/40';
const labelClass = 'block mb-2 text-sm text-foreground/60';

export default function ContactForm() {
    const { language } = useLanguage();
    const nl = language === 'nl';
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const empty = { name: '', company: '', email: '', phone: '', topic: '', message: '' };
    const [formData, setFormData] = useState(empty);

    const isFormValid = formData.name && formData.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        setStatus('loading');
        try {
            const res = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ 'form-name': 'contact', ...formData }).toString()
            });
            if (res.ok) {
                setStatus('success');
                setFormData(empty);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    if (status === 'success') {
        return (
            <div className="py-16">
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
                    {nl ? 'Nog een bericht sturen' : 'Send another message'}
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full">
            <div>
                <p className={labelClass}>{nl ? 'Waarover gaat het?' : 'What is it about?'}</p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={nl ? 'Onderwerp' : 'Topic'}>
                    {TOPICS.map((t) => {
                        const on = formData.topic === t.value;
                        return (
                            <button
                                key={t.value}
                                type="button"
                                role="radio"
                                aria-checked={on}
                                onClick={() => setFormData((prev) => ({ ...prev, topic: on ? '' : t.value }))}
                                className={`px-4 py-2 rounded-full border text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${on ? 'bg-foreground border-foreground text-background' : 'bg-transparent border-foreground/15 text-foreground/70 hover:border-foreground/40 hover:text-foreground'}`}
                            >
                                {t[language]}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className={labelClass}>{nl ? 'Naam *' : 'Name *'}</label>
                    <input required id="name" type="text" autoComplete="name" value={formData.name} onChange={handleInputChange} className={fieldClass} placeholder={nl ? 'Voor- en achternaam' : 'First and last name'} />
                </div>
                <div>
                    <label htmlFor="email" className={labelClass}>{nl ? 'E-mail *' : 'Email *'}</label>
                    <input required id="email" type="email" autoComplete="email" value={formData.email} onChange={handleInputChange} className={fieldClass} placeholder={nl ? 'naam@bedrijf.be' : 'name@company.com'} />
                </div>
                <div>
                    <label htmlFor="company" className={labelClass}>{nl ? 'Bedrijf' : 'Company'}</label>
                    <input id="company" type="text" autoComplete="organization" value={formData.company} onChange={handleInputChange} className={fieldClass} placeholder={nl ? 'Bedrijfsnaam' : 'Company name'} />
                </div>
                <div>
                    <label htmlFor="phone" className={labelClass}>{nl ? 'Telefoon' : 'Phone'}</label>
                    <input id="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={handleInputChange} className={fieldClass} placeholder={nl ? 'Telefoonnummer' : 'Phone number'} />
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <label htmlFor="message" className={labelClass}>{nl ? 'Uw vraag' : 'Your question'}</label>
                <textarea id="message" rows="5" value={formData.message} onChange={handleInputChange} className={`${fieldClass} resize-none flex-1 min-h-[140px]`} placeholder={nl ? 'Beschrijf kort uw situatie of wat u wilt bereiken.' : 'Briefly describe your situation or what you want to achieve.'} />
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-5 mt-2">
                <CTAButton type="submit" disabled={!isFormValid || status === 'loading'} className="w-full md:w-auto">
                    {status === 'loading' ? (nl ? 'Even geduld...' : 'One moment...') : (nl ? 'Verstuur' : 'Send')}
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
