"use client";

import { useState, useEffect } from "react";
import {
    Star, GitFork, MessageSquare, Heart, Bookmark, ArrowLeft,
    Sun, Moon, Plus, Bell, Menu, X, TrendingUp, Users, Flame,
    ExternalLink, Download, Filter, ChevronDown
} from "lucide-react";
import { projects } from "@/mockData/projects";
import { mockUsers } from "@/mockData/users";
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

/* ─── Feed Card ─── */
const FeedCard = ({ project, user }: { project: typeof projects[0]; user: typeof mockUsers[0] }) => {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [starCount, setStarCount] = useState(project.stars);
    const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);

    const timeAgo = (iso: string) => {
        const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
        return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d}d ago`;
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
                <Link href={`/user/${user.username}`}>
                    <img src={user.avatar} alt={user.fullName} className="w-12 h-12 rounded-full border-2 border-border hover:border-primary transition-all" />
                </Link>
                <div className="flex-1">
                    <Link href={`/user/${user.username}`} className="text-sm font-black text-foreground hover:text-primary transition-colors">{user.fullName}</Link>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">@{user.username}</span>
                        <span className="text-muted-foreground/30">·</span>
                        <span className="text-[10px] font-bold text-muted-foreground/40">{timeAgo(project.createdAt)}</span>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${project.categoryStyles}`}>{project.category}</span>
            </div>

            {/* Image */}
            <Link href={`/project/${project.id}`}>
                <div className="mx-5 rounded-[20px] overflow-hidden aspect-[16/9] group cursor-pointer">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
            </Link>

            {/* Content */}
            <div className="p-6">
                <Link href={`/project/${project.id}`}>
                    <h3 className="text-xl font-black font-display text-foreground hover:text-primary transition-colors mb-2 leading-tight">{project.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground font-medium line-clamp-2 mb-5 leading-relaxed opacity-80">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.slice(0, 4).map(t => (
                        <span key={t} className="px-3 py-1 rounded-xl bg-muted/60 border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground">{t}</span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-border/50 pt-5">
                    <div className="flex items-center gap-2">
                        <button onClick={() => { setLiked(!liked); setStarCount(p => liked ? p - 1 : p + 1); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${liked ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-muted/40 text-muted-foreground border border-border hover:text-amber-500"}`}>
                            <Star size={13} className={liked ? "fill-amber-500" : ""} /> {fmt(starCount)}
                        </button>
                        <Link href={`/project/${project.id}#comments`}>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/40 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                                <MessageSquare size={13} /> {project.comments}
                            </button>
                        </Link>
                        <button onClick={() => toast.success("Forked!", { description: `Forked ${project.title} to your lab.` })}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/40 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                            <GitFork size={13} /> {fmt(project.forks)}
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => { setBookmarked(!bookmarked); toast.success(bookmarked ? "Removed" : "Saved to library"); }}
                            className={`p-2.5 rounded-full border ${bookmarked ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted/40 border-border text-muted-foreground hover:text-primary"} transition-all`}>
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

/* ─── Who to Follow ─── */
const WhoToFollow = () => {
    const [followed, setFollowed] = useState<string[]>([]);
    const suggestions = mockUsers.slice(1, 4);

    return (
        <div className="bg-card/60 border border-border rounded-[24px] p-7">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-6 flex items-center gap-2"><Users size={14} /> Suggested Builders</h3>
            <div className="space-y-5">
                {suggestions.map(u => (
                    <div key={u.id} className="flex items-center gap-4">
                        <Link href={`/user/${u.username}`}>
                            <img src={u.avatar} alt={u.fullName} className="w-10 h-10 rounded-full border-2 border-border hover:border-primary transition-all" />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <Link href={`/user/${u.username}`} className="text-sm font-black text-foreground hover:text-primary transition-colors truncate block">{u.fullName}</Link>
                            <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">{u.role}</p>
                        </div>
                        <button onClick={() => {
                            const isF = followed.includes(u.id);
                            setFollowed(p => isF ? p.filter(x => x !== u.id) : [...p, u.id]);
                            toast.success(isF ? `Unfollowed @${u.username}` : `Following @${u.username}!`);
                        }}
                            className={`shrink-0 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${followed.includes(u.id) ? "bg-muted/40 border-border text-muted-foreground" : "bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white"}`}>
                            {followed.includes(u.id) ? "Following" : "Follow"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─── Trending Sidebar ─── */
const TrendingSidebar = () => {
    const top = [...projects].sort((a, b) => b.stars - a.stars).slice(0, 5);
    const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
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
                                <Star size={10} className="text-amber-400" /> {fmt(p.stars)} · {p.category}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

/* ─── Main Page ─── */
export default function FeedPage() {
    const { isDark, toggle } = useThemeStore();
    const { isAuthenticated, logout, user: authUser } = useAuthStore();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [feedFilter, setFeedFilter] = useState("For You");

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Build feed: pair each project with its mock author
    const feedItems = projects.map(p => ({
        project: p,
        user: mockUsers.find(u => u.id === p.authorId) ?? mockUsers[0],
    }));

    const filteredFeed = feedFilter === "Following"
        ? feedItems.slice(0, 4) // mock: show subset for following
        : feedItems;

    if (!isAuthenticated) {
        return (
            <div className={isDark ? "dark" : ""}>
                <div className="min-h-screen bg-background flex items-center justify-center p-6">
                    <div className="max-w-md text-center">
                        <Logo size="lg" />
                        <h1 className="text-4xl font-black font-display mt-12 mb-4">Your Engineering Feed</h1>
                        <p className="text-muted-foreground font-medium mb-10">Login to see a personalized feed from builders you follow.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/login" className="flex-1"><Button variant="ghost" fullWidth className="h-14 rounded-2xl font-black uppercase tracking-widest border border-border">Login</Button></Link>
                            <Link href="/register" className="flex-1"><Button variant="primary" fullWidth className="h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">Join Lab</Button></Link>
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
                        <div className="flex items-center gap-8">
                            <Logo size="md" />
                            <nav className="hidden xl:flex items-center gap-8">
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
                                <Button variant="primary" icon={<Plus size={15} />} className="px-6 h-11 rounded-full text-[10px] font-black uppercase tracking-widest hidden sm:flex shadow-lg shadow-primary/20">Create</Button>
                            </Link>
                            <Link href="/dashboard">
                                <div className="relative">
                                    <img alt="Avatar" className="w-10 h-10 rounded-full border-2 border-border hover:border-primary transition-all cursor-pointer" src={authUser?.avatar} />
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

                                <div className="flex flex-col gap-10">
                                    {filteredFeed.map(({ project, user }) => (
                                        <FeedCard key={project.id} project={project} user={user} />
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-32 h-fit">
                                <WhoToFollow />
                                <TrendingSidebar />
                                <div className="bg-card/60 border border-border rounded-[24px] p-7 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-5">Start building</p>
                                    <Link href="/project/new">
                                        <Button variant="primary" fullWidth className="h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20" icon={<Plus size={15} />}>New Project</Button>
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
