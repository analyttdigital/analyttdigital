import type { GetServerSideProps } from "next";

import { PageSchema, fileToSlug } from "@/builder/schema/page";
import { slugToRoute } from "@/builder/render/routes";

/**
 * Builder sitemap (M9.2). Lists every published builder page (`/p` + routes).
 * Served SSR so production always reflects the GitHub content, not the last
 * static build. Keystatic site routes are out of scope for this file.
 */

export function builderSitemapUrls(slugs: string[]): string[] {
  return slugs.map((slug) => slugToRoute(slug));
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderSitemap(paths: string[], origin: string): string {
  const urls = paths
    .map((path) => `  <url><loc>${escapeXml(`${origin}${path}`)}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { getStore } = await import("@/builder/storage");
  const store = getStore();
  const files = await store.list("pages");
  const slugs: string[] = [];
  for (const file of files) {
    const slug = fileToSlug(file);
    if (!slug) continue;
    const entry = await store.read<unknown>(file);
    if (!entry) continue;
    const parsed = PageSchema.safeParse(entry.data);
    if (!parsed.success || parsed.data.draft) continue;
    slugs.push(slug);
  }
  const proto = (req.headers["x-forwarded-proto"] as string | undefined) ?? "https";
  const host = (req.headers.host as string | undefined) ?? "localhost:3000";
  const xml = renderSitemap(builderSitemapUrls(slugs), `${proto}://${host}`);
  res.setHeader("content-type", "application/xml");
  res.write(xml);
  res.end();
  return { props: {} };
};

export default function Sitemap(): null {
  return null;
}
