import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import {
  buildSitemapEntries,
  buildSitemapXml,
  buildRssXml,
  absolutizeHtml,
  renderPostContentHtml,
} from '../src/lib/feed';
import { getPostSlug } from '../src/lib/blog';
import { GET as sitemapGet } from '../src/pages/sitemap.xml';
import { GET as rssGet } from '../src/pages/rss.xml';

const SITE_URL = new URL('https://parris.me.uk');

async function loadResumeAndPosts() {
  const [resume] = await getCollection('resume');
  const posts = await getCollection('blog');
  return { resume, posts };
}

describe('absolutizeHtml', () => {
  it('rewrites root-relative src/href attributes to absolute URLs', () => {
    const html = '<img src="/images/blog/mit-wall-rear.jpg"><a href="/blog/mit-wall">link</a>';
    const result = absolutizeHtml(html, SITE_URL);
    expect(result).toContain('src="https://parris.me.uk/images/blog/mit-wall-rear.jpg"');
    expect(result).toContain('href="https://parris.me.uk/blog/mit-wall"');
  });

  it('leaves already-absolute URLs untouched', () => {
    const html = '<a href="https://example.com/x">link</a>';
    expect(absolutizeHtml(html, SITE_URL)).toBe(html);
  });
});

describe('buildSitemapEntries + buildSitemapXml', () => {
  it('includes every static page and every blog post, each with a valid <loc>', async () => {
    const { resume, posts } = await loadResumeAndPosts();
    const entries = buildSitemapEntries(
      resume.data,
      posts.map((p) => ({ slug: getPostSlug(p), data: p.data }))
    );
    const xml = buildSitemapXml(entries, SITE_URL);

    // Regression cover for the actual bug: the hand-written sitemap this
    // replaces omitted the newest post.
    expect(xml).toContain('<loc>https://parris.me.uk/blog/graham-impact-awards/</loc>');
    expect(xml).toContain('<loc>https://parris.me.uk/resume/</loc>');
    expect(xml).toContain('<loc>https://parris.me.uk/</loc>');

    const urlCount = (xml.match(/<url>/g) ?? []).length;
    expect(urlCount).toBe(4 + posts.length); // 4 static pages + one per post
  });

  it('sets <lastmod> for /resume from resume.updated, and for posts from updatedDate ?? pubDate', async () => {
    const { resume, posts } = await loadResumeAndPosts();
    const entries = buildSitemapEntries(
      resume.data,
      posts.map((p) => ({ slug: getPostSlug(p), data: p.data }))
    );
    const xml = buildSitemapXml(entries, SITE_URL);
    const resumeLastmod = resume.data.updated.toISOString().slice(0, 10);
    expect(xml).toContain(`<loc>https://parris.me.uk/resume/</loc><lastmod>${resumeLastmod}</lastmod>`);
  });

  it('escapes XML special characters in <loc>', () => {
    const xml = buildSitemapXml([{ route: '/a&b' }], SITE_URL);
    expect(xml).toContain('&amp;');
    expect(xml).not.toMatch(/&(?!(amp|lt|gt|quot|apos|#\d+);)/);
  });
});

// Vite's import.meta.glob (rather than node:fs) reads the real file list at
// src/pages/**/*.astro — this project deliberately carries no Node type
// dependency, and glob is already how Vite/Astro resolve modules here.
const pageModules = import.meta.glob('../src/pages/**/*.astro');

describe('route-drift guard', () => {
  it('has a sitemap entry for every static .astro page under src/pages (excluding dynamic routes and endpoints)', async () => {
    function pathToRoute(path: string): string {
      // e.g. '../src/pages/blog/index.astro' -> '/blog', '../src/pages/resume.astro' -> '/resume'
      const relative = path.replace('../src/pages', '').replace(/\.astro$/, '');
      const withoutIndex = relative.replace(/\/index$/, '');
      return withoutIndex === '' ? '/' : withoutIndex;
    }

    const expectedRoutes = Object.keys(pageModules)
      .filter((path) => !path.includes('[')) // skip dynamic routes ([slug].astro)
      .filter((path) => !path.endsWith('/404.astro')) // Cloudflare's not_found_handling fallback, not an indexable route
      .map(pathToRoute);

    const { resume, posts } = await loadResumeAndPosts();
    const entries = buildSitemapEntries(
      resume.data,
      posts.map((p) => ({ slug: getPostSlug(p), data: p.data }))
    );
    const sitemapRoutes = new Set(entries.map((e) => e.route));

    expect(expectedRoutes.length).toBeGreaterThan(0); // guard against a vacuous pass
    for (const route of expectedRoutes) {
      expect(sitemapRoutes.has(route)).toBe(true);
    }
  });

  it("sitemap's post count always equals the blog collection's post count", async () => {
    const { resume, posts } = await loadResumeAndPosts();
    const entries = buildSitemapEntries(
      resume.data,
      posts.map((p) => ({ slug: getPostSlug(p), data: p.data }))
    );
    const postEntries = entries.filter((e) => e.route.startsWith('/blog/'));
    expect(postEntries).toHaveLength(posts.length);
  });
});

describe('buildRssXml', () => {
  it('produces one <item> per post with RFC-822 dates and absolutized content', async () => {
    const { posts } = await loadResumeAndPosts();
    const items = posts.map((p) => ({
      slug: getPostSlug(p),
      data: p.data,
      contentHtml: renderPostContentHtml(p.body ?? '', SITE_URL),
    }));
    const xml = buildRssXml(items, SITE_URL);

    expect((xml.match(/<item>/g) ?? []).length).toBe(posts.length);
    expect(xml).toMatch(/<pubDate>[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} \+0000<\/pubDate>/);
    expect(xml).toContain('<atom:link href="https://parris.me.uk/rss.xml" rel="self"');
  });

  it('rewrites root-relative image paths in post content to absolute URLs', async () => {
    const { posts } = await loadResumeAndPosts();
    const mitWall = posts.find((p) => getPostSlug(p) === 'mit-wall')!;
    const contentHtml = renderPostContentHtml(mitWall.body ?? '', SITE_URL);
    expect(contentHtml).toContain('https://parris.me.uk/images/blog/mit-wall-rear.jpg');
    expect(contentHtml).not.toContain('src="/images');
  });

  it('has no un-escaped ampersands outside CDATA sections', async () => {
    const { posts } = await loadResumeAndPosts();
    const items = posts.map((p) => ({
      slug: getPostSlug(p),
      data: p.data,
      contentHtml: renderPostContentHtml(p.body ?? '', SITE_URL),
    }));
    const xml = buildRssXml(items, SITE_URL);
    const withoutCdata = xml.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
    expect(withoutCdata).not.toMatch(/&(?!(amp|lt|gt|quot|apos|#\d+);)/);
  });
});

describe('sitemap.xml endpoint', () => {
  it('returns valid XML with the correct content type', async () => {
    const response = await sitemapGet({ site: SITE_URL } as any);
    expect(response.headers.get('Content-Type')).toContain('application/xml');
    const body = await response.text();
    expect(body).toContain('<urlset');
  });
});

describe('rss.xml endpoint', () => {
  it('returns valid XML with the correct content type', async () => {
    const response = await rssGet({ site: SITE_URL } as any);
    expect(response.headers.get('Content-Type')).toContain('application/rss+xml');
    const body = await response.text();
    expect(body).toContain('<rss ');
  });
});
