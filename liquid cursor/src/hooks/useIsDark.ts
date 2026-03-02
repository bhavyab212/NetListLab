import { useState, useEffect } from 'react';

/**
 * useIsDark — Zero dependency dark-mode hook.
 *
 * Reads `data-theme="dark"` from `<html>` and watches for mutations.
 * Works out of the box with:
 *   • This package's own ThemeToggle
 *   • next-themes  (sets data-theme on <html>)
 *   • tailwindcss dark mode: class strategy  (via classList)
 *   • Any system that sets document.documentElement attribute / class
 *
 * Usage:
 *   const isDark = useIsDark();
 */
export function useIsDark(): boolean {
    const getIsDark = () => {
        const el = document.documentElement;
        // Check data-theme attribute first (most common pattern)
        if (el.getAttribute('data-theme') === 'dark') return true;
        if (el.getAttribute('data-theme') === 'light') return false;
        // Fallback: check tailwind 'dark' class
        if (el.classList.contains('dark')) return true;
        // Fallback: system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof document === 'undefined') return true; // SSR safe default
        return getIsDark();
    });

    useEffect(() => {
        // Watch for attribute/class changes on <html>
        const observer = new MutationObserver(() => {
            setIsDark(getIsDark());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'class'],
        });

        // Watch OS preference changes
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const onMqChange = () => setIsDark(getIsDark());
        mq.addEventListener('change', onMqChange);

        return () => {
            observer.disconnect();
            mq.removeEventListener('change', onMqChange);
        };
    }, []);

    return isDark;
}
