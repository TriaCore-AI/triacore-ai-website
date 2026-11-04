// Draait één scène uit scenes.js achter de echte hero. Kiezen via ?v=1 tot ?v=10 of met de pijltjestoetsen.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var start = function () { root.classList.add('klaar'); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();

  var S = window.TCScenes;
  var nu = parseInt(new URLSearchParams(location.search).get('v'), 10) || 1;
  if (nu < 1 || nu > S.length) nu = 1;
  var sc = S[nu - 1];

  function ga(n) { location.search = '?v=' + (((n - 1 + S.length) % S.length) + 1); }
  addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') ga(nu - 1);
    if (e.key === 'ArrowRight') ga(nu + 1);
  });

  // De wisselaar onderaan
  var nav = document.getElementById('wissel');
  var html = '<a href="?v=' + (nu === 1 ? S.length : nu - 1) + '" aria-label="Vorige">&larr;</a>';
  S.forEach(function (s, i) { html += '<a href="?v=' + (i + 1) + '"' + (i + 1 === nu ? ' class="nu"' : '') + '>' + (i + 1) + '</a>'; });
  html += '<span class="naam">' + sc.naam + '</span><a href="?v=' + (nu === S.length ? 1 : nu + 1) + '" aria-label="Volgende">&rarr;</a>';
  nav.innerHTML = html;
  document.getElementById('uitleg').textContent = sc.uitleg;
  document.title = 'Hero ' + nu + ': ' + sc.naam;

  // Enkel bij scène 12: de rest van de pagina, om volledig te kunnen doorscrollen. Elk blok komt één keer zacht op
  if (sc.id === 'schijven-raam') {
    root.classList.add('volledig');
    document.getElementById('meer').hidden = false;
    var komen = document.querySelectorAll('.komt-op');
    if ('IntersectionObserver' in window) {
      var kijk = new IntersectionObserver(function (items) {
        items.forEach(function (it) {
          if (it.isIntersecting) { it.target.classList.add('zien'); kijk.unobserve(it.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      komen.forEach(function (el) { kijk.observe(el); });
    } else {
      komen.forEach(function (el) { el.classList.add('zien'); });
    }
  }

  var canvas = document.getElementById('scene');
  var hero = document.getElementById('hero');
  var stil = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' });
  if (!gl) return; // zonder WebGL blijft de hero gewoon op het verloop staan

  function maak(soort, bron) {
    var s = gl.createShader(soort);
    gl.shaderSource(s, bron);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
    return s;
  }
  var prog = gl.createProgram();
  gl.attachShader(prog, maak(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}'));
  gl.attachShader(prog, maak(gl.FRAGMENT_SHADER, window.TCKern.bouw(sc)));
  gl.bindAttribLocation(prog, 0, 'p');
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  var u = {};
  ['uRes', 'uT', 'uIn', 'uM', 'uRo', 'uTa', 'uL', 'uLens'].forEach(function (n) { u[n] = gl.getUniformLocation(prog, n); });
  var ln = Math.hypot(sc.licht[0], sc.licht[1], sc.licht[2]);
  gl.uniform3f(u.uTa, sc.ta[0], sc.ta[1], sc.ta[2]);
  gl.uniform3f(u.uL, sc.licht[0] / ln, sc.licht[1] / ln, sc.licht[2] / ln);
  gl.uniform1f(u.uLens, sc.lens);
  var bufAchter = gl.getParameter(gl.ARRAY_BUFFER_BINDING);

  // Een scène met deeltjes tekent die als echte punten boven op de achtergrond
  var dp = null;
  if (sc.deeltjes) {
    var bron = window.TCKern.bouwDeeltjes(sc);
    var p2 = gl.createProgram();
    gl.attachShader(p2, maak(gl.VERTEX_SHADER, bron.vs));
    gl.attachShader(p2, maak(gl.FRAGMENT_SHADER, bron.fs));
    gl.bindAttribLocation(p2, 0, 'a');
    gl.linkProgram(p2);
    if (!gl.getProgramParameter(p2, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(p2));
    else {
      var nx = window.innerWidth < 768 ? Math.round(bron.nx * .5) : bron.nx;
      var ny = window.innerWidth < 768 ? Math.round(bron.ny * .5) : bron.ny;
      var data = new Float32Array(nx * ny * 2), i = 0;
      for (var y = 0; y < ny; y++) for (var x = 0; x < nx; x++) {
        // Om de andere rij verspringt: dat geeft het ritme van een drukraster
        data[i++] = ((x + (y % 2) * .5) / (nx - 1)) * 2 - 1;
        data[i++] = (y / (ny - 1)) * 2 - 1;
      }
      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      dp = { prog: p2, buf: buf, n: nx * ny, u: {} };
      ['uRes', 'uT', 'uIn', 'uM', 'uRo', 'uTa', 'uL', 'uLens', 'uK'].forEach(function (n) { dp.u[n] = gl.getUniformLocation(p2, n); });
      gl.useProgram(p2);
      gl.uniform3f(dp.u.uTa, sc.ta[0], sc.ta[1], sc.ta[2]);
      gl.uniform3f(dp.u.uL, sc.licht[0] / ln, sc.licht[1] / ln, sc.licht[2] / ln);
      gl.uniform1f(dp.u.uLens, sc.lens);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
  }

  // Schijven die onder de muis uit de rij schuiven. Elke schijf heeft haar eigen veer: ze start zacht,
  // komt rustig tot stilstand en glijdt vanzelf terug als de muis weg is. Terugdraaien: haal kaarten weg uit de scène
  var kaart = null;
  if (sc.kaarten && !stil) {
    var nK = sc.kaarten.aantal;
    kaart = { n: nK, hoog: new Float32Array(nK), vaart: new Float32Array(nK), data: new Uint8Array(nK), tex: gl.createTexture() };
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.bindTexture(gl.TEXTURE_2D, kaart.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, nK, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, kaart.data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.useProgram(prog);
    gl.uniform1i(gl.getUniformLocation(prog, 'uKaart'), 0);
  } else if (sc.kaarten) {
    // Minder beweging gevraagd: alle schijven blijven gewoon in de rij
    var tLeeg = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tLeeg);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 1, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array(1));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  var muisX = null, muisY = null;
  addEventListener('pointermove', function (e) {
    if (e.pointerType === 'mouse') { muisX = e.clientX; muisY = e.clientY; }
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', function () { muisX = null; });

  function kaartenBij(dt) {
    var raak = null;
    if (muisX !== null && klok > INTRO) {
      var r = hero.getBoundingClientRect();
      var ux = (muisX - r.left - r.width / 2) / r.height, uy = (r.top + r.height / 2 - muisY) / r.height;
      if (muisY >= r.top && muisY <= r.bottom) {
        var ro = [sc.ro[0] + m.x * sc.muis[0], sc.ro[1] + m.y * sc.muis[1], sc.ro[2]];
        var f = norm([sc.ta[0] - ro[0], sc.ta[1] - ro[1], sc.ta[2] - ro[2]]);
        var ri = norm([-f[2], 0, f[0]]);
        var om = [ri[1] * f[2] - ri[2] * f[1], ri[2] * f[0] - ri[0] * f[2], ri[0] * f[1] - ri[1] * f[0]];
        raak = sc.kaarten.raak(ro, norm([
          ux * ri[0] + uy * om[0] + sc.lens * f[0],
          ux * ri[1] + uy * om[1] + sc.lens * f[1],
          ux * ri[2] + uy * om[2] + sc.lens * f[2]
        ]));
      }
    }
    var stap = Math.min(dt, 1 / 30), helft = kaart.n / 2;
    for (var i = 0; i < kaart.n; i++) {
      var afst = raak === null ? 9 : Math.abs(i - helft - raak);
      var doel = afst === 0 ? 1 : afst === 1 ? 0.3 : afst === 2 ? 0.07 : 0;
      // Omhoog vlot, terug trager. Beide kritisch gedempt, dus zonder na te veren
      var K = doel > kaart.hoog[i] ? 34 : 13;
      kaart.vaart[i] += ((doel - kaart.hoog[i]) * K - kaart.vaart[i] * 2 * Math.sqrt(K)) * stap;
      kaart.hoog[i] += kaart.vaart[i] * stap;
      kaart.data[i] = Math.round(Math.max(0, Math.min(1, kaart.hoog[i])) * 255);
    }
    gl.bindTexture(gl.TEXTURE_2D, kaart.tex);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, kaart.n, 1, gl.LUMINANCE, gl.UNSIGNED_BYTE, kaart.data);
  }
  function norm(v) { var l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; }

  // De kwaliteit past zich aan het toestel aan
  var kwaliteit = Math.min(devicePixelRatio || 1, 1.5);
  if (dp) kwaliteit = Math.max(kwaliteit, 1.25); // fijne stipjes hebben wat extra resolutie nodig
  function maat() {
    var r = hero.getBoundingClientRect();
    canvas.width = Math.round(r.width * kwaliteit);
    canvas.height = Math.round(r.height * kwaliteit);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(prog);
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    if (dp) {
      gl.useProgram(dp.prog);
      gl.uniform2f(dp.u.uRes, canvas.width, canvas.height);
      gl.uniform1f(dp.u.uK, kwaliteit);
    }
  }

  var m = { x: 0, y: 0, dx: 0, dy: 0 };
  addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse' || stil) return;
    m.dx = e.clientX / innerWidth * 2 - 1;
    m.dy = -(e.clientY / innerHeight * 2 - 1);
    wek();
  }, { passive: true });

  function zacht(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  // Tekenen: maximaal 30 keer per seconde, enkel als de hero in beeld is en er iets beweegt.
  // Na de intro staat een stille scène helemaal stil, tenzij de muis beweegt.
  var loopt = false, inBeeld = true, vorig = 0, klok = 0, laatste = 0, teller = 0, traag = 0;
  var INTRO = 3.2, TIK = sc.kaarten ? 1000 / 61 : 1000 / 31;

  function teken() {
    var inT = stil ? 1 : zacht(Math.min(klok / INTRO, 1));
    var tijd = stil ? 8 : klok + 8;
    var rx = sc.ro[0] + m.x * sc.muis[0], ry = sc.ro[1] + m.y * sc.muis[1];
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufAchter);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.BLEND);
    gl.uniform1f(u.uT, tijd);
    gl.uniform1f(u.uIn, inT);
    gl.uniform2f(u.uM, m.x, m.y);
    gl.uniform3f(u.uRo, rx, ry, sc.ro[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (dp) {
      gl.useProgram(dp.prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, dp.buf);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enable(gl.BLEND);
      gl.uniform1f(dp.u.uT, tijd);
      gl.uniform1f(dp.u.uIn, inT);
      gl.uniform2f(dp.u.uM, m.x, m.y);
      gl.uniform3f(dp.u.uRo, rx, ry, sc.ro[2]);
      gl.drawArrays(gl.POINTS, 0, dp.n);
    }
  }

  function tik(t) {
    if (!inBeeld || document.hidden) { loopt = false; return; }
    if (t - laatste < TIK) { requestAnimationFrame(tik); return; }
    var dt = Math.min((t - vorig) / 1000, .1);
    // Te traag? Dan zakt de resolutie een trap, tot minimaal 0,6
    teller++;
    if (dt > .05) traag++;
    if (teller >= 24) {
      if (traag > 14 && kwaliteit > .6) { kwaliteit = Math.max(.6, kwaliteit - .2); maat(); }
      teller = 0; traag = 0;
    }
    vorig = t; laatste = t; klok += dt;
    var k = 1 - Math.exp(-dt * 2.4);
    m.x += (m.dx - m.x) * k;
    m.y += (m.dy - m.y) * k;
    if (kaart) kaartenBij(dt);
    teken();
    var bezig = sc.beweegt || klok < INTRO || Math.abs(m.dx - m.x) + Math.abs(m.dy - m.y) > .001;
    if (bezig && !stil) requestAnimationFrame(tik); else loopt = false;
  }
  function wek() {
    if (loopt || !inBeeld || document.hidden || stil) return;
    loopt = true; vorig = performance.now();
    requestAnimationFrame(tik);
  }

  new IntersectionObserver(function (e) { inBeeld = e[0].isIntersecting; wek(); }).observe(hero);
  document.addEventListener('visibilitychange', wek);
  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); canvas.style.display = 'none'; });
  addEventListener('resize', function () { maat(); teken(); wek(); });
  maat();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { maat(); teken(); });
  teken();
  wek();
})();
