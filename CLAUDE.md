# TriaCore AI — Project Context

## Bedrijf

**TriaCore AI** is een Belgisch AI- en softwarebedrijf gevestigd in Hasselt (Corda Incubator).
Tagline: *"De AI-partner waar groeiende bedrijven op bouwen."*

Ze bouwen **maatwerksoftware rond bedrijfsprocessen** en integreren AI waar het echt rendement oplevert — niet aan de oppervlakte (chatbots), maar diep in processen (automatisering, agents, platforms).

Missie: het onbenutte AI-potentieel van kmo's omzetten in iets concreets en meetbaars.

Contactinfo: info@triacore.be | Kempische Steenweg 303, 3500 Hasselt

---

## Team

| Naam | Rol | Contact |
|---|---|---|
| **Rian Mathijs** | Sales & Client Relations | rian.mathijs@triacore.be / 0499 87 46 62 |
| **Lucas Curto** | Operations & Technical Architecture | lucas.curto@triacore.be / 0468 27 50 82 |

- **Rian** = eerste aanspreekpunt, bewaakt samenwerking van begin tot eind, vertaalt bedrijfsuitdagingen naar trajecten.
- **Lucas** = technische uitwerking, ontwerpt schaalbare architecturen, vertaalt processen naar AI-oplossingen en automatisaties.

---

## Diensten (4 bouwblokken)

1. **AI-integratie** — AI slim ingebouwd in processen die tijd kosten of foutgevoelig zijn.
2. **Mobiele app** — Field-ready tools voor chauffeurs, technici, vertegenwoordigers.
3. **Webplatform** — Centrale beheeromgeving voor operationals en managers (realtime, browser-based).
4. **Automatisering** — Repetitieve stappen volledig autonoom, zonder manuele tussenkomst.

Custom solutions = combinatie van bovenstaande, 100% gebouwd rond klantprocessen.

---

## Aanpak

```
Uw probleem → Custom oplossing → Uw bedrijf werkt efficiënter
```

- Eerlijke analyse: soms een bestaande tool, soms maatwerk.
- Iteratief bouwen: 6–12 weken per fase.
- Schaalbaar by design — groeit mee met het bedrijf.
- Beveiliging via Aikido Security platform.

---

## Pijnpunten die ze aanpakken

1. AI rendeert niet (oppervlakkig gebruik, processen ongewijzigd)
2. Geen structuur in AI-gebruik (ieder doet zijn eigen ding)
3. Systemen praten niet met elkaar (handmatig wisselen)
4. Geen tool past op het probleem (te generiek)
5. Angst voor foute investering (eerder mislukte software)

---

## Branding

### Kleuren
| Token | Hex | Gebruik |
|---|---|---|
| `accent` | `#628f69` | Sage green — primaire accentkleur |
| `background` | `#f8fafc` | Lichte secties |
| `foreground` | `#0f172a` | Tekst / donkere elementen |
| `dark-section` | `#020617` | Donkere secties |

### Typografie
| Role | Font | Gebruik |
|---|---|---|
| **Body / default** | DM Sans | Alle lopende tekst, labels |
| **Headlines / display** | Playfair Display | Grote titels (serif, italic accent) |
| **Brand accent** | Syne (700/800) | Solevo-branding, logo-stijl |

### Taal
Volledig tweetalig: **NL** (primair) en **EN** via `LanguageContext`.

---

## Pagina's & Routes

| Route | Inhoud |
|---|---|
| `/` | Homepage — hero, verhaal (Solevo case), uitdagingen, aanpak, bouwblokken, team, FAQ |
| `/team` | Uitgebreide teampagina |
| `/contact` | Contactformulier (Netlify Forms) met topic-dropdown |
| `/custom-oplossingen` | Uitleg custom software aanpak |
| `/privacybeleid` | Privacy policy |
| `/cookiebeleid` | Cookie policy |
| `/resources` | Gratis resources: prompting, modellen, projectinstructies, ideeën |

### Homepage anchors
`#verhaal` · `#uitdagingen` · `#aanpak` · `#team` · `#faq`

---

## Partners & Referenties

- **A&M Group** (anmgroup.be) — klant/partner
- **Croes NV** (croesnv.be) — klant/partner
- AI-tools ingezet: ChatGPT, Claude, Gemini

Case study op homepage: **Solevo** — digitaal platform voor grondverzet- en sloopbedrijven (transport-notabeheer).

---

## Tech Stack

React 19 · React Router 7 · Vite 7 · Tailwind CSS 4 · GSAP 3 · Framer Motion · Lucide React
Hosting/forms: Netlify | Animaties: scroll-triggered GSAP + Framer Motion
E-mail/nieuwsbrief: Resend (via Netlify Function)

---

## Nieuwsbrief (Resend)

Inschrijving (footer + Resources-pagina) gaat via `netlify/functions/newsletter-subscribe.js`
naar een Resend Audience + automatische welkomstmail. Een nieuwe resource aankondigen =
`npm run announce -- <slug>`, dat enkel een **concept** in Resend maakt; verzenden gebeurt altijd
handmatig door de gebruiker na review van de HTML. Mail-opmaak: `lib/email-template.js`.
Preview: `npm run preview-emails`. Volledige uitleg: privé `Resources/_nieuwsbrief.md`.

---

## Werkafspraken met Claude

- **Verificatie door gebruiker** — de gebruiker verifieert resultaten altijd zelf in de browser. Claude opent geen browser en rapporteert geen visueel resultaat tenzij de gebruiker een screenshot aanlevert.
- **Geen Git push zonder expliciete bevestiging** — nooit pushen naar GitHub of een remote, tenzij de gebruiker dit expliciet bevestigt.
- **Consistente styling** — nieuwe pagina's en componenten volgen altijd de bestaande stijl: kleuren (#628f69 accent, #f8fafc / #020617 backgrounds), fonts (DM Sans, Playfair Display), spacing en componentpatronen van de rest van de site.
- **Geen koppelteken of streepje in labels/titels** — gebruik geen "-" in zichtbare UI-tekst zoals labels, titels of ondertitels. Schrijf woorden voluit of gebruik een spatie.
