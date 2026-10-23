import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

// Snelmenu linksonder (alleen op grote schermen). In rust een rijtje korte streepjes, één per sectie;
// het streepje van de sectie waar je bent, is langer en groen. Bij hover schuift het menu open met de
// namen erbij, en bij weggaan klapt het weer dicht. Een klik glijdt rustig naar die sectie.
// onBeforeJump(id) wordt opgeroepen vlak voor het springen, zodat de pagina zich kan voorbereiden
// (bv. een scrollanimatie afronden die anders tussenin zou afspelen).
export default function SectionNav({ items, onBeforeJump }) {
    const [active, setActive] = useState(items[0]?.id);
    const [overFooter, setOverFooter] = useState(false);

    // De actieve sectie: de laatste waarvan de bovenkant boven 40% van het scherm staat.
    // Zodra de donkere overgang naar de footer onderaan het menu bereikt, verdwijnt het menu zacht
    useEffect(() => {
        let raf = 0;
        const check = () => {
            raf = 0;
            const line = window.innerHeight * 0.4;
            let current = items[0]?.id;
            items.forEach(({ id }) => {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= line) current = id;
            });
            setActive(current);
            const fade = document.querySelector('[data-footer-fade]');
            setOverFooter(!!fade && fade.getBoundingClientRect().top < window.innerHeight - 260);
        };
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
        check();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            cancelAnimationFrame(raf);
        };
    }, [items]);

    const jump = (id) => {
        onBeforeJump?.(id);
        // Een frame wachten, zodat de pagina eventuele hoogtewijzigingen verwerkt heeft
        requestAnimationFrame(() => {
            const el = document.getElementById(id);
            if (!el) return;
            gsap.to(window, {
                scrollTo: { y: el, autoKill: true },
                duration: 1.2,
                ease: 'power3.inOut'
            });
        });
    };

    return (
        <nav
            aria-label="Snel naar"
            aria-hidden={overFooter}
            className={`group/nav fixed left-6 bottom-8 z-40 hidden lg:block transition-opacity duration-500 ${overFooter ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <div className="relative px-4 py-3 -mx-4 -my-3">
                {/* Zacht vlak achter het menu, alleen zichtbaar als het openstaat, zodat de namen leesbaar
                    blijven boven de inhoud */}
                <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl bg-paper/85 backdrop-blur-md border border-foreground/[0.06] opacity-0 scale-95 origin-bottom-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/nav:opacity-100 group-hover/nav:scale-100"
                />
                <ul className="relative flex flex-col gap-1">
                    {items.map(({ id, label }, i) => {
                        const on = id === active;
                        return (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => jump(id)}
                                    aria-current={on ? 'true' : undefined}
                                    className="group/item flex h-6 items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`block h-[1.5px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? 'w-6 bg-accent' : 'w-3 bg-foreground/30 group-hover/item:w-5 group-hover/item:bg-foreground/60'}`}
                                    />
                                    <span
                                        className={`whitespace-nowrap text-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 -translate-x-1 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-x-0 group-hover/nav:pointer-events-auto ${on ? 'text-foreground font-medium' : 'text-foreground/60 group-hover/item:text-foreground'}`}
                                        style={{ transitionDelay: `${i * 25}ms` }}
                                    >
                                        {label}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
