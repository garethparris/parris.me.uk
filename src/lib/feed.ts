// src/lib/feed.ts
//
// Sitemap and RSS generation. Pure functions taking an explicit `site: URL`
// (never `Astro.site`, unset under AstroContainer) so this is unit-testable
// with no container, and so sitemap.xml.ts/rss.xml.ts stay 5-line wrappers.
import { marked } from 'marked';
import type { CollectionEntry } from 'astro:content';
import { PAGE_ROUTES, pageUrl } from './site';

type ResumeData = CollectionEntry<'resume'>['data'];
type BlogData = CollectionEntry<'blog'>['data'];

export function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Rewrites root-relative `src="/..."`/`href="/..."` attributes to absolute
 * URLs. Required for RSS validity: post bodies contain root-relative image
 * paths (e.g. `![Rear Wall](/images/blog/mit-wall-rear.jpg)`, which `marked`
 * turns into `<img src="/images/blog/mit-wall-rear.jpg">`), and a relative
 * URL inside a feed item has no base to resolve against in a reader.
 */
export function absolutizeHtml(html: string, site: URL): string {
  return html.replace(/(src|href)="(\/[^"]*)"/g, (_match, attr: string, path: string) => {
    return `${attr}="${new URL(path, site).toString()}"`;
  });
}

/** Converts a post's raw markdown body to absolutized HTML, for RSS content:encoded. */
export function renderPostContentHtml(bodyMarkdown: string, site: URL): string {
  return absolutizeHtml(marked.parse(bodyMarkdown) as string, site);
}

export interface SitemapEntry {
  route: string;
  lastmod?: Date;
}

/**
 * Builds the full set of sitemap entries from the static page list plus the
 * blog collection, so a new page or post is included automatically — this is
 * the single source of truth that the route-drift test checks against.
 */
export function buildSitemapEntries(
  resume: ResumeData,
  posts: Array<{ slug: string; data: BlogData }>
): SitemapEntry[] {
  const entries: SitemapEntry[] = PAGE_ROUTES.map((route) =>
    route === '/resume' ? { route, lastmod: resume.updated } : { route }
  );
  for (const post of posts) {
    entries.push({ route: `/blog/${post.slug}`, lastmod: post.data.updatedDate ?? post.data.pubDate });
  }
  return entries;
}

export function buildSitemapXml(entries: SitemapEntry[], site: URL): string {
  const urls = entries
    .map((entry) => {
      const loc = escapeXml(pageUrl(entry.route, site));
      const lastmod = entry.lastmod ? `<lastmod>${entry.lastmod.toISOString().slice(0, 10)}</lastmod>` : '';
      return `  <url><loc>${loc}</loc>${lastmod}</url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function rfc822(date: Date): string {
  return date.toUTCString().replace('GMT', '+0000');
}

export function buildRssXml(
  posts: Array<{ slug: string; data: BlogData; contentHtml: string }>,
  site: URL
): string {
  const channelLink = pageUrl('/', site);
  const feedUrl = new URL('/rss.xml', site).toString();
  const items = posts
    .map((post) => {
      const link = pageUrl(`/blog/${post.slug}`, site);
      return [
        '  <item>',
        `    <title>${escapeXml(post.data.title)}</title>`,
        `    <link>${escapeXml(link)}</link>`,
        `    <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `    <pubDate>${rfc822(post.data.pubDate)}</pubDate>`,
        `    <description>${escapeXml(post.data.description)}</description>`,
        `    <content:encoded><![CDATA[${post.contentHtml}]]></content:encoded>`,
        '  </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>Gareth Parris</title>',
    `    <link>${escapeXml(channelLink)}</link>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    '    <description>Blog posts on networking, hardware projects, and career highlights.</description>',
    '    <language>en-gb</language>',
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
