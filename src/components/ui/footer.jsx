import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import NewsletterSignup from './newsletter-signup';

// Overgang van de lichte pagina naar de donkere footer: een verloop dat volgens een zachte
// S-curve van doorzichtig naar #020617 gaat. Door de vele tussenstappen is er nergens een begin of
// eind te zien, en omdat het telkens dezelfde kleur met meer dekking is, ontstaat er geen grauwe band.
// De korrel van de pagina schemert er nog door en verdwijnt geleidelijk mee
const FADE_STOPS = [
    [0, 0], [8.1, 0.013], [15.5, 0.049], [22.5, 0.104], [29, 0.175], [35.3, 0.259], [41.2, 0.352],
    [47.1, 0.45], [52.9, 0.55], [58.8, 0.648], [64.7, 0.741], [71, 0.825], [77.5, 0.896],
    [84.5, 0.951], [91.9, 0.987], [100, 1]
];
const FADE_TO_DARK = `linear-gradient(to bottom, ${FADE_STOPS.map(([p, a]) => `rgba(2, 6, 23, ${a}) ${p}%`).join(', ')})`;

const linkClass = 'text-sm text-white/55 hover:text-white transition-colors duration-300 w-max';

// Compacte, rustige footer: links het merk, in het midden de pagina's en de contactgegevens,
// rechts de nieuwsbrief. Onderaan één regel met de wettelijke gegevens.
export default function Footer() {
    const { language } = useLanguage();
    const nl = language === 'nl';

    return (
        <>
        <div aria-hidden="true" data-footer-fade className="h-56 md:h-72 pointer-events-none" style={{ background: FADE_TO_DARK }} />
        <footer className="relative bg-dark-section text-white px-6 md:px-16 lg:px-24 pt-10 md:pt-12 pb-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">

                    {/* Merk */}
                    <div className="lg:col-span-4 flex flex-col items-start">
                        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img src="/logo/TriaCore Logo Zwart.svg" alt="" className="h-10 w-auto -ml-2 brightness-0 invert" />
                            <span className="text-lg font-medium tracking-tight">TriaCore AI</span>
                        </Link>
                        <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xs">
                            {nl ? 'AI voor operationele vooruitgang.' : 'AI for operational progress.'}
                        </p>
                        <div className="mt-6 flex gap-4">
                            <a href="https://be.linkedin.com/company/triacore-ai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/40 hover:text-white transition-colors">
                                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="https://www.instagram.com/triacore.ai/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/40 hover:text-white transition-colors">
                                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Pagina's en contact */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2.5">
                            <p className="text-sm font-medium text-white mb-1.5">{nl ? "Pagina's" : 'Pages'}</p>
                            <Link to="/custom-oplossingen" className={linkClass}>{nl ? 'Custom oplossingen' : 'Custom solutions'}</Link>
                            <Link to="/workshops" className={linkClass}>Workshops</Link>
                            <Link to="/projecten" className={linkClass}>{nl ? 'Projecten' : 'Projects'}</Link>
                            <Link to="/resources" className={linkClass}>Resources</Link>
                            <Link to="/team" className={linkClass}>Team</Link>
                            <Link to="/contact" className={linkClass}>Contact</Link>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <p className="text-sm font-medium text-white mb-1.5">Contact</p>
                            <a href="mailto:info@triacore.be" className={linkClass}>info@triacore.be</a>
                            <a href="tel:+32499874662" className={linkClass}>Rian · 0499 87 46 62</a>
                            <a href="tel:+32468275082" className={linkClass}>Lucas · 0468 27 50 82</a>
                            <p className="mt-2 text-sm text-white/40 leading-relaxed">
                                Kempische Steenweg 303<br />3500 Hasselt · Corda Incubator
                            </p>
                        </div>
                    </div>

                    {/* Nieuwsbrief */}
                    <div className="lg:col-span-4">
                        <NewsletterSignup variant="footer" />
                    </div>
                </div>

                {/* Wettelijke gegevens */}
                <div className="mt-12 pt-6 border-t border-white/[0.07] flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs text-white/35">
                    <p className="leading-relaxed">
                        &copy; {new Date().getFullYear()} TriaCore AI BV · {nl ? 'Zetel' : 'Registered office'}: Berkenstraat 44, 3850 Nieuwerkerken · {nl ? 'Ondernemingsnummer en btw' : 'Company number and VAT'}: BE 1042.233.821 · RPR Antwerpen, {nl ? 'afdeling Hasselt' : 'Hasselt division'} · {nl ? 'Site gemaakt door Lucas Curto' : 'Site made by Lucas Curto'}
                    </p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 shrink-0">
                        <Link to="/privacybeleid" className="hover:text-white transition-colors">{nl ? 'Privacybeleid' : 'Privacy policy'}</Link>
                        <Link to="/cookiebeleid" className="hover:text-white transition-colors">{nl ? 'Cookiebeleid' : 'Cookie policy'}</Link>
                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-settings'))}
                            className="hover:text-white transition-colors"
                        >
                            {nl ? 'Cookie instellingen' : 'Cookie settings'}
                        </button>
                    </div>
                </div>
            </div>
        </footer>
        </>
    );
}
