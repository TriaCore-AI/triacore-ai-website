// Welke schijf ligt onder een punt op het scherm? Dezelfde berekening als in basis.js
const fs = require('fs'), path = require('path');
const base = 'C:/TriaCore AI/Website/TriaCore AI gemini 3.1 website/Herontwerp officieel/hero-3d';
eval(fs.readFileSync(path.join(base, 'kern.js'), 'utf8'));
eval(fs.readFileSync(path.join(base, 'scenes.js'), 'utf8'));
const sc = globalThis.TCScenes.find((s) => s.id === 'schijven-raam');
const W = 1600, H = 860;
const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
function id(px, py) {
  const ux = (px - W / 2) / H, uy = (H / 2 - py) / H;
  const ro = sc.ro, f = norm([sc.ta[0] - ro[0], sc.ta[1] - ro[1], sc.ta[2] - ro[2]]);
  const ri = norm([-f[2], 0, f[0]]);
  const om = [ri[1] * f[2] - ri[2] * f[1], ri[2] * f[0] - ri[0] * f[2], ri[0] * f[1] - ri[1] * f[0]];
  return sc.kaarten.raak(ro, norm([0, 1, 2].map((i) => ux * ri[i] + uy * om[i] + sc.lens * f[i])));
}
for (const [x, y] of [[1000, 680], [400, 680], [1400, 680], [800, 300], [800, 100]]) console.log(x, y, '->', id(x, y));
