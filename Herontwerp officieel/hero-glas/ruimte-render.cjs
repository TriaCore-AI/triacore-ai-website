// Achtergrond "lichte ruimte" voor de hero van Oplossingen (v2): een helder gewelf, een wand met scherpe
// lichtlijnen die in een boog van links naar rechts lopen, een horizon en een glanzende vloer met een zwakke
// spiegeling. Wit met een vleugje saliegroen. Het dal van de boog ligt links van het midden; rechts komt de
// boog hoger uit dan links.
// Gebruik: node ruimte-render.cjs <projectmap> <uit.png|uit.webp> '<json-opties>'
const path = require('path');
const sharp = require(path.join(process.argv[2], 'node_modules', 'sharp'));
const out = process.argv[3];
const P = JSON.parse(process.argv[4] || '{}');
const W = P.W || 2400, H = P.H || 1350;
const k = W / 2400; // schaal voor lijndiktes
const hor = (P.hor ?? 0.72) * H; // horizon
const dalX = (P.dalX ?? 0.4) * W; // waar het dal van de boog ligt
const dalY = (P.dalY ?? 0.56) * H; // hoogte van het dal
const links = (P.links ?? 0.4) * H; // hoogte van de boog aan de linkerrand
const rechts = (P.rechts ?? 0.24) * H; // hoogte van de boog aan de rechterrand (hoger)
const N = P.strepen || 30;
const groen = '98,143,105';

// Gewicht 0 in het dal, 1 aan de rand, met een zachte bodem (macht > 1)
const gewicht = (x) => {
  const u = x < dalX ? (dalX - x) / dalX : (x - dalX) / (W - dalX);
  return Math.pow(Math.min(1, u), 1.75);
};
// De boog op afstand t (0 = bovenrand, 1 = horizon): aan de randen ruimer verdeeld dan in het dal
const lijnY = (x, t) => {
  const g = gewicht(x);
  const rand = x < dalX ? links : rechts;
  const top = dalY + (rand - dalY) * g;
  return top + (hor - top) * t * 0.94;
};
const pad = (t, dy = 0) => {
  let d = '';
  for (let i = 0; i <= 160; i++) {
    const x = -0.02 * W + (i / 160) * 1.04 * W;
    d += `${i ? 'L' : 'M'} ${x.toFixed(1)} ${(lijnY(x, t) + dy).toFixed(1)} `;
  }
  return d;
};

// Lichtlijnen: een vaste, licht onregelmatige verdeling met elk een eigen sterkte. Elke vierde lijn is
// helderder, enkele dragen een vleugje groen
let lijnen = '';
let spiegel = '';
for (let i = 1; i <= N; i++) {
  const t = Math.pow(i / (N + 1), 1.15);
  const sterk = i % 4 === 1;
  const op = (sterk ? 1 : 0.7) * (1 - t * 0.35);
  const dik = (sterk ? 1.7 : 1) * k * (1.25 - t * 0.5);
  if (sterk) lijnen += `<path d="${pad(t)}" fill="none" stroke="#fff" stroke-width="${(dik * 5).toFixed(2)}" stroke-opacity="${(op * 0.35).toFixed(2)}" filter="url(#gloed)"/>`;
  lijnen += `<path d="${pad(t)}" fill="none" stroke="url(#glans)" stroke-width="${dik.toFixed(2)}" stroke-opacity="${op.toFixed(2)}"/>`;
  if (i % 5 === 3) lijnen += `<path d="${pad(t, 2.2 * k)}" fill="none" stroke="rgb(${groen})" stroke-width="${(0.8 * k).toFixed(2)}" stroke-opacity="${(0.16 * (1 - t)).toFixed(2)}"/>`;
  // Spiegeling in de vloer: dezelfde lijn omgeklapt rond de horizon, platgedrukt en zwak
  if (sterk) spiegel += `<path d="${pad(t)}" fill="none" stroke="#fff" stroke-width="${(dik * 3).toFixed(2)}" stroke-opacity="${(op * 0.4).toFixed(2)}" transform="translate(0 ${hor}) scale(1 -0.45) translate(0 ${-hor})" filter="url(#wazig)"/>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs>
  <linearGradient id="lucht" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#d2dbd5"/>
    <stop offset="0.3" stop-color="#e8ede9"/>
    <stop offset="${(dalY / H).toFixed(3)}" stop-color="#fbfcfb"/>
    <stop offset="1" stop-color="#fdfefd"/>
  </linearGradient>
  <linearGradient id="wand" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#bccac1"/>
    <stop offset="0.55" stop-color="#cbd6cf"/>
    <stop offset="1" stop-color="#dae2dd"/>
  </linearGradient>
  <linearGradient id="vloer" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#c8d3cc"/>
    <stop offset="0.12" stop-color="#e4eae6"/>
    <stop offset="1" stop-color="#f3f6f4"/>
  </linearGradient>
  <!-- De lichtlijnen zijn het helderst rond het dal en vervagen naar de randen -->
  <linearGradient id="glans" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0.35"/>
    <stop offset="${(dalX / W).toFixed(3)}" stop-color="#fff" stop-opacity="1"/>
    <stop offset="0.75" stop-color="#fff" stop-opacity="0.85"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0.45"/>
  </linearGradient>
  <radialGradient id="vignet" cx="0.45" cy="0.5" r="0.8">
    <stop offset="0.5" stop-color="#7d8f84" stop-opacity="0"/>
    <stop offset="1" stop-color="#6f8377" stop-opacity="0.25"/>
  </radialGradient>
  <filter id="gloed" x="-5%" y="-50%" width="110%" height="200%"><feGaussianBlur stdDeviation="${(3 * k).toFixed(1)}"/></filter>
  <filter id="wazig" x="-5%" y="-50%" width="110%" height="200%"><feGaussianBlur stdDeviation="${(5 * k).toFixed(1)}"/></filter>
  <filter id="wolk" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${(0.05 * H).toFixed(1)}"/></filter>
  <clipPath id="wandvlak"><path d="${pad(0)} L ${1.02 * W} ${hor} L ${-0.02 * W} ${hor} Z"/></clipPath>
  <clipPath id="vloervlak"><rect x="0" y="${hor}" width="${W}" height="${H - hor}"/></clipPath>
</defs>
<rect width="${W}" height="${H}" fill="url(#lucht)"/>
<!-- Het licht in het gewelf, boven het dal -->
<ellipse cx="${dalX + 0.04 * W}" cy="${dalY - 0.16 * H}" rx="${0.32 * W}" ry="${0.18 * H}" fill="#fff" opacity="0.85" filter="url(#wolk)"/>

<!-- De wand onder de boog met de lichtlijnen -->
<g clip-path="url(#wandvlak)">
  <rect width="${W}" height="${H}" fill="url(#wand)"/>
  <ellipse cx="${dalX}" cy="${dalY + 0.05 * H}" rx="${0.3 * W}" ry="${0.08 * H}" fill="#fff" opacity="0.35" filter="url(#wolk)"/>
  ${lijnen}
</g>
<!-- Scherpe lichtrand bovenaan de boog -->
<path d="${pad(0)}" fill="none" stroke="#fff" stroke-width="${(8 * k).toFixed(1)}" stroke-opacity="0.7" filter="url(#gloed)"/>
<path d="${pad(0)}" fill="none" stroke="url(#glans)" stroke-width="${(2.2 * k).toFixed(1)}"/>

<!-- De vloer met een zwakke spiegeling en zachte lichtvlekken -->
<g clip-path="url(#vloervlak)">
  <rect x="0" y="${hor}" width="${W}" height="${H - hor}" fill="url(#vloer)"/>
  ${spiegel}
  <ellipse cx="${dalX - 0.02 * W}" cy="${hor + 0.17 * H}" rx="${0.2 * W}" ry="${0.045 * H}" fill="#fff" opacity="0.9" filter="url(#wolk)" transform="rotate(-5 ${dalX} ${hor + 0.17 * H})"/>
  <ellipse cx="${dalX + 0.25 * W}" cy="${hor + 0.07 * H}" rx="${0.16 * W}" ry="${0.02 * H}" fill="#fff" opacity="0.75" filter="url(#wolk)"/>
</g>
<!-- Horizon: een fijne donkere lijn met een glanslijn eronder -->
<line x1="0" y1="${hor}" x2="${W}" y2="${hor}" stroke="#bfcbc3" stroke-width="${(1.2 * k).toFixed(2)}"/>
<line x1="0" y1="${hor + 1.6 * k}" x2="${W}" y2="${hor + 1.6 * k}" stroke="url(#glans)" stroke-width="${(1.2 * k).toFixed(2)}" stroke-opacity="0.8"/>

<rect width="${W}" height="${H}" fill="url(#vignet)"/>
</svg>`;
const img = sharp(Buffer.from(svg));
(out.endsWith('.webp') ? img.webp({ quality: P.q || 88 }) : img.png()).toFile(out).then((i) => console.log('OK', out, i.size));

