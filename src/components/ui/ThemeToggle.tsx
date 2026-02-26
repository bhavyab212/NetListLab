import { motion, useSpring, useTransform } from 'framer-motion';
import { useThemeStore } from '../../stores/themeStore';

/**
 * ThemeToggle — Glassmorphic pill dark/light toggle.
 *
 * Matches the Dribbble reference: https://dribbble.com/shots/26453320
 *   • Pill container with glassmorphism and thin light-refractive border
 *   • Circular knob slides LEFT = light (sun icon + cyan glow)
 *                            RIGHT = dark (moon icon + gold glow)
 *   • Smooth spring physics knob movement
 *   • Ambient glow behind knob pulses to theme colour
 *   • Container background cross-fades between translucent dark / light
 */
export default function ThemeToggle() {
    const { isDark, toggle } = useThemeStore();

    // Spring-based progress (0 = light, 1 = dark)
    const spring = useSpring(isDark ? 1 : 0, {
        stiffness: 300,
        damping: 28,
        mass: 0.8,
    });

    // Update spring whenever isDark changes
    spring.set(isDark ? 1 : 0);

    // Knob X: 4px (left) → 36px (right) inside the 76px pill
    const knobX = useTransform(spring, [0, 1], [4, 36]);

    // Glow opacity pulses
    const glowOpacity = useTransform(spring, [0, 0.5, 1], [0.6, 0.3, 0.6]);

    // Sun opacity: 1 when light, 0 when dark
    const sunOpacity = useTransform(spring, [0, 0.4, 1], [1, 0, 0]);
    const sunScale = useTransform(spring, [0, 0.3, 1], [1, 0.5, 0]);

    // Moon opacity: 0 when light, 1 when dark
    const moonOpacity = useTransform(spring, [0, 0.6, 1], [0, 0, 1]);
    const moonScale = useTransform(spring, [0, 0.7, 1], [0, 0.5, 1]);

    // Track background: dark glass → light glass
    const trackBg = useTransform(
        spring,
        [0, 1],
        ['rgba(230,232,250,0.88)', 'rgba(22,20,18,0.82)']
    );

    return (
        <button
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
            {/* ── PILL TRACK ──────────────────────────────── */}
            <motion.div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '9999px',
                    backgroundColor: trackBg,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    // Thin refraction border — top brighter, bottom dimmer
                    border: isDark
                        ? '1px solid rgba(255,255,255,0.10)'
                        : '1px solid rgba(255,255,255,0.85)',
                    boxShadow: isDark
                        ? '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
                        : '0 8px 32px rgba(180,185,220,0.45), inset 0 1px 0 rgba(255,255,255,0.95)',
                    transition: 'border 350ms ease, box-shadow 350ms ease',
                }}
            />

            {/* ── AMBIENT GLOW BEHIND KNOB ─────────────────── */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '50%',
                    translateY: '-50%',
                    x: knobX,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isDark
                        ? 'radial-gradient(circle, rgba(245,166,35,0.9) 0%, rgba(245,166,35,0) 70%)'
                        : 'radial-gradient(circle, rgba(0,200,240,0.9) 0%, rgba(0,200,240,0) 70%)',
                    filter: 'blur(8px)',
                    opacity: glowOpacity,
                    transition: 'background 350ms ease',
                }}
            />

            {/* ── KNOB ─────────────────────────────────────── */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '4px',
                    x: knobX,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isDark
                        ? 'radial-gradient(135deg, #2E2B26 0%, #1A1814 100%)'
                        : 'radial-gradient(135deg, #FFFFFF 0%, #EEF0F8 100%)',
                    boxShadow: isDark
                        ? '4px 4px 12px rgba(0,0,0,0.7), -2px -2px 6px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.1)'
                        : '4px 4px 12px rgba(180,185,220,0.7), -2px -2px 6px rgba(255,255,255,0.95), inset 0 1px 0 rgba(255,255,255,1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 350ms ease, box-shadow 350ms ease',
                }}
            >
                {/* Sun Icon */}
                <motion.div style={{ position: 'absolute', opacity: sunOpacity, scale: sunScale }}>
                    <SunIcon />
                </motion.div>

                {/* Moon Icon */}
                <motion.div style={{ position: 'absolute', opacity: moonOpacity, scale: moonScale }}>
                    <MoonIcon />
                </motion.div>
            </motion.div>

            {/* ── OUTER GLOW (halo around entire button) ─── */}
            <motion.div
                style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '9999px',
                    pointerEvents: 'none',
                    boxShadow: isDark
                        ? '0 0 20px rgba(245,166,35,0.15), 0 0 40px rgba(245,166,35,0.07)'
                        : '0 0 20px rgba(0,200,240,0.15), 0 0 40px rgba(0,200,240,0.07)',
                    transition: 'box-shadow 350ms ease',
                }}
            />
        </button>
    );
}

/* ── SUN ICON ─────────────────────────────────────────── */
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

/* ── MOON ICON ────────────────────────────────────────── */
function MoonIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(245,166,35,0.25)"
            stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}
