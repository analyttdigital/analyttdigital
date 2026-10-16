import type { NextApiRequest, NextApiResponse } from "next";

import { assertBuilderAccess } from "@/builder/auth/guard";
import { methodNotAllowed, sendStoreError } from "@/builder/http";
import { PageSchema, slugToFile } from "@/builder/schema/page";
import { InvalidContentError } from "@/builder/storage/types";
import { getStore } from "@/builder/storage";

/**
 * GET `?slug=`: read one page (validated). PUT `{ slug, data, sha? }`:
 * validate with Zod, then atomic write. Stale `sha` yields 409.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (!assertBuilderAccess(req, res)) return;
  const store = getStore();

  try {
    if (req.method === "GET") {
      const slug = req.query.slug;
      if (typeof slug !== "string") {
        res.status(400).json({ error: "Query requires `?slug=`", code: "BAD_REQUEST" });
        return;
      }
      const file = slugToFile(slug);
      const stored = await store.read<unknown>(file);
      if (stored === null) {
        res.status(404).json({ error: `Page "${slug}" not found`, code: "NOT_FOUND" });
        return;
      }
      try {
        const data = PageSchema.parse(stored.data);
        res.status(200).json({ data, sha: stored.sha });
      } catch {
        throw new InvalidContentError(file, "stored page failed schema validation");
      }
      return;
    }

    if (req.method === "PUT") {
      const body = req.body as { slug?: unknown; data?: unknown; sha?: unknown };
      if (typeof body.slug !== "string") {
        res.status(400).json({ error: "Body requires a string `slug`", code: "BAD_REQUEST" });
        return;
      }
      if (body.sha !== undefined && typeof body.sha !== "string") {
        res.status(400).json({ error: "`sha` must be a string when provided", code: "BAD_REQUEST" });
        return;
      }
      const file = slugToFile(body.slug);
      const page = PageSchema.parse(body.data);
      const result = await store.write(
        [
          {
            path: file,
            content: JSON.stringify(page, null, 2) + "\n",
            sha: body.sha,
          },
        ],
        `Save page ${body.slug} via builder`,
      );
      res.status(200).json({ slug: body.slug, ...result });
      return;
    }

    methodNotAllowed(res, ["GET", "PUT"]);
  } catch (err) {
    sendStoreError(res, err);
  }
}
