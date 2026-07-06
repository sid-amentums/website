import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        w: '#ffffff',
        off: '#f5f4f1',
        off2: '#ece9e3',
        off3: '#e0ddd6',
        ink: '#0a0a0a',
        mid: '#6b6b6b',
        dim: '#a0a0a0',
        pale: '#d0ccc4',
        red: {
          DEFAULT: '#c8171a',
          bg: 'rgba(200,23,26,0.07)',
          bdr: 'rgba(200,23,26,0.18)',
        },
        border: {
          DEFAULT: 'rgba(0,0,0,0.07)',
          2: 'rgba(0,0,0,0.13)',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        serif: ['var(--font-dm-serif)', 'serif'],
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      spacing: {
        nav: '58px',
      },
      borderRadius: {
        pill: '26px',
      },
      keyframes: {
        fall: {
          '0%': { top: '-100%' },
          '100%': { top: '200%' },
        },
        roll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        fall: 'fall 2s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        roll: 'roll 30s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
