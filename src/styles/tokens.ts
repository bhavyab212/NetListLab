/**
 * NetListLab — Design Tokens
 *
 * Single source of truth for all design system values.
 * Derived from docs/design/BRAND.md
 *
 * Usage: Import into tailwind.config.ts to extend Tailwind.
 */

// ─── COLOR TOKENS ──────────────────────────────────────────

export const colors = {
  // Background (Dark Mode)
  dark: {
    base: '#141310',
    surface: '#1A1916',
    elevated: '#211F1B',
  },

  // Background (Light Mode)
  light: {
    base: '#F5F6FB',
    surface: '#EEEEF6',
    elevated: '#E8E9F2',
  },

  // Text (Dark Mode)
  text: {
    primary: '#F5F5F0',
    secondary: '#A8A49C',
    muted: '#6B6760',
  },

  // Text (Light Mode)
  textLight: {
    primary: '#141310',
    secondary: '#5C5A55',
    muted: '#9C9A95',
  },

  // Borders
  border: {
    default: '#2A2720',
    defaultLight: '#D5D5E0',
    focus: '#00C8F0',
    focusLight: '#00A8D0',
  },

  // Accents
  accent: {
    primary: '#00C8F0',
    primaryHover: '#00B0D8',
    blue: '#3B6EF0',
    gold: '#F5A623',
    goldHover: '#E09510',
    green: '#00E87A',
    coral: '#F43F5E',
    coralHover: '#E0354F',
    violet: '#8B5CF6',
  },

  // Domain Badges
  domain: {
    electronics: '#00C8F0',
    software: '#3B6EF0',
    mechanical: '#F5A623',
    design: '#F43F5E',
    aiml: '#8B5CF6',
    robotics: '#00E87A',
    research: '#94A3B8',
  },
} as const;

// ─── TYPOGRAPHY TOKENS ─────────────────────────────────────

export const fontFamily = {
  heading: ['Space Grotesk', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
  technical: ['Geist', 'sans-serif'],
  code: ['JetBrains Mono', 'monospace'],
} as const;

export const fontSize = {
  hero: ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
  h1: ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
  h2: ['1.75rem', { lineHeight: '1.25', fontWeight: '600' }],
  h3: ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
  h4: ['1.125rem', { lineHeight: '1.35', fontWeight: '500' }],
  body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
  sm: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
  xs: ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
  code: ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
} as const;

// ─── SPACING TOKENS (Base-4) ───────────────────────────────

export const spacing = {
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
  '20': '80px',
  '24': '96px',
} as const;

// ─── BORDER RADIUS TOKENS ──────────────────────────────────

export const borderRadius = {
  xs: '4px',
  sm: '8px',
  md: '10px',
  lg: '12px',
  full: '9999px',
} as const;

// ─── SHADOW TOKENS ─────────────────────────────────────────

export const boxShadow = {
  // Standard shadows
  none: 'none',
  sm: '0 1px 3px rgba(0,0,0,0.2)',
  md: '0 4px 12px rgba(0,0,0,0.3)',
  lg: '0 8px 24px rgba(0,0,0,0.4)',

  // Neumorphic (Dark Mode)
  'neu-raised': '8px 8px 16px #0A0A08, -8px -8px 16px #2A2720',
  'neu-inset': 'inset 4px 4px 8px #0A0A08, inset -4px -4px 8px #2A2720',
  'neu-pressed': 'inset 2px 2px 4px #0A0A08, inset -2px -2px 4px #2A2720',

  // Neumorphic (Light Mode)
  'neu-raised-light': '8px 8px 16px #C8C8D6, -8px -8px 16px #FFFFFF',
  'neu-inset-light': 'inset 4px 4px 8px #C8C8D6, inset -4px -4px 8px #FFFFFF',
  'neu-pressed-light': 'inset 2px 2px 4px #C8C8D6, inset -2px -2px 4px #FFFFFF',

  // Glow effects
  'glow-cyan': '0 0 20px rgba(0,200,240,0.25)',
  'glow-gold': '0 0 20px rgba(245,166,35,0.25)',
  'glow-coral': '0 0 20px rgba(244,63,94,0.25)',
  'glow-green': '0 0 20px rgba(0,232,122,0.25)',
  'glow-violet': '0 0 20px rgba(139,92,246,0.25)',
  'glow-blue': '0 0 20px rgba(59,110,240,0.25)',
} as const;

// ─── ANIMATION TOKENS ──────────────────────────────────────

export const transitionDuration = {
  instant: '100ms',
  fast: '150ms',
  normal: '250ms',
  smooth: '400ms',
  slow: '600ms',
  ambient: '10000ms',
} as const;

export const transitionTimingFunction = {
  snappy: 'cubic-bezier(0.2, 0, 0, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  cinematic: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Framer Motion spring configs (not used in Tailwind, but exported for consistency)
export const springConfig = {
  snappy: { stiffness: 500, damping: 30 },
  smooth: { stiffness: 300, damping: 20 },
  bouncy: { stiffness: 200, damping: 15 },
} as const;

// ─── LAYOUT TOKENS ─────────────────────────────────────────

export const maxWidth = {
  'auth': '480px',
  'settings': '900px',
  'content': '1200px',
  'wide': '1440px',
  'full': '100%',
} as const;

// ─── DOMAIN BADGE GLOW MAP ─────────────────────────────────

export const domainGlow = {
  electronics: 'rgba(0,200,240,0.35)',
  software: 'rgba(59,110,240,0.35)',
  mechanical: 'rgba(245,166,35,0.35)',
  design: 'rgba(244,63,94,0.35)',
  aiml: 'rgba(139,92,246,0.35)',
  robotics: 'rgba(0,232,122,0.35)',
  research: 'rgba(148,163,184,0.25)',
} as const;
