import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { Octokit } from "@octokit/rest";

import { authOptions } from "@/pages/api/auth/[...nextauth]";

/**
 * Builder access guard (M7). Development bypasses auth via
 * `BUILDER_DEV_BYPASS_AUTH=true` (or any non-production env). In production
 * the caller needs a GitHub session that is either on `BUILDER_ALLOWED_USERS`
 * or holds push permission on the content repo (checked via Octokit).
 */

export function isDevBypass(): boolean {
  return process.env.BUILDER_DEV_BYPASS_AUTH === "true" || process.env.NODE_ENV !== "production";
}

export function sessionLogin(session: { user?: unknown } | null): string | null {
  const login = (session?.user as { login?: unknown } | undefined)?.login;
  return typeof login === "string" && login.length > 0 ? login : null;
}

function allowlist(): string[] {
  return (process.env.BUILDER_ALLOWED_USERS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);
}

/**
 * Push permission check, injectable for tests. Production constructs the
 * default checker from `GITHUB_TOKEN`; tests pass a stub.
 */
export async function hasPushPermission(
  login: string,
  check?: (login: string) => Promise<boolean>,
): Promise<boolean> {
  if (check) return check(login);
  const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } = process.env;
  if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) return false;
  try {
    const octokit = new Octokit({ auth: GITHUB_TOKEN });
    const res = await octokit.rest.repos.getCollaboratorPermissionLevel({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      username: login,
    });
    return ["admin", "maintain", "write"].includes(res.data.permission);
  } catch {
    return false;
  }
}

export async function isAuthorized(
  login: string | null,
  check?: (login: string) => Promise<boolean>,
): Promise<boolean> {
  if (!login) return false;
  const allowed = allowlist();
  if (allowed.length > 0) return allowed.includes(login.toLowerCase());
  return hasPushPermission(login, check);
}

/** Returns true when the request may proceed; otherwise sends 401/403. */
export async function assertBuilderAccess(
  req: NextApiRequest,
  res: NextApiResponse,
  check?: (login: string) => Promise<boolean>,
): Promise<boolean> {
  if (isDevBypass()) return true;
  const session = await getServerSession(req, res, authOptions);
  const login = sessionLogin(session);
  if (!login) {
    res.status(401).json({ error: "Unauthorized: sign in with GitHub", code: "UNAUTHORIZED" });
    return false;
  }
  if (!(await isAuthorized(login, check))) {
    res.status(403).json({ error: "Forbidden: no publish access to this repo", code: "FORBIDDEN" });
    return false;
  }
  return true;
}
