import type { Config } from 'tailwindcss';

// Design tokens (v4 — brand retint): light neutral canvas (`mist`),
// ink = Analytt Digital #4f4b63, accent = #f04f26, white `paper` cards.
// Each family is a full 50–950 tint scale backed by CSS variables in
// `src/styles/globals.css` (`--color-<family>-<step>` as space-separated
// RGB channels so opacity modifiers work, e.g. `text-ink/70`).
const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

function family(name: string) {
  const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
  const entries: Record<string, string> = {};
  for (const step of steps) {
    entries[step] = withAlpha(`--color-${name}-${step}`);
  }
  return entries;
}

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          ...family('ink'),
          DEFAULT: withAlpha('--color-ink-600'),
        },
        primary: {
          ...family('primary'),
          DEFAULT: withAlpha('--color-primary-600'),
        },
        accent: {
          ...family('accent'),
          DEFAULT: withAlpha('--color-accent-500'),
        },
        mist: {
          ...family('mist'),
          DEFAULT: withAlpha('--color-mist-200'),
        },
        paper: {
          ...family('paper'),
          DEFAULT: withAlpha('--color-paper-DEFAULT'),
        },
        // Deprecated orange accent alias — do not use in new work.
        ember: {
          ...family('ember'),
          DEFAULT: withAlpha('--color-ember-500'),
        },
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
      borderRadius: {
        soft: '1rem',
        softer: '1.5rem',
        pill: '9999px',
      },
      boxShadow: {
        float:
          '0 1px 2px rgb(var(--color-ink-950) / 0.05), 0 12px 28px rgb(var(--color-ink-950) / 0.09), 0 32px 64px rgb(var(--color-ink-950) / 0.07)',
        button:
          '0 1px 2px rgb(var(--color-ink-950) / 0.08), 0 8px 20px rgb(var(--color-ink-950) / 0.1)',
        'button-sm':
          '0 1px 2px rgb(var(--color-ink-950) / 0.06), 0 4px 12px rgb(var(--color-ink-950) / 0.07)',
        'button-accent':
          '0 1px 2px rgb(var(--color-accent-700) / 0.3), 0 10px 26px rgb(var(--color-accent-500) / 0.35)',
        soft: '0 1px 2px rgb(var(--color-ink-950) / 0.05), 0 12px 32px rgb(var(--color-ink-950) / 0.07), 0 32px 64px rgb(var(--color-ink-950) / 0.05)',
        lift: '0 2px 4px rgb(var(--color-ink-950) / 0.06), 0 18px 44px rgb(var(--color-ink-950) / 0.1), 0 44px 88px rgb(var(--color-ink-950) / 0.07)',
        glow: '0 0 0 1px rgb(var(--color-accent-500) / 0.35), 0 8px 28px rgb(var(--color-accent-500) / 0.28)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
