/* =============================================================
   Schema varianten: acht vormen voor de kaart "Zo bouwen wij AI.".
   Bovenaan de inhoud en de icoontjes, die alle varianten delen. Daaronder per variant een functie die de kaart
   opbouwt. Kiezen gaat overal hetzelfde: met een muis door erover te gaan, anders door te tikken.
   ============================================================= */
(function () {
  'use strict';

  // ---------- De inhoud ----------
  const D = {
    model:       { name: 'Het model', short: 'Het brein',
      text: 'Het brein van de AI. Het begrijpt een vraag, denkt na en kiest de volgende stap. Het model kan wisselen: we kiezen telkens het model dat het best past. Alles eromheen blijft.' },
    kennis:      { name: 'Kennis', short: 'Hoe je bedrijf werkt',
      text: 'Wat de AI vanaf de start weet: je processen, je regels, je manier van werken, en de gegevens uit je eigen systemen. Eén keer goed vastgelegd, telkens opnieuw gebruikt.' },
    geheugen:    { name: 'Geheugen', short: 'Wat er eerder gebeurde',
      text: 'Wat er eerder gebeurde, per klant en per dossier. Zo bouwt de AI verder op wat ze al weet, en begint ze elke taak met de juiste voorgeschiedenis.' },
    tools:       { name: 'Tools', short: 'Wat ze kan doen',
      text: 'Wat de AI kan doen in je systemen: gegevens opvragen, een document aanmaken, iets klaarzetten in je software. Zo rondt ze echt werk af.' },
    richtlijnen: { name: 'Richtlijnen', short: 'Wat ze mag',
      text: 'Wat de AI mag, vooraf afgesproken. Samen bepalen we wat ze zelf doet, wat ze klaarzet en wat ze eerst vraagt. Die afspraken zitten in het systeem zelf, bij elke stap.' },
    controle:    { name: 'Controle', short: 'Of het klopt',
      text: 'Of het werk klopt, achteraf nagekeken. De AI controleert haar resultaat met vaste regels en berekeningen. Bij belangrijke stappen, en bij alles wat naar buiten gaat, keurt een mens goed.' },
    bijleren:    { name: 'Bijleren', short: 'Elke maand beter',
      text: 'Elke stap wordt vastgelegd, elke aanpassing testen we eerst op echte voorbeelden uit je bedrijf, en wat je mensen corrigeren, verwerken we in de kennis.' },
    werkritme:   { name: 'Werkritme', short: 'Tot de taak af is',
      text: 'Een mail, een vraag of een vast uur zet de AI aan het werk. Dan denkt ze, doet ze, bekijkt ze het resultaat, en gaat ze verder tot de taak af is.' },
  };
  const SIX = ['kennis', 'geheugen', 'tools', 'richtlijnen', 'controle', 'bijleren'];

  // ---------- De icoontjes: fijne lijnen, 24 x 24 ----------
  const ICON = {
    // het model: het sterretje dat men voor AI gebruikt (Lucas, 2026-10-08)
    model: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/><path d="M20 3v4M22 5h-4M4 17v2M5 18H3"/>',
    kennis: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    // geheugen: een breintje (Lucas, 2026-10-08)
    geheugen: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4M17.6 6.5a3 3 0 0 0 .4-1.38M6 5.13a3 3 0 0 0 .4 1.37M3.48 10.9a4 4 0 0 1 .58-.4M19.94 10.5a4 4 0 0 1 .58.4M6 18a4 4 0 0 1-1.97-.52M19.97 17.48A4 4 0 0 1 18 18"/>',
    tools: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    richtlijnen: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    controle: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
    bijleren: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    werkritme: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
  };
  const svg = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
  const ic = (n, cls = '') => `<span class="ic ${cls}">${svg(n)}</span>`;
  const pad = i => String(i).padStart(2, '0');

  // ---------- Gedeeld: het paneel met icoon, naam en uitleg ----------
  const panelHTML = (withIcon = true) => `<div class="vp">${withIcon ? '<span class="vp-ic ic"></span>' : ''}<p class="vp-name"></p><p class="vp-text"></p></div>`;
  function panelSetter(el) {
    const icEl = el.querySelector('.vp-ic'), nm = el.querySelector('.vp-name'), tx = el.querySelector('.vp-text');
    let timer = 0, first = true;
    return id => {
      const fill = () => { if (icEl) icEl.innerHTML = svg(id); nm.textContent = D[id].name; tx.textContent = D[id].text; el.classList.remove('swap'); };
      clearTimeout(timer);
      if (first) { first = false; fill(); return; }
      el.classList.add('swap');
      timer = setTimeout(fill, 170);
    };
  }

  // ---------- Gedeeld: kiezen ----------
  // Alles met data-id in de kaart is te kiezen. De gekozen krijgt .is-on; onPick doet de rest.
  const hover = matchMedia('(hover: hover)').matches;
  function wire(card, onPick, start) {
    const els = [...card.querySelectorAll('[data-id]')];
    let now = null;
    const pick = id => {
      if (id === now) return;
      now = id;
      els.forEach(e => e.classList.toggle('is-on', e.dataset.id === id));
      onPick(id);
    };
    els.forEach(e => {
      e.addEventListener('click', () => pick(e.dataset.id));
      e.addEventListener('focus', () => pick(e.dataset.id));
      if (hover) e.addEventListener('mouseenter', () => pick(e.dataset.id));
    });
    pick(start);
    return pick;
  }
  const card = v => document.querySelector(`.vcard[data-v="${v}"]`);

  // ---------- 01 Tegels ----------
  (function () {
    const c = card(1);
    c.innerHTML = `
      <div class="v1-left">
        <button type="button" class="v1-model" data-id="model">${ic('model', 'inv')}
          <span><span class="t-name">Het model</span><span class="t-short">Het brein, in het midden van alles</span></span></button>
        <div class="v1-grid">${SIX.map(id => `
          <button type="button" class="tile" data-id="${id}">${ic(id)}<span class="t-name">${D[id].name}</span><span class="t-short">${D[id].short}</span></button>`).join('')}
        </div>
      </div>
      ${panelHTML()}`;
    wire(c, panelSetter(c.querySelector('.vp')), 'model');
  })();

  // ---------- 02 Index ----------
  (function () {
    const c = card(2);
    const ids = ['model', ...SIX, 'werkritme'];
    c.innerHTML = `
      <ol class="v2-list">${ids.map((id, i) => `
        <li><button type="button" class="v2-row${id === 'model' ? ' is-core' : ''}" data-id="${id}">
          <span class="v2-num">${pad(i)}</span>${ic(id)}<span class="v2-name">${D[id].name}</span><span class="v2-short">${D[id].short}</span>
        </button></li>`).join('')}
      </ol>
      ${panelHTML()}`;
    wire(c, panelSetter(c.querySelector('.vp')), 'model');
  })();

  // ---------- 03 Kern ----------
  (function () {
    const c = card(3);
    const side = ids => ids.map(id => `<button type="button" class="tile row" data-id="${id}">${ic(id)}<span><span class="t-name">${D[id].name}</span><span class="t-short">${D[id].short}</span></span></button>`).join('');
    c.innerHTML = `
      <div class="v3-col left">${side(['kennis', 'geheugen', 'tools'])}</div>
      <div class="v3-core">
        <button type="button" class="v3-badge" data-id="model">${ic('model', 'inv')}<span>Het model</span></button>
        ${panelHTML(false)}
      </div>
      <div class="v3-col right">${side(['richtlijnen', 'controle', 'bijleren'])}</div>`;
    const set = panelSetter(c.querySelector('.vp'));
    wire(c, id => { c.classList.toggle('on-side', id !== 'model'); set(id); }, 'model');
  })();

  // ---------- 04 Bento ----------
  (function () {
    const c = card(4);
    const order = ['model', 'kennis', 'geheugen', 'tools', 'richtlijnen', 'controle', 'bijleren'];
    c.innerHTML = order.map(id => `
      <button type="button" class="b b-${id}" data-id="${id}">
        ${ic(id, id === 'model' ? 'inv' : '')}
        <span class="b-foot"><span class="b-name">${D[id].name}</span><span class="b-text"><span>${D[id].text}</span></span></span>
      </button>`).join('');
    wire(c, () => {}, 'model');
  })();

  // ---------- 05 Tabs ----------
  (function () {
    const c = card(5);
    const ids = ['model', ...SIX];
    c.innerHTML = `
      <div class="v5-tabs">${ids.map(id => `<button type="button" class="v5-tab" data-id="${id}">${svg(id)}<span>${D[id].name}</span></button>`).join('')}
        <span class="v5-bar" aria-hidden="true"></span></div>
      <div class="v5-body">
        <div class="v5-halo" aria-hidden="true"><i></i><i></i><i></i><span class="v5-big"></span></div>
        ${panelHTML(false)}
      </div>`;
    const set = panelSetter(c.querySelector('.vp')), bar = c.querySelector('.v5-bar'), big = c.querySelector('.v5-big'), halo = c.querySelector('.v5-halo');
    let cur = 'model';
    const move = () => {
      const t = c.querySelector(`.v5-tab[data-id="${cur}"]`);
      bar.style.width = `${t.offsetWidth}px`;
      bar.style.transform = `translateX(${t.offsetLeft}px)`;
    };
    wire(c, id => {
      cur = id; set(id); move();
      big.innerHTML = svg(id);
      halo.classList.remove('pulse'); void halo.offsetWidth; halo.classList.add('pulse');
    }, 'model');
    addEventListener('resize', move);
    document.fonts.ready.then(move);
  })();

  // ---------- 05b Zoom ----------
  // De tabs van 05, met links een camera boven een kleine mindmap. De mindmap heeft een vaste maat (WORLD); de camera
  // schaalt en schuift haar zo dat het gekozen onderdeel groot in beeld staat. Het model ligt dan aan de rand, aan de
  // kant waar het echt ligt, zodat er een randje van in beeld blijft.
  (function () {
    const ZOOM = {
      world: 600,      // de maat van de mindmap (px, vierkant), het model in het midden
      ring: 190,       // zo ver staan de zes van het model
      scale: 1.8,      // zo ver zoomt de camera in op een onderdeel
      toward: 14,      // en schuift ze zoveel px van het onderdeel richting het model, zodat het randje groter is
      start: -90,      // waar het eerste onderdeel staat (graden; -90 = boven)
    };
    const c = card('5b');
    const ids = ['model', ...SIX];
    const W = ZOOM.world, M = W / 2;
    const at = i => { const a = (ZOOM.start + i * 60) * Math.PI / 180; return [M + ZOOM.ring * Math.cos(a), M + ZOOM.ring * Math.sin(a)]; };
    const P = { model: [M, M] };
    SIX.forEach((id, i) => { P[id] = at(i); });
    c.innerHTML = `
      <div class="v5-tabs">${ids.map(id => `<button type="button" class="v5-tab" data-id="${id}">${svg(id)}<span>${D[id].name}</span></button>`).join('')}
        <span class="v5-bar" aria-hidden="true"></span></div>
      <div class="v5-body">
        <div class="zcol"><div class="zs" aria-hidden="true">
          <div class="zw" style="width:${W}px;height:${W}px">
            <svg class="zl" viewBox="0 0 ${W} ${W}">${SIX.map(id => `<line data-for="${id}" x1="${M}" y1="${M}" x2="${P[id][0].toFixed(1)}" y2="${P[id][1].toFixed(1)}"/>`).join('')}</svg>
            <span class="zn zn-model" data-for="model" style="left:${M}px;top:${M}px">${svg('model')}<b>Het model</b></span>
            ${SIX.map(id => `<span class="zn zn-part" data-for="${id}" style="left:${P[id][0].toFixed(1)}px;top:${P[id][1].toFixed(1)}px"><i>${svg(id)}</i><b>${D[id].name}</b></span>`).join('')}
          </div>
        </div></div>
        ${panelHTML(false)}
      </div>`;
    const set = panelSetter(c.querySelector('.vp')), bar = c.querySelector('.v5-bar');
    const stage = c.querySelector('.zs'), world = c.querySelector('.zw');
    let cur = 'model';
    // de camera: het punt (cx, cy) van de mindmap in het midden van de kolom, met zoom s. Het beeld is links en rechts
    // breder dan de kolom (--bl en --br in de css); het midden van de kolom ligt dus op bl + kolombreedte / 2.
    function aim() {
      const cs = getComputedStyle(stage), bl = parseFloat(cs.getPropertyValue('--bl')) || 0, br = parseFloat(cs.getPropertyValue('--br')) || 0;
      const vw = stage.clientWidth - bl - br, sh = stage.clientHeight, base = Math.min(vw, sh) / W;
      const sw = 2 * bl + vw;   // zo komt sw / 2 hieronder op het midden van de kolom
      let cx = M, cy = M, s = 1;
      if (cur !== 'model') {
        const [x, y] = P[cur], len = Math.hypot(x - M, y - M);
        cx = x - (x - M) / len * ZOOM.toward;
        cy = y - (y - M) / len * ZOOM.toward;
        s = ZOOM.scale;
      }
      const k = base * s;
      world.style.transform = `translate(${(sw / 2 - cx * k).toFixed(1)}px, ${(sh / 2 - cy * k).toFixed(1)}px) scale(${k.toFixed(4)})`;
      const t = c.querySelector(`.v5-tab[data-id="${cur}"]`);
      bar.style.width = `${t.offsetWidth}px`;
      bar.style.transform = `translateX(${t.offsetLeft}px)`;
    }
    wire(c, id => {
      cur = id;
      set(id);
      c.classList.toggle('is-zoomed', id !== 'model');
      c.querySelectorAll('[data-for]').forEach(e => e.classList.toggle('is-on', e.dataset.for === id));
      aim();
    }, 'model');
    new ResizeObserver(aim).observe(stage);
    document.fonts.ready.then(aim);
  })();

  // ---------- 06 Stroom ----------
  (function () {
    const c = card(6);
    const node = (id, cls = '') => `<button type="button" class="fnode ${cls}" data-id="${id}">${ic(id, id === 'model' ? 'inv' : '')}<span class="t-name">${D[id].name}</span></button>`;
    c.innerHTML = `
      <div class="flow">
        <button type="button" class="band band-top" data-id="richtlijnen">${svg('richtlijnen')}<span>Richtlijnen</span><em>over alles wat de AI doet</em></button>
        <div class="f-in">${node('kennis')}${node('geheugen')}</div>
        <span class="arr" aria-hidden="true"></span>
        <div class="f-core">${node('model', 'core')}<button type="button" class="f-loop" data-id="werkritme" aria-label="Werkritme">${svg('werkritme')}</button></div>
        <span class="arr" aria-hidden="true"></span>
        ${node('tools')}
        <span class="arr" aria-hidden="true"></span>
        ${node('controle')}
        <span class="arr" aria-hidden="true"></span>
        <span class="f-out">Resultaat</span>
        <button type="button" class="band band-back" data-id="bijleren">${svg('bijleren')}<span>Bijleren</span><em>wat je mensen aanpassen, gaat terug naar de kennis</em></button>
      </div>
      <div class="v6-panel">${panelHTML()}</div>`;
    wire(c, panelSetter(c.querySelector('.vp')), 'model');
  })();

  // ---------- 07 Omlijst ----------
  (function () {
    const c = card(7);
    const seg = id => `<button type="button" class="seg seg-${id}" data-id="${id}">${ic(id)}<span class="t-name">${D[id].name}</span></button>`;
    c.innerHTML = `
      <div class="v7-frame">
        ${SIX.map(seg).join('')}
        <button type="button" class="seg seg-model" data-id="model">${ic('model', 'inv')}<span class="t-name">Het model</span></button>
      </div>
      ${panelHTML()}`;
    wire(c, panelSetter(c.querySelector('.vp')), 'model');
  })();

  // ---------- 08 Lijst ----------
  (function () {
    const c = card(8);
    c.innerHTML = `
      <div class="v8-left">
        <span class="v8-core">${svg('model')}</span>
        <p class="v8-say">Het model is het brein. Wij bouwen de zes lagen eromheen.</p>
        <p class="v8-sub">${D.model.text}</p>
      </div>
      <ol class="v8-list">${SIX.map((id, i) => `
        <li class="acc" data-id="${id}" tabindex="0">
          <span class="acc-head"><span class="v2-num">${pad(i + 1)}</span>${ic(id)}<span class="acc-name">${D[id].name}</span><span class="acc-plus">${svg('plus')}</span></span>
          <span class="acc-body"><span><span class="acc-text">${D[id].text}</span></span></span>
        </li>`).join('')}
      </ol>`;
    wire(c, () => {}, 'kennis');
  })();
})();
