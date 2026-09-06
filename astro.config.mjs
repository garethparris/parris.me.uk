// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// No adapter: this site is fully static with zero server-rendered Astro
// routes. The contact form is a standalone Cloudflare Pages Function under
// `functions/`, independent of Astro's router. Adding the Cloudflare adapter
// would split the build into dist/client + dist/server, which does not match
// wrangler.toml's `pages_build_output_dir = "dist"`.
export default defineConfig({
  site: 'https://parris.me.uk',
  output: 'static',
  legacy: { collectionsBackwardsCompat: true },
  // `astro sync` (used as a pretest step) writes the content data store to
  // `cacheDir` (default: node_modules/.astro), but Vitest always resolves
  // Vite's `command` as "serve" and therefore reads the data store from the
  // project-root `.astro/` dir (the same place `astro dev` writes to).
  // Aligning cacheDir with that dir means `astro sync` populates the exact
  // file `getCollection()` looks for in tests, with no dev server needed.
  cacheDir: './.astro',
});
