import React from 'react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function CookiePolicy() {
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
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{language === 'nl' ? 'Cookiebeleid' : 'Cookie Policy'}</h1>
                        <p className="text-sm opacity-40 mb-6 font-medium tracking-tight">{language === 'nl' ? 'Laatst bijgewerkt op 3 maart 2026' : 'Last updated on March 3, 2026'}</p>
                        <p className="text-lg opacity-70 leading-relaxed font-light">
                            {language === 'nl'
                                ? 'Op deze pagina leggen wij transparant uit hoe wij cookies gebruiken en welke keuzes u daarbij heeft.'
                                : 'On this page we transparently explain how we use cookies and what choices you have.'}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-12 text-foreground/80 leading-relaxed font-light text-base">

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4 text-foreground">{language === 'nl' ? '1. Doel van dit cookiebeleid' : '1. Purpose of this cookie policy'}</h2>
                            <p>
                                {language === 'nl'
                                    ? 'Dit cookiebeleid legt uit hoe TriaCore AI cookies gebruikt op haar website en welke keuzes u als bezoeker heeft. Het beleid vormt een aanvulling op onze privacyverklaring en heeft uitsluitend betrekking op het gebruik van cookies en gelijkaardige technologieën.'
                                    : 'This cookie policy explains how TriaCore AI uses cookies on its website and what choices you have as a visitor. The policy complements our privacy statement and relates exclusively to the use of cookies and similar technologies.'}
                            </p>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4 text-foreground">{language === 'nl' ? '2. Wat zijn cookies?' : '2. What are cookies?'}</h2>
                            <p>
                                {language === 'nl'
                                    ? 'Cookies zijn kleine tekstbestanden die bij een bezoek aan een website op uw toestel worden geplaatst. Ze helpen om de website correct te laten functioneren en geven inzicht in het algemene gebruik van de website.'
                                    : 'Cookies are small text files that are placed on your device when you visit a website. They help the website function properly and provide insight into the general use of the website.'}
                            </p>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4 text-foreground">{language === 'nl' ? '3. Welke cookies gebruikt TriaCore AI?' : '3. What cookies does TriaCore AI use?'}</h2>
                            <p className="mb-4">{language === 'nl' ? 'De website van TriaCore AI gebruikt uitsluitend:' : 'The TriaCore AI website uses exclusively:'}</p>
                            <ul className="list-disc ml-6 space-y-4">
                                <li>
                                    <strong className="text-foreground">{language === 'nl' ? 'Strikt noodzakelijke cookies:' : 'Strictly necessary cookies:'}</strong><br />
                                    {language === 'nl'
                                        ? 'Deze cookies zijn nodig voor de goede werking, beveiliging en stabiliteit van de website.'
                                        : 'These cookies are necessary for the proper functioning, security and stability of the website.'}
                                </li>
                                <li>
                                    <strong className="text-foreground">{language === 'nl' ? 'Beperkte, privacyvriendelijke analytische cookies:' : 'Limited, privacy-friendly analytical cookies:'}</strong><br />
                                    {language === 'nl'
                                        ? 'Wij maken gebruik van ingebouwde website-analytics om geanonimiseerde inzichten te verkrijgen in het gebruik van onze website (zoals paginaweergaven en algemene bezoekersstatistieken). Deze gegevens worden enkel gebruikt om de website te verbeteren.'
                                        : 'We use built-in website analytics to gain anonymized insights into the use of our website (such as page views and general visitor statistics). This data is only used to improve the website.'}
                                </li>
                            </ul>
                            <p className="mt-8 font-medium italic opacity-70 underline decoration-accent/20 underline-offset-4 decoration-2">
                                {language === 'nl'
                                    ? 'Wij gebruiken geen marketingcookies, geen advertentiecookies en geen trackingcookies voor sociale media.'
                                    : 'We do not use marketing cookies, advertising cookies and no tracking cookies for social media.'}
                            </p>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4 text-foreground">{language === 'nl' ? '4. Toestemming en cookiebanner' : '4. Consent and cookie banner'}</h2>
                            <p className="mb-4">{language === 'nl' ? 'Bij uw eerste bezoek aan onze website wordt u geïnformeerd over het gebruik van cookies via een cookiebanner.' : 'On your first visit to our website you will be informed about the use of cookies via a cookie banner.'}</p>
                            <p>
                                {language === 'nl'
                                    ? 'Niet-noodzakelijke cookies worden enkel geplaatst indien u hiervoor toestemming geeft. U kan uw cookievoorkeuren op elk moment aanpassen via de instellingen op de website of uw internetbrowser.'
                                    : 'Non-necessary cookies are only placed if you consent to this. You can adjust your cookie preferences at any time via the settings on the website or your internet browser.'}
                            </p>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4 text-foreground">{language === 'nl' ? '5. Cookies van derden' : '5. Third-party cookies'}</h2>
                            <p className="mb-4">
                                {language === 'nl'
                                    ? 'Onze website is gebouwd en gehost via een extern websiteplatform. Dit platform kan technische cookies plaatsen die noodzakelijk zijn voor prestaties, beveiliging en correcte werking van de website.'
                                    : 'Our website is built and hosted via an external website platform. This platform may place technical cookies that are necessary for performance, security and correct operation of the website.'}
                            </p>
                            <p className="text-sm italic opacity-60">
                                {language === 'nl'
                                    ? 'TriaCore AI heeft geen controle over deze technische cookies en verwijst voor meer informatie naar de documentatie en het beleid van dit platform.'
                                    : 'TriaCore AI has no control over these technical cookies and refers you to the documentation and policy of this platform for more information.'}
                            </p>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4 text-foreground">{language === 'nl' ? '6. Cookies beheren of verwijderen' : '6. Managing or deleting cookies'}</h2>
                            <p className="mb-4">{language === 'nl' ? 'U kan cookies op elk moment beheren of verwijderen:' : 'You can manage or delete cookies at any time:'}</p>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>{language === 'nl' ? 'via de cookiebanner of instellingen op onze website;' : 'via the cookie banner or settings on our website;'}</li>
                                <li>{language === 'nl' ? 'via de instellingen van uw internetbrowser.' : 'via the settings of your internet browser.'}</li>
                            </ul>
                            <p className="mt-4 text-sm opacity-60">{language === 'nl' ? 'Houd er rekening mee dat het uitschakelen van cookies de werking van de website kan beïnvloeden.' : 'Please note that disabling cookies may affect the functioning of the website.'}</p>
                        </section>

                        <section className="scroll-animate">
                            <h2 className="text-xl font-bold mb-4 text-foreground">{language === 'nl' ? '7. Wijzigingen aan dit cookiebeleid' : '7. Changes to this cookie policy'}</h2>
                            <p>
                                {language === 'nl'
                                    ? 'TriaCore AI behoudt zich het recht voor dit cookiebeleid aan te passen wanneer de website, de gebruikte technologieën of de toepasselijke wetgeving wijzigen. De meest recente versie is steeds beschikbaar op onze website.'
                                    : 'TriaCore AI reserves the right to amend this cookie policy if the website, the technologies used or the applicable legislation changes. The most recent version is always available on our website.'}
                            </p>
                        </section>

                        <section className="pt-8 border-t border-slate-100">
                            <h2 className="text-xl font-bold mb-4 text-foreground">{language === 'nl' ? '8. Contact' : '8. Contact'}</h2>
                            <p className="mb-4">{language === 'nl' ? 'Heeft u vragen over dit cookiebeleid of over het gebruik van cookies op onze website?' : 'Do you have questions about this cookie policy or about the use of cookies on our website?'}</p>
                            <p className="font-bold mb-1">TriaCore AI</p>
                            <p className="mb-1">E-mail: <a href="mailto:info@triacore.be" className="text-accent underline decoration-accent/30 underline-offset-4 font-medium">info@triacore.be</a></p>
                            <p>Website: <a href="https://www.triacore.be" target="_blank" rel="noopener noreferrer" className="opacity-70">www.triacore.be</a></p>
                        </section>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
