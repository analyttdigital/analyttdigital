import { fileToSlug, slugToFile } from "@/builder/schema/page";

/**
 * Builder public-URL mapping (M3). Builder pages live under `/p` so they can
 * never swallow the existing site routes (`/`, `/blog`, `/sw`, ...):
 *
 *   file `pages/home.json` (meta.path `/`)        → route `/p`
 *   file `pages/pricing.json` (meta.path `/pricing`) → route `/p/pricing`
 *
 * Slugs stay single-segment kebab-case (see `slugToFile`); anything else is
 * a 404.
 */

/** Catch-all segments (`/p/[[...slug]]`) back to a page slug, or null (404). */
export function routeToSlug(segments: string[] | undefined): string | null {
  if (segments === undefined || segments.length === 0) return "home";
  if (segments.length !== 1) return null;
  try {
    slugToFile(segments[0]);
    return segments[0];
  } catch {
    return null;
  }
}

/** Page slug to its public route. */
export function slugToRoute(slug: string): string {
  return slug === "home" ? "/p" : `/p/${slug}`;
}

/** Stored filename (`pages/<slug>.json`) back to its public route, or null. */
export function fileToRoute(file: string): string | null {
  const slug = fileToSlug(file);
  return slug ? slugToRoute(slug) : null;
}
