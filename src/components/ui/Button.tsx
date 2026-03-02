"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    isLoading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
        background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-blue) 100%)',
        color: '#FFFFFF',
        boxShadow: 'var(--shadow-neu-raised), inset 0 1px 0 rgba(255,255,255,0.2)',
        border: 'none',
    },
    secondary: {
        background: 'transparent',
        color: 'var(--accent-primary)',
        boxShadow: 'none',
        border: '1px solid var(--accent-primary)',
    },
    ghost: {
        background: 'transparent',
        color: 'var(--text-secondary)',
        boxShadow: 'none',
        border: 'none',
    },
    danger: {
        background: 'var(--accent-coral)',
        color: '#FFFFFF',
        boxShadow: 'var(--shadow-neu-raised), inset 0 1px 0 rgba(255,255,255,0.2)',
        border: 'none',
    },
    gold: {
        background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-coral) 100%)',
        color: '#FFFFFF',
        boxShadow: 'var(--shadow-neu-raised), inset 0 1px 0 rgba(255,255,255,0.2)',
        border: 'none',
    },
};

const hoverMap: Record<ButtonVariant, Record<string, string | number>> = {
    primary: {
        boxShadow: 'var(--shadow-neu-raised), inset 0 1px 0 rgba(255,255,255,0.3), var(--glow-cyan)',
        filter: 'brightness(1.1)',
    },
    secondary: {
        boxShadow: 'var(--glow-cyan)',
        background: 'rgba(0, 200, 240, 0.08)',
    },
    ghost: {
        color: 'var(--text-primary)',
    },
    danger: {
        boxShadow: 'var(--shadow-neu-raised), inset 0 1px 0 rgba(255,255,255,0.3), var(--glow-coral)',
        filter: 'brightness(1.1)',
    },
    gold: {
        boxShadow: 'var(--shadow-neu-raised), inset 0 1px 0 rgba(255,255,255,0.3), var(--glow-gold)',
        filter: 'brightness(1.1)',
    },
};

export default function Button({
    variant = 'primary',
    isLoading = false,
    fullWidth = false,
    icon,
    children,
    disabled,
    onClick,
    style,
    ...props
}: ButtonProps) {
    const [ripples, setRipples] = useState<{ x: number, y: number, size: number, id: number }[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || isLoading) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const newRipple = { x, y, size, id: Date.now() };

        setRipples(prev => [...prev, newRipple]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);

        if (onClick) onClick(e);
    };

    const baseStyle: React.CSSProperties = {
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 24px',
        borderRadius: '10px',
        fontSize: '1rem',
        fontWeight: 500,
        fontFamily: "'Space Grotesk', sans-serif",
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
        letterSpacing: '0.01em',
        ...variantStyles[variant],
        ...style,
    };

    return (
        <motion.button
            style={baseStyle}
            whileHover={disabled || isLoading ? undefined : hoverMap[variant]}
            whileTap={disabled || isLoading ? undefined : {
                boxShadow: 'var(--shadow-neu-pressed), inset 0px 8px 24px rgba(0,0,0,0.3)',
                scale: 0.88,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 12, mass: 0.8 }}
            disabled={disabled || isLoading}
            {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
            onClick={handleClick}
        >
            <AnimatePresence>
                {ripples.map(ripple => (
                    <motion.span
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 3.5, opacity: 0 }}
                        transition={{ duration: 0.7, ease: "circOut" }}
                        style={{
                            position: 'absolute',
                            left: ripple.x,
                            top: ripple.y,
                            width: ripple.size,
                            height: ripple.size,
                            backgroundColor: variant === 'ghost' || variant === 'secondary' ? 'rgba(0, 200, 240, 0.2)' : 'rgba(255, 255, 255, 0.4)',
                            borderRadius: '50%',
                            pointerEvents: 'none',
                        }}
                    />
                ))}
            </AnimatePresence>

            <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {isLoading ? (
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                ) : icon ? (
                    icon
                ) : null}
                {isLoading ? null : children}
            </span>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </motion.button>
    );
}
