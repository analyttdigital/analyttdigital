# Keystatic — milestone plan

Tracker for Keystatic-related work. Each milestone: `Status`, `Checklist`,
`Notes`, and (once done) a `Commit` line. Agents: follow
`docs/keystatic/instructions.md`, commit per milestone, document the commit
here, then pick up the next `Not started` milestone in **recommended
execution order**.

Original request numbered items 1, 2, 3, 4, 6, 7, 8 (no #5) — kept below as
K1–K4, K6–K8 so references stay stable.

**Recommended execution order**: K6 → K1 → K3 → K2 → K7 → K8 → K4 → K5.
K6 shrinks the surface first (no SW variants to migrate/audit); K1+K3
settle the content model before K2 seeds pages into it; K7 audits migrated
content; K8 crawls final routes; K4/K5 are infra last (K5 may reshape the
read path — keep it last).

**Setup note:** `docs/` is gitignored (see instructions §4). Force-add
these files (`git add -f docs/keystatic/`) or narrow the ignore rule
before the first milestone commit.

---

## K1 — Featured-image previews + page featured image

Status: Done.

Goal: (a) a stored post featured image previews in the Keystatic edit UI
without re-upload; (b) page documents gain an editable featured image.

Checklist:
- [x] Reproduce: post with stored `featuredImage.src` shows blank preview.
  Confirmed in `/keystatic` on `kenyas-digital-advertising-landscape-in-2025`:
  the UI fetched the image blob (200) and created an object URL, but the
  rendered `<img>` was `naturalWidth: 0`.
- [x] Root-cause: ingestion pipe, not the nested object. The Pages Router
  API bridge (`src/pages/api/keystatic/[...params].ts`) read the Keystatic
  handler response with `response.text()`. The local `blob` endpoint returns
  raw bytes, so every invalid UTF-8 byte became U+FFFD — the preview blob
  decoded to a corrupt image. (Nested `fields.image` under `fields.object`
  resolves fine: directory + slug + filename path matched.)
- [x] Fix preview without breaking reader shape `{ src, alt }`: send
  `Buffer.from(await response.arrayBuffer())` from the API bridge; reader
  shape untouched. Post/story inline images benefit from the same fix.
- [x] Add `featuredImage` to `pageFields`, `PageDoc`, `readPage` merge,
  defaults (empty = hidden); render as absolute `og:image` (+`og:image:alt`)
  in `PageView` and the homepage head. No visible hero image yet.
- [x] Verify: `/keystatic` post form renders the stored 2560×1709 image
  (no re-upload); page "Add" form shows the upload field; a temporary CMS
  page (`src/content/pages/home.yaml`, written/deleted through the Keystatic
  `update` endpoint — not hand-edited) rendered
  `<meta property="og:image" content="https://analyttdigital.com/media/uploads/…">`
  and reverted to no tag once deleted; `/blog/…` + `/about-us` still 200;
  `npm run typecheck` exit 0.

Notes:
- Page merge rule: empty/absent CMS `featuredImage` defers to the code
  default; every page default is `noImage` (`{ src: "", alt: "" }`), so an
  empty image hides `og:image`. A page entry with empty `sections` still
  renders its code-default page wholesale (pre-existing behaviour) — K2's
  seeded pages always carry sections.
- Untracked `probe-read.mjs` + `src/content/_probe/` predate this milestone;
  left untouched and uncommitted (not mine to discard).
- `src/content/pages/` now exists but is empty (probe deleted).

Commit: `f06e816` feat(keystatic): fix featured-image previews, add page
featured image (8 files, +91/−12; binary-safe blob bridge, page
`featuredImage` through schema/types/reader/defaults, og:image heads).

## K2 — Migrate default content to Keystatic pages

Status: Done.

Goal: every code-default page in `defaults[locale].pages` exists as an
editable Keystatic entry; routes render identically.

Checklist:
- [x] Enumerated `Object.keys(defaults.en.pages)` (13 EN page slugs).
- [x] Seeded one YAML per slug under `src/content/pages/` with the retained
  `scripts/seed-pages.mjs` helper, including upload-backed copies of legacy
  image assets.
- [x] Verified the reader-level rendered contract against code defaults:
  `node scripts/seed-pages.mjs --check` reports all 13 pages with zero parity
  failures. The check compares copied image bytes and ignores Keystatic's
  unused alternate-variant field defaults.
- [ ] Confirm `/keystatic` lists + edits each page; saves round-trip (requires
  a user-approved dev instance; deferred under AGENTS.md).
- [x] Kept every `defaults.ts` page entry as the zero-CMS fallback.

Notes: Image URLs change from legacy `/img`/`media` references to managed
`/media/uploads` copies, but their bytes are verified identical. The retained
script is safe to rerun and supports `--check` without writes.
Commit: `8037aba` feat: add script to seed YAML pages from code defaults with
image handling; `0371af9` fix(keystatic): verify seeded page render parity.

## K3 — SEO metadata fields

Status: Done.

Goal: editable SEO inputs on all relevant Keystatic content.

Checklist:
- [x] Shared `seoFields` group in `schemas.ts` (`metaTitle`,
  `metaDescription`, `canonical`, `ogImage`, `noindex`); added to
  `pageFields` + `postFields`.
- [x] Extended `PageDoc` / `BlogPost` types and reader merges; empty CMS
  values defer to code fallbacks.
- [x] Wired `<Head>` on page routes, blog index, pagination, and post routes.
- [x] Documented precedence (CMS → excerpt/description → site default).
- [ ] Verify view-source on a page + post (requires a user-approved dev
  instance; not started under AGENTS.md).

Notes: `resolveSeo` is the code-default layer: title uses an explicit CMS
value or the content title; description uses CMS metadata, then the page
description/post excerpt, then the site description; social image uses CMS
`ogImage`, then `featuredImage`; canonical uses CMS or the route URL.
`noindex` is opt-in. Posts now emit `og:type=article` and
`article:published_time`.
Commit: `31a3afe` feat(keystatic): add editable SEO metadata (shared schema,
reader fallback, canonical/Open Graph/robots tags across page and blog routes).


## K4 — Env-based storage (local dev, cloud/GitHub prod)

Status: Not started.

Goal: `keystatic.config.ts` uses local storage in dev, Keystatic
Cloud/GitHub in prod, driven by env vars.

Checklist:
- [ ] Switch on env (`KEYSTATIC_STORAGE` or repo presence): local vs
  `kind: 'github'`. Extend `.env.example` (has
  `KEYSTATIC_GITHUB_CLIENT_ID/SECRET`, `KEYSTATIC_SECRET`).
- [ ] Reader: local `createReader` vs `createGitHubReader` behind same
  flag; build-time only (no secret leakage to client).
- [ ] Document prod vars + Cloud/GitHub-app setup (callback URLs, Vercel).
- [ ] Verify `next build` passes locally; config loads with github mode.

Notes: —
Commit: —

## K6 — Drop SW content, keep locale structure

Status: Done.

Decision: deleted `defaults.sw` code fallbacks (single source of truth;
README "Adding a locale" documents how to add a locale back).
Goal: remove Kiswahili collections/content/routes; keep locale-keyed
architecture for future locales.

Checklist:
- [x] Decided (recorded above): deleted `defaults.sw`.
- [x] Removed `pages-sw` / `posts-sw` / `layout-sw` from config +
  navigation; content moved `src/content/en/*` → `src/content/*`;
  reader repointed to `pages` / `posts` / `layout` + EN-peer fallback dropped.
- [x] Removed `src/pages/sw/**`; `Locale` reduced to `'en'` keeping
  `locales`, `routeFromParams`, `blogBasePath` locale-aware.
- [x] README "Adding a locale" rewritten for the single-locale model.
- [x] Typecheck-gated verify: `npm run typecheck` exit 0.

Notes: `docs/` is gitignored — force-added (`git add -f`) on this commit.
`src/fonts/fonts.ts` keeps one historical Kiswahili comment (font coverage
note, not a locale reference) — left as-is. K6 commit also carries the
pre-existing `dev/mobile-first` dirty-tree work (incl. reader lazy-body +
`stripUndefined` fix) since the user directed K6 on the dirty tree.
Commit: `b130b0d` feat(keystatic): drop sw locale, keep locale-keyed structure
(26 files, +385/−2596; incl. plan.md + instructions.md setup + carried
dirty-tree work).

## K7 — SEO readiness audit of current content

Status: Not started. Depends on K2+K3 (audit migrated content, real fields).

Goal: every page/post ships complete, valid SEO metadata.

Checklist:
- [ ] Audit titles (unique/length), meta descriptions (~120–160 chars,
  unique), excerpts, image `alt`s, canonicals, heading hygiene.
- [ ] Compose + set missing values (via `/keystatic` or `defaults.ts`);
  list every composed value in Notes for review.
- [ ] Confirm noindex only where intended; `og:type article` + dates on posts.

Notes: —
Commit: —

## K8 — Build-time crawler files (Pages Router)

Status: Not started. Pages Router only — NO App Router `sitemap.ts`.

Checklist:
- [ ] Inspect + record: collections/singletons, API route, next.config,
  scripts, `src/pages` patterns, draft/date fields. (Pre-gathered:
  collections `pages-en/sw`, `posts-en/sw`; NO draft/published field;
  dates via post `publishedAt`; routes `/`, `/blog`, `/blog/[slug]`,
  `/[locale]`, `/[locale]/[...slug]`, `/sw/blog/*`; site URL in
  `src/lib/site.ts` (`https://analyttdigital.com`), no
  `NEXT_PUBLIC_SITE_URL` yet; `.gitignore` already ignores
  `/public/robots.txt` + `/public/sitemap.xml`.)
- [ ] `scripts/generate-seo-files.ts` via `createReader`
  (or `createGitHubReader` if K4 done; reuse shared helper), never HTTP.
  Skip drafts (add field or record N/A — none exists today).
- [ ] Emit to `public/`: `sitemap.xml` (absolute URLs, fallback origin,
  no trailing slash, static routes, `lastmod` from content/build date;
  index + chunks past 50k), `robots.txt` (allow all; disallow
  `/keystatic`, `/api`, `/_next`; `Sitemap:` line), `feed.xml` (RSS —

  posts exist), `llms.txt`, `.well-known/security.txt` only with
  contact-email env.
- [ ] Wire `postbuild`/`prebuild`; add `tsx` devDependency if missing;
  extend `.gitignore` for `feed.xml`, `llms.txt` (+`security.txt`).
- [ ] Run `next build` (explicitly approved), verify files + URLs, fix types.

Notes: —
Commit: —

## K5 — Real-time previews (draft mode)

Status: Not started — scheduled LAST (may reshape read path).

Goal: live preview per
https://keystatic.com/docs/recipes/real-time-previews, adapted to Pages
Router (`res.setPreviewData`, preview API route, preview-mode reader).

Checklist:
- [ ] Spike: map App Router recipe → Pages Router; record design first.
- [ ] Implement preview route + admin preview config + reader handling
  (drafts never leak to public builds).
- [ ] Verify: edits preview unsaved/draft state; exit works; prod unaffected.

Notes: —
Commit: —
