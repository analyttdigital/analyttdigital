import { afterEach, describe, expect, it, vi } from "vitest";

import { hasPushPermission, isAuthorized, sessionLogin } from "./guard";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("builder auth guard", () => {
  it("reads the GitHub login from the session", () => {
    expect(sessionLogin({ user: { login: "octocat" } })).toBe("octocat");
    expect(sessionLogin({ user: {} })).toBeNull();
    expect(sessionLogin(null)).toBeNull();
  });

  it("matches the allowlist case-insensitively", async () => {
    vi.stubEnv("BUILDER_ALLOWED_USERS", "OctoCat, other");
    expect(await isAuthorized("octocat")).toBe(true);
    expect(await isAuthorized("stranger", async () => true)).toBe(false);
  });

  it("falls back to push permission when no allowlist is set", async () => {
    vi.stubEnv("BUILDER_ALLOWED_USERS", "");
    expect(await isAuthorized("dev", async () => true)).toBe(true);
    expect(await isAuthorized("dev", async () => false)).toBe(false);
    expect(await isAuthorized(null, async () => true)).toBe(false);
  });

  it("denies without repo credentials and a stub that throws", async () => {
    vi.stubEnv("BUILDER_ALLOWED_USERS", "");
    vi.stubEnv("GITHUB_OWNER", "");
    expect(await hasPushPermission("dev")).toBe(false);
  });
});
