import { mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createFsStore } from "./fs-store";
import { ConflictError, InvalidContentError } from "./types";

let root: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "builder-fs-"));
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe("fs-store", () => {
  it("round-trips a write and read with a sha token", async () => {
    const store = createFsStore(root);
    const written = await store.write(
      [{ path: "pages/home.json", content: JSON.stringify({ a: 1 }) }],
      "test",
    );
    expect(written.sha).toMatch(/^[0-9a-f]{40}$/);
    const read = await store.read<{ a: number }>("pages/home.json");
    expect(read?.data).toEqual({ a: 1 });
    expect(read?.sha).toBe(written.sha);
  });

  it("returns null for missing files and empty lists for missing dirs", async () => {
    const store = createFsStore(root);
    expect(await store.read("pages/nope.json")).toBeNull();
    expect(await store.list("pages")).toEqual([]);
  });

  it("lists only .json files, sorted", async () => {
    const store = createFsStore(root);
    await store.write(
      [
        { path: "pages/b.json", content: "{}" },
        { path: "pages/a.json", content: "{}" },
        { path: "pages/notes.txt", content: "x" },
      ],
      "test",
    );
    expect(await store.list("pages")).toEqual(["a.json", "b.json"]);
  });

  it("accepts a guarded write with a fresh sha and rejects a stale one", async () => {
    const store = createFsStore(root);
    const first = await store.write([{ path: "pages/home.json", content: '{"v":1}' }], "test");
    await store.write(
      [{ path: "pages/home.json", content: '{"v":2}', sha: first.sha }],
      "test",
    );
    await expect(
      store.write([{ path: "pages/home.json", content: '{"v":3}', sha: first.sha }], "test"),
    ).rejects.toBeInstanceOf(ConflictError);
    // Stale write lost: the fresh value survived.
    expect((await store.read<{ v: number }>("pages/home.json"))?.data).toEqual({ v: 2 });
  });

  it("rejects guarded writes to missing files", async () => {
    const store = createFsStore(root);
    await expect(
      store.write([{ path: "pages/ghost.json", content: "{}", sha: "abc" }], "test"),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("deletes idempotently", async () => {
    const store = createFsStore(root);
    await store.write([{ path: "pages/home.json", content: "{}" }], "test");
    await store.delete("pages/home.json", "test");
    expect(await store.read("pages/home.json")).toBeNull();
    await expect(store.delete("pages/home.json", "test")).resolves.toBeUndefined();
  });

  it("rejects non-JSON content on read", async () => {
    const store = createFsStore(root);
    writeFileSync(join(root, "bad.json"), "not json{{{");
    await expect(store.read("bad.json")).rejects.toBeInstanceOf(InvalidContentError);
  });

  it("rejects paths escaping the content root", async () => {
    const store = createFsStore(root);
    await expect(store.read("../outside.json")).rejects.toBeInstanceOf(InvalidContentError);
    await expect(
      store.write([{ path: "../outside.json", content: "{}" }], "test"),
    ).rejects.toBeInstanceOf(InvalidContentError);
  });
});
