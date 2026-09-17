/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Strict 60-25-10-5 Claymorphism Palette
                sand: {
                    DEFAULT: '#F3EBDD', // 60% Canvas / Main backgrounds
                    50: '#FCF9F4',
                    100: '#F8F4EC',
                    200: '#F3EBDD',
                    300: '#EADDC7',
                    400: '#DFCDAE',
                },
                warmBeige: {
                    DEFAULT: '#E2D0B5', // 25% Clay surfaces / containers / inputs
                    50: '#F5EFE6',
                    100: '#EFE6D7',
                    200: '#E2D0B5',
                    300: '#D2BC98',
                    400: '#C2A87B',
                },
                forest: {
                    DEFAULT: '#355C45', // 10% Primary actions / Typography / Contrast
                    50: '#EBF1ED',
                    100: '#C7D8CD',
                    200: '#94B49F',
                    300: '#629072',
                    400: '#467558',
                    500: '#355C45',
                    600: '#2A4937',
                    700: '#20372A',
                    800: '#15251C',
                },
                burntOrange: {
                    DEFAULT: '#C9784B', // 5% Accent highlights / Badges / Status
                    50: '#FAF1EB',
                    100: '#F3D9C9',
                    200: '#E9B393',
                    300: '#DF8D5D',
                    400: '#C9784B',
                    500: '#B56437',
                    600: '#93512C',
                    700: '#713E22',
                    hover: '#B86B3E',
                },
            },
            fontFamily: {
                georama: ['Georama', 'sans-serif'],
                bitcount: ['"Bitcount Prop Single"', '"VT323"', 'monospace'],
            },
            boxShadow: {
                // Clay Level 1 - Subtle / Recessed wells
                'clay-subtle': '4px 4px 10px rgba(53, 92, 69, 0.08), -4px -4px 10px rgba(255, 255, 255, 0.8)',
                'clay-inset': 'inset 3px 3px 6px rgba(53, 92, 69, 0.12), inset -3px -3px 6px rgba(255, 255, 255, 0.85)',
                'clay-inset-focus': 'inset 3px 3px 6px rgba(53, 92, 69, 0.16), inset -3px -3px 6px rgba(255, 255, 255, 0.9), 0 0 0 3px rgba(53, 92, 69, 0.15)',
                // Clay Level 2 - Standard Card Surface
                'clay-card': '10px 10px 22px rgba(53, 92, 69, 0.10), -10px -10px 22px rgba(255, 255, 255, 0.8), inset 1px 1px 2px rgba(255, 255, 255, 0.6)',
                'clay-card-hover': '14px 14px 28px rgba(53, 92, 69, 0.13), -12px -12px 26px rgba(255, 255, 255, 0.9), inset 1px 1px 2px rgba(255, 255, 255, 0.7)',
                // Clay Level 3 - Elevated / Modal
                'clay-elevated': '16px 16px 36px rgba(53, 92, 69, 0.15), -12px -12px 30px rgba(255, 255, 255, 0.9), inset 1px 1px 3px rgba(255, 255, 255, 0.75)',
                // Buttons
                'clay-btn-forest': '5px 5px 14px rgba(53, 92, 69, 0.28), -4px -4px 10px rgba(255, 255, 255, 0.7)',
                'clay-btn-forest-hover': '7px 7px 18px rgba(53, 92, 69, 0.35), -5px -5px 12px rgba(255, 255, 255, 0.8)',
                'clay-btn-orange': '5px 5px 14px rgba(201, 120, 75, 0.32), -4px -4px 10px rgba(255, 255, 255, 0.7)',
                'clay-btn-orange-hover': '7px 7px 18px rgba(201, 120, 75, 0.40), -5px -5px 12px rgba(255, 255, 255, 0.8)',
                'clay-btn-beige': '4px 4px 10px rgba(53, 92, 69, 0.10), -4px -4px 10px rgba(255, 255, 255, 0.8)',
                'clay-btn-beige-hover': '6px 6px 14px rgba(53, 92, 69, 0.14), -5px -5px 12px rgba(255, 255, 255, 0.9)',
                'clay-btn-pressed': 'inset 2px 2px 5px rgba(0, 0, 0, 0.25), inset -2px -2px 5px rgba(255, 255, 255, 0.3)',
            },
            borderRadius: {
                '2.5xl': '20px',
                '3xl': '28px',
                '4xl': '36px',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.7', transform: 'scale(0.96)' },
                },
            },
            animation: {
                float: 'float 5s ease-in-out infinite',
                pulseSoft: 'pulseSoft 3s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};