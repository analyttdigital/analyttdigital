# Design Plan — Analytt Digital Landing Redesign

Milestone-based plan. Update the status column as work lands; each milestone is scoped so it can be handed to an AI agent as a single task (pair with `docs/design/instructions.md`).

**Status legend:** ✅ done · 🚧 in progress · ⬜ not started

---

## M1 — Scaffold & foundations ✅

- [x] Next.js 15 Pages Router + TypeScript + Tailwind 3 in `src/`
- [x] Design tokens (`ink` / `ember` / neutrals) in `tailwind.config.ts`
- [x] Editorial primitives (`.mono-label`, `.mono-btn`, `.display`, `.prose-serif`, `.grain`) in `src/styles/globals.css`
- [x] `tsconfig` path alias `@/*` → `src/*`

## M2 — Content layer ✅

- [x] Keystatic local storage; one singleton per section per locale (`<section>-en` / `<section>-sw`)
- [x] Schema factories with default scalar values in `src/lib/keystatic/schemas.ts`
- [x] Typed content model + locale helpers in `src/lib/content/types.ts`
- [x] Full per-locale defaults in `src/lib/content/defaults.ts` (en + sw)
- [x] Reader with CMS-over-defaults merge and empty-list fallback (`src/lib/content/reader.ts`)
- [x] Pages Router API bridge (`src/pages/api/keystatic/[...params].ts`) + admin UI page (`/keystatic`)

## M3 — Layout & chrome ✅

- [x] `_document` (grain overlay, theme color), `_app` (Keystatic bypass, `SiteLayout`)
- [x] Fixed nav: brand, mono links, CTA; scroll-linked background
- [x] Lenis smooth scroll with reduced-motion opt-out and anchor handling
- [x] Right-edge scroll progress rail with per-section chapter ticks
- [x] Dark footer: closing CTA, link columns, oversized dithered wordmark

## M4 — Homepage sections ✅ (10 sections, ≥6 required)

- [x] Hero — full-height ink panel, staggered entrance, channel marquee
- [x] Problem — editorial chapter
- [x] Belief — points + dithered pixel field
- [x] Process — 5 sticky full-height chapters, scroll-driven counter (01–05)
- [x] Capabilities — service cards with tag chips + pixel motifs
- [x] Work — numbered client results, oversized metrics
- [x] Stats — dark philosophy band with 4 proof stats
- [x] Industries — sector chip grid
- [x] Insights — numbered article rows
- [x] CTA — closing audit band with ember accent

## M5 — Motion & polish ✅

- [x] `Reveal` primitive (whileInView, once, reduced-motion aware)
- [x] Scroll-linked progress line + active chapter label
- [x] Hero entrance choreography (staggered eyebrow → headline → sub → CTA)
- [x] Marquee loop, hover states (mono-btn invert, ember accents)
- [ ] Optional: parallax on section headers (`useScroll` + `useTransform`)

## M6 — Locale routing ✅

- [x] `/` English, `/sw` Kiswahili via `src/pages/[locale]/index.tsx`
- [x] Locale-scoped Keystastic singletons + nav groups in admin UI
- [ ] Optional: hreflang tags + locale switcher in nav

## M7 — Asset & SEO hardening ⬜

- [ ] Favicon/logo set (current: inline text brand), og-image
- [ ] `sitemap.xml`, `robots.txt`
- [ ] Real case-study links on Insights rows (currently `#`)
- [ ] Contact form (mailto CTA today)

## M8 — Content ops ⬜

- [ ] Keystatic Cloud / GitHub storage for hosted editing (switch `storage.kind`, add env vars from `.env.example`)
- [ ] Draft-mode live preview of Keystatic edits
- [ ] Move Insights to a Keystatic *collection* once real articles exist

---

## Handoff notes

- Each unchecked box above is a self-contained task. Start from `AGENTS.md`, then `docs/design/instructions.md`.
- Design reference: oxigen.sa (chapter rhythm, mono labels, display type, pixel dithers, progress rail). Brand: `#4f4b63` / `#f04f26`, light theme.
- Verification for any task: `npm run typecheck`, `npm run dev`, check `/` and `/sw`, and `/keystatic` if content layer touched.
