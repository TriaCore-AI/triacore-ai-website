/* =============================================================
   Hero V1: de pagina rond de logo-animatie.

   1. De intro (shot 1, 2 en 3 van V10 sneller) speelt vanzelf, bij elke refresh (HERO.oncePerSession).
      Scrollen, klikken of een toets springt meteen naar het volledige logo.
   2. Het logo staat, met de titel, de zin en de knoppen eronder.
   3. Wie scrolt, rijdt zelf door de pijlers en het slot. Terugscrollen speelt alles terug.
   4. Het slot eindigt op het lichte grijs, waar de rest van de site begint.

   De navigatie verschijnt na een seconde en is altijd bruikbaar.
   ?t=12 zet het beeld vast op seconde 12 (controle). ?intro=1 speelt de intro altijd.
   ?lang=en opent in het Engels. G zet het raster aan of uit.
   ============================================================= */
(function () {
  'use strict';

  // ---------- Afstellen ----------
  const HERO = {
    lift: 0.12,            // het logo staat in het eindbeeld zoveel hoger (deel van de schermhoogte), voor de titel eronder
    navAt: 1.0,            // na zoveel seconden verschijnt de navigatie
    copyAt: -0.35,         // de titel verschijnt zoveel seconden voor het einde van de intro
    copyOut: 0.25,         // en verdwijnt zodra je zoveel seconden film verder gescrold bent
    oncePerSession: false, // true: de intro speelt één keer per bezoek. false: bij elke refresh opnieuw
  };
  const SCROLL = {
    perSec: 0.32,          // zoveel schermhoogtes scrollen per seconde film, na de intro
    smooth: 0.22,          // hoe zacht de film het scrollen volgt, in seconden
    approachAt: 2.6,       // "Onze aanpak" scrolt tot zoveel seconden na de intro: Begrijpen staat er volledig
  };

  // ---------- De teksten van de pagina (de pijlers en het slot staan in logo-scene.js) ----------
  const WORDS = {
    nl: {
      menu: 'Menu', contact: 'Contact', nav1: 'Custom oplossingen', nav2: 'Projecten',
      title: 'De transformatiepartner van bedrijven <em>in het tijdperk van AI.</em>',
      lead: 'We begrijpen uitdagingen tot in de kern, en vertalen ze naar intelligente oplossingen die bedrijven versterken.',
      cta: 'Plan een gesprek', approach: 'Onze aanpak', scroll: 'Scroll',
      nextEyebrow: 'Moment 2', nextTitle: 'Hier komt de grote zin.',
      open: 'Menu openen', close: 'Menu sluiten',
    },
    en: {
      menu: 'Menu', contact: 'Contact', nav1: 'Custom solutions', nav2: 'Projects',
      title: 'The transformation partner for businesses <em>in the age of AI.</em>',
      lead: 'We understand challenges down to their core, and translate them into intelligent solutions that empower businesses.',
      cta: 'Book a call', approach: 'Our approach', scroll: 'Scroll',
      nextEyebrow: 'Moment 2', nextTitle: 'The big sentence comes here.',
      open: 'Open menu', close: 'Close menu',
    },
  };

  // ---------- Het slot, letterlijk uit V10 sneller ----------
  const WAY_AT = 1.9, READ_AT = 4.4;
  const ending = {
    dur: 15.4,
    camera(c, s) {
      const k = c.E.move(c.clamp((s - 0.2) / 2.8));
      c.pose.ax -= (c.BAR_W + 1.9 * c.halfW) * k;
      c.grid = c.lerp(c.grid, 0, c.E.soft(c.clamp((s - 0.3) / 2.2)));
    },
    overlay(c, s) {
      const o = 1 - c.E.soft(c.clamp(s / 0.5));
      c.fadeText(o); c.fadeLine(o);
      c.bgNeutral(c.E.soft(c.clamp((s - 0.6) / 2.0)));
      c.way(s, WAY_AT, c.W / 2, c.H / 2);
      c.finish(s, READ_AT);
    },
  };

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const body = document.body;
  // na een refresh begint de pagina bovenaan, zodat de intro opnieuw speelt
  // (anders zet de browser je terug waar je was, en slaat de intro zichzelf over)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);
  const params = new URLSearchParams(location.search);
  const fixedT = parseFloat(params.get('t'));
  const still = !Number.isNaN(fixedT);
  let lang = params.get('lang') === 'en' ? 'en' : 'nl';
  let scene = null;

  // ---------- Taal ----------
  function applyLang() {
    const w = WORDS[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = w[el.dataset.i18n]; });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = w[el.dataset.i18nHtml]; });
    document.querySelectorAll('.nav-lang button').forEach(b => b.classList.toggle('is-on', b.dataset.lang === lang));
    menuBtn.setAttribute('aria-label', body.classList.contains('menu-open') ? w.close : w.open);
    if (scene) scene.setLang(lang);
  }
  document.querySelector('.nav-lang').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || b.dataset.lang === lang) return;
    lang = b.dataset.lang;
    const u = new URL(location.href);
    u.searchParams.set('lang', lang);
    history.replaceState(null, '', u);
    applyLang();
  });

  // ---------- Het menu ----------
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? WORDS[lang].close : WORDS[lang].open);
    if (open) menu.querySelector('a').focus({ preventScroll: true });
  }
  menuBtn.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  document.getElementById('menuScrim').addEventListener('click', () => setMenu(false));
  menu.querySelector('a[href="#top"]').addEventListener('click', e => {
    e.preventDefault();
    setMenu(false);
    scrollTo({ top: 0, behavior: 'smooth' });
  });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); }
  });

  applyLang();
  if (params.get('menu') === '1') setMenu(true);   // controle: opent met het menu open

  // ---------- De hero ----------
  async function start() {
    scene = await window.TriaLogoScene({ raster: true, ending, lift: HERO.lift, lang, still });
    const { T_CAM, T_ALL } = scene;
    const hero = document.getElementById('hero');
    const pin = hero.querySelector('.hero-pin');
    const stage = document.getElementById('stage');
    const nav = document.getElementById('nav');

    // de hero is zo lang als de film na de intro, plus één scherm
    let len = 1;
    function sizeHero() {
      len = Math.max(1, (T_ALL - T_CAM) * SCROLL.perSec * pin.clientHeight);
      hero.style.height = `${pin.clientHeight + len}px`;
    }
    sizeHero();
    addEventListener('resize', sizeHero);
    const scrollT = () => T_CAM + clamp((scrollY - hero.offsetTop) / len) * (T_ALL - T_CAM);
    const yFor = t => hero.offsetTop + (t - T_CAM) / (T_ALL - T_CAM) * len;

    // de titel staat er alleen zolang het logo volledig in beeld staat
    const setCopy = t => body.classList.toggle('copy-on', t >= T_CAM + HERO.copyAt && t < T_CAM + HERO.copyOut);
    // de navigatie kleurt mee: wit op donker, navy op licht
    const setNavTheme = () => nav.classList.toggle('on-light', scene.isLight() || hero.getBoundingClientRect().bottom < nav.offsetHeight);

    if (still) {
      body.classList.add('started', 'nav-on');
      scene.seek(fixedT);
      setCopy(fixedT);
      setNavTheme();
      return;
    }

    // de intro: één keer per bezoek, en nooit voor wie minder beweging vraagt of al gescrold heeft
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try { seen = HERO.oncePerSession && sessionStorage.getItem('tc-intro') === '1'; } catch (e) { /* geen opslag: gewoon afspelen */ }
    if (params.get('intro') === '1') seen = false;
    try { sessionStorage.setItem('tc-intro', '1'); } catch (e) { /* idem */ }

    let introDone = seen || reduce || scrollY > 0;
    let introT = introDone ? T_CAM : 0;
    let tCur = introDone ? scrollT() : 0;
    body.classList.add('started');
    if (introDone) body.classList.add('nav-on');

    // overslaan: meteen naar het volledige logo, met een korte zachte overgang
    function skip() {
      if (introDone) return;
      introDone = true;
      tCur = Math.max(T_CAM, scrollT());
      stage.classList.remove('skip');
      void stage.offsetWidth;
      stage.classList.add('skip');
      body.classList.add('nav-on');
    }
    addEventListener('wheel', skip, { passive: true });
    addEventListener('touchstart', skip, { passive: true });
    addEventListener('keydown', e => {
      if (e.key === 'g' || e.key === 'G') { scene.toggleGrid(); return; }
      if (['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Escape'].includes(e.key)) return;
      skip();
    });
    hero.addEventListener('pointerdown', e => { if (!e.target.closest('a, button')) skip(); });

    // "Onze aanpak": scrol tot Begrijpen volledig in beeld staat
    document.getElementById('toApproach').addEventListener('click', e => {
      e.preventDefault();
      skip();
      scrollTo({ top: yFor(T_CAM + SCROLL.approachAt), behavior: 'smooth' });
    });

    let last = performance.now();
    function frame(now) {
      const raw = (now - last) / 1000;
      const dt = Math.min(0.05, raw);
      last = now;
      scene.perf(raw);
      if (!introDone) {
        introT += dt;
        if (introT >= HERO.navAt) body.classList.add('nav-on');
        if (introT >= T_CAM) introDone = true;
        tCur = Math.min(introT, T_CAM);
      } else {
        // de film volgt het scrollen zacht, zodat een muiswiel geen schokken geeft
        const target = scrollT();
        tCur += (target - tCur) * (1 - Math.exp(-dt / SCROLL.smooth));
        if (Math.abs(target - tCur) < 0.0005) tCur = target;
      }
      scene.seek(tCur);
      setCopy(tCur);
      setNavTheme();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  start().catch(err => console.error(err));
})();
