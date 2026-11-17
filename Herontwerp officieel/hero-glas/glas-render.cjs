// Achtergrond "geribbeld glas": verticale banen, een schuine lichtstreep die per baan verspringt, en korrel.
// Gebruik: node glas-render.cjs <projectmap> <uit.png|uit.webp> '<json-opties>'
const path = require('path');
(async () => {
const sharp = require(path.join(process.argv[2], 'node_modules', 'sharp'));
const out = process.argv[3];
const P = JSON.parse(process.argv[4] || '{}');
const W = P.W || 2400, H = P.H || 1400;
const banen = P.banen || 22;
const donker = P.donker || '#2c5235';
const licht = P.licht || '#b9d2bf';
const sigma = (P.sigma || 0.2) * H; // breedte van de lichtstreep
const helling = P.helling ?? 0.55; // hoeveel de streep zakt per breedte (deel van H)
const start = (P.start ?? 0.12) * H; // hoogte van de streep links
const korrel = P.korrel ?? 0.09;
const piek = P.piek ?? 1; // hoe sterk de streep oplicht (0 tot 1)
const cw = W / banen;

// Kleur mengen
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const meng = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; };

let defs = '', rects = '';
for (let i = 0; i < banen; i++) {
  const x = i * cw;
  // Midden van de streep voor deze baan (trapsgewijs), met een kleine onregelmatigheid zoals in echt glas
  const yc = start + helling * H * (i / (banen - 1)) + (P.ruis ? Math.sin(i * 2.3) * 0.02 * H : 0);
  const stops = [];
  for (let k = -3; k <= 3; k += 0.25) {
    const y = yc + k * sigma;
    const t = piek * Math.exp(-(k * k) / 2);
    stops.push(`<stop offset="${(y / H).toFixed(4)}" stop-color="${meng(donker, licht, t)}"/>`);
  }
  defs += `<linearGradient id="g${i}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${H}">${stops.sort((a, b) => parseFloat(a.match(/offset="([^"]+)"/)[1]) - parseFloat(b.match(/offset="([^"]+)"/)[1])).join('')}</linearGradient>`;
  rects += `<rect x="${x.toFixed(2)}" y="0" width="${(cw + 0.6).toFixed(2)}" height="${H}" fill="url(#g${i})"/>`;
}
// Per baan een zachte schaduw links en glans rechts, zodat het als glas leest
defs += `<linearGradient id="rib" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="${P.schaduw ?? 0.08}"/><stop offset="0.35" stop-color="#000" stop-opacity="0"/><stop offset="0.8" stop-color="#fff" stop-opacity="${P.glans ?? 0.06}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
let ribs = '';
for (let i = 0; i < banen; i++) ribs += `<rect x="${(i * cw).toFixed(2)}" y="0" width="${(cw + 0.6).toFixed(2)}" height="${H}" fill="url(#rib)"/>`;
defs += `<filter id="k" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${defs}</defs>${rects}${ribs}</svg>`;
let img = sharp(Buffer.from(svg));
const ruisBuf = Buffer.alloc(W * H * 4); for (let j = 0; j < W * H; j++) { const v = Math.random() < 0.5 ? 0 : 255; ruisBuf[j*4] = v; ruisBuf[j*4+1] = v; ruisBuf[j*4+2] = v; ruisBuf[j*4+3] = Math.round(Math.random() * 255 * korrel); }
img = sharp(await img.png().toBuffer()).composite([{ input: ruisBuf, raw: { width: W, height: H, channels: 4 }, blend: 'over' }]);
if (P.blur) img = img.blur(P.blur);
(out.endsWith('.webp') ? img.webp({ quality: P.q || 82 }) : img.png()).toFile(out).then((i) => console.log('OK', out, i.size));
})();

