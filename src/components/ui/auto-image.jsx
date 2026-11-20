import { useState, useEffect } from 'react';

/**
 * Custom hook to find an existing image file among multiple extensions.
 * Useful when the user might change a .png to .webp or .jpg without updating the code.
 * 
 * @param {string} basePath - The base path and filename without extension (e.g., '/media/hero')
 * @param {string[]} extensions - Array of extensions to try (default: ['webp', 'png', 'jpg', 'jpeg', 'svg'])
 * @returns {string} - The first existing image path found, or the original basePath with the first extension if none found.
 */
// Beelden waarvan we het bestand kennen: die tonen we meteen, zonder eerst te zoeken. Zonder deze lijst toonde de
// site eerst /team/lucas.webp (bestaat niet: een gebroken beeld) en deed ze tot drie extra verzoeken per foto.
const BEKEND = {
    '/team/lucas': '/team/lucas.jpg',
    '/team/rian': '/team/rian.jpg',
    '/team/jorn': '/team/jorn.webp',
};

export function useAutoImage(basePath, extensions = ['webp', 'png', 'jpg', 'jpeg', 'svg']) {
    const bekend = BEKEND[basePath];
    const [src, setSrc] = useState(bekend ?? basePath + '.' + extensions[0]);

    useEffect(() => {
        if (bekend) return;
        const checkImages = async () => {
            for (const ext of extensions) {
                const fullPath = `${basePath}.${ext}`;
                try {
                    const response = await fetch(fullPath, { method: 'HEAD' });
                    const contentType = response.headers.get('Content-Type');

                    if (response.ok && contentType && contentType.startsWith('image/')) {
                        setSrc(fullPath);
                        return;
                    }
                } catch (error) {
                    // If fetch fails, move to next extension
                }
            }
        };

        if (basePath) {
            checkImages();
        }
    }, [basePath, bekend, extensions.join(',')]);

    return src;
}

/**
 * Component version of the auto-image logic.
 */
export function AutoImage({ basePath, alt, className, ...props }) {
    const src = useAutoImage(basePath);
    return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" {...props} />;
}
