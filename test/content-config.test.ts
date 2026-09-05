import { describe, it, expect } from 'vitest';
import { collections } from '../src/content.config';

// Import the real schema (Task 1's vitest.config.ts makes astro:content
// resolvable here) rather than duplicating its shape — this is what every
// resume.md role must satisfy.
const roleSchema = collections.resume.schema.shape.roles.element;

describe('resume role schema', () => {
  it('accepts a valid role entry', () => {
    const valid = {
      company: 'BrightSign',
      tier: 'current',
      titles: [{ title: 'Director of Software Engineering', dates: 'Oct 2025 - Present' }],
      body: 'Some markdown body.',
    };
    expect(() => roleSchema.parse(valid)).not.toThrow();
  });

  it('rejects an invalid tier value', () => {
    const invalid = {
      company: 'BrightSign',
      tier: 'recent', // not 'current' | 'earlier'
      titles: [{ title: 'Director', dates: 'Oct 2025 - Present' }],
      body: 'Some markdown body.',
    };
    expect(() => roleSchema.parse(invalid)).toThrow();
  });
});
