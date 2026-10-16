import type { NextApiRequest, NextApiResponse } from "next";

import { assertBuilderAccess } from "@/builder/auth/guard";
import { methodNotAllowed, sendStoreError } from "@/builder/http";
import { PageSchema, blankPage, fileToSlug, slugToFile } from "@/builder/schema/page";
import { getStore } from "@/builder/storage";
import { beginDraftPublish, finishDraftPublish } from "@/builder/storage/publish";

/**
 * GET: list page slugs. POST: create a page (`{ slug, data? }`).
 * DELETE `?slug=`: delete a page. Auth: dev bypass (M7 wires NextAuth).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (!(await assertBuilderAccess(req, res))) return;
  const store = getStore();

  try {
    if (req.method === "GET") {
      const files = await store.list("pages");
      const pages = files
        .map((f) => fileToSlug(f))
        .filter((s): s is string => s !== null)
        .sort();
      res.status(200).json({ pages });
      return;
    }

    if (req.method === "POST") {
      const body = req.body as { slug?: unknown; data?: unknown };
      if (typeof body.slug !== "string") {
        res.status(400).json({ error: "Body requires a string `slug`", code: "BAD_REQUEST" });
        return;
      }
      const file = slugToFile(body.slug);
      const existing = await store.read(file);
      if (existing !== null) {
        res.status(409).json({ error: `Page "${body.slug}" already exists`, code: "PAGE_EXISTS" });
        return;
      }
      const page = body.data !== undefined ? PageSchema.parse(body.data) : blankPage(body.slug);
      const draft = await beginDraftPublish();
      const result = await store.write(
        [{ path: file, content: JSON.stringify(page, null, 2) + "\n" }],
        `Create page ${body.slug} via builder`,
      );
      const pr = await finishDraftPublish(draft);
      res.status(201).json({ slug: body.slug, ...result, ...pr });
      return;
    }

    if (req.method === "DELETE") {
      const slug = req.query.slug;
      if (typeof slug !== "string") {
        res.status(400).json({ error: "Query requires `?slug=`", code: "BAD_REQUEST" });
        return;
      }
      const file = slugToFile(slug);
      const existing = await store.read(file);
      if (existing === null) {
        res.status(404).json({ error: `Page "${slug}" not found`, code: "NOT_FOUND" });
        return;
      }
      const draft = await beginDraftPublish();
      await store.delete(file, `Delete page ${slug} via builder`);
      const pr = await finishDraftPublish(draft);
      res.status(200).json({ deleted: slug, ...pr });
      return;
    }

    methodNotAllowed(res, ["GET", "POST", "DELETE"]);
  } catch (err) {
    sendStoreError(res, err);
  }
}
