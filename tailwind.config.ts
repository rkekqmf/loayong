import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				// PANTONE 테마 색상
				primary: {
					50: '#E8E3D9',   // Cannoli Cream
					100: '#E5C1A1',  // Cream Tan
					200: '#CBB994',  // Safari
					300: '#C0A693',  // Sirocco
					400: '#B28C7C',  // Chanterelle
					500: '#A67C6D',  // Mocha Mousse (메인)
					600: '#905E50',  // Baltic Amber
					700: '#5D4A46',  // Chocolate Martini
					800: '#4A3A36',
					900: '#3A2D2A',
				},
				// 기존 색상 유지
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
				primary: `8px 8px 30px -5px rgba(166, 124, 109, 0.3),
                   -8px 8px 30px -5px rgba(166, 124, 109, 0.3)`
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
