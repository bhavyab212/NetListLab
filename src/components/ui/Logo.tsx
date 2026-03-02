"use client" ; 

import Link from 'next/link';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
}

const sizes = {
    sm: { fontSize: '1.25rem', padding: '4px 0' },
    md: { fontSize: '1.5rem', padding: '8px 0' },
    lg: { fontSize: '2rem', padding: '12px 0' },
};

export default function Logo({ size = 'md' }: LogoProps) {
    const s = sizes[size];

    return (
        <Link href="/" style={{ textDecoration: 'none' }}>
            <div
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: s.fontSize,
                    padding: s.padding,
                    letterSpacing: '-0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    userSelect: 'none',
                }}
            >
                <span style={{ color: 'var(--accent-primary)' }}>Net</span>
                <span style={{ color: 'var(--text-primary)' }}>List</span>
                <span style={{ color: 'var(--accent-gold)' }}>Lab</span>
            </div>
        </Link>
    );
}
