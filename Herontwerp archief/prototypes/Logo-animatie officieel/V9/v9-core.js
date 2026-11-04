/* =============================================================
   Kern van V9: V8, maar na Waarmaken zoomt de camera niet meer uit naar het logo. Vanuit de
   close-up van de onderste balk loopt de animatie door naar de zin "That's the TriaCore way" /
   "Zo werkt TriaCore". Hoe dat gebeurt, geeft elke variant mee:

     TriaLogoV9({
       raster: true,
       ending: {
         dur: 4,                    // hoe lang het slot duurt, in seconden
         render(c, words) {},       // optioneel: eigen tekst opbouwen (ook bij een taalwissel)
         camera(c, s) {},           // zet c.pose (vertrekt van de close-up van Waarmaken) op seconde s
         overlay(c, s) {},          // zet de tekst: c.pillar, c.trail(...), c.way(...)
       },
     });

   Hieronder volgt de uitleg van V8, waarop V9 verder bouwt.
   =============================================================
   Kern van V8 van de officiële logo-animatie: V7, met de drie pijlers.

   Tot het eindbeeld is dit V7: rechtsboven door de spleet, linksonder langs de balken, en het
   laatste shot waarin de balken een halve slag maken terwijl de camera uitzoomt. Enige verschil:
   dat uitzoomen glijdt korter uit, zodat het logo maar heel even volledig staat voor het inzoomen.

   Nieuw in V8, zonder één knip:
   1. het logo staat even stil;
   2. de camera zoomt in op de bovenste balk: de balk staat links, een lijn vertrekt naar
      rechts, /01 Begrijpen;
   3. de camera zakt naar de middelste balk: die staat rechts, de lijn vertrekt naar links,
      /02 Vertalen;
   4. de camera zakt naar de onderste balk: weer links, de lijn naar rechts, /03 Waarmaken;
   5. de camera trekt terug tot het volledige logo, in het midden.
   Van de buren van elke balk zie je telkens nog een strookje.

     TriaLogoV8({ raster: true });                             // enkel het logo op het einde
     TriaLogoV8({ raster: true, name: true });                 // met de naam onder het logo
     TriaLogoV8({ raster: true, name: true, slogan: true });   // met de naam en de slogan (plaatshouder)

   Bij elke pijler komt de tekst stap voor stap: eerst de lijn, dan het nummer en het woord, dan
   de zin eronder woord per woord. Het tempo staat in TXT, hieronder.

   De knop NL / EN rechtsboven wisselt de taal (ook ?lang=en). G zet het raster aan of uit. ?t=12 zet het beeld vast
   op seconde 12 (om stilstaande beelden te controleren).
   ============================================================= */
(function () {
  'use strict';

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;

  // Een easing zoals cubic-bezier() in CSS
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = t => ((ax * t + bx) * t + cx) * t;
    const sy = t => ((ay * t + by) * t + cy) * t;
    const dx = t => (3 * ax * t + 2 * bx) * t + cx;
    return x => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) {
        const e = sx(t) - x, d = dx(t);
        if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break;
        t -= e / d;
      }
      return sy(clamp(t));
    };
  }
  const E = {
    linear: x => clamp(x),
    glide: bezier(0.37, 0, 0.22, 1),
    soft: bezier(0.4, 0, 0.2, 1),
    out: bezier(0.16, 1, 0.3, 1),
    zoom: bezier(0.42, 0, 0.72, 1),    // V8: kort afremmen, zodat het logo maar heel even stilstaat voor het inzoomen
    dive: bezier(0.3, 0, 0.3, 1),      // het inzoomen naar de eerste balk: vlot vertrekken na het uitzoomen
    move: bezier(0.55, 0, 0.3, 1),     // van balk naar balk: zacht vertrekken, zacht aankomen
    back: bezier(0.45, 0, 0.15, 1),    // terugtrekken naar het logo: lang uitglijden
    inout: bezier(0.65, 0, 0.35, 1),   // V9: voor wat van plaats wisselt (de rijen die samensmelten)
  };

  // Het logo, in eenheden van 100 uit de originele SVG
  const BAR_W = 2.9156, BAR_H = 0.4857, DX = 0.5758, DY = 1.00445;
  const BARS = [{ x: -DX, y: DY }, { x: DX, y: 0 }, { x: -DX, y: -DY }];
  const LOGO_H = 2 * DY + BAR_H, LOGO_W = 2 * DX + BAR_W;
  const DEPTH = 0.2, BEVEL = 0.035;
  const FOV = 26;

  // ---------- Het eerste deel, exact uit V7 ----------
  const GAP_Y = DY / 2;
  const LG_1 = -0.2, LG_FIN = 0.32;
  const SHOTS = [
    { name: 'rechtsboven, door de spleet', dur: 2.2, ease: bezier(0.3, 0, 0.75, 0.85),
      from: { az:  30, el:  18, d: 0.19,  roll: -3, ax:  0.25, ay: GAP_Y, lg: LG_1 },
      to:   { az:  30, el:  18, d: 0.065, roll: -3, ax:  0.25, ay: GAP_Y, lg: LG_1 } },
    { name: 'linksonder', dur: 2.2,
      from: { az: -38, el: -20, d: 0.33, roll:  3, ax: -0.5,  ay:  0.15, lg: -0.9 },
      to:   { az: -38, el: -20, d: 0.28, roll:  3, ax:  0.05, ay:  0.15, lg: -0.7 } },
  ];
  const FIN = 3.0, FIN_D = 0.42;   // V8: 3,0 in plaats van 3,6 (V7). De balken zijn na 2,6 s omgedraaid
  const STAGGER = 0.26, TURN = 2.1;
  const FIELDS = ['az', 'el', 'd', 'roll', 'ax', 'ay', 'lg'];
  const FADE = 0.28;
  const BLUR = 10;

  // ---------- Het tweede deel: de pijlers ----------
  const WORDS = {
    nl: {
      pillars: ['Begrijpen', 'Vertalen', 'Waarmaken'],
      desc: [
        'We leren jouw uitdagingen echt kennen.',
        'We vertalen jouw uitdaging naar een concreet plan.',
        'We realiseren je oplossing en begeleiden je onderweg.',
      ],
      slogan: 'Tot in de kern.',
      way: ['Zo werkt', 'TriaCore.'],
    },
    en: {
      pillars: ['Understand', 'Translate', 'Deliver'],
      desc: [
        'We get to know your challenges inside out.',
        'We turn your challenge into an actionable plan.',
        'We deliver your solution and guide you along the way.',
      ],
      slogan: 'Down to the core.',
      way: ["That's the", 'TriaCore way.'],
    },
  };

  // ---------- Het tempo van de tekst bij elke pijler ----------
  // In seconden, gerekend vanaf het moment dat de camera bij de balk aankomt.
  // Pas deze getallen aan om het ideale leestempo te vinden.
  const TXT = {
    lineAt: -0.25, lineIn: 0.8,    // eerst tekent de lijn zich
    labelAt: 0.2, labelIn: 0.8,    // dan het nummer en het woord
    descAt: 0.8,                   // dan de zin eronder, woord per woord
    wordStep: 0.06, wordIn: 0.6,   // tussen twee woorden, en hoe lang één woord erover doet
    read: 1.8,                     // zo lang staat alles volledig in beeld om te lezen
    outIn: 0.45,                   // en zo snel vervaagt het, terwijl de camera al vertrekt
  };
  // hoe lang de camera bij een balk blijft: tot de langste zin gelezen is
  const P_HOLD = TXT.descAt + 8 * TXT.wordStep + TXT.wordIn + TXT.read;
  const SIDE = [1, -1, 1];       // de lijn vertrekt naar rechts (1) of naar links (-1)
  const FRAME_HH = 0.86;         // halve beeldhoogte bij een pijler: de balk groot, de buren als strookje
  const END_AT = 0.36;           // het uiteinde van de balk staat op 36 % van de breedte (of 64 % gespiegeld)
  const ANGLE = 5;               // de camera staat een fractie schuin, zodat je de dikte van het metaal ziet
  // het licht in de close-ups, per balk. De middelste toont zijn andere uiteinde en vangt meer licht,
  // daarom staat het licht daar anders, zodat hij even donker zilver is als de andere twee.
  const LG_PILLARS = [-0.35, -0.55, -0.35];
  const SIGN_Y = -0.62;          // op het einde schuift het logo iets omhoog om plaats te maken voor de naam
  // ---------- Op een gsm (staand scherm) ----------
  // Alleen als het scherm duidelijk hoger is dan breed. Op de computer verandert er niets.
  const PORTRAIT_MAX = 0.85;     // breedte gedeeld door hoogte
  const PORTRAIT_HH = 1.0;       // de close-ups van de pijlers iets ruimer, zodat er plaats is voor het woord
  const PORTRAIT_END_AT = 0.27;  // minder van de balk in beeld, zodat het woord ernaast past (zoals op de computer)
  const P_HOLD0 = 0, P_IN = 1.4, P_MOVE = 1.3, P_OUT = 1.9, P_END = 0.6;

  window.TriaLogoV9 = function (opts = {}) {
    boot(opts).catch(err => console.error(err));
  };

  async function boot(opts) {
    const THREE = await import('three');
    const rad = THREE.MathUtils.degToRad;

    const T1 = SHOTS[0].dur, T2 = T1 + SHOTS[1].dur;
    const T_CAM = T2 + FIN;

    const stage = document.getElementById('stage');
    const canvas = stage.querySelector('.gl');

    const params = new URLSearchParams(location.search);
    const fixed = params.get('t');
    const still = fixed !== null && !Number.isNaN(parseFloat(fixed));
    const lgParam = parseFloat(params.get('lg'));
    const lgTest = still && !Number.isNaN(lgParam) ? lgParam : null;
    if (params.get('raster') === '0') opts.raster = false;
    if (params.get('raster') === '1') opts.raster = true;
    let lang = params.get('lang') === 'en' ? 'en' : (opts.lang || 'nl');

    // ---------- Het slot na Waarmaken: wat een variant te zien en te zetten krijgt ----------
    const ending = opts.ending || { dur: 1, camera() {}, overlay() {} };
    const C = { E, clamp, lerp, pose: {} };

    // ---------- De tekst: drie pijlers met hun zin, de naam en de slogan ----------
    const texts = document.createElement('div');
    stage.appendChild(texts);
    let pillarEls = [], descWords = [], signEl = null;

    function renderText() {
      const words = WORDS[lang];
      document.documentElement.lang = lang;
      texts.innerHTML = `
        ${words.pillars.map((w, i) => `
          <div class="pillar ${SIDE[i] > 0 ? 'to-right' : 'to-left'}"><div class="p-in">
            <span class="p-line"></span>
            <span class="p-text">
              <span class="p-label"><span class="p-num">/0${i + 1}</span><span class="p-word">${w}</span></span>
              <span class="p-desc">${words.desc[i].split(' ').map(x => `<span class="w">${x}</span>`).join(' ')}</span>
            </span>
          </div></div>`).join('')}
        ${opts.name ? `<div class="sign"><p class="name">TriaCore <span class="ai">AI</span></p>${opts.slogan ? `<p class="slogan">${words.slogan}</p>` : ''}</div>` : '<div class="sign"></div>'}
        <div class="trail"></div>
        <div class="extra"></div>
        <p class="way">${words.way[0].split(' ').map(x => `<span class="w">${x}</span>`).join(' ')} ${words.way[1].split(' ').map(x => `<span class="w g">${x}</span>`).join(' ')}</p>`;
      pillarEls = [...texts.querySelectorAll('.pillar')];
      descWords = pillarEls.map(el => [...el.querySelectorAll('.p-desc .w')]);
      signEl = texts.querySelector('.sign');
      C.trailEl = texts.querySelector('.trail');
      C.wayEl = texts.querySelector('.way');
      C.wayWords = [...C.wayEl.querySelectorAll('.w')];
      C.extra = texts.querySelector('.extra');
      C.pillar = pillarEls[2];
      C.words = words;
      if (ending.render) ending.render(C, words);
      langEl.querySelectorAll('button').forEach(b => b.classList.toggle('is-on', b.dataset.lang === lang));
    }

    // de taalknop bovenaan: wisselt de tekst zonder de animatie te herstarten
    stage.insertAdjacentHTML('beforeend', `
      <div class="lang" role="group" aria-label="Taal"><button type="button" data-lang="nl">NL</button><span>/</span><button type="button" data-lang="en">EN</button></div>`);
    const langEl = stage.querySelector('.lang');
    langEl.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || b.dataset.lang === lang) return;
      lang = b.dataset.lang;
      const u = new URL(location.href);
      u.searchParams.set('lang', lang);
      history.replaceState(null, '', u);
      renderText();
      if (!running) apply(t);
    });
    renderText();

    // ---------- Three.js ----------
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: still });
    let dpr = Math.min(window.devicePixelRatio, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();

    // een donkere studio met lichtstroken: dat is wat het metaal weerspiegelt
    const studio = new THREE.Scene();
    studio.background = new THREE.Color(0x06090f);
    const strip = (w, h, k, x, y, z) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k), side: THREE.DoubleSide })
      );
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
    const barGeo = new THREE.ExtrudeGeometry(shape, {
      depth: DEPTH, bevelEnabled: true, bevelThickness: BEVEL, bevelSize: BEVEL, bevelSegments: 10, curveSegments: 48,
    });
    barGeo.center();

    const bars = BARS.map(() => {
      const mesh = new THREE.Mesh(barGeo, new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#F2F2F2'), metalness: 1, roughness: 0.3,
        anisotropy: 0.45, envMap: env, envMapIntensity: 1.2, fog: false,
      }));
      scene.add(mesh);
      return mesh;
    });

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.03, 4000);
    const tn = Math.tan(rad(FOV / 2));
    let W = 0, H = 0, dist = 1, shotDist = 1, portrait = false;
    C.bars = bars; C.rad = rad; C.BARS = BARS; C.BAR_W = BAR_W; C.BAR_H = BAR_H; C.tn = tn;

    // de rastervloer uit V6, variant 01. De toets G zet ze aan of uit.
    scene.fog = new THREE.Fog(0x0B1220, 8, 46);
    const grid = new THREE.GridHelper(160, 160, 0xffffff, 0xffffff);
    grid.material.transparent = true;
    grid.material.depthWrite = false;
    grid.position.y = -2.2;
    grid.visible = !!opts.raster;
    scene.add(grid);

    // ---------- De camerareis langs de pijlers ----------
    // Een stand hier: waar de camera naar kijkt (ax, ay), op welke afstand (r), en onder welke hoek (az, el).
    let PSEG = [], P_TOTAL = 0, HOLD_AT = [], OUT_AT = 0;

    function buildPillars() {
      const HH = portrait ? PORTRAIT_HH : FRAME_HH, endAt = portrait ? PORTRAIT_END_AT : END_AT;
      const R = HH / tn, halfW = HH * camera.aspect;
      // lg: het licht schuift mee met de camera, zodat elke balk in zijn close-up hetzelfde donkere zilver heeft
      const F = { ax: 0, ay: 0, r: dist, az: 0, el: 0, lg: LG_FIN };
      const S = { ax: 0, ay: opts.name ? SIGN_Y : 0, r: dist, az: 0, el: 0, lg: LG_FIN };
      const P = BARS.map((b, i) => {
        const end = b.x + SIDE[i] * BAR_W / 2;
        const ax = end + SIDE[i] * (1 - 2 * endAt) * halfW;
        // dezelfde hoek bij alle drie, zodat het metaal telkens hetzelfde licht vangt
        const a = { ax, ay: b.y, r: R, az: ANGLE, el: 3, lg: LG_PILLARS[i] };
        // tijdens het stilstaan drift de camera heel licht verder, zodat het beeld nooit bevriest
        const z = { ...a, ax: ax + SIDE[i] * 0.05, r: R * 0.96 };
        return [a, z];
      });
      PSEG = [
        { dur: P_HOLD0, from: F, to: F, ease: E.linear },
        { dur: P_IN, from: F, to: P[0][0], ease: E.dive },
        { dur: P_HOLD, from: P[0][0], to: P[0][1], ease: E.linear },
        { dur: P_MOVE, from: P[0][1], to: P[1][0], ease: E.move },
        { dur: P_HOLD, from: P[1][0], to: P[1][1], ease: E.linear },
        { dur: P_MOVE, from: P[1][1], to: P[2][0], ease: E.move },
        { dur: P_HOLD, from: P[2][0], to: P[2][1], ease: E.linear },
      ];
      // V9: geen terugtrekken meer. Het slot vertrekt van de close-up van Waarmaken.
      void S;
      P_TOTAL = PSEG.reduce((a, s) => a + s.dur, 0);
      C.from = { ...P[2][1] };
      C.R = R; C.halfW = halfW; C.HH = HH;
      HOLD_AT = [P_HOLD0 + P_IN, P_HOLD0 + P_IN + P_HOLD + P_MOVE, P_HOLD0 + P_IN + 2 * (P_HOLD + P_MOVE)];
      OUT_AT = HOLD_AT[2] + P_HOLD;
    }

    function pillarPose(tp) {
      let s = clamp(tp, 0, P_TOTAL);
      for (const seg of PSEG) {
        if (s <= seg.dur) {
          const e = seg.ease(seg.dur ? s / seg.dur : 1);
          const o = {};
          for (const f in seg.from) o[f] = lerp(seg.from[f], seg.to[f], e);
          return o;
        }
        s -= seg.dur;
      }
      const lastSeg = PSEG[PSEG.length - 1];
      return { ...lastSeg.to };
    }

    function layout() {
      W = stage.clientWidth; H = stage.clientHeight;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      dist = Math.max(LOGO_H / (0.25 * 2 * tn), LOGO_W / (0.6 * 2 * tn * camera.aspect));
      // op een staand scherm staat de camera in de shots verder, zodat je in de breedte ongeveer
      // evenveel van het logo ziet als op de computer. Op de computer is shotDist gewoon dist.
      portrait = camera.aspect < PORTRAIT_MAX;
      shotDist = portrait ? (LOGO_H / (0.25 * 2 * tn)) * Math.pow((16 / 9) / camera.aspect, 0.75) : dist;
      stage.classList.toggle('portrait', portrait);
      buildPillars();
    }
    layout();
    const T_ALL = T_CAM + P_TOTAL + ending.dur;
    const T_END = T_ALL + 0.1;

    // ---------- Wat er op seconde t te zien is ----------
    const v = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const project = (x, y, z) => { v.set(x, y, z).project(camera); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H]; };

    // ---------- Hulpmiddelen voor het slot ----------
    C.project = (x, y, z) => project(x, y, z);
    // het punt waar de lijn van Waarmaken vertrekt: net naast het uiteinde van de onderste balk
    C.anchor = () => project(BARS[2].x + BAR_W / 2 + 0.03, BARS[2].y, DEPTH / 2 + BEVEL);
    // de zichtbare lijn van Waarmaken, zoals ze op het scherm staat
    C.lineBox = () => C.pillar.querySelector('.p-line').getBoundingClientRect();
    // de tekst van Waarmaken (woord en zin) en zijn lijn apart laten vervagen
    C.fadeText = o => { C.pillar.querySelector('.p-text').style.opacity = String(o); };
    C.fadeLine = o => { C.pillar.querySelector('.p-line').style.opacity = String(o); };
    // een vrije lijn op het scherm, van x1 tot x2 op hoogte y
    C.trail = (x1, x2, y, o = 1) => {
      const s = C.trailEl.style;
      s.opacity = String(o);
      s.transform = `translate3d(${Math.min(x1, x2).toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      s.width = `${Math.abs(x2 - x1).toFixed(1)}px`;
    };
    // de zin "That's the TriaCore way": woord per woord vanaf seconde 'at', op positie x, y
    C.way = (s, at, x, y, align = 'center') => {
      const st = C.wayEl.style;
      st.transform = align === 'left'
        ? `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translateY(-50%)`
        : `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      C.wayWords.forEach((w, j) => {
        const k = E.out(clamp((s - at - j * 0.09) / 0.75));
        w.style.opacity = k.toFixed(3);
        w.style.transform = `translateY(${((1 - k) * 0.35).toFixed(3)}em)`;
        w.style.filter = k < 0.999 ? `blur(${((1 - k) * 6).toFixed(2)}px)` : 'none';
      });
    };
    C.wayWidth = () => C.wayEl.getBoundingClientRect().width;

    function placeCamera(ax, ay, r, azDeg, elDeg, rollDeg) {
      const az = rad(azDeg), el = rad(elDeg), roll = rad(rollDeg || 0);
      dir.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
      camera.position.set(ax, ay, 0).addScaledVector(dir, r);
      camera.up.set(Math.sin(roll), Math.cos(roll), 0);
      camera.lookAt(camera.position.x - dir.x, camera.position.y - dir.y, camera.position.z - dir.z);
      camera.updateMatrixWorld();
    }

    function apply(t) {
      t = clamp(t, 0, T_ALL);

      bars.forEach((m, i) => {
        m.position.set(BARS[i].x, BARS[i].y, 0);
        m.rotation.set(0, 0, 0);
      });

      let vis = 1, lg = LG_FIN, gridO = 0.03, tp = -1;
      if (t < T2) {
        const shot = t < T1 ? 0 : 1;
        const sh = SHOTS[shot];
        const s = t - (shot ? T1 : 0);
        const k = clamp(s / sh.dur);
        const e = sh.ease ? sh.ease(k) : k;
        const p = {};
        for (const f of FIELDS) p[f] = lerp(sh.from[f], sh.to[f], e);
        if (shot === 1) vis = Math.min(vis, E.soft(clamp(s / FADE)));
        vis = Math.min(vis, E.soft(clamp((sh.dur - s) / FADE)));
        placeCamera(p.ax, p.ay, p.d * shotDist, p.az, p.el, p.roll);
        // linksonder komt de camera van onder de vloer: daar hoort geen raster
        lg = p.lg; gridO = shot === 1 ? 0 : 0.08;
      } else if (t < T_CAM) {
        // het laatste shot uit V7: de camera zoomt uit, de balken maken een halve slag
        const s = t - T2, k = clamp(s / FIN);
        vis = E.soft(clamp(s / FADE));
        placeCamera(0, 0, lerp(FIN_D * shotDist, dist, E.zoom(k)), 0, 0, 0);
        bars.forEach((m, i) => {
          m.rotation.x = rad(-180) * (1 - E.glide(clamp((s - i * STAGGER) / TURN)));
        });
        gridO = lerp(0.08, 0.03, E.soft(k));
      } else {
        // de pijlers: één doorlopende camerabeweging, zonder knip
        tp = t - T_CAM;
        let p;
        if (tp > P_TOTAL) {
          // het slot: de variant zet de camera, vertrekkend van de close-up van Waarmaken
          C.pose = { ...C.from };
          C.grid = gridO;
          ending.camera(C, tp - P_TOTAL);
          p = C.pose;
          gridO = C.grid;
        } else {
          p = pillarPose(tp);
        }
        placeCamera(p.ax, p.ay, p.r, p.az, p.el, p.roll || 0);
        lg = p.lg;
      }

      bars.forEach(m => m.material.envMapRotation.set(0, lgTest ?? lg, 0));
      grid.material.opacity = gridO;

      // de lijnen en woorden hangen aan het uiteinde van hun balk en bewegen mee.
      // Stap voor stap: eerst de lijn, dan het nummer en het woord, dan de zin woord per woord.
      pillarEls.forEach((el, i) => {
        let a = 0, lineK = 0, labelK = 0;
        const h = HOLD_AT[i];
        if (tp >= 0) {
          lineK = E.out(clamp((tp - (h + TXT.lineAt)) / TXT.lineIn));
          labelK = E.out(clamp((tp - (h + TXT.labelAt)) / TXT.labelIn));
          // V9: de laatste pijler vervaagt niet vanzelf, het slot beslist wat ermee gebeurt
          a = i === 2 ? 1 : 1 - E.soft(clamp((tp - (h + P_HOLD - 0.1)) / TXT.outIn));
        }
        descWords[i].forEach((w, j) => {
          const k = tp >= 0 ? E.out(clamp((tp - (h + TXT.descAt + j * TXT.wordStep)) / TXT.wordIn)) : 0;
          w.style.opacity = k.toFixed(3);
          w.style.transform = `translateY(${((1 - k) * 0.45).toFixed(3)}em)`;
          w.style.filter = k < 0.999 ? `blur(${((1 - k) * 4).toFixed(2)}px)` : 'none';
        });
        if (lineK <= 0 || a <= 0) { el.style.opacity = '0'; return; }
        const b = BARS[i];
        const [x, y] = project(b.x + SIDE[i] * (BAR_W / 2 + 0.03), b.y, DEPTH / 2 + BEVEL);
        el.style.opacity = a.toFixed(3);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        el.style.setProperty('--line', lineK.toFixed(3));
        el.style.setProperty('--label', labelK.toFixed(3));
      });

      // ---------- het slot: de tekst ----------
      const pText = C.pillar.querySelector('.p-text'), pLine = C.pillar.querySelector('.p-line');
      if (tp > P_TOTAL) {
        C.W = W; C.H = H; C.portrait = portrait;
        C.extra.style.opacity = '1';
        ending.overlay(C, tp - P_TOTAL);
      } else {
        // voor het slot: niets ervan zichtbaar, en de laatste pijler zoals in V8
        C.trailEl.style.opacity = '0';
        C.wayWords.forEach(w => { w.style.opacity = '0'; });
        C.extra.style.opacity = '0';
        pText.style.opacity = ''; pLine.style.opacity = '';
      }

      // de naam en de slogan, onder het logo
      if (tp >= 0) {
        const n = E.out(clamp((tp - (OUT_AT + 1.0)) / 1.0));
        const sl = E.out(clamp((tp - (OUT_AT + 1.35)) / 1.0));
        const [, yb] = project(0, -DY - BAR_H / 2, 0);
        signEl.style.transform = `translate3d(0, ${(yb + Math.max(28, H * 0.045)).toFixed(1)}px, 0)`;
        signEl.style.setProperty('--n', n.toFixed(3));
        signEl.style.setProperty('--s', sl.toFixed(3));
      } else {
        signEl.style.setProperty('--n', '0');
        signEl.style.setProperty('--s', '0');
      }

      canvas.style.opacity = vis.toFixed(3);
      canvas.style.filter = vis < 0.999 ? `blur(${((1 - vis) * BLUR).toFixed(2)}px)` : 'none';

      renderer.render(scene, camera);
    }

    // ---------- De lus ----------
    let t = 0, fast = false, running = false, last = 0, slow = 1 / 60;

    function frame(now) {
      const raw = (now - last) / 1000;
      const dt = Math.min(0.05, raw);
      last = now;
      t += dt * (fast ? 7 : 1);

      if (raw < 0.25) slow = lerp(slow, raw, 0.05);
      if (slow > 1 / 45 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.25);
        renderer.setPixelRatio(dpr);
        renderer.setSize(W, H, false);
        slow = 1 / 60;
      }

      apply(t);
      if (t < T_END) requestAnimationFrame(frame);
      else { running = false; fast = false; }
    }

    function play() {
      t = 0; fast = false;
      stage.classList.remove('is-on', 'is-fast');
      void stage.offsetWidth;
      stage.classList.add('is-on');
      if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
    }

    // tijdens de animatie: klik of toets spoelt door. Achteraf: klik of R speelt opnieuw af.
    function onInput(e) {
      if (still) return;
      if (e.target && e.target.closest && e.target.closest('.lang')) return;   // de taalknop spoelt niet door
      if (e.type === 'keydown' && (e.key === 'g' || e.key === 'G')) { grid.visible = !grid.visible; if (!running) apply(t); return; }
      if (e.type === 'keydown' && (e.key === 'r' || e.key === 'R') && !running) return play();
      if (running && t < T_ALL) { fast = true; stage.classList.add('is-fast'); }
      else if (!running && e.type === 'pointerdown') play();
    }
    window.addEventListener('pointerdown', onInput);
    window.addEventListener('keydown', onInput);
    window.addEventListener('resize', () => { layout(); if (!running) apply(t); });

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    await Promise.race([fontsReady, new Promise(r => setTimeout(r, 900))]);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still || reduce) {
      t = still ? clamp(parseFloat(fixed), 0, T_END) : T_END;
      stage.classList.add('is-still', 'is-on');
      apply(t);
    } else {
      play();
    }
  }
})();
