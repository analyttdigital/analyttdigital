/**
 * `ContentStore` (M2): one interface for both storage backends. Dev writes
 * straight to `src/content`; production commits to GitHub through the Git
 * Data API. Callers never know which backend is active.
 */

export interface ContentChange {
  path: string;
  content: string | Buffer;
  /** Optimistic-concurrency token from a previous `read`. Omit for blind writes. */
  sha?: string;
}

export interface ReadResult<T> {
  data: T;
  sha?: string;
}

export interface WriteResult {
  commitSha?: string;
  /** New read token for the written file(s); single-file writes only. */
  sha?: string;
}

export interface ContentStore {
  list(dir: string): Promise<string[]>;
  read<T>(path: string): Promise<ReadResult<T> | null>;
  write(changes: ContentChange[], message: string): Promise<WriteResult>;
  delete(path: string, message: string): Promise<void>;
}

/** Thrown when an `sha`-guarded write loses a race. Surfaces as HTTP 409. */
export class ConflictError extends Error {
  readonly code = "CONFLICT";
  constructor(path: string) {
    super(`Conflict writing ${path}: file changed since it was read. Reload and retry.`);
    this.name = "ConflictError";
  }
}

/** Thrown when stored bytes are not valid JSON or fail schema validation. */
export class InvalidContentError extends Error {
  readonly code = "INVALID_CONTENT";
  constructor(
    path: string,
    public readonly issues: string,
  ) {
    super(`Invalid content at ${path}: ${issues}`);
    this.name = "InvalidContentError";
  }
}
