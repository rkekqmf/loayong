import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: {
					100: 'var(--primary-100)',
					200: 'var(--primary-200)',
					300: 'var(--primary-300)'
				},
				accent: {
					100: 'var(--accent-100)',
					200: 'var(--accent-200)'
				},
				text: {
					100: 'var(--text-100)',
					200: 'var(--text-200)'
				},
				bg: {
					100: 'var(--bg-100)',
					200: 'var(--bg-200)',
					300: 'var(--bg-300)'
				}
			},
			boxShadow: {
				primary: `8px 8px 30px -5px rgba(255, 255, 255, 0.2),
                   -8px 8px 30px -5px rgba(255, 255, 255, 0.2)`
			},
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1536px'
			}
		}
	},

	plugins: []
} satisfies Config;
