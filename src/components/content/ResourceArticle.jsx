import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CTAButton from '../ui/cta-button';
import { ResourceBlock } from './ResourceBlocks';
import { categoryLabel, formatDate, inTaal } from '../../data/resources';

// Het artikel zelf, zoals op /kennisbank/<slug>. Gedeeld met het voorbeeld voor de ERP
// (ResourcePreview.jsx), zodat dat voorbeeld exact de echte pagina is. Eén leeskolom zoals de
// casepagina's: terug-link, categorie · datum · leestijd, titel, korte intro, thumbnail en de blokken.
export default function ResourceArticle({ resource, language, preview = false }) {
    const nl = language === 'nl';
    const tekst = inTaal(resource, language);
    return (
        <div className="max-w-3xl mx-auto">
            <Link
                to="/kennisbank"
                onClick={preview ? (e) => e.preventDefault() : undefined}
                className="detail-fade-top group inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-accent transition-colors duration-300 max-lg:py-3 max-lg:-my-3"
            >
                <ArrowLeft size={16} strokeWidth={1.75} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                {nl ? 'Terug naar de kennisbank' : 'Back to resources'}
            </Link>

            <p className="detail-fade-top mt-12 text-sm text-foreground/50">
                {categoryLabel(resource.category, language)} · {formatDate(resource.date, language)} · {resource.readingMinutes}{' '}
                {nl ? 'min lezen' : 'min read'}
            </p>

            <article>
                <h1 className="detail-title mt-6 hero-title text-foreground text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                    {tekst.title}
                </h1>
                <p className="detail-fade mt-8 text-xl md:text-2xl text-foreground/70 leading-relaxed">{tekst.description}</p>

                {resource.thumbnail && (
                    <img
                        src={resource.thumbnail}
                        alt=""
                        className="detail-fade mt-12 w-full aspect-[4/3] object-cover rounded-3xl border border-foreground/[0.07]"
                    />
                )}

                <div className="detail-fade mt-14 pt-14 border-t border-foreground/15">
                    {(tekst.blocks || []).map((block, i) => (
                        <ResourceBlock key={i} block={block} language={language} />
                    ))}
                </div>

                {/* Rustige oproep onderaan, zoals op de casepagina's */}
                <div className="mt-20 pt-14 border-t border-foreground/15">
                    <p className="hero-title text-foreground text-3xl md:text-4xl">
                        {nl ? 'Hier zelf mee aan de slag?' : 'Want to put this to work?'}
                    </p>
                    <p className="mt-4 text-lg text-foreground/60 leading-relaxed max-w-lg">
                        {nl ? 'Plan een gesprek en we denken vrijblijvend met je mee.' : 'Book a call and we will think it through with you, with no obligation.'}
                    </p>
                    <div className="mt-8">
                        <CTAButton to={preview ? undefined : '/contact'}>{nl ? 'Plan een gesprek' : 'Book a call'}</CTAButton>
                    </div>
                </div>
            </article>
        </div>
    );
}
