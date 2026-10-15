import { makeRouteHandler } from '@keystatic/next/route-handler';

import keystaticConfig from '../../../../keystatic.config';

// Pages Router adaptation of the Keystatic API route. `makeRouteHandler`
// returns Web-standard Request/Response handlers; Next converts automatically
// on Node 18+. The Keystatic admin UI marks its local-mode fetches with a
// `no-cors: 1` header which must survive the bridge — so all headers are
// forwarded, not just content-type.
const keystaticHandler = makeRouteHandler({ config: keystaticConfig });

// Next's API resolver parses and drains the request body before the handler
// runs (api-utils `parseBody`), so a `data`/`end` read here would never see a
// chunk and every save would hang. Keystatic's `update` endpoint parses the
// JSON itself and wants the raw bytes, so keep the stream for it.
export const config = { api: { bodyParser: false } };

export default async function handler(req: any, res: any) {
  const method = req.method === 'POST' ? 'POST' : 'GET';
  try {
    const url = new URL(req.url, 'http://localhost');
    const body =
      method === 'POST'
        ? req.readableEnded || req.body !== undefined
          ? typeof req.body === 'string' || Buffer.isBuffer(req.body)
            ? String(req.body)
            : JSON.stringify(req.body)
          : await new Promise<string>((resolve) => {
              let data = '';
              req.on('data', (chunk: any) => (data += chunk));
              req.on('end', () => resolve(data));
            })
        : undefined;

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers ?? {})) {
      if (value === undefined) continue;
      const v = Array.isArray(value) ? value.join(', ') : String(value);
      // Hop-by-hop headers that Request must not receive.
      if (['host', 'connection', 'content-length', 'transfer-encoding'].includes(key)) continue;
      headers.set(key, v);
    }

    const request = new Request(url.toString(), { method, headers, body });
    const response = await keystaticHandler[method](request);

    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.status(response.status).send(await response.text());
  } catch (error) {
    console.error('[keystatic api]', error);
    res.status(500).json({ error: 'Keystatic API error' });
  }
}
