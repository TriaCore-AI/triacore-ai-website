# TriaCore AI — Research: wat maakt een topwebsite (aug 2026)

Doel van dit document: de basis leggen voor een herontwerp van de homepage dat meer een
**experience** is dan de huidige (statische) site, zonder in te boeten aan overzicht. Dit is
research, geen implementatie — de eigenlijke bouw gebeurt later, apart van de live site
(zie [design.md](design.md) voor de creatieve briefing die daarvoor dient).

---

## 1. Referenties: wie doet dit echt goed

### Tech/SaaS-homepages (zakelijk, functioneel, toch met karakter)

| Site | Wat ze goed doen | Wat we ervan lenen |
|---|---|---|
| **Linear** (linear.app) | Extreem strakke, donkere UI; gloeiende gridlijnen; typografie die exact is afgesteld; meerdere kleine refreshes per jaar in plaats van één grote herbouw | Rust door precisie: minder elementen, maar elk element tot in de puntjes afgewerkt |
| **Stripe** (stripe.com) | Referentie voor gradient-/shadercraft; canvas-achtergronden die subtiel bewegen zonder de leesbaarheid te storen | Beweging als sfeer/achtergrond, nooit als afleiding van de boodschap |
| **Vercel** (vercel.com) | Developer-tool-esthetiek: terminal-achtige panelen, deploy-logs, donker met neon-accenten — voelt meteen technisch geloofwaardig | Product/proces tonen in plaats van illustreren — "showing beats telling" |
| **Framer** (framer.com) | Motion IS het product: kinetic type, cursor-reveals, fysica-gebaseerde overgangen | Bewijst dat een marketingsite zelf de beste demo van je kunnen is |
| **Raycast** (raycast.com) | Grote featureset, maar oogt nooit overweldigend dankzij één consistent kaartsysteem, veel witruimte, één illustratiestijl | Hoe je *veel* content toch overzichtelijk houdt — relevant voor TriaCore, dat ook veel te vertellen heeft |

### Studio's met sterke animatie (referentie voor techniek, niet voor schaal/budget)

- **Basement.studio** — merken, sites, 3D; "cool shit that performs" (performance blijft voorop staan)
- **Active Theory** — cinematische, verhalende sites voor grote merken
- **Resn** — speels, karaktervol, met humor — laat zien dat "premium" niet per se stijf hoeft te zijn
- **Locomotive** — agency-grade brand sites, naamgever van Locomotive Scroll (voorloper van Lenis)
- **Lusion** — WebGL/shader-referentie; niet ons niveau van budget/noodzaak, maar goed om te zien wat mogelijk is als extreem

Deze studio's werken met budgetten (€60k–150k+) die niet ons uitgangspunt zijn — ze dienen als
**inspiratie voor techniek en gevoel**, niet als blauwdruk voor scope.

### Individuele "design engineers" om te bestuderen

- **Rauno Freiberg** (rauno.me) — ex-Arc browser (The Browser Company), nu Vercel; schrijft/bouwt
  over de "onzichtbare details" van interactie-design (micro-timing, easing, focus-states)
- **Emil Kowalski** (emilkowal.ski) — bekend om doordachte, subtiele UI-animatie; geeft een cursus
  specifiek over webanimatie
- **Josh Comeau** — interactieve, uitlegbare animaties; toont hoe motion een concept kan
  verduidelijken in plaats van enkel versieren

Deze mensen werken vanuit het vak **"design engineering"**: één persoon/discipline die ontwerp
en code samen behandelt, zodat een animatie-idee niet verwatert tussen designer en developer.
Dat is precies de rol die de agent in [design.md](design.md) moet spelen.

---

## 2. Techniek: wat de productiestandaard is in 2026

- **Lenis + GSAP ScrollTrigger** is de gangbare combinatie voor smooth scroll + scroll-gedreven
  animatie: Lenis regelt de momentum/easing van het scrollen zelf, ScrollTrigger de timing/positie
  van animaties daarop. Samen zorgen ze voor het "cinematische" gevoel van veel awardsites.
- **Framer Motion** blijft de standaard voor component-niveau animatie in React (hover/tap/reveal/
  layout-transities) — past goed bij de bestaande stack (React 19 + Vite).
- De **CSS `view-timeline`-API** komt stabiel beschikbaar in browsers: voor eenvoudige scroll-reveals
  kan dat zonder JS, lichter en performanter dan een volledige GSAP-setup. Waar het kan: CSS eerst,
  GSAP pas voor wat CSS niet aankan.
- **WebGL/Three.js** is optioneel en alleen te overwegen voor één sterk, doelgericht accent (bv. een
  subtiele achtergrond in de hero) — niet als basislaag. Het kost performance en onderhoud die niet
  in verhouding staan tot een kmo-gerichte B2B-site.
- **Mobile-first scrollytelling**: desktop-only scroll-experiences zijn uit. Elke scroll-animatie
  moet op mobiel even goed (of vereenvoudigd maar) werken.
- **Performance en toegankelijkheid blijven harde randvoorwaarden**: `prefers-reduced-motion`
  respecteren, geen scroll-jacking dat de gebruiker gevangen zet, laadtijd bewaken ondanks motion.

---

## 3. Designtrends 2026 die relevant zijn voor TriaCore

- **Kinetic typography** — titels die bewegen/onthullen bij scroll of load, gebruikt om aandacht te
  sturen, niet om te showen. Past bij de bestaande titelregel uit de huisstijl (Playfair, kort,
  tweeledig, tweede deel groen) — dat kan je laten "landen" in plaats van gewoon laten verschijnen.
- **Bento grids** — modulaire, asymmetrische kaartlayouts. Sterk geschikt voor de 4 bouwblokken
  (AI‑integratie / Mobiele app / Webplatform / Automatisering) en voor een projectenoverzicht dat
  in één oogopslag scanbaar blijft.
- **Micro‑interacties** — kleine, functionele feedbackmomenten (hover, focus, knopstatus) die een
  interface "levend" laten aanvoelen zonder dat ze op zichzelf de aandacht opeisen.
- **Scroll storytelling in hoofdstukken** — de pagina opdelen in duidelijk afgebakende "scenes"
  (scroll-snap of pinning), elk met een enkele boodschap — dit ondersteunt net overzicht, want de
  gebruiker verwerkt de site in behapbare stappen in plaats van één lange scroll van alles-tegelijk.
- **Bewuste terughoudendheid ("less but bolder")** — de dominante toon in 2026 is niet drukte, maar
  precisie: minder elementen, groter, met meer ruimte en betere timing. Dat sluit direct aan bij de
  bestaande huisstijlregel "wit- en rustruimte is deel van de stijl."

---

## 4. Hoe "experience" en "overzichtelijk" samengaan

Uit de B2B/SaaS-research komt telkens dezelfde spanning terug, en telkens dezelfde oplossing:

- Een bezoeker moet **binnen 5 seconden** kunnen zeggen wat je doet en voor wie — motion mag dat
  moment nooit vertragen of verbergen achter een "verder lezen"-moment.
- **"Showing beats telling"**: eigen projecten/werk vroeg en visueel tonen werkt beter dan het pas
  halverwege de pagina te introduceren — dit onderbouwt rechtstreeks de wens om projecten sneller
  op de homepage te tonen.
- **Progressieve onthulling**: begin met de kernboodschap, laat diepgang (aanpak, FAQ, alle
  bouwblokken in detail) pas verderop volgen — dat is al hoe de huidige site is opgebouwd, maar kan
  scherper: eerst *bewijs* (projecten), dan pas *uitleg* (aanpak/uitdagingen).
- **Elke animatie moet een vraag beantwoorden of een verband tonen** — nooit versiering om
  versiering. Dat is de meetlat voor "blijft overzichtelijk, ook al is het een experience."

---

## 5. Concrete aanbevelingen voor de TriaCore-herontwerp

1. **Tagline behouden**: "De AI‑partner waar groeiende bedrijven op bouwen/vertrouwen" blijft het
   anker — kinetic type kan 'm laten landen, maar de boodschap zelf verandert niet.
2. **Projecten (Croes NV, A&M Group) naar boven halen** — direct na of zelfs verweven met de hero,
   in plaats van pas twee/drie secties verderop zoals nu. Bento‑achtige kaarten lenen zich hiervoor.
3. **Scenes in plaats van één lange scroll** — de bestaande secties (verhaal, uitdagingen, aanpak,
   projecten, resources, team, faq) herstructureren tot een kleiner aantal krachtige, duidelijk
   afgebakende hoofdstukken met eigen scroll-in/scroll-out moment.
4. **Motion-budget per sectie**: één duidelijk animatie-idee per scene (bv. hero = kinetic tagline +
   subtiele achtergrondbeweging; projecten = kaarten die in bento-grid "landen"; aanpak = bouwblokken
   die als modulair systeem in elkaar klikken). Niet overal tegelijk alles.
5. **Techstack**: Lenis + GSAP ScrollTrigger voor het scroll-gevoel, Framer Motion voor
   component-interacties, CSS `view-timeline` waar het voldoende is — geen WebGL tenzij er één
   duidelijk moment is dat het verdient.
6. **Blijf toetsen aan de bestaande huisstijl** ([huisstijl.md](huisstijl.md)) — groen als accent,
   niet als vlak; donker als interpunctie, niet als basis; titels kort en tweeledig. Een nieuw
   lettertype-document volgt nog (specifiek voor dit herontwerp) en wordt hier toegevoegd zodra
   beschikbaar.
7. **Perf & toegankelijkheid niet onderhandelbaar**: `prefers-reduced-motion` support, mobiel
   getest, geen scroll-jacking dat de gebruiker vastzet.

---

## Bronnen

- [Inspoai — 50 Best SaaS Website Designs in 2026](https://www.inspoai.io/blog/best-saas-website-designs-2026)
- [Gridrebels — 20 Best SaaS Website Designs in 2026](https://gridrebels.studio/post/20-best-saas-website-designs-in-2026-examples-that-actually-convert)
- [Awwwards — Winning websites](https://www.awwwards.com/websites/)
- [Awwwards — Best GSAP Animation Websites](https://www.awwwards.com/websites/gsap/)
- [Awwwards — Best Design Agencies](https://www.awwwards.com/websites/design-agencies/)
- [Hon Tran — 10 Award-Winning Websites of 2026, Judged](https://www.hontran.dev/blog/best-award-winning-websites-2026)
- [rauno.me — Rauno Freiberg](https://rauno.me/)
- [devouringdetails.com](https://devouringdetails.com/)
- [emilkowal.ski — How I built my course platform](https://emilkowal.ski/ui/how-i-built-my-course-platform)
- [Svilenković — Scrollytelling Trends 2026](https://svilenkovic.com/3d/scrollytelling-trends-2026)
- [Lenis (darkroomengineering)](https://github.com/darkroomengineering/lenis)
- [Dappasol — Best Cinematic Website Studios 2026](https://dappasol.com/guides/best-cinematic-website-studios/)
- [Lusion](https://lusion.co/) · [basement.studio](https://basement.studio/) · [Active Theory](https://activetheory.net/)
- [Fireart Studio — Web Design Trends 2026](https://fireart.studio/blog/the-best-web-design-trends/)
- [WriterDock — Bento Grids & Beyond](https://writerdock.in/blog/bento-grids-and-beyond-7-ui-trends-dominating-web-design-2026)
- [Blend B2B — 10 best B2B homepage examples in 2026](https://www.blendb2b.com/blog/the-10-best-b2b-homepage-examples)
- [Vercel — Design Engineering at Vercel](https://vercel.com/blog/design-engineering-at-vercel)
