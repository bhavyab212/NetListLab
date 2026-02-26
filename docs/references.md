# Design & Technical References

*This document houses links, inspiration, and technical references used to build NetListLab.*

## Design Inspiration
*   **Theme Toggle Button (Dribbble):**
    *   *Source:* [Dark Light Button UI Animation by Expert App Devs](https://dribbble.com/shots/26453320-Dark-Light-Button-UI-Animation)
    *   *Implementation:* See `src/components/ui/ThemeToggle.tsx`. Replicates the glass pill track, sliding knob, and animated sun/moon icons with ambient colored glows.
*   **Premium Glassmorphism:**
    *   *Reference:* Implementations seen in modern macOS interfaces (Big Sur/Sonoma menus) and high-end landing pages (like Linear, Vercel).
    *   *Key properties:* `backdrop-filter: blur(24px)`, semi-transparent surfaces with rich backgrounds bleeding through, 1px diffuse white inner strokes.

## Documentation References
*   [Framer Motion Documentation](https://www.framer.com/motion/) - Used for all spring animations and layout transitions.
*   [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction) - Used for `authStore` and `themeStore`.
*   [Lucide Icons](https://lucide.dev/) - Our standard icon set.
