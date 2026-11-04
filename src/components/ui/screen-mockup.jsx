import React from 'react';

// Een scherm als een kader van glas, in de geest van Apple's liquid glass: geen zwarte rand, maar een
// lichte, doorschijnende omlijsting met grote, zachte afrondingen, een witte rand die het licht vangt
// en een glans die naar de hoeken toe verloopt. Alle maten staan in cqw (procent van de breedte), zodat
// het kader op elk formaat dezelfde verhoudingen houdt, zoals een foto die kleiner wordt.
// Over het glas kan een lichtstreep glijden: animeer `left` van .sm-sheen-band (van -50% naar 120%).
// Bewust zonder backdrop-blur: die vervaagt de korrel van het papier in een vlak dat los van een masker
// getekend wordt, waardoor de rechthoek van het kader zichtbaar blijft, ook waar het weggewolkt is.
// Wat op het scherm staat, geef je mee als kinderen (bv. een BrowserWindow); die vullen het scherm.
// Ook de kinderen kunnen cqw gebruiken: ze rekenen dan met de breedte van het hele kader.
export default function ScreenMockup({ children, className = '' }) {
    return (
        <div className={`@container w-full ${className}`}>
            <div className="relative rounded-[2.6cqw] p-[1cqw] bg-white/45 border border-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(15,23,42,0.05),0_0_0_1px_rgba(15,23,42,0.06),0_3cqw_7cqw_-3.5cqw_rgba(15,23,42,0.22)]">
                {/* Glans op het glas: helder in de hoek linksboven en zacht rechtsonder.
                    Het scherm ligt erboven, dus de glans is enkel in de omlijsting te zien */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(150deg,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_32%,rgba(255,255,255,0)_68%,rgba(255,255,255,0.5)_100%)]"
                />
                {/* Lichtstreep die over het glas kan glijden; staat standaard buiten beeld */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden">
                    <span
                        className="sm-sheen-band absolute inset-y-0 w-[30%] -skew-x-12 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.9)_50%,rgba(255,255,255,0)_100%)]"
                        style={{ left: '-50%' }}
                    />
                </span>
                <div className="relative aspect-[16/9] overflow-hidden rounded-[1.6cqw] bg-white ring-1 ring-foreground/[0.07]">
                    {children}
                </div>
            </div>
        </div>
    );
}
