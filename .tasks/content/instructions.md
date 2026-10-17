# Agent Handoff — Content Pages Rollout

Read this first, then open `task.md` and take the first milestone marked `not started`.

## Context in 60 seconds

- Next.js 15 Pages Router, `src/pages`, TS strict, Tailwind 3, Framer Motion + Lenis, MDI icons, Keystatic local storage.
- Content layer: types `src/lib/content/types.ts`, defaults `src/lib/content/defaults.ts` (en + sw), schemas `src/lib/keystatic/schemas.ts`, reader `src/lib/content/reader.ts`, renderer `src/components/sections/section-renderer.tsx`, shared props `src/lib/keystatic/getStaticProps.ts`.
- Source copy: `docs/content/*.md` + `docs/content/services/*.md` (em dashes removed except `---` fences/rules; `docs/content/services/` contents were not provided, M0 inventories them).
- Style reference: `DESIGN.md` (homepage section language). Component contract: `data` + `classes`, icons via `resolve-icon`, media via `dynamic-image`/`MediaSlot`, no hardcoded copy in components.

## Session loop

1. Read `task.md`, pick first `not started` milestone, flip it to `(in progress)`.
2. Do the checkboxes in order; keep edits small and scoped.
3. Update `task.md` checkboxes + status as you finish (`done` when all boxes ticked).
4. If milestones remain, immediately start the next `not started` one in the same session. Do not stop to ask.
5. If blocked (missing copy, ambiguity), record it in `task.md` under the milestone and continue with the next unblocked item.

## Rules

- Pages Router only; never add `app/`.
- Never hardcode marketing copy in section components; defaults in `defaults.ts` (both locales).
- Reuse `iconField`/`imageField`, `ctaFields` shape; array defaults live in code, not CMS.
- `use client` only for browser APIs/hooks; prefer `GsapReveal`/`ScrollSection` for motion.
- Never edit `src/content/**` YAML by hand except cross-locale fix replication.
- Do not run `typecheck`/`build`/`lint` unless user explicitly approves; `lint` is broken. Never start/stop dev server unprompted.

## Done means

- `task.md` updated, new sections render from defaults with zero CMS content, `/keystatic` edits persist as YAML, both locales complete.
