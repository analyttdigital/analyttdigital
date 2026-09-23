# Analytt Digital — Landing Page Redesign

A landing page redesign for **Analytt Digital**, a data-driven performance marketing agency in Kenya. The design language, structure, feel and scroll animations follow [oxigen.sa](https://www.oxigen.sa/); the branding, palette and content are Analytt Digital's.

- **Primary:** `#4f4b63` (ink) · **Accent:** `#f04f26` (ember) · **Theme:** light

## Stack

| Layer      | Choice                                                      |
| ---------- | ----------------------------------------------------------- |
| Framework  | Next.js 15, **Pages Router**, `src/` directory, TypeScript  |
| Styling    | Tailwind CSS 3 (design tokens in `tailwind.config.ts`)      |
| Motion     | Framer Motion (reveals, scroll progress) + Lenis smooth scroll |
| Content    | Keystatic (local storage, per-locale singletons)            |

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Keystatic admin UI: **http://localhost:3000/keystatic** (no login needed in local mode — edits write files into `src/content/<locale>/`).

Other scripts:

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Homepage sections

1. **Hero** — full-height ink panel, display headline, channel marquee
2. **Problem** — editorial chapter ("the spend was never the problem")
3. **Belief** — what we believe + dithered pixel motif
4. **Process** — five full-height sticky chapters (Diagnose → Scale) with scroll-driven counter
5. **Capabilities** — service cards with mono tag chips and pixel graphics
6. **Work** — numbered client results with oversized metrics
7. **Stats** — dark philosophy band with proof stats
8. **Industries** — sector chips
9. **Insights** — numbered article list
10. **CTA** — closing audit offer, hands off into the footer

## Content model (Keystatic)

- One **singleton per section per locale** (`hero-en`, `hero-sw`, …) — see `keystatic.config.ts`.
- Schema factories live in `src/lib/keystatic/schemas.ts`.
- **Defaults live in code** (`src/lib/content/defaults.ts`): Keystatic arrays start empty, so the reader (`src/lib/content/reader.ts`) falls back to code defaults when a CMS list is empty or the entry is missing. A fresh checkout renders a complete page with zero CMS edits.
- The shared `getStaticProps` (`src/lib/keystatic/getStaticProps.ts`) reads Keystatic content at build time and passes a `sections` prop to `_app`, which feeds nav + footer; the page picks its sections.

### Editing content

1. Run `npm run dev`
2. Open `/keystatic`
3. Pick a locale group (English / Kiswahili), edit a section, save — a YAML file appears under `src/content/<locale>/<section>/index.yaml`, committed to git like code.

### Adding a locale

1. Add the code to `locales` in `src/lib/content/types.ts` and defaults in `src/lib/content/defaults.ts`.
2. Register `<section>-<code>` singletons in `keystatic.config.ts` (copy the `sw` block).
3. Add a nav entry in the Keystatic `ui.navigation` config.
4. The `[locale]` page route picks it up automatically via `getStaticPaths`.

## Routing & locales

- `/` — English homepage (default)
- `/sw` — Kiswahili homepage (route-based locale from `src/pages/[locale]/index.tsx`)

## Design system

Tokens in `tailwind.config.ts`: `ink` ramp (primary `#4f4b63`), `ember` (accent `#f04f26`), `mist`/`line` neutrals; fonts via CSS variables (`--font-display`, `--font-sans`, `--font-serif`, `--font-mono`). Editorial primitives in `src/styles/globals.css`: `.mono-label`, `.mono-btn`, `.display`, `.prose-serif`, `.grain`.

## Docs

- `AGENTS.md` — AI coding ruleset for this repo
- `docs/design/plan.md` — milestone plan (progressively updated)
- `docs/design/instructions.md` — base task handoff instructions
