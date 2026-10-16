import type { NextApiRequest, NextApiResponse } from "next";

import { assertBuilderAccess } from "@/builder/auth/guard";
import { methodNotAllowed, sendStoreError } from "@/builder/http";

/**
 * On-demand revalidation (M7). After a publish commit, the editor asks Next
 * to refresh the affected `/p/*` paths so the live site picks up the change
 * without waiting for a full redeploy. Only builder paths are revalidatable.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (!(await assertBuilderAccess(req, res))) return;

  try {
    if (req.method !== "POST") {
      methodNotAllowed(res, ["POST"]);
      return;
    }
    const body = req.body as { paths?: unknown };
    if (
      !Array.isArray(body.paths) ||
      body.paths.length === 0 ||
      !body.paths.every((p): p is string => typeof p === "string" && /^\/p(\/.*)?$/.test(p))
    ) {
      res.status(400).json({
        error: "Body requires `paths`: a non-empty array of `/p/*` routes",
        code: "BAD_REQUEST",
      });
      return;
    }
    const results: { path: string; ok: boolean; error?: string }[] = [];
    for (const path of body.paths) {
      try {
        await res.revalidate(path);
        results.push({ path, ok: true });
      } catch (err) {
        results.push({ path, ok: false, error: err instanceof Error ? err.message : "Revalidate failed" });
      }
    }
    res.status(200).json({ results });
  } catch (err) {
    sendStoreError(res, err);
  }
}
