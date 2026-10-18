import { config, collection, singleton } from '@keystatic/core';

import { layoutFields, pageFields, postFields } from './src/lib/keystatic/schemas';

/**
 * Keystatic configuration — content model:
 *
 * - `layout` singleton: shared chrome (nav, footer), consumed by every
 *   page's layout.
 * - `pages` collection: page documents (title, meta, ordered section
 *   blocks). Each stored page renders at `/<slug>`.
 * - `posts` collection: blog posts as markdown (frontmatter + document
 *   body). Each stored post renders at `/blog/<slug>`.
 * - Storage is local; files land in `src/content/…` as YAML (pages,
 *   layout) or Markdown (posts).
 * - List defaults live in code (src/lib/content/defaults.ts) because Keystatic
 *   arrays start empty; the reader merges CMS values over code defaults.
 *
 * Locales: single-locale today (`en`), but the code stays locale-keyed
 * (`locales`, `routeFromParams`, `blogBasePath`) — see README
 * "Adding a locale" to add one back.

 * Storage: local by default. `KEYSTATIC_STORAGE=github` (with
 * `KEYSTATIC_GITHUB_REPO=<owner>/<repo>`) switches both the admin UI and
 * the build-time readers to GitHub-backed storage (K4) — see README
 * "Keystatic storage modes" for the env vars.

 * Preview (K5): `previewUrl` makes the admin UI show a preview button that
 * arms Next draft mode through `/api/preview/start` (Pages Router
 * adaptation of Keystatic's real-time-previews recipe). `{branch}` is ''
 * in local mode — that previews saved-but-not-built local content; in
 * GitHub mode it names the branch the editor is saving to. */
const GITHUB_REPO = process.env.KEYSTATIC_GITHUB_REPO ?? '';
const PAGE_PREVIEW_URL = '/api/preview/start?branch={branch}&to=/{slug}';

const useGithubStorage =
  process.env.KEYSTATIC_STORAGE === 'github' && GITHUB_REPO.includes('/');

export default config({
  storage: useGithubStorage
    ? {
        kind: 'github',
        // The env value is free-form so a typo fails validation once,
        // loudly, instead of silently degrading to local files.
        repo: GITHUB_REPO as `${string}/${string}`,
      }
    : {
        kind: 'local',
      },

  collections: {
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      // `**` (not `*`) so nested slugs such as `services/paid-media` — URLs
      // the code defaults already publish — are listed and readable. The
      // trailing `/*` spelling adds a `*` slug suffix in Keystatic 0.6.9 and
      // makes every read miss its data file; bare `/**` is the working form.
      path: 'src/content/pages/**',
      format: 'yaml',
      schema: pageFields,
      previewUrl: PAGE_PREVIEW_URL,
    }),
    posts: collection({
      label: 'Posts',
      slugField: 'slug',
      path: 'src/content/posts/*',
      // 0.6.9 collections only offer `json`/`yaml` — no markdown format,
      // so post documents serialize as YAML like pages.
      format: 'yaml',
      schema: postFields,
      previewUrl: '/api/preview/start?branch={branch}&to=/blog/{slug}',
    }),
  },

  singletons: {
    layout: singleton({
      label: 'Layout',
      path: 'src/content/layout',
      format: 'yaml',
      schema: layoutFields,
      // The layout chrome is shared by every page; preview it on `/`.
      previewUrl: '/api/preview/start?branch={branch}&to=/',
    }),
  },

  ui: {
    navigation: {
      Content: ['pages', 'posts', 'layout'],
    },
  },
});
