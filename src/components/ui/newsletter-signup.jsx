import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import CTAButton from './cta-button';
import { emailFout, emailVoorstel } from './formulier-controle';
import { useLanguage } from '../../context/LanguageContext';

// De velden: licht (kennisbank) en donker (footer), met een rode rand bij een fout
const veldLicht = (fout) =>
    `w-full min-w-0 bg-white border rounded-full px-5 py-3 text-[15px] text-foreground placeholder:text-foreground/35 outline-none transition-colors duration-300 ${fout ? 'border-red-400 hover:border-red-500 focus:border-red-500' : 'border-foreground/10 hover:border-foreground/20 focus:border-foreground/40'}`;
const veldDonker = (fout) =>
    `w-full min-w-0 bg-white/[0.05] border rounded-full px-5 py-2.5 text-sm text-white placeholder:text-white/35 outline-none transition-colors duration-300 focus:bg-white/[0.08] ${fout ? 'border-red-300/70' : 'border-white/10 hover:border-white/20 focus:border-white/35'}`;

// Inschrijven op de nieuwsbrief van de kennisbank: een naam, een e-mailadres en één knop. Enkel het
// e-mailadres is verplicht; dat de naam mag ontbreken, staat er bewust niet bij (vraag Lucas, 21/11).
// Staat in de footer (tone="dark") en rechts in de kop van de kennisbankpagina (tone="light").
// - De knop is altijd aan te klikken; klopt het adres niet, dan zegt een korte uitleg wat er mis is, net als bij
//   het contactformulier (formulier-controle.js). Bij een bekende typfout (gmial.com) staat er een voorstel.
// - Verstuurt naar de Netlify Function newsletter-subscribe: die zet het adres in de Resend-lijst en stuurt een
//   welkomstmail. De sleutels blijven op de server.
// - Lokaal (npm run dev) bestaat die functie niet: daar doen we alsof het lukte, zodat je de bevestiging kan
//   bekijken. Er wordt dan niets verstuurd en niemand ingeschreven.
// - Na het inschrijven verschijnt de bevestiging op de plaats van het formulier.
export default function NewsletterSignup({ tone = 'light' }) {
    const { language } = useLanguage();
    const nl = language === 'nl';
    const dark = tone === 'dark';
    const id = useId();
    const [naam, setNaam] = useState('');
    const [email, setEmail] = useState('');
    const [botField, setBotField] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, done, error
    const [poging, setPoging] = useState(false);
    const [aangeraakt, setAangeraakt] = useState(false);

    const fout = poging || aangeraakt ? emailFout(email, nl) : null;
    const voorstel = !fout ? emailVoorstel(email) : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status === 'loading') return;
        setPoging(true);
        if (emailFout(email, nl)) {
            document.getElementById(`${id}-email`)?.focus();
            return;
        }
        setStatus('loading');
        if (import.meta.env.DEV) {
            setStatus('done');
            return;
        }
        try {
            const res = await fetch('/.netlify/functions/newsletter-subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: naam.trim(), email: email.trim(), botField, language }),
            });
            setStatus(res.ok ? 'done' : 'error');
        } catch {
            setStatus('error');
        }
    };

    const voornaam = naam.trim().split(/\s+/)[0];
    const muted = dark ? 'text-white/50' : 'text-foreground/55';
    const foutKleur = dark ? 'text-red-300' : 'text-red-600';

    if (status === 'done') {
        return (
            <div role="status" className="flex items-start gap-3">
                <span className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${dark ? 'bg-white/10 text-white' : 'bg-accent/15 text-accent'}`}>
                    <Check size={14} strokeWidth={2.25} />
                </span>
                <div>
                    <p className={`text-[15px] font-medium ${dark ? 'text-white' : 'text-foreground'}`}>
                        {voornaam
                            ? (nl ? `Je bent ingeschreven, ${voornaam}.` : `You are subscribed, ${voornaam}.`)
                            : (nl ? 'Je bent ingeschreven.' : 'You are subscribed.')}
                    </p>
                    <p className={`mt-1 text-sm leading-relaxed ${muted}`}>
                        {nl
                            ? 'Je krijgt zo een welkomstmail. Niets gezien? Kijk dan ook even bij je spam.'
                            : 'A welcome email is on its way. Nothing there? Check your spam folder too.'}
                    </p>
                </div>
            </div>
        );
    }


    return (
        <form noValidate onSubmit={handleSubmit} className="w-full">
            {/* Valstrik voor bots: onzichtbaar voor mensen */}
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
            <label htmlFor={`${id}-naam`} className="sr-only">{nl ? 'Je naam' : 'Your name'}</label>
            <label htmlFor={`${id}-email`} className="sr-only">{nl ? 'Je e-mailadres' : 'Your email address'}</label>
            {/* Footer: naam, e-mail en knop op één rij. Kennisbank: de naam over de volle breedte, daaronder het
                e-mailadres met de knop ernaast (op gsm alles onder elkaar) */}
            <div className={`grid grid-cols-1 gap-2.5 ${dark ? 'sm:grid-cols-[1fr_1fr_auto]' : 'sm:grid-cols-[1fr_auto]'}`}>
                <input
                    id={`${id}-naam`}
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={naam}
                    onChange={(e) => setNaam(e.target.value)}
                    placeholder={nl ? 'Je naam' : 'Your name'}
                    className={dark ? veldDonker('') : `${veldLicht('')} sm:col-span-2`}
                />
                <input
                    id={`${id}-email`}
                    type="email"
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                    onBlur={(e) => { if (e.target.value.trim()) setAangeraakt(true); }}
                    aria-invalid={!!fout}
                    aria-describedby={fout ? `${id}-fout` : undefined}
                    placeholder={nl ? 'Je e-mail' : 'Your email'}
                    className={dark ? veldDonker(fout) : veldLicht(fout)}
                />
                <CTAButton type="submit" size={dark ? 'sm' : 'md'} variant={dark ? 'light' : 'primary'} disabled={status === 'loading'} className="shrink-0">
                    {status === 'loading' ? (nl ? 'Even geduld...' : 'One moment...') : (nl ? 'Inschrijven' : 'Subscribe')}
                </CTAButton>
            </div>

            {fout && <p id={`${id}-fout`} role="alert" className={`mt-2 text-sm ${foutKleur}`}>{fout}</p>}
            {voorstel && (
                <p className={`mt-2 text-sm ${dark ? 'text-white/70' : 'text-foreground/70'}`}>
                    {nl ? 'Bedoel je ' : 'Did you mean '}
                    <button type="button" onClick={() => setEmail(voorstel)} className={`font-medium underline underline-offset-2 transition-colors ${dark ? 'text-white hover:text-accent' : 'text-accent hover:text-foreground'}`}>
                        {voorstel}
                    </button>
                    ?
                </p>
            )}
            {status === 'error' && (
                <p role="alert" className={`mt-2 text-sm ${foutKleur}`}>
                    {nl ? 'Er ging iets mis. Probeer het opnieuw of mail naar' : 'Something went wrong. Try again or email'}{' '}
                    <a href="mailto:info@triacore.be" className="underline">info@triacore.be</a>.
                </p>
            )}

            <p className={`mt-3 text-xs leading-relaxed ${dark ? 'text-white/35' : 'text-foreground/45'}`}>
                {nl ? 'Uitschrijven kan altijd, met één klik onderaan elke mail. Lees ons ' : 'Unsubscribe anytime with one click at the bottom of every email. Read our '}
                <Link to="/privacybeleid" className={`underline underline-offset-2 transition-colors ${dark ? 'hover:text-white' : 'hover:text-accent'}`}>
                    {nl ? 'privacybeleid' : 'privacy policy'}
                </Link>
                .
            </p>
        </form>
    );
}
