/* =============================================================
   Hero V2: de pagina rond de logo-animatie.

   1. De intro (shot 1, 2 en 3 van V10 sneller) speelt vanzelf. Geen menu, geen knoppen.
   2. Het logo staat even volledig, en vliegt dan naar linksboven: het wordt de menuknop.
      Tegelijk komen NL / EN en Contact binnen.
   3. In het midden komen na elkaar de titel, de zin, de twee knoppen en "Vertrouwd door" binnen
      (het tempo staat in hero.css, bij "na elkaar").
      Alles staat op één scherm, op de computer en op de gsm.
   4. Eén keer scrollen: het logo komt van linksboven terug en de camera duikt in op Begrijpen.
      Nog eens: Vertalen. Nog eens: Waarmaken. Nog eens: de camera volgt de balk naar links,
      de achtergrond wordt licht, en je komt uit op de site.

   Scrollen gaat stap voor stap: één scrollbeweging (wiel, veeg of toets) is één stap. Zolang een
   stap nog speelt, telt scrollen niet. Terugscrollen speelt alles terug, ook stap voor stap.

   ?t=12 zet het beeld vast op seconde 12 (controle). ?lang=en opent in het Engels.
   G zet het raster aan of uit.
   ============================================================= */
(function () {
  'use strict';

  // ---------- Afstellen ----------
  const HERO = {
    shots: false,          // shot 1 (rechtsboven) en 2 (linksonder) van de intro. false: de intro begint meteen met het omdraaien
    hold: 0.15,            // zo lang staat het logo volledig in beeld na de intro (het uitzoomen remt zelf al af)
    fly: 1.3,              // zo lang duurt de vlucht naar linksboven
    copyAt: 0.75,          // de tekst begint als het logo zoveel van zijn weg afgelegd heeft (0 tot 1), zodat ze elkaar niet kruisen
    arrive: 2.2,           // bij het scrollen: zo lang duurt het binnenschuiven van het nieuwe logo, tot de camera induikt
    oncePerSession: false, // true: de intro speelt één keer per bezoek. false: bij elke refresh opnieuw
  };
  const SCROLL = {
    rate: 1.0,             // de film tussen de pijlers loopt op zijn gewone tempo (hoger = sneller)
    rateBack: 1.0,         // en terug even snel als vooruit
    rateArrive: 1.0,       // maar het binnenkomen van "Onze aanpak" loopt altijd op zijn gewone, rustige tempo
    smooth: 0.18,          // hoe zacht de film aankomt bij een stap, in seconden
    cooldown: 80,          // na het aankomen bij een stap telt een nieuwe scrollbeweging pas na zoveel ms
    nearEnough: 0.15,      // een stap geldt als aangekomen als er nog zoveel seconden film over zijn (het laatste uitglijden)
    queueWithin: 0.8,      // een scrollbeweging op het einde van een stap (nog zoveel seconden film) wordt onthouden en volgt meteen
    gestureGap: 160,       // zoveel ms zonder wieltik = de scrollbeweging is gedaan (een trackpad rolt lang na)
    rateOut: 1.3,          // na Waarmaken: het tempo waarmee de camera de balk naar links volgt en het licht wordt
    leadOut: 0.9,          // zoveel seconden voor het einde daarvan schuift de pagina naar de use cases
    slack: 90,             // zoveel pixels schuift de pagina verder dan het begin van de use cases: ruimte om terug omhoog te kijken
    edgePause: 450,        // bovenaan de use cases aangekomen: pas na zoveel ms rust gaat een beweging omhoog terug naar Waarmaken
  };

  // ---------- De teksten van de pagina (de pijlers staan in logo-scene.js) ----------
  const WORDS = {
    nl: {
      menu: 'Menu', contact: 'Contact', nav1: 'Custom oplossingen', nav2: 'Projecten',
      title: ['De transformatiepartner', 'van bedrijven', 'in het tijdperk van AI.'],   // drie vaste regels, de laatste groen
      lead: 'We begrijpen uitdagingen tot in de kern, en vertalen ze naar intelligente oplossingen die bedrijven versterken.',
      cta: 'Plan een gesprek', approach: 'Onze aanpak', trusted: 'Vertrouwd door',
      approachTitle: 'Onze aanpak.',
      open: 'Menu openen', close: 'Menu sluiten',
      // de use cases (concept)
      casesEyebrow: 'Use cases',
      casesTitle: 'Wat we bouwden. <em>En voor wie.</em>',
      croesTag: 'Grondverzet', croesText: 'De vrachtbonnen gingen van papier naar een app.',
      amTag: 'Autodealers', amText: 'Het transport van wagens tussen de vestigingen ging van een gedeelde Excel naar eigen platformen.',
      readMore: 'Lees meer', allCases: 'Alle use cases', prev: 'Vorige', next: 'Volgende',
      // de oplossingen (concept)
      qApproach: 'Onze aanpak', qSolutions: 'Oplossingen',
      solTitle: 'Onze oplossingen.',
      // voorlopig voorstel B (2026-10-03): fundament en bovenbouw
      sol1Name: 'Software op maat', sol1Text: 'Het fundament. Je gegevens op één plek, in een tool die werkt zoals jouw bedrijf: nieuw gebouwd, of gekoppeld aan wat je al hebt.',
      sol2Name: 'AI-oplossingen', sol2Text: 'Wat erop bouwt. AI die antwoordt, voorstelt en werk overneemt met de kennis van je bedrijf. Op dat fundament, of op zichzelf.',
      sol3Name: 'Workshops', sol3Text: 'De mensen erbij. Je team leert zelf werken met AI die je bedrijf kent.',
      // het team (concept)
      teamTitle: 'Wie je aan tafel krijgt.',
      rianRole: 'Klantrelaties en financiën', rianLine: 'Je eerste gesprek, en daarna je vaste aanspreekpunt.',
      lucasRole: 'Strategie en oplossingen', lucasLine: 'Vertaalt wat je nodig hebt naar wat we bouwen.',
      jornRole: 'Architectuur en development', jornLine: 'Denkt de oplossing uit en bouwt ze.',
      // de FAQ (concept)
      faqTitle: 'Vragen die we <em>vaak krijgen.</em>',
      faq1Q: 'Hoe begint een samenwerking?', faq1A: 'Met een gesprek. We luisteren naar hoe je bedrijf werkt en waar het vandaag wringt. Binnen 48 uur hoor je van ons wat de volgende stap is.',
      faq2Q: 'Moeten we al met AI bezig zijn?', faq2A: 'Je start waar je nu staat. Vaak begint het bij je gegevens: die brengen we eerst samen op één plek. Daarop bouwt AI verder.',
      faq3Q: 'Werkt het samen met onze bestaande programma\'s?', faq3A: 'Ja. We bouwen rond je processen en koppelen met de programma\'s die je al gebruikt, ook met je ERP.',
      faq4Q: 'Wat gebeurt er na de oplevering?', faq4A: 'Twee maanden begeleiden we je team intensief. Daarna blijven we je partner, met maandelijkse support, updates en onderhoud.',
      faq5Q: 'Hoe gaan jullie om met onze gegevens?', faq5A: 'Veilig en volgens de GDPR. Iedereen in je bedrijf ziet alleen wat hij nodig heeft, en je gegevens blijven van jou.',
      faq6Q: 'Wat kost het?', faq6A: 'Elk project start met een eenmalige prijs voor wat we bouwen, op maat van je vraag. Daarna loopt een vaste maandelijkse begeleiding: support, updates, onderhoud en het AI-verbruik.',
    },
    en: {
      menu: 'Menu', contact: 'Contact', nav1: 'Custom solutions', nav2: 'Projects',
      title: ['The transformation', 'partner for businesses', 'in the age of AI.'],
      lead: 'We understand challenges down to their core, and translate them into intelligent solutions that empower businesses.',
      cta: 'Book a call', approach: 'Our approach', trusted: 'Trusted by',
      approachTitle: 'Our approach.',
      open: 'Open menu', close: 'Close menu',
      casesEyebrow: 'Use cases',
      casesTitle: 'What we built. <em>And for whom.</em>',
      croesTag: 'Earthworks', croesText: 'Their delivery notes moved from paper to an app.',
      amTag: 'Car dealers', amText: 'Moving cars between branches went from a shared Excel sheet to dedicated platforms.',
      readMore: 'Read more', allCases: 'All use cases', prev: 'Previous', next: 'Next',
      qApproach: 'Our approach', qSolutions: 'Solutions',
      solTitle: 'Our solutions.',
      sol1Name: 'Custom software', sol1Text: 'The foundation. Your data in one place, in a tool that works the way your business does: newly built, or connected to what you already have.',
      sol2Name: 'AI solutions', sol2Text: 'What builds on it. AI that answers, suggests and takes over work with the knowledge of your business. On that foundation, or on its own.',
      sol3Name: 'Workshops', sol3Text: 'The people alongside. Your team learns to work with AI that knows your business.',
      teamTitle: 'Who you sit down with.',
      rianRole: 'Client Relations and Finance', rianLine: 'Your first conversation, and your point of contact from then on.',
      lucasRole: 'Strategy and Solutions', lucasLine: 'Translates what you need into what we build.',
      jornRole: 'Architecture and Development', jornLine: 'Designs the solution and builds it.',
      faqTitle: 'Questions we <em>often hear.</em>',
      faq1Q: 'How does a collaboration start?', faq1A: 'With a conversation. We listen to how your business works and where things get stuck today. Within 48 hours, you hear from us what the next step is.',
      faq2Q: 'Do we already need to be working with AI?', faq2A: 'You start where you are now. It often begins with your data: we first bring it together in one place. AI builds on that.',
      faq3Q: 'Does it work with the software we already use?', faq3A: 'Yes. We build around your processes and connect with the software you already use, including your ERP.',
      faq4Q: 'What happens after delivery?', faq4A: 'For two months, we support your team intensively. After that, we remain your partner, with monthly support, updates and maintenance.',
      faq5Q: 'How do you handle our data?', faq5A: 'Securely and in line with the GDPR. Everyone in your company sees only what they need, and your data stays yours.',
      faq6Q: 'What does it cost?', faq6A: 'Every project starts with a one-time price for what we build, tailored to your needs. After that, a fixed monthly plan covers support, updates, maintenance and AI usage.',
    },
  };

  // ---------- Na Waarmaken: de camera volgt de balk naar links, de achtergrond wordt licht ----------
  // Het begin van het slot uit V10 sneller. De zin, TriaCore en de slogans zijn weg.
  // De hele pagina kleurt mee (pageLight), zodat de use cases naadloos op hetzelfde licht volgen.
  let pageLight = 0;
  const ending = {
    dur: 3.2,
    camera(c, s) {
      const k = c.E.move(c.clamp((s - 0.2) / 2.8));
      c.pose.ax -= (c.BAR_W + 1.9 * c.halfW) * k;
      c.grid = c.lerp(c.grid, 0, c.E.soft(c.clamp((s - 0.3) / 2.2)));
    },
    overlay(c, s) {
      const o = 1 - c.E.soft(c.clamp(s / 0.5));
      c.fadeText(o); c.fadeLine(o);
      pageLight = c.E.inout(c.clamp((s - 0.9) / 1.8));
      c.bgLight(pageLight);
    },
  };

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const body = document.body;
  // na een refresh begint de pagina bovenaan, zodat de intro opnieuw speelt
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);
  const params = new URLSearchParams(location.search);
  const fixedT = parseFloat(params.get('t'));
  const still = !Number.isNaN(fixedT);
  let lang = params.get('lang') === 'en' ? 'en' : 'nl';
  let scene = null;

  // ---------- De titel ----------
  const heroTitle = document.getElementById('heroTitle');
  const lineEls = [...heroTitle.querySelectorAll('.tl')];
  function drawTitle() {
    WORDS[lang].title.forEach((line, i) => { lineEls[i].textContent = line; });
  }

  // de titel staat altijd op drie vaste regels. De letters worden zo groot als de langste regel
  // toelaat, gemeten over beide talen, zodat de titel in het Nederlands en het Engels even groot is.
  function fitTitle() {
    const probe = document.createElement('span');
    probe.className = 'title';
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-size:100px;left:-9999px;top:0';
    document.body.appendChild(probe);
    let widest = 0;
    Object.values(WORDS).forEach(w => w.title.forEach(line => {
      probe.textContent = line;
      widest = Math.max(widest, probe.getBoundingClientRect().width / 100);
    }));
    probe.remove();
    const copy = document.getElementById('heroCopy'), cs = getComputedStyle(copy);
    const room = copy.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const cap = Math.min(88, Math.max(40, innerWidth * 0.053));   // zoals op de computer: nooit groter dan nu
    heroTitle.style.fontSize = `${Math.min(cap, room / widest).toFixed(1)}px`;
  }
  fitTitle();
  if (document.fonts) document.fonts.ready.then(fitTitle);
  addEventListener('resize', fitTitle);

  // ---------- De FAQ: rechts groot het antwoord op de gekozen vraag ----------
  // Leest de gekozen vraag uit de lijst, zodat het ook in de andere taal klopt. swap: zacht wisselen.
  function drawFaq(swap) {
    const on = document.querySelector('.faq-item.is-on'), shown = document.getElementById('faqShown');
    shown.querySelector('.faq-shown-q').textContent = on.querySelector('.faq-q').textContent;
    shown.querySelector('.faq-shown-a').textContent = on.querySelector('.faq-a').textContent;
    if (!swap) return;
    shown.classList.remove('swap');
    void shown.offsetWidth;
    shown.classList.add('swap');
  }

  // ---------- Taal ----------
  function applyLang() {
    const w = WORDS[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = w[el.dataset.i18n]; });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = w[el.dataset.i18nHtml]; });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', w[el.dataset.i18nAria]); });
    document.querySelectorAll('.nav-lang button').forEach(b => b.classList.toggle('is-on', b.dataset.lang === lang));
    menuBtn.setAttribute('aria-label', body.classList.contains('menu-open') ? w.close : w.open);
    heroTitle.setAttribute('aria-label', w.title.join(' '));
    drawTitle();
    drawFaq();
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
  const mark = menuBtn.querySelector('.menu-mark');
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
    const stage = document.getElementById('stage');
    // waar de menuknop staat, binnen de scène: daar landt het logo
    const navRect = () => {
      const r = mark.getBoundingClientRect(), s = stage.getBoundingClientRect();
      return { cx: r.left + r.width / 2 - s.left, cy: r.top + r.height / 2 - s.top, w: r.width };
    };
    scene = await window.TriaLogoScene({
      raster: true, ending, lang, still,
      hero: { shots: HERO.shots, hold: HERO.hold, fly: HERO.fly, copyAt: HERO.copyAt, arrive: HERO.arrive, navRect },
    });
    const { T_FLY, T_HERO, T_PIL, T_OUT, T_COPY } = scene;
    const HOLDS = scene.holds();
    const approach = document.getElementById('approach'), approachLabel = document.getElementById('approachLabel');
    const stepBars = [...approachLabel.querySelectorAll('.steps i')];
    const hero = document.getElementById('hero');
    const pin = hero.querySelector('.hero-pin');
    const nav = document.getElementById('nav');

    // de stappen: de hero en de drie pijlers, elk één schermhoogte scrollen. Daarna een laatste stap:
    // de camera volgt de balk naar links, alles wordt licht, en de pagina schuift naar de use cases.
    // Vanaf daar scrol je vrij.
    const LAND = scene.landings(), WAIT = scene.waits();
    const KEYS = [T_HERO, ...LAND];
    const STEPS = KEYS.length - 1;            // de laatste stap binnen de hero: Waarmaken
    const SITE = STEPS + 1;                   // de stap erna: de use cases
    const FILM = [...KEYS, scene.T_ALL];      // de seconde film bij elke stap
    const cases = document.getElementById('cases');
    const siteTop = () => cases.offsetTop;              // waar de use cases beginnen: de grens met de hero
    const siteY = () => cases.offsetTop + SCROLL.slack; // waar de pagina aankomt: iets verder, met speling naar boven
    let vh = 1;
    function sizeHero() {
      vh = pin.clientHeight;
      hero.style.height = `${vh * (STEPS + 1)}px`;
      scene.redraw();
    }
    sizeHero();
    addEventListener('resize', sizeHero);
    const posNow = () => (scrollY - hero.offsetTop) / vh;
    const stepY = k => hero.offsetTop + k * vh;

    // wat er naast de film beweegt: de titel, de knoppen, de navigatie en de menuknop
    function setPage(t) {
      // de tekst begint al binnen te komen terwijl het logo het laatste stuk naar linksboven glijdt
      body.classList.toggle('copy-on', t > T_COPY && t < T_HERO + 0.03);
      if (t >= T_FLY + HERO.fly * 0.5) body.classList.add('nav-on');
      // het platte logo in de menuknop: neemt het over als het 3D-logo linksboven landt, en blijft dan staan
      mark.style.opacity = clamp((t - (T_HERO - 0.2)) / 0.2).toFixed(3);
      // "Onze aanpak.": groot in het midden terwijl het nieuwe logo binnenschuift, en bij het induiken
      // schuift het naar boven en wordt het een klein label, met drie balkjes als voortgang
      // rustig: traag invagen uit een lichte onscherpte, en traag weer weg, met een kleine beweging omhoog
      const ease = x => x * x * (3 - 2 * x);   // zacht vertrekken, zacht aankomen
      const inK = ease(clamp((t - (T_HERO + 0.2)) / 1.0));
      const out = ease(clamp((t - (T_PIL - 0.3)) / 0.9));
      const big = inK * (1 - out);
      approach.style.opacity = big.toFixed(3);
      approach.style.filter = big < 0.999 ? `blur(${((1 - inK) * 6 + out * 4).toFixed(2)}px)` : 'none';
      approach.style.transform = `translate(-50%, ${((1 - inK) * 12 - out * 18).toFixed(1)}px)`;
      const small = ease(clamp((t - (T_PIL + 0.4)) / 0.8)) * (1 - clamp((t - T_OUT) / 0.4));
      approachLabel.style.opacity = small.toFixed(3);
      let on = 0;
      HOLDS.forEach((h, i) => { if (t >= h - 0.5) on = i; });
      stepBars.forEach((b, i) => b.classList.toggle('is-on', i === on));
      // de pagina kleurt mee van donker naar het lichte grijs, zoals bij Porsche: heel subtiel
      if (t <= T_OUT) pageLight = 0;
      const mixC = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
      document.documentElement.style.setProperty('--page', mixC([5, 8, 15], [242, 242, 242], pageLight));
      nav.classList.toggle('on-light', pageLight > 0.5);
    }

    if (still) {
      body.classList.add('started');
      scene.seek(fixedT);
      setPage(fixedT);
      return;
    }

    // de intro, behalve voor wie minder beweging vraagt
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try { seen = HERO.oncePerSession && sessionStorage.getItem('tc-intro') === '1'; } catch (e) { /* geen opslag: gewoon afspelen */ }
    try { sessionStorage.setItem('tc-intro', '1'); } catch (e) { /* idem */ }
    let introDone = seen || reduce;
    let introT = introDone ? T_HERO : 0;
    let tCur = introT;
    body.classList.add('started');

    // overslaan: de eerste scrollbeweging, klik of toets tijdens de intro brengt je naar de hero.
    // Pas een volgende scrollbeweging gaat naar Begrijpen.
    function skip() {
      if (introDone) return;
      introDone = true;
      tCur = T_HERO;
      arrivedAt = performance.now();
      body.classList.add('nav-on');
      stage.classList.remove('skip');
      void stage.offsetWidth;
      stage.classList.add('skip');
    }
    hero.addEventListener('pointerdown', e => { if (!e.target.closest('a, button')) skip(); });

    // ---------- Stap voor stap ----------
    // Eén scrollbeweging is één stap, hoe hard of hoe ver iemand ook scrolt. Zolang een stap nog
    // speelt, telt scrollen niet: de animatie loopt rustig uit. Een beweging die tijdens de animatie
    // begon, telt ook daarna niet meer, ook al rolt een trackpad of gsm nog even na.
    let step = 0, arrivedAt = performance.now(), queued = 0, wasNear = true;
    let outScrolled = false, autoUntil = 0;   // is de pagina al naar de use cases geschoven, en schuift ze nu zelf?
    let nativeAt = 0;                         // wanneer er voor het laatst vrij gescrold werd in de use cases
    const left = () => Math.abs(FILM[step] - tCur);   // hoeveel seconden film de stap nog moet spelen
    const settled = () => introDone && left() < SCROLL.nearEnough;
    const busy = () => !settled() || performance.now() - arrivedAt < SCROLL.cooldown;
    // tijdens het begin van een stap telt scrollen niet; op het einde wordt het onthouden
    const tryGo = dir => {
      if (!busy()) go(step + dir);
      else if (introDone && left() < SCROLL.queueWithin) queued = dir;
    };
    function go(k) {
      k = clamp(k, 0, SITE);
      if (k === step) return;
      const from = step;
      step = k;
      if (k === SITE) { outScrolled = false; return; }    // de film speelt eerst, daarna schuift de pagina (zie frame)
      if (from === SITE) {
        // terug van de use cases: de pagina schuift rustig terug naar Waarmaken, en de film speelt achteruit
        autoUntil = performance.now() + 1500;
        scrollTo({ top: stepY(k), behavior: 'smooth' });
      } else {
        scrollTo({ top: stepY(k), behavior: 'instant' }); // de scène blijft staan: dit verandert alleen de stand van de pagina
      }
      if (reduce) tCur = FILM[k];                          // minder beweging: meteen naar de stap
    }
    // in de use cases scrol je gewoon vrij. Alleen wie bovenaan de use cases terug omhoog scrolt,
    // gaat weer stap voor stap terug naar Waarmaken.
    const free = dir => step === SITE && outScrolled && !(dir < 0 && scrollY <= siteTop() + 2);
    // één beweging = één gebaar: een reeks wieltikken zonder pauze ertussen
    let gesture = { used: false, quiet: 0 };
    function onGesture(dir) {
      if (body.classList.contains('menu-open')) return;
      if (!introDone) { skip(); gesture.used = true; return; }
      if (gesture.used) return;
      gesture.used = true;
      tryGo(dir);
    }
    addEventListener('wheel', e => {
      if (body.classList.contains('menu-open')) return;
      const dir = Math.sign(e.deltaY);
      clearTimeout(gesture.quiet);
      gesture.quiet = setTimeout(() => { gesture.used = false; }, SCROLL.gestureGap);
      // vrij scrollen in de use cases. Deze beweging telt als gebruikt: wie zo bovenaan aankomt,
      // gaat pas met een nieuwe beweging terug naar Waarmaken
      if (free(dir)) {
        gesture.used = true; nativeAt = performance.now();
        // een beweging omhoog stopt netjes op de bovenrand van de use cases, en schiet er niet over
        if (dir < 0 && scrollY + e.deltaY < siteTop()) {
          if (e.cancelable) e.preventDefault();
          scrollTo({ top: siteTop(), behavior: 'instant' });
        }
        return;
      }
      if (e.cancelable) e.preventDefault();
      // net bovenaan de use cases aangekomen: eerst even rust, pas daarna gaat omhoog terug naar Waarmaken
      if (step === SITE && performance.now() - nativeAt < SCROLL.edgePause) { gesture.used = true; return; }
      if (Math.abs(e.deltaY) < 2) return;
      onGesture(dir);
    }, { passive: false });
    // op een gsm: één veeg is één stap
    let touchY = null, touchLast = 0;
    addEventListener('touchstart', e => { touchY = touchLast = e.touches[0].clientY; gesture.used = false; }, { passive: true });
    addEventListener('touchmove', e => {
      if (body.classList.contains('menu-open')) return;
      const y = e.touches[0].clientY, dir = Math.sign(touchLast - y);
      touchLast = y;
      if (free(dir)) { gesture.used = true; nativeAt = performance.now(); return; }   // ook hier: pas een nieuwe veeg gaat terug
      if (e.cancelable) e.preventDefault();
      if (touchY === null) return;
      const dy = touchY - y;
      if (Math.abs(dy) > 36) { onGesture(Math.sign(dy)); touchY = null; }
    }, { passive: false });
    // toetsen: pijlen, spatie, page up en down, home en end
    addEventListener('keydown', e => {
      if (e.key === 'g' || e.key === 'G') { scene.toggleGrid(); return; }
      if (body.classList.contains('menu-open') || e.target.closest('input, textarea')) return;
      const dir = { ArrowDown: 1, PageDown: 1, ' ': e.shiftKey ? -1 : 1, ArrowUp: -1, PageUp: -1 }[e.key];
      if (free(dir || 1) && e.key !== 'Home') return;
      if (dir || e.key === 'Home' || e.key === 'End') e.preventDefault();
      if (!introDone) { if (!['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Escape'].includes(e.key)) skip(); return; }
      if (dir) { tryGo(dir); return; }
      if (busy()) return;
      if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(SITE);
    });
    // wie de schuifbalk versleept: de stap volgt de plaats op de pagina
    addEventListener('scroll', () => {
      if (performance.now() < autoUntil) return;
      if (!introDone && scrollY > stepY(0) + 4) skip();   // wie tijdens de intro de schuifbalk versleept
      if (step === SITE) {
        if (outScrolled && scrollY < siteTop() - 8) {
          // net nog vrij gescrold (een veeg die nauitrolt): blijf op de bovenrand. Anders (de schuifbalk): terug.
          if (performance.now() - nativeAt < 1200) scrollTo({ top: siteTop(), behavior: 'instant' });
          else go(STEPS);
        }
        return;
      }
      // een sprong met de schuifbalk: meteen het juiste beeld, zonder alle stappen ertussen af te spelen
      if (scrollY >= siteTop() - 4) { step = SITE; outScrolled = true; tCur = FILM[step]; return; }
      const k = clamp(Math.round(posNow()), 0, STEPS);
      if (k !== step && Math.abs(stepY(step) - scrollY) > 4) { step = k; tCur = FILM[step]; }
    }, { passive: true });

    // stond de pagina al verder toen de scène klaar was (bijvoorbeeld al gescrold tijdens het laden):
    // geen intro, en meteen het juiste beeld
    if (scrollY > stepY(0) + 4) {
      introDone = true;
      body.classList.add('nav-on');
      if (scrollY >= siteTop() - 4) { step = SITE; outScrolled = true; }
      else step = clamp(Math.round(posNow()), 0, STEPS);
      tCur = FILM[step];
    }

    // ---------- Het snelmenu: meteen naar een sectie, zonder de animaties ertussen ----------
    // Het beeld vaagt kort weg naar de kleur van de bestemming, de pagina springt, en vaagt weer in.
    const quick = document.getElementById('quick'), veil = document.getElementById('jumpVeil');
    const quickBtns = [...quick.querySelectorAll('button')];
    // de lichte secties na de use cases, in volgorde van de pagina: hier springt het snelmenu naartoe
    const LIGHT = ['oplossingen', 'team', 'faq'];
    const sectionTop = name => document.getElementById(name).offsetTop - 24;
    let jumping = false;
    function jumpTo(name) {
      if (jumping || body.classList.contains('menu-open')) return;
      jumping = true;
      if (!introDone) skip();
      const light = name === 'cases' || LIGHT.includes(name);
      veil.style.background = light ? '#F2F2F2' : '#05080F';
      veil.classList.add('on');
      setTimeout(() => {
        queued = 0;
        autoUntil = performance.now() + 400;
        if (light) {
          step = SITE; outScrolled = true;
          scrollTo({ top: name === 'cases' ? siteY() : sectionTop(name), behavior: 'instant' });
        } else {
          step = name === 'home' ? 0 : 1; outScrolled = false;
          scrollTo({ top: stepY(step), behavior: 'instant' });
        }
        tCur = FILM[step];
        arrivedAt = performance.now(); wasNear = true;
        scene.seek(tCur); setPage(tCur);
        setTimeout(() => { veil.classList.remove('on'); jumping = false; }, 60);
      }, 320);
    }
    // na een klik met de muis geen focus houden, zodat de namen meteen weggaan als je wegbeweegt
    quickBtns.forEach(b => b.addEventListener('click', e => { if (e.detail) b.blur(); jumpTo(b.dataset.to); }));
    // welke sectie in beeld is: die krijgt het groene balkje
    function updateQuick() {
      let on = 'home';
      if (step === SITE) {
        on = 'cases';
        LIGHT.forEach(n => { if (scrollY + innerHeight * 0.45 >= sectionTop(n)) on = n; });
        // helemaal onderaan: de laatste sectie, ook als ze te kort is om tot de helft van het scherm te komen
        if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) on = LIGHT[LIGHT.length - 1];
      }
      else if (step > 0 || tCur > T_HERO + 0.4) on = 'aanpak';
      quickBtns.forEach(b => b.classList.toggle('is-on', b.dataset.to === on));
      quick.classList.toggle('on-light', pageLight > 0.5);
    }

    // "Onze aanpak": naar Begrijpen
    document.getElementById('toApproach').addEventListener('click', e => {
      e.preventDefault();
      skip();
      go(1);
    });

    let last = performance.now();
    function frame(now) {
      const raw = (now - last) / 1000;
      const dt = Math.min(0.05, raw);
      last = now;
      scene.perf(raw);
      if (!introDone) {
        introT += dt;
        if (introT >= T_HERO) introDone = true;
        tCur = Math.min(introT, T_HERO);
      } else {
        const target = FILM[step];
        // het stilstaan bij een pijler, na het lezen, slaan we over als je verder scrolt (en terug)
        for (let i = 0; i < LAND.length; i++) {
          if (target > tCur && tCur >= LAND[i] - 0.001 && tCur < WAIT[i] && target > WAIT[i]) tCur = WAIT[i];
          if (target < tCur && tCur > LAND[i] && tCur <= WAIT[i] + 0.001 && target < LAND[i]) tCur = LAND[i];
        }
        // de film volgt zacht, maar nooit sneller dan rate keer het normale tempo
        const d = target - tCur;
        const arriving = d > 0 && tCur >= T_HERO - 0.001 && tCur < T_PIL;
        // na Waarmaken, naar de use cases en terug: in beide richtingen hetzelfde tempo
        const outside = tCur >= T_OUT - 0.05;
        const cap = (arriving ? SCROLL.rateArrive : outside ? SCROLL.rateOut : d > 0 ? SCROLL.rate : SCROLL.rateBack) * dt;
        let move = d * (1 - Math.exp(-dt / SCROLL.smooth));
        if (Math.abs(move) > cap) move = Math.sign(d) * cap;
        tCur = Math.abs(d) < 0.002 ? target : tCur + move;
        // aangekomen (op het laatste uitglijden na): vanaf nu loopt de korte pauze
        const near = Math.abs(target - tCur) < SCROLL.nearEnough;
        if (near && !wasNear) arrivedAt = now;
        wasNear = near;
        // een onthouden scrollbeweging volgt zodra de stap aangekomen is
        if (queued && !busy()) { const q = queued; queued = 0; go(step + q); }
        // naar de use cases: als het licht er bijna is, schuift de pagina rustig naar de volgende sectie
        if (step === SITE && !outScrolled && tCur >= scene.T_ALL - SCROLL.leadOut) {
          outScrolled = true;
          autoUntil = now + 1500;
          scrollTo({ top: siteY(), behavior: reduce ? 'instant' : 'smooth' });
        }
      }
      scene.seek(tCur);
      setPage(tCur);
      updateQuick();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ---------- De use cases ----------
  // Op de computer staan de kaarten naast elkaar (de kaart onder de muis wordt breder, in hero.css).
  // Op een gsm schuif je ze één voor één, met de pijltjes of met je vinger; je ziet al een stukje van de volgende.
  const track = document.getElementById('casesTrack');
  const prevBtn = document.getElementById('casesPrev'), nextBtn = document.getElementById('casesNext');
  const cardStep = () => {
    const c = track.querySelector('.case');
    return c ? c.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0) : 0;
  };
  function updateArrows() {
    const max = track.scrollWidth - track.clientWidth;
    document.getElementById('casesNav').classList.toggle('is-hidden', max < 4);
    prevBtn.disabled = track.scrollLeft < 4;
    nextBtn.disabled = track.scrollLeft > max - 4;
  }
  prevBtn.addEventListener('click', () => track.scrollBy({ left: -cardStep(), behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => track.scrollBy({ left: cardStep(), behavior: 'smooth' }));
  track.addEventListener('scroll', updateArrows, { passive: true });
  addEventListener('resize', updateArrows);
  updateArrows();
  // de titel, de kaarten en de knoppen komen één keer binnen, zacht na elkaar
  const reveals = [document.querySelector('.cases-head'), ...track.querySelectorAll('.case'), document.querySelector('.cases-foot')];
  // na de animatie weer een gewoon element
  const settle = el => el.addEventListener('animationend', e => { if (e.target === el) el.classList.remove('reveal', 'in'); });
  reveals.forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--reveal-delay', `${i * 140}ms`); settle(el); });
  new IntersectionObserver((entries, io) => entries.forEach(en => {
    if (!en.isIntersecting) return;
    io.disconnect();
    reveals.forEach(el => el.classList.add('in'));
  }), { threshold: 0.15 }).observe(document.getElementById('cases'));
  // de oplossingen: de titel en de rijen komen één keer binnen, elk wanneer ze in beeld komen
  const solItems = [document.querySelector('.solutions-title'), ...document.querySelectorAll('.sol-list li')];
  solItems.forEach(el => { el.classList.add('reveal'); settle(el); });
  const solIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    solIO.unobserve(en.target);
    en.target.classList.add('in');
  }), { threshold: 0.25 });
  solItems.forEach(el => solIO.observe(el));
  // de FAQ: komt binnen zoals de oplossingen
  [document.querySelector('.faq-title'), document.querySelector('.faq-index')].forEach(el => {
    el.classList.add('reveal'); settle(el); solIO.observe(el);
  });
  // een vraag kiezen: het groene balkje schuift mee, en rechts verschijnt het antwoord
  document.querySelector('.faq-list').addEventListener('click', e => {
    const pick = e.target.closest('.faq-pick');
    if (!pick || pick.parentElement.classList.contains('is-on')) return;
    document.querySelectorAll('.faq-item').forEach(li => {
      const on = li === pick.parentElement;
      li.classList.toggle('is-on', on);
      li.querySelector('.faq-pick').setAttribute('aria-expanded', String(on));
    });
    drawFaq(true);
  });

  // het team: eerst de titel, dan de drie portretten zacht na elkaar
  const teamHead = document.querySelector('.team-title'), members = [...document.querySelectorAll('.member')];
  [teamHead, ...members].forEach(el => { el.classList.add('reveal'); settle(el); });
  members.forEach((el, i) => el.style.setProperty('--reveal-delay', `${i * 140}ms`));
  const teamList = document.querySelector('.team-list');
  const teamIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    teamIO.unobserve(en.target);
    (en.target === teamList ? members : [teamHead]).forEach(el => el.classList.add('in'));
  }), { threshold: 0.15 });
  teamIO.observe(teamHead);
  teamIO.observe(teamList);

  start().catch(err => console.error(err));
})();
