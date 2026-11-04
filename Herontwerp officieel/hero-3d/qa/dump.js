// Haalt de shaders uit kern.js en scenes.js, zodat render.py exact dezelfde code test als de browser
const fs = require('fs'), path = require('path');
const base = 'C:/TriaCore AI/Website/TriaCore AI gemini 3.1 website/Herontwerp officieel/hero-3d';
eval(fs.readFileSync(path.join(base, 'kern.js'), 'utf8'));
eval(fs.readFileSync(path.join(base, 'scenes.js'), 'utf8'));
const uit = globalThis.TCScenes.map((s) => ({ id: s.id, naam: s.naam, ro: s.ro, ta: s.ta, lens: s.lens, licht: s.licht, muis: s.muis, fs: globalThis.TCKern.bouw(s), dp: s.deeltjes ? globalThis.TCKern.bouwDeeltjes(s) : null }));
fs.writeFileSync(path.join(__dirname, 'scenes.json'), JSON.stringify(uit));
console.log(uit.length, 'scènes');
