import React, { useState } from 'react';
import { AutoImage } from '../ui/auto-image';
import { useLanguage } from '../../context/LanguageContext';
import WorkshopFormulier, { LEEG_WORKSHOP } from './workshop-formulier';
import SuccesMelding from '../ui/succes-melding';

// De afsluiter van de workshoppagina: links de oproep en Rian als aanspreekpunt, rechts meteen een kort
// formulier om een offerte aan te vragen (workshop-formulier.jsx, ook gebruikt op de contactpagina).
export default function WorkshopsOfferte() {
    const { language } = useLanguage();
    const nl = language === 'nl';
    // Na het versturen een klein bevestigingsvenster; het formulier is dan weer leeg
    const [melding, setMelding] = useState(false);
    const [data, setData] = useState(LEEG_WORKSHOP);

    // Op kleine laptops (1024 tot 1279) een smallere tussenruimte in het raster van twaalf kolommen: anders
    // wordt de linkerkolom te smal voor de titel en breekt die op drie regels
    return (
        <section id="offerte" className="px-6 md:px-16 lg:px-24 pt-16 md:pt-24 pb-24 md:pb-32">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 xl:gap-16 items-start">
                <div data-reveal className="lg:col-span-5">
                    <div className="overflow-hidden pb-3 mb-3">
                        <h2 className="rv-mask-inner hero-title text-foreground text-4xl md:text-5xl lg:text-6xl">
                            {nl ? 'Een workshop voor je team?' : 'A workshop for your team?'}
                        </h2>
                    </div>
                    <p className="rv-fade text-foreground/60 text-lg md:text-xl leading-relaxed max-w-md">
                        {nl
                            ? 'Laat je gegevens achter en we bezorgen je een offerte op maat. We nemen binnen 24 uur contact met je op.'
                            : 'Leave your details and we will send you a tailored quote. We will get back to you within 24 hours.'}
                    </p>
                    <div className="rv-fade mt-12 inline-flex items-center gap-4">
                        <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden bg-foreground/5">
                            <AutoImage basePath="/team/rian" alt="Rian Mathijs" className="w-full h-full object-cover grayscale" />
                        </div>
                        <div>
                            <p className="text-base font-medium text-foreground leading-tight">
                                Rian Mathijs <span className="font-normal text-foreground/50">· {nl ? 'je eerste aanspreekpunt' : 'your first point of contact'}</span>
                            </p>
                            <p className="mt-1 text-sm text-foreground/60">
                                <a href="mailto:rian.mathijs@triacore.be" className="hover:text-accent transition-colors">rian.mathijs@triacore.be</a>
                                <span className="mx-2 text-foreground/30">·</span>
                                <a href="tel:+32499874662" className="hover:text-accent transition-colors">+32 499 87 46 62</a>
                            </p>
                        </div>
                    </div>
                </div>

                <div data-reveal className="lg:col-span-7">
                    <div className="rv-fade">
                        <WorkshopFormulier
                            data={data}
                            setData={setData}
                            onSucces={() => { setData(LEEG_WORKSHOP); setMelding(true); }}
                        />
                        <SuccesMelding open={melding} onClose={() => setMelding(false)} />
                    </div>
                </div>
            </div>
        </section>
    );
}
