import React, { useState } from 'react';
import CTAButton from './cta-button';
import { useLanguage } from '../../context/LanguageContext';

export default function ContactForm() {
    const { language } = useLanguage();
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        message: ''
    });

    const isFormValid = formData.name && formData.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setStatus('loading');

        try {
            const res = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    "form-name": "contact",
                    ...formData
                }).toString(),
            });

            if (res.ok) {
                setStatus('success');
                setFormData({
                    name: '',
                    company: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    return (
        <section id="contact" className="px-6 md:px-16 bg-transparent relative z-10">
            <div className="max-w-[800px] mx-auto">
                <div className="bg-white/70 backdrop-blur-xl border border-foreground/5 shadow-2xl shadow-foreground/[0.03] rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden">
                    {/* Form-specific overlay */}
                    <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                    {status === 'success' ? (
                        <div className="text-center py-20 relative z-10">
                            <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-8">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-semibold mb-4 text-foreground tracking-tight">{language === 'nl' ? 'Bedankt.' : 'Thank you.'}</h3>
                            <p className="text-foreground/60 text-lg max-w-sm mx-auto">
                                {language === 'nl' ? 'We hebben uw aanvraag goed ontvangen en nemen binnen 24 uur contact met u op.' : 'We have received your request and will contact you within 24 hours.'}
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-10 text-accent hover:text-accent/80 font-medium transition-colors"
                            >
                                {language === 'nl' ? 'Start een nieuw gesprek' : 'Start a new conversation'}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="name" className="text-sm font-semibold text-foreground/80 tracking-tight ml-1">{language === 'nl' ? 'Naam *' : 'Name *'}</label>
                                    <input
                                        required
                                        id="name"
                                        type="text"
                                        autoComplete="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-accent focus:shadow-[0_0_0_1px_rgba(98,143,105,1)] transition-all duration-300 text-foreground"
                                        placeholder={language === 'nl' ? 'Voor- en achternaam' : 'First and last name'}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="email" className="text-sm font-semibold text-foreground/80 tracking-tight ml-1">{language === 'nl' ? 'E-mail *' : 'Email *'}</label>
                                    <input
                                        required
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-accent focus:shadow-[0_0_0_1px_rgba(98,143,105,1)] transition-all duration-300 text-foreground"
                                        placeholder={language === 'nl' ? 'naam@bedrijf.be' : 'name@company.com'}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="company" className="text-sm font-semibold text-foreground/80 tracking-tight ml-1">{language === 'nl' ? 'Bedrijf' : 'Company'}</label>
                                    <input
                                        id="company"
                                        type="text"
                                        autoComplete="organization"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-accent focus:shadow-[0_0_0_1px_rgba(98,143,105,1)] transition-all duration-300 text-foreground"
                                        placeholder={language === 'nl' ? 'Bedrijfsnaam' : 'Company name'}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="phone" className="text-sm font-semibold text-foreground/80 tracking-tight ml-1">{language === 'nl' ? 'Telefoon' : 'Phone'}</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-accent focus:shadow-[0_0_0_1px_rgba(98,143,105,1)] transition-all duration-300 text-foreground"
                                        placeholder={language === 'nl' ? 'Telefoonnummer' : 'Phone number'}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label htmlFor="message" className="text-sm font-semibold text-foreground/80 tracking-tight ml-1">{language === 'nl' ? 'Toelichting' : 'Additional details'}</label>
                                <textarea
                                    id="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-accent focus:shadow-[0_0_0_1px_rgba(98,143,105,1)] transition-all duration-300 resize-none text-foreground"
                                    placeholder={language === 'nl' ? 'Beschrijf kort uw situatie of wat u wilt bereiken.' : 'Briefly describe your situation or what you want to achieve.'}
                                ></textarea>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-6 mt-4">
                                <CTAButton
                                    type="submit"
                                    disabled={!isFormValid || status === 'loading'}
                                    className="w-full md:w-auto"
                                >
                                    {status === 'loading' ? (language === 'nl' ? 'Moment geduld...' : 'Just a moment...') : (language === 'nl' ? 'Plan mijn gesprek' : 'Book a call')}
                                </CTAButton>

                                {status === 'error' && (
                                    <p className="text-sm font-medium text-red-500 animate-in fade-in slide-in-from-left-2">
                                        {language === 'nl' ? 'Er ging iets mis. Probeer opnieuw of mail naar' : 'Something went wrong. Try again or email'} <a href="mailto:info@triacore.be" className="underline">info@triacore.be</a>.
                                    </p>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
