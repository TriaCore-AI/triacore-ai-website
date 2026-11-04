// =============================================================
// KLANTEN: alles wat als klantkaart getoond wordt
// =============================================================
// De projecten (met eigen casepagina) staan in projecten.jsx. Hier komen de klanten voor wie we een
// workshop gaven bij; die hebben geen eigen casepagina en linken naar de workshoppagina.
// klantKaarten() geeft de volledige lijst voor de homepage en de projectenpagina, zodat beide
// altijd hetzelfde tonen. Nieuwe workshopklant? Voeg een object toe aan workshopKlanten, met een eigen omschrijving.
//
// Elke kaart heeft een of meer soorten oplossing (types). De filters op de projectenpagina staan tijdelijk
// uit (te weinig klanten); de gegevens blijven hier staan om ze later terug aan te zetten:
//   'custom' (custom tool), 'workshop', 'begeleiding' (AI-begeleiding).
// Projecten zijn standaard 'custom'; geef een project een eigen `types` als dat anders is.
// =============================================================

import { projecten } from './projecten';
import medtronicLogo from '../assets/klantcases/medtronic.png';
import theBoxLogo from '../assets/klantcases/the-box.png';

export const oplossingSoorten = [
    { id: 'custom', nl: 'Custom tools', en: 'Custom tools' },
    { id: 'workshop', nl: 'Workshops', en: 'Workshops' },
    { id: 'begeleiding', nl: 'AI-begeleiding', en: 'AI guidance' }
];

export const workshopKlanten = [
    {
        key: 'medtronic',
        name: 'Medtronic',
        logo: medtronicLogo,
        types: ['workshop'],
        sector: { nl: 'Medische technologie', en: 'Medical technology' },
        description: {
            nl: 'We gaven het internationale sales- en marketingteam van Medtronic een AI-training van anderhalf uur, onder meer over een Second Brain. De focus lag op praktische toepassingen die hun dagelijkse werk vlotter en productiever maken.',
            en: "We gave Medtronic's international sales and marketing team a 90-minute AI training, covering topics such as the Second Brain. The focus was on practical applications that make their daily work smoother and more productive."
        }
    },
    {
        key: 'the-box',
        name: 'The Box',
        logo: theBoxLogo,
        types: ['workshop'],
        sector: { nl: 'Ondernemerschap', en: 'Entrepreneurship' },
        description: {
            nl: 'Tijdens vier leer- en netwerkavonden gaven we meer dan 70 startende ondernemers een workshop over AI, in Hasselt, Turnhout, Antwerpen en Aarschot. Ze kregen concrete tools waarmee ze meteen aan de slag konden, ongeacht hun kennisniveau.',
            en: 'Across four learning and networking evenings, we gave more than 70 starting entrepreneurs a workshop on AI, in Hasselt, Turnhout, Antwerp and Aarschot. They left with practical tools they could put to work straight away, whatever their level.'
        }
    }
];

export function klantKaarten(language) {
    const nl = language === 'nl';
    return [
        ...projecten.map((p) => ({
            key: p.slug,
            types: p.types || ['custom'],
            to: `/projecten/${p.slug}`,
            logo: p.logo,
            client: p.client,
            sector: p.sector[language],
            description: p.description[language],
            cta: nl ? 'Bekijk de case' : 'View the case'
        })),
        ...workshopKlanten.map((w) => ({
            key: w.key,
            types: w.types,
            to: '/workshops',
            logo: w.logo,
            client: w.name,
            sector: w.sector[language],
            description: w.description[language],
            cta: nl ? 'Bekijk onze workshops' : 'View our workshops'
        }))
    ];
}
