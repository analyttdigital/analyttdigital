import type { NextApiRequest, NextApiResponse } from 'next';

const CONTACT_ACTION = 'contact_submit';

type RecaptchaResponse = {
  action?: string;
  score?: number;
  success?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const token = typeof req.body?.token === 'string' ? req.body.token : '';
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const minimumScore = Number(process.env.RECAPTCHA_MINIMUM_SCORE ?? '0.5');

  if (!secret) return res.status(503).json({ error: 'reCAPTCHA is not configured.' });
  if (!token || token.length > 4096) return res.status(400).json({ error: 'Invalid reCAPTCHA token.' });
  if (!Number.isFinite(minimumScore) || minimumScore < 0 || minimumScore > 1) {
    return res.status(500).json({ error: 'Invalid reCAPTCHA score configuration.' });
  }

  try {
    const verification = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }).toString(),
    });
    const result = (await verification.json()) as RecaptchaResponse;

    if (
      !verification.ok ||
      !result.success ||
      result.action !== CONTACT_ACTION ||
      typeof result.score !== 'number' ||
      result.score < minimumScore
    ) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
    }

    return res.status(200).json({ success: true });
  } catch {
    return res.status(502).json({ error: 'Unable to reach reCAPTCHA verification.' });
  }
}
