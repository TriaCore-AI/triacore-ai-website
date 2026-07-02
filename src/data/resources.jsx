// =============================================================
// RESOURCES DATA
// =============================================================
// Eén bestand = alle resources. Een nieuwe resource toevoegen?
// Kopieer een bestaand object hieronder en vul het in.
//
// Verplicht per resource:
//   slug        — uniek, in de URL (/resources/<slug>). Geen spaties.
//   category    — een key uit CATEGORIES hieronder (tag op de kaart).
//   date        — 'YYYY-MM-DD'. Bepaalt de datum + sorteervolgorde.
//   title       — { nl, en }
//   description — { nl, en } — korte tekst op de kaart (max ~2 zinnen).
//   blocks      — inhoud van de detailpagina (zie blok-types onderaan).
//
// Optioneel:
//   thumbnail   — pad naar een afbeelding in /public (bv. '/resources/x.jpg').
//                 Geen thumbnail? Dan toont de kaart automatisch een nette
//                 merk-tegel met de categorie. Alle kaarten houden dezelfde
//                 hoogte en verhouding, ongeacht of er een afbeelding is.
//
// BLOK-TYPES voor de detailpagina (blocks: [ ... ]):
//   { type: 'heading',    nl, en }                                  — tussentitel
//   { type: 'paragraph',  nl, en }                                  — lopende tekst
//   { type: 'list',       nl: [..], en: [..] }                      — opsomming
//   { type: 'prompt',     label?: {nl,en}, nl, en }                 — kopieerbaar blok (zwarte box)
//   { type: 'callout',    nl, en }                                  — accent-kader (tip)
//   { type: 'pdf',        url, label?: {nl,en} }                    — download-knop
//   { type: 'image',      src, alt?: {nl,en}, caption?: {nl,en} }   — afbeelding (rounded, full width)
//   { type: 'quote',      nl, en, source?: {nl,en} }                — pull-quote (serif, accent-rand)
//   { type: 'definition', term:{nl,en}, kind?:{nl,en}, nl, en }     — definitie-kaart (woordenboekstijl)
//   { type: 'cards',      items: [{ label?:{nl,en}, nl, en }] }     — rij van kaarten (vakken)
//   { type: 'steps',      items: [{ title:{nl,en}, nl, en }] }      — genummerde stappen
//   { type: 'table',      nl:{head:[],rows:[[]]}, en:{head:[],rows:[[]]} } — tabel
//   { type: 'divider' }                                            — dunne scheidingslijn (einde sectie)
//
// Optioneel op de resource zelf:
//   headerCta — { target, nl, en } — CTA-knop in de header die naar een anker
//               scrolt. Geef het doelblok (bv. een 'prompt') een 'anchor' id
//               dat overeenkomt met target.
//
// SECTIE-CONVENTIE: elke sectie start met een 'heading' en eindigt met een
// 'divider'. De laatste sectie heeft geen divider (de footer sluit af).
// =============================================================

// Algemene categorieën — gebruikt als tag op de post (nog niet navigeerbaar).
export const CATEGORIES = {
    prompting: { nl: 'Prompting', en: 'Prompting' },
    modellen: { nl: 'Modellen', en: 'Models' },
    projectinstructies: { nl: 'Projectinstructies', en: 'Project instructions' },
    ideeen: { nl: 'Ideeën', en: 'Ideas' },
};

export const resources = [
    {
        slug: 'waarom-ai-te-vaak-ja-zegt',
        category: 'prompting',
        date: '2026-06-29',
        title: {
            nl: 'Waarom AI te vaak ja zegt, en wat u eraan kan doen',
            en: 'Why AI says yes too often, and what to do about it',
        },
        description: {
            nl: 'AI is getraind om in te stemmen, niet om eerlijk te zijn. Dat noemen we sycofantie, en het raakt iedereen die met AI werkt. Ontdek waarom, en hoe u het met één vaste projectinstructie voorgoed tegengaat.',
            en: 'AI is trained to agree, not to be honest. We call it sycophancy, and it affects everyone who works with AI. Discover why, and how one fixed project instruction puts a stop to it for good.',
        },
        thumbnail: '/resources/waarom-ai-te-vaak-ja-zegt.webp',
        headerCta: {
            target: 'projectinstructie',
            nl: 'Direct naar de projectinstructie',
            en: 'Jump to the project instruction',
        },
        blocks: [
            {
                type: 'heading',
                nl: 'Het probleem',
                en: 'The problem',
            },
            {
                type: 'paragraph',
                nl: 'Vraag een AI om uw plan te beoordelen, en de kans is groot dat het u gelijk geeft. Twijfel hardop, en het past zijn antwoord aan. Spreek het tegen, en het verontschuldigt zich. Dat voelt prettig, maar het is een probleem.',
                en: 'Ask an AI to assess your plan, and chances are it will agree with you. Voice some doubt, and it adjusts its answer. Push back, and it apologizes. That feels good, but it is a problem.',
            },
            {
                type: 'quote',
                nl: 'Het model vertelt u niet wat klopt. Het vertelt u wat u graag hoort.',
                en: 'The model is not telling you what is correct. It is telling you what you want to hear.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Getraind om ja te zeggen',
                en: 'Trained to say yes',
            },
            {
                type: 'definition',
                term: { nl: 'Sycofantie', en: 'Sycophancy' },
                kind: { nl: 'zelfstandig naamwoord', en: 'noun' },
                nl: 'Het gedrag waarbij iemand, of iets, automatisch instemming toont om de ander tevreden te houden, ongeacht de waarheid. AI-modellen zijn getraind op menselijke goedkeuring, niet op eerlijkheid. Mensen beoordelen antwoorden die hen gelijk geven nu eenmaal als beter, en zo leert het model dat instemmen loont.',
                en: 'The behavior where someone, or something, automatically shows agreement to keep the other person happy, regardless of the truth. AI models are trained on human approval, not on honesty. People rate answers that confirm them as better, and so the model learns that agreeing pays off.',
            },
            {
                type: 'paragraph',
                nl: 'Het is geen randgeval. De cijfers zijn duidelijk.',
                en: 'This is not an edge case. The numbers are clear.',
            },
            {
                type: 'table',
                nl: {
                    head: ['Onderzoek', 'Bevinding'],
                    rows: [
                        ['Stanford, SycEval (2025)', 'Sycofant gedrag in 58% van de geteste gevallen, bij ChatGPT, Claude en Gemini.'],
                        ['OpenAI (april 2025)', 'Een ChatGPT update teruggedraaid omdat het model te vleierig werd en slechte beslissingen bevestigde.'],
                        ['MIT (2026)', 'Hoe meer een model zich aan u personaliseert, hoe sterker de sycofantie.'],
                    ],
                },
                en: {
                    head: ['Research', 'Finding'],
                    rows: [
                        ['Stanford, SycEval (2025)', 'Sycophantic behavior in 58% of tested cases, across ChatGPT, Claude and Gemini.'],
                        ['OpenAI (April 2025)', 'Rolled back a ChatGPT update because the model became too flattering and confirmed poor decisions.'],
                        ['MIT (2026)', 'The more a model personalizes to you, the stronger the sycophancy.'],
                    ],
                },
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Het raakt iedereen',
                en: 'It affects everyone',
            },
            {
                type: 'paragraph',
                nl: 'Het venijn zit in wie erop vertrouwt zonder het te merken.',
                en: 'The danger lies with those who rely on it without noticing.',
            },
            {
                type: 'cards',
                items: [
                    {
                        label: { nl: 'Werknemer', en: 'Employee' },
                        nl: 'Leunt op AI voor een rapport. De AI zegt dat het goed is. De baas niet.',
                        en: 'Leans on AI for a report. The AI says it is good. The boss does not.',
                    },
                    {
                        label: { nl: 'Zaakvoerder', en: 'Business owner' },
                        nl: 'Legt een strategie voor. De AI vindt het sterk. De markt niet.',
                        en: 'Runs a strategy by it. The AI finds it strong. The market does not.',
                    },
                    {
                        label: { nl: 'Student', en: 'Student' },
                        nl: 'Schrijft een argument. De AI bevestigt het. De professor niet.',
                        en: 'Writes an argument. The AI confirms it. The professor does not.',
                    },
                ],
            },
            {
                type: 'paragraph',
                nl: 'In elk geval krijgt iemand bevestiging in plaats van een eerlijk tegengewicht. En precies dat tegengewicht was de reden om de AI te raadplegen.',
                en: 'In each case someone gets confirmation instead of an honest counterweight. And that counterweight was the very reason to consult the AI.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Eén oplossing: een vaste projectinstructie',
                en: 'One fix: a fixed project instruction',
            },
            {
                type: 'paragraph',
                nl: 'U kan dit gedrag bijsturen. Niet met een trucje per gesprek, maar met een vaste instructie die u één keer instelt en die voor elk gesprek geldt. In ChatGPT, Claude en Gemini kan u zulke instructies opslaan, vaak onder "projecten" of "custom instructions".',
                en: 'You can steer this behavior. Not with a trick per conversation, but with a fixed instruction you set once and that applies to every chat. In ChatGPT, Claude and Gemini you can save such instructions, often under "projects" or "custom instructions".',
            },
            {
                type: 'paragraph',
                nl: 'Een goede instructie tegen sycofantie bestaat uit vijf delen.',
                en: 'A good instruction against sycophancy has five parts.',
            },
            {
                type: 'steps',
                items: [
                    {
                        title: { nl: 'Rol', en: 'Role' },
                        nl: 'Geef de AI de rol van ervaren expert in uw vakgebied, als kritische sparringspartner in plaats van ja knikker.',
                        en: 'Give the AI the role of an experienced expert in your field, as a critical sparring partner instead of a yes man.',
                    },
                    {
                        title: { nl: 'Context', en: 'Context' },
                        nl: 'Vertel wie u bent, waar u aan werkt en wat u wil bereiken, zodat het oordeel aansluit op uw situatie.',
                        en: 'Say who you are, what you are working on and what you want to achieve, so the assessment fits your situation.',
                    },
                    {
                        title: { nl: 'Gedrag', en: 'Behavior' },
                        nl: 'Leg vast dat de AI op feiten en uw doelen oordeelt, alles onderbouwt en zwakke punten eerlijk maar constructief benoemt.',
                        en: 'Set that the AI judges on facts and your goals, backs everything up and names weak points honestly but constructively.',
                    },
                    {
                        title: { nl: 'Guardrails', en: 'Guardrails' },
                        nl: 'Bepaal wat de AI niet zelf mag doen zonder uw toestemming, zoals iets versturen of aanpassen.',
                        en: 'Define what the AI may not do on its own without your permission, such as sending or changing something.',
                    },
                    {
                        title: { nl: 'Output', en: 'Output' },
                        nl: 'Zeg in welke vorm u het antwoord wil, bijvoorbeeld kort, een opsomming of een tabel.',
                        en: 'Say in which form you want the answer, for example short, a list or a table.',
                    },
                ],
            },
            {
                type: 'paragraph',
                nl: 'Kopieer onderstaande instructie en pas de stukken tussen haken aan uw situatie aan.',
                en: 'Copy the instruction below and adapt the parts between brackets to your situation.',
            },
            {
                type: 'prompt',
                anchor: 'projectinstructie',
                label: { nl: 'Vaste projectinstructies voor betere resultaten', en: 'Fixed project instructions for better results' },
                nl: `## 1. Rol
Je bent een ervaren [(bv. financieel adviseur, marketeer, jurist)] met diepgaande kennis van mijn vakgebied. Je treedt op als mijn kritische sparringspartner, geen ja knikker. Je doel is mij scherper laten denken en mijn werk beter maken.

## 2. Context
[Wie ben je en wat is je achtergrond? Waar werk je aan en wat wil je hiermee bereiken? Voor wie is het bedoeld? Hoe meer context je geeft, hoe scherper het oordeel.]

## 3. Gedrag
- **Oordeel op feiten en doelen.** Elk oordeel wordt onderbouwd met logica, feiten (research waar nodig) en de doelen van dit project, nooit met wat prettig klinkt of wat ik lijk te willen horen.
- **Goede ideeën worden erkend als goed**, met onderbouwing waarom, plus: hoe wordt het beter en welke zwakke punten blijven?
- **Slechte ideeën worden eerlijk maar constructief benoemd:** waarom het zwak is, wat een betere richting is, en wat er wél bruikbaar aan is.
- **Het doel is heilig, de weg niet.** Je stelt andere routes voor als die het doel beter dienen.
- **Zelfcontrole vóór elk antwoord:** "Baseer ik dit op feiten, logica en de doelen, of praat ik mee?" Houdt het geen stand, herformuleer het.
- **Onderbouwing is verplicht.** Geen oordeel zonder waarom.
- **Research waar nodig** bij beweringen over markt, cijfers, technologie of regelgeving.

## 4. Guardrails
- [Genereer geen document of bestand zonder mijn toestemming.]
- [Maak geen aanpassingen aan mijn ontwerpen of bestanden, bv. een Canva design, zonder mijn toestemming.]
- [Verstuur of deel niets extern, zoals een mail of bericht, zonder mijn toestemming.]
- ...

## 5. Output
[In welke vorm wil je het antwoord? Bv. kort en bondig, een opsomming, een tabel, stap voor stap, of eerst je oordeel en dan de onderbouwing.]`,
                en: `## 1. Role
You are an experienced [(e.g. financial advisor, marketer, lawyer)] with deep knowledge of my field. You act as my critical sparring partner, not a yes man. Your goal is to make me think more sharply and improve my work.

## 2. Context
[Who are you and what is your background? What are you working on and what do you want to achieve with it? Who is it for? The more context you give, the sharper the assessment.]

## 3. Behavior
- **Judge on facts and goals.** Every judgment is backed by logic, facts (research where needed) and the goals of this project, never by what sounds pleasant or what I seem to want to hear.
- **Good ideas are recognized as good**, with reasoning why, plus: how does it get better and which weak points remain?
- **Bad ideas are named honestly but constructively:** why it is weak, what a better direction is, and what is still usable about it.
- **The goal is sacred, the path is not.** You propose other routes when they serve the goal better.
- **Self check before every answer:** "Am I basing this on facts, logic and the goals, or am I just going along?" If it does not hold up, rephrase it.
- **Reasoning is mandatory.** No judgment without a why.
- **Research where needed** for claims about market, numbers, technology or regulation.

## 4. Guardrails
- [Generate no document or file without my permission.]
- [Make no changes to my designs or files, e.g. a Canva design, without my permission.]
- [Send or share nothing externally, such as an email or message, without my permission.]
- ...

## 5. Output
[In which form do you want the answer? E.g. short and concise, a list, a table, step by step, or your judgment first and then the reasoning.]`,
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Waar plaatst u dit?',
                en: 'Where do you set this?',
            },
            {
                type: 'paragraph',
                nl: 'Elke tool bewaart zulke instructies op een vaste plek, zodat ze voor elk nieuw gesprek meteen gelden. Hieronder ziet u stap voor stap waar u ze instelt, eerst in ChatGPT, dan in Claude.',
                en: 'Every tool stores such instructions in a fixed place, so they apply to every new conversation right away. Below you see step by step where to set them, first in ChatGPT, then in Claude.',
            },
            {
                type: 'heading',
                nl: 'In ChatGPT',
                en: 'In ChatGPT',
            },
            {
                type: 'image',
                src: '/resources/instructie-chatgpt-1.png',
                alt: { nl: 'ChatGPT, stap 1', en: 'ChatGPT, step 1' },
                caption: { nl: 'Stap 1', en: 'Step 1' },
            },
            {
                type: 'image',
                src: '/resources/instructie-chatgpt-2.png',
                alt: { nl: 'ChatGPT, stap 2', en: 'ChatGPT, step 2' },
                caption: { nl: 'Stap 2', en: 'Step 2' },
            },
            {
                type: 'image',
                src: '/resources/instructie-chatgpt-3.png',
                alt: { nl: 'ChatGPT, stap 3', en: 'ChatGPT, step 3' },
                caption: { nl: 'Stap 3', en: 'Step 3' },
            },
            {
                type: 'heading',
                nl: 'In Claude',
                en: 'In Claude',
            },
            {
                type: 'image',
                src: '/resources/instructie-claude-1.png',
                alt: { nl: 'Claude, stap 1', en: 'Claude, step 1' },
                caption: { nl: 'Stap 1', en: 'Step 1' },
            },
            {
                type: 'image',
                src: '/resources/instructie-claude-2.png',
                alt: { nl: 'Claude, stap 2', en: 'Claude, step 2' },
                caption: { nl: 'Stap 2', en: 'Step 2' },
            },
        ],
    },
];

// --- HELPERS ---

export function getResourceBySlug(slug) {
    return resources.find((r) => r.slug === slug) || null;
}

// Nieuwste eerst.
export function getSortedResources() {
    return [...resources].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function formatDate(dateStr, language) {
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString(language === 'nl' ? 'nl-BE' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
