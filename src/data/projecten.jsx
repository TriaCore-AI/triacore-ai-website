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
//   blocks      — inhoud van de detailpagina, exact hetzelfde bloksysteem
//                 als resources (zie src/data/resources.jsx en
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
        sector: { nl: 'Bouw & grondwerken', en: 'Construction & earthworks' },
        title: {
            nl: 'Van papieren bonnen naar realtime overzicht bij Croes NV',
            en: 'From paper delivery notes to real time overview at Croes NV',
        },
        description: {
            nl: 'Chauffeurs vulden duizenden papieren bonnen per maand in, vaak onvolledig. TriaCore bouwde een planningsplatform en chauffeursapp die alles automatisch en correct vastlegt.',
            en: 'Drivers filled in thousands of paper delivery notes a month, often incomplete. TriaCore built a planning platform and driver app that captures everything automatically and accurately.',
        },
        blocks: [
            {
                type: 'heading',
                nl: 'Uitgangspunt',
                en: 'Starting point',
            },
            {
                type: 'paragraph',
                nl: 'Croes NV is actief in de grondverzet en afbraaksector en vervoert dagelijks grond tussen werven. Voor elk transport hoorde daar een grondbankbon bij: een document met herkomst, bestemming, vertrektijd, aankomsttijd en het vervoerde volume.',
                en: 'Croes NV is active in earthmoving and demolition and transports soil between sites every day. Every transport came with a soil transport note: a document listing origin, destination, departure time, arrival time and the volume transported.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Probleem',
                en: 'Problem',
            },
            {
                type: 'paragraph',
                nl: 'Die bon werd met de hand ingevuld op papier. Chauffeurs vulden hem niet altijd correct of volledig in, en sommigen lieten het gewoon achterwege. Het invullen zelf werd ook niet graag gedaan.',
                en: 'That note was filled in by hand on paper. Drivers did not always fill it in correctly or completely, and some skipped it altogether. Filling it in was not popular either.',
            },
            {
                type: 'paragraph',
                nl: 'Aan het einde van de maand kwamen honderden tot duizenden van die papieren bonnen bij de administratie terecht. Iemand moest elke bon lezen en manueel overtypen in Excel. Dat leverde drie concrete problemen op:',
                en: 'At the end of the month, hundreds to thousands of these paper notes ended up with the administration. Someone had to read every single note and manually retype it into a spreadsheet. That created three concrete problems:',
            },
            {
                type: 'list',
                nl: [
                    'Onvolledig: bonnen die niet of maar half werden ingevuld',
                    'Traag: duizenden bonnen per maand, één voor één manueel overgetypt',
                    'Onduidelijk: geen overzicht van wat er op een werf binnenkomt of vertrekt, of wie wat doet',
                ],
                en: [
                    'Incomplete: notes that were left blank or only half filled in',
                    'Slow: thousands of notes a month, retyped one by one',
                    'Unclear: no overview of what arrives or leaves a site, or who is doing what',
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
                nl: 'TriaCore digitaliseerde het volledige proces. De oplossing bestaat uit twee delen die op elkaar inspelen:',
                en: 'TriaCore digitised the entire process. The solution consists of two parts that work together:',
            },
            {
                type: 'cards',
                items: [
                    {
                        icon: 'Monitor',
                        label: { nl: 'Platform', en: 'Platform' },
                        nl: 'Planning maakt vanaf het desktopplatform taken aan voor elke chauffeur.',
                        en: 'Planning creates tasks for every driver from the desktop platform.',
                    },
                    {
                        icon: 'Smartphone',
                        label: { nl: 'Chauffeursapp', en: 'Driver app' },
                        nl: 'De chauffeur ziet zijn taak op zijn telefoon. Herkomst en bestemming staan er al automatisch in.',
                        en: 'The driver sees their task on their phone. Origin and destination are already filled in automatically.',
                    },
                ],
            },
            {
                type: 'paragraph',
                nl: 'De chauffeur moet zelf niets meer invullen. Bij vertrek klikt hij op start, bij aankomst dient hij de bon in. Tijdstip en volume worden meteen correct geregistreerd.',
                en: 'The driver no longer fills in anything themselves. They tap start when departing and submit the note on arrival. Time and volume are registered correctly right away.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Resultaat',
                en: 'Result',
            },
            {
                type: 'paragraph',
                nl: 'Er is geen papier meer, en vooral de administratie wint enorm veel tijd: bonnen zoeken en overtypen is verleden tijd. De data die binnenkomt, is bovendien veel correcter. Het verschil tussen vroeger en nu, naast elkaar:',
                en: 'There is no more paper, and the administration in particular gains a huge amount of time: searching for and retyping notes is a thing of the past. The data that comes in is also far more accurate. Before and after, side by side:',
            },
            {
                type: 'table',
                nl: {
                    head: ['', 'Voor', 'Na'],
                    rows: [
                        ['Registratie', 'Papieren bon, met de hand', 'Eén klik in de chauffeursapp'],
                        ['Verwerking', 'Manueel overgetypt in Excel', 'Automatisch beschikbaar in het systeem'],
                        ['Overzicht per werf', 'Niet mogelijk', 'Realtime inzicht in volume en planning'],
                    ],
                },
                en: {
                    head: ['', 'Before', 'After'],
                    rows: [
                        ['Registration', 'Paper note, by hand', 'One tap in the driver app'],
                        ['Processing', 'Manually retyped into a spreadsheet', 'Automatically available in the system'],
                        ['Overview per site', 'Not possible', 'Real time view of volume and planning'],
                    ],
                },
            },
            {
                type: 'paragraph',
                nl: 'Die duidelijkheid reikt verder dan de administratie zelf. Omdat elke transactie meteen correct geregistreerd staat, kan Croes NV klanten sneller en preciezer informeren over hoever een werf staat. Intern levert diezelfde data meer overzicht op, wat het weer makkelijker maakt om werven en chauffeurs efficiënt in te plannen.',
                en: 'That clarity reaches further than the administration alone. Because every transaction is registered correctly right away, Croes NV can inform clients faster and more precisely about the progress of a site. Internally, that same data provides more overview, which in turn makes it easier to plan sites and drivers efficiently.',
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
            nl: 'Een schaalbaar fundament voor A&M Group',
            en: 'A scalable foundation for A&M Group',
        },
        description: {
            nl: 'Meer volume vroeg om een fundament dat mee kan groeien. Dat fundament bouwden we samen.',
            en: 'More volume called for a foundation that could grow with it. We built that foundation together.',
        },
        blocks: [
            {
                type: 'heading',
                nl: 'Uitgangspunt',
                en: 'Starting point',
            },
            {
                type: 'paragraph',
                nl: 'A&M Group groeit hard in de automotive sector: meer volume, meer transporten, meer processen die op elkaar afgestemd moeten blijven. AI kon daar duidelijk iets betekenen, maar A&M Group wilde niet zomaar beginnen bouwen zonder eerst goed te weten waar AI concreet iets zou opleveren.',
                en: 'A&M Group is growing fast in the automotive sector: more volume, more transports, more processes that need to stay aligned. AI could clearly play a role in that, but A&M Group did not want to start building without first knowing exactly where AI would actually pay off.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Probleem',
                en: 'Problem',
            },
            {
                type: 'paragraph',
                nl: 'Veel bedrijven starten met AI op basis van een aanname: een tool die ergens anders goed werkte, een idee dat aansprak, een trend die voorbijkwam. Zonder zicht op de eigen processen is het risico groot dat je bouwt op veronderstellingen in plaats van op wat er echt nodig is. Dat risico wilde A&M Group vermijden voor er één lijn code werd geschreven.',
                en: 'Many companies start with AI based on an assumption: a tool that worked well elsewhere, an idea that sounded appealing, a trend that passed by. Without insight into your own processes, there is a real risk of building on assumptions instead of on what is actually needed. A&M Group wanted to avoid that risk before a single line of code was written.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Aanpak',
                en: 'Approach',
            },
            {
                type: 'paragraph',
                nl: 'TriaCore voerde daarom eerst een concrete procesanalyse uit. We gingen samenzitten met het team van A&M Group, bekeken hoe ze dagelijks werken, en brachten in kaart waar de knelpunten zaten en waar AI effectief opportuniteiten bood.',
                en: 'TriaCore therefore started with a concrete process analysis. We sat down with the A&M Group team, looked at how they work day to day, and mapped out where the bottlenecks were and where AI genuinely offered opportunities.',
            },
            {
                type: 'cards',
                items: [
                    {
                        icon: 'Cog',
                        label: { nl: 'Analyse', en: 'Analysis' },
                        nl: 'Samen met het team keken we naar de bestaande processen en waar die vastlopen of tijd kosten.',
                        en: 'Together with the team we looked at the existing processes and where they stall or cost time.',
                    },
                    {
                        icon: 'Layers',
                        label: { nl: 'Roadmap', en: 'Roadmap' },
                        nl: 'Op basis daarvan werkten we een concrete roadmap uit: wat we gaan bouwen, in welke volgorde, en waarom.',
                        en: 'Based on that, we worked out a concrete roadmap: what to build, in what order, and why.',
                    },
                ],
            },
            {
                type: 'paragraph',
                nl: 'Zo bouwen we niet op aannames, maar op wat er echt speelt bij A&M Group. Dat is de basis voor oplossingen die renderen en die op lange termijn blijven werken.',
                en: 'This way we build on what is actually happening at A&M Group, not on assumptions. That is the basis for solutions that pay off and keep working in the long run.',
            },
            { type: 'divider' },
            {
                type: 'heading',
                nl: 'Resultaat',
                en: 'Result',
            },
            {
                type: 'paragraph',
                nl: 'De analyse leverde een duidelijke roadmap op: concrete stappen, in de juiste volgorde, gebaseerd op wat het meeste oplevert voor A&M Group. Op basis daarvan zijn we intussen gestart met de bouw van de eerste oplossingen.',
                en: 'The analysis resulted in a clear roadmap: concrete steps, in the right order, based on what delivers the most value for A&M Group. Building on that, we have since started building the first solutions.',
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
