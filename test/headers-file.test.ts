// test/headers-file.test.ts
//
// public/_headers is a text file with no schema and silent failure modes
// (Cloudflare's own docs: unmatched rules or malformed lines are simply
// ignored, not rejected) — this lints it against the documented limits and
// the specific footguns that motivated its design (see the file's own
// header comment).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const HEADERS_PATH = fileURLToPath(new URL('../public/_headers', import.meta.url));
const raw = readFileSync(HEADERS_PATH, 'utf-8');
const lines = raw.split('\n');

interface Rule {
  pattern: string;
  headers: Array<{ name: string; value: string }>;
}

function parseRules(text: string): Rule[] {
  const rules: Rule[] = [];
  let current: Rule | null = null;
  for (const rawLine of text.split('\n')) {
    const line = rawLine.replace(/#.*$/, '').trimEnd();
    if (line.trim() === '') continue;
    if (!rawLine.startsWith(' ') && !rawLine.startsWith('\t')) {
      current = { pattern: line.trim(), headers: [] };
      rules.push(current);
    } else if (current) {
      const [name, ...rest] = line.trim().split(':');
      current.headers.push({ name: name.trim(), value: rest.join(':').trim() });
    }
  }
  return rules;
}

const rules = parseRules(raw);

describe('public/_headers', () => {
  it('stays within the documented limits (<=100 rules, <=2000 chars/line)', () => {
    expect(rules.length).toBeLessThanOrEqual(100);
    for (const line of lines) {
      expect(line.length).toBeLessThanOrEqual(2000);
    }
  });

  it('every rule pattern starts with /', () => {
    for (const rule of rules) {
      expect(rule.pattern.startsWith('/')).toBe(true);
    }
  });

  it('does not set Cache-Control on /* (matching rules accumulate and duplicate headers comma-join)', () => {
    const catchAll = rules.find((r) => r.pattern === '/*');
    expect(catchAll).toBeDefined();
    expect(catchAll!.headers.some((h) => h.name === 'Cache-Control')).toBe(false);
  });

  it('sets immutable Cache-Control only on /_astro/* (the only content-hashed path)', () => {
    for (const rule of rules) {
      const cacheControl = rule.headers.find((h) => h.name === 'Cache-Control');
      if (cacheControl?.value.includes('immutable')) {
        expect(rule.pattern).toBe('/_astro/*');
      }
    }
  });

  it('sets the required security headers on /*', () => {
    const catchAll = rules.find((r) => r.pattern === '/*')!;
    const names = catchAll.headers.map((h) => h.name);
    expect(names).toContain('X-Content-Type-Options');
    expect(names).toContain('X-Frame-Options');
    expect(names).toContain('Referrer-Policy');
    expect(names).toContain('Permissions-Policy');
    expect(names).toContain('Strict-Transport-Security');
  });

  it('never sets Content-Security-Policy here (Astro emits it per-page at build time)', () => {
    for (const rule of rules) {
      expect(rule.headers.some((h) => h.name === 'Content-Security-Policy')).toBe(false);
    }
  });

  it('never sets X-Robots-Tag (AI crawlers and search engines are welcome)', () => {
    for (const rule of rules) {
      expect(rule.headers.some((h) => h.name === 'X-Robots-Tag')).toBe(false);
    }
  });

  it('does not set Cross-Origin-Embedder-Policy (would break the Turnstile iframe)', () => {
    for (const rule of rules) {
      expect(rule.headers.some((h) => h.name === 'Cross-Origin-Embedder-Policy')).toBe(false);
    }
  });
});
