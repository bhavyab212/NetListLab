# NetListLab

> A Hackaday.io / Hackster.io–style platform for builders to document,
> share, and replicate hardware + software projects. Optimized for
> high-productivity desktop experiences.

---

## Project Structure

```
├── .agent/rules/AGENTS.md    — Multi-agent system definition
├── skills/SKILLS.md           — Active skills registry
├── docs/                      — Research, decisions, design specs
├── prisma/                    — Database schema & migrations
├── server/                    — Express.js backend API
├── src/                       — Next.js frontend (React + Tailwind)
├── TODO.md                    — Master task tracker
├── IMPLEMENTATION_PLAN.md     — Sequenced build plan
└── .env.example               — Environment variable template
```

## Getting Started

```bash
# 1. Clone the repo
git clone <repo-url> && cd netlistlab

# 2. Copy environment variables
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Set up database
npx prisma migrate dev

# 5. Seed sample data
npm run seed

# 6. Start development server
npm run dev
```

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js, React 18, TypeScript       |
| Styling    | Tailwind CSS, shadcn/ui             |
| Animation  | Framer Motion                       |
| Backend    | Express.js, Node.js                 |
| Database   | PostgreSQL + Prisma ORM             |
| Auth       | Supabase Auth (email + OAuth)       |
| Storage    | Supabase Storage                    |
| Realtime   | Supabase Realtime                   |
| Testing    | Jest, React Testing Library         |

## Phase Status

See [TODO.md](./TODO.md) for the live task tracker and
[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the build sequence.

## License

MIT
