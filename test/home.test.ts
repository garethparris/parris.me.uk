// test/home.test.ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Home from '../src/pages/index.astro';

describe('Home page', () => {
  it('renders the hero and current-focus card', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Home);

    expect(result).toContain('Gareth Parris');
    expect(result).toContain('CURRENT FOCUS');
    expect(result).toContain('SOC 2 renewal &amp; platform scalability');
  });
});
