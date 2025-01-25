import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                border: 'var(--border-primary)',
                input: 'var(--border-primary)',
                ring: 'var(--brand-primary)',
                background: 'var(--background-primary)',
                foreground: 'var(--text-primary)',
                primary: {
                    DEFAULT: 'var(--brand-primary)',
                    foreground: '#FFFFFF',
                },
                secondary: {
                    DEFAULT: 'var(--background-surface)',
                    foreground: 'var(--text-primary)',
                },
                destructive: {
                    DEFAULT: 'var(--status-error)',
                    foreground: '#FFFFFF',
                },
                muted: {
                    DEFAULT: 'var(--background-surface)',
                    foreground: 'var(--text-secondary)',
                },
                accent: {
                    DEFAULT: 'var(--brand-accent)',
                    foreground: '#FFFFFF',
                },
                popover: {
                    DEFAULT: 'var(--background-card)',
                    foreground: 'var(--text-primary)',
                },
                card: {
                    DEFAULT: 'var(--background-card)',
                    foreground: 'var(--text-primary)',
                },
            },
            borderRadius: {
                lg: 'var(--radius-lg)',
                md: 'var(--radius-md)',
                sm: 'var(--radius-sm)',
            },
            boxShadow: {
                sm: 'var(--shadow-sm)',
                DEFAULT: 'var(--shadow-md)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
                xl: 'var(--shadow-xl)',
            },
        },
    },
    plugins: [animate],
} satisfies Config;
