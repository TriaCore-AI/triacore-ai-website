import React, { useEffect, useRef } from 'react';
import { FRAGMENT } from './hero-scene-shader';
import './hero-scene.css';

// De achtergrond van de homepage: een muur met raamlicht en daarvoor een vloer die naar voren oplost, zodat er
// diepte in zit (hero-scene-shader.js). Het raamlicht schuift heel traag, en de camera beweegt een fractie mee
// met de muis. Zonder bibliotheek, en de pagina wacht er nooit op: de shader laadt pas na de tekst, en zonder
// WebGL blijft de hero gewoon op het verloop staan.
// Vroeger stond voor de muur een staaf van draaiende schijven die op de muis reageerden; die is weg (17/11).
const TIK_ACTIEF = 1000 / 61; // terwijl de camera de muis volgt
const TIK_RUST = 1000 / 12;   // in rust schuift enkel het raamlicht: daarvoor volstaan een paar beelden per seconde

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

    // Het compileren gebeurt pas na de eerste weergave, en waar het kan op de achtergrond
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
      ['uRes', 'uT', 'uM'].forEach((n) => { u[n] = gl.getUniformLocation(prog, n); });

      const m = { x: 0, y: 0, dx: 0, dy: 0 };
      let loopt = false, inBeeld = true, vorig = 0, klok = 0, laatste = 0, teller = 0, traag = 0;
      let actief = false, frameId = 0;
      let kwaliteit = Math.min(window.devicePixelRatio || 1, 1.5);

      const maat = () => {
        const r = hero.getBoundingClientRect();
        canvas.width = Math.round(r.width * kwaliteit);
        canvas.height = Math.round(r.height * kwaliteit);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(u.uRes, canvas.width, canvas.height);
      };

      const teken = () => {
        gl.uniform1f(u.uT, stil ? 8 : klok + 8);
        gl.uniform2f(u.uM, m.x, m.y);
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
        teken();
        actief = Math.abs(m.dx - m.x) + Math.abs(m.dy - m.y) > 0.001;
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
        m.dx = e.clientX / window.innerWidth * 2 - 1;
        m.dy = -(e.clientY / window.innerHeight * 2 - 1);
        actief = true;
        wek();
      };
      const opVerlies = (e) => { e.preventDefault(); canvas.style.display = 'none'; };

      const zicht = new IntersectionObserver((e) => { inBeeld = e[0].isIntersecting; wek(); });
      zicht.observe(hero);
      const formaat = new ResizeObserver(() => { maat(); teken(); });
      formaat.observe(hero);
      window.addEventListener('pointermove', opMuis, { passive: true });
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
        document.removeEventListener('visibilitychange', wek);
        canvas.removeEventListener('webglcontextlost', opVerlies);
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
