import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { CheckCircle2 } from 'lucide-react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useLanguage } from '../../context/LanguageContext';

const TriacoreRoadmap = ({ className }) => {
    const { language } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);

    const milestones = language === 'nl' ? [
        { title: "ERP en tools integreren", date: "Maand 1" },
        { title: "Processen automatiseren", date: "Maand 2" },
        { title: "AI-agents inzetten", date: "Maand 3" },
        { title: "Inzicht & optimalisatie", date: "Maand 4" },
    ] : [
        { title: "Integrate ERP and tools", date: "Month 1" },
        { title: "Automate processes", date: "Month 2" },
        { title: "Deploy AI agents", date: "Month 3" },
        { title: "Insights & optimization", date: "Month 4" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % milestones.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [milestones.length]);

    return (
        <div className={cn(
            "relative group overflow-hidden rounded-[2.5rem] border border-foreground/5 bg-white p-12 transition-all hover:border-foreground/10 hover:shadow-2xl flex items-center justify-center",
            className
        )}>
            <div className="relative w-full aspect-square max-w-[400px] bg-accent/[0.02] rounded-3xl border border-accent/5 overflow-hidden flex items-center justify-center p-6">
                <div className="flex flex-col items-center justify-center gap-8 md:gap-12 w-full h-full">
                    {milestones.map((ms, i) => (
                        <div key={i} className="relative flex items-center gap-8 md:gap-12 w-full px-4 md:px-12">
                            {/* Connection Line (Vertical) */}
                            {i !== milestones.length - 1 && (
                                <div className="absolute top-[32px] left-[32px] md:left-[68px] w-[2px] h-[calc(100%+32px)] md:h-[calc(100%+48px)] bg-accent/10">
                                    <motion.div
                                        className="w-full bg-accent"
                                        initial={{ height: "0%" }}
                                        animate={{ height: activeIndex > i ? "100%" : "0%" }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                    />
                                </div>
                            )}

                            {/* Milestone Node */}
                            <div className="relative flex-shrink-0">
                                <motion.div
                                    animate={{
                                        scale: activeIndex === i ? 1.2 : 1,
                                        backgroundColor: activeIndex >= i ? "var(--color-accent)" : "rgba(var(--color-accent), 0.05)",
                                        borderColor: activeIndex >= i ? "var(--color-accent)" : "rgba(var(--color-accent), 0.2)"
                                    }}
                                    className={cn(
                                        "w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-colors duration-500",
                                        activeIndex >= i ? "text-white" : "text-accent/20"
                                    )}
                                >
                                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                                </motion.div>

                                {activeIndex === i && (
                                    <motion.div
                                        layoutId="active-glow-vertical"
                                        className="absolute inset-0 rounded-full bg-accent/20 -z-10"
                                        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                )}
                            </div>

                            {/* Label (Side by Side) */}
                            <motion.div
                                animate={{ opacity: activeIndex === i ? 1 : 0.4, x: activeIndex === i ? 0 : -5 }}
                                className="flex flex-col text-left"
                            >
                                <p className="text-sm md:text-base font-semibold text-foreground leading-tight">{ms.title}</p>
                                <p className="text-[10px] md:text-xs text-foreground/40 font-mono tracking-wider">{ms.date}</p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TriacoreRoadmap;
