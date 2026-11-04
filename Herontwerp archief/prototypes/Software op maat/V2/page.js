/* =============================================================
   Software op maat V2: het menu, en de overgang van blauw naar licht.

   Bij het openen is de pagina blauw, op elk scherm. Pas als het einde van de hero hoog genoeg in beeld
   komt, kleurt de hele pagina zacht naar het lichte grijs. Daarvoor zet dit script twee waarden:
     --page   de kleur van de pagina
     --light  0 (blauw) tot 1 (licht): de tekst van de hero vaagt ermee weg, de volgende sectie komt ermee op
   ============================================================= */
(function () {
  'use strict';

  // ---------- Afstellen ----------
  const LIGHT = {
    from: 0.92,   // de overgang begint als het einde van de hero op 92 % van de schermhoogte staat
    to: 0.30,     // en is af als het op 30 % staat
    dark: [11, 18, 32],     // het blauw (#0B1220, dezelfde kleur als de mist in de scène)
    bright: [242, 242, 242], // het lichte grijs van de site (#F2F2F2)
  };

  const body = document.body, root = document.documentElement;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = x => x * x * (3 - 2 * x);   // zacht vertrekken, zacht aankomen

  // ---------- Het menu ----------
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    if (open) menu.querySelector('a').focus({ preventScroll: true });
  }
  menuBtn.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  document.getElementById('menuScrim').addEventListener('click', () => setMenu(false));
  menu.querySelector('a[href="#top"]').addEventListener('click', () => setMenu(false));
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); }
  });

  // ---------- De video: in rust licht schuin, bij hover volgt ze de muis ----------
  const TILT = {
    rest: { rx: 4, ry: -10 },  // zo schuin staat de video in rust (graden)
    max: 7,                    // zo ver kantelt ze hoogstens als ze de muis volgt (graden)
  };
  const tilt = document.getElementById('videoTilt');
  const restTilt = () => {
    tilt.classList.remove('is-live');
    tilt.style.removeProperty('--rx');   // terug naar de rust uit page.css (ook die van de gsm)
    tilt.style.removeProperty('--ry');
  };
  if (matchMedia('(hover: hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tilt.addEventListener('pointermove', e => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tilt.classList.add('is-live');
      tilt.style.setProperty('--ry', `${(x * 2 * TILT.max).toFixed(2)}deg`);
      tilt.style.setProperty('--rx', `${(-y * 2 * TILT.max * 0.7).toFixed(2)}deg`);
    });
    tilt.addEventListener('pointerleave', restTilt);
  }

  // ---------- Wat we bouwen: een categorie open- en dichttikken (vooral voor een gsm) ----------
  // Digitaliseren staat bij het openen al uitgeklapt (in de html), zodat je ziet dat het kan.
  const kinds = document.querySelectorAll('.kind');
  const setOpen = (kind, open) => {
    kind.classList.toggle('open', open);
    kind.querySelector('.kind-head').setAttribute('aria-expanded', String(open));
  };
  document.querySelectorAll('.kind-head').forEach(head => head.addEventListener('click', () => {
    setOpen(head.parentElement, !head.parentElement.classList.contains('open'));
  }));
  // met een muis: altijd één categorie open, de laatste waar je over ging
  if (matchMedia('(hover: hover)').matches) {
    kinds.forEach(kind => kind.addEventListener('mouseenter', () => kinds.forEach(k => setOpen(k, k === kind))));
  }

  // ---------- Hoe het verloopt: de stap waar je bent ----------
  // De actieve stap is de laatste waarvan de bovenkant al voorbij STEP.at van de schermhoogte is.
  // De haakjes schuiven naar die stap, de lange lijn staat erna (bij de laatste stap ervoor), en de titel wisselt.
  const STEP = { at: 0.45 };
  const panels = [...document.querySelectorAll('.step-panel')];
  const nums = [...document.querySelectorAll('.track-n')];
  const lines = [...document.querySelectorAll('.track-l')];
  const bigs = [...document.querySelectorAll('.step-big')];
  let step = 0;
  function setStep(i) {
    if (i === step) return;
    step = i;
    nums.forEach((n, k) => n.classList.toggle('is-on', k === i));
    lines.forEach((l, k) => l.classList.toggle('is-long', k === Math.min(i, lines.length - 1)));
    bigs.forEach((b, k) => b.classList.toggle('is-on', k === i));
    panels.forEach((p, k) => p.classList.toggle('is-on', k === i));
  }
  function pickStep() {
    const at = innerHeight * STEP.at;
    let i = 0;
    panels.forEach((p, k) => { if (p.getBoundingClientRect().top <= at) i = k; });
    setStep(i);
  }
  addEventListener('scroll', pickStep, { passive: true });
  pickStep();

  // ---------- Wat er nog kan: de schuivende namen en het paneel ----------
  // De namen in het navy blok komen uit het overzicht in het paneel: de lijst staat maar op één plaats.
  const names = [...document.querySelectorAll('.more-list b')].map(b => b.textContent);
  const rows = [...document.querySelectorAll('.mq-track')];
  rows.forEach((track, r) => {
    // elke rij begint ergens anders in de lijst, zodat de drie rijen niet gelijk lopen
    const own = names.map((_, k) => names[(k + r * 4) % names.length]);
    const html = own.map(n => `<span class="mq-item">${n}</span><span class="mq-dot"></span>`).join('');
    track.innerHTML = html + html;   // twee keer, zodat de rij naadloos doorloopt
  });

  const more = document.getElementById('more'), moreBtn = document.getElementById('pathMore');
  function setMore(open) {
    body.classList.toggle('more-open', open);
    more.setAttribute('aria-hidden', String(!open));
    moreBtn.setAttribute('aria-expanded', String(open));
    if (open) document.getElementById('moreClose').focus({ preventScroll: true });
    else moreBtn.focus({ preventScroll: true });
  }
  moreBtn.addEventListener('click', () => setMore(true));
  document.getElementById('moreClose').addEventListener('click', () => setMore(false));
  document.getElementById('moreScrim').addEventListener('click', () => setMore(false));
  addEventListener('keydown', e => { if (e.key === 'Escape' && body.classList.contains('more-open')) setMore(false); });
  // de pagina met projecten bestaat nog niet
  document.getElementById('pathBuilt').addEventListener('click', e => e.preventDefault());

  // ---------- Van blauw naar licht ----------
  const hero = document.getElementById('hero'), nav = document.getElementById('nav'), gl = document.getElementById('gl');
  // de scène leest hier hoe licht het is
  window.SOM = window.SOM || {};
  window.SOM.light = 0;
  function update() {
    const vh = innerHeight, bottom = hero.getBoundingClientRect().bottom;
    const k = ease(clamp((LIGHT.from * vh - bottom) / ((LIGHT.from - LIGHT.to) * vh)));
    const c = LIGHT.dark.map((v, i) => Math.round(v + (LIGHT.bright[i] - v) * k));
    window.SOM.page = `rgb(${c.join(',')})`;   // de scène kleurt haar mist mee, zodat de verre vloer nooit een band vormt
    root.style.setProperty('--page', window.SOM.page);
    root.style.setProperty('--light', k.toFixed(3));
    nav.classList.toggle('on-light', k > 0.5);
    gl.style.opacity = (1 - k).toFixed(3);
    window.SOM.light = k;
  }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
})();
