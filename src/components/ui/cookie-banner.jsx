import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function CookieBanner() {
    const { language } = useLanguage();
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

    const loadAnalytics = () => {
        console.log('Analytische scripts geladen...');
        // Hier kunnen de daadwerkelijke scripts van derden worden geladen indien nodig
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
                <div className="fixed bottom-0 left-0 w-full z-[100] p-4 md:p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="max-w-7xl mx-auto bg-white border border-slate-200 shadow-2xl rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg font-bold text-foreground mb-2">{language === 'nl' ? 'Cookies & privacy' : 'Cookies & privacy'}</h3>
                            <p className="text-sm text-foreground/60 leading-relaxed max-w-2xl mx-auto md:mx-0">
                                {language === 'nl'
                                    ? 'Wij gebruiken strikt noodzakelijke en beperkte analytische cookies om onze website correct te laten functioneren en te verbeteren. U kan uw voorkeuren hieronder instellen.'
                                    : 'We use strictly necessary and limited analytical cookies to ensure our website functions correctly and to improve it. You can set your preferences below.'}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={handleAcceptNecessary}
                                className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                            >
                                {language === 'nl' ? 'Enkel noodzakelijke cookies' : 'Only necessary cookies'}
                            </button>
                            <button
                                onClick={() => setShowSettings(true)}
                                className="w-full sm:w-auto px-6 py-3 text-sm font-medium border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
                            >
                                {language === 'nl' ? 'Instellingen' : 'Settings'}
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="w-full sm:w-auto px-8 py-3 text-sm font-bold bg-foreground text-background rounded-full hover:bg-accent hover:text-white transition-all shadow-lg hover:shadow-accent/20"
                            >
                                {language === 'nl' ? 'Alle cookies accepteren' : 'Accept all cookies'}
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
