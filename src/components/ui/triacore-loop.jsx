import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Settings, Shield, Zap, RefreshCw } from 'lucide-react';

const TriacoreLoop = ({ className }) => {
    const steps = [
        { icon: Shield },
        { icon: Settings },
        { icon: Zap },
        { icon: RefreshCw },
    ];

    return (
        <div className={cn(
            "relative group overflow-hidden rounded-[2.5rem] border border-foreground/5 bg-white p-12 transition-all hover:border-foreground/10 hover:shadow-2xl flex items-center justify-center",
            className
        )}>
            {/* Visual Section - Circular Workflow */}
            <div className="relative w-full aspect-square max-w-[400px] bg-accent/[0.02] rounded-3xl border border-accent/5 flex items-center justify-center overflow-hidden">
                {/* Main Rotating Circle */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="relative w-56 h-56 rounded-full border-2 border-dashed border-accent/10"
                >
                    {steps.map((step, i) => {
                        const angle = (i * 360) / steps.length;
                        return (
                            <div
                                key={i}
                                className="absolute"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: `rotate(${angle}deg) translate(112px) rotate(-${angle}deg)`
                                }}
                            >
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                    className="w-14 h-14 rounded-2xl bg-white border border-accent/10 shadow-lg flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                                >
                                    <step.icon className="w-6 h-6 text-accent" />
                                </motion.div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* Center Hub */}
                <div className="absolute w-16 h-16 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                            boxShadow: ["0 0 0px var(--color-accent)", "0 0 20px var(--color-accent)", "0 0 0px var(--color-accent)"]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="w-6 h-6 rounded-full bg-accent"
                    />
                </div>

                {/* Connection Particles/Rings */}
                <motion.div
                    className="absolute inset-0 pointer-events-none flex items-center justify-center"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                >
                    <div className="w-64 h-64 rounded-full border border-accent/5" />
                    <div className="absolute w-48 h-48 rounded-full border border-accent/10" />
                </motion.div>

                {/* Floating gradient detail */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full" />
            </div>
        </div>
    );
};

export default TriacoreLoop;
