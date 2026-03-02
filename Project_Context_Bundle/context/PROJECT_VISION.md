# PROJECT VISION: NetListLab

---

## The One-Line Pitch
NetListLab is a project-first portfolio network where builders
from any field — electronics, software, mechanical, design, AI/ML,
robotics, research — can document, showcase, and share their
real-world projects in a structured, step-by-step format.

---

## The Problem Being Solved

Right now, a person who builds an electronics project,
a robotics prototype, or a hardware device has nowhere
professional to share it properly. Their options are:

- GitHub → Only accepts code. Has no place for circuit diagrams,
  bill of materials, component photos, wiring steps, or videos.
  A hardware project on GitHub is just a README with images dumped in.

- Instructables → General DIY platform. No professional credibility.
  No structured format. Not taken seriously by engineers or recruiters.

- Hackaday.io → Hacker-centric, blog-style. No portfolio angle.
  No networking. No professional profile layer.

- LinkedIn → Professional, but completely blind to technical
  hardware projects. You can write a post about your project
  but you cannot document it properly.

- Behance / Dribbble → Only for visual designers.
  No concept of electronics, code, or technical documentation.

The result: builders who create impressive real-world projects
have no dedicated, professional, structured place to show them.
NetListLab fills this gap.

---

## The Core Concept

NetListLab = LinkedIn (professional profiles + networking)
           + GitHub (project hosting + forking + starring)
           + Behance (rich, visual, structured project documentation)

But built exclusively for PROJECTS as the primary content unit.
Not posts. Not tweets. Not code files.
A PROJECT — documented completely, step by step.

---

## What Makes a "Project" on NetListLab

Every project posted on NetListLab is structured using
modular sections. The creator builds their project page
by choosing and ordering sections from this set:

- OVERVIEW: What the project does, what problem it solves
- COMPONENTS / BOM: Bill of Materials — a structured table listing
  every component used (name, quantity, part number, price, buy link)
- SCHEMATIC: Circuit diagram images, KiCad files, PCB layouts,
  hand-drawn sketches — zoomable
- BUILD STEPS: Step-by-step guide with images, text, and per-step
  comments from the community
- CODE: Embedded syntax-highlighted code blocks or GitHub repo link
- RESULT: Final working demo — images and/or video
- CHALLENGES: What went wrong, what was debugged, what was learned
  (this section creates massive learning value for the community)
- DOWNLOADS: Gerber files, CAD files, PDFs, datasheets, source code
- CUSTOM: Freeform section for anything that doesn't fit the above

This is not a blog. Each section type renders differently.
The BOM section renders as an interactive table with buy links.
The Code section renders as a Monaco editor (read-only, syntax-highlighted).
The Schematic section has zoom + pan on images.
The Build Steps section has a gallery per step.

---

## Who Uses NetListLab

The platform is open to EVERYONE — there are no restrictions
by field, branch, degree, or experience level.
However, there are three types of users:

1. CREATORS
   People who build things and want to document and share their work.
   ECE students, embedded developers, VLSI engineers, software devs,
   mechanical engineers, robotics enthusiasts, designers, researchers,
   hobbyists, makers of all kinds.

2. EXPLORERS
   People who browse, learn, and get inspired.
   Students looking for project ideas, developers looking to
   replicate a build, people searching for component usage examples.
   They can star projects, follow creators, fork projects,
   leave step-specific comments.

3. RECRUITERS / COMPANIES
   Hardware firms, PCB manufacturers, startups, research labs
   looking for talent. They search by skill tag and see a portfolio
   of real, documented work — not just a LinkedIn summary.

When someone creates a profile, they can optionally select:
- Field(s) of work (Electronics, Software, Mechanical, etc.)
- Skill tags (e.g., "ESP32", "VLSI", "React", "3D Printing")
- Current role (Student / Engineer / Researcher / Freelancer / Other)
- Institution or company

These are OPTIONAL and only used for discovery/filtering.
They do not gate any feature or restrict any action.

---

## The "Replicate This" Feature (Key Differentiator)
Every project has a "Replicate This" button.
When clicked, the platform generates a downloadable PDF containing:
- Project title, author, overview
- Full BOM table with quantities, prices, and buy links
- Step-by-step summary (each step: title + image + first 200 chars)
- Download links list
- Footer: "Built with NetListLab | netlistlab.app"

This single feature is designed to go viral —
students and makers will share these PDFs everywhere.
No login required to download.

---

## Social / Networking Layer
- Follow creators (see their new projects in your Feed)
- Star projects (saved to your Starred tab, increases project visibility)
- Fork projects (creates a copy in your drafts — like GitHub fork)
- Comment on projects — both general comments and
  step-specific comments (tied to a specific build step)
- "Collaboration Requests" — a creator can mark a project as
  "Looking for collaborators" with specific roles needed

---

## Discovery & Search
- Explore page: filterable by domain, difficulty, tags, sorted by
  trending / latest / most starred / most viewed
- Search: full-text search across project titles, taglines, tags,
  usernames
- Tag system: all lowercase hyphenated tags (e.g., "esp32",
  "vlsi", "react-native"), clicking any tag filters explore feed
- "Search by component": find all projects that used a specific
  component (e.g., show all projects using the ESP32)
- Weekly curated picks featured on landing page and explore

---

## Monetisation (Future — not MVP)
1. PCB manufacturer integrations: Partner with PCBWay, JLCPCB.
   Users click "Order PCB" from a project's Gerber file section.
   NetListLab earns a referral cut.
2. Component affiliate links: Every BOM item links to
   Amazon/Robu/Mouser with affiliate commission.
3. Premium recruiter profiles: Companies pay to search talent
   by skill.
4. Sponsored challenges: Hardware companies (TI, STMicro, etc.)
   sponsor design contests on the platform.
5. Pro creator tier: Private projects, analytics, custom URL.

---

## Tech Stack Decided
- Frontend: React + TypeScript + Tailwind CSS + shadcn/ui
- Backend: Node.js + Express.js
- Database: PostgreSQL via Prisma ORM
- Auth + Storage + Realtime: Supabase
- State management: Zustand
- Animations: Framer Motion
- Code editor in projects: Monaco Editor (read-only)
- PDF generation: Puppeteer (for "Replicate This")
- Hosting: Vercel (frontend) + Railway (backend)
- Mobile (future phase): React Native + Expo

---

## Platform Behaviour
- Desktop-first design. Base layout at 1280px+.
  Responsive downward to 768px (tablet) and 375px (mobile)
  as a graceful fallback — not the primary concern.
- Dark mode first. No light mode in MVP.
- All images lazy-loaded, converted to WebP on upload.
- Maximum file upload: 50MB per file, 200MB per project total.
- Accepted file types: jpg, png, gif, mp4, pdf, svg, .sch,
  .kicad, .step, .stl, .zip

---

## The 15 Pages of NetListLab

Public (no auth needed):
1. Landing Page                /
2. Explore Page                /explore
3. Project View Page           /project/:id
4. User Profile Page           /user/:username
5. Login Page                  /login
6. Register Page               /register
7. Onboarding Page             /onboarding

Protected (auth required):
8.  Personalised Feed          /feed
9.  Project Creation Wizard    /project/new
10. Project Edit Page          /project/:id/edit
11. Creator Dashboard          /dashboard
12. Notifications Page         /notifications
13. Profile Settings           /settings/profile
14. Account Settings           /settings/account

Utility:
15. 404 Page                   (catch-all)

---

## Build Strategy (Important)
The build follows a Frontend-First approach:
- Stage 1: Design system + brand decisions (no code)
- Stage 2: All 15 pages built with MOCKED data (no real API)
- Stage 3: Backend + database built
- Stage 4: Frontend connected to real API + polish + deploy

This means in Stage 2, all data comes from
a local `mockData/` folder — not from any API.
This is intentional and correct.
