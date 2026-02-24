# NetListLab — Master To-Do List

> Status legend: ⬜ Not started | 🔄 In progress | ✅ Done | 🚫 Blocked

---

## PHASE 0 — Infrastructure Setup
- ✅ Create skills/SKILLS.md
- ✅ Create .agent/rules/AGENTS.md
- ✅ Create TODO.md
- ✅ Create IMPLEMENTATION_PLAN.md
- ⬜ Initialize Git repository
- ✅ Create .gitignore (node_modules, .env, .env.local, dist, .next)
- ✅ Create root folder structure

## PHASE 1 — Database & Backend Foundation
- ⬜ Initialize Prisma with PostgreSQL
- ⬜ Write all Prisma models (Users, UserProfile, Projects,
     ProjectSections, ProjectMedia, BOMItems, Stars, Follows,
     Comments, Notifications, Forks)
- ⬜ Run initial migration
- ⬜ Set up Supabase project (Auth + Storage buckets)
- ⬜ Configure storage buckets: project-media, avatars, files
- ⬜ Write Prisma seed script with 5 test users + 10 sample projects
- ⬜ Set up Express.js server with middleware stack
- ⬜ Implement Supabase JWT validation middleware
- ⬜ Implement rate limiting middleware
- ⬜ Implement file upload middleware (multer + Supabase Storage)
- ⬜ Write all API routes: /users, /projects, /sections, /media,
     /bom, /stars, /follows, /comments, /notifications, /forks
- ⬜ Write Zod validation schemas for all routes
- ⬜ Write service layer for all entities
- ⬜ Test all API endpoints with sample requests

## PHASE 2 — Design System
- ⬜ @design-agent: Publish BRAND.md
- ⬜ @design-agent: Define domain badge color map
- ⬜ @uiux-agent: Set up Tailwind config with design tokens
- ⬜ @uiux-agent: Set up shadcn/ui with custom theme
- ⬜ @uiux-agent: Build base components: Button, Input, Badge,
     Card, Avatar, Modal, Toast, Skeleton, Dropdown
- ⬜ @uiux-agent: Define all skeleton loader designs
- ⬜ @uiux-agent: Define all empty state designs

## PHASE 3 — Core Pages
- ⬜ Landing page (/)
- ⬜ Login page (/login)
- ⬜ Register page (/register)
- ⬜ Explore page (/explore)
- ⬜ Project View page (/project/:id) ← PRIORITY (Desktop layout)
- ⬜ User Profile page (/user/:username)
- ⬜ Feed page (/feed)
- ⬜ Dashboard (/dashboard)
- ⬜ Project Creation Wizard (/project/new)
- ⬜ Project Edit page (/project/:id/edit)
- ⬜ Notifications page (/notifications)
- ⬜ Settings — Profile (/settings/profile)
- ⬜ Settings — Account (/settings/account)
- ⬜ 404 page

## PHASE 4 — Features
- ⬜ Star / unstar project (optimistic UI)
- ⬜ Follow / unfollow user (optimistic UI)
- ⬜ Fork project (full copy to user's drafts)
- ⬜ Global search (projects + users, debounced)
- ⬜ Tag filtering on explore page
- ⬜ "Replicate This" PDF generator
- ⬜ BOM CSV download
- ⬜ Step-specific comments
- ⬜ Real-time notifications (Supabase Realtime)
- ⬜ Browser push notification permission flow

## PHASE 5 — Polish & Launch Prep
- ⬜ @uiux-agent: Full responsive audit (1024px, 1280px, 1440px, 1920px)
- ⬜ Optimize for large-screen data visualization
- ⬜ Image lazy loading + WebP conversion on upload
- ⬜ Infinite scroll with react-window virtualization
- ⬜ SEO: OG tags, Twitter cards, sitemap, robots.txt
- ⬜ Performance audit (Lighthouse score target: 90+)
- ⬜ Security audit (@security-hardening skill)
- ⬜ Write Jest tests for all API routes
- ⬜ Write React Testing Library tests for critical components
- ⬜ Deploy backend to Railway
- ⬜ Deploy frontend to Vercel
- ⬜ Configure environment variables on both platforms
- ⬜ Smoke test entire app on production URL
