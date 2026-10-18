import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Draft-mode preview exit (K5) — Pages Router adaptation of Keystatic's
 * real-time-previews recipe. Bound to the "End preview" button rendered by
 * `_app` whenever page props carry `preview`. POST-only (the recipe form
 * action), clears Next's preview cookies and bounces back to the page the
 * editor came from.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end();
    return;
  }

  // CSRF-shape guard: a plain <form> POST is CSRF-shaped by design, so the
  // request must carry a Referer on our own origin (the recipe does the same
  // via the Referer header).
  const referer = typeof req.headers.referer === 'string' ? req.headers.referer : '';
  const host = typeof req.headers.host === 'string' ? req.headers.host : '';
  let back = '/';
  if (referer) {
    let parsed: URL;
    try {
      parsed = new URL(referer);
    } catch {
      res.status(400).send('Invalid Referer');
      return;
    }
    // Origin check: the Referer's host must be ours; anything else is a
    // cross-site form pointed at this endpoint (why? nothing legitimate).
    if (host && parsed.host !== host) {
      res.status(403).send('Invalid origin');
      return;
    }
    // Only refer back to a same-site path, never a foreign URL.
    back = parsed.pathname + parsed.search;
  } else {
    res.status(400).send('Missing Referer');
    return;
  }

  res.clearPreviewData();
  res.writeHead(303, { Location: back });
  res.end();
}
