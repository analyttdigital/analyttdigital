import { defaultLocale, type Locale } from '@/lib/content/types';

/**
 * Blog route helpers — pure string/date shaping shared by the list, card, and
 * post components (no copy lives here; labels come from `defaults.ts`).
 *
 * Client-safe by design: route components import `BLOG_PAGE_SIZE` /
 * `blogBasePath` from here, never from `@/lib/keystatic/getStaticProps`
 * (whose module graph pulls in `@keystatic/core/reader` → `node:fs`,
 * which cannot bundle for the browser).
 */

/** Posts per listing page (M8 decision). */
export const BLOG_PAGE_SIZE = 9;

/** Public base for a locale's blog (`/blog`, `/sw/blog`). */
export function blogBasePath(locale: Locale): string {
  return locale === defaultLocale ? '/blog' : `/${locale}/blog`;
}

/** Public URL for a post (`/blog/<slug>`, `/sw/blog/<slug>`). */
export function postHref(locale: Locale, slug: string): string {
  return `${locale === defaultLocale ? '/blog' : `/${locale}/blog`}/${slug}`;
}

/** ISO date → long locale date (`1 August 2025` / `1 Agosti 2025`). Garbage in,
 *  source string out — a bad CMS date never crashes the card. */
export function formatPostDate(iso: string, locale: Locale): string {
  if (!iso) return '';
  const date = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(date.getTime())) return iso;
  try {
    return date.toLocaleDateString(locale === defaultLocale ? 'en-GB' : `${locale}-KE`, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

/** Fill `{key}` placeholders, then collapse segments left empty around `·`
 *  separators (`{date} · {author} · {category}` with no category → two parts). */
export function fillTemplate(template: string, vars: Record<string, string>): string {
  const filled = template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '');
  return filled
    .split('·')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' · ');
}
