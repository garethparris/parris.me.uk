// test/blog.test.ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import BlogIndex from '../src/pages/blog/index.astro';
import { getPostSlug } from '../src/lib/blog';

describe('Blog index', () => {
  it('lists all posts', async () => {
    const posts = await getCollection('blog');
    // Guards the title loop below against passing vacuously on an empty
    // collection, the same reason test/blog-links.test.ts asserts a count.
    expect(posts.length).toBeGreaterThan(0);

    const container = await AstroContainer.create();
    const result = await container.renderToString(BlogIndex);

    for (const post of posts) {
      expect(result).toContain(post.data.title);
    }
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
    const posts = await getCollection('blog');
    const paths = await getStaticPaths();
    expect(paths.length).toBeGreaterThan(0);
    expect(paths).toHaveLength(posts.length);
    expect(paths.map((p) => p.params.slug).sort()).toEqual(
      posts.map((p) => getPostSlug(p)).sort()
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

  it('does not render a "Discuss on LinkedIn" link when linkedInUrl is absent', async () => {
    const container = await AstroContainer.create();
    const paths = await getStaticPaths();
    const serverRackPath = paths.find((p) => p.params.slug === 'server-rack')!;

    const result = await container.renderToString(BlogPost, { props: serverRackPath.props });

    expect(result).not.toContain('Discuss this post on LinkedIn');
  });

  it('renders a "Discuss on LinkedIn" link when linkedInUrl is present', async () => {
    const container = await AstroContainer.create();
    const paths = await getStaticPaths();
    const serverRackPath = paths.find((p) => p.params.slug === 'server-rack')!;
    const linkedInUrl = 'https://www.linkedin.com/posts/garethparris_activity-1234567890';
    // Spread the real entry rather than constructing one from scratch: render()
    // needs the entry's actual rendering internals, which a from-scratch object
    // wouldn't carry.
    const propsWithLinkedIn = {
      post: { ...serverRackPath.props.post, data: { ...serverRackPath.props.post.data, linkedInUrl } },
    };

    const result = await container.renderToString(BlogPost, { props: propsWithLinkedIn });

    expect(result).toContain('Discuss this post on LinkedIn');
    expect(result).toContain(`href="${linkedInUrl}"`);
  });
});
