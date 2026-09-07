import { defineCollection, z } from 'astro:content';

const resume = defineCollection({
  type: 'content',
  schema: z.object({
    summary: z.string(),
    leadership: z.string(),
    education: z.string(),
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
    category: z.string(),
    tags: z.array(z.string()),
    // Full-size image for the post detail page hero.
    heroImage: z.string(),
    // Smaller variant used for the 120px-tall cards on the blog index.
    thumbImage: z.string(),
  }),
});

export const collections = { resume, blog };
