// =============================================================
// TWEEDE BREIN: de gesprekken met de AI in de demo
// =============================================================
// Geschreven, geen echte AI. Wie het chatvenster opent, kiest een van de drie vragen (pillen). Dan speelt
// het gesprek af: de vraag wordt getypt en verstuurd, de AI zegt wat ze gaat doen, doorloopt een paar
// stappen (en leest of bewerkt daarbij notities uit het tweede brein) en schrijft dan het antwoord,
// met de bronnen erbij.
// Drie heel verschillende dingen die een tweede brein mogelijk maakt:
// 1. iets maken (een offerte) uit de werkwijze, de prijzen en wat de klant vroeg
// 2. een gesprek voorbereiden uit de hele geschiedenis met een klant
// 3. het tweede brein zelf bijhouden: de inbox verwerken en alles op de juiste plaats zetten
// Alles komt uit de notities van Jan (src/data/tweede-brein-demo.js). Klopt een bedrag of een afspraak
// niet meer met de notities, pas dan beide aan.
//
// Een stap heeft `gelezen` (notities die de AI leest) en/of `bewerkt` (notities die de AI aanpast).
// In het antwoord maakt **tekst** de tekst vet. Een blok is een alinea (p), een tussentitel (h) of een
// opsomming (ul).
// =============================================================

const t = (nl, en) => ({ nl, en });

export const gesprekken = [
    {
        id: 'offerte',
        // Een gewone vraag, zoals je ze aan ChatGPT of Claude stelt: zonder te zeggen waar het moet kijken
        vraag: t('Maak een offerte op voor Greenfield.', 'Draft a quote for Greenfield.'),
        intro: t(
            'Ik zoek eerst op hoe u een offerte opbouwt en wat er in uw notities over Greenfield staat.',
            'Let me first check how you put a quote together and what your notes say about Greenfield.'
        ),
        stappen: [
            { tekst: t('Ik haal uw werkwijze voor offertes op', 'Fetching how you write quotes'), gelezen: ['offerte-maken', 'claude'] },
            { tekst: t('Ik haal alle gegevens over Greenfield op', 'Fetching everything about Greenfield'), gelezen: ['greenfield', 'offerte-greenfield'] },
            { tekst: t('Ik kijk of er nieuws over Greenfield in de inbox staat', 'Checking the inbox for news about Greenfield'), gelezen: ['belletje-greenfield'] },
            { tekst: t('Ik haal de prijzen en de kortingsregels op', 'Fetching the prices and discount rules'), gelezen: ['prijslijst', 'kortingsregels'] }
        ],
        antwoord: [
            { type: 'p', text: t(
                'Hier is een voorstel voor de offerte van **Greenfield**, opgebouwd volgens uw werkwijze en de **Prijslijst 2026**.',
                'Here is a draft of the quote for **Greenfield**, built the way you write quotes and based on the **Price list 2026**.'
            ) },
            { type: 'h', text: t('Offerte Greenfield', 'Greenfield quote') },
            { type: 'ul', items: [
                t('**20 zit-sta-bureaus** × € 690 = € 13.800', '**20 sit-stand desks** × € 690 = € 13,800'),
                t('**20 Premium-stoelen** × € 420 = € 8.400', '**20 Premium chairs** × € 420 = € 8,400'),
                t('**Montage:** een halfuur per bureau, 10 uur in totaal', '**Assembly:** half an hour per desk, 10 hours in total')
            ] },
            { type: 'p', text: t('**Totaal: € 22.200**, nog zonder korting.', '**Total: € 22,200**, before discount.') },
            { type: 'h', text: t('Om op te letten', 'Worth noting') },
            { type: 'ul', items: [
                t('**Korting:** tot 5% mag u zelf geven. Greenfield is geen vaste klant, dus de standaard 3% geldt niet.',
                    '**Discount:** you can give up to 5% yourself. Greenfield is not a regular client, so the standard 3% does not apply.'),
                t('**Stoelen:** die vroeg Sarah pas in het belletje van 27/10. Dat staat nog in de inbox.',
                    '**Chairs:** Sarah only asked for them in the call on 27/10. That note is still in the inbox.'),
                t('**Timing:** de offerte moet tegen vrijdag weg, de CFO beslist eind november. Volg na een week op.',
                    '**Timing:** the quote has to go out by Friday, the CFO decides at the end of November. Follow up after a week.')
            ] },
            { type: 'p', text: t('Zal ik ze in het sjabloon van de huisstijl zetten?', 'Shall I put it in the house style template?') }
        ],
        bronnen: ['offerte-maken', 'greenfield', 'offerte-greenfield', 'belletje-greenfield', 'prijslijst', 'kortingsregels']
    },
    {
        id: 'gesprek',
        vraag: t('Bereid mijn gesprek met Studio Noord voor.', 'Prepare my meeting with Studio Noord.'),
        intro: t(
            'Ik zet op een rij wat u al weet over Studio Noord, wat er vroeger gebeurd is en wat er nu loopt.',
            'Let me put together what you already know about Studio Noord, what happened before and what is going on now.'
        ),
        stappen: [
            { tekst: t('Ik haal het dossier van Studio Noord op', 'Fetching the Studio Noord record'), gelezen: ['studio-noord', 'kantoor-studio-noord'] },
            { tekst: t('Ik bekijk de vorige offerte', 'Looking at the previous quote'), gelezen: ['offerte-studio-noord-2025'] },
            { tekst: t('Ik kijk waar ze in de pipeline staan', 'Checking where they are in the pipeline'), gelezen: ['pipeline'] },
            { tekst: t('Ik reken een richtprijs uit', 'Working out an indicative price'), gelezen: ['prijslijst', 'ergomax'] }
        ],
        antwoord: [
            { type: 'p', text: t(
                'Hier is een korte voorbereiding voor uw gesprek met **Studio Noord**.',
                'Here is a short briefing for your meeting with **Studio Noord**.'
            ) },
            { type: 'h', text: t('Wie ze zijn', 'Who they are') },
            { type: 'ul', items: [
                t('**Architectenbureau** dat in het voorjaar naar een nieuw kantoor verhuist.',
                    '**Architecture firm** moving to a new office in the spring.'),
                t('**Klant sinds maart 2025:** toen keurden ze een offerte voor acht werkplekken goed.',
                    '**Client since March 2025:** they approved a quote for eight workstations back then.')
            ] },
            { type: 'h', text: t('Waar het nu over gaat', 'What it is about now') },
            { type: 'ul', items: [
                t('**Twaalf werkplekken** voor het nieuwe kantoor, vier meer dan vorig jaar.',
                    '**Twelve workstations** for the new office, four more than last year.'),
                t('**Richtprijs: € 13.320** voor twaalf zit-sta-bureaus en twaalf Premium-stoelen.',
                    '**Indicative price: € 13,320** for twelve sit-stand desks and twelve Premium chairs.')
            ] },
            { type: 'h', text: t('Om te vragen', 'Worth asking') },
            { type: 'ul', items: [
                t('**Wanneer ze verhuizen.** Ergomax levert de stoelen binnen vier weken, dus bestel op tijd.',
                    '**When they move.** Ergomax delivers the chairs within four weeks, so order in time.'),
                t('**Wie er mee beslist.** Dat staat nog niet in het dossier.',
                    '**Who else decides.** That is not in the record yet.')
            ] },
            { type: 'p', text: t('Zal ik na het gesprek een verslag maken volgens uw template?', 'Shall I write up the meeting notes with your template afterwards?') }
        ],
        bronnen: ['studio-noord', 'kantoor-studio-noord', 'offerte-studio-noord-2025', 'pipeline', 'prijslijst', 'ergomax']
    },
    {
        id: 'inbox',
        vraag: t('Verwerk mijn inbox.', 'Process my inbox.'),
        intro: t(
            'Ik bekijk wat er in uw inbox staat en zet alles op de juiste plaats, volgens de regels in uw tweede brein.',
            'Let me see what is in your inbox and put everything in the right place, following the rules in your second brain.'
        ),
        stappen: [
            { tekst: t('Ik lees wat er in de inbox staat', 'Reading what is in the inbox'), gelezen: ['belletje-greenfield', 'idee-beursstand'] },
            { tekst: t('Ik haal de regels en de templates op', 'Fetching the rules and templates'), gelezen: ['claude', 'tpl-meeting'] },
            { tekst: t('Ik werk het dossier en de offerte van Greenfield bij', 'Updating the Greenfield record and quote'), bewerkt: ['greenfield', 'offerte-greenfield'] },
            { tekst: t('Ik zet het idee bij de beursstand', 'Adding the idea to the trade fair stand'), bewerkt: ['beursstand-2027'] }
        ],
        antwoord: [
            { type: 'p', text: t(
                'Uw inbox is leeg. Ik heb **twee notities** verwerkt en op de juiste plaats gezet.',
                'Your inbox is empty. I processed **two notes** and put them in the right place.'
            ) },
            { type: 'h', text: t('Belletje Greenfield', 'Call with Greenfield') },
            { type: 'ul', items: [
                t('**Verslag** gemaakt volgens uw template Meetingverslag.', '**Notes** written with your Meeting notes template.'),
                t('**Offerte Greenfield** aangevuld met twintig Premium-stoelen.', '**Greenfield quote** updated with twenty Premium chairs.'),
                t('**Dossier Greenfield** bijgewerkt: de CFO beslist eind november.', '**Greenfield record** updated: the CFO decides at the end of November.')
            ] },
            { type: 'h', text: t('Idee voor de beursstand', 'Idea for the trade fair stand') },
            { type: 'ul', items: [
                t('**Toegevoegd** aan het project Beursstand 2027, met de vraag om samen met Ergomax hun nieuwe stoel te tonen.',
                    '**Added** to the Trade fair stand 2027 project, with the idea of showing the new Ergomax chair together.')
            ] },
            { type: 'p', text: t('Zal ik de offerte voor Greenfield meteen opmaken?', 'Shall I draft the Greenfield quote right away?') }
        ],
        bronnen: ['belletje-greenfield', 'idee-beursstand', 'greenfield', 'offerte-greenfield', 'beursstand-2027', 'tpl-meeting']
    }
];
