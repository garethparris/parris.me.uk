import { describe, it, expect } from 'vitest';
import { GET as robotsGet } from '../src/pages/robots.txt';

const SITE_URL = new URL('https://parris.me.uk');

describe('robots.txt endpoint', () => {
  it('welcomes AI crawlers and the general User-agent', async () => {
    const response = await robotsGet({ site: SITE_URL } as any);
    const body = await response.text();

    expect(body).toContain('User-agent: *');
    expect(body).toContain('Allow: /');
    expect(body).toContain('User-agent: GPTBot');
    expect(body).toContain('User-agent: ClaudeBot');
    expect(body).toContain('User-agent: PerplexityBot');
    expect(body).toContain('User-agent: Google-Extended');
    expect(body).toContain('User-agent: Applebot-Extended');
  });

  it('disallows the API route and points at the sitemap', async () => {
    const response = await robotsGet({ site: SITE_URL } as any);
    const body = await response.text();

    expect(body).toContain('Disallow: /api/');
    expect(body).toContain('Sitemap: https://parris.me.uk/sitemap.xml');
  });
});
