import { describe, expect, it } from "vitest";

import type { GithubApi, GithubFile } from "./github-store";
import { createGithubStore } from "./github-store";
import { ConflictError, InvalidContentError } from "./types";

/** In-memory fake behind the `GithubApi` seam — asserts atomicity, not HTTP. */
class FakeGithub implements GithubApi {
  files = new Map<string, GithubFile>();
  commits: { message: string; paths: string[] }[] = [];
  private counter = 0;

  seed(path: string, text: string): string {
    const sha = `sha-${++this.counter}`;
    this.files.set(path, { sha, text });
    return sha;
  }

  async getFile(path: string): Promise<GithubFile | null> {
    return this.files.get(path) ?? null;
  }

  async listDir(dir: string): Promise<string[]> {
    const prefix = dir.endsWith("/") ? dir : `${dir}/`;
    const names: string[] = [];
    for (const path of this.files.keys()) {
      if (path.startsWith(prefix)) {
        const rest = path.slice(prefix.length);
        if (!rest.includes("/")) names.push(rest);
      }
    }
    return names.sort();
  }

  async commitFiles(
    files: { path: string; content: string | Buffer }[],
    message: string,
  ): Promise<string> {
    for (const f of files) {
      this.files.set(f.path, {
        sha: `sha-${++this.counter}`,
        text: typeof f.content === "string" ? f.content : f.content.toString("utf8"),
      });
    }
    this.commits.push({ message, paths: files.map((f) => f.path) });
    return `commit-${this.commits.length}`;
  }

  async deleteFile(path: string, _message: string): Promise<void> {
    this.files.delete(path);
  }
}

const config = { owner: "o", repo: "r", branch: "main", token: "t" };

describe("github-store", () => {
  it("reads files with their sha and null for missing files", async () => {
    const api = new FakeGithub();
    const sha = api.seed("pages/home.json", '{"a":1}');
    const store = createGithubStore(config, api);
    expect(await store.read("pages/home.json")).toEqual({ data: { a: 1 }, sha });
    expect(await store.read("pages/nope.json")).toBeNull();
  });

  it("rejects non-JSON content on read", async () => {
    const api = new FakeGithub();
    api.seed("pages/bad.json", "not json{{{");
    const store = createGithubStore(config, api);
    await expect(store.read("pages/bad.json")).rejects.toBeInstanceOf(InvalidContentError);
  });

  it("commits a multi-file save as one commit", async () => {
    const api = new FakeGithub();
    const store = createGithubStore(config, api);
    const result = await store.write(
      [
        { path: "pages/a.json", content: "{}" },
        { path: "shared/header.json", content: "{}" },
      ],
      "Save two docs",
    );
    expect(api.commits).toHaveLength(1);
    expect(api.commits[0]).toEqual({
      message: "Save two docs",
      paths: ["pages/a.json", "shared/header.json"],
    });
    expect(result.commitSha).toBe("commit-1");
  });

  it("accepts guarded writes with a fresh sha and rejects stale ones without committing", async () => {
    const api = new FakeGithub();
    const sha = api.seed("pages/home.json", '{"v":1}');
    const store = createGithubStore(config, api);
    await store.write([{ path: "pages/home.json", content: '{"v":2}', sha }], "update");
    expect(api.commits).toHaveLength(1);
    await expect(
      store.write([{ path: "pages/home.json", content: '{"v":3}', sha }], "stale"),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(api.commits).toHaveLength(1);
    expect((await store.read<{ v: number }>("pages/home.json"))?.data).toEqual({ v: 2 });
  });

  it("rejects guarded writes to missing files", async () => {
    const api = new FakeGithub();
    const store = createGithubStore(config, api);
    await expect(
      store.write([{ path: "pages/ghost.json", content: "{}", sha: "sha-9" }], "test"),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(api.commits).toHaveLength(0);
  });

  it("lists only .json files and deletes idempotently", async () => {
    const api = new FakeGithub();
    api.seed("pages/b.json", "{}");
    api.seed("pages/a.json", "{}");
    api.seed("pages/notes.txt", "x");
    const store = createGithubStore(config, api);
    expect(await store.list("pages")).toEqual(["a.json", "b.json"]);
    await store.delete("pages/a.json", "test");
    expect(await store.read("pages/a.json")).toBeNull();
    await expect(store.delete("pages/a.json", "test")).resolves.toBeUndefined();
  });
});
