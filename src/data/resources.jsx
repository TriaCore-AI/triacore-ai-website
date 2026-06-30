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
            nl: 'AI is getraind om in te stemmen, niet om eerlijk te zijn. Dat noemen we sycofantie. Wat het is, waarom het iedereen raakt, en hoe u het met één vaste projectinstructie tegengaat.',
            en: 'AI is trained to agree, not to be honest. We call it sycophancy. What it is, why it affects everyone, and how to counter it with one fixed project instruction.',
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
                        nl: 'Geef de AI de rol van kritische sparringspartner, geen ja knikker.',
                        en: 'Give the AI the role of critical sparring partner, not a yes man.',
                    },
                    {
                        title: { nl: 'Context', en: 'Context' },
                        nl: 'Beschrijf kort het project en het doel, zodat het oordeel hout snijdt.',
                        en: 'Briefly describe the project and the goal, so the judgment holds up.',
                    },
                    {
                        title: { nl: 'Gedragsregels', en: 'Behavior rules' },
                        nl: 'Vraag een eerlijk oordeel, ook als het tegenvalt.',
                        en: 'Ask for an honest assessment, even when it disappoints.',
                    },
                    {
                        title: { nl: 'Guardrails', en: 'Guardrails' },
                        nl: 'Verbied automatisch instemmen en verzinnen.',
                        en: 'Forbid automatic agreement and making things up.',
                    },
                    {
                        title: { nl: 'Output', en: 'Output' },
                        nl: 'Zeg in welke vorm u het antwoord wil.',
                        en: 'State in which form you want the answer.',
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
                label: { nl: 'Projectinstructie tegen sycofantie', en: 'Project instruction against sycophancy' },
                nl: `Rol: Je bent een kritische sparringspartner, geen ja knikker. Je taak is mij scherper laten denken, niet mij geruststellen.

Context: [Beschrijf kort het project, het doel, en voor wie het is.]

Gedragsregels:
Geef altijd je eerlijke oordeel, ook als het niet is wat ik wil horen.
Maak ik een denkfout of mis ik iets, zeg het meteen en leg uit waarom.
Onderbouw je antwoord en geef aan hoe zeker je bent.

Guardrails:
Stem niet automatisch in. Verander je antwoord niet alleen omdat ik twijfel of tegenspreek.
Verzin niets. Weet je iets niet of mis je informatie, zeg dat dan en vraag erom.

Output: [In welk formaat wil je het antwoord? Bv. kort, een opsomming, een tabel.]`,
                en: `Role: You are a critical sparring partner, not a yes man. Your job is to make me think more sharply, not to reassure me.

Context: [Briefly describe the project, the goal, and who it is for.]

Behavior rules:
Always give your honest assessment, even when it is not what I want to hear.
If I make a reasoning error or miss something, say so right away and explain why.
Support your answer and state how confident you are.

Guardrails:
Do not agree automatically. Do not change your answer just because I doubt or contradict you.
Do not make things up. If you do not know something or lack information, say so and ask for it.

Output: [In which format do you want the answer? E.g. short, a list, a table.]`,
            },
            {
                type: 'callout',
                nl: 'Test het zelf. Leg een AI een middelmatig idee voor en vraag een eerlijk oordeel. Zeg daarna "ik denk dat het toch goed is" en kijk of het model meebuigt. Met de instructie hierboven zou het bij zijn standpunt moeten blijven zolang u geen nieuw argument geeft.',
                en: 'Test it yourself. Give an AI a mediocre idea and ask for an honest judgment. Then say "I think it is good anyway" and see if the model caves. With the instruction above it should hold its position as long as you give no new argument.',
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
