import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../components/ui/navbar';
import Footer from '../components/ui/footer';
import Seo from '../components/ui/seo';
import PageHeader from '../components/ui/page-header';
import ContactForm from '../components/ui/contact-form';
import { AutoImage } from '../components/ui/auto-image';
import { useLanguage } from '../context/LanguageContext';

const CONTACTS = [
    {
        name: 'Rian Mathijs',
        image: '/team/rian',
        role: { nl: 'Sales & Klantrelaties', en: 'Sales & Client Relations' },
        phone: '+32 499 87 46 62',
        tel: '+32499874662',
        email: 'rian.mathijs@triacore.be',
        linkedin: 'https://www.linkedin.com/in/rian-mathijs-6a4350356/'
    },
    {
        name: 'Lucas Curto',
        image: '/team/lucas',
        role: { nl: 'AI & Strategie', en: 'AI & Strategy' },
        phone: '+32 468 27 50 82',
        tel: '+32468275082',
        email: 'lucas.curto@triacore.be',
        linkedin: 'https://www.linkedin.com/in/lucas-curto-67555a377/'
    }
];

// Onder 1024px een ruimer tikvlak; de negatieve marge houdt de opmaak gelijk
const linkClass = 'text-foreground/70 hover:text-accent transition-colors w-max max-lg:py-1.5 max-lg:-my-1.5';

// Contact, in de nieuwe stijl: eerst het formulier (links, op gsm bovenaan), daarna wie je te woord staat en de
// algemene gegevens (rechts, op gsm eronder).
// Beide kolommen zijn even hoog: de linker verdeelt haar inhoud over de hoogte, het formulier rekt mee.
export default function Contact() {
    const { language } = useLanguage();
    const nl = language === 'nl';

    return (
        <div className="relative min-h-screen bg-grain text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background">
            <Seo
                title="Contact | TriaCore AI"
                description={nl
                    ? 'Plan een vrijblijvend gesprek. Vertel waar je processen vastlopen en we bekijken samen wat software op maat en AI voor jouw bedrijf kunnen betekenen.'
                    : 'Book a no-obligation call. Tell us where your processes get stuck and we will explore together what custom software and AI can do for your business.'}
            />
            <Navbar />
            <main className="relative flex-grow">
                <PageHeader
                    title={nl ? 'Plan een gesprek.' : 'Book a call.'}
                    intro={nl ? 'Vertel ons hoe jouw bedrijf werkt. We luisteren eerst en tonen dan wat mogelijk is.' : 'Tell us how your business works. We listen first, then show you what is possible.'}
                />

                <section className="px-6 md:px-16 lg:px-24 pb-16 md:pb-24">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
                        {/* Wie u te woord staat en de algemene gegevens */}
                        {/* Op een tablet staan Rian en Lucas naast elkaar en de algemene gegevens op één rij,
                            zodat de breedte benut wordt */}
                        <aside className="order-2 lg:col-span-4 flex flex-col justify-between gap-10">
                            <div className="flex flex-col gap-8 sm:max-lg:grid sm:max-lg:grid-cols-2">
                                {CONTACTS.map((c) => (
                                    <div key={c.name} className="flex gap-4">
                                        <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden bg-foreground/5">
                                            <AutoImage basePath={c.image} alt={c.name} className="w-full h-full object-cover grayscale" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-lg font-medium text-foreground leading-tight">{c.name}</p>
                                            <p className="mt-0.5 text-sm text-foreground/50 leading-snug">{c.role[language]}</p>
                                            <div className="mt-3 flex flex-col gap-1 text-sm">
                                                <a href={`tel:${c.tel}`} className={linkClass}>{c.phone}</a>
                                                <a href={`mailto:${c.email}`} className={linkClass}>{c.email}</a>
                                                <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className={`group/li inline-flex items-center gap-1 ${linkClass}`}>
                                                    LinkedIn
                                                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/li:-translate-y-0.5 group-hover/li:translate-x-0.5" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <span aria-hidden="true" className="block h-px mb-8 bg-foreground/15" />
                                <dl className="flex flex-col gap-5 text-sm sm:max-lg:grid sm:max-lg:grid-cols-3 sm:max-lg:gap-8">
                                    <div>
                                        <dt className="text-foreground/50">{nl ? 'Algemeen' : 'General'}</dt>
                                        <dd className="mt-1"><a href="mailto:info@triacore.be" className="text-foreground hover:text-accent transition-colors">info@triacore.be</a></dd>
                                    </div>
                                    <div>
                                        <dt className="text-foreground/50">{nl ? 'Kantoor' : 'Office'}</dt>
                                        <dd className="mt-1 text-foreground leading-relaxed">
                                            Kempische Steenweg 303<br />3500 Hasselt · Corda Incubator
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-foreground/50">{nl ? 'Btw' : 'VAT'}</dt>
                                        <dd className="mt-1 text-foreground">BE 1042.233.821</dd>
                                    </div>
                                </dl>
                            </div>
                        </aside>

                        {/* Het formulier, even hoog als de kolom met de gegevens */}
                        <div className="order-1 lg:col-span-8">
                            <ContactForm />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
