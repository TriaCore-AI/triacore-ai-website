/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#f8fafc',
                foreground: '#0f172a',
                accent: '#3b82f6',
                darkSection: '#020617',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
                mono: ['"Fira Code"', 'monospace'],
            },
        },
    },
    plugins: [],
}
