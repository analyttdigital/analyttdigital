import { createFsStore } from "./fs-store";
import { createGithubStore } from "./github-store";
import type { ContentStore } from "./types";

/**
 * Media storage (M9.1). Uploads live under `public/uploads/` (NOT the JSON
 * content root — the content store is rooted at `src/content/` and its
 * traversal guard would rightly reject anything else). Same two backends:
 * local filesystem in dev, a commit via the GitHub API in production.
 */

export const MEDIA_DIR = "public/uploads";

export const ALLOWED_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "svg",
  "mp4",
  "webm",
] as const;

export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export function extensionOf(filename: string): string {
  const base = filename.split("/").pop() ?? filename;
  const dot = base.lastIndexOf(".");
  return dot < 0 ? "" : base.slice(dot + 1).toLowerCase();
}

/** Throws on disallowed type or oversize. Returns the sanitized extension. */
export function validateUpload(filename: string, bytes: number): AllowedExtension {
  const ext = extensionOf(filename);
  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    throw new Error(
      `File type ".${ext}" not allowed. Allowed: ${ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(", ")}`,
    );
  }
  if (bytes > MAX_UPLOAD_BYTES) {
    throw new Error(`File too large (${bytes} bytes). Maximum is ${MAX_UPLOAD_BYTES} bytes.`);
  }
  return ext as AllowedExtension;
}

export function sanitizeFilename(filename: string, ext: string): string {
  const base = (filename.split("/").pop() ?? "upload").replace(/\.[^.]*$/, "");
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${Date.now()}-${slug || "upload"}.${ext}`;
}

export interface MediaRef {
  url: string;
  path: string;
}

/** Repo-rooted store: the content store is rooted at `src/content/` and cannot reach `public/`. */
export function getMediaStore(): ContentStore {
  if (
    process.env.BUILDER_STORAGE === "github" &&
    process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO &&
    process.env.GITHUB_TOKEN
  ) {
    return createGithubStore({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      branch: process.env.BUILDER_DRAFT_BRANCH || process.env.BUILDER_BRANCH || "main",
      token: process.env.GITHUB_TOKEN,
    });
  }
  return createFsStore(process.cwd());
}

export async function saveMedia(
  store: ContentStore,
  filename: string,
  bytes: Buffer,
  message: string,
): Promise<MediaRef> {
  const rel = `${MEDIA_DIR}/${filename}`;
  const existing = await store.read<unknown>(rel);
  await store.write([{ path: rel, content: bytes, sha: existing?.sha }], message);
  return { url: `/${rel.replace(/^public\//, "")}`, path: rel };
}
