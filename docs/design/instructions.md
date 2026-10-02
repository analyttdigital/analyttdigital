# Task Handoff Instructions — Analytt Digital Landing Redesign

You are an AI agent continuing work on this codebase. Follow this checklist on every task.

## 0. Context (read first, in order)

1. `AGENTS.md` — hard rules and file map
2. `docs/design/plan.md` — milestone status; pick the task from here
3. `README.md` — stack, design system summary, content-editing flow
4. `docs/design/` reference material (if present) — mood/pattern reference only, not a literal template

## 1. Ground rules

- **Stack is fixed:** Next.js 15 Pages Router + `src/`, TypeScript strict, Tailwind 3, Framer Motion, Lenis, Three.js, MDI icons, Keystatic (local). Do not migrate, swap libraries, or add UI dependencies without an explicit request.
- **Design system is fixed, and it is NOT the old one.** The previous oxigen.sa-editorial system (mono labels, zero-radius bordered buttons, hairline dividers, dark chapter bands) is retired — do not reintroduce it, even to "match" old screenshots still floating around the repo or comments. The current system is fluid and continuous: soft rounded surfaces, diffuse shadows, glassmorphic panels, gradient washes, pill buttons/chips, floating UI/media clusters, subtle ambient 3D. When unsure how something should look, favor soft/rounded/layered over hard/flat/bordered, and continuous scroll motion over discrete chaptering.
- **Color tokens only:** `primary`, `accent`, `paper`, `surface`, `ink` — each a full `50`–`950` tint scale in `tailwind.config.ts`. No ad-hoc hex in components.
- **Content layer is untouched by restyling work.** Components never hard-code copy. Defaults go in `src/lib/content/defaults.ts`; live copy comes from Keystatic singletons (`src/content/<locale>/<section>/index.yaml`) merged over defaults at build time. A pure visual-redesign task should not change a `data` shape, an icon name, or a copy string unless the task explicitly says so.
- **Component contract:** shared components take a `data` prop (typed + defaulted) and optional slot-style `classes` props for styling child components. `icon` strings resolve through the shared MDI resolver; media objects resolve through the shared image component. Don't invent parallel patterns.

## 2. Working loop

1. **Scope:** one milestone checkbox (or equivalent) per task. Announce the plan in 1–3 lines before editing.
2. **Implement** following `AGENTS.md` → file map. Smallest change that fulfills the request. For a section restyle, keep the diff to that section's component (+ shared primitives it needs) — don't ripple unrelated sections.
3. **Verify:**
   - `npm run typecheck` — must be clean
    - `npm run dev` — check `/` **and** `/sw/home` (locale content can drift silently)
   - If you touched the content layer, config, icon/media resolvers, or Three.js bootstrapping: `npm run build`, then confirm `/keystatic` loads and saving a section writes `src/content/<locale>/<section>/index.yaml`
   - If you touched motion/3D: sanity-check `prefers-reduced-motion` still degrades gracefully (static fallback, no layout jump)
4. **Report:** what changed, files touched, what you verified, and what you deliberately did not do.
5. **Update `docs/design/plan.md`** — tick the checkbox and add one line under the milestone describing what landed (this is the running changelog for the next agent).

## 3. Typical task recipes

### Restyle an existing section (the common case right now)
- Locate the section in `src/components/sections/`; keep its `data` prop shape and `Sections`/schema entries as-is
- Rebuild layout/visuals per the fluid design system: rounded surfaces, gradient/glass backgrounds, pill buttons, floating media where the reference implies it
- Route new scroll behavior through `Reveal`/`useRevealVariants` or `useScroll`/`useTransform`; add ambient Three.js only if the section is hero-like or explicitly calls for it
- Remove any now-unused oxigen-era primitives the section was using (`.mono-btn`, `.mono-label`, etc.) once nothing references them — don't delete shared primitives that other still-unmigrated sections depend on
- Update `docs/design/plan.md`

### Add a section
- Component in `src/components/sections/`, typed `data` prop, optional `classes` slot prop, compose with `Reveal`
- Defaults (en + sw) in `src/lib/content/defaults.ts`
- Schema factory in `src/lib/keystatic/schemas.ts` + block discriminant option in `pageFields`; no `keystatic.config.ts` change (sections are blocks inside the `pages-<locale>` collections, not singletons)
- Add a member to the `Section` union (`types.ts`); the reader merges sections generically, so no `reader.ts` change is needed
- Add a `type` case in `section-renderer.tsx` — both routes (`/` and `/<locale>/<slug>`) pick it up automatically

### Edit copy
- Prefer `/keystatic` for live copy; edit `defaults.ts` for the shipped baseline (keep en/sw in sync)

### Add a locale
- README "Adding a locale" — 4 steps, all required

### Motion / 3D work
- Reveals via `Reveal` / `useRevealVariants`; scroll-linked via `useScroll`/`useTransform`; prefer continuous morph/cross-fade over hard stagger
- Three.js scenes live in `src/components/three/`, `'use client'`, lazy-mounted, with a static/CSS fallback for reduced motion or failure to init
- Always guard `prefers-reduced-motion`; keep durations 0.5–0.9s, ease `[0.22, 1, 0.36, 1]` unless the effect specifically needs otherwise

## 4. Failure modes to avoid

- Reviving oxigen-era primitives (bordered zero-radius buttons, mono uppercase labels, hard chapter bands) in new or "matching" work
- Ad-hoc hex colors instead of the `primary`/`accent`/`paper`/`surface`/`ink` token scales
- Changing a section's `data` shape or copy while doing a pure visual restyle
- Inlining icon imports or `<img>` tags instead of using the shared icon/media resolvers
- Editing generated YAML under `src/content/<locale>/` (`pages/` for page docs, `layout` for chrome) by hand instead of through the admin UI (unless syncing a structural fix across locales)
- Client-side fetching for section content
- Forgetting the `sw` defaults when adding new fields — the Kiswahili page must never regress to English
- Heavy/blocking Three.js scenes with no fallback, or motion that ignores `prefers-reduced-motion`
- Leaving `console.log` or dead code in shared components

## 5. Escalation

If a request conflicts with the fixed stack/design system, say so explicitly and propose the deviation in a short note before implementing.
