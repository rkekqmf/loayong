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
				nav: '0 12px 8px rgba(63,127,77,0.3)',
				footer: '0 -4px 4px rgba(63,127,77,0.3)',
				box: '0 0 16px 0 rgba(210, 253, 235, 0.5)'
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
