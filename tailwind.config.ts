import type { Config } from 'tailwindcss';

/**
 * Design tokens — THE FIXTURE SHEET.
 *
 * One printed chart owns the page. ink/primary are the press ink (#4f4b63
 * family), accent is the single spot colour (ember #f04f26) reserved for
 * live marks, mist is the newsprint stock and paper is the brighter stock
 * used for plates. Each family exposes a full 50–950 tint scale backed by
 * space-separated RGB channels in `globals.css` so Tailwind opacity
 * modifiers keep working (`text-ink/70`).
 *
 * Shape and depth are deliberately not soft: corners are square, structure
 * is drawn with rules rather than borders around boxes, and the only shadow
 * language is a press impression plus the plate lift.
 */
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
          DEFAULT: withAlpha('--color-ink-900'),
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
      },
      fontFamily: {
        // One variable family (Archivo) across its width axis — condensed
        // for table columns, expanded black for mastheads. Faces are wired
        // through CSS variables set in `_app.tsx`; never hard-code them here.
        sans: ['var(--font-sheet)', 'Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-sheet)', 'Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        condensed: ['var(--font-sheet)', 'Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tightish: '-0.028em',
        head: '0.18em',
        label: '0.14em',
      },
      borderRadius: {
        // Printed stock does not have rounded corners; the coupon keeps 2px.
        none: '0',
        soft: '2px',
        pill: '9999px',
      },
      boxShadow: {
        // A plate lifting off the sheet: a real offset with a soft blur.
        plate:
          '0 1px 2px rgb(var(--color-ink-950) / 0.06), 0 12px 28px -18px rgb(var(--color-ink-950) / 0.3)',
        coupon:
          '0 1px 2px rgb(var(--color-ink-950) / 0.06), 0 16px 38px -22px rgb(var(--color-ink-950) / 0.34)',
        spot: '0 10px 24px -14px rgb(var(--color-accent-700) / 0.55)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        press: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
