import fs from 'node:fs';
import path from 'node:path';

import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../keystatic.config';

import { BLOG_PAGE_SIZE } from '@/lib/content/blog';
import { listPosts, listPageSlugs } from '@/lib/content/reader';
import { site } from '@/lib/site';
import type { Locale } from '@/lib/content/types';

/** Build-time crawler file generator (K8). Pages Router only — no App Router
 *  `sitemap.ts`. Runs as `postbuild` after `next build` and writes into
 *  `public/` using Keystatic's build-time reader (never HTTP).
 *
 *  Reads code-default + CMS content for the single `en` locale and emits:
 *  - `sitemap.xml` — every page/post/blog route with `lastmod`
 *  - `robots.txt` — crawl rules + `Sitemap:` line
 *  - `feed.xml` — RSS 2.0 of recent posts
 *  - `llms.txt` — machine-readable index of pages and posts
 *  - `.well-known/security.txt` — contact mailto (only when an email exists)
 *
 *  Keystatic arrays/collections start empty, so the reader falls back to
 *  code defaults; a fresh checkout still renders a complete sitemap.
 */

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const LOCALE: Locale = 'en';

function abs(url: string): string {
  try {
    return new URL(url, site.url).toString();
  } catch {
    return url;
  }
}

function xmlEscape(value: string): string {
  return value.replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;',
    };
    return map[c] ?? c;
  });
}

function buildDate(): string {
  return new Date().toISOString().split('T')[0];
}

async function main() {
  // `any` mirrors `getStaticProps.ts`, which types the config-bound reader
  // this way because `createReader(cwd, config)` is more specific than the
  // generic `ReturnType<typeof createReader>` the readers expect.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reader: any = createReader(process.cwd(), keystaticConfig);
  const now = buildDate();

  /** Collect canonical URLs (deduped): code-default + CMS pages/posts. */
  const urls = new Map<string, string>(); // url -> lastmod

  // Pages: home maps to `/`, every other slug to `/${slug}`.
  for (const slug of await listPageSlugs(reader, LOCALE)) {
    const url = slug === 'home' ? '/' : `/${slug}`;
    urls.set(url, now);
  }

  // Posts + blog index / pagination.
  const posts = await listPosts(reader, LOCALE);
  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE));
  urls.set('/blog', now);
  for (let p = 2; p <= totalPages; p++) urls.set(`/blog/page/${p}`, now);
  for (const post of posts) {
    urls.set(`/blog/${post.slug}`, post.publishedAt || now);
  }

  const urlList = [...urls.entries()].map(([url, lastmod]) => ({ url, lastmod }));

  // --- sitemap.xml ---
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urlList
      .map(
        ({ url, lastmod }) =>
          `  <url><loc>${xmlEscape(abs(url))}</loc><lastmod>${lastmod}</lastmod></url>`,
      )
      .join('\n') +
    '\n</urlset>\n';
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);

  // --- robots.txt ---
  const robots =
    `# ${site.name}\n` +
    'User-agent: *\n' +
    'Allow: /\n' +
    'Disallow: /keystatic/\n' +
    'Disallow: /api/\n' +
    'Disallow: /_next/\n' +
    `Sitemap: ${abs('/sitemap.xml')}\n`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robots);

  // --- feed.xml (RSS 2.0) ---
  const recent = posts.slice(0, 20);
  const feed =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n' +
    '<channel>\n' +
    `  <title>${xmlEscape(site.name)}</title>\n` +
    `  <link>${abs('/blog')}</link>\n` +
    `  <description>${xmlEscape(site.description)}</description>\n` +
    // RSS dates are RFC 822; a bare ISO date is not parseable by all readers.
    `  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n` +
    `  <atom:link href="${abs('/feed.xml')}" rel="self" type="application/rss+xml"/>\n` +
    recent
      .map(
        (post) =>
          `  <item>\n` +
          `    <title>${xmlEscape(post.title)}</title>\n` +
          `    <link>${abs(`/blog/${post.slug}`)}</link>\n` +
          `    <guid isPermaLink="false">${abs(`/blog/${post.slug}`)}</guid>\n` +
          `    <pubDate>${new Date(post.publishedAt || now).toUTCString()}</pubDate>\n` +
          `    <author>${xmlEscape(post.author)}</author>\n` +
          `    <description>${xmlEscape(post.excerpt)}</description>\n` +
          `  </item>\n`,
      )
      .join('') +
    '</channel>\n</rss>\n';
  fs.writeFileSync(path.join(PUBLIC_DIR, 'feed.xml'), feed);

  // --- llms.txt --- (posts split out; an LLM index of one thing is a sitemap)
  const pageUrls = urlList.filter(({ url }) => !url.startsWith('/blog/'));
  const postUrls = urlList.filter(({ url }) => url.startsWith('/blog/'));
  const llms =
    `# ${site.name}\n` +
    `${site.description}\n\n` +
    '## Pages\n' +
    pageUrls.map(({ url }) => `- [${url}](${abs(url)})`).join('\n') +
    '\n\n## Posts\n' +
    postUrls.map(({ url }) => `- [${url}](${abs(url)})`).join('\n') +
    '\n';
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llms);

  // --- .well-known/security.txt (only when a contact email exists) ---
  if (site.email) {
    const securityDir = path.join(PUBLIC_DIR, '.well-known');
    fs.mkdirSync(securityDir, { recursive: true });
    fs.writeFileSync(
      path.join(securityDir, 'security.txt'),
      `Contact: mailto:${site.email}\n`,
    );
  }

  console.log(
    `generate-seo-files: wrote public/sitemap.xml (${urlList.length} URLs), public/robots.txt, public/feed.xml (${recent.length} posts), public/llms.txt, public/.well-known/security.txt`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
