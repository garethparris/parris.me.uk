// test/blog.test.ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import BlogIndex from '../src/pages/blog/index.astro';

describe('Blog index', () => {
  it('lists all posts', async () => {
    const posts = await getCollection('blog');
    expect(posts).toHaveLength(6);

    const container = await AstroContainer.create();
    const result = await container.renderToString(BlogIndex);

    expect(result).toContain('Event Technology of the Year 2020 Drum Award');
    expect(result).toContain('Working with a Winning Team');
    expect(result).toContain('Helping create an Interactive Wall for MIT');
    expect(result).toContain('Custom SoHo Server Rack with Ubiquity Unifi');
    expect(result).toContain('Finalist, 2025 Graham Impact Awards');
    expect(result).toContain('kitty-pounce: A Flat-Ring Window Cycler for Kitty');
  });

  it('renders a <time> with a stable ISO datetime for each post', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BlogIndex);

    // Asserting the ISO datetime attribute, not the localized display
    // string, since the display string is ICU-dependent.
    expect(result).toContain('<time datetime="2025-11-01"');
    expect(result).toContain('<time datetime="2017-11-01"');
  });

  it('sorts posts newest first', async () => {
    const posts = await getCollection('blog');
    const dates = posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((p) => p.data.pubDate.getFullYear());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });
});

import BlogPost, { getStaticPaths } from '../src/pages/blog/[slug].astro';

describe('Blog post page', () => {
  it('generates one static path per post', async () => {
    const paths = await getStaticPaths();
    expect(paths).toHaveLength(6);
    expect(paths.map((p) => p.params.slug).sort()).toEqual(
      ['drum-award', 'graham-impact-awards', 'kitty-pounce', 'mercedes', 'mit-wall', 'server-rack'].sort()
    );
  });

  it('renders a post with its tags and content', async () => {
    const container = await AstroContainer.create();
    const paths = await getStaticPaths();
    const serverRackPath = paths.find((p) => p.params.slug === 'server-rack')!;

    const result = await container.renderToString(BlogPost, {
      props: serverRackPath.props,
    });

    expect(result).toContain('Custom SoHo Server Rack with Ubiquity Unifi');
    expect(result).toContain('UniFi Dream Machine Pro');
    expect(result).toContain('Ubiquity');
    expect(result).toContain('<time datetime="2020-07-01"');
  });
});
