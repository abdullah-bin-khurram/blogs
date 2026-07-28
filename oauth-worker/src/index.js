const GITHUB_AUTHORIZE_URL =
  "https://github.com/login/oauth/authorize";

const GITHUB_TOKEN_URL =
  "https://github.com/login/oauth/access_token";

const STATE_COOKIE =
  "lung_journal_oauth_state";

const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'none'; " +
    "script-src 'unsafe-inline'; " +
    "style-src 'unsafe-inline'; " +
    "base-uri 'none'; " +
    "frame-ancestors 'none'",

  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY"
};

function randomState() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);

  return Array.from(
    bytes,
    (byte) => byte
      .toString(16)
      .padStart(2, "0")
  ).join("");
}

function getCookie(request, name) {
  const cookieHeader =
    request.headers.get("Cookie") || "";

  const cookies = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim());

  const match = cookies.find(
    (cookie) => cookie.startsWith(`${name}=`)
  );

  return match
    ? decodeURIComponent(
        match.slice(name.length + 1)
      )
    : null;
}

function stateCookie(value, maxAge = 600) {
  return (
    `${STATE_COOKIE}=${encodeURIComponent(value)}; ` +
    `Path=/; ` +
    `Max-Age=${maxAge}; ` +
    `HttpOnly; ` +
    `Secure; ` +
    `SameSite=Lax`
  );
}

function htmlResponse(
  html,
  status = 200,
  extraHeaders = {}
) {
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      ...securityHeaders,
      ...extraHeaders
    }
  });
}

function errorPage(message, status = 400) {
  const safeMessage = String(message).replace(
    /[&<>'"]/g,
    (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      "\"": "&quot;"
    })[character]
  );

  return htmlResponse(
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta
    name="viewport"
    content="width=device-width,initial-scale=1"
  >
  <title>Authentication error</title>

  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #edf7f1;
      color: #244f45;
      font: 16px/1.6 system-ui, sans-serif;
    }

    .card {
      max-width: 560px;
      margin: 24px;
      padding: 32px;
      border-radius: 24px;
      background: #fff;
      box-shadow: 0 18px 60px rgba(31,74,62,.12);
    }

    h1 {
      margin-top: 0;
      font-size: 1.5rem;
    }
  </style>
</head>

<body>
  <main class="card">
    <h1>GitHub authentication could not be completed</h1>
    <p>${safeMessage}</p>
    <p>Close this window and try signing in again.</p>
  </main>
</body>
</html>`,
    status
  );
}

function callbackPage(
  status,
  token,
  allowedOrigin
) {
  const payload = JSON.stringify({ token });

  const message =
    `authorization:github:${status}:${payload}`;

  return htmlResponse(
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta
    name="viewport"
    content="width=device-width,initial-scale=1"
  >
  <title>Authorizing</title>

  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #edf7f1;
      color: #244f45;
      font: 600 16px/1.5 system-ui, sans-serif;
    }

    .card {
      padding: 28px 32px;
      border-radius: 22px;
      background: #fff;
      box-shadow: 0 18px 60px rgba(31,74,62,.12);
    }
  </style>
</head>

<body>
  <div class="card">
    Connecting securely to the editor…
  </div>

  <script>
    (() => {
      const allowedOrigin =
        ${JSON.stringify(allowedOrigin)};

      const authorizationMessage =
        ${JSON.stringify(message)};

      if (!window.opener) {
        document.querySelector(".card").textContent =
          "The editor window was not found. " +
          "Close this page and try again.";

        return;
      }

      const receiveMessage = (event) => {
        if (
          event.origin !== allowedOrigin ||
          event.source !== window.opener
        ) {
          return;
        }

        window.opener.postMessage(
          authorizationMessage,
          allowedOrigin
        );

        window.removeEventListener(
          "message",
          receiveMessage
        );

        window.setTimeout(
          () => window.close(),
          300
        );
      };

      window.addEventListener(
        "message",
        receiveMessage
      );

      window.opener.postMessage(
        "authorizing:github",
        allowedOrigin
      );
    })();
  </script>
</body>
</html>`,
    200,
    {
      "Set-Cookie": stateCookie("", 0)
    }
  );
}

async function handleAuth(request, env, url) {
  if (
    !env.GITHUB_OAUTH_ID ||
    !env.GITHUB_OAUTH_SECRET
  ) {
    return errorPage(
      "The OAuth Worker secrets have not been configured.",
      500
    );
  }

  if (
    url.searchParams.get("provider") !== "github"
  ) {
    return errorPage(
      "Unsupported authentication provider."
    );
  }

  const state = randomState();

  const callbackUrl =
    `${url.origin}/callback?provider=github`;

  const scope =
    env.REPO_IS_PRIVATE === "true"
      ? "repo"
      : "public_repo";

  const authorizationUrl =
    new URL(GITHUB_AUTHORIZE_URL);

  authorizationUrl.searchParams.set(
    "client_id",
    env.GITHUB_OAUTH_ID
  );

  authorizationUrl.searchParams.set(
    "redirect_uri",
    callbackUrl
  );

  authorizationUrl.searchParams.set(
    "scope",
    scope
  );

  authorizationUrl.searchParams.set(
    "state",
    state
  );

  authorizationUrl.searchParams.set(
    "allow_signup",
    "false"
  );

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizationUrl.toString(),
      "Set-Cookie": stateCookie(state),
      ...securityHeaders
    }
  });
}

async function handleCallback(
  request,
  env,
  url
) {
  const error =
    url.searchParams.get("error");

  if (error) {
    return errorPage(
      url.searchParams.get(
        "error_description"
      ) || error
    );
  }

  const code =
    url.searchParams.get("code");

  const returnedState =
    url.searchParams.get("state");

  const storedState =
    getCookie(request, STATE_COOKIE);

  if (!code) {
    return errorPage(
      "GitHub did not return an authorization code."
    );
  }

  if (
    !returnedState ||
    !storedState ||
    returnedState !== storedState
  ) {
    return errorPage(
      "The login state could not be verified. " +
      "Please start the login again."
    );
  }

  const callbackUrl =
    `${url.origin}/callback?provider=github`;

  const tokenResponse =
    await fetch(GITHUB_TOKEN_URL, {
      method: "POST",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent":
          "Lung-Health-Journal-Decap-OAuth"
      },

      body: JSON.stringify({
        client_id: env.GITHUB_OAUTH_ID,
        client_secret:
          env.GITHUB_OAUTH_SECRET,
        code,
        redirect_uri: callbackUrl
      })
    });

  if (!tokenResponse.ok) {
    return errorPage(
      "GitHub rejected the token request.",
      502
    );
  }

  const tokenData =
    await tokenResponse.json();

  if (!tokenData.access_token) {
    return errorPage(
      tokenData.error_description ||
      tokenData.error ||
      "No access token was returned.",
      502
    );
  }

  return callbackPage(
    "success",
    tokenData.access_token,
    env.ALLOWED_ORIGIN
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (request.method !== "GET") {
        return new Response(
          "Method not allowed",
          {
            status: 405,
            headers: securityHeaders
          }
        );
      }

      if (url.pathname === "/auth") {
        return handleAuth(
          request,
          env,
          url
        );
      }

      if (url.pathname === "/callback") {
        return handleCallback(
          request,
          env,
          url
        );
      }

      return htmlResponse(
        `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta
    name="viewport"
    content="width=device-width,initial-scale=1"
  >
  <title>Lung Health Journal OAuth</title>

  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #edf7f1;
      color: #244f45;
      font: 16px/1.6 system-ui, sans-serif;
    }

    .card {
      padding: 30px 34px;
      border-radius: 24px;
      background: white;
      box-shadow: 0 18px 60px rgba(31,74,62,.12);
    }

    strong {
      display: block;
      font-size: 1.15rem;
    }
  </style>
</head>

<body>
  <div class="card">
    <strong>Lung Health Journal OAuth</strong>
    The authentication service is online.
  </div>
</body>
</html>`
      );
    } catch (error) {
      console.error(error);

      return errorPage(
        "An unexpected authentication error occurred.",
        500
      );
    }
  }
};