import { Resend } from 'resend';
import { welcomeEmail } from '../../lib/email-template.js';

// Nieuwsbrief-inschrijving -> Resend.
// Stap A: contact toevoegen aan de Resend Audience (de nieuwsbrieflijst).
// Stap B: korte welkomstmail sturen (NL/EN), enkel als stap A lukt.
// De API-key blijft server-side (env var) en bereikt nooit de browser.

const EMAIL_RE = /\S+@\S+\.\S+/;

const json = (statusCode, payload) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
});

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return json(405, { ok: false, error: 'Method not allowed' });
    }

    let data;
    try {
        data = JSON.parse(event.body || '{}');
    } catch {
        return json(400, { ok: false, error: 'Invalid JSON' });
    }

    const { email = '', botField = '', language = 'nl' } = data;

    // Honeypot: bot vulde het verborgen veld in -> stilletjes ok, niets doen.
    if (botField) {
        return json(200, { ok: true });
    }

    if (!EMAIL_RE.test(email)) {
        return json(400, { ok: false, error: 'Invalid email' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    const from = process.env.NEWSLETTER_FROM;
    const replyTo = process.env.NEWSLETTER_REPLY_TO; // optioneel: antwoorden naar de echte inbox

    if (!apiKey || !audienceId || !from) {
        console.error('Newsletter: ontbrekende env-variabelen (RESEND_API_KEY / RESEND_AUDIENCE_ID / NEWSLETTER_FROM)');
        return json(500, { ok: false, error: 'Server misconfigured' });
    }

    const resend = new Resend(apiKey);

    // Stap A: contact toevoegen. Bestaat het al, dan behandelen we dat als succes.
    const { error: contactError } = await resend.contacts.create({
        audienceId,
        email,
        unsubscribed: false,
    });

    if (contactError) {
        const msg = (contactError.message || '').toLowerCase();
        const alreadyExists = msg.includes('already') || contactError.name === 'validation_error';
        if (!alreadyExists) {
            console.error('Newsletter: contacts.create faalde', contactError);
            return json(502, { ok: false, error: 'Subscription failed' });
        }
    }

    // Stap B: welkomstmail. Faalt dit, dan blijft de inschrijving toch geldig.
    try {
        const mail = welcomeEmail(language);
        const { error: mailError } = await resend.emails.send({
            from,
            to: email,
            ...(replyTo ? { replyTo } : {}),
            subject: mail.subject,
            html: mail.html,
            text: mail.text,
        });
        if (mailError) {
            console.error('Newsletter: welkomstmail faalde', mailError);
        }
    } catch (err) {
        console.error('Newsletter: welkomstmail wierp een fout', err);
    }

    return json(200, { ok: true });
};
