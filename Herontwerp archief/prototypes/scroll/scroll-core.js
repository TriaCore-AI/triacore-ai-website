/* =============================================================
   Gedeelde kern voor de vijf scrollvarianten.

   Doet wat elke variant nodig heeft: de titanium balken, de intro met de
   camera, de lichtstreep, de hover met de pijlers, en de vastgezette hero.
   Elke variant geeft alleen zijn eigen scrollbeweging mee:

     TriaHero({
       scroll: 1.5,        // hoe lang de hero blijft staan, in schermhoogtes
       frame(c) {},        // zet de 3D-stand voor scrollvoortgang c.p (0 tot 1)
       overlay(c) {},      // zet HTML-elementen op hun plek
       layout(c) {},       // optioneel, na elke herschaling
     });

   Gewoon script (geen module), zodat het ook werkt als je het HTML-bestand
   rechtstreeks opent. Three.js komt via de import map in de pagina.
   ============================================================= */
(function () {
  'use strict';

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

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
    glide: bezier(0.37, 0, 0.22, 1),   // traag vertrekken, lang uitglijden
    soft: bezier(0.4, 0, 0.2, 1),
    inout: bezier(0.65, 0, 0.35, 1),   // voor wat van plaats wisselt
  };

  // Het logo, in eenheden van 100 uit de originele SVG
  const BAR_W = 2.9156, BAR_H = 0.4857, DX = 0.5758, DY = 1.00445;
  const BARS = [{ x: -DX, y: DY }, { x: DX, y: 0 }, { x: -DX, y: -DY }];
  const LOGO_H = 2 * DY + BAR_H, LOGO_W = 2 * DX + BAR_W;
  const DEPTH = 0.2, BEVEL = 0.035;
  const FOV = 26;

  const T_CAM = 5.6;    // de camera glijdt van de rand naar het volledige logo
  const T_SIGN = 4.4;   // de naam onderaan

  const TOP = `
    <canvas class="gl" aria-label="The TriaCore AI logo in light titanium: three bars, for understand, translate and deliver"></canvas>
    <div class="veil"></div>`;
  const BOTTOM = `
    <header class="nav wave"><div class="wrap">
      <a class="btn-s" href="#">Book a call <span class="arr">→</span></a>
      <button class="menu" aria-label="Menu"><i></i><i></i><i></i></button>
    </div></header>
    <div class="guide"><span class="guide-line"></span><span class="guide-label"><span class="guide-num">/01</span><span class="guide-word">Understand</span></span></div>
    <div class="guide"><span class="guide-line"></span><span class="guide-label"><span class="guide-num">/02</span><span class="guide-word">Translate</span></span></div>
    <div class="guide"><span class="guide-line"></span><span class="guide-label"><span class="guide-num">/03</span><span class="guide-word">Deliver</span></span></div>
    <div class="sign" aria-label="TriaCore AI, at the core of innovation"><p class="name"></p><p class="tagline">At the core of innovation</p></div>
    <div class="hint-wrap"><div class="hint wave" aria-hidden="true"><span>Scroll</span><span class="hint-line"></span></div></div>
    <div class="nogl"><p class="meta">This browser cannot show 3D. Open the prototype in Chrome, Edge, Firefox or Safari.</p></div>`;

  window.TriaHero = function (opts = {}) {
    boot(opts).catch(err => {
      console.error(err);
      const n = document.querySelector('.nogl');
      if (n) n.classList.add('is-on');
    });
  };

  async function boot(opts) {
    const THREE = await import('three');

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const pin = document.getElementById('pin');
    const stage = document.getElementById('stage');
    pin.style.height = `${(1 + (opts.scroll || 1)) * 100}vh`;
    stage.insertAdjacentHTML('afterbegin', TOP);
    stage.insertAdjacentHTML('beforeend', BOTTOM);

    const canvas = stage.querySelector('.gl');
    const guides = [...stage.querySelectorAll('.guide')];

    // de naam, letter per letter
    const nameEl = stage.querySelector('.sign .name');
    let k = 0;
    [['TriaCore', ''], [' ', ''], ['AI', 'ai']].forEach(([text, cls]) => {
      const g = document.createElement('span');
      if (cls) g.className = cls;
      [...text].forEach(ch => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.setAttribute('aria-hidden', 'true');
        s.textContent = ch === ' ' ? ' ' : ch;
        s.style.setProperty('--d', k++ * 45);
        g.appendChild(s);
      });
      nameEl.appendChild(g);
    });

    // ---------- Three.js ----------
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    let dpr = Math.min(window.devicePixelRatio, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();

    // een donkere studio met lichtstroken: dat is wat het metaal weerspiegelt
    const studio = new THREE.Scene();
    studio.background = new THREE.Color(0x06090f);
    const strip = (w, h, kk, x, y, z) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(kk, kk, kk), side: THREE.DoubleSide })
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

    const bars = BARS.map((b, i) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#F2F2F2'), metalness: 1, roughness: 0.3,
        anisotropy: 0.45, envMap: env, envMapIntensity: 1.2,
      });
      const mesh = new THREE.Mesh(barGeo, mat);
      mesh.userData.i = i;
      scene.add(mesh);
      return { mesh, mat, hover: 0 };
    });

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.03, 4000);
    const tn = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const camPath = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], false, 'centripetal');
    const aimPath = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], false, 'centripetal');
    const v = new THREE.Vector3();

    // wat een variant te zien en te zetten krijgt
    const c = {
      THREE, E, clamp, lerp, smooth,
      BARS, BAR_W, BAR_H, DX, DY, LOGO_W, LOGO_H, DEPTH,
      stage, canvas, camera, bars,
      p: 0, t: 0, dt: 0, W: 0, H: 0, mobile: false, left: 0, gutter: 0,
      base: {},
      camPos: new THREE.Vector3(), aim: new THREE.Vector3(),
      glint: [0, 0, 0], dim: [0, 0, 0], canvasOpacity: 1,
      guidesShown: false, labelX: null,
      ppuAt(dist) { return this.H / (2 * dist * tn); },
      distAt(ppu) { return this.H / (2 * ppu * tn); },
      project(x, y, z) {
        v.set(x, y, z).project(camera);
        return [(v.x + 1) / 2 * this.W, (1 - v.y) / 2 * this.H];
      },
    };

    function layout() {
      const W = stage.clientWidth, H = stage.clientHeight;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      c.W = W; c.H = H; c.mobile = W < 760;
      c.gutter = clamp(W * 0.05, 16, 64);
      c.left = Math.max(0, (W - 1240) / 2) + c.gutter;

      // het eindbeeld van de intro: het logo in het midden, een kwart van de hoogte
      const dist = Math.max(LOGO_H / (0.25 * 2 * tn), LOGO_W / (0.6 * 2 * tn * camera.aspect));
      const visH = 2 * dist * tn;
      const y = -0.04 * visH;
      const ppu = H / visH;
      c.base = { dist, y, ppu, cx: W / 2, cy: H / 2 + y * ppu };

      camPath.points[0].set(1.75, 1.32, 0.62);
      camPath.points[1].set(1.6, 0.55, dist * 0.32);
      camPath.points[2].set(0, y, dist);
      aimPath.points[0].set(0.15, 1.0, 0);
      aimPath.points[1].set(0.1, 0.25, 0);
      aimPath.points[2].set(0, y, 0);
      camPath.updateArcLengths();
      aimPath.updateArcLengths();

      if (opts.layout) opts.layout(c);
    }
    window.addEventListener('resize', layout);

    // ---------- Hover op de balken, met de pijlers ----------
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2(9, 9);
    let active = null, lane = null;

    function setActive(i) {
      if (i === active) return;
      active = i;
      guides.forEach((el, n) => el.classList.toggle('is-on', n === i));
    }
    function pick(e) {
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(bars.map(b => b.mesh), false)[0];
      return hit ? hit.object.userData.i : null;
    }
    // van de balk tot voorbij het woord blijft de hover actief
    function onLane(e) {
      if (!lane || c.mobile) return null;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      for (let i = 0; i < 3; i++) {
        if (x >= lane.xStart[i] && x <= lane.labelX + 300 && Math.abs(y - lane.yMid[i]) <= lane.band) return i;
      }
      return null;
    }
    canvas.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch' || !c.hoverOK) return;
      let i = pick(e);
      if (i === null) i = onLane(e);
      canvas.classList.toggle('is-pointer', i !== null);
      setActive(i);
    });
    canvas.addEventListener('pointerleave', () => { setActive(null); canvas.classList.remove('is-pointer'); });
    canvas.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'touch' || !c.hoverOK) return;
      const i = pick(e);
      setActive(i === active ? null : i);
    });

    // ---------- Scrollen ----------
    let t = 0, fast = false, ps = 0;
    function rawP() {
      const r = pin.getBoundingClientRect();
      const len = pin.offsetHeight - window.innerHeight;
      return len > 0 ? clamp(-r.top / len) : 0;
    }
    // wie scrolt, klikt of een toets indrukt tijdens de intro, spoelt die vlot door
    function skip() {
      if (t < T_CAM && !fast) { fast = true; stage.classList.add('is-fast'); }
    }
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(ev => window.addEventListener(ev, skip, { passive: true }));

    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { threshold: 0.3 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // ---------- De lus ----------
    const upStart = new THREE.Vector3(0.22, 1, 0).normalize();
    const upEnd = new THREE.Vector3(0, 1, 0);
    let last = performance.now(), slow = 1 / 60;

    function frame(now) {
      const raw = (now - last) / 1000;
      const dt = Math.min(0.05, raw);
      last = now;
      t += dt * (fast ? 7 : 1);
      if (t >= T_CAM) fast = false;

      // haalt de computer de 60 beelden per seconde niet, dan iets minder pixels
      if (raw < 0.25) slow = lerp(slow, raw, 0.05);
      if (slow > 1 / 45 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.25);
        renderer.setPixelRatio(dpr);
        renderer.setSize(c.W, c.H, false);
        slow = 1 / 60;
      }

      const intro = t < T_CAM;
      stage.classList.toggle('show-sign', t >= T_SIGN);
      if (t >= T_CAM - 0.6) stage.classList.add('is-done');

      // scrollvoortgang, licht afgevlakt zodat de beweging zacht blijft
      const target = rawP();
      ps = intro ? 0 : lerp(ps, target, 1 - Math.exp(-dt * 7));
      if (!intro && Math.abs(ps - target) < 0.0005) ps = target;
      c.p = ps; c.t = t; c.dt = dt;
      stage.style.setProperty('--p', ps.toFixed(4));

      // elke frame vertrekt van de rusttoestand; de variant past aan
      bars.forEach((b, i) => {
        b.mesh.position.set(BARS[i].x, BARS[i].y, 0);
        b.mesh.rotation.set(0, 0, 0);
        b.mesh.scale.set(1, 1, 1);
      });
      c.glint = [0, 0, 0]; c.dim = [0, 0, 0]; c.canvasOpacity = 1; c.guidesShown = false; c.labelX = null;

      if (intro) {
        const e = E.glide(clamp(t / T_CAM));
        camPath.getPointAt(e, c.camPos);
        aimPath.getPointAt(e, c.aim);
        camera.up.copy(upStart).lerp(upEnd, e).normalize();
      } else {
        c.camPos.set(0, c.base.y, c.base.dist);
        c.aim.set(0, c.base.y, 0);
        camera.up.copy(upEnd);
        if (opts.frame) opts.frame(c);
      }
      camera.position.copy(c.camPos);
      camera.lookAt(c.aim);
      camera.updateMatrixWorld();
      canvas.style.opacity = String(c.canvasOpacity);

      // hover kan in het centrale beeld, of als de variant de pijlers zelf toont
      c.hoverOK = !intro && (ps < 0.02 || (c.guidesShown && ps > 0.97));
      if (!c.hoverOK && active !== null) setActive(null);

      // de lichtstreep over het metaal, plus een eigen streep bij hover of door de variant
      const sweep = lerp(-1.6, 0.32, E.soft(clamp(t / (T_CAM + 0.4))));
      const damp = 1 - Math.exp(-dt * 3.5);
      bars.forEach((b, i) => {
        b.hover = lerp(b.hover, active === i ? 0.7 : 0, damp);
        b.mat.envMapRotation.set(0, sweep + b.hover + c.glint[i], 0);
        b.mat.envMapIntensity = 1.2 * (1 - 0.7 * c.dim[i]);
      });

      // de pijlers volgen de balken
      if (!c.mobile) {
        const xStart = [], xEnd = [], yMid = [];
        bars.forEach((b, i) => {
          const m = b.mesh, half = BAR_W / 2 * m.scale.x, z = DEPTH / 2 * m.scale.z;
          xStart[i] = c.project(m.position.x - half, m.position.y, m.position.z + z)[0];
          const [xe, ym] = c.project(m.position.x + half, m.position.y, m.position.z + z);
          xEnd[i] = xe; yMid[i] = ym;
        });
        const labelX = c.labelX ?? (Math.max(...xEnd) + Math.min(150, c.W * 0.09));
        lane = { xStart, yMid, labelX, band: Math.abs(yMid[1] - yMid[0]) / 2 };
        guides.forEach((el, i) => {
          const x0 = xEnd[i] + 14;
          el.style.transform = `translate3d(${x0}px, ${yMid[i]}px, 0)`;
          el.style.setProperty('--w', `${Math.max(24, labelX - x0)}px`);
          el.classList.toggle('is-shown', c.guidesShown);
        });
      }

      if (opts.overlay) opts.overlay(c);

      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { t = T_CAM; stage.classList.add('is-fast'); }

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    await Promise.race([fontsReady, new Promise(r => setTimeout(r, 900))]);
    layout();
    last = performance.now();
    stage.classList.add('is-on');
    requestAnimationFrame(frame);
  }
})();
