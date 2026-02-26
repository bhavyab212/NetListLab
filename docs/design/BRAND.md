# NetListLab — Brand Guide

> Single source of truth for all visual and brand decisions.
> Created by @design-agent | Approved: 2026-02-25

---

## Brand Name & Tagline

**Name:** NetListLab
**Headline:** Every Build Deserves a Stage
**Tagline:** Your workshop finally has a home.
**CTA:** Start Building →

---

## Visual Personality Statement

NetListLab is a **precision workshop with creative soul.** The interface feels
clean, structured, and technically credible — like a well-organized engineering
workbench — but expresses energy through vibrant accent colors, glowing hover
states, and the physical depth of **Premium Glassmorphism**. This aesthetic pairs
crisp, glassy hairlines and diffuse ambient shadows with deep translucent surfaces
to make a student's ESP32 project look like a million-dollar product. Zero-friction
usability is the #1 design law: every user should know where to go and what to do within 3 seconds.

---

## Color System

### Dark Mode (Default)

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-base` | `#020617` (Deep Obsidian) | Primary page background |
| `bg-surface` | `rgba(30, 41, 59, 0.5)` + Blur | Cards, panels (Glassmorphic) |
| `bg-elevated` | `rgba(15, 23, 42, 0.6)` + Blur | Modals, dropdowns, popovers |
| `text-primary` | `#F8FAFC` | Primary text (headings, body) |
| `text-secondary` | `#94A3B8` | Secondary text (labels, metadata) |
| `text-muted` | `#475569` | Muted text (placeholders, disabled) |
| `border-default` | `rgba(255,255,255,0.08)` | Default borders |
| `border-focus` | `rgba(0, 200, 240, 0.5)` | Focus ring color |

### Light Mode

| Token | Hex/RGBA | Usage |
|-------|-----|-------|
| `bg-base` | `#F8FAFC` | Primary page background |
| `bg-surface` | `#FFFFFF` | Cards, panels (Opaque) |
| `bg-elevated` | `#E8E9F2` | Modals, dropdowns, popovers |
| `text-primary` | `#141310` | Primary text |
| `text-secondary` | `#5C5A55` | Secondary text |
| `text-muted` | `#9C9A95` | Muted text |
| `border-default` | `#D5D5E0` | Default borders |
| `border-focus` | `#00A8D0` | Focus ring (slightly darker for light bg) |

### Accent Colors

| Token | Hex | Role |
|-------|-----|------|
| `accent-primary` | `#00C8F0` | Primary action — buttons, links, active states |
| `accent-primary-hover` | `#00B0D8` | Primary hover state |
| `accent-blue` | `#3B6EF0` | Gradient depth — cyan→blue transitions |
| `accent-gold` | `#F5A623` | Warm accent — starred items, BOM, "Replicate This" |
| `accent-gold-hover` | `#E09510` | Gold hover state |
| `accent-green` | `#00E87A` | Success, live indicators, energy pulse |
| `accent-coral` | `#F43F5E` | Danger, errors, drama accent |
| `accent-coral-hover` | `#E0354F` | Coral hover state |
| `accent-violet` | `#8B5CF6` | AI/ML domain only |

### Premium Diffuse Shadows (Dark Mode)

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-neu-raised` | `0 20px 40px -10px rgba(0,0,0,0.5)` | Floating glass panels, buttons |
| `shadow-neu-inset` | `inset 0 0 0 1px rgba(255,255,255,0.05)` | Input fields, recessed areas |
| `shadow-neu-pressed` | `inset 0 2px 4px rgba(0,0,0,0.5)` | Button pressed state |

### Premium Diffuse Shadows (Light Mode)

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-neu-raised` | `0 20px 40px -10px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)` | Pure white cards, buttons |
| `shadow-neu-inset` | `inset 0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | Input fields |
| `shadow-neu-pressed` | `inset 0 2px 4px rgba(0,0,0,0.1)` | Button pressed state |

---

## Typography Scale

### Font Families
| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Headings | Space Grotesk | 500, 600, 700 | Page titles, project names, hero |
| Body | Inter | 400, 500, 600 | Descriptions, comments, general UI |
| Technical | Geist | 400, 500 | BOM tables, metadata, dashboard stats |
| Code | JetBrains Mono | 400, 500 | Monaco editor, inline code blocks |

### Size Scale
| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-hero` | 56px / 3.5rem | 1.1 | Landing page hero headline |
| `text-h1` | 36px / 2.25rem | 1.2 | Page titles |
| `text-h2` | 28px / 1.75rem | 1.25 | Section headings |
| `text-h3` | 22px / 1.375rem | 1.3 | Card titles, subsection headings |
| `text-h4` | 18px / 1.125rem | 1.35 | Small headings, labels |
| `text-body` | 16px / 1rem | 1.6 | Primary body text |
| `text-sm` | 14px / 0.875rem | 1.5 | Secondary text, metadata |
| `text-xs` | 12px / 0.75rem | 1.5 | Captions, badges, timestamps |
| `text-code` | 14px / 0.875rem | 1.6 | Code blocks |

---

## Domain Badge Color Map

| Domain | Fill | Glow (rgba) | Emoji |
|--------|------|-------------|-------|
| Electronics | `#00C8F0` | `rgba(0,200,240,0.35)` | ⚡ |
| Software | `#3B6EF0` | `rgba(59,110,240,0.35)` | 💻 |
| Mechanical | `#F5A623` | `rgba(245,166,35,0.35)` | ⚙️ |
| Design | `#F43F5E` | `rgba(244,63,94,0.35)` | 🎨 |
| AI/ML | `#8B5CF6` | `rgba(139,92,246,0.35)` | 🧠 |
| Robotics | `#00E87A` | `rgba(0,232,122,0.35)` | 🤖 |
| Research | `#94A3B8` | `rgba(148,163,184,0.25)` | 🔬 |

Badge style: Vibrant solid fill + outer glow box-shadow. Text is white.
Hover: glow intensifies to 0.55 opacity.

---

## Corner Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `radius-xs` | `4px` | Code blocks, BOM tables, technical panels |
| `radius-sm` | `8px` | Inputs, small buttons, avatars |
| `radius-md` | `10px` | Primary CTA buttons |
| `radius-lg` | `12px` | Project cards, modals |
| `radius-full` | `9999px` | Pills, badges, tags |

---

## Spacing Scale (Base-4)

| Token | Value |
|-------|-------|
| `space-1` | `4px` |
| `space-2` | `8px` |
| `space-3` | `12px` |
| `space-4` | `16px` |
| `space-5` | `20px` |
| `space-6` | `24px` |
| `space-8` | `32px` |
| `space-10` | `40px` |
| `space-12` | `48px` |
| `space-16` | `64px` |
| `space-20` | `80px` |
| `space-24` | `96px` |

---

## Shadow Scale

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-none` | `none` | Flat elements |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.2)` | Subtle elevation |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.3)` | Dropdowns, tooltips |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.4)` | Modals, floating elements |
| `shadow-glow-cyan` | `0 0 20px rgba(0,200,240,0.25)` | Cyan glow effect |
| `shadow-glow-gold` | `0 0 20px rgba(245,166,35,0.25)` | Gold glow effect |
| `shadow-glow-coral` | `0 0 20px rgba(244,63,94,0.25)` | Coral glow effect |
| `shadow-glow-green` | `0 0 20px rgba(0,232,122,0.25)` | Green glow effect |

---

## Motion Principles

### Duration Scale
| Token | Value | Context |
|-------|-------|---------|
| `duration-instant` | `100ms` | Tooltips, color changes |
| `duration-fast` | `150ms` | Button states, dropdowns |
| `duration-normal` | `250ms` | Navigation transitions, tab switches |
| `duration-smooth` | `400ms` | Card animations, neumorphic shifts |
| `duration-slow` | `600ms` | Page transitions, hero reveals |
| `duration-ambient` | `10000ms` | Liquid morphism blob movement |

### Easing Curves
| Token | Value | Usage |
|-------|-------|-------|
| `ease-snappy` | `cubic-bezier(0.2, 0, 0, 1)` | UI interactions |
| `ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | General animations |
| `ease-spring` | `spring({ stiffness: 300, damping: 20 })` | Neumorphic elements, cards |
| `ease-cinematic` | `cubic-bezier(0.4, 0, 0.2, 1)` | Landing page reveals |

### Rules
- Never animate `width`, `height`, or `top/left` — only `transform` and `opacity`
- All animations must respect `prefers-reduced-motion`
- Card flip uses `rotateY` with `perspective: 1200px`
- Hover spotlight uses `radial-gradient` tracking mouse position

---

## Icon Style Guidelines

- Use **Lucide Icons** (open-source, consistent, MIT license)
- Stroke width: `1.5px` (matches our balanced density)
- Size: `20px` for inline, `24px` for standalone
- Color: inherits from text color (primary or secondary)
- NO generic AI-generated icons — only established icon libraries
- Custom icons (if needed) must match Lucide's stroke style exactly

---

## Do's and Don'ts

### ✅ DO
- Use neumorphic shadows consistently on all elevated surfaces
- Let project imagery be the visual hero on cards
- Keep text concise — the College Builder scans, not reads
- Use glow effects on interactive elements only (not decorative)
- Maintain high contrast (4.5:1 minimum) for all text
- Use context-aware tone in all copy
- Show content immediately — zero loading screens without skeletons

### ❌ DON'T
- Use generic purple gradients or AI-startup aesthetic
- Use stock illustrations with tiny-head vector people
- Add decoration without function
- Make layouts cluttered — white space is precision
- Use light mode as default — dark mode is the brand
- Use inconsistent border-radius — follow the mixed scale strictly
- Override neumorphic depth with flat elements (stay in the system)
- Add animation that blocks content visibility for more than 400ms
