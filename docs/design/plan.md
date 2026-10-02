# Design Plan — Analytt Digital Landing Redesign

Milestone-based plan. Update the status column as work lands; each milestone is scoped so it can be handed to an AI agent as a single task (pair with `docs/design/instructions.md`).

**Status legend:** ✅ done · 🚧 in progress · ⬜ not started

---

## Reset note

The previous oxigen.sa-editorial visual pass (mono labels, zero-radius bordered buttons, dark chapter bands) is retired. **Content, content layer, scaffolding, and locale routing are kept** — see M1/M2/M6 below, carried over as-is. **All visual/chrome/motion milestones are reset to not-started** and rebuilt against the new fluid/glassmorphic design system. Reference: attached mockups + notes under `docs/design/references/` (mood/pattern reference, not a literal template).

---

## M1 — Scaffold & foundations ✅ (carried over)

- [x] Next.js 15 Pages Router + TypeScript + Tailwind 3 in `src/`
- [x] `tsconfig` path alias `@/*` → `src/*`
- [x] Design tokens rebuilt for the new system: `primary`, `accent`, `paper`, `surface`, `ink` — each a full `50`–`950` tint scale as CSS variables in `tailwind.config.ts` / `src/styles/globals.css` (supersedes the old `ink`/`ember` two-color setup)
  - Landed (evolved in the parallel M5 pass): CSS-var-backed ramps; families now `primary`/`accent`/`paper`/`mist`/`ink` + full-scale `ember` alias (`surface`/`line` aliases dropped as unused); `mist` promoted to a full canvas scale; ink 700–950 deepened slightly (brand anchors `primary-600`/`ink-600` = `#4f4b63`, `accent-500` = `#f04f26` intact). Scene primitives now `.canvas`/`.stage`/`.aurora`/`.card-float`/`.callout` + `.btn-pill` (ink/accent/ghost), `.chip-pill`, `.btn-disc`, `.glass-panel` (frosted pill bar).
- [x] Remove/retire old editorial primitives (`.mono-label`, `.mono-btn`, `.display`, `.prose-serif`, `.grain`) once nothing in the new system depends on them; replace with the new primitive set (glass panel, pill button, gradient wash, soft card)
  - Landed in the M5 audit: `.mono-label`, `.mono-btn`, `.prose-serif`, `.grain`, `.hairline` defs removed (zero references); `digital.css` deleted (unimported, unused); `.display` deliberately retained for hero/cta/process headings.

## M2 — Content layer ✅ (carried over, unchanged)

- [x] Keystatic local storage; `layout-<locale>` singletons + `pages-<locale>` collections (page docs with ordered section blocks)
- [x] Schema factories with default scalar values in `src/lib/keystatic/schemas.ts`
- [x] Typed content model + locale helpers in `src/lib/content/types.ts`
- [x] Full per-locale defaults in `src/lib/content/defaults.ts` (en + sw)
- [x] Reader with CMS-over-defaults merge and empty-list fallback (`src/lib/content/reader.ts`)
- [x] Pages Router API bridge (`src/pages/api/keystatic/[...params].ts`) + admin UI page (`/keystatic`)
- [x] Confirm/extend `icon` and `image` field conventions in schemas so every section can carry MDI icon-name strings and media refs without ad hoc shapes
  - Landed: shared `iconField()` (plain text = MDI key, empty keeps positional default) + `imageField()` (plain `{ src, alt }`, empty `src` = absent) factories in `schemas.ts`; optional `icon` wired into capabilities items / belief points / stats entries, optional `image` into work cases; mirrored as `ContentImage` + optional fields in `types.ts` and icon values in `defaults.ts` (en+sw, matching today's hardcoded/positional picks — rendering unchanged, no component reads the new fields yet).

## M3 — Component contract & resolvers ⬜

- [x] Formalize `data` + `classes` (slots) prop contract across shared/reusable components
  - Landed: shared `DataProps<TData, TSlot>` + `SlotClasses<TSlot>` generics in `types.ts` with adoption rule (new shared components use it now; sections adopt during M5 restyles — no section migrated yet, so no render change).
- [x] Shared icon-name → MDI SVG resolver (`src/lib/icons/resolve-icon.tsx`), single source of truth
  - Landed: `mdi` map + `MdiName` + string-safe `resolveIcon()`/`isMdiName()` (unknown/empty names fall back to `asterisk`, never crash) + `MdiIcon` accepting plain strings; positional `capabilityIcons`/`statIcons` preserved; `components/motion/mdi-icon.tsx` kept as a re-export shim so all section imports work unchanged.
- [x] Shared media/image resolver component (`src/components/media/dynamic-image.tsx`) for `{ url, alt, ... }` content
  - Landed: `DynamicImage` wrapping `next/image` — null-safe on empty/absent `src`, fluid `fill` by default (fixed `width`/`height` mode supported), remote URLs `unoptimized` until M8 `remotePatterns` land. No call sites yet (M3 box 4 wires sections).
- [x] Audit existing sections for inline icon imports / raw `<img>` tags and migrate to the resolvers
  - Landed: audit found no raw `<img>` and no direct `@mdi/js` imports in sections. All 11 `MdiIcon` call sites repointed to `@/lib/icons/resolve-icon`; capabilities/belief/stats icons now content-driven (`data.icon` with positional fallback, behavior-identical under current defaults); work figure renders `DynamicImage` when `image.src` is set, else keeps the generated graphic. `mdi-icon.tsx` shim is now unimported (kept until M5, then deleted).

## M4 — Layout & chrome (redesign) ⬜

- [x] `_document` / `_app` updated for new token set and any global gradient/grain-replacement background
  - Landed (M5 audit fix): `grain` gone; `body` is `bg-mist-100 …` (dead `bg-surface`/`gradient-wash` classes removed after the token rename). `_app` verified — fonts already CSS-var wired, no change needed.
- [x] Nav rebuilt in the fluid style: rounded pill CTA, soft glass bar on scroll (replaces the mono bordered nav)
  - Landed (evolved in the parallel pass + M5 audit): floating transparent→`glass-panel` pill bar; navy chip + wordmark (initial now content-derived), sans links, `btn-pill--ink` CTA, mobile hamburger sheet (`aria-expanded`, menu/close glyphs added to the resolver — previously fell back to asterisk); dead scene-probe removed (all scenes light). Same layout content fields.
- [x] Lenis smooth scroll retained; tuned for continuous-feel easing
  - Landed: per-gesture section-snap engine removed (one uninterrupted glide; `data-snap` attrs now inert, CSS snap never applied — cleanup rides with M5); Lenis kept at duration 1.2/expo easing, touch 1.6; anchors route through Lenis with −88px floating-nav offset; reduced-motion guard kept.
- [x] Scroll progress treatment redesigned to fit continuous (non-chaptered) motion, or retired if it no longer fits
  - Landed: chaptered rail retired (ticks, pct readout, active-chapter label, `CHAPTERS` const gone from layout); kept one slim 2px accent→primary gradient hairline, scroll-linked via spring. Verified `/`, `/sw/home`, `/keystatic` 200.
- [x] Footer rebuilt: soft/gradient closing panel, link columns, brand mark — no hard dark full-bleed band requirement
  - Landed (rewritten again in the parallel pass): `canvas` close with deep rounded ink panel (accent blobs), accent pill CTA, badge brand mark, dashed column dividers, rotating circular badge (reduced-motion guarded), legal row on light. Same layout content fields. Verified `/`, `/sw/home`, `/keystatic` 200.

## M5 — Homepage sections, restyled (content unchanged) ✅ (parallel session; audited)

All ten sections restyled in the parallel pass against the canvas/stage/aurora system; M5 audit verified: zero ad-hoc hex, `icon`/`image` flow through the shared resolvers, content layer untouched (only the M2 `icon` additions in defaults), no raw `<img>`, no direct `@mdi/js` in sections. Audit fixes applied: `emerald-*` → `accent-*` (cta), `menu`/`close` glyphs added (nav hamburger previously fell back to asterisk), dead scene-probe removed, `_document` classes corrected, dead CSS pruned. Open follow-ups: sections kept named props instead of adopting `DataProps` (contract follow-up); `scroll-3d.tsx`/`parallax.tsx` now unimported (kept for M6); `mdi-icon.tsx` shim unimported (delete); `.display` retained for 3 headings.

- [x] Hero — ambient Three.js/gradient backdrop, floating product-UI card cluster, display headline
- [x] Problem — soft editorial framing, no hard chapter band requirement
- [x] Belief — points + gradient/blob motif (replaces dithered pixel field)
- [x] Process — continuous scroll-driven step sequence (Diagnose → Scale) with morph/cross-fade between steps
- [x] Capabilities — service cards as soft/glass cards with icon chips
- [x] Work — client results with floating metric cards
- [x] Stats — proof stats as a soft panel (gradient or glass), not a hard dark band by default
- [x] Industries — sector chip cluster, pill styling
- [x] Insights — article list as card rows
- [x] CTA — closing audit offer as a glass/gradient panel into the footer

## M6 — Motion & 3D layer ⬜

- [ ] `Reveal` primitive updated/extended for morph/cross-fade style reveals (still `whileInView`, once, reduced-motion aware)
- [ ] Scroll-linked parallax/transform layer via `useScroll`/`useTransform` for floating elements
- [ ] Ambient Three.js hero/background scene(s) in `src/components/three/`, lazy-mounted, with static fallback
- [ ] Idle micro-motion on floating cards/badges (subtle, low-amplitude)
- [ ] Hover states redesigned for pill buttons/glass cards (replaces mono-btn invert)

## M7 — Locale routing ✅ (carried over)

- [x] `/` English, `/sw/home` Kiswahili via `src/pages/index.tsx` + `src/pages/[locale]/[...slug].tsx` (no bare `/sw` route)
- [x] Locale-scoped Keystatic collections/singletons + nav groups in admin UI
- [ ] Optional: hreflang tags + locale switcher in nav

## M8 — Asset & SEO hardening ⬜

- [ ] Favicon/logo set (current: inline text brand), og-image reflecting new visual system
- [ ] `sitemap.xml`, `robots.txt`
- [ ] Real case-study links on Insights rows (currently `#`)
- [ ] Contact form (mailto CTA today)

## M9 — Content ops ⬜

- [ ] Keystatic Cloud / GitHub storage for hosted editing (switch `storage.kind`, add env vars from `.env.example`)
- [ ] Draft-mode live preview of Keystatic edits
- [ ] Move Insights to a Keystatic *collection* once real articles exist

---

## Handoff notes

- Each unchecked box above is a self-contained task. Start from `AGENTS.md`, then `docs/design/instructions.md`.
- Design reference: attached fluid/glassmorphic mockups — soft gradient washes, glass panels, floating UI/media clusters, pill buttons, subtle 3D/motion. Brand: `#4f4b63` / `#f04f26`, light theme, token families `primary`/`accent`/`paper`/`surface`/`ink`.
- Verification for any task: `npm run typecheck`, `npm run dev`, check `/` and `/sw/home`, `npm run build` + `/keystatic` if content layer, tokens, or resolvers touched.
