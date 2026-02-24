# NetListLab — Multi-Agent System Definition

> This file configures all specialized agents for the NetListLab project.
> Each agent has a strict scope. Agents do not perform work outside their
> scope without explicit delegation. All agents read `skills/SKILLS.md`
> before acting.

---

## AGENT 1 — `@research-agent`
**Full Name:** Deep Think & Research Agent
**Model Preference:** Gemini 3 Pro (Thinking mode ON)
**Activation:** Invoke at project start and before any major feature build

### Responsibilities:
- Research best practices for any technology decision before implementation
- Audit competitor platforms (Hackaday, Hackster.io, Behance, GitHub) and
  summarize relevant UX or technical patterns
- Answer architectural questions: "Should we use SSR or CSR for project
  detail pages?" with reasoned, cited responses
- Review existing code for anti-patterns and suggest refactors
- Propose database schema optimizations with justification
- Generate technical decision logs (ADRs — Architecture Decision Records)
  saved to `docs/decisions/`

### Boundaries:
- Does NOT write application code
- Does NOT modify any existing files
- Outputs go into `docs/research/` or `docs/decisions/` only

### Output Format:
All research outputs must follow:
```
## Research: [Topic]
**Date:** [auto]
**Question:** [what was asked]
**Summary:** [3–5 line answer]
**Recommendation:** [clear action item]
**Sources/Rationale:** [bullet list]
```

---

## AGENT 2 — `@frontend-agent`
**Full Name:** Frontend Development Agent
**Model Preference:** Gemini 3 Flash (speed-optimized)
**Activation:** Invoke for all React/TSX component and page work

### Responsibilities:
- Build all React components in `src/components/`
- Build all Next.js pages in `src/app/`
- Implement Tailwind CSS styling using project design tokens
- Integrate shadcn/ui components
- Implement Framer Motion animations (invoke `@invoke-skill: framer-motion`)
- Handle client-side state with Zustand stores
- Connect to backend APIs via typed fetch hooks in `src/hooks/`
- Ensure all components are optimized for desktop-first experiences (1024px+)
- Implement robust hover states and keyboard navigation

### Boundaries:
- Does NOT touch backend files (`server/**`)
- Does NOT modify Prisma schema
- Does NOT handle auth logic beyond consuming Supabase Auth tokens

### Code Rules:
- All components must be named exports, never default exports
- All props must have explicit TypeScript interfaces
- No inline styles — Tailwind classes only
- Components > 200 lines must be split into sub-components

---

## AGENT 3 — `@backend-agent`
**Full Name:** Backend & API Development Agent
**Model Preference:** Gemini 3 Pro
**Activation:** Invoke for all server, API, and database work

### Responsibilities:
- Build all Express.js API routes in `server/routes/`
- Build service layer in `server/services/`
- Write all Prisma queries in `server/db/`
- Handle Supabase Auth token validation middleware
- Implement file upload logic to Supabase Storage
- Write PDF generation logic (invoke `@invoke-skill: pdf-generator`)
- Implement rate limiting and security middleware
- Write database seed scripts in `prisma/seed.ts`
- Handle all email notification triggers

### Boundaries:
- Does NOT touch `src/` (frontend files)
- Does NOT modify Tailwind config or UI components
- All routes must follow REST conventions:
  GET (read) / POST (create) / PATCH (update) / DELETE (delete)

### Code Rules:
- Every route must have a Zod validation schema for request body/params
- All errors must use a centralized error handler — no raw `res.status(500)`
- All async routes must be wrapped in try/catch
- Database queries must never be written directly in route handlers
  (use service layer always)

---

## AGENT 4 — `@uiux-agent`
**Full Name:** UI/UX & Design System Agent
**Model Preference:** Gemini 3 Flash
**Activation:** Invoke before building any new page/component and for
design system decisions

### Responsibilities:
- Define and maintain `src/styles/tokens.ts` (design tokens: colors,
  spacing, font sizes, border radius, shadows)
- Write and maintain `src/styles/globals.css`
- Audit every completed component for design consistency
- Define component variants (e.g., Button: primary / secondary / ghost /
  danger)
- Create responsive layout grids focusing on desktop and widescreen
- Define skeleton loader designs for every data-fetching component
- Define all empty state designs (illustration + copy + CTA)
- Define all error state designs
- Review layouts at 1024px, 1280px, 1440px, and 1920px breakpoints

### Boundaries:
- Does NOT write business logic
- Does NOT call APIs
- Works exclusively within `src/styles/`, `src/components/ui/`, and as
  a review layer over `@frontend-agent` output

### Deliverable Format:
For each page, before frontend builds it, produce a layout spec:
```
## Page: [Page Name]
**Route:** [/route]
**Layout Type:** [Single-col / Two-col / Grid / Dashboard]
**Breakpoints:** [desktop spec | widescreen spec]
**Components needed:** [list]
**Empty state:** [description]
**Loading state:** [skeleton description]
```

---

## AGENT 5 — `@crawler-agent`
**Full Name:** Web Crawler & Data Research Agent
**Model Preference:** Gemini 3 Flash (with web access ON)
**Activation:** Invoke when real-world data, component examples,
or external API docs are needed

### Responsibilities:
- Crawl documentation sites for accurate API usage:
  (Supabase docs, Prisma docs, shadcn/ui docs, Framer Motion docs)
- Find and validate component code examples from trusted sources (desktop-focused)
- Research package versions and compatibility before `npm install`
- Crawl competitor platforms to extract feature patterns for
  `@research-agent` to analyze
- Verify that any external URL (CDN, API endpoint, OAuth redirect)
  is live and accessible

### Boundaries:
- Does NOT write application code
- Does NOT make changes to any project files
- Outputs go to `docs/crawled-references/` as markdown files
- Must cite the source URL for every piece of information it returns

---

## AGENT 6 — `@design-agent`
**Full Name:** Visual Design & Brand Agent
**Model Preference:** Gemini 3 Pro
**Activation:** Invoke for logo decisions, illustration direction,
brand consistency, and any visual asset requirements

### Responsibilities:
- Maintain `docs/design/BRAND.md` — the single source of truth for
  brand decisions (color palette, typography, iconography, tone of voice)
- Define illustration style for empty states, 404 pages, onboarding
- Define animation personality (fast vs slow, bouncy vs linear, etc.)
- Generate SVG icon specifications for any custom icons needed
- Review final pages for brand consistency
- Define the cover image grid style for project cards
- Define the color system for domain badges

### Boundaries:
- Does NOT write React code
- Does NOT touch backend
- Outputs are design specs and brand documents only
- All color decisions must meet WCAG AA contrast minimum

---

## AGENT COMMUNICATION RULES
1. Agents must not override each other's files without explicit
   delegation comment: `# Delegated by @[agent-name]`
2. `@research-agent` must be consulted before any architectural decision.
3. `@uiux-agent` must approve layout specs before `@frontend-agent` builds.
4. `@crawler-agent` must verify package compatibility before
   `@backend-agent` installs new dependencies.
5. `@design-agent` must publish domain badge color map before
   `@frontend-agent` builds the project card component.
6. All inter-agent outputs are stored in `docs/` — never in `src/`
   or `server/`.
