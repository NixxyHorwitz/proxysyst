import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const {url, method = 'GET', data = null, headers = []} = req.body || {};

  if (!url) {
    return res.status(400).json({error: 'URL required'});
  }

  try {
    const response = await fetch(url, {
      method,
      headers: Array.isArray(headers)
        ? Object.fromEntries(
            headers.map(h => {
              const [key, ...rest] = h.split(':');
              return [key.trim(), rest.join(':').trim()];
            }),
          )
        : headers,
      body: data && method !== 'GET' ? data : undefined,
    });

    const text = await response.text();

    res.status(response.status).send(text);
  } catch (err) {
    res.status(500).json({
      error: 'Proxy error',
      message: err.message,
    });
  }
}
