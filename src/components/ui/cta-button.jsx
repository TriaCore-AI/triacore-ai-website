import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTAButton({
    to,
    href,
    onClick,
    children,
    className = '',
    type = 'button',
    disabled = false,
    icon: Icon = ArrowRight,
    size = 'md'
}) {
    // baseClasses based on the reference: "Ontmoet het volledige team"
    // bg-foreground (dark blue), text-background (white), rounded-full, pill shape, shadow-xl
    const baseClasses = "group relative overflow-hidden rounded-full bg-foreground text-background transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] custom-bezier flex items-center justify-center gap-3 shadow-xl shadow-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed";

    const sizeClasses = {
        sm: "px-6 py-2.5 text-sm font-medium",
        md: "px-8 py-4 text-lg font-medium",
        lg: "px-10 py-5 text-lg font-semibold"
    };

    const currentSize = sizeClasses[size] || sizeClasses.md;

    // The animated background div (slides up to show the accent green color)
    const backgroundOverlay = (
        <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
    );

    const content = (
        <span className="relative z-10 flex items-center gap-2">
            {children}
            {Icon && <Icon size={size === 'sm' ? 16 : 20} className="group-hover:translate-x-1 transition-transform" />}
        </span>
    );

    const combinedClasses = `${baseClasses} ${currentSize} ${className}`;

    if (to) {
        return (
            <Link to={to} className={combinedClasses}>
                {content}
                {backgroundOverlay}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={combinedClasses}>
                {content}
                {backgroundOverlay}
            </a>
        );
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={combinedClasses}>
            {content}
            {backgroundOverlay}
        </button>
    );
}
