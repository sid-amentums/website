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
        // Loading animation: a pictogram athlete mid javelin-throw. Each limb
        // is its own SVG <g> rotating around a shoulder/hip transform-origin
        // (see components/ui/JavelinLoader.tsx) — all seven keyframes below
        // share one 0-100% timeline (wind-up → plant → release → follow-
        // through → reset) so they stay in sync despite animating separately.
        athleteTorso: {
          '0%': { transform: 'rotate(-6deg) translateY(2px)' },
          '35%': { transform: 'rotate(2deg) translateY(0px)' },
          '55%': { transform: 'rotate(10deg) translateY(-2px)' },
          '75%': { transform: 'rotate(6deg) translateY(-1px)' },
          '100%': { transform: 'rotate(-6deg) translateY(2px)' },
        },
        athleteThrowArm: {
          '0%': { transform: 'rotate(-70deg)' },
          '35%': { transform: 'rotate(-55deg)' },
          '55%': { transform: 'rotate(70deg)' },
          '75%': { transform: 'rotate(95deg)' },
          '100%': { transform: 'rotate(-70deg)' },
        },
        athleteLeadArm: {
          '0%': { transform: 'rotate(20deg)' },
          '35%': { transform: 'rotate(0deg)' },
          '55%': { transform: 'rotate(-30deg)' },
          '75%': { transform: 'rotate(-10deg)' },
          '100%': { transform: 'rotate(20deg)' },
        },
        athleteFrontLeg: {
          '0%': { transform: 'rotate(-30deg)' },
          '35%': { transform: 'rotate(0deg)' },
          '55%': { transform: 'rotate(10deg)' },
          '75%': { transform: 'rotate(20deg)' },
          '100%': { transform: 'rotate(-30deg)' },
        },
        athleteBackLeg: {
          '0%': { transform: 'rotate(15deg)' },
          '35%': { transform: 'rotate(-10deg)' },
          '55%': { transform: 'rotate(-35deg)' },
          '75%': { transform: 'rotate(-20deg)' },
          '100%': { transform: 'rotate(15deg)' },
        },
        athleteJavelin: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '0' },
          '55%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '1' },
          '70%': { transform: 'translate(38px, -16px) rotate(8deg)', opacity: '1' },
          '90%': { transform: 'translate(92px, -46px) rotate(18deg)', opacity: '0.35' },
          '100%': { transform: 'translate(126px, -64px) rotate(24deg)', opacity: '0' },
        },
      },
      animation: {
        fall: 'fall 2s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        roll: 'roll 30s linear infinite',
        'athlete-torso': 'athleteTorso 2.4s ease-in-out infinite',
        'athlete-throw-arm': 'athleteThrowArm 2.4s ease-in-out infinite',
        'athlete-lead-arm': 'athleteLeadArm 2.4s ease-in-out infinite',
        'athlete-front-leg': 'athleteFrontLeg 2.4s ease-in-out infinite',
        'athlete-back-leg': 'athleteBackLeg 2.4s ease-in-out infinite',
        'athlete-javelin': 'athleteJavelin 2.4s cubic-bezier(0.3, 0, 0.7, 1) infinite',
      },
    },
  },
  plugins: [],
}
export default config
