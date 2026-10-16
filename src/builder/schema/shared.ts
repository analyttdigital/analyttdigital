import { z } from "zod";

import { PuckDataSchema } from "./page";

/**
 * Shared-document schemas (M2). Header/footer docs reuse Puck's native data
 * shape so the same editor edits them (M3 document switcher, M6 layouts).
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

export const SHARED_DOCS = ["header", "footer", "layouts"] as const;

export type SharedDocName = (typeof SHARED_DOCS)[number];

export function assertValidSharedDoc(doc: string): asserts doc is SharedDocName {
  if (!(SHARED_DOCS as readonly string[]).includes(doc)) {
    throw new Error(`Invalid shared doc "${doc}": expected header, footer, or layouts`);
  }
}

export function sharedDocFile(doc: SharedDocName): string {
  return `shared/${doc}.json`;
}

const LayoutSchema = z.object({
  id: z.string().min(1),
  name: z.string().default(""),
  header: z.string().nullable().default(null),
  footer: z.string().nullable().default(null),
});

export const LayoutsFileSchema = z.object({
  schemaVersion: z.literal(1),
  layouts: z.array(LayoutSchema),
});

export type LayoutsFile = z.infer<typeof LayoutsFileSchema>;
