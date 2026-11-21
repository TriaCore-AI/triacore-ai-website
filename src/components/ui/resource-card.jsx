import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CornerTrace from './corner-trace';
import { categoryLabel, formatDate, inTaal } from '../../data/resources';

// Een resourcekaart: thumbnail, categorie, datum en leestijd, titel, korte omschrijving en een link.
// Zelfde rustige kaart als de klantkaarten (licht, zonder schaduw, de L-lijn bij hover).
// Zonder thumbnail toont de kaart een lichte tegel met de categorie, zodat alle kaarten even hoog blijven.
// `to` mag leeg zijn (voorbeeld in de ERP): dan is de kaart geen link.
export default function ResourceCard({ resource, language, to }) {
    const nl = language === 'nl';
    const tekst = inTaal(resource, language);
    const Wrapper = to ? Link : 'div';
    return (
        <Wrapper
            {...(to ? { to } : {})}
            className="resource-card group relative flex flex-col rounded-3xl bg-[#fafafa] border border-foreground/[0.07] p-4 md:p-5 transition-colors duration-500 hover:bg-white hover:border-foreground/15"
        >
            <CornerTrace />
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-[#e2eae3]">
                {resource.thumbnail ? (
                    <img
                        src={resource.thumbnail}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="hero-title text-3xl text-foreground/60">{categoryLabel(resource.category, language)}.</span>
                    </div>
                )}
            </div>
            <div className="flex flex-col flex-grow px-2 md:px-3 pt-6 pb-3">
                <span className="text-sm text-foreground/50">
                    {categoryLabel(resource.category, language)} · {formatDate(resource.date, language)} · {resource.readingMinutes} min
                </span>
                <h3 className="mt-3 text-2xl font-medium text-foreground leading-tight">{tekst.title}</h3>
                <p className="mt-4 text-foreground/60 text-[15px] leading-relaxed">{tekst.description}</p>
                <div className="mt-auto pt-8 flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors duration-300 group-hover:text-accent">
                    {nl ? 'Lees meer' : 'Read more'}
                    <ArrowRight size={16} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Wrapper>
    );
}
