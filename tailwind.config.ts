import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00D4FF',
        accent: '#00D4FF',
        'accent-alt': '#FF006E',
        danger: '#FF4444',
        success: '#00D966',
        'bg-main': '#0A0E27',
        'bg-section': '#111B3A',
        'bg-card': '#1A2847',
        card: '#1A2847',
        'text-main': '#FFFFFF',
        'text-muted': '#A0AEC0',
        border: '#2D3B5C',
        'glow-primary': '#00D4FF40',
        'glow-danger': '#FF444440',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)'],
        inter: ['var(--font-inter)'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
        'glow-danger': '0 0 20px rgba(255, 68, 68, 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
        'gradient-danger': 'linear-gradient(135deg, #FF4444 0%, #CC0000 100%)',
        'gradient-success': 'linear-gradient(135deg, #00D966 0%, #00AA44 100%)',
      },
    },
  },
  plugins: [],
}

export default config
