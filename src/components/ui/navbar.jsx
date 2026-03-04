import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import CTAButton from './cta-button';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
    const { language, toggleLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
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

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Close menu on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <>
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:max-w-[1000px] max-w-[600px]">
                <div className="flex items-center justify-between px-6 py-4 rounded-[2rem] bg-background/60 backdrop-blur-xl border border-foreground/5 shadow-sm">
                    <Link to="/" className="hover:opacity-80 transition-opacity z-50">
                        <img
                            src="/logo/TriaCore Logo Zwart.svg"
                            alt="TriaCore AI Logo"
                            className="h-10 w-auto md:h-20"
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-8 text-sm font-medium text-foreground/70 items-center">
                        <Link to="/trajecten" className="hover:text-foreground transition-colors">{language === 'nl' ? 'Trajecten' : 'Paths'}</Link>
                        <Link to="/ai-agents" className="hover:text-foreground transition-colors">{language === 'nl' ? 'AI-agents' : 'AI Agents'}</Link>
                        <Link to="/team" className="hover:text-foreground transition-colors">Team</Link>
                        <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
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
                className={`fixed inset-0 bg-background/95 backdrop-blur-lg z-40 transition-all duration-500 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div onClick={(e) => e.stopPropagation()} className="flex flex-col items-center justify-center h-full gap-8 px-6 text-xl font-medium">
                    <Link to="/trajecten" onClick={() => setIsOpen(false)} className="hover:text-accent transition-colors">{language === 'nl' ? 'Trajecten' : 'Paths'}</Link>
                    <Link to="/ai-agents" onClick={() => setIsOpen(false)} className="hover:text-accent transition-colors">{language === 'nl' ? 'AI-agents' : 'AI Agents'}</Link>
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
