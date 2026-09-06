# parris.me.uk

Personal site: Home, Resume, Blog, Contact. Built with Astro, deployed on Cloudflare Pages.

## Local development

    npm install
    npm run dev

## Testing

    npm run test

## Updating the Resume page

Resume content lives in `src/content/resume/index.md`, manually kept in sync with the
private vault's `CV.md`, not a live integration. When the CV changes, ask Claude to
"sync the CV to the website" and it updates this file (see docs/superpowers/specs/2026-09-05-website-rebuild-design.md).

## Adding a blog post

Add a new Markdown file under `src/content/blog/`, following the frontmatter shape in
`src/content.config.ts` (title, description, pubDate, category, tags, heroImage). Put
any images in `public/images/blog/`.

## Deployment (manual, one-time setup)

1. In the Cloudflare dashboard, create a Pages project connected to the
   `garethparris/parris.me.uk` GitHub repo, build command `npm run build`, output
   directory `dist`.
2. Under the Pages project's Settings > Environment variables, set `RESEND_API_KEY`
   (from a Resend account) and `CONTACT_TO_EMAIL` (the address contact-form
   submissions should be sent to).
3. Under the Pages project's Custom domains, add `parris.me.uk` (and `www.parris.me.uk`
   if wanted); Cloudflare handles the DNS automatically since the domain's nameservers
   already point at Cloudflare.
4. Every push to `main` redeploys automatically; every PR gets its own preview URL.

## Contact form abuse protection

The form is defended by a hidden honeypot field plus name and message length caps,
enforced server-side in `functions/api/contact.ts`. That is deliberately lightweight
and needs no third-party account. If spam becomes a problem, Cloudflare Turnstile
would be the stronger next step.

## Sequencing note

Per the design spec: do the domain cutover (step 3 above) at the same time as
publishing the refreshed CV and LinkedIn profile, not before.
