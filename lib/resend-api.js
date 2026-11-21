// De paar Resend-aanroepen van de nieuwsbrief, met gewone fetch (de nieuwe API met segmenten; de oude
// "audiences" zijn afgeschreven). Gebruikt door netlify/functions/newsletter-subscribe.js en
// newsletter-unsubscribe.js. De sleutel blijft op de server.

const API = 'https://api.resend.com';

export class ResendError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ResendError';
        this.status = status;
    }
}

async function call(apiKey, path, { method = 'GET', body } = {}) {
    const res = await fetch(`${API}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(10_000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ResendError(`Resend ${res.status}: ${data.message || res.statusText}`, res.status);
    return data;
}

const contactPath = (email) => `/contacts/${encodeURIComponent(email)}`;

/** Het contact, of null als het adres nog niet in Resend staat. */
export async function getContact(apiKey, email) {
    try {
        return await call(apiKey, contactPath(email));
    } catch (err) {
        if (err instanceof ResendError && err.status === 404) return null;
        throw err;
    }
}

/**
 * Inschrijven: bestaat het adres al, dan opnieuw op "ingeschreven" (opnieuw inschrijven is opnieuw
 * toestemming geven), met de naam als die ingevuld is, en in de lijst. Anders een nieuw contact in de lijst.
 * Ingeschreven of niet hoort in Resend bij het adres, niet bij één lijst.
 */
export async function subscribe(apiKey, segmentId, { email, firstName, lastName }) {
    const names = { ...(firstName && { first_name: firstName }), ...(lastName && { last_name: lastName }) };
    const existing = await getContact(apiKey, email);
    if (!existing) {
        await call(apiKey, '/contacts', {
            method: 'POST',
            body: { email, unsubscribed: false, ...names, segments: [{ id: segmentId }] },
        });
        return;
    }
    await call(apiKey, contactPath(email), { method: 'PATCH', body: { unsubscribed: false, ...names } });
    try {
        await call(apiKey, `${contactPath(email)}/segments/${encodeURIComponent(segmentId)}`, { method: 'POST' });
    } catch (err) {
        // Staat het adres al in de lijst, dan is het doel bereikt; Resend documenteert dat antwoord niet
        console.warn('Nieuwsbrief: toevoegen aan de lijst gaf een fout (staat het er al in?)', err.message);
    }
}

/** Uitschrijven: geldt voor alle nieuwsbrieven. Een onbekend adres is ook goed. */
export async function unsubscribe(apiKey, email) {
    try {
        await call(apiKey, contactPath(email), { method: 'PATCH', body: { unsubscribed: true } });
    } catch (err) {
        if (err instanceof ResendError && err.status === 404) return;
        throw err;
    }
}

/** Een gepubliceerde template (bv. de welkomstmail uit de ERP), of null als die er niet is. */
export async function getPublishedTemplate(apiKey, alias) {
    try {
        const template = await call(apiKey, `/templates/${encodeURIComponent(alias)}`);
        return template.status === 'published' && template.html ? template : null;
    } catch (err) {
        if (err instanceof ResendError && err.status === 404) return null;
        throw err;
    }
}

export function sendEmail(apiKey, email) {
    return call(apiKey, '/emails', { method: 'POST', body: email });
}
