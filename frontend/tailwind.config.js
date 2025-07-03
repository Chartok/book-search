/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				gray: {
					100: '#f3f4f6',
					200: '#e5e7eb',
					300: '#d1d5db',
					400: '#9ca3af',
					500: '#6b7280',
					600: '#4b5563',
					700: '#374151',
					800: '#1f2937',
					900: '#111827',
				},
				blue: {
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
				},
				green: {
					100: '#d1fae5',
					200: '#a7f3d0',
					800: '#065f46',
					900: '#064e3b',
				},
				red: {
					500: '#ef4444',
				},
			},
		},
	},
	plugins: [],
	darkMode: 'media',
};
