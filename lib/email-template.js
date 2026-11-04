// De bevestigingspagina van de uitschrijflink. De site heeft geen nieuwsbrief of resources meer, maar wie zich
// vroeger inschreef, kan zich via de link in oude mails nog altijd uitschrijven (zie newsletter-unsubscribe.js).

const ACCENT = '#628f69';
const INK = '#0f172a';
const BG = '#f8fafc';
const BORDER = '#e2e8f0';

// Standaard de live site; lokaal te overschrijven via NEWSLETTER_SITE_URL
const SITE_URL = process.env.NEWSLETTER_SITE_URL || 'https://triacore.be';

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
