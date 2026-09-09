import { readFile } from 'node:fs/promises';
import { describe, it, expect, beforeAll } from 'vitest';
import { renderOgSvg, OG_WIDTH, OG_HEIGHT } from '../src/lib/og';

const FONTS_DIR = new URL('../src/assets/fonts/', import.meta.url);

let fonts: { regular: Buffer; bold: Buffer };

beforeAll(async () => {
  const [regular, bold] = await Promise.all([
    readFile(new URL('JetBrainsMono-Regular.ttf', FONTS_DIR)),
    readFile(new URL('JetBrainsMono-Bold.ttf', FONTS_DIR)),
  ]);
  fonts = { regular, bold };
});

describe('renderOgSvg', () => {
  it('renders a well-formed SVG at the OG card dimensions', async () => {
    const svg = await renderOgSvg(
      { eyebrow: 'parris.me.uk', title: 'Gareth Parris', subtitle: 'Director of Software Engineering' },
      fonts
    );
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain(`width="${OG_WIDTH}"`);
    expect(svg).toContain(`height="${OG_HEIGHT}"`);
  });

  it('produces different output for different card content (satori traces text to glyph paths, not literal text nodes, so this — not a string match — is what proves the props are actually rendered)', async () => {
    const short = await renderOgSvg({ eyebrow: 'a', title: 'Hi', subtitle: 'x' }, fonts);
    const long = await renderOgSvg(
      { eyebrow: 'parris.me.uk/resume', title: 'Resume', subtitle: 'A much longer subtitle string' },
      fonts
    );
    expect(short).not.toBe(long);
  });
});
