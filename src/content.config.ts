import { defineCollection, z } from 'astro:content';

const resume = defineCollection({
  type: 'content',
  schema: z.object({
    // Short (<=160 char) description for the meta description tag and the
    // JSON-LD Person/llms.txt summary. The `.max` makes an over-length value
    // a build failure rather than a silently truncated SERP snippet — the
    // long `summary` below stays intact for the on-page Summary section.
    headline: z.string().max(160),
    summary: z.string(),
    leadership: z.string(),
    education: z.string(),
    // Structured alongside the prose `education` string so JSON-LD's
    // `alumniOf` never has to regex a sentence to find an institution name.
    alumniOf: z.object({
      name: z.string(),
      url: z.string().url(),
    }),
    // Bumped whenever the CV is synced (see README's "Updating the Resume
    // page"); feeds the sitemap's <lastmod> and JSON-LD's dateModified.
    updated: z.date(),
    awards: z.array(z.string()),
    certifications: z.array(z.string()),
    skillGroups: z.array(
      z.object({
        label: z.string(),
        items: z.array(z.string()),
      })
    ),
    roles: z.array(
      z.object({
        company: z.string(),
        tier: z.enum(['current', 'earlier']),
        titles: z.array(
          z.object({
            title: z.string(),
            dates: z.string(),
          })
        ),
        body: z.string(),
      })
    ),
    interests: z.array(
      z.object({
        heading: z.string().optional(),
        body: z.string(),
      })
    ),
    recommendations: z.array(
      z.object({
        name: z.string(),
        relationship: z.string(),
        quote: z.string(),
      })
    ),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    // Only set when a post is materially revised after publishing. Feeds
    // <lastmod>/article:modified_time/dateModified; falls back to pubDate
    // everywhere it's read, so it's free when absent.
    updatedDate: z.date().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    // Full-size image for the post detail page hero.
    heroImage: z.string(),
    // Smaller variant used for the 120px-tall cards on the blog index.
    thumbImage: z.string(),
    // Set once the post has been shared on LinkedIn, so the post page can
    // offer a "Discuss on LinkedIn" link. Optional and absent by default: a
    // post is published to the site first and shared on LinkedIn second. No
    // www. requirement: SITE.sameAs (src/lib/site.ts) already links the bare
    // https://linkedin.com/in/garethparris form, so this accepts either.
    linkedInUrl: z
      .string()
      .url()
      .regex(/^https:\/\/(www\.)?linkedin\.com\//, 'must be a linkedin.com URL')
      .optional(),
  }),
});

export const collections = { resume, blog };
