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
    expect(result).toContain('href="/resume"');
    expect(result).toContain('href="/blog"');
    expect(result).toContain('href="/contact"');
    expect(result).toContain('<p>content</p>');
  });
});
