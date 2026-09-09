import { describe, it, expect } from 'vitest';
import { SECURITY_HEADERS, withSecurityHeaders } from '../src/lib/security-headers';

describe('withSecurityHeaders', () => {
  it('adds the full security header set to a response', () => {
    const response = withSecurityHeaders(new Response('ok', { status: 200 }));
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(response.headers.get(name)).toBe(value);
    }
  });

  it('preserves the original status and existing headers', () => {
    const original = new Response('not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
    const response = withSecurityHeaders(original);
    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toBe('text/plain');
  });

  it('sets rather than appends, so calling it twice does not duplicate a header', () => {
    const once = withSecurityHeaders(new Response('ok'));
    const twice = withSecurityHeaders(once);
    expect(twice.headers.get('X-Frame-Options')).toBe('DENY');
  });

  it('never sets Content-Security-Policy (that is Astro build-time, per-HTML-page)', () => {
    const response = withSecurityHeaders(new Response('ok'));
    expect(response.headers.get('Content-Security-Policy')).toBeNull();
  });
});
