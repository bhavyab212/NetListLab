# Project Context Bundle

This folder contains all the foundational context, documentation, skills, and agent configurations for the `NetListLab` project. These files represent the complete "brain" of the project and everything taught to or produced by the AI agents so far.

If you are starting a new project and want to carry over the exact same AI settings, rules, UI/UX specs, and workflows, you can copy this folder to the new project.

## 📂 Folder Structure

### 1️⃣ `/context`
Contains everything related to the project specifications, rules, design system, and roadmap.
- `docs/`: Holds UI/UX specs (brand, colors, component rules), user flows, open specs, PRDs, database schemas, etc.
- `.context/`: Any specific AI-related system contexts.
- `*.md`: All top-level markdown files such as `PROJECT_VISION.md`, `IMPLEMENTATION_PLAN.md`, `CONTEXT.md`, `TODO.md`, `mission.md`.
- `.cursorrules`: The custom AI rules file controlling how coding agents operate.

### 2️⃣ `/skills`
Contains reusable markdown instructions ("skills") that teach the AI how to do specific tasks gracefully. Examples typically include:
- Generating UI components using the design system.
- Refactoring files safely.
- Implementing test-driven code.

### 3️⃣ `/agents`
Contains rules and entry scripts for autonomous agents specifically tuned for this project setup.
- `.agent/`: Internal agent config folder.
- `AGENTS.md`: Defines roles, responsibilities, and system prompts for the different AI agents you employ (e.g. Developer, Code Reviewer, Architect).
- `agent.py`: Script relating to the startup or orchestration of external AI runner frameworks if applicable.

---
**How to reuse this in a new project:**

1. Drag and drop the `docs/` and top-level `.md` files to the root of your new project.
2. Ensure you drop the `.cursorrules` in the root of the new project to instantly give any new AI the same strict rules.
3. Bring over the `.agent` and `skills` folder if using a local advanced AI agent system that supports these directories.
