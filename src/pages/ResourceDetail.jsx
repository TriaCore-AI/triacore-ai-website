import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowDown, Copy, Check, Download } from 'lucide-react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import CTAButton from '../components/ui/cta-button';
import { useLanguage } from '../context/LanguageContext';
import { getResourceBySlug, CATEGORIES, formatDate } from '../data/resources';
import gsap from 'gsap';

// --- BLOCK RENDERERS ---

function PromptBlock({ block, language }) {
    const [copied, setCopied] = useState(false);
    const text = block[language];
    const label = block.label ? block.label[language] : (language === 'nl' ? 'Kopieerbaar' : 'Copyable');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard niet beschikbaar — stilletjes negeren.
        }
    };

    return (
        <div id={block.anchor} className="scroll-mt-32 my-10 rounded-[1.5rem] border border-foreground/15 bg-white overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/10 bg-foreground/[0.02]">
                <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-accent">
                    {label}
                </span>
                <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground/45 hover:text-accent transition-colors duration-300"
                >
                    {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
                    {copied
                        ? (language === 'nl' ? 'Gekopieerd' : 'Copied')
                        : (language === 'nl' ? 'Kopieer' : 'Copy')}
                </button>
            </div>
            <pre className="px-6 py-6 text-sm text-foreground/75 font-sans leading-relaxed whitespace-pre-wrap break-words">
                {text}
            </pre>
        </div>
    );
}

function ContentBlock({ block, language }) {
    switch (block.type) {
        case 'heading':
            return (
                <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground mt-2 mb-6">
                    {block[language]}
                </h2>
            );

        case 'divider':
            return <div className="my-12 h-px w-full bg-foreground/10" />;

        case 'paragraph':
            return (
                <p className="text-foreground/70 text-lg font-light leading-relaxed mb-6">
                    {block[language]}
                </p>
            );

        case 'list':
            return (
                <ul className="space-y-3 mb-6">
                    {block[language].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-foreground/70 text-lg font-light leading-relaxed">
                            <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            );

        case 'callout':
            return (
                <div className="my-10 p-7 bg-accent/5 border border-accent/20 rounded-[1.5rem]">
                    <p className="text-foreground/75 text-base leading-relaxed font-light">
                        {block[language]}
                    </p>
                </div>
            );

        case 'prompt':
            return <PromptBlock block={block} language={language} />;

        case 'pdf':
            return (
                <div className="my-10">
                    <a
                        href={block.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 px-7 py-4 bg-foreground text-background rounded-full font-medium transition-all duration-300 hover:scale-[1.02]"
                    >
                        <Download size={18} className="transition-transform group-hover:translate-y-0.5" />
                        {block.label
                            ? block.label[language]
                            : (language === 'nl' ? 'Download PDF' : 'Download PDF')}
                    </a>
                </div>
            );

        case 'image':
            return (
                <figure className="my-12">
                    <div className="overflow-hidden rounded-[1.5rem] border border-foreground/10 shadow-xl bg-[#020617]">
                        <img
                            src={block.src}
                            alt={block.alt ? block.alt[language] : ''}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                    {block.caption && (
                        <figcaption className="mt-3 text-center text-sm text-foreground/45 font-light">
                            {block.caption[language]}
                        </figcaption>
                    )}
                </figure>
            );

        case 'definition':
            return (
                <div className="my-12 rounded-[1.5rem] border border-foreground/10 bg-white p-8 md:p-10 shadow-sm">
                    <div className="flex items-baseline gap-3 flex-wrap">
                        <h3 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground">
                            {block.term[language]}
                        </h3>
                        {block.kind && (
                            <span className="italic text-foreground/40 text-lg font-light">
                                {block.kind[language]}
                            </span>
                        )}
                    </div>
                    <div className="mt-5 mb-5 h-px w-full bg-foreground/10" />
                    <p className="uppercase tracking-[0.2em] text-[10px] font-bold text-accent mb-2">
                        {language === 'nl' ? 'Betekenis' : 'Meaning'}
                    </p>
                    <p className="text-foreground/70 text-lg font-light leading-relaxed">
                        {block[language]}
                    </p>
                </div>
            );

        case 'quote':
            return (
                <blockquote className="my-12 border-l-2 border-accent pl-6 md:pl-8">
                    <p className="text-2xl md:text-3xl font-light leading-snug text-foreground/85">
                        {block[language]}
                    </p>
                    {block.source && (
                        <cite className="mt-4 block not-italic text-sm text-foreground/45">
                            {block.source[language]}
                        </cite>
                    )}
                </blockquote>
            );

        case 'cards':
            return (
                <div className="my-10 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                    {block.items.map((item, i) => (
                        <div
                            key={i}
                            className="rounded-[1.25rem] border border-foreground/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
                        >
                            {item.label && (
                                <p className="uppercase tracking-[0.18em] text-[10px] font-bold text-accent mb-3">
                                    {item.label[language]}
                                </p>
                            )}
                            <p className="text-foreground/70 font-light leading-relaxed">
                                {item[language]}
                            </p>
                        </div>
                    ))}
                </div>
            );

        case 'steps':
            return (
                <div className="my-10 space-y-3">
                    {block.items.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-4 rounded-[1.25rem] border border-foreground/10 bg-white p-5"
                        >
                            <span className="shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-sm">
                                {i + 1}
                            </span>
                            <div>
                                <p className="font-semibold text-foreground">
                                    {item.title[language]}
                                </p>
                                <p className="text-foreground/65 font-light leading-relaxed mt-0.5">
                                    {item[language]}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            );

        case 'table': {
            const t = block[language];
            return (
                <div className="my-10 overflow-x-auto rounded-[1.25rem] border border-foreground/10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-foreground/[0.03]">
                                {t.head.map((h, i) => (
                                    <th
                                        key={i}
                                        className="px-5 py-3 text-[11px] uppercase tracking-[0.15em] font-bold text-accent border-b border-foreground/10"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {t.rows.map((row, ri) => (
                                <tr key={ri} className="border-b border-foreground/[0.07] last:border-0">
                                    {row.map((cell, ci) => (
                                        <td
                                            key={ci}
                                            className={`px-5 py-3.5 align-top leading-relaxed font-light ${ci === 0 ? 'text-foreground/85 font-medium' : 'text-foreground/65'}`}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        default:
            return null;
    }
}

export default function ResourceDetail() {
    const { slug } = useParams();
    const { language } = useLanguage();
    const containerRef = useRef(null);
    const resource = getResourceBySlug(slug);

    useEffect(() => {
        if (!resource) return;
        let ctx = gsap.context(() => {
            gsap.fromTo(
                '.detail-stagger',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.15 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [resource]);

    // Onbestaande slug → terug naar overzicht.
    if (!resource) {
        return <Navigate to="/resources" replace />;
    }

    const category = CATEGORIES[resource.category];

    return (
        <div ref={containerRef} className="relative min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">

            {/* NOISE OVERLAY */}
            <svg className="noise-overlay pointer-events-none fixed inset-0 z-50 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            <Navbar />

            {/* GRID BACKGROUND */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.02] z-0"
                style={{
                    backgroundImage: `linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)`,
                    backgroundSize: '4rem 4rem',
                }}
            />

            <div className="relative z-10 flex-1">
                <article className="max-w-3xl mx-auto px-6 md:px-8 pt-40 md:pt-48 pb-24">
                    {/* Back link */}
                    <Link
                        to="/resources"
                        className="detail-stagger inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground/50 hover:text-accent transition-colors duration-300 mb-12"
                    >
                        <ArrowLeft size={14} />
                        {language === 'nl' ? 'Alle resources' : 'All resources'}
                    </Link>

                    {/* Header */}
                    <div className="detail-stagger flex items-center gap-4 mb-6">
                        {category && (
                            <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-accent">
                                {category[language]}
                            </span>
                        )}
                        <span className="text-foreground/30">·</span>
                        <span className="text-[12px] text-foreground/40 font-light">
                            {formatDate(resource.date, language)}
                        </span>
                    </div>

                    <h1 className="detail-stagger font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-foreground mb-8">
                        {resource.title[language]}
                    </h1>

                    <p className={`detail-stagger text-xl text-foreground/60 font-light leading-relaxed ${resource.headerCta ? 'mb-7' : 'mb-12 pb-12 border-b border-foreground/10'}`}>
                        {resource.description[language]}
                    </p>

                    {resource.headerCta && (
                        <div className="detail-stagger mb-12 pb-12 border-b border-foreground/10">
                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .getElementById(resource.headerCta.target)
                                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                }
                                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-accent text-white text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/25"
                            >
                                {resource.headerCta[language]}
                                <ArrowDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                            </button>
                        </div>
                    )}

                    {/* Content blocks */}
                    <div className="detail-stagger">
                        {resource.blocks.map((block, i) => (
                            <ContentBlock key={i} block={block} language={language} />
                        ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-20 pt-12 border-t border-foreground/10 text-center">
                        <p className="font-serif text-2xl md:text-3xl text-foreground mb-3">
                            {language === 'nl'
                                ? 'Benieuwd wat AI in uw bedrijf kan doen?'
                                : 'Curious what AI can do in your company?'}
                        </p>
                        <p className="text-foreground/55 font-light mb-8 max-w-lg mx-auto">
                            {language === 'nl'
                                ? 'Wij vertalen deze inzichten naar concrete oplossingen op maat van uw processen.'
                                : 'We translate these insights into concrete solutions tailored to your processes.'}
                        </p>
                        <div className="flex justify-center">
                            <CTAButton to="/contact" variant="primary">
                                {language === 'nl' ? 'Plan een gesprek' : 'Book a call'}
                            </CTAButton>
                        </div>
                    </div>
                </article>
            </div>

            <Footer />
        </div>
    );
}
