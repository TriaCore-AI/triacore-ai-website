import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import CTAButton from './cta-button';
import { useLanguage } from '../../context/LanguageContext';

// De drie oplossingen, samen in het dropdownmenu "Oplossingen"
const OPLOSSINGEN = [
    { to: '/custom-oplossingen', title: { nl: 'Custom tools', en: 'Custom tools' }, sub: { nl: 'Software op maat rond uw processen', en: 'Custom software around your processes' } },
    { to: '/workshops', title: { nl: 'Workshops', en: 'Workshops' }, sub: { nl: 'Uw team leert werken met AI', en: 'Your team learns to work with AI' } },
    { to: '/ai-begeleiding', title: { nl: 'Tweede brein', en: 'Second Brain' }, sub: { nl: 'We zetten AI volledig voor u op', en: 'We set up AI for you, end to end' } }
];

export default function Navbar() {
    const { language, toggleLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const closeTimer = useRef(null);
    const location = useLocation();

    // Prevent background scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Close menus when route changes
    useEffect(() => {
        setIsOpen(false);
        setDropdown(false);
    }, [location.pathname]);

    // Close menus on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                setDropdown(false);
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    // Het dropdownmenu opent bij hover en sluit met een korte vertraging, zodat je rustig
    // van de knop naar het menu kan bewegen
    const openDropdown = () => {
        clearTimeout(closeTimer.current);
        setDropdown(true);
    };
    const closeDropdown = () => {
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setDropdown(false), 150);
    };

    const linkClass = 'hover:text-foreground transition-colors';
    const oplossingActive = OPLOSSINGEN.some((o) => o.to === location.pathname);

    return (
        <>
            <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
                <div className="w-full md:max-w-[1000px] max-w-[600px] flex items-center justify-between px-6 py-3 rounded-full bg-background/60 backdrop-blur-xl border border-foreground/5 shadow-sm pointer-events-auto">
                    <Link to="/" className="hover:opacity-80 transition-opacity z-50">
                        <img
                            src="/logo/TriaCore Logo Zwart.svg"
                            alt="TriaCore AI Logo"
                            className="h-11 w-auto md:h-12"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-8 text-sm font-medium text-foreground/70 items-center">
                        <Link to="/" onClick={() => window.scrollTo(0, 0)} className={linkClass}>Home</Link>
                        <div className="relative" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
                            <button
                                type="button"
                                onClick={() => setDropdown((d) => !d)}
                                aria-expanded={dropdown}
                                aria-haspopup="true"
                                className={`inline-flex items-center gap-1.5 transition-colors hover:text-foreground ${oplossingActive || dropdown ? 'text-foreground' : ''}`}
                            >
                                {language === 'nl' ? 'Oplossingen' : 'Solutions'}
                                <ChevronDown size={14} strokeWidth={1.75} className={`transition-transform duration-300 ${dropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Het menu zelf, niet doorzichtig, in de kleur van onze lichte kaarten. De binnenruimte
                                bovenaan is een brug, zodat het niet sluit terwijl je van de knop naar beneden beweegt */}
                            <div
                                className={`absolute left-1/2 top-full -translate-x-1/2 pt-5 transition-all duration-300 ease-out ${dropdown ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}`}
                            >
                                <div className="w-80 rounded-2xl bg-[#fafafa] border border-foreground/[0.08] p-2 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)]">
                                    {OPLOSSINGEN.map((o) => (
                                        <Link
                                            key={o.to}
                                            to={o.to}
                                            className="group/item block rounded-xl px-4 py-3 transition-colors duration-300 hover:bg-white"
                                        >
                                            <span className={`block text-[15px] font-medium transition-colors duration-300 group-hover/item:text-accent ${location.pathname === o.to ? 'text-accent' : 'text-foreground'}`}>
                                                {o.title[language]}
                                            </span>
                                            <span className="mt-0.5 block text-[13px] font-normal text-foreground/50">{o.sub[language]}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Link to="/projecten" className={linkClass}>{language === 'nl' ? 'Projecten' : 'Projects'}</Link>
                        <Link to="/team" className={linkClass}>Team</Link>
                        <Link to="/contact" className={linkClass}>Contact</Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="text-sm font-semibold tracking-wide text-foreground/60 hover:text-foreground transition-colors"
                        >
                            {language === 'nl' ? 'NL' : 'EN'}
                        </button>
                        <CTAButton to="/contact" size="sm">
                            {language === 'nl' ? 'Plan een gesprek' : 'Book a call'}
                        </CTAButton>
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="flex items-center gap-4 md:hidden z-50">
                        <button
                            onClick={toggleLanguage}
                            className="text-sm font-semibold tracking-wide text-foreground/60 hover:text-foreground transition-colors"
                        >
                            {language === 'nl' ? 'NL' : 'EN'}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 -mr-2 text-foreground/80 hover:text-foreground transition-colors"
                            aria-label={isOpen ? 'Sluit menu' : 'Open menu'}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Overlay */}
            <div
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 bg-background/95 backdrop-blur-lg z-40 overflow-y-auto transition-all duration-500 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div onClick={(e) => e.stopPropagation()} className="flex flex-col items-center justify-center min-h-full gap-8 px-6 py-28 text-xl font-medium">
                    <Link to="/" onClick={() => { setIsOpen(false); window.scrollTo(0, 0); }} className="hover:text-accent transition-colors">Home</Link>
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-sm font-normal text-foreground/50">{language === 'nl' ? 'Oplossingen' : 'Solutions'}</span>
                        {OPLOSSINGEN.map((o) => (
                            <Link key={o.to} to={o.to} onClick={() => setIsOpen(false)} className="hover:text-accent transition-colors">{o.title[language]}</Link>
                        ))}
                    </div>
                    <Link to="/projecten" onClick={() => setIsOpen(false)} className="hover:text-accent transition-colors">{language === 'nl' ? 'Projecten' : 'Projects'}</Link>
                    <Link to="/team" onClick={() => setIsOpen(false)} className="hover:text-accent transition-colors">Team</Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-accent transition-colors">Contact</Link>

                    <div className="mt-8" onClick={() => setIsOpen(false)}>
                        <CTAButton to="/contact" size="md">
                            {language === 'nl' ? 'Plan een gesprek' : 'Book a call'}
                        </CTAButton>
                    </div>
                </div>
            </div>
        </>
    );
}
