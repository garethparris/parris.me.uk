// test/worker.test.ts
//
// Calls the Worker's exported default `fetch` directly with a stub `Env`
// (a fake `ASSETS.fetch`), matching the existing `vi.stubGlobal('fetch', ...)`
// idiom in test/contact-function.test.ts. Zero new deps: this covers the
// Worker's own routing/header logic, which is the entire delta this plan
// introduces to worker.ts. It cannot cover the real asset router itself
// (html_handling, not_found_handling, _headers) — that needs `wrangler dev`
// against a real build, or production, not a unit test.
import { describe, it, expect, vi, afterEach } from 'vitest';
import worker, { type Env } from '../src/worker';

function makeEnv(overrides: Partial<Env> = {}): Env {
  return {
    MAILTRAP_API_TOKEN: 'token',
    CONTACT_TO_EMAIL: 'to@example.com',
    TURNSTILE_SECRET_KEY: 'secret',
    ASSETS: { fetch: vi.fn(async () => new Response('<html></html>', { status: 200, headers: { 'content-type': 'text/html' } })) } as unknown as Fetcher,
    ...overrides,
  };
}

describe('worker fetch routing', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('delegates non-API requests to ASSETS.fetch and adds security headers', async () => {
    const env = makeEnv();
    const request = new Request('https://parris.me.uk/resume/');
    const response = await worker.fetch(request, env);

    expect(env.ASSETS.fetch).toHaveBeenCalledWith(request);
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('content-type')).toBe('text/html');
  });

  it('returns 405 with Allow: POST for a non-POST request to /api/contact, without calling ASSETS.fetch', async () => {
    const env = makeEnv();
    const request = new Request('https://parris.me.uk/api/contact', { method: 'GET' });
    const response = await worker.fetch(request, env);

    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(env.ASSETS.fetch).not.toHaveBeenCalled();
  });

  it('routes POST /api/contact to the contact handler, not ASSETS.fetch', async () => {
    const env = makeEnv({
      MAILTRAP_API_TOKEN: '',
      CONTACT_TO_EMAIL: '',
      TURNSTILE_SECRET_KEY: '',
    });
    const request = new Request('https://parris.me.uk/api/contact', { method: 'POST', body: new FormData() });
    const response = await worker.fetch(request, env);

    // Misconfigured (env vars empty) is fine here — the point is that the
    // request reached handleContact's config check rather than the asset
    // handler, which would 404.
    expect(response.status).toBe(500);
    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(env.ASSETS.fetch).not.toHaveBeenCalled();
  });

  it('every JSON response from handleContact carries Content-Type: application/json', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false }), { status: 200 }))
    );
    const env = makeEnv();
    const formData = new FormData();
    formData.set('cf-turnstile-response', 'a-token');
    formData.set('name', 'Jane');
    formData.set('email', 'jane@example.com');
    formData.set('message', 'Hello');
    const request = new Request('https://parris.me.uk/api/contact', { method: 'POST', body: formData });

    const response = await worker.fetch(request, env);

    expect(response.status).toBe(400); // Turnstile rejected
    expect(response.headers.get('Content-Type')).toContain('application/json');
  });

  it('applies security headers to the ASSETS passthrough response', async () => {
    const env = makeEnv();
    const request = new Request('https://parris.me.uk/nope');
    const response = await worker.fetch(request, env);

    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('Strict-Transport-Security')).toBe('max-age=31536000');
  });
});
