import React from 'react';
import LegalPage from '../components/ui/legal-page';
import { useLanguage } from '../context/LanguageContext';

export default function CookiePolicy() {
    const { language } = useLanguage();

    return (
        <LegalPage
            seo={{
                title: language === 'nl' ? 'Cookiebeleid | TriaCore AI' : 'Cookie policy | TriaCore AI',
                description: language === 'nl'
                    ? 'Lees welke cookies TriaCore AI gebruikt op deze website en hoe je je cookievoorkeuren kunt aanpassen.'
                    : 'Read which cookies TriaCore AI uses on this website and how you can adjust your cookie preferences.'
            }}
            title={language === 'nl' ? 'Cookiebeleid.' : 'Cookie policy.'}
            intro={language === 'nl'
                ? 'Op deze pagina leggen wij transparant uit hoe wij cookies gebruiken en welke keuzes je daarbij hebt.'
                : 'On this page we transparently explain how we use cookies and what choices you have.'}
            updated={language === 'nl' ? 'Laatst bijgewerkt op 3 maart 2026' : 'Last updated on March 3, 2026'}
        >

            <section>
                <h2>{language === 'nl' ? '1. Doel van dit cookiebeleid' : '1. Purpose of this cookie policy'}</h2>
                <p>
                    {language === 'nl'
                        ? 'Dit cookiebeleid legt uit hoe TriaCore AI cookies gebruikt op haar website en welke keuzes je als bezoeker hebt. Het beleid vormt een aanvulling op onze privacyverklaring en heeft uitsluitend betrekking op het gebruik van cookies en gelijkaardige technologieën.'
                        : 'This cookie policy explains how TriaCore AI uses cookies on its website and what choices you have as a visitor. The policy complements our privacy statement and relates exclusively to the use of cookies and similar technologies.'}
                </p>
            </section>

            <section>
                <h2>{language === 'nl' ? '2. Wat zijn cookies?' : '2. What are cookies?'}</h2>
                <p>
                    {language === 'nl'
                        ? 'Cookies zijn kleine tekstbestanden die bij een bezoek aan een website op je toestel worden geplaatst. Ze helpen om de website correct te laten functioneren en geven inzicht in het algemene gebruik van de website.'
                        : 'Cookies are small text files that are placed on your device when you visit a website. They help the website function properly and provide insight into the general use of the website.'}
                </p>
            </section>

            <section>
                <h2>{language === 'nl' ? '3. Welke cookies gebruikt TriaCore AI?' : '3. What cookies does TriaCore AI use?'}</h2>
                <p>{language === 'nl' ? 'De website van TriaCore AI gebruikt uitsluitend:' : 'The TriaCore AI website uses exclusively:'}</p>
                <ul>
                    <li>
                        <strong>{language === 'nl' ? 'Strikt noodzakelijke cookies:' : 'Strictly necessary cookies:'}</strong><br />
                        {language === 'nl'
                            ? 'Deze cookies zijn nodig voor de goede werking, beveiliging en stabiliteit van de website.'
                            : 'These cookies are necessary for the proper functioning, security and stability of the website.'}
                    </li>
                    <li>
                        <strong>{language === 'nl' ? 'Beperkte, privacyvriendelijke analytische cookies:' : 'Limited, privacy-friendly analytical cookies:'}</strong><br />
                        {language === 'nl'
                            ? 'Wij maken gebruik van Google Analytics 4 om geanonimiseerde inzichten te verkrijgen in het gebruik van onze website. Hierbij worden gegevens verzameld zoals paginabezoeken, sessieduur, apparaattype en locatie op landniveau. Deze data wordt 14 maanden bewaard. Je kan je toestemming op elk moment intrekken.'
                            : 'We use Google Analytics 4 to gain anonymized insights into the use of our website. This collects data such as page views, session duration, device type, and country-level location. This data is kept for 14 months. You can withdraw your consent at any time.'}
                    </li>
                </ul>
                <p className="font-medium text-foreground">
                    {language === 'nl'
                        ? 'Wij gebruiken geen marketingcookies, geen advertentiecookies en geen trackingcookies voor sociale media.'
                        : 'We do not use marketing cookies, advertising cookies and no tracking cookies for social media.'}
                </p>
            </section>

            <section>
                <h2>{language === 'nl' ? '4. Toestemming en cookiebanner' : '4. Consent and cookie banner'}</h2>
                <p>{language === 'nl' ? 'Bij je eerste bezoek aan onze website word je geïnformeerd over het gebruik van cookies via een cookiebanner.' : 'On your first visit to our website you will be informed about the use of cookies via a cookie banner.'}</p>
                <p>
                    {language === 'nl'
                        ? 'Niet-noodzakelijke cookies worden enkel geplaatst indien je hiervoor toestemming geeft. Je kan je cookievoorkeuren op elk moment aanpassen via de instellingen op de website of je internetbrowser.'
                        : 'Non-necessary cookies are only placed if you consent to this. You can adjust your cookie preferences at any time via the settings on the website or your internet browser.'}
                </p>
            </section>

            <section>
                <h2>{language === 'nl' ? '5. Cookies van derden' : '5. Third-party cookies'}</h2>
                <p>
                    {language === 'nl'
                        ? 'Onze website is gebouwd en gehost via een extern websiteplatform. Dit platform kan technische cookies plaatsen die noodzakelijk zijn voor prestaties, beveiliging en correcte werking van de website.'
                        : 'Our website is built and hosted via an external website platform. This platform may place technical cookies that are necessary for performance, security and correct operation of the website.'}
                </p>
                <p className="noot">
                    {language === 'nl'
                        ? 'TriaCore AI heeft geen controle over deze technische cookies en verwijst voor meer informatie naar de documentatie en het beleid van dit platform.'
                        : 'TriaCore AI has no control over these technical cookies and refers you to the documentation and policy of this platform for more information.'}
                </p>
            </section>

            <section>
                <h2>{language === 'nl' ? '6. Cookies beheren of verwijderen' : '6. Managing or deleting cookies'}</h2>
                <p>{language === 'nl' ? 'Je kan cookies op elk moment beheren of verwijderen:' : 'You can manage or delete cookies at any time:'}</p>
                <ul>
                    <li>{language === 'nl' ? 'via de cookiebanner of instellingen op onze website;' : 'via the cookie banner or settings on our website;'}</li>
                    <li>{language === 'nl' ? 'via de instellingen van je internetbrowser.' : 'via the settings of your internet browser.'}</li>
                </ul>
                <p className="noot">{language === 'nl' ? 'Houd er rekening mee dat het uitschakelen van cookies de werking van de website kan beïnvloeden.' : 'Please note that disabling cookies may affect the functioning of the website.'}</p>
            </section>

            <section>
                <h2>{language === 'nl' ? '7. Wijzigingen aan dit cookiebeleid' : '7. Changes to this cookie policy'}</h2>
                <p>
                    {language === 'nl'
                        ? 'TriaCore AI behoudt zich het recht voor dit cookiebeleid aan te passen wanneer de website, de gebruikte technologieën of de toepasselijke wetgeving wijzigen. De meest recente versie is steeds beschikbaar op onze website.'
                        : 'TriaCore AI reserves the right to amend this cookie policy if the website, the technologies used or the applicable legislation changes. The most recent version is always available on our website.'}
                </p>
            </section>

            <section>
                <h2>{language === 'nl' ? '8. Contact' : '8. Contact'}</h2>
                <p>{language === 'nl' ? 'Heb je vragen over dit cookiebeleid of over het gebruik van cookies op onze website?' : 'Do you have questions about this cookie policy or about the use of cookies on our website?'}</p>
                <p className="rij font-medium text-foreground">TriaCore AI</p>
                <p className="rij">E-mail: <a href="mailto:info@triacore.be">info@triacore.be</a></p>
                <p>Website: <a href="https://www.triacore.be" target="_blank" rel="noopener noreferrer">www.triacore.be</a></p>
            </section>
        </LegalPage>
    );
}
