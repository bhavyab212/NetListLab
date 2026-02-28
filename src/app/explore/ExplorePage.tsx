import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Project {
    id: number;
    title: string;
    author: string;
    authorAvatar: string;
    description: string;
    image: string;
    category: string;
    categoryStyles: string;
    level: string;
    tags: string[];
    stars: string;
    views: string;
    comments: string;
}

const ProjectCard = ({ project }: { project: Project }) => {
    return (
        <article className="group relative flex flex-col card-surface">
            <div className="relative aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-900">
                <img 
                    alt={project.title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    src={project.image}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[4px]">
                    <span className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white dark:text-black dark:bg-white shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        View Project 
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </span>
                </div>
                <span className={`absolute right-3 top-3 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${project.categoryStyles}`}>
                    {project.category}
                </span>
                <span className="absolute bottom-3 left-3 rounded-lg bg-white/80 dark:bg-black/60 border border-black/5 dark:border-white/10 px-3 py-1.5 text-[10px] font-bold text-gray-900 dark:text-white backdrop-blur-md">
                    {project.level}
                </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center gap-3">
                    <img alt="Avatar" className="size-7 rounded-full object-cover ring-2 ring-black/5 dark:ring-white/5" src={project.authorAvatar}/>
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer">
                        {project.author}
                    </span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {project.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2">
                    {project.description}
                </p>
                <div className="mb-6 flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                        <span key={tag} className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-5 text-xs font-medium text-gray-600 dark:text-gray-400">
                    <div className="flex gap-5">
                        <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined text-[18px]">star</span> {project.stars}</span>
                        <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined text-[18px]">visibility</span> {project.views}</span>
                    </div>
                    <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined text-[18px]">chat_bubble</span> {project.comments}</span>
                </div>
            </div>
        </article>
    );
};

const Layout = ({ children, isDark, toggleTheme }: { children: React.ReactNode; isDark: boolean; toggleTheme: () => void }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="fixed top-8 left-0 right-0 z-[60] px-6 lg:px-12 flex justify-center pointer-events-none">
                <header className="glass-nav pointer-events-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-6 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-white shadow-md shadow-primary/10">
                            <span className="material-symbols-outlined text-xl font-bold">bolt</span>
                        </div>
                        <div className="flex flex-col -gap-1">
                            <h1 className="text-xl font-bold tracking-tight leading-none">NetListLab</h1>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-bold">Portfolio & Lab</span>
                        </div>
                    </div>
                    
                    <div className="hidden max-w-[360px] flex-1 lg:block mx-8">
                        <div className="relative group">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600 dark:text-gray-400">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input className="block h-9 w-full rounded-full border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 py-2 pl-10 pr-12 text-sm focus:border-primary/50 focus:bg-white dark:focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all duration-200" placeholder="Search projects..." type="text"/>
                            <div className="absolute inset-y-0 right-3 flex items-center">
                                <kbd className="inline-flex h-5 items-center rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/30 px-1.5 font-sans text-[10px] font-medium text-gray-600 dark:text-gray-400">ctrl k</kbd>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <nav className="hidden md:flex items-center gap-6 mr-4">
                            <Link to="/explore" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">Explore</Link>
                            <a className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href="#">Projects</a>
                            <a className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href="#">Community</a>
                        </nav>
                        <div className="h-6 w-px bg-black/5 dark:bg-white/10 hidden md:block"></div>
                        <button className="relative rounded-full p-2 text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-[22px]">notifications</span>
                            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-primary ring-2 ring-white dark:ring-[#1C1C24]"></span>
                        </button>
                        <button onClick={toggleTheme} className="relative rounded-full p-2 text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-[22px]">
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                        <button className="relative size-9 overflow-hidden rounded-full ring-2 ring-black/5 dark:ring-white/10 transition-all hover:ring-primary">
                            <img alt="User Avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFbj86JNz6RrHYhBtcL1Q8wiLNxl5HABchr81oHM_gglUqnqFT5kHJSSoqlW3C79luQh6q1jwCE0BG36hi7IQ0IG13TzBfl87ZqaHO39-e_ZQS4cY5BczyJu1vLizmi1XYEeozAloKzTOFkKjVyqf1OL6iFIYpt3XjDJdr_ZR6VGFDVgh8U46DswWZhyrJ9m_AbF4q-JpFUxn1g3RfdKQIiauJwHxnH_RXx6KiYD07zlSc_jWprLHyheIiiI_Hf5BmFKM-n4aOmZ4"/>
                        </button>
                    </div>
                </header>
            </div>

            <main className="flex-1 w-full mx-auto max-w-[1440px] px-6 lg:px-12 pt-40">
                {children}
            </main>

            <footer className="border-t border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/80 backdrop-blur-md py-12 text-center mt-auto">
                <div className="mx-auto max-w-[1440px] px-6">
                    <p className="text-sm font-medium text-gray-600/80 dark:text-gray-400/60">© 2026 NetListLab. Built with precision for engineers.</p>
                </div>
            </footer>
        </div>
    );
};

const Dashboard = () => {
    const [isDark, setIsDark] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const toggleTheme = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const projects: Project[] = [
        {
            id: 1,
            title: "ESP32 Radar Intrusion",
            author: "@tech_wizard",
            authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzkYHfcPjgeACqyOLWbJS9MhC5QMgy1uh15Tsax-EIf546egOOO7XtQHP9G0bJcDKZoek0uOiquV-qOyjkImVA-JRufc9xORL6WtEb-roA1GZ_PqEg17mk67qqL2s6etGEWsb2KQPpg7UHcvX-Ml8U9udV0w_e_AoVCUDmizEdfBs98Uu4tBZDp8NulErDhEql2U5uDkTq5pOlvtkUF9tExuqKP-6G-A6Wm7N7RbQ46Xm0XstM44xugNZ8rKyyued4JkuTcXzc2C8",
            description: "A compact, low-power intrusion detection system using ESP32 and millimeter-wave radar sensors for precise motion tracking.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_5pNvx2FK3aW-ULYnuDYuk-caOdCm8NrUFbIMPqIVCvfBqijgLBZQwRp1Rtu-TFBf1gHlx1goKjOx9dptyOPPh82a9jU5o3CN3bRX0pQbWUUvk2qgoGSGNFqI280b3B6mCyCp4baBQH0Wq2f9nQVCWNN_7c2ig5ENgup2RoR--iCjV0rTCa5Upx7x76dWVm7xqAQTEX_J3E-iYifqT4cRYAScg04hm8_7kiYTFHBHuaNtu0uIOmDfXAaM-dXLStAiHV_SfiylR-U",
            category: "Electronics",
            categoryStyles: "bg-emerald-50 text-emerald-700 border-emerald-100/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
            level: "Advanced",
            tags: ["ESP32", "C++", "IoT"],
            stars: "1.2k",
            views: "4.5k",
            comments: "32"
        },
        {
            id: 2,
            title: "VLSI Cache Controller",
            author: "@sarah_circuits",
            authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzzWoxWAP0kmLiysmjVRC8hDu-ZQgNzsJubFAbjSzr-JAVjIP44OxU05ZcA0Owla1E0PuJa9Pl7VTbz2mOZ-TU4GusxN4NpEsZYeb1U2TIF7qFk946cGGcdYBHKNWJph67fgRLy3_NdDW0z_MN5LA8pkbCPKSBJg4VgfdSpkBkpvcTSGogbKDrTthPU5Q_H8MKNkJ8Mi040NoDz-0TNKlKcdD7nOaBFViuYTNIuBLohCa7fk14pLqMcxlfgkeqU93SS45yH8hIiqI",
            description: "High-performance L2 cache controller design implemented in Verilog with optimized replacement policies.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhrE-XSrbIWi0YyE1w6h72ArUmnegLxq4et2LoO7LuTH5iAU7ebnMFIr0Jr96SeLWTtaJu5d98jLxjD2kQ4UahGgAu5PFreWZ7eiwUXhqxNa6-V6PoMfgJ3g-CxUBioIHdd6QJ66jGIy1GpQvN1sYN3G1jGQQq5V7Gh7P-qxVAwMr0cnGFBz4wsTLHAY2PJBkQyG3aY97k2S5cZ8CQmPLHBYc244LT4Eakpof58Al_JbkUQp-G3V5zldtaaGPwuMAWVx1Ml-j26cA",
            category: "Hardware",
            categoryStyles: "bg-blue-50 text-blue-700 border-blue-100/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30",
            level: "Expert",
            tags: ["Verilog", "FPGA"],
            stars: "892",
            views: "2.1k",
            comments: "14"
        },
        {
            id: 3,
            title: "Autonomous Nav Stack",
            author: "@drone_guy",
            authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4GeXSBsaDsraoFAWu9m-yFhTWIe-J_pwSVkVnV5Crf9YNBmtFQD0tAf-QpdzsdObDcme-M8zjWgUebAulHlSfZ7H1QQNV8vLCZztZadbL-Kqc0tRYW60AeK1gI1junYonEHvLAKZ1GkghINQQwJMRwMzaQ2abxcWyZ-dk7Gsan3esxRBkX4RswIe-y1slVexTLFKCkgs3w1JKydlKajMCpYCLXIn7EJwehqELd-GcyqVRLLa8wNkvlSfa0HXOr1GKsMmNzt2gfGE",
            description: "Complete navigation stack for quadcopters featuring SLAM, obstacle avoidance, and path planning using ROS2.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuMll4CqvUrVlLD2DWwC77DjGaFLzfo5EnJBMNbxtrPnW3_UDZO7AOQn-rAyVBDB4cqzDIzTcg3lzn9bVkdYGpF2tMaxDMuDNeouYD9jZIQ-SDi4jH9XkVi4-CStR3ToYl1YLsMWEAZQxQ1edZWXqm0bUtcVN9uTBE__iUfCgt1_3BfF5XqPgulMP-V3L_4PdOKnEIhpWfG5cjpFhtVQjKKYgzh35wlokeeF5d6ULeFLN8x2doxrqfbYy6I5988BUIwKvC3FwnSmE",
            category: "Robotics",
            categoryStyles: "bg-orange-50 text-orange-700 border-orange-100/50 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30",
            level: "Intermediate",
            tags: ["ROS2", "Python"],
            stars: "543",
            views: "1.8k",
            comments: "21"
        }
    ];

    return (
        <Layout isDark={isDark} toggleTheme={toggleTheme}>
            <div className="flex flex-col">
                <div className="filter-area flex flex-col gap-10">
                    <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-1">
                        <button className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/20 active:scale-95">
                            <span className="material-symbols-outlined text-[18px]">bolt</span>
                            All
                        </button>
                        {['Electronics', 'Software', 'Hardware', 'Robotics', 'AI/ML'].map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => setSelectedCategory(cat)}
                                className={`neumorphic-pill ${selectedCategory === cat ? 'border-primary/50 text-primary' : ''}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    {cat === 'Electronics' ? 'memory' : cat === 'Software' ? 'terminal' : cat === 'Hardware' ? 'precision_manufacturing' : cat === 'Robotics' ? 'smart_toy' : 'psychology'}
                                </span>
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-600/60 dark:text-gray-400/60">Filter Level</span>
                            <div className="flex rounded-xl bg-black/5 dark:bg-black/40 p-1.5 border border-black/5 dark:border-white/5 shadow-inner">
                                <button className="rounded-lg px-4 py-1.5 text-xs font-semibold text-gray-900 dark:text-white bg-white dark:bg-white/10 shadow-sm">Any</button>
                                {['Beginner', 'Intermediate', 'Expert'].map(l => (
                                    <button key={l} className="rounded-lg px-4 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">{l}</button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sort by</span>
                            <button className="flex items-center gap-2 rounded-xl border border-black/5 dark:border-white/5 bg-white dark:bg-black/40 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:border-primary/50 shadow-sm transition-colors">
                                <span className="material-symbols-outlined text-[18px] text-primary">trending_up</span>
                                Trending
                                <span className="material-symbols-outlined text-[18px] text-gray-600">expand_more</span>
                            </button>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="relative group">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 dark:text-gray-400 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[22px]">filter_list</span>
                            </div>
                            <input className="block w-full rounded-2xl border-0 bg-black/5 dark:bg-black/40 py-4 pl-14 pr-4 text-base placeholder-gray-600/50 dark:placeholder-gray-400/40 focus:ring-1 focus:ring-primary/40 focus:bg-white dark:focus:bg-white/5 transition-all" placeholder="Filter results by tag, technology, or keywords..." type="text"/>
                        </div>
                    </div>
                </div>

                <div className="mt-28 pb-32">
                    <div className="section-header-area">
                        <span className="material-symbols-outlined text-primary scale-110">local_fire_department</span>
                        <h2 className="text-2xl font-bold">Trending Projects</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {projects.map(p => (
                            <ProjectCard key={p.id} project={p} />
                        ))}
                    </div>

                    <div className="mt-24 flex justify-center">
                        <button className="btn-depth flex items-center gap-3 px-12 py-5 text-sm font-bold transition-all group">
                            <div className="absolute inset-0 bg-primary/10 dark:bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="material-symbols-outlined text-primary relative z-10 text-[22px] transition-transform group-hover:rotate-180">add</span>
                            <span className="relative z-10">Explore More Projects</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
