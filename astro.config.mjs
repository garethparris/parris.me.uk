// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// No adapter: this site is fully static with zero server-rendered Astro
// routes. The contact form is handled by the Cloudflare Worker entry point at
// `src/worker.ts`, independent of Astro's router. Adding the Cloudflare
// adapter would split the build into dist/client + dist/server, which does
// not match wrangler.toml's `[assets] directory = "./dist"`.
export default defineConfig({
  site: 'https://parris.me.uk',
  output: 'static',
  // Matches what's already live and indexed: the default `build.format:
  // 'directory'` plus Cloudflare's asset router already canonicalise every
  // page to a trailing slash (verified live: `GET /resume` 307s to
  // `/resume/`). Setting this explicitly keeps `Astro.url.pathname` (and so
  // the canonical tag) in agreement with that in both dev and prod, and with
  // the sitemap/JSON-LD, which build URLs via `src/lib/site.ts`'s `pageUrl`.
  trailingSlash: 'always',
  legacy: { collectionsBackwardsCompat: true },
  // Stable in astro@7.3.1 (config.d.ts documents @version 6.0.0, @default
  // false — not the experimental flag from older Astro docs). Chosen over a
  // static CSP header in public/_headers because Astro may inline the
  // contact page's <script> and the site's stylesheet depending on their
  // size (build.inlineStylesheets defaults to 'auto'), so a hand-written
  // `script-src 'self'` would be a coin flip; Astro emits build-time hashes
  // either way and they can never drift from the actual output.
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "img-src 'self' data:",
        "connect-src 'self'",
        "form-action 'self'",
        // Cloudflare Turnstile's documented CSP requirement (contact.astro's
        // widget), not covered by Astro's own script/style directives since
        // it's an external, unprocessed <script async defer>.
        'frame-src https://challenges.cloudflare.com',
        'upgrade-insecure-requests',
      ],
      scriptDirective: {
        // Replaces (does not merge with) Astro's default resources, so
        // 'self' must be restated alongside the Turnstile origin.
        resources: ["'self'", 'https://challenges.cloudflare.com'],
      },
      styleDirective: {
        // The site uses inline style="..." attributes throughout (contact,
        // resume, blog post, and the Layout footer), which style-src-attr
        // governs and cannot hash. Scoping 'unsafe-inline' to kind:
        // 'attribute' emits `style-src-attr 'unsafe-inline'`, while 'self'
        // is scoped to kind: 'element' for the actual build-time-hashed
        // directive: because both resources have an explicit kind (neither
        // is left at the default kind), Astro emits a separate
        // `style-src-elem 'self' 'sha256-...'` directive for <style>/<link>
        // elements — not a hash-bearing `style-src` — plus a hash-free
        // `style-src 'self'` fallback for anything neither -elem nor -attr
        // covers. Giving 'self' an explicit kind (rather than leaving it at
        // the default kind, which would apply to both -elem and -attr) is
        // what silences Astro's "won't apply to style-src-attr" build
        // warning. Verified against the actual built CSP meta tag.
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  // Pre-empts a landmine rather than fixing one: Shiki (Astro's default code
  // fence highlighter) emits inline styles that Astro's CSP explicitly can't
  // support. There are no code fences in src/content/** today, so this is
  // currently a no-op — but the first post with a ``` fence would otherwise
  // silently break CSP.
  markdown: { syntaxHighlight: false },
  // `astro sync` (used as a pretest step) writes the content data store to
  // `cacheDir` (default: node_modules/.astro), but Vitest always resolves
  // Vite's `command` as "serve" and therefore reads the data store from the
  // project-root `.astro/` dir (the same place `astro dev` writes to).
  // Aligning cacheDir with that dir means `astro sync` populates the exact
  // file `getCollection()` looks for in tests, with no dev server needed.
  cacheDir: './.astro',
});
