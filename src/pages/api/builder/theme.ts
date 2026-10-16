import type { NextApiRequest, NextApiResponse } from "next";

import { assertBuilderAccess } from "@/builder/auth/guard";
import { methodNotAllowed, sendStoreError } from "@/builder/http";
import { defaultTheme } from "@/builder/theme/defaults";
import { getStore } from "@/builder/storage";
import { beginDraftPublish, finishDraftPublish } from "@/builder/storage/publish";
import { InvalidContentError } from "@/builder/storage/types";
import { parseThemeFile } from "@/builder/schema/theme-file";

const THEME_FILE = "theme.json";

/**
 * GET: read theme tokens (validated). PUT `{ data, sha? }`: validate with
 * `ThemeSchema`, then atomic write. Stale `sha` yields 409.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (!(await assertBuilderAccess(req, res))) return;
  const store = getStore();

  try {
    if (req.method === "GET") {
      const stored = await store.read<unknown>(THEME_FILE);
      if (stored === null) {
        res.status(200).json({ data: defaultTheme, sha: undefined, default: true });
        return;
      }
      try {
        const data = parseThemeFile(stored.data);
        res.status(200).json({ data, sha: stored.sha });
      } catch {
        throw new InvalidContentError(THEME_FILE, "stored theme failed schema validation");
      }
      return;
    }

    if (req.method === "PUT") {
      const body = req.body as { data?: unknown; sha?: unknown };
      if (body.sha !== undefined && typeof body.sha !== "string") {
        res.status(400).json({ error: "`sha` must be a string when provided", code: "BAD_REQUEST" });
        return;
      }
      const theme = parseThemeFile(body.data);
      const draft = await beginDraftPublish();
      const result = await store.write(
        [
          {
            path: THEME_FILE,
            content: JSON.stringify(theme, null, 2) + "\n",
            sha: body.sha,
          },
        ],
        "Save theme via builder",
      );
      const pr = await finishDraftPublish(draft);
      res.status(200).json({ ...result, ...pr });
      return;
    }

    methodNotAllowed(res, ["GET", "PUT"]);
  } catch (err) {
    sendStoreError(res, err);
  }
}
