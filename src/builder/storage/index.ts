import * as path from "path";

import { createFsStore } from "./fs-store";
import { createGithubStore } from "./github-store";
import type { ContentStore } from "./types";

/**
 * Adapter selection (M2). `BUILDER_STORAGE=github` plus repo credentials
 * selects the GitHub adapter; anything else (including unset) falls back to
 * the local filesystem, which is also the dev default.
 */

let cached: ContentStore | null = null;

/** Test-only: drop the memoized store so env changes take effect. */
export function resetStoreForTests(): void {
  cached = null;
}

export function getStore(): ContentStore {
  if (cached) return cached;
  if (
    process.env.BUILDER_STORAGE === "github" &&
    process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO &&
    process.env.GITHUB_TOKEN
  ) {
    cached = createGithubStore({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      // Draft mode (M7): commits land on the draft branch for PR review.
      branch: process.env.BUILDER_DRAFT_BRANCH || process.env.BUILDER_BRANCH || "main",
      token: process.env.GITHUB_TOKEN,
    });
  } else {
    cached = createFsStore(path.join(process.cwd(), "src", "content"));
  }
  return cached;
}
