import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A3C6E',
        accent: '#2563EB',
        danger: '#EF4444',
        success: '#10B981',
        'bg-main': '#F8FAFF',
        'bg-section': '#EEF2FF',
        card: '#FFFFFF',
        'text-main': '#0F172A',
        'text-muted': '#64748B',
        border: '#E2E8F0',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)'],
        inter: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
}

export default config
