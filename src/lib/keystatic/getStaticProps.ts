import { makeContentReader } from '@/lib/keystatic/make-reader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reader: any = makeContentReader();
import { listPageSlugs, readPageBundle } from '@/lib/content/reader';
import { defaults } from '@/lib/content/defaults';
import { BLOG_PAGE_SIZE } from '@/lib/content/blog';
import { listPosts, listPostSlugs, readLayout, readPost } from '@/lib/content/reader';
import {
  defaultLocale,
  locales,
  routeFromParams,
  type BlogListing,
  type BlogPost,
  type BlogPostCopy,
  type Locale,
  type PageBundle,
  type RouteParams,
} from '@/lib/content/types';

export type PageProps = {
  locale: Locale;
  slug: string;
  /** Undefined means "render from code defaults" (error routes, first run). */
  bundle?: PageBundle;
  /** Latest posts for blog-aware sections (e.g. homepage insights). */
  latestPosts?: BlogPost[];
  /** K5: set only when Next draft mode is active (page view is uncached). */
  preview?: PreviewInfo;
};

/** K5 — the state `/api/preview/start` puts into Next's preview data and the
 *  page props surface as the draft banner. `branch: null` = local-mode
 *  preview (read the working tree); non-null names the GitHub ref to read. */
export type PreviewInfo = { branch: string | null };

/** Next hands `preview` + `previewData` to `getStaticProps` context when
 *  draft mode is on. Keystatic's own preview flow may attach other shapes to
 *  `previewData`, so only a string `branch` of ours is honoured. */
export function resolvePreview(ctx: {
  preview?: boolean;
  previewData?: unknown;
}): PreviewInfo | null {
  if (!ctx.preview) return null;
  if (typeof ctx.previewData !== 'object' || ctx.previewData === null) return null;
  const branch = (ctx.previewData as { branch?: unknown }).branch;
  if (typeof branch !== 'string' || branch === '') return { branch: null };
  return { branch };
}

export type PageStaticProps = { props: PageProps } | { notFound: true };

/**
 * Shared getStaticProps for every page. Reads the layout singleton + page
 * collection entry for the route's locale (falling back to code defaults) and
 * passes them to _app, where the layout picks up the chrome and the page
 * renders its section list.
 *
 * An unknown slug (present in neither the CMS nor the code defaults) is a 404,
 * so a typo or a link to a page that does not exist yet never renders the
 * homepage's content under the wrong URL.
 */
export async function getStaticProps({
  params,
  preview,
  previewData,
}: {
  params?: RouteParams;
  preview?: boolean;
  previewData?: unknown;
}): Promise<PageStaticProps> {
  const { locale, slug } = routeFromParams(params);
  const previewInfo = resolvePreview({ preview, previewData });
  // A preview request reads fresh content (local working tree or, with a
  // branch cookie, that GitHub ref) instead of the build-time checkout.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reader: any = makeContentReader({ branch: previewInfo?.branch });

  let bundle: PageBundle | null;
  try {
    bundle = await readPageBundle(reader, locale, slug);
  } catch {
    bundle = null;
  }

  if (!bundle) return { notFound: true };

  // Latest posts ride along for blog-aware sections; a failed posts read
  // never breaks the page (sections fall back to their static articles).
  let latestPosts: BlogPost[] = [];
  try {
    latestPosts = (await listPosts(reader, locale)).slice(0, 3);
  } catch {
    latestPosts = [];
  }

  return {
    props: {
      locale,
      slug,
      bundle,
      latestPosts,
      // Omitted (never `undefined`) so the build path is unaffected.
      ...(previewInfo ? { preview: previewInfo } : {}),
    },
  };
}

/** One getStaticPaths entry. `locale` is the route's only named segment — for
 *  the one-segment route it holds the whole URL segment, for the nested
 *  catch-all the first one — and `slug` carries the remaining segments. */
type StaticPath = { params: { locale: string; slug: string[] } };

/** Split a page slug into the first URL segment (`locale` slot) and the rest. */
function entryForSlug(slug: string, prefix: Locale | null): StaticPath {
  const segments = slug.split('/');
  return prefix
    ? { params: { locale: prefix, slug: segments } }
    : { params: { locale: segments[0], slug: segments.slice(1) } };
}

/**
 * Paths for the one-segment route (`/[locale]`): the default locale's
 * unprefixed single-segment page slugs (`/about-us`). An optional
 * catch-all cannot express this shape, because Next validates a pre-rendered
 * path against the required-catch-all variant of the route and rejects a
 * one-segment path (see `export/helpers/get-params`).
 */
export async function baseStaticPaths(): Promise<StaticPath[]> {
  const slugsByLocale = await Promise.all(locales.map((locale) => listPageSlugs(reader, locale)));

  return locales.flatMap((locale, i) => {
    if (locale !== defaultLocale) return [{ params: { locale, slug: [] } }];
    // `/` is served by src/pages/index.tsx, so the default locale's home slug
    // has no one-segment page URL of its own to pre-render.
    return slugsByLocale[i]
      .filter((slug) => slug !== 'home' && !slug.includes('/'))
      .map((slug) => ({ params: { locale: slug, slug: [] } }));
  });
}

/**
 * Paths for the nested catch-all (`/[locale]/[...slug]`): every page URL with
 * two or more segments — `/services/paid-media` (default locale, its first
 * slug segment in the `locale` slot). Slugs come from the code defaults
 * plus any Keystatic entries; a page added after a build still renders on
 * first request, because the route keeps `fallback: 'blocking'`.
 */
export async function nestedStaticPaths(): Promise<StaticPath[]> {
  const slugsByLocale = await Promise.all(locales.map((locale) => listPageSlugs(reader, locale)));

  return locales.flatMap((locale, i) => {
    const prefixed = locale !== defaultLocale;
    return slugsByLocale[i]
      .filter((slug) => (prefixed ? true : slug.includes('/')))
      .map((slug) => entryForSlug(slug, prefixed ? locale : null));
  });
}

/* ------------------------------- blog --------------------------------- */
/* Standalone routes (`src/pages/blog/…`), Pages Router
 * `getStaticProps` only. The index is not a CMS section: listing copy lives in
 * `defaults[locale].blog`, posts in `listPosts`/`readPost`. `bundle.page`
 * carries the listing/post title + excerpt as metadata only (empty sections);
 * blog views render from `blogIndex`/`blogPost`, never from sections.
 *
 * Server-only module: route *components* must not import runtime values from
 * here (the top-level `createReader` graph needs `node:fs`). Shared pure
 * values live in `@/lib/content/blog` (`BLOG_PAGE_SIZE`, `blogBasePath`). */

export type BlogIndexProps = PageProps & { blogIndex: BlogListing };

export type BlogPostProps = PageProps & { blogPost: BlogPost; blogCopy: BlogPostCopy };

/** Listing page `n` (1-based). Out-of-range pages are 404. */
export async function getBlogIndexStaticProps(
  locale: Locale,
  page: number,
  preview?: boolean,
  previewData?: unknown,
): Promise<{ props: BlogIndexProps } | { notFound: true }> {
  const previewInfo = resolvePreview({ preview, previewData });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reader: any = makeContentReader({ branch: previewInfo?.branch });
  const [layout, posts] = await Promise.all([readLayout(reader, locale), listPosts(reader, locale)]);
  const copy = defaults[locale].blog.copy;
  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE));
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return { notFound: true };

  const blogIndex: BlogListing = {
    ...copy,
    posts: posts.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE),
    page,
    totalPages,
  };
  return {
    props: {
      locale,
      slug: 'blog',
      bundle: { layout, page: { title: 'Blog', description: copy.body, sections: [] } },
      blogIndex,
      ...(previewInfo ? { preview: previewInfo } : {}),
    },
  };
}

/** One post. Unknown slugs are 404 — a typo never renders another post. */
export async function getBlogPostStaticProps(
  locale: Locale,
  slug: string,
  preview?: boolean,
  previewData?: unknown,
): Promise<{ props: BlogPostProps } | { notFound: true }> {
  const previewInfo = resolvePreview({ preview, previewData });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reader: any = makeContentReader({ branch: previewInfo?.branch });
  const [layout, post] = await Promise.all([readLayout(reader, locale), readPost(reader, locale, slug)]);
  if (!post) return { notFound: true };

  return {
    props: {
      locale,
      slug: post.slug,
      bundle: { layout, page: { title: post.title, description: post.excerpt, sections: [] } },
      blogPost: post,
      blogCopy: defaults[locale].blog.postCopy,
      ...(previewInfo ? { preview: previewInfo } : {}),
    },
  };
}

/** Post slugs to pre-render for a locale (CMS-only posts included). */
export async function blogPostPaths(locale: Locale): Promise<string[]> {
  return listPostSlugs(reader, locale);
}

/** Pagination pages to pre-render for a locale (`2..totalPages`; page 1 is the
 *  index and `/page/1` redirects to it). */
export async function blogPagePaths(locale: Locale): Promise<number[]> {
  const totalPages = Math.max(1, Math.ceil((await listPosts(reader, locale)).length / BLOG_PAGE_SIZE));
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => i + 2);
}
