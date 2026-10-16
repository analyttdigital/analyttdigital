# Tasks and Milestones

Legend: `TODO` | `IN_PROGRESS` | `BLOCKED` | `DONE` | `DROPPED`
Update this file continuously. See `instructions.md` for rules.

## Overview
| ID | Milestone | Status | Depends on |
|---|---|---|---|
| M0 | Project setup | TODO | none |
| M1 | Theme system | TODO | M0 |
| M2 | Storage layer (fs + GitHub) | TODO | M0 |
| M3 | Puck editor shell + page rendering | TODO | M1, M2 |
| M4 | Built in components | TODO | M3 |
| M5 | Custom component registry | TODO | M3 |
| M6 | Shared elements (header, footer, layouts) | TODO | M3, M4 |
| M7 | Auth + production publish flow | TODO | M2, M3 |
| M8 | Advanced components (GSAP, three.js examples) | TODO | M5 |
| M9 | Polish, media, docs, tests | TODO | M4 to M7 |

---

## M0 Project setup
**Status:** IN_PROGRESS  **Depends on:** none
- [x] Next.js (Pages Router, `src/`), TypeScript strict, `@/` alias — pre-existing, verified (tsconfig strict + `@/*`, src/pages, no `app/`)
- [x] Tailwind configured, `globals.css` — pre-existing, verified
- [x] Install approved libs (see PROJECT.md section 2), pin Puck version — `@measured/puck@0.20.2`, `zod@4.6.7`, `@octokit/rest@22.0.1`, `next-auth@4.24.15`, all exact-pinned via `yarn add -E`
- [x] Scripts: dev, build, typecheck, lint; ESLint + Prettier — pre-existing in package.json (plus `start`)
- [x] Create folder skeleton from PROJECT.md 3.2 and sample `src/content` — additive `src/builder/*`, `src/content/pages|shared`, `public/uploads` (`.gitkeep`); Keystatic `src/content/<locale>/` untouched; sample content = pre-existing Keystatic content, builder samples land in M1/M2
- [x] `.env.example` with all variables — Keystatic block kept, builder vars appended (`BUILDER_*`, `GITHUB_*`, `NEXTAUTH_*`)
**Notes:**
- M0 is existing-project adaptation: Next.js/Tailwind/scripts/sample-content items were already satisfied; verified rather than recreated.
- Builder JSON (`src/content/pages|shared`, `src/content/theme.json`) sits beside Keystatic YAML (`src/content/<locale>/`) — similar names, disjoint paths. Boundary documented in `src/builder/README.md`.
- Verification (typecheck/build) NOT run: repo AGENTS.md non-negotiable #5 forbids unprompted checks and requires user confirmation; also `next lint` is broken repo-wide (rushstack patch vs eslint 9.17.0), so the "lint passes" DONE criterion needs a waiver (see Open Questions). M0 stays IN_PROGRESS until checks are approved + green.

---

## M1 Theme system
**Status:** TODO  **Depends on:** M0
- [ ] Zod `ThemeSchema` + defaults (colors light/dark, radius, typography, spacing, shadows)
- [ ] `toCssVars()` and injection in `_document`/`_app`
- [ ] Tailwind config mapped to CSS variables (alpha value support)
- [ ] Font loader with curated list (`next/font` or Fontsource)
- [ ] Custom Puck fields: ColorField (token aware), RadiusField, FontField, SpacingField
- [ ] Theme editor UI with live preview, saves to `theme.json`
- [ ] Dark mode toggle support
**Acceptance:** changing a token in the theme editor restyles the canvas instantly and persists to `theme.json`.
**Notes:**

---

## M2 Storage layer
**Status:** TODO  **Depends on:** M0
- [ ] `ContentStore` interface and types
- [ ] `fs-store` adapter
- [ ] `github-store` adapter using Octokit Git Data API, atomic multi file commit, sha conflict handling (409)
- [ ] Adapter selection via env
- [ ] Zod validation on every read and write
- [ ] API routes: page, pages, shared, theme
- [ ] Unit tests for both adapters (mock Octokit)
**Acceptance:** same API calls work in fs and github modes; a save in github mode produces one commit on the configured branch.
**Notes:**

---

## M3 Puck editor shell + page rendering
**Status:** TODO  **Depends on:** M1, M2
- [ ] `buildConfig()` assembling components, categories, root config
- [ ] `/admin/[[...puckPath]]` editor loading and saving through API
- [ ] Page list, create, rename, delete, duplicate
- [ ] Page meta editor (title, description, path, layout, og image)
- [ ] Public renderer `[[...slug]].tsx` with `getStaticPaths/getStaticProps`
- [ ] Responsive preview (viewports) and editing flag context
- [ ] 404 handling and draft/unpublished flag
**Acceptance:** create a page in the editor, publish, see it at its URL after rebuild (dev: immediately).
**Notes:**

---

## M4 Built in components
**Status:** TODO  **Depends on:** M3
- [ ] Layout: Section, Container, Row, Column, Grid, Spacer, Divider
- [ ] Typography: Heading, Text, RichText, Quote
- [ ] Actions: Button, Link
- [ ] Media: Image, Video, Icon (MDI picker)
- [ ] Content: List, Table, Card, Accordion, Tabs
- [ ] Forms: Form, Input, Textarea, Select, Checkbox, Submit (action endpoint configurable)
- [ ] Dashboard: Stat card, simple chart placeholder
- [ ] All use tokens; responsive props (per breakpoint where relevant)
**Acceptance:** each component has schema, defaults, fields, renders identically in editor and public page.
**Notes:**

---

## M5 Custom component registry
**Status:** TODO  **Depends on:** M3
- [ ] `registerComponent()` API with Zod schema to Puck fields derivation
- [ ] Dynamic/client only wrapper option (`next/dynamic`, `ssr:false`)
- [ ] Props validation with fallback to defaults
- [ ] Categories and icons in the palette
- [ ] Example registered component in `src/builder/custom`
- [ ] Docs section "How to add a component" in PROJECT.md
**Acceptance:** adding one file in `custom/` and one register call makes a component appear in the palette with no core edits.
**Notes:**

---

## M6 Shared elements
**Status:** TODO  **Depends on:** M3, M4
- [ ] Header and footer stored as shared docs
- [ ] Global document switcher in the editor
- [ ] `layouts.json` and layout selection per page
- [ ] Renderer wraps pages with chosen layout
- [ ] Optional announcement bar and dashboard shell layout (sidebar + topbar)
**Acceptance:** editing the header once updates every page using that layout.
**Notes:**

---

## M7 Auth + production publish flow
**Status:** TODO  **Depends on:** M2, M3
- [ ] NextAuth GitHub provider, allowlist and repo permission check
- [ ] Protect `/admin` and `/api/builder/*`
- [ ] Production editor reads from GitHub
- [ ] Publish commits to branch; optional draft branch + PR mode
- [ ] Optional on demand revalidation after commit
- [ ] Conflict UI (reload, show diff summary)
**Acceptance:** on a deployed build, an authorized user edits a page, publishes, and the redeployed site shows the change.
**Notes:**

---

## M8 Advanced components
**Status:** TODO  **Depends on:** M5
- [ ] GSAP reveal/scroll wrapper component (uses `gsap.context`, cleanup, editing aware)
- [ ] three.js scene component (dynamic import, resize and dispose handling)
- [ ] Chart component (library to be confirmed with user)
**Notes:**

---

## M9 Polish, media, docs, tests
**Status:** TODO  **Depends on:** M4 to M7
- [ ] Media upload (commit to `public/uploads`) and picker
- [ ] Undo/redo and keyboard shortcuts verified
- [ ] SEO fields, sitemap generation from content
- [ ] E2E smoke tests (Playwright)
- [ ] README with setup, env, deploy guide
**Notes:**

---

## Open Questions
- DONE-gate conflict: `instructions.md` requires `pnpm typecheck` + `pnpm lint` + build for DONE, but repo AGENTS.md #5 forbids unprompted checks (confirmation required) and records `next lint` as broken (rushstack patch rejects eslint 9.17.0; `next.config.js` sets `eslint.ignoreDuringBuilds`). Proposal: gate milestones on `typecheck` + `build` only, with checks run after user approval. Awaiting user confirm.
- Package manager: PROJECT.md says pnpm, repo uses yarn (`yarn.lock` present; pnpm also installed on this machine). M0 installed via yarn to avoid lockfile churn — OK to standardize on yarn, or migrate to pnpm later?

## Decisions
- Puck chosen over Craft.js for faster, config driven registry and built in field system.
- Zustand excluded; use Puck `usePuck`.
- 2026-10-16 | Pinned `@measured/puck@0.20.2`, `zod@4.6.7`, `@octokit/rest@22.0.1`, `next-auth@4.24.15` (exact, `yarn add -E`). `next-auth` v4 chosen: matches PROJECT.md Pages-Router `api/auth/[...nextauth].ts` style. `gsap`/`three`/`@mdi/*` already present, not reinstalled.
- 2026-10-16 | Builder is additive: Keystatic stays wired; builder content namespaced to `src/content/pages|shared|theme.json` (JSON) vs Keystatic `src/content/<locale>/` (YAML/Markdown). No `app/` dir, no changes to Keystatic config/schemas.
- 2026-10-16 | Keep yarn (existing `yarn.lock`) instead of PROJECT.md's pnpm; revisit if user wants migration.

## Progress Log
Format: `YYYY-MM-DD HH:MM | agent | summary | files`
- 2026-10-16 | setup | Created instructions.md, PROJECT.md, TASKS.md | all
- 2026-10-16 | session | M0 IN_PROGRESS: verified pre-existing setup (Pages Router src/, strict TS + `@/` alias, Tailwind + globals.css, scripts incl. typecheck); installed pinned builder deps via yarn; created additive src/builder skeleton + src/content/{pages,shared} + public/uploads; extended .env.example with builder vars; Keystatic untouched | package.json, yarn.lock, src/builder/**, src/content/pages/.gitkeep, src/content/shared/.gitkeep, public/uploads/.gitkeep, .env.example, .tasks/visual-page-builder/TASKS.md
- 2026-10-16 | HANDOFF | What is done: M0 checklist fully ticked (setup verified, 4 pinned deps installed, skeleton + env in place). What is in flight: nothing half-edited; M0 left IN_PROGRESS only because verification needs user approval per repo AGENTS.md #5. Exact next step: user approves, then run `yarn typecheck` and `yarn build` (skip `next lint` — broken repo-wide, waiver proposed in Open Questions); on green, flip M0 to DONE and start M1 (first TODO, depends on M0). Commands to verify: `yarn typecheck`, `yarn build`. Note: repo has unrelated uncommitted/untracked items outside this task's scope (`.tasks/content/*`, `.gitignore` un-ignore of `/.tasks`) — only M0 files committed below.

---

## Template for new milestone / task
```
## M<n> <Title>
**Status:** TODO  **Depends on:** <ids>
- [ ] task
**Acceptance:** <how we know it is done>
**Notes:**
```
