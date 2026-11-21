// De mails en pagina's van de nieuwsbrief van de kennisbank (sinds 21/11/2026 terug):
// - welcomeEmail: de welkomstmail na inschrijven (netlify/functions/newsletter-subscribe.js)
// - unsubscribePage: de bevestigingspagina van de uitschrijflink (netlify/functions/newsletter-unsubscribe.js)
// Mails bewust met tabellen en inline stijlen: dat tonen Gmail, Outlook en Apple Mail betrouwbaar.

const ACCENT = '#628f69';
const INK = '#0f172a';
const MUTED = '#64748b';
const BG = '#f8fafc';
const BORDER = '#e2e8f0';
const ADDRESS = 'TriaCore AI BV · Berkenstraat 44, 3850 Nieuwerkerken · BE 1042.233.821';

// Standaard de live site; lokaal te overschrijven via NEWSLETTER_SITE_URL. Ook gebruikt door lib/unsubscribe.js
export const SITE_URL =process.env.NEWSLETTER_SITE_URL || 'https://triacore.be';

function escapeHtml(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

// Knop die ook in Outlook werkt
function button(href, label) {
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;">
      <tr><td style="border-radius:9999px;background:${INK};">
        <a href="${href}" style="display:inline-block;padding:13px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:9999px;">${label}</a>
      </td></tr></table>`;
}

// Volledige mail rond een stuk inhoud, met het logo bovenaan en de wettelijke gegevens onderaan
function emailLayout({ bodyHtml, footerHtml, preheader = '', lang = 'nl' }) {
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin:0;padding:0;background:${BG};">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${BORDER};border-radius:16px;overflow:hidden;">
        <tr><td style="padding:30px 36px 6px;">
          <img src="${SITE_URL}/logo/triacore-mark.png" alt="" height="26" style="height:26px;width:auto;vertical-align:middle;display:inline-block;border:0;">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;letter-spacing:-0.3px;color:${INK};vertical-align:middle;margin-left:10px;">TriaCore AI</span>
        </td></tr>
        <tr><td style="padding:12px 36px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${INK};">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:22px 36px;border-top:1px solid ${BORDER};font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${MUTED};">
          ${footerHtml}
        </td></tr>
      </table>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${MUTED};padding:16px;">${ADDRESS}</div>
    </td></tr>
  </table>
</body>
</html>`;
}

// De welkomstmail na inschrijven, in het Nederlands of Engels. Geeft { subject, html, text } terug.
// unsubscribeUrl = de ondertekende uitschrijflink (lib/unsubscribe.js); firstName mag leeg zijn
export function welcomeEmail(language, { unsubscribeUrl = '#', firstName = '' } = {}) {
    const nl = language !== 'en';
    // De naam komt van de bezoeker: in de HTML-versie altijd ontsnapt
    const naam = firstName.trim();
    const naamHtml = naam ? `, ${escapeHtml(naam)}` : '';
    const naamTekst = naam ? `, ${naam}` : '';
    const kennisbank = `${SITE_URL}/kennisbank`;
    const unsubLink = `<a href="${unsubscribeUrl}" style="color:${MUTED};text-decoration:underline;">${nl ? 'Uitschrijven' : 'Unsubscribe'}</a>`;
    if (nl) {
        return {
            subject: 'Welkom bij de nieuwsbrief van TriaCore AI',
            html: emailLayout({
                lang: 'nl',
                preheader: 'Vanaf nu krijg je elk nieuw artikel uit onze kennisbank in je mailbox.',
                bodyHtml: `
                    <p style="margin:0 0 14px;font-size:18px;font-weight:700;color:${INK};">Fijn dat je erbij bent${naamHtml}.</p>
                    <p style="margin:0 0 14px;">Vanaf nu krijg je elk nieuw artikel uit onze kennisbank in je mailbox: praktische AI-tips, prompts om meteen te gebruiken en ideeën om AI slim in te zetten in je bedrijf.</p>
                    <p style="margin:0;">AI verandert snel en niemand kan alles volgen. Wij zoeken uit wat er echt toe doet en hoe je het concreet inzet. Neem gerust al een kijkje bij wat er nu klaarstaat.</p>
                    ${button(kennisbank, 'Naar de kennisbank')}
                    <p style="margin:20px 0 0;">Tot snel,<br>het team van TriaCore AI</p>`,
                footerHtml: `Je krijgt deze mail omdat je je net inschreef op de nieuwsbrief van TriaCore AI.<br>${unsubLink}`,
            }),
            text: `Fijn dat je erbij bent${naamTekst}.\n\nVanaf nu krijg je elk nieuw artikel uit onze kennisbank in je mailbox: praktische AI-tips, prompts om meteen te gebruiken en ideeën om AI slim in te zetten in je bedrijf.\n\nAI verandert snel en niemand kan alles volgen. Wij zoeken uit wat er echt toe doet en hoe je het concreet inzet. Neem gerust al een kijkje bij wat er nu klaarstaat: ${kennisbank}\n\nTot snel,\nhet team van TriaCore AI\n\nUitschrijven: ${unsubscribeUrl}`,
        };
    }
    return {
        subject: 'Welcome to the TriaCore AI newsletter',
        html: emailLayout({
            lang: 'en',
            preheader: 'From now on, every new article from our resources lands in your inbox.',
            bodyHtml: `
                <p style="margin:0 0 14px;font-size:18px;font-weight:700;color:${INK};">Great to have you here${naamHtml}.</p>
                <p style="margin:0 0 14px;">From now on, every new article from our resources lands in your inbox: practical AI tips, prompts you can use right away and ideas to put AI to smart use in your business.</p>
                <p style="margin:0;">AI moves fast and nobody can follow everything. We find out what really matters and how to put it to work. Feel free to take a look at what is already there.</p>
                ${button(kennisbank, 'Browse the resources')}
                <p style="margin:20px 0 0;">Talk soon,<br>the TriaCore AI team</p>`,
            footerHtml: `You are receiving this email because you just subscribed to the TriaCore AI newsletter.<br>${unsubLink}`,
        }),
        text: `Great to have you here${naamTekst}.\n\nFrom now on, every new article from our resources lands in your inbox: practical AI tips, prompts you can use right away and ideas to put AI to smart use in your business.\n\nAI moves fast and nobody can follow everything. We find out what really matters and how to put it to work. Take a look at what is already there: ${kennisbank}\n\nTalk soon,\nthe TriaCore AI team\n\nUnsubscribe: ${unsubscribeUrl}`,
    };
}

// ok=false -> ongeldige/verlopen link.
export function unsubscribePage(language, ok = true) {
    const nl = language !== 'en';
    const t = ok
        ? (nl
            ? { title: 'Je bent uitgeschreven', body: 'Je ontvangt geen nieuwsbrieven meer van TriaCore AI.', cta: 'Naar TriaCore AI' }
            : { title: 'You have been unsubscribed', body: 'You will no longer receive newsletters from TriaCore AI.', cta: 'To TriaCore AI' })
        : (nl
            ? { title: 'Er ging iets mis', body: 'Deze uitschrijflink is ongeldig of verlopen. Mail ons gerust op info@triacore.be, dan helpen we je verder.', cta: 'Naar TriaCore AI' }
            : { title: 'Something went wrong', body: 'This unsubscribe link is invalid or expired. Feel free to email us at info@triacore.be and we will help you out.', cta: 'To TriaCore AI' });
    return `<!DOCTYPE html>
<html lang="${nl ? 'nl' : 'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${t.title} | TriaCore AI</title>
  <meta name="robots" content="noindex">
</head>
<body style="margin:0;padding:0;background:${BG};font-family:Arial,Helvetica,sans-serif;color:${INK};">
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">
    <div style="max-width:480px;width:100%;background:#ffffff;border:1px solid ${BORDER};border-radius:16px;overflow:hidden;">
      <div style="height:4px;background:${ACCENT};"></div>
      <div style="padding:40px 36px;">
        <div style="font-size:20px;font-weight:700;letter-spacing:-0.3px;margin-bottom:24px;">TriaCore<span style="color:${ACCENT};"> AI</span></div>
        <h1 style="font-size:22px;line-height:1.3;margin:0 0 12px;">${t.title}</h1>
        <p style="font-size:15px;line-height:1.65;color:#475569;margin:0 0 28px;">${t.body}</p>
        <a href="${SITE_URL}" style="display:inline-block;padding:13px 26px;background:${ACCENT};color:#ffffff;text-decoration:none;border-radius:9999px;font-size:14px;font-weight:600;">${t.cta}</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}
