import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    // Oxigen-style editorial system: single accent, wide neutral ramp,
    // mono labels, huge display type. Fonts are wired to next/font CSS vars.
    extend: {
      colors: {
        ink: {
          DEFAULT: '#4f4b63',
          950: '#1c1a26',
          900: '#262334',
          800: '#33304a',
          700: '#3f3b5c',
          600: '#4f4b63',
          500: '#6b6788',
          400: '#8c89a3',
          300: '#b3b1c2',
          200: '#d5d4de',
          100: '#e9e8ef',
          50: '#f4f4f8',
        },
        ember: {
          DEFAULT: '#f04f26',
          600: '#d6431d',
          700: '#b53817',
          100: '#fde8e1',
          50: '#fff4f0',
        },
        paper: '#ffffff',
        mist: '#f2f1f5',
        line: '#d9d8e0',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Newsreader', 'Georgia', 'ui-serif', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        mono: '0.25em',
        monoSm: '0.08em',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
