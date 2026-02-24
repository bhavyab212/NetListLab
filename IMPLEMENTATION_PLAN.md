# NetListLab — Implementation Plan

> This is the sequenced build plan. Each phase must be completed and
> verified before the next begins. Agent assignments are listed per task.

---

## PHASE 0 — Infrastructure (Day 1)
**Goal:** All config files, agents, and folder structure ready.
**Agent:** Manual / all agents read these files before doing anything.

```
netlistlab/
├── .agent/
│   └── rules/
│       └── AGENTS.md
├── skills/
│   └── SKILLS.md
├── docs/
│   ├── research/
│   ├── decisions/
│   ├── crawled-references/
│   └── design/
│       └── BRAND.md
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── server/
│   ├── routes/
│   ├── services/
│   ├── db/
│   ├── middleware/
│   └── utils/
├── src/
│   ├── app/
│   ├── components/
│   │   └── ui/
│   ├── hooks/
│   ├── stores/
│   ├── lib/
│   └── styles/
├── TODO.md
├── IMPLEMENTATION_PLAN.md
├── .env.example
└── README.md
```

**Done when:** All files exist, folder structure is created, Git is init'd.

---

## PHASE 1 — Database & Backend (Days 2–4)
**Goal:** Fully working API, all routes tested, seed data in DB.
**Agents:** @research-agent (schema review) → @backend-agent (build)
           → @crawler-agent (verify package versions)

**Sequence:**
1. @research-agent reviews schema design and approves
2. @crawler-agent verifies: Prisma version, Supabase SDK version,
   Express version — saves to docs/crawled-references/
3. @backend-agent writes schema.prisma
4. @backend-agent runs `npx prisma migrate dev --name init`
5. @backend-agent writes server setup + middleware
6. @backend-agent writes routes + services (in order):
   users → auth → projects → sections → media → bom →
   stars → follows → comments → notifications → forks
7. @backend-agent writes seed script + runs it
8. Verify: all endpoints return correct responses

**Done when:** `npm run seed` populates DB, all routes return 200/201
on valid requests and 400/401/404 on invalid.

---

## PHASE 2 — Design System (Days 3–4, parallel with Phase 1)
**Goal:** Complete component library and design tokens ready (Desktop-first).
**Agents:** @design-agent → @uiux-agent → @frontend-agent (consumes)

**Sequence:**
1. @design-agent publishes docs/design/BRAND.md
2. @uiux-agent writes tailwind.config.ts with full token set
3. @uiux-agent installs and configures shadcn/ui
4. @uiux-agent builds base UI components (Button, Input, Badge,
   Card, Avatar, Modal, Toast, Skeleton, Dropdown, Tabs)
5. @uiux-agent writes layout specs for all 14 pages (Desktop layouts)
6. @frontend-agent reviews components and signs off

**Done when:** All base components render correctly in Storybook
or on a /dev-components test route.

---

## PHASE 3 — Core Pages (Days 5–10)
**Goal:** All 14 pages built, connected to API, desktop-first responsive.
**Agents:** @uiux-agent (spec) → @frontend-agent (build)
           → @backend-agent (API fixes if needed)

**Build order (strict):**
1. Auth pages (Login + Register) — unblock all other pages
2. Landing page — first public impression
3. Explore page — discovery, most-visited page
4. Project View page — most complex, highest priority
5. User Profile page
6. Feed page
7. Project Creation Wizard
8. Dashboard
9. Notifications
10. Settings pages
11. 404 page

**Done when:** All pages render on desktop and laptop screens, connect to API,
show skeletons while loading, and show empty states when no data.

---

## PHASE 4 — Features (Days 9–12)
**Goal:** All interactive features work end-to-end.
**Agents:** @backend-agent (API) + @frontend-agent (UI)

**Build order:**
1. Star / unstar (simplest — good warm-up)
2. Follow / unfollow
3. Global search
4. Tag filter system
5. Fork project
6. Step-specific comments
7. Real-time notifications
8. "Replicate This" PDF generator
9. BOM CSV download
10. Browser push notifications

**Done when:** Each feature works on prod-like data without errors.

---

## PHASE 5 — Launch (Days 13–16)
**Goal:** Production deploy, performance and security verified.
**Agents:** All agents in review mode.

**Checklist:**
- Lighthouse score ≥ 90 on all core pages
- 0 critical security vulnerabilities
- All env variables set on Railway + Vercel
- Custom domain connected
- README.md complete with setup instructions
