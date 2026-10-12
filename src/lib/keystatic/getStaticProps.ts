import { createReader } from '@keystatic/core/reader';

import keystaticConfig from '../../../keystatic.config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reader: any = createReader(process.cwd(), keystaticConfig);

import { readPageBundle } from '@/lib/content/reader';
import { localeFromParams, type Locale, type PageBundle } from '@/lib/content/types';

export type PageProps = {
  locale: Locale;
  slug: string;
  /** Undefined means "render from code defaults" (first run, no CMS content yet). */
  bundle?: PageBundle;
};

/**
 * Shared getStaticProps for every page. Reads the layout singleton + page
 * collection entry for the active locale (falling back to code defaults) and
 * passes them to _app, where the layout picks up the chrome and the page
 * renders its section list.
 */
export async function getStaticProps({
  params,
}: {
  params?: { locale?: string; slug?: string };
}): Promise<{ props: PageProps }> {
  const locale = localeFromParams(params ?? undefined);
  const rawSlug = Array.isArray(params) ? params[1] : params?.slug;
  const slug = typeof rawSlug === 'string' && rawSlug.length > 0 ? rawSlug : 'home';

  let bundle: PageBundle | undefined;
  try {
    bundle = await readPageBundle(reader, locale, slug);
  } catch {
    bundle = undefined;
  }

  return {
    props: {
      locale,
      slug,
      bundle,
    },
  };
}
