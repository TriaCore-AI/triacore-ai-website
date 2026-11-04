# TriaCore stijl voor de nieuwe website

**Status: voorstel, 2026-10-02. Lucas beslist.** Pas na zijn akkoord wordt de vault-notitie over de
visuele identiteit canoniek en verhuizen de tokens naar `70-uitvoering/` in de marketing second brain.

Dit document zegt hoe de nieuwe site eruitziet en beweegt. Het bouwt op twee bronnen:

- de vault: `10-merk/licht-grijs-donkerblauw-en-een-groen-accent.md` (wie we zijn, visueel)
- `huisstijl.md` in deze repo (augustus 2026, de vollediger versie van dezelfde huisstijl)

De technische waarden staan in [tokens.css](tokens.css). Elk prototype laadt dat bestand, zodat
alle homepages dezelfde stijl delen en alleen de ervaring verschilt.

---

## 1. Wat nog open lag, en het voorstel

| Onderwerp | Vault | huisstijl.md | Live site | **Voorstel** |
|---|---|---|---|---|
| Font voor labels, knoppen en UI | DM Sans in hoofdletters | Space Grotesk | Syne | **Space Grotesk.** Leesbaar op klein formaat, technisch zonder stroef te zijn |
| Lichte achtergrond | `#F2F2F2` | `#F2F2F2` | `#F8FAFC` | **`#F2F2F2`** |
| Kaarten op de achtergrond | `#F8FAFC` | `#FBFBFA` | | **`#FBFBFA`**, warmer en dichter bij het grijs |
| Donker | open: mag navy de volledige achtergrond zijn? | licht is de standaard, donker is interpunctie | `#020617` | **Navy `#0F172A` als interpunctie:** de opening, één kantelpunt, de afsluiter |

---

## 2. Kleur

| Rol | Waarde |
|---|---|
| Accent, het enige | groen `#628F69` (op licht voor kleine tekst `#557A5B`, op donker `#8FB495`) |
| Tekst en donkere achtergrond | navy `#0F172A` |
| Achtergrond | `#F2F2F2` |
| Kaart of vlak | `#FBFBFA` |
| Lijn | `#D9D9D6` |

- Groen werkt door schaarste: één woord, één lijn, één balk. Nooit een groot groen vlak.
- Geen verlopen als vlak, geen gloed, geen blobs, geen tweede accentkleur.

## 3. Typografie

| Rol | Font | Waarvoor |
|---|---|---|
| Serif | Playfair Display 500 tot 800 | titels, grote cijfers |
| Sans | DM Sans 400 tot 700 | alle lopende tekst |
| Brand | Space Grotesk 500 tot 600 | labels, knoppen, meta, UI |

- **Titels zijn kort en tweeledig, het tweede deel groen:** "Wat we bouwden. *En voor wie.*"
- Hoofdletters met letterafstand alleen voor labels van één tot vier woorden.
- Een losse `&` staat altijd in DM Sans.
- Geen koppelteken of streepje in zichtbare labels en titels (afspraak uit de CLAUDE.md van deze repo).

## 4. Vorm

- Hoeken: 6 px voor knoppen, 8 px voor kaarten, 14 px voor grote beeldkaarten. Pil alleen voor
  badges en voor de balken van het logo. *De 14 px wijkt licht af van huisstijl.md (4 tot 8 px):
  op grote beeldkaarten oogt 8 px te hoekig.*
- Scheiden met dunne lijnen van 1 px, nooit met schaduw. Kaarten tillen niet op.
- Accent links of bovenaan, nooit rondom.
- Veel ruimte: een sectie ademt minstens 96 px boven en onder, op desktop tot 192 px.

---

## 5. Beweging

Hier stond nog niets. Dit is het belangrijkste deel van dit voorstel.

### De regels

1. **Elke beweging beantwoordt een vraag of toont een verband.** Nooit bewegen om te bewegen.
2. **Eén idee per scène.** De hero heeft het logo, de projecten hebben de duokaarten, de oplossingen
   hebben de naamrijen. Niet overal alles tegelijk.
3. **Snel erin, traag eruit.** Alles wat verschijnt, gebruikt `--ease-out`. Alleen wat van plaats
   wisselt, gebruikt `--ease-in-out`. Nooit veren of doorschieten: premium is beheerst.
4. **Korte afstanden.** Een element schuift 8 tot 24 px. Niets vliegt van buiten het scherm binnen.
5. **Beweging alleen waar je kijkt.** Hover en focus starten beweging, de rest staat stil (Porsche).
6. **Onthullen bij scrollen gebeurt één keer.** Wie terugscrolt, ziet de inhoud staan.
7. **De bezoeker houdt de controle.** Geen scroll-jacking. Video heeft een pauzeknop.
8. **Hover voegt diepgang toe, nooit informatie.** Wat je op een gsm niet kan hoveren, moet je ook
   zonder hover kunnen vinden.
9. **Minder beweging gevraagd, dan het eindbeeld.** Wie in zijn toestel minder beweging instelt,
   krijgt geen animatie, alleen het resultaat.

### Het tempo

| Token | Duur | Waarvoor |
|---|---|---|
| `--dur-micro` | 160 ms | kleur, onderlijning, focus |
| `--dur-hover` | 420 ms | kaart, balk, pijl |
| `--dur-reveal` | 900 ms | sectie, titel, beeld dat verschijnt |
| `--dur-scene` | 1700 ms | de logo-intro, één keer per bezoek |
| `--stagger` | 70 ms | tussen elementen in een reeks, hoogstens zes |

### Vaste interacties

| Element | Gedrag |
|---|---|
| **Knop** | Groen vlak met witte tekst. Hover: groen wordt `#557A5B`, de pijl schuift 4 px op |
| **Tekstlink** | Een lijn tekent zich van links naar rechts onder de tekst |
| **Beeldkaart** | Het beeld zoomt traag naar 104 %, het ronde pijltje wordt een knop "Ontdek" |
| **Duokaarten** (Porsche) | Twee even brede kaarten. Hover: de ene wordt breder, de andere smaller, de foto wordt video |
| **Naamrij** (Palantir) | De lijn erboven kleurt groen van links naar rechts, de naam schuift 8 px op |
| **Snelmenu** (Ferrari) | Puntjes linksonder. Hover: de namen van de secties verschijnen |
| **Logo** | De intro en de hover op de pijlers: zie `prototypes/logo-animatie.html` |
| **Menuknop** | Het logo is de menuknop. Hover: de balken lijnen uit. Klik: ze worden een kruisje |

---

## 6. Wat we niet doen

- Geen AI slop: geen tekstzware secties, geen lijsten met vinkjes, geen genummerde stappenkaarten,
  geen blauwe blobs met zwevende kaarten (anti-referentie verox.be).
- Geen schaduwen, geen glas, geen gloed.
- Geen emoji's, geen iconensets als decoratie.
- Geen typemachine-effect dat de pagina vastzet tot het klaar is (zoals de huidige hero).
