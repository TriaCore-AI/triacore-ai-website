import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../context/LanguageContext';

// Automatisch mockups laden uit public/mockups
const mockupFiles = import.meta.glob('/public/mockups/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', { eager: true });
const websites = Object.entries(mockupFiles)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([path, module], index) => ({
        id: index + 1,
        title: path.split('/').pop().split('.')[0], // Gebruik bestandsnaam als titel
        image: path.replace('/public', '') // Pad voor in de browser (zonder /public)
    }));

import CTAButton from './cta-button';

export default function ImageGallery() {
    const { language } = useLanguage();
    const [expandedId, setExpandedId] = useState(2);

    return (
        <section id="digitale-zichtbaarheid" className="py-32 px-6 md:px-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="hero-title text-4xl md:text-5xl mb-4">
                        {language === 'nl' ? 'Digitale zichtbaarheid.' : 'Digital presence.'}
                    </h2>
                    <p className="section-subtitle text-lg text-foreground/60 max-w-2xl mx-auto">
                        {language === 'nl'
                            ? 'Een professionele website, logisch opgebouwd en gericht op echte resultaten.'
                            : 'A professional website, logically structured and focused on real results.'}
                    </p>
                </div>

                {/* Gallery Container */}
                <div className="flex flex-col md:flex-row gap-4 h-[500px] md:h-[600px] w-full">
                    {websites.map((site) => (
                        <motion.div
                            key={site.id}
                            onClick={() => setExpandedId(site.id)}
                            onMouseEnter={() => setExpandedId(site.id)}
                            className={cn(
                                "relative cursor-pointer overflow-hidden rounded-[2rem] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl shadow-black/5",
                                expandedId === site.id ? "flex-[15]" : "flex-[1.5]"
                            )}
                            layout
                        >
                            <motion.img
                                src={site.image}
                                alt={site.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                initial={false}
                                transition={{ duration: 0.5 }}
                            />

                            {/* Overlay for non-expanded items to keep it clean */}
                            <div className={cn(
                                "absolute inset-0 bg-black/5 transition-opacity duration-500",
                                expandedId === site.id ? "opacity-0" : "opacity-100"
                            )} />
                        </motion.div>
                    ))}
                </div>

                {/* Info Text & CTA */}
                <div className="mt-16 text-center max-w-2xl mx-auto flex flex-col items-center">
                    <p className="text-lg text-foreground/60 mb-10 leading-relaxed">
                        {language === 'nl'
                            ? 'Tijdens een korte kennismaking tonen we je meteen een gratis concept van jouw mogelijke website.'
                            : 'During a short consultation, we will immediately show you a free concept of your potential website.'}
                    </p>

                    <CTAButton to="/contact">
                        {language === 'nl' ? 'Plan een gratis gesprek' : 'Schedule a free consultation'}
                    </CTAButton>

                    <p className="mt-4 text-sm text-foreground/40 font-medium">
                        {language === 'nl' ? 'Inclusief gratis voorbeeld homepage.' : 'Includes a free example homepage.'}
                    </p>
                </div>
            </div>
        </section>
    );
}
