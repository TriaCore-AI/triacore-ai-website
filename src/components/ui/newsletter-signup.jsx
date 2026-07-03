import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import CTAButton from './cta-button';

// Herbruikbaar inschrijfveld voor nieuwe resources.
// variant="footer" → compact, op donkere achtergrond (footer).
// variant="panel"  → opvallend blok op lichte achtergrond (Resources-pagina).
// Inschrijvingen gaan via de Netlify Function /.netlify/functions/newsletter-subscribe
// naar een Resend Audience (lijst + automatische unsubscribe) + welkomstmail.
// Na een gelukte inschrijving verschijnt een pop-up (modal) die uitlegt wat de
// bezoeker mag verwachten.
export default function NewsletterSignup({ variant = 'footer', hideInvite = false, align = 'center', size = 'sm' }) {
    const { language } = useLanguage();
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [expanded, setExpanded] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [botField, setBotField] = useState('');
    const [subscribedName, setSubscribedName] = useState(''); // voornaam voor de pop-up

    const isValid =
        /\S+@\S+\.\S+/.test(email) && firstName.trim() !== '' && lastName.trim() !== '';
    const isDark = variant === 'footer';

    const closeSuccess = () => {
        setStatus('idle');
        setExpanded(false);
    };

    // Escape sluit de pop-up; body-scroll blokkeren zolang hij openstaat.
    useEffect(() => {
        if (status !== 'success') return;
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setStatus('idle');
                setExpanded(false);
            }
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [status]);

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
                setSubscribedName(firstName.trim());
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
        error: language === 'nl' ? 'Er ging iets mis. Probeer opnieuw.' : 'Something went wrong. Please try again.',
        consentPre: language === 'nl' ? 'Door in te schrijven ga je akkoord met ons ' : 'By subscribing you agree to our ',
        consentLink: language === 'nl' ? 'privacybeleid' : 'privacy policy',
        consentPost: language === 'nl' ? '. Uitschrijven kan altijd.' : '. You can unsubscribe anytime.',
    };

    // --- Teksten voor de pop-up ---
    const nl = language === 'nl';
    const displayName = subscribedName
        ? subscribedName.charAt(0).toUpperCase() + subscribedName.slice(1)
        : '';
    const modalT = {
        title: nl ? 'Je bent ingeschreven!' : "You're subscribed!",
        sub: displayName
            ? (nl ? `Bedankt, ${displayName}!` : `Thanks, ${displayName}!`)
            : (nl ? 'Bedankt voor je inschrijving!' : 'Thanks for subscribing!'),
        p1: nl
            ? 'Je krijgt zo meteen een welkomstmail in je inbox. Kijk zeker ook even in je spam, zodat je hem niet mist.'
            : "You'll receive a welcome email in your inbox shortly. Be sure to check your spam folder too, so you don't miss it.",
        p2: nl
            ? 'En vanaf nu krijg je élke nieuwe resource automatisch in je inbox, zodra we die publiceren.'
            : 'And from now on, you get every new resource automatically in your inbox as soon as we publish it.',
        unsub: nl
            ? 'Als je wil uitschrijven, kan dat altijd via de link onderaan elke mail.'
            : 'If you want to unsubscribe, you can always do so via the link at the bottom of every email.',
        quote: nl ? 'Laten we samen vooruitdenken.' : "Let's think ahead together.",
        button: nl ? 'Begrepen' : 'Got it',
        close: nl ? 'Sluiten' : 'Close',
    };

    // --- Stijlvarianten ---
    const inputClasses = isDark
        ? 'w-full bg-white/5 border border-white/10 rounded-full px-6 py-3.5 text-white placeholder:text-white/40 outline-none focus:bg-white/10 focus:border-accent focus:shadow-[0_0_0_1px_rgba(98,143,105,0.6)] transition-all duration-300 text-sm'
        : 'w-full bg-[#f8fafc] border border-slate-200 rounded-full px-5 py-2.5 text-sm text-foreground placeholder:text-foreground/40 outline-none focus:bg-white focus:border-accent focus:shadow-[0_0_0_1px_rgba(98,143,105,1)] transition-all duration-300';

    const buttonClasses = isDark
        ? 'group shrink-0 inline-flex items-center justify-center gap-2 bg-accent text-white px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100'
        : 'group shrink-0 inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100';

    const clearError = () => {
        if (status === 'error') setStatus('idle');
    };

    const Form = (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 w-full">
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
            <div className="flex flex-col sm:flex-row gap-2.5">
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
            <div className="flex flex-col sm:flex-row gap-2.5">
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
                {isDark ? (
                    <button type="submit" disabled={!isValid || status === 'loading'} className={buttonClasses}>
                        {status === 'loading' ? t.loading : (
                            <>
                                {t.cta}
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                            </>
                        )}
                    </button>
                ) : (
                    <CTAButton type="submit" size={size} disabled={!isValid || status === 'loading'} className="shrink-0">
                        {status === 'loading' ? t.loading : t.cta}
                    </CTAButton>
                )}
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

    const OpenButton = (
        <CTAButton type="button" size={size} onClick={() => setExpanded(true)}>
            {t.cta}
        </CTAButton>
    );

    const CloseButton = (
        <button
            type="button"
            onClick={() => setExpanded(false)}
            className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-medium text-foreground/40 hover:text-foreground transition-colors"
        >
            <X size={12} />
            {language === 'nl' ? 'Annuleren' : 'Cancel'}
        </button>
    );

    // --- Pop-up (modal) na gelukte inschrijving, via portal op body ---
    const SuccessModal = typeof document === 'undefined' ? null : createPortal(
        <AnimatePresence>
            {status === 'success' && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-sans"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
                        onClick={closeSuccess}
                        aria-hidden="true"
                    />
                    {/* Kaart */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={modalT.title}
                        initial={{ opacity: 0, scale: 0.94, y: 14 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-md bg-white rounded-[1.75rem] p-7 sm:p-9 shadow-2xl text-center"
                    >
                        <button
                            type="button"
                            onClick={closeSuccess}
                            aria-label={modalT.close}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <span className="mx-auto mb-5 w-14 h-14 rounded-full bg-accent/12 text-accent flex items-center justify-center">
                            <Check size={26} strokeWidth={2.5} />
                        </span>

                        <h3 className="font-serif text-2xl sm:text-[1.7rem] leading-tight text-foreground mb-1.5">
                            {modalT.title}
                        </h3>
                        <p className="text-foreground/55 text-sm mb-6">{modalT.sub}</p>

                        <div className="space-y-2.5 mb-5">
                            <p className="text-sm text-foreground/75 leading-relaxed">{modalT.p1}</p>
                            <p className="text-sm text-foreground/75 leading-relaxed">{modalT.p2}</p>
                        </div>

                        <p className="font-serif italic text-accent text-[15px] mb-6">{modalT.quote}</p>

                        <p className="text-[12px] text-foreground/45 leading-relaxed mb-6">{modalT.unsub}</p>

                        <button
                            type="button"
                            onClick={closeSuccess}
                            className="w-full inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3.5 rounded-full text-sm font-semibold hover:brightness-105 active:scale-[0.99] transition"
                        >
                            {modalT.button}
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    );

    // =====================================================================
    // FOOTER VARIANT (donker, compact)
    // =====================================================================
    if (isDark) {
        return (
            <>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="max-w-sm">
                        <h4 className="font-serif text-2xl text-white mb-2">{t.title}</h4>
                        <p className="text-sm text-white/60 font-light leading-relaxed">{t.subtitle}</p>
                    </div>
                    <div className="w-full lg:max-w-md">
                        {Form}
                        {ErrorMsg}
                        {Consent}
                    </div>
                </div>
                {SuccessModal}
            </>
        );
    }

    // =====================================================================
    // INLINE VARIANT (heel simpel, onder de hero). Toont eerst enkel een
    // CTA-knop; de velden verschijnen pas na een klik.
    // =====================================================================
    return (
        <>
            <div className={`w-full max-w-md ${align === 'start' ? '' : 'mx-auto'}`}>
                {expanded ? (
                    <>
                        {Form}
                        {ErrorMsg}
                        {CloseButton}
                    </>
                ) : (
                    <div className={`flex flex-col ${align === 'start' ? 'items-start' : 'items-center text-center'}`}>
                        {!hideInvite && <p className="text-foreground text-sm font-medium mb-3">{t.invite}</p>}
                        {OpenButton}
                    </div>
                )}
            </div>
            {SuccessModal}
        </>
    );
}
