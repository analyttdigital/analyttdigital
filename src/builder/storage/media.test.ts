import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { describe, expect, it } from "vitest";

import { createFsStore } from "./fs-store";
import {
  extensionOf,
  sanitizeFilename,
  saveMedia,
  validateUpload,
} from "./media";

describe("media storage", () => {
  it("accepts allowlisted types under the size cap", () => {
    expect(validateUpload("photo.PNG", 100)).toBe("png");
    expect(validateUpload("clip.mp4", 100)).toBe("mp4");
    expect(() => validateUpload("evil.exe", 100)).toThrow(/not allowed/);
    expect(() => validateUpload("noext", 100)).toThrow(/not allowed/);
    expect(() => validateUpload("big.png", 9 * 1024 * 1024)).toThrow(/too large/);
  });

  it("extracts extensions case-insensitively", () => {
    expect(extensionOf("a/b/Cat.JPEG")).toBe("jpeg");
    expect(extensionOf("noext")).toBe("");
  });

  it("sanitizes filenames to timestamped slugs", () => {
    expect(sanitizeFilename("My Photo 1!.png", "png")).toMatch(/^\d+-my-photo-1\.png$/);
    expect(sanitizeFilename("../../etc/passwd", "png")).toMatch(/^\d+-passwd\.png$/);
    expect(sanitizeFilename("!!!", "png")).toMatch(/^\d+-upload\.png$/);
  });

  it("round-trips bytes through a repo-rooted store", async () => {
    const root = mkdtempSync(join(tmpdir(), "builder-media-"));
    try {
      const { readFile } = await import("fs/promises");
      const store = createFsStore(root);
      const bytes = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
      const ref = await saveMedia(store, "1-test.png", bytes, "test");
      expect(ref.url).toBe("/uploads/1-test.png");
      expect(ref.path).toBe("public/uploads/1-test.png");
      const raw = await readFile(join(root, ref.path));
      expect(raw.equals(bytes)).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
