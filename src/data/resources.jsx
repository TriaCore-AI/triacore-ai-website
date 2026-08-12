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
//                 url mag één pad zijn (zelfde bestand in beide talen), of
//                 { nl: '...', en: '...' } voor een taalspecifiek bestand
//   { type: 'image',      src, alt?: {nl,en}, caption?: {nl,en} }   — afbeelding (rounded, full width)
//                 src mag één pad zijn (zelfde afbeelding in beide talen), of
//                 { nl: '...', en: '...' } voor een taalspecifieke afbeelding
//                 (bv. een grafiek met NL/EN tekst erin).
//   { type: 'quote',      nl, en, source?: {nl,en} }                — pull-quote (serif, accent-rand)
//   { type: 'definition', term:{nl,en}, kind?:{nl,en}, nl, en }     — definitie-kaart (woordenboekstijl)
//   { type: 'cards',      items: [{ label?:{nl,en}, nl, en }] }     — rij van kaarten (vakken)
//   { type: 'steps',      items: [{ title:{nl,en}, nl, en }] }      — genummerde stappen
//   { type: 'table',      nl:{head:[],rows:[[]]}, en:{head:[],rows:[[]]} } — tabel
//   { type: 'links',      items: [{ label:{nl,en}, url }] }        — klikbare bronnenlijst (opent in nieuw tabblad)
//   { type: 'divider' }                                            — dunne scheidingslijn (einde sectie)
//
// Optioneel op de resource zelf:
//   headerCta — { target, nl, en } — CTA-knop in de header die naar een anker
//               scrolt. Geef het doelblok (een 'prompt' of 'heading') een
//               'anchor' id dat overeenkomt met target.
//
// SECTIE-CONVENTIE: elke sectie start met een 'heading' en eindigt met een
// 'divider'. De laatste sectie heeft geen divider (de footer sluit af).
// =============================================================

// Algemene categorieën — gebruikt als tag op de post (nog niet navigeerbaar).
export const CATEGORIES = {
    prompting: { nl: 'Prompting', en: 'Prompting' },
    tools: { nl: 'Tools en modellen', en: 'Tools and models' },
    'ai-nieuws': { nl: 'AI nieuws', en: 'AI news' },
    automatisering: { nl: 'Automatisering', en: 'Automation' },
    // Onderstaande zijn nog niet in gebruik door een post, maar blijven staan
    // voor bestaand of toekomstig materiaal.
    modellen: { nl: 'Modellen', en: 'Models' },
    projectinstructies: { nl: 'Projectinstructies', en: 'Project instructions' },
    ideeen: { nl: 'Ideeën', en: 'Ideas' },
};

export const resources = [
    {
        slug: 'helft-vlaanderen-gebruikt-ai',
        category: 'ai-nieuws',
        date: '2026-07-17',
        title: {
            nl: 'Sneller dan de smartphone: zo snel raakte AI ingeburgerd',
            en: 'Faster than the smartphone: how quickly AI caught on',
        },
        description: {
            nl: 'AI is in twee jaar tijd bij de helft van de Vlamingen beland, sneller dan de smartphone of Netflix. Op de meeste werkvloeren wordt het al gebruikt. De vraag is niet meer of AI binnenkomt, maar of er afspraken over bestaan.',
            en: 'In just two years AI has reached half of Flanders, faster than the smartphone or Netflix. On most work floors it is already in use. The question is no longer whether AI arrives, but whether anyone has agreed how.',
        },
        thumbnail: '/resources/helft-vlaanderen-gebruikt-ai.webp',
        blocks: [
            {
                type: 'heading',
                nl: 'In twee jaar',
                en: 'In two years',
            },
            {
                type: 'paragraph',
                nl: 'Een nieuwe technologie heeft meestal jaren nodig om gewoon te worden. De smartphone deed er in Vlaanderen acht over, Instagram tien. Generatieve AI deed het in twee.',
                en: 'A new technology usually needs years to become ordinary. In Flanders the smartphone took eight, Instagram ten. Generative AI did it in two.',
            },
            {
                type: 'paragraph',
                nl: 'Die cijfers komen uit een vaste jaarlijkse meting. Ze gaan over de mensen waarmee u elke dag werkt: collega\'s, klanten, leveranciers.',
                en: 'Those numbers come from a fixed yearly survey. They are about the people you work with every day: colleagues, customers, suppliers.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Wat de meting zegt',
                en: 'What the survey says',
            },
            {
                type: 'paragraph',
                nl: 'De imec.digimeter, een jaarlijkse bevraging van hoe Vlaanderen met technologie omgaat, publiceerde in maart 2026 zijn achttiende editie. De sprong in AI-gebruik was de opvallendste bevinding in jaren.',
                en: 'The imec.digimeter, an annual survey of how Flanders uses technology, published its eighteenth edition in March 2026. The jump in AI use was its most striking finding in years.',
            },
            {
                type: 'list',
                nl: [
                    '43 procent van de Vlamingen gebruikt nu regelmatig AI, minstens één keer per maand. In 2023 was dat 18 procent, in 2024 al 28.',
                    '11 procent gebruikt het dagelijks, bijna een verdrievoudiging op één jaar.',
                    'Twee op de drie Vlamingen hebben ooit een tool als ChatGPT of Gemini geprobeerd.',
                    'Bij studenten loopt het actieve gebruik op tot 81 procent.',
                ],
                en: [
                    '43 percent of Flemish people now use AI regularly, at least once a month. In 2023 that was 18 percent, in 2024 already 28.',
                    '11 percent use it daily, almost a threefold rise in one year.',
                    'Two in three have at some point tried a tool like ChatGPT or Gemini.',
                    'Among students, active use runs up to 81 percent.',
                ],
            },
            {
                type: 'image',
                src: {
                    nl: '/resources/helft-vlaanderen-gebruikt-ai-grafiek-nl.webp',
                    en: '/resources/helft-vlaanderen-gebruikt-ai-grafiek-en.webp',
                },
                alt: {
                    nl: 'Grafiek: groei van regelmatig AI-gebruik bij Vlamingen, 2023 tot 2025',
                    en: 'Chart: growth of regular AI use among Flemish people, 2023 to 2025',
                },
            },
            {
                type: 'quote',
                nl: 'Geen enkele technologie in deze meting bereikte de helft van Vlaanderen ooit zo snel.',
                en: 'No technology in this survey ever reached half of Flanders this quickly.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Waarom dit een werkvloer aangaat',
                en: 'Why this concerns a work floor',
            },
            {
                type: 'paragraph',
                nl: 'Het makkelijke misverstand is dat AI iets is wat een bedrijf op een dag beslist in te voeren. Deze cijfers zeggen iets anders. Op de meeste werkvloeren is AI allang binnen, via de mensen die er werken.',
                en: 'The easy misunderstanding is that AI is something a company decides to adopt one day. These numbers say otherwise. On most work floors AI arrived long ago, through the people working there.',
            },
            {
                type: 'cards',
                items: [
                    {
                        label: { nl: 'Klantenservice', en: 'Customer service' },
                        nl: 'Een klantmail wordt in ChatGPT geplakt om een antwoord te laten opstellen.',
                        en: 'A customer email gets pasted into ChatGPT to draft a reply.',
                    },
                    {
                        label: { nl: 'Boekhouding', en: 'Accounting' },
                        nl: 'Een clausule wordt door een AI laten uitleggen voor ze verwerkt wordt.',
                        en: 'A clause gets explained by an AI before it gets processed.',
                    },
                    {
                        label: { nl: 'Verkoop', en: 'Sales' },
                        nl: 'Een offerte wordt vergeleken met wat een chatbot aanraadt.',
                        en: 'A quote gets compared with what a chatbot suggests.',
                    },
                ],
            },
            {
                type: 'paragraph',
                nl: 'Dat gebeurt vandaag, of er nu beleid over bestaat of niet.',
                en: 'That happens today, whether a policy exists for it or not.',
            },
            {
                type: 'quote',
                nl: 'Verloopt dat gebruik gepland, of gewoon in het wilde weg?',
                en: 'Does that use follow a plan, or does it happen at random?',
            },
            {
                type: 'paragraph',
                nl: 'Daar zit meteen een risico. Dezelfde meting toont dat 45 procent van de gebruikers hun werk sneller afrondt en 41 procent kwaliteitswinst ervaart, maar ook dat 37 procent zegt zelf minder na te denken sinds ze AI gebruiken. Snelheid zonder afspraken glijdt makkelijk af naar werk dat niemand nog echt nakijkt.',
                en: 'That is where a risk sits. The same survey shows 45 percent of users finish their work faster and 41 percent notice a gain in quality, but also that 37 percent say they think less themselves since they started using AI. Speed without agreements slides easily into work that nobody really checks anymore.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Wat u er concreet mee doet',
                en: 'What to actually do with this',
            },
            {
                type: 'paragraph',
                nl: 'Er is geen AI-strategie nodig om vat te krijgen op wat er al gebeurt. Drie vragen volstaan om te zien waar u staat, of u nu meebeslist over de tools of ze gewoon gebruikt.',
                en: 'No AI strategy is needed to get a grip on what is already happening. Three questions are enough to see where you stand, whether you help decide on the tools or simply use them.',
            },
            {
                type: 'list',
                nl: [
                    'Wordt er openlijk gepraat over waarvoor AI gebruikt wordt? Zolang niemand het benoemt, gebeurt het ongezien en leert niemand van de ander.',
                    'Is ergens afgesproken wat wel en niet in een AI-tool mag? Klantgegevens in een gratis chatbot plakken is een concreet lek, en meestal weet niemand dat het gebeurt.',
                    'Wie kijkt na? Als AI een eerste versie maakt, moet iemand met kennis van zaken de laatste blijven. Ook als dat uzelf is.',
                ],
                en: [
                    'Is there open conversation about what AI gets used for? As long as nobody names it, it happens unseen and nobody learns from anyone else.',
                    'Has anyone agreed what may and may not go into an AI tool? Pasting customer data into a free chatbot is a concrete leak, and usually nobody knows it is happening.',
                    'Who checks? If AI writes a first version, someone with real knowledge has to remain the last. Including when that someone is you.',
                ],
            },
            {
                type: 'paragraph',
                nl: 'Het gaat om zicht krijgen op wat er al gebeurt, niet om AI te verbieden of zomaar toe te laten.',
                en: 'This is about getting a view of what is already happening, not about forbidding AI or simply allowing it.',
            },
            {
                type: 'callout',
                nl: 'Vraag deze week aan drie collega\'s waarvoor zij AI gebruiken. Niet om te controleren, maar om te zien wat er leeft. De antwoorden verrassen bijna altijd, en ze zijn het beste startpunt voor een afspraak die klopt met de praktijk.',
                en: 'This week, ask three colleagues what they use AI for. Not to check up on them, but to see what is alive. The answers almost always surprise, and they are the best starting point for an agreement that matches practice.',
            },
            {
                type: 'paragraph',
                nl: 'Een kanttekening bij de cijfers: de imec.digimeter meet Vlamingen als burgers, niet bedrijven. Dat 43 procent regelmatig AI gebruikt, zegt dus niet dat 43 procent van de bedrijven het structureel inzet. Het zegt iets dat minstens even belangrijk is: de mensen op en rond de werkvloer zijn er al mee vertrouwd. De vraag is wat daarmee gebeurt.',
                en: 'One note on the figures: the imec.digimeter measures Flemish people as citizens, not businesses. That 43 percent use AI regularly does not mean 43 percent of businesses deploy it structurally. It says something at least as important: the people on and around the work floor are already familiar with it. The question is what happens with that.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Bronnen',
                en: 'Sources',
            },
            {
                type: 'links',
                items: [
                    {
                        label: {
                            nl: 'AI-gebruik maakt ongeziene sprong tot bij helft van de Vlamingen',
                            en: 'AI use makes an unprecedented leap to half of Flanders',
                        },
                        url: 'https://www.imec.be/nl/press/ai-gebruik-maakt-ongeziene-sprong-tot-bij-helft-van-de-vlamingen',
                    },
                    {
                        label: {
                            nl: 'Hoe de snelle opmars van AI ook in Vlaanderen tot ongemak leidt',
                            en: 'How the rapid rise of AI also causes unease in Flanders',
                        },
                        url: 'https://www.vrt.be/vrtnws/nl/2026/03/06/digimeter-2026-ai-in-vlaanderen-sterke-groei-vraagtekens/',
                    },
                ],
            },
        ],
    },
    {
        slug: 'praat-tegen-uw-ai',
        category: 'prompting',
        date: '2026-07-08',
        title: {
            nl: 'De snelste weg naar een beter antwoord van uw AI: praten',
            en: 'The fastest way to a better AI answer: talking',
        },
        description: {
            nl: 'Wie tegen een AI praat, geeft vanzelf meer context dan wie typt. Waarom dat helpt, waarom niet elke AI het Nederlands even goed verstaat, en welke tools het verschil maken.',
            en: 'Talking to an AI gives it more context than typing does. Why that helps, why not every AI understands Dutch equally well, and which tools make the difference.',
        },
        // Optionele pakkende openingszin, enkel voor de nieuwsbrief-mail (niet op de site).
        emailIntro: {
            nl: 'Tot drie keer sneller werken met AI, en meteen bruikbaardere antwoorden krijgen. Het verschil zit in hoe u uw vraag stelt.',
            en: 'Work up to three times faster with AI, and get more usable answers right away. The difference is in how you ask.',
        },
        thumbnail: '/resources/praat-tegen-uw-ai.webp',
        blocks: [
            {
                type: 'heading',
                nl: 'Het begint bij de vraag',
                en: 'It starts with the question',
            },
            {
                type: 'paragraph',
                nl: 'U typt een vraag aan een AI, kort en snel, en krijgt een antwoord dat net niet raak is. Niet omdat het model tekortschiet, maar omdat het te weinig had om mee te werken. Spreek diezelfde vraag in plaats van hem te typen, en u vertelt er vanzelf meer bij, zonder dat het u enige extra moeite kost.',
                en: 'You type a question to an AI, short and quick, and get an answer that just misses the mark. Not because the model falls short, but because it had too little to work with. Speak that same question instead of typing it, and you naturally tell it more, without any extra effort on your part.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Context is waar het om draait',
                en: 'Context is what matters',
            },
            {
                type: 'paragraph',
                nl: 'Een AI geeft een beter antwoord met meer van de juiste context, niet noodzakelijk met meer tekst. Onderzoek van IBM Research en het Rensselaer Polytechnic Institute naar in context learning toont dat een model met de juiste, relevante informatie beter zijn kennis kan inzetten in plaats van te gokken. Zonder die context vult het model de gaten zelf in, en dat gaat vaker mis dan u zou denken.',
                en: 'An AI gives a better answer with more of the right context, not necessarily with more text. Research from IBM Research and the Rensselaer Polytechnic Institute on in context learning shows that a model with the right, relevant information can draw on its knowledge better instead of guessing. Without that context, the model fills the gaps itself, and that goes wrong more often than you would think.',
            },
            {
                type: 'paragraph',
                nl: 'Meer is daarbij niet automatisch beter. Onderzoekers van Stanford University onderzochten in "Lost in the Middle" hoe taalmodellen omgaan met lange input, en stelden vast dat de prestaties net verslechteren als relevante informatie verdrinkt tussen te veel, te rommelige tekst.',
                en: 'More is not automatically better here. Researchers at Stanford University studied how language models handle long input in "Lost in the Middle", and found that performance actually degrades once relevant information gets buried in too much, too messy text.',
            },
            {
                type: 'quote',
                nl: 'Het gaat om de juiste context, niet om de meeste.',
                en: 'It is about the right context, not the most.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Praten geeft u vanzelf meer van die context',
                en: 'Talking gives you more of that context, without trying',
            },
            {
                type: 'paragraph',
                nl: 'Hier zit de simpelste winst. Onderzoekers van Stanford University vergeleken spraakinvoer met typen op een smartphone toetsenbord, en maten dat spreken ongeveer drie keer sneller gaat dan typen, met minder fouten. Net omdat het zo weinig moeite kost, voegen mensen bij het spreken zonder erbij stil te staan meer achtergrond, doel en nuance toe dan wanneer ze diezelfde boodschap zouden intypen.',
                en: 'This is where the simplest win sits. Researchers at Stanford University compared voice input with typing on a smartphone keyboard, and measured that speaking is about three times faster than typing, with fewer errors. Precisely because it costs so little effort, people naturally add more background, goal and nuance when speaking than they would if they typed the same message.',
            },
            {
                type: 'quote',
                nl: 'Wat u niet hoeft te typen, laat u ook niet weg.',
                en: 'What you don\'t have to type, you also don\'t leave out.',
            },
            {
                type: 'paragraph',
                nl: 'Het advies is dus eenvoudig: gebruik de spraakfunctie van uw AI, of dicteer uw prompt, in plaats van hem te typen. Het resultaat is een uitgebreidere, natuurlijkere vraag, en dus een scherper antwoord.',
                en: 'The advice is simple, then: use your AI\'s voice mode, or dictate your prompt, instead of typing it. The result is a fuller, more natural question, and so a sharper answer.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Niet elke AI verstaat u even goed',
                en: 'Not every AI understands you equally well',
            },
            {
                type: 'paragraph',
                nl: 'Dat advies werkt alleen als de AI u ook goed verstaat. Daar loopt het niet overal gelijk.',
                en: 'That advice only works if the AI actually understands you. That is not the case everywhere.',
            },
            {
                type: 'cards',
                items: [
                    {
                        label: { nl: 'ChatGPT', en: 'ChatGPT' },
                        nl: 'Sterke spraakfunctie, verstaat Nederlands behoorlijk goed, ook met een lichte tongval.',
                        en: 'Strong voice mode, understands Dutch reasonably well, even with a slight accent.',
                    },
                    {
                        label: { nl: 'Claude', en: 'Claude' },
                        nl: 'Worstelt nog met gesproken Nederlands. Wij vroegen "verstaat Claude Nederlands" en het ving iets volledig anders op.',
                        en: 'Still struggles with spoken Dutch. We asked "does Claude understand Dutch" and it picked up something entirely different.',
                    },
                    {
                        label: { nl: 'Losse dicteertool', en: 'Separate dictation tool' },
                        nl: 'Voor talen of apps waar de ingebouwde spraakfunctie tekortschiet, een betrouwbaar alternatief.',
                        en: 'A reliable alternative for languages or apps where the built in voice mode falls short.',
                    },
                ],
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Onze eigen keuze: Wispr Flow',
                en: 'Our own choice: Wispr Flow',
            },
            {
                type: 'paragraph',
                nl: 'Bij TriaCore gebruiken we zelf Wispr Flow. U dicteert, en het zet uw gesproken tekst om in nette, leesbare tekst, in vrijwel elke app waar u typt, ook in ChatGPT, Claude of gewoon uw mail. Zo praat u tegen elke AI, ook de tools waarvan de eigen spraakherkenning het Nederlands nog niet onder de knie heeft.',
                en: 'At TriaCore we use Wispr Flow ourselves. You dictate, and it turns your spoken words into clean, readable text, in almost any app where you type, including ChatGPT, Claude or just your email. That way you can talk to any AI, even the ones whose own voice recognition has not mastered Dutch yet.',
            },
            {
                type: 'links',
                items: [
                    { label: { nl: 'Ga naar Wispr Flow', en: 'Go to Wispr Flow' }, url: 'https://wisprflow.ai/' },
                ],
            },
            {
                type: 'callout',
                nl: 'Dit is een persoonlijke voorkeur, geen samenwerking. Wij hebben geen partnerschap met Wispr Flow en krijgen er niets voor, geen commissie en geen vergoeding. We noemen het omdat het bij ons werkt, niet omdat het ons iets oplevert.',
                en: 'This is a personal preference, not a partnership. We have no partnership with Wispr Flow and get nothing for mentioning it, no commission and no compensation. We mention it because it works for us, not because it benefits us.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Twee alternatieven om te vergelijken',
                en: 'Two alternatives to compare',
            },
            {
                type: 'paragraph',
                nl: 'Er bestaan meerdere gelijkaardige tools, van gevestigde bedrijven met echte gebruikers en reviews. Twee die het bekijken waard zijn, naast Wispr Flow zelf.',
                en: 'Several similar tools exist, from established companies with real users and reviews. Two worth a look, alongside Wispr Flow itself.',
            },
            {
                type: 'table',
                nl: {
                    head: ['', 'Superwhisper', 'Willow Voice'],
                    rows: [
                        ['Achter de tool', 'SuperUltra Inc. uit Toronto, opgericht door Neil Chudleigh.', 'Amerikaans bedrijf van twee oud Stanford studenten, gesteund door Y Combinator (4,2 miljoen dollar).'],
                        ['Vertrouwen', '4,4 op 5 op de Mac App Store, 4,9 op 5 op de App Store, duizenden reviews.', '4,6 op 5 op de App Store. Klanten zoals Uber en Heidi Health.'],
                        ['Gratis versie', 'Ja, lokale modellen zonder limiet.', 'Ja, tot 2000 woorden per week.'],
                        ['Betaald', 'Vanaf 8,49 dollar per maand, of 249,99 dollar levenslang.', 'Vanaf 15 dollar per maand.'],
                        ['Werkt op', 'Mac, Windows, iOS.', 'Mac, Windows, iPhone.'],
                    ],
                },
                en: {
                    head: ['', 'Superwhisper', 'Willow Voice'],
                    rows: [
                        ['Behind the tool', 'SuperUltra Inc. from Toronto, founded by Neil Chudleigh.', 'US company by two former Stanford students, backed by Y Combinator ($4.2 million).'],
                        ['Trust', '4.4 out of 5 on the Mac App Store, 4.9 out of 5 on the App Store, thousands of reviews.', '4.6 out of 5 on the App Store. Customers like Uber and Heidi Health.'],
                        ['Free version', 'Yes, local models with no limit.', 'Yes, up to 2,000 words per week.'],
                        ['Paid', 'From $8.49 per month, or $249.99 lifetime.', 'From $15 per month.'],
                        ['Works on', 'Mac, Windows, iOS.', 'Mac, Windows, iPhone.'],
                    ],
                },
            },
            {
                type: 'links',
                items: [
                    { label: { nl: 'Superwhisper bekijken', en: 'Visit Superwhisper' }, url: 'https://superwhisper.com/' },
                    { label: { nl: 'Willow Voice bekijken', en: 'Visit Willow Voice' }, url: 'https://willowvoice.com/' },
                ],
            },
            {
                type: 'paragraph',
                nl: 'Wispr Flow zelf kost 15 dollar per maand, of 12 dollar per maand bij jaarlijkse betaling. Vergelijk gerust zelf welke tool bij uw manier van werken past, de functies en talen die ze ondersteunen verschillen per tool en veranderen regelmatig.',
                en: 'Wispr Flow itself costs $15 per month, or $12 per month billed annually. Feel free to compare which tool fits how you work, the features and languages each one supports differ and change regularly.',
            },
            {
                type: 'callout',
                nl: 'Probeer het zelf. Stel een vraag die u normaal zou typen, maar spreek ze in plaats daarvan hardop uit. Kijk hoeveel achtergrond en detail u er ongemerkt aan toevoegt, en of het antwoord daardoor beter aansluit.',
                en: 'Try it yourself. Ask a question you would normally type, but say it out loud instead. Notice how much background and detail you add without trying, and whether the answer fits better as a result.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Bronnen',
                en: 'Sources',
            },
            {
                type: 'links',
                items: [
                    {
                        label: {
                            nl: 'Stanford HCI Group, "Speech Is 3x Faster than Typing" (Ruan e.a., 2016)',
                            en: 'Stanford HCI Group, "Speech Is 3x Faster than Typing" (Ruan et al., 2016)',
                        },
                        url: 'https://hci.stanford.edu/research/speech/paper/speech_paper.pdf',
                    },
                    {
                        label: {
                            nl: 'Stanford University, "Lost in the Middle: How Language Models Use Long Contexts" (Liu e.a., 2023/2024)',
                            en: 'Stanford University, "Lost in the Middle: How Language Models Use Long Contexts" (Liu et al., 2023/2024)',
                        },
                        url: 'https://arxiv.org/abs/2307.03172',
                    },
                    {
                        label: {
                            nl: 'IBM Research, over in context learning',
                            en: 'IBM Research, on in context learning',
                        },
                        url: 'https://research.ibm.com/blog/demystifying-in-context-learning-in-large-language-model',
                    },
                    {
                        label: { nl: 'Wispr Flow', en: 'Wispr Flow' },
                        url: 'https://wisprflow.ai/',
                    },
                    {
                        label: { nl: 'Superwhisper', en: 'Superwhisper' },
                        url: 'https://superwhisper.com/',
                    },
                    {
                        label: { nl: 'Willow Voice', en: 'Willow Voice' },
                        url: 'https://willowvoice.com/',
                    },
                ],
            },
        ],
    },
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
    {
        slug: 'chinese-ai-modellen',
        category: 'ai-nieuws',
        date: '2026-08-11',
        title: {
            nl: 'Honderden miljarden: de AI strijd tussen China en Amerika',
            en: 'Hundreds of billions: the AI battle between China and America',
        },
        description: {
            nl: 'Amerika en China investeren samen meer dan 1000 miljard dollar in AI, een strijd die nu al de rekening verandert voor een bedrijf dat AI wil implementeren. Wat er op het spel staat, wat het betekent voor de kosten, waar de risico\'s zitten, en hoe u er verstandig mee omgaat.',
            en: 'The United States and China are together investing more than $1 trillion in AI, a battle that is already changing the bill for a business looking to implement AI. What is at stake, what it means for costs, where the risks sit, and how to handle it wisely.',
        },
        thumbnail: '/resources/chinese-ai-modellen.webp',
        blocks: [
            {
                type: 'paragraph',
                nl: 'Amerika en China investeren dit jaar samen meer dan 1000 miljard dollar in AI. Beide grootmachten willen die strijd winnen, met eigen AI labs, eigen chips, en eigen regels over data en export. Wat daarbij minder verteld wordt: die strijd speelt zich niet enkel af tussen Washington en Peking. Een bedrijf dat vandaag AI wil implementeren, voelt de gevolgen daarvan nu al terug, in de rekening en in wat er technisch mogelijk is.',
                en: 'The United States and China are together investing more than $1 trillion in AI this year. Both superpowers want to win that race, with their own AI labs, their own chips, and their own rules on data and exports. What gets left out of that story: the race does not stay confined to Washington and Beijing. A business looking to implement AI today already feels the effects, in the bill and in what is technically possible.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Twee grootmachten, één race',
                en: 'Two superpowers, one race',
            },
            {
                type: 'paragraph',
                nl: 'Dit gaat verder dan modellen kiezen. De Verenigde Staten en China voeren allebei een nationale strategie rond AI, met astronomische bedragen erachter.',
                en: 'This goes further than choosing a model. The United States and China are both running a national strategy around AI, with astronomical sums behind it.',
            },
            {
                type: 'table',
                nl: {
                    head: ['', 'Verenigde Staten', 'China'],
                    rows: [
                        ['Investering in 2026', 'Ongeveer 805 miljard dollar, door techbedrijven zelf, zowat 2% van het bbp', 'Ongeveer 295 miljard dollar (2000 miljard yuan) over vijf jaar, een staatsplan'],
                        ['Aanpak', 'Marktgedreven: techbedrijven investeren op eigen initiatief', 'Staatsgestuurd: centraal gepland en gefinancierd'],
                        ['Doel', 'Wereldwijd marktleiderschap behouden', 'Wereldleider worden tegen 2030'],
                        ['Chipstrategie', 'Eigen chips (Nvidia, AMD), wereldwijd verkocht', 'Zo veel mogelijk eigen chips (Huawei), Nvidia en AMD geweerd'],
                    ],
                },
                en: {
                    head: ['', 'United States', 'China'],
                    rows: [
                        ['2026 investment', 'Roughly $805 billion, from tech companies themselves, about 2% of GDP', 'Roughly $295 billion (2 trillion yuan) over five years, a state plan'],
                        ['Approach', 'Market driven: tech companies invest on their own initiative', 'State directed: centrally planned and funded'],
                        ['Goal', 'Keep global market leadership', 'Become world leader by 2030'],
                        ['Chip strategy', 'Own chips (Nvidia, AMD), sold worldwide', 'As many domestic chips as possible (Huawei), Nvidia and AMD locked out'],
                    ],
                },
            },
            {
                type: 'paragraph',
                nl: 'Voor beide landen is dit geen bijzaak. AI geldt als een technologie die de economie van de komende decennia mee bepaalt, en geen van beide grootmachten wil daar tweede in eindigen.',
                en: 'For both countries, this is not a side project. AI counts as a technology that will help define the economy of the coming decades, and neither superpower wants to finish second.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Waarom Chinese modellen plots zo efficiënt werden',
                en: 'Why Chinese models suddenly became so efficient',
            },
            {
                type: 'paragraph',
                nl: 'Die rivaliteit verklaart mee waarom Chinese modellen ineens zo goedkoop en efficiënt werden. De Verenigde Staten beperken al enkele jaren de export van de krachtigste AI chips naar China. Twee redenen liggen daaraan ten grondslag: de vrees dat die chips het Chinese leger sterker maken, en de wil om de eigen voorsprong in AI niet te laten inhalen. "No way are we going to let them catch up", zei toenmalig Amerikaans handelsminister Gina Raimondo het in 2023 ronduit. Chinese AI labs moesten daardoor vaak werken met minder krachtige hardware dan hun Amerikaanse concurrenten.',
                en: 'That rivalry partly explains why Chinese models suddenly became so cheap and efficient. The United States has restricted exports of the most powerful AI chips to China for several years. Two reasons underpin that: concern the chips would strengthen China\'s military, and the wish to keep China from catching up on AI altogether. "No way are we going to let them catch up," then US Commerce Secretary Gina Raimondo put it bluntly in 2023. Chinese AI labs often had to work with less powerful hardware than their American competitors as a result.',
            },
            {
                type: 'paragraph',
                nl: 'Dat leidde in januari 2025 tot een opvallend moment: DeepSeek bracht een model uit dat qua prestaties in de buurt kwam van de Amerikaanse top, maar naar verluidt tegen een fractie van de gebruikelijke trainingskost, door slimmer om te springen met minder krachtige chips.',
                en: 'That led to a notable moment in January 2025: DeepSeek released a model that came close to American frontier performance, reportedly at a fraction of the usual training cost, by working more cleverly with less powerful chips.',
            },
            {
                type: 'paragraph',
                nl: 'Verklaart dat volledig waarom Chinese modellen nu zo efficiënt zijn? Daarover verschillen onderzoekers van mening. Sommigen wijzen erop dat modellen sowieso efficiënter worden na verloop van tijd, ook bij Amerikaanse labs, los van chipbeperkingen. Wat wel duidelijk is: Chinese labs hadden minder rekenkracht ter beschikking, en moesten die optimaal benutten. Die noodzaak leverde technieken op die nu, vertaald naar lagere kosten, ook aan bedrijven ten goede komen.',
                en: 'Does that fully explain why Chinese models are now so efficient? Researchers disagree. Some point out that models generally become more efficient over time anyway, including at American labs, regardless of chip restrictions. What is clear: Chinese labs had less computing power available, and had to make the most of it. That necessity produced techniques that now, translated into lower costs, also benefit businesses.',
            },
            {
                type: 'quote',
                nl: 'Minder krachtige chips dwongen tot een zuinigere aanpak.',
                en: 'Fewer powerful chips forced a leaner approach.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Waarom bedrijven overstappen',
                en: 'Why businesses are switching',
            },
            {
                type: 'paragraph',
                nl: 'De prijzen van de grote Amerikaanse labs stegen het voorbije jaar, en bedrijven werden kritischer over waarvoor ze exact betalen. Steeds meer teams sturen een taak naar het goedkoopste model dat volstaat, in plaats van standaard naar het duurste te grijpen. Vaak is dat een open source model, bijna altijd Chinees.',
                en: 'Prices from the major American labs rose over the past year, and businesses grew more critical about exactly what they were paying for. More teams now send a task to the cheapest model that will do the job, instead of defaulting to the most expensive one. Often that is an open source model, almost always Chinese.',
            },
            {
                type: 'definition',
                term: { nl: 'Open source', en: 'Open source' },
                kind: { nl: 'AI begrip', en: 'AI term' },
                nl: 'Modellen waarvan de bouwstenen vrij beschikbaar zijn, in plaats van enkel toegankelijk via een betaalde dienst van de maker. Een organisatie kan zo\'n model zelf aanpassen of op eigen servers laten draaien.',
                en: 'Models whose building blocks are freely available, instead of only accessible through a paid service from the maker. An organization can adapt such a model itself or run it on its own servers.',
            },
            {
                type: 'paragraph',
                nl: 'Vercel, een groot Amerikaans platform waarlangs bedrijven hun AI verkeer laten lopen, deelde de cijfers. Het effect is groot:',
                en: 'Vercel, a major American platform that routes AI traffic for businesses, shared the numbers. The effect is large:',
            },
            {
                type: 'cards',
                items: [
                    {
                        label: { nl: '11% naar 29%', en: '11% to 29%' },
                        nl: 'Het aandeel van open source modellen in dat verkeer, van april tot juni 2026.',
                        en: 'The share of open source models in that traffic, from April to June 2026.',
                    },
                    {
                        label: { nl: '22,6%', en: '22.6%' },
                        nl: 'Aandeel van DeepSeek alleen al, de derde grootste aanbieder op het platform.',
                        en: 'DeepSeek\'s share on its own, the third largest provider on the platform.',
                    },
                    {
                        label: { nl: 'Lindy', en: 'Lindy' },
                        nl: 'Dit AI bedrijf verhuisde in juni 2026 zijn volledige verkeer van Claude naar DeepSeek, met een verwachte besparing van miljoenen dollars.',
                        en: 'This AI company moved its entire traffic from Claude to DeepSeek in June 2026, with an expected saving of millions of dollars.',
                    },
                ],
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Hoe goed zijn ze echt',
                en: 'How good are they really',
            },
            {
                type: 'paragraph',
                nl: 'Prijs alleen verklaart niet alles. Op de Artificial Analysis Intelligence Index, een onafhankelijke ranglijst die modellen test op redeneren en praktische taken, staat het Chinese Kimi K3 bij de beste modellen ter wereld, na enkele Amerikaanse toppers. GLM 5.2, van het Chinese Z.ai, haalt op codeertaken resultaten die in de buurt komen van Claude Opus, tegen een fractie van de prijs.',
                en: 'Price alone does not explain everything. On the Artificial Analysis Intelligence Index, an independent ranking that tests models on reasoning and practical tasks, the Chinese Kimi K3 sits among the best models in the world, behind only a few American frontrunners. GLM 5.2, from China\'s Z.ai, reaches coding results close to Claude Opus, at a fraction of the price.',
            },
            {
                type: 'paragraph',
                nl: 'Toch blijven de duurste Amerikaanse modellen de norm voor het zwaarste werk. Diezelfde data toont dat Anthropic 61 procent van alle uitgaven binnenhaalt met maar 32 procent van de tokens, en meer dan 72 procent van het budget bij de meest kritieke toepassingen. Voor alledaagse taken wint de prijs. Voor het werk waar een fout echt pijn doet, kiezen bedrijven nog overwegend Amerikaans.',
                en: 'Still, the most expensive American models remain the standard for the heaviest work. That same data shows Anthropic capturing 61 percent of all spend on just 32 percent of tokens, and more than 72 percent of the budget in the most critical use cases. For everyday tasks, price wins. For work where a mistake really hurts, businesses still lean American.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'De prijs van goedkoop: wat u moet weten over data en veiligheid',
                en: 'The cost of cheap: what to know about data and safety',
            },
            {
                type: 'paragraph',
                nl: 'Goedkoop en goed betekent niet automatisch veilig. Chinese AI bedrijven verwerken gebruikersdata vaak op servers in China, zonder de waarborgen die de GDPR verplicht.',
                en: 'Cheap and good does not automatically mean safe. Chinese AI companies often process user data on servers in China, without the safeguards the GDPR requires.',
            },
            {
                type: 'paragraph',
                nl: 'Italië ging op 30 januari 2025 als eerste over tot actie: privacytoezichthouder Garante verbood DeepSeek er, nadat het bedrijf onvoldoende duidelijk maakte welke data het verzamelt, waarom, en op welke rechtsgrond, terwijl die data wel naar servers in China gaat. Duitsland volgde: op 27 juni 2025 meldde de Berlijnse privacycommissaris DeepSeek bij Apple en Google als onwettige content, nadat het bedrijf niet inging op een eerdere vraag om de dataoverdracht naar China in orde te brengen.',
                en: 'Italy was first to act, on January 30, 2025: privacy watchdog Garante banned DeepSeek after the company failed to clarify what data it collects, why, and on what legal basis, while that data does end up on servers in China. Germany followed: on June 27, 2025, Berlin\'s data protection commissioner reported DeepSeek to Apple and Google as unlawful content, after the company did not respond to an earlier request to fix its data transfers to China.',
            },
            {
                type: 'quote',
                nl: 'Twee Europese toezichthouders zeiden al nee.',
                en: 'Two European regulators already said no.',
            },
            {
                type: 'paragraph',
                nl: 'Dat is geen reden om Chinese modellen zomaar te mijden. Het is wel een reden om na te denken over welke data waar terechtkomt.',
                en: 'That is not a reason to avoid Chinese models outright. It is a reason to think about which data ends up where.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Hoe een bedrijf hier verstandig mee omgaat',
                en: 'How a business handles this wisely',
            },
            {
                type: 'paragraph',
                nl: 'De belangrijkste vraag is niet welk land een model maakt, maar welke data een taak nodig heeft.',
                en: 'The main question is not which country made a model, but what data a task needs.',
            },
            {
                type: 'steps',
                items: [
                    {
                        title: { nl: 'Laag risico', en: 'Low risk' },
                        nl: 'Taken zonder persoonsgegevens of vertrouwelijke bedrijfsinformatie, zoals code genereren, tekst opstellen of interne documentatie, zijn een goede kandidaat voor een goedkoper model.',
                        en: 'Tasks without personal data or confidential business information, such as generating code, drafting text or internal documentation, are a good candidate for a cheaper model.',
                    },
                    {
                        title: { nl: 'Hoog risico', en: 'High risk' },
                        nl: 'Taken met klant of personeelsgegevens horen op infrastructuur die aantoonbaar aan de GDPR voldoet, ongeacht welk model erachter zit.',
                        en: 'Tasks involving customer or staff data belong on infrastructure that demonstrably meets the GDPR, regardless of which model runs behind it.',
                    },
                    {
                        title: { nl: 'De open source uitweg', en: 'The open source way out' },
                        nl: 'Veel Chinese modellen zijn open source: de bouwstenen liggen vrij, en een organisatie kan ze zelf hosten op eigen of Europese servers. Dat haalt het risico van dataoverdracht naar China helemaal weg, en combineert de lage kost met controle over de data.',
                        en: 'Many Chinese models are open source: the building blocks are freely available, and an organization can host them itself, on its own or European servers. That removes the risk of data transfer to China entirely, and combines the low cost with control over the data.',
                    },
                    {
                        title: { nl: 'Routeer, kies niet één model', en: 'Route, don\'t pick one model' },
                        nl: 'Eén model voor alles is zelden de beste keuze. Een taak routeren naar het model dat past, in plaats van altijd hetzelfde model te gebruiken, is waar de echte besparing zit.',
                        en: 'One model for everything is rarely the best choice. Routing a task to the model that fits, instead of always using the same one, is where the real savings sit.',
                    },
                ],
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Bronnen',
                en: 'Sources',
            },
            {
                type: 'links',
                items: [
                    {
                        label: { nl: 'Vercel, AI Gateway Production Index, juli 2026', en: 'Vercel, AI Gateway Production Index, July 2026' },
                        url: 'https://vercel.com/blog/ai-gateway-production-index-july-2026',
                    },
                    {
                        label: { nl: 'CNBC, Chinese AI models are gaining ground with U.S. companies as OpenAI, Anthropic costs surge', en: 'CNBC, Chinese AI models are gaining ground with U.S. companies as OpenAI, Anthropic costs surge' },
                        url: 'https://www.cnbc.com/2026/07/07/chinese-ai-models-costs-us-openai-anthropic.html',
                    },
                    {
                        label: { nl: 'Artificial Analysis, AI model intelligence, performance and price analysis', en: 'Artificial Analysis, AI model intelligence, performance and price analysis' },
                        url: 'https://artificialanalysis.ai/',
                    },
                    {
                        label: { nl: 'The Record, Italy blocks Chinese AI tool DeepSeek over privacy concerns (30 jan 2025)', en: 'The Record, Italy blocks Chinese AI tool DeepSeek over privacy concerns (Jan 30, 2025)' },
                        url: 'https://therecord.media/italy-blocks-chinese-ai-tool-deepseek-over-privacy-concerns',
                    },
                    {
                        label: { nl: 'CNBC, Germany tells Apple, Google to block DeepSeek AI app (27 jun 2025)', en: 'CNBC, Germany tells Apple, Google to block DeepSeek AI app (Jun 27, 2025)' },
                        url: 'https://www.cnbc.com/2025/06/27/germany-tells-apple-google-to-block-deepseek-ai-app.html',
                    },
                    {
                        label: { nl: 'Bloomberg, China plans $295 billion investment to build nationwide AI data centers (juni 2026)', en: 'Bloomberg, China plans $295 billion investment to build nationwide AI data centers (June 2026)' },
                        url: 'https://www.bloomberg.com/news/articles/2026-06-09/china-prepares-295-billion-plan-to-fund-nationwide-ai-buildout',
                    },
                    {
                        label: { nl: 'Goldman Sachs, Global AI investment is forecast to exceed $1 trillion in 2026', en: 'Goldman Sachs, Global AI investment is forecast to exceed $1 trillion in 2026' },
                        url: 'https://www.goldmansachs.com/insights/articles/global-investment-is-forecast-to-exceed-1-trillion-in-2026',
                    },
                    {
                        label: { nl: 'CNBC, Nvidia still hasn\'t sold its U.S. approved China AI chips, and it\'s worried local AI rivals could take over', en: 'CNBC, Nvidia still hasn\'t sold its U.S. approved China AI chips, and it\'s worried local AI rivals could take over' },
                        url: 'https://www.cnbc.com/2026/02/26/nvidia-china-chip-sales-export-controls-ai-competition.html',
                    },
                    {
                        label: { nl: 'MIT Technology Review, How Chinese company DeepSeek released a top AI reasoning model despite US sanctions', en: 'MIT Technology Review, How Chinese company DeepSeek released a top AI reasoning model despite US sanctions' },
                        url: 'https://www.technologyreview.com/2025/01/24/1110526/china-deepseek-top-ai-despite-sanctions/',
                    },
                    {
                        label: { nl: 'CSIS, Where the Chips Fall: U.S. Export Controls Under the Biden Administration from 2022 to 2024', en: 'CSIS, Where the Chips Fall: U.S. Export Controls Under the Biden Administration from 2022 to 2024' },
                        url: 'https://www.csis.org/analysis/where-chips-fall-us-export-controls-under-biden-administration-2022-2024',
                    },
                ],
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

// Verzamelt recursief alle leesbare tekst voor één taal uit een blok-waarde.
// Sla technische velden over (url, src, type ...) zodat die de telling niet vervuilen.
const SKIP_KEYS = new Set(['type', 'url', 'src', 'anchor', 'icon', 'target']);
function collectText(value, language) {
    if (value == null) return '';
    if (typeof value === 'string') return value + ' ';
    if (Array.isArray(value)) return value.map((v) => collectText(v, language)).join(' ');
    if (typeof value === 'object') {
        // Taal-gekoppeld object ({ nl, en }) → neem enkel de actieve taal.
        if ('nl' in value || 'en' in value) return collectText(value[language], language);
        return Object.entries(value)
            .filter(([k]) => !SKIP_KEYS.has(k))
            .map(([, v]) => collectText(v, language))
            .join(' ');
    }
    return '';
}

// Schat de leestijd in minuten op basis van ~200 woorden per minuut.
// Minimaal 1 minuut. Rekent enkel de tekst van de actieve taal.
export function getReadingTime(resource, language) {
    const text = resource.blocks.map((b) => collectText(b, language)).join(' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
}
