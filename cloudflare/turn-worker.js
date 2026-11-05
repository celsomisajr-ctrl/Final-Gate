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
    const r = await fetch(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${env.TURN_KEY_ID}/credentials/generate-ice-servers`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.TURN_KEY_API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ttl: 14400 }), // 4 hours
      },
    );
    if (!r.ok) {
      return new Response(JSON.stringify({ error: 'turn-unavailable', status: r.status }), {
        status: 502, headers: { ...cors, 'content-type': 'application/json' },
      });
    }
    const data = await r.json();
    return new Response(JSON.stringify(data), {
      headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  },
};
