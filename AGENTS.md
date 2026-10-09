# AGENTS.md — AI ruleset for this repo

Guidance for AI coding agents (and humans pairing with them) working in this project. Read this file fully before making changes.

## Project in one paragraph

Next.js 15 **Pages Router** app in `src/pages`, TypeScript strict, Tailwind 3, Framer Motion + Lenis for motion, MDI icons, Keystatic (local storage) for content. It is a marketing landing page for **Analytt Digital**.

The visual system is being redefined — no visual/styling rules live in this file. Do not invent or reimpose styling rules (grounds, panels, tokens, type, geometry, motion, graphics effects) until the new system lands.

## Non-negotiables

1. **Pages Router, `src/` directory.** Do not introduce `app/` or suggest an App Router migration in drive-by PRs. Keystatic stays wired for Pages (`src/pages/api/keystatic/[...params].ts`, `src/pages/keystatic/[...params].tsx`).
2. **Content comes from the content layer, unchanged.** Components receive section content as props typed in `src/lib/content/types.ts`. Never hard-code marketing copy inside section components; defaults stay in `src/lib/content/defaults.ts` (both locales). Do not change a section's content shape unless a task explicitly asks for new fields.
3. **Component contract — `data` + `slots`.** Every shared/reusable component:
   - Accepts a `data` prop, typed and defaulted from `src/lib/content/defaults.ts`, carrying its dynamic content (text, icon names, media refs, etc.).
   - Accepts optional slot-style props (e.g. `classes: { childA: "bg-surface" }`) to pass overrides down into child shared components without prop-drilling every variant.
   - May accept ordinary React `ComponentProps` (e.g. `className`, `id`) alongside `data`/`classes`.
   - Resolves `icon` string values (e.g. `"account-arrow-right"`) to MDI SVG icons through a single shared resolver (see file map) — never inline arbitrary icon imports in a section.
   - Resolves `image`/media objects (`{ url, alt, ... }`) through a shared media component so cropping, blur-up, and fallback behavior stay consistent.
4. **Keystatic conventions.** `layout-<locale>` singletons (shared chrome) + `pages-<locale>` collections (page documents with ordered section blocks; one block type per section, e.g. `hero`, `work`). Stored under `src/content/<locale>/pages/` and `src/content/<locale>/layout`. Schema factories live only in `src/lib/keystatic/schemas.ts`. Array defaults belong in code defaults, not CMS (Keystatic arrays start empty). Icon-name and media fields in schemas are plain strings/objects — resolution to SVG/`<Image>` happens in components, not in Keystatic.
5. **Build checks only on request.** Do not run `npm run typecheck`, `npm run build`, or `npm run lint` unprompted. Only run a build check when: (a) the user explicitly asks for it, or (b) it is absolutely necessary — in which case confirm with the user first and explain why before running anything. When a check is approved, typecheck is the gate (`npm run lint` is currently broken in this repo — `eslint-config-next` 15's rushstack patch rejects the installed eslint 9.17.0).
6. **No client-side data fetching for content.** Sections render from `getStaticProps`. Keystatic reads are build-time only.

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
| Smooth scroll                     | `src/components/smooth-scroll.tsx`                                |

## Conventions

- `'use client'` only on files using browser APIs or hooks (`smooth-scroll`, `site-nav`, and any section with interactive state). Section components with Framer Motion `whileInView` may stay server components in Pages Router.
- Where media belongs but none exists yet, render `MediaSlot` from `@/components/media/dynamic-image` — never a raw `<img>`.
- Prefer editing an existing section over adding a near-duplicate one.
- Comments explain *why* (Keystatic quirk, timing choice), never *what*.
- Commit style: imperative, scoped (`feat: add industries section`, `refactor: merge section readers`).

## Verify before handing back

Do not run build checks or start/stop a dev server unprompted.

- Build checks (`npm run typecheck`, `npm run build`, `npm run lint`) run only when: (a) the user explicitly asks for one, or (b) it is absolutely necessary — in which case confirm with the user first and explain why before running anything.
- Confirm with the user before starting or terminating any dev instance (`npm run dev`); never start or stop one on your own.
- When a check is approved, typecheck is the gate. For content-layer or config changes also run `npm run build` if approved, then check `/keystatic` loads and saving a section writes YAML under `src/content/<locale>/`. Visually check affected sections at `/` and `/sw/home` only via a user-approved dev instance.

## Common tasks, step by step

**Add a homepage section** — create component (accept `data` + optional `classes`), add defaults (en + sw), add schema factory + block discriminant in `pageFields` (`schemas.ts`), add member to the `Section` union (`types.ts`), add a case in `section-renderer.tsx` (the reader merges sections generically — no reader change needed).

**Change copy** — default copy lives in `src/lib/content/defaults.ts`; live copy is edited in `/keystatic` and lands under `src/content/<locale>/` (`pages/` for page documents, `layout` for chrome). Never edit the YAML by hand unless replicating a fix across locales.

**Add a locale** — see README "Adding a locale".
