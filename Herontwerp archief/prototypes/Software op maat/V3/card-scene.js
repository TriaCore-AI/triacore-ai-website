/* =============================================================
   Software op maat V3: de rastervloer in de kaart "Wat er nog kan.", zoals in de hero.

   Dezelfde vloer van witte lijnen die in de verte in de mist verdwijnt, hier in de navy kaart. De camera
   staat net boven de vloer en kijkt naar de horizon, zodat de getypte naam erboven lijkt te zweven.
   De vloer staat stil (Lucas: "het moet niet bewegen"); alleen bij hover wordt ze zacht iets helderder.

   Een gewoon script, geen module: zo werkt het ook als je index.html rechtstreeks opent (file://).
   Three.js komt via de importmap in index.html.
   ============================================================= */
(async function () {
'use strict';
const THREE = await import('three');

// ---------- Afstellen ----------
const CARD = {
  floor: 0.13,       // hoe zichtbaar de vloer is (0 tot 1)
  hover: 0.22,       // hoe zichtbaar bij hover
  height: 1.5,       // hoe hoog de camera boven de vloer staat
  horizon: 0.42,     // waar de horizon ligt, van boven gemeten (0 = bovenrand, 1 = onderrand van de kaart)
  fov: 42,           // de kijkhoek
  far: 17,           // hoe ver je de vloer ziet voor ze in de mist verdwijnt (verder = een strook aan de horizon)
  fog: '#152036',    // de kleur waarin de vloer verdwijnt: het navy van de kaart rond de horizon (anders een donkere band)
};

const card = document.querySelector('.path-dark');
const canvas = document.getElementById('cardGl');
const btn = document.getElementById('pathMore');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(CARD.fog, 2, CARD.far);
const grid = new THREE.GridHelper(40, 40, 0xffffff, 0xffffff);   // net verder dan de mist reikt
grid.material.transparent = true;
grid.material.depthWrite = false;
grid.material.opacity = CARD.floor;
// de vloer begint net voor de camera (z = 6): lijnen die achter de camera doorlopen, tekent niet elke browser
grid.position.z = -16;
scene.add(grid);

// de camera kijkt zo dat de horizon op CARD.horizon van de kaarthoogte ligt
const camera = new THREE.PerspectiveCamera(CARD.fov, 1, 0.05, 200);
camera.position.set(0, CARD.height, 6);
camera.rotation.set(THREE.MathUtils.degToRad((CARD.horizon - 0.5) * CARD.fov), 0, 0);

const draw = () => renderer.render(scene, camera);
function layout() {
  const w = Math.max(1, card.clientWidth), h = Math.max(1, card.clientHeight);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  draw();
}
new ResizeObserver(layout).observe(card);
layout();

// ---------- Bij hover: de vloer wordt zacht iets helderder, en daarna wordt er niets meer getekend ----------
let glow = CARD.floor, glowTo = CARD.floor, raf = 0;
function fade() {
  glow += (glowTo - glow) * 0.12;
  if (Math.abs(glowTo - glow) < 0.002) glow = glowTo;
  grid.material.opacity = glow;
  draw();
  raf = glow === glowTo ? 0 : requestAnimationFrame(fade);
}
const glowTowards = v => { glowTo = v; if (!raf) raf = requestAnimationFrame(fade); };
btn.addEventListener('pointerenter', () => glowTowards(CARD.hover));
btn.addEventListener('pointerleave', () => glowTowards(CARD.floor));
})().catch(err => console.error(err));
