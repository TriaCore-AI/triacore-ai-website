import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './navbar';
import Footer from './footer';
import Seo from './seo';
import PageHeader from './page-header';
import './legal-page.css';

gsap.registerPlugin(ScrollTrigger);

// De vormgeving van de juridische pagina's (privacy en cookies): de gewone paginaheader met daaronder één
// rustige leeskolom, links uitgelijnd met de titel. De pagina's geven enkel hun tekst door; de opmaak van
// koppen, lijsten en links staat in legal-page.css. Elk hoofdstuk komt één keer zacht op.
export default function LegalPage({ seo, title, intro, updated, children }) {
    const tekstRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            gsap.utils.toArray(':scope > section', tekstRef.current).forEach((hoofdstuk) => {
                gsap.from(hoofdstuk, {
                    y: 16,
                    opacity: 0,
                    duration: 1.2,
                    ease: 'expo.out',
                    scrollTrigger: { trigger: hoofdstuk, start: 'top 90%', once: true }
                });
            });
        }, tekstRef);
        return () => ctx.revert();
    }, []);

    return (
        <div className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo title={seo.title} description={seo.description} />
            <Navbar />
            <main className="relative flex-grow">
                {/* De titel is één lang woord: op gsm schaalt hij mee met de schermbreedte, zodat hij altijd past */}
                <PageHeader
                    title={title}
                    intro={intro}
                    titleSize="text-[min(12vw,3rem)] sm:text-6xl md:text-7xl lg:text-[7.5rem]"
                >
                    <p className="text-sm text-foreground/50">{updated}</p>
                </PageHeader>
                <section className="px-6 md:px-16 lg:px-24 pb-16 md:pb-24">
                    <div className="max-w-7xl mx-auto">
                        <div ref={tekstRef} className="juridisch max-w-3xl">
                            {children}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
