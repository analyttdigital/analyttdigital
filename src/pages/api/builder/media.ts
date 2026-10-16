import type { NextApiRequest, NextApiResponse } from "next";

import { assertBuilderAccess } from "@/builder/auth/guard";
import { methodNotAllowed, sendStoreError } from "@/builder/http";
import {
  getMediaStore,
  sanitizeFilename,
  saveMedia,
  validateUpload,
} from "@/builder/storage/media";
import { beginDraftPublish, finishDraftPublish } from "@/builder/storage/publish";

export const config = {
  api: {
    // Base64 uploads ride in JSON; raise the default 1mb ceiling.
    bodyParser: { sizeLimit: "10mb" },
  },
};

/**
 * POST `{ filename, content (base64), mimeType? }`: validate, store under
 * `public/uploads/`, return `{ url, path }`. No multipart parser needed —
 * the editor reads files with FileReader and posts JSON.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (!(await assertBuilderAccess(req, res))) return;

  try {
    if (req.method !== "POST") {
      methodNotAllowed(res, ["POST"]);
      return;
    }
    const body = req.body as { filename?: unknown; content?: unknown };
    if (typeof body.filename !== "string" || typeof body.content !== "string") {
      res.status(400).json({ error: "Body requires `filename` and base64 `content`", code: "BAD_REQUEST" });
      return;
    }
    let bytes: Buffer;
    try {
      bytes = Buffer.from(body.content, "base64");
    } catch {
      res.status(400).json({ error: "`content` is not valid base64", code: "BAD_REQUEST" });
      return;
    }
    let stored: { url: string; path: string };
    try {
      const ext = validateUpload(body.filename, bytes.length);
      const filename = sanitizeFilename(body.filename, ext);
      const draft = await beginDraftPublish();
      stored = await saveMedia(getMediaStore(), filename, bytes, `Upload ${filename} via builder`);
      const pr = await finishDraftPublish(draft);
      res.status(201).json({ ...stored, ...pr });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed", code: "BAD_REQUEST" });
    }
  } catch (err) {
    sendStoreError(res, err);
  }
}
