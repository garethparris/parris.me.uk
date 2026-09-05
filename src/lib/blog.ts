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
