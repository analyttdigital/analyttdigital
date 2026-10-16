import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Builder access guard (M2 stub, M7 owns the real check). Development bypasses
 * auth via `BUILDER_DEV_BYPASS_AUTH=true` (or any non-production env);
 * production denies everything until NextAuth lands in M7.
 */
export function isDevBypass(): boolean {
  return process.env.BUILDER_DEV_BYPASS_AUTH === "true" || process.env.NODE_ENV !== "production";
}

/** Returns true when the request may proceed; otherwise sends 401. */
export function assertBuilderAccess(_req: NextApiRequest, res: NextApiResponse): boolean {
  // M7: verify the NextAuth session, then the BUILDER_ALLOWED_USERS allowlist
  // or GitHub push permission via Octokit.
  if (isDevBypass()) return true;
  res.status(401).json({ error: "Unauthorized: sign in with GitHub", code: "UNAUTHORIZED" });
  return false;
}
