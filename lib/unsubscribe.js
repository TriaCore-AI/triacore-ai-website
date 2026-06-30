// Ondertekende uitschrijflinks, zodat élke mail (ook de transactionele
// welkomstmail) een werkende "Uitschrijven" kan tonen, los van Resend's
// broadcast-only uitschrijflink.
//
// De link bevat het e-mailadres + een HMAC-handtekening. Zonder de juiste
// handtekening (gemaakt met het server-side geheim) kan niemand een willekeurig
// adres uitschrijven.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { SITE_URL } from './email-template.js';

const normalize = (email) => String(email).trim().toLowerCase();

export function signEmail(email, secret) {
    return createHmac('sha256', secret).update(normalize(email)).digest('hex');
}

export function verifyEmailToken(email, token, secret) {
    if (!email || !token || !secret) return false;
    const expected = signEmail(email, secret);
    if (token.length !== expected.length) return false;
    try {
        return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
    } catch {
        return false;
    }
}

// Volledige uitschrijf-URL voor in een mail.
export function unsubscribeUrl(email, secret, language = 'nl') {
    const t = signEmail(email, secret);
    const params = new URLSearchParams({ e: normalize(email), t, l: language });
    return `${SITE_URL}/.netlify/functions/newsletter-unsubscribe?${params.toString()}`;
}
