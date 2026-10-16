import { z } from "zod";

import { PuckDataSchema } from "./page";

/**
 * Shared-document schemas (M2, generalized M6). Header/footer/announcement/
 * sidebar docs all reuse Puck's native data shape so one editor edits them
 * all (M3 document switcher, M6 globals). Any kebab-case doc name is allowed;
 * only `layouts` gets its own file shape. `layouts.json` picks which docs
 * wrap each page.
 */

export const SharedDocSchema = z.object({
  schemaVersion: z.literal(1),
  puck: PuckDataSchema,
});

export type SharedDoc = z.infer<typeof SharedDocSchema>;

export function blankSharedDoc(): SharedDoc {
  return {
    schemaVersion: 1,
    puck: { content: [], root: { props: {} }, zones: {} },
  };
}

const DOC_SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

export function assertValidSharedDocName(doc: string): void {
  if (!DOC_SLUG_RE.test(doc)) {
    throw new Error(`Invalid shared doc "${doc}": use lowercase letters, numbers, hyphens`);
  }
}

export function sharedDocFile(doc: string): string {
  assertValidSharedDocName(doc);
  return `shared/${doc}.json`;
}

export function isLayoutsDoc(doc: string): boolean {
  return doc === "layouts";
}

const LayoutSchema = z.object({
  id: z.string().min(1),
  name: z.string().default(""),
  header: z.string().nullable().default(null),
  footer: z.string().nullable().default(null),
  announcement: z.string().nullable().default(null),
  sidebar: z.string().nullable().default(null),
  shell: z.enum(["page", "dashboard"]).default("page"),
});

export type LayoutEntry = z.infer<typeof LayoutSchema>;

export const LayoutsFileSchema = z.object({
  schemaVersion: z.literal(1),
  layouts: z.array(LayoutSchema),
});

export type LayoutsFile = z.infer<typeof LayoutsFileSchema>;

/** Fresh-repo default: header + footer docs, page shell. */
export function blankLayoutsFile(): LayoutsFile {
  return {
    schemaVersion: 1,
    layouts: [
      {
        id: "default",
        name: "Default",
        header: "header",
        footer: "footer",
        announcement: null,
        sidebar: null,
        shell: "page",
      },
    ],
  };
}
