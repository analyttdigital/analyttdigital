import { config, collection, singleton } from '@keystatic/core';

import { layoutFields, pageFields, postFields } from './src/lib/keystatic/schemas';

/**
 * Keystatic configuration — content model:
 *
 * - `layout-<locale>` singletons: shared chrome (nav, footer) edited once per
 *   locale and consumed by every page's layout.
 * - `pages-<locale>` collections: page documents (title, meta, ordered
 *   section blocks). Each stored page renders at `/<locale?>/<slug>`.
 * - `posts-<locale>` collections (M8): blog posts as markdown (frontmatter +
 *   document body). Each stored post renders at `/<locale?>/blog/<slug>`.
 * - Storage is local; files land in src/content/<locale>/… as YAML (pages,
 *   layout) or Markdown (posts).
 * - List defaults live in code (src/lib/content/defaults.ts) because Keystatic
 *   arrays start empty; the reader merges CMS values over code defaults.
 */
export default config({
  storage: {
    kind: 'local',
  },

  collections: {
    'pages-en': collection({
      label: 'Pages (EN)',
      slugField: 'title',
      path: 'src/content/en/pages/*',
      format: 'yaml',
      schema: pageFields,
    }),
    'pages-sw': collection({
      label: 'Pages (SW)',
      slugField: 'title',
      path: 'src/content/sw/pages/*',
      format: 'yaml',
      schema: pageFields,
    }),
    'posts-en': collection({
      label: 'Posts (EN)',
      slugField: 'slug',
      path: 'src/content/en/posts/*',
      format: 'markdown',
      schema: postFields,
    }),
    'posts-sw': collection({
      label: 'Posts (SW)',
      slugField: 'slug',
      path: 'src/content/sw/posts/*',
      format: 'markdown',
      schema: postFields,
    }),
  },

  singletons: {
    'layout-en': singleton({
      label: 'Layout (EN)',
      path: 'src/content/en/layout',
      format: 'yaml',
      schema: layoutFields,
    }),
    'layout-sw': singleton({
      label: 'Layout (SW)',
      path: 'src/content/sw/layout',
      format: 'yaml',
      schema: layoutFields,
    }),
  },

  ui: {
    navigation: {
      'English (en)': ['pages-en', 'posts-en', 'layout-en'],
      'Kiswahili (sw)': ['pages-sw', 'posts-sw', 'layout-sw'],
    },
  },
});
