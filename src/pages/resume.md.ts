// src/pages/resume.md.ts
//
// The only per-page Markdown variant emitted (no per-post .md, no
// llms-full.txt): /resume/ is the page an assistant most needs verbatim, the
// most markup-heavy page on the site, and the only page whose content lives
// entirely in YAML frontmatter with an empty Markdown body — so this is the
// only place a crawler can find the resume as plain text at all. It also
// flattens the collapsed <details> earlier-career section.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildResumeMarkdown } from '../lib/llms';

export const GET: APIRoute = async () => {
  const [resume] = await getCollection('resume');
  const body = buildResumeMarkdown(resume.data);
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
