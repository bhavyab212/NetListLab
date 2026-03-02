## Page: Onboarding
**Route:** `/onboarding`
**Purpose:** Collect optional profile information from new users to personalize their experience and improve discoverability.

---

### Desktop Layout
- **Max width:** 640px centered card on `bg-base` full-viewport background
- **Card style:** Neumorphic raised, `bg-surface`, `radius-lg` (12px)
- **Layout:** Multi-step wizard (3 steps) with a progress bar at the top
- **Background:** Subtle liquid morphism blobs, same as auth pages

### Step Flow
| Step | Title | What's collected |
|------|-------|------------------|
| 1 | "Tell us about yourself" | Avatar upload, bio (optional), current role |
| 2 | "What do you build?" | Field(s) of work selection, skill tags |
| 3 | "Almost there" | Institution/company (optional), review & finish |

### Component List — Step 1
| Component | Type | Notes |
|-----------|------|-------|
| Progress bar | 3-segment bar | Segment 1 filled Cyan, segments 2–3 `border-default`. Height 4px, `radius-full` |
| Step title | `text-h2` | "Tell us about yourself" (Space Grotesk 600) |
| Step subtitle | `text-sm` | "This helps other builders find you" (`text-secondary`) |
| Avatar upload | Upload zone | Rounded square (8px radius), neumorphic inset. Click to upload or drag-and-drop. Shows preview after upload. 80x80px |
| Bio textarea | Neumorphic inset | Label: "Short bio", placeholder: "What do you build?", max 200 chars, character count shown |
| Role selector | Pill toggle group | Options: Student / Engineer / Researcher / Freelancer / Other. Single select. Neumorphic pills, active = Cyan fill |
| Next button | Primary CTA | "Continue →", right-aligned |
| Skip link | Ghost text link | "Skip for now" → proceeds to next step |

### Component List — Step 2
| Component | Type | Notes |
|-----------|------|-------|
| Progress bar | Segments 1–2 filled Cyan |
| Step title | `text-h2` | "What do you build?" |
| Field selector | Multi-select grid | 7 domain cards (Electronics, Software, Mechanical, Design, AI/ML, Robotics, Research). Each is a small neumorphic card with emoji + name. Click to select (glowing border appears). Multi-select allowed. |
| Skill tags input | Tag input with autocomplete | Neumorphic inset. Type to search/add tags. Tags appear as filled soft pills. Autocomplete from a predefined list. Max 15 tags. |
| Navigation | Two buttons | "← Back" (ghost) + "Continue →" (primary) |

### Component List — Step 3
| Component | Type | Notes |
|-----------|------|-------|
| Progress bar | All 3 segments filled Cyan |
| Step title | `text-h2` | "Almost there" |
| Institution/company input | Neumorphic inset | Label: "Where do you work or study?", optional |
| Review summary | Info card | Shows avatar, name, role, fields, tags in a summary layout. "Edit" links per section |
| Finish button | Primary CTA | "Launch My Workshop 🚀" — Gradient Cyan→Blue, full-width |

### Spacing
- Card internal padding: `space-8` (32px)
- Progress bar to title: `space-6` (24px)
- Title to subtitle: `space-2` (8px)
- Between form groups: `space-6` (24px)
- Domain card grid: 3 columns on desktop (2 on smaller), `gap: space-4` (16px)
- Navigation buttons: bottom of card, `margin-top: space-8` (32px)

### Interaction Notes
- **Step transitions:** Slide animation (left→right on next, right→left on back), 300ms spring
- **Avatar upload:** Drag-and-drop zone, click to browse. Shows circular progress during upload. On complete, shows preview
- **Domain selection:** Cards wobble slightly on select (spring animation), border glows with domain color
- **Skill tag input:** Debounced autocomplete (300ms). Tags animate in with a spring pop
- **On finish:** Confetti animation (subtle, 2 seconds), then redirect to `/feed`
- **All steps skippable:** "Skip for now" available on every step. Profile can be completed later in Settings.

### Empty / Error States
- **No data entered (skipped all):** Perfectly fine — redirect to `/feed` with a toast: "You can complete your profile anytime in Settings"
- **Image upload failure:** Toast: "Upload failed. Try a smaller image (max 5MB)"
- **Network error:** Same toast treatment as auth pages
