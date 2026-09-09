// src/lib/og.ts
//
// Renders the SVG for a build-time OG card via satori (pure JS, JSX-less
// object tree since this file has no .tsx pragma). Kept separate from the
// PNG conversion step (which needs @resvg/resvg-js, a native binary) so this
// half is testable as plain string output with no image decoding involved.
import satori from 'satori';
import { SITE } from './site';

export interface OgCardData {
  /** Small label above the title, e.g. "parris.me.uk/resume". */
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface OgFonts {
  regular: Buffer;
  bold: Buffer;
}

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export async function renderOgSvg(card: OgCardData, fonts: OgFonts): Promise<string> {
  return satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: SITE.themeColor,
          padding: '64px',
          fontFamily: 'JetBrains Mono',
        },
        children: [
          {
            type: 'div',
            props: { style: { fontSize: 28, color: SITE.accentColor }, children: card.eyebrow },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '20px' },
              children: [
                {
                  type: 'div',
                  props: { style: { fontSize: 64, fontWeight: 700, color: '#f5f5f5' }, children: card.title },
                },
                {
                  type: 'div',
                  props: { style: { fontSize: 32, color: '#a0a8b8' }, children: card.subtitle },
                },
              ],
            },
          },
          {
            type: 'div',
            props: { style: { fontSize: 26, color: '#6b7280' }, children: SITE.url.replace(/^https:\/\//, '') },
          },
        ],
      },
    },
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        { name: 'JetBrains Mono', data: fonts.regular, weight: 400, style: 'normal' },
        { name: 'JetBrains Mono', data: fonts.bold, weight: 700, style: 'normal' },
      ],
    }
  );
}
