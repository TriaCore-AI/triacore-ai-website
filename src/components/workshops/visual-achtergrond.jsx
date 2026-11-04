import React from 'react';

// De achtergrond van de visuals in de probleemkaarten: een zacht groen verloop in de tinten van de pagina,
// met onderaan een fijn raster dat plat naar achteren kantelt en naar boven toe vervaagt. Geeft diepte
// zonder bollen of gloed. Vult het vak (de ouder moet relative zijn).
const raster = 'linear-gradient(to right, rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.08) 1px, transparent 1px)';
const vervaag = 'linear-gradient(to top, #000 15%, transparent 90%)';

export default function VisualAchtergrond() {
    return (
        <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(165deg, #f6f8f7 0%, #e7eee9 55%, #dbe5dd 100%)' }}>
            <div className="absolute inset-0 overflow-hidden" style={{ perspective: '420px', perspectiveOrigin: '50% 20%' }}>
                <div
                    className="absolute -left-[40%] -right-[40%] -bottom-[10%] h-[80%]"
                    style={{
                        transform: 'rotateX(68deg)',
                        transformOrigin: '50% 100%',
                        backgroundImage: raster,
                        backgroundSize: '28px 28px',
                        WebkitMaskImage: vervaag,
                        maskImage: vervaag
                    }}
                />
            </div>
        </div>
    );
}
