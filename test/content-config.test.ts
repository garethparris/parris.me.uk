import { describe, it, expect } from 'vitest';
import { collections } from '../src/content.config';

// Import the real schema (Task 1's vitest.config.ts makes astro:content
// resolvable here) rather than duplicating its shape: this is what every
// resume.md role must satisfy.
//
// `defineCollection`'s `schema` type also allows a function of `SchemaContext`
// (for collections whose schema depends on config), which this project never
// uses — the `any` cast reflects that the resume collection's schema is
// always a plain ZodObject, not the function form.
const resumeSchema = collections.resume.schema as any;
const roleSchema = resumeSchema.shape.roles.element;

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

describe('resume headline field', () => {
  const headlineSchema = resumeSchema.shape.headline;

  it('accepts a short headline', () => {
    expect(() => headlineSchema.parse('Director of Software Engineering at BrightSign.')).not.toThrow();
  });

  it('rejects a headline over 160 characters, so an over-length meta description fails the build rather than getting silently truncated', () => {
    expect(() => headlineSchema.parse('x'.repeat(161))).toThrow();
  });
});

describe('blog updatedDate field', () => {
  const blogSchema = collections.blog.schema as any;

  it('is optional', () => {
    expect(() => blogSchema.shape.updatedDate.parse(undefined)).not.toThrow();
  });

  it('accepts a date when present', () => {
    expect(() => blogSchema.shape.updatedDate.parse(new Date('2026-01-01'))).not.toThrow();
  });
});

describe('blog linkedInUrl field', () => {
  const blogSchema = collections.blog.schema as any;

  it('is optional', () => {
    expect(() => blogSchema.shape.linkedInUrl.parse(undefined)).not.toThrow();
  });

  it('accepts a linkedin.com URL, with or without www.', () => {
    expect(() =>
      blogSchema.shape.linkedInUrl.parse('https://www.linkedin.com/posts/garethparris_activity-1234567890')
    ).not.toThrow();
    expect(() => blogSchema.shape.linkedInUrl.parse('https://linkedin.com/feed/update/urn:li:activity:1234567890')).not.toThrow();
  });

  it('rejects a non-URL', () => {
    expect(() => blogSchema.shape.linkedInUrl.parse('not a url')).toThrow();
  });

  it('rejects a URL that is not on linkedin.com', () => {
    expect(() => blogSchema.shape.linkedInUrl.parse('https://example.com/posts/123')).toThrow();
  });
});
