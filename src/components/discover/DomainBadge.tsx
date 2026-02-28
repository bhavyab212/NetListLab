/**
 * Domain Badge Component
 * Shows project domain with color-coded styling and glow effect
 */

import React from 'react';
import { domains } from '../../mockData/domains';
import { DomainType } from '../../types/project';

interface DomainBadgeProps {
  domain: DomainType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outlined';
}

export default function DomainBadge({
  domain,
  size = 'md',
  variant = 'filled',
}: DomainBadgeProps) {
  const domainData = domains.find(d => d.id === domain);
  if (!domainData) return null;

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      fontSize: '0.75rem',
      padding: '4px 8px',
    },
    md: {
      fontSize: '0.875rem',
      padding: '6px 12px',
    },
    lg: {
      fontSize: '1rem',
      padding: '8px 16px',
    },
  };

  const filledStyle: React.CSSProperties = {
    backgroundColor: domainData.color,
    color: '#FFFFFF',
    boxShadow: `0 0 20px ${domainData.glow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
  };

  const outlinedStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: domainData.color,
    border: `1.5px solid ${domainData.color}`,
    boxShadow: `0 0 12px ${domainData.glow}`,
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: '9999px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        transition: 'all 150ms cubic-bezier(0.2, 0, 0, 1)',
        ...(variant === 'filled' ? filledStyle : outlinedStyle),
        ...sizeStyles[size],
      }}
    >
      <span>{domainData.emoji}</span>
      <span>{domainData.name}</span>
    </span>
  );
}
