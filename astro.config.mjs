// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://parris.me.uk',
  output: 'static',
  adapter: cloudflare(),
  legacy: { collectionsBackwardsCompat: true },
  // `astro sync` (used as a pretest step) writes the content data store to
  // `cacheDir` (default: node_modules/.astro), but Vitest always resolves
  // Vite's `command` as "serve" and therefore reads the data store from the
  // project-root `.astro/` dir (the same place `astro dev` writes to).
  // Aligning cacheDir with that dir means `astro sync` populates the exact
  // file `getCollection()` looks for in tests, with no dev server needed.
  cacheDir: './.astro',
});
