// Final Gate co-op relay credentials (Cloudflare Worker).
// Hands each player short-lived Cloudflare TURN credentials so devices on strict networks
// (mobile data, some routers, offices) can still connect. The TURN key stays secret here.
//
// Secrets to add in the Worker's Settings > Variables and Secrets:
//   TURN_KEY_ID         - the Turn Token ID from Cloudflare Realtime > TURN Server
//   TURN_KEY_API_TOKEN  - the API Token shown when you created that TURN key
const ALLOWED = ['https://celsomisajr-ctrl.github.io', 'null']; // 'null' = the offline Final-Gate.html file

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED.includes(origin) ? origin : ALLOWED[0],
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Vary': 'Origin',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: cors });
    const json = (o, status = 200) => new Response(JSON.stringify(o, null, 1), { status, headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' } });
    // Setup checks (never reveal the secret values themselves)
    const id = (env.TURN_KEY_ID || '').trim(), token = (env.TURN_KEY_API_TOKEN || '').trim();
    if (!id || !token) {
      return json({ error: 'missing-secret', hint: 'Add both secrets in the Worker: Settings > Variables and Secrets', TURN_KEY_ID_set: !!id, TURN_KEY_API_TOKEN_set: !!token }, 500);
    }
    const r = await fetch(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${encodeURIComponent(id)}/credentials/generate-ice-servers`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ttl: 14400 }), // 4 hours
      },
    );
    if (!r.ok) {
      let detail = '';
      try { detail = (await r.text()).slice(0, 300); } catch (e) {}
      const hint = r.status === 404 ? 'TURN_KEY_ID does not match a TURN key. Use the Turn Token ID from Realtime > TURN Server.'
        : (r.status === 401 || r.status === 403) ? 'TURN_KEY_API_TOKEN is wrong or belongs to a different TURN key.'
        : 'Cloudflare TURN returned an error.';
      return json({ error: 'turn-unavailable', status: r.status, hint, idLength: id.length, idStart: id.slice(0, 4), tokenLength: token.length, cloudflare: detail }, 502);
    }
    const data = await r.json();
    return new Response(JSON.stringify(data), {
      headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  },
};
