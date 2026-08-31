import { ACCESS_REQUEST_CONTACT } from "./allowlist.js";

function esc(s) {
  return String(s || "").replace(/[<>&"']/g, (c) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

// Full HTML page shown to a visitor who signed in with Google but whose
// address is not on the allow list. Returned directly by the middleware.
export function deniedPage(email) {
  const safeEmail = esc(email);
  const subject = encodeURIComponent("Access request – Frugal Testing Allure Reports");
  const body = encodeURIComponent(
    `Hi,\n\nPlease grant access to the Allure Reports site for my Google account:\n${email}\n\nThanks.`,
  );
  const mailto = `mailto:${ACCESS_REQUEST_CONTACT}?subject=${subject}&body=${body}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Access required</title>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
    background:#ffffff;color:#0f172a;min-height:100vh;
    display:flex;align-items:center;justify-content:center;padding:24px;
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(19,165,56,0.10) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 100%, rgba(19,165,56,0.06) 0%, transparent 55%);
  }
  .card{
    width:100%;max-width:440px;background:#fff;
    border:1px solid rgba(15,23,42,0.10);border-radius:18px;
    padding:40px 32px;text-align:center;
    box-shadow:0 16px 48px rgba(15,23,42,0.10);
  }
  .icon{font-size:40px;line-height:1;margin-bottom:18px}
  h1{font-size:1.25rem;font-weight:800;letter-spacing:-.02em;margin-bottom:12px}
  p{font-size:.9rem;line-height:1.6;color:#475569;margin-bottom:10px}
  .email{font-weight:700;color:#0f172a;word-break:break-all}
  .btn{
    display:inline-block;margin-top:20px;
    background:#13a538;color:#fff;text-decoration:none;
    font-size:.85rem;font-weight:700;letter-spacing:.02em;
    padding:12px 22px;border-radius:10px;
    transition:transform .15s, box-shadow .2s;
  }
  .btn:hover{transform:scale(1.03);box-shadow:0 6px 20px rgba(19,165,56,0.4)}
  .link{
    display:block;margin-top:16px;font-size:.75rem;
    color:#64748b;text-decoration:none;
  }
  .link:hover{color:#0f172a;text-decoration:underline}
</style>
</head>
<body>
  <div class="card">
    <div class="icon">&#128274;</div>
    <h1>You don&#39;t have access yet</h1>
    <p>The account <span class="email">${safeEmail}</span> isn&#39;t on the approved list for this site.</p>
    <p>Ask an administrator to add your Google address, then sign in again.</p>
    <a class="btn" href="${mailto}">Request access</a>
    <a class="link" href="/api/auth/logout">Sign in with a different account</a>
  </div>
</body>
</html>`;
}
