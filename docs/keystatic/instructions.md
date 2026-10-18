# Keystatic — AI agent instructions

Working agreement for any agent picking up Keystatic work in this repo.
Read this file fully before starting a milestone in `plan.md`.

## 0. Read first (every session)

1. `AGENTS.md` — repo non-negotiables (Pages Router, content-layer rules,
   no unprompted build checks or dev servers).
2. `keystatic.config.ts` — collections, singletons, storage, navigation.
3. `src/lib/keystatic/schemas.ts` — schema factories (the only place schemas live).
4. `src/lib/content/reader.ts` + `src/lib/content/types.ts` +
   `src/lib/content/defaults.ts` — read path, prop types, code fallback copy.
5. `src/lib/keystatic/getStaticProps.ts` — how pages/posts get their props.
6. `docs/keystatic/plan.md` — milestone status; update it as you go.

## 1. Milestone workflow (mandatory)

1. Open `plan.md`, pick the next `Not started` milestone in the
   **recommended execution order** (not necessarily numeric order).
2. Flip its status to `In progress` and commit that status flip? No —
   batch it: status flips ride along in the milestone's own commit.
3. Implement the checklist. Keep changes scoped to the milestone; if you
   spot adjacent rot, log it under that milestone's `Notes`, don't fix it.
4. Verify per repo rules: **no `npm run typecheck` / `build` / `lint` and
   no `npm run dev` unless the milestone explicitly requires it or you
   first confirm with the user why it is necessary** (AGENTS.md §5).
   Typecheck is the gate when a check is approved; `next lint` is broken
   in this repo (eslint-config-next 15 vs eslint 9.17.0) — never rely on it.
5. Commit on green, imperative + scoped
   (e.g. `feat(keystatic): add SEO fields to posts`).
6. Document in `plan.md` under that milestone: status → `Done`, a short
   `Commit` line (hash + message + what changed), and any follow-ups in
   `Notes`.
7. If milestones remain `Not started`, start the next one in recommended
   order in the same session. Stop and hand back only when all are `Done`
   or you are blocked (record the blocker in `Notes`).

## 2. Content-layer rules (from AGENTS.md — no exceptions)

- Pages Router under `src/`; never introduce `app/`.
- Components take `data` (typed in `types.ts`, defaulted in `defaults.ts`)
  plus optional `classes` slots. Never hard-code marketing copy in section
  components.
- Schema factories live **only** in `src/lib/keystatic/schemas.ts`.
  Array defaults live in code, not CMS (Keystatic arrays start empty).
- Icon `string`s resolve via `src/lib/icons/resolve-icon.tsx`; media
  `{ src, alt }` objects via `@/components/media/dynamic-image`
  (`MediaSlot` for placeholders) — never inline imports in sections.
- Keystatic reads are build-time only (`getStaticProps`); no client-side
  content fetching.
- Comments explain *why* (Keystatic quirk, merge rule), never *what*.
- Never hand-edit YAML under `src/content/` unless replicating a verified
  fix across locales; live copy is edited in `/keystatic`.

## 3. Known Keystatic 0.6.9 gotchas (learned the hard way)

- Collections only offer `json`/`yaml` formats — post bodies serialize as
  YAML frontmatter + sidecar `<slug>/body.mdoc`, **not** inline markdown.
- `reader.collections['x'].all()` returns `fields.document` values as a
  **lazy loader function**. Always call `.all({ resolveLinkedFiles: true })`
  **and** defensively await function-valued bodies
  (see `resolveBody` in `reader.ts`) — otherwise post pages render an empty
  `<div class="max-w-[68ch]">`.
- Resolved document nodes may carry `undefined` (e.g. `textAlign`), which
  Next rejects in `getStaticProps` props
  (`Error serializing .blogPost.body[0].textAlign`). Deep-strip `undefined`
  (see `stripUndefined` in `reader.ts`) before returning props.
- Empty CMS arrays / empty `{ src }` image refs defer to code defaults
  (`mergeValue`); an empty document body defers to the fallback body.
  SW posts with no body borrow the EN peer's body (`readPost`).
- Upload-backed `fields.image` with no file reads back as `src: null` —
  treat as empty everywhere (`isEmptyImage`).

## 4. `docs/` is gitignored — handle it

`.gitignore` ignores `docs/` (AI-rules line). These two files are the
deliberate exception. Either:

- `git add -f docs/keystatic/plan.md docs/keystatic/instructions.md`
  on the setup commit, or
- narrow the rule (e.g. `docs/*` + `!docs/keystatic/`) so the directory
  persists for future agents.

Whichever you choose, record it in `plan.md` setup notes so the next agent
isn't surprised when `git status` hides their updates.

## 5. Carry-over (uncommitted work at time of writing)

Branch `dev/mobile-first` holds uncommitted changes including the
`reader.ts` lazy-body + `stripUndefined` fix for the empty post body
(`/blog/kenyas-digital-advertising-landscape-in-2025` rendered an empty
body div; fix verified to HTTP 200 with body content). If you touch
`reader.ts`, rebase/merge that work first — do not re-implement it.
