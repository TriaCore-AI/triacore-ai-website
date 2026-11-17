// Testrender van de nieuwe hero-achtergrond (muur met raamlicht + vloer), zelfde wiskunde als de shader
const path = require('path');
const sharp = require(path.join(process.argv[2], 'node_modules', 'sharp'));
const out = process.argv[3];
const P = JSON.parse(process.argv[4] || '{}');
const W = P.W || 960, H = P.H || 540;
const YF = P.yf ?? -0.95;      // hoogte van de vloer
const T = 8;
const n3 = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
const L3 = n3([-0.55, 0.6, 0.58]);
const fract = (x) => x - Math.floor(x);
const mod = (x, m) => x - m * Math.floor(x / m);
const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function gobo(p) {
  const t = (6 - p[2]) / L3[2];
  const qx = p[0] + L3[0] * t, qy = p[1] + L3[1] * t;
  const u = qx + qy * 0.85 + T * 0.014;
  const v = qy - qx * 0.1;
  const w = 0.05 + 0.006 * t;
  const paan = ss(-w, w, 0.92 - Math.abs(mod(u, 2.6) - 1.3));
  const raam = 1 - ss(-w * 2, w * 2, Math.abs(u - 2.2) - 3.4);
  const dwars = ss(-w, w, Math.abs(mod(v, 3.2) - 1.6) - 0.05);
  return paan * raam * dwars;
}
const buf = Buffer.alloc(W * H * 3);
for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
  const uv = [(i - 0.5 * W) / H, ((H - j) - 0.5 * H) / H];
  const ro = [0, 0.35, 14];
  const f = n3([0 - ro[0], 0.2 - ro[1], 0 - ro[2]]);
  const r = n3([-f[2], 0, f[0]]);
  const up = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  const rd = n3([0, 1, 2].map((k) => uv[0] * r[k] + uv[1] * up[k] + 2.3 * f[k]));
  const tW = (-1.2 - ro[2]) / rd[2];
  const tF = rd[1] < 0 ? (YF - ro[1]) / rd[1] : 1e9;
  let col;
  if (tF < tW) {
    const p = ro.map((x, k) => x + rd[k] * tF);
    const dif = L3[1];
    const hemel = 0.75;
    const ao = 1 - (P.ao ?? 0.22) * Math.exp(-(p[2] + 1.2) * 1.4);
    const lin = [1, 0.985, 0.96].map((c) => c * 0.36 * dif * gobo(p)).map((x, k) => x + [0.965, 0.985, 1][k] * 0.86 * (0.97 + 0.03 * hemel) * ao);
    col = lin.map((x) => x * (P.alb ?? 0.915));
    // Naar voren lost de vloer op in het papier
    const papier = [0.961, 0.969, 0.965].map((x) => Math.pow(x, 2.2));
    const m = ss(P.f0 ?? 3, P.f1 ?? 10, p[2]);
    col = col.map((x, k) => x + (papier[k] - x) * m);
  } else {
    const p = ro.map((x, k) => x + rd[k] * tW);
    const hemel = 0.5 + 0.5 * 0.85;
    const ao = 1 - (P.aow ?? 0.12) * Math.exp(-(p[1] - YF) * 2.2);
    const lin = [1, 0.985, 0.96].map((c) => c * 0.36 * L3[2] * gobo(p)).map((x, k) => x + [0.965, 0.985, 1][k] * 0.86 * (0.97 + 0.03 * hemel) * ao + [0.98, 1, 0.97][k] * 0.08 * Math.max(0, 0.5 - 0.5 * L3[2]));
    col = lin.map((x) => x * 0.9);
  }
  col = col.map((x) => Math.pow(Math.min(1, Math.max(0, x)), 1 / 2.2));
  const o = (j * W + i) * 3;
  buf[o] = col[0] * 255; buf[o + 1] = col[1] * 255; buf[o + 2] = col[2] * 255;
}
sharp(buf, { raw: { width: W, height: H, channels: 3 } }).png().toFile(out).then(() => console.log('OK', out));
