import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Layout from '../src/layouts/Layout.astro';

describe('Layout', () => {
  it('renders the title, description, and nav links', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: { title: 'Test Title', description: 'Test description' },
      slots: { default: '<p>content</p>' },
    });

    expect(result).toContain('Test Title');
    expect(result).toContain('Test description');
    expect(result).toContain('href="/resume/"');
    expect(result).toContain('href="/blog/"');
    expect(result).toContain('href="/contact/"');
    expect(result).toContain('<p>content</p>');
  });

  it('includes canonical and Open Graph tags', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: { title: 'Test Title', description: 'Test description' },
      slots: { default: '<p>content</p>' },
    });

    expect(result).toContain('rel="canonical"');
    expect(result).toContain('property="og:title"');
    expect(result).toContain('content="Test Title"');
  });

  it('includes the completed head: og:url, og:site_name, image, RSS link, theme-color', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: { title: 'Test Title', description: 'Test description' },
      slots: { default: '<p>content</p>' },
    });

    expect(result).toContain('property="og:url"');
    expect(result).toContain('property="og:site_name"');
    expect(result).toContain('content="Gareth Parris"');
    expect(result).toContain('property="og:image"');
    expect(result).toContain('name="twitter:card"');
    expect(result).toContain('content="summary_large_image"');
    expect(result).toContain('type="application/rss+xml"');
    expect(result).toContain('name="theme-color"');
    // Astro.site is undefined under AstroContainer, so only tag presence and
    // the http(s) prefix are assertable here — not an exact absolute URL.
    expect(result).toMatch(/property="og:image" content="http/);
  });

  it('switches og:type to "article" and emits article:published_time when given article dates', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: {
        title: 'A Post',
        description: 'A post description',
        article: { publishedTime: new Date('2025-11-01T00:00:00.000Z') },
      },
      slots: { default: '<p>content</p>' },
    });

    expect(result).toContain('property="og:type" content="article"');
    expect(result).toContain('property="article:published_time" content="2025-11-01T00:00:00.000Z"');
  });

  it('omits og:type="article" and article:published_time when no article prop is given', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: { title: 'Test Title', description: 'Test description' },
      slots: { default: '<p>content</p>' },
    });

    expect(result).toContain('property="og:type" content="website"');
    expect(result).not.toContain('article:published_time');
  });

  it('renders a JSON-LD script when given a schema graph, and omits it otherwise', async () => {
    const container = await AstroContainer.create();
    const withSchema = await container.renderToString(Layout, {
      props: {
        title: 'Test Title',
        description: 'Test description',
        schema: [{ '@type': 'Person', name: 'Gareth Parris' }],
      },
      slots: { default: '<p>content</p>' },
    });
    expect(withSchema).toContain('type="application/ld+json"');
    const scriptMatch = withSchema.match(/<script type="application\/ld\+json">([^<]*)<\/script>/);
    expect(scriptMatch).not.toBeNull();
    const parsed = JSON.parse(scriptMatch![1]);
    expect(parsed['@graph'][0]).toEqual({ '@type': 'Person', name: 'Gareth Parris' });

    const withoutSchema = await container.renderToString(Layout, {
      props: { title: 'Test Title', description: 'Test description' },
      slots: { default: '<p>content</p>' },
    });
    expect(withoutSchema).not.toContain('application/ld+json');
  });
});
