import { Resend } from 'resend';
import { unsubscribePage } from '../../lib/email-template.js';
import { verifyEmailToken } from '../../lib/unsubscribe.js';

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

    const secret = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!secret || !audienceId) {
        console.error('Unsubscribe: ontbrekende env (RESEND_API_KEY / RESEND_AUDIENCE_ID)');
        return isPost ? { statusCode: 500, body: '' } : html(500, unsubscribePage(language, false));
    }

    // Handtekening controleren: zonder geldige token schrijven we niemand uit.
    if (!verifyEmailToken(email, token, secret)) {
        return isPost ? { statusCode: 400, body: '' } : html(400, unsubscribePage(language, false));
    }

    try {
        const resend = new Resend(secret);
        const { error } = await resend.contacts.update({ audienceId, email, unsubscribed: true });
        // Bestaat het contact niet (meer), dan is het doel ook bereikt: niet abonneren.
        if (error && !String(error.message || '').toLowerCase().includes('not found')) {
            console.error('Unsubscribe: contacts.update faalde', error);
        }
    } catch (err) {
        console.error('Unsubscribe: onverwachte fout', err);
        return isPost ? { statusCode: 500, body: '' } : html(500, unsubscribePage(language, false));
    }

    return isPost ? { statusCode: 200, body: '' } : html(200, unsubscribePage(language, true));
};
