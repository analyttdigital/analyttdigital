# AGENTS.md — AI ruleset for this repo

Guidance for AI coding agents (and humans pairing with them) working in this project. Read this file fully before making changes.

## Project in one paragraph

Next.js 15 **Pages Router** app in `src/pages`, TypeScript strict, Tailwind 3, Framer Motion + Lenis for motion, Three.js for subtle 3D/hero scenes, MDI icons, Keystatic (local storage) for content. It is a marketing landing page for **Analytt Digital**. The visual design is being rebuilt from scratch: a fluid, continuous-scroll, "product explorer" aesthetic — soft gradient washes, glassmorphism, rounded surfaces, floating UI cards, pill buttons and badges — inspired by the attached reference shots, restyled with Analytt's `primary`/`accent` palette. **The previous oxigen.sa-style editorial system (mono labels, zero-radius bordered buttons, hairline dividers, dark ink bands) is retired.** Content and section structure carry over; visuals do not.

## Non-negotiables

1. **Pages Router, `src/` directory.** Do not introduce `app/` or suggest an App Router migration in drive-by PRs. Keystatic stays wired for Pages (`src/pages/api/keystatic/[...params].ts`, `src/pages/keystatic/[...params].tsx`).
2. **New design language, not the old one.** Soft, rounded, layered surfaces (`rounded-xl`/`2xl`/`3xl`), diffuse shadows, gradient washes (radial/conic, primary↔accent↔transparent), glass panels (`backdrop-blur` + translucent `paper`), pill-shaped buttons and chips, floating avatar/media clusters, small circular badge marks. No hard-edged bordered `.mono-btn` buttons, no zero-radius cards, no dark full-bleed "chapter band" sections as a structural pattern (a section may still use a dark/deep `ink` background where it genuinely helps rhythm, but it's a choice, not the system).
3. **Motion is continuous, not chaptered.** Scroll should feel like one fluid exploration: layered parallax, gentle morphing/blob shapes, soft cross-fades and scale/translate reveals, floating elements with subtle idle motion. Prefer smooth easing over hard staggers. All scroll reveals still go through `src/lib/motion/reveal.tsx` (`Reveal`, `useRevealVariants`, `EASE_OUT`) — extend that module rather than bypassing it. New scroll-linked effects use Framer Motion's `useScroll`/`useTransform`. Respect `prefers-reduced-motion` (Lenis and reveals already do).
4. **Three.js is additive and subtle.** Used for hero backgrounds or full-page ambient scenes (soft particles, gradient blobs, light distortion) — never as the primary carrier of information. Keep geometry cheap, lazy-mount client-side only, and always provide a static/CSS-gradient fallback for reduced motion or low-power devices.
5. **Colors and type — token-driven only.** Theme colors are defined in `tailwind.config.ts` as five color families, each with a full tint scale (`50`–`950`) exposed as CSS variables (e.g. `--color-paper`, `--color-paper-50`, …):
   - `primary` — primary brand color (`#4f4b63` family)
   - `accent` — accent brand color (`#f04f26` family)
   - `paper` — background for elevated elements (cards, panels, glass surfaces)
   - `surface` — background for the page/body
   - `ink` — foreground/text color family
   No ad-hoc hex values in components — everything resolves through these five families. Fonts are wired through CSS variables — never hard-code font families in JSX.
6. **Content comes from the content layer, unchanged.** Components receive section content as props typed in `src/lib/content/types.ts`. Never hard-code marketing copy inside section components; defaults stay in `src/lib/content/defaults.ts` (both locales). Redesigning a section's visuals must not touch its content shape unless a task explicitly asks for new fields.
7. **Component contract — `data` + `slots`.** Every shared/reusable component:
   - Accepts a `data` prop, typed and defaulted from `src/lib/content/defaults.ts`, carrying its dynamic content (text, icon names, media refs, etc.).
   - Accepts optional slot-style props (e.g. `classes: { childA: "bg-surface" }`) to pass styling/overrides down into child shared components without prop-drilling every variant.
   - May accept ordinary React `ComponentProps` (e.g. `className`, `id`) alongside `data`/`classes`.
   - Resolves `icon` string values (e.g. `"account-arrow-right"`) to MDI SVG icons through a single shared resolver (see file map) — never inline arbitrary icon imports in a section.
   - Resolves `image`/media objects (`{ url, alt, ... }`) through a shared media component so cropping, blur-up, and fallback behavior stay consistent.
8. **Keystatic conventions.** `layout-<locale>` singletons (shared chrome) + `pages-<locale>` collections (page documents with ordered section blocks; one block type per section, e.g. `hero`, `work`). Stored under `src/content/<locale>/pages/` and `src/content/<locale>/layout`. Schema factories live only in `src/lib/keystatic/schemas.ts`. Array defaults belong in code defaults, not CMS (Keystatic arrays start empty). Icon-name and media fields in schemas are plain strings/objects — resolution to SVG/`<Image>` happens in components, not in Keystatic.
9. **Typecheck before done.** `npm run typecheck` must pass with zero errors. Run `npm run build` for structural changes (routing, config, content layer, Three.js scene bootstrapping).
10. **No client-side data fetching for content.** Sections render from `getStaticProps`. Keystatic reads are build-time only. Three.js scenes and ambient motion may of course run client-side — that's presentation, not content.

## File map (where things go)

| Need                              | Location                                                          |
| ---------------------------------- | ------------------------------------------------------------------ |
| New homepage section                | `src/components/sections/<name>.tsx` + block in `pageFields` (`schemas.ts`) + case in `section-renderer.tsx` (renders on `/` and `/<locale>/<slug>` via the shared `getStaticProps`) |
| Section content fields              | `src/lib/keystatic/schemas.ts` (factory) + singleton in `keystatic.config.ts` |
| Section default copy                | `src/lib/content/defaults.ts`                                     |
| Section prop types (`data`, `classes`) | `src/lib/content/types.ts`                                      |
| Icon-name → MDI resolver            | `src/lib/icons/resolve-icon.tsx` (single source of truth)         |
| Media/image resolver                | `src/components/media/dynamic-image.tsx`                          |
| Shared chrome (nav/footer)          | `src/components/layout/`                                          |
| Scroll UI                           | `src/components/layout/scroll-progress.tsx`, `src/components/smooth-scroll.tsx` |
| Ambient / hero 3D scenes            | `src/components/three/` (canvas-based, `'use client'`, lazy-mounted, static fallback) |
| Gradient/blob/glass backgrounds     | `src/components/graphics/` (CSS + SVG, deterministic where seeded) |
| Motion primitives                   | `src/lib/motion/reveal.tsx`                                       |
| Design tokens                       | `tailwind.config.ts`, `src/styles/globals.css`                    |
| Docs/plan updates                   | `docs/design/plan.md` (keep milestones current)                   |

## Conventions

- `'use client'` only on files using browser APIs or hooks (canvas/Three.js components, SmoothScroll, ScrollProgress). Section components with Framer Motion `whileInView` may stay server components in Pages Router.
- Prefer editing an existing section over adding a near-duplicate one.
- Tailwind class order: layout → spacing → typography → color → state. Use arbitrary values sparingly — reach for the token scale first.
- Comments explain *why* (design-reference intent, Keystatic quirk, motion timing choice), never *what*.
- Commit style: imperative, scoped (`feat: fluid hero gradient scene`, `refactor: retire mono-btn primitives`).

## Verify before handing back

```bash
npm run typecheck   # must be clean
npm run dev         # visually check affected sections at / and /sw/home
```

For content-layer, config, or Three.js bootstrapping changes also:

```bash
npm run build
# then check /keystatic loads and saving a section writes YAML under src/content/<locale>/
```

## Common tasks, step by step

**Restyle an existing section** — keep its `data` shape and content untouched; replace layout/visuals to match the fluid reference system; move any new copy needs into `defaults.ts` + schema rather than hard-coding; update `docs/design/plan.md`.

**Add a homepage section** — create component (accept `data` + optional `classes`, compose `Reveal`s), add defaults (en + sw), add schema factory + block discriminant in `pageFields` (`schemas.ts`), add member to the `Section` union (`types.ts`), add a case in `section-renderer.tsx` (the reader merges sections generically — no reader change needed), update `docs/design/plan.md`.

**Change copy** — default copy lives in `src/lib/content/defaults.ts`; live copy is edited in `/keystatic` and lands under `src/content/<locale>/` (`pages/` for page documents, `layout` for chrome). Never edit the YAML by hand unless replicating a fix across locales.

**Add a locale** — see README "Adding a locale".
