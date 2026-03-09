"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Star, GitFork, Eye, AlertTriangle, Bookmark, ExternalLink,
    Plus, Edit2, CheckCircle2, Bell, Sun, Moon, Cpu, BarChart2,
    Clock, LogOut, ArrowLeft, ArrowRight, Settings, User
} from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { motion } from "framer-motion";
import CircuitBackground from "@/components/ui/CircuitBackground";
import LiquidCursor from "@/components/ui/LiquidCursor";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ApiProject, ApiNotification } from "@/lib/api-types";

type NavItem = "overview" | "projects" | "starred" | "notifications" | "settings";

const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
const timeAgo = (iso: string) => {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d}d ago`;
};

const notifColors: Record<string, string> = {
    star: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    fork: "bg-primary/10 text-primary border-primary/20",
    comment: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    follow: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    reply: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export default function DashboardPage() {
    const { isDark, toggle } = useThemeStore();
    const { isAuthenticated, user: authUser, logout } = useAuthStore();
    const router = useRouter();
    const [activeNav, setActiveNav] = useState<NavItem>("overview");

    const [myProjects, setMyProjects] = useState<ApiProject[]>([]);
    const [starredProjects, setStarredProjects] = useState<ApiProject[]>([]);
    const [notifications, setNotifications] = useState<ApiNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    useEffect(() => {
        if (isMounted && !isAuthenticated) router.push("/login");
    }, [isMounted, isAuthenticated, router]);

    const fetchData = useCallback(async () => {
        if (!authUser) return;
        try {
            setIsLoading(true);
            const [projectsData, starredData, notifsData] = await Promise.all([
                api.getUserProjects(authUser.username),
                api.getUserStarred(authUser.username).catch(() => [] as ApiProject[]),
                api.getNotifications().catch(() => [] as ApiNotification[]),
            ]);
            setMyProjects(projectsData);
            setStarredProjects(starredData);
            setNotifications(notifsData);
        } catch {
            // continue with empty states
        } finally {
            setIsLoading(false);
        }
    }, [authUser]);

    useEffect(() => {
        if (isMounted && isAuthenticated) fetchData();
    }, [isMounted, isAuthenticated, fetchData]);

    if (!isMounted || !isAuthenticated || !authUser) return null;

    const unreadNotifs = notifications.filter(n => !n.is_read).length;
    const totalStars = myProjects.reduce((s, p) => s + p.star_count, 0);
    const totalForks = myProjects.reduce((s, p) => s + p.fork_count, 0);
    const totalViews = myProjects.reduce((s, p) => s + p.view_count, 0);

    const handleFork = async (e: React.MouseEvent, project: ApiProject) => {
        e.stopPropagation();
        try {
            const forked = await api.forkProject(project.id);
            toast.success("Workspace Created", { description: `Forked ${project.title} to your laboratory.` });
            router.push(`/project/${forked.id}`);
        } catch {
            toast.error("Fork failed");
        }
    };

    const markAllNotifRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        await api.markAllRead().catch(() => { });
    };

    const navItems = [
        { id: "overview" as NavItem, label: "Overview", icon: BarChart2 },
        { id: "projects" as NavItem, label: "My Projects", icon: Cpu, badge: myProjects.length },
        { id: "starred" as NavItem, label: "Starred", icon: Star },
        { id: "notifications" as NavItem, label: "Notifications", icon: Bell, badge: unreadNotifs },
        { id: "settings" as NavItem, label: "Settings", icon: Settings },
    ];

    const notifTypeLabel = (type: string) => type.toLowerCase();

    return (
        <div className={isDark ? "dark" : ""}>
            <div className="min-h-screen bg-background relative transition-colors duration-700 text-foreground font-sans overflow-x-hidden">
                <CircuitBackground />
                <LiquidCursor />

                <div className="flex h-screen overflow-hidden">
                    {/* ─── Sidebar ─── */}
                    <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-border bg-card/80 backdrop-blur-3xl fixed top-0 left-0 h-full z-40">
                        <div className="p-8 border-b border-border"><Logo size="md" /></div>

                        {/* Profile Block */}
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img loading="lazy" src={authUser.avatar_url ?? authUser.avatar ?? `https://i.pravatar.cc/150?u=${authUser.id}`} alt={authUser.full_name ?? authUser.fullName} className="w-12 h-12 rounded-full border-2 border-border" />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-foreground truncate">{authUser.full_name ?? authUser.fullName}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">@{authUser.username}</p>
                                </div>
                                <Link href={`/user/${authUser.username}`}>
                                    <button className="p-2 rounded-xl bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all"><ExternalLink size={14} /></button>
                                </Link>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-1">
                                {navItems.map(item => (
                                    <button key={item.id} onClick={() => setActiveNav(item.id)}
                                        className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all group ${activeNav === item.id ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                                        <item.icon size={16} />
                                        {item.label}
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-black ${activeNav === item.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{item.badge}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </nav>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-border space-y-2">
                            <button onClick={toggle} className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                                {isDark ? <Sun size={16} /> : <Moon size={16} />} {isDark ? "Light Mode" : "Dark Mode"}
                            </button>
                            <button onClick={() => { logout(); router.push("/login"); }} className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/5 transition-all">
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    </aside>

                    {/* ─── Main content ─── */}
                    <div className="flex-1 lg:ml-72 overflow-y-auto h-screen">
                        {/* Top bar */}
                        <div className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-10 py-5 bg-background/80 backdrop-blur-xl border-b border-border">
                            <div className="lg:hidden flex items-center gap-3">
                                <button onClick={() => router.back()} className="p-2 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all group">
                                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <Logo size="sm" />
                            </div>
                            <div className="hidden lg:flex items-center gap-4">
                                <button onClick={() => router.back()} className="p-2.5 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all group">
                                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 capitalize">{activeNav}</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link href="/project/new">
                                    <Button variant="primary" icon={<Plus size={15} />} className="h-10 px-5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">New Project</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="p-6 md:p-10">

                            {/* ─── OVERVIEW ─── */}
                            {activeNav === "overview" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                                    <div>
                                        <h1 className="text-4xl font-black font-display tracking-tight mb-2">Welcome back, {(authUser.full_name ?? authUser.fullName)?.split(" ")[0]} 👋</h1>
                                        <p className="text-muted-foreground font-medium">Here&apos;s what&apos;s happening in your laboratory.</p>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                        {[
                                            { label: "Total Stars", value: fmt(totalStars), icon: Star, color: "amber", delta: `${myProjects.length} projects` },
                                            { label: "Total Forks", value: fmt(totalForks), icon: GitFork, color: "primary", delta: "across all projects" },
                                            { label: "Total Views", value: fmt(totalViews), icon: Eye, color: "emerald", delta: "lifetime views" },
                                            { label: "Projects", value: String(myProjects.length), icon: Cpu, color: "violet", delta: "published" },
                                        ].map(stat => (
                                            <div key={stat.label} className="bg-card/60 border border-border rounded-[24px] p-7 hover:border-primary/30 transition-all group">
                                                <div className="flex items-center justify-between mb-5">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">{stat.label}</p>
                                                    <div className={`p-2.5 rounded-xl ${stat.color === "amber" ? "bg-amber-500/10 text-amber-500" : stat.color === "primary" ? "bg-primary/10 text-primary" : stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-500" : "bg-violet-500/10 text-violet-500"}`}>
                                                        <stat.icon size={16} />
                                                    </div>
                                                </div>
                                                <p className="text-4xl font-black font-display tracking-tight text-foreground mb-1">{stat.value}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{stat.delta}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Recent Projects */}
                                    <div>
                                        <div className="flex items-center justify-between mb-7">
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">My Projects</h3>
                                            <button onClick={() => setActiveNav("projects")} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors flex items-center gap-1.5">
                                                View All <ArrowRight size={13} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {myProjects.slice(0, 4).map(p => (
                                                <div key={p.id} className="bg-card/60 border border-border rounded-[24px] p-6 hover:border-primary/30 transition-all group flex gap-5">
                                                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                                                        <img loading="lazy" src={p.cover_image_url ?? `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80`} alt={p.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-base font-black font-display text-foreground group-hover:text-primary transition-colors mb-1 truncate">{p.title}</h4>
                                                        <div className="flex gap-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest mb-3">
                                                            <span className="flex items-center gap-1"><Star size={11} className="text-amber-400" /> {fmt(p.star_count)}</span>
                                                            <span className="flex items-center gap-1"><GitFork size={11} /> {fmt(p.fork_count)}</span>
                                                            <span className="flex items-center gap-1"><Eye size={11} /> {fmt(p.view_count)}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Link href={`/project/${p.id}`}><button className="px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-1"><ExternalLink size={11} /> View</button></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Notifications */}
                                    <div>
                                        <div className="flex items-center justify-between mb-7">
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">Recent Activity</h3>
                                            <button onClick={() => setActiveNav("notifications")} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors flex items-center gap-1.5">
                                                View All <ArrowRight size={13} />
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {notifications.slice(0, 5).map(n => {
                                                const actorName = n.actor?.username ?? "unknown";
                                                const actorAvatar = n.actor?.avatar_url ?? `https://i.pravatar.cc/100?u=${n.actor_id}`;
                                                const tk = notifTypeLabel(n.type);
                                                return (
                                                    <div key={n.id} className={`flex items-center gap-5 p-5 rounded-2xl border transition-all ${!n.is_read ? "bg-primary/5 border-primary/10" : "bg-card/40 border-border/50"} hover:border-primary/30`}>
                                                        <img loading="lazy" src={actorAvatar} alt={actorName} className="w-9 h-9 rounded-full border border-border shrink-0" />
                                                        <p className="text-sm font-medium text-foreground flex-1">
                                                            <span className="font-black text-primary">@{actorName}</span> {tk === "star" ? "starred" : tk === "fork" ? "forked" : tk === "comment" ? "commented on" : tk === "follow" ? "followed you" : "replied to"} your project
                                                            {n.project?.title && <span className="font-black"> &ldquo;{n.project.title}&rdquo;</span>}
                                                        </p>
                                                        <div className="flex items-center gap-3 shrink-0">
                                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${notifColors[tk] ?? notifColors.star}`}>{tk}</span>
                                                            <span className="text-[10px] font-bold text-muted-foreground/40">{timeAgo(n.created_at)}</span>
                                                            {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary" />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ─── MY PROJECTS ─── */}
                            {activeNav === "projects" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-3xl font-black font-display">My Projects</h1>
                                        <Link href="/project/new">
                                            <Button variant="primary" icon={<Plus size={15} />} className="h-11 px-6 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">New Project</Button>
                                        </Link>
                                    </div>
                                    <div className="space-y-4">
                                        {myProjects.map(p => (
                                            <div key={p.id} className="bg-card/60 border border-border rounded-[24px] p-7 hover:border-primary/30 transition-all group flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                                <div className="w-24 h-16 rounded-2xl overflow-hidden shrink-0">
                                                    <img loading="lazy" src={p.cover_image_url ?? `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80`} alt={p.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xl font-black font-display text-foreground group-hover:text-primary transition-colors mb-2">{p.title}</h4>
                                                    <div className="flex flex-wrap gap-5 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1.5"><Star size={12} className="text-amber-400" /> {fmt(p.star_count)}</span>
                                                        <span className="flex items-center gap-1.5"><GitFork size={12} /> {fmt(p.fork_count)}</span>
                                                        <span className="flex items-center gap-1.5"><Eye size={12} /> {fmt(p.view_count)}</span>
                                                        <span className="flex items-center gap-1.5"><Clock size={12} /> {timeAgo(p.created_at)}</span>
                                                        <span className={`px-2.5 py-0.5 rounded-full border text-[9px] ${p.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"}`}>{p.status}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    <button onClick={(e) => handleFork(e, p)} className="flex items-center gap-2 p-2 rounded-xl bg-primary/5 border border-primary/20 text-primary hover:bg-primary/20 transition-all"><GitFork size={13} /></button>
                                                    <Link href={`/project/${p.id}`}>
                                                        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all"><ExternalLink size={13} /> View</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                        {myProjects.length === 0 && !isLoading && (
                                            <div className="py-24 text-center border-2 border-dashed border-muted rounded-[32px]">
                                                <Cpu size={40} className="mx-auto mb-4 text-muted-foreground/20" />
                                                <h3 className="text-xl font-black font-display mb-2">No projects yet</h3>
                                                <p className="text-muted-foreground font-medium mb-6">Start documenting your first engineering artifact.</p>
                                                <Link href="/project/new"><Button variant="primary" icon={<Plus size={15} />} className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest">New Project</Button></Link>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* ─── STARRED ─── */}
                            {activeNav === "starred" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <h1 className="text-3xl font-black font-display">Starred Projects</h1>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {starredProjects.map(p => (
                                            <Link key={p.id} href={`/project/${p.id}`}>
                                                <div className="bg-card/60 border border-border rounded-[24px] overflow-hidden hover:border-primary/30 transition-all group">
                                                    <div className="aspect-[16/9] relative overflow-hidden">
                                                        <img loading="lazy" src={p.cover_image_url ?? `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80`} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                        <div className="absolute top-4 left-4"><Star size={18} className="text-amber-400 fill-amber-400" /></div>
                                                    </div>
                                                    <div className="p-6">
                                                        <h4 className="text-lg font-black font-display text-foreground group-hover:text-primary transition-colors mb-1">{p.title}</h4>
                                                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">@{p.author?.username ?? "unknown"}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        {starredProjects.length === 0 && !isLoading && (
                                            <div className="col-span-2 py-24 text-center border-2 border-dashed border-muted rounded-[32px]">
                                                <Star size={40} className="mx-auto mb-4 text-muted-foreground/20" />
                                                <h3 className="text-xl font-black font-display mb-2">No starred projects yet</h3>
                                                <p className="text-muted-foreground font-medium">Star projects from the Explore page to save them here.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* ─── NOTIFICATIONS ─── */}
                            {activeNav === "notifications" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-3xl font-black font-display">Notifications</h1>
                                        <div className="flex items-center gap-3">
                                            <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">{unreadNotifs} unread</span>
                                            {unreadNotifs > 0 && (
                                                <button onClick={markAllNotifRead} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Mark all read</button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {notifications.map(n => {
                                            const actorName = n.actor?.username ?? "unknown";
                                            const actorAvatar = n.actor?.avatar_url ?? `https://i.pravatar.cc/100?u=${n.actor_id}`;
                                            const tk = notifTypeLabel(n.type);
                                            return (
                                                <div key={n.id} onClick={() => { setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x)); api.markOneRead(n.id).catch(() => { }); }}
                                                    className={`flex items-start gap-5 p-6 rounded-[20px] border transition-all cursor-pointer ${!n.is_read ? "bg-primary/5 border-primary/10" : "bg-card/40 border-border/50"} hover:border-primary/30`}>
                                                    <img loading="lazy" src={actorAvatar} alt={actorName} className="w-11 h-11 rounded-full border-2 border-border shrink-0" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-foreground leading-snug mb-2">
                                                            <span className="font-black text-primary">@{actorName}</span> {tk === "follow" ? "followed you" : `${tk === "star" ? "starred" : tk === "fork" ? "forked" : tk === "comment" ? "commented on" : "replied to"} your project`}
                                                            {n.project?.title && <Link href={`/project/${n.project_id ?? ""}`} className="font-black hover:text-primary transition-colors" onClick={e => e.stopPropagation()}> &ldquo;{n.project.title}&rdquo;</Link>}
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${notifColors[tk] ?? notifColors.star}`}>{tk}</span>
                                                            <span className="text-[10px] font-bold text-muted-foreground/40">{timeAgo(n.created_at)}</span>
                                                        </div>
                                                    </div>
                                                    {!n.is_read && <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1" />}
                                                </div>
                                            );
                                        })}
                                        {notifications.length === 0 && !isLoading && (
                                            <div className="py-24 text-center border-2 border-dashed border-muted rounded-[32px]">
                                                <Bell size={40} className="mx-auto mb-4 text-muted-foreground/20" />
                                                <h3 className="text-xl font-black font-display mb-2">All clear</h3>
                                                <p className="text-muted-foreground font-medium">No notifications yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* ─── SETTINGS ─── */}
                            {activeNav === "settings" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-2xl">
                                    <h1 className="text-3xl font-black font-display">Settings</h1>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Profile Settings", desc: "Update your bio, skills, and social links", href: "/settings/profile", icon: User },
                                            { label: "Account Settings", desc: "Email, password, and security preferences", href: "/settings/account", icon: Settings },
                                        ].map(s => (
                                            <Link key={s.href} href={s.href}>
                                                <div className="flex items-center gap-5 p-7 rounded-[24px] bg-card/60 border border-border hover:border-primary/40 transition-all group cursor-pointer">
                                                    <div className="p-3 rounded-2xl bg-muted border border-border group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary transition-all"><s.icon size={20} /></div>
                                                    <div className="flex-1">
                                                        <p className="font-black text-foreground group-hover:text-primary transition-colors">{s.label}</p>
                                                        <p className="text-sm text-muted-foreground font-medium mt-0.5">{s.desc}</p>
                                                    </div>
                                                    <ArrowRight size={18} className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </Link>
                                        ))}
                                        <div className="flex items-center gap-5 p-7 rounded-[24px] bg-rose-500/5 border border-rose-500/20 cursor-pointer group"
                                            onClick={() => { logout(); router.push("/login"); }}>
                                            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500"><LogOut size={20} /></div>
                                            <div className="flex-1">
                                                <p className="font-black text-rose-500">Sign Out</p>
                                                <p className="text-sm text-muted-foreground font-medium mt-0.5">End your current lab session</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
