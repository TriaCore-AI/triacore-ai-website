import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTAButton from './cta-button';
import { useLanguage } from '../../context/LanguageContext';

const IntegrationGrid = () => {
    const { language } = useLanguage();
    const [logos, setLogos] = useState([]);

    useEffect(() => {
        // Vite's import.meta.glob to automatically load images
        // Note: Using eagerly loaded modules to get URLs (or module data) immediately
        // Matches svg, png, jpg, jpeg, and webp in src/assets/integraties
        const modules = import.meta.glob('/src/assets/integraties/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG,SVG,WEBP}', { eager: true });

        const loadedLogos = Object.keys(modules)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .map((path) => ({
                path,
                url: modules[path].default || modules[path],
                name: path.split('/').pop().split('.')[0]
            }));

        setLogos(loadedLogos.slice(0, 24));
    }, []);

    const row1 = logos.slice(0, 12);
    const row2 = logos.slice(12, 24);

    const LogoItem = ({ url, name }) => (
        <div
            className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center p-5 transition-all duration-300 hover:scale-[1.1] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] group shrink-0 shadow-xl"
            title={name}
        >
            <img
                src={url}
                alt={name}
                className="max-w-full max-h-full object-contain transition-all duration-500"
            />
        </div>
    );

    return (
        <section id="integraties" className="py-24 px-6 md:px-16 bg-dark-section text-background flex flex-col items-center border-t border-white/5 overflow-hidden">
            <div className="max-w-4xl w-full text-center mb-20 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-6">
                    {language === 'nl' ? 'Integraties' : 'Integrations'}
                </span>
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">
                    {language === 'nl' ? 'Integratie met je bestaande tools' : 'Integration with your existing tools'}
                </h2>
                <p className="text-lg md:text-xl text-background/60 max-w-2xl mx-auto leading-relaxed">
                    {language === 'nl' ? 'We koppelen AI aan de systemen die je vandaag al gebruikt.' : 'We connect AI to the systems you already use today.'}
                </p>
            </div>

            <div className="flex flex-col gap-8 w-full">
                {/* Row 1: Left to Right (scroll-reverse) */}
                <div className="relative flex overflow-hidden group">
                    <div className="flex gap-8 md:gap-12 py-4 animate-scroll-reverse hover:[animation-play-state:paused]">
                        {/* Original Set */}
                        {row1.map((logo, i) => <LogoItem key={`r1-orig-${i}`} {...logo} />)}
                        {/* Duplicate Set for Loop */}
                        {row1.map((logo, i) => <LogoItem key={`r1-dup-${i}`} {...logo} />)}
                    </div>
                </div>

                {/* Row 2: Right to Left (scroll) */}
                {row2.length > 0 && (
                    <div className="relative flex overflow-hidden group">
                        <div className="flex gap-8 md:gap-12 py-4 animate-scroll hover:[animation-play-state:paused]">
                            {/* Original Set */}
                            {row2.map((logo, i) => <LogoItem key={`r2-orig-${i}`} {...logo} />)}
                            {/* Duplicate Set for Loop */}
                            {row2.map((logo, i) => <LogoItem key={`r2-dup-${i}`} {...logo} />)}
                        </div>
                    </div>
                )}

                {logos.length === 0 && (
                    <div className="flex justify-center w-full">
                        <div className="text-background/10 text-xs uppercase tracking-[0.2em] py-12 px-12 border-2 border-dashed border-white/5 rounded-3xl italic">
                            {language === 'nl' ? 'Map src/assets/integraties is momenteel leeg' : 'Folder src/assets/integraties is currently empty'}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-28 relative z-10 flex justify-center w-full">
                <CTAButton
                    to="/contact"
                    className="md:min-w-[440px]"
                >
                    <span className="block group-hover:hidden">{language === 'nl' ? 'Custom systeem?' : 'Custom system?'}</span>
                    <span className="hidden group-hover:block">{language === 'nl' ? 'Plan een gesprek in' : 'Schedule a meeting'}</span>
                </CTAButton>
            </div>
        </section>
    );
};

export default IntegrationGrid;

