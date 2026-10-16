# Visual Page Builder

Git-backed visual CMS for landing pages and dashboards, additive to the
existing Keystatic site. Pages are edited visually in `/admin` (Puck), stored
as JSON in the repo, and published by committing — the host redeploys.

Keystatic stays wired. Builder content is JSON under `src/content/` (`pages/`,
`shared/`, `theme.json`); Keystatic content is YAML/Markdown under
`src/content/<locale>/`. The two trees never overlap.

## Quickstart

```bash
yarn install
cp .env.example .env   # defaults work for local dev (BUILDER_STORAGE=fs)
yarn dev               # site at /, editor at /admin, builder pages at /p/…
```

No secrets needed locally: auth is bypassed with `BUILDER_DEV_BYPASS_AUTH=true`
(the `.env.example` default). Create a page at `/admin` (it starts as a draft),
publish, view it at `/p/<slug>`.

## Environment

| Variable | Dev | Production |
|---|---|---|
| `BUILDER_STORAGE` | `fs` | `github` |
| `GITHUB_OWNER` / `GITHUB_REPO` | — | content repo coordinates |
| `BUILDER_BRANCH` | — | base branch (`main`) |
| `BUILDER_DRAFT_BRANCH` | — | optional: commit here + open/keep a PR instead |
| `GITHUB_TOKEN` | — | fine-grained PAT or app token, `contents:write` |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | — | auth secret + URL |
| `GITHUB_ID` / `GITHUB_SECRET` | — | OAuth app credentials |
| `BUILDER_ALLOWED_USERS` | — | comma-separated GitHub logins (else push permission is checked) |
| `BUILDER_DEV_BYPASS_AUTH` | `true` | `false` / unset |

## Content model

- `src/content/pages/<slug>.json` — `{ schemaVersion: 1, meta: { title, description, path, layout, ogImage }, puck: { root, content, zones }, draft }`.
- `src/content/shared/<doc>.json` — header, footer, announcement, sidebar… any kebab-case doc; same Puck shape.
- `src/content/shared/layouts.json` — `{ layouts: [{ id, name, header, footer, announcement, sidebar, shell }] }`. `shell` is `page` (linear) or `dashboard` (sidebar + topbar + main).
- `src/content/theme.json` — design tokens (colors light/dark, radius, typography, spacing, shadows).
- `public/uploads/*` — uploaded media, referenced by URL.

Every read and write validates against the Zod schemas in `src/builder/schema/`.
Stale `sha` writes get HTTP 409 — the editor offers to load the latest.

## Routes

| Route | Purpose |
|---|---|
| `/admin`, `/admin/page/<slug>`, `/admin/shared/<doc>`, `/admin/layouts`, `/admin/theme` | editor (auth-gated in production) |
| `/p`, `/p/<slug>` | published builder pages (drafts 404) |
| `/api/builder/pages`, `/page`, `/shared`, `/theme`, `/media` | validated content API |
| `/api/builder/revalidate` | on-demand refresh of `/p/*` after publish |
| `/api/auth/[...nextauth]` | GitHub OAuth |
| `/sitemap.xml` | published builder pages |

## Adding a component

One file in `src/builder/custom/`, one `registerComponent` call — see
`PROJECT.md` §6 and `custom/callout.tsx`. The palette, editor, and public
renderer all read from the same registry, so parity is structural.

## Publish flow

Editor Publish → `PUT /api/builder/*` → Zod validation → store write → commit
to `BUILDER_BRANCH` (or the draft branch + PR) → host redeploys → editor
revalidates `/p/*`. In production the editor reads from GitHub, never the
built bundle.

## Verify

```bash
yarn test && yarn typecheck && yarn build
```

(Lint is skipped repo-wide: `next lint` is broken on this stack; typecheck is
the gate. Visual checks of `/admin` and `/p/…` need an approved dev session.)
