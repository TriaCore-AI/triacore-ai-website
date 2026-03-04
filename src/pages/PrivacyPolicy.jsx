import React from 'react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function PrivacyPolicy() {
    const { language } = useLanguage();
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        let ctx = gsap.context(() => {
            const scrollElements = gsap.utils.toArray('.scroll-animate');
            scrollElements.forEach((el) => {
                gsap.fromTo(
                    el,
                    { y: 30, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 90%',
                        },
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power3.out',
                    }
                );
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <section className="pt-40 pb-24 px-6 flex-grow">
                <div className="max-w-[720px] mx-auto">
                    {/* Header */}
                    <div className="mb-12 scroll-animate">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{language === 'nl' ? 'Privacyverklaring' : 'Privacy Policy'}</h1>
                        <p className="text-sm opacity-40 mb-6">{language === 'nl' ? 'Laatst bijgewerkt op 3 maart 2026' : 'Last updated on March 3, 2026'}</p>
                        <p className="text-lg opacity-70">
                            {language === 'nl'
                                ? 'Bij TriCore AI hechten wij veel belang aan de bescherming van persoonsgegevens. In deze verklaring leggen wij helder uit hoe wij met gegevens omgaan.'
                                : 'At TriaCore AI we attach great importance to the protection of personal data. In this policy we clearly explain how we handle your data.'}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-12 text-foreground/80 leading-relaxed">

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4">{language === 'nl' ? '1. Waarover gaat deze privacyverklaring?' : '1. What is this privacy policy about?'}</h2>
                            <p className="mb-4">
                                {language === 'nl'
                                    ? 'Wanneer u onze website bezoekt of met TriaCore AI in contact treedt, verwerken wij bepaalde persoonsgegevens. In deze privacyverklaring leggen wij uit welke gegevens dat zijn, waarvoor wij ze gebruiken en welke rechten u daarbij heeft.'
                                    : 'When you visit our website or contact TriaCore AI, we process certain personal data. In this privacy policy we explain what data that is, what we use it for and what rights you have.'}
                            </p>
                            <p className="mb-4">{language === 'nl' ? 'Deze verklaring is van toepassing op:' : 'This policy applies to:'}</p>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>{language === 'nl' ? 'bezoekers van onze website;' : 'visitors to our website;'}</li>
                                <li>{language === 'nl' ? 'personen die ons contacteren;' : 'persons who contact us;'}</li>
                                <li>{language === 'nl' ? 'zakelijke contacten en klanten.' : 'business contacts and customers.'}</li>
                            </ul>
                            <p className="mt-4">{language === 'nl' ? 'TriaCore AI handelt daarbij steeds als verwerkingsverantwoordelijke in de zin van de GDPR.' : 'TriaCore AI always acts as the data controller within the meaning of the GDPR.'}</p>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4">{language === 'nl' ? '2. Wie verwerkt uw persoonsgegevens?' : '2. Who processes your personal data?'}</h2>
                            <p className="mb-2"><strong>TriaCore AI</strong> {language === 'nl' ? '(actief binnen het Starterslabo-traject)' : '(active within the Starterslabo trajectory)'}</p>
                            <p className="mb-1">{language === 'nl' ? 'Ondernemingsnummer' : 'Company number'}: BE 0876.478.439 (Starterslabo)</p>
                            <p className="mb-1">E-mail: <a href="mailto:info@triacore.be" className="text-accent underline decoration-accent/30 underline-offset-4 font-medium">info@triacore.be</a></p>
                            <p className="mb-4">Website: <a href="https://www.triacore.be" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">www.triacore.be</a></p>
                            <p className="text-sm italic opacity-60">{language === 'nl' ? 'Voor vragen of verzoeken met betrekking tot privacy kan u ons contacteren via bovenstaande gegevens.' : 'For questions or requests regarding privacy, you can contact us using the details above.'}</p>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4">{language === 'nl' ? '3. Welke gegevens verzamelen wij?' : '3. What data do we collect?'}</h2>
                            <p className="mb-4">{language === 'nl' ? 'Wij verwerken enkel persoonsgegevens die nodig zijn voor onze zakelijke werking.' : 'We only process personal data that is necessary for our business operations.'}</p>

                            <h3 className="font-bold mb-2">{language === 'nl' ? 'Wanneer u ons contacteert:' : 'When you contact us:'}</h3>
                            <ul className="list-disc ml-6 mb-6 space-y-1">
                                <li>{language === 'nl' ? 'uw naam;' : 'your name;'}</li>
                                <li>{language === 'nl' ? 'uw e-mailadres;' : 'your email address;'}</li>
                                <li>{language === 'nl' ? 'uw telefoonnummer (indien opgegeven);' : 'your phone number (if provided);'}</li>
                                <li>{language === 'nl' ? 'een onderwerp (optioneel);' : 'a subject (optional);'}</li>
                                <li>{language === 'nl' ? 'de inhoud van uw bericht.' : 'the content of your message.'}</li>
                            </ul>

                            <h3 className="font-bold mb-2">{language === 'nl' ? 'Tijdens een samenwerking:' : 'During a collaboration:'}</h3>
                            <ul className="list-disc ml-6 space-y-1 font-medium">
                                <li>{language === 'nl' ? 'zakelijke contactgegevens;' : 'business contact details;'}</li>
                                <li>{language === 'nl' ? 'communicatie en opvolging;' : 'communication and follow-up;'}</li>
                                <li>{language === 'nl' ? 'administratieve en facturatiegegevens.' : 'administrative and invoicing data.'}</li>
                            </ul>
                            <p className="mt-4 text-sm opacity-60">{language === 'nl' ? 'Wij verzamelen geen bijzondere of gevoelige persoonsgegevens en richten ons uitsluitend op professionele (B2B) contacten.' : 'We do not collect any special or sensitive personal data and focus exclusively on professional (B2B) contacts.'}</p>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4">{language === 'nl' ? '4. Hoe komen wij aan deze gegevens?' : '4. How do we obtain this data?'}</h2>
                            <p className="mb-4">{language === 'nl' ? 'Uw persoonsgegevens worden door u actief en vrijwillig verstrekt, bijvoorbeeld wanneer u:' : 'Your personal data is actively and voluntarily provided by you, for example when you:'}</p>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>{language === 'nl' ? 'het contactformulier invult;' : 'fill out the contact form;'}</li>
                                <li>{language === 'nl' ? 'ons per e-mail contacteert;' : 'contact us by email;'}</li>
                                <li>{language === 'nl' ? 'met ons samenwerkt in een professionele context.' : 'collaborate with us in a professional context.'}</li>
                            </ul>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4">{language === 'nl' ? '5. Waarom verwerken wij deze gegevens?' : '5. Why do we process this data?'}</h2>
                            <p className="mb-4">{language === 'nl' ? 'Wij gebruiken uw persoonsgegevens uitsluitend voor:' : 'We use your personal data exclusively for:'}</p>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>{language === 'nl' ? 'het beantwoorden van vragen en berichten;' : 'answering questions and messages;'}</li>
                                <li>{language === 'nl' ? 'het opvolgen van zakelijke contacten en aanvragen;' : 'following up on business contacts and requests;'}</li>
                                <li>{language === 'nl' ? 'het uitvoeren van onze dienstverlening;' : 'carrying out our services;'}</li>
                                <li>{language === 'nl' ? 'klantenbeheer en communicatie;' : 'customer management and communication;'}</li>
                                <li>{language === 'nl' ? 'administratieve en wettelijke verplichtingen.' : 'administrative and legal obligations.'}</li>
                            </ul>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4">{language === 'nl' ? '6. Op basis waarvan mogen wij dit doen?' : '6. On what basis may we do this?'}</h2>
                            <p className="mb-4">{language === 'nl' ? 'De verwerking van uw persoonsgegevens gebeurt op basis van:' : 'The processing of your personal data happens on the basis of:'}</p>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>{language === 'nl' ? 'uw toestemming;' : 'your consent;'}</li>
                                <li>{language === 'nl' ? 'de uitvoering van een overeenkomst of voorbereidende stappen daartoe;' : 'the execution of an agreement or preparatory steps thereto;'}</li>
                                <li>{language === 'nl' ? 'wettelijke verplichtingen;' : 'legal obligations;'}</li>
                                <li>{language === 'nl' ? 'ons gerechtvaardigd belang om professioneel te kunnen communiceren en werken binnen een B2B-context.' : 'our legitimate interest to communicate and work professionally within a B2B context.'}</li>
                            </ul>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4">{language === 'nl' ? '7. Met wie worden gegevens gedeeld?' : '7. Who will the data be shared with?'}</h2>
                            <p className="mb-4">{language === 'nl' ? 'Uw persoonsgegevens blijven in principe intern en worden enkel gedeeld wanneer dat functioneel noodzakelijk is, bijvoorbeeld met:' : 'Your personal data will in principle remain internal and will only be shared when functionally necessary, for example with:'}</p>
                            <ul className="list-disc ml-6 mb-4 space-y-1">
                                <li>{language === 'nl' ? 'interne opvolgsystemen (zoals spreadsheets of CRM-software);' : 'internal tracking systems (such as spreadsheets or CRM software);'}</li>
                                <li>{language === 'nl' ? 'technische of administratieve dienstverleners die ons ondersteunen.' : 'technical or administrative service providers who support us.'}</li>
                            </ul>
                            <p>{language === 'nl' ? 'Uw gegevens worden niet verkocht en niet gebruikt voor commerciële doeleinden van derden.' : 'Your data is not sold and is not used for commercial purposes of third parties.'}</p>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4">{language === 'nl' ? '8. Verwerking buiten de EU' : '8. Processing outside the EU'}</h2>
                            <p>{language === 'nl' ? 'Indien persoonsgegevens worden verwerkt door partijen buiten de Europese Economische Ruimte, zorgen wij ervoor dat dit gebeurt met passende waarborgen in overeenstemming met de GDPR.' : 'If personal data is processed by parties outside the European Economic Area, we ensure that this is done with appropriate safeguards in accordance with the GDPR.'}</p>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4">{language === 'nl' ? '9. Hoe lang bewaren wij uw gegevens?' : '9. How long do we keep your data?'}</h2>
                            <p className="mb-4">{language === 'nl' ? 'Wij bewaren persoonsgegevens niet langer dan nodig is voor:' : 'We do not keep personal data longer than is necessary for:'}</p>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>{language === 'nl' ? 'het doel waarvoor ze zijn verzameld;' : 'the purpose for which it was collected;'}</li>
                                <li>{language === 'nl' ? 'het onderhouden van de zakelijke relatie;' : 'maintaining the business relationship;'}</li>
                                <li>{language === 'nl' ? 'het naleven van wettelijke bewaarplichten.' : 'compliance with legal retention obligations.'}</li>
                            </ul>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4">{language === 'nl' ? '10. Hoe beschermen wij uw gegevens?' : '10. How do we protect your data?'}</h2>
                            <p>{language === 'nl' ? 'TriaCore AI neemt redelijke technische en organisatorische maatregelen om persoonsgegevens te beveiligen. Toegang is beperkt tot personen die deze gegevens nodig hebben voor hun werkzaamheden.' : 'TriaCore AI takes reasonable technical and organizational measures to secure personal data. Access is restricted to persons who need this data for their work.'}</p>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4">{language === 'nl' ? '11. Uw rechten' : '11. Your rights'}</h2>
                            <p className="mb-4">{language === 'nl' ? 'U heeft het recht om:' : 'You have the right to:'}</p>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>{language === 'nl' ? 'uw persoonsgegevens in te kijken;' : 'access your personal data;'}</li>
                                <li>{language === 'nl' ? 'onjuiste gegevens te laten verbeteren;' : 'have incorrect data corrected;'}</li>
                                <li>{language === 'nl' ? 'gegevens te laten verwijderen;' : 'have data deleted;'}</li>
                                <li>{language === 'nl' ? 'verwerking te beperken;' : 'restrict processing;'}</li>
                                <li>{language === 'nl' ? 'bezwaar te maken tegen bepaalde verwerkingen;' : 'object to certain processing;'}</li>
                                <li>{language === 'nl' ? 'uw toestemming in te trekken.' : 'withdraw your consent.'}</li>
                            </ul>
                            <p className="mt-4">{language === 'nl' ? 'U kan deze rechten uitoefenen door ons te contacteren.' : 'You can exercise these rights by contacting us.'}</p>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4">{language === 'nl' ? '12. Toezicht en klachten' : '12. Supervision and complaints'}</h2>
                            <p className="mb-4">{language === 'nl' ? 'Bent u van mening dat wij uw gegevens onzorgvuldig verwerken, dan kan u een klacht indienen bij de Belgische toezichthouder:' : 'If you believe that we process your data carelessly, you can file a complaint with the Belgian supervisory authority:'}</p>
                            <p className="font-bold">{language === 'nl' ? 'Gegevensbeschermingsautoriteit' : 'Data Protection Authority'}</p>
                            <p>Drukpersstraat 35, 1000 Brussel</p>
                            <p><a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer" className="text-accent underline">www.gegevensbeschermingsautoriteit.be</a></p>
                        </section>

                        <section className="pt-8 border-t border-slate-100 scroll-animate">
                            <h2 className="text-xl font-bold mb-4">{language === 'nl' ? '13. Aanpassingen aan deze verklaring' : '13. Changes to this policy'}</h2>
                            <p>{language === 'nl' ? 'Deze privacyverklaring kan worden aangepast indien onze werking of de wetgeving wijzigt. De meest recente versie is steeds beschikbaar op onze website.' : 'This privacy policy may be amended if our operations or the legislation changes. The most recent version is always available on our website.'}</p>
                        </section>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
