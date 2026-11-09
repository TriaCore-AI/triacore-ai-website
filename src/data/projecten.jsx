// =============================================================
// PROJECTEN DATA
// =============================================================
// Eén bestand = alle projecten/klantcases. Nieuw project toevoegen?
// Kopieer een bestaand object hieronder en vul het in.
//
// Verplicht:
//   slug        — uniek, in de URL (/projecten/<slug>). Geen spaties.
//   client      — weergavenaam van de klant.
//   logo        — geïmporteerd logo (uit src/assets/partners/).
//   status      — 'live' (klikbaar, heeft een detailpagina) of
//                 'soon' (nog niet klikbaar, toont "binnenkort").
//   sector      — { nl, en } — tag op de kaart.
//   title       — { nl, en } — titel van de case.
//   description — { nl, en } — korte tekst op de kaart en bovenaan de
//                 detailpagina.
//
// Optioneel op 'live' projecten:
//   blocks      — inhoud van de detailpagina (zie
//                 src/components/content/ContentBlocks.jsx). Vaste
//                 structuur en schrijfwijze: zie Projecten/_template.md
//                 (privé werkmap, niet op GitHub).
// =============================================================

import croesLogo from '../assets/partners/Croes NV.png';
import amGroupLogo from '../assets/partners/A&M Group.webp';

export const projecten = [
    {
        slug: 'croes-nv',
        client: 'Croes NV',
        logo: croesLogo,
        status: 'live',
        sector: { nl: 'Afbraak- en grondwerken', en: 'Demolition & earthworks' },
        title: {
            nl: 'Van papieren bonnen naar realtime overzicht bij Croes NV',
            en: 'From paper transport notes to a real-time overview at Croes NV',
        },
        description: {
            nl: 'Chauffeurs vulden hun grondbankbonnen met de hand in en het kantoor typte ze achteraf over. Met een platform en een chauffeursapp komt elke bon nu meteen binnen, en Croes ziet live wat er op elke werf gebeurt.',
            en: 'Drivers filled in their soil transport notes by hand and the office retyped them afterwards. With a platform and a driver app, every note now comes in right away, and Croes can see live what is happening on every site.',
        },
        blocks: [
            {
                type: 'heading',
                nl: 'Uitgangspunt',
                en: 'Starting point',
            },
            {
                type: 'paragraph',
                nl: 'Croes NV is een familiebedrijf uit Geetbets dat afbraak- en grondwerken doet en afbraakmateriaal recycleert. Chauffeurs vervoeren grond tussen werven, en bij dat transport hoort telkens een grondbankbon.',
                en: 'Croes NV is a family business from Geetbets that carries out demolition and earthworks and recycles demolition materials. Drivers transport soil between sites, and every transport comes with a soil transport note.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Probleem',
                en: 'Problem',
            },
            {
                type: 'paragraph',
                nl: 'Die bon werd met de hand ingevuld en moest daarna fysiek naar kantoor. Dat zorgde voor drie problemen:',
                en: 'That note was filled in by hand and then had to be taken to the office. That created three problems:',
            },
            {
                type: 'list',
                nl: [
                    'Laat: bonnen kwamen vaak pas veel later binnen, soms na weken.',
                    'Dubbel werk: het kantoor typte elke bon over, ook de chauffeurs van onderaannemers die telefonisch werden doorgegeven.',
                    'Geen zicht: niemand zag live wat er op een werf gebeurde.',
                ],
                en: [
                    'Late: notes often came in much later, sometimes weeks afterwards.',
                    'Duplicate work: the office retyped every note, and also entered the subcontractors\' drivers, whose details came in by phone.',
                    'No visibility: nobody could see live what was happening on a site.',
                ],
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Oplossing',
                en: 'Solution',
            },
            {
                type: 'paragraph',
                nl: 'We bouwden een platform dat het grondtransport registreert, van transportopdracht tot grondbankbon. Het werkt op maat van de manier waarop de planner plant, en bestaat uit drie delen:',
                en: 'We built a platform that records soil transport, from transport order to soil transport note. It is tailored to the way the planner works, and consists of three parts:',
            },
            {
                type: 'cards',
                items: [
                    {
                        icon: 'Monitor',
                        label: { nl: 'Kantoor', en: 'Office' },
                        nl: 'Plant de transporten in een weekrooster, kijkt de bonnen na en maakt de officiële vrachtbonnen als PDF.',
                        en: 'Plans transports in a weekly schedule, checks the notes and creates the official transport documents as PDFs.',
                    },
                    {
                        icon: 'Smartphone',
                        label: { nl: 'Chauffeurs', en: 'Drivers' },
                        nl: 'Starten en stoppen elke rit in de app en dienen daarna de bon in. De uren staan er vanzelf in, en de app werkt ook zonder bereik.',
                        en: 'Start and stop every trip in the app and then submit the note. The times are filled in automatically, and the app also works without signal.',
                    },
                    {
                        icon: 'Users',
                        label: { nl: 'Onderaannemers', en: 'Subcontractors' },
                        nl: 'Krijgen een eigen link om hun chauffeurs aan of af te melden.',
                        en: 'Get their own link to sign their drivers in or out.',
                    },
                ],
            },
            {
                type: 'paragraph',
                nl: "Ook 's nachts werkt het platform door: het dient vergeten bonnen zelf in en voegt bonnen samen die in stukken werden ingediend.",
                en: 'The platform also keeps working at night: it submits forgotten notes on its own and merges notes that were submitted in parts.',
            },
            {
                type: 'quote',
                nl: 'Voor de chauffeurs is het een hele stap vooruit, nu moeten ze geen grondbankbons meer schrijven en is ook alles voor de administratie gemakkelijker geworden!',
                en: 'For the drivers it is a real step forward: they no longer have to write out soil transport notes, and everything has become easier for the office too!',
                source: {
                    nl: 'Alain Vangeebergen, planner bij Croes NV',
                    en: 'Alain Vangeebergen, planner at Croes NV',
                },
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Resultaat',
                en: 'Result',
            },
            {
                type: 'paragraph',
                nl: 'In september 2026 werkten 35 chauffeurs van Croes en 106 chauffeurs van 18 onderaannemers met de app.',
                en: 'In September 2026, 35 Croes drivers and 106 drivers from 18 subcontractors were working with the app.',
            },
            {
                type: 'table',
                nl: {
                    head: ['', 'Vroeger', 'Nu'],
                    rows: [
                        ['Bon invullen', 'Met de hand, op papier', 'Rit starten en stoppen in de app'],
                        ['Bon op kantoor', 'Soms pas na weken', 'Meteen, en er gaan er geen meer verloren'],
                        ['Verwerking', 'Alles overtypen', 'Niets meer overtypen'],
                        ['Onderaannemers', 'Via de telefoon', 'Melden hun chauffeurs zelf aan'],
                        ['Overzicht', 'Geen live zicht', 'Live per werf'],
                    ],
                },
                en: {
                    head: ['', 'Before', 'Now'],
                    rows: [
                        ['Filling in a note', 'By hand, on paper', 'Starting and stopping a trip in the app'],
                        ['Note at the office', 'Sometimes only after weeks', 'Right away, and none get lost any more'],
                        ['Processing', 'Retyping everything', 'Nothing left to retype'],
                        ['Subcontractors', 'By phone', 'Sign in their own drivers'],
                        ['Overview', 'No live view', 'Live per site'],
                    ],
                },
            },
        ],
    },
    {
        slug: 'am-group',
        client: 'A&M Group',
        logo: amGroupLogo,
        status: 'live',
        sector: { nl: 'Automotive', en: 'Automotive' },
        title: {
            nl: 'Van twee Excels naar één transportplatform bij A&M Group',
            en: 'From two spreadsheets to one transport platform at A&M Group',
        },
        description: {
            nl: 'De planning van het wagentransport tussen de vestigingen liep via twee Excels en kostte de planner ongeveer vier uur per dag. Met een eigen platform en chauffeursapp volgt nu iedereen hetzelfde transport, van aanvraag tot aflevering.',
            en: 'Planning vehicle transport between the branches ran through two spreadsheets and took the planner about four hours a day. With a dedicated platform and driver app, everyone now follows each transport in the same place, from request to delivery.',
        },
        blocks: [
            {
                type: 'heading',
                nl: 'Uitgangspunt',
                en: 'Starting point',
            },
            {
                type: 'paragraph',
                nl: 'A&M Group is een automobielgroep uit Hasselt, met meer dan 850 medewerkers en 58 showrooms in Limburg, Vlaams-Brabant en Maastricht. Wagens moeten regelmatig van de ene vestiging naar de andere. De afdeling A&M Car Rental regelt dat transport.',
                en: 'A&M Group is an automotive group from Hasselt, with more than 850 employees and 58 showrooms in Limburg, Flemish Brabant and Maastricht. Vehicles regularly have to move from one branch to another. The A&M Car Rental department arranges that transport.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Probleem',
                en: 'Problem',
            },
            {
                type: 'paragraph',
                nl: 'Alles liep via Excel en papier. Dat zorgde voor drie problemen:',
                en: 'Everything ran through spreadsheets and paper. That created three problems:',
            },
            {
                type: 'list',
                nl: [
                    'Veel handwerk: de planner bouwde elke namiddag de planning op in een tweede Excel, door te knippen en te plakken. Dat kostte ongeveer vier uur per dag.',
                    'Geen controle: in het gedeelde bestand met aanvragen kon iedereen alles aanpassen, en niemand zag wat er veranderd was.',
                    'Weinig zicht: vestigingen moesten zelf zoeken hoe het met hun aanvraag stond, en chauffeurs vertrokken met een afgedrukte planning. Veranderde er onderweg iets, dan bleef alleen de telefoon over.',
                ],
                en: [
                    'A lot of manual work: every afternoon the planner built the schedule in a second spreadsheet by cutting and pasting. That took about four hours a day.',
                    'No control: in the shared file with requests, anyone could change anything, and nobody could see what had changed.',
                    'Little visibility: branches had to look up the status of their own requests, and drivers set off with a printed schedule. If something changed on the way, the only option was to phone.',
                ],
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Oplossing',
                en: 'Solution',
            },
            {
                type: 'paragraph',
                nl: 'Samen met het team brachten we eerst in kaart hoe het transport dagelijks verloopt en waar het vastliep. Daarop bouwden we de A&M Transporttool, die sinds 1 oktober 2026 live staat. Ook die bestaat uit drie delen:',
                en: 'Together with the team, we first mapped out how transport runs day to day and where it got stuck. Based on that, we built the A&M Transport Tool, which has been live since 1 October 2026. It also consists of three parts:',
            },
            {
                type: 'cards',
                items: [
                    {
                        icon: 'Building2',
                        label: { nl: 'Vestigingen', en: 'Branches' },
                        nl: 'Vragen een transport aan via een formulier en volgen het in vijf stappen. Elke vestiging ziet alleen haar eigen aanvragen.',
                        en: 'Request a transport through a form and follow it in five steps. Each branch only sees its own requests.',
                    },
                    {
                        icon: 'CalendarDays',
                        label: { nl: 'Planner', en: 'Planner' },
                        nl: 'Sleept de aanvragen op een camion en een dag. Wie het langst wacht, staat vooraan in de wachtrij, en spoed gaat voor.',
                        en: 'Drags requests onto a truck and a day. Requests that have waited longest are at the front of the queue, and urgent ones go first.',
                    },
                    {
                        icon: 'Smartphone',
                        label: { nl: 'Chauffeurs', en: 'Drivers' },
                        nl: "Zien hun haltes in volgorde, melden met één tik geladen of gelost en nemen foto's van de wagen, ook zonder bereik.",
                        en: 'See their stops in order, report loaded or unloaded with one tap and take photos of the vehicle, even without a signal.',
                    },
                ],
            },
            {
                type: 'paragraph',
                nl: 'We rollen de app stap voor stap uit: eerst met één chauffeur, daarna komen de anderen erbij.',
                en: 'We are rolling out the app step by step: first with one driver, then the others will follow.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Resultaat',
                en: 'Result',
            },
            {
                type: 'table',
                nl: {
                    head: ['', 'Vroeger', 'Nu'],
                    rows: [
                        ['Aanvragen', 'In een gedeeld Excel-bestand', 'Via een formulier, per vestiging'],
                        ['Planning', 'Knippen en plakken tussen twee Excels', 'Slepen op een camion en een dag'],
                        ['Stand van zaken', 'Zelf zoeken in het bestand', 'Zelf volgen in de tool, zonder te bellen'],
                        ['Onderweg', 'Afgedrukte planning en telefoon', 'Een planning die bijgewerkt blijft in de app'],
                    ],
                },
                en: {
                    head: ['', 'Before', 'Now'],
                    rows: [
                        ['Requests', 'In a shared spreadsheet', 'Through a form, per branch'],
                        ['Scheduling', 'Cutting and pasting between two spreadsheets', 'Dragging onto a truck and a day'],
                        ['Status', 'Looking it up in the file', 'Tracked in the tool, no phone calls needed'],
                        ['On the road', 'Printed schedule and phone', 'A schedule that stays up to date in the app'],
                    ],
                },
            },
            {
                type: 'paragraph',
                nl: 'De tool legt ook elke stap en elke wijziging vast. Die gegevens dienen later voor een planningsvoorstel met AI.',
                en: 'The tool also records every step and every change. Later, that data will let AI suggest a schedule.',
            },
        ],
    },
];

export function getProjectBySlug(slug) {
    return projecten.find((p) => p.slug === slug && p.status === 'live');
}

// Voor de detailpagina: vindt een project ongeacht status, zodat een 'soon'
// project ook een eigen pagina kan tonen (met "binnenkort beschikbaar").
export function getAnyProjectBySlug(slug) {
    return projecten.find((p) => p.slug === slug);
}
