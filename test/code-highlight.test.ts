// test/code-highlight.test.ts
//
// astro.config.mjs enables Shiki syntax highlighting on the strength of one
// specific fact: Shiki emits inline `style="..."` attributes, which CSP's
// style-src-attr governs, and this site already sets style-src-attr to
// 'unsafe-inline' for its own hand-written inline styles (contact, resume,
// blog post, Layout footer). If either half of that changes, syntax
// highlighting could silently start violating the CSP the next time someone
// adds a code fence to a post. This test pins both halves so that failure
// happens here, loudly, instead of in a browser console after a deploy.
import { describe, it, expect } from 'vitest';
import config from '../astro.config.mjs';

describe('Shiki syntax highlighting is CSP-safe', () => {
  it('has syntax highlighting enabled', () => {
    expect(config.markdown?.syntaxHighlight).not.toBe(false);
  });

  it('still allows unsafe-inline for style attributes (not just style elements)', () => {
    // security.csp is typed as `boolean | { ... }` (it can be disabled
    // outright), which TypeScript won't narrow past optional chaining alone;
    // this file only runs against a config where it's the object form.
    const csp = config.security?.csp as any;
    const resources = csp?.styleDirective?.resources ?? [];
    const attributeResource = resources.find((r: any) => r?.kind === 'attribute');
    expect(attributeResource?.resource).toBe("'unsafe-inline'");
  });
});
