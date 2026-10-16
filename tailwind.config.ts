import type { Config } from 'tailwindcss';

/**
 * Design tokens — THE SIGNAL MESH.
 *
 * The page is a routed signal path on one deep violet-ink ground. Five colour
 * families only, each a full 50–950 tint scale backed by space-separated RGB
 * channels in `globals.css` so Tailwind opacity modifiers keep working
 * (`text-primary-200/70`).
 *
 *  - `primary`  the field. Anchored on the brand hex #4f4b63 at step 600;
 *               chroma rises as the ramp darkens, so the deep steps read as a
 *               violet-ink ground rather than as flat grey.
 *  - `ink`      neutral type ramp, used on the paper plates and bands.
 *  - `surface`  neutral chrome ramp — dividers, scrollbar, disabled states.
 *  - `paper`    warm plate stock: the cards, buttons and light bands.
 *  - `accent`   ember #f04f26, the single saturated colour. It means *live*.
 *
 * Shape and depth are deliberately flat: square corners, no shadows, structure
 * carried by one-step-lighter panels and by the resolve bands between grounds.
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
        primary: {
          ...family('primary'),
          DEFAULT: withAlpha('--color-primary-800'),
        },        accent: {
          ...family('accent'),
          DEFAULT: withAlpha('--color-accent-500'),
        },
        surface: {
          ...family('surface'),
          DEFAULT: withAlpha('--color-surface-900'),
        },
        ink: {
          ...family('ink'),
          DEFAULT: withAlpha('--color-ink-900'),
        },
        paper: {
          ...family('paper'),
          DEFAULT: withAlpha('--color-paper-DEFAULT'),
        },
        // Visual builder tokens (M1). Scoped `--bld-*` variables set by
        // `ThemeProvider`, so `bg-bld-primary` etc. follow the builder theme
        // (light/dark via the wrapper's `.dark` class) without touching the
        // site's own token families above.
        bld: {
          primary: withAlpha('--bld-color-primary'),
          secondary: withAlpha('--bld-color-secondary'),
          accent: withAlpha('--bld-color-accent'),
          background: withAlpha('--bld-color-background'),
          surface: withAlpha('--bld-color-surface'),
          text: withAlpha('--bld-color-text'),
          muted: withAlpha('--bld-color-muted'),
          border: withAlpha('--bld-color-border'),
          success: withAlpha('--bld-color-success'),
          warning: withAlpha('--bld-color-warning'),
          danger: withAlpha('--bld-color-danger'),
        },
      },
      fontFamily: {
        // Faces are wired through CSS variables set in `_app.tsx`; never
        // hard-code a family in JSX.
        display: ['var(--font-display)', 'var(--font-brother)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        // Builder theme faces, resolved from the curated `next/font` list.
        bldHeading: ['var(--bld-font-heading)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        bldBody: ['var(--bld-font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        bldMono: ['var(--bld-font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.035em',
        head: '0.14em',
        wide: '0.22em',
      },
      borderRadius: {
        none: '0',
        soft: '2px',
        chip: '2px',
        pill: '9999px',
        // Builder default radius token.
        bld: 'var(--bld-radius-default)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        signal: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        // A pulse travelling a trace: the dash is short, the gap long, so the
        // bright segment reads as a packet moving along the route.
        pulse: {
          '0%': { strokeDashoffset: '260' },
          '100%': { strokeDashoffset: '0' },
        },
        // A pixel arriving in a resolve band.
        settle: {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        pulse: 'pulse 3.6s linear infinite',
        settle: 'settle 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      boxShadow: {
        bldSm: 'var(--bld-shadow-sm)',
        bldMd: 'var(--bld-shadow-md)',
        bldLg: 'var(--bld-shadow-lg)',
      },
    },
  },
  plugins: [],
};

export default config;