# AGENTS.md — AI ruleset for this repo

Guidance for AI coding agents (and humans pairing with them) working in this project. Read this file fully before making changes.

## Project in one paragraph

Next.js 15 **Pages Router** app in `src/pages`, TypeScript strict, Tailwind 3, Framer Motion + Lenis for motion, Keystatic (local storage) for content. It is a marketing landing page for Analytt Digital whose design system intentionally clones [oxigen.sa](https://www.oxigen.sa/) with Analytt branding (`#4f4b63` ink, `#f04f26` ember, light theme).

## Non-negotiables

1. **Pages Router, `src/` directory.** Do not introduce `app/` or suggest an App Router migration in drive-by PRs. Keystatic is wired for Pages (`src/pages/api/keystatic/[...params].ts`, `src/pages/keystatic/[...params].tsx`).
2. **Design system fidelity.** Match the Oxigen reference: mono uppercase eyebrow labels (`.mono-label`), zero-radius bordered buttons (`.mono-btn`), huge display headlines (`.display`), serif body copy (`.prose-serif`), hairline dividers, dithered pixel graphics, dark `ink-950` chapter bands alternating with light `paper`/`mist` sections. Do not add rounded corners, drop shadows on cards, gradients outside the approved radial washes, or extra accent colors.
3. **Colors and type.** Only the token ramps in `tailwind.config.ts` (`ink`, `ember`, `mist`, `line`, `paper`). No ad-hoc hex values in components. Fonts are wired through CSS variables — never hard-code font families in JSX.
4. **Content comes from the content layer.** Components receive section content as props typed in `src/lib/content/types.ts`. Never hard-code marketing copy inside section components; add defaults to `src/lib/content/defaults.ts` instead (both locales).
5. **Keystatic conventions.** One singleton per section per locale, key `<section>-<locale>`, path `src/content/<locale>/<section>`. Schema factories live only in `src/lib/keystatic/schemas.ts`. Array defaults belong in code defaults, not CMS (Keystatic arrays start empty).
6. **Typecheck before done.** `npm run typecheck` must pass with zero errors. Run `npm run build` for structural changes (routing, config, content layer).
7. **Motion rules.** All scroll reveals go through `src/lib/motion/reveal.tsx` (`Reveal`, `useRevealVariants`, `EASE_OUT`). New scroll-linked effects use Framer Motion's `useScroll`/`useTransform`. Respect `prefers-reduced-motion` (Lenis and reveals already do).
8. **No client-side data fetching for content.** Sections render from `getStaticProps`. Keystatic reads are build-time only.

## File map (where things go)

| Need                          | Location                                             |
| ----------------------------- | ---------------------------------------------------- |
| New homepage section          | `src/components/sections/<name>.tsx` + compose in `src/pages/index.tsx` and `src/pages/[locale]/index.tsx` |
| Section content fields        | `src/lib/keystatic/schemas.ts` (factory) + singleton in `keystatic.config.ts` |
| Section default copy          | `src/lib/content/defaults.ts`                        |
| Section prop types            | `src/lib/content/types.ts`                           |
| Shared chrome (nav/footer)    | `src/components/layout/`                             |
| Scroll UI                     | `src/components/layout/scroll-progress.tsx`, `src/components/smooth-scroll.tsx` |
| Pixel/dither graphics         | `src/components/graphics/` (canvas-based, `'use client'`, deterministic seeds) |
| Motion primitives             | `src/lib/motion/reveal.tsx`                          |
| Design tokens                 | `tailwind.config.ts`, `src/styles/globals.css`       |
| Docs/plan updates             | `docs/design/plan.md` (keep milestones current)      |

## Conventions

- `'use client'` only on files using browser APIs or hooks (canvas components, SmoothScroll, ScrollProgress). Section components with Framer Motion `whileInView` may stay server components in Pages Router (they render client-side after hydration but need no directive).
- Prefer editing an existing section over adding a near-duplicate one.
- Tailwind class order: layout → spacing → typography → color → state. Use arbitrary values sparingly.
- Comments explain *why* (design-reference intent, Keystatic quirk), never *what*.
- Commit style: imperative, scoped (`feat: process chapter scroll counter`, `fix: keystatic locale fallback`).

## Verify before handing back

```bash
npm run typecheck   # must be clean
npm run dev         # visually check affected sections at / and /sw
```

For content-layer or config changes also:

```bash
npm run build
# then check /keystatic loads and saving a section writes YAML under src/content/<locale>/
```

## Common tasks, step by step

**Add a homepage section** — create component (accept `sections?.<name>` prop, compose `Reveal`s, follow chapter rhythm), add defaults, add schema factory + singleton for both locales, add to `SectionKey` list in `types.ts`, `readSections` keys in `reader.ts`, compose into both pages, update `CHAPTERS` in `site-layout.tsx` if it needs a nav-rail tick, update `docs/design/plan.md`.

**Change copy** — default copy lives in `src/lib/content/defaults.ts`; live copy is edited in `/keystatic` and lands in `src/content/<locale>/<section>/index.yaml`. Never edit the YAML by hand unless replicating a fix across locales.

**Add a locale** — see README "Adding a locale".
