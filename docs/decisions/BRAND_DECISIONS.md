# NetListLab — Brand Decision Log

> @research-agent summary of all 28 design interview answers.
> Date: 2026-02-25
> Status: APPROVED by project owner

---

## BLOCK A — Brand Personality

### Q1. Visual Personality
**Decision:** Engineer's Workshop + Creative Studio accents
**Meaning:** Clean, precise, utilitarian base UI (structured layouts, clear hierarchy) with expressive energy through vibrant accents, subtle gradients, and rich visual moments on key surfaces.

### Q2. Brand Voice / Tone
**Decision:** Context-aware dynamic tone
- Technical & Confident → functional areas (project view, BOM, dashboard, settings)
- Warm & Encouraging → onboarding, empty states, error recovery
- Bold & Direct → landing page, CTAs, hero text, buttons, notifications

### Q3. Primary Persona
**Decision:** College Builder (primary) + Passionate Maker (secondary)
- 2nd–4th year engineering student building projects for learning/portfolios
- Hobbyist/tinkerer who builds and wants to share
- UI should make projects look impressive and portfolio-worthy

---

## BLOCK B — Color System

### Q4. Background Color Philosophy
**Decision:** Dual-mode support

Dark mode (default): D3+D4 blend with subtle warm yellowish tint
- `bg-base`: `#141310`
- `bg-surface`: `#1A1916`
- `bg-elevated`: `#211F1B`

Light mode: L2 off-white with subtle saturated blue tint
- `bg-base`: `#F5F6FB`
- `bg-surface`: `#EEEEF6`
- `bg-elevated`: `#E8E9F2`

### Q5. Primary Accent Color
**Decision:** Multi-accent system
- Primary: Electric Cyan `#00C8F0`
- Warm Accent: Solder Gold `#F5A623`
- Energy Pulse: Neon Green `#00E87A`

### Q6. Secondary Accent Color
**Decision:** Dual secondary
- Gradient Depth: Electric Blue `#3B6EF0`
- Danger/Drama: Hot Coral `#F43F5E`

### Q7. Surface & Card Treatment
**Decision:** Neumorphism + slight liquid morphism
- Dual shadow system (warm highlight top-left, deep shadow bottom-right)
- Liquid morphism (organic SVG blobs) used sparingly on hero/featured areas

### Q8. Domain Badge Color Map
**Decision:** Vibrant Solid Fill + Glowing Outlined (LED-on-circuit-board feel)
- Electronics: `#00C8F0` (Cyan)
- Software: `#3B6EF0` (Blue)
- Mechanical: `#F5A623` (Gold)
- Design: `#F43F5E` (Coral)
- AI/ML: `#8B5CF6` (Violet)
- Robotics: `#00E87A` (Green)
- Research: `#94A3B8` (Cool Gray)

---

## BLOCK C — Typography

### Q9. Heading Font
**Decision:** Space Grotesk
- Geometric, technical edge, quirky letterforms, modern

### Q10. Body Font
**Decision:** Dual context body fonts
- Inter → general UI (descriptions, comments, labels)
- Geist → technical/data contexts (BOM tables, metadata, stats)

### Q11. Code Font
**Decision:** JetBrains Mono
- Best character differentiation, full ligature support

---

## BLOCK D — Layout & Spacing

### Q12. Layout Density
**Decision:** Balanced
- Standard 16px/24px padding, 3–4 cards per row

### Q13. Desktop Grid System
**Decision:** Mixed per page type
- Landing hero: Full width (100vw)
- Explore grid: 1440px
- Project View: 1200px
- User Profile: 1200px
- Feed: 1200px
- Dashboard: 1440px
- Settings: 900px
- Auth pages: 480px card

### Q14. Corner Radius
**Decision:** Mixed by element type
- Code blocks, BOM tables: 4px
- Inputs, small buttons: 8px
- Primary CTA buttons: 10px
- Project cards, modals: 12px
- Badges, tags: 9999px (pill)
- Avatars: 8px (rounded square)

---

## BLOCK E — Navigation

### Q15. Top Navigation
**Decision:** Floating translucent bar + contextual sidebar
- Floating bar with backdrop-blur on all pages
- Collapsible sidebar on authenticated app pages (Dashboard, Settings, Editor)
- Public pages = top bar only (showcase mode)
- Logged-in tool pages = top bar + sidebar (workspace mode)

### Q16. Secondary Navigation
**Decision:** Mixed
- Underlined horizontal tabs (Profile, Settings)
- Sticky scrollspy sidebar (Project View page)

---

## BLOCK F — Key Components

### Q17. Project Card
**Decision:** Interactive two-sided flip card
- Front: image carousel + title + domain badge + difficulty + key components + author + stats + "Summary" button
- Back: project overview + complexity + top components + "View Project" CTA
- Flip animation with Framer Motion rotateY

### Q18. Button Style
**Decision:** Gradient + Neumorphic + Glow, layered
- Primary: Cyan→Blue gradient, neumorphic extrusion, press pushes in
- Secondary: Outlined with Cyan border, glow on hover
- "Replicate This": Gold→Coral gradient
- Destructive: Solid Coral, neumorphic

### Q19. Input Fields
**Decision:** Neumorphic inset + bordered focus
- Recessed inner shadow at rest
- Cyan 1px border + glow on focus

### Q20. Profile Avatars
**Decision:** Rounded square (8px radius) + neumorphic shadow

### Q21. Tags / Badge Pills
**Decision:** Filled soft pills with icons, color-coded by category
- Skill tags inherit parent domain color + icon
- Difficulty tags: Green→Yellow→Coral scale
- Component tags: neutral gray + chip icon

---

## BLOCK G — Motion & Interaction

### Q22. Animation Personality
**Decision:** Mixed by context
- UI interactions: 150–250ms, ease-out (snappy)
- Neumorphic elements: 300–450ms, spring physics (springy)
- Landing/Onboarding: 500–700ms, ease-in-out (cinematic)
- Liquid morphism blobs: 8–15s, linear (ambient)

### Q23. Hover & Focus States
**Decision:** Full layered system
- Project cards: cursor spotlight + lift + edge glow + shadow deepen
- Buttons: gradient brighten + glow + depth push
- Tags: glow pulse on domain color
- Links: cyan shift + underline animation
- Avatars: depth push + ring glow

---

## BLOCK H — Landing Page

### Q24. Hero Section Layout
**Decision:** Scroll-driven fragment assembly animation
- Stage 1 (load): fragments scattered across viewport
- Stage 2 (scroll 0–60%): fragments assemble into NetListLab logo
- Stage 3 (scroll 60–100%): logo settles, tagline + CTA + explore preview

### Q25. Hero Content
**Decision:** Two-part reveal
- Headline: "Every Build Deserves a Stage"
- Tagline: "Your workshop finally has a home."
- CTA: "Start Building →"

### Q26. Social Proof
**Decision:** Three-section combination
1. Stats counter bar (animated on scroll)
2. Featured project cards (interactive flip cards)
3. How It Works (3-step visual)

---

## BLOCK I — Inspiration & Anti-patterns

### Q27. Design Inspiration
- LinkedIn: instant navigation clarity, familiar social patterns
- Discord + Instagram: social warmth in technical shell, real-time feel
- Notion: structured hierarchy, everything organized
- HiAnime-style: zero learning curve, instant content
- Anker Games: knows its audience, creative yet easy, 10/10 UX
- GetIntoPC: clean and simple, no noise
- Emergent: modern with real-time updates

### Q28. DO NOT Want
- AI-generated aesthetic (generic gradients, blobs, Midjourney feel)
- Generic purple-heavy palettes (the "AI startup" color)
- Government / institutional site feel
- Enterprise / corporate soullessness (Jira, Salesforce)
- Flat design with no depth
- Cluttered layouts
- Generic stock illustrations (tiny-head vector people)

**Core Design Law:** Zero-friction usability. User lands and immediately knows what to do.
