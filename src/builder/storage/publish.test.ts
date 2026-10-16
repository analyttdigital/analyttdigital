import { afterEach, describe, expect, it, vi } from "vitest";

import type { PublishApi } from "./publish";
import { beginDraftPublish, finishDraftPublish } from "./publish";

class FakePublish implements PublishApi {
  branches = new Set<string>();
  prs: { base: string; head: string }[] = [];
  prUrl = "https://example.test/pr/1";

  async ensureBranch(_base: string, head: string): Promise<void> {
    this.branches.add(head);
  }

  async ensurePR(base: string, head: string): Promise<{ url: string; created: boolean }> {
    const existing = this.prs.find((p) => p.base === base && p.head === head);
    if (existing) return { url: this.prUrl, created: false };
    this.prs.push({ base, head });
    return { url: this.prUrl, created: true };
  }
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("draft-branch publish", () => {
  it("returns null outside draft mode", async () => {
    vi.stubEnv("BUILDER_DRAFT_BRANCH", "");
    vi.stubEnv("BUILDER_STORAGE", "github");
    expect(await beginDraftPublish(new FakePublish())).toBeNull();
    expect(await finishDraftPublish(null)).toEqual({});
  });

  it("ensures the branch, then the PR", async () => {
    vi.stubEnv("BUILDER_DRAFT_BRANCH", "draft");
    vi.stubEnv("BUILDER_STORAGE", "github");
    vi.stubEnv("BUILDER_BRANCH", "main");
    const api = new FakePublish();
    const ctx = await beginDraftPublish(api);
    expect(ctx).not.toBeNull();
    expect(api.branches.has("draft")).toBe(true);
    const first = await finishDraftPublish(ctx);
    expect(first).toEqual({ prUrl: api.prUrl });
    const second = await finishDraftPublish(ctx);
    expect(second).toEqual({ prUrl: api.prUrl });
    expect(api.prs).toHaveLength(1);
  });

  it("never fails the save when the PR step errors", async () => {
    vi.stubEnv("BUILDER_DRAFT_BRANCH", "draft");
    vi.stubEnv("BUILDER_STORAGE", "github");
    const failing: PublishApi = {
      ensureBranch: async () => {},
      ensurePR: async () => {
        throw new Error("API down");
      },
    };
    const ctx = await beginDraftPublish(failing);
    expect(await finishDraftPublish(ctx)).toEqual({ prError: "API down" });
  });
});
