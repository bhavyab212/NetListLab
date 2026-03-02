# NetListLab — Tier 2 Architecture & Features

This document outlines the design and implementation plan for the second-tier features of NetListLab, following the initial foundation.

---

## 1. "Replicate This" Service (PDF Generation)
**Goal:** Enable users to download a structured "Build Guide" PDF for any project.

### Architecture
- **Trigger:** Frontend button on `ProjectCard` or `ProjectView`.
- **Backend Service:** An isolated Node.js/Puppeteer service (`/api/generate-pdf/:id`).
- **Template:** A specialized Tailwind-styled HTML template designed for A4 printing.
- **Content:** 
  - Project Header (Title, Author, QR code to original page).
  - Structured BOM (Table with part numbers and buy links).
  - Step-by-Step Guide (Summarized text + key images).
  - License information.

---

## 2. Social & Networking Graph
**Goal:** Build a community around projects using established social patterns.

### Data Model (Supabase/PostgreSQL)
- **Stars:** `user_id` <-> `project_id` (Unique pair). Increases project "Trending" score.
- **Follows:** `follower_id` <-> `following_id`. Populates the `/feed` page.
- **Forks:** `user_id` <-> `original_project_id` -> creates `new_project_id`.
  - The `projects` table includes `forked_from_id` and `root_fork_id` to track the lineage of a build.

### Real-time Implementation
- Use **Supabase Realtime** to sync Star counts and New Comments across all clients viewing the same project.

---

## 3. Interactive Component BOM (Octopart Integration)
**Goal:** Turn static BOMs into live procurement tools.

### Features
- **Live Pricing:** Fetch current market prices for components listed in the BOM.
- **Stock Alerts:** Show "In Stock" indicators for major distributors (Mouser, Digi-Key).
- **Affiliate Layer:** Automatically append affiliate tags to buy links for platform sustainability.

---

## 4. AI-Assisted Documentation (Swarm Integration)
**Goal:** Help builders document their work faster using the agents found in `src/agents`.

### Workflow
1. **The Researcher Agent:** Scrapes datasheets for components added to the BOM to auto-fill technical specs.
2. **The Coder Agent:** Analyzes uploaded `.ino` or `.py` files to generate "Code Overview" summaries.
3. **The Reviewer Agent:** Suggests improvements to "Build Steps" for clarity and safety (e.g., adding "Wear safety glasses" if high voltage is detected).

---

## 5. Browser Sandbox Execution
**Goal:** Run project code directly in the browser.

### Implementation
- For Python: Integrate **Pyodide** or **WebAssembly** runtimes.
- For Hardware Simulation: Integrate **Wokwi** or **Falstad** iframes for interactive circuit testing.
