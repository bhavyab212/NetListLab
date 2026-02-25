## Page: Register
**Route:** `/register`
**Purpose:** Create a new NetListLab account via email/password or OAuth.

---

### Desktop Layout
- **Max width:** 480px centered card on `bg-base` full-viewport background
- **Card style:** Same as Login — neumorphic raised, `bg-surface`, `radius-lg`
- **Background accent:** Same liquid morphism blob as Login (visual consistency)
- **Layout:** Nearly identical to Login but with additional fields

### Component List
| Component | Type | Notes |
|-----------|------|-------|
| Logo | Image/SVG | Same as Login |
| Card container | `bg-surface` | Same dimensions as Login for visual consistency |
| Page title | `text-h2` | "Create your workshop" (Space Grotesk 600) |
| Subtitle | `text-sm` | "Join the builder community" (Inter 400, `text-secondary`) |
| Full name input | Neumorphic inset | Label: "Full name", placeholder: "Ada Lovelace" |
| Username input | Neumorphic inset | Label: "Username", placeholder: "ada-lovelace". Live availability check (debounced 500ms) |
| Email input | Neumorphic inset | Label: "Email address", placeholder: "you@example.com" |
| Password input | Neumorphic inset | Label: "Password", type: password, eye toggle. Password strength indicator below (bar: red→yellow→green) |
| Sign Up button | Primary CTA | Full-width, Gradient Cyan→Blue, neumorphic, "Create Account →" |
| Divider | Horizontal rule | "or sign up with" centered |
| Google OAuth | Secondary outlined | Full-width |
| GitHub OAuth | Secondary outlined | Full-width |
| Terms text | `text-xs` | "By signing up, you agree to our **Terms** and **Privacy Policy**" |
| Login link | Text | "Already have an account? **Sign in**" → `/login` |

### Spacing
- Same spacing system as Login for visual consistency
- Username availability indicator: inline, right-aligned inside input
- Password strength bar: `space-2` (8px) below password input, height `4px`, `radius-full`

### Interaction Notes
- **Username check:** On blur or after 500ms debounce, check availability. Show ✅ green checkmark or ❌ coral X with "Username taken."
- **Password strength:** Real-time bar: <6 chars = red, 6–8 chars = yellow, 8+ with mixed case/numbers = green.
- **On submit:** Validate all fields client-side → create account via Supabase → redirect to `/onboarding`.
- **On error:** Same shake animation + per-field error messages as Login.

### Empty / Error States
- **Missing field on submit:** Coral border + "This field is required"
- **Email already registered:** "This email is already in use. **Sign in instead?**" (link to login)
- **Username taken:** Inline coral indicator with "This username is taken"
- **Weak password:** Coral bar + "Password must be at least 8 characters"
