// src/worker.ts
//
// Entry point for the Cloudflare Workers deployment (Workers & Pages "Create
// an app" flow, not the legacy Pages product). Static assets are served via
// the ASSETS binding configured in wrangler.toml; this Worker only needs to
// intercept the one route with server-side logic, the contact form.

import { extractContactFields } from './lib/contact';

export interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  ASSETS: Fetcher;
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  const formData = await request.formData();
  const fields = await extractContactFields(formData);

  if (!fields.ok) {
    return new Response(JSON.stringify({ error: fields.error }), { status: 400 });
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'parris.me.uk contact form <noreply@parris.me.uk>',
      to: env.CONTACT_TO_EMAIL,
      reply_to: fields.email,
      subject: `New contact form message from ${fields.name}`,
      text: fields.message,
    }),
  });

  if (!resendResponse.ok) {
    return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
