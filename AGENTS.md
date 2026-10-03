# AGENTS.md — AI ruleset for this repo

Guidance for AI coding agents (and humans pairing with them) working in this project. Read this file fully before making changes.

## Project in one paragraph

Next.js 15 **Pages Router** app in `src/pages`, TypeScript strict, Tailwind 3, Framer Motion + Lenis for motion, a 2d canvas and SVG for the two signature effects, MDI icons, Keystatic (local storage) for content. It is a marketing landing page for **Analytt Digital**.

The live visual world is **The Signal Mesh**, closely modelled on the client's reference site (cantor8.io): the page is a routed signal path on one deep violet-ink ground — ad spend enters at the top and a named decision leaves at the foot, every section is a node on that path, and the connections between nodes are drawn live. Grounds change by *resolving* through an ordered pixel dither rather than cutting; hairline circuit traces with wide-radius bends route across each ground with a travelling ember packet. Client reference screenshots live in `design/` and are the compositional authority; their colours are not — the palette is Analytt's. **The previous newsprint/editorial system and the glassmorphic system are both retired.** Content, content layer and section structure carried over untouched through both.

## Non-negotiables

1. **Pages Router, `src/` directory.** Do not introduce `app/` or suggest an App Router migration in drive-by PRs. Keystatic stays wired for Pages (`src/pages/api/keystatic/[...params].ts`, `src/pages/keystatic/[...params].tsx`).
2. **The Signal Mesh, not the old ones.** Three grounds only — `.ground` (the field, `primary-700`), `.ground--deep` (`primary-950`), `.ground--paper` (`paper-100`). Grounds do not cut: the resolve is rationed to **exactly three bands** — the arrival (hero), the descent into the argument (problem), and the inversion to paper (belief) — and every other ground change crosses on a **seam** instead: a 1px hairline in the band's own colour with an ember packet running along it. Never add a fourth resolve without retiring one; never drop the seam, or the join reads as a mistake.
   Panels are flat, exactly one step lighter than their ground (`.panel` / `.panel--deep` / `.panel--paper`), with **square corners and no shadows anywhere**; structure comes from 1px rules and from step changes in tone, never from a border drawn around a box. Ember (`accent`) means *live* — the active node, a recovering figure, the primary action, a resolve band's ember pixel — and never decorates. Labels are mono, uppercase, tracked, each opened by a 6px ember square; the band head's square blinks (`.label--live`) because it is a live mark, and nothing else blinks. No glass, no pill buttons, no blurred bars, no rounded cards, no drop shadows, no emoji or unicode glyphs standing in for icons.
3. **Motion is signal, not spectacle.** There is exactly **one authored moment per surface** — the pixel resolve — plus the trace packets and the hero's signal-locking trace. Everything else is one entrance vocabulary on one exponential ease-out, all scroll-linked, all fading under `prefers-reduced-motion`. Scroll reveals go through `src/lib/motion/reveal.tsx` (`Reveal`, `MaskedLine`, `RuleDraw`, `PanelIn`, `NodeIn`, `TallyRise`, `EASE_OUT`) — extend that module rather than bypassing it. Scroll-linked effects use Framer Motion's `useScroll`/`useTransform`. Do not add a new looping effect or a new entrance without retiring one.
4. **The two graphics effects are bounded.** `PixelDither` and `TraceField` are the only canvas/SVG decoration, both client-only, both seeded so server and client render the same first frame, both cheap enough for low-power devices and constrained connections. Neither may ever carry information. Each keeps a readable fallback: the dither a CSS two-colour gradient, the trace net nothing (it is decorative).
   - **The pixel is coarse on purpose.** The grid is aimed at ~25 columns and 6 rows across the band, so one pixel is roughly 50–60px at desktop. `cell` is a *floor*, not a fixed size. The threshold matrix orders the field; noise is added on top of it, because at this pixel size the bare matrix reads as diagonal banding.
   - **The net is routed, not scattered.** Each band passes `mesh.anchors` normalised to itself, and every route runs off-frame → anchor → anchor → off-frame, so it terminates on a named component. The box is `1920 × 914`, corner easing is **elliptical** — 50px along the horizontal leg, 20px along the vertical — which is the wide flat fillet of a board trace, not a quarter-circle. Each route is drawn twice (a line and a ghost 15px above it) with a stroke gradient that falls to nothing at both ends. The packet is **scroll-driven, not a loop**: `pathLength` is normalised to 1000 so one `strokeDashoffset` drives any shape, two dash patterns (`120 880` / `90 910`) keep packets off each other's phase, and it fades as it completes.
   `three`, `@react-three/*` are no longer used by anything in `src/`; don't reintroduce a WebGL scene without a reason the mesh cannot cover.
5. **Colors and type — token-driven only.** Theme colors are defined in `tailwind.config.ts` as five color families, each with a full tint scale (`50`–`950`) exposed as CSS variables (e.g. `--color-paper`, `--color-paper-50`, …):
   - `primary` — the field. Step `600` is the brand hex `#4f4b63`; chroma rises as the ramp darkens so the deep steps read as violet-ink ground.
   - `accent` — ember `#f04f26` at step `500`. The only saturated colour; means *live*.
   - `paper` — warm plate stock: cards, buttons, the one light band.
   - `surface` — neutral chrome: dividers, scrollbar, disabled, and panels sitting on the deep band.
   - `ink` — neutral type, for the paper plates and bands.
   No ad-hoc hex values in components — everything resolves through these five families. **Ember as text must step up the ramp** (`accent-300`/`accent-400`): at `accent-500` it cannot hold 4.5:1 on a panel.
   Fonts live in `src/lib/fonts.ts` — Space Grotesk (display), Archivo (reading), Fragment Mono (labels) — and are mounted on `<Html>` in `_document.tsx`. **They must also be imported in `_app.tsx`**: Next extracts a family's `@font-face` and variable class through the `_app` module graph, so a family imported only by `_document` never has its variable defined, `var(--font-display)` resolves empty, and the whole `font-family` declaration is dropped at computed-value time — silently leaving the page in Times New Roman. Never hard-code a family in JSX.
   Authored classes live inside `@layer components` in `globals.css`. Unlayered rules outrank every Tailwind utility, so a custom class written outside the layer silently beats `hidden`, `text-*` and `opacity-*`.
6. **Content comes from the content layer, unchanged.** Components receive section content as props typed in `src/lib/content/types.ts`. Never hard-code marketing copy inside section components; defaults stay in `src/lib/content/defaults.ts` (both locales). Redesigning a section's visuals must not touch its content shape unless a task explicitly asks for new fields.
7. **Component contract — `data` + `slots`.** Every shared/reusable component:
   - Accepts a `data` prop, typed and defaulted from `src/lib/content/defaults.ts`, carrying its dynamic content (text, icon names, media refs, etc.).
   - Accepts optional slot-style props (e.g. `classes: { childA: "bg-surface" }`) to pass styling/overrides down into child shared components without prop-drilling every variant.
   - May accept ordinary React `ComponentProps` (e.g. `className`, `id`) alongside `data`/`classes`.
   - Resolves `icon` string values (e.g. `"account-arrow-right"`) to MDI SVG icons through a single shared resolver (see file map) — never inline arbitrary icon imports in a section.
   - Resolves `image`/media objects (`{ url, alt, ... }`) through a shared media component so cropping, blur-up, and fallback behavior stay consistent.
8. **Keystatic conventions.** `layout-<locale>` singletons (shared chrome) + `pages-<locale>` collections (page documents with ordered section blocks; one block type per section, e.g. `hero`, `work`). Stored under `src/content/<locale>/pages/` and `src/content/<locale>/layout`. Schema factories live only in `src/lib/keystatic/schemas.ts`. Array defaults belong in code defaults, not CMS (Keystatic arrays start empty). Icon-name and media fields in schemas are plain strings/objects — resolution to SVG/`<Image>` happens in components, not in Keystatic.
9. **Typecheck before done.** `npm run typecheck` must pass with zero errors. Run `npm run build` for structural changes (routing, config, content layer, tokens). `npm run lint` is currently broken in this repo — `eslint-config-next` 15's rushstack patch rejects the installed eslint 9.17.0 — so typecheck is the gate.
10. **No client-side data fetching for content.** Sections render from `getStaticProps`. Keystatic reads are build-time only. Canvas traces and ambient motion may of course run client-side — that's presentation, not content.

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
| Scroll UI                           | `src/components/smooth-scroll.tsx` (the 2px progress rule lives in `site-nav.tsx`) |
| Section frame / ground / head       | `src/components/layout/band.tsx` (`Band`, `BandHead`, `BandTitle`, `DEEP`/`FIELD`/`PAPER`) |
| The button                          | `src/components/layout/action.tsx` |
| Pixel resolve band (signature)      | `src/components/graphics/pixel-dither.tsx` (2d canvas, coarse Bayer dither) — used by `Band`'s `resolve` prop at exactly three moments |
| Fonts                              | `src/lib/fonts.ts`, mounted on `<Html>` in `_document.tsx` |
| Trace net (signature)               | `src/components/graphics/trace-field.tsx` (seeded SVG routes + ember packets) — a band's slice is declared as `Band`'s `mesh` prop with its `anchors` |
| Wordmark glyph / signal trace       | `src/components/graphics/pixel-mark.tsx`, `trace-recorder.tsx` |
| Motion primitives                   | `src/lib/motion/reveal.tsx`                                       |
| Design tokens                       | `tailwind.config.ts`, `src/styles/globals.css`                    |
| Docs/plan updates                   | `docs/design/plan.md` (keep milestones current)                   |

## Conventions

- `'use client'` only on files using browser APIs or hooks (`pixel-dither`, `trace-field`, `trace-recorder`, `smooth-scroll`, `site-nav`, and any section with interactive state). Section components with Framer Motion `whileInView` may stay server components in Pages Router.
- Where media belongs but none exists yet, render `MediaSlot` from `@/components/media/dynamic-image` — never a bare grey box, and never a raw `<img>`.
- Prefer editing an existing section over adding a near-duplicate one.
- Tailwind class order: layout → spacing → typography → color → state. Use arbitrary values sparingly — reach for the token scale first.
- Comments explain *why* (design-reference intent, Keystatic quirk, motion timing choice), never *what*.
- Commit style: imperative, scoped (`feat: pixel resolve band between grounds`, `refactor: retire the glass primitive set`).

## Verify before handing back

```bash
npm run typecheck   # must be clean
npm run dev         # visually check affected sections at / and /sw/home
```

For content-layer, token, or config changes also:

```bash
npm run build
# then check /keystatic loads and saving a section writes YAML under src/content/<locale>/
```

## Common tasks, step by step

**Restyle an existing section** — keep its `data` shape and content untouched; replace layout/visuals to match the fluid reference system; move any new copy needs into `defaults.ts` + schema rather than hard-coding; update `docs/design/plan.md`.

**Add a homepage section** — create component (accept `data` + optional `classes`, compose `Reveal`s), add defaults (en + sw), add schema factory + block discriminant in `pageFields` (`schemas.ts`), add member to the `Section` union (`types.ts`), add a case in `section-renderer.tsx` (the reader merges sections generically — no reader change needed), update `docs/design/plan.md`.

**Change copy** — default copy lives in `src/lib/content/defaults.ts`; live copy is edited in `/keystatic` and lands under `src/content/<locale>/` (`pages/` for page documents, `layout` for chrome). Never edit the YAML by hand unless replicating a fix across locales.

**Add a locale** — see README "Adding a locale".
