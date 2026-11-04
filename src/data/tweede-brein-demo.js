// =============================================================
// TWEEDE BREIN: de inhoud van de demo op de pagina Tweede brein
// =============================================================
// Een verzonnen voorbeeld: het tweede brein van Jan Peeters, verkoper bij Werkplek Pro (ons fictieve
// demobedrijf). Nooit data van echte klanten.
//
// MAPPEN: de vaste categorieën van een tweede brein. Een kind is een notitie (id) of een submap (object).
// NOTITIES: per id een titel, metadata (zoals de frontmatter bovenaan een notitie) en tekst.
// In de tekst verwijst [[id]] naar een andere notitie. Die verwijzingen worden de lijnen in de verbanden.
// =============================================================

const t = (nl, en) => ({ nl, en });

export const mappen = [
    { id: 'inbox', nr: '00', name: t('Inbox', 'Inbox'), children: ['belletje-greenfield', 'idee-beursstand'] },
    { id: 'projecten', nr: '10', name: t('Projecten', 'Projects'), children: ['offerte-greenfield', 'kantoor-studio-noord', 'beursstand-2027'] },
    { id: 'dossiers', nr: '20', name: t('Dossiers', 'Records'), children: [
        { id: 'klanten', name: t('Klanten', 'Clients'), children: ['greenfield', 'studio-noord', 'bakkerij-vermeulen'] },
        { id: 'leveranciers', name: t('Leveranciers', 'Suppliers'), children: ['ergomax'] }
    ] },
    { id: 'lopend', nr: '30', name: t('Lopend werk', 'Ongoing work'), children: ['leadopvolging', 'pipeline'] },
    { id: 'kennis', nr: '40', name: t('Kennis', 'Knowledge'), children: ['prijslijst', 'kortingsregels', 'offerte-maken'] },
    { id: 'archief', nr: '50', name: t('Archief', 'Archive'), children: ['offerte-studio-noord-2025'] }
];

// Onder een dunne lijn: wat niemand zelf invult
export const systeemMappen = [
    'index',
    { id: 'bijlagen', name: t('Bijlagen', 'Attachments'), children: ['prijslijst-pdf', 'plattegrond-greenfield'] },
    { id: 'templates', name: t('Templates', 'Templates'), children: ['tpl-meeting', 'tpl-dossier'] },
    'claude'
];

const TYPE = t('Type', 'Type');
const STATUS = t('Status', 'Status');
const DATUM = t('Datum', 'Date');
const KLANT = t('Klant', 'Client');

export const notities = {
    index: {
        title: t('Index', 'Index'),
        meta: [[TYPE, t('Overzicht', 'Overview')]],
        body: [
            t('Het overzicht van dit tweede brein. Nog te verwerken: [[belletje-greenfield]] en [[idee-beursstand]].',
                'The overview of this second brain. To process: [[belletje-greenfield]] and [[idee-beursstand]].'),
            t('Lopende projecten: [[offerte-greenfield]], [[kantoor-studio-noord]] en [[beursstand-2027]].',
                'Ongoing projects: [[offerte-greenfield]], [[kantoor-studio-noord]] and [[beursstand-2027]].'),
            t('Klanten: [[greenfield]], [[studio-noord]] en [[bakkerij-vermeulen]]. Elke week: [[leadopvolging]] en de [[pipeline]].',
                'Clients: [[greenfield]], [[studio-noord]] and [[bakkerij-vermeulen]]. Every week: [[leadopvolging]] and the [[pipeline]].'),
            t('Kennis: [[prijslijst]], [[kortingsregels]] en [[offerte-maken]]. Regels voor de AI: [[claude]].',
                'Knowledge: [[prijslijst]], [[kortingsregels]] and [[offerte-maken]]. Rules for the AI: [[claude]].')
        ]
    },
    'belletje-greenfield': {
        title: t('Belletje Greenfield', 'Call with Greenfield'),
        meta: [[TYPE, t('Inbox', 'Inbox')], [DATUM, '27/10/2026'], [STATUS, t('Nog te verwerken', 'To process')]],
        body: [
            t('Sarah van [[greenfield]] belde. Ze willen ook twintig Premium-stoelen in de [[offerte-greenfield]].',
                'Sarah from [[greenfield]] called. They also want twenty Premium chairs in the [[offerte-greenfield]].'),
            t('De CFO beslist eind november. Prijs van de stoelen nakijken in de [[prijslijst]], verslag volgens het [[tpl-meeting]].',
                'The CFO decides at the end of November. Check the chair price in the [[prijslijst]], notes based on the [[tpl-meeting]].')
        ]
    },
    'idee-beursstand': {
        title: t('Idee voor de beursstand', 'Idea for the trade fair stand'),
        meta: [[TYPE, t('Inbox', 'Inbox')], [DATUM, '21/10/2026']],
        body: [
            t('Een stand met zit-sta-bureaus waar bezoekers zelf aan kunnen werken. Voor de [[beursstand-2027]].',
                'A stand with sit-stand desks where visitors can work themselves. For the [[beursstand-2027]].'),
            t('Misschien samen met [[ergomax]] hun nieuwe stoel tonen.', 'Perhaps show their new chair together with [[ergomax]].')
        ]
    },
    'offerte-greenfield': {
        title: t('Offerte Greenfield', 'Greenfield quote'),
        meta: [[TYPE, t('Project', 'Project')], [KLANT, 'Greenfield'], [STATUS, t('Actief', 'Active')], [DATUM, t('Tegen vrijdag', 'By Friday')]],
        body: [
            t('Twintig zit-sta-bureaus en twintig Premium-stoelen voor het nieuwe kantoor van [[greenfield]].',
                'Twenty sit-stand desks and twenty Premium chairs for the new office of [[greenfield]].'),
            t('Prijzen uit de [[prijslijst]], korting volgens de [[kortingsregels]]. Werkwijze: [[offerte-maken]].',
                'Prices from the [[prijslijst]], discount according to the [[kortingsregels]]. Method: [[offerte-maken]].'),
            t('Plattegrond: [[plattegrond-greenfield]]. Stoelen via [[ergomax]]. Staat in de [[pipeline]].',
                'Floor plan: [[plattegrond-greenfield]]. Chairs via [[ergomax]]. Listed in the [[pipeline]].')
        ]
    },
    'kantoor-studio-noord': {
        title: t('Nieuw kantoor Studio Noord', 'New office Studio Noord'),
        meta: [[TYPE, t('Project', 'Project')], [KLANT, 'Studio Noord'], [STATUS, t('Actief', 'Active')]],
        body: [
            t('Inrichting van het nieuwe kantoor, voor twaalf werkplekken. Zie het dossier [[studio-noord]].',
                'Fitting out the new office, for twelve workstations. See the record [[studio-noord]].'),
            t('Vorige offerte: [[offerte-studio-noord-2025]]. Prijzen uit de [[prijslijst]], werkwijze in [[offerte-maken]].',
                'Previous quote: [[offerte-studio-noord-2025]]. Prices from the [[prijslijst]], method in [[offerte-maken]].')
        ]
    },
    'beursstand-2027': {
        title: t('Beursstand 2027', 'Trade fair stand 2027'),
        meta: [[TYPE, t('Project', 'Project')], [STATUS, t('Gepland', 'Planned')], [DATUM, t('Maart 2027', 'March 2027')]],
        body: [
            t('Ideeën staan in het [[idee-beursstand]]. Nieuwe leads gaan naar de [[leadopvolging]].',
                'Ideas are in the [[idee-beursstand]]. New leads go to [[leadopvolging]].'),
            t('Demostoelen van [[ergomax]], beursprijzen volgens de [[kortingsregels]].',
                'Demo chairs from [[ergomax]], fair prices according to the [[kortingsregels]].')
        ]
    },
    greenfield: {
        title: t('Greenfield', 'Greenfield'),
        meta: [[TYPE, t('Dossier klant', 'Client record')], [t('Sector', 'Sector'), t('Logistiek', 'Logistics')], [t('Contact', 'Contact'), 'Sarah Claes']],
        body: [
            t('Logistiek bedrijf met tachtig medewerkers. Sarah Claes beslist mee over de aankoop.',
                'Logistics company with eighty employees. Sarah Claes is involved in purchasing.'),
            t('Lopend: [[offerte-greenfield]]. Laatste contact: [[belletje-greenfield]]. Kortingsafspraken: [[kortingsregels]].',
                'Ongoing: [[offerte-greenfield]]. Last contact: [[belletje-greenfield]]. Discount agreements: [[kortingsregels]].')
        ]
    },
    'studio-noord': {
        title: t('Studio Noord', 'Studio Noord'),
        meta: [[TYPE, t('Dossier klant', 'Client record')], [t('Sector', 'Sector'), t('Architectuur', 'Architecture')]],
        body: [
            t('Architectenbureau dat in het voorjaar verhuist. Project: [[kantoor-studio-noord]].',
                'Architecture firm moving in the spring. Project: [[kantoor-studio-noord]].'),
            t('Eerste offerte: [[offerte-studio-noord-2025]]. Staat in de [[pipeline]].',
                'First quote: [[offerte-studio-noord-2025]]. Listed in the [[pipeline]].')
        ]
    },
    'bakkerij-vermeulen': {
        title: t('Bakkerij Vermeulen', 'Bakkerij Vermeulen'),
        meta: [[TYPE, t('Dossier klant', 'Client record')], [t('Klant sinds', 'Client since'), '2023']],
        body: [
            t('Vaste klant. Bestelt elk najaar nieuwe stoelen voor de winkel. Staat in de [[pipeline]].',
                'Regular client. Orders new chairs for the shop every autumn. Listed in the [[pipeline]].'),
            t('Korting volgens de [[kortingsregels]], stoelen van [[ergomax]].',
                'Discount according to the [[kortingsregels]], chairs from [[ergomax]].')
        ]
    },
    ergomax: {
        title: t('Ergomax', 'Ergomax'),
        meta: [[TYPE, t('Dossier leverancier', 'Supplier record')], [t('Levertermijn', 'Lead time'), t('Vier weken', 'Four weeks')]],
        body: [
            t('Leverancier van de Premium-stoelen. Prijzen in de [[prijslijst]].',
                'Supplier of the Premium chairs. Prices in the [[prijslijst]].')
        ]
    },
    leadopvolging: {
        title: t('Leadopvolging', 'Lead follow-up'),
        meta: [[TYPE, t('Lopend werk', 'Ongoing work')], [t('Wanneer', 'When'), t('Elke maandag', 'Every Monday')]],
        body: [
            t('Nieuwe leads bellen binnen twee dagen. Leads van de [[beursstand-2027]] krijgen voorrang.',
                'Call new leads within two days. Leads from the [[beursstand-2027]] get priority.'),
            t('Overzicht in de [[pipeline]]. Elk gesprek krijgt een verslag volgens het [[tpl-meeting]].',
                'Overview in the [[pipeline]]. Every conversation gets notes based on the [[tpl-meeting]].')
        ]
    },
    pipeline: {
        title: t('Pipeline per week', 'Weekly pipeline'),
        meta: [[TYPE, t('Lopend werk', 'Ongoing work')], [t('Wanneer', 'When'), t('Elke vrijdag', 'Every Friday')]],
        body: [
            t('Alle open offertes op een rij: [[offerte-greenfield]] en [[kantoor-studio-noord]]. Vaste klanten: [[bakkerij-vermeulen]].',
                'All open quotes in one list: [[offerte-greenfield]] and [[kantoor-studio-noord]]. Regular clients: [[bakkerij-vermeulen]].')
        ]
    },
    prijslijst: {
        title: t('Prijslijst 2026', 'Price list 2026'),
        meta: [[TYPE, t('Kennis', 'Knowledge')], [t('Geldig tot', 'Valid until'), '31/12/2026']],
        body: [
            t('Zit-sta-bureau € 690. Premium-stoel € 420, via [[ergomax]]. Montage: een halfuur per bureau.',
                'Sit-stand desk € 690. Premium chair € 420, via [[ergomax]]. Assembly: half an hour per desk.'),
            t('Origineel: [[prijslijst-pdf]].', 'Original: [[prijslijst-pdf]].')
        ]
    },
    kortingsregels: {
        title: t('Kortingsregels', 'Discount rules'),
        meta: [[TYPE, t('Kennis', 'Knowledge')]],
        body: [
            t('Tot 5% korting mag de verkoper zelf geven. Daarboven beslist de manager.',
                'Sales can give up to 5% discount themselves. Above that, the manager decides.'),
            t('Vaste klanten zoals [[bakkerij-vermeulen]] krijgen standaard 3%.',
                'Regular clients such as [[bakkerij-vermeulen]] get 3% by default.')
        ]
    },
    'offerte-maken': {
        title: t('Zo maken we een offerte', 'How we write a quote'),
        meta: [[TYPE, t('Kennis', 'Knowledge')]],
        body: [
            t('Prijzen komen uit de [[prijslijst]], de korting volgt de [[kortingsregels]]. Altijd in het sjabloon van de huisstijl.',
                'Prices come from the [[prijslijst]], the discount follows the [[kortingsregels]]. Always in the house style template.'),
            t('Na een week volgen we op, via de [[leadopvolging]]. Een goed voorbeeld: [[offerte-studio-noord-2025]].',
                'We follow up after a week, through [[leadopvolging]]. A good example: [[offerte-studio-noord-2025]].')
        ]
    },
    'offerte-studio-noord-2025': {
        title: t('Offerte Studio Noord 2025', 'Studio Noord quote 2025'),
        meta: [[TYPE, t('Project', 'Project')], [KLANT, 'Studio Noord'], [STATUS, t('Afgerond', 'Completed')]],
        body: [
            t('Acht werkplekken, goedgekeurd in maart 2025. Dossier: [[studio-noord]].',
                'Eight workstations, approved in March 2025. Record: [[studio-noord]].')
        ]
    },
    'prijslijst-pdf': {
        title: t('Prijslijst 2026.pdf', 'Price list 2026.pdf'),
        meta: [[TYPE, t('Bijlage', 'Attachment')]],
        body: [
            t('Het originele bestand van de leverancier. De leesbare versie staat in de [[prijslijst]].',
                'The original file from the supplier. The readable version is in the [[prijslijst]].')
        ]
    },
    'plattegrond-greenfield': {
        title: t('Plattegrond Greenfield.png', 'Floor plan Greenfield.png'),
        meta: [[TYPE, t('Bijlage', 'Attachment')]],
        body: [
            t('De plattegrond van het nieuwe kantoor van [[greenfield]], met de plaats van de bureaus.',
                'The floor plan of the new office of [[greenfield]], with the position of the desks.')
        ]
    },
    'tpl-meeting': {
        title: t('Meetingverslag', 'Meeting notes'),
        meta: [[TYPE, t('Template', 'Template')]],
        body: [
            t('Vaste opbouw: datum, aanwezigen, wat besproken is, afspraken en de volgende stap.',
                'Fixed structure: date, attendees, what was discussed, agreements and the next step.')
        ]
    },
    'tpl-dossier': {
        title: t('Dossier', 'Record'),
        meta: [[TYPE, t('Template', 'Template')]],
        body: [
            t('Vaste opbouw: wie, sector, contactpersoon, lopende projecten en historiek.',
                'Fixed structure: who, sector, contact person, ongoing projects and history.')
        ]
    },
    claude: {
        title: t('CLAUDE.md', 'CLAUDE.md'),
        meta: [[TYPE, t('Regels voor de AI', 'Rules for the AI')]],
        body: [
            t('Nieuwe informatie komt eerst in de inbox. Een nieuwe klant krijgt een dossier volgens de template [[tpl-dossier]].',
                'New information goes to the inbox first. A new client gets a record based on the template [[tpl-dossier]].'),
            t('Bedragen komen altijd uit de [[prijslijst]], nooit uit het geheugen. Offertes volgen [[offerte-maken]] en de [[kortingsregels]].',
                'Amounts always come from the [[prijslijst]], never from memory. Quotes follow [[offerte-maken]] and the [[kortingsregels]].'),
            t('Een verslag volgt het [[tpl-meeting]]. Begin altijd bij de [[index]].',
                'Notes follow the [[tpl-meeting]]. Always start at the [[index]].')
        ]
    }
};

// Alle verwijzingen als paren [van, naar], elk paar één keer
const LINK = /\[\[([a-z0-9-]+)\]\]/g;
export const verbanden = (() => {
    const seen = new Set();
    const pairs = [];
    Object.entries(notities).forEach(([from, n]) => {
        n.body.forEach((p) => {
            for (const m of p.nl.matchAll(LINK)) {
                const to = m[1];
                const key = [from, to].sort().join('|');
                if (to !== from && notities[to] && !seen.has(key)) {
                    seen.add(key);
                    pairs.push([from, to]);
                }
            }
        });
    });
    return pairs;
})();

// Waar een notitie staat, als lijst van mapnamen (voor het kruimelpad boven een notitie)
export const mapVan = (() => {
    const map = {};
    const walk = (items, trail) => items.forEach((item) => {
        if (typeof item === 'string') map[item] = trail;
        else walk(item.children, [...trail, item.name]);
    });
    walk([...mappen, ...systeemMappen], []);
    return map;
})();
