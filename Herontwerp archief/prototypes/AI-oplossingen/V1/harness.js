/* =============================================================
   AI-oplossingen V1: "Zo bouwen wij AI.", het schema in een kaart (gekozen uit Schema varianten, 05b Zoom).

   Bovenaan een rij tabs: het model en de zes onderdelen, elk met een icoon. Links een camera boven een kleine mindmap:
   het model in het midden, de zes als kaartjes eromheen. Ga je over een tab (of tik je erop), dan zoomt de camera zacht
   naar dat onderdeel. Van het model blijft een randje in beeld, aan de kant waar het echt ligt; de andere onderdelen
   vagen weg. Rechts de naam en de uitleg.

   De mindmap heeft een vaste maat (ZOOM.world); de camera schaalt en schuift haar. Het beeld loopt links en rechts
   door voorbij de kolom (--bl en --br in page.css) en vaagt daar weg, zodat er geen harde grens is.
   ============================================================= */
(function () {
  'use strict';

  // ---------- De inhoud ----------
  const HARNESS = {
    model:       { name: 'Het model',
      text: 'Het brein van de AI. Het begrijpt een vraag, denkt na en kiest de volgende stap. Het model kan wisselen: we kiezen telkens het model dat het best past. Alles eromheen blijft.' },
    kennis:      { name: 'Kennis',       // context, en de gegevens uit je systemen
      text: 'Wat de AI vanaf de start weet: je processen, je regels, je manier van werken, en de gegevens uit je eigen systemen. Eén keer goed vastgelegd, telkens opnieuw gebruikt.' },
    geheugen:    { name: 'Geheugen',     // geheugen
      text: 'Wat er eerder gebeurde, per klant en per dossier. Zo bouwt de AI verder op wat ze al weet, en begint ze elke taak met de juiste voorgeschiedenis.' },
    tools:       { name: 'Tools',        // tools
      text: 'Wat de AI kan doen in je systemen: gegevens opvragen, een document aanmaken, iets klaarzetten in je software. Zo rondt ze echt werk af.' },
    richtlijnen: { name: 'Richtlijnen',  // permissies en sandbox, hooks
      text: 'Wat de AI mag, vooraf afgesproken. Samen bepalen we wat ze zelf doet, wat ze klaarzet en wat ze eerst vraagt. Die afspraken zitten in het systeem zelf, bij elke stap.' },
    controle:    { name: 'Controle',     // verificatie, mens-in-de-lus
      text: 'Of het werk klopt, achteraf nagekeken. De AI controleert haar resultaat met vaste regels en berekeningen. Bij belangrijke stappen, en bij alles wat naar buiten gaat, keurt een mens goed.' },
    bijleren:    { name: 'Bijleren',     // logging en meting, testset, onderhoud
      text: 'Elke stap wordt vastgelegd, elke aanpassing testen we eerst op echte voorbeelden uit je bedrijf, en wat je mensen corrigeren, verwerken we in de kennis.' },
  };
  const SIX = ['kennis', 'geheugen', 'tools', 'richtlijnen', 'controle', 'bijleren'];   // met de klok mee vanaf boven

  // ---------- De icoontjes: fijne lijnen, 24 x 24 ----------
  const ICON = {
    model: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/><path d="M20 3v4M22 5h-4M4 17v2M5 18H3"/>',   // het AI-sterretje
    kennis: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',   // een document
    geheugen: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4M17.6 6.5a3 3 0 0 0 .4-1.38M6 5.13a3 3 0 0 0 .4 1.37M3.48 10.9a4 4 0 0 1 .58-.4M19.94 10.5a4 4 0 0 1 .58.4M6 18a4 4 0 0 1-1.97-.52M19.97 17.48A4 4 0 0 1 18 18"/>',   // een breintje
    tools: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',   // een sleutel
    richtlijnen: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',   // een schild
    controle: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',   // een vinkje
    bijleren: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',   // een stijgende lijn
  };
  const svg = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

  // ---------- De camera ----------
  const ZOOM = {
    // compacter sinds 2026-10-08 (Lucas: de kaart lager, met even grote letters en icoontjes): een kleinere wereld in een
    // lager beeld houdt de kaartjes even groot
    world: 480,      // de maat van de mindmap (px, vierkant), het model in het midden
    ring: 150,       // zo ver staan de zes van het model
    scale: 2,        // zo ver zoomt de camera in op een onderdeel
    toward: 0,       // en schuift ze zoveel px van het onderdeel richting het model (groter = meer van het model in beeld)
    start: -90,      // waar het eerste onderdeel staat (graden; -90 = boven)
  };

  const card = document.getElementById('hcard');
  const ids = ['model', ...SIX];
  const W = ZOOM.world, M = W / 2;
  const P = { model: [M, M] };
  SIX.forEach((id, i) => {
    const a = (ZOOM.start + i * 60) * Math.PI / 180;
    P[id] = [M + ZOOM.ring * Math.cos(a), M + ZOOM.ring * Math.sin(a)];
  });
  const xy = id => `left:${P[id][0].toFixed(1)}px;top:${P[id][1].toFixed(1)}px`;

  card.innerHTML = `
    <div class="htabs" role="tablist">${ids.map(id => `<button type="button" class="htab" role="tab" data-id="${id}">${svg(id)}<span>${HARNESS[id].name}</span></button>`).join('')}
      <span class="hbar" aria-hidden="true"></span></div>
    <div class="hbody">
      <div class="zcol"><div class="zs" aria-hidden="true">
        <div class="zw" style="width:${W}px;height:${W}px">
          <svg class="zl" viewBox="0 0 ${W} ${W}">${SIX.map(id => `<line data-for="${id}" x1="${M}" y1="${M}" x2="${P[id][0].toFixed(1)}" y2="${P[id][1].toFixed(1)}"/>`).join('')}</svg>
          <span class="zn zn-model" data-for="model" style="${xy('model')}">${svg('model')}<b>Het model</b></span>
          ${SIX.map(id => `<span class="zn zn-part" data-for="${id}" style="${xy(id)}"><i>${svg(id)}</i><b>${HARNESS[id].name}</b></span>`).join('')}
        </div>
      </div></div>
      <div class="hpanel" aria-live="polite"><p class="hp-name"></p><p class="hp-text"></p></div>
    </div>`;

  const tabs = [...card.querySelectorAll('.htab')], bar = card.querySelector('.hbar');
  const stage = card.querySelector('.zs'), world = card.querySelector('.zw');
  const panel = card.querySelector('.hpanel'), pName = card.querySelector('.hp-name'), pText = card.querySelector('.hp-text');
  let cur = null, timer = 0;

  // de camera: het punt (cx, cy) van de mindmap in het midden van de kolom, met zoom s. Het beeld is links en rechts
  // breder dan de kolom; het midden van de kolom ligt dus op bl + kolombreedte / 2.
  function aim() {
    if (!cur) return;
    const cs = getComputedStyle(stage), num = n => parseFloat(cs.getPropertyValue(n)) || 0;
    const bl = num('--bl'), br = num('--br'), bt = num('--bt'), bb = num('--bb');
    const vw = stage.clientWidth - bl - br, vh = stage.clientHeight - bt - bb, base = Math.min(vw, vh) / W;
    let cx = M, cy = M, s = 1;
    if (cur !== 'model') {
      const [x, y] = P[cur], len = Math.hypot(x - M, y - M);
      cx = x - (x - M) / len * ZOOM.toward;
      cy = y - (y - M) / len * ZOOM.toward;
      s = ZOOM.scale;
    }
    const k = base * s;
    world.style.transform = `translate(${(bl + vw / 2 - cx * k).toFixed(1)}px, ${(bt + vh / 2 - cy * k).toFixed(1)}px) scale(${k.toFixed(4)})`;
    const t = tabs[ids.indexOf(cur)];
    bar.style.width = `${t.offsetWidth}px`;
    bar.style.transform = `translateX(${t.offsetLeft}px)`;
  }

  function pick(id, first) {
    if (id === cur) return;
    cur = id;
    tabs.forEach(t => { const on = t.dataset.id === id; t.classList.toggle('is-on', on); t.setAttribute('aria-selected', String(on)); });
    card.classList.toggle('is-zoomed', id !== 'model');
    card.querySelectorAll('[data-for]').forEach(e => e.classList.toggle('is-on', e.dataset.for === id));
    aim();
    // de uitleg vaagt kort weg en komt terug met de nieuwe tekst
    const fill = () => { pName.textContent = HARNESS[id].name; pText.textContent = HARNESS[id].text; panel.classList.remove('swap'); };
    clearTimeout(timer);
    if (first) { fill(); return; }
    panel.classList.add('swap');
    timer = setTimeout(fill, 170);
  }
  const hover = matchMedia('(hover: hover)').matches;
  tabs.forEach(t => {
    t.addEventListener('click', () => pick(t.dataset.id));
    t.addEventListener('focus', () => pick(t.dataset.id));
    if (hover) t.addEventListener('mouseenter', () => pick(t.dataset.id));
  });

  // terug naar het model zodra je volledig uit de kaart gaat (Lucas, 2026-10-08): met de muis, of als de kaart uit beeld scrolt
  if (hover) card.addEventListener('pointerleave', () => pick('model'));
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) pick('model'); }).observe(card);

  pick('model', true);
  new ResizeObserver(aim).observe(stage);
  document.fonts.ready.then(aim);
})();
