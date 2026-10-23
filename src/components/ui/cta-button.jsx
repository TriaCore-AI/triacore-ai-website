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
    size = 'md',
    variant = 'primary'
}) {
    // Rustig en slank: geen schaduw, geen opveren. Bij hover kleurt de knop zacht naar het groen
    // en schuift het pijltje een fractie op
    const baseClasses = "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-500 ease-out disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

    const variantClasses = {
        primary: "bg-foreground text-background hover:bg-accent",
        light: "bg-white text-foreground hover:bg-accent hover:text-white",
        secondary: "bg-transparent border border-foreground/20 text-foreground hover:border-accent hover:text-accent"
    };

    const sizeClasses = {
        sm: "px-5 py-2.5 text-sm",
        md: "px-6 py-3 text-[15px]",
        lg: "px-7 py-3.5 text-base"
    };

    const currentVariant = variantClasses[variant] || variantClasses.primary;
    const currentSize = sizeClasses[size] || sizeClasses.md;

    const content = (
        <span className="relative flex items-center gap-2">
            {children}
            {Icon && <Icon size={size === 'lg' ? 18 : 16} strokeWidth={1.75} className="transition-transform duration-300 group-hover:translate-x-0.5" />}
        </span>
    );

    const combinedClasses = `${baseClasses} ${currentVariant} ${currentSize} ${className}`;

    if (to) {
        return (
            <Link to={to} className={combinedClasses}>
                {content}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={combinedClasses}>
                {content}
            </a>
        );
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={combinedClasses}>
            {content}
        </button>
    );
}
