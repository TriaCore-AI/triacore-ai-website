// De titel en omschrijving van elke pagina, zoals Google en sociale netwerken ze tonen. Eén bron voor twee
// gebruikers: de pagina's (via <Seo>) en het bouwscript scripts/prerender-meta.mjs, dat per pagina een eigen
// HTML-bestand met deze gegevens maakt (LinkedIn, WhatsApp en co. voeren geen JavaScript uit en zien anders
// enkel de homepage). De casepagina's hebben hun tekst in src/data/projecten.jsx (veld "seo").
//
// Richtlijn: titel tot ongeveer 60 tekens in de vorm "Pagina | TriaCore AI", omschrijving tot ongeveer 155 tekens,
// met de zoekterm van de pagina erin. Geen gedachtestreepjes, wel koppeltekens ("AI-oplossingen").
// Een nieuwe pagina: hier toevoegen, en ook in STATIC_ROUTES van scripts/generate-sitemap.mjs.

export const SITE_URL = 'https://triacore.be';

export const paginaSeo = {
    '/': {
        nl: {
            title: 'TriaCore AI | AI-oplossingen en AI-workshops voor bedrijven',
            description: 'De AI-partner waar ambitieuze bedrijven op bouwen. TriaCore AI uit Hasselt ontwerpt en bouwt AI-oplossingen op maat en geeft AI-workshops aan je team.',
        },
        en: {
            title: 'TriaCore AI | AI solutions and AI workshops for businesses',
            description: 'The AI partner ambitious companies build on. TriaCore AI from Hasselt, Belgium, designs and builds custom AI solutions and runs AI workshops for your team.',
        },
    },
    '/ai-oplossingen': {
        nl: {
            title: 'AI-oplossingen op maat | TriaCore AI',
            description: 'Geen losse proefjes, maar AI die verankerd zit in je processen en uitgroeit tot een blijvend voordeel. Op maat gebouwd, met meetbaar resultaat.',
        },
        en: {
            title: 'Custom AI solutions | TriaCore AI',
            description: 'Not isolated experiments, but AI anchored in your processes that grows into a lasting advantage. Custom-built, with measurable results.',
        },
    },
    '/workshops': {
        nl: {
            title: 'AI-workshops voor bedrijven | TriaCore AI',
            description: 'Praktische AI-workshops op maat van je sector. Je team leert zelf werken met ChatGPT, Copilot en Claude, met voorbeelden uit het eigen werk.',
        },
        en: {
            title: 'AI workshops for businesses | TriaCore AI',
            description: 'Practical AI workshops tailored to your sector. Your team learns to work with ChatGPT, Copilot and Claude, using examples from their own work.',
        },
    },
    '/projecten': {
        nl: {
            title: 'Projecten en klantcases | TriaCore AI',
            description: 'Organisaties die we verder hielpen met AI, van een eerste AI-workshop tot een AI-oplossing op maat. Bekijk onze projecten en klantcases.',
        },
        en: {
            title: 'Projects and case studies | TriaCore AI',
            description: 'Organisations we helped move forward with AI, from a first AI workshop to a custom AI solution. Explore our projects and case studies.',
        },
    },
    '/team': {
        nl: {
            title: 'Ons team in Hasselt | TriaCore AI',
            description: 'Maak kennis met Lucas Curto, Rian Mathijs en Jorn van Breemaat: het team dat vanuit Hasselt AI-oplossingen bouwt en AI-workshops geeft.',
        },
        en: {
            title: 'Our team in Hasselt | TriaCore AI',
            description: 'Meet Lucas Curto, Rian Mathijs and Jorn van Breemaat: the team in Hasselt, Belgium, that builds AI solutions and runs AI workshops.',
        },
    },
    '/contact': {
        nl: {
            title: 'Contact: plan een gesprek | TriaCore AI',
            description: 'Plan een vrijblijvend gesprek. Vertel waar je processen vastlopen en we bekijken samen wat AI voor je bedrijf kan doen. Kantoor in Corda, Hasselt.',
        },
        en: {
            title: 'Contact: book a call | TriaCore AI',
            description: 'Book a no-obligation call. Tell us where your processes get stuck and we will explore what AI can do for your business. Office at Corda, Hasselt.',
        },
    },
    '/privacybeleid': {
        nl: {
            title: 'Privacybeleid | TriaCore AI',
            description: 'Hoe TriaCore AI omgaat met je persoonsgegevens: welke gegevens we verzamelen, waarvoor we ze gebruiken, hoe lang we ze bewaren en welke rechten je hebt.',
        },
        en: {
            title: 'Privacy policy | TriaCore AI',
            description: 'How TriaCore AI handles your personal data: what we collect, what we use it for, how long we keep it and what your rights are.',
        },
    },
    '/cookiebeleid': {
        nl: {
            title: 'Cookiebeleid | TriaCore AI',
            description: 'Welke cookies TriaCore AI gebruikt op deze website, waarvoor ze dienen en hoe je je cookievoorkeuren op elk moment aanpast.',
        },
        en: {
            title: 'Cookie policy | TriaCore AI',
            description: 'Which cookies TriaCore AI uses on this website, what they are for and how you can change your cookie preferences at any time.',
        },
    },
};

// De titel en omschrijving van een pagina in de gekozen taal, klaar om in <Seo {...} /> te spreiden
export const seoVoor = (pad, taal) => paginaSeo[pad][taal === 'en' ? 'en' : 'nl'];
