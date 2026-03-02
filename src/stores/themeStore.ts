import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeState {
    theme: Theme;
    isDark: boolean;
    toggle: () => void;
    setTheme: (theme: Theme) => void;
}

// Read persisted theme or default to dark
function getInitialTheme(): Theme {
    if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('netlistlab-theme');
        if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: getInitialTheme(),
    isDark: getInitialTheme() === 'dark',

    toggle: () => {
        set(state => {
            const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('netlistlab-theme', next);
            document.documentElement.setAttribute('data-theme', next);
            return { theme: next, isDark: next === 'dark' };
        });
    },

    setTheme: (theme) => {
        localStorage.setItem('netlistlab-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme, isDark: theme === 'dark' });
    },
}));
