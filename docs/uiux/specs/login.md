## Page: Login
**Route:** `/login`
**Purpose:** Authenticate returning users via email/password or OAuth.

---

### Desktop Layout
- **Max width:** 480px centered card on `bg-base` full-viewport background
- **Card style:** Neumorphic raised surface (`bg-surface`), `radius-lg` (12px)
- **Vertical centering:** Flexbox center, with NetListLab logo above the card
- **Background accent:** Subtle liquid morphism blob (low opacity Cyan/Blue) animating slowly behind the card

### Component List
| Component | Type | Notes |
|-----------|------|-------|
| Logo | Image/SVG | NetListLab logo, centered above card, clickable → `/` |
| Card container | `bg-surface` | Neumorphic raised, 480px max-width, `padding: space-8 (32px)` |
| Page title | `text-h2` | "Welcome back" (Space Grotesk 600) |
| Subtitle | `text-sm` | "Sign in to your workshop" (Inter 400, `text-secondary`) |
| Email input | Neumorphic inset | Label: "Email address", placeholder: "you@example.com" |
| Password input | Neumorphic inset | Label: "Password", type: password, eye toggle icon |
| Forgot password link | Text link | Right-aligned below password, `accent-primary`, `text-xs` |
| Sign In button | Primary CTA | Full-width, Gradient Cyan→Blue, neumorphic, "Sign In →" |
| Divider | Horizontal rule | "or continue with" centered text divider |
| Google OAuth button | Secondary outlined | Full-width, outlined + glow, Google icon + "Google" |
| GitHub OAuth button | Secondary outlined | Full-width, outlined + glow, GitHub icon + "GitHub" |
| Register link | Text | "Don't have an account? **Create one**" — link to `/register` |

### Spacing
- Logo to card: `space-8` (32px)
- Card internal padding: `space-8` (32px)
- Between inputs: `space-5` (20px)
- Input to button: `space-6` (24px)
- Divider vertical margin: `space-5` (20px)
- OAuth buttons gap: `space-3` (12px)
- Bottom register link margin-top: `space-6` (24px)

### Interaction Notes
- **On submit:** Button shows loading spinner (replace text with spinner). Validate email format + password not empty client-side before sending.
- **On success:** Redirect to `/feed` (or `/onboarding` if first login).
- **On error:** Shake animation on the card (150ms, 3 cycles). Error message appears below the relevant input in `accent-coral` text: "Invalid email or password."
- **OAuth flow:** Redirect to Supabase OAuth endpoint → return to `/feed`.

### Empty / Error States
- **Empty email/password on submit:** Input border turns `accent-coral`, label turns `accent-coral`, helper text: "This field is required"
- **Invalid credentials:** Card shake + toast notification at top-right: "Invalid email or password. Please try again."
- **Network error:** Toast: "Unable to connect. Check your internet and try again."
