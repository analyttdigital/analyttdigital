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

Status: Not started.

Goal: (a) a stored post featured image previews in the Keystatic edit UI
without re-upload; (b) page documents gain an editable featured image.

Checklist:
- [ ] Reproduce: post with stored `featuredImage.src` shows blank preview.
- [ ] Root-cause: suspect `imageField` nesting `fields.image` (upload)
  under an object — YAML text paths may not resolve to a preview.
- [ ] Fix preview without breaking reader shape `{ src, alt }`.
- [ ] Add `featuredImage` to `pageFields`, `PageDoc`, `readPage` merge,
  defaults (empty = hidden); render (page hero and/or `og:image`).
- [ ] Verify in `/keystatic` (upload new, keep existing, clear to empty)
  + on page/post routes.

Notes: —
Commit: —

## K2 — Migrate default content to Keystatic pages

Status: Not started.

Goal: every code-default page in `defaults[locale].pages` exists as an
editable Keystatic entry; routes render identically.

Checklist:
- [ ] Enumerate `Object.keys(defaults.en.pages)` (SW scope depends on K6).
- [ ] Seed one YAML per slug under `src/content/en/pages/` from defaults
  (script-assisted preferred; record script, delete-or-keep deliberately).
- [ ] Spot-check representative routes render identically CMS vs fallback.
- [ ] Confirm `/keystatic` lists + edits each page; saves round-trip.
- [ ] Keep `defaults.ts` entries as zero-CMS fallback — do NOT delete.

Notes: —
Commit: —

## K3 — SEO metadata fields

Status: Not started.

Goal: editable SEO inputs on all relevant Keystatic content.

Checklist:
- [ ] Shared `seoFields` group in `schemas.ts` (`metaTitle`,
  `metaDescription`, `canonical`, `ogImage`, `noindex`); add to
  `pageFields` + `postFields` (+ layout fallback if agreed).
- [ ] Extend `PageDoc` / `BlogPost` types, reader merges
  (empty CMS → fallback), defaults.
- [ ] Wire into `<Head>` on page routes, blog index, post routes.
- [ ] Document precedence (CMS → excerpt/description → site default).
- [ ] Verify view-source on a page + post.

Notes: —
Commit: —


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
Commit: —

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
