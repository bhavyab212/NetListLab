import { useState } from 'react';
import { PROJECTS } from '../data/projects';
import ProjectCard from './ProjectCard';

const CATEGORIES = ['Electronics', 'Software', 'Hardware', 'Robotics', 'AI/ML'];
const LEVELS = ['Any', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const ICONS: Record<string, string> = {
    Electronics: 'memory',
    Software: 'terminal',
    Hardware: 'precision_manufacturing',
    Robotics: 'smart_toy',
    'AI/ML': 'psychology'
};

export default function Dashboard() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState('Any');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProjects = PROJECTS.filter(p => {
        const matchesCategory = !selectedCategory || p.category === selectedCategory;
        const matchesLevel = selectedLevel === 'Any' || p.level === selectedLevel;
        const matchesSearch = !searchQuery || 
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesLevel && matchesSearch;
    });

    return (
        <div className="flex flex-col">
            {/* Filter Area */}
            <div className="filter-area flex flex-col gap-10">
                {/* Category Buttons */}
                <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-1">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`flex h-10 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-semibold shadow-lg transition-all active:scale-95 ${
                            selectedCategory === null
                                ? 'bg-primary text-white shadow-primary/20'
                                : 'neumorphic-pill'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                        All
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                            className={`flex h-10 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-all active:scale-95 ${
                                selectedCategory === cat
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'neumorphic-pill'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">{ICONS[cat]}</span>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Level & Sort Controls */}
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-text-muted-light/60 dark:text-text-muted-dark/60">
                            Filter Level
                        </span>
                        <div className="flex rounded-xl bg-black/5 dark:bg-black/40 p-1.5 border border-black/5 dark:border-white/5 shadow-inner">
                            {LEVELS.map(level => (
                                <button
                                    key={level}
                                    onClick={() => setSelectedLevel(level)}
                                    className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
                                        selectedLevel === level
                                            ? 'text-text-main-light dark:text-white bg-white dark:bg-white/10 shadow-sm'
                                            : 'text-text-muted-light dark:text-text-muted-dark hover:text-primary'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Sort by</span>
                        <button className="flex items-center gap-2 rounded-xl border border-black/5 dark:border-white/5 bg-white dark:bg-black/40 px-4 py-2 text-sm font-semibold text-text-main-light dark:text-white hover:border-primary/50 shadow-sm transition-colors">
                            <span className="material-symbols-outlined text-[18px] text-primary">trending_up</span>
                            Trending
                            <span className="material-symbols-outlined text-[18px] text-text-muted-light">expand_more</span>
                        </button>
                    </div>
                </div>

                {/* Search Input */}
                <div className="w-full">
                    <div className="relative group">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-text-muted-light dark:text-text-muted-dark group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[22px]">filter_list</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Filter results by tag, technology, or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full rounded-2xl border-0 bg-black/5 dark:bg-black/40 py-4 pl-14 pr-4 text-base placeholder-text-muted-light/50 dark:placeholder-text-muted-dark/40 focus:ring-1 focus:ring-primary/40 focus:bg-white dark:focus:bg-white/5 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="mt-28 pb-32">
                <div className="section-header-area">
                    <span className="material-symbols-outlined text-primary scale-110">local_fire_department</span>
                    <h2 className="text-2xl font-bold">Trending Projects</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map(p => (
                            <ProjectCard key={p.id} project={p} />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20">
                            <span className="material-symbols-outlined text-6xl text-text-muted-light dark:text-text-muted-dark/50 mb-4">search</span>
                            <p className="text-text-main-light dark:text-white text-lg font-medium">No projects found</p>
                            <p className="text-text-muted-light dark:text-text-muted-dark text-sm">Try adjusting your filters or search query</p>
                        </div>
                    )}
                </div>

                {/* Load More Button */}
                {filteredProjects.length > 0 && (
                    <div className="mt-24 flex justify-center">
                        <button className="btn-depth flex items-center gap-3 px-12 py-5 text-sm font-bold transition-all group">
                            <div className="absolute inset-0 bg-primary/10 dark:bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl"></div>
                            <span className="material-symbols-outlined text-primary relative z-10 text-[22px] transition-transform group-hover:rotate-180">add</span>
                            <span className="relative z-10">Explore More Projects</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
