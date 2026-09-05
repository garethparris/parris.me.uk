import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Resume from '../src/pages/resume.astro';

describe('Resume page', () => {
  it('shows current roles in full and collapses earlier roles', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Resume);

    expect(result).toContain('BrightSign');
    expect(result).toContain('Director of Software Engineering');
    expect(result).toContain('Savernake Capital');

    // Earlier-tier roles are present in the markup (for SEO/no-JS access)
    // but nested inside a <details> so they're collapsed by default.
    expect(result).toContain('McLaren Applied Technologies');
    expect(result).toMatch(/<details>[\s\S]*McLaren Applied Technologies[\s\S]*<\/details>/);
  });

  it('renders skill tag groups', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Resume);

    expect(result).toContain('Cloud &amp; Platform');
    expect(result).toContain('Kubernetes');
    expect(result).toContain('OpenTelemetry');
  });
});
