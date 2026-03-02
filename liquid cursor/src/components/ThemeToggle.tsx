import { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * ThemeToggle — Self-contained glassmorphic pill dark/light toggle.
 *
 * Works WITHOUT any state management library (zustand, redux, etc.)
 *
 * WHAT IT DOES:
 *   - Reads/writes `data-theme="dark|light"` on `<html>`
 *   - Persists choice to localStorage under key 'theme'
 *   - All other components reading `data-theme` (like LiquidCursor) react automatically
 *
 * USAGE:
 *   Simply drop it anywhere in your app:
 *   ```tsx
 *   import ThemeToggle from './components/ThemeToggle';
 *   <ThemeToggle />
 *   ```
 *
 * INTEGRATE WITH TAILWIND:
 *   In tailwind.config.ts set `darkMode: 'class'` then update the toggle
 *   to add/remove `document.documentElement.classList.toggle('dark', isDark)`.
 */
export default function ThemeToggle() {
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof localStorage === 'undefined') return true;
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' || saved === 'light') return saved === 'dark';
        // Fallback to OS preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Apply theme to <html> whenever isDark changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        // Support Tailwind 'dark' class strategy simultaneously
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    const toggle = useCallback(() => {
        setIsDark(prev => {
            const next = !prev;
            localStorage.setItem('theme', next ? 'dark' : 'light');
            return next;
        });
    }, []);

    // ─── Framer Motion Spring ──────────────────────────────────────────────────

    const spring = useSpring(isDark ? 1 : 0, { stiffness: 300, damping: 28, mass: 0.8 });
    spring.set(isDark ? 1 : 0);

    const knobX = useTransform(spring, [0, 1], [4, 36]);
    const glowOpacity = useTransform(spring, [0, 0.5, 1], [0.6, 0.3, 0.6]);
    const sunOpacity = useTransform(spring, [0, 0.4, 1], [1, 0, 0]);
    const sunScale = useTransform(spring, [0, 0.3, 1], [1, 0.5, 0]);
    const moonOpacity = useTransform(spring, [0, 0.6, 1], [0, 0, 1]);
    const moonScale = useTransform(spring, [0, 0.7, 1], [0, 0.5, 1]);
    const trackBg = useTransform(spring, [0, 1], ['rgba(230,232,250,0.88)', 'rgba(22,20,18,0.82)']);

    return (
        <button
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
                position: 'relative',
                width: '76px',
                height: '40px',
                borderRadius: '9999px',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background: 'transparent',
                flexShrink: 0,
            }}
        >
            {/* Pill track */}
            <motion.div style={{
                position: 'absolute', inset: 0, borderRadius: '9999px',
                backgroundColor: trackBg,
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.85)',
                boxShadow: isDark
                    ? '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
                    : '0 8px 32px rgba(180,185,220,0.45), inset 0 1px 0 rgba(255,255,255,0.95)',
                transition: 'border 350ms ease, box-shadow 350ms ease',
            }} />

            {/* Ambient glow behind knob */}
            <motion.div style={{
                position: 'absolute', top: '50%', translateY: '-50%', x: knobX,
                width: '32px', height: '32px', borderRadius: '50%',
                background: isDark
                    ? 'radial-gradient(circle, rgba(245,166,35,0.9) 0%, rgba(245,166,35,0) 70%)'
                    : 'radial-gradient(circle, rgba(0,200,240,0.9) 0%, rgba(0,200,240,0) 70%)',
                filter: 'blur(8px)', opacity: glowOpacity, transition: 'background 350ms ease',
            }} />

            {/* Knob */}
            <motion.div style={{
                position: 'absolute', top: '4px', x: knobX, width: '32px', height: '32px',
                borderRadius: '50%',
                background: isDark
                    ? 'radial-gradient(135deg, #2E2B26 0%, #1A1814 100%)'
                    : 'radial-gradient(135deg, #FFFFFF 0%, #EEF0F8 100%)',
                boxShadow: isDark
                    ? '4px 4px 12px rgba(0,0,0,0.7), -2px -2px 6px rgba(255,255,255,0.06)'
                    : '4px 4px 12px rgba(180,185,220,0.7), -2px -2px 6px rgba(255,255,255,0.95)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 350ms ease, box-shadow 350ms ease',
            }}>
                <motion.div style={{ position: 'absolute', opacity: sunOpacity, scale: sunScale }}>
                    <SunIcon />
                </motion.div>
                <motion.div style={{ position: 'absolute', opacity: moonOpacity, scale: moonScale }}>
                    <MoonIcon />
                </motion.div>
            </motion.div>

            {/* Outer halo */}
            <motion.div style={{
                position: 'absolute', inset: '-4px', borderRadius: '9999px', pointerEvents: 'none',
                boxShadow: isDark
                    ? '0 0 20px rgba(245,166,35,0.15), 0 0 40px rgba(245,166,35,0.07)'
                    : '0 0 20px rgba(0,200,240,0.15), 0 0 40px rgba(0,200,240,0.07)',
                transition: 'box-shadow 350ms ease',
            }} />
        </button>
    );
}

function SunIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2"
            stroke="#F5A623" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" fill="rgba(245,166,35,0.2)" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(245,166,35,0.25)"
            stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}
