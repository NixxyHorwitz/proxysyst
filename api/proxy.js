import fetch from 'node-fetch';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const {url, method = 'GET', data, headers} = req.body || {};

    if (!url) {
      return res.status(400).json({error: 'URL required'});
    }

    let parsedHeaders = {};

    // 🔥 FIX: convert PHP-style headers to object
    if (Array.isArray(headers)) {
      headers.forEach(h => {
        const index = h.indexOf(':');
        if (index > -1) {
          const key = h.slice(0, index).trim();
          const value = h.slice(index + 1).trim();
          parsedHeaders[key] = value;
        }
      });
    } else if (typeof headers === 'object' && headers !== null) {
      parsedHeaders = headers;
    }

    const response = await fetch(url, {
      method,
      headers: parsedHeaders,
      body: data && method !== 'GET' ? data : undefined,
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (e) {
    res.status(500).json({
      error: 'Proxy error',
      message: e.message,
    });
  }
}
