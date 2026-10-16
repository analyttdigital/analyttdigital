import type { NextApiResponse } from "next";
import { ZodError } from "zod";

import { ConflictError, InvalidContentError } from "@/builder/storage/types";

/**
 * Shared API-route error mapping (M2). Storage and validation errors become
 * stable `{ error, code }` payloads; anything unexpected is a 500.
 */
export function sendStoreError(res: NextApiResponse, err: unknown): void {
  if (err instanceof ConflictError) {
    res.status(409).json({ error: err.message, code: "CONFLICT" });
    return;
  }
  if (err instanceof InvalidContentError) {
    res.status(422).json({ error: err.message, code: "INVALID_CONTENT" });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Validation failed", code: "BAD_REQUEST", issues: err.issues });
    return;
  }
  if (err instanceof Error && /^Invalid (slug|shared doc)/.test(err.message)) {
    res.status(400).json({ error: err.message, code: "BAD_REQUEST" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal error", code: "INTERNAL" });
}

export function methodNotAllowed(res: NextApiResponse, allow: string[]): void {
  res.setHeader("Allow", allow.join(", "));
  res.status(405).json({ error: `Method not allowed. Use: ${allow.join(", ")}`, code: "METHOD_NOT_ALLOWED" });
}
