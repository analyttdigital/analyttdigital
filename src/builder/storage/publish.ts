import { Octokit } from "@octokit/rest";

/**
 * Draft-branch publish flow (M7). When `BUILDER_DRAFT_BRANCH` is set (and
 * GitHub storage is active), writes commit to the draft branch instead of
 * `BUILDER_BRANCH`, and the API ensures an open PR back to the base branch.
 * Without it, writes commit straight to the base branch and the host
 * redeploys. Narrow `PublishApi` seam keeps Octokit at the edge for tests.
 */

export interface PublishApi {
  ensureBranch(base: string, head: string): Promise<void>;
  ensurePR(base: string, head: string): Promise<{ url: string; created: boolean }>;
}

function isNotFound(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    (err as { status?: unknown }).status === 404
  );
}

export class OctokitPublishApi implements PublishApi {
  constructor(
    private readonly octokit: Octokit,
    private readonly owner: string,
    private readonly repo: string,
  ) {}

  async ensureBranch(base: string, head: string): Promise<void> {
    try {
      await this.octokit.rest.git.getRef({ owner: this.owner, repo: this.repo, ref: `heads/${head}` });
      return;
    } catch (err) {
      if (!isNotFound(err)) throw err;
    }
    const baseRef = await this.octokit.rest.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${base}`,
    });
    await this.octokit.rest.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${head}`,
      sha: baseRef.data.object.sha,
    });
  }

  async ensurePR(base: string, head: string): Promise<{ url: string; created: boolean }> {
    const open = await this.octokit.rest.pulls.list({
      owner: this.owner,
      repo: this.repo,
      state: "open",
      head: `${this.owner}:${head}`,
      base,
    });
    if (open.data.length > 0) {
      return { url: open.data[0].html_url, created: false };
    }
    const created = await this.octokit.rest.pulls.create({
      owner: this.owner,
      repo: this.repo,
      title: `Builder publish to ${head}`,
      head,
      base,
      body: "Opened automatically by the visual page builder.",
    });
    return { url: created.data.html_url, created: true };
  }
}

export interface DraftContext {
  base: string;
  head: string;
  api: PublishApi;
}

function publishApiFromEnv(): PublishApi | null {
  const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } = process.env;
  if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) return null;
  return new OctokitPublishApi(new Octokit({ auth: GITHUB_TOKEN }), GITHUB_OWNER, GITHUB_REPO);
}

/**
 * Before a write: in draft mode, make sure the draft branch exists.
 * Returns null when publishing straight to the base branch.
 */
export async function beginDraftPublish(api?: PublishApi): Promise<DraftContext | null> {
  const head = process.env.BUILDER_DRAFT_BRANCH;
  if (!head || process.env.BUILDER_STORAGE !== "github") return null;
  const resolvedApi = api ?? publishApiFromEnv();
  if (!resolvedApi) {
    // Dev with a stray BUILDER_DRAFT_BRANCH (or github mode without creds,
    // where the store already fell back to fs): skip PR flow, keep saving.
    console.warn("[builder] BUILDER_DRAFT_BRANCH set without repo credentials; publishing without a PR");
    return null;
  }
  const base = process.env.BUILDER_BRANCH || "main";
  await resolvedApi.ensureBranch(base, head);
  return { base, head, api: resolvedApi };
}

/** After a write: in draft mode, ensure the review PR exists. Never fails the save. */
export async function finishDraftPublish(
  ctx: DraftContext | null,
): Promise<{ prUrl?: string; prError?: string }> {
  if (!ctx) return {};
  try {
    const pr = await ctx.api.ensurePR(ctx.base, ctx.head);
    return { prUrl: pr.url };
  } catch (err) {
    return { prError: err instanceof Error ? err.message : "Could not open pull request" };
  }
}
