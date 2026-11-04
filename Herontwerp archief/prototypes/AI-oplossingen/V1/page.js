/* =============================================================
   AI-oplossingen V1: het menu, de video, en de overgang van blauw naar licht.
   Overgenomen van Software op maat V4; de secties na de hero komen later.

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

  // ---------- De grote zin: binnenvegen en kleuren, op het ritme van het scrollen ----------
  // Alles volgt hoe ver je door de sectie gescrold bent (0 tot 1): eerst veegt de eerste regel binnen, dan de tweede,
  // dan loopt het groen over de tweede regel, dan komt de voet op. Bij aankomst staat er nog niets (Lucas, 2026-10-08).
  const CLAIM = {
    line1: [0.02, 0.24],   // tussen deze twee punten van het scrollen veegt de eerste regel binnen
    line2: [0.28, 0.50],   // hier de tweede regel
    color: [0.54, 0.74],   // hier loopt het groen over de hele tweede regel
    foot:  [0.78, 0.92],   // hier komen de kleine zin en "Scroll en ontdek hoe" op
    smooth: 0.12,          // hoe zacht alles het scrollen volgt (1 = meteen)
  };
  const claim = document.getElementById('claim');
  const l1 = document.getElementById('claimL1'), l2 = document.getElementById('claimL2'), cFoot = document.getElementById('claimFoot');
  const easeIO = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const span = (p, [a, b]) => easeIO(clamp((p - a) / (b - a)));
  const noMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let now1 = 0, now2 = 0, nowC = 0, nowF = 0;
  function claimFrame() {
    requestAnimationFrame(claimFrame);
    const r = claim.getBoundingClientRect();
    if (r.bottom < -innerHeight || r.top > innerHeight * 1.5) return;   // ver uit beeld: niets te doen
    const p = clamp(-r.top / Math.max(1, r.height - innerHeight));
    const k = noMotion ? 1 : CLAIM.smooth;
    now1 += (span(p, CLAIM.line1) - now1) * k;
    now2 += (span(p, CLAIM.line2) - now2) * k;
    nowC += (span(p, CLAIM.color) - nowC) * k;
    nowF += (span(p, CLAIM.foot) - nowF) * k;
    l1.style.setProperty('--w', now1.toFixed(4));
    l2.style.setProperty('--w', now2.toFixed(4));
    l2.style.setProperty('--c', nowC.toFixed(4));
    cFoot.style.setProperty('--f', nowF.toFixed(4));
  }
  requestAnimationFrame(claimFrame);

  // ---------- Binnenvegen met het scrollen (data-swipe) ----------
  // Elke rij veegt binnen terwijl ze van onderaan het scherm naar boven schuift: SWIPE.from is waar het begint, SWIPE.span
  // hoe lang het duurt (allebei als deel van de schermhoogte).
  const SWIPE = { from: 0.95, span: 0.3, smooth: 0.12 };
  const swipes = [...document.querySelectorAll('[data-swipe]')].map(el => ({ el, w: 0 }));
  function swipeFrame() {
    requestAnimationFrame(swipeFrame);
    swipes.forEach(s => {
      const top = s.el.getBoundingClientRect().top;
      const goal = noMotion ? 1 : easeIO(clamp((innerHeight * SWIPE.from - top) / (innerHeight * SWIPE.span)));
      if (Math.abs(goal - s.w) < 0.0005) return;
      s.w += (goal - s.w) * (noMotion ? 1 : SWIPE.smooth);
      s.el.style.setProperty('--w', s.w.toFixed(4));
    });
  }
  requestAnimationFrame(swipeFrame);

  // ---------- Zacht opkomen in beeld (data-reveal) ----------
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: 0.25 });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  // "Scroll en ontdek hoe": zacht naar het schema
  document.querySelector('.claim-scroll').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('harness').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
  // de pagina met onze volledige kijk op AI bestaat nog niet
  document.getElementById('philLink').addEventListener('click', e => e.preventDefault());

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
