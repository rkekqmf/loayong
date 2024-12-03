import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				app: {
					nav: '#1e3b28',
					'nav-border': '#b1e0b8',
					box: '#1b3925',
					'box-border': '#589967',
					input: {
						DEFAULT: '#3a6346',
						hover: '#4b805b',
						border: '#5ca470'
					},
					text: {
						DEFAULT: '#ccc',
						muted: '#707a89'
					},
					gradient: {
						start: '#69bb67',
						middle: '#2a5430',
						end: '#1b3925'
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

	plugins: []
} satisfies Config;
