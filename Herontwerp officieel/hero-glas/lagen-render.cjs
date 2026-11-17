// Achtergrond "zijden lagen" voor de hero van Oplossingen (v2): grote, zachte lagen die als zijde over elkaar
// vallen, in bogen van linksboven naar rechtsonder over de volle breedte. Elke laag heeft een scherpe witte rand
// met een zachte schaduw eronder. Wit met een vleugje saliegroen.
// Gebruik: node lagen-render.cjs <projectmap> <uit.png|uit.webp> '<json-opties>'
const path = require('path');
const sharp = require(path.join(process.argv[2], 'node_modules', 'sharp'));
const out = process.argv[3];
const P = JSON.parse(process.argv[4] || '{}');
const W = P.W || 2400, H = P.H || 1350;
const k = W / 2400;
const pt = (x, y) => `${(x * W).toFixed(1)} ${(y * H).toFixed(1)}`;

// Randen van de lagen, van achter naar voor: [start, controle 1, controle 2, einde] in fracties van W en H.
// Ze buigen allemaal naar linksonder door, zoals een doek dat valt
const RANDEN = [
  { p: [[0.18, -0.05], [0.3, 0.42], [0.62, 0.5], [1.05, 0.46]], vul: 0.35 },
  { p: [[0.0, -0.05], [0.1, 0.55], [0.55, 0.72], [1.05, 0.78]], vul: 0.45 },
  { p: [[-0.05, 0.12], [0.1, 0.62], [0.62, 0.78], [1.05, 0.98]], vul: 0.5 },
  { p: [[-0.05, 0.22], [0.16, 0.62], [0.36, 0.9], [0.58, 1.1]], vul: 0.55 }
];
// Losse dunne lijnen zonder vlak, voor detail (zoals de dubbele lijn in het voorbeeld)
const LIJNEN = [
  [[0.01, -0.05], [0.07, 0.6], [0.5, 0.8], [1.05, 0.86]],
  [[0.26, -0.05], [0.36, 0.38], [0.7, 0.44], [1.05, 0.4]]
];

const curve = ([a, b, c, d]) => `M ${pt(...a)} C ${pt(...b)}, ${pt(...c)}, ${pt(...d)}`;
// Het vlak onder een rand: de curve en dan langs rechtsonder en linksonder terug
const vlak = (p) => `${curve(p)} L ${pt(1.1, 1.2)} L ${pt(-0.1, 1.2)} Z`;

let lagen = '';
RANDEN.forEach((r, i) => {
  const d = curve(r.p);
  lagen += `<clipPath id="c${i}"><path d="${vlak(r.p)}"/></clipPath>`;
  lagen += `<g clip-path="url(#c${i})">`;
  // Het vlak zelf: iets lichter bovenaan, zodat elke laag op de vorige ligt
  lagen += `<path d="${vlak(r.p)}" fill="url(#laag)" opacity="${r.vul}"/>`;
  // Zachte schaduw net onder de rand, binnen het vlak
  lagen += `<path d="${d}" fill="none" stroke="#5c7266" stroke-width="${(46 * k).toFixed(1)}" stroke-opacity="0.07" filter="url(#schaduw)" transform="translate(${(-6 * k).toFixed(1)} ${(14 * k).toFixed(1)})"/>`;
  lagen += `</g>`;
  // Scherpe witte rand met een fijne gloed
  lagen += `<path d="${d}" fill="none" stroke="#fff" stroke-width="${(7 * k).toFixed(1)}" stroke-opacity="0.7" filter="url(#gloed)"/>`;
  lagen += `<path d="${d}" fill="none" stroke="#fff" stroke-width="${(1.8 * k).toFixed(2)}"/>`;
});
LIJNEN.forEach((p) => {
  lagen += `<path d="${curve(p)}" fill="none" stroke="#fff" stroke-width="${(1.3 * k).toFixed(2)}" stroke-opacity="0.95"/>`;
  lagen += `<path d="${curve(p)}" fill="none" stroke="#5c7266" stroke-width="${(0.8 * k).toFixed(2)}" stroke-opacity="0.08" transform="translate(${(-1.5 * k).toFixed(1)} ${(2 * k).toFixed(1)})"/>`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs>
  <linearGradient id="grond" x1="0" y1="0" x2="0.6" y2="1">
    <stop offset="0" stop-color="#fdfefd"/>
    <stop offset="0.5" stop-color="#f3f6f4"/>
    <stop offset="1" stop-color="#dfe6e1"/>
  </linearGradient>
  <linearGradient id="laag" x1="0" y1="0" x2="0.4" y2="1">
    <stop offset="0" stop-color="#ffffff"/>
    <stop offset="0.45" stop-color="#f1f5f2"/>
    <stop offset="1" stop-color="#e2e9e4"/>
  </linearGradient>
  <filter id="schaduw" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="${(18 * k).toFixed(1)}"/></filter>
  <filter id="gloed" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="${(3 * k).toFixed(1)}"/></filter>
  <filter id="wolk" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${(0.08 * H).toFixed(1)}"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#grond)"/>
<!-- Licht van rechtsboven -->
<ellipse cx="${0.72 * W}" cy="${0.12 * H}" rx="${0.4 * W}" ry="${0.3 * H}" fill="#fff" opacity="0.9" filter="url(#wolk)"/>
${lagen}
</svg>`;
const img = sharp(Buffer.from(svg));
(out.endsWith('.webp') ? img.webp({ quality: P.q || 90 }) : img.png()).toFile(out).then((i) => console.log('OK', out, i.size));

