// test/home.test.ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import Home from '../src/pages/index.astro';
import { formatPostDate } from '../src/lib/blog';

describe('Home page', () => {
  it('renders the hero and current-focus card', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Home);

    expect(result).toContain('Gareth Parris');
    expect(result).toContain('CURRENT FOCUS');
    expect(result).toContain('SOC 2 renewal &amp; platform scalability');
  });

  it('renders a <time> with a stable ISO datetime for each blog teaser card', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Home);

    // Derived from the collection (the two newest posts, matching the
    // .slice(0, 2) teaser in src/pages/index.astro) rather than a literal
    // date: a literal here silently breaks the moment a second post becomes
    // newer than whichever post it was asserting against.
    const newestTwo = (await getCollection('blog'))
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .slice(0, 2);
    expect(newestTwo.length).toBeGreaterThan(0);

    for (const post of newestTwo) {
      const { iso } = formatPostDate(post.data.pubDate);
      expect(result).toContain(`<time datetime="${iso}"`);
    }
  });
});
