import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getSortedResources, CATEGORIES, formatDate, getReadingTime } from '../../data/resources';

const ROTATE_INTERVAL = 6000;

export default function ResourceCarousel() {
    const { language } = useLanguage();
    const items = getSortedResources();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (items.length < 2) return;
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % items.length);
        }, ROTATE_INTERVAL);
        return () => clearInterval(timer);
    }, [items.length]);

    if (items.length === 0) return null;

    const resource = items[index];
    const category = CATEGORIES[resource.category];

    return (
        <div className="w-full">
            <Link
                to={`/resources/${resource.slug}`}
                className="group relative flex flex-col bg-white border border-foreground/5 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={resource.slug}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                        <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#020617]">
                            {resource.thumbnail ? (
                                <img
                                    src={resource.thumbnail}
                                    alt={resource.title[language]}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="font-serif text-2xl text-white/90 italic px-6 text-center">
                                        {category ? category[language] : ''}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="p-8">
                            <div className="flex items-center justify-between gap-4 mb-3">
                                {category && (
                                    <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-accent">
                                        {category[language]}
                                    </span>
                                )}
                                <span className="text-[11px] text-foreground/40 font-light whitespace-nowrap">
                                    {formatDate(resource.date, language)}
                                    {` · ${getReadingTime(resource, language)} min`}
                                </span>
                            </div>
                            <h3 className="font-serif text-xl md:text-2xl leading-snug tracking-tight text-foreground mb-2">
                                {resource.title[language]}
                            </h3>
                            <p className="text-sm text-foreground/55 font-light leading-relaxed line-clamp-2 mb-5">
                                {resource.description[language]}
                            </p>
                            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground/70 group-hover:text-accent transition-colors duration-300">
                                {language === 'nl' ? 'Lees meer' : 'Read more'}
                                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </Link>

            {items.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    {items.map((item, i) => (
                        <button
                            key={item.slug}
                            onClick={() => setIndex(i)}
                            aria-label={item.title[language]}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-accent' : 'w-1.5 bg-foreground/15 hover:bg-foreground/30'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
