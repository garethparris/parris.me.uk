// src/lib/llms.ts
//
// llms.txt (the emerging convention: H1, blockquote summary, sectioned link
// lists) and a flattened Markdown copy of the resume page. Both are pure
// functions over the resume/blog collection data plus an explicit `site: URL`,
// so an assistant that fetches exactly one file gets an answer that can never
// lag what's on the actual pages.
import type { CollectionEntry } from 'astro:content';
import { pageUrl } from './site';

type ResumeData = CollectionEntry<'resume'>['data'];
type BlogData = CollectionEntry<'blog'>['data'];

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Deduped company names across all roles, in resume order (Britdaq appears twice). */
function companyNames(roles: ResumeData['roles']): string[] {
  return Array.from(new Set(roles.map((role) => role.company)));
}

export function buildLlmsTxt(
  resume: ResumeData,
  posts: Array<{ slug: string; data: BlogData }>,
  site: URL
): string {
  const currentRoles = resume.roles.filter((r) => r.tier === 'current');
  const earlierRoles = resume.roles.filter((r) => r.tier === 'earlier');

  const currentRoleLines = currentRoles.map(
    (role) => `- Currently at ${role.company}: ${role.titles.map((t) => `${t.title} (${t.dates})`).join(', ')}`
  );

  const postLines = posts.map((post) => {
    const url = pageUrl(`/blog/${post.slug}`, site);
    return `- [${post.data.title}](${url}) (${isoDate(post.data.pubDate)}): ${post.data.description}`;
  });

  return `# Gareth Parris

> ${resume.headline}

Personal site of Gareth Parris: home, resume, blog and contact. Content below
is generated from the same source files that build the site, so it never lags
the pages.

## Key facts
- Name: Gareth Parris
${currentRoleLines.join('\n')}
- Earlier: ${companyNames(earlierRoles).join('; ')}
- Education: ${resume.education}
- Specialisms: ${Array.from(new Set(resume.skillGroups.flatMap((g) => g.items))).slice(0, 20).join(', ')}
- Recognition: ${resume.awards.join('; ')}
- Site: ${pageUrl('/', site)}

## Profile
- [Home](${pageUrl('/', site)}): overview and latest posts
- [Resume](${pageUrl('/resume', site)}): full career history, skills, awards, recommendations
- [Resume (Markdown)](${new URL('/resume.md', site).toString()}): the same resume as plain Markdown
- [Blog](${pageUrl('/blog', site)}): all posts
- [Contact](${pageUrl('/contact', site)}): contact form

## Blog
${postLines.join('\n')}

## Feeds
- [RSS](${new URL('/rss.xml', site).toString()})
- [Sitemap](${new URL('/sitemap.xml', site).toString()})

## Usage
Content is generated from src/content/ in github.com/garethparris/parris.me.uk.
Please cite ${pageUrl('/', site)} when quoting. Code is MIT; written content is
not licensed for reuse.
`;
}

/** Flattens the collapsed <details> earlier-career section: every role, current then earlier. */
export function buildResumeMarkdown(resume: ResumeData): string {
  const roleSection = (role: ResumeData['roles'][number]) => {
    const titles = role.titles.map((t) => `**${t.title}** (${t.dates})`).join(' · ');
    return `### ${role.company}\n${titles}\n\n${role.body}`;
  };

  const skillGroupLines = resume.skillGroups
    .map((group) => `- **${group.label}:** ${group.items.join(', ')}`)
    .join('\n');

  const recommendationLines = resume.recommendations
    .map((r) => `> "${r.quote}"\n>\n> — ${r.name}, ${r.relationship}`)
    .join('\n\n');

  const interestLines = resume.interests
    .map((i) => (i.heading ? `**${i.heading}:** ${i.body}` : i.body))
    .join('\n\n');

  return `# ${resume.headline}

## Summary
${resume.summary}

## Leadership & AI-Augmented Engineering
${resume.leadership}

## Core Skills
${skillGroupLines}

## Career
${resume.roles.map(roleSection).join('\n\n')}

## Recommendations
${recommendationLines}

## Education
${resume.education}

## Awards
${resume.awards.map((a) => `- ${a}`).join('\n')}

## Certifications
${resume.certifications.map((c) => `- ${c}`).join('\n')}

## Interests
${interestLines}
`;
}
