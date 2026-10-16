import type { NextApiRequest, NextApiResponse } from "next";

import { assertBuilderAccess } from "@/builder/auth/guard";
import { methodNotAllowed, sendStoreError } from "@/builder/http";
import type { LayoutsFile, SharedDoc } from "@/builder/schema/shared";
import {
  LayoutsFileSchema,
  SharedDocSchema,
  assertValidSharedDoc,
  blankSharedDoc,
  sharedDocFile,
} from "@/builder/schema/shared";
import { InvalidContentError } from "@/builder/storage/types";
import { getStore } from "@/builder/storage";

function parseSharedDoc(doc: "header" | "footer" | "layouts", data: unknown): SharedDoc | LayoutsFile {
  return doc === "layouts" ? LayoutsFileSchema.parse(data) : SharedDocSchema.parse(data);
}

/**
 * GET `?doc=header|footer|layouts`: read a shared doc (validated).
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
        res.status(400).json({ error: "Query requires `?doc=header|footer|layouts`", code: "BAD_REQUEST" });
        return;
      }
      assertValidSharedDoc(doc);
      const file = sharedDocFile(doc);
      const stored = await store.read<unknown>(file);
      if (stored === null) {
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
        res.status(400).json({ error: "Body requires `doc: header|footer|layouts`", code: "BAD_REQUEST" });
        return;
      }
      assertValidSharedDoc(body.doc);
      if (body.sha !== undefined && typeof body.sha !== "string") {
        res.status(400).json({ error: "`sha` must be a string when provided", code: "BAD_REQUEST" });
        return;
      }
      const file = sharedDocFile(body.doc);
      const data =
        body.data !== undefined ? parseSharedDoc(body.doc, body.data) : blankSharedDoc();
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
