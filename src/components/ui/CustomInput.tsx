"use client" ; 

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    error?: string;
    helperText?: string;
    onChange?: (value: string) => void;
    rightElement?: React.ReactNode;
}

export default function Input({
    label,
    error,
    helperText,
    type = 'text',
    onChange,
    rightElement,
    style,
    id,
    ...props
}: InputProps) {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    const wrapperStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: error ? 'var(--accent-coral)' : 'var(--text-secondary)',
        fontFamily: "'Inter', sans-serif",
        transition: 'color 150ms ease',
    };

    const inputWrapperStyle: React.CSSProperties = {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        paddingRight: isPassword || rightElement ? '44px' : '16px',
        borderRadius: '8px',
        border: `1px solid ${error ? 'var(--accent-coral)' : focused ? 'var(--accent-primary)' : 'var(--border-default)'}`,
        background: 'var(--bg-base)',
        color: 'var(--text-primary)',
        fontSize: '1rem',
        fontFamily: "'Inter', sans-serif",
        boxShadow: error
            ? '0 0 0 1px var(--accent-coral), 0 0 12px var(--glow-coral)'
            : focused
                ? '0 0 0 1px var(--accent-primary), 0 0 12px var(--glow-cyan)'
                : 'var(--shadow-neu-inset)',
        outline: 'none',
        transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
        ...style,
    };

    const toggleStyle: React.CSSProperties = {
        position: 'absolute',
        right: '12px',
        background: 'none',
        border: 'none',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        transition: 'color 150ms ease',
    };

    const helperStyle: React.CSSProperties = {
        fontSize: '0.75rem',
        color: error ? 'var(--accent-coral)' : 'var(--text-muted)',
        fontFamily: "'Inter', sans-serif",
    };

    return (
        <div style={wrapperStyle}>
            <label htmlFor={inputId} style={labelStyle}>{label}</label>
            <div style={inputWrapperStyle}>
                <input
                    id={inputId}
                    type={isPassword && showPassword ? 'text' : type}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={e => onChange?.(e.target.value)}
                    style={inputStyle}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={toggleStyle}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
                {rightElement && (
                    <div style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center' }}>
                        {rightElement}
                    </div>
                )}
            </div>
            {(error || helperText) && <span style={helperStyle}>{error || helperText}</span>}
        </div>
    );
}
