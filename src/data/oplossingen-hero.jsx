import React from 'react';
import PlanningVisual from '../components/ui/planning-visual';
import { DocumentAskVisual } from '../components/ui/document-ai-visuals';
import { WerkbonVisual } from '../components/ui/werkbon-visual';
// Orders automatisch verwerken (order-visual.jsx) stond hier even als vierde voorbeeld; bewaard voor later

// Inhoud van de hero van de pagina AI-oplossingen (AiOplossingen.jsx).

export const heroTeksten = {
    // De eerste zin staat klein als bovenregel. De titel staat op drie even lange regels (elk hoogstens een
    // vijftiental tekens), zodat er nooit een los woord achteraan een regel bengelt
    nl: {
        boven: 'AI verandert elke sector',
        regels: [
            'Wij bouwen voor',
            'bedrijven die',
            <span className="italic text-accent">vooruit durven denken.</span>
        ],
        intro: 'De meeste bedrijven blijven bij losse proefjes met AI. Wij bouwen AI die verankerd zit in je processen en je manier van werken, en zo uitgroeit tot een blijvend voordeel.',        knop: { tekst: 'Plan een gesprek', to: '/contact' },
        // Na de drie voorbeelden: een link naar de sectie eronder, zodat duidelijk is dat er meer mogelijk is
        meer: { tekst: 'Ontdek nog meer', naar: 'nodig' }
    },
    en: {
        boven: 'AI is changing every industry',
        regels: [
            'We build for',
            'companies that',
            <span className="italic text-accent">dare to think ahead.</span>
        ],
        intro: 'Most companies never get past small experiments with AI. We build AI that is anchored in your processes and the way you work, and grows into a lasting advantage.',        knop: { tekst: 'Book a call', to: '/contact' },
        meer: { tekst: 'Discover more', naar: 'nodig' }
    }
};

// De oplossingen in de hero, die vanzelf wisselen: enkel de naam onder de visual, zonder uitleg. Planning is
// voor bedrijven die vervoer regelen naast hun hoofdactiviteit (geen logistieke bedrijven). Werkbonnen inspreken
// is voor iedereen die buiten werkt (werf, baan, bij de klant), niet enkel techniekers. De visuals van planning
// en documenten zijn die van Custom tools (v1); die van de werkbonnen staat in werkbon-visual.jsx
export const heroOplossingen = {
    nl: [
        { id: 'planning', naam: 'AI-gedreven planning', visual: <PlanningVisual /> },
        { id: 'documenten', naam: 'Documentbeheer met AI', visual: <DocumentAskVisual /> },
        { id: 'werkbonnen', naam: 'Werkbonnen inspreken', visual: <WerkbonVisual /> }
    ],
    en: [
        { id: 'planning', naam: 'AI-driven scheduling', visual: <PlanningVisual /> },
        { id: 'documenten', naam: 'Document management with AI', visual: <DocumentAskVisual /> },
        { id: 'werkbonnen', naam: 'Voice-to-work-order', visual: <WerkbonVisual /> }
    ]
};
