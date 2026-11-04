/* =============================================================
   Mindmap varianten: zes vormen voor de kaart "Zo bouwen wij AI.", allemaal als mindmap.
   Bovenaan de inhoud en de icoontjes. Daaronder VARIANTS: per variant de soort knoop, de plaatsen en de lijnen.
   build() maakt elke kaart op dezelfde manier: links het schema (in procent van een vierkant vak), rechts de uitleg.
   Kiezen: met een muis door erover te gaan, anders door te tikken.
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
  };
  const SIX = ['kennis', 'geheugen', 'tools', 'richtlijnen', 'controle', 'bijleren'];   // met de klok mee vanaf boven

  // ---------- De icoontjes: fijne lijnen, 24 x 24 ----------
  const ICON = {
    model: '<rect x="5" y="5" width="14" height="14" rx="3"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    kennis: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    geheugen: '<path d="M11 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v2"/><path d="M14 3v5h5"/><circle cx="17" cy="17" r="4"/><path d="M17 15.3V17l1.1 1.1"/>',
    tools: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    richtlijnen: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    controle: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
    bijleren: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  };
  const svg = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

  // ---------- Plaatsen ----------
  const ring = (r, start = -90) => SIX.map((_, i) => {
    const a = (start + i * 60) * Math.PI / 180;
    return [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
  });
  // waar het woord bij een rond icoon staat: naar buiten
  const side = ([x, y]) => (y < 22 ? 'up' : y > 78 ? 'down' : x > 50 ? 'right' : 'left');

  // ---------- De zes varianten ----------
  const VARIANTS = {
    1: { node: 'dot', pos: ring(36), line: 'straight' },
    2: { node: 'dot', pos: ring(38), line: 'straight', web: [12.7, 25.3, 38] },
    3: { node: 'dot', pos: ring(36), line: 'straight', glow: true, cls: 'glow' },
    4: { node: 'card', pos: ring(37), line: 'straight' },
    // links wat ze weet en leert, rechts wat ze doet en mag
    5: { node: 'pill', line: 'curve', order: ['kennis', 'geheugen', 'bijleren', 'tools', 'richtlijnen', 'controle'],
         pos: [[16, 20], [12, 50], [16, 80], [84, 20], [88, 50], [84, 80]] },
    // pointy-top zeshoeken: de buren liggen op 0, 60, 120 ... graden
    6: { node: 'hex', line: 'none', pos: ring(31.5, -120), center: 'hex' },
  };

  const NS = 'http://www.w3.org/2000/svg';
  const hover = matchMedia('(hover: hover)').matches;

  function build(v) {
    const cfg = VARIANTS[v];
    const card = document.querySelector(`.vcard[data-v="${v}"]`);
    card.innerHTML = `
      <div class="mm mm-${cfg.node} ${cfg.cls || ''}">
        ${cfg.glow ? '<span class="mm-glow" aria-hidden="true"></span>' : ''}
        <svg class="mm-svg" viewBox="0 0 100 100" aria-hidden="true"></svg>
      </div>
      <div class="vp"><span class="vp-ic"></span><p class="vp-name"></p><p class="vp-text"></p></div>`;
    const map = card.querySelector('.mm'), s = card.querySelector('.mm-svg');
    const add = (tag, attrs) => { const e = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, val]) => e.setAttribute(k, val)); s.appendChild(e); return e; };

    // het web: zeshoeken op een paar stralen
    (cfg.web || []).forEach(r => add('polygon', { class: 'web', points: ring(r).map(p => p.map(n => n.toFixed(2)).join(',')).join(' ') }));

    const ids = cfg.order || SIX;
    const els = {}, lines = {};
    // de lijnen vanuit het midden
    ids.forEach((id, i) => {
      if (cfg.line === 'none') return;
      const [x, y] = cfg.pos[i];
      const d = cfg.line === 'curve'
        ? `M50 50 C${((50 + x) / 2).toFixed(1)} 50 ${((50 + x) / 2).toFixed(1)} ${y} ${x} ${y}`
        : `M50 50 L${x.toFixed(2)} ${y.toFixed(2)}`;
      lines[id] = add('path', { class: 'spoke', d });
    });

    // het model
    const core = document.createElement('button');
    core.type = 'button';
    core.className = `mc mc-${cfg.center || 'circle'}`;
    core.dataset.id = 'model';
    core.innerHTML = `<span class="mc-in">${svg('model')}<span class="mc-name">Het model</span></span>`;
    map.appendChild(core);
    els.model = core;

    // de zes
    ids.forEach((id, i) => {
      const [x, y] = cfg.pos[i];
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.id = id;
      b.style.left = `${x}%`;
      b.style.top = `${y}%`;
      b.setAttribute('aria-label', `${D[id].name}: ${D[id].text}`);
      if (cfg.node === 'dot') {
        b.className = `mn mn-dot lab-${side([x, y])}`;
        b.innerHTML = `<span class="mn-ic">${svg(id)}</span><span class="mn-lab">${D[id].name}</span>`;
      } else if (cfg.node === 'card') {
        b.className = 'mn mn-card';
        b.innerHTML = `<span class="mn-ic">${svg(id)}</span><span class="mn-txt"><span class="mn-name">${D[id].name}</span><span class="mn-short">${D[id].short}</span></span>`;
      } else if (cfg.node === 'pill') {
        b.className = `mn mn-pill ${x < 50 ? 'is-left' : 'is-right'}`;
        b.innerHTML = `<span class="mn-ic">${svg(id)}</span><span class="mn-name">${D[id].name}</span>`;
      } else {
        b.className = 'mn mn-hex';
        b.innerHTML = `<span class="hex-in"><span class="mn-ic">${svg(id)}</span><span class="mn-name">${D[id].name}</span></span>`;
      }
      map.appendChild(b);
      els[id] = b;
    });

    // het paneel rechts
    const panel = card.querySelector('.vp'), pIc = panel.querySelector('.vp-ic'), pName = panel.querySelector('.vp-name'), pText = panel.querySelector('.vp-text');
    let now = null, timer = 0, first = true;
    function pick(id) {
      if (id === now) return;
      now = id;
      Object.entries(els).forEach(([k, e]) => e.classList.toggle('is-on', k === id));
      Object.entries(lines).forEach(([k, l]) => {
        l.classList.toggle('is-on', k === id);
        l.classList.toggle('is-all', id === 'model');   // het model gekozen: alle lijnen stromen zacht
      });
      const fill = () => { pIc.innerHTML = svg(id); pName.textContent = D[id].name; pText.textContent = D[id].text; panel.classList.remove('swap'); };
      clearTimeout(timer);
      if (first) { first = false; fill(); return; }
      panel.classList.add('swap');
      timer = setTimeout(fill, 170);
    }
    Object.entries(els).forEach(([id, e]) => {
      e.addEventListener('click', () => pick(id));
      e.addEventListener('focus', () => pick(id));
      if (hover) e.addEventListener('mouseenter', () => pick(id));
    });
    pick('model');
  }

  Object.keys(VARIANTS).forEach(build);
})();
