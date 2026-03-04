import React, { useState, useEffect } from 'react';
import { ArrowRight, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

// Simple count up hook for smooth number transitions
const useCountUp = (value, duration = 800) => {
    const [current, setCurrent] = useState(value);

    useEffect(() => {
        if (value === current) return;

        const startValue = current;
        const endValue = value;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutExpo) for a smooth slow-down effect
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCurrent(Math.floor(startValue + (endValue - startValue) * easeOut));

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setCurrent(endValue);
            }
        };

        requestAnimationFrame(step);
    }, [value, duration]);

    return current;
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
};

const AiCalculator = () => {
    const { language } = useLanguage();
    const [employees, setEmployees] = useState(2);
    const [hours, setHours] = useState(15);
    const [rate, setRate] = useState(35);

    // Berekende waarden
    const zonderAI = Math.round(employees * hours * 4.3 * rate);
    const metAI = Math.round(employees * (hours * 0.70) * 4.3 * rate);
    const besparing = zonderAI - metAI;

    // Geanimeerde waarden
    const animatedZonderAI = useCountUp(zonderAI);
    const animatedMetAI = useCountUp(metAI);
    const animatedBesparing = useCountUp(besparing);

    return (
        <section className="relative w-full overflow-hidden">
            {/* Achtergrond met vloeiende fade: Donker -> Wit -> Donker */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundColor: '#ffffff',
                    backgroundImage: 'linear-gradient(to bottom, rgb(6,10,22) 0%, rgb(6,10,22) 5%, rgba(6,10,22,0.7) 20%, rgba(6,10,22,0) 35%, rgba(6,10,22,0) 65%, rgba(6,10,22,0.7) 80%, rgb(6,10,22) 95%, rgb(6,10,22) 100%)'
                }}
            />

            <div className="relative z-10 py-32 px-6 md:px-16 flex justify-center w-full">

                {/* Minimalistische, premium Card */}
                <div className="w-full max-w-5xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-[0_10px_50px_rgba(0,0,0,0.06)] border border-black/5 overflow-hidden flex flex-col md:flex-row">

                    {/* Linkerkant - Mini Calculator */}
                    <div className="w-full md:w-[45%] bg-neutral-50 p-8 md:p-12 border-b md:border-b-0 md:border-r border-black/5 flex flex-col justify-between">

                        <div className="space-y-8">

                            {/* Medewerkers */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-medium text-foreground">
                                    <label>{language === 'nl' ? 'Aantal medewerkers' : 'Number of employees'}</label>
                                    <span className="text-accent bg-accent/10 px-2 py-0.5 rounded-md">{employees}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1" max="150"
                                    value={employees}
                                    onChange={(e) => setEmployees(Number(e.target.value))}
                                    className="w-full h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-accent transition-all"
                                />
                            </div>

                            {/* Uren per week */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-medium text-foreground">
                                    <label>{language === 'nl' ? 'Uren per week aan repetitieve taken' : 'Hours per week on repetitive tasks'}</label>
                                    <span className="text-accent bg-accent/10 px-2 py-0.5 rounded-md">{hours} {language === 'nl' ? 'u' : 'h'}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1" max="40"
                                    value={hours}
                                    onChange={(e) => setHours(Number(e.target.value))}
                                    className="w-full h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-accent transition-all"
                                />
                                <p className="text-[11px] text-foreground/40 leading-relaxed pt-1">
                                    {language === 'nl'
                                        ? 'Bijvoorbeeld: opvolging, rapportage, data-invoer, e-mails, planning.'
                                        : 'For example: follow-ups, reporting, data entry, emails, scheduling.'}
                                </p>
                            </div>

                            {/* Uurtarief */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-medium text-foreground">
                                    <label>{language === 'nl' ? 'Bruto uurtarief (€)' : 'Gross hourly rate (€)'}</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 text-foreground/50 text-sm">€</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={rate}
                                            onChange={(e) => setRate(Number(e.target.value) || 0)}
                                            className="w-24 pl-7 pr-3 py-1.5 text-sm bg-white border border-black/10 rounded-md focus:outline-none focus:border-accent text-foreground transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Resultaten Weergave */}
                        <div className="mt-10 md:mt-12 pt-8 border-t border-black/5">
                            <p className="text-sm font-medium text-foreground mb-6">
                                {language === 'nl' ? 'Gemiddelde tijdswinst door AI:' : 'Average time saved with AI:'} <span className="text-accent">30%</span> <span className="text-foreground/40 font-normal">{language === 'nl' ? '(typisch 20–40%)' : '(typically 20-40%)'}</span>
                            </p>
                            <div className="flex justify-between gap-4 mb-6">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 mb-1">{language === 'nl' ? 'Zonder AI' : 'Without AI'}</div>
                                    <div className="text-lg font-medium text-foreground/60 transition-all duration-300">{formatCurrency(animatedZonderAI)}<span className="text-xs font-normal">/m</span></div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 mb-1">{language === 'nl' ? 'Met AI' : 'With AI'}</div>
                                    <div className="text-lg font-medium text-foreground transition-all duration-300">{formatCurrency(animatedMetAI)}<span className="text-xs font-normal">/m</span></div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm relative overflow-hidden group">
                                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50 block mb-1">{language === 'nl' ? 'Geschatte besparing per maand' : 'Estimated monthly savings'}</span>
                                    <div className="text-4xl form-semibold text-accent tracking-tight transition-all duration-300">
                                        {formatCurrency(animatedBesparing)}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Rechterkant - Uitlegtekst */}
                    <div className="w-full md:w-[55%] p-8 md:p-16 flex flex-col justify-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-black/5 text-foreground/60 text-xs font-bold tracking-widest uppercase mb-8 w-max">
                            {language === 'nl' ? 'Inschatting' : 'Estimate'}
                        </span>

                        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-6 leading-[1.1]">
                            {language === 'nl' ? <p>Wat betekent dit<br />in jouw bedrijf?</p> : <p>What does this mean<br />for your business?</p>}
                        </h2>

                        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-10 max-w-lg">
                            {language === 'nl'
                                ? 'Veel repetitieve taken kosten onzichtbaar meer dan je denkt. AI-agents nemen een deel van dat werk over en maken tijd vrij voor taken met meer impact.'
                                : 'Many repetitive tasks cost invisibly more than you might think. AI agents take over a part of that work and free up time for high-impact tasks.'}
                        </p>

                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 text-base font-semibold text-foreground hover:text-accent transition-colors group relative w-max"
                        >
                            {language === 'nl' ? 'Bespreek je case' : 'Discuss your case'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            <span className="absolute bottom-[-2px] left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AiCalculator;
