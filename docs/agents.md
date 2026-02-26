# Agent Guidelines & Prompts

*This document outlines guidelines and context for AI agents working on the NetListLab codebase.*

## Core Directives for Agents
1. **Aesthetic Excellence is Mandatory:** Do not implement "MVP" or generic placeholder designs. If a component is requested, it must be fully styled, responsive, and aligned with our target "Premium Glassmorphism" aesthetic.
2. **Dual-Theme Support:** Every new component or page MUST natively support both Light and Dark modes via our predefined CSS variables (`var(--bg-base)`, `var(--text-primary)`, etc.). Never use hardcoded hex arrays in components (except for specific glowing accents that don't change between themes).
3. **Interactive Polish:** Use Framer Motion (`<motion.div>`) for all state changes, including appearance, hover, tap, and route transitions. Prioritize snappy spring physics over linear easing.
4. **Documentation Sync:** When fundamentally changing the design system, update relevant `.md` files in the `docs/` folder (like `BRAND.md` or `vision.md`) to reflect the new state.

## Tech Stack Context
* **Framework:** React + Vite + TypeScript
* **Styling:** Vanilla CSS + CSS Custom Properties (Theme Variables) + inline styles where dynamic.
* **State Management:** Zustand (`stores/authStore.ts`, `stores/themeStore.ts`).
* **Icons:** `lucide-react`
* **Animations:** `framer-motion`
