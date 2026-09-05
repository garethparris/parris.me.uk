# parris.me.uk Rebuild — Design Spec

**Date:** 2026-09-05
**Status:** Approved by Gareth, pending implementation plan

## Goal

Replace the outdated site content with a modern, fast, accessible personal site that Gareth can keep in sync with his CV and add blog posts to easily. This needs to be ready to go live at the same time as his refreshed CV and LinkedIn profile, since all three are meant to be published together.

## Repository

Rebuilt in place in **this repo** (`garethparris/parris.me.uk`, checked out at `/Users/gparris/GitHub/garethparris/parris.me.uk`). This repo previously held a small, unrelated 2019-era "link hub" page (Google Tag Manager tracking, links to Prime23 Consultancy and unrelated holiday-let sites) — none of it relevant, all removed.

A second repo, `garethparris/garethparris.info` (at `/Users/gparris/GitHub/garethparris/garethparris.info`), holds the *actual* content this rebuild draws from: a 2022-era hand-coded static site (jQuery/Owl Carousel template) that's the real source of the current live `parris.me.uk` (deployed via Azure Blob Storage + CDN, fronted by Cloudflare DNS as a proxied custom domain). Gareth intends to archive that repo once this rebuild is live — **not done yet, ask before archiving**. Until then, it's used read-only as the source for blog post content/images to migrate across.

## Decisions Locked In

- **Domain:** `parris.me.uk` only. `garethparris.info` (a separate, now-unused domain) is dropped.
- **Framework:** Astro. Zero client-side JS by default, native Markdown content collections (ideal for the blog), full CSS control (avoids the generic-component-library look), trivial static hosting.
- **Hosting:** Cloudflare Pages. `parris.me.uk` already resolves through Cloudflare, so this keeps DNS and hosting in one place. Git-push-to-deploy, free tier, automatic preview deployments on PRs.
- **Blog editing:** No online CMS/admin panel. Posts are Markdown files in a content collection; Gareth (with AI help drafting) writes and commits them like any other file in this repo, and Cloudflare Pages deploys on push. Matches how he already works in his Obsidian vault.
- **Resume/CV page:** Rendered live from content, not a static PDF. Source of truth remains `CV.md` in the private `obsidian-vault` repo; when Gareth wants the site refreshed, the content is manually resynced into this repo's `src/content/resume.md` (Obsidian-specific syntax — wikilinks, vault frontmatter — stripped in the process). This is a deliberate manual step, not a live cross-repo integration, since the vault repo is private and shouldn't be a runtime dependency of the public site.
- **Visual style:** "Observability-Inspired" — dark background, subtle dashboard grid-line texture behind the hero, monospace accents for labels/metrics (teal `#4fd1c5`) and highlight numbers (amber `#ffb454`), sans-serif body text. A deliberate, understated nod to Gareth's observability/SRE specialty without being a literal dashboard pastiche.
- **Home page layout:** Split hero — intro text (name, title, one-line pitch) on the left, a "current focus" status-card on the right (e.g. current initiative + team/product context), followed by a "latest from the blog" teaser section.
- **Resume page layout:** Summary → Core Skills (as tag/badge row) → Career, with recent roles (BrightSign, Savernake) shown in full and pre-2019 roles collapsed by default into an expandable "Earlier Career" block, so the page isn't a 30-year scroll.
- **Blog:** Simple card grid (image, title, category tag) linking to individual post pages.
- **Design tokens:** Colors, fonts and spacing defined once as CSS custom properties so a future full restyle is a token-value change, not a rewrite.

## Information Architecture

Four pages: **Home**, **Resume**, **Blog** (index + individual post pages), **Contact**. "About Me" from the old site is folded into the Home hero rather than kept as a separate page.

## Content Migration

- **Blog posts:** 4 of the 5 existing posts migrate (Drum Award, Mercedes, MIT Wall, Server Rack) — converted from the hand-coded HTML in `garethparris.info/src/blog-*.html` into Markdown content-collection entries here, reusing the existing images from `garethparris.info/src/images/blog/` (copied into this repo during implementation). The 5th post (RPi Pico) is left out of the initial migration per Gareth's call; can be added back later.
- **Resume:** Rebuilt from the vault's `CV.md`, not any static PDF or hardcoded HTML resume section. Old cert PDFs (IKM Test Results, Azure Fundamentals/Developer Associate/Data Fundamentals) are dropped — none reflect his current role, and CV.md's own Certifications section (AWS EKS Knowledge Badge) is the current source of truth.
- **Testimonials / client logos / service icons** from the old `garethparris.info` template are dropped — dated, contractor-portfolio styling that doesn't fit the Director-level, employed-not-freelance positioning of the refreshed CV/LinkedIn.

## Contact Form — Technical Note

Gareth picked "the Cloudflare equivalent of Netlify Forms" — worth flagging that Cloudflare Pages has no built-in zero-config form feature identical to Netlify's. The practical equivalent: a small **Cloudflare Pages Function** (a few lines of serverless code, deployed alongside the static site, no separate backend to run) that receives the form POST and sends it via a transactional email API (recommendation: **Resend**, generous free tier, simple API). This is a small, contained piece of custom code, not "no code" — flagged here so it's not a surprise during implementation.

## Accessibility & Performance

- Semantic HTML (proper heading hierarchy, landmarks, alt text on all images) throughout — Astro's zero-JS-by-default approach helps here by construction.
- Respect `prefers-color-scheme` / provide sufficient contrast even though the design is dark-first; the dark palette above was chosen with contrast in mind (light text `#d5d9e0` on `#131722` background exceeds WCAG AA for body text).
- Self-host webfonts (rather than a third-party font CDN) for performance and to avoid an unnecessary external request.
- Target: Lighthouse 90+ across Performance/Accessibility/Best Practices/SEO — realistic given Astro's default output and no heavy JS.

## Out of Scope (for this rebuild)

- Online/in-browser blog editing (explicitly declined in favor of the AI+git workflow).
- Live cross-repo sync between the vault and the site (resync is a manual, deliberate step).
- Restoring the RPi Pico blog post (can be a fast follow-up).
- Analytics/tracking (the old link-hub site had Google Tag Manager; not carried forward — revisit later if wanted).
- Archiving the `garethparris.info` repo — Gareth's intent, but a separate GitHub-side action to confirm explicitly before doing.

## Sequencing

This site should be fully built, content-migrated, and deployed to a Cloudflare Pages preview URL *before* Gareth flips any public switches (LinkedIn "Open to Work", posting the new LinkedIn profile). Domain cutover (pointing `parris.me.uk` at the new Cloudflare Pages deployment) happens as the final step, timed alongside the LinkedIn publish.
