import { z } from "zod";

/**
 * Page document schema (M2). Matches PROJECT.md 3.3: our `meta` envelope
 * around Puck's native data shape. Puck internals are validated structurally
 * (`type` + `props`) and pass through untouched — component prop validation
 * against each component's Zod schema happens in the registry (M5).
 */

export const ComponentDataSchema = z.looseObject({
  type: z.string().min(1),
  id: z.string().optional(),
  props: z.record(z.string(), z.unknown()),
});

export type ComponentData = z.infer<typeof ComponentDataSchema>;

export const PuckDataSchema = z.looseObject({
  content: z.array(ComponentDataSchema),
  root: z.looseObject({
    props: z.record(z.string(), z.unknown()),
  }),
  zones: z.record(z.string(), z.array(ComponentDataSchema)),
});

export type PuckData = z.infer<typeof PuckDataSchema>;

export const PageMetaSchema = z.object({
  title: z.string(),
  description: z.string().default(""),
  /** URL path this page renders at, e.g. `/` or `/pricing`. */
  path: z.string().regex(/^\//, "path must start with /"),
  /** Layout id from `shared/layouts.json`. */
  layout: z.string().default("default"),
  ogImage: z.string().default(""),
});

export type PageMeta = z.infer<typeof PageMetaSchema>;

export const PageSchema = z.object({
  schemaVersion: z.literal(1),
  meta: PageMetaSchema,
  puck: PuckDataSchema,
  draft: z.boolean().default(false),
});

export type Page = z.infer<typeof PageSchema>;

/** Blank page for POST /api/builder/pages (create). */
export function blankPage(slug: string): Page {
  return {
    schemaVersion: 1,
    meta: {
      title: slug,
      description: "",
      path: slug === "home" ? "/" : `/${slug}`,
      layout: "default",
      ogImage: "",
    },
    puck: { content: [], root: { props: {} }, zones: {} },
    draft: true,
  };
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

export function assertValidSlug(slug: string): void {
  if (!SLUG_RE.test(slug)) {
    throw new Error(`Invalid slug "${slug}": use lowercase letters, numbers, hyphens`);
  }
}

export function slugToFile(slug: string): string {
  assertValidSlug(slug);
  return `pages/${slug}.json`;
}

export function fileToSlug(file: string): string | null {
  const m = /^pages\/([a-z0-9][a-z0-9-]*)\.json$/.exec(file);
  return m ? m[1] : null;
}
