// test/blog-links.test.ts
//
// Regression cover for the `post.slug` bug: Astro 7 content entries expose
// `id` (e.g. "drum-award.md"), not `slug`, so building a link from
// `post.slug` silently produced `/blog/undefined` on every card. Nothing in
// the suite rendered a page and looked at its hrefs, so it shipped unnoticed.
//
// These tests render the two pages that link to posts and check the links
// themselves, rather than trusting the helper that generates them. They also
// check the two pages agree about which posts exist, so the Home teaser and
// the Blog index can never drift apart.
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Home from '../src/pages/index.astro';
import BlogIndex from '../src/pages/blog/index.astro';

/** Every relative `/blog/<something>/` post href in a rendered page, in order. */
function extractPostLinks(html: string): string[] {
  const links: string[] = [];
  for (const match of html.matchAll(/href="([^"]*)"/g)) {
    const href = match[1];
    // Post links only: excludes the nav's bare "/blog/" index link and the
    // absolute canonical URL, neither of which is a post link.
    if (href.startsWith('/blog/') && href !== '/blog/') links.push(href);
  }
  return links;
}

function slugsFrom(links: string[]): Set<string> {
  return new Set(links.map((href) => href.replace(/^\/blog\//, '').replace(/\/$/, '')));
}

async function render(component: Parameters<AstroContainer['renderToString']>[0]) {
  const container = await AstroContainer.create();
  return container.renderToString(component);
}

const VALID_POST_LINK = /^\/blog\/[a-z-]+\/$/;

describe('blog post links', () => {
  it('renders well-formed post links on the Blog index', async () => {
    const links = extractPostLinks(await render(BlogIndex));

    // Guards the assertions below against passing vacuously on an empty set.
    expect(links).toHaveLength(5);

    for (const href of links) {
      expect(href).toMatch(VALID_POST_LINK);
      expect(href).not.toContain('undefined');
      expect(href).not.toContain('.md');
    }
  });

  it('renders well-formed post links on the Home page teaser', async () => {
    const links = extractPostLinks(await render(Home));

    expect(links.length).toBeGreaterThan(0);

    for (const href of links) {
      expect(href).toMatch(VALID_POST_LINK);
      expect(href).not.toContain('undefined');
      expect(href).not.toContain('.md');
    }
  });

  it('never disagrees between Home and the Blog index about which posts exist', async () => {
    const homeSlugs = slugsFrom(extractPostLinks(await render(Home)));
    const indexSlugs = slugsFrom(extractPostLinks(await render(BlogIndex)));

    expect(homeSlugs.size).toBeGreaterThan(0);

    const orphaned = [...homeSlugs].filter((slug) => !indexSlugs.has(slug));
    expect(orphaned).toEqual([]);
  });
});
