// =============================================================
// Gedeelde, email-veilige HTML-template voor TriaCore-mails.
// Gebruikt door de welkomstmail (Netlify Function) en het
// broadcast-conceptscript, zodat alle mails dezelfde huisstijl hebben.
//
// Bewust met tabellen + inline styles: dat is wat Gmail, Outlook en
// Apple Mail betrouwbaar renderen (geen externe CSS, geen webfonts).
// =============================================================

export const ACCENT = '#628f69';
const INK = '#0f172a';
const MUTED = '#64748b';
const BG = '#f8fafc';
const BORDER = '#e2e8f0';

export const SITE_URL = 'https://www.triacore.be';
const ADDRESS = 'TriaCore AI · Kempische Steenweg 303, 3500 Hasselt';

// Bulletproof button (werkt ook in Outlook).
export function button(href, label) {
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;">
      <tr><td style="border-radius:9999px;background:${ACCENT};">
        <a href="${href}" style="display:inline-block;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:9999px;">${label}</a>
      </td></tr></table>`;
}

// Resource/nieuwsbrief-titel in serif-cursief (verwijst naar de Playfair-titels
// op de site; Georgia als email-veilige basis zodat het overal rendert).
export function resourceTitle(text) {
    return `<p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:25px;line-height:1.3;font-weight:600;color:${INK};">${text}</p>`;
}

// Welkomstmail (transactioneel, verstuurd door de Netlify Function bij inschrijving).
// Geeft { subject, html, text } terug, gelokaliseerd op taal.
export function welcomeEmail(language) {
    const nl = language !== 'en';
    if (nl) {
        return {
            subject: 'Welkom, fijn dat je erbij bent',
            html: emailLayout({
                preheader: 'Je zit hier goed. Vanaf nu blijf je op de hoogte van alles waar we aan werken.',
                bodyHtml: `
                    <p style="margin:0 0 14px;font-size:18px;font-weight:700;color:${INK};">Fijn dat je erbij bent 👋</p>
                    <p style="margin:0 0 14px;">Welkom bij de TriaCore AI community. Vanaf nu hoor je het als eerste wanneer we iets nieuws delen: een praktische gids, een slimme prompt of een idee dat je echt vooruithelpt.</p>
                    <p style="margin:0 0 14px;">Je zit hier helemaal goed. De AI revolutie gaat razendsnel, en het is bijna onmogelijk om alles te volgen. Daarom doen wij dat voor jou: je hoort wat er echt toe doet en hoe je het concreet inzet.</p>
                    <p style="margin:0;">Neem hieronder zeker al eens een kijkje bij wat er nu al klaarstaat. We kijken ernaar uit om je op de hoogte te houden.</p>
                    ${button(`${SITE_URL}/resources`, 'Bekijk de resources')}
                    <p style="margin:20px 0 0;">Tot snel,<br>het team van <strong style="color:${ACCENT};">TriaCore AI</strong></p>`,
                footerHtml: 'Je ontvangt deze mail omdat je je net inschreef op de TriaCore AI nieuwsbrief. Uitschrijven kan via de link onderaan elke nieuwsbrief.',
            }),
            text: `Fijn dat je erbij bent. Welkom bij de TriaCore AI community. Vanaf nu hoor je het als eerste wanneer we iets nieuws delen. De AI revolutie gaat razendsnel en het is bijna onmogelijk om alles te volgen, daarom doen wij dat voor jou. Neem zeker al eens een kijkje bij wat er nu al klaarstaat, we kijken ernaar uit om je op de hoogte te houden. Bekijk de resources op ${SITE_URL}/resources. Uitschrijven kan altijd via de link onderaan elke nieuwsbrief.`,
        };
    }
    return {
        subject: 'Welcome, great to have you here',
        html: emailLayout({
            preheader: 'You are in the right place. From now on you will stay up to date with everything we build.',
            bodyHtml: `
                <p style="margin:0 0 14px;font-size:18px;font-weight:700;color:${INK};">Great to have you here 👋</p>
                <p style="margin:0 0 14px;">Welcome to the TriaCore AI community. From now on you will be the first to know when we share something new: a practical guide, a smart prompt or an idea that genuinely moves you forward.</p>
                <p style="margin:0 0 14px;">You are in exactly the right place. The AI revolution is moving incredibly fast, and it is nearly impossible to keep up with everything. So we do it for you: you will hear what actually matters and how to put it to use.</p>
                <p style="margin:0;">Take a look below at what is already waiting for you. We look forward to keeping you in the loop.</p>
                ${button(`${SITE_URL}/resources`, 'Browse the resources')}
                <p style="margin:20px 0 0;">Talk soon,<br>the <strong style="color:${ACCENT};">TriaCore AI</strong> team</p>`,
            footerHtml: 'You are receiving this email because you just subscribed to the TriaCore AI newsletter. You can unsubscribe via the link at the bottom of every newsletter.',
        }),
        text: `Great to have you here. Welcome to the TriaCore AI community. From now on you will be the first to know when we share something new. The AI revolution is moving incredibly fast and it is nearly impossible to keep up, so we do it for you. Take a look at what is already waiting for you, we look forward to keeping you in the loop. Browse the resources at ${SITE_URL}/resources. You can unsubscribe anytime via the link at the bottom of every newsletter.`,
    };
}

// Bouwt de "nieuwe resource"-broadcast (concept) in huisstijl.
// Geeft { subject, previewText, html } terug; de uitschrijflink wordt door
// Resend ingevuld via de {{{RESEND_UNSUBSCRIBE_URL}}}-placeholder.
export function resourceBroadcast({ title, description, thumbnail, slug, categoryLabel }) {
    const url = `${SITE_URL}/resources/${slug}`;
    const eyebrow = ['Nieuwe resource', categoryLabel].filter(Boolean).join(' &middot; ');
    const imageHtml = thumbnail
        ? `<a href="${url}" style="text-decoration:none;"><img src="${SITE_URL}${thumbnail}" alt="" width="488" style="width:100%;max-width:488px;border-radius:12px;display:block;margin:0 0 20px;"></a>`
        : '';
    const html = emailLayout({
        preheader: description,
        bodyHtml: `
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${ACCENT};margin:0 0 12px;">${eyebrow}</div>
            ${imageHtml}
            ${resourceTitle(title)}
            <p style="margin:0 0 4px;">${description}</p>
            ${button(url, 'Lees de resource')}`,
        footerHtml: 'Je ontvangt deze mail omdat je je inschreef op de TriaCore AI nieuwsbrief.<br><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#64748b;text-decoration:underline;">Uitschrijven</a>',
    });
    return { subject: `Nieuw op TriaCore: ${title}`, previewText: description, html };
}

// Volledige mail rond een stuk body-HTML.
//   bodyHtml   — de inhoud (koppen, paragrafen, knop, afbeelding)
//   footerHtml — kleine voettekst (bv. uitschrijven). Leeg = standaardtekst.
//   preheader  — verborgen voorbeeldtekst in de inbox-lijst.
export function emailLayout({ bodyHtml, footerHtml = '', preheader = '' }) {
    return `<!DOCTYPE html>
<html lang="nl">
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
        <tr><td style="height:4px;background:${ACCENT};font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:30px 36px 6px;">
          <img src="${SITE_URL}/logo/triacore-mark.png" alt="" height="26" style="height:26px;width:auto;vertical-align:middle;display:inline-block;border:0;">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;letter-spacing:-0.3px;color:${INK};vertical-align:middle;margin-left:10px;">TriaCore<span style="color:${ACCENT};"> AI</span></span>
        </td></tr>
        <tr><td style="padding:12px 36px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${INK};">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:22px 36px;border-top:1px solid ${BORDER};font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${MUTED};">
          ${footerHtml || 'Je ontvangt deze mail omdat je je inschreef op de TriaCore AI nieuwsbrief.'}
        </td></tr>
      </table>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${MUTED};padding:16px;">${ADDRESS}</div>
    </td></tr>
  </table>
</body>
</html>`;
}
