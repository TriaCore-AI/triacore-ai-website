import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CornerTrace from './corner-trace';

// Een klantkaart (homepage en projectenpagina): logo, naam, sector, een dunne lijn, korte uitleg en
// een link onderaan. Licht, zonder schaduw; bij hover wordt de kaart wit en tekent de L lijn zich.
// De lijn heeft de klasse rv-line, zodat een scrollanimatie ze kan laten tekenen.
// Geef via className de breedte mee die de plek nodig heeft.
export default function ClientCard({ card, className = '' }) {
    return (
        <Link
            to={card.to}
            className={`klantcases-card group relative flex flex-col min-h-[360px] rounded-3xl bg-[#fafafa] border border-foreground/[0.07] p-8 md:p-10 transition-colors duration-500 hover:bg-white hover:border-foreground/15 ${className}`}
        >
            <CornerTrace />
            {/* Vaste hoogte, zodat logo's en namen over de kaarten op één lijn staan.
                Multiply laat een witte logoachtergrond wegvallen tegen de kaart */}
            <div className="h-16 flex items-center mb-8">
                <img src={card.logo} alt={card.client} className="max-h-12 max-w-[140px] w-auto object-contain mix-blend-multiply" />
            </div>
            <h3 className="text-2xl font-medium text-foreground leading-tight">{card.client}</h3>
            <span className="mt-1 text-sm text-foreground/50">{card.sector}</span>
            <span className="rv-line block h-px mt-8 bg-foreground/10 origin-left" />
            <p className="mt-8 text-foreground/60 text-[15px] leading-relaxed">{card.description}</p>
            <div className="mt-auto pt-10 flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors duration-300 group-hover:text-accent">
                {card.cta}
                <ArrowRight size={16} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
        </Link>
    );
}
