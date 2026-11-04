import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import PageHeader from '../components/ui/page-header';
import CornerTrace from '../components/ui/corner-trace';
import { AutoImage } from '../components/ui/auto-image';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

// De teamleden, in dezelfde volgorde als op de homepage
const TEAM = [
    {
        name: 'Lucas Curto',
        image: '/team/lucas',
        role: { nl: 'AI & Strategie', en: 'AI & Strategy' },
        bio: {
            nl: [
                'Lucas staat in voor AI en strategie binnen TriaCore AI. Hij is altijd op zoek naar wat er nieuw is in AI en bekijkt telkens wat daarvan echt nuttig is voor onze klanten.',
                'Wat hij ontdekt, vertaalt hij naar de dagelijkse praktijk van uw bedrijf. Met een sterke focus op duidelijke uitleg maakt hij AI begrijpelijk en haalbaar, ook voor wie er nog niet elke dag mee werkt.'
            ],
            en: [
                'Lucas is responsible for AI and strategy at TriaCore AI. He is always looking for what is new in AI and considers what is genuinely useful for our clients.',
                'What he discovers, he translates into the daily reality of your business. With a strong focus on clear explanation, he makes AI understandable and achievable, even for people who don\'t work with it every day.'
            ]
        },
        email: 'lucas.curto@triacore.be',
        phone: '+32 468 27 50 82',
        tel: '+32468275082',
        linkedin: 'https://www.linkedin.com/in/lucas-curto-67555a377/'
    },
    {
        name: 'Rian Mathijs',
        image: '/team/rian',
        role: { nl: 'Sales & Klantrelaties', en: 'Sales & Client Relations' },
        bio: {
            nl: [
                'Rian is het eerste aanspreekpunt voor onze klanten en bewaakt de volledige samenwerking van begin tot eind. Met een sterke focus op duidelijke communicatie en relaties voor de lange termijn zorgt hij ervoor dat verwachtingen, doelstellingen en uitvoering op elkaar afgestemd blijven.',
                'Hij vertaalt bedrijfsuitdagingen naar concrete trajecten en bewaakt de rode draad tijdens het volledige project. Voor onze klanten is hij het vaste referentiepunt: u kan altijd bij hem terecht.'
            ],
            en: [
                'Rian is the first point of contact for our clients and oversees the entire collaboration from start to finish. With a strong focus on clear communication and long term relationships, he makes sure expectations, goals and execution stay aligned.',
                'He translates business challenges into concrete trajectories and keeps the common thread throughout the project. For our clients, he is the fixed point of reference: you can always turn to him.'
            ]
        },
        email: 'rian.mathijs@triacore.be',
        phone: '+32 499 87 46 62',
        tel: '+32499874662',
        linkedin: 'https://www.linkedin.com/in/rian-mathijs-6a4350356/'
    },
    {
        name: 'Jorn Van Breemaat',
        image: '/team/jorn',
        role: { nl: 'Softwareontwikkeling & ICT-advies', en: 'Software Development & IT Advisory' },
        bio: {
            nl: [
                'Jorn staat in voor de softwareontwikkeling binnen TriaCore AI. Hij ontwerpt de oplossingen die we voor onze klanten bouwen en zorgt ervoor dat ze technisch kloppen, van het eerste idee tot de oplevering.',
                'Binnen ons team is hij de vaste raadgever op technisch en ICT-vlak: wie een vraag heeft, klopt bij hem aan. Die kennis komt elk project ten goede.'
            ],
            en: [
                'Jorn is responsible for software development at TriaCore AI. He designs the solutions we build for our clients and makes sure they are technically sound, from the first idea to delivery.',
                'Within our team, he is the go-to advisor on technical and IT matters: anyone with a question comes to him. That knowledge benefits every project.'
            ]
        },
        email: 'jorn.vanbreemaat@triacore.be',
        phone: '+32 470 24 94 69',
        tel: '+32470249469',
        linkedin: 'https://www.linkedin.com/in/jorn-van-breemaat/'
    }
];

// Team: per persoon een groot portret en de volledige uitleg ernaast, om beurten links en rechts.
// Bij het scrollen onthult de foto zich van onder naar boven, daarna komt de tekst op.
export default function Team() {
    const { language } = useLanguage();
    const nl = language === 'nl';
    const listRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            gsap.utils.toArray('.member').forEach((member) => {
                const tl = gsap.timeline({ scrollTrigger: { trigger: member, start: 'top 80%', once: true } });
                tl.fromTo(member.querySelector('.member-photo'),
                    { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
                    { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.6, ease: 'power4.inOut' })
                    .from(member.querySelector('.member-photo-img'), { scale: 1.2, duration: 2.2, ease: 'expo.out' }, 0)
                    .from(member.querySelectorAll('.member-fade'), { y: 16, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1 }, 0.6);
            });
        }, listRef);
        return () => ctx.revert();
    }, [language]);

    return (
        <div className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo
                title="Team | TriaCore AI"
                description={nl
                    ? 'Maak kennis met het team achter TriaCore AI: Lucas Curto, Rian Mathijs en Jorn Van Breemaat uit Hasselt.'
                    : 'Meet the team behind TriaCore AI: Lucas Curto, Rian Mathijs and Jorn Van Breemaat from Hasselt.'}
            />
            <Navbar />
            <main className="relative flex-grow">
                <PageHeader
                    title={nl ? 'Ons team.' : 'Our team.'}
                    intro={nl ? 'Een complementair team dat structuur brengt in elke implementatie.' : 'A complementary team that brings structure to every implementation.'}
                />

                <section ref={listRef} className="px-6 md:px-16 lg:px-24 pb-16 md:pb-24">
                    <div className="max-w-7xl mx-auto flex flex-col gap-24 md:gap-32">
                        {TEAM.map((m, i) => (
                            <article key={m.name} className="member grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                                <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-2 lg:col-start-8' : ''}`}>
                                    <div className="group relative max-w-md">
                                        <div className="member-photo aspect-[4/5] rounded-3xl overflow-hidden bg-foreground/5">
                                            <div className="member-photo-img w-full h-full">
                                                <AutoImage basePath={m.image} alt={m.name} className="w-full h-full object-cover grayscale transition duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]" />
                                            </div>
                                        </div>
                                        <CornerTrace />
                                    </div>
                                </div>

                                <div className={`lg:col-span-6 ${i % 2 === 1 ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7'}`}>
                                    <h2 className="member-fade text-3xl md:text-4xl font-medium text-foreground leading-tight">{m.name}</h2>
                                    <p className="member-fade mt-2 text-base text-foreground/50">{m.role[language]}</p>
                                    <span aria-hidden="true" className="member-fade block h-px my-8 bg-foreground/15" />
                                    {m.bio[language].map((p, j) => (
                                        <p key={j} className="member-fade mt-4 text-lg text-foreground/70 leading-relaxed max-w-xl">{p}</p>
                                    ))}
                                    {(m.email || m.phone || m.linkedin) && (
                                        <div className="member-fade mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
                                            {m.email && <a href={`mailto:${m.email}`} className="text-foreground/70 hover:text-accent transition-colors">{m.email}</a>}
                                            {m.phone && <a href={`tel:${m.tel}`} className="text-foreground/70 hover:text-accent transition-colors">{m.phone}</a>}
                                            {m.linkedin && (
                                                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="group/li inline-flex items-center gap-1 text-foreground/70 hover:text-accent transition-colors">
                                                    LinkedIn
                                                    <ArrowUpRight size={15} className="transition-transform duration-300 group-hover/li:-translate-y-0.5 group-hover/li:translate-x-0.5" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
