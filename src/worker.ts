// src/worker.ts
//
// Entry point for the Cloudflare Workers deployment. Static assets are served
// via the ASSETS binding configured in wrangler.toml; this Worker only needs
// to intercept the one route with server-side logic, the contact form.

import { extractContactFields, verifyTurnstileToken } from './lib/contact';
import { withSecurityHeaders } from './lib/security-headers';

// MAILTRAP_API_TOKEN, CONTACT_TO_EMAIL and TURNSTILE_SECRET_KEY must be set
// under the Worker's Settings > Variables and Secrets (runtime), not the
// project's Build variables and secrets. Build variables are only injected
// into the CI shell during `npm run build`/`wrangler deploy` and never reach
// this Env object - setting them there instead is a real, easy-to-make
// mistake that silently produces a "Contact form is not configured" 500
// below.
export interface Env {
  MAILTRAP_API_TOKEN: string;
  CONTACT_TO_EMAIL: string;
  TURNSTILE_SECRET_KEY: string;
  ASSETS: Fetcher;
}

/** JSON response helper: every prior response omitted Content-Type entirely. */
function json(body: unknown, status: number, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders },
  });
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  if (!env.MAILTRAP_API_TOKEN || !env.CONTACT_TO_EMAIL || !env.TURNSTILE_SECRET_KEY) {
    console.error(
      `Contact form misconfigured: MAILTRAP_API_TOKEN present=${!!env.MAILTRAP_API_TOKEN}, CONTACT_TO_EMAIL present=${!!env.CONTACT_TO_EMAIL}, TURNSTILE_SECRET_KEY present=${!!env.TURNSTILE_SECRET_KEY}`
    );
    return json({ error: 'Contact form is not configured' }, 500);
  }

  const formData = await request.formData();

  const turnstileToken = formData.get('cf-turnstile-response');
  const turnstileValid =
    typeof turnstileToken === 'string' &&
    turnstileToken.length > 0 &&
    (await verifyTurnstileToken(turnstileToken, env.TURNSTILE_SECRET_KEY, request.headers.get('CF-Connecting-IP') ?? undefined));

  if (!turnstileValid) {
    return json({ error: 'Verification failed, please try again' }, 400);
  }

  const fields = await extractContactFields(formData);

  if (!fields.ok) {
    return json({ error: fields.error }, 400);
  }

  const mailtrapResponse = await fetch('https://send.api.mailtrap.io/api/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.MAILTRAP_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: { email: 'noreply@parris.me.uk', name: 'parris.me.uk contact form' },
      to: [{ email: env.CONTACT_TO_EMAIL }],
      reply_to: { email: fields.email },
      subject: `New contact form message from ${fields.name}`,
      text: fields.message,
    }),
  });

  if (!mailtrapResponse.ok) {
    const body = await mailtrapResponse.text();
    console.error(`Mailtrap send failed: ${mailtrapResponse.status} ${body}`);
    return json({ error: 'Failed to send' }, 502);
  }

  return json({ ok: true }, 200);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Matched on pathname first, then branched on method: previously this
    // was a single `&&` check, so a non-POST request (e.g. a GET) silently
    // fell through to the asset handler instead of getting a real 405.
    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return withSecurityHeaders(json({ error: 'Method not allowed' }, 405, { Allow: 'POST' }));
      }
      return withSecurityHeaders(await handleContact(request, env));
    }

    return withSecurityHeaders(await env.ASSETS.fetch(request));
  },
};
