import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Herbruikbaar inschrijfveld voor nieuwe resources.
// variant="footer" → compact, op donkere achtergrond (footer).
// variant="panel"  → opvallend blok op lichte achtergrond (Resources-pagina).
// Inschrijvingen gaan via de Netlify Function /.netlify/functions/newsletter-subscribe
// naar een Resend Audience (lijst + automatische unsubscribe) + welkomstmail.
export default function NewsletterSignup({ variant = 'footer' }) {
    const { language } = useLanguage();
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [botField, setBotField] = useState('');

    const isValid =
        /\S+@\S+\.\S+/.test(email) && firstName.trim() !== '' && lastName.trim() !== '';
    const isDark = variant === 'footer';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid || status === 'loading') return;

        setStatus('loading');
        try {
            const res = await fetch('/.netlify/functions/newsletter-subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, firstName, lastName, botField, language }),
            });
            if (res.ok) {
                setStatus('success');
                setEmail('');
                setFirstName('');
                setLastName('');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    // --- Teksten ---
    const t = {
        title: language === 'nl' ? 'Blijf op de hoogte' : 'Stay in the loop',
        subtitle: language === 'nl'
            ? 'Ontvang een mailtje zodra er een nieuwe resource verschijnt.'
            : 'Get an email when a new resource is published.',
        invite: language === 'nl'
            ? 'Schrijf je in om op de hoogte te blijven van onze nieuwste resources.'
            : 'Subscribe to stay up to date with our latest resources.',
        placeholder: language === 'nl' ? 'Vul je e-mailadres in' : 'Enter your email',
        firstNamePlaceholder: language === 'nl' ? 'Voornaam' : 'First name',
        lastNamePlaceholder: language === 'nl' ? 'Achternaam' : 'Last name',
        cta: language === 'nl' ? 'Inschrijven' : 'Subscribe',
        loading: language === 'nl' ? 'Even geduld...' : 'One moment...',
        successTitle: language === 'nl' ? 'Je staat op de lijst.' : 'You are on the list.',
        successBody: language === 'nl'
            ? 'Je hoort van ons zodra er iets nieuws is.'
            : 'We will reach out as soon as there is something new.',
        error: language === 'nl' ? 'Er ging iets mis. Probeer opnieuw.' : 'Something went wrong. Please try again.',
        consentPre: language === 'nl' ? 'Door in te schrijven ga je akkoord met ons ' : 'By subscribing you agree to our ',
        consentLink: language === 'nl' ? 'privacybeleid' : 'privacy policy',
        consentPost: language === 'nl' ? '. Uitschrijven kan altijd.' : '. You can unsubscribe anytime.',
    };

    // --- Stijlvarianten ---
    const inputClasses = isDark
        ? 'w-full bg-white/5 border border-white/10 rounded-full px-6 py-3.5 text-white placeholder:text-white/40 outline-none focus:bg-white/10 focus:border-accent focus:shadow-[0_0_0_1px_rgba(98,143,105,0.6)] transition-all duration-300 text-sm'
        : 'w-full bg-[#f8fafc] border border-slate-200 rounded-full px-6 py-4 text-foreground placeholder:text-foreground/40 outline-none focus:bg-white focus:border-accent focus:shadow-[0_0_0_1px_rgba(98,143,105,1)] transition-all duration-300';

    const buttonClasses = isDark
        ? 'group shrink-0 inline-flex items-center justify-center gap-2 bg-accent text-white px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100'
        : 'group shrink-0 inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100';

    const clearError = () => {
        if (status === 'error') setStatus('idle');
    };

    const Form = (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
            {/* Honeypot (verborgen voor mensen, vangt bots) */}
            <input
                type="text"
                name="bot-field"
                tabIndex={-1}
                autoComplete="off"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
                className="hidden"
                aria-hidden="true"
            />
            {/* Voornaam + achternaam */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); clearError(); }}
                    placeholder={t.firstNamePlaceholder}
                    className={inputClasses}
                    aria-label={t.firstNamePlaceholder}
                />
                <input
                    type="text"
                    required
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); clearError(); }}
                    placeholder={t.lastNamePlaceholder}
                    className={inputClasses}
                    aria-label={t.lastNamePlaceholder}
                />
            </div>
            {/* E-mail + knop */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError(); }}
                    placeholder={t.placeholder}
                    className={inputClasses}
                    aria-label={t.placeholder}
                />
                <button type="submit" disabled={!isValid || status === 'loading'} className={buttonClasses}>
                    {status === 'loading' ? t.loading : (
                        <>
                            {t.cta}
                            <ArrowRight size={isDark ? 16 : 18} className="transition-transform group-hover:translate-x-0.5" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );

    const Consent = (
        <p className={`text-[11px] mt-3 ${isDark ? 'text-white/40' : 'text-foreground/45'}`}>
            {t.consentPre}
            <Link to="/privacybeleid" className="underline hover:text-accent transition-colors">
                {t.consentLink}
            </Link>
            {t.consentPost}
        </p>
    );

    const ErrorMsg = status === 'error' && (
        <p className="text-[12px] mt-2 text-red-400 font-medium">{t.error}</p>
    );

    // =====================================================================
    // FOOTER VARIANT (donker, compact)
    // =====================================================================
    if (isDark) {
        return (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-sm">
                    <h4 className="font-serif text-2xl text-white mb-2">{t.title}</h4>
                    <p className="text-sm text-white/60 font-light leading-relaxed">{t.subtitle}</p>
                </div>
                <div className="w-full lg:max-w-md">
                    {status === 'success' ? (
                        <div className="flex items-center gap-3 text-white">
                            <span className="w-9 h-9 shrink-0 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                                <Check size={18} />
                            </span>
                            <div>
                                <p className="font-semibold text-sm">{t.successTitle}</p>
                                <p className="text-white/55 text-xs font-light">{t.successBody}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {Form}
                            {ErrorMsg}
                            {Consent}
                        </>
                    )}
                </div>
            </div>
        );
    }

    // =====================================================================
    // INLINE VARIANT (heel simpel, onder de hero)
    // =====================================================================
    return (
        <div className="w-full max-w-md mx-auto">
            {status === 'success' ? (
                <div className="flex items-center justify-center gap-3 text-foreground">
                    <span className="w-9 h-9 shrink-0 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                        <Check size={18} />
                    </span>
                    <p className="font-medium">{t.successTitle}</p>
                </div>
            ) : (
                <>
                    <p className="text-foreground font-medium mb-4">{t.invite}</p>
                    {Form}
                    {ErrorMsg}
                </>
            )}
        </div>
    );
}
