import React, { useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import ResourceArticle from '../components/content/ResourceArticle';
import { useLanguage } from '../context/LanguageContext';
import { getResource, inTaal } from '../data/resources';
import { SITE_URL } from '../data/seo';

// Een artikel op het vroegere adres /resources/<slug> naar hetzelfde artikel in de kennisbank
// (op Netlify gebeurt dat al eerder, via public/_redirects)
export function NaarKennisbank() {
    const { slug } = useParams();
    return <Navigate to={`/kennisbank/${slug}`} replace />;
}

// Eén artikel uit de kennisbank (/kennisbank/<slug>). Dezelfde binnenkomst als de casepagina's: de titel onthult zich van links naar rechts,
// de rest komt zacht op.
export default function ResourceDetail() {
    const { slug } = useParams();
    const { language } = useLanguage();
    const ref = useRef(null);
    const resource = getResource(slug);

    useEffect(() => {
        if (!resource) return;
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const tl = gsap.timeline({ paused: true });
            tl.from('.detail-fade-top', { y: 10, opacity: 0, duration: 1.2, ease: 'power2.out', stagger: 0.1 })
                .fromTo('.detail-title',
                    { clipPath: 'inset(-20% 100% -35% -5%)', x: -16 },
                    { clipPath: 'inset(-20% -5% -35% -5%)', x: 0, duration: 1.8, ease: 'power2.inOut', clearProps: 'clipPath' }, 0.2)
                .from('.detail-fade', { y: 12, opacity: 0, duration: 1.4, ease: 'power2.out', stagger: 0.12 }, 1.1);
            const play = () => tl.play();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
            else play();
        }, ref);
        return () => ctx.revert();
    }, [resource, language]);

    // Onbestaand of offline gehaald: terug naar het overzicht
    if (!resource) return <Navigate to="/kennisbank" replace />;

    const tekst = inTaal(resource, language);
    return (
        <div ref={ref} className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo
                title={`${tekst.title} | TriaCore AI`}
                description={tekst.description}
                image={resource.thumbnail ? `${SITE_URL}${resource.thumbnail}` : undefined}
            />
            <Navbar />
            <main className="relative flex-grow px-6 md:px-16 lg:px-24 pt-36 md:pt-44 max-xl:[@media(max-height:500px)]:pt-32 pb-16 md:pb-24">
                <ResourceArticle resource={resource} language={language} />
            </main>
            <Footer />
        </div>
    );
}
