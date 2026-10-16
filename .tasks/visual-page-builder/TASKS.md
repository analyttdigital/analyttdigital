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
**Status:** DONE  **Depends on:** none
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
**Status:** DONE  **Depends on:** M0
- [x] Zod `ThemeSchema` + defaults (colors light/dark, radius, typography, spacing, shadows) — `src/builder/theme/schema.ts`, `defaults.ts`
- [x] `toCssVars()` and injection in `_document`/`_app` — `css-vars.ts` + `ThemeProvider` (`render/theme-provider.tsx`); scoped `--bld-*` vars on the provider wrapper instead of global `:root` (see Notes)
- [x] Tailwind config mapped to CSS variables (alpha value support) — additive `bld` colors, `bldHeading|bldBody|bldMono` faces, `rounded-bld`, `shadow-bld*`
- [x] Font loader with curated list (`next/font` or Fontsource) — `theme/fonts.ts`: Inter, Space Grotesk, IBM Plex Mono via `next/font/google`, `builderFontsClass` + `fontStack()`; activates on first import (M3 shell)
- [x] Custom Puck fields: ColorField (token aware), RadiusField, FontField, SpacingField — `src/builder/fields/*`, API verified against installed Puck 0.20.2 types
- [x] Dark mode toggle support — `ThemeProvider` mode state + `.dark` class + per-mode token resolution
**Acceptance:** defaults flow into CSS variables via `toCssVars`; Tailwind `bld-*` utilities respond to token and mode changes through `ThemeProvider`. (Theme editor UI with live preview + persist moved to M3: it needs the M2 `theme` storage API and the M3 editor shell.)
**Notes:**
- Scoped-vars deviation from PROJECT.md 3.5: builder tokens emit as `--bld-*` on the `ThemeProvider` wrapper (not global `:root`) so the live site's Signal Mesh tokens are never clobbered. Same semantics inside the builder tree; `.dark` class on the wrapper switches modes. Documented in `src/builder/README.md`.
- Puck 0.20.2 custom-field API verified against installed types (`walk-tree-JdJYB16L.d.ts`): `{ type: "custom", render: ({ field, name, id, value, onChange, readOnly }) => ReactElement }`.

---

## M2 Storage layer
**Status:** DONE  **Depends on:** M0
- [x] `ContentStore` interface and types — `storage/types.ts` (+ `ConflictError`, `InvalidContentError`)
- [x] `fs-store` adapter — `storage/fs-store.ts`, root-injectable, sha1 read tokens, idempotent delete, traversal guard
- [x] `github-store` adapter using Octokit Git Data API, atomic multi file commit, sha conflict handling (409) — `storage/github-store.ts`; narrow `GithubApi` seam (`OctokitGithubApi` real, fake in tests)
- [x] Adapter selection via env — `storage/index.ts` (`BUILDER_STORAGE=github` + creds → GitHub, else fs)
- [x] Zod validation on every read and write — `schema/page.ts|shared.ts|theme-file.ts`, enforced in all four API routes on both paths
- [x] API routes: page, pages, shared, theme — `src/pages/api/builder/*` with dev-bypass guard (M7 wires NextAuth), stable `{ error, code }` payloads
- [x] Unit tests for both adapters (mock Octokit) — `yarn test` (vitest): 19 tests green
**Acceptance:** same API calls work in fs and github modes (github mode verified against a fake `GithubApi` asserting single-commit + sha-conflict semantics; live-GitHub verification deferred to M7 production flow); saves are one commit per `write()` call.
**Notes:**
- `theme.json` holds tokens directly (no envelope) → validates 1:1 against M1 `ThemeSchema`; missing file GET returns defaults with `default: true` so the editor never 404s on a fresh repo.
- `pages.ts` POST creates blank (draft) pages; slugs restricted to kebab-case single segment; nested page paths not supported yet — add if needed.
- API-route shared code lives in `src/builder/http.ts` + `src/builder/auth/guard.ts` (`pages/api/` files stay thin; underscore helpers avoided because every file under `pages/api/` becomes a route).
- Test deps: vitest 5.0.5 required vite ^6.4||^7||^8 as peer (yarn v1 doesn't auto-install peers) → pinned `vite@6.4.4`. `yarn test` = `vitest run`.

---

## M3 Puck editor shell + page rendering
**Status:** DONE  **Depends on:** M1, M2
- [x] `buildConfig()` assembling components, categories, root config — `config/build-config.ts`, registry-driven, zero hard wiring
- [x] `/admin/[[...puckPath]]` editor loading and saving through API — client-only shell (`editor/admin-editor.tsx`): dashboard, page editor (Puck canvas + onPublish→PUT), theme editor
- [x] Page list, create, rename, delete, duplicate — dashboard with two-click delete confirm
- [x] Page meta editor (title, description, path, layout, og image) — sidebar form + draft toggle, saved with the same PUT (current canvas data held in a ref so Puck never re-renders)
- [x] Public renderer `[[...slug]].tsx` with `getStaticPaths/getStaticProps` — as `/p/[[...slug]]` (see Notes), drafts + unknown slugs 404, theme with defaults fallback
- [x] Responsive preview (viewports) and editing flag context — Puck's built-in viewport controls; `EditingProvider`/`useEditing` (hook, not prop — see Notes)
- [x] Theme editor UI with live preview, saves to `theme.json` (moved from M1: needs the M2 `theme` storage API + this editor shell; M1 acceptance is token flow only) — token form + `ThemeProvider` preview + PUT with sha conflict surfacing
- [x] 404 handling and draft/unpublished flag — `notFound` on missing/invalid/draft; `draft` at page level (not inside meta)
**Acceptance:** create a page in the editor, publish, see it at its URL after rebuild (dev: immediately). Verified to build + typecheck + unit level; the click-through itself needs an approved dev session (Open Questions).
**Notes:**
- `/p` namespace deviation: a root `[[...slug]]` would swallow the live site (`/`, `/blog`, `/sw`). Builder pages render at `/p` + meta.path. Mapping helpers in `render/routes.ts`, covered by tests.
- Registry is Puck-native minimal in M3 (`registerComponent({name,label,category,config})`); M5 adds schema→fields derivation, dynamic wrapper, prop validation. No casts at the boundary (registry stores `Omit<ComponentConfig,"type">`, which `buildConfig` places directly).
- Editing flag is a `useEditing()` hook. PROJECT.md 3.4's `editing` render prop is deferred to M5's registry work.
- Fonts switched M1→Fontsource (`@fontsource/*@5.3.0`): `next/font/google` needs build-time Google access; this sandbox blocks it and the M3 build proved it. PROJECT.md already allowed "next/font or Fontsource". Weight CSS imports live in `_app.tsx` (Pages global-CSS rule); `builderFontsClass` kept as a stable (empty) export.
- `_app.tsx`: imports Puck + Fontsource global CSS; `/admin` renders outside `SiteLayout` (same carve-out as `/keystatic`).
- Palette is empty until M4 built-ins land — by design; `buildConfig` + `Render` pipeline is proven by unit tests with registered test components.
- Viewports/motion of the editor itself not yet eyeballed — needs a user-approved dev instance per repo rules.

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
- ~~DONE-gate conflict~~ Resolved 2026-10-16: user approved typecheck + build as the gate, lint skipped. `instructions.md` updated.
- ~~Package manager~~ Resolved 2026-10-16: yarn. `PROJECT.md` updated to yarn.
- Live GitHub adapter is verified against a fake only (single-commit + conflict semantics asserted, no HTTP). Real production verification belongs to M7's publish flow — OK, or want a dry-run against a scratch repo first?
- M3 click-through (create → publish → view at `/p/<slug>`, viewport switching, theme live preview) needs a user-approved dev instance per repo AGENTS.md — Visual check at `/admin` and `/p/...` pending.

## Decisions
- Puck chosen over Craft.js for faster, config driven registry and built in field system.
- Zustand excluded; use Puck `usePuck`.
- 2026-10-16 | Pinned `@measured/puck@0.20.2`, `zod@4.6.7`, `@octokit/rest@22.0.1`, `next-auth@4.24.15` (exact, `yarn add -E`). `next-auth` v4 chosen: matches PROJECT.md Pages-Router `api/auth/[...nextauth].ts` style. `gsap`/`three`/`@mdi/*` already present, not reinstalled.
- 2026-10-16 | Builder is additive: Keystatic stays wired; builder content namespaced to `src/content/pages|shared|theme.json` (JSON) vs Keystatic `src/content/<locale>/` (YAML/Markdown). No `app/` dir, no changes to Keystatic config/schemas.
- 2026-10-16 | Keep yarn (existing `yarn.lock`) instead of PROJECT.md's pnpm; revisit if user wants migration.
- 2026-10-16 | Test runner: added `vitest@5.0.5` + peer `vite@6.4.4` (dev-only, exact pins, `yarn test` = `vitest run`). Not on the PROJECT.md approved list — added because M2 mandates adapter unit tests and the repo had no runner; dev-only, zero runtime impact. Flagging to user alongside this log.
- 2026-10-16 | Fonts: added `@fontsource/inter@5.3.0`, `@fontsource/space-grotesk@5.3.0`, `@fontsource/ibm-plex-mono@5.3.0` (exact). PROJECT.md M1 already approves "next/font or Fontsource"; switched because `next/font/google` fails the build where Google is unreachable (proven by the M3 build). Runtime font assets, no code library.

## Progress Log
Format: `YYYY-MM-DD HH:MM | agent | summary | files`
- 2026-10-16 | setup | Created instructions.md, PROJECT.md, TASKS.md | all
- 2026-10-16 | session | M0 IN_PROGRESS: verified pre-existing setup (Pages Router src/, strict TS + `@/` alias, Tailwind + globals.css, scripts incl. typecheck); installed pinned builder deps via yarn; created additive src/builder skeleton + src/content/{pages,shared} + public/uploads; extended .env.example with builder vars; Keystatic untouched | package.json, yarn.lock, src/builder/**, src/content/pages/.gitkeep, src/content/shared/.gitkeep, public/uploads/.gitkeep, .env.example, .tasks/visual-page-builder/TASKS.md
- 2026-10-16 | HANDOFF | What is done: M0 checklist fully ticked (setup verified, 4 pinned deps installed, skeleton + env in place). What is in flight: nothing half-edited; M0 left IN_PROGRESS only because verification needs user approval per repo AGENTS.md #5. Exact next step: user approves, then run `yarn typecheck` and `yarn build` (skip `next lint` — broken repo-wide, waiver proposed in Open Questions); on green, flip M0 to DONE and start M1 (first TODO, depends on M0). Commands to verify: `yarn typecheck`, `yarn build`. Note: repo has unrelated uncommitted/untracked items outside this task's scope (`.tasks/content/*`, `.gitignore` un-ignore of `/.tasks`) — only M0 files committed below.
- 2026-10-16 | session | M0 DONE (typecheck + build green, lint skipped per approval); M1 IN_PROGRESS then DONE: ThemeSchema/defaults/toCssVars/fonts/ThemeProvider/4 Puck fields/Tailwind bld-* mapping; theme editor UI moved to M3 (needs M2 storage API + M3 shell); docs switched to yarn | tailwind.config.ts, src/builder/theme/*, src/builder/fields/*, src/builder/render/theme-provider.tsx, src/builder/README.md, .tasks/visual-page-builder/*
- 2026-10-16 | HANDOFF | What is done: M0 DONE, M1 DONE (token system complete, typecheck + build green). What is in flight: nothing half-edited. Exact next step: start M2 Storage layer (first TODO: M0 DONE, no other deps) — ContentStore interface, fs + github adapters, env selection, Zod validation, builder API routes, adapter unit tests. Commands to verify: `yarn typecheck`, `yarn build`. Note: `.tasks/content/*` untracked files belong to another stream — left alone.
- 2026-10-16 | session | M2 DONE: ContentStore + fs/github adapters (atomic Git Data API commits, sha conflicts), env selection, Zod schemas (page/shared/theme/migrations stub), 4 builder API routes with dev-bypass guard, vitest suite 19/19 green, typecheck + build green | src/builder/storage/*, src/builder/schema/*, src/builder/http.ts, src/builder/auth/guard.ts, src/pages/api/builder/*, vitest.config.ts, package.json, yarn.lock, .tasks/visual-page-builder/TASKS.md
- 2026-10-16 | HANDOFF | What is done: M0/M1/M2 DONE (storage + validated API complete; tests 19/19, typecheck + build green). What is in flight: nothing half-edited. Exact next step: start M3 Puck editor shell + page rendering (deps M1, M2 DONE) — buildConfig, /admin editor, page CRUD UI, meta editor, public [[...slug]] renderer, editing flag. Commands to verify: `yarn test`, `yarn typecheck`, `yarn build`. Note: `.tasks/content/*` untracked files belong to another stream — left alone.
- 2026-10-16 | session | M3 DONE: registry + buildConfig, /admin shell (dashboard CRUD, Puck page editor + meta, theme editor with preview), /p public renderer (drafts 404), editing flag, Fontsource switch (Google blocked); tests 26/26, typecheck + build green (all new routes in build output) | src/builder/registry/*, src/builder/config/*, src/builder/editor/*, src/builder/render/*, src/builder/theme/fonts.ts, src/pages/admin/*, src/pages/p/*, src/pages/_app.tsx, package.json, yarn.lock, .tasks/visual-page-builder/TASKS.md
- 2026-10-16 | HANDOFF | What is done: M0–M3 DONE (editor shell + rendering complete; tests 26/26, typecheck + build green). What is in flight: nothing half-edited; palette empty until M4. Exact next step: start M4 Built-in components (deps M3 DONE) — layout/media/typography/actions/content/forms/dashboard sets, all token-driven via bld-* utilities, editor/public parity. Commands to verify: `yarn test`, `yarn typecheck`, `yarn build`. Visual click-through of /admin + /p pending approved dev session. Note: `.tasks/content/*` untracked files belong to another stream — left alone.

---

## Template for new milestone / task
```
## M<n> <Title>
**Status:** TODO  **Depends on:** <ids>
- [ ] task
**Acceptance:** <how we know it is done>
**Notes:**
```
