import { unsubscribePage } from '../../lib/email-template.js';
import { unsubscribeSecret, verifyEmailToken } from '../../lib/unsubscribe.js';
import { unsubscribe } from '../../lib/resend-api.js';

// Uitschrijven vanaf een ondertekende link (werkt in elke mail, ook de
// transactionele welkomstmail). Zet het contact op unsubscribed in Resend.
//   GET  -> toont een bevestigingspagina in huisstijl
//   POST -> one-click uitschrijven (List-Unsubscribe-Post van Gmail/Outlook)

const html = (statusCode, body) => ({
    statusCode,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body,
});

export const handler = async (event) => {
    const q = event.queryStringParameters || {};
    const email = q.e || '';
    const token = q.t || '';
    const language = q.l === 'en' ? 'en' : 'nl';
    const isPost = event.httpMethod === 'POST'; // one-click vanuit de mailclient

    const apiKey = process.env.RESEND_API_KEY;
    const secret = unsubscribeSecret();

    if (!apiKey || !secret) {
        console.error('Unsubscribe: RESEND_API_KEY ontbreekt');
        return isPost ? { statusCode: 500, body: '' } : html(500, unsubscribePage(language, false));
    }

    // Handtekening controleren: zonder geldige token schrijven we niemand uit.
    if (!verifyEmailToken(email, token, secret)) {
        return isPost ? { statusCode: 400, body: '' } : html(400, unsubscribePage(language, false));
    }

    // Uitschrijven geldt in Resend voor het adres, dus voor alle nieuwsbrieven. Een onbekend adres is ook goed.
    try {
        await unsubscribe(apiKey, String(email).trim().toLowerCase());
    } catch (err) {
        console.error('Unsubscribe: onverwachte fout', err);
        return isPost ? { statusCode: 500, body: '' } : html(500, unsubscribePage(language, false));
    }

    return isPost ? { statusCode: 200, body: '' } : html(200, unsubscribePage(language, true));
};
