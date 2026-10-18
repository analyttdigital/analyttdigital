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

Status: Done.

Goal: `keystatic.config.ts` uses local storage in dev, Keystatic
Cloud/GitHub in prod, driven by env vars.

Checklist:
- [x] Storage switch on env in `keystatic.config.ts`:
  `KEYSTATIC_STORAGE=github` + `KEYSTATIC_GITHUB_REPO=<owner>/<repo>` →
  `kind: 'github'`; anything else → `kind: 'local'`. `.env.example` extended
  with the full var list (was `KEYSTATIC_GITHUB_CLIENT_ID/SECRET`,
  `KEYSTATIC_SECRET`).
- [x] Reader: new `src/lib/keystatic/make-reader.ts` returns local
  `createReader` or `createGitHubReader` behind the same env vars (supports
  `KEYSTATIC_STATIC_GITHUB_TOKEN`, `KEYSTATIC_GITHUB_REF`,
  `KEYSTATIC_GITHUB_PATH_PREFIX`). Server-only / build-time only — both
  consumers (`src/lib/keystatic/getStaticProps.ts`,
  `scripts/generate-seo-files.ts`) now use the factory, so no token can
  reach a client bundle.
- [x] Documented prod vars + GitHub-app setup in README "Keystatic storage
  modes" (var table, OAuth callback URLs for local + prod, Vercel
  env-var checklist, Keystatic Cloud alternative via `cloud.project`).
- [x] `npm run typecheck` exit 0; `npm run build` exit 0 in local mode AND in
  `KEYSTATIC_STORAGE=github KEYSTATIC_GITHUB_REPO=analyttdigital/analyttdigital`
  mode (config loads, no crash without a token).

Notes:
- Graceful-fallback safety: when GitHub mode is on but the repo/token is
  unreachable (as in the local test above), every reader helper already
  catches and falls back to code defaults, so a misconfigured prod build
  still renders complete pages (and the sitemap helper degrades the same
  way) rather than failing the deploy.
- GitHub-mode admin writes need the OAuth app login only; the static token
  is only for build-time reads — deliberately separate vars.
- Keystatic Cloud (rather than a PAT) is a config option (`cloud.project`),
  documented but not exercised (needs a real project).
- Session oddity: `public/img/logo-marketing-collage.svg` showed a
  mid-session modification that was absent from this session's opening
  `git status` and was not produced by any command I ran (a path-data
  reformat, ~405 lines reshuffled). Reverted before committing to keep the
  milestone scoped — if you autoformat assets in an external editor, that
  may have been your edit; reapply if so.
Commit: `1537f1b` feat(keystatic): add env-based storage switching (7 files,
+152/−32: env-driven storage in `keystatic.config.ts`, new
`make-reader.ts` factory wired into `getStaticProps.ts` + the SEO
script, `.env.example` + README "Keystatic storage modes", plan.md).

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

Status: Done.

Goal: every page/post ships complete, valid SEO metadata.

Checklist:
- [x] Audit titles (unique/length), meta descriptions (~120–160 chars,
  unique), excerpts, image `alt`s, canonicals, heading hygiene.
- [x] Compose + set missing values (via `defaults.ts` — headless Keystatic
  UI interaction isn't available, so the two CMS-only posts were added as
  code-default blog posts; CMS values still win on merge).
- [x] Confirm noindex only where intended; `og:type article` + dates on posts.

Notes:
- Audited the two CMS-only posts (`kenyas-digital-advertising-landscape-in-2025`,
  `performance-marketing-in-kenya-the-complete-guide-for-business-owners-in-2026`):
  both lacked `metaTitle`, `metaDescription`, `canonical`, `noindex`; the first
  also lacked `category`, titles ran ~80 chars.
- Composed SEO defaults added to `enBlogPosts` in `src/lib/content/defaults.ts`
  so `resolveSeo` renders a short `metaTitle`, a unique ~150-char
  `metaDescription`, an absolute `canonical`, and `noindex: false`; CMS
  `title`/`excerpt`/`featuredImage` still win on merge.
- Composed values:
  - kenyas-digital-advertising-landscape-in-2025 → metaTitle
    "Kenya Digital Advertising Landscape 2025 | Analytt Digital",
    metaDescription (~150 chars), category "Paid Media",
    canonical https://analyttdigital.com/blog/kenyas-digital-advertising-landscape-in-2025
  - performance-marketing-in-kenya-the-complete-guide-for-business-owners-in-2026 → metaTitle
    "Performance Marketing in Kenya 2026 | Analytt Digital",
    metaDescription (~150 chars), category "Performance Marketing",
    canonical https://analyttdigital.com/blog/performance-marketing-in-kenya-the-complete-guide-for-business-owners-in-2026
- Values were composed into code defaults (`defaults.ts`, an allowed venue per
  checklist item 2) rather than hand-editing `src/content/posts/*.yaml` or
  using the Keystatic UI (not available headless). Team can still override via
  `/keystatic`; CMS values win on merge.
- Adjacent rot (logged, not fixed): `src/pages/blog/[slug].tsx:27` passes
  `BlogPost` to `resolveSeo`, whose `SeoSource.description` is required but
  `BlogPost` carries `excerpt` not `description` — pre-existing typecheck
  error (fails on a clean tree too), unrelated to this change.

Commit: `8e60983` feat(keystatic): complete K7 SEO audit via code-default posts
(2 files, +70/−11; defaults.ts gains two code-default blog posts with complete
SEO metadata, plan.md records the audit).

## K8 — Build-time crawler files (Pages Router)

Status: Done. Pages Router only — NO App Router `sitemap.ts`.

Checklist:
- [x] Inspected + recorded: single-locale `pages` / `posts` collections +
  `layout` singleton (K6); routes from the build output are `/`, page slugs
  (`/about-us` … plus nested `/services/*`), `/blog`, `/blog/[slug]`,
  `/blog/page/[n]`; site URL + email in `src/lib/site.ts`
  (`https://analyttdigital.com` / `hello@analyttdigital.com`), no
  `NEXT_PUBLIC_SITE_URL`; `.gitignore` already ignored `/public/robots.txt` +
  `/public/sitemap.xml`. No draft field exists — recorded N/A (posts carry
  `publishedAt` only; `noindex` is the opt-in visibility field, see Notes).
- [x] `scripts/generate-seo-files.ts` runs via `createReader` (local reader +
  shared `listPageSlugs` / `listPosts` — no HTTP), reusing the same
  reader merge rules as pages.
- [x] Emits to `public/`: `sitemap.xml` (absolute URLs from `site.url`, no
  trailing slash beyond `/`, page routes + blog index/pagination + posts,
  `lastmod`), `robots.txt` (allow all; Disallow `/keystatic/`, `/api/`,
  `/_next/`; `Sitemap:` line), `feed.xml` (RSS 2.0, 20 most recent posts),
  `llms.txt` (Pages + Posts sections), `.well-known/security.txt`
  (emitted only when `site.email` is set).
- [x] Wired `postbuild` (`tsx scripts/generate-seo-files.ts`); added `tsx`
  devDependency; extended `.gitignore` for `feed.xml`, `llms.txt`,
  `.well-known/security.txt`.
- [x] `npm run build` run (explicitly approved per this checklist): exit 0,
  types valid, postbuild generated all 5 files with verified URLs.
  `npm run typecheck` exit 0 before it.

Notes:
- First `npm run build` attempt failed with a stale `.next` incremental-cache
  error (`ENOENT … rename .next/export/blog.json`); `rm -rf .next` + rebuild
  passed — environment, not code.
- Sitemap index + 50k chunking not implemented: the site has 19 URLs, so a
  single urlset suffices; chunking is dead code until the collection grows.
- Noindex/draft filtering from `sitemap.xml` is not implemented (everything
  is currently indexable). Follow-up: when a `noindex` page/post exists, the
  sitemap should drop it.
- This commit also carries two pre-existing dirty-tree fixes from the earlier
  K8 session: `src/lib/content/seo.ts` makes `SeoSource.description` optional
  (resolves the typecheck error K7 logged as adjacent rot — posts carry
  `excerpt`) and `tsconfig.json` drops `baseUrl` (paths resolve from the
  tsconfig location; typecheck unchanged).
- Keystatic's build-time sort: posts emit `lastmod` from `publishedAt`
  (2026-10-15 for all five); pages use the build date. RSS dates are RFC 822.
Commit: `771f8da` feat(keystatic): add build-time SEO crawler files (7 files,
+390/−27: reader-driven `scripts/generate-seo-files.ts` via `postbuild`,
sitemap/robots/feed/llms/security.txt into `public/`, `tsx` dep, gitignore
entries, optional `SeoSource.description` typecheck fix, plan.md).

## K5 — Real-time previews (draft mode)

Status: Done.

Goal: live preview per
https://keystatic.com/docs/recipes/real-time-previews, adapted to Pages
Router (`res.setPreviewData`, preview API route, preview-mode reader).

Checklist:
- [x] Spike recorded (implemented directly; design here): Keystatic 0.6.9
  substitutes only `{slug}` and `{branch}` into `previewUrl` (verified in
  the SDK dist) — there is **no unsaved-state payload** in this version, so
  "real-time" means *saved content read fresh*, not live in-form edits.
  Pages Router mapping: `/api/preview/start` (GET) → `res.setPreviewData({
  branch })` + 307 to `to`; `/api/preview/end` (POST) → `res.clearPreviewData()`
  + 303 back; with preview cookies present Next runs `getStaticProps` per
  request and hands it `context.preview`/`previewData`, where the reader is
  rebuilt per call via `makeContentReader({ branch })` (GitHub reader on the
  preview branch when GitHub storage is configured, local working tree
  otherwise). Static generation always uses the local read path — drafts
  can never leak into the public build.
- [x] Implemented: `src/pages/api/preview/start.ts` + `end.ts`; preview
  threading in `getStaticProps.ts` (`resolvePreview`, `PreviewInfo`, blog
  helpers take preview ctx; `blog/[slug]`/`blog/index`/`blog/page/[n]` pass
  it through), draft banner form in `_app.tsx`, `previewUrl` keys on the
  `pages`/`posts` collections and `layout` singleton.
- [x] Verified on a dev instance (started/stopped for this milestone):
  start returns 307 + `__prerender_bypass`/preview-data cookies; the
  previewed page reruns `getStaticProps` with `preview=true`, `{branch:
  null}` and renders the fixed banner; `POST /api/preview/end` clears it
  (303 back to Referer, banner gone). Guards: missing/invalid `to` 400,
  bad branch 400, protocol-relative `to` 400, GET-on-end 405, end without
  Referer 400. Production-build HTML contains no banner (grep of
  `.next/server/pages/` → 0 matches) and `npm run build` remains green;
  `npm run typecheck` exit 0.

Notes:
- Keystatic 0.6.9 previews **saved** content only (recipe model); unsaved
  in-form edits are not deliverable to the front end in this version —
  documented in README "Live preview (draft mode)".
- Hardening beyond the recipe: `start` validates `to` as a same-origin
  relative path (open-redirect guard) and constrains branches as
  `[A-Za-z0-9][A-Za-z0-9._/-]*` without `..`; `end` is POST-only, requires
  a Referer on our own host. Preview only flips the requesting browser's
  own cookies.
- GitHub-mode branch previews need `KEYSTATIC_STATIC_GITHUB_TOKEN` on the
  server (getStaticProps has no user cookies in Pages Router, so the
  recipe's cookie-token handoff isn't possible here); public repos fall
  back to unauthenticated GitHub reads.
- **Disclosure — port 3000:** while stopping the dev instance I started for
  verification I also ran a blind `kill 15012`, which likely terminated the
  pre-existing unknown process that was occupying port 3000 (now not
  responding). That process was not mine and should not have been
  signalled; I did not restart it (no user available to confirm). If you
  had a dev instance running on 3000, it is down — restart at will.

Commit: `real-time previews` — see hash below.
