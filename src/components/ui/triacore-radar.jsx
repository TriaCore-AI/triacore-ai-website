import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const TriacoreRadar = ({ className }) => {
    return (
        <div className={cn(
            "relative group overflow-hidden rounded-[2.5rem] border border-foreground/5 bg-white p-12 transition-all hover:border-foreground/10 hover:shadow-2xl flex items-center justify-center",
            className
        )}>
            {/* Visual Section */}
            <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center bg-accent/[0.02] rounded-3xl overflow-hidden border border-accent/5">
                {/* Radar Circles */}
                {[1, 2, 3].map((circle) => (
                    <div
                        key={circle}
                        className="absolute border border-accent/10 rounded-full"
                        style={{
                            width: `${circle * 33}%`,
                            height: `${circle * 33}%`
                        }}
                    />
                ))}

                {/* Radar Sweep */}
                <motion.div
                    className="absolute origin-center w-full h-full"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent to-accent/40 origin-left" />
                </motion.div>

                {/* Pulsing Nodes */}
                {[
                    { top: '30%', left: '40%', delay: 0 },
                    { top: '60%', left: '70%', delay: 2 },
                    { top: '45%', left: '25%', delay: 4 },
                    { top: '20%', left: '60%', delay: 1 },
                    { top: '75%', left: '35%', delay: 3 },
                ].map((node, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-3 h-3 rounded-full bg-accent"
                        style={{ top: node.top, left: node.left }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: [0, 1.5, 0],
                            opacity: [0, 0.7, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: node.delay,
                            ease: "easeInOut"
                        }}
                    />
                ))}

                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />
            </div>
        </div>
    );
};

export default TriacoreRadar;
