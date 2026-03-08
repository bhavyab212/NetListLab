# NetListLab — Phase 3: Backend Instructions

> **Rule:** DO NOT touch anything in `src/` during this phase.
> **Rule:** All backend code lives exclusively in `server/` and `prisma/`.

---

## Architecture Overview

```
netlistlab1-main/
├── src/                    ← FRONTEND — DO NOT TOUCH
├── server/                 ← BACKEND (Express API, port 3001)
│   ├── index.ts            ← Entry point
│   ├── routes/             ← HTTP route handlers (thin layer)
│   ├── services/           ← Business logic + DB queries
│   ├── middleware/         ← auth.ts, validate.ts
│   ├── db/                 ← Prisma client singleton
│   └── utils/              ← Helpers + test script
├── prisma/
│   ├── schema.prisma       ← Database models
│   └── seed.ts             ← Seed data script
└── PHASE3_INSTRUCTIONS.md  ← YOU ARE HERE
```

---

## Environment Variables (already configured)

| Variable | Where used |
|---|---|
| `DATABASE_URL` | Prisma → connects to PostgreSQL |
| `SUPABASE_URL` | Supabase client init |
| `SUPABASE_ANON_KEY` | Supabase public client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side JWT validation (bypasses RLS) |
| `JWT_SECRET` | Custom token signing (if needed) |
| `PORT=3001` | Express server port |
| `FRONTEND_URL` | CORS allowlist |

Files: `server/.env` and `.env.local` (frontend only)

---

## Tech Stack — Backend

| Layer | Technology | Purpose |
|---|---|---|
| HTTP Server | Express.js | Routing, middleware |
| ORM | Prisma | Type-safe DB queries + migrations |
| Database | PostgreSQL | Main data store (via Supabase) |
| Auth | Supabase | JWT issuance + validation |
| Validation | Zod | Request body schema validation |
| File Upload | Multer + Supabase Storage | Images, files → public URLs |
| Security | Helmet + CORS + rate-limit | HTTP headers, origin control |

---

## Middleware Stack (order matters)

```typescript
app.use(helmet())                          // 1. Security headers
app.use(cors({ origin: FRONTEND_URL }))    // 2. CORS
app.use(express.json({ limit: '10mb' }))   // 3. Body parsing
app.use(rateLimit({ windowMs: 60000, max: 100 })) // 4. Rate limiting
```

---

## API Response Contract

**Every route must return this shape:**

```typescript
// Success
{ data: T, message?: string }

// Error
{ error: string, details?: Record<string, string> }
```

---

## Route → Service Rule

```
Route handler          →  responsible for: HTTP parsing, status codes, calling service
Service function       →  responsible for: Prisma queries, business logic, error throwing
```

**Never write a Prisma query directly in a route file.**

---

## Auth Flow

```
User logs in via Supabase → gets JWT access_token
Frontend sends: Authorization: Bearer <token>
server/middleware/auth.ts validates token via supabase.auth.getUser(token)
Attaches { id, email } to req.user
Route handler accesses req.user.id for ownership checks
```

---

## Tasks In Order

| # | Task | Description | Approval needed |
|---|---|---|---|
| 1 | Server Setup | Express app, middleware, folder structure | ✅ Yes |
| 2 | Prisma Schema | All 10 models + migration | ✅ Yes |
| 3 | Auth Middleware | JWT validation + Zod factory | ✅ Yes |
| 4 | API Routes | 11 route files + 11 service files | ✅ Yes |
| 5 | Seed Script | 5 users, 10 projects, BOM, comments | ✅ Yes |
| 6 | Verification | Test script for all endpoints | ✅ Yes |

---

## Database Models

| Model | Key fields |
|---|---|
| `User` | id, username, email, bio, skill_tags[], field_of_work[] |
| `Project` | id, author_id, title, status, tags[], star_count, view_count |
| `ProjectSection` | id, project_id, section_type, content_markdown, order_index |
| `ProjectMedia` | id, project_id, section_id, media_type, file_url |
| `BOMItem` | id, project_id, component_name, quantity, price, buy_link |
| `Star` | user_id + project_id (unique pair) |
| `Follow` | follower_id + following_id (unique pair) |
| `Comment` | user_id, project_id, section_id?, parent_comment_id? |
| `Notification` | recipient_id, actor_id, type, is_read |
| `Fork` | original_project_id + forked_project_id (both unique) |

---

## File Upload Spec

- **Max size:** 50MB per file
- **Allowed types:** jpg, png, gif, mp4, pdf, svg, .sch, .kicad, .step, .stl, .zip
- **Storage:** Supabase Storage buckets (`project-media`, `avatars`, `files`)
- **Returns:** Public URL to the uploaded file

---

## Running the Server

```bash
cd server
npm install
npm run dev      # ts-node-dev or tsx watch
```

Runs on: `http://localhost:3001`

---

## Seeding the Database

```bash
npx prisma db seed
```

---

## Testing All Routes

```bash
cd server
npx ts-node utils/test-routes.ts
```
