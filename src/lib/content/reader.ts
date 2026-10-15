import { createReader } from '@keystatic/core/reader';

import keystaticConfig from '../../../keystatic.config';
import { defaults } from '@/lib/content/defaults';
import {
  defaultLocale,
  type LayoutContent,
  type Locale,
  type PageBundle,
  type PageDoc,
  type Section,
} from '@/lib/content/types';

/**
 * Content access layer.
 *
 * - Layout: `layout-<locale>` singleton, merged over code defaults. Missing
 *   entries fall back wholesale.
 * - Pages: `pages-<locale>` collection entries, keyed by slug. A page with no
 *   CMS entry (or one with no sections) falls back to the code-default page
 *   document for that slug. A slug that exists in neither is `null`, so the
 *   route can answer 404 instead of serving the wrong page.
 * - Sections: CMS sections are merged over matching code-default sections by
 *   position, so partially-filled section forms still render complete
 *   content. Empty lists defer to defaults (Keystatic arrays start empty).
 */

type AnyReader = ReturnType<typeof createReader>;

/** Merge helpers: CMS values win; empty arrays and empty `{ src }` image
 *  refs defer to defaults. */
function isEmptyImage(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'src' in value &&
    typeof (value as { src: unknown }).src === 'string' &&
    (value as { src: string }).src.trim() === ''
  );
}

/** One CMS value merged over its default: empty lists and empty `{ src }`
 *  image refs defer to the code default, so a half-filled Keystatic form
 *  still renders complete content. */
function mergeValue(defaultValue: unknown, cmsValue: unknown): unknown {
  if (Array.isArray(cmsValue) && cmsValue.length === 0) return defaultValue;
  if (isEmptyImage(cmsValue)) return defaultValue;
  return cmsValue;
}

function mergeSection(defaultsSection: Section | undefined, cmsSection: Section): Section {
  if (!defaultsSection || defaultsSection.type !== cmsSection.type) return cmsSection;
  const merged: Record<string, unknown> = { ...(defaultsSection as object) };
  for (const [k, v] of Object.entries(cmsSection as Record<string, unknown>)) {
    if (k === 'type') continue;
    merged[k] = mergeValue(merged[k], v);
  }
  return merged as Section;
}

export async function readLayout(reader: AnyReader | null, locale: Locale): Promise<LayoutContent> {
  if (!reader) return defaults[locale].layout;
  try {
    const entry = await (reader.singletons as Record<string, { read: () => Promise<LayoutContent | null> }>)[
      `layout-${locale}`
    ].read();
    if (!entry) return defaults[locale].layout;
    const merged: Record<string, unknown> = { ...(defaults[locale].layout as object) };
    for (const [k, v] of Object.entries(entry as Record<string, unknown>)) {
      merged[k] = mergeValue(merged[k], v);
    }
    return merged as LayoutContent;
  } catch {
    return defaults[locale].layout;
  }
}

/** Read one page document: the CMS entry for `slug` merged over its
 *  code-default page. `null` means the slug exists in neither layer — the
 *  caller decides what an unknown URL means (404). */
export async function readPage(
  reader: AnyReader | null,
  locale: Locale,
  slug: string,
): Promise<PageDoc | null> {
  const fallback = defaults[locale].pages[slug];

  if (!reader) return fallback ?? null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries: { slug: string; entry: PageDoc }[] = await (
      reader.collections as Record<string, { all: () => Promise<any> }>
    )[`pages-${locale}`].all();
    const match = entries.find((e) => e.slug === slug);
    if (!match?.entry?.sections?.length) return fallback ?? null;

    const cmsSections = match.entry.sections;
    const sections = cmsSections.map((cms, i) => mergeSection(fallback?.sections[i], cms));
    return {
      title: match.entry.title || fallback?.title || '',
      description: match.entry.description || fallback?.description || '',
      sections,
    };
  } catch {
    return fallback ?? null;
  }
}

/** Every slug a locale can render: the code-default pages plus any Keystatic
 *  entries (a CMS-only page has no code default to be listed from). Used to
 *  pre-render routes; the reader still answers for slugs added later. */
export async function listPageSlugs(reader: AnyReader | null, locale: Locale): Promise<string[]> {
  const slugs = new Set(Object.keys(defaults[locale].pages));
  if (reader) {
    try {
      const cmsSlugs: string[] = await (
        reader.collections as Record<string, { list: () => Promise<string[]> }>
      )[`pages-${locale}`].list();
      for (const slug of cmsSlugs) slugs.add(slug);
    } catch {
      // Unreadable collection: the code defaults still describe every page.
    }
  }
  return [...slugs].sort();
}

/** Read everything a page render needs, in one call. */
export async function readPageBundle(
  reader: AnyReader | null,
  locale: Locale = defaultLocale,
  slug: string,
): Promise<PageBundle | null> {
  const [layout, page] = await Promise.all([readLayout(reader, locale), readPage(reader, locale, slug)]);
  return page ? { layout, page } : null;
}
