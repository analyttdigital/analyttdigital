import { createReader } from '@keystatic/core/reader';
import { createGitHubReader } from '@keystatic/core/reader/github';

import keystaticConfig from '../../../keystatic.config';

/**
 * One reader factory for every build-time content access (the shared
 * `getStaticProps` and `scripts/generate-seo-files.ts`). Dies to the same
 * flag the storage config uses (K4):
 *
 * - default / `KEYSTATIC_STORAGE=local` — local files under `src/content`.
 * - `KEYSTATIC_STORAGE=github` + `KEYSTATIC_GITHUB_REPO=<owner>/<repo>` —
 *   GitHub-backed reads for cloud builds where `src/content` was not
 *   checked out or may be stale.
 *
 * Server-only, build-time only: the token lives in env vars and never
 * reaches a client bundle (only `getStaticProps` and node scripts import
 * this file).
 */
export function makeContentReader() {
  const repo = process.env.KEYSTATIC_GITHUB_REPO ?? '';
  if (process.env.KEYSTATIC_STORAGE === 'github' && repo.includes('/')) {
    return createGitHubReader(keystaticConfig, {
      // Cast: the config validates the same env value as `owner/name`.
      repo: repo as `${string}/${string}`,
      ref: process.env.KEYSTATIC_GITHUB_REF || undefined,
      token: process.env.KEYSTATIC_STATIC_GITHUB_TOKEN || undefined,
      pathPrefix: process.env.KEYSTATIC_GITHUB_PATH_PREFIX || undefined,
    });
  }
  return createReader(process.cwd(), keystaticConfig);
}
