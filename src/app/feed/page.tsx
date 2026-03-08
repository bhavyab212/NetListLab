"use client";

import { useState, useEffect } from "react";
import {
    Star, GitFork, MessageSquare, Bookmark, ArrowLeft,
    Sun, Moon, Plus, Flame, Users,
    ExternalLink, Loader2
} from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { motion, AnimatePresence } from "framer-motion";
import CircuitBackground from "@/components/ui/CircuitBackground";
import LiquidCursor from "@/components/ui/LiquidCursor";
import LiquidBlob from "@/components/ui/LiquidBlob";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, buildQueryString } from "@/lib/api";
import { ApiProject, ApiUser } from "@/lib/api-types";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
const timeAgo = (iso: string) => {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d}d ago`;
};

const getCategoryStyles = (type: string) => {
    const map: Record<string, string> = {
        Analog: "text-rose-500 bg-rose-500/10 border-rose-500/20",
        Digital: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        "Mixed-Signal": "text-violet-500 bg-violet-500/10 border-violet-500/20",
        "RF/Microwave": "text-amber-500 bg-amber-500/10 border-amber-500/20",
        Power: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    };
    return map[type] ?? "text-primary bg-primary/10 border-primary/20";
};

// ─── Feed Card ────────────────────────────────────────────────────────────────
const FeedCard = ({
    project,
    onFork,
}: {
    project: ApiProject;
    onFork: (project: ApiProject) => void;
}) => {
    const [starred, setStarred] = useState(false);
    const [starCount, setStarCount] = useState(project.star_count);
    const [bookmarked, setBookmarked] = useState(false);

    const author = project.author;
    const authorUsername = author?.username ?? "unknown";
    const authorAvatar = author?.avatar_url ?? `https://i.pravatar.cc/100?u=${project.author_id}`;
    const authorName = author?.full_name ?? authorUsername;
    const categoryStyles = getCategoryStyles(project.project_type);

    const handleStar = async () => {
        setStarred(s => !s);
        setStarCount(c => starred ? c - 1 : c + 1);
        try {
            await api.toggleStar(project.id);
        } catch {
            // revert on error
            setStarred(s => !s);
            setStarCount(c => starred ? c + 1 : c - 1);
        }
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-[28px] overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
        >
            {/* Author row */}
            <div className="flex items-center gap-4 p-6 pb-4">
                <Link href={`/user/${authorUsername}`}>
                    <img src={authorAvatar} alt={authorName} className="w-12 h-12 rounded-full border-2 border-border hover:border-primary transition-all" />
                </Link>
                <div className="flex-1">
                    <Link href={`/user/${authorUsername}`} className="text-sm font-black text-foreground hover:text-primary transition-colors">{authorName}</Link>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">@{authorUsername}</span>
                        <span className="text-muted-foreground/30">·</span>
                        <span className="text-[10px] font-bold text-muted-foreground/40">{timeAgo(project.created_at)}</span>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${categoryStyles}`}>{project.project_type}</span>
            </div>

            {/* Image */}
            <Link href={`/project/${project.id}`}>
                <div className="mx-5 rounded-[20px] overflow-hidden aspect-[16/9] group cursor-pointer">
                    <img
                        src={project.cover_image_url ?? `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80`}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
            </Link>

            {/* Content */}
            <div className="p-6">
                <Link href={`/project/${project.id}`}>
                    <h3 className="text-xl font-black font-display text-foreground hover:text-primary transition-colors mb-2 leading-tight">{project.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground font-medium line-clamp-2 mb-5 leading-relaxed opacity-80">{project.tagline ?? project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.slice(0, 4).map(t => (
                        <span key={t} className="px-3 py-1 rounded-xl bg-muted/60 border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground">{t}</span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-border/50 pt-5">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleStar}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${starred ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-muted/40 text-muted-foreground border border-border hover:text-amber-500"}`}
                        >
                            <Star size={13} className={starred ? "fill-amber-500" : ""} /> {fmt(starCount)}
                        </button>
                        <Link href={`/project/${project.id}#comments`}>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/40 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                                <MessageSquare size={13} /> {project.comment_count}
                            </button>
                        </Link>
                        <button
                            onClick={() => onFork(project)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/40 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
                        >
                            <GitFork size={13} /> {fmt(project.fork_count)}
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { setBookmarked(b => !b); toast.success(bookmarked ? "Removed" : "Saved to library"); }}
                            className={`p-2.5 rounded-full border ${bookmarked ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted/40 border-border text-muted-foreground hover:text-primary"} transition-all`}
                        >
                            <Bookmark size={14} className={bookmarked ? "fill-primary" : ""} />
                        </button>
                        <Link href={`/project/${project.id}`}>
                            <button className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                                <ExternalLink size={12} /> View
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

// ─── Trending Sidebar ─────────────────────────────────────────────────────────
const TrendingSidebar = ({ projects }: { projects: ApiProject[] }) => {
    const top = [...projects].sort((a, b) => b.star_count - a.star_count).slice(0, 5);
    return (
        <div className="bg-card/60 border border-border rounded-[24px] p-7">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-6 flex items-center gap-2"><Flame size={14} className="text-amber-500" /> Trending Artifacts</h3>
            <div className="space-y-5">
                {top.map((p, i) => (
                    <Link href={`/project/${p.id}`} key={p.id} className="flex items-center gap-4 group">
                        <span className="text-2xl font-black text-muted-foreground/20 w-6 shrink-0 font-display">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors truncate">{p.title}</p>
                            <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                <Star size={10} className="text-amber-400" /> {fmt(p.star_count)} · {p.project_type}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

// ─── Who to Follow ────────────────────────────────────────────────────────────
const WhoToFollow = ({ suggestions }: { suggestions: ApiUser[] }) => {
    const [followed, setFollowed] = useState<string[]>([]);
    return (
        <div className="bg-card/60 border border-border rounded-[24px] p-7">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-6 flex items-center gap-2"><Users size={14} /> Suggested Builders</h3>
            <div className="space-y-5">
                {suggestions.map(u => (
                    <div key={u.id} className="flex items-center gap-4">
                        <Link href={`/user/${u.username}`}>
                            <img src={u.avatar_url ?? `https://i.pravatar.cc/100?u=${u.id}`} alt={u.full_name} className="w-10 h-10 rounded-full border-2 border-border hover:border-primary transition-all" />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <Link href={`/user/${u.username}`} className="text-sm font-black text-foreground hover:text-primary transition-colors truncate block">{u.full_name}</Link>
                            <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">{u.current_role ?? "Builder"}</p>
                        </div>
                        <button
                            onClick={async () => {
                                const isF = followed.includes(u.id);
                                setFollowed(p => isF ? p.filter(x => x !== u.id) : [...p, u.id]);
                                toast.success(isF ? `Unfollowed @${u.username}` : `Following @${u.username}!`);
                                await api.toggleFollow(u.username).catch(() => { });
                            }}
                            className={`shrink-0 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${followed.includes(u.id) ? "bg-muted/40 border-border text-muted-foreground" : "bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white"}`}
                        >
                            {followed.includes(u.id) ? "Following" : "Follow"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FeedPage() {
    const { isDark, toggle } = useThemeStore();
    const { isAuthenticated, user: authUser } = useAuthStore();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [feedFilter, setFeedFilter] = useState("For You");

    const [projects, setProjects] = useState<ApiProject[]>([]);
    const [suggestions, setSuggestions] = useState<ApiUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        let mounted = true;
        const fetchFeed = async () => {
            try {
                setIsLoading(true);
                const qs = buildQueryString({ sort: "newest", limit: 20 });
                const result = await api.getProjects(qs);
                if (mounted) {
                    setProjects(result.projects);
                    // Extract unique authors as "suggested builders"
                    const seen = new Set<string>();
                    const authors: ApiUser[] = [];
                    for (const p of result.projects) {
                        if (p.author && !seen.has(p.author.id) && p.author.id !== authUser?.id) {
                            seen.add(p.author.id);
                            authors.push(p.author);
                            if (authors.length >= 3) break;
                        }
                    }
                    setSuggestions(authors);
                }
            } catch {
                // silently use empty state
            } finally {
                if (mounted) setIsLoading(false);
            }
        };
        fetchFeed();
        return () => { mounted = false; };
    }, [authUser?.id]);

    const filteredProjects = feedFilter === "Following"
        ? projects.slice(0, Math.ceil(projects.length / 2))
        : feedFilter === "Trending"
            ? [...projects].sort((a, b) => b.star_count - a.star_count)
            : projects;

    const handleFork = async (project: ApiProject) => {
        if (!authUser) { toast.error("Sign in to fork"); return; }
        try {
            const forked = await api.forkProject(project.id);
            toast.success("Workspace Created", {
                description: `Forked ${project.title} to your lab.`,
                action: { label: "View", onClick: () => router.push(`/project/${forked.id}`) }
            });
        } catch (e: unknown) {
            toast.error("Fork failed", { description: e instanceof Error ? e.message : "Try again." });
        }
    };

    if (!isAuthenticated) {
        return (
            <div className={isDark ? "dark" : ""}>
                <div className="min-h-screen bg-background flex items-center justify-center p-6">
                    <div className="max-w-md text-center">
                        <Logo size="lg" />
                        <h1 className="text-4xl font-black font-display mt-12 mb-4">Your Engineering Feed</h1>
                        <p className="text-muted-foreground font-medium mb-10">Login to see a personalized feed from builders you follow.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/login" className="flex-1"><Button variant="ghost" fullWidth className="h-14 rounded-2xl font-black uppercase tracking-widest border border-border" /></Link>
                            <Link href="/register" className="flex-1"><Button variant="primary" fullWidth className="h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20" /></Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={isDark ? "dark" : ""}>
            <div className="min-h-screen bg-background relative transition-colors duration-700 text-foreground font-sans overflow-x-hidden selection:bg-primary/30">
                <CircuitBackground />
                <LiquidBlob />
                <LiquidCursor />

                {/* Header */}
                <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 flex justify-center px-4 md:px-8 ${scrolled ? "py-4" : "py-8"}`}>
                    <div className={`w-full max-w-7xl flex items-center justify-between px-6 md:px-10 transition-all duration-700 ${scrolled ? "h-16 rounded-full bg-card/80 backdrop-blur-3xl border border-border shadow-2xl" : "h-20 rounded-[32px] bg-card/40 backdrop-blur-xl border border-border/50"}`}>
                        <div className="flex items-center gap-5">
                            <button onClick={() => router.back()} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all group">
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <Logo size="md" />
                            <nav className="hidden xl:flex items-center gap-8 pl-3">
                                {[{ label: "Explore", href: "/explore" }, { label: "Feed", href: "/feed" }, { label: "Dashboard", href: "/dashboard" }].map(item => (
                                    <Link key={item.label} href={item.href} className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all relative group ${item.href === "/feed" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                                        {item.label}
                                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${item.href === "/feed" ? "w-full" : "w-0 group-hover:w-full"}`} />
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={toggle} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all group">
                                {isDark ? <Sun size={17} className="group-hover:rotate-45 transition-transform" /> : <Moon size={17} className="group-hover:-rotate-12 transition-transform" />}
                            </button>
                            <div className="h-5 w-px bg-border/50 mx-1 hidden sm:block" />
                            <Link href="/project/new">
                                <Button variant="primary" icon={<Plus size={15} />} className="px-6 h-11 rounded-full text-[10px] font-black uppercase tracking-widest hidden sm:flex shadow-lg shadow-primary/20" />
                            </Link>
                            <Link href="/dashboard">
                                <div className="relative">
                                    <img alt="Avatar" className="w-10 h-10 rounded-full border-2 border-border hover:border-primary transition-all cursor-pointer" src={authUser?.avatar_url ?? authUser?.avatar ?? `https://i.pravatar.cc/150?u=${authUser?.id}`} />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="relative z-10 pt-36 pb-24 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                            {/* Feed */}
                            <div className="lg:col-span-2">
                                {/* Filter Tabs */}
                                <div className="flex gap-2 mb-10 p-1.5 bg-card/40 border border-border rounded-full w-fit">
                                    {["For You", "Following", "Trending"].map(f => (
                                        <button key={f} onClick={() => setFeedFilter(f)}
                                            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${feedFilter === f ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground"}`}>
                                            {f}
                                        </button>
                                    ))}
                                </div>

                                {isLoading ? (
                                    <div className="py-32 flex flex-col items-center gap-4">
                                        <Loader2 size={36} className="animate-spin text-primary" />
                                        <p className="text-muted-foreground font-medium text-sm">Loading your feed…</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-10">
                                        {filteredProjects.map(project => (
                                            <FeedCard key={project.id} project={project} onFork={handleFork} />
                                        ))}
                                        {filteredProjects.length === 0 && (
                                            <div className="py-32 text-center border-2 border-dashed border-muted rounded-[40px]">
                                                <p className="text-muted-foreground font-medium">No projects in this feed yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-32 h-fit">
                                {suggestions.length > 0 && <WhoToFollow suggestions={suggestions} />}
                                <TrendingSidebar projects={projects} />
                                <div className="bg-card/60 border border-border rounded-[24px] p-7 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-5">Start building</p>
                                    <Link href="/project/new">
                                        <Button variant="primary" fullWidth className="h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20" icon={<Plus size={15} />} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
