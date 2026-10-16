import { createHash } from "crypto";
import { promises as fs } from "fs";
import * as path from "path";

import type { ContentStore, ReadResult, WriteResult } from "./types";
import { ConflictError, InvalidContentError } from "./types";

/**
 * Filesystem adapter (M2). Used when `BUILDER_STORAGE=fs` (dev default).
 * Reads/writes JSON under a root directory (`src/content` in the app).
 * The read token is the sha1 of the file bytes, so the same optimistic
 * concurrency contract holds as on the GitHub adapter.
 */

export function contentSha(bytes: Buffer | string): string {
  return createHash("sha1").update(bytes).digest("hex");
}

function resolveSafe(root: string, rel: string): string {
  const abs = path.resolve(root, rel);
  if (abs !== root && !abs.startsWith(root + path.sep)) {
    throw new InvalidContentError(rel, "path escapes the content root");
  }
  return abs;
}

export function createFsStore(root: string): ContentStore {
  async function read<T>(filePath: string): Promise<ReadResult<T> | null> {
    const abs = resolveSafe(root, filePath);
    let bytes: Buffer;
    try {
      bytes = await fs.readFile(abs);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw err;
    }
    let data: T;
    try {
      data = JSON.parse(bytes.toString("utf8")) as T;
    } catch {
      throw new InvalidContentError(filePath, "file is not valid JSON");
    }
    return { data, sha: contentSha(bytes) };
  }

  async function write(
    changes: { path: string; content: string | Buffer; sha?: string }[],
    _message: string,
  ): Promise<WriteResult> {
    let lastSha: string | undefined;
    for (const change of changes) {
      const abs = resolveSafe(root, change.path);
      if (change.sha !== undefined) {
        const current = await read<unknown>(change.path);
        if (current === null || current.sha !== change.sha) {
          throw new ConflictError(change.path);
        }
      }
      const bytes = typeof change.content === "string" ? change.content : change.content;
      await fs.mkdir(path.dirname(abs), { recursive: true });
      await fs.writeFile(abs, bytes);
      lastSha = contentSha(typeof bytes === "string" ? Buffer.from(bytes, "utf8") : bytes);
    }
    return changes.length === 1 ? { sha: lastSha } : {};
  }

  return {
    async list(dir: string): Promise<string[]> {
      const abs = resolveSafe(root, dir);
      let entries: string[];
      try {
        entries = await fs.readdir(abs);
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
        throw err;
      }
      return entries.filter((e) => e.endsWith(".json")).sort();
    },

    read,

    write,

    async delete(filePath: string, _message: string): Promise<void> {
      const abs = resolveSafe(root, filePath);
      try {
        await fs.unlink(abs);
      } catch (err) {
        // Idempotent delete: a missing file is already gone.
        if ((err as NodeJS.ErrnoException).code === "ENOENT") return;
        throw err;
      }
    },
  };
}
