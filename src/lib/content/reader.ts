import { createReader } from '@keystatic/core/reader';

import keystaticConfig from '../../../keystatic.config';
import { defaults } from '@/lib/content/defaults';
import {
  defaultLocale,
  type BlogBody,
  type BlogPost,
  type ContentImage,
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

/** Merge helpers: CMS values win; empty arrays and empty/missing `{ src }`
 *  image refs defer to defaults. `src` may be `null` when the upload-backed
 *  `fields.image` (M7) has no file chosen — that counts as empty too, so a
 *  half-filled Keystatic form still renders complete content. */
function isEmptyImage(value: unknown): boolean {
  if (typeof value !== 'object' || value === null || !('src' in value)) return false;
  const src = (value as { src: unknown }).src;
  return src == null || (typeof src === 'string' && src.trim() === '');
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

/* ------------------------------- blog --------------------------------- */
/* Posts (M8): `posts-<locale>` markdown collections merged over the code
 * defaults in `defaults[locale].blog.posts`, newest first. Rules mirror the
 * page layer: CMS values win, empty bodies defer to defaults, CMS-only posts
 * pass through, and an unknown slug is `null` (404, never home). While the SW
 * translations land, a bodyless SW post borrows its EN peer's body so the
 * `/sw/blog/<slug>` URL stays readable (recorded M8 gap). */

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

/** True when a document node carries something the renderer would draw: prose
 *  (marks beside `text` add nothing on their own), an image with a `src`, or a
 *  component block with a filled prop (an `embed` with a URL renders). */
function hasDocContent(node: unknown): boolean {
  if (typeof node !== 'object' || node === null) {
    return typeof node === 'string' && node.trim() !== '';
  }
  const o = node as Record<string, unknown>;
  if (o.type === 'image') return nonEmptyString(o.src);
  if (o.type === 'component-block') {
    const props = o.props as Record<string, unknown> | undefined;
    return !!props && Object.values(props).some((v) => hasDocContent(v));
  }
  if (typeof o.text === 'string') {
    if (o.text.trim() !== '') return true;
    const marks = new Set(['bold', 'italic', 'underline', 'strikethrough', 'code', 'superscript', 'subscript', 'keyboard']);
    return Object.keys(o).some((k) => k !== 'text' && !marks.has(k) && hasDocContent(o[k]));
  }
  return Array.isArray(o.children) && o.children.some(hasDocContent);
}

function isEmptyDocument(value: unknown): boolean {
  return !Array.isArray(value) || value.length === 0 || !value.some(hasDocContent);
}

function asImage(value: unknown): ContentImage {
  return value !== null &&
    typeof value === 'object' &&
    nonEmptyString((value as { src: unknown }).src)
    ? {
        src: (value as { src: string }).src,
        alt: typeof (value as { alt: unknown }).alt === 'string' ? (value as { alt: string }).alt : '',
      }
    : { src: '', alt: '' };
}

/** Fill a CMS post's missing keys so CMS-only posts render a full shape. */
function normalizePost(raw: Record<string, unknown>): BlogPost {
  return {
    slug: nonEmptyString(raw.slug) ? (raw.slug as string) : '',
    title: nonEmptyString(raw.title) ? (raw.title as string) : '',
    excerpt: nonEmptyString(raw.excerpt) ? (raw.excerpt as string) : '',
    category: nonEmptyString(raw.category) ? (raw.category as string) : '',
    publishedAt: nonEmptyString(raw.publishedAt) ? (raw.publishedAt as string) : '',
    author: nonEmptyString(raw.author) ? (raw.author as string) : 'Analytt Digital',
    featuredImage: asImage(raw.featuredImage),
    body: (Array.isArray(raw.body) ? raw.body : []) as BlogBody,
  };
}

function mergePost(fallback: BlogPost | undefined, cms: BlogPost): BlogPost {
  if (!fallback || fallback.slug !== cms.slug) return cms;
  return {
    slug: cms.slug,
    title: nonEmptyString(cms.title) ? cms.title : fallback.title,
    excerpt: nonEmptyString(cms.excerpt) ? cms.excerpt : fallback.excerpt,
    category: nonEmptyString(cms.category) ? cms.category : fallback.category,
    publishedAt: nonEmptyString(cms.publishedAt) ? cms.publishedAt : fallback.publishedAt,
    author: nonEmptyString(cms.author) ? cms.author : fallback.author,
    featuredImage: (mergeValue(fallback.featuredImage ?? { src: '', alt: '' }, cms.featuredImage) as ContentImage) ?? {
      src: '',
      alt: '',
    },
    body: isEmptyDocument(cms.body) ? fallback.body : cms.body,
  };
}

const byNewest = (a: BlogPost, b: BlogPost) => (b.publishedAt || '').localeCompare(a.publishedAt || '');

/** Every post a locale can render, newest first: CMS entries merged over code
 *  defaults, plus defaults with no CMS entry yet. */
export async function listPosts(reader: AnyReader | null, locale: Locale): Promise<BlogPost[]> {
  const fallbacks = defaults[locale].blog.posts;
  if (!reader) return [...fallbacks].sort(byNewest);
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries: { slug: string; entry: Record<string, unknown> }[] = await (
      reader.collections as Record<string, { all: () => Promise<any> }>
    )[`posts-${locale}`].all();
    const merged = entries.map((e) => {
      const cms = normalizePost({ ...e.entry, slug: nonEmptyString(e.entry.slug) ? e.entry.slug : e.slug });
      return mergePost(fallbacks.find((f) => f.slug === cms.slug), cms);
    });
    const seen = new Set(merged.map((p) => p.slug));
    for (const fallback of fallbacks) {
      if (!seen.has(fallback.slug)) merged.push(fallback);
    }
    return merged.filter((p) => p.slug).sort(byNewest);
  } catch {
    return [...fallbacks].sort(byNewest);
  }
}

/** One post by slug, or `null` for an unknown slug (the route answers 404). */
export async function readPost(
  reader: AnyReader | null,
  locale: Locale,
  slug: string,
): Promise<BlogPost | null> {
  const match = (await listPosts(reader, locale)).find((p) => p.slug === slug);
  if (!match) return null;
  if (isEmptyDocument(match.body) && locale !== defaultLocale) {
    const peer = (await listPosts(reader, defaultLocale)).find((p) => p.slug === slug);
    if (peer && !isEmptyDocument(peer.body)) return { ...match, body: peer.body };
  }
  return match;
}

/** Every post slug a locale can render. Used to pre-render post routes; posts
 *  added later still render on first request (`fallback: 'blocking'`). */
export async function listPostSlugs(reader: AnyReader | null, locale: Locale): Promise<string[]> {
  return (await listPosts(reader, locale)).map((p) => p.slug);
}
