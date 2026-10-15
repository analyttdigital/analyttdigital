# Analytt Digital — Landing Page Redesign

A landing page redesign for **Analytt Digital**, a data-driven performance marketing agency in Kenya helping startups and small businesses turn ad spend into measurable growth (paid media across Google/YouTube/Meta/TikTok/LinkedIn, 90-day growth strategy, content & reporting).

The visual language is a **fluid, continuous-scroll "product explorer" system**: soft gradient washes, glassmorphic panels, rounded surfaces, floating UI cards and avatar clusters, pill buttons/badges, and subtle, elegant 3D/motion accents — built from Analytt's own brand colors rather than a literal skin of any single reference.

- **Primary:** `#4f4b63` · **Accent:** `#f04f26` · **Theme:** light

> This replaces an earlier oxigen.sa-style editorial pass (mono labels, hard-edged bordered buttons, dark chapter bands). That system has been retired; section **content** carried over, section **visuals** did not. See `docs/design/plan.md` for what's been rebuilt.

## Stack

| Layer      | Choice                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| Framework  | Next.js 15, **Pages Router**, `src/` directory, TypeScript              |
| Styling    | Tailwind CSS 3 (token-based theme in `tailwind.config.ts`)              |
| Motion     | Framer Motion (reveals, scroll-linked transforms, morph transitions) + Lenis smooth scroll |
| 3D         | Three.js (ambient hero/background scenes, lazy-mounted, static fallback) |
| Icons      | MDI, resolved at render time from content icon-name strings             |
| Content    | Keystatic (local storage, per-locale singletons)                        |

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

## Design system

Five color families, each a full tint ramp (`50`–`950`) as CSS variables (e.g. `--color-paper`, `--color-paper-50`, …), consumed only through Tailwind tokens — no ad-hoc hex in components:

- `primary` — brand primary (`#4f4b63` family)
- `accent` — brand accent (`#f04f26` family)
- `paper` — background for elevated surfaces (cards, glass panels)
- `surface` — background for the page/body
- `ink` — foreground/text family

Visual primitives: soft rounded surfaces, diffuse shadows, glass (`backdrop-blur` + translucent `paper`), gradient washes, pill buttons/chips, floating media/avatar clusters, small circular badge marks. Motion: continuous rather than chaptered — layered scroll parallax, gentle morph/cross-fade reveals, subtle idle motion on floating elements, ambient Three.js accents behind hero/full-page sections. Reference material lives under `docs/design/` (mockups + notes) — treat it as a mood/pattern reference, not a literal template to clone.

## Component contract

Every shared/reusable component:

- Takes a **`data`** prop (typed + defaulted from `src/lib/content/defaults.ts`) carrying its dynamic content — text, `icon` name strings (e.g. `"account-arrow-right"`), media refs (`{ url, alt, ... }`), etc.
- Takes optional **slot-style props** (e.g. `classes: { childA: "bg-surface" }`) to style/override nested shared components without a proliferation of one-off variants.
- Resolves `icon` names to MDI SVGs and media objects to `<Image>`-backed rendering through single shared resolvers, never ad hoc per section.
- Can be reused across pages with full content/style customization via `data` + `classes`.

## Homepage sections

Content and copy for the following sections are unchanged from the prior pass; only presentation is being rebuilt (see `docs/design/plan.md` for status):

1. **Hero** — ambient gradient/3D backdrop, display headline, floating product-UI cluster
2. **Problem** — editorial framing chapter
3. **Belief** — what we believe, dithered/gradient motif
4. **Process** — sticky/scroll-driven step sequence (Diagnose → Scale)
5. **Capabilities** — service cards with tag chips and icon motifs
6. **Work** — client results, oversized metrics
7. **Stats** — proof stats band
8. **Industries** — sector chips
9. **Insights** — article list
10. **CTA** — closing audit offer into the footer

## Content model (Keystatic)

- `layout-<locale>` **singletons**: shared chrome (nav, footer) — see `keystatic.config.ts`.
- `pages-<locale>` **collections**: page documents (title, meta, ordered section blocks; one block type per section). Sections render via `section-renderer.tsx`, which maps each block's `type` to a component.
- Schema factories live in `src/lib/keystatic/schemas.ts`.
- **Defaults live in code** (`src/lib/content/defaults.ts`): Keystatic arrays start empty, so the reader (`src/lib/content/reader.ts`) falls back to code defaults when a CMS list is empty or the entry is missing. A fresh checkout renders a complete page with zero CMS edits.
- The shared `getStaticProps` (`src/lib/keystatic/getStaticProps.ts`) reads Keystatic content at build time and passes a `bundle` prop (layout + page) to `_app`, which feeds the layout chrome; the page renders its section list.

### Editing content

1. Run `npm run dev`
2. Open `/keystatic`
3. Pick a locale group (English / Kiswahili), edit a page's section blocks or the layout, save — YAML appears under `src/content/<locale>/` (`pages/` for page documents, `layout` for chrome), committed to git like code.

### Adding a locale

1. Add the code to `locales` in `src/lib/content/types.ts` and defaults in `src/lib/content/defaults.ts`.
2. Register a `pages-<code>` collection and a `layout-<code>` singleton in `keystatic.config.ts` (copy the `sw` entries).
3. Add a nav entry in the Keystatic `ui.navigation` config.
4. Nothing else — `getStaticPaths` in `src/pages/[locale]/[...slug].tsx` enumerates every locale's pages from `listPageSlugs`, and the reader falls back to code defaults until the new locale has CMS content.

## Routing & locales

One catch-all route (`src/pages/[locale]/[...slug].tsx`) serves every page document, in both published URL shapes:

- `/` — English homepage (default locale, `src/pages/index.tsx`)
- `/<slug>` — every other English page, e.g. `/about-us`, `/pricing-plans`, `/services/paid-media`
- `/sw` — Kiswahili homepage, and `/sw/<slug>` for its other pages (e.g. `/sw/about-us`)

The default locale is unprefixed, so a first URL segment only counts as a locale when it names one; otherwise it is the page's first slug segment (`routeFromParams` in `src/lib/content/types.ts`). Slugs missing from the build still render through the `blocking` fallback, and a slug that exists in neither Keystatic nor the code defaults answers 404.

## Docs

- `AGENTS.md` — AI coding ruleset for this repo
- `docs/design/plan.md` — milestone plan (progressively updated)
- `docs/design/instructions.md` — base task handoff instructions
