/* =============================================================
   Gedeelde kern voor de vijf V2-varianten van de officiële logo-animatie.

   Shot 1 (rechtsboven) en shot 2 (linksonder) zijn exact die van V1: dichtbij en traag
   recht inzoomend, met een zachte knip ertussen. Daarna volgt één laatste shot waarin de
   camera stilstaat in het eindbeeld en het logo zelf op zijn plek komt. Hoe dat gebeurt,
   geeft elke variant mee:

     TriaLogoV2({
       dur: 3,                 // duur van het laatste shot, in seconden
       start(c) {},            // optioneel, één keer: extra opzet
       finale(c, s, k) {},     // elke frame: zet c.group, c.bars[i] en c.pose op seconde s (k = s / dur)
     });

   Gewoon script (geen module), zodat het ook werkt als je het HTML-bestand rechtstreeks
   opent. Three.js komt via de import map in de pagina.
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
    glide: bezier(0.37, 0, 0.22, 1),   // traag vertrekken, lang uitglijden (zoals de basis)
    soft: bezier(0.4, 0, 0.2, 1),
    out: bezier(0.16, 1, 0.3, 1),      // snel erin, traag eruit
    inout: bezier(0.65, 0, 0.35, 1),
  };

  // Het logo, in eenheden van 100 uit de originele SVG
  const BAR_W = 2.9156, BAR_H = 0.4857, DX = 0.5758, DY = 1.00445;
  const BARS = [{ x: -DX, y: DY }, { x: DX, y: 0 }, { x: -DX, y: -DY }];
  const LOGO_H = 2 * DY + BAR_H, LOGO_W = 2 * DX + BAR_W;
  const DEPTH = 0.2, BEVEL = 0.035;
  const FOV = 26;

  // ---------- Shot 1 en 2, exact uit V1 ----------
  // Een stand: hoek rond het logo (az, links/rechts), hoogte (el, boven/onder), afstand als deel
  // van het eindbeeld (d), kanteling (roll), waar de camera naar kijkt (ax, ay), licht (lg).
  const SHOTS = [
    { name: 'rechtsboven', dur: 1.9,
      from: { az:  36, el:  27, d: 0.34, roll: -3, ax: 0.15, ay:  0.2,  lg: -0.2 },
      to:   { az:  36, el:  27, d: 0.28, roll: -3, ax: 0.15, ay:  0.2,  lg:  0.15 } },
    { name: 'linksonder', dur: 1.9,
      from: { az: -38, el: -20, d: 0.36, roll:  3, ax: -0.2, ay:  0.15, lg: -0.9 },
      to:   { az: -38, el: -20, d: 0.30, roll:  3, ax: -0.2, ay:  0.15, lg: -0.6 } },
  ];
  const FIELDS = ['az', 'el', 'd', 'roll', 'ax', 'ay', 'lg'];
  const FADE = 0.28;   // seconden dat het beeld wegvervaagt, en evenveel om terug te komen
  const BLUR = 10;     // zoveel pixels vervaagt het beeld op het moment van de knip

  window.TriaLogoV2 = function (opts) {
    boot(opts).catch(err => console.error(err));
  };

  async function boot(opts) {
    const THREE = await import('three');
    const rad = THREE.MathUtils.degToRad;

    const FIN = opts.dur || 3;
    const T1 = SHOTS[0].dur, T2 = T1 + SHOTS[1].dur;
    const T_CAM = T2 + FIN;
    const T_END = T_CAM + 0.1;

    const stage = document.getElementById('stage');
    const canvas = stage.querySelector('.gl');

    // ?t=3 zet de animatie vast op seconde 3 (om stilstaande beelden te controleren)
    const params = new URLSearchParams(location.search);
    const fixed = params.get('t');
    const still = fixed !== null && !Number.isNaN(parseFloat(fixed));

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

    // de balken hangen samen in één groep, zodat een variant het hele logo kan draaien
    const group = new THREE.Group();
    scene.add(group);
    const bars = BARS.map(() => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#F2F2F2'), metalness: 1, roughness: 0.3,
        anisotropy: 0.45, envMap: env, envMapIntensity: 1.2,
      });
      const mesh = new THREE.Mesh(barGeo, mat);
      group.add(mesh);
      return mesh;
    });

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.03, 4000);
    const tn = Math.tan(rad(FOV / 2));
    let W = 0, H = 0, dist = 1;

    // wat een variant te zien en te zetten krijgt
    const c = {
      THREE, E, clamp, lerp, rad,
      BARS, BAR_W, BAR_H, DX, DY, DEPTH,
      group, bars, camera,
      pose: {},          // de camerastand in het laatste shot
      glint: [0, 0, 0],  // extra licht per balk
    };

    function layout() {
      W = stage.clientWidth; H = stage.clientHeight;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      // het eindbeeld: het logo in het midden, een kwart van de hoogte (zoals de basis)
      dist = Math.max(LOGO_H / (0.25 * 2 * tn), LOGO_W / (0.6 * 2 * tn * camera.aspect));
    }

    // ---------- Wat er op seconde t te zien is ----------
    function apply(t) {
      t = clamp(t, 0, T_CAM);

      // elke frame vertrekt van het logo in rust; de variant past aan
      group.position.set(0, 0, 0);
      group.rotation.set(0, 0, 0);
      bars.forEach((m, i) => {
        m.position.set(BARS[i].x, BARS[i].y, 0);
        m.rotation.set(0, 0, 0);
        m.scale.set(1, 1, 1);
        m.visible = true;
      });
      c.glint = [0, 0, 0];

      let pose, vis = 1;
      if (t < T2) {
        const i = t < T1 ? 0 : 1;
        const s = SHOTS[i], local = t - (i ? T1 : 0);
        const k = clamp(local / s.dur);
        pose = {};
        for (const f of FIELDS) pose[f] = lerp(s.from[f], s.to[f], k);
        if (i === 1) vis = Math.min(vis, E.soft(clamp(local / FADE)));
        vis = Math.min(vis, E.soft(clamp((s.dur - local) / FADE)));
      } else {
        // het laatste shot: de camera begint dichtbij, recht voor het logo, en wijkt terug tot
        // het eindbeeld terwijl het logo zelf beweegt. De lichtstreep loopt zoals in de basis.
        const s = t - T2, k = clamp(s / FIN);
        vis = E.soft(clamp(s / FADE));
        c.pose = { az: 0, el: 0, d: lerp(0.6, 1, E.glide(k)), roll: 0, ax: 0, ay: 0, lg: lerp(-1.6, 0.32, E.soft(k)) };
        opts.finale(c, s, k);
        pose = c.pose;
      }

      const az = rad(pose.az), el = rad(pose.el), r = pose.d * dist, roll = rad(pose.roll);
      camera.position.set(
        pose.ax + r * Math.sin(az) * Math.cos(el),
        pose.ay + r * Math.sin(el),
        r * Math.cos(az) * Math.cos(el)
      );
      camera.up.set(Math.sin(roll), Math.cos(roll), 0);
      camera.lookAt(pose.ax, pose.ay, 0);

      bars.forEach((m, i) => m.material.envMapRotation.set(0, pose.lg + c.glint[i], 0));

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

      // haalt de computer de 60 beelden per seconde niet, dan iets minder pixels
      if (raw < 0.25) slow = lerp(slow, raw, 0.05);
      if (slow > 1 / 45 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.25);
        renderer.setPixelRatio(dpr);
        renderer.setSize(W, H, false);
        slow = 1 / 60;
      }

      apply(t);
      // na het eindbeeld rekent de computer niet meer door
      if (t < T_END) requestAnimationFrame(frame);
      else { running = false; fast = false; }
    }

    function play() {
      t = 0; fast = false;
      stage.classList.remove('is-on', 'is-fast');
      void stage.offsetWidth;   // de sluier begint opnieuw vanaf zwart
      stage.classList.add('is-on');
      if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
    }

    // tijdens de intro: klik of toets spoelt door. Na de intro: klik of R speelt opnieuw af.
    function onInput(e) {
      if (still) return;
      if (e.type === 'keydown' && (e.key === 'r' || e.key === 'R') && !running) return play();
      if (running && t < T_CAM) { fast = true; stage.classList.add('is-fast'); }
      else if (!running && e.type === 'pointerdown') play();
    }
    window.addEventListener('pointerdown', onInput);
    window.addEventListener('keydown', onInput);
    window.addEventListener('resize', () => { layout(); if (!running) apply(t); });

    if (opts.start) opts.start(c);
    layout();
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
