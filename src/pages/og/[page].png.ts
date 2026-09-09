// src/pages/og/[page].png.ts
//
// Build-time-generated 1200x630 OG cards, one per static page, so every
// page — including future ones — gets a correct share-card image with no
// manual asset step. Blog posts don't use this: they override `image` with
// their existing heroImage (see src/pages/blog/[slug].astro).
import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getCollection } from 'astro:content';
import { Resvg } from '@resvg/resvg-js';
import { renderOgSvg, OG_WIDTH, type OgCardData } from '../../lib/og';

// Resolved from the build's working directory rather than `import.meta.url`:
// Astro bundles/relocates this endpoint's compiled module as part of the
// build, so a path relative to the source file's own location does not
// survive into the built output. `astro build` always runs from the project
// root, so this is stable regardless of where the compiled file ends up.
const FONTS_DIR = join(process.cwd(), 'src/assets/fonts');

async function loadFonts() {
  const [regular, bold] = await Promise.all([
    readFile(join(FONTS_DIR, 'JetBrainsMono-Regular.ttf')),
    readFile(join(FONTS_DIR, 'JetBrainsMono-Bold.ttf')),
  ]);
  return { regular, bold };
}

export async function getStaticPaths() {
  const [resume] = await getCollection('resume');

  const cards: Array<{ page: string; card: OgCardData }> = [
    {
      page: 'home',
      card: { eyebrow: 'parris.me.uk', title: 'Gareth Parris', subtitle: 'Director of Software Engineering' },
    },
    {
      page: 'resume',
      card: { eyebrow: 'parris.me.uk/resume', title: 'Resume', subtitle: resume.data.headline },
    },
    {
      page: 'blog',
      card: {
        eyebrow: 'parris.me.uk/blog',
        title: 'Blog',
        subtitle: 'Networking, hardware projects, and career highlights',
      },
    },
    {
      page: 'contact',
      card: { eyebrow: 'parris.me.uk/contact', title: 'Contact', subtitle: 'Get in touch' },
    },
  ];

  return cards.map(({ page, card }) => ({ params: { page }, props: card }));
}

export const GET: APIRoute = async ({ props }) => {
  const fonts = await loadFonts();
  const svg = await renderOgSvg(props as OgCardData, fonts);
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
  // Cloudflare's ambient Response type (from @cloudflare/workers-types, which
  // this project's tsconfig prioritises) doesn't accept a Node Buffer as
  // BodyInit even though Buffer structurally satisfies ArrayBufferView.
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
