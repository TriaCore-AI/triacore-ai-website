/* =============================================================
   Software op maat V2: het logo in 3D in de hero, zoals op de homepage.

   Dezelfde drie balken in geborsteld titanium, dezelfde studio die het metaal weerspiegelt, dezelfde
   rastervloer die in de verte in de mist verdwijnt. Het logo staat schuin, ademt heel licht, en draait
   een klein beetje mee met de muis en met het scrollen. Bij het openen draait het rustig in beeld.

   Waar het logo staat, leest de scène uit het vak #heroVisual: op de computer rechts naast de tekst,
   op een gsm erboven. Hoe licht de pagina al is, leest ze uit window.SOM.light (page.js).

   Een gewoon script, geen module: zo werkt het ook als je index.html rechtstreeks opent (file://).
   Three.js komt via de importmap in index.html, zoals op de homepage.
   ============================================================= */
(async function () {
'use strict';
const THREE = await import('three');

// ---------- Afstellen ----------
const SCENE = {
  logo: false,       // het logo in 3D. Uit sinds de video er staat (Lucas, 2026-10-08); true zet het terug
  dist: 12,          // de afstand van de camera tot het logo
  fov: 26,           // de kijkhoek, zoals op de homepage
  fill: 0.76,        // hoeveel van het vak het logo vult (0 tot 1)
  turn: -0.46,       // hoe schuin het logo staat (radialen, negatief = naar links gedraaid)
  tilt: 0.12,        // hoe ver het logo naar achter helt
  breathe: 0.05,     // hoe sterk het logo uit zichzelf licht beweegt
  mouse: 0.16,       // hoe sterk het meedraait met de muis
  scroll: 0.35,      // hoeveel extra draai bij het scrollen tot het einde van de hero
  arrive: 1.8,       // zo lang duurt het indraaien bij het openen, in seconden
  floor: 0.07,       // hoe zichtbaar de rastervloer is (0 tot 1)
};

// de maten van het logo, exact zoals in de scène van de homepage
const BAR_W = 2.9156, BAR_H = 0.4857, DX = 0.5758, DY = 1.00445;
const BARS = [{ x: -DX, y: DY }, { x: DX, y: 0 }, { x: -DX, y: -DY }];
const LOGO_W = 2 * DX + BAR_W, LOGO_H = 2 * DY + BAR_H;
const DEPTH = 0.2, BEVEL = 0.035;

const canvas = document.getElementById('gl');
const hero = document.getElementById('hero');
const visual = document.getElementById('heroVisual');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rad = THREE.MathUtils.degToRad;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();

// een donkere studio met lichtstroken: dat is wat het metaal weerspiegelt
const studio = new THREE.Scene();
studio.background = new THREE.Color(0x06090f);
const strip = (w, h, k, x, y, z) => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k), side: THREE.DoubleSide }));
  m.position.set(x, y, z);
  m.lookAt(0, 0, 0);
  studio.add(m);
};
strip(14, 0.9, 7, 0, 6, 3);
strip(0.8, 9, 4.5, -7, 0.5, 2);
strip(0.6, 9, 3, 7.5, 0, -1);
strip(18, 2.5, 1.3, 0, -6, 5);
strip(5, 3.5, 2.2, 0, 1, 9);
const env = new THREE.PMREMGenerator(renderer).fromScene(studio, 0.02).texture;

// de drie balken: afgeronde staven met een fijne afschuining
const shape = (() => {
  const w = BAR_W - 2 * BEVEL, h = BAR_H - 2 * BEVEL, r = h / 2, x0 = -w / 2 + r, x1 = w / 2 - r;
  const s = new THREE.Shape();
  s.moveTo(x0, -r);
  s.lineTo(x1, -r);
  s.absarc(x1, 0, r, -Math.PI / 2, Math.PI / 2, false);
  s.lineTo(x0, r);
  s.absarc(x0, 0, r, Math.PI / 2, Math.PI * 1.5, false);
  return s;
})();
const barGeo = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: true, bevelThickness: BEVEL, bevelSize: BEVEL, bevelSegments: 10, curveSegments: 48 });
barGeo.center();
const metal = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color('#F2F2F2'), metalness: 1, roughness: 0.3,
  anisotropy: 0.45, envMap: env, envMapIntensity: 1.2, fog: false, transparent: true, opacity: 0,
});
const logo = new THREE.Group();
const bars = BARS.map(b => {
  const m = new THREE.Mesh(barGeo, metal);
  m.position.set(b.x, b.y, 0);
  logo.add(m);
  return m;
});
scene.add(logo);
logo.visible = SCENE.logo;

// de rastervloer, zoals op de homepage: ze verdwijnt in de verte in de mist
scene.fog = new THREE.Fog(0x0B1220, SCENE.dist - 2, SCENE.dist + 40);
const grid = new THREE.GridHelper(160, 160, 0xffffff, 0xffffff);
grid.material.transparent = true;
grid.material.depthWrite = false;
grid.material.opacity = SCENE.floor;
scene.add(grid);

const camera = new THREE.PerspectiveCamera(SCENE.fov, 1, 0.05, 400);
camera.position.set(0, 0, SCENE.dist);
camera.lookAt(0, 0, 0);

// ---------- Waar het logo staat: het vak #heroVisual, omgerekend naar de scène ----------
let W = 1, H = 1, halfH = 1, halfW = 1, home = { x: 0, y: 0, s: 1 };
function layout() {
  const r = hero.getBoundingClientRect();
  W = Math.max(1, r.width); H = Math.max(1, r.height);
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  halfH = SCENE.dist * Math.tan(rad(SCENE.fov / 2));
  halfW = halfH * camera.aspect;
  const v = visual.getBoundingClientRect();
  const cx = v.left - r.left + v.width / 2, cy = v.top - r.top + v.height / 2;
  const bw = (v.width / W) * 2 * halfW, bh = (v.height / H) * 2 * halfH;
  home = {
    x: (cx / W * 2 - 1) * halfW,
    y: (1 - cy / H * 2) * halfH,
    s: Math.min(bw / LOGO_W, bh / (LOGO_H * 1.5)) * SCENE.fill,
  };
  // de vloer net onder het logo, en altijd onder de camera (anders wordt ze een plafond)
  grid.position.y = Math.min(home.y - LOGO_H * home.s * 0.95, -halfH * 0.35);
}
new ResizeObserver(layout).observe(hero);
layout();

// ---------- De muis: het logo draait een klein beetje mee ----------
const pointer = { x: 0, y: 0 }, follow = { x: 0, y: 0 };
addEventListener('pointermove', e => {
  pointer.x = (e.clientX / innerWidth) * 2 - 1;
  pointer.y = (e.clientY / innerHeight) * 2 - 1;
}, { passive: true });

// ---------- Elke frame ----------
const t0 = performance.now();
let fogStyle = '';
const easeOut = x => 1 - Math.pow(1 - x, 3);
function frame(now) {
  requestAnimationFrame(frame);
  const light = (window.SOM && window.SOM.light) || 0;
  // helemaal licht en de hero uit beeld: niets meer te tekenen
  if (light >= 0.999 && hero.getBoundingClientRect().bottom < 0) return;
  const t = (now - t0) / 1000;
  const a = reduce ? 1 : easeOut(Math.min(1, t / SCENE.arrive));   // het indraaien bij het openen
  const calm = reduce ? 0 : 1;
  follow.x += (pointer.x - follow.x) * 0.05;
  follow.y += (pointer.y - follow.y) * 0.05;
  // hoe ver de hero al weggescrold is (0 bovenaan, 1 aan het einde)
  const p = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(1, H - innerHeight * 0.3)));

  logo.position.set(home.x, home.y + p * halfH * 0.25, 0);
  logo.scale.setScalar(home.s * (0.94 + 0.06 * a));
  logo.rotation.y = SCENE.turn + (1 - a) * -0.9 + calm * (Math.sin(t * 0.25) * SCENE.breathe + follow.x * SCENE.mouse) + p * SCENE.scroll;
  logo.rotation.x = SCENE.tilt + calm * (Math.sin(t * 0.21 + 1) * SCENE.breathe * 0.5 + follow.y * SCENE.mouse * 0.5);
  // de balken ademen elk een beetje anders, zodat het logo leeft
  bars.forEach((b, i) => { b.position.z = calm * Math.sin(t * 0.6 + i * 1.7) * 0.05; });
  metal.opacity = a;
  grid.material.opacity = SCENE.floor * a;
  // de mist heeft altijd de kleur van de pagina: zo lost de verre vloer op in de achtergrond, ook tijdens de overgang
  if (window.SOM && window.SOM.page && window.SOM.page !== fogStyle) { fogStyle = window.SOM.page; scene.fog.color.setStyle(fogStyle); }
  renderer.render(scene, camera);
}
requestAnimationFrame(frame);
})().catch(err => console.error(err));
