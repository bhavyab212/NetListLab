import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
    isDark: boolean;
    toggleTheme: () => void;
}

export default function Layout({ children, isDark, toggleTheme }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="fixed top-8 left-0 right-0 z-[60] px-6 lg:px-12 flex justify-center pointer-events-none">
                <header className="glass-nav pointer-events-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6 rounded-2xl">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-white shadow-md shadow-primary/10">
                            <span className="material-symbols-outlined text-xl font-bold">bolt</span>
                        </div>
                        <div className="flex flex-col -gap-1">
                            <h1 className="text-xl font-bold tracking-tight leading-none">NetListLab</h1>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-bold">Portfolio & Lab</span>
                        </div>
                    </div>

                    {/* Search - Hidden on mobile */}
                    <div className="hidden max-w-[360px] flex-1 lg:block mx-8">
                        <div className="relative group">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted-light dark:text-text-muted-dark">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input
                                className="block h-9 w-full rounded-full border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 py-2 pl-10 pr-12 text-sm focus:border-primary/50 focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200"
                                placeholder="Search projects..."
                                type="text"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center">
                                <kbd className="inline-flex h-5 items-center rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/30 px-1.5 font-sans text-[10px] font-medium text-text-muted-light dark:text-text-muted-dark">
                                    ctrl k
                                </kbd>
                            </div>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Navigation - Hidden on mobile */}
                        <nav className="hidden md:flex items-center gap-6 mr-4">
                            <Link
                                to="/explore"
                                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                            >
                                Explore
                            </Link>
                            <a
                                href="#"
                                className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
                            >
                                Projects
                            </a>
                            <a
                                href="#"
                                className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
                            >
                                Community
                            </a>
                        </nav>
                        <div className="h-6 w-px bg-black/5 dark:bg-white/10 hidden md:block"></div>

                        {/* Notifications */}
                        <button className="relative rounded-full p-2 text-text-muted-light dark:text-text-muted-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-[22px]">notifications</span>
                            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-primary ring-2 ring-white dark:ring-[#1C1C24]"></span>
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="relative rounded-full p-2 text-text-muted-light dark:text-text-muted-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[22px]">
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>

                        {/* User Avatar */}
                        <button className="relative size-9 overflow-hidden rounded-full ring-2 ring-black/5 dark:ring-white/10 transition-all hover:ring-primary">
                            <img
                                alt="User Avatar"
                                className="h-full w-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFbj86JNz6RrHYhBtcL1Q8wiLNxl5HABchr81oHM_gglUqnqFT5kHJSSoqlW3C79luQh6q1jwCE0BG36hi7IQ0IG13TzBfl87ZqaHO39-e_ZQS4cY5BczyJu1vLizmi1XYEeozAloKzTOFkKjVyqf1OL6iFIYpt3XjDJdr_ZR6VGFDVgh8U46DswWZhyrJ9m_AbF4q-JpFUxn1g3RfdKQIiauJwHxnH_RXx6KiYD07zlSc_jWprLHyheIiiI_Hf5BmFKM-n4aOmZ4"
                            />
                        </button>
                    </div>
                </header>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full mx-auto max-w-[1440px] px-6 lg:px-12 pt-40">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/80 backdrop-blur-md py-12 text-center mt-auto">
                <div className="mx-auto max-w-[1440px] px-6">
                    <p className="text-sm font-medium text-text-muted-light/80 dark:text-text-muted-dark/60">
                        © 2026 NetListLab. Built with precision for engineers.
                    </p>
                </div>
            </footer>
        </div>
    );
}
