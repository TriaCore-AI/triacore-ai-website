import React, { useEffect, useRef } from 'react';
import { FRAGMENT } from './hero-scene-shader';
import './hero-scene.css';

// De 3D-achtergrond van de homepage: een staaf van draaiende schijven voor een muur met raamlicht.
// Onder de muis schuiven schijven zacht uit de rij. Zonder bibliotheek, en de pagina wacht er nooit op:
// de shader laadt pas na de tekst, en zonder WebGL blijft de hero gewoon op het verloop staan.
const SCENE = {
  ro: [0, 0, 14],
  ta: [0, 0, 0],
  lens: 2.05,
  licht: [0.62, 0.66, 0.42],
  muis: [0.15, 0.06],
  schijven: 64
};
// Het binnenkomen: de schijven draaien vlot in en vertragen zacht tot hun eindstand. Ze starten iets voorbij
// de vlakke stand (uIn onder 0), zodat ze nog op volle snelheid draaien als de fade-in van de canvas af is
const INTRO = 2.2;
const INTRO_VAN = -0.3;
const TIK_ACTIEF = 1000 / 61;
// In rust schuift enkel het raamlicht, heel traag: daarvoor volstaan een paar beelden per seconde
const TIK_RUST = 1000 / 12;

const norm = (v) => {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
};
const uitloop = (x) => 1 - Math.pow(1 - x, 3);

// Welke schijf ligt onder de muis? Zelfde vorm en draaiing als map() in de shader.
// Geeft het nummer van de schijf terug, of null als de muis naast de staaf staat
function schijfOnder(o, d) {
  const draai = (v) => {
    const c = Math.cos(-0.62), s = Math.sin(-0.62);
    const x = v[0] * c - v[2] * s, z = v[0] * s + v[2] * c;
    const c2 = Math.cos(-0.05), s2 = Math.sin(-0.05);
    return [x * c2 - v[1] * s2, x * s2 + v[1] * c2, z];
  };
  const a = draai(o), b = draai(d);
  const oy = a[1] + 2.12, oz = a[2];
  const A = b[1] * b[1] + b[2] * b[2];
  const B = oy * b[1] + oz * b[2];
  const C = oy * oy + oz * oz - 1.05 * 1.05;
  const D = B * B - A * C;
  if (D < 0) return null;
  const t = (-B - Math.sqrt(D)) / A;
  return Math.floor((a[0] + t * b[0]) / 0.44);
}

export default function HeroScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas.parentElement;
    const stil = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' });
    if (!gl) return undefined;

    let gestopt = false;
    let opruimen = () => {};

    const maak = (soort, bron) => {
      const s = gl.createShader(soort);
      gl.shaderSource(s, bron);
      gl.compileShader(s);
      return s;
    };

    // Het compileren kan even duren: dat gebeurt pas na de eerste weergave, en waar het kan op de achtergrond
    const begin = () => {
      if (gestopt) return;
      const prog = gl.createProgram();
      const vs = maak(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}');
      const fs = maak(gl.FRAGMENT_SHADER, FRAGMENT);
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.bindAttribLocation(prog, 0, 'p');
      gl.linkProgram(prog);
      const parallel = gl.getExtension('KHR_parallel_shader_compile');

      const wacht = () => {
        if (gestopt) return;
        if (parallel && !gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) {
          requestAnimationFrame(wacht);
          return;
        }
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          console.error(gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(prog));
          return;
        }
        draai(prog);
      };
      wacht();
    };

    const draai = (prog) => {
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      const u = {};
      ['uRes', 'uT', 'uIn', 'uM', 'uRo', 'uTa', 'uL', 'uLens'].forEach((n) => { u[n] = gl.getUniformLocation(prog, n); });
      const l = norm(SCENE.licht);
      gl.uniform3f(u.uTa, SCENE.ta[0], SCENE.ta[1], SCENE.ta[2]);
      gl.uniform3f(u.uL, l[0], l[1], l[2]);
      gl.uniform1f(u.uLens, SCENE.lens);

      // Per schijf hoe ver ze uit de rij staat. Elke schijf heeft haar eigen veer: ze start zacht,
      // komt rustig tot stilstand en glijdt vanzelf terug als de muis weg is
      const n = SCENE.schijven;
      const hoog = new Float32Array(n), vaart = new Float32Array(n), data = new Uint8Array(n);
      const tex = gl.createTexture();
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, n, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(gl.getUniformLocation(prog, 'uKaart'), 0);

      const m = { x: 0, y: 0, dx: 0, dy: 0 };
      let muisX = null, muisY = null;
      let loopt = false, inBeeld = true, vorig = 0, klok = 0, laatste = 0, teller = 0, traag = 0;
      let actief = true, frameId = 0;
      let kwaliteit = Math.min(window.devicePixelRatio || 1, 1.5);

      const maat = () => {
        const r = hero.getBoundingClientRect();
        canvas.width = Math.round(r.width * kwaliteit);
        canvas.height = Math.round(r.height * kwaliteit);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(u.uRes, canvas.width, canvas.height);
      };

      // Geeft true zolang er een schijf beweegt of de muis op de staaf staat
      const schijvenBij = (dt) => {
        let raak = null;
        if (muisX !== null && klok > INTRO) {
          const r = hero.getBoundingClientRect();
          if (muisY >= r.top && muisY <= r.bottom) {
            const ux = (muisX - r.left - r.width / 2) / r.height;
            const uy = (r.top + r.height / 2 - muisY) / r.height;
            const ro = [SCENE.ro[0] + m.x * SCENE.muis[0], SCENE.ro[1] + m.y * SCENE.muis[1], SCENE.ro[2]];
            const f = norm([SCENE.ta[0] - ro[0], SCENE.ta[1] - ro[1], SCENE.ta[2] - ro[2]]);
            const ri = norm([-f[2], 0, f[0]]);
            const om = [ri[1] * f[2] - ri[2] * f[1], ri[2] * f[0] - ri[0] * f[2], ri[0] * f[1] - ri[1] * f[0]];
            raak = schijfOnder(ro, norm([0, 1, 2].map((i) => ux * ri[i] + uy * om[i] + SCENE.lens * f[i])));
          }
        }
        const stap = Math.min(dt, 1 / 30), helft = n / 2;
        let beweegt = raak !== null;
        for (let i = 0; i < n; i++) {
          const afst = raak === null ? 9 : Math.abs(i - helft - raak);
          const doel = afst === 0 ? 1 : afst === 1 ? 0.3 : afst === 2 ? 0.07 : 0;
          // Omhoog vlot, terug trager. Beide kritisch gedempt, dus zonder na te veren
          const K = doel > hoog[i] ? 34 : 13;
          vaart[i] += ((doel - hoog[i]) * K - vaart[i] * 2 * Math.sqrt(K)) * stap;
          hoog[i] += vaart[i] * stap;
          data[i] = Math.round(Math.max(0, Math.min(1, hoog[i])) * 255);
          if (data[i] > 0) beweegt = true;
        }
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, n, 1, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
        return beweegt;
      };

      const teken = () => {
        gl.uniform1f(u.uT, stil ? 8 : klok + 8);
        gl.uniform1f(u.uIn, stil ? 1 : INTRO_VAN + (1 - INTRO_VAN) * uitloop(Math.min(klok / INTRO, 1)));
        gl.uniform2f(u.uM, m.x, m.y);
        gl.uniform3f(u.uRo, SCENE.ro[0] + m.x * SCENE.muis[0], SCENE.ro[1] + m.y * SCENE.muis[1], SCENE.ro[2]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      const tik = (t) => {
        if (gestopt) return;
        if (!inBeeld || document.hidden) { loopt = false; return; }
        if (t - laatste < (actief ? TIK_ACTIEF : TIK_RUST)) { frameId = requestAnimationFrame(tik); return; }
        const echt = (t - vorig) / 1000;
        const dt = Math.min(echt, 0.1);
        // Te traag? Dan zakt de resolutie een trap, tot minimaal 0,6
        teller++;
        if (echt > (actief ? 0.05 : 0.2)) traag++;
        if (teller >= 24) {
          if (traag > 14 && kwaliteit > 0.6) { kwaliteit = Math.max(0.6, kwaliteit - 0.2); maat(); }
          teller = 0; traag = 0;
        }
        vorig = t; laatste = t; klok += dt;
        const k = 1 - Math.exp(-dt * 2.4);
        m.x += (m.dx - m.x) * k;
        m.y += (m.dy - m.y) * k;
        const schijven = schijvenBij(dt);
        teken();
        actief = klok < INTRO || schijven || Math.abs(m.dx - m.x) + Math.abs(m.dy - m.y) > 0.001;
        frameId = requestAnimationFrame(tik);
      };

      const wek = () => {
        if (gestopt || loopt || !inBeeld || document.hidden || stil) return;
        loopt = true;
        vorig = performance.now();
        frameId = requestAnimationFrame(tik);
      };

      const opMuis = (e) => {
        if (e.pointerType !== 'mouse' || stil) return;
        muisX = e.clientX;
        muisY = e.clientY;
        m.dx = e.clientX / window.innerWidth * 2 - 1;
        m.dy = -(e.clientY / window.innerHeight * 2 - 1);
        actief = true;
        wek();
      };
      const muisWeg = () => { muisX = null; };
      const opVerlies = (e) => { e.preventDefault(); canvas.style.display = 'none'; };

      const zicht = new IntersectionObserver((e) => { inBeeld = e[0].isIntersecting; wek(); });
      zicht.observe(hero);
      const formaat = new ResizeObserver(() => { maat(); teken(); });
      formaat.observe(hero);
      window.addEventListener('pointermove', opMuis, { passive: true });
      document.documentElement.addEventListener('mouseleave', muisWeg);
      document.addEventListener('visibilitychange', wek);
      canvas.addEventListener('webglcontextlost', opVerlies);

      maat();
      teken();
      canvas.classList.add('is-klaar');
      wek();

      opruimen = () => {
        cancelAnimationFrame(frameId);
        zicht.disconnect();
        formaat.disconnect();
        window.removeEventListener('pointermove', opMuis);
        document.documentElement.removeEventListener('mouseleave', muisWeg);
        document.removeEventListener('visibilitychange', wek);
        canvas.removeEventListener('webglcontextlost', opVerlies);
        gl.deleteTexture(tex);
        gl.deleteBuffer(buf);
        gl.deleteProgram(prog);
      };
    };

    const id = requestAnimationFrame(() => setTimeout(begin, 0));

    return () => {
      gestopt = true;
      cancelAnimationFrame(id);
      opruimen();
      // Verlaat je de pagina echt, dan geven we de WebGL-context terug aan de browser
      setTimeout(() => {
        if (!canvas.isConnected) gl.getExtension('WEBGL_lose_context')?.loseContext();
      }, 0);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-scene" aria-hidden="true" />;
}
