import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import CTAButton from './cta-button';
import { useLanguage } from '../../context/LanguageContext';

// De oplossingen, samen in het dropdownmenu "Oplossingen". De pagina over AI-agents (/ai-begeleiding) is
// tijdelijk uit het menu gehaald tot er genoeg bewijs is (beslissing Lucas, 6/11). Terugzetten:
// { to: '/ai-begeleiding', title: { nl: 'AI-agents', en: 'AI agents' }, sub: { ... } }
const OPLOSSINGEN = [
    { to: '/custom-oplossingen', title: { nl: 'Custom tools', en: 'Custom tools' }, sub: { nl: 'Software op maat rond jouw processen', en: 'Custom software around your processes' } },
    { to: '/workshops', title: { nl: 'Workshops', en: 'Workshops' }, sub: { nl: 'Jouw team leert werken met AI', en: 'Your team learns to work with AI' } }
];

// De opmaak van een regel in het menu op gsm: groot in de titelletter, de pagina waar je bent in het groen.
// De oplossingen onder het uitklapmenu staan iets kleiner, maar blijven ruim genoeg om op te tikken
const mobileRow = (active, small) => `hero-title block py-2 ${small ? 'text-[1.4rem]' : 'text-[2rem]'} leading-tight transition-colors outline-none focus-visible:underline [-webkit-tap-highlight-color:transparent] ${active ? 'text-accent' : 'text-foreground'}`;

function MobileLink({ to, active, small, onClick, children }) {
    return (
        <Link to={to} onClick={onClick} aria-current={active ? 'page' : undefined} className={mobileRow(active, small)}>
            {children}
        </Link>
    );
}

export default function Navbar() {
    const { language, toggleLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [mobileSolutions, setMobileSolutions] = useState(false);
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

    // Wordt het scherm breder dan gsm terwijl het gsm-menu open staat (bv. door de gsm te draaien), dan
    // verdwijnt het menu uit beeld; sluit het dan ook, anders blijft de pagina geblokkeerd voor scrollen
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)');
        const sluit = (e) => { if (e.matches) setIsOpen(false); };
        mq.addEventListener('change', sluit);
        return () => mq.removeEventListener('change', sluit);
    }, []);

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

    // Het menu op gsm sluiten; de oplossingen staan de volgende keer weer dicht
    const closeMobile = () => {
        setIsOpen(false);
        setMobileSolutions(false);
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

                    {/* Desktop Menu. Op een smalle tablet iets dichter bij elkaar, zodat er lucht blijft rond het logo en de knop */}
                    <div className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium text-foreground/70 items-center">
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

                    {/* Mobile Menu Toggle Button. Beide knoppen zijn 44px groot om op te tikken; de afstand
                        tussen NL en het icoon blijft ongeveer zoals ze was */}
                    <div className="flex items-center gap-0.5 md:hidden z-50">
                        <button
                            onClick={toggleLanguage}
                            className="inline-flex items-center justify-center min-w-11 min-h-11 text-sm font-semibold tracking-wide text-foreground/60 hover:text-foreground transition-colors [-webkit-tap-highlight-color:transparent]"
                        >
                            {language === 'nl' ? 'NL' : 'EN'}
                        </button>
                        <button
                            onClick={() => (isOpen ? closeMobile() : setIsOpen(true))}
                            className="p-2.5 -mr-2.5 rounded-full text-foreground/80 hover:text-foreground transition-colors outline-none focus-visible:outline-2 focus-visible:outline-accent [-webkit-tap-highlight-color:transparent]"
                            aria-label={language === 'nl' ? (isOpen ? 'Sluit menu' : 'Open menu') : (isOpen ? 'Close menu' : 'Open menu')}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Het menu op gsm: een effen vlak in het verloop van de huisstijl, zodat de pagina er niet doorheen
                schemert. Alles gecentreerd in de titelletter. Oplossingen staat als gewone regel in de lijst, met
                een pijltje, en klapt open tot de oplossingen */}
            <div
                onClick={closeMobile}
                style={{ background: 'linear-gradient(to bottom, #f5f7f6 0%, #ecf1ed 50%, #e2eae3 100%)' }}
                className={`fixed inset-0 z-40 overflow-y-auto overscroll-contain transition-opacity duration-500 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className={`flex flex-col items-center justify-center text-center min-h-full px-8 pt-32 pb-10 transition-transform duration-500 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-2'}`}
                >
                    <MobileLink to="/" active={location.pathname === '/'} onClick={() => { closeMobile(); window.scrollTo(0, 0); }}>Home</MobileLink>

                    <button
                        type="button"
                        onClick={() => setMobileSolutions((open) => !open)}
                        aria-expanded={mobileSolutions}
                        aria-controls="mobile-oplossingen"
                        className={`${mobileRow(oplossingActive)} inline-flex items-center gap-2`}
                    >
                        {language === 'nl' ? 'Oplossingen' : 'Solutions'}
                        <ChevronDown strokeWidth={1.5} className={`w-6 h-6 transition-transform duration-300 ${mobileSolutions ? 'rotate-180' : ''}`} />
                    </button>
                    <div
                        id="mobile-oplossingen"
                        inert={!mobileSolutions}
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${mobileSolutions ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                        <div className="overflow-hidden min-h-0">
                            {OPLOSSINGEN.map((o) => (
                                <MobileLink key={o.to} small to={o.to} active={location.pathname === o.to} onClick={closeMobile}>{o.title[language]}</MobileLink>
                            ))}
                        </div>
                    </div>

                    <MobileLink to="/projecten" active={location.pathname.startsWith('/projecten')} onClick={closeMobile}>{language === 'nl' ? 'Projecten' : 'Projects'}</MobileLink>
                    <MobileLink to="/team" active={location.pathname === '/team'} onClick={closeMobile}>Team</MobileLink>
                    <MobileLink to="/contact" active={location.pathname === '/contact'} onClick={closeMobile}>Contact</MobileLink>

                    <div className="mt-10" onClick={closeMobile}>
                        <CTAButton to="/contact" size="md">
                            {language === 'nl' ? 'Plan een gesprek' : 'Book a call'}
                        </CTAButton>
                    </div>
                </div>
            </div>
        </>
    );
}
