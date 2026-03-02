# NetListLab — Active Skills Registry

> This file indexes all active skill modules loaded into this project's
> agent environment. Each skill is a scoped capability block that agents
> can invoke. Sourced from skills.sh and extended for this project.

---

## Core Skills

### 01. `react-expert`
- Scope: Frontend
- Capabilities: Component architecture, hooks, context API, performance
  optimization, code splitting, lazy loading, React 18 concurrent features
- File patterns: `src/components/**`, `src/pages/**`, `src/hooks/**`
- Always active: YES

### 02. `typescript-strict`
- Scope: Full-stack
- Capabilities: Strict type enforcement, generic patterns, discriminated
  unions, utility types, type-safe API contracts, Zod schema validation
- File patterns: `**/*.ts`, `**/*.tsx`
- Always active: YES

### 03. `tailwind-ui`
- Scope: Frontend / Styling
- Capabilities: Responsive design systems, dark-mode utility classes,
  shadcn/ui component usage, custom Tailwind config, design tokens,
  spacing and typography scale enforcement
- File patterns: `src/components/**`, `src/styles/**`, `tailwind.config.ts`
- Always active: YES

### 04. `nodejs-api`
- Scope: Backend
- Capabilities: Express.js REST API design, middleware chains, error
  handling, rate limiting, JWT validation, request validation with Zod,
  async/await patterns, controller-service-repository architecture
- File patterns: `server/**`, `api/**`
- Always active: YES

### 05. `prisma-postgres`
- Scope: Database
- Capabilities: Prisma schema design, migrations, relations, transactions,
  query optimization, seed scripts, type-safe DB queries
- File patterns: `prisma/**`, `server/db/**`
- Always active: YES

### 06. `supabase-integration`
- Scope: Auth + Storage + Realtime
- Capabilities: Supabase Auth (email + OAuth), storage bucket operations,
  row-level security policies, Supabase Realtime subscriptions,
  service role vs anon key usage
- File patterns: `src/lib/supabase*`, `server/auth/**`
- Always active: YES

### 07. `framer-motion`
- Scope: Frontend / Animation
- Capabilities: Page transitions, micro-interactions, layout animations,
  gesture handling, AnimatePresence usage, performance-safe animations
- File patterns: `src/components/**`
- On-demand: YES (invoked when animation work is needed)

### 08. `pdf-generator`
- Scope: Backend / Utility
- Capabilities: Puppeteer or pdfkit PDF generation, HTML-to-PDF rendering,
  template-based document generation, file streaming, download triggers
- File patterns: `server/utils/pdf*`
- On-demand: YES (invoked for "Replicate This" PDF feature)

### 09. `testing-jest`
- Scope: Full-stack
- Capabilities: Jest unit tests, React Testing Library, API integration
  tests, test coverage reporting, mock strategies, snapshot testing
- File patterns: `**/*.test.ts`, `**/*.test.tsx`, `**/*.spec.ts`
- On-demand: YES (invoked after each feature is complete)

### 10. `seo-meta`
- Scope: Frontend / SEO
- Capabilities: Open Graph tags, Twitter cards, dynamic meta per page,
  sitemap generation, robots.txt, structured data (JSON-LD)
- File patterns: `src/app/layout.tsx`, `src/app/**/page.tsx`
- On-demand: YES (invoked in final polish phase)

### 11. `security-hardening`
- Scope: Full-stack
- Capabilities: Input sanitization, XSS prevention, CSRF protection,
  file upload validation, rate limiting, SQL injection prevention via
  Prisma, secret management best practices
- File patterns: `server/**`, `src/lib/**`
- Always active: YES

---

## Skill Invocation Rules
- Always-active skills are applied automatically on every agent action.
- On-demand skills must be explicitly triggered by the relevant agent
  using the syntax: `@invoke-skill: [skill-name]`
- No skill overrides another. Conflicts resolved by specificity
  (file-pattern match > always-active).
