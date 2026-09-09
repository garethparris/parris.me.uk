// src/pages/sitemap.xml.ts
//
// Hand-rolled rather than @astrojs/sitemap: that integration emits
// sitemap-index.xml + sitemap-0.xml in a static build, which would change a
// URL already submitted to Search Console. This keeps /sitemap.xml stable
// and gets per-URL <lastmod> from the content collections directly.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPostSlug } from '../lib/blog';
import { buildSitemapEntries, buildSitemapXml } from '../lib/feed';

export const GET: APIRoute = async ({ site }) => {
  const [resume] = await getCollection('resume');
  const posts = await getCollection('blog');
  const entries = buildSitemapEntries(
    resume.data,
    posts.map((post) => ({ slug: getPostSlug(post), data: post.data }))
  );
  const body = buildSitemapXml(entries, site!);
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
