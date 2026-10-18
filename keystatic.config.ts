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
 * "Adding a locale" to add one back. */
export default config({
  storage: {
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
    }),
    posts: collection({
      label: 'Posts',
      slugField: 'slug',
      path: 'src/content/posts/*',
      // 0.6.9 collections only offer `json`/`yaml` — no markdown format,
      // so post documents serialize as YAML like pages.
      format: 'yaml',
      schema: postFields,
    }),
  },

  singletons: {
    layout: singleton({
      label: 'Layout',
      path: 'src/content/layout',
      format: 'yaml',
      schema: layoutFields,
    }),
  },

  ui: {
    navigation: {
      Content: ['pages', 'posts', 'layout'],
    },
  },
});
