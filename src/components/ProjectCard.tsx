import { Project } from '../data/projects';

export default function ProjectCard({ project }: { project: Project }) {
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
                <span className="absolute bottom-3 left-3 rounded-lg bg-white/80 dark:bg-black/60 border border-black/5 dark:border-white/10 px-3 py-1.5 text-[10px] font-bold text-text-main-light dark:text-white backdrop-blur-md">
                    {project.level}
                </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center gap-3">
                    <img
                        alt="Avatar"
                        className="size-7 rounded-full object-cover ring-2 ring-black/5 dark:ring-white/5"
                        src={project.authorAvatar}
                    />
                    <span className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors cursor-pointer">
                        {project.author}
                    </span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-text-main-light dark:text-white group-hover:text-primary transition-colors">
                    {project.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-text-muted-light dark:text-text-muted-dark/80 line-clamp-2">
                    {project.description}
                </p>
                <div className="mb-6 flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                        <span
                            key={tag}
                            className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-5 text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                    <div className="flex gap-5">
                        <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-[18px]">star</span> {project.stars}
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-[18px]">visibility</span> {project.views}
                        </span>
                    </div>
                    <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]">chat_bubble</span> {project.comments}
                    </span>
                </div>
            </div>
        </article>
    );
}
