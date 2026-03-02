"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';

/**
 * LiquidCursor — An organic liquid water-drop cursor.
 *
 * Only activates over elements with `data-liquid-cursor` attribute.
 * Hides native cursor automatically on those elements.
 */

interface LiquidCursorProps {
    /** Override dark mode detection. Leave undefined for auto-detect. */
    isDark?: boolean;
    /** Size of the main water drop in px. Default: 28 */
    dropSize?: number;
}

interface Ripple {
    id: number;
    x: number;
    y: number;
}

function useIsDark() {
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const check = () =>
            setIsDark(
                document.documentElement.classList.contains('dark') ||
                document.documentElement.getAttribute('data-theme') === 'dark'
            );
        check();
        const observer = new MutationObserver(check);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
        return () => observer.disconnect();
    }, []);
    return isDark;
}

export default function LiquidCursor({ isDark: isDarkProp, dropSize = 28 }: LiquidCursorProps) {
    const isDarkAuto = useIsDark();
    const isDark = isDarkProp !== undefined ? isDarkProp : isDarkAuto;

    const [visible, setVisible] = useState(false);
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const rippleId = useRef(0);

    // ─── Spring Physics ────────────────────────────────────────────

    // Main cursor — fast, snappy
    const mouseX = useSpring(0, { stiffness: 200, damping: 25, mass: 0.5 });
    const mouseY = useSpring(0, { stiffness: 200, damping: 25, mass: 0.5 });

    // Trail — slow, lagging
    const trailX = useSpring(0, { stiffness: 120, damping: 30, mass: 0.8 });
    const trailY = useSpring(0, { stiffness: 120, damping: 30, mass: 0.8 });

    // Stretch/squish from velocity
    const scaleX = useSpring(1, { stiffness: 300, damping: 15 });
    const scaleY = useSpring(1, { stiffness: 300, damping: 15 });
    const rotation = useSpring(0, { stiffness: 200, damping: 20 });

    // Click squish
    const clickScale = useSpring(1, { stiffness: 400, damping: 12 });

    const lastPos = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number>(0);

    // ─── Ripple Helper ─────────────────────────────────────────────

    const addRipple = useCallback((x: number, y: number) => {
        const id = ++rippleId.current;
        setRipples(prev => [...prev, { id, x, y }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 700);
    }, []);

    // ─── Event Listeners ───────────────────────────────────────────

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX;
            const y = e.clientY;

            mouseX.set(x);
            mouseY.set(y);
            trailX.set(x);
            trailY.set(y);

            // Velocity → stretch
            const dx = x - lastPos.current.x;
            const dy = y - lastPos.current.y;
            const speed = Math.sqrt(dx * dx + dy * dy);
            const stretchFactor = Math.min(speed * 0.008, 0.3);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            scaleX.set(1 + stretchFactor);
            scaleY.set(1 - stretchFactor * 0.5);
            rotation.set(angle);

            lastPos.current = { x, y };

            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                setTimeout(() => {
                    scaleX.set(1);
                    scaleY.set(1);
                    rotation.set(0);
                }, 80);
            });

            // Only show cursor when over a [data-liquid-cursor] element
            const target = document.elementFromPoint(x, y);
            if (target) {
                setVisible(!!target.closest('[data-liquid-cursor]'));
            }
        };

        const handleClick = (e: MouseEvent) => {
            const target = document.elementFromPoint(e.clientX, e.clientY);
            if (target && target.closest('[data-liquid-cursor]')) {
                clickScale.set(0.6);
                setTimeout(() => clickScale.set(1.2), 100);
                setTimeout(() => clickScale.set(1), 250);
                addRipple(e.clientX, e.clientY);
            }
        };

        const handleMouseLeave = () => setVisible(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleClick);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleClick);
            document.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(rafRef.current);
        };
    }, [mouseX, mouseY, trailX, trailY, scaleX, scaleY, rotation, clickScale, addRipple]);

    // ─── Theme-aware Colours ───────────────────────────────────────

    const opacity = visible ? 1 : 0;

    const dropGradient = isDark
        ? 'radial-gradient(circle at 35% 35%, rgba(0,220,255,0.7) 0%, rgba(0,200,240,0.3) 50%, rgba(0,180,220,0.1) 100%)'
        : 'radial-gradient(circle at 35% 35%, rgba(30,30,50,0.4) 0%, rgba(60,70,90,0.25) 50%, rgba(80,90,110,0.1) 100%)';

    const dropShadow = isDark
        ? 'inset -2px -2px 6px rgba(0,200,240,0.4), inset 2px 2px 4px rgba(255,255,255,0.4), 0 0 20px rgba(0,200,240,0.5)'
        : 'inset -2px -2px 6px rgba(0,0,0,0.15), inset 2px 2px 4px rgba(255,255,255,0.7), 4px 4px 10px rgba(163,177,198,0.4), -4px -4px 10px rgba(255,255,255,0.7)';

    const trailGradient = isDark
        ? 'radial-gradient(circle, rgba(0,200,240,0.3) 0%, rgba(0,200,240,0) 70%)'
        : 'radial-gradient(circle, rgba(100,120,150,0.15) 0%, rgba(100,120,150,0) 70%)';

    const specularColor = isDark
        ? 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)';

    const rippleColor = isDark
        ? 'rgba(0, 200, 240, 0.4)'
        : 'rgba(100, 120, 150, 0.2)';

    // ─── Render ────────────────────────────────────────────────────

    return (
        <>
            {/* Hide native cursor only over tagged elements */}
            <style>{`
                [data-liquid-cursor] { cursor: none !important; }
                [data-liquid-cursor] * { cursor: none !important; }
            `}</style>

            {/* Splash ripples on click */}
            <AnimatePresence>
                {ripples.map(ripple => (
                    <motion.div
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 0.6 }}
                        animate={{ scale: 4, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        style={{
                            position: 'fixed',
                            left: ripple.x,
                            top: ripple.y,
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            border: `2px solid ${rippleColor}`,
                            pointerEvents: 'none',
                            zIndex: 9997,
                            translateX: '-50%',
                            translateY: '-50%',
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Lagging trail drop */}
            <motion.div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: trailX,
                    y: trailY,
                    width: dropSize * 0.6,
                    height: dropSize * 0.6,
                    borderRadius: '50%',
                    background: trailGradient,
                    filter: 'blur(4px)',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    opacity: opacity * 0.5,
                    translateX: '-50%',
                    translateY: '-50%',
                    transition: 'opacity 200ms ease, background 350ms ease',
                }}
            />

            {/* Main liquid drop */}
            <motion.div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    x: mouseX,
                    y: mouseY,
                    width: dropSize,
                    height: dropSize,
                    pointerEvents: 'none',
                    zIndex: 9999,
                    opacity,
                    translateX: '-50%',
                    translateY: '-50%',
                    scaleX,
                    scaleY,
                    rotate: rotation,
                    scale: clickScale,
                    transition: 'opacity 200ms ease',
                }}
            >
                {/* Outer glow halo */}
                <div style={{
                    position: 'absolute',
                    inset: isDark ? '-8px' : '-6px',
                    borderRadius: '50%',
                    background: isDark
                        ? 'radial-gradient(circle, rgba(0,200,240,0.35) 0%, transparent 70%)'
                        : 'none',
                    boxShadow: isDark ? 'none' : '4px 4px 12px rgba(163,177,198,0.3)',
                    filter: isDark ? 'blur(6px)' : 'none',
                    transition: 'all 350ms ease',
                }} />

                {/* Water drop body — organic blob wobble */}
                <motion.div
                    animate={{
                        borderRadius: [
                            '60% 40% 50% 50% / 50% 60% 40% 50%',
                            '50% 50% 40% 60% / 60% 40% 50% 50%',
                            '40% 60% 50% 50% / 50% 50% 60% 40%',
                            '60% 40% 50% 50% / 50% 60% 40% 50%',
                        ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{
                        width: '100%',
                        height: '100%',
                        background: dropGradient,
                        boxShadow: dropShadow,
                        backdropFilter: 'blur(2px)',
                        transition: 'background 350ms ease, box-shadow 350ms ease',
                    }}
                >
                    {/* Specular light highlight */}
                    <div style={{
                        position: 'absolute',
                        top: '18%',
                        left: '22%',
                        width: '32%',
                        height: '28%',
                        borderRadius: '50%',
                        background: specularColor,
                        transition: 'background 350ms ease',
                    }} />
                </motion.div>
            </motion.div>
        </>
    );
}
