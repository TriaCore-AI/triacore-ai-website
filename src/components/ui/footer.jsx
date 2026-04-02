import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
    const { language } = useLanguage();
    return (
        <footer className="relative bg-dark-section text-background px-6 md:px-16 pt-24 pb-8 overflow-hidden border-t border-white/5">

            {/* Subtle Grid Background - Only for Footer */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute left-1/4 top-0 w-px h-full bg-white"></div>
                <div className="absolute left-2/4 top-0 w-px h-full bg-white"></div>
                <div className="absolute left-3/4 top-0 w-px h-full bg-white"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-white"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">

                    {/* Brand Column (Left) */}
                    <div className="flex flex-col items-start max-w-xs">
                        <Link to="/" className="text-2xl font-bold tracking-tight mb-4 text-white hover:opacity-80 transition-opacity">
                            TriaCore AI
                        </Link>
                        <Link to="/" className="mb-8 hover:opacity-80 transition-opacity">
                            <img
                                src="/logo/TriaCore Logo Zwart.svg"
                                alt="TriaCore AI Logo"
                                className="h-24 w-auto brightness-0 invert"
                            />
                        </Link>
                        <p className="text-sm text-white/60 leading-relaxed font-light">
                            {language === 'nl' ? 'Custom platformen en AI-integratie voor bedrijven.' : 'Custom platforms and AI integration for businesses.'}
                        </p>
                    </div>

                    {/* Nav columns (Pushed closer to each other) */}
                    <div className="flex flex-col sm:flex-row gap-16 md:gap-24 lg:gap-32">

                        {/* LINKS Column */}
                        <div className="flex flex-col gap-5 min-w-[120px]">
                            <h4 className="font-bold text-white text-sm tracking-widest uppercase mb-4">Links</h4>
                            <div className="flex flex-col gap-3">
                                <a href="/#fundamenten" className="text-white/60 hover:text-accent transition-all text-sm font-medium w-max hover:translate-x-1">{language === 'nl' ? 'Trajecten' : 'Paths'}</a>
                                <a href="/#ai-agents" className="text-white/60 hover:text-accent transition-all text-sm font-medium w-max hover:translate-x-1">{language === 'nl' ? 'AI-agents' : 'AI Agents'}</a>
                                <a href="/#aanpak" className="text-white/60 hover:text-accent transition-all text-sm font-medium w-max hover:translate-x-1">{language === 'nl' ? 'Aanpak' : 'Approach'}</a>
                                <a href="/#team" className="text-white/60 hover:text-accent transition-all text-sm font-medium w-max hover:translate-x-1">Team</a>
                                <a href="/#security" className="text-white/60 hover:text-accent transition-all text-sm font-medium w-max hover:translate-x-1">Security</a>
                            </div>
                        </div>

                        {/* PAGES Column */}
                        <div className="flex flex-col gap-5 min-w-[120px]">
                            <h4 className="font-bold text-white text-sm tracking-widest uppercase mb-4">{language === 'nl' ? "Pagina's" : "Pages"}</h4>
                            <div className="flex flex-col gap-3">
                                <Link to="/trajecten" className="text-white/60 hover:text-accent transition-all text-sm font-medium w-max hover:translate-x-1">{language === 'nl' ? 'Trajecten' : 'Paths'}</Link>
                                <Link to="/ai-agents" className="text-white/60 hover:text-accent transition-all text-sm font-medium w-max hover:translate-x-1">{language === 'nl' ? 'AI-agents' : 'AI Agents'}</Link>
                                <Link to="/team" className="text-white/60 hover:text-accent transition-all text-sm font-medium w-max hover:translate-x-1">Team</Link>
                                <Link to="/contact" className="text-white/60 hover:text-accent transition-all text-sm font-medium w-max hover:translate-x-1">Contact</Link>
                            </div>
                        </div>

                        {/* GEGEVENS Column */}
                        <div className="flex flex-col gap-5 min-w-[180px]">
                            <h4 className="font-bold text-white text-sm tracking-widest uppercase mb-4">{language === 'nl' ? 'Gegevens' : 'Contact'}</h4>
                            <div className="flex flex-col gap-4">
                                <div className="text-sm text-white/60 leading-relaxed font-light">
                                    Kempische Steenweg 303<br />
                                    3500 Hasselt – Corda Incubator
                                </div>
                                <a href="mailto:info@triacore.be" className="text-sm text-white/60 hover:text-accent transition-colors font-medium w-max">
                                    info@triacore.be
                                </a>
                                <div className="text-sm text-white/60 leading-relaxed font-light">
                                    Rian – 0499 87 46 62<br />
                                    Lucas – 0468 27 50 82
                                </div>

                                <div className="flex gap-4 mt-2">
                                    <a href="https://www.instagram.com/triacore.ai/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                                    </a>
                                    <a href="https://be.linkedin.com/company/triacore-ai" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-[10px] text-white/30 font-light tracking-wide">
                        &copy; {new Date().getFullYear()} TriaCore AI. {language === 'nl' ? 'Alle rechten voorbehouden.' : 'All rights reserved.'}
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 text-[10px] text-white/30 font-medium tracking-widest uppercase">
                        <Link to="/privacybeleid" className="hover:text-accent transition-colors">{language === 'nl' ? 'Privacybeleid' : 'Privacy policy'}</Link>
                        <Link to="/cookiebeleid" className="hover:text-accent transition-colors">{language === 'nl' ? 'Cookiebeleid' : 'Cookie policy'}</Link>
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-settings'))}
                            className="hover:text-accent transition-colors cursor-pointer"
                        >
                            {language === 'nl' ? 'Cookie-instellingen' : 'Cookie settings'}
                        </button>
                    </div>
                </div>

            </div>
        </footer>
    );
}
