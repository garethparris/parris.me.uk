# parris.me.uk Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the repo's old, unrelated 2019 link-hub content with a modern Astro-based personal site (Home, Resume, Blog, Contact) for parris.me.uk, deployed on Cloudflare Pages, with content migrated from the old `garethparris.info` repo and Gareth's CV.md.

**Architecture:** Astro static site (zero client-side JS by default) with two Astro content collections (`resume`, `blog`), a single Cloudflare Pages Function for the contact form (the only server-rendered route), and CSS custom properties as design tokens so re-styling later is a token change, not a rewrite.

**Tech Stack:** Astro 5, `@astrojs/cloudflare` adapter, Vitest + Astro's experimental Container API for component tests, Resend (contact form email), Cloudflare Pages (hosting).

**Spec:** `docs/superpowers/specs/2026-09-05-website-rebuild-design.md`

## Global Constraints

- Domain: `parris.me.uk` only (no `garethparris.info` references in the new site).
- No online CMS/admin panel for the blog — content is Markdown files edited via git.
- Resume content is manually resynced from the vault's `CV.md`, never live-fetched from the vault repo at build or runtime.
- British English spelling throughout (e.g. "optimisation", "practising").
- No em dashes in any user-facing copy — use commas, colons, or parentheses instead (this is a real publish target, same rule Gareth set for his CV/LinkedIn).
- Every image needs `alt` text; heading hierarchy must be sequential (no skipped levels) for accessibility.
- All new dependencies go in `package.json` via `npm install`, committed with the lockfile.

---

## File Structure

```
parris.me.uk/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   └── images/
│       └── blog/
│           ├── drum-award-full.jpg / drum-award.jpg
│           ├── mercedes-full.jpg / mercedes-silver.jpg / mercedes.jpg
│           ├── mit-wall-full.jpg / mit-wall-rear.jpg / mit-wall-app.jpg / mit-wall.jpg
│           └── server-rack-full.jpg / server-rack-kit.jpg / server-rack.jpg
├── functions/
│   └── api/
│       └── contact.ts              # Cloudflare Pages Function, the only server route
├── src/
│   ├── content/
│   │   ├── config.ts                # collection schemas
│   │   ├── resume/
│   │   │   └── index.md             # structured resume data (frontmatter-driven)
│   │   └── blog/
│   │       ├── drum-award.md
│   │       ├── mercedes.md
│   │       ├── mit-wall.md
│   │       └── server-rack.md
│   ├── layouts/
│   │   └── Layout.astro             # nav + footer + global <head>
│   ├── styles/
│   │   └── global.css               # design tokens (CSS custom properties)
│   ├── components/
│   │   ├── SkillTags.astro
│   │   ├── RoleEntry.astro
│   │   └── BlogCard.astro
│   └── pages/
│       ├── index.astro              # Home
│       ├── resume.astro             # Resume
│       ├── contact.astro            # Contact
│       └── blog/
│           ├── index.astro          # Blog list
│           └── [slug].astro         # Blog post
├── test/
│   ├── resume.test.ts
│   ├── home.test.ts
│   ├── blog.test.ts
│   └── contact-function.test.ts
└── docs/superpowers/{specs,plans}/
```

Each `.astro` page/component has one responsibility: `Layout.astro` owns chrome (nav/footer/head), page files own page-specific content, `src/components/` owns the three pieces of markup reused across pages (skill tag row, a single career role block, a blog card). `global.css` is the only place colors/fonts/spacing are defined as raw values — everything else references the custom properties.

---

### Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.node-version`
- Modify: `.gitignore` (already has `node_modules/`, `dist/`, `.astro/` from the earlier commit — verify, don't duplicate)

**Interfaces:**
- Produces: a working `npm run build` and `npm run dev`, and `npm run test` (Vitest), that every later task builds on.

- [ ] **Step 1: Scaffold Astro with the minimal template**

```bash
cd /Users/gparris/GitHub/garethparris/parris.me.uk
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
```

(`--no-git` because this directory is already a git repo; `--no-install` so we control the install in the next step alongside the extra packages.)

- [ ] **Step 2: Add the Cloudflare adapter and test tooling**

```bash
npm install
npm install @astrojs/cloudflare
npm install -D vitest
```

- [ ] **Step 3: Configure `astro.config.mjs` for static output with the Cloudflare adapter**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://parris.me.uk',
  output: 'static',
  adapter: cloudflare(),
});
```

- [ ] **Step 4: Add test and typecheck scripts to `package.json`**

Edit the `"scripts"` block to include:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "check": "astro check"
  }
}
```

- [ ] **Step 5: Verify the scaffold builds**

Run: `npm run build`
Expected: succeeds, produces a `dist/` directory with the default template's `index.html`.

- [ ] **Step 6: Add `vitest.config.ts` so `astro:content`/`astro:assets` resolve in tests**

Every later test task imports something that transitively imports `astro:content` (a virtual module Astro's Vite plugin provides) — either directly (content collection schemas) or via an `.astro` component under test (Astro's experimental Container API). Plain `vitest run` cannot resolve virtual modules on its own; Astro's documented fix is to load Vitest's config through Astro's own Vite config:

```ts
// vitest.config.ts
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {},
});
```

Without this file, every test task from Task 3 onward fails at import time with a "Cannot resolve 'astro:content'" (or similar) error — add it now so that doesn't happen.

- [ ] **Step 7: Verify a trivial test runs under this config**

Create a throwaway `test/_smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
describe('smoke', () => {
  it('runs', () => { expect(1 + 1).toBe(2); });
});
```

Run: `npm run test`
Expected: PASS (1 test). Then delete `test/_smoke.test.ts` — it was only to confirm the Vitest+Astro config works before any real tests depend on it.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .node-version vitest.config.ts
git commit -m "Scaffold Astro project with Cloudflare adapter and Vitest config"
```

---

### Task 2: Design tokens and base layout

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/Layout.astro`
- Create: `public/favicon.svg`
- Test: `test/layout.test.ts`

**Interfaces:**
- Produces: `Layout.astro` accepting `{ title: string; description: string }` props, rendering `<slot />` for page content between a nav and footer. Every page in later tasks wraps its content in this layout.

- [ ] **Step 1: Write the design tokens**

```css
/* src/styles/global.css */
:root {
  --color-bg: #131722;
  --color-bg-raised: #1a1f2e;
  --color-border: #262b3d;
  --color-text: #d5d9e0;
  --color-text-dim: rgba(213, 217, 224, 0.7);
  --color-accent-teal: #4fd1c5;
  --color-accent-amber: #ffb454;

  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;

  --radius: 6px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  line-height: 1.6;
}

h1, h2, h3, h4 {
  line-height: 1.2;
  font-weight: 700;
}

a {
  color: var(--color-accent-teal);
}

.container {
  max-width: 880px;
  margin: 0 auto;
  padding: 0 var(--space-2);
}

.tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: var(--color-bg-raised);
  color: var(--color-accent-teal);
  border: 1px solid var(--color-border);
}
```

- [ ] **Step 2: Write the layout component**

```astro
---
// src/layouts/Layout.astro
interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/src/styles/global.css" />
  </head>
  <body>
    <header class="container" style="padding-top: var(--space-2); display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.85rem;">
      <a href="/" style="color: var(--color-text); text-decoration: none;">parris.me.uk</a>
      <nav>
        <a href="/resume">Resume</a> &nbsp;
        <a href="/blog">Blog</a> &nbsp;
        <a href="/contact">Contact</a>
      </nav>
    </header>
    <main class="container">
      <slot />
    </main>
    <footer class="container" style="padding: var(--space-4) 0; color: var(--color-text-dim); font-size: 0.8rem;">
      <p>&copy; {new Date().getFullYear()} Gareth Parris</p>
    </footer>
  </body>
</html>
```

- [ ] **Step 3: Add a placeholder favicon**

```xml
<!-- public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <rect width="24" height="24" rx="4" fill="#131722"/>
  <text x="12" y="17" font-family="monospace" font-size="14" fill="#4fd1c5" text-anchor="middle">gp</text>
</svg>
```

- [ ] **Step 4: Write a container-API test for the layout**

```ts
// test/layout.test.ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Layout from '../src/layouts/Layout.astro';

describe('Layout', () => {
  it('renders the title, description, and nav links', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: { title: 'Test Title', description: 'Test description' },
      slots: { default: '<p>content</p>' },
    });

    expect(result).toContain('Test Title');
    expect(result).toContain('Test description');
    expect(result).toContain('href="/resume"');
    expect(result).toContain('href="/blog"');
    expect(result).toContain('href="/contact"');
    expect(result).toContain('<p>content</p>');
  });
});
```

- [ ] **Step 5: Run the test**

Run: `npm run test -- layout`
Expected: PASS (2 assertions groups, all green)

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/layouts/Layout.astro public/favicon.svg test/layout.test.ts
git commit -m "Add design tokens and base layout"
```

---

### Task 3: Content collection schemas

**Files:**
- Create: `src/content.config.ts` (moved from the plan's originally-specified `src/content/config.ts`: Astro 7 requires the top-level location)
- Test: `test/content-config.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: the `resume` and `blog` collection types every later task's frontmatter must conform to. `resume` is a single-entry collection; `blog` is multi-entry.

- [ ] **Step 1: Write the collection schemas**

```ts
// src/content.config.ts
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
    heroImage: z.string(),
  }),
});

export const collections = { resume, blog };
```

- [ ] **Step 2: Write a schema-shape test**

This is a compile-time schema, so the meaningful test is that a minimal valid fixture parses and an invalid one is rejected — this catches typos in field names before they silently break a page render.

```ts
// test/content-config.test.ts
import { describe, it, expect } from 'vitest';
import { collections } from '../src/content/config';

// Import the real schema (Task 1's vitest.config.ts makes astro:content
// resolvable here) rather than duplicating its shape — this is what every
// resume.md role must satisfy.
const roleSchema = collections.resume.schema.shape.roles.element;

describe('resume role schema', () => {
  it('accepts a valid role entry', () => {
    const valid = {
      company: 'BrightSign',
      tier: 'current',
      titles: [{ title: 'Director of Software Engineering', dates: 'Oct 2025 - Present' }],
      body: 'Some markdown body.',
    };
    expect(() => roleSchema.parse(valid)).not.toThrow();
  });

  it('rejects an invalid tier value', () => {
    const invalid = {
      company: 'BrightSign',
      tier: 'recent', // not 'current' | 'earlier'
      titles: [{ title: 'Director', dates: 'Oct 2025 - Present' }],
      body: 'Some markdown body.',
    };
    expect(() => roleSchema.parse(invalid)).toThrow();
  });
});
```

- [ ] **Step 3: Run the test**

Run: `npm run test -- content-config`
Expected: PASS (2 tests)

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts test/content-config.test.ts
git commit -m "Add resume and blog content collection schemas"
```

---

### Task 4: Resume content data

**Files:**
- Create: `src/content/resume/index.md`

**Interfaces:**
- Consumes: the `resume` schema from Task 3.
- Produces: the single resume entry every Resume-page task reads via `getCollection('resume')`.

This is a direct transcription of `CV.md` from the private vault (`Personal knowledge base/Career/CV.md`, as of 2026-09-05), restructured into the schema's frontmatter shape. Per the global constraints: no em dashes (there were several in the vault original — replaced with commas/colons/parentheses below), British spelling preserved, no Obsidian-specific syntax (wikilinks, vault frontmatter tags) carried over.

- [ ] **Step 1: Write the resume content entry**

```markdown
---
summary: >-
  Accomplished Director of Software Engineering with 30+ years of experience
  across investment banking, Formula 1 motorsport (including career-highlight
  contract roles at McLaren Applied and Mercedes AMG HPP), and digital
  infrastructure. Leads three engineering teams (Cloud, Platform, and Client)
  at BrightSign, delivering the BSN.Cloud SaaS platform and BrightSign Control
  Plus to hundreds of thousands of IoT-connected devices globally. Promoted
  from Server Engineer Lead through Software Engineering Manager to Director
  over four years, driven by hands-on delivery of platform-critical work
  (database crisis recovery, Kubernetes migration, SOC 2 compliance, SSO/MFA)
  as much as by team leadership. Stays directly in the codebase and
  infrastructure rather than managing from a distance, and has built AI
  tooling (including an AI-assisted live diagnostics workflow via Grafana MCP)
  directly into day-to-day engineering and delivery, not just as a talking
  point. Expertise spans full-stack software development, cloud-native
  architecture, observability engineering, and incident management.
  Self-motivated, results-driven leader with strong communication skills,
  including public speaking to enterprise clients, and a commitment to code
  quality and continuous improvement.
leadership: >-
  A Director who still ships. Alongside leading three teams, personally:
  co-develops production code with AI assistance (e.g. porting critical
  certificate-management API components); built and uses Grafana MCP for
  AI-assisted live log/metric incident diagnosis; and runs internal AI
  side-projects exploring new product opportunities for the business. Views
  this hands-on, AI-augmented approach as the way engineering leadership has
  to work as management layers flatten: the job is less about routing tickets
  and more about owning technical strategy, managing complexity, and staying
  close enough to the code and the system to make that judgement call
  personally, while still protecting team wellbeing and preventing burnout
  under sustained delivery pressure.
education: >-
  BSc (Hons) Computer Science (Software Engineering), Upper Second-Class
  Honours (2:1), University of Hertfordshire, 1991-1995.
awards:
  - "Finalist, 2025 Graham Impact Awards: a company-wide award run by Graham Partners, BrightSign's private equity backer since 2021, recognising contribution(s) to BrightSign"
certifications:
  - "AWS Knowledge: Amazon EKS - Training Badge (Amazon Web Services Training and Certification, April 2024)"
skillGroups:
  - label: "Cloud & Platform"
    items: ["AWS (EKS, Control Tower)", "Azure", "Kubernetes (Helm, Minikube)", "Terraform", "Ansible", "Docker", "Docker Compose"]
  - label: "Observability & Incident Management"
    items: ["OpenTelemetry", "Grafana (incl. Grafana MCP)", "Prometheus", "Loki", "Alertmanager", "PagerDuty", "OpsGenie", "Incident.io", "on-call/escalation design", "blameless postmortems"]
  - label: "Security & Compliance"
    items: ["SOC 2 Type II", "OAuth2/OIDC", "OWIN/ASP.NET Identity", "SCIM", "Keycloak", "HashiCorp Vault", "DDoS/bot mitigation"]
  - label: "Messaging & APIs"
    items: ["NATS", "RabbitMQ", "REST", "gRPC", "Swagger", "Postman"]
  - label: "Languages & Frameworks"
    items: ["C# / .NET (6-10)", "WPF/MVVM/MEF/TPL", "ASP.NET/MVC/Razor/WebAPI", "TypeScript", "JavaScript", "HTML/CSS", "Go", "Python"]
  - label: "Testing & CI/CD"
    items: ["xUnit", "NUnit", "MSTest", "Fluent Assertions", "NSubstitute", "SpecFlow", "Selenium", "GitHub Actions", "Azure DevOps", "TeamCity", "Jenkins", "Octopus Deploy"]
  - label: "Databases"
    items: ["Microsoft SQL Server", "PostgreSQL", "MySQL", "SQLite"]
  - label: "AI-Assisted Engineering"
    items: ["AI pair-programming for production code", "AI-assisted incident diagnostics", "internal AI tooling/side-projects"]
roles:
  - company: "BrightSign"
    tier: current
    titles:
      - title: "Director of Software Engineering"
        dates: "Oct 2025 - Present"
      - title: "Software Engineering Manager"
        dates: "Jul 2023 - Oct 2025"
      - title: "Server Engineer Lead"
        dates: "Aug 2022 - Jul 2023"
    body: |
      BrightSign is the world's leading manufacturer of digital signage media players, with hundreds of thousands of devices connected globally to its BSN.Cloud SaaS management platform.

      Promoted twice in four years (Server Engineer Lead to Software Engineering Manager to Director of Software Engineering) in recognition of strategic impact and leadership growth, named a **Finalist for the 2025 Graham Impact Awards** for contributions to BrightSign along the way. Now lead three engineering teams: **Cloud** (BSN.Cloud SaaS platform), **Platform** (Kubernetes/AWS infrastructure and operations), and **Client** (customer-facing applications), while remaining directly hands-on in the codebase, architecture, and incident response.

      - Led the technical response to a database performance and scaling risk: drove analysis of a planned AWS PostgreSQL migration, and when it proved infeasible due to code coupling, pivoted to vertically scaling and re-tuning the existing MS SQL Server estate with a hot-standby, avoiding a six-figure Enterprise licensing cost and buying at least a year of stability to fund a wider refactor, later followed by hiring a dedicated DBA to further improve performance
      - Built the company's first observability stack (Prometheus, Grafana, Loki, Alertmanager, PagerDuty/OpsGenie) ahead of a dedicated DevOps hire, later evolving it into an AI-assisted live diagnostics workflow using Grafana MCP
      - Migrated the BSN.Cloud platform to .NET 8 and later .NET 10, and onto Kubernetes via AWS EKS, materially reducing AWS infrastructure costs
      - Delivered a new SSO/MFA authentication system and led the platform to SOC 2 Type II compliance, unlocking enterprise customer revenue
      - Led a full architectural remodel of BSN.Cloud (dependency-injection refactor, multi-account AWS Control Tower setup, and a provisioning system rewrite), enabling BrightSign Control Plus, a new device management revenue stream launched August 2026
      - Cut logging data volume by switching the platform's logging format from JSON to logfmt, reducing daily log volume from around 1.5 TB to just a few hundred GB
      - Driving ongoing Kubernetes cost optimisation: redesigning cluster topology across Availability Zones to cut inter-AZ data transfer costs, and separating hundreds of GB/day of player-fleet log traffic into a dedicated Loki tenant, apart from platform server logs, to improve both cost and operability
      - Co-develops production code with AI assistance and runs internal AI side-projects exploring new product opportunities, alongside advising senior engineers on architecture and running cross-team PR review across .NET, TypeScript, Go and Python
      - Represents the business externally: presented BrightSign Control Plus at InfoComm (Las Vegas) and ISE (Barcelona), including client-facing meetings with Disney and Comcast
      - Operates at every level of the business: biweekly updates directly to the CEO, close day-to-day partnership with the VP of Software, and direct engagement with Sales and Product executives, while building personal working relationships across Marketing, Sales, Support, Development, Infrastructure and IT, using in-person time at InfoComm and ISE to connect with remote US and European colleagues beyond the usual video calls
  - company: "Savernake Capital"
    tier: current
    titles:
      - title: "Chief Technical Officer (Permanent)"
        dates: "Feb 2021 - Jun 2022"
    body: |
      Savernake Capital is a quantitative investment management company specialising in adaptive machine learning. They utilise a self-learning portfolio building system to trade global financial markets, adapting in real time to changing conditions.

      Employed as CTO, reporting directly to the CEO. In this small start-up company, responsibilities were very hands-on, covering all areas from implementing a DevOps solution with Microsoft Azure, .NET software architecture, development and deployment using C# on Windows and Linux, unit testing, debugging, performance profiling, network infrastructure design, provisioning and administration and hardware specifications and building.

      Regularly involved in code reviews, pair programming, mentoring, interviewing, purchasing, support and communicating with investors.

      Further details include the design and administration of PostgreSQL databases, migrating from MySQL. Migration of .NET Framework real-time trading applications to .NET 6. Migration from legacy MSMQ to RabbitMQ. Design and prototyping of a scalable product platform using microservices and containers.

      Savernake was attempting adaptive machine-learning-driven predictive trading years ahead of today's AI boom, a genuinely forward-thinking bet, though ultimately the predictive models never reached the reliability needed for production trading.
  - company: "Triangle / Outcomes Star"
    tier: earlier
    titles:
      - title: "Star Online Technical Oversight (Contract)"
        dates: "Jun 2020 - Jan 2021"
    body: |
      Triangle is the company behind the Outcomes Star, an evidence-based tool for measuring and supporting change when working with people.

      Contracted to provide technical oversight between the business and a 3rd party development company (QES). The role involved auditing and validating the database, code and architecture of the system, reviewing the infrastructure and system performance, assisting with the migration process of 30,000 users from version 1 to version 2, advising on future technologies and pathways, and assisting in getting a robust testing foundation in place to minimise re-occurring bugs.
  - company: "De Beers Forevermark"
    tier: earlier
    titles:
      - title: "Senior Developer / Technical Lead (Contract)"
        dates: "Oct 2018 - Mar 2020"
    body: |
      De Beers Forevermark is a diamond Grading, Inscription and Retail company. It grades and inscribes diamonds using bespoke hardware along with bespoke software and workflow-based applications, with grading laboratories in Maidenhead, Antwerp and Surat, and head office in London.

      As Technical Lead, part of a 5-man team designing and developing the next generation of workflow processing software used to grade and inscribe diamonds in the laboratories for the end customer.

      This involved analysis and support of the existing 14-year-old legacy WPF / ASP.NET software and replacing it with a microservices-based architecture built with .NET Core 3, WPF, Web API and SQL Server. Initially hosted on-premise in Docker containers, with a view to later migration to Azure.

      Additionally migrated the entire legacy build and deployment architecture from MSTFS and Final Builder with a custom deployment tool, initially to GIT, TeamCity and Octopus Deploy and then later to Azure DevOps Repos and Pipelines.
  - company: "Mercedes AMG HPP"
    tier: earlier
    titles:
      - title: "Senior Developer (Contract)"
        dates: "Oct 2017 - Mar 2018"
    body: |
      A career-highlight role: Mercedes AMG High Performance Powertrains is a team of over 500 people responsible for the design, manufacture and testing of Formula 1 power units for the Mercedes AMG Petronas, Sahara Force India and Williams Martini Racing F1 teams.

      As part of the I.T. Business Systems team, partly responsible for the re-design and maintenance of several key data transfer packages that provided raw data from the Formula 1 telemetry systems back to the teams in the pit lane and at the factory in order for them to quickly diagnose and resolve problems.

      Also responsible for designing and developing a new application framework (C# .NET / WPF / MVVM / MEF) to host the data transfer packages and supporting applications, porting several legacy VB.NET applications to C#, and maintaining and improving the Mercedes Damage Planner application, used to predict wear and damage to F1 car components in order to anticipate which part would fail next.
  - company: "Britdaq Ltd"
    tier: earlier
    titles:
      - title: "Senior Developer (Contract)"
        dates: "Jun 2017 - Sep 2017"
    body: |
      Britdaq is a financial services company, offering share matching facilities for private companies and investors, a live company share registrar service, company secretarial services via Companies House, and an online discussion forum for investors.

      After the 3-year contract mainly away from home with McLaren, took up a short-term contract with Britdaq again to allow working from home and spending more time with family.

      Tasks included:

      - Migrating away from the Microsoft SQL Server backend database platform to the open source PostgreSQL database. This allowed Britdaq to reduce their running costs as a commercial database licence was no longer required
      - Establishing an MVC framework to allow Britdaq to migrate from the legacy ASP.NET Webforms to ASP.NET MVC. This predominately involved re-writing the ASP.NET Webforms Membership and Role providers to use the newer ASP.NET Identity API with OWIN Middleware. Installing and configuring development and production PostgreSQL databases and modifying the database schemas appropriately
      - Investigating and implementing a test platform on Amazon Web Services to move Britdaq off an unmanaged Windows 2012 server platform in order to simplify the day-to-day backend management and to further reduce running costs
      - Implementing unit, integration and system tests where possible to cover the migration of all application tiers to the new framework. This involved using NUnit, NCrunch, Fluent Assertions and NSubstitute
  - company: "McLaren Applied Technologies"
    tier: earlier
    titles:
      - title: "Senior Developer (Contract)"
        dates: "Jul 2014 - Jun 2017"
    body: |
      A career-highlight role: McLaren Applied is the technology division of the McLaren Group, building ATLAS (Advanced Telemetry Linked Acquisition System), the telemetry platform used by every team across Formula 1, plus NASCAR and Birmingham Children's Hospital.

      Contracted as a senior developer to work on their ATLAS software, implemented with WPF + MVVM and DirectX in a multi-threading architecture. The project used Agile SCRUM as its development methodology and was a fully Test-Driven Development project. Work involved direct contact with McLaren's own Formula 1 race engineers, gathering feedback and validating the software against real trackside and factory use.

      Role was to assist the team in producing a release version of the new ATLAS 10 Platform to all of the major teams and the FIA in time for the 2017 Formula 1 racing season.

      - Assisted with the design and development of the ATLAS 10 software using C# .NET 4.6.2, WPF/MVVM, Multi-threading, DirectX and TPL
      - Writing and maintaining unit and integration tests to ensure good code coverage across the project assemblies using TDD with NUnit, NCrunch, Fluent Assertions and NSubstitute
      - Team point of contact for liaison with some third-party tools, e.g. Actipro
      - Bug fixing, maintenance and refactoring as necessary
      - Practising Agile SCRUM methodology throughout; daily stand-ups, backlog refinement, sprint retrospectives, etc.
  - company: "Britdaq Ltd"
    tier: earlier
    titles:
      - title: "Technical Architect / Team Lead / Senior Developer (Contract)"
        dates: "Aug 2011 - Jun 2014"
    body: |
      See the Britdaq Ltd entry above for a company description. Roles consisted of:

      - Re-design and re-development of the prototype Britdaq website to make it suitable for release to the general public. This involved re-writing the majority of the system, splitting it into an n-tier design and extracting into separate components where appropriate. All development was in C# using .NET 4.0, with MS SQL Server 2008, ASP.NET, Silverlight 4, RIA Services and Entity Framework. Later removed the Silverlight project and replaced with pure ASP.NET 4.5 website
      - Development of a secure and robust public facing website that provided a trade matching engine, a user forum, and a client interface to Companies House XML Gateway for the submission of all UK Company legal documents (e.g. Annual Returns, Director Appointments)
      - All development utilised the AGILE SCRUM methodology to deliver regular incremental updates to the system
      - Creating a build and unit test environment for the development process using NUnit and Jenkins-CI
      - Set-up and maintenance of live, test and UAT servers hosted by 3rd party providers. Installation of the software on the servers, along with monitoring and performance tuning where necessary
      - General handling of all I.T. administration functions within the company such as supporting the users' email accounts, Internet access and hardware requirements
  - company: "Royal Bank of Scotland"
    tier: earlier
    titles:
      - title: "Senior Software Developer (Contract)"
        dates: "Feb 2011 - Aug 2011"
    body: |
      The role at RBS was directly with the Credit Risk team and involved the design and development of a new software application suite to measure credit risk. Working with the business directly allowed use of tools and technologies (.NET, NHibernate) that were not necessarily part of the core RBS IT technologies (JAVA).

      - Developing server-side software components in .NET to calculate credit risk along with supporting utilities to store and extract the data to a MS SQL Server database using NHibernate
      - Designing and creating a stable automated build and test environment for the development process using TeamCity and NUnit
      - Developing unit tests for existing and new components
      - Refactoring and debugging components as necessary
  - company: "Linermark Systems Ltd"
    tier: earlier
    titles:
      - title: "Consultant / Architect / Senior Software Developer (Contract)"
        dates: "Aug 2008 - Feb 2011"
    body: |
      Linermark Systems is an independent software development company specialising in designing, developing and supporting business applications for any business sector.

      - Assisted in gathering and analysing requirements directly from clients and producing specifications
      - Designed and developed an Aggregates Measuring system for JClubb in C#, WPF and SQL Server
      - Architected, designed and developed an n-tier retail stock management system (Top2Toe) in Silverlight and RIA Services
      - Designed and developed a Fleet Management system (Fleet Minder) for Raymond Brown Group in C#, WinForms and SQL Server
      - Designed and developed a Plant Management system (Plant Minder) for Raymond Brown Group in C#, WinForms and SQL Server
      - Designed and developed a Skip Management and Tracking system (Skip Minder) for Raymond Brown Group in C#, WinForms and SQL Server
      - Designed and developed a web and desktop based Property Services job tracking and invoicing system for RedRose, including integration with Iris Exchequer accounting system in ASP.NET, C#, WinForms and SQL Server
      - Designed and developed a warehouse container and pallet content tracking system for Kuoni Transport. Final enhancements and go-live support provided on-site in Switzerland in C#, WinForms and SQL Server
      - Responsible for support and enhancing Aram Design's retail stock management system. Work was frequently undertaken on-site in the Covent Garden store
      - Assisted in supporting and enhancing a Quarry Management system (Quarry Minder) and ReadyMix Concrete system (ReadiMinder) for Raymond Brown Group (mindersoftware.net)
      - Re-engineered stored procedures to reduce bottlenecks and enhance performance with The Continuity Company's global SQL Server database
      - Solely developed an in-house code generation application to reduce the time spent creating new client applications in C#
      - Solely developed a suite of common library routines for use with all Linermark client projects in C#
      - Re-designed the company website for Linermark Systems (linermark.com)
  - company: "Barclays Capital"
    tier: earlier
    titles:
      - title: "Software Developer (Contract)"
        dates: "Aug 2006 - Aug 2008"
    body: |
      Barclays Capital is the investment banking division of Barclays Bank PLC.

      - Provided support and performance enhancements to the existing Visual Basic 6 based Credit Risk system (CVAR)
      - Assisted in designing and prototyping a new object-oriented replacement Credit Risk system (UVAR) in C# and SQL Server
      - Solely responsible for developing the middle-tier trade processing application for UVAR in C#
      - Provided direct client support during the UAT and go-live phases of the UVAR project
  - company: "EasyScreen Plc"
    tier: earlier
    titles:
      - title: "Software Developer (Contract)"
        dates: "Dec 2004 - May 2006"
    body: |
      EasyScreen is a financial software house that develops Futures and Options trading systems. EasyScreen's core product, EasyTrade, comprises an n-tier architecture written in Microsoft Visual Basic 6, Visual C++ and SQL Server. This was superseded by EasyRouter (a server based trade routing system) and EasyActiveTrade (EAT), a light-weight but fully functional trading front-end to EasyRouter.

      - Design and prototyping of a web retail trading front-end and middle-tier with ASP.NET, C# using Visual Studio 2005 (.NET 2.0)
      - Design and prototyping of a Smart Device (Pocket PC 2003) retail trading front-end and middle-tier web service with the .NET Compact Framework, C# using Visual Studio 2005 (.NET 2.0)
      - Design and prototyping of a monitoring application to pro-actively monitor the status of EasyServer installations at client sites. ASP.NET, C# using Visual Studio 2005 (.NET 2.0), windows services and web services
      - Design and prototyping of custom RSS server and client application to monitor the status of EasyServer installations at client sites. ASP.NET, C# using Visual Studio 2005 (.NET 2.0), windows services
      - Design and development of a Microsoft Excel based trading platform, incorporating Excel trading add-ins and Smart Tag DLLs written in C#, supported by .NET web services and a SQL server database
  - company: "Intelligent Risk Ltd"
    tier: earlier
    titles:
      - title: "Software Developer (Permanent)"
        dates: "Jun 2003 - Nov 2004"
    body: |
      A green-field start-up company, Intelligent Risk developed an innovative mortgage product to fundamentally change the way people financed their house purchases. Their new system required various .NET components to enable mortgage brokers to track workflow and communicate with external suppliers, valuers, credit checking agencies and regulatory companies. Unfortunately, the company was dissolved in 2004 due to lack of funding.

      - Assisted in the design and implementation of the relational database system (Microsoft SQL Server / Oracle) for the data warehouse and several of the smaller "satellite" databases
      - Software and hardware design and implementation of a "web-farm" to securely facilitate the web-sites and web services used in the company to provide internal services and external links to various suppliers
      - Development of externally facing "public" and "broker" web-sites in ASP.NET, C#
      - Development of various internal web services, tools and utilities in WinForms, C#
      - Assisted in the day-to-day maintenance and support of the company where necessary
  - company: "EasyScreen Plc"
    tier: earlier
    titles:
      - title: "Software Developer / Team Leader (Permanent)"
        dates: "Jan 2000 - Jun 2003"
    body: |
      - Development of the EasyTrade front-end product, EasyScreen's primary trading software package. Written in Visual Basic 6, EasyTrade was a component-based system that ran on the Windows platform. It utilised multiple exchange connections to provide real-time market data to the client. Trade state and history were persisted via ADO to SQL Server
      - Assisted in testing the functionality of the system under different environments and loads
      - Assisted in the maintenance and support of the system and related components
      - Assisted the support team with the rollout of EasyTrade to various clients in London
      - Design and development of future products for EasyScreen plc
      - Working directly with a key client, ABN AMRO in Chicago, to address specific requirements
      - Planning and allocation of work for team members

      **Refco EasySolutions (Joint Venture) based in London & Chicago**

      - Seconded to EasyScreen joint venture with Refco LLC, mainly based in Chicago (6 months)
      - Assisted in the design and development of a new Futures and Options Internet based retail product to replace the existing Lind Waldock system. The product was developed as an ASP, HTML and JavaScript web client specifically for Internet Explorer and was hosted on IIS 5.0. It used Visual Basic 6.0 business objects hosted on MTS to connect to the EasyRouter Order Routing platform
      - Assisted in the design and development of a new client based Futures trading platform to be deployed globally for Refco. Its primary purpose was to replace the existing EasyTrade product that was too "heavy" for the proposed Refco platform. This completely new "lightweight" product was developed in three months. Written in Visual Basic, communicating with EasyRouter via SOAP/HTTP and utilising Visual Basic business objects hosted on MTS

      **Futures & Options Trading: Software Developer (from April 2002)**

      - Continued development of the new EasyScreen lightweight product called EasyActiveTrade (EAT)
      - Self-training in VB.NET and ADO.NET in order to establish company expertise and to aid in porting the middle-tier and front-end products to .NET
      - Prototyping the phase 1 version of EasyActiveTrade in .NET to determine the feasibility of conversion
      - Design and analysis of future EasyActiveTrade requirements
      - Specified the requirements for and implemented a new Defect Tracking and Customer Support system (Perfect Tracker) for internal development and external client access
  - company: "NatWest Global Financial Markets"
    tier: earlier
    titles:
      - title: "Software Developer (Contract)"
        dates: "Feb 1998 - Jan 2000"
    body: |
      The Credit Risk Technology team required an intranet presence and enquiry tools to query counterparty limits and hierarchies.

      - Responsible for the development of an intranet web site for the team
      - Developed tools for limit and counter-party enquiries using ASP and Visual Basic Web Forms
      - Documented and presented all systems and technologies used

      **Technology Infrastructure: Support Analyst / Developer**

      The Technology Infrastructure team required assistance in analysing and implementing a new global standard for the desktop refresh programme.

      - Assisted in analysing all software used within NatWest GFM
      - Assisted in the global rollout of the new standard desktop
      - Assisted in the administration and global rollout of Microsoft Systems Management Server
      - Assisted the team with day-to-day administration tasks and short to medium term solutions
      - Seconded to the NT Server team to assist with the daily administration tasks
      - Developed the NT Server team intranet site to aid their workflow and provide reporting
      - Seconded to the Market Data team to develop an internal SQL Server database for the management and reporting of Market Data, Networking, Private Wires and Asset Management information

      **Finance Technology: Support Analyst / Developer**

      The Finance Technology team required assistance in converting numerous legacy databases, spreadsheets and VBA code modules to ensure Y2K compliance.

      - Converted all back-office MS Access v2/95 databases to v97 to ensure Y2K compliance and continued connectivity to live data
      - Re-coded VBA code modules where necessary
      - Developed and standardised ODBC server connectivity for client databases
      - Provided VB development support to internal finance developers
  - company: "Union Bank of Switzerland"
    tier: earlier
    titles:
      - title: "Programmer (Permanent)"
        dates: "Sep 1997 - Feb 1998"
    body: |
      The Rapid Application Development (RAD) team was involved in producing in-house Visual Basic and C++ solutions for UBS's business areas. Due to the merger of businesses the position was made redundant after 6 months.

      - Designed and developed a document faxing solution for an existing product used in the front and back-offices
      - Assisted in the development of a middleware-messaging component DataExpress
  - company: "Human Enterprise Ltd / Computer Telephony Services Ltd"
    tier: earlier
    titles:
      - title: "Programmer / Consultant (Permanent)"
        dates: "Jun 1995 - Sep 1997"
    body: |
      Human Enterprise was an I.T. Consultancy providing solutions for various clients, including News International, Union Bank of Switzerland, Commerzbank and Saudi International Bank.

      - Developed a document library system to facilitate the storage and retrieval of legal documentation using Visual Basic 3 for the Union Bank of Switzerland
      - Designed and developed a help desk system using Visual Basic 4 and SQL Server for News International
      - Installation and configuration of MS Windows NT 3.51 to 100+ users at Commerzbank, Frankfurt
      - Installation and configuration of MS Outlook and Internet Explorer to 250+ users at Saudi International Bank, London

      Computer Telephony Services was a new company formed by Human Enterprise Ltd with the sole objective of entering the Computer Telephony Integration (CTI) market to provide real-time telephony services.

      - Developed real-time telephony/voice, voice-mail, IVR and TAPI applications using Visual Basic and SQL Server
      - Built and administered NT Servers, SQL Server databases and high-performance client workstations to host CTI applications
      - Designed and developed Internet sites for both companies, HEL and CTS, using MS FrontPage
      - Created multimedia projects using Visual Basic
  - company: "Union Bank of Switzerland"
    tier: earlier
    titles:
      - title: "Support Analyst & Developer (Industrial Placement)"
        dates: "Jun 1993 - Sep 1994"
    body: |
      Industrial placement with UBS (London) I.T. Infrastructure department.

      **University Industrial Placement**

      - Investigated private wire (ISDN) systems, including billing and physical line terminations
      - Assisted with Novell networking and PC support
      - Analysed the bank's data feeds to determine utilisation in order to reduce costs
      - Assisted the Local Area Network security team perform an audit of the bank's networks
      - Visual Basic developer for the DICE (Distributed Integrated Customer Environment) team

      **University Final Year Project**

      - Developed a 'Market Data Distribution Mechanism' proof of concept application using Microsoft Visual C++. The project was based around the Reuters Triarch system
interests:
  - body: >-
      Scuba Diving (TDI Normoxic Tri-mix diver & PADI Assistant Instructor,
      not currently active), Road and Mountain Biking, Swimming, Running,
      Electronics.
  - heading: "Renewable Energy & Sustainability"
    body: >-
      Hands-on experience with home solar, battery storage, and heat pumps
      via a personal Sigenergy system, passionate about eco engineering,
      virtual power plants (VPP), and energy trading and arbitrage, a strong
      advocate for EV adoption, with a keen interest in companies like Axle
      Energy and Octopus Energy driving the renewable energy transition.
  - heading: "Smart Home & IoT"
    body: >-
      Highly skilled in Home Assistant automation, ESP32 development, and
      Zigbee-based smart controls. Exploring the intersection of IoT,
      automation, and renewable energy systems.
  - heading: "Home Lab & Telemetry"
    body: >-
      Runs a home lab (a 42U rack running a Kubernetes cluster and a
      fully-segmented UniFi network with multiple switches and secure VLAN
      zoning), with telemetry monitored end-to-end via Home Assistant. A
      direct extension of the same telemetry/observability instincts
      developed professionally, from Formula 1 telemetry systems (ATLAS) to
      BrightSign's OpenTelemetry/Grafana stack, into a personal setup.
---
```

- [ ] **Step 2: Verify it parses against the schema**

Run: `npm run build`
Expected: build succeeds with no Zod validation errors. If it fails, the error names the exact field/path that doesn't match the Task 3 schema — fix the frontmatter, not the schema.

- [ ] **Step 3: Commit**

```bash
git add src/content/resume/index.md
git commit -m "Add resume content, migrated from vault CV.md"
```

---

### Task 5: Resume page

**Files:**
- Create: `src/components/SkillTags.astro`
- Create: `src/components/RoleEntry.astro`
- Create: `src/pages/resume.astro`
- Test: `test/resume.test.ts`

**Interfaces:**
- Consumes: the `resume` collection entry (Task 4), the `Layout` component (Task 2).
- Produces: `/resume` route rendering summary, skill tags, and career roles with pre-2019-equivalent ("earlier" tier) roles collapsed into a `<details>` block.

- [ ] **Step 1: Write the `SkillTags` component**

```astro
---
// src/components/SkillTags.astro
interface Props {
  groups: Array<{ label: string; items: string[] }>;
}
const { groups } = Astro.props;
---
{groups.map((group) => (
  <div style="margin-bottom: var(--space-2);">
    <h4 style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--color-accent-teal); margin-bottom: var(--space-1);">
      {group.label}
    </h4>
    <div>
      {group.items.map((item) => <span class="tag" style="margin: 0 4px 4px 0;">{item}</span>)}
    </div>
  </div>
))}
```

- [ ] **Step 2: Write the `RoleEntry` component**

```astro
---
// src/components/RoleEntry.astro
interface Props {
  role: {
    company: string;
    titles: Array<{ title: string; dates: string }>;
  };
  html: string;
}
const { role, html } = Astro.props;
---
<div style="border-left: 2px solid var(--color-accent-amber); padding-left: var(--space-2); margin-bottom: var(--space-3);">
  <h3 style="margin: 0 0 4px;">{role.company}</h3>
  {role.titles.map((t) => (
    <div style="font-size: 0.85rem; margin-bottom: 2px;">
      <strong>{t.title}</strong>
      <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim);"> &middot; {t.dates}</span>
    </div>
  ))}
  <div set:html={html} />
</div>
```

`RoleEntry` takes pre-rendered `html` rather than rendering markdown itself, because the caller (Task 5 Step 3) needs to render each role's `body` markdown string once, up front, using the `marked` library — keeping the markdown-rendering dependency in one place.

- [ ] **Step 3: Install a markdown renderer for frontmatter body strings**

Content collection frontmatter fields are plain strings, not renderable Astro content — only the *file's own body* gets `render()`. Each role's `body` is a markdown string living inside frontmatter, so it needs a small renderer.

```bash
npm install marked
```

- [ ] **Step 4: Write the Resume page**

```astro
---
// src/pages/resume.astro
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import Layout from '../layouts/Layout.astro';
import SkillTags from '../components/SkillTags.astro';
import RoleEntry from '../components/RoleEntry.astro';

const [resume] = await getCollection('resume');
const { summary, leadership, education, awards, certifications, skillGroups, roles, interests } = resume.data;

const currentRoles = roles.filter((r) => r.tier === 'current');
const earlierRoles = roles.filter((r) => r.tier === 'earlier');
---
<Layout title="Resume | Gareth Parris" description={summary}>
  <h1>Resume</h1>

  <section>
    <h2>Summary</h2>
    <p>{summary}</p>
  </section>

  <section>
    <h2>Leadership &amp; AI-Augmented Engineering</h2>
    <p>{leadership}</p>
  </section>

  <section>
    <h2>Core Skills</h2>
    <SkillTags groups={skillGroups} />
  </section>

  <section>
    <h2>Career</h2>
    {currentRoles.map((role) => (
      <RoleEntry role={role} html={marked.parse(role.body) as string} />
    ))}
    <details>
      <summary style="cursor: pointer; font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-text-dim); padding: var(--space-1) 0;">
        Earlier Career ({earlierRoles.length} roles, 1993-2021)
      </summary>
      {earlierRoles.map((role) => (
        <RoleEntry role={role} html={marked.parse(role.body) as string} />
      ))}
    </details>
  </section>

  <section>
    <h2>Education</h2>
    <p>{education}</p>
  </section>

  <section>
    <h2>Awards</h2>
    <ul>{awards.map((a) => <li>{a}</li>)}</ul>
  </section>

  <section>
    <h2>Certifications</h2>
    <ul>{certifications.map((c) => <li>{c}</li>)}</ul>
  </section>

  <section>
    <h2>Interests</h2>
    {interests.map((i) => (
      <div>
        {i.heading && <h4>{i.heading}</h4>}
        <p>{i.body}</p>
      </div>
    ))}
  </section>
</Layout>
```

- [ ] **Step 5: Write the container-API test**

```ts
// test/resume.test.ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Resume from '../src/pages/resume.astro';

describe('Resume page', () => {
  it('shows current roles in full and collapses earlier roles', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Resume);

    expect(result).toContain('BrightSign');
    expect(result).toContain('Director of Software Engineering');
    expect(result).toContain('Savernake Capital');

    // Earlier-tier roles are present in the markup (for SEO/no-JS access)
    // but nested inside a <details> so they're collapsed by default.
    expect(result).toContain('McLaren Applied Technologies');
    expect(result).toMatch(/<details>[\s\S]*McLaren Applied Technologies[\s\S]*<\/details>/);
  });

  it('renders skill tag groups', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Resume);

    expect(result).toContain('Cloud &amp; Platform');
    expect(result).toContain('Kubernetes');
    expect(result).toContain('OpenTelemetry');
  });
});
```

- [ ] **Step 6: Run the tests**

Run: `npm run test -- resume`
Expected: PASS (2 tests)

- [ ] **Step 7: Commit**

```bash
git add src/components/SkillTags.astro src/components/RoleEntry.astro src/pages/resume.astro test/resume.test.ts package.json package-lock.json
git commit -m "Add Resume page with collapsible earlier-career section"
```

---

### Task 6: Home page

**Files:**
- Create: `src/pages/index.astro`
- Test: `test/home.test.ts`

**Interfaces:**
- Consumes: `Layout` (Task 2), the `blog` collection (populated in Task 7 — until then, `getCollection('blog')` returns `[]`, which is fine; this task's test doesn't depend on blog entries existing).
- Produces: `/` route — split hero (intro + "current focus" status card) plus a latest-posts teaser section.

- [ ] **Step 1: Write the Home page**

```astro
---
// src/pages/index.astro
import { getCollection } from 'astro:content';
import Layout from '../layouts/Layout.astro';

const posts = (await getCollection('blog'))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 2);
---
<Layout
  title="Gareth Parris"
  description="Director of Software Engineering leading teams around observability, incident management and platform reliability."
>
  <section style="display: flex; gap: var(--space-3); align-items: center; flex-wrap: wrap; padding: var(--space-4) 0;">
    <div style="flex: 1; min-width: 260px;">
      <p style="font-family: var(--font-mono); color: var(--color-accent-teal); font-size: 0.8rem; margin-bottom: var(--space-1);">
        // director.software_engineering @ brightsign
      </p>
      <h1>Gareth Parris</h1>
      <p>
        Director of Software Engineering. I build and lead teams around observability,
        incident management and platform reliability, and I'm still hands-on in the codebase.
      </p>
    </div>
    <div style="flex: 0 0 220px; background: var(--color-bg-raised); border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-2);">
      <p style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-text-dim); margin: 0 0 4px;">CURRENT FOCUS</p>
      <p style="font-family: var(--font-mono); color: var(--color-accent-amber); font-size: 0.9rem; margin: 0 0 4px;">
        Kubernetes cost optimisation
      </p>
      <p style="font-size: 0.75rem; color: var(--color-text-dim); margin: 0;">3 teams &middot; BrightSign Control Plus</p>
    </div>
  </section>

  <section>
    <h2>Latest from the blog</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-2);">
      {posts.map((post) => (
        <a href={`/blog/${post.slug}`} style="display: block; background: var(--color-bg-raised); border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-2); text-decoration: none; color: var(--color-text);">
          <h3 style="margin: 0 0 4px; font-size: 0.95rem;">{post.data.title}</h3>
          <span class="tag">{post.data.category}</span>
        </a>
      ))}
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Write the test**

```ts
// test/home.test.ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Home from '../src/pages/index.astro';

describe('Home page', () => {
  it('renders the hero and current-focus card', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Home);

    expect(result).toContain('Gareth Parris');
    expect(result).toContain('CURRENT FOCUS');
    expect(result).toContain('Kubernetes cost optimisation');
  });
});
```

- [ ] **Step 3: Run the test**

Run: `npm run test -- home`
Expected: PASS (1 test) — note the blog-teaser section will render zero cards until Task 7 adds posts; that's expected at this point and not asserted on yet.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro test/home.test.ts
git commit -m "Add Home page with split hero and blog teaser"
```

---

### Task 7: Migrate blog posts

**Files:**
- Create: `src/content/blog/drum-award.md`, `src/content/blog/mercedes.md`, `src/content/blog/mit-wall.md`, `src/content/blog/server-rack.md`
- Create: `public/images/blog/*.jpg` (copied from the old repo)
- Create: `src/components/BlogCard.astro`
- Create: `src/pages/blog/index.astro`
- Test: `test/blog.test.ts`

**Interfaces:**
- Consumes: the `blog` schema (Task 3), `Layout` (Task 2).
- Produces: `/blog` route listing all posts as cards; the `blog` collection now has real entries, which is what Task 6's teaser section needed.

- [ ] **Step 1: Copy the images from the old repo**

```bash
mkdir -p public/images/blog
cp /Users/gparris/GitHub/garethparris/garethparris.info/src/images/blog/drum-award-full.jpg \
   /Users/gparris/GitHub/garethparris/garethparris.info/src/images/blog/drum-award.jpg \
   /Users/gparris/GitHub/garethparris/garethparris.info/src/images/blog/mercedes-full.jpg \
   /Users/gparris/GitHub/garethparris/garethparris.info/src/images/blog/mercedes-silver.jpg \
   /Users/gparris/GitHub/garethparris/garethparris.info/src/images/blog/mercedes.jpg \
   /Users/gparris/GitHub/garethparris/garethparris.info/src/images/blog/mit-wall-full.jpg \
   /Users/gparris/GitHub/garethparris/garethparris.info/src/images/blog/mit-wall-rear.jpg \
   /Users/gparris/GitHub/garethparris/garethparris.info/src/images/blog/mit-wall-app.jpg \
   /Users/gparris/GitHub/garethparris/garethparris.info/src/images/blog/mit-wall.jpg \
   /Users/gparris/GitHub/garethparris/garethparris.info/src/images/blog/server-rack-full.jpg \
   /Users/gparris/GitHub/garethparris/garethparris.info/src/images/blog/server-rack-kit.jpg \
   /Users/gparris/GitHub/garethparris/garethparris.info/src/images/blog/server-rack.jpg \
   public/images/blog/
```

- [ ] **Step 2: Write the four blog post content files**

```markdown
<!-- src/content/blog/drum-award.md -->
---
title: "Event Technology of the Year 2020 Drum Award"
description: "Two Lines Meet won the Drum Awards' Event Technology of the Year category for the MIT interactive wall project."
pubDate: 2020-12-01
category: "Team Work"
tags: [".NET", "C#", "IoT", "Arduino", "RFID"]
heroImage: "/images/blog/drum-award-full.jpg"
---
Last year I created a post about an Interactive Hardware and Software project I worked on with [Two Lines Meet](https://twolinesmeet.com/) for [MIT's Campaign for a Better World](https://betterworld.mit.edu/).

In summer 2020, Two Lines Meet entered the [Drum Awards, in the category "Event Technology of the Year"](https://www.thedrum.com/news/2020/11/09/finalists-revealed-the-drum-awards-experience-2020). We were up against some strong, established contenders, like The Mill, and Momentum Worldwide.

As it turns out, [we won the category award](https://twitter.com/TheDrum/status/1334538677381427201?s=20)! I'd like to pass on my thanks to everyone in the team who helped us achieve this!

You can find [the original post here](/blog/mit-wall).
```

```markdown
<!-- src/content/blog/mercedes.md -->
---
title: "Working with a Winning Team"
description: "Reflections on writing telemetry software for the Mercedes AMG F1 team."
pubDate: 2017-11-01
category: "Team Work"
tags: ["Mercedes", "Silver", "Arrows", "4theteam", "AMG"]
heroImage: "/images/blog/mercedes-full.jpg"
---
In my career I've always focused on my passion of technology and applied it to everywhere I've worked. I made a choice not to focus on one specific business area, and instead try to gain a broad experience from many diverse businesses. Most of the places that I've worked have generally been a positive experience, with the usual caveats of politics and red tape.

One place in particular that I enjoyed working was at Mercedes AMG HPP, writing software to support the engineers for the Mercedes F1 Team. What struck me here at Mercedes, was the passion that the entire company showed towards the business itself. Everyone I worked with was dedicated to the cause and loved their job.

What was also great was the fact that the business saw what the I.T. teams brought to the table, making meetings very productive. This allowed us to design and plan our projects well and deliver performant solutions that satisfied the requirements.

The best part though was the win. When Mercedes won a race, it felt like we all had won the race. I actually felt like the software I developed there really had contributed to that win in a small way. It's not often you get to feel your results as a software developer in a way that was as tangible as that. Good times!

![Rear Wall](/images/blog/mercedes-silver.jpg)
```

```markdown
<!-- src/content/blog/mit-wall.md -->
---
title: "Helping create an Interactive Wall for MIT"
description: "Designing and building the hardware and software behind an interactive wall for MIT's Campaign for a Better World."
pubDate: 2019-11-01
category: "Interactive Programming"
tags: [".NET", "C#", "IoT", "Arduino", "RFID"]
heroImage: "/images/blog/mit-wall-full.jpg"
---
In summer 2019, the MD of [Two Lines Meet](https://twolinesmeet.com/) contacted me and asked if I could assist them with the software and hardware design and development of an interactive wall for [MIT's Campaign for a Better World](https://betterworld.mit.edu/).

My brief was to gather all of the interaction data from various hardware devices on the wall, and then build and transmit commands to a projection mapping software package called [Resolume](https://resolume.com/).

The hardware specification (shown in the image below) included:

- 3x [Bare Conductive Capacitive Touch Boards](https://www.bareconductive.com/shop/touch-board/)
- 4x [Arduino Uno Boards](https://www.arduino.cc/en/Main/arduinoBoardUno/) with various sensors attached, i.e. 3x RFID readers, a Magnetometer, and a pull-cord on/off switch
- 2x USB [SpinTrak Precision Rotary controls](https://www.ultimarc.com/trackballs-and-spinners/spinners/) that produced a single dimensional mouse input
- 1x USB Microphone (for the clap sensor)
- 2x powered USB Hubs
- 1x Intel NUC PC
- 2x [Optoma Ultra Short Throw](https://www.optoma.co.uk/product-details/zw400ust) projectors

![Rear Wall](/images/blog/mit-wall-rear.jpg)

The software application itself was written as a C# WPF application using .NET Framework 4.8. Each wall section was written as a separate task, so they were all completely independent of each other. This was needed as multiple users could be interacting with different parts of the wall at any one time.

It interacted with both USB and USB/Serial hardware devices. There were several lower level pieces of code that needed to work well together, including the serial port handler and multiple mouse input devices. The latter required some Win32 calls to be able to select which mouse input device data was to be read from. Each task subscribed to the relevant input device handler in order to receive the appropriate events. That task then translated the data and sent instructions to Resolume in order to play the appropriate projection map.

Communication from the application to Resolume took the form of OSC packets. [OSC is a networking protocol](https://en.wikipedia.org/wiki/Open_Sound_Control) sent over UDP. A combination of open-source libraries and proprietary code was used to tweak this to our requirements.

A simple WPF GUI was created to indicate the current status of each task and also to allow some minor tweaks as the application was running, like adjusting the USB microphone sensitivity to cater for changes in background noise levels throughout the event.

![Rear Wall](/images/blog/mit-wall-app.jpg)

The first event was hosted at the [Queen Elizabeth II Conference Centre](https://qeiicentre.london/) in London, and we've since been out to Stamford, Connecticut with it. Unfortunately, due to COVID, the MIT Campaign for a Better World tour has been put on hold.

Here's a video of the wall in action at the London Event: [youtube.com/watch?v=Xov5VAHRwZk](https://youtube.com/watch?v=Xov5VAHRwZk)
```

```markdown
<!-- src/content/blog/server-rack.md -->
---
title: "Custom SoHo Server Rack with Ubiquity Unifi"
description: "Upgrading a home network to a rack-mounted UniFi setup, plus the Raspberry Pi cluster living alongside it."
pubDate: 2020-07-01
category: "Networking Hardware"
tags: ["Ubiquity", "Unifi", "UDM Pro", "Switch", "Network"]
heroImage: "/images/blog/server-rack-full.jpg"
---
I've just updated my SoHo network set-up from:

- UniFi USG 3P
- UniFi USW-24-PoE 250 Switch
- UniFi Cloud Key G2 Plus
- 2x UniFi AC Pro Access Points
- 3x UniFi G3 Dome Cameras
- 1x UniFi G3 Flex Camera

to:

- [UniFi Dream Machine Pro](https://unifi-network.ui.com/dreammachine)
- [UniFi 24 Port PoE GEN2 Switch](https://unifi-network.ui.com/switching)
- [2x UniFi NanoHD Access Points](https://unifi-network.ui.com/wi-fi)
- [3x UniFi G3 Dome Cameras](https://unifi-network.ui.com/camera-security)
- [1x UniFi G3 Flex Camera](https://unifi-network.ui.com/camera-security)
- [1x UniFi G4 Bullet Camera](https://unifi-network.ui.com/camera-security)

![SoHo Server Rack](/images/blog/server-rack-kit.jpg)

It's using around 10W less power than the previous configuration and its quieter being passively cooled. I've added a solar powered extraction fan, and a separate powered temperature monitoring module that will activate two intake and one exhaust fan if needed.

I'm also running the following rack mounted equipment in there:

- Synology RS816 NAS Drive
- [BitScope Quattro Raspberry Pi blade](http://www.bitscope.com/product/BB04/)
- Cyberpower 600VA UPS with Remote Management Adapter

I'm running six Raspberry Pis, ranging from an original Model B hosting [FlightRadar24](https://www.flightradar24.com/), an [EmonPi](https://shop.openenergymonitor.com/emonpi/) power monitor on a Model 3B, and on the BitScope blade I have a model 4B, model 3B plus, model 3B and a model 2B all running [Docker](https://www.docker.com/) and various containers hosting some applications 24x7 along with being a test bed for testing some simple micro-services prototypes.

Below is a quick demonstration of the UniFi AR feature: [youtube.com/watch?v=0dlB-UAhTyw](https://www.youtube.com/watch?v=0dlB-UAhTyw)
```

- [ ] **Step 3: Write the `BlogCard` component**

```astro
---
// src/components/BlogCard.astro
interface Props {
  slug: string;
  title: string;
  category: string;
  heroImage: string;
}
const { slug, title, category, heroImage } = Astro.props;
---
<a href={`/blog/${slug}`} style="display: block; background: var(--color-bg-raised); border: 1px solid var(--color-border); border-radius: var(--radius); overflow: hidden; text-decoration: none; color: var(--color-text);">
  <img src={heroImage} alt={title} style="width: 100%; height: 120px; object-fit: cover; display: block;" />
  <div style="padding: var(--space-2);">
    <h3 style="margin: 0 0 4px; font-size: 0.95rem;">{title}</h3>
    <span class="tag">{category}</span>
  </div>
</a>
```

- [ ] **Step 4: Write the Blog index page**

```astro
---
// src/pages/blog/index.astro
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import BlogCard from '../../components/BlogCard.astro';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---
<Layout title="Blog | Gareth Parris" description="Writing on networking, hardware projects, and career highlights.">
  <h1>Writing</h1>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-2);">
    {posts.map((post) => (
      <BlogCard
        slug={post.slug}
        title={post.data.title}
        category={post.data.category}
        heroImage={post.data.heroImage}
      />
    ))}
  </div>
</Layout>
```

- [ ] **Step 5: Write the test**

```ts
// test/blog.test.ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import BlogIndex from '../src/pages/blog/index.astro';

describe('Blog index', () => {
  it('lists all four migrated posts', async () => {
    const posts = await getCollection('blog');
    expect(posts).toHaveLength(4);

    const container = await AstroContainer.create();
    const result = await container.renderToString(BlogIndex);

    expect(result).toContain('Event Technology of the Year 2020 Drum Award');
    expect(result).toContain('Working with a Winning Team');
    expect(result).toContain('Helping create an Interactive Wall for MIT');
    expect(result).toContain('Custom SoHo Server Rack with Ubiquity Unifi');
  });

  it('sorts posts newest first', async () => {
    const posts = await getCollection('blog');
    const dates = posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((p) => p.data.pubDate.getFullYear());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });
});
```

- [ ] **Step 6: Run the tests**

Run: `npm run test -- blog`
Expected: PASS (2 tests). Also re-run `npm run test -- home` — the Home page's teaser section now has real posts to render.

- [ ] **Step 7: Commit**

```bash
git add src/content/blog public/images/blog src/components/BlogCard.astro src/pages/blog/index.astro test/blog.test.ts
git commit -m "Migrate 4 blog posts from garethparris.info"
```

---

### Task 8: Individual blog post page

**Files:**
- Create: `src/pages/blog/[slug].astro`
- Modify: `test/blog.test.ts` (add post-page assertions)

**Interfaces:**
- Consumes: the `blog` collection (Task 7).
- Produces: `/blog/<slug>` routes for all four posts, statically generated via `getStaticPaths`.

- [ ] **Step 1: Write the dynamic post page**

```astro
---
// src/pages/blog/[slug].astro
import { getCollection, render } from 'astro:content';
import Layout from '../../layouts/Layout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<Layout title={`${post.data.title} | Gareth Parris`} description={post.data.description}>
  <img src={post.data.heroImage} alt={post.data.title} style="width: 100%; max-height: 320px; object-fit: cover; border-radius: var(--radius);" />
  <h1>{post.data.title}</h1>
  <div style="margin-bottom: var(--space-2);">
    {post.data.tags.map((tag: string) => <span class="tag" style="margin-right: 4px;">{tag}</span>)}
  </div>
  <article>
    <Content />
  </article>
</Layout>
```

- [ ] **Step 2: Add post-page assertions to the blog test file**

Append to `test/blog.test.ts`:

```ts
import BlogPost, { getStaticPaths } from '../src/pages/blog/[slug].astro';

describe('Blog post page', () => {
  it('generates one static path per post', async () => {
    const paths = await getStaticPaths();
    expect(paths).toHaveLength(4);
    expect(paths.map((p) => p.params.slug).sort()).toEqual(
      ['drum-award', 'mercedes', 'mit-wall', 'server-rack'].sort()
    );
  });

  it('renders a post with its tags and content', async () => {
    const container = await AstroContainer.create();
    const paths = await getStaticPaths();
    const serverRackPath = paths.find((p) => p.params.slug === 'server-rack')!;

    const result = await container.renderToString(BlogPost, {
      props: serverRackPath.props,
    });

    expect(result).toContain('Custom SoHo Server Rack with Ubiquity Unifi');
    expect(result).toContain('UniFi Dream Machine Pro');
    expect(result).toContain('Ubiquity');
  });
});
```

- [ ] **Step 3: Run the tests**

Run: `npm run test -- blog`
Expected: PASS (4 tests total in this file)

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/[slug].astro test/blog.test.ts
git commit -m "Add individual blog post pages"
```

---

### Task 9: Contact page and Cloudflare Pages Function

**Files:**
- Create: `src/pages/contact.astro`
- Create: `functions/api/contact.ts`
- Test: `test/contact-function.test.ts`

**Interfaces:**
- Consumes: `Layout` (Task 2).
- Produces: `/contact` page with a form; `POST /api/contact` endpoint (a Cloudflare Pages Function, separate from the Astro build) that sends the submission via Resend.

This is the one part of the site that isn't purely static — flagged in the spec. Cloudflare Pages auto-detects any file under `functions/` as a serverless endpoint; it does not go through Astro's router.

- [ ] **Step 1: Write the contact form page**

```astro
---
// src/pages/contact.astro
import Layout from '../layouts/Layout.astro';
---
<Layout title="Contact | Gareth Parris" description="Get in touch.">
  <h1>Contact</h1>
  <form id="contact-form" method="POST" action="/api/contact" style="display: flex; flex-direction: column; gap: var(--space-2); max-width: 420px;">
    <label>
      Name
      <input type="text" name="name" required style="width: 100%; padding: 8px; background: var(--color-bg-raised); border: 1px solid var(--color-border); color: var(--color-text); border-radius: 4px;" />
    </label>
    <label>
      Email
      <input type="email" name="email" required style="width: 100%; padding: 8px; background: var(--color-bg-raised); border: 1px solid var(--color-border); color: var(--color-text); border-radius: 4px;" />
    </label>
    <label>
      Message
      <textarea name="message" required rows="5" style="width: 100%; padding: 8px; background: var(--color-bg-raised); border: 1px solid var(--color-border); color: var(--color-text); border-radius: 4px;"></textarea>
    </label>
    <button type="submit" style="padding: 10px; background: var(--color-accent-teal); border: none; border-radius: 4px; color: var(--color-bg); font-weight: 700; cursor: pointer;">
      Send
    </button>
    <p id="contact-status" role="status"></p>
  </form>

  <script>
    const form = document.getElementById('contact-form') as HTMLFormElement;
    const status = document.getElementById('contact-status')!;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const response = await fetch('/api/contact', { method: 'POST', body: formData });
      status.textContent = response.ok
        ? "Thanks, I'll get back to you soon."
        : 'Something went wrong, please email me directly instead.';
      if (response.ok) form.reset();
    });
  </script>
</Layout>
```

- [ ] **Step 2: Write the Cloudflare Pages Function**

```ts
// functions/api/contact.ts
interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
}

export async function extractContactFields(formData: FormData): Promise<
  { ok: true; name: string; email: string; message: string } | { ok: false; error: string }
> {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  if (typeof name !== 'string' || !name.trim()) return { ok: false, error: 'Missing name' };
  if (typeof email !== 'string' || !email.includes('@')) return { ok: false, error: 'Invalid email' };
  if (typeof message !== 'string' || !message.trim()) return { ok: false, error: 'Missing message' };

  return { ok: true, name, email, message };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData();
  const fields = await extractContactFields(formData);

  if (!fields.ok) {
    return new Response(JSON.stringify({ error: fields.error }), { status: 400 });
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'parris.me.uk contact form <noreply@parris.me.uk>',
      to: context.env.CONTACT_TO_EMAIL,
      reply_to: fields.email,
      subject: `New contact form message from ${fields.name}`,
      text: fields.message,
    }),
  });

  if (!resendResponse.ok) {
    return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
```

`extractContactFields` is exported separately from the Cloudflare-specific `onRequestPost` handler so it can be unit-tested without needing a Cloudflare runtime — that handler itself is thin glue, tested implicitly by the field-validation tests plus manual verification after deploy (Task 11).

- [ ] **Step 3: Write the test**

```ts
// test/contact-function.test.ts
import { describe, it, expect } from 'vitest';
import { extractContactFields } from '../functions/api/contact';

function formDataWith(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

describe('extractContactFields', () => {
  it('accepts a complete, valid submission', async () => {
    const result = await extractContactFields(
      formDataWith({ name: 'Jane Doe', email: 'jane@example.com', message: 'Hello!' })
    );
    expect(result).toEqual({ ok: true, name: 'Jane Doe', email: 'jane@example.com', message: 'Hello!' });
  });

  it('rejects a missing name', async () => {
    const result = await extractContactFields(
      formDataWith({ name: '', email: 'jane@example.com', message: 'Hello!' })
    );
    expect(result).toEqual({ ok: false, error: 'Missing name' });
  });

  it('rejects an email without an @', async () => {
    const result = await extractContactFields(
      formDataWith({ name: 'Jane Doe', email: 'not-an-email', message: 'Hello!' })
    );
    expect(result).toEqual({ ok: false, error: 'Invalid email' });
  });

  it('rejects a missing message', async () => {
    const result = await extractContactFields(
      formDataWith({ name: 'Jane Doe', email: 'jane@example.com', message: '' })
    );
    expect(result).toEqual({ ok: false, error: 'Missing message' });
  });
});
```

- [ ] **Step 4: Add the Cloudflare Workers types so `PagesFunction` resolves**

```bash
npm install -D @cloudflare/workers-types
```

Add to `tsconfig.json`'s `compilerOptions.types`: `["@cloudflare/workers-types"]`.

- [ ] **Step 5: Run the tests**

Run: `npm run test -- contact-function`
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add src/pages/contact.astro functions/api/contact.ts test/contact-function.test.ts tsconfig.json package.json package-lock.json
git commit -m "Add Contact page and Cloudflare Pages Function"
```

---

### Task 10: SEO, accessibility pass, and remaining polish

**Files:**
- Modify: `src/layouts/Layout.astro` (add Open Graph tags, canonical URL)
- Create: `public/robots.txt`
- Create: `public/sitemap.xml` (static, four known blog slugs plus the three top-level pages)
- Test: `test/layout.test.ts` (extend)

**Interfaces:**
- Consumes: `Layout` (Task 2).
- Produces: same `Layout` component, now emitting canonical/OG tags every page inherits automatically.

- [ ] **Step 1: Extend `Layout.astro`'s `<head>`**

Add inside `<head>`, after the existing `<meta name="description">` line:

```astro
    <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
```

- [ ] **Step 2: Add `robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://parris.me.uk/sitemap.xml
```

- [ ] **Step 3: Add `sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://parris.me.uk/</loc></url>
  <url><loc>https://parris.me.uk/resume</loc></url>
  <url><loc>https://parris.me.uk/blog</loc></url>
  <url><loc>https://parris.me.uk/contact</loc></url>
  <url><loc>https://parris.me.uk/blog/drum-award</loc></url>
  <url><loc>https://parris.me.uk/blog/mercedes</loc></url>
  <url><loc>https://parris.me.uk/blog/mit-wall</loc></url>
  <url><loc>https://parris.me.uk/blog/server-rack</loc></url>
</urlset>
```

- [ ] **Step 4: Extend the layout test for the new head tags**

Append to `test/layout.test.ts`:

```ts
it('includes canonical and Open Graph tags', async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(Layout, {
    props: { title: 'Test Title', description: 'Test description' },
    slots: { default: '<p>content</p>' },
  });

  expect(result).toContain('rel="canonical"');
  expect(result).toContain('property="og:title"');
  expect(result).toContain('content="Test Title"');
});
```

- [ ] **Step 5: Run the full test suite**

Run: `npm run test`
Expected: every test file passes (layout, content-config, resume, home, blog, contact-function).

- [ ] **Step 6: Run the full build and a manual accessibility spot-check**

Run: `npm run build && npm run preview`

Open the preview URL and check with the browser's accessibility tree (or a Lighthouse run in Chrome DevTools): heading order is sequential on every page, every image has non-empty `alt` text, the "Earlier Career" `<details>` is keyboard-operable (it's native HTML, so it is by construction), and colour contrast on body text passes (the tokens were chosen to satisfy WCAG AA already, per the spec).

- [ ] **Step 7: Commit**

```bash
git add src/layouts/Layout.astro public/robots.txt public/sitemap.xml test/layout.test.ts
git commit -m "Add SEO tags, robots.txt, sitemap, and accessibility pass"
```

---

### Task 11: Deployment setup

**Files:**
- Create: `README.md` (replacing/updating the placeholder from Task 1's scaffold)
- Create: `wrangler.toml` (Cloudflare project config, so `RESEND_API_KEY`/`CONTACT_TO_EMAIL` are documented even though their actual values are set in the Cloudflare dashboard, not committed)

**Interfaces:**
- Consumes: nothing new — this task is about deploying what Tasks 1-10 built, and documenting the manual steps that only Gareth can perform (Cloudflare account actions, domain DNS).

- [ ] **Step 1: Write `wrangler.toml`**

```toml
name = "parris-me-uk"
compatibility_date = "2026-09-05"
pages_build_output_dir = "dist"
```

- [ ] **Step 2: Write the deployment README**

```markdown
# parris.me.uk

Personal site: Home, Resume, Blog, Contact. Built with Astro, deployed on Cloudflare Pages.

## Local development

    npm install
    npm run dev

## Testing

    npm run test

## Updating the Resume page

Resume content lives in `src/content/resume/index.md`, manually kept in sync with the
private vault's `CV.md` — not a live integration. When the CV changes, ask Claude to
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
   if wanted) — Cloudflare handles the DNS automatically since the domain's nameservers
   already point at Cloudflare.
4. Every push to `master` redeploys automatically; every PR gets its own preview URL.

## Sequencing note

Per the design spec: do the domain cutover (step 3 above) at the same time as
publishing the refreshed CV and LinkedIn profile, not before.
```

- [ ] **Step 3: Commit**

```bash
git add README.md wrangler.toml
git commit -m "Add deployment docs and Cloudflare Pages config"
```

- [ ] **Step 4: Manual step (Gareth, not the executing agent) — connect the Cloudflare Pages project**

Follow the README's "Deployment" section above in the Cloudflare dashboard. This cannot be automated from the CLI without Cloudflare account credentials.

---

## Self-Review Notes

- **Spec coverage:** every "Decisions Locked In" bullet in the spec has a corresponding task — Astro/Cloudflare (Task 1), design tokens (Task 2), content collections (Task 3), resume sync (Task 4-5), Home layout (Task 6), blog migration (Task 7-8), contact form technical note (Task 9), accessibility/SEO (Task 10), deployment sequencing (Task 11).
- **Placeholder scan:** no TBD/TODO markers; every step has real code or a real, runnable command.
- **Type consistency:** `resume` collection fields (`skillGroups`, `roles[].tier`, `roles[].titles`) are used identically in Task 3's schema, Task 4's frontmatter, and Task 5's `resume.astro`/`SkillTags`/`RoleEntry` consumers. `blog` collection fields (`category`, `heroImage`, `tags`, `pubDate`) match across Task 3's schema, Task 7's frontmatter, Task 6's Home teaser, and Task 8's post page.
- **Out of scope, deliberately not tasked:** restoring the RPi Pico post, live cross-repo CV sync, analytics — all per the spec's "Out of Scope" section.
