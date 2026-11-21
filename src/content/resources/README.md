# Kennisbank (beheerd vanuit de ERP)

Elk artikel van de kennisbank (`/kennisbank/<slug>`, in het Engels "Resources") is één JSON-bestand in deze
map: `<slug>.json`. De afbeeldingen staan in `public/resources/<slug>/`. De mappen heten nog `resources`:
dat is het contract met de ERP, enkel het adres op de site is `/kennisbank`. **Niet met de hand aanpassen:** de ERP (Marketing → Resources) schrijft,
wijzigt en verwijdert deze bestanden bij Publiceren, Bijwerken en Offline halen. Een wijziging hier
wordt bij de volgende publicatie uit de ERP overschreven.

## Formaat

```json
{
  "slug": "praat-tegen-uw-ai",
  "category": "prompting",
  "date": "2026-11-21",
  "readingMinutes": 6,
  "thumbnail": "/resources/praat-tegen-uw-ai/thumbnail-1a2b3c.webp",
  "nl": { "title": "…", "description": "…", "blocks": [] },
  "en": { "title": "…", "description": "…", "blocks": [] }
}
```

- `category`: een sleutel uit `CATEGORIES` in `src/data/resources.js`.
- `thumbnail`: mag `null` zijn; de kaart toont dan een rustige tegel met de categorie.
- In tekst mag **vet**, *cursief*, `code` en [een link](https://…).

## Blokken

| type        | velden                                     |
| ----------- | ------------------------------------------ |
| `heading`   | `level` (2 of 3), `text`                   |
| `paragraph` | `text`                                     |
| `list`      | `ordered` (true/false), `items` (tekst)    |
| `callout`   | `text` (een tip)                           |
| `quote`     | `text`                                     |
| `prompt`    | `label` (mag leeg), `text` (kopieerbaar)   |
| `image`     | `src`, `alt`, `caption` (mag leeg)         |
| `table`     | `head` (tekst), `rows` (rijen van tekst)   |
| `divider`   | geen                                       |

De ERP toont een voorbeeld via `/kennisbank/voorbeeld` (`src/pages/ResourcePreview.jsx`), met
dezelfde componenten als de echte pagina.
