import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://triacore.be';
const SITE_NAME = 'TriaCore AI';
const DEFAULT_IMAGE = `${SITE_URL}/logo/triacore-mark.png`;

function setMetaTag(attr, key, content) {
    if (!content) return;
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function setCanonical(href) {
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

function setRobots(noindex) {
    let el = document.head.querySelector('meta[name="robots"]');
    if (noindex) {
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute('name', 'robots');
            document.head.appendChild(el);
        }
        el.setAttribute('content', 'noindex, nofollow');
    } else if (el) {
        el.remove();
    }
}

// Zet title/description/canonical/OG-tags voor de huidige pagina. Render als
// eerste element in elke pagina zodat elke route zijn eigen Google-resultaat krijgt.
export default function Seo({ title, description, image, noindex = false }) {
    const location = useLocation();

    useEffect(() => {
        if (title) document.title = title;

        setMetaTag('name', 'description', description);
        setMetaTag('property', 'og:title', title);
        setMetaTag('property', 'og:description', description);
        setMetaTag('property', 'og:image', image || DEFAULT_IMAGE);
        setMetaTag('property', 'og:type', 'website');
        setMetaTag('property', 'og:site_name', SITE_NAME);
        setMetaTag('name', 'twitter:card', 'summary_large_image');
        setMetaTag('name', 'twitter:title', title);
        setMetaTag('name', 'twitter:description', description);

        const canonicalUrl = `${SITE_URL}${location.pathname}`;
        setCanonical(canonicalUrl);
        setMetaTag('property', 'og:url', canonicalUrl);

        setRobots(noindex);
    }, [title, description, image, noindex, location.pathname]);

    return null;
}
