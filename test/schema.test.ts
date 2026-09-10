import { describe, it, expect } from 'vitest';
import {
  buildPerson,
  buildWebSite,
  buildProfilePage,
  buildBlogPosting,
  buildBlogIndexSchema,
  serializeJsonLd,
} from '../src/lib/schema';

const SITE_URL = new URL('https://parris.me.uk');

const resume = {
  headline: 'Director of Software Engineering at BrightSign.',
  summary: 'Long summary.',
  leadership: 'Leadership text.',
  education: 'BSc (Hons) Computer Science, University of Hertfordshire, 1991-1995.',
  alumniOf: { name: 'University of Hertfordshire', url: 'https://www.herts.ac.uk' },
  updated: new Date('2026-09-09'),
  awards: ['Finalist, 2025 Graham Impact Awards'],
  certifications: ['AWS Knowledge: Amazon EKS - Training Badge'],
  skillGroups: [
    { label: 'Cloud & Platform', items: ['Kubernetes', 'AWS (EKS, Control Tower)'] },
    { label: 'Observability & Incident Management', items: ['OpenTelemetry', 'Grafana'] },
  ],
  roles: [
    {
      company: 'BrightSign',
      tier: 'current' as const,
      titles: [{ title: 'Director of Software Engineering', dates: 'Oct 2025 - Present' }],
      body: '...',
    },
    {
      company: 'Savernake Capital',
      tier: 'current' as const,
      titles: [{ title: 'Chief Technology Officer (Permanent)', dates: 'Feb 2021 - Jul 2022' }],
      body: '...',
    },
  ],
  interests: [],
  recommendations: [],
};

describe('buildPerson', () => {
  it('derives jobTitle/worksFor from the role whose dates match "Present", not roles[0] or tier', () => {
    const person = buildPerson(resume, SITE_URL);
    expect(person.jobTitle).toBe('Director of Software Engineering');
    expect(person.worksFor).toEqual({ '@type': 'Organization', name: 'BrightSign' });
  });

  it('flattens skillGroups labels and items into knowsAbout, unescaped', () => {
    const person = buildPerson(resume, SITE_URL);
    expect(person.knowsAbout).toContain('OpenTelemetry');
    expect(person.knowsAbout).toContain('Cloud & Platform');
  });

  it('passes awards and certifications through as text, with no parsing', () => {
    const person = buildPerson(resume, SITE_URL);
    expect(person.award).toEqual(['Finalist, 2025 Graham Impact Awards']);
    expect(person.hasCredential).toHaveLength(1);
    expect(person.hasCredential[0].name).toContain('Amazon EKS');
  });

  it('builds alumniOf from the structured field, not by parsing the prose education string', () => {
    const person = buildPerson(resume, SITE_URL);
    expect(person.alumniOf).toEqual({
      '@type': 'CollegeOrUniversity',
      name: 'University of Hertfordshire',
      url: 'https://www.herts.ac.uk',
    });
  });

  it('uses only site.ts sameAs links, and the resume headline as description', () => {
    const person = buildPerson(resume, SITE_URL);
    expect(person.sameAs).toEqual(['https://linkedin.com/in/garethparris', 'https://github.com/garethparris']);
    expect(person.description).toBe(resume.headline);
  });

  it('gives / and /resume/ the same @id, so engines treat them as one entity', () => {
    const person = buildPerson(resume, SITE_URL);
    expect(person['@id']).toBe('https://parris.me.uk/#person');
  });
});

describe('buildWebSite / buildProfilePage', () => {
  it('references the Person by @id rather than duplicating it', () => {
    const site = buildWebSite(SITE_URL);
    const profile = buildProfilePage(resume, SITE_URL);
    expect(site.publisher).toEqual({ '@id': 'https://parris.me.uk/#person' });
    expect(profile.mainEntity).toEqual({ '@id': 'https://parris.me.uk/#person' });
    expect(profile.dateModified).toBe('2026-09-09T00:00:00.000Z');
  });
});

describe('buildBlogPosting', () => {
  const post = {
    title: 'Finalist, 2025 Graham Impact Awards',
    description: 'A description.',
    pubDate: new Date('2025-11-01'),
    updatedDate: undefined,
    category: 'Career',
    tags: ['Leadership', 'BrightSign', 'Cloud'],
    heroImage: '/images/blog/graham-impact-awards-full.jpg',
    thumbImage: '/images/blog/graham-impact-awards.jpg',
  };

  it('builds an absolute image URL and RFC-3339 dates', () => {
    const posting = buildBlogPosting(post, 'graham-impact-awards', SITE_URL);
    expect(posting.image).toBe('https://parris.me.uk/images/blog/graham-impact-awards-full.jpg');
    expect(posting.datePublished).toBe('2025-11-01T00:00:00.000Z');
    expect(posting.dateModified).toBe('2025-11-01T00:00:00.000Z');
    expect(posting.url).toBe('https://parris.me.uk/blog/graham-impact-awards/');
  });

  it('falls back dateModified to pubDate when updatedDate is absent, and uses updatedDate when present', () => {
    const updated = buildBlogPosting({ ...post, updatedDate: new Date('2025-12-01') }, 'graham-impact-awards', SITE_URL);
    expect(updated.dateModified).toBe('2025-12-01T00:00:00.000Z');
  });

  it('omits discussionUrl when the post has no linkedInUrl', () => {
    const posting = buildBlogPosting(post, 'graham-impact-awards', SITE_URL);
    expect(posting).not.toHaveProperty('discussionUrl');
  });

  it('sets discussionUrl from linkedInUrl when present', () => {
    const linkedInUrl = 'https://www.linkedin.com/posts/garethparris_activity-1234567890';
    const posting = buildBlogPosting({ ...post, linkedInUrl }, 'graham-impact-awards', SITE_URL);
    expect(posting.discussionUrl).toBe(linkedInUrl);
  });
});

describe('buildBlogIndexSchema', () => {
  it('lists post stubs with url and datePublished', () => {
    const blog = buildBlogIndexSchema(
      [{ data: { title: 'A Post', pubDate: new Date('2025-01-01') } as any, slug: 'a-post' }],
      SITE_URL
    );
    expect(blog.blogPost).toEqual([
      {
        '@type': 'BlogPosting',
        headline: 'A Post',
        url: 'https://parris.me.uk/blog/a-post/',
        datePublished: '2025-01-01T00:00:00.000Z',
      },
    ]);
  });
});

describe('serializeJsonLd', () => {
  it('escapes "<" so a value containing "</script>" cannot break out of the script element', () => {
    const json = serializeJsonLd([{ '@type': 'Thing', name: '</script><script>alert(1)</script>' }]);
    expect(json).not.toContain('</script>');
    expect(json).toContain('\\u003c/script>');
  });

  it('does not entity-encode "&", unlike the rest of the HTML body', () => {
    const json = serializeJsonLd([{ name: 'Cloud & Platform' }]);
    expect(json).toContain('Cloud & Platform');
    expect(json).not.toContain('&amp;');
  });

  it('wraps the graph in a @context/@graph envelope', () => {
    const json = serializeJsonLd([{ '@type': 'Thing' }]);
    const parsed = JSON.parse(json);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@graph']).toEqual([{ '@type': 'Thing' }]);
  });
});
