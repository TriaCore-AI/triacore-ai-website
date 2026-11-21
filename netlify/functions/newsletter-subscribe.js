import { welcomeEmail, escapeHtml, SITE_URL } from '../../lib/email-template.js';
import { unsubscribeSecret, unsubscribeUrl } from '../../lib/unsubscribe.js';
import { getPublishedTemplate, sendEmail, subscribe } from '../../lib/resend-api.js';

// Inschrijven op de nieuwsbrief van de kennisbank (src/components/ui/newsletter-signup.jsx).
// 1. Het adres in de Resend-lijst van deze omgeving zetten (RESEND_SEGMENT_ID).
// 2. Enkel als dat lukte: de welkomstmail. Die tekst beheer je in de ERP (Marketing → Kennisbank → Mails),
//    als Resend-template "kennisbank-welkom-nl" of "-en". Is er (nog) geen template, of lukt het ophalen niet,
//    dan vertrekt de standaardtekst uit lib/email-template.js. Faalt de mail, dan blijft de inschrijving geldig.
// De sleutels staan in de omgeving van Netlify en komen nooit in de browser.
// Env: RESEND_API_KEY, RESEND_SEGMENT_ID (vroeger RESEND_AUDIENCE_ID), NEWSLETTER_FROM, optioneel
// NEWSLETTER_REPLY_TO, NEWSLETTER_SITE_URL en NEWSLETTER_UNSUBSCRIBE_SECRET.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (statusCode, payload) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
});

// Vult {{{VARIABELEN}}} van de template in; onbekende blijven staan
const vulIn = (tekst, waarden) =>
    tekst.replace(/\{\{\{\s*([A-Z0-9_]+)\s*\}\}\}/g, (heel, key) => (key in waarden ? waarden[key] : heel));

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
    // De naam is niet verplicht. Eén veld: het eerste woord wordt de voornaam, de rest de achternaam.
    // Voor- en achternaam beginnen met een hoofdletter ("lucas curto" wordt "Lucas Curto"); de rest blijft
    // zoals getypt
    const naam = String(data.name || '').replace(/\s+/g, ' ').trim().slice(0, 100);
    const hoofdletter = (w) => w.charAt(0).toLocaleUpperCase('nl-BE') + w.slice(1);
    const [eerste = '', ...rest] = naam ? naam.split(' ') : [];
    const firstName = hoofdletter(eerste);
    const lastName = hoofdletter(rest.join(' '));

    // Valstrik: een bot vulde het verborgen veld in. Stil "gelukt" antwoorden en niets doen
    if (data.botField) return json(200, { ok: true });
    if (email.length > 254 || !EMAIL_RE.test(email)) return json(400, { ok: false, error: 'Invalid email' });

    const apiKey = process.env.RESEND_API_KEY;
    const segmentId = process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID;
    const from = process.env.NEWSLETTER_FROM;
    const replyTo = process.env.NEWSLETTER_REPLY_TO;
    if (!apiKey || !segmentId || !from) {
        console.error('Nieuwsbrief: RESEND_API_KEY, RESEND_SEGMENT_ID of NEWSLETTER_FROM ontbreekt');
        return json(500, { ok: false, error: 'Server misconfigured' });
    }

    try {
        await subscribe(apiKey, segmentId, { email, firstName, lastName });
    } catch (err) {
        console.error('Nieuwsbrief: inschrijven faalde', err);
        return json(502, { ok: false, error: 'Subscription failed' });
    }

    try {
        const unsub = unsubscribeUrl(email, unsubscribeSecret(), language);
        let mail = null;
        try {
            const template = await getPublishedTemplate(apiKey, `kennisbank-welkom-${language}`);
            if (template) {
                const tekstWaarden = { AANHEF_NAAM: firstName ? `, ${firstName}` : '', UITSCHRIJF_URL: unsub, SITE_URL };
                const htmlWaarden = {
                    AANHEF_NAAM: firstName ? `, ${escapeHtml(firstName)}` : '',
                    UITSCHRIJF_URL: escapeHtml(unsub),
                    SITE_URL,
                };
                mail = {
                    subject: template.subject || welcomeEmail(language).subject,
                    html: vulIn(template.html, htmlWaarden),
                    text: template.text ? vulIn(template.text, tekstWaarden) : undefined,
                };
            }
        } catch (err) {
            console.warn('Nieuwsbrief: template ophalen faalde, standaardtekst', err.message);
        }
        if (!mail) mail = welcomeEmail(language, { unsubscribeUrl: unsub, firstName });

        await sendEmail(apiKey, {
            from,
            to: email,
            ...(replyTo ? { reply_to: replyTo } : {}),
            subject: mail.subject,
            html: mail.html,
            ...(mail.text ? { text: mail.text } : {}),
            headers: {
                'List-Unsubscribe': `<${unsub}>`,
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
        });
    } catch (err) {
        console.error('Nieuwsbrief: welkomstmail faalde', err);
    }

    return json(200, { ok: true });
};
