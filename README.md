# parris.me.uk

Personal site: Home, Resume, Blog, Contact. Built with Astro, deployed on Cloudflare Workers.

## AI-assisted development

This site was rebuilt from a dated, hand-coded HTML template using [Claude Code](https://claude.com/claude-code), following a deliberately rigorous process rather than a single prompt-and-done pass:

1. **Design brainstorm and written spec** — decisions (framework, hosting, visual direction, information architecture) were worked through and recorded before any code was written: see [`docs/superpowers/specs/2026-09-05-website-rebuild-design.md`](docs/superpowers/specs/2026-09-05-website-rebuild-design.md).
2. **Detailed implementation plan** — the spec was broken into 11 concrete, testable tasks with exact file lists and code: see [`docs/superpowers/plans/2026-09-05-website-rebuild.md`](docs/superpowers/plans/2026-09-05-website-rebuild.md).
3. **Subagent-driven implementation** — each task was built by a fresh AI agent, then independently code-reviewed against the plan before the next task started. Review findings went through fix-and-reverify rounds, not just a single pass.
4. **A final whole-branch review** before merge, on top of the per-task reviews, specifically to catch anything only visible once every piece exists together.

That process caught real bugs, not hypothetical ones:

- A subtle Astro version quirk (`CollectionEntry.slug` doesn't exist in this Astro release) silently broke every blog link on the Home page and Blog index (`/blog/undefined`). Caught during a task review, fixed with a shared helper, and given a regression test afterward.
- Two accessibility heading-hierarchy skips (in the blog card and skill-tag components) were caught by a dedicated accessibility pass and fixed before merge.
- The final whole-branch review caught the two most serious defects in the entire build: the production output shipped with zero CSS (a dev-only stylesheet path that 404s once built), and the Cloudflare deploy configuration pointed at the wrong output directory entirely. Both were invisible to the full automated test suite, which only exercises rendered HTML strings rather than an actual build-and-deploy, and both were fixed and independently re-verified before this branch was merged.

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
`src/content.config.ts` (title, description, pubDate, category, tags, heroImage,
thumbImage). Put any images in `public/images/blog/`.

Supply two sizes of the post image: `heroImage` is the full-size version used for the
banner on the post's own page, and `thumbImage` is a smaller version used for the
120px-tall card on the blog index. They are separate fields so the index does not
download several hundred KB per card to render a thumbnail.

## Deployment (manual, one-time setup)

This deploys as a Cloudflare Worker with static assets, not the legacy Pages product —
Cloudflare's "Create an app" flow builds a Workers project by default, and the
`functions/` Pages-Functions convention doesn't apply there, so the contact form is
handled by `src/worker.ts` (a real Worker entry point) instead. `wrangler.toml`
declares `main = "src/worker.ts"` plus an `[assets]` block pointing at `dist`, so a
single Worker serves the built site and handles `POST /api/contact` itself.

1. In the Cloudflare dashboard, create a Worker connected to the
   `garethparris/parris.me.uk` GitHub repo (Workers & Pages → Create an app → Import
   a repository), build command `npm run build`, deploy command `npx wrangler deploy`
   (Cloudflare's default for a Git-connected Worker).
2. Under the Worker's Settings > Variables and Secrets, set `RESEND_API_KEY`
   (from a Resend account) and `CONTACT_TO_EMAIL` (the address contact-form
   submissions should be sent to).
3. Under the Worker's Settings > Domains & Routes, add `parris.me.uk` (and
   `www.parris.me.uk` if wanted); Cloudflare handles the DNS automatically since the
   domain's nameservers already point at Cloudflare.
4. Every push to `main` redeploys automatically; every PR gets its own preview URL.

## Contact form abuse protection

The form is defended by a hidden honeypot field plus name and message length caps,
enforced server-side in `src/worker.ts` (validation logic lives in `src/lib/contact.ts`,
shared with its test). That is deliberately lightweight and needs no third-party
account. If spam becomes a problem, Cloudflare Turnstile would be the stronger next
step.

## Sequencing note

Per the design spec: do the domain cutover (step 3 above) at the same time as
publishing the refreshed CV and LinkedIn profile, not before.

## License

Code (Astro components, configuration, and build tooling) is MIT-licensed — see [`LICENSE`](LICENSE). The written content (resume, blog posts, and their images) is not covered by that license and is not licensed for reuse.
