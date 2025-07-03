import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: '#0f172a', // deep navy
					light: '#1e293b', // slate
					accent: '#2563eb', // vibrant blue
				},
			},
			textColor: {
				brand: '#0f172a',
				'brand-accent': '#2563eb',
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui'],
				mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular'],
			},
			borderRadius: {
				xl: '1rem',
				'2xl': '1.5rem',
			},
			boxShadow: {
				soft: '0 4px 20px rgba(0,0,0,0.05)',
			},
		},
	},
	plugins: [],
};
export default config;
