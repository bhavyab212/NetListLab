import type { Config } from 'tailwindcss';
import {
    colors,
    fontFamily,
    fontSize,
    spacing,
    borderRadius,
    boxShadow,
    transitionDuration,
    transitionTimingFunction,
    maxWidth,
} from './src/styles/tokens';

const config: Config = {
    content: [
        './src/**/*.{ts,tsx,js,jsx}',
        './app/**/*.{ts,tsx,js,jsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            // ─── COLORS ────────────────────────────────────────
            colors: {
                // Backgrounds
                base: {
                    DEFAULT: colors.dark.base,
                    light: colors.light.base,
                },
                surface: {
                    DEFAULT: colors.dark.surface,
                    light: colors.light.surface,
                },
                elevated: {
                    DEFAULT: colors.dark.elevated,
                    light: colors.light.elevated,
                },

                // Text
                'text-primary': {
                    DEFAULT: colors.text.primary,
                    light: colors.textLight.primary,
                },
                'text-secondary': {
                    DEFAULT: colors.text.secondary,
                    light: colors.textLight.secondary,
                },
                'text-muted': {
                    DEFAULT: colors.text.muted,
                    light: colors.textLight.muted,
                },

                // Borders
                'border-default': {
                    DEFAULT: colors.border.default,
                    light: colors.border.defaultLight,
                },
                'border-focus': {
                    DEFAULT: colors.border.focus,
                    light: colors.border.focusLight,
                },

                // Accents
                cyan: {
                    DEFAULT: colors.accent.primary,
                    hover: colors.accent.primaryHover,
                },
                blue: {
                    DEFAULT: colors.accent.blue,
                },
                gold: {
                    DEFAULT: colors.accent.gold,
                    hover: colors.accent.goldHover,
                },
                green: {
                    DEFAULT: colors.accent.green,
                },
                coral: {
                    DEFAULT: colors.accent.coral,
                    hover: colors.accent.coralHover,
                },
                violet: {
                    DEFAULT: colors.accent.violet,
                },

                // Domains
                domain: {
                    electronics: colors.domain.electronics,
                    software: colors.domain.software,
                    mechanical: colors.domain.mechanical,
                    design: colors.domain.design,
                    aiml: colors.domain.aiml,
                    robotics: colors.domain.robotics,
                    research: colors.domain.research,
                },
            },

            // ─── FONT FAMILY ──────────────────────────────────
            fontFamily: {
                heading: fontFamily.heading,
                body: fontFamily.body,
                technical: fontFamily.technical,
                code: fontFamily.code,
            },

            // ─── FONT SIZE ────────────────────────────────────
            fontSize: {
                hero: fontSize.hero,
                h1: fontSize.h1,
                h2: fontSize.h2,
                h3: fontSize.h3,
                h4: fontSize.h4,
                body: fontSize.body,
                sm: fontSize.sm,
                xs: fontSize.xs,
                code: fontSize.code,
            },

            // ─── SPACING ──────────────────────────────────────
            spacing: spacing,

            // ─── BORDER RADIUS ────────────────────────────────
            borderRadius: {
                xs: borderRadius.xs,
                sm: borderRadius.sm,
                md: borderRadius.md,
                lg: borderRadius.lg,
                full: borderRadius.full,
            },

            // ─── BOX SHADOW ───────────────────────────────────
            boxShadow: boxShadow,

            // ─── TRANSITIONS ──────────────────────────────────
            transitionDuration: transitionDuration,
            transitionTimingFunction: transitionTimingFunction,

            // ─── MAX WIDTH ────────────────────────────────────
            maxWidth: maxWidth,

            // ─── CUSTOM ANIMATIONS ────────────────────────────
            keyframes: {
                'blob-morph': {
                    '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
                    '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
                },
                'glow-pulse': {
                    '0%, 100%': { opacity: '0.25' },
                    '50%': { opacity: '0.55' },
                },
                'shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '20%, 60%': { transform: 'translateX(-6px)' },
                    '40%, 80%': { transform: 'translateX(6px)' },
                },
            },
            animation: {
                'blob-morph': 'blob-morph 10s ease-in-out infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'shake': 'shake 0.15s ease-in-out 3',
            },
        },
    },
    plugins: [],
};

export default config;
