import { PageView } from '@/lib/content/page-view';
import { baseStaticPaths, getStaticProps } from '@/lib/keystatic/getStaticProps';

export { getStaticProps };

export default PageView;

/**
 * The one-segment route: the default locale's
 * unprefixed pages (`/about-us`, `/contact`, `/pricing-plans`, `/services`).
 * Which one a segment is depends on whether it names a locale — see
 * `routeFromParams`. Deeper URLs live in `[...slug].tsx`.
 */
export async function getStaticPaths() {
  return {
    paths: await baseStaticPaths(),
    fallback: 'blocking' as const,
  };
}
