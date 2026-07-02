import React, { useState } from 'react';
import { Copy, Check, Download, Monitor, Smartphone, Cog, Layers } from 'lucide-react';

// Optionele iconen voor het 'cards' blok (bv. platform vs app). Enkel deze
// namen zijn beschikbaar; laat item.icon weg voor een kaart zonder icoon.
const CARD_ICONS = { Monitor, Smartphone, Cog, Layers };

// --- BLOCK RENDERERS ---
// Gedeeld door Resources (ResourceDetail.jsx) en Projecten (ProjectDetail.jsx),
// zodat beide detailpagina's exact dezelfde bloktypes en opmaak gebruiken.
// Bloktypes technisch gedocumenteerd bovenaan src/data/resources.jsx.

// Rendert **vette** stukken als echte vetletters. De ruwe tekst (mét de
// sterretjes) wordt nog steeds gekopieerd, zodat ChatGPT/Claude het als
// markdown-opmaak herkent bij het plakken.
function renderInlineMarkdown(text) {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
        const match = part.match(/^\*\*([^*]+)\*\*$/);
        if (match) {
            return (
                <strong key={i} className="font-semibold text-foreground">
                    {match[1]}
                </strong>
            );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
    });
}

// Rendert een markdown-instructie netjes: # en ## worden koppen, regels die
// met "- " beginnen worden een opsomming, de rest wordt een alinea. De ruwe
// tekst (mét #, - en **) wordt nog steeds gekopieerd, zodat het bij plakken
// weer als markdown opmaakt in ChatGPT/Claude.
function renderPromptMarkdown(text) {
    const blocks = [];
    let bullets = null;

    const flushBullets = (key) => {
        if (bullets) {
            blocks.push(
                <ul key={`ul-${key}`} className="my-3 space-y-2">
                    {bullets}
                </ul>
            );
            bullets = null;
        }
    };

    text.split('\n').forEach((line, i) => {
        if (line.startsWith('## ')) {
            flushBullets(i);
            blocks.push(
                <h4 key={i} className="mt-6 mb-2 text-[15px] font-bold text-foreground">
                    {renderInlineMarkdown(line.slice(3))}
                </h4>
            );
        } else if (line.startsWith('# ')) {
            flushBullets(i);
            blocks.push(
                <h3 key={i} className="mt-1 mb-4 pb-3 border-b border-foreground/10 text-lg font-bold tracking-tight text-foreground">
                    {renderInlineMarkdown(line.slice(2))}
                </h3>
            );
        } else if (line.startsWith('- ')) {
            if (!bullets) bullets = [];
            bullets.push(
                <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{renderInlineMarkdown(line.slice(2))}</span>
                </li>
            );
        } else if (line.trim() === '') {
            flushBullets(i);
        } else {
            flushBullets(i);
            blocks.push(
                <p key={i} className="mb-2">
                    {renderInlineMarkdown(line)}
                </p>
            );
        }
    });

    flushBullets('end');
    return blocks;
}

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
            <div className="px-6 py-6 text-sm text-foreground/75 font-sans leading-relaxed break-words">
                {renderPromptMarkdown(text)}
            </div>
        </div>
    );
}

export function ContentBlock({ block, language }) {
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
                    {block.items.map((item, i) => {
                        const Icon = item.icon && CARD_ICONS[item.icon];
                        return (
                            <div
                                key={i}
                                className="rounded-[1.25rem] border border-foreground/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
                            >
                                {Icon && (
                                    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                                        <Icon size={16} className="text-accent" />
                                    </div>
                                )}
                                {item.label && (
                                    <p className="uppercase tracking-[0.18em] text-[10px] font-bold text-accent mb-3">
                                        {item.label[language]}
                                    </p>
                                )}
                                <p className="text-foreground/70 font-light leading-relaxed">
                                    {item[language]}
                                </p>
                            </div>
                        );
                    })}
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
