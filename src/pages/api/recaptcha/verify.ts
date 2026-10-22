import type { NextApiRequest, NextApiResponse } from 'next';

type GoogleVerification = {
  success?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end();
    return;
  }

  const token = typeof req.body?.token === 'string' ? req.body.token : '';
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!token) {
    res.status(400).json({ ok: false });
    return;
  }
  if (!secret) {
    res.status(503).json({ ok: false });
    return;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }).toString(),
    });
    const result = (await response.json()) as GoogleVerification;

    res.setHeader('Cache-Control', 'no-store');
    res.status(result.success ? 200 : 400).json({ ok: result.success === true });
  } catch {
    res.status(502).json({ ok: false });
  }
}
