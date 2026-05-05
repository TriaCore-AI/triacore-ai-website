import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

export default function CookieBanner() {
    const { language } = useLanguage();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [consent, setConsent] = useState({ analytics: false });

    useEffect(() => {
        const savedConsent = localStorage.getItem('triacore_cookie_consent');
        if (!savedConsent) {
            setIsVisible(true);
        } else {
            const parsed = JSON.parse(savedConsent);
            setConsent(parsed);
            if (parsed.analytics) {
                loadAnalytics();
            }
        }

        // Listen for open-settings event from footer
        const handleOpenSettings = () => {
            setShowSettings(true);
            setIsVisible(true);
        };
        window.addEventListener('open-cookie-settings', handleOpenSettings);
        return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
    }, []);

    // Track page views on route change if consent is given
    useEffect(() => {
        if (consent.analytics && ReactGA.isInitialized) {
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
        }
    }, [location, consent.analytics]);

    const loadAnalytics = () => {
        if (!ReactGA.isInitialized) {
            console.log('Google Analytics geïnitialiseerd...');
            ReactGA.initialize('G-3STMTJMMHJ');
            ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
        }
    };

    const handleAcceptAll = () => {
        const newConsent = { analytics: true };
        saveConsent(newConsent);
        loadAnalytics();
    };

    const handleAcceptNecessary = () => {
        const newConsent = { analytics: false };
        saveConsent(newConsent);
    };

    const saveConsent = (newConsent) => {
        localStorage.setItem('triacore_cookie_consent', JSON.stringify(newConsent));
        setConsent(newConsent);
        setIsVisible(false);
        setShowSettings(false);
    };

    if (!isVisible && !showSettings) return null;

    return (
        <>
            {/* Banner */}
            {!showSettings && isVisible && (
                <div className="fixed bottom-8 inset-x-0 z-[100] px-6 pointer-events-none flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="w-full max-w-[340px] bg-white border border-slate-100 shadow-xl rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center text-center gap-5 pointer-events-auto">
                        <div className="text-center">
                            <h3 className="text-base font-bold text-foreground mb-2">{language === 'nl' ? 'Cookies & privacy' : 'Cookies & privacy'}</h3>
                            <p className="text-[11px] text-foreground/50 leading-relaxed">
                                {language === 'nl'
                                    ? 'Wij gebruiken noodzakelijke cookies voor een optimale ervaring.'
                                    : 'We use necessary cookies for an optimal experience.'}
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-2 w-full">
                            <button
                                onClick={handleAcceptAll}
                                className="w-full px-8 py-2.5 text-xs font-bold bg-foreground text-background rounded-full hover:bg-accent hover:text-white transition-all shadow-md"
                            >
                                {language === 'nl' ? 'Alles accepteren' : 'Accept all'}
                            </button>
                            <button
                                onClick={handleAcceptNecessary}
                                className="w-full px-8 py-2.5 text-xs font-bold bg-slate-100 text-foreground rounded-full hover:bg-slate-200 transition-all shadow-sm"
                            >
                                {language === 'nl' ? 'Weigeren' : 'Refuse'}
                            </button>
                            <button
                                onClick={() => setShowSettings(true)}
                                className="w-full px-6 py-2 text-[10px] font-medium text-foreground/40 hover:text-foreground transition-colors mt-1"
                            >
                                {language === 'nl' ? 'Instellingen' : 'Settings'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
                        <h3 className="text-2xl font-bold text-foreground mb-6">{language === 'nl' ? 'Cookie-instellingen' : 'Cookie settings'}</h3>

                        <div className="space-y-8 mb-10">
                            {/* Necessary (Read-only toggle) */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-foreground mb-1 uppercase tracking-tight">{language === 'nl' ? 'Strikt noodzakelijk' : 'Strictly necessary'}</h4>
                                    <p className="text-xs text-foreground/40 leading-relaxed">
                                        {language === 'nl'
                                            ? 'Nodig voor de beveiliging en basisfunctionaliteit van de website. Deze kunnen niet worden uitgeschakeld.'
                                            : 'Necessary for the security and basic functionality of the website. These cannot be disabled.'}
                                    </p>
                                </div>
                                <div className="w-10 h-6 bg-slate-200 rounded-full relative opacity-50 cursor-not-allowed">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>

                            {/* Analytics Toggle */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-foreground mb-1 uppercase tracking-tight">{language === 'nl' ? 'Analytische cookies' : 'Analytical cookies'}</h4>
                                    <p className="text-xs text-foreground/40 leading-relaxed">
                                        {language === 'nl'
                                            ? 'Helpt ons geanonimiseerde inzichten te verkrijgen in websitegebruik om de ervaring te verbeteren.'
                                            : 'Helps us gain anonymized insights into website usage to improve the experience.'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setConsent(prev => ({ ...prev, analytics: !prev.analytics }))}
                                    className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${consent.analytics ? 'bg-accent' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${consent.analytics ? 'left-5' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="flex-1 px-6 py-3 text-sm font-medium text-foreground/40 hover:text-foreground transition-colors"
                            >
                                {language === 'nl' ? 'Annuleren' : 'Cancel'}
                            </button>
                            <button
                                onClick={() => saveConsent(consent)}
                                className="flex-1 px-8 py-3 text-sm font-bold bg-foreground text-background rounded-full hover:bg-accent transition-all shadow-lg"
                            >
                                {language === 'nl' ? 'Opslaan' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
