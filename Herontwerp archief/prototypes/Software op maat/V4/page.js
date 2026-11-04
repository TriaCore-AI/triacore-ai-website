/* =============================================================
   Software op maat V4: het menu, en de overgang van blauw naar licht.

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

  // ---------- Hoe het verloopt: de stappen schuiven naar links ----------
  // Het beeld blijft staan terwijl je door de sectie scrolt. Hoe ver je bent, bepaalt de plaats in de rij:
  // 0 = stap 1 in het midden, 1 = stap 2 in het midden, enzovoort. Bij elke stap blijft het even stil (hold),
  // daartussen schuift de rij zacht door. Elke stap krijgt zijn plaats, grootte en helderheid uit zijn afstand
  // tot het midden. De stappenbalk schuift mee met hoe ver je zit: tussen stap 2 en 3 staan de haakjes ook
  // tussen 02 en 03, en de lange lijn is half naar de volgende plaats gegroeid.
  const STEP = {
    per: 0.9,        // zoveel schermhoogtes scrol je per stap (staat ook als --per in page.css)
    hold: 0.3,       // dat deel van elke stap blijft de rij stil staan
    side: { scale: 0.62, opacity: 0.28 },   // de buren: zo klein en zo doorschijnend
    peek: 0.5,       // computer: dat deel van een buur is zichtbaar aan de rand
    peekGsm: 22,     // gsm: zoveel pixels van een buur zijn zichtbaar
    sideGsm: { scale: 0.8, opacity: 0.3 },
    smooth: 0.14,    // hoe zacht de rij de scroll volgt (1 = meteen)
  };
  const stepsSec = document.getElementById('verloop'), stepsRow = document.getElementById('stepsRow');
  const steps = [...stepsRow.children];
  const nums = [...document.querySelectorAll('.track-n')];
  const lines = [...document.querySelectorAll('.track-l')];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  stepsSec.style.setProperty('--per', STEP.per);
  const track = document.getElementById('track');
  const trackBr = document.getElementById('trackBr');
  let step = -1, shown = 0, goal = 0, ticking = false, pad = 0;
  const readPad = () => { pad = parseFloat(getComputedStyle(track).fontSize) * 0.55; };   // ruimte voor een haakje
  function setStep(i) {
    if (i === step) return;
    step = i;
    steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
  }
  // de stappenbalk op plaats x (0 = stap 1, 3 = stap 4), ook tussen twee stappen in
  function placeTrack(x) {
    const xl = Math.min(x, lines.length - 1);   // bij de laatste stap staat de lange lijn ervoor
    lines.forEach((l, k) => { l.style.flexGrow = clamp(1 - Math.abs(xl - k)).toFixed(4); });
    nums.forEach((n, k) => {
      const on = clamp(1 - Math.abs(x - k));   // 1 = de haakjes staan rond dit nummer
      n.style.margin = `0 ${(pad * on).toFixed(2)}px`;
      n.style.color = `color-mix(in srgb, var(--text) ${(on * 100).toFixed(1)}%, var(--sub))`;
    });
    const i = Math.min(Math.floor(x), nums.length - 2), f = x - i, a = nums[i], b = nums[i + 1];
    // het schuifje blijft even breed; zijn midden schuift van het midden van het ene nummer naar dat van het volgende
    const mid = n => n.offsetLeft + n.offsetWidth / 2;
    const c = mid(a) + (mid(b) - mid(a)) * f, w = a.offsetWidth + (b.offsetWidth - a.offsetWidth) * f + 2 * pad;
    trackBr.style.width = `${w.toFixed(1)}px`;
    trackBr.style.transform = `translate(${(c - w / 2).toFixed(1)}px, -50%)`;
  }
  function readGoal() {
    const r = stepsSec.getBoundingClientRect(), run = r.height - innerHeight;
    const p = clamp(-r.top / Math.max(1, run)) * (steps.length - 1);   // 0 tot 3
    const i = Math.min(Math.floor(p), steps.length - 2), f = p - i;
    goal = i + ease(clamp((f - STEP.hold / 2) / (1 - STEP.hold)));
  }
  function place() {
    const gsm = innerWidth < 900, side = gsm ? STEP.sideGsm : STEP.side;
    const screenW = root.clientWidth, w = steps[0].offsetWidth, sw = w * side.scale;
    // waar het midden van een buur staat: net zo ver dat een deel ervan aan de rand van het scherm piept
    const gap = screenW / 2 + sw / 2 - (gsm ? STEP.peekGsm : sw * STEP.peek);
    steps.forEach((s, k) => {
      const d = k - shown, a = Math.min(Math.abs(d), 1);
      const scale = 1 + (side.scale - 1) * a;
      const opacity = Math.abs(d) <= 1 ? 1 + (side.opacity - 1) * a : side.opacity * clamp(2 - Math.abs(d));
      s.style.transform = `translate(-50%, -50%) translateX(${(d * gap).toFixed(1)}px) scale(${scale.toFixed(3)})`;
      s.style.opacity = opacity.toFixed(3);
    });
    placeTrack(shown);
    setStep(Math.round(shown));
  }
  function tick() {
    shown += (goal - shown) * (still ? 1 : STEP.smooth);
    if (Math.abs(goal - shown) < 0.001) shown = goal;
    place();
    ticking = shown !== goal;
    if (ticking) requestAnimationFrame(tick);
  }
  function onStepsScroll() {
    readGoal();
    if (!ticking) { ticking = true; requestAnimationFrame(tick); }
  }
  addEventListener('scroll', onStepsScroll, { passive: true });
  addEventListener('resize', () => { readPad(); readGoal(); shown = goal; place(); });
  readPad(); readGoal(); shown = goal; place();
  document.fonts.ready.then(() => place());   // de nummers zijn pas juist breed als DM Sans geladen is

  // ---------- Vertel ons waar het wringt: het formulier ----------
  // Nodig zijn alleen de vraag en een e-mail of telefoon. In het prototype verstuurt het formulier nog niets:
  // het controleert de twee velden en toont daarna de bedanking. Voor de echte site moet het nog gekoppeld worden.
  const askBox = document.getElementById('pathAsk'), askForm = document.getElementById('askForm');
  const askNote = document.getElementById('askNote');
  askForm.addEventListener('submit', e => {
    e.preventDefault();
    const missing = [...askForm.querySelectorAll('[required]')].filter(f => !f.value.trim());
    askForm.querySelectorAll('[required]').forEach(f => f.classList.toggle('is-missing', missing.includes(f)));
    if (missing.length) {
      askNote.textContent = missing.length === 2 ? 'Vul je vraag en je e-mail of telefoon in.'
        : missing[0].name === 'vraag' ? 'Vertel kort waar je tegenaan loopt.' : 'Laat je e-mail of telefoon achter.';
      missing[0].focus();
      return;
    }
    askNote.textContent = '';
    askBox.classList.add('is-sent');
  });
  askForm.addEventListener('input', e => {
    if (e.target.classList.contains('is-missing') && e.target.value.trim()) e.target.classList.remove('is-missing');
  });
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
