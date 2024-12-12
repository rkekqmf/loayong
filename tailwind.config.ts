import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				app: {
					nav: 'var(--color-nav)',
					'nav-border': 'var(--color-nav-border)',
					box: 'var(--color-box)',
					'box-border': 'var(--color-box-border)',
					input: {
						DEFAULT: 'var(--color-input)',
						hover: 'var(--color-input-hover)',
						border: 'var(--color-input-border)'
					},
					text: {
						DEFAULT: 'var(--color-text)',
						muted: 'var(--color-text-muted)'
					},
					gradient: {
						start: 'var(--color-gradient-start)',
						middle: 'var(--color-gradient-middle)',
						end: 'var(--color-gradient-end)'
					}
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

	plugins: [
		function ({ addUtilities }) {
			addUtilities({
				'.text-sm-responsive': {
					'@media (max-width: 640px)': {
						fontSize: '0.875rem'
					}
				}
			});
		}
	]
} satisfies Config;
