import React from 'react';
import QuoteStage from '../ui/quote-stage';
import medtronicLogo from '../../assets/klantcases/medtronic.png';
import theBoxLogo from '../../assets/klantcases/the-box.png';
import naomiPhoto from '../../assets/quotes/naomi-clear.png';
import estherPhoto from '../../assets/quotes/esther-vandebroek.png';

// Een smalle, rustige sectie met quotes van workshopklanten. Zelfde onderdeel als op de homepage (QuoteStage:
// één quote tegelijk, de logo's als tabs), maar in een smalle kolom en met kleinere tekst, zonder titel.
// Beide quotes zijn een kopie van die in App.jsx (klantQuotes); pas ze op beide plaatsen aan. De versie in de
// taal van de klant staat er letterlijk, de andere is een vrije vertaling.
// Plaatshouders (placeholder: true) verschijnen enkel op de lokale dev server, nooit op de echte site:
// een verzonnen getuigenis van een echte klant mag niet live gaan.
const quotes = [
    {
        key: 'medtronic',
        company: 'Medtronic',
        logo: medtronicLogo,
        photo: naomiPhoto,
        name: 'Naomi Clear',
        role: 'Business Director North Europe, UK & Ireland, Nordics, Benelux, Germany & Alpine · Neurovascular',
        quote: {
            nl: 'Lucas van TriaCore gaf ons sales- en marketingteam voor UKI en BeneNord een bijzonder waardevolle AI-training van anderhalf uur. We gingen aan de slag met praktische toepassingen van AI, waaronder het concept van een “Second Brain”, om workflows te stroomlijnen, productiever te werken en onze dagelijkse manier van werken te verbeteren. We hebben nu een praktisch draaiboek om wat we leerden te verankeren in ons dagelijks werk. Ik kan Lucas en TriaCore van harte aanbevelen voor elk team dat echt praktisch voordeel wil halen uit AI.',
            en: 'Lucas from TriaCore delivered an extremely valuable 90-minute AI training session to our UKI and BeneNord Sales and Marketing team. The session explored practical applications of AI, including the “Second Brain” concept, to streamline workflows, improve productivity and enhance day-to-day ways of working. We now have a practical playbook to help embed these learnings into our daily activities. I would highly recommend Lucas and TriaCore to any team looking to maximise the practical benefits of AI.'
        }
    },
    {
        // Esther schreef in het Nederlands: hier is de Nederlandse versie de hare en de Engelse een vrije vertaling
        key: 'the-box',
        company: 'The Box',
        logo: theBoxLogo,
        photo: estherPhoto,
        name: 'Esther Vandebroek',
        role: 'Beleidsmedewerker Ondernemen Stebo vzw · Projectmanager The Box Vlaanderen',
        quote: {
            nl: 'Een schot in de roos! Tijdens vier leer- & netwerkavonden van The Box Vlaanderen inspireerden Lucas en Rian van TriaCore AI meer dan 70 startende ondernemers in Hasselt, Turnhout, Antwerpen en Aarschot. We werkten eerder al met andere sprekers rond AI, maar voor onze doelgroep was deze workshop echt spot on. Geen ingewikkelde theorie, maar concrete tools waarmee ondernemers meteen aan de slag kunnen, ongeacht hun kennisniveau. Een absolute aanrader!',
            en: 'Spot on! Across four learning and networking evenings for The Box Vlaanderen, Lucas and Rian of TriaCore AI inspired more than 70 starting entrepreneurs in Hasselt, Turnhout, Antwerp and Aarschot. We had worked with other AI speakers before, but for our audience this workshop was exactly right. No complicated theory, just practical tools entrepreneurs can put to work straight away, whatever their level. Highly recommended!'
        }
    }
].filter((q) => !q.placeholder || import.meta.env.DEV);

export default function WorkshopsQuotes() {
    return (
        <section id="quotes" className="px-6 md:px-16 lg:px-24">
            {/* Geen eigen witruimte: de sectie erboven (pb) en eronder (pt) geven evenveel ruimte, 64 / 96 px.
                Zonder titel zet het snelmenu deze sectie als geheel in het midden van het scherm.
                Kleiner dan op de homepage: de quote en het aanhalingsteken overschrijven we enkel hier */}
            <div
                data-reveal
                className="max-w-3xl mx-auto [&_blockquote]:text-lg md:[&_blockquote]:text-xl [&_figure>span:first-child]:text-5xl [&_figure>span:first-child]:h-6"
            >
                <div className="rv-fade">
                    <QuoteStage items={quotes} />
                </div>
            </div>
        </section>
    );
}
