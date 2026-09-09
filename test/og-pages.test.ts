// Guard test: every page's og:image must point at a slug the OG endpoint's
// getStaticPaths() actually generates, so og:image can never point at a 404.
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Home from '../src/pages/index.astro';
import Resume from '../src/pages/resume.astro';
import BlogIndex from '../src/pages/blog/index.astro';
import Contact from '../src/pages/contact.astro';
import { getStaticPaths } from '../src/pages/og/[page].png';

function extractOgImage(html: string): string {
  const match = html.match(/<meta property="og:image" content="([^"]*)"/);
  if (!match) throw new Error('No og:image meta tag found');
  return match[1];
}

describe('og:image references resolve to a generated OG card', () => {
  it('generates exactly one OG card per static page', async () => {
    const paths = await getStaticPaths();
    const pages = paths.map((p) => p.params.page).sort();
    expect(pages).toEqual(['blog', 'contact', 'home', 'resume']);
  });

  it("every static page's og:image slug is one getStaticPaths() actually returns", async () => {
    const generatedSlugs = new Set((await getStaticPaths()).map((p) => p.params.page));
    const container = await AstroContainer.create();

    const pages: Array<[string, any]> = [
      ['home', Home],
      ['resume', Resume],
      ['blog', BlogIndex],
      ['contact', Contact],
    ];

    for (const [name, Component] of pages) {
      const html = await container.renderToString(Component);
      const ogImage = extractOgImage(html);
      const match = ogImage.match(/\/og\/([a-z]+)\.png$/);
      expect(match, `${name} page's og:image ("${ogImage}") should point at /og/<page>.png`).not.toBeNull();
      expect(generatedSlugs.has(match![1])).toBe(true);
    }
  });
});
