// src/lib/schema.ts
//
// JSON-LD structured data. Pure functions taking plain data (never
// `Astro.site`, which AstroContainer tests leave undefined) and returning
// plain objects, so this is testable with `toEqual`/`toContain` on the
// objects themselves rather than string-matching serialized JSON.
import type { CollectionEntry } from 'astro:content';
import { SITE, pageUrl } from './site';

type ResumeData = CollectionEntry<'resume'>['data'];
type BlogData = CollectionEntry<'blog'>['data'];

// Stable @ids so engines dedupe the same entity across pages (the full
// Person appears on both / and /resume/, from the same buildPerson() call).
const personId = (site: URL) => `${site.origin}/#person`;
const websiteId = (site: URL) => `${site.origin}/#website`;

/**
 * The one full Person entity for the site, called identically from `/` and
 * `/resume/` so both pages describe the same `@id` — an assistant that
 * fetches only one of the two still gets the complete answer to "who is
 * Gareth Parris".
 *
 * jobTitle/worksFor are derived by matching /present/i on a title's `dates`
 * string, NOT `roles[0]` or `tier === 'current'`: `tier: 'current'` means
 * "render expanded" in resume.astro, not "present" — Savernake Capital ended
 * Jul 2022 and is still `tier: 'current'`.
 */
export function buildPerson(resume: ResumeData, site: URL) {
  let presentRole: ResumeData['roles'][number] | undefined;
  let presentTitle: ResumeData['roles'][number]['titles'][number] | undefined;
  for (const role of resume.roles) {
    const title = role.titles.find((t) => /present/i.test(t.dates));
    if (title) {
      presentRole = role;
      presentTitle = title;
      break;
    }
  }

  // Flattened labels + items: the densest single "what is he good at" signal
  // on the site (~75 topics). Labels are legitimate topics too (e.g.
  // "Observability & Incident Management"), not just group headings.
  const knowsAbout = Array.from(
    new Set(resume.skillGroups.flatMap((group) => [group.label, ...group.items]))
  );

  return {
    '@type': 'Person',
    '@id': personId(site),
    name: SITE.name,
    url: pageUrl('/', site),
    image: new URL(SITE.ogImage, site).toString(),
    sameAs: [...SITE.sameAs],
    description: resume.headline,
    ...(presentTitle ? { jobTitle: presentTitle.title } : {}),
    ...(presentRole ? { worksFor: { '@type': 'Organization', name: presentRole.company } } : {}),
    knowsAbout,
    // schema.org/award accepts free text, so awards/certifications pass
    // through as-is rather than being regex-parsed into structured fields.
    award: resume.awards,
    hasCredential: resume.certifications.map((name) => ({
      '@type': 'EducationalOccupationalCredential',
      name,
    })),
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: resume.alumniOf.name,
      url: resume.alumniOf.url,
    },
  };
}

export function buildWebSite(site: URL) {
  return {
    '@type': 'WebSite',
    '@id': websiteId(site),
    url: pageUrl('/', site),
    name: SITE.siteName,
    description: SITE.description,
    inLanguage: 'en-GB',
    publisher: { '@id': personId(site) },
  };
}

export function buildProfilePage(resume: ResumeData, site: URL) {
  const url = pageUrl('/resume', site);
  return {
    '@type': 'ProfilePage',
    '@id': `${url}#profilepage`,
    url,
    name: 'Resume | Gareth Parris',
    dateModified: resume.updated.toISOString(),
    mainEntity: { '@id': personId(site) },
  };
}

export function buildBlogPosting(post: BlogData, slug: string, site: URL) {
  const url = pageUrl(`/blog/${slug}`, site);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    datePublished: post.pubDate.toISOString(),
    dateModified: (post.updatedDate ?? post.pubDate).toISOString(),
    image: new URL(post.heroImage, site).toString(),
    keywords: post.tags.join(', '),
    articleSection: post.category,
    author: { '@id': personId(site) },
    publisher: { '@id': personId(site) },
    // discussionUrl is a real schema.org CreativeWork property; only emitted
    // once the post has been shared, matching post.linkedInUrl's own default.
    ...(post.linkedInUrl ? { discussionUrl: post.linkedInUrl } : {}),
  };
}

export function buildBlogIndexSchema(
  posts: Array<{ data: BlogData; slug: string }>,
  site: URL
) {
  const url = pageUrl('/blog', site);
  return {
    '@type': 'Blog',
    '@id': `${url}#blog`,
    url,
    name: 'Blog | Gareth Parris',
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.data.title,
      url: pageUrl(`/blog/${post.slug}`, site),
      datePublished: post.data.pubDate.toISOString(),
    })),
  };
}

/**
 * Serializes a JSON-LD `@graph` for embedding inside
 * `<script type="application/ld+json">` via `set:html`.
 *
 * Two escaping traps this guards against:
 * - `set:html` does not escape, and the HTML parser only terminates a
 *   `<script>` on a literal `</script` sequence — so a `<` inside a JSON
 *   string value must become `<`, or content containing `</script>`
 *   (e.g. a role description) would truncate the page's own markup.
 * - `&` is deliberately left as-is: entity-encoding (`&amp;`) is an HTML-body
 *   rule that does not apply inside a `<script>` element's raw text content,
 *   so `"Cloud & Platform"` serializes as `"Cloud & Platform"`, not
 *   `"Cloud &amp; Platform"`. This is the opposite of the rest of the test
 *   suite, which hand-encodes ampersands because it's asserting against HTML
 *   body text, not script content.
 */
export function serializeJsonLd(graph: object[]): string {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  return json.replace(/</g, '\\u003c');
}
