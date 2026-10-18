import type { ContentImage } from '@/lib/content/types';
import { site } from '@/lib/site';

type SeoSource = {
  title: string;
  /** Pages carry `description`; posts carry only `excerpt` (optional here so
   *  resolution falls through to `excerpt`, K3's documented second layer,
   *  instead of jumping to `site.description`). */
  description?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonical?: string;
  featuredImage?: ContentImage;
  ogImage?: ContentImage;
  noindex?: boolean;
};

function nonEmpty(value: string | undefined): string {
  return value?.trim() ?? '';
}

function absoluteUrl(value: string): string {
  if (!value) return '';
  try {
    return new URL(value, site.url).toString();
  } catch {
    return '';
  }
}

/** Resolve editor overrides consistently across pages and posts. Precedence is
 *  CMS override, then the route's content summary (page `description` or the
 *  post's `excerpt`), then the site default. */
export function resolveSeo(source: SeoSource, route: string) {
  const image = nonEmpty(source.ogImage?.src) || nonEmpty(source.featuredImage?.src);
  const canonical = absoluteUrl(nonEmpty(source.canonical)) || absoluteUrl(route);

  return {
    title: nonEmpty(source.metaTitle) || `${source.title} | ${site.name}`,
    description:
      nonEmpty(source.metaDescription) || nonEmpty(source.description) || nonEmpty(source.excerpt) || site.description,
    canonical,
    image: absoluteUrl(image),
    imageAlt: image === nonEmpty(source.ogImage?.src) ? source.ogImage?.alt : source.featuredImage?.alt,
    noindex: source.noindex === true,
  };
}
