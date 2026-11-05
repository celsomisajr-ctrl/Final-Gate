# Co-op relay (Cloudflare TURN)

Some networks (mobile data, some routers, offices, schools) block direct connections between devices, so players there can't join a co-op room. A TURN relay passes the game traffic through Cloudflare when a direct path isn't possible. Cloudflare's TURN key must stay secret, so this small Worker keeps it and gives each player short-lived credentials.

## Setup from GitHub (easiest)

1. **Create a TURN key** in **Realtime → TURN Server**. Copy the **Turn Token ID** and the **API Token** (shown once).
2. In **Workers & Pages → Create application**, choose **Import a repository**, connect GitHub and pick **Final-Gate**.
3. Set **Root directory** to `cloudflare`, keep the deploy command `npx wrangler deploy`, and deploy. [`wrangler.jsonc`](wrangler.jsonc) names the Worker `final-gate-turn`.
4. In the Worker's **Settings → Variables and Secrets**, add the secrets `TURN_KEY_ID` and `TURN_KEY_API_TOKEN`.
5. Open `https://final-gate-turn.<your-subdomain>.workers.dev` and check you see JSON with `iceServers`.

## Setup by pasting the code

1. **Create a TURN key.** In the Cloudflare dashboard, open **Realtime → TURN Server** and create a TURN key. Copy the **Turn Token ID** and the **API Token** (the token is only shown once).
2. **Create the Worker.** Open **Workers & Pages → Create → Create Worker**, name it (for example `final-gate-turn`), deploy, then **Edit code**, replace everything with [`turn-worker.js`](turn-worker.js) and deploy again.
3. **Add the secrets.** In the Worker's **Settings → Variables and Secrets**, add two secrets:
   - `TURN_KEY_ID` = the Turn Token ID
   - `TURN_KEY_API_TOKEN` = the API Token
4. **Check it.** Open the Worker's URL (`https://final-gate-turn.<your-subdomain>.workers.dev`). You should see JSON with an `iceServers` list.
5. **Connect the game.** Set `RELAY_URL` in `index.html` to that Worker URL.

The relay is only used when devices can't connect directly. The Worker only answers the GitHub Pages site and the offline file; credentials last 4 hours.
