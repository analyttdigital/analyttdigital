import { createReader } from '@keystatic/core/reader';

import keystaticConfig from '../../../keystatic.config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reader: any = createReader(process.cwd(), keystaticConfig);

import { listPageSlugs, readPageBundle } from '@/lib/content/reader';
import {
  defaultLocale,
  locales,
  routeFromParams,
  type Locale,
  type PageBundle,
  type RouteParams,
} from '@/lib/content/types';

export type PageProps = {
  locale: Locale;
  slug: string;
  /** Undefined means "render from code defaults" (error routes, first run). */
  bundle?: PageBundle;
};

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
}: {
  params?: RouteParams;
}): Promise<PageStaticProps> {
  const { locale, slug } = routeFromParams(params);

  let bundle: PageBundle | null;
  try {
    bundle = await readPageBundle(reader, locale, slug);
  } catch {
    bundle = null;
  }

  if (!bundle) return { notFound: true };

  return { props: { locale, slug, bundle } };
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
 * Paths for the one-segment route (`/[locale]`): every URL segment that stands
 * alone — the locale bases (`/sw`) and, for the default locale whose URLs are
 * unprefixed, the single-segment page slugs (`/about-us`). An optional
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
 * two or more segments — `/sw/about-us`, `/sw/services/seo` (prefixed) and
 * `/services/paid-media` (default locale, its first slug segment in the
 * `locale` slot). Slugs come from the code defaults plus any Keystatic
 * entries; a page added after a build still renders on first request, because
 * the route keeps `fallback: 'blocking'`.
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
