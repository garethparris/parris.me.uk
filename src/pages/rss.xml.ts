// src/pages/rss.xml.ts
//
// Hand-rolled rather than @astrojs/rss: full-content items need
// marked.parse(post.body) (marked is already a dependency, already used for
// role.body in resume.astro) plus root-relative → absolute URL rewriting for
// images/links in post bodies, which the integration doesn't do either.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPostSlug } from '../lib/blog';
import { buildRssXml, renderPostContentHtml } from '../lib/feed';

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  const items = posts.map((post) => ({
    slug: getPostSlug(post),
    data: post.data,
    contentHtml: renderPostContentHtml(post.body ?? '', site!),
  }));
  const body = buildRssXml(items, site!);
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
