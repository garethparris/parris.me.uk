// src/lib/site.ts
//
// Single source of truth for site-wide identity and URL construction, so the
// Layout head, JSON-LD, sitemap, RSS and llms.txt can never disagree about
// the site's name, canonical domain, or social profile links.

export const SITE = {
  name: 'Gareth Parris',
  // Shown in og:site_name — deliberately the person's name, not the domain,
  // since a recruiter seeing the name (not "parris.me.uk") is the point.
  siteName: 'Gareth Parris',
  url: 'https://parris.me.uk',
  description:
    'Director of Software Engineering leading teams around observability, incident management and platform reliability.',
  locale: 'en_GB',
  themeColor: '#131722', // --color-bg
  accentColor: '#4fd1c5', // --color-accent-teal
  author: 'Gareth Parris',
  // Fallback for any page that doesn't pass its own `image` prop. Every
  // current page does (see src/pages/og/[page].png.ts), so this only matters
  // for a future page that forgets to.
  ogImage: '/og/home.png',
  // Identity graph for JSON-LD Person.sameAs. Profile links only — no email,
  // no phone, per the deliberate choice to keep the machine-readable footprint
  // small while still giving engines an entity to reconcile against.
  sameAs: ['https://linkedin.com/in/garethparris', 'https://github.com/garethparris'],
} as const;

/** Static (non-collection-driven) page routes, used by the sitemap/RSS/llms.txt builders. */
export const PAGE_ROUTES = ['/', '/resume', '/blog', '/contact'] as const;

const FILE_EXTENSION = /\.[a-z0-9]+$/i;

/**
 * Builds an absolute, trailing-slash-normalised URL for a route.
 *
 * `trailingSlash: 'always'` (astro.config.mjs) means every HTML page's
 * canonical URL ends in `/`, matching what's already live and indexed
 * (verified: `GET /resume` 307s to `/resume/`, which is the current
 * canonical). Extension-bearing routes (`/rss.xml`, `/resume.md`) are never
 * slashed, since they are files, not directory-style pages.
 */
export function pageUrl(pathname: string, site: URL): string {
  const trimmed = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const hasExtension = FILE_EXTENSION.test(trimmed);
  const normalised = hasExtension || trimmed === '/' ? trimmed : `${trimmed}/`;
  return new URL(normalised, site).toString();
}
