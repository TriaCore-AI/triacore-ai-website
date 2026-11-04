# Herontwerp officieel

Laatst bijgewerkt: 23 oktober 2026.

Dit is het overzicht van het herontwerp van triacore.be dat we nu bouwen. Wie (mens of Claude) aan de site werkt, leest dit eerst.

> De map `Herontwerp archief/` bevat oudere proeven en prototypes (3D logo-animaties, hero varianten, ...). Die gebruiken we niet meer, enkel nog als referentie.

---

## 1. Wat we doen

We zetten de hele website om naar een nieuwe, lichte en rustige stijl: een lichte achtergrond die zacht afwisselt tussen wit en groener, Cormorant Garamond en Jost, veel ruimte en zachte scrollanimaties. De homepage is af. Nu werken we de pagina's één voor één uit.

**Kernboodschap:** "AI voor operationele vooruitgang". AI die in de processen van een bedrijf werkt, niet ernaast. Drie oplossingen: **custom oplossingen**, **workshops** en **AI-begeleiding**.

---

## 2. Hoe we werken

### Branches en omgevingen

```
lokaal (dev server)  →  staging (GitHub, bewaren)  →  main (GitHub, live via Netlify)
```

| Stap | Wat |
|---|---|
| **Lokaal** | Alles wordt gebouwd en bekeken op de dev server, meestal **http://localhost:5175/**. Wie bouwt, kijkt zelf in de browser; Claude opent geen browser. |
| **staging** | De werkbranch van het herontwerp. Af en toe committen en pushen naar `origin/staging` om werk te bewaren. Raakt de live site niet. Online te bekijken met wachtwoord op https://triacore-staging.netlify.app (apart Netlify-project, sinds 4 november 2026). |
| **main** | Gekoppeld aan Netlify (site "triacore" → triacore.be). Pas mergen en pushen als het herontwerp live mag, en enkel na uitdrukkelijke bevestiging. |

- **Nooit pushen zonder expliciete bevestiging.** Ook niet naar `staging`.
- Pushen vanuit Claude lukt via de GitHub CLI: `git -c credential.helper= -c credential.helper='!gh auth git-credential' push origin staging` (in Bash; via PowerShell kan de credential manager niet om een login vragen).
- **Startpunt:** de tag `voor-herontwerp` (commit `3319d9a`) is de site van voor het herontwerp. Daarnaar teruggaan kan altijd. De tag staat voorlopig enkel lokaal.
- **Terugdraaien:** per commit met `git revert`, per bestand met `git checkout voor-herontwerp -- <bestand>`.

### Stand van de commits

- `9704320` op `staging` (gepusht): de nieuwe homepage.
- **Nog niet gecommit** op het moment van schrijven: de pagina's Team, Contact, Projecten en de casepagina's, de headers van Custom oplossingen, Workshops en AI-begeleiding, de menubalk met dropdown, de filters op de projectenpagina en de correcte koppeltekens. Commit die vóór je grote nieuwe stappen zet.

### Drie chats tegelijk

De drie oplossingspagina's worden **tegelijk** uitgewerkt, elk in een eigen Claude-chat:

| Chat | Bestand | Route |
|---|---|---|
| AI-begeleiding | `src/pages/AiBegeleiding.jsx` | `/ai-begeleiding` |
| Workshops | `src/pages/Workshops.jsx` | `/workshops` |
| Custom oplossingen | `src/pages/CustomOplossingen.jsx` | `/custom-oplossingen` |

Afspraken voor die chats, zodat ze elkaar niet in de weg zitten:
- Elke chat past **alleen zijn eigen paginabestand** aan. Nieuwe onderdelen komen in een nieuw bestand met een eigen naam.
- **Gedeelde bestanden** (`App.jsx`, `index.css`, `main.jsx`, navbar, footer, bestaande componenten en data) worden niet gewijzigd zonder eerst te overleggen.
- **Geen commits of pushes** vanuit die chats. Committen gebeurt centraal, als de pagina's klaar zijn.
- Geen nieuwe dev server starten: de server op poort 5175 draait al.

---

## 3. Branding

De volledige stijl staat in de **branding bible**:
`C:\Onedrive - Triacore\OneDrive\Documenten\TriaCore AI 2027\Marketing\Branding\visuele-stijl.md`

**Let op:** de sectie Branding en de lijst met pagina's in `CLAUDE.md` beschrijven nog de **oude** site (Playfair Display, DM Sans, donkere secties). Voor het herontwerp geldt de branding bible.

De belangrijkste regels:
- **Kleuren:** achtergrond "verloop" (`bg-grain` in `index.css`): horizontale banden die zacht afwisselen tussen wit `#f5f7f6` en groener `#e2eae3`, elke twee schermen één golf, en die meescrollen (sinds 27 oktober 2026, vervangt de korrel op `#f2f2f2`), kaarten `#fafafa`, blauw `#0f172a`, groen `#628f69` enkel als accent, donker `#020617` enkel in de footer.
- **Letters:** Cormorant Garamond (500) voor titels, Jost voor de rest. Alle sectietitels even groot, eindigend op een punt.
- **Geen** donkere secties, eyebrows, labels in hoofdletters, schaduwen onder kaarten, bollen of blobs, stock of AI beelden.
- **Beweging:** zacht en traag genoeg om te lezen; een scrollanimatie speelt één keer; **de pagina nooit vastzetten** tijdens het scrollen.
- **Taal:** u-vorm, kort en concreet. Geen gedachtestreepjes, wel correcte koppeltekens ("AI-begeleiding", "AI-workshops").

---

## 4. Wat al gebouwd is

### Homepage (`src/App.jsx`)

Van boven naar onder:

1. **Hero:** gecentreerd en schermvullend. "AI voor operationele *vooruitgang*", één zin, de knop "Plan een gesprek", een tekstlink naar de oplossingen, en de klantlogo's in kleur ("Onder meer voor"), die op gsm op één lijn doorschuiven. De titel veegt regel per regel binnen. Daarachter een 3D-scène (`hero-scene.jsx`): een staaf van draaiende schijven voor een muur met raamlicht, en onder de muis schuiven schijven zacht uit de rij. De testversie en de andere varianten staan in `Herontwerp officieel/hero-3d/` (dit is scène 12).
2. **Bewezen in de praktijk:** klantkaarten (Croes NV, A&M Group, Medtronic, The Box) in een rij met pijltjes. Slepen, vegen, hover op een vervaagde kaart en pijltjes werken allemaal. Op gsm is het een veegrij (`veeg-rij.jsx`): de bezoeker veegt zelf, de kaart klikt in het midden vast en er is geen vervaging of automatische beweging.
3. **Onze oplossingen:** drie grote rijen (custom oplossingen, workshops, AI-begeleiding) die naar hun pagina linken.
4. **Onze aanpak:** het logo als schema. Elke balk is een pijler (Begrijpen, Vertalen, Waarmaken) en verschijnt één voor één terwijl je scrolt. Speelt één keer, zet niets vast. Onder 1280 pixels (`aanpak-klein.jsx`) klappen de balken van het logo tijdens het scrollen één voor één open tot hun pijler, en de vorige klapt dicht. Niets staat vast en terugscrollen werkt omgekeerd.
5. **Wat klanten zeggen:** één quote tegelijk met de bedrijfslogo's als tabs. Nu de quotes van Naomi Clear (Medtronic) en Alain Vangeebergen (planner, Croes NV, zonder foto).
6. **Het team:** drie grote portretten in een zigzag (Lucas linksboven, Rian rechts en lager, Jorn links onder Lucas).
7. **Veelgestelde vragen:** zes vragen in een rustige lijst.
8. **Klaar voor de volgende stap?:** de afsluitende oproep met Rian als aanspreekpunt.

Verder: een **snelmenu linksonder** om tussen de secties te springen, en een vloeiende overgang naar de donkere footer.

### Andere pagina's

| Pagina | Stand |
|---|---|
| Projecten (`/projecten`) | Header, klantkaarten in een raster, filters op soort oplossing |
| Casepagina's (`/projecten/croes-nv`, `/projecten/am-group`) | Gecentreerde leeskolom in de nieuwe stijl |
| Team (`/team`) | Header, Lucas, Rian en Jorn met portret, uitleg en contact |
| Contact (`/contact`) | Header, links Rian en Lucas met gegevens, rechts het formulier |
| Custom oplossingen, Workshops, AI-begeleiding | Enkel de header; worden nu uitgewerkt in de drie chats |
| Privacybeleid, cookiebeleid | Header en leeskolom in de nieuwe stijl (`legal-page.jsx`), juridische tekst ongewijzigd |

**Menubalk:** Oplossingen (dropdown met de drie pagina's) · Projecten · Team · Contact.

### Gedeelde onderdelen (`src/components/ui/`)

| Bestand | Wat |
|---|---|
| `page-header.jsx` | De header van elke pagina |
| `cta-button.jsx` | De knop (slank, geen schaduw) |
| `client-card.jsx` | Klantkaart (homepage en projecten) |
| `corner-trace.jsx` | De groene L lijn bij hover |
| `card-carousel.jsx` | Kaartenrij met pijltjes en slepen |
| `quote-stage.jsx` | Klantquotes |
| `faq-list.jsx` | Veelgestelde vragen |
| `section-nav.jsx` | Snelmenu linksonder |
| `footer.jsx`, `navbar.jsx` | Footer en menubalk |
| `contact-form.jsx` | Contactformulier |

**Data:** projecten in `src/data/projecten.jsx`, alle klantkaarten (ook workshopklanten en hun soort oplossing) in `src/data/klanten.jsx`.

---

## 5. Belangrijk om te weten

- **Geen verzonnen quotes, cijfers of klanten.** De quote van The Box is een plaatshouder die enkel op de lokale dev server verschijnen (`placeholder: true` in `App.jsx`), nooit op de echte site.
- **Contactformulier (Netlify Forms):** elk veld moet ook in het verborgen formulier in `index.html` staan, anders laat Netlify het weg. Test het formulier na het live zetten.
- **Solevo** staat niet op de site (juridische kwestie). Geen naam, case of link plaatsen.
- **Klantlogo's** staan in `src/assets/klantcases/`, de foto van Naomi in `src/assets/quotes/`.
- **Sitemap:** nieuwe routes toevoegen in `scripts/generate-sitemap.mjs`; de build maakt `public/sitemap.xml` opnieuw.
- **Tekstblokken van de cases** (`src/components/content/ContentBlocks.jsx`): `theme="nieuw"`; bloktypes zonder eigen versie vallen terug op de klassieke stijl.
- **Resources en nieuwsbrief zijn weg** (beslissing 4 november 2026): de pagina's, de inschrijving en de aankondigingsscripts. `/resources` en alles eronder sturen door naar de homepage (`public/_redirects`). Enkel de uitschrijflink (`newsletter-unsubscribe.js`, `lib/unsubscribe.js`, `lib/email-template.js`) blijft, voor wie in oude mails nog wil uitschrijven.
- De oude pagina Custom oplossingen staat als archief in `src/pages/CustomOplossingenOud.jsx` (niet gekoppeld aan een route).

---

## 6. Wat nog open staat

- De drie oplossingspagina's uitwerken (bezig).
- Quote van The Box verzamelen (naam, functie, quote). De quote van Croes NV laten nakijken door Alain Vangeebergen (samengevoegd uit zijn vragenlijst en licht geredigeerd).
- Het privacybeleid vermeldt nog de nieuwsbrief: aanpassen zodra beslist is wat er met de bestaande inschrijvingen in Resend gebeurt.
- `CLAUDE.md` bijwerken naar de nieuwe stijl en pagina's zodra het herontwerp vastligt.
- Opruimen: `tailwind.config.js` (niet meer gebruikt), en het lettertype Syne (enkel voor Solevo).
- Hogere resolutie van de teamfoto's (nu 512 × 512).
- Eventueel: één zin met sectoren bij custom oplossingen, en een korte animatievideo over het bedrijf (idee: zelf maken met Remotion in `C:\TriaCore AI\Remotion`).
- Na het live zetten: het contactformulier testen, en alles nakijken op gsm.
- De tag `voor-herontwerp` naar GitHub pushen (na bevestiging).
