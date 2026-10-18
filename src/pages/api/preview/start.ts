import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Draft-mode preview entry (K5) — Pages Router adaptation of Keystatic's
 * real-time-previews recipe (keystatic.com/docs/recipes/real-time-previews).
 * Keystatic's `previewUrl` keys point here (see `keystatic.config.ts`):
 *
 *   /api/preview/start?branch={branch}&to=/{slug}
 *
 * Enabling draft mode makes Next re-run `getStaticProps` per request with
 * `context.preview`/`context.previewData` set instead of serving the static
 * file — which is how the reader picks up content saved after the build
 * (local mode: working-tree files; GitHub mode: the admin's preview branch,
 * after it has been saved to GitHub). Draft mode only flips cookies in the
 * requesting browser's own session; the public static build never runs this
 * route, so drafts can never leak into deployed output.
 */

/** Branch/ref names may hold `/` (feature branches) but nothing that could
 *  escape a URL path or confuse an API — allow a conservative-CS charset and
 *  forbid `..` traversal segments outright. */
function safeBranch(value: unknown): string | null {
  if (typeof value !== 'string' || value === '' || value.length > 255) return null;
  if (!/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(value) || value.includes('..')) return null;
  return value;
}

/** `to` must be a same-origin relative path — an absolute or protocol-
 *  relative value would turn this route into an open redirect. */
function safeTo(value: unknown): string | null {
  if (typeof value !== 'string' || value === '') return null;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return null;
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value)) return null;
  // Control characters have no business in a redirect target.
  if (/[\r\n\u0000-\u001f\u007f]/.test(value)) return null;
  return value;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    res.status(405).end();
    return;
  }

  // Keystatic substitutes `{branch}` with '' in local mode; empty is valid —
  // it previews saved-but-not-built local content with no GitHub involved.
  const rawBranch = Array.isArray(req.query.branch) ? req.query.branch[0] : req.query.branch;
  const rawTo = Array.isArray(req.query.to) ? req.query.to[0] : req.query.to;

  const to = safeTo(rawTo);
  if (!to) {
    res.status(400).send('Missing or invalid "to" param');
    return;
  }
  // A provided-but-invalid branch is safer to hard-fail than to silently
  // preview the wrong revision.
  if (rawBranch !== undefined && rawBranch !== '' && !safeBranch(rawBranch)) {
    res.status(400).send('Invalid "branch" param');
    return;
  }
  const branch = rawBranch ? safeBranch(rawBranch) : null;

  // Preview data rides in Next's `__prerender_bypass` cookie payload; the
  // getStaticProps context threads it into props (`PreviewInfo`).
  res.setPreviewData({ branch });
  res.writeHead(307, { Location: to });
  res.end();
}
