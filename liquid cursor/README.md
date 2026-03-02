# 💧 Liquid Cursor

A self-contained, **drop-in** liquid water-drop cursor for any React / Next.js / Vite project.

> Copy the `src/` folder → install one dependency → done.

---

## 📁 Folder Structure

```
liquid cursor/
├── src/
│   ├── index.ts                        ← single import point
│   ├── components/
│   │   ├── LiquidCursor.tsx            ← the cursor (main component)
│   │   └── ThemeToggle.tsx             ← optional glassmorphic dark/light toggle
│   └── hooks/
│       └── useIsDark.ts                ← dark mode detection hook
├── index.html                          ← standalone Vanilla JS demo (open in browser)
├── package.json                        ← lists the one required dependency
└── README.md                           ← this file
```

---

## ✅ Step-by-Step Integration

### 1 — Copy the `src/` folder

Paste the `src/` folder from this package into your project. For example:

```
your-project/
└── src/
    └── components/
        └── liquid-cursor/      ← paste here
            ├── index.ts
            ├── components/
            └── hooks/
```

### 2 — Install the one dependency

```bash
npm install framer-motion
# or
yarn add framer-motion
# or
pnpm add framer-motion
```

That is the **only external dependency**. React and ReactDOM are expected to already be in your project.

### 3 — Add `<LiquidCursor />` to your app root

The cursor must be rendered **once**, ideally in your root layout or `App.tsx`.

**Next.js App Router (`app/layout.tsx`)**
```tsx
import LiquidCursor from '@/components/liquid-cursor';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <LiquidCursor />
                {children}
            </body>
        </html>
    );
}
```

**Next.js Pages Router (`pages/_app.tsx`) / Vite (`App.tsx`)**
```tsx
import LiquidCursor from './components/liquid-cursor';

export default function App() {
    return (
        <>
            <LiquidCursor />
            {/* rest of your app */}
        </>
    );
}
```

### 4 — Activate on specific elements with `data-liquid-cursor`

The cursor is **invisible by default** and only appears when hovering over elements tagged with `data-liquid-cursor`. This means it will not interfere with the rest of your app.

```tsx
// ✅ Cursor appears here
<div data-liquid-cursor>
    Hover me to see the liquid drop!
</div>

// ❌ Cursor stays invisible here
<div>
    Normal cursor here
</div>
```

You can tag any number of elements — cards, modals, forms, buttons, entire sections.

---

## 🎨 Theme Support (dark/light)

The cursor **auto-detects** the theme. No configuration needed.

It reads `data-theme` from `<html>` in priority order:
1. `data-theme="dark"` / `data-theme="light"` on `<html>` 
2. `.dark` class on `<html>` (Tailwind CSS dark mode)
3. OS `prefers-color-scheme` media query

| Theme | Cursor Appearance |
|---|---|
| Dark | ✨ Bright cyan glowing bead with light refraction |
| Light | 🔵 Dark shadow water bead (inverted) |

### Manual override

You can also pass `isDark` directly if you manage theme yourself:

```tsx
<LiquidCursor isDark={true} />
```

### Use the included ThemeToggle

This package includes a matching glassmorphic toggle. It writes `data-theme` to `<html>` and persists to `localStorage` — no setup needed:

```tsx
import { ThemeToggle } from './components/liquid-cursor';

// Place anywhere, e.g. top-right corner
<div style={{ position: 'fixed', top: 20, right: 24, zIndex: 100 }}>
    <ThemeToggle />
</div>
```

---

## ⚙️ Props

### `<LiquidCursor />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `isDark` | `boolean` | auto-detected | Override dark mode detection |
| `dropSize` | `number` | `28` | Size of the main water drop in px |

### `<ThemeToggle />`

No props — fully self-managed.

---

## 🪝 Hook: `useIsDark`

You can use the theme detection hook independently in your own components:

```tsx
import { useIsDark } from './components/liquid-cursor/hooks/useIsDark';

function MyComponent() {
    const isDark = useIsDark();
    return <p>Currently in {isDark ? 'dark' : 'light'} mode</p>;
}
```

---

## 🎬 Behaviour Reference

| User Action | Cursor Behaviour |
|---|---|
| Enters `[data-liquid-cursor]` zone | Drop fades in (opacity 0 → 1) |
| Leaves the zone | Drop fades out |
| Moves quickly | Drop stretches in movement direction |
| Stops | Drop snaps back to round blob |
| Clicks | Squishes → bounces back + water splash ripple |

---

## 🖥️ Standalone Demo (no React needed)

Open `index.html` in any browser to see a plain HTML/CSS/JS recreation of the same effect without needing to run your dev server.

---

## 🔗 Compatible With

| Framework | Status |
|---|---|
| **Next.js** (App + Pages Router) | ✅ |
| **Vite + React** | ✅ |
| **Create React App** | ✅ |
| **Remix** | ✅ |
| **Astro** (React islands) | ✅ |
| **next-themes** | ✅ auto-detects `data-theme` |
| **Tailwind CSS dark mode** | ✅ auto-detects `.dark` class |

---

## 📜 License
MIT — free to use in any project.
