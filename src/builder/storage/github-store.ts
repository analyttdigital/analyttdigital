import { Octokit } from "@octokit/rest";

import type { ContentStore, ReadResult, WriteResult } from "./types";
import { ConflictError, InvalidContentError } from "./types";

/**
 * GitHub adapter (M2). Used when `BUILDER_STORAGE=github`. Multi-file saves
 * go through the Git Data API (blobs → tree → commit → ref update) so one
 * save is always one atomic commit. Optimistic concurrency uses blob/file
 * shas; a lost race surfaces as `ConflictError` (HTTP 409 upstream).
 *
 * The narrow `GithubApi` seam keeps Octokit at the edge: unit tests inject a
 * fake, production injects `OctokitGithubApi`.
 */

export interface GithubFile {
  sha: string;
  text: string;
}

export interface GithubApi {
  getFile(path: string): Promise<GithubFile | null>;
  listDir(dir: string): Promise<string[]>;
  commitFiles(files: { path: string; content: string | Buffer }[], message: string): Promise<string>;
  deleteFile(path: string, message: string): Promise<void>;
}

function isNotFound(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    (err as { status?: unknown }).status === 404
  );
}

export class OctokitGithubApi implements GithubApi {
  constructor(
    private readonly octokit: Octokit,
    private readonly owner: string,
    private readonly repo: string,
    private readonly branch: string,
  ) {}

  async getFile(path: string): Promise<GithubFile | null> {
    let data: unknown;
    try {
      const res = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });
      data = res.data;
    } catch (err) {
      if (isNotFound(err)) return null;
      throw err;
    }
    if (Array.isArray(data)) throw new Error(`Expected a file at ${path}, found a directory`);
    if (typeof data !== "object" || data === null || !("sha" in data)) {
      throw new Error(`Unexpected getContent response at ${path}`);
    }
    const file = data as { sha: string; content?: string };
    const text = file.content
      ? Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8")
      : "";
    return { sha: file.sha, text };
  }

  async listDir(dir: string): Promise<string[]> {
    let data: unknown;
    try {
      const res = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: dir,
        ref: this.branch,
      });
      data = res.data;
    } catch (err) {
      if (isNotFound(err)) return [];
      throw err;
    }
    if (!Array.isArray(data)) return [];
    return (data as { name: string }[]).map((e) => e.name).sort();
  }

  async commitFiles(
    files: { path: string; content: string | Buffer }[],
    message: string,
  ): Promise<string> {
    const blobs = await Promise.all(
      files.map(async (f) => {
        const bytes = typeof f.content === "string" ? Buffer.from(f.content, "utf8") : f.content;
        const blob = await this.octokit.rest.git.createBlob({
          owner: this.owner,
          repo: this.repo,
          content: bytes.toString("base64"),
          encoding: "base64",
        });
        return { path: f.path, mode: "100644" as const, type: "blob" as const, sha: blob.data.sha };
      }),
    );
    const ref = await this.octokit.rest.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.branch}`,
    });
    const headSha = ref.data.object.sha;
    const head = await this.octokit.rest.git.getCommit({
      owner: this.owner,
      repo: this.repo,
      commit_sha: headSha,
    });
    const tree = await this.octokit.rest.git.createTree({
      owner: this.owner,
      repo: this.repo,
      base_tree: head.data.tree.sha,
      tree: blobs,
    });
    const commit = await this.octokit.rest.git.createCommit({
      owner: this.owner,
      repo: this.repo,
      message,
      tree: tree.data.sha,
      parents: [headSha],
    });
    await this.octokit.rest.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.branch}`,
      sha: commit.data.sha,
    });
    return commit.data.sha;
  }

  async deleteFile(path: string, message: string): Promise<void> {
    const current = await this.getFile(path);
    // Idempotent delete: a missing file is already gone.
    if (current === null) return;
    await this.octokit.rest.repos.deleteFile({
      owner: this.owner,
      repo: this.repo,
      path,
      message,
      sha: current.sha,
      branch: this.branch,
    });
  }
}

export interface GithubStoreConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

export function createGithubStore(config: GithubStoreConfig, api?: GithubApi): ContentStore {
  const github: GithubApi =
    api ?? new OctokitGithubApi(new Octokit({ auth: config.token }), config.owner, config.repo, config.branch);

  return {
    async list(dir: string): Promise<string[]> {
      return (await github.listDir(dir)).filter((e) => e.endsWith(".json"));
    },

    async read<T>(path: string): Promise<ReadResult<T> | null> {
      const file = await github.getFile(path);
      if (file === null) return null;
      let data: T;
      try {
        data = JSON.parse(file.text) as T;
      } catch {
        throw new InvalidContentError(path, "file is not valid JSON");
      }
      return { data, sha: file.sha };
    },

    async write(
      changes: { path: string; content: string | Buffer; sha?: string }[],
      message: string,
    ): Promise<WriteResult> {
      for (const change of changes) {
        if (change.sha !== undefined) {
          const current = await github.getFile(change.path);
          if (current === null || current.sha !== change.sha) {
            throw new ConflictError(change.path);
          }
        }
      }
      const commitSha = await github.commitFiles(
        changes.map((c) => ({ path: c.path, content: c.content })),
        message,
      );
      return { commitSha };
    },

    async delete(path: string, message: string): Promise<void> {
      await github.deleteFile(path, message);
    },
  };
}
