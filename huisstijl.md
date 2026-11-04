# TriaCore AI — huisstijl

De vaste visuele basis van TriaCore: kleuren, lettertypes en tekstkleuren. **Medium-onafhankelijk** — geldt evengoed voor een presentatie, een website, een formulier, een PDF of een Instagram-post.

Dit document zegt *wat* de merkkleuren en -fonts zijn. Hoe je ze in een presentatie toepast (slide-patronen, grids, animaties) staat in `Presentatie/STYLE.md`. Wat we schrijven staat in `triacore-context.md`.

---

## 1. Kleurenpalet

### Merkkleur

| Kleur | Hex | Waar |
|---|---|---|
| **TriaCore-groen** | `#628F69` | dé accentkleur: het merk zelf, accentwoorden, lijnen, iconen, knoppen, randen |
| Groen donker | `#557A5B` | groen **op een lichte achtergrond** waar `#628F69` te licht oogt (kleine tekst, labels) |
| Groen licht | `#8FB495` | groen **op een donkere achtergrond** (labels op navy) |

Groen is een *accent*, geen vlakvulling. Grote groene vlakken vermijden — het werkt door schaarste: één groen woord, één groene lijn, één groen vinkje.

### Neutralen

| Kleur | Hex | Waar |
|---|---|---|
| **Navy** | `#0F172A` | hoofdtekst op licht **én** de donkere achtergrond |
| Navy diep | `#111827` | extra donkere laag achter navy (page-achtergrond, buitenrand) |
| **Licht** | `#F2F2F2` | de standaard lichte achtergrond |
| Kaart / vlak | `#FBFBFA` | subtiel afgezet vlak op een lichte achtergrond (kaartjes, callouts) |
| Wit | `#FFFFFF` | dragers voor logo's en foto's; niet als hoofdachtergrond |
| Lijn | `#D9D9D6` | randen, dividers, rasterlijnen |

### Tekstkleuren

**Op lichte achtergrond (`#F2F2F2` / `#FBFBFA`):**

| Rol | Waarde | Hex-benadering (print/tools zonder alpha) |
|---|---|---|
| Hoofdtekst | `#0F172A` | `#0F172A` |
| Subtekst / lead | `rgba(15,23,42,.62)` | `#656A76` |
| Meta / labels / bijschrift | `rgba(15,23,42,.42)` | `#93969E` |
| Accentwoord in een titel | `#628F69` | — |
| Klein groen label / eyebrow | `#557A5B` | — |

**Op donkere achtergrond (`#0F172A`):**

| Rol | Waarde | Hex-benadering |
|---|---|---|
| Hoofdtekst | `#FFFFFF` | `#FFFFFF` |
| Subtekst / lead | `rgba(255,255,255,.68)` | `#B4B7BC` |
| Meta / labels | `rgba(255,255,255,.45)` | `#7C818B` |
| Accentwoord / eyebrow | `#8FB495` | — |

### Achtergronden — de regel

**Licht is de standaard, donker is interpunctie.** Gebruik `#0F172A` alleen op de momenten die gewicht verdienen (opening, afsluiter, één kantelpunt). Wie donker als decoratie gebruikt, verliest het effect ervan.

---

## 2. Typografie

Drie lettertypes, elk met één vaste rol. **Nooit door elkaar gebruiken.**

| Rol | Font | Gewichten | Waarvoor |
|---|---|---|---|
| **Serif** | Playfair Display | 500 / 600 / 700 / 800 | titels, grote cijfers en bedragen — het editoriale, premium gevoel |
| **Sans** | DM Sans | 400–700 | alle lopende tekst: leads, paragrafen, beschrijvingen, opsommingen |
| **Brand** | Space Grotesk | 500 / 600 / 700 | eyebrows, labels, badges, knoppen, meta, UI-tekst — alles wat functioneel is in plaats van lopend |

Alle drie beschikbaar via Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
```

Fallbacks:

```css
--serif: "Playfair Display", Georgia, "Times New Roman", serif;
--sans:  "DM Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
--brand: "Space Grotesk", "DM Sans", system-ui, sans-serif;
```

> **Wijziging (aug 2026):** het brand-font was Syne. Dat las te stroef op klein formaat — de lettervormen zijn te eigenzinnig zodra je ze uppercase en wijd uitspatieert. Space Grotesk houdt hetzelfde strakke, technische karakter maar met normale letterbouw. Loopt er nog ergens Syne, vervang het dan één-op-één.

### Leesbaarheidsregel voor het brand-font

Uppercase + wijde letterafstand is een **accent**, geen standaardinstelling. Hoe meer tekst, hoe minder van allebei:

| Gebruik | Stijl |
|---|---|
| Eyebrow / sectielabel (1–4 woorden) | UPPERCASE, `letter-spacing: .15em`, 600 |
| Badge / chip / tag | UPPERCASE, `letter-spacing: .14em`, 600 |
| Knop | **geen** uppercase, `letter-spacing: .02em`, 600 |
| Meta, hints, hulptekst, UI-labels | **geen** uppercase, `letter-spacing: .01em`, 500 |

Nooit boven `.18em` gaan, en een volledige zin nooit in uppercase zetten. Moet iemand het écht lezen, dan is het gewone zinsnotatie.

### Tekststijlen

| Element | Font | Stijl | Kleur |
|---|---|---|---|
| **Titel** | Serif | 600, `line-height: 1.04`, kort en tweeledig | `#0F172A` (licht) / `#FFFFFF` (donker), tweede deel in groen |
| **Ondertitel / lead** | Sans | 400, `line-height: 1.5`, beperkte regelbreedte | subtekstkleur (zie tabel hierboven) |
| **Eyebrow / kicker** | Brand | 600, UPPERCASE, `letter-spacing: .15em`, ±11px | `#557A5B` (licht) / `#8FB495` (donker) |
| **Body** | Sans | 400, `line-height: 1.5` | hoofdtekstkleur |
| **Label / badge** | Brand | 600, UPPERCASE, `letter-spacing: .14em` | groen of neutraal |
| **Knop** | Brand | 600, gewone zinsnotatie, `letter-spacing: .02em` | wit op groen |
| **Meta / hint / UI-tekst** | Brand | 500, gewone zinsnotatie, ±13px | subtekstkleur |
| **Cijfer / bedrag** | Serif | 600, `font-variant-numeric: tabular-nums` | `#0F172A` of groen |

**Titelregel:** een titel is kort en bestaat uit twee delen, waarvan het tweede deel groen is — *"Wat we bouwen. En voor wie."* Nooit een volledige zin, nooit een punt op het einde bij losse titelfragmenten.

**Losse `&`:** altijd in DM Sans (500), nooit in Playfair — die ampersand is te sierlijk en trekt de aandacht weg.

**Hoofdletters:** uppercase zet je via opmaak (`text-transform`), niet door het woord zelf in kapitalen te typen.

---

## 3. Logo

Twee varianten, allebei op transparante achtergrond:

- **Wit logo** — op donkere achtergronden (`#0F172A`, `#111827`, foto's). De standaardkeuze op donker.
- **Groen logo** — op lichte achtergronden (`#F2F2F2`, wit).

Kies altijd de variant die contrasteert met de ondergrond; het witte logo is onzichtbaar op licht. Beide bestanden hebben veel interne witruimte (het merk beslaat ± de middelste 56% breedte en 34% hoogte) — schaal dus royaal en corrigeer de uitlijning met een negatieve marge in plaats van op de bestandsranden te vertrouwen.

**Logo's van anderen** (klanten, partners, tools) zijn meestal zwart of hebben een eigen achtergrond: zet ze altijd op een **witte drager** — een ronde badge of een rechthoekige tegel met afgeronde hoek — zodat ze ook op een donkere ondergrond netjes ogen. Nooit zelf een merklogo natekenen of ergens ophalen: gebruik enkel aangeleverde bestanden.

---

## 4. Vormtaal

- **Accent links, niet rondom.** Een kaart of callout krijgt een dikke groene **linkerrand** met een dunne `#D9D9D6`-rand rondom — niet een volledig groen kader.
- **Groene bovenrand** voor kolommen die naast elkaar staan (waardeproposities, kolomkaarten).
- **Dunne lijnen** (`1px solid #D9D9D6`) om items te scheiden — geen zware kaders of slagschaduwen.
- **Afgeronde hoeken:** subtiel (4–8 px op normale schaal). Pil-vorm enkel voor badges/chips.
- **Vinkje** = het groene merkvinkje (een 45° gedraaid kadertje met enkel linker- en onderrand in `#628F69`), niet een emoji of een icoonset-vinkje. Het hoort **in een lijst**, naast het item dat het afvinkt. Zet het **nooit naast de merknaam** als logo-mark: op klein formaat leest het als een willekeurig pijltje en dat oogt slordig. De naam staat op zichzelf.
- **Emphasis via kleur, niet via een kleurenschaal.** In een grafiek of diagram: alles neutraal grijs/navy, en **één** ding groen — het punt dat je maakt. Nooit een oplopend kleurverloop per datapunt.
- **Wit- en rustruimte** is deel van de stijl: liever minder tekst dan een vol vlak.

---

## 5. Snelle CSS-tokens (kopieer-en-plak)

```css
:root {
  /* merk */
  --green:     #628F69;
  --green-dim: #557A5B;   /* groen op licht */
  --green-lt:  #8FB495;   /* groen op donker */

  /* neutralen */
  --navy:      #0F172A;
  --navy-deep: #111827;
  --bg:        #F2F2F2;
  --surface:   #FBFBFA;
  --white:     #FFFFFF;
  --line:      #D9D9D6;

  /* tekst op licht */
  --text:      #0F172A;
  --sub:       rgba(15,23,42,.62);
  --sub-soft:  rgba(15,23,42,.42);

  /* tekst op donker */
  --text-inv:      #FFFFFF;
  --sub-inv:       rgba(255,255,255,.68);
  --sub-soft-inv:  rgba(255,255,255,.45);

  /* fonts */
  --serif: "Playfair Display", Georgia, serif;
  --sans:  "DM Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --brand: "Space Grotesk", var(--sans);
}
```

---

## 6. Kort samengevat

| | |
|---|---|
| Accent | groen `#628F69` |
| Tekst | navy `#0F172A` op licht, wit op donker |
| Achtergrond | licht `#F2F2F2` standaard, navy `#0F172A` spaarzaam |
| Titels | Playfair Display, tweede deel groen |
| Tekst | DM Sans |
| Labels | Space Grotesk — uppercase enkel voor korte eyebrows en badges |

Wijk hier alleen bewust van af. Voegt een nieuw kanaal iets toe dat vaker terugkomt (een kleur, een vormpatroon), leg het dan hier vast in plaats van het per project opnieuw uit te vinden.
