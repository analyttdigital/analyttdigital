# Design Plan — Analytt Digital Landing Redesign

Milestone-based plan. Update the status column as work lands; each milestone is scoped so it can be handed to an AI agent as a single task (pair with `docs/design/instructions.md`).

**Status legend:** ✅ done · 🚧 in progress · ⬜ not started

---

## Reset note — The Signal Mesh (current)

Two earlier visual passes are retired: the *oxigen.sa-style editorial* system (mono labels, hairline rules, newsprint stock) and the *fluid/glassmorphic* system (gradient washes, glass panels, pill buttons). **Content, content layer, scaffolding and locale routing carried over untouched through both.** The live world is now **The Signal Mesh**: a routed signal path on one deep violet-ink ground, with ordered pixel resolve bands between grounds and a live circuit-trace net. Direction contract: `.impeccable/surfaces/src-pages.md`. Reference material: `design/` (client-supplied screenshots; compositional authority, not a colour source).

Everything below is scoped against that world.

## M1 — Scaffold & foundations ✅

- [x] Next.js 15 Pages Router + TypeScript strict + Tailwind 3 in `src/`, `@/*` → `src/*`
- [x] Five token families, each a full 50–950 ramp as CSS variables: `primary` (the field; `600` = brand `#4f4b63`), `accent` (ember `#f04f26` at `500`), `paper` (warm plate stock), `surface` (neutral chrome), `ink` (neutral type). Chroma rises as the `primary` ramp darkens so the deep steps read as violet-ink ground rather than flat grey.
- [x] Three grounds only: `.ground` (field, `primary-700`), `.ground--deep` (`primary-950`), `.ground--paper` (`paper-100`). Panels are exactly one step lighter than their ground: `.panel` = `primary-600` (the literal brand hex), `.panel--deep` = `surface-800`, `.panel--paper` = `paper-50`.
- [x] Flat geometry: square corners, no shadows anywhere, 1px rules only.
- [x] Type: Space Grotesk (display, light, `0.95` leading), Archivo (reading), **Fragment Mono** (every label, figure and unit — the reference's own mono). Declared in `src/lib/fonts.ts` and mounted on `<Html>` in `_document.tsx`; also imported by `_app.tsx` so Next actually extracts the `@font-face`.
- [x] Authored classes live inside `@layer components` so Tailwind utilities can override them (unlayered rules outrank layered ones and silently beat `hidden`, `text-*`, `opacity-*`).

## M2 — Content layer ✅ (unchanged through every pass)

- [x] Keystatic local storage; `layout-<locale>` singletons + `pages-<locale>` collections
- [x] Schema factories in `src/lib/keystatic/schemas.ts`; typed model in `src/lib/content/types.ts`; per-locale defaults in `src/lib/content/defaults.ts` (en + sw)
- [x] Reader with CMS-over-defaults merge + empty-list fallback (`src/lib/content/reader.ts`)
- [x] Pages Router bridge (`src/pages/api/keystatic/[...params].ts`, `/keystatic`)
- [x] `iconField()` (MDI key string) + `imageField()` (`{ src, alt }`) conventions

## M3 — Component contract & resolvers ✅

- [x] `DataProps<TData, TSlot>` + `SlotClasses<TSlot>` generics in `types.ts`
- [x] Icon-name → MDI resolver, single source of truth (`src/lib/icons/resolve-icon.tsx`); string-safe fallback; no direct `@mdi/js` imports outside it
- [x] Shared media resolver (`src/components/media/dynamic-image.tsx`): `DynamicImage` for real media, `MediaSlot` for the placeholder frame a section draws when there is none
- [x] Sections still take named props (`hero={...}`, `work={...}`) rather than the `data`/`classes` shape — follow-up, no render impact

## M4 — Layout & chrome ✅

- [x] Instrument rail: pixel wordmark left, section links recessed into a centre panel, paper audit action + attached square arrow key right; transparent over the hero, solid deep strip with a hairline and a 2px ember scroll-progress rule once scrolled
- [x] Below `lg`: four-square mark opens a full-screen sheet over the deep band, carrying the audit action and the link columns; `aria-expanded`, `aria-controls`, Escape to close, body scroll locked while open
- [x] Skip link to `#main`
- [x] Lenis smooth scroll retained; anchors route through it with a −84px offset; reduced-motion guard kept
- [x] Footer: closing statement + ember action on the deep band, then wordmark/tagline/link columns/imprint

## M5 — Homepage sections ✅ (content unchanged, all ten rewritten)

- [x] Hero — field ground, display statement, live signal trace that locks when tracking goes live, channel marquee
- [x] Problem — deep band; spend split drawn as columns of squares so the reader can count the loss
- [x] Belief — paper band; numbered commitment readout + one media slot
- [x] Process — field band; five nodes on a routed rail, the live node in ember
- [x] Capabilities — paper band, path-flow rebuild (Oct 2026): four services as flat `panel--paper` nodes on `PathFlowSection`'s `rail` layout — a two-up grid in normal document flow (so no panel can overlap another) with a switchback spine routed through the measured card boxes; scroll-driven ember trail with glow + head, header restored to `BandHead` + `BandTitle`. Content shape unchanged. DEVIATION: the flow's glow/head/reveal add authored motion beyond the Mesh's single resolve + trace packets — per owner sign-off for the full path-flow look; trail reuses the ember token, never the component blue default.
- [x] Work — paper band, same path-flow rebuild (Oct 2026): four cases as flat `panel--paper` nodes with media slots on `PathFlowSection`'s `rail` layout — normal-flow grid keeps the tall media plates from colliding, the routed spine follows their real positions. Real figures carried over untouched; client names still pending clearance. Same Mesh deviation as Capabilities.
- [x] Stats — paper band; four figures ruled as one tally
- [x] Industries — field band; sector chip index
- [x] Insights — deep band; three entries with an honest in-preparation status
- [x] CTA — paper band; the offer stated once, with the net in ink converging on the single action

## M6 — Motion ✅

- [x] `src/lib/motion/reveal.tsx` retuned: `Reveal`, `MaskedLine`, `RuleDraw`, `PanelIn`, `NodeIn`, `TallyRise` — one exponential ease-out, all scroll-linked, all fading under `prefers-reduced-motion`
- [x] **Signature interaction — the resolve band** (`src/components/graphics/pixel-dither.tsx`): ordered 8×8 Bayer dither on a 2d canvas, swept once on entry, with a CSS two-colour fallback if there is no 2d context
- [x] **Resolve rationed to three moments** — the arrival (hero), the descent into the argument (problem), the inversion to paper (belief) — on a coarse fixed-size pixel (21–26px, ~11 rows per band) so the matrix reads as a printed threshold table rather than noise. `spread` at 0.8 saturates the top and bottom tenth of each band solid, so the join to each neighbouring ground stays flush
- [x] **Seam** replaces the resolve at every other ground change (`band.tsx` → `.seam`): a 1px hairline in the band's own colour with an ember packet running along it, so an undissolved join still reads as routed rather than as an accidental cut
- [x] **Trace net** (`src/components/graphics/trace-field.tsx`): seeded orthogonal routes with wide-radius bends, square pads, a travelling ember packet per route, parallax via `useScroll`
- [x] **Net rerouted between components** — each band hands in `anchors`, points normalised to its content column; every route runs off-frame → anchor → anchor → off-frame, so it terminates on a named component instead of floating. `frame` maps anchors onto the centred column, so `0`/`1` are its edges and `0.5` is the gutter between two columns — one pad lands on each card edge
- [x] **Aspect-tracking viewBox** — the net's viewBox height follows the host's measured aspect (`ResizeObserver`), replacing `xMidYMid slice`. The old slice-scaled net lost most of its width on a tall or narrow band, which is why the routes used to bunch into one corner on a phone
- [x] Net present on hero, problem, belief, capabilities, work, insights, CTA and footer; absent from process (it already draws a literal route with live state on it), stats (the tally must not move behind it) and industries (back matter)
- [x] Hover states: panels step one ramp level lighter, the attached arrow key fills with ember, chips and metrics take ember
- [ ] Three.js removed from the build (no scene remains); `three` / `@react-three/*` are still listed in `package.json` and can be dropped with a lockfile refresh

## M7 — Locale routing ✅

- [x] `/` English, `/sw/home` Kiswahili, no bare `/sw` route
- [x] Both locales ship as peers; interface strings in `src/lib/content/chrome.tsx` are mirrored
- [ ] Optional: hreflang tags + a locale switcher in the rail

## M8 — Asset & SEO hardening ⬜

- [ ] Favicon/logo set, og-image built from the current visual system
- [ ] `sitemap.xml`, `robots.txt`
- [ ] Real article destinations for the Insights rows (currently status-only, no dead links)
- [ ] Scheduler URL to replace the `mailto:` CTAs

## M9 — Content ops ⬜

- [ ] Keystatic Cloud / GitHub storage for hosted editing
- [ ] Draft-mode live preview of Keystatic edits
- [ ] Move Insights to a Keystatic *collection* once real articles exist

---

## Handoff notes

- Unchecked boxes are self-contained tasks. Start from `AGENTS.md`, then `docs/design/instructions.md`.
- Verification for any task: `npm run typecheck` (must be clean) and `npm run dev`, checking `/` and `/sw/home` at desktop and mobile widths. Add `npm run build` when tokens, the content layer, routing or the config change.
- `npm run lint` is currently broken in this repo (`eslint-config-next` 15's rushstack patch rejects the installed eslint 9.17.0) — unrelated to any task; typecheck is the gate.