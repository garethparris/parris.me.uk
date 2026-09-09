// src/lib/blog.ts
import type { CollectionEntry } from 'astro:content';

/**
 * Astro 7 content collections use `id` (the collection-relative file path,
 * e.g. "drum-award.md") rather than the old `slug` field, which is
 * undefined on CollectionEntry. This derives the URL slug consistently
 * everywhere a blog post link is built.
 */
export function getPostSlug(post: CollectionEntry<'blog'>): string {
  return post.id.replace(/\.md$/, '');
}

/**
 * Formats a post date once for every surface that needs to show it (the post
 * page, BlogCard, the home teaser), so they can never disagree.
 *
 * `iso` is date-only (no time component) since pubDate carries no meaningful
 * time-of-day — a full ISO timestamp would just be a spurious midnight-Z.
 * `display` uses en-GB so a UK-based CV reads in a UK date format.
 */
export function formatPostDate(date: Date): { iso: string; display: string } {
  return {
    iso: date.toISOString().slice(0, 10),
    display: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}
