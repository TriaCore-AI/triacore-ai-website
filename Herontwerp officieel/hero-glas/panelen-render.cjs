// Achtergrond "panelenruimte" voor de hero van Oplossingen (v2): een lichte architectuurruimte met een
// achterwand vol panelen in verschillende maten (fijne witte voegen), glazen panelen aan de zijkanten, een
// tegelvloer in perspectief en zonlicht dat van links in banen over de vloer en de wand valt. Grijsgroen.
// Gebruik: node panelen-render.cjs <projectmap> <uit.png|uit.webp> '<json-opties>'
const path = require('path');
const sharp = require(path.join(process.argv[2], 'node_modules', 'sharp'));
const out = process.argv[3];
const P = JSON.parse(process.argv[4] || '{}');
const W = P.W || 2400, H = P.H || 1350;
const k = W / 2400;
const hor = (P.hor ?? 0.74) * H; // waar wand en vloer elkaar raken
const vpX = (P.vpX ?? 0.52) * W; // verdwijnpunt van de vloer
const vpY = hor - 0.42 * H;

const lijn = (x1, y1, x2, y2, op = 0.85, dik = 1.3) =>
  `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#fff" stroke-width="${(dik * k).toFixed(2)}" stroke-opacity="${op}"/>` +
  // Een haarfijne schaduw naast elke voeg geeft diepte
  `<line x1="${(x1 + 1.4 * k).toFixed(1)}" y1="${(y1 + 1.4 * k).toFixed(1)}" x2="${(x2 + 1.4 * k).toFixed(1)}" y2="${(y2 + 1.4 * k).toFixed(1)}" stroke="#5f7468" stroke-width="${(0.8 * k).toFixed(2)}" stroke-opacity="${(op * 0.12).toFixed(3)}"/>`;

// --- Achterwand: panelen in verschillende maten (fracties van W en H) ---
let wand = '';
const V = [0.03, 0.12, 0.27, 0.5, 0.7, 0.8, 0.88, 0.96]; // lange verticale voegen
V.forEach((x, i) => wand += lijn(x * W, 0, x * W, hor, i % 3 === 0 ? 0.6 : 0.85));
const Hz = [0.035, 0.23, 0.505, 0.555]; // doorlopende horizontale voegen
Hz.forEach((y) => wand += lijn(0, y * H, W, y * H, 0.8));
// Kortere voegen die enkel een paar panelen verdelen, zoals in echte wandbekleding
const kort = [
  [0.12, 0.27, 0.39], [0.8, 0.96, 0.39], [0.5, 0.7, 0.13], [0.27, 0.5, 0.64], [0.7, 0.88, 0.64],
  [0.03, 0.12, 0.64], [0.88, 0.96, 0.2]
];
kort.forEach(([a, b, y]) => wand += lijn(a * W, y * H, b * W, y * H, 0.75));
[[0.38, 0.23, 0.505], [0.6, 0.555, 0.74], [0.17, 0.555, 0.74], [0.92, 0.39, 0.505]].forEach(([x, a, b]) => wand += lijn(x * W, a * H, x * W, b * H, 0.7));

// --- Vloer: tegels in perspectief ---
let vloer = '';
for (let i = -14; i <= 14; i++) {
  const xb = vpX + i * 0.13 * W; // waar de lijn de onderrand raakt
  // Van de horizon tot onderaan, op de lijn naar het verdwijnpunt
  const t0 = (hor - vpY) / (H - vpY);
  const x0 = vpX + (xb - vpX) * t0;
  vloer += lijn(x0, hor, xb, H, 0.95, 1.3);
}
// Dwarse voegen: dichter bij de horizon, verder uit elkaar naar voren
for (let j = 0; j <= 14; j++) {
  // Echte diepte: de afstand tussen de voegen krimpt naar de horizon toe
  const y = hor + (H - hor) * 1.12 / (1 + j * 0.55);
  if (y < H) vloer += lijn(0, y, W, y, 0.85 - j * 0.03, Math.max(0.7, 1.6 - j * 0.07));
}

// --- Zonlicht: banen over de vloer, schuin van links ---
let zon = '';
for (let i = 0; i < 6; i++) {
  const y = hor + (0.04 + i * 0.045 + i * i * 0.004) * H;
  const h = (0.012 + i * 0.004) * H;
  zon += `<polygon points="${-0.05 * W},${y + 0.05 * H} ${1.05 * W},${y - 0.04 * H} ${1.05 * W},${y - 0.04 * H + h * 0.8} ${-0.05 * W},${y + 0.05 * H + h * 1.4}" fill="url(#zonbaan)" opacity="${(0.85 - i * 0.07).toFixed(2)}" filter="url(#zacht)"/>`;
}

// --- Glazen panelen aan de zijkanten met schuine weerspiegelingen ---
const glas = (x, w, links) => {
  const sx = links ? x + w : x;
  return `<rect x="${x}" y="0" width="${w}" height="${hor + 0.02 * H}" fill="url(#glas${links ? 'L' : 'R'})"/>` +
    lijn(sx, 0, sx, hor + 0.02 * H, 0.95, 1.6) +
    `<polygon points="${x},${0.62 * H} ${x + w},${0.48 * H} ${x + w},${0.52 * H} ${x},${0.67 * H}" fill="#fff" opacity="0.28" filter="url(#zacht)"/>` +
    `<polygon points="${x},${0.3 * H} ${x + w},${0.16 * H} ${x + w},${0.18 * H} ${x},${0.32 * H}" fill="#fff" opacity="0.18" filter="url(#zacht)"/>`;
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs>
  <linearGradient id="muur" x1="0" y1="0" x2="1" y2="0.3">
    <stop offset="0" stop-color="#eef2ef"/>
    <stop offset="0.3" stop-color="#d9e0db"/>
    <stop offset="0.75" stop-color="#c6cfc9"/>
    <stop offset="1" stop-color="#d3dad5"/>
  </linearGradient>
  <linearGradient id="muurV" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity="0.04"/>
    <stop offset="0.7" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0.25"/>
  </linearGradient>
  <linearGradient id="grond" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#d3dbd6"/>
    <stop offset="0.3" stop-color="#e1e7e3"/>
    <stop offset="1" stop-color="#eef2ef"/>
  </linearGradient>
  <linearGradient id="glasL" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0.55"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0.18"/>
  </linearGradient>
  <linearGradient id="glasR" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0.12"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0.38"/>
  </linearGradient>
  <!-- Een schuine baan zonlicht op de wand -->
  <linearGradient id="straal" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0.7"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="zonbaan" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="0.55" stop-color="#fff" stop-opacity="0.75"/><stop offset="1" stop-color="#fff" stop-opacity="0.1"/></linearGradient>
  <filter id="zacht" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="${(4 * k).toFixed(1)}"/></filter>
  <filter id="wolk" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${(0.05 * H).toFixed(1)}"/></filter>
  <clipPath id="vloervlak"><rect x="0" y="${hor}" width="${W}" height="${H - hor}"/></clipPath>
</defs>
<!-- Wand -->
<rect width="${W}" height="${hor}" fill="url(#muur)"/>
<rect width="${W}" height="${hor}" fill="url(#muurV)"/>
<polygon points="0,${0.05 * H} ${0.42 * W},${0.74 * H} ${0.3 * W},${0.74 * H} 0,${0.32 * H}" fill="url(#straal)" opacity="0.35" filter="url(#wolk)"/>
<ellipse cx="${0.05 * W}" cy="${0.55 * H}" rx="${0.07 * W}" ry="${0.38 * H}" fill="#fff" opacity="0.6" filter="url(#wolk)"/>
${wand}
<!-- Vloer -->
<g clip-path="url(#vloervlak)">
  <rect x="0" y="${hor}" width="${W}" height="${H - hor}" fill="url(#grond)"/>
  ${zon}
  ${vloer}
</g>
<!-- Plint: de lijn waar wand en vloer elkaar raken -->
<rect x="0" y="${hor - 2 * k}" width="${W}" height="${4 * k}" fill="#fff" opacity="0.9" filter="url(#zacht)"/>
<line x1="0" y1="${hor}" x2="${W}" y2="${hor}" stroke="#b8c4bc" stroke-width="${(1 * k).toFixed(2)}"/>
<!-- Glazen panelen -->
${glas(0, 0.07 * W, true)}
${glas(0.935 * W, 0.065 * W, false)}
</svg>`;
const img = sharp(Buffer.from(svg));
(out.endsWith('.webp') ? img.webp({ quality: P.q || 88 }) : img.png()).toFile(out).then((i) => console.log('OK', out, i.size));


