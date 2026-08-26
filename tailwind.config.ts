import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0D0F12',
        surface: '#15181E',
        'surface-hi': '#1A1E24',
        border: 'rgba(255,255,255,0.08)',
        'border-hi': 'rgba(255,255,255,0.14)',
        cream: '#F4F3EE',
        ink: '#F4F3EE',
        'ink-2': '#9EA4B0',
        'ink-3': '#5C6370',
        'ink-ghost': 'rgba(244,243,238,0.20)',
        signal: '#FF5500',
        'signal-dim': 'rgba(255,85,0,0.15)',
        'solar-core': '#FFE566',
        'solar-blaze': '#FF5500',
        'solar-amber': '#B33600',
        orange: '#FF5500',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        DEFAULT: '0px',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        'slow-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'slow-rotate': 'slow-rotate 60s linear infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'scan-line': 'scan-line 3s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
