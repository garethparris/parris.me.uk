// src/pages/robots.txt.ts
//
// Generated so the Sitemap: line derives from `site` rather than being a
// third hardcoded copy of the domain (alongside astro.config.mjs and
// src/lib/site.ts). AI crawlers are explicitly welcome — this site is a
// public professional profile, and being quoted accurately is the point.
import type { APIRoute } from 'astro';

const AI_CRAWLER_USER_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'CCBot',
  'Bytespider',
  'meta-externalagent',
  'cohere-ai',
];

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('/sitemap.xml', site).toString();
  const llmsUrl = new URL('/llms.txt', site).toString();

  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    '# AI crawlers and AI search agents are welcome here.',
    ...AI_CRAWLER_USER_AGENTS.map((ua) => `User-agent: ${ua}`),
    'Allow: /',
    '',
    // Google-Extended and Applebot-Extended are genuine AI-training/grounding
    // opt-out tokens, unlike the crawlers above (already covered by the
    // blanket Allow on *) — so an explicit Allow here is meaningful, not just
    // a declaration of intent.
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    'User-agent: Applebot-Extended',
    'Allow: /',
    '',
    `# Structured summary for LLMs: ${llmsUrl}`,
    `Sitemap: ${sitemapUrl}`,
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
