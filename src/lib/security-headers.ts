// src/lib/security-headers.ts
//
// Applied to every response the Worker itself produces or forwards (JSON API
// responses and the ASSETS passthrough in src/worker.ts). public/_headers —
// Cloudflare's declarative mechanism for static-asset responses — explicitly
// does not apply to Worker-generated responses, so this is the Worker-side
// half of the same header set `public/_headers` declares for everything
// else. CSP is deliberately not here: it's emitted per-HTML-page by Astro's
// `security.csp` (astro.config.mjs), baked into each page at build time.
//
// Scope, verified with `wrangler dev` against a real build: Cloudflare's
// asset router serves both a matched file and the not_found_handling
// 404 page WITHOUT invoking this Worker at all — so for ordinary page
// traffic (including true 404s), `public/_headers` is what actually applies
// these headers, not this file. This code path only fires for `/api/*`
// (forced via wrangler.toml's `run_worker_first`), where it protects the
// JSON responses and the rare `env.ASSETS.fetch()` fallback for a path under
// /api/* that isn't /api/contact.
export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Strict-Transport-Security': 'max-age=31536000',
  'Permissions-Policy':
    'accelerometer=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=()',
};

/**
 * Returns a new Response with the security header set merged in via `set`
 * (never `append`) — idempotent even if `_headers` also turns out to apply to
 * the wrapped response, and necessary regardless since a fetched Response's
 * headers are immutable.
 */
export function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
