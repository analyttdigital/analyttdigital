import type { NextApiRequest, NextApiResponse } from "next";

import { assertBuilderAccess } from "@/builder/auth/guard";
import { methodNotAllowed, sendStoreError } from "@/builder/http";
import type { LayoutsFile, SharedDoc } from "@/builder/schema/shared";
import {
  LayoutsFileSchema,
  SharedDocSchema,
  assertValidSharedDocName,
  blankLayoutsFile,
  blankSharedDoc,
  isLayoutsDoc,
  sharedDocFile,
} from "@/builder/schema/shared";
import { InvalidContentError } from "@/builder/storage/types";
import { getStore } from "@/builder/storage";

function parseSharedDoc(doc: string, data: unknown): SharedDoc | LayoutsFile {
  return isLayoutsDoc(doc) ? LayoutsFileSchema.parse(data) : SharedDocSchema.parse(data);
}

function blankFor(doc: string): SharedDoc | LayoutsFile {
  return isLayoutsDoc(doc) ? blankLayoutsFile() : blankSharedDoc();
}

/**
 * GET `?doc=<name>`: read a shared doc (validated). `layouts` falls back to
 * the built-in default on a fresh repo; other missing docs 404.
 * PUT `{ doc, data, sha? }`: validate, then atomic write. Missing docs are
 * created from a blank template on first PUT.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (!assertBuilderAccess(req, res)) return;
  const store = getStore();

  try {
    if (req.method === "GET") {
      const doc = req.query.doc;
      if (typeof doc !== "string") {
        res.status(400).json({ error: "Query requires `?doc=<name>`", code: "BAD_REQUEST" });
        return;
      }
      assertValidSharedDocName(doc);
      const file = sharedDocFile(doc);
      const stored = await store.read<unknown>(file);
      if (stored === null) {
        if (isLayoutsDoc(doc)) {
          res.status(200).json({ data: blankLayoutsFile(), sha: undefined, default: true });
          return;
        }
        res.status(404).json({ error: `Shared doc "${doc}" not found`, code: "NOT_FOUND" });
        return;
      }
      try {
        const data = parseSharedDoc(doc, stored.data);
        res.status(200).json({ data, sha: stored.sha });
      } catch {
        throw new InvalidContentError(file, "stored shared doc failed schema validation");
      }
      return;
    }

    if (req.method === "PUT") {
      const body = req.body as { doc?: unknown; data?: unknown; sha?: unknown };
      if (typeof body.doc !== "string") {
        res.status(400).json({ error: "Body requires a string `doc`", code: "BAD_REQUEST" });
        return;
      }
      assertValidSharedDocName(body.doc);
      if (body.sha !== undefined && typeof body.sha !== "string") {
        res.status(400).json({ error: "`sha` must be a string when provided", code: "BAD_REQUEST" });
        return;
      }
      const file = sharedDocFile(body.doc);
      const data = body.data !== undefined ? parseSharedDoc(body.doc, body.data) : blankFor(body.doc);
      const result = await store.write(
        [
          {
            path: file,
            content: JSON.stringify(data, null, 2) + "\n",
            sha: body.sha,
          },
        ],
        `Save shared doc ${body.doc} via builder`,
      );
      res.status(200).json({ doc: body.doc, ...result });
      return;
    }

    methodNotAllowed(res, ["GET", "PUT"]);
  } catch (err) {
    sendStoreError(res, err);
  }
}
