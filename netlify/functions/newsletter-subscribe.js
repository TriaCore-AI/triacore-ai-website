import { Resend } from 'resend';
import { welcomeEmail } from '../../lib/email-template.js';
import { unsubscribeUrl } from '../../lib/unsubscribe.js';

// Inschrijven op de nieuwsbrief van de kennisbank (src/components/ui/newsletter-signup.jsx).
// 1. Het adres in de Resend-lijst (Audience) zetten. Bestond het al, dan opnieuw op "ingeschreven":
//    opnieuw inschrijven is opnieuw toestemming geven.
// 2. Enkel als dat lukte: een korte welkomstmail, met een uitschrijflink. Faalt de mail, dan blijft de
//    inschrijving toch geldig.
// De sleutels staan in de omgeving van Netlify en komen nooit in de browser.
// Env: RESEND_API_KEY, RESEND_AUDIENCE_ID, NEWSLETTER_FROM, optioneel NEWSLETTER_REPLY_TO.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (statusCode, payload) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
});

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' });

    let data;
    try {
        data = JSON.parse(event.body || '{}');
    } catch {
        return json(400, { ok: false, error: 'Invalid JSON' });
    }

    const email = String(data.email || '').trim().toLowerCase();
    const language = data.language === 'en' ? 'en' : 'nl';
    // De naam is niet verplicht. Eén veld: het eerste woord wordt de voornaam, de rest de achternaam
    const naam = String(data.name || '').replace(/\s+/g, ' ').trim().slice(0, 100);
    const [firstName = '', ...rest] = naam ? naam.split(' ') : [];
    const lastName = rest.join(' ');
    const naamVelden = { ...(firstName && { firstName }), ...(lastName && { lastName }) };

    // Valstrik: een bot vulde het verborgen veld in. Stil "gelukt" antwoorden en niets doen
    if (data.botField) return json(200, { ok: true });
    if (email.length > 254 || !EMAIL_RE.test(email)) return json(400, { ok: false, error: 'Invalid email' });

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    const from = process.env.NEWSLETTER_FROM;
    const replyTo = process.env.NEWSLETTER_REPLY_TO;
    if (!apiKey || !audienceId || !from) {
        console.error('Nieuwsbrief: RESEND_API_KEY, RESEND_AUDIENCE_ID of NEWSLETTER_FROM ontbreekt');
        return json(500, { ok: false, error: 'Server misconfigured' });
    }

    const resend = new Resend(apiKey);

    const { error: createError } = await resend.contacts.create({ audienceId, email, unsubscribed: false, ...naamVelden });
    if (createError) {
        const msg = (createError.message || '').toLowerCase();
        const bestaatAl = msg.includes('already') || createError.name === 'validation_error';
        if (!bestaatAl) {
            console.error('Nieuwsbrief: contacts.create faalde', createError);
            return json(502, { ok: false, error: 'Subscription failed' });
        }
        const { error: updateError } = await resend.contacts.update({ audienceId, email, unsubscribed: false, ...naamVelden });
        if (updateError) {
            console.error('Nieuwsbrief: opnieuw inschrijven faalde', updateError);
            return json(502, { ok: false, error: 'Subscription failed' });
        }
    }

    try {
        const unsub = unsubscribeUrl(email, apiKey, language);
        const mail = welcomeEmail(language, { unsubscribeUrl: unsub, firstName });
        const { error: mailError } = await resend.emails.send({
            from,
            to: email,
            ...(replyTo ? { replyTo } : {}),
            subject: mail.subject,
            html: mail.html,
            text: mail.text,
            headers: {
                'List-Unsubscribe': `<${unsub}>`,
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
        });
        if (mailError) console.error('Nieuwsbrief: welkomstmail faalde', mailError);
    } catch (err) {
        console.error('Nieuwsbrief: welkomstmail faalde', err);
    }

    return json(200, { ok: true });
};
