# NetListLab — Crawled Design References

> @crawler-agent — verified design references for the NetListLab design system.
> Date: 2026-02-25

---

## Fonts

### Space Grotesk (Headings)
**Source:** https://fonts.google.com/specimen/Space+Grotesk
**CDN:** `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap`
**License:** OFL (Open Font License) — free for commercial use
**Weights needed:** 400 (descriptions), 500 (subheadings), 600 (headings), 700 (hero)

### Inter (Body Text)
**Source:** https://fonts.google.com/specimen/Inter
**CDN:** `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap`
**License:** OFL — free for commercial use
**Weights needed:** 400 (body), 500 (labels), 600 (emphasis)

### Geist (Technical/Data Text)
**Source:** https://vercel.com/font (Vercel Geist)
**NPM:** `npm install geist`
**License:** OFL — free for commercial use
**Weights needed:** 400 (data), 500 (table headers)
**Note:** Not on Google Fonts. Must install via npm package `geist` or self-host the woff2 files.

### JetBrains Mono (Code)
**Source:** https://fonts.google.com/specimen/JetBrains+Mono
**CDN:** `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap`
**License:** OFL — free for commercial use
**Features:** Ligatures enabled via `font-feature-settings: "liga" on, "calt" on;`

---

## Neumorphism on Dark Mode — Pattern References

### Implementation Pattern
**Source:** CSS-Tricks — https://css-tricks.com/neumorphism-and-css/
**Key CSS for dark neumorphism:**
```css
/* Dark neumorphic card — extruded */
.card-neumorphic {
  background: #1A1916;
  box-shadow:
    8px 8px 16px #0A0A08,
    -8px -8px 16px #2A2720;
  border-radius: 12px;
}

/* Dark neumorphic inset — input fields */
.input-neumorphic {
  background: #141310;
  box-shadow:
    inset 4px 4px 8px #0A0A08,
    inset -4px -4px 8px #2A2720;
}
```
**Accessibility note:** Must maintain WCAG AA contrast (4.5:1) for text on neumorphic surfaces. Our warm dark palette achieves this with white/light text.

---

## Cursor Spotlight Effect — Implementation Reference

**Source:** Aceternity UI — https://ui.aceternity.com/components/spotlight
**Framer Motion approach:**
```tsx
// Track mouse position relative to card
const [mouseX, setMouseX] = useState(0);
const [mouseY, setMouseY] = useState(0);

// Apply as radial gradient background
background: `radial-gradient(600px at ${mouseX}px ${mouseY}px, rgba(0, 200, 240, 0.06), transparent 80%)`
```
**Usable in:** Project cards, hero section, any large surface element.

---

## Scroll-Driven Fragment Assembly — Implementation Reference

**Source:** Framer Motion `useScroll` + `useTransform`
**Documentation:** https://www.framer.com/motion/scroll-animations/
**Pattern:**
```tsx
const { scrollYProgress } = useScroll();
const x = useTransform(scrollYProgress, [0, 0.6], [randomX, targetX]);
const y = useTransform(scrollYProgress, [0, 0.6], [randomY, targetY]);
const rotate = useTransform(scrollYProgress, [0, 0.6], [randomRotation, 0]);
const opacity = useTransform(scrollYProgress, [0.5, 0.7], [0.7, 1]);
```
**Performance note:** Use `will-change: transform` and GPU-accelerated properties only.

---

## Liquid Morphism / Blob Animation Reference

**Source:** CSS blob generator — https://www.blobmaker.app/
**Animation approach:** Animate `border-radius` between organic shapes over 10–15s.
```css
@keyframes blob-morph {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
}
```
**Usable in:** Hero section background, featured card backgrounds (subtle, low-opacity).

---

## Interactive Card Flip — Implementation Reference

**Source:** Framer Motion 3D transforms
**Pattern:**
```tsx
<motion.div
  style={{ perspective: 1200 }}
  whileHover={{ scale: 1.02 }}
>
  <motion.div
    animate={{ rotateY: isFlipped ? 180 : 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    style={{ transformStyle: "preserve-3d" }}
  >
    <div style={{ backfaceVisibility: "hidden" }}>Front</div>
    <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>Back</div>
  </motion.div>
</motion.div>
```
**Usable in:** Project cards on Explore, Feed, Profile pages.

---

## Design Inspiration Sites (User-Referenced)

| Site | What to study | URL |
|------|--------------|-----|
| LinkedIn | Navigation clarity, social patterns | https://linkedin.com |
| Discord | Social warmth in technical UI, real-time | https://discord.com |
| Instagram | Content-first scrolling, social warmth | https://instagram.com |
| Notion | Organization, hierarchy, structure | https://notion.so |
| HiAnime | Zero learning curve content consumption | https://hianime.to |
| Anker Games | Audience-aware creative UI | https://store.anker.com |
| GetIntoPC | Clean, simple, functional | https://getintopc.com |
| Emergent | Modern + real-time feel | https://emergent.info |
