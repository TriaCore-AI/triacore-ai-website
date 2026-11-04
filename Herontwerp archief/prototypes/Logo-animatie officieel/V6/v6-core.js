/* =============================================================
   Kern van V6 van de officiële logo-animatie: V5, met een omgeving.

   De animatie zelf is exact V5: rechtsboven door de spleet, linksonder langs de balken, en
   het laatste shot waarin de balken een halve slag maken terwijl de camera fel uitzoomt.
   Elke variant geeft alleen zijn omgeving mee:

     TriaLogoV6({
       studio(c, add) {},       // optioneel: extra lichtstroken in de studio die het metaal weerspiegelt
       async setup(c) {},       // optioneel, één keer: voeg objecten toe aan c.scene
       frame(c, f) {},          // optioneel, elke frame: f = { t, shot (0, 1 of 2), s, k }
       shots(SHOTS, E) {},      // optioneel: pas de shots aan (bijvoorbeeld een langer eerste shot)
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
    bezier,
    linear: x => clamp(x),
    glide: bezier(0.37, 0, 0.22, 1),
    soft: bezier(0.4, 0, 0.2, 1),
    out: bezier(0.16, 1, 0.3, 1),
    inout: bezier(0.65, 0, 0.35, 1),
    zoom: bezier(0.42, 0, 0.18, 1),
  };

  // Een vaste reeks toevalsgetallen, zodat een omgeving er bij elke keer laden hetzelfde uitziet
  function seeded(seed) {
    let s = seed >>> 0;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  // Het logo, in eenheden van 100 uit de originele SVG
  const BAR_W = 2.9156, BAR_H = 0.4857, DX = 0.5758, DY = 1.00445;
  const BARS = [{ x: -DX, y: DY }, { x: DX, y: 0 }, { x: -DX, y: -DY }];
  const LOGO_H = 2 * DY + BAR_H, LOGO_W = 2 * DX + BAR_W;
  const DEPTH = 0.2, BEVEL = 0.035;
  const FOV = 26;

  // ---------- De shots, exact uit V5 ----------
  const GAP_Y = DY / 2;   // het midden van de spleet tussen de bovenste en de middelste balk
  const SHOTS = [
    { name: 'rechtsboven, door de spleet', dur: 2.2, ease: bezier(0.3, 0, 0.75, 0.85),
      from: { az:  30, el:  18, d: 0.19,  roll: -3, ax:  0.25, ay: GAP_Y, lg: -0.2 },
      to:   { az:  30, el:  18, d: 0.065, roll: -3, ax:  0.25, ay: GAP_Y, lg:  0.1 } },
    { name: 'linksonder', dur: 2.2,
      from: { az: -38, el: -20, d: 0.33, roll:  3, ax: -0.5,  ay:  0.15, lg: -0.9 },
      to:   { az: -38, el: -20, d: 0.28, roll:  3, ax:  0.05, ay:  0.15, lg: -0.7 } },
  ];
  const FIN = 3.6, FIN_D = 0.42;
  const STAGGER = 0.26, TURN = 2.1;   // de volledige draai uit V5
  const FIELDS = ['az', 'el', 'd', 'roll', 'ax', 'ay', 'lg'];
  const FADE = 0.28;
  const BLUR = 10;

  window.TriaLogoV6 = function (opts = {}) {
    boot(opts).catch(err => console.error(err));
  };

  async function boot(opts) {
    const THREE = await import('three');
    const rad = THREE.MathUtils.degToRad;

    if (opts.shots) opts.shots(SHOTS, E);
    const T1 = SHOTS[0].dur, T2 = T1 + SHOTS[1].dur;
    const T_CAM = T2 + FIN;
    const T_END = T_CAM + 0.1;

    const stage = document.getElementById('stage');
    const canvas = stage.querySelector('.gl');

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
    const strip = (w, h, k, x, y, z, color) => {
      const col = color ? new THREE.Color(color).multiplyScalar(k) : new THREE.Color(k, k, k);
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide })
      );
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      studio.add(m);
      return m;
    };
    strip(14, 0.9, 7, 0, 6, 3);
    strip(0.8, 9, 4.5, -7, 0.5, 2);
    strip(0.6, 9, 3, 7.5, 0, -1);
    strip(18, 2.5, 1.3, 0, -6, 5);
    strip(5, 3.5, 2.2, 0, 1, 9);

    // wat een variant te zien en te zetten krijgt
    const c = {
      THREE, E, clamp, lerp, rad, seeded,
      BARS, BAR_W, BAR_H, DX, DY, DEPTH, GAP_Y, LOGO_W, LOGO_H, SHOTS,
      scene, renderer, stage, canvas,
      dist: 1, env: null, group: null, bars: null, camera: null,
      camDir: new THREE.Vector3(), camPos: new THREE.Vector3(),
    };

    if (opts.studio) opts.studio(c, strip);
    const env = new THREE.PMREMGenerator(renderer).fromScene(studio, 0.02).texture;
    c.env = env;

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
    c.titanium = () => new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F2F2F2'), metalness: 1, roughness: 0.3,
      anisotropy: 0.45, envMap: env, envMapIntensity: 1.2, fog: false,
    });

    const group = new THREE.Group();
    scene.add(group);
    const bars = BARS.map(() => {
      const mesh = new THREE.Mesh(barGeo, c.titanium());
      group.add(mesh);
      return mesh;
    });
    c.group = group; c.bars = bars;

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.03, 4000);
    c.camera = camera;
    const tn = Math.tan(rad(FOV / 2));
    let W = 0, H = 0;

    function layout() {
      W = stage.clientWidth; H = stage.clientHeight;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      c.dist = Math.max(LOGO_H / (0.25 * 2 * tn), LOGO_W / (0.6 * 2 * tn * camera.aspect));
    }
    layout();

    if (opts.setup) await opts.setup(c);

    // ---------- Wat er op seconde t te zien is ----------
    function apply(t) {
      t = clamp(t, 0, T_CAM);

      group.position.set(0, 0, 0);
      group.rotation.set(0, 0, 0);
      const glint = [0, 0, 0];
      bars.forEach((m, i) => {
        m.position.set(BARS[i].x, BARS[i].y, 0);
        m.rotation.set(0, 0, 0);
      });

      let pose, vis = 1, shot, s, k;
      if (t < T2) {
        shot = t < T1 ? 0 : 1;
        const sh = SHOTS[shot];
        s = t - (shot ? T1 : 0);
        k = clamp(s / sh.dur);
        const e = sh.ease ? sh.ease(k) : k;
        pose = {};
        for (const f of FIELDS) pose[f] = lerp(sh.from[f], sh.to[f], e);
        if (shot === 1) vis = Math.min(vis, E.soft(clamp(s / FADE)));
        vis = Math.min(vis, E.soft(clamp((sh.dur - s) / FADE)));
      } else {
        // het laatste shot, uit V5: de camera begint groot en zoomt fel uit,
        // de balken maken na elkaar een halve slag om hun lengteas
        shot = 2; s = t - T2; k = clamp(s / FIN);
        vis = E.soft(clamp(s / FADE));
        pose = { az: 0, el: 0, d: lerp(FIN_D, 1, E.zoom(k)), roll: 0, ax: 0, ay: 0, lg: lerp(-1.6, 0.32, E.soft(k)) };
        bars.forEach((m, i) => {
          const kk = E.glide(clamp((s - i * STAGGER) / TURN));
          m.rotation.x = rad(-180) * (1 - kk);
          glint[i] = 0.5 * Math.sin(2 * Math.PI * kk);
        });
      }

      // de camera kijkt altijd langs dezelfde lijn, ook als ze voorbij het logo vliegt
      const az = rad(pose.az), el = rad(pose.el), r = pose.d * c.dist, roll = rad(pose.roll);
      c.camDir.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
      camera.position.set(pose.ax, pose.ay, 0).addScaledVector(c.camDir, r);
      camera.up.set(Math.sin(roll), Math.cos(roll), 0);
      camera.lookAt(camera.position.x - c.camDir.x, camera.position.y - c.camDir.y, camera.position.z - c.camDir.z);
      c.camPos.copy(camera.position);

      bars.forEach((m, i) => m.material.envMapRotation.set(0, pose.lg + glint[i], 0));
      c.lg = pose.lg;

      if (opts.frame) opts.frame(c, { t, shot, s, k, pose });

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
