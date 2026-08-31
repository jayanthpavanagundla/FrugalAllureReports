# Email-restricted access

The whole site (the dashboard **and** every Allure report folder) is now behind
Google sign-in. Only the addresses listed in [`lib/allowlist.js`](lib/allowlist.js)
can open it. Anyone else signs in with Google and then sees a "request access"
page with a pre-filled email button.

## How it works

| Piece | Role |
| --- | --- |
| `middleware.js` | Runs on every request. No valid session cookie → redirect to Google. Signed in but not approved → returns the request-access page. Approved → passes through. |
| `api/auth/login.js` | Redirects to Google's consent screen. |
| `api/auth/callback.js` | Exchanges the code, reads the verified email, checks the allow list, sets a signed 7-day session cookie (or a 6-hour "denied" cookie). |
| `api/auth/logout.js` | Clears cookies, used by the **Sign out** link in the footer. |
| `lib/allowlist.js` | **The list of allowed emails.** Edit + redeploy to change access. |

The session cookie is a stateless HMAC-signed token — no database.

## One-time setup

### 1. Create Google OAuth credentials

1. Go to <https://console.cloud.google.com/apis/credentials> (create/select a project).
2. **Configure the OAuth consent screen** → User type **External** → fill in app
   name + support email → add scopes `openid`, `.../auth/userinfo.email`,
   `.../auth/userinfo.profile` → Save. (You can leave it in "Testing" mode; add
   testers, or click **Publish app** so anyone with a Google account can reach
   the sign-in step — they still get blocked by the allow list.)
3. **Credentials** → **Create Credentials** → **OAuth client ID** → **Web application**.
4. **Authorized redirect URIs** — add one line per domain the site runs on:
   - `https://<your-production-domain>/api/auth/callback`
   - `https://frugaltestingallurereports.vercel.app/api/auth/callback` (the Vercel URL)
   - For Vercel preview deployments, add `https://*.vercel.app/api/auth/callback`
     is **not** allowed by Google — either test on production, or add specific
     preview URLs as needed.
5. Copy the **Client ID** and **Client secret**.

### 2. Set environment variables in Vercel

Project → **Settings → Environment Variables** (add to Production + Preview):

| Name | Value |
| --- | --- |
| `GOOGLE_CLIENT_ID` | from step 1 |
| `GOOGLE_CLIENT_SECRET` | from step 1 |
| `AUTH_SECRET` | any long random string — e.g. `openssl rand -hex 32` |

Or with the CLI:

```bash
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add AUTH_SECRET
```

### 3. Deploy

```bash
vercel --prod
```

## Changing who has access

Edit `ALLOWED_EMAILS` in [`lib/allowlist.js`](lib/allowlist.js) and redeploy.
Matching is case-insensitive. Removing someone takes effect on their next request
(existing sessions are re-checked by the middleware, not just at login).

`ACCESS_REQUEST_CONTACT` in the same file is the address the "Request access"
button emails.

## Local development

`npm run dev` (plain Vite) does **not** run the middleware or the `api/` routes,
so the gate is bypassed locally — good for building the UI. To exercise the real
flow locally, use `vercel dev` with the three env vars in a local `.env` file and
add `http://localhost:3000/api/auth/callback` as a redirect URI in Google.

## Notes / limits

- This checks a Google **account**, not "a Gmail address" specifically — Google
  Workspace addresses work too. Put whatever addresses you want in the list.
- The `id_token` comes straight from Google's token endpoint over TLS
  (authenticated with the client secret), so its signature is not re-verified —
  this follows Google's own guidance for the server-side code flow.
- Report folders are served from `public/`, so they land at the site root
  (`/OnlineSales/…`) and are covered by the middleware matcher. If you add a
  folder literally named `assets/`, rename it — that prefix is excluded.
