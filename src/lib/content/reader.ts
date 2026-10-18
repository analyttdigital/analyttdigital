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

/** Page-level featured image: an empty/absent CMS ref defers to the code
 *  default; when neither layer has a file the result is `{ src: '', alt: '' }`,
 *  which the head reads as "no image". */
function mergeImage(fallback: ContentImage | undefined, cmsValue: unknown): ContentImage {
  if (cmsValue == null || isEmptyImage(cmsValue)) return fallback ?? { src: '', alt: '' };
  return cmsValue as ContentImage;
}

/** Keystatic stores a conditional block as `{ discriminant, value }`; the
 *  renderer's contract is a flat `{ type, ...fields }` section. Normalize
 *  before merging, otherwise every CMS page section looks like an unknown
 *  `type` and never reaches its component. */
function normalizeSection(raw: unknown): Section {
  if (raw !== null && typeof raw === 'object' && 'discriminant' in raw && 'value' in raw) {
    const block = raw as { discriminant: string; value: Record<string, unknown> };
    return { ...(block.value ?? {}), type: block.discriminant } as Section;
  }
  return raw as Section;
}

function mergeSection(defaultsSection: Section | undefined, cmsSection: Section): Section {
  if (!defaultsSection || defaultsSection.type !== cmsSection.type) return cmsSection;
  const merged: Record<string, unknown> = { ...(defaultsSection as object) };
  for (const [k, v] of Object.entries(cmsSection as Record<string, unknown>)) {
    if (k === 'type') continue;
    const mergedValue = mergeValue(merged[k], v);
    // An empty CMS image/array with no code default merges to `undefined`;
    // drop the key instead — Next rejects `undefined` in getStaticProps props.
    if (mergedValue === undefined) delete merged[k];
    else merged[k] = mergedValue;
  }
  return merged as Section;
}

export async function readLayout(reader: AnyReader | null, locale: Locale): Promise<LayoutContent> {
  if (!reader) return defaults[locale].layout;
  try {
    const entry = await (reader.singletons as Record<string, { read: () => Promise<LayoutContent | null> }>)[
      'layout'
    ].read();
    if (!entry) return defaults[locale].layout;
    const merged: Record<string, unknown> = { ...(defaults[locale].layout as object) };
    for (const [k, v] of Object.entries(entry as Record<string, unknown>)) {
      const mergedValue = mergeValue(merged[k], v);
      if (mergedValue === undefined) delete merged[k];
      else merged[k] = mergedValue;
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
    ).pages.all();
    const match = entries.find((e) => e.slug === slug);
    if (!match?.entry?.sections?.length) return fallback ?? null;

    const cmsSections = (match.entry.sections as unknown[]).map(normalizeSection);
    const sections = cmsSections.map((cms, i) => mergeSection(fallback?.sections[i], cms));
    return {
      title: match.entry.title || fallback?.title || '',
      description: match.entry.description || fallback?.description || '',
      featuredImage: mergeImage(fallback?.featuredImage, match.entry.featuredImage),
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
      ).pages.list();
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
/* Posts: the `posts` collection merged over the code
 * defaults in `defaults[locale].blog.posts`, newest first. Rules mirror the
 * page layer: CMS values win, empty bodies defer to defaults, CMS-only posts
 * pass through, and an unknown slug is `null` (404, never home). */

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

/** Resolve a `fields.document` value to its node array (Keystatic 0.6.9 hands
 *  back a lazy loader for the sidecar `<slug>/body.mdoc`; anything else
 *  passes through when already an array). */
async function resolveBody(value: unknown): Promise<BlogBody> {
  // Keystatic 0.6.9 returns `fields.document` from `.all()` as a lazy loader
  // function (sidecar `<slug>/body.mdoc`); awaiting it yields the node array
  // the `DocumentRenderer` draws. Passing `{ resolveLinkedFiles: true }`
  // below eagerly resolves most entries — this covers any stragglers.
  if (typeof value === 'function') {
    try {
      const out = await (value as () => Promise<unknown>)();
      return (Array.isArray(out) ? out : []) as BlogBody;
    } catch {
      return [];
    }
  }
  return (Array.isArray(value) ? value : []) as BlogBody;
}

/** Deep-strip `undefined` from document nodes (`textAlign: undefined`, …) so
 *  posts survive Next's `getStaticProps` JSON serialization, which rejects
 *  `undefined` anywhere in props. Objects drop undefined keys; arrays map
 *  them to `null` to preserve child positions. */
function stripUndefined(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => (item === undefined ? null : stripUndefined(item)));
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      if (entry === undefined) continue;
      out[key] = stripUndefined(entry);
    }
    return out;
  }
  return value;
}

/** Fill a CMS post's missing keys so CMS-only posts render a full shape. */
async function normalizePost(raw: Record<string, unknown>): Promise<BlogPost> {
  return {
    slug: nonEmptyString(raw.slug) ? (raw.slug as string) : '',
    title: nonEmptyString(raw.title) ? (raw.title as string) : '',
    excerpt: nonEmptyString(raw.excerpt) ? (raw.excerpt as string) : '',
    category: nonEmptyString(raw.category) ? (raw.category as string) : '',
    publishedAt: nonEmptyString(raw.publishedAt) ? (raw.publishedAt as string) : '',
    author: nonEmptyString(raw.author) ? (raw.author as string) : 'Analytt Digital',
    featuredImage: asImage(raw.featuredImage),
    body: stripUndefined(await resolveBody(raw.body)) as BlogBody,
  };
}

/** Normalize a slug-or-title string to its bare-segment form for comparison:
 *  lowercase, apostrophes dropped, runs of other chars to one `-`. Lets a
 *  CMS entry whose `slug` holds title text (or a filename with slugify
 *  artifacts like `-t-`) still match its code default. */
function slugKey(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .toLowerCase()
    .replace(/[’‘'ʼ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Resolve a CMS entry to its canonical URL slug: the code-default slug
 *  when the entry matches one (by filename, frontmatter slug, or normalized
 *  comparison), else the filename itself (URL-safe by construction — never
 *  frontmatter title text). */
function canonicalPost(
  fallbacks: BlogPost[],
  filename: string,
  frontmatterSlug: unknown,
): { slug: string; fallback: BlogPost | undefined } {
  const front = nonEmptyString(frontmatterSlug) ? (frontmatterSlug as string) : '';
  const fallback = fallbacks.find(
    (f) =>
      f.slug === filename ||
      (front !== '' && f.slug === front) ||
      (front !== '' && slugKey(f.slug) === slugKey(front)) ||
      slugKey(f.slug) === slugKey(filename),
  );
  return { slug: fallback ? fallback.slug : filename, fallback };
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
    // `resolveLinkedFiles: true` eagerly reads the sidecar `<slug>/body.mdoc`
    // content-form fields (`fields.document`) into node arrays; without it
    // the reader returns a lazy loader function and the post page renders an
    // empty `<div class="max-w-[68ch]">` (caught on
    // `/blog/kenyas-digital-advertising-landscape-in-2025`).
    const entries: { slug: string; entry: Record<string, unknown> }[] = await (
      reader.collections as Record<string, { all: (opts?: unknown) => Promise<any> }>
    ).posts.all({ resolveLinkedFiles: true });
    const merged: BlogPost[] = [];
    const seen = new Set<string>();
    for (const e of entries) {
      const { slug, fallback } = canonicalPost(fallbacks, e.slug, e.entry.slug);
      if (seen.has(slug)) continue;
      seen.add(slug);
      merged.push(mergePost(fallback, await normalizePost({ ...e.entry, slug })));
    }
    for (const fallback of fallbacks) {
      if (!seen.has(fallback.slug)) {
        seen.add(fallback.slug);
        merged.push(fallback);
      }
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
  return match;
}

/** Every post slug a locale can render. Used to pre-render post routes; posts
 *  added later still render on first request (`fallback: 'blocking'`). */
export async function listPostSlugs(reader: AnyReader | null, locale: Locale): Promise<string[]> {
  return (await listPosts(reader, locale)).map((p) => p.slug);
}
