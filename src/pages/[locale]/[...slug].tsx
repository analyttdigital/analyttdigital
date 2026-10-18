import { PageView } from '@/lib/content/page-view';
import { getStaticProps, nestedStaticPaths } from '@/lib/keystatic/getStaticProps';

export { getStaticProps };

export default PageView;

/**
 * The nested route (two or more segments): `/services/paid-media` for the
 * default locale, whose first slug segment rides in the `locale` slot
 * (see `routeFromParams`). One-segment URLs are served by
 * `[locale]/index.tsx` — an optional catch-all cannot serve both shapes,
 * because Next validates a pre-rendered path against the required-catch-all
 * variant and rejects a one-segment path.
 */
export async function getStaticPaths() {
  return {
    paths: await nestedStaticPaths(),
    fallback: 'blocking' as const,
  };
}
