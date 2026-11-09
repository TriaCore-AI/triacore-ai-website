import React from 'react';
import LegalPage from '../components/ui/legal-page';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPolicy() {
    const { language } = useLanguage();

    return (
        <LegalPage
            seo={{
                title: language === 'nl' ? 'Privacybeleid | TriaCore AI' : 'Privacy policy | TriaCore AI',
                description: language === 'nl'
                    ? 'Lees hoe TriaCore AI omgaat met je persoonsgegevens: welke gegevens we verzamelen, waarvoor en hoe je ze kunt beheren.'
                    : 'Read how TriaCore AI handles your personal data: what data we collect, for what purpose and how you can manage it.'
            }}
            title={language === 'nl' ? 'Privacyverklaring.' : 'Privacy policy.'}
            intro={language === 'nl'
                ? 'Bij TriaCore AI hechten wij veel belang aan de bescherming van persoonsgegevens. In deze verklaring leggen wij helder uit hoe wij met gegevens omgaan.'
                : 'At TriaCore AI we attach great importance to the protection of personal data. In this policy we clearly explain how we handle your data.'}
            updated={language === 'nl' ? 'Laatst bijgewerkt op 3 maart 2026' : 'Last updated on March 3, 2026'}
        >

            <section>
                <h2>{language === 'nl' ? '1. Waarover gaat deze privacyverklaring?' : '1. What is this privacy policy about?'}</h2>
                <p>
                    {language === 'nl'
                        ? 'Wanneer je onze website bezoekt of met TriaCore AI in contact treedt, verwerken wij bepaalde persoonsgegevens. In deze privacyverklaring leggen wij uit welke gegevens dat zijn, waarvoor wij ze gebruiken en welke rechten je daarbij hebt.'
                        : 'When you visit our website or contact TriaCore AI, we process certain personal data. In this privacy policy we explain what data that is, what we use it for and what rights you have.'}
                </p>
                <p>{language === 'nl' ? 'Deze verklaring is van toepassing op:' : 'This policy applies to:'}</p>
                <ul>
                    <li>{language === 'nl' ? 'bezoekers van onze website;' : 'visitors to our website;'}</li>
                    <li>{language === 'nl' ? 'personen die ons contacteren;' : 'persons who contact us;'}</li>
                    <li>{language === 'nl' ? 'zakelijke contacten en klanten.' : 'business contacts and customers.'}</li>
                </ul>
                <p>{language === 'nl' ? 'TriaCore AI handelt daarbij steeds als verwerkingsverantwoordelijke in de zin van de GDPR.' : 'TriaCore AI always acts as the data controller within the meaning of the GDPR.'}</p>
            </section>

            <section>
                <h2>{language === 'nl' ? '2. Wie verwerkt je persoonsgegevens?' : '2. Who processes your personal data?'}</h2>
                <p><strong>TriaCore AI BV</strong></p>
                <p className="rij">{language === 'nl' ? 'Maatschappelijke zetel' : 'Registered office'}: Berkenstraat 44, 3850 Nieuwerkerken</p>
                <p className="rij">{language === 'nl' ? 'Kantoor' : 'Office'}: Kempische Steenweg 303, 3500 Hasselt (Corda Incubator)</p>
                <p className="rij">{language === 'nl' ? 'Ondernemingsnummer' : 'Company number'}: BE 1042.233.821</p>
                <p className="rij">{language === 'nl' ? 'BTW nummer' : 'VAT number'}: BE 1042.233.821</p>
                <p className="rij">RPR Antwerpen, {language === 'nl' ? 'afdeling Hasselt' : 'Hasselt division'}</p>
                <p className="rij">E-mail: <a href="mailto:info@triacore.be">info@triacore.be</a></p>
                <p>Website: <a href="https://www.triacore.be" target="_blank" rel="noopener noreferrer">www.triacore.be</a></p>
                <p className="noot">{language === 'nl' ? 'Voor vragen of verzoeken met betrekking tot privacy kan je ons contacteren via bovenstaande gegevens.' : 'For questions or requests regarding privacy, you can contact us using the details above.'}</p>
            </section>

            <section>
                <h2>{language === 'nl' ? '3. Welke gegevens verzamelen wij?' : '3. What data do we collect?'}</h2>
                <p>{language === 'nl' ? 'Wij verwerken enkel persoonsgegevens die nodig zijn voor onze zakelijke werking.' : 'We only process personal data that is necessary for our business operations.'}</p>

                <h3>{language === 'nl' ? 'Wanneer je ons contacteert:' : 'When you contact us:'}</h3>
                <ul>
                    <li>{language === 'nl' ? 'je naam;' : 'your name;'}</li>
                    <li>{language === 'nl' ? 'je e-mailadres;' : 'your email address;'}</li>
                    <li>{language === 'nl' ? 'je telefoonnummer (indien opgegeven);' : 'your phone number (if provided);'}</li>
                    <li>{language === 'nl' ? 'een onderwerp (optioneel);' : 'a subject (optional);'}</li>
                    <li>{language === 'nl' ? 'de inhoud van je bericht.' : 'the content of your message.'}</li>
                </ul>

                <h3>{language === 'nl' ? 'Tijdens een samenwerking:' : 'During a collaboration:'}</h3>
                <ul>
                    <li>{language === 'nl' ? 'zakelijke contactgegevens;' : 'business contact details;'}</li>
                    <li>{language === 'nl' ? 'communicatie en opvolging;' : 'communication and follow-up;'}</li>
                    <li>{language === 'nl' ? 'administratieve en facturatiegegevens.' : 'administrative and invoicing data.'}</li>
                </ul>

                <h3>{language === 'nl' ? 'Wanneer je je inschrijft op onze nieuwsbrief:' : 'When you subscribe to our newsletter:'}</h3>
                <ul>
                    <li>{language === 'nl' ? 'je naam (voornaam en achternaam);' : 'your name (first and last name);'}</li>
                    <li>{language === 'nl' ? 'je e-mailadres;' : 'your email address;'}</li>
                    <li>{language === 'nl' ? 'je taalvoorkeur (Nederlands of Engels).' : 'your language preference (Dutch or English).'}</li>
                </ul>

                <h3>{language === 'nl' ? 'Via onze website (Google Analytics 4):' : 'Via our website (Google Analytics 4):'}</h3>
                <p>{language === 'nl' ? 'Indien je hiervoor via de cookiebanner toestemming hebt gegeven, verzamelen wij analytische gegevens:' : 'If you have given consent via the cookie banner, we collect analytical data:'}</p>
                <ul>
                    <li>{language === 'nl' ? 'paginabezoeken en interacties;' : 'page views and interactions;'}</li>
                    <li>{language === 'nl' ? 'sessieduur;' : 'session duration;'}</li>
                    <li>{language === 'nl' ? 'apparaattype en browser;' : 'device type and browser;'}</li>
                    <li>{language === 'nl' ? 'locatie (beperkt tot landniveau).' : 'location (limited to country level).'}</li>
                </ul>
                <p className="noot">{language === 'nl' ? 'Deze data wordt gedurende 14 maanden bewaard in Google Analytics. Je kan je toestemming steeds intrekken via de cookie-instellingen.' : 'This data is stored for 14 months in Google Analytics. You can withdraw your consent at any time via the cookie settings.'}</p>
                <p className="noot">{language === 'nl' ? 'Wij verzamelen geen bijzondere of gevoelige persoonsgegevens en richten ons uitsluitend op professionele (B2B) contacten.' : 'We do not collect any special or sensitive personal data and focus exclusively on professional (B2B) contacts.'}</p>
            </section>

            <section>
                <h2>{language === 'nl' ? '4. Hoe komen wij aan deze gegevens?' : '4. How do we obtain this data?'}</h2>
                <p>{language === 'nl' ? 'Je persoonsgegevens worden door jou actief en vrijwillig verstrekt, bijvoorbeeld wanneer je:' : 'Your personal data is actively and voluntarily provided by you, for example when you:'}</p>
                <ul>
                    <li>{language === 'nl' ? 'het contactformulier invult;' : 'fill out the contact form;'}</li>
                    <li>{language === 'nl' ? 'je inschrijft op onze nieuwsbrief;' : 'subscribe to our newsletter;'}</li>
                    <li>{language === 'nl' ? 'ons per e-mail contacteert;' : 'contact us by email;'}</li>
                    <li>{language === 'nl' ? 'met ons samenwerkt in een professionele context.' : 'collaborate with us in a professional context.'}</li>
                </ul>
            </section>

            <section>
                <h2>{language === 'nl' ? '5. Waarom verwerken wij deze gegevens?' : '5. Why do we process this data?'}</h2>
                <p>{language === 'nl' ? 'Wij gebruiken je persoonsgegevens uitsluitend voor:' : 'We use your personal data exclusively for:'}</p>
                <ul>
                    <li>{language === 'nl' ? 'het beantwoorden van vragen en berichten;' : 'answering questions and messages;'}</li>
                    <li>{language === 'nl' ? 'het opvolgen van zakelijke contacten en aanvragen;' : 'following up on business contacts and requests;'}</li>
                    <li>{language === 'nl' ? 'het uitvoeren van onze dienstverlening;' : 'carrying out our services;'}</li>
                    <li>{language === 'nl' ? 'klantenbeheer en communicatie;' : 'customer management and communication;'}</li>
                    <li>{language === 'nl' ? 'het versturen van onze nieuwsbrief met resource-updates, indien je je daarvoor hebt ingeschreven;' : 'sending our newsletter with resource updates, if you have subscribed to it;'}</li>
                    <li>{language === 'nl' ? 'administratieve en wettelijke verplichtingen.' : 'administrative and legal obligations.'}</li>
                </ul>
            </section>

            <section>
                <h2>{language === 'nl' ? '6. Op basis waarvan mogen wij dit doen?' : '6. On what basis may we do this?'}</h2>
                <p>{language === 'nl' ? 'De verwerking van je persoonsgegevens gebeurt op basis van:' : 'The processing of your personal data happens on the basis of:'}</p>
                <ul>
                    <li>{language === 'nl' ? 'je toestemming;' : 'your consent;'}</li>
                    <li>{language === 'nl' ? 'de uitvoering van een overeenkomst of voorbereidende stappen daartoe;' : 'the execution of an agreement or preparatory steps thereto;'}</li>
                    <li>{language === 'nl' ? 'wettelijke verplichtingen;' : 'legal obligations;'}</li>
                    <li>{language === 'nl' ? 'ons gerechtvaardigd belang om professioneel te kunnen communiceren en werken binnen een B2B-context.' : 'our legitimate interest to communicate and work professionally within a B2B context.'}</li>
                </ul>
            </section>

            <section>
                <h2>{language === 'nl' ? '7. Met wie worden gegevens gedeeld?' : '7. Who will the data be shared with?'}</h2>
                <p>{language === 'nl' ? 'Je persoonsgegevens blijven in principe intern en worden enkel gedeeld wanneer dat functioneel noodzakelijk is, bijvoorbeeld met:' : 'Your personal data will in principle remain internal and will only be shared when functionally necessary, for example with:'}</p>
                <ul>
                    <li>{language === 'nl' ? 'interne opvolgsystemen (zoals spreadsheets of CRM-software);' : 'internal tracking systems (such as spreadsheets or CRM software);'}</li>
                    <li>{language === 'nl' ? 'onze e-mailverzenddienst Resend, die de nieuwsbrieflijst beheert en onze e-mails verstuurt;' : 'our email delivery service Resend, which manages the newsletter list and sends our emails;'}</li>
                    <li>{language === 'nl' ? 'technische of administratieve dienstverleners die ons ondersteunen.' : 'technical or administrative service providers who support us.'}</li>
                </ul>
                <p>{language === 'nl' ? 'Je gegevens worden niet verkocht en niet gebruikt voor commerciële doeleinden van derden.' : 'Your data is not sold and is not used for commercial purposes of third parties.'}</p>
            </section>

            <section>
                <h2>{language === 'nl' ? '8. Verwerking buiten de EU' : '8. Processing outside the EU'}</h2>
                <p>{language === 'nl' ? 'Indien persoonsgegevens worden verwerkt door partijen buiten de Europese Economische Ruimte, zorgen wij ervoor dat dit gebeurt met passende waarborgen in overeenstemming met de GDPR.' : 'If personal data is processed by parties outside the European Economic Area, we ensure that this is done with appropriate safeguards in accordance with the GDPR.'}</p>
                <p>{language === 'nl' ? 'Concreet wordt ons e-mailverkeer voor de nieuwsbrief verwerkt door Resend, een dienstverlener gevestigd in de Verenigde Staten. Deze doorgifte gebeurt op basis van de standaardcontractbepalingen (SCC’s) van de Europese Commissie.' : 'Specifically, our newsletter email traffic is processed by Resend, a service provider based in the United States. This transfer takes place on the basis of the European Commission’s Standard Contractual Clauses (SCCs).'}</p>
            </section>

            <section>
                <h2>{language === 'nl' ? '9. Hoe lang bewaren wij je gegevens?' : '9. How long do we keep your data?'}</h2>
                <p>{language === 'nl' ? 'Wij bewaren persoonsgegevens niet langer dan nodig is voor:' : 'We do not keep personal data longer than is necessary for:'}</p>
                <ul>
                    <li>{language === 'nl' ? 'het doel waarvoor ze zijn verzameld;' : 'the purpose for which it was collected;'}</li>
                    <li>{language === 'nl' ? 'het onderhouden van de zakelijke relatie;' : 'maintaining the business relationship;'}</li>
                    <li>{language === 'nl' ? 'het naleven van wettelijke bewaarplichten.' : 'compliance with legal retention obligations.'}</li>
                </ul>
                <p className="noot">{language === 'nl' ? 'Gegevens van nieuwsbriefinschrijvingen bewaren wij tot je je uitschrijft. Uitschrijven kan op elk moment via de link onderaan elke nieuwsbrief.' : 'We keep newsletter subscription data until you unsubscribe. You can unsubscribe at any time via the link at the bottom of every newsletter.'}</p>
            </section>

            <section>
                <h2>{language === 'nl' ? '10. Hoe beschermen wij je gegevens?' : '10. How do we protect your data?'}</h2>
                <p>{language === 'nl' ? 'TriaCore AI neemt redelijke technische en organisatorische maatregelen om persoonsgegevens te beveiligen. Toegang is beperkt tot personen die deze gegevens nodig hebben voor hun werkzaamheden.' : 'TriaCore AI takes reasonable technical and organizational measures to secure personal data. Access is restricted to persons who need this data for their work.'}</p>
            </section>

            <section>
                <h2>{language === 'nl' ? '11. Jouw rechten' : '11. Your rights'}</h2>
                <p>{language === 'nl' ? 'Je hebt het recht om:' : 'You have the right to:'}</p>
                <ul>
                    <li>{language === 'nl' ? 'je persoonsgegevens in te kijken;' : 'access your personal data;'}</li>
                    <li>{language === 'nl' ? 'onjuiste gegevens te laten verbeteren;' : 'have incorrect data corrected;'}</li>
                    <li>{language === 'nl' ? 'gegevens te laten verwijderen;' : 'have data deleted;'}</li>
                    <li>{language === 'nl' ? 'verwerking te beperken;' : 'restrict processing;'}</li>
                    <li>{language === 'nl' ? 'bezwaar te maken tegen bepaalde verwerkingen;' : 'object to certain processing;'}</li>
                    <li>{language === 'nl' ? 'je toestemming in te trekken.' : 'withdraw your consent.'}</li>
                </ul>
                <p>{language === 'nl' ? 'Je kan deze rechten uitoefenen door ons te contacteren.' : 'You can exercise these rights by contacting us.'}</p>
            </section>

            <section>
                <h2>{language === 'nl' ? '12. Toezicht en klachten' : '12. Supervision and complaints'}</h2>
                <p>{language === 'nl' ? 'Ben je van mening dat wij je gegevens onzorgvuldig verwerken, dan kan je een klacht indienen bij de Belgische toezichthouder:' : 'If you believe that we process your data carelessly, you can file a complaint with the Belgian supervisory authority:'}</p>
                <p className="font-medium text-foreground">{language === 'nl' ? 'Gegevensbeschermingsautoriteit' : 'Data Protection Authority'}</p>
                <p>Drukpersstraat 35, 1000 Brussel</p>
                <p><a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer">www.gegevensbeschermingsautoriteit.be</a></p>
            </section>

            <section>
                <h2>{language === 'nl' ? '13. Aanpassingen aan deze verklaring' : '13. Changes to this policy'}</h2>
                <p>{language === 'nl' ? 'Deze privacyverklaring kan worden aangepast indien onze werking of de wetgeving wijzigt. De meest recente versie is steeds beschikbaar op onze website.' : 'This privacy policy may be amended if our operations or the legislation changes. The most recent version is always available on our website.'}</p>
            </section>
        </LegalPage>
    );
}
