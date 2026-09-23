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
 * - Pages: `pages-<locale>` collection entries, keyed by slug. A missing page
 *   (or page with no sections) falls back to the code-default page document.
 * - Sections: CMS sections are merged over matching code-default sections by
 *   position, so partially-filled section forms still render complete
 *   content. Empty lists defer to defaults (Keystatic arrays start empty).
 */

type AnyReader = ReturnType<typeof createReader>;

/** Merge helper: CMS values win, empty arrays defer to defaults. */
function mergeSection(defaultsSection: Section | undefined, cmsSection: Section): Section {
  if (!defaultsSection || defaultsSection.type !== cmsSection.type) return cmsSection;
  const merged: Record<string, unknown> = { ...(defaultsSection as object) };
  for (const [k, v] of Object.entries(cmsSection as Record<string, unknown>)) {
    if (k === 'type') continue;
    merged[k] = Array.isArray(v) && v.length === 0 ? merged[k] : v;
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
      merged[k] = Array.isArray(v) && v.length === 0 ? merged[k] : v;
    }
    return merged as LayoutContent;
  } catch {
    return defaults[locale].layout;
  }
}

export async function readPage(
  reader: AnyReader | null,
  locale: Locale,
  slug: string,
): Promise<PageDoc> {
  const fallback = defaults[locale].pages[slug] ?? defaults[locale].pages.home;

  if (!reader) return fallback;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries: { slug: string; entry: PageDoc }[] = await (
      reader.collections as Record<string, { all: () => Promise<any> }>
    )[`pages-${locale}`].all();
    const match = entries.find((e) => e.slug === slug);
    if (!match?.entry?.sections?.length) return fallback;

    const cmsSections = match.entry.sections;
    const sections = cmsSections.map((cms, i) => mergeSection(fallback.sections[i], cms));
    return {
      title: match.entry.title || fallback.title,
      description: match.entry.description || fallback.description,
      sections,
    };
  } catch {
    return fallback;
  }
}

/** Read everything a page render needs, in one call. */
export async function readPageBundle(
  reader: AnyReader | null,
  locale: Locale = defaultLocale,
  slug: string,
): Promise<PageBundle> {
  const [layout, page] = await Promise.all([readLayout(reader, locale), readPage(reader, locale, slug)]);
  return { layout, page };
}
