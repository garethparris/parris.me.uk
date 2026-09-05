// test/blog.test.ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import BlogIndex from '../src/pages/blog/index.astro';

describe('Blog index', () => {
  it('lists all four migrated posts', async () => {
    const posts = await getCollection('blog');
    expect(posts).toHaveLength(4);

    const container = await AstroContainer.create();
    const result = await container.renderToString(BlogIndex);

    expect(result).toContain('Event Technology of the Year 2020 Drum Award');
    expect(result).toContain('Working with a Winning Team');
    expect(result).toContain('Helping create an Interactive Wall for MIT');
    expect(result).toContain('Custom SoHo Server Rack with Ubiquity Unifi');
  });

  it('sorts posts newest first', async () => {
    const posts = await getCollection('blog');
    const dates = posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((p) => p.data.pubDate.getFullYear());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });
});
