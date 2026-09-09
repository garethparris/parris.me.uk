// src/pages/llms.txt.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPostSlug } from '../lib/blog';
import { buildLlmsTxt } from '../lib/llms';

export const GET: APIRoute = async ({ site }) => {
  const [resume] = await getCollection('resume');
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  const body = buildLlmsTxt(
    resume.data,
    posts.map((post) => ({ slug: getPostSlug(post), data: post.data })),
    site!
  );
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
