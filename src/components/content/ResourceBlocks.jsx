import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

// De inhoud van een resource-artikel, in de stijl van de nieuwe site (dezelfde rustige lijnen en lichte
// kaarten als de casepagina's). Eigen bestand, zodat de blokken van de projecten (ContentBlocks.jsx) niet
// veranderen. Het formaat staat in src/content/resources/README.md; de ERP maakt deze blokken.

// **vet**, *cursief*, `code` en [link](https://...) in een stuk tekst. Enkel http(s)- en mailto-links.
const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

export function Inline({ text }) {
    if (!text) return null;
    return text.split(INLINE).map((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) {
            return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        }
        if (/^\*[^*\s][^*]*\*$/.test(part)) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (/^`[^`]+`$/.test(part)) {
            return <code key={i} className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-[0.9em]">{part.slice(1, -1)}</code>;
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (link) {
            const href = link[2];
            if (!/^(https?:|mailto:|\/)/i.test(href)) return <React.Fragment key={i}>{link[1]}</React.Fragment>;
            const extern = /^https?:/i.test(href);
            return (
                <a
                    key={i}
                    href={href}
                    {...(extern ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-foreground underline decoration-accent/50 underline-offset-4 hover:decoration-accent transition-colors"
                >
                    {link[1]}
                </a>
            );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
    });
}

function PromptBlock({ block, language }) {
    const [copied, setCopied] = useState(false);
    const nl = language === 'nl';
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(block.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Klembord niet beschikbaar: niets doen
        }
    };
    return (
        <div className="my-10 rounded-3xl bg-[#fafafa] border border-foreground/[0.07] overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-6 md:px-7 py-4 border-b border-foreground/[0.07]">
                <span className="text-sm text-foreground/60">{block.label || (nl ? 'Prompt om te kopiëren' : 'Prompt to copy')}</span>
                <button
                    type="button"
                    onClick={copy}
                    className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-accent transition-colors duration-300"
                >
                    {copied ? <Check size={15} className="text-accent" /> : <Copy size={15} />}
                    {copied ? (nl ? 'Gekopieerd' : 'Copied') : (nl ? 'Kopieer' : 'Copy')}
                </button>
            </div>
            <pre className="px-6 md:px-7 py-6 whitespace-pre-wrap break-words font-sans text-[15px] leading-relaxed text-foreground/75">
                {block.text}
            </pre>
        </div>
    );
}

export function ResourceBlock({ block, language }) {
    switch (block.type) {
        case 'heading':
            return block.level === 3 ? (
                <h3 className="text-xl md:text-2xl font-medium tracking-tight text-foreground mt-10 mb-4">
                    <Inline text={block.text} />
                </h3>
            ) : (
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground mt-14 mb-6 first:mt-0">
                    <Inline text={block.text} />
                </h2>
            );

        case 'paragraph':
            return (
                <p className="text-foreground/70 text-lg leading-relaxed mb-6">
                    <Inline text={block.text} />
                </p>
            );

        case 'list': {
            const Tag = block.ordered ? 'ol' : 'ul';
            return (
                <Tag className="space-y-3 mb-6">
                    {block.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-4 text-foreground/70 text-lg leading-relaxed">
                            {block.ordered ? (
                                <span className="shrink-0 text-sm text-accent tabular-nums mt-1.5 w-6">{i + 1}.</span>
                            ) : (
                                <span aria-hidden="true" className="mt-[0.85em] w-3 h-px bg-accent shrink-0" />
                            )}
                            <span><Inline text={item} /></span>
                        </li>
                    ))}
                </Tag>
            );
        }

        case 'callout':
            return (
                <div className="my-10 p-7 md:p-8 rounded-3xl bg-[#fafafa] border border-foreground/[0.07]">
                    <p className="text-sm text-accent mb-2">Tip</p>
                    <p className="text-foreground/70 text-lg leading-relaxed"><Inline text={block.text} /></p>
                </div>
            );

        case 'quote':
            return (
                <blockquote className="my-14">
                    <span aria-hidden="true" className="block font-serif italic text-accent text-6xl leading-none h-8 select-none">&ldquo;</span>
                    <p className="font-serif text-2xl md:text-3xl leading-snug text-foreground"><Inline text={block.text} /></p>
                </blockquote>
            );

        case 'prompt':
            return <PromptBlock block={block} language={language} />;

        case 'image':
            return (
                <figure className="my-12">
                    <img
                        src={block.src}
                        alt={block.alt || ''}
                        loading="lazy"
                        className="w-full h-auto rounded-3xl border border-foreground/[0.07]"
                    />
                    {block.caption && (
                        <figcaption className="mt-3 text-sm text-foreground/50">{block.caption}</figcaption>
                    )}
                </figure>
            );

        case 'table':
            return (
                <div className="my-10">
                    {/* Gsm: per rij een lichte kaart */}
                    <div className="sm:hidden space-y-3">
                        {block.rows.map((row, ri) => (
                            <div key={ri} className="rounded-3xl bg-[#fafafa] border border-foreground/[0.07] p-5">
                                {row[0] && <p className="text-base font-medium text-foreground"><Inline text={row[0]} /></p>}
                                <div className="mt-3 space-y-3">
                                    {row.slice(1).map((cell, ci) => (
                                        <div key={ci}>
                                            {block.head[ci + 1] && <span className="block text-sm text-foreground/50">{block.head[ci + 1]}</span>}
                                            <span className="block mt-0.5 text-foreground/70 leading-relaxed"><Inline text={cell} /></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="hidden sm:table w-full text-left border-collapse">
                        <thead>
                            <tr>
                                {block.head.map((h, i) => (
                                    <th key={i} className="pb-3 pr-6 text-sm font-normal text-foreground/50 border-b border-foreground/15">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map((row, ri) => (
                                <tr key={ri} className="border-b border-foreground/10">
                                    {row.map((cell, ci) => (
                                        <td key={ci} className={`py-4 pr-6 align-top leading-relaxed ${ci === 0 ? 'font-medium text-foreground' : 'text-foreground/70'}`}>
                                            <Inline text={cell} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );

        case 'divider':
            return <div className="my-14 h-px w-full bg-foreground/15" />;

        default:
            return null;
    }
}
