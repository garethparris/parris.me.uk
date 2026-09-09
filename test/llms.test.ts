import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import { buildLlmsTxt, buildResumeMarkdown } from '../src/lib/llms';
import { getPostSlug } from '../src/lib/blog';
import { PAGE_ROUTES, pageUrl } from '../src/lib/site';
import { GET as llmsGet } from '../src/pages/llms.txt';
import { GET as resumeMdGet } from '../src/pages/resume.md';

const SITE_URL = new URL('https://parris.me.uk');

async function loadResumeAndPosts() {
  const [resume] = await getCollection('resume');
  const posts = await getCollection('blog');
  return { resume, posts };
}

describe('buildLlmsTxt', () => {
  it('starts with the H1 and the headline blockquote', async () => {
    const { resume, posts } = await loadResumeAndPosts();
    const txt = buildLlmsTxt(
      resume.data,
      posts.map((p) => ({ slug: getPostSlug(p), data: p.data })),
      SITE_URL
    );
    expect(txt.startsWith('# Gareth Parris')).toBe(true);
    expect(txt).toContain(`> ${resume.data.headline}`);
  });

  it('lists every post title and URL', async () => {
    const { resume, posts } = await loadResumeAndPosts();
    const txt = buildLlmsTxt(
      resume.data,
      posts.map((p) => ({ slug: getPostSlug(p), data: p.data })),
      SITE_URL
    );
    for (const post of posts) {
      expect(txt).toContain(post.data.title);
      expect(txt).toContain(`https://parris.me.uk/blog/${getPostSlug(post)}/`);
    }
  });

  it('includes key entity names for AI-citation grounding', async () => {
    const { resume, posts } = await loadResumeAndPosts();
    const txt = buildLlmsTxt(
      resume.data,
      posts.map((p) => ({ slug: getPostSlug(p), data: p.data })),
      SITE_URL
    );
    expect(txt).toContain('Mercedes AMG HPP');
    expect(txt).toContain('University of Hertfordshire');
    expect(txt).toContain('Graham Impact Awards');
  });

  it('links to every static PAGE_ROUTES page — a new static page must be added here too, not just to the sitemap', async () => {
    const { resume, posts } = await loadResumeAndPosts();
    const txt = buildLlmsTxt(
      resume.data,
      posts.map((p) => ({ slug: getPostSlug(p), data: p.data })),
      SITE_URL
    );
    for (const route of PAGE_ROUTES) {
      expect(txt, `llms.txt should link to ${route}`).toContain(pageUrl(route, SITE_URL));
    }
  });

  it('links to the resume.md, rss.xml and sitemap.xml companions', async () => {
    const { resume, posts } = await loadResumeAndPosts();
    const txt = buildLlmsTxt(
      resume.data,
      posts.map((p) => ({ slug: getPostSlug(p), data: p.data })),
      SITE_URL
    );
    expect(txt).toContain('https://parris.me.uk/resume.md');
    expect(txt).toContain('https://parris.me.uk/rss.xml');
    expect(txt).toContain('https://parris.me.uk/sitemap.xml');
  });
});

describe('buildResumeMarkdown', () => {
  it('flattens all roles, including the ones collapsed behind <details> on the page', async () => {
    const { resume } = await loadResumeAndPosts();
    const md = buildResumeMarkdown(resume.data);
    for (const role of resume.data.roles) {
      expect(md).toContain(role.company);
    }
    expect(md).toContain('McLaren Applied Technologies');
    expect(md).toContain('Mercedes AMG HPP');
  });

  it('contains no raw HTML (it is meant to be plain Markdown)', async () => {
    const { resume } = await loadResumeAndPosts();
    const md = buildResumeMarkdown(resume.data);
    expect(md).not.toContain('<div');
    expect(md).not.toContain('<details');
  });
});

describe('llms.txt endpoint', () => {
  it('returns text/plain', async () => {
    const response = await llmsGet({ site: SITE_URL } as any);
    expect(response.headers.get('Content-Type')).toContain('text/plain');
    expect(await response.text()).toContain('# Gareth Parris');
  });
});

describe('resume.md endpoint', () => {
  it('returns text/markdown', async () => {
    const response = await resumeMdGet({ site: SITE_URL } as any);
    expect(response.headers.get('Content-Type')).toContain('text/markdown');
    expect(await response.text()).toContain('## Summary');
  });
});
