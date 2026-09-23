# Task Handoff Instructions — Analytt Digital Landing

You are an AI agent continuing work on this codebase. Follow this checklist on every task.

## 0. Context (read first, in order)

1. `AGENTS.md` — hard rules and file map
2. `docs/design/plan.md` — milestone status; pick the task from here
3. `README.md` — stack + content-editing flow

## 1. Ground rules

- **Stack is fixed:** Next.js 15 Pages Router + `src/`, TypeScript strict, Tailwind 3, Framer Motion, Lenis, Keystatic (local). Do not migrate, swap libraries, or add UI dependencies without an explicit request.
- **Design system is fixed:** oxigen.sa's editorial system with Analytt branding — ink `#4f4b63`, ember `#f04f26`, light theme; mono labels, zero-radius bordered buttons, display headlines, serif body, hairlines, dithered pixel canvases, dark chapter bands. When unsure how something should look, mirror the reference's pattern.
- **Content layer:** components never hard-code copy. Defaults go in `src/lib/content/defaults.ts`; live copy comes from Keystatic singletons (`src/content/<locale>/<section>/index.yaml`) merged over defaults at build time.

## 2. Working loop

1. **Scope:** one milestone checkbox (or equivalent) per task. Announce the plan in 1–3 lines before editing.
2. **Implement** following `AGENTS.md` → file map. Smallest change that fulfills the request.
3. **Verify:**
   - `npm run typecheck` — must be clean
   - `npm run dev` — check `/` **and** `/sw` (locale content can drift silently)
   - If you touched the content layer, config, or pages: `npm run build`, then confirm `/keystatic` loads and saving a section writes `src/content/<locale>/<section>/index.yaml`
4. **Report:** what changed, files touched, what you verified, and what you deliberately did not do.
5. **Update `docs/design/plan.md`** — tick the checkbox and add one line under the milestone describing what landed (this is the running changelog for the next agent).

## 3. Typical task recipes

### Add a section
- Component in `src/components/sections/`, typed prop `sections?.<name>`, compose with `Reveal`
- Defaults (en + sw) in `src/lib/content/defaults.ts`
- Schema factory in `src/lib/keystatic/schemas.ts`; singletons `<name>-en`/`<name>-sw` in `keystatic.config.ts` + admin nav
- Add key to `Sections` (`types.ts`) and `readSections` keys (`reader.ts`)
- Compose in `src/pages/index.tsx` and `src/pages/[locale]/index.tsx`
- Optional nav-rail tick: `CHAPTERS` in `src/components/layout/site-layout.tsx`

### Edit copy
- Prefer `/keystatic` for live copy; edit `defaults.ts` for the shipped baseline (keep en/sw in sync)

### Add a locale
- README "Adding a locale" — 4 steps, all required

### Motion work
- Reveals via `Reveal` / `useRevealVariants`; scroll-linked via `useScroll`/`useTransform`
- Always guard reduced motion; keep durations 0.5–0.9s, ease `[0.22, 1, 0.36, 1]`

## 4. Failure modes to avoid

- Editing generated YAML by hand instead of through the admin UI (unless syncing a structural fix across locales)
- Introducing rounded corners, shadows on cards, or new accent colors (breaks design fidelity)
- Client-side fetching for section content
- Forgetting the `sw` defaults when adding new fields — the Kiswahili page must never regress to English
- Leaving `console.log` or dead code in shared components

## 5. Escalation

If a request conflicts with the fixed stack/design system, say so explicitly and propose the deviation in a short note before implementing.
