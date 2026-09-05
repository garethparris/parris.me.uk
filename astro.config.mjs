// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://parris.me.uk',
  output: 'static',
  adapter: cloudflare(),
  legacy: { collectionsBackwardsCompat: true },
});
