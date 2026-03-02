"use client";

import { useState, useEffect } from "react";
import {
    Star, GitFork, Eye, TrendingUp, Plus, Settings, Bell, Sun, Moon,
    Cpu, ArrowRight, Edit2, Archive, ExternalLink, BarChart2,
    Bookmark, Clock, Zap, LogOut, User
} from "lucide-react";
import { projects } from "@/mockData/projects";
import { mockNotifications } from "@/mockData/notifications";
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

type NavItem = "overview" | "projects" | "starred" | "notifications" | "settings";

export default function DashboardPage() {
    const { isDark, toggle } = useThemeStore();
    const { isAuthenticated, user: authUser, logout } = useAuthStore();
    const router = useRouter();
    const [activeNav, setActiveNav] = useState<NavItem>("overview");

    useEffect(() => {
        if (!isAuthenticated) router.push("/login");
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !authUser) return null;

    const myProjects = projects.filter(p => p.authorId === "user-1");
    const starredProjects = projects.slice(3, 7);
    const unreadNotifs = mockNotifications.filter(n => !n.read);

    const totalStars = myProjects.reduce((s, p) => s + p.stars, 0);
    const totalForks = myProjects.reduce((s, p) => s + p.forks, 0);
    const totalViews = myProjects.reduce((s, p) => s + p.views, 0);
    const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);

    const navItems = [
        { id: "overview" as NavItem, label: "Overview", icon: BarChart2 },
        { id: "projects" as NavItem, label: "My Projects", icon: Cpu, badge: myProjects.length },
        { id: "starred" as NavItem, label: "Starred", icon: Bookmark },
        { id: "notifications" as NavItem, label: "Notifications", icon: Bell, badge: unreadNotifs.length },
        { id: "settings" as NavItem, label: "Settings", icon: Settings },
    ];

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
                                    <img src={authUser.avatar} alt={authUser.fullName} className="w-12 h-12 rounded-full border-2 border-border" />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-foreground truncate">{authUser.fullName}</p>
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
                        {/* Top bar (mobile + desktop) */}
                        <div className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-10 py-5 bg-background/80 backdrop-blur-xl border-b border-border">
                            <div className="lg:hidden"><Logo size="sm" /></div>
                            <h2 className="hidden lg:block text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 capitalize">{activeNav}</h2>
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
                                        <h1 className="text-4xl font-black font-display tracking-tight mb-2">Welcome back, {authUser.fullName.split(" ")[0]} 👋</h1>
                                        <p className="text-muted-foreground font-medium">Here's what's happening in your laboratory.</p>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                        {[
                                            { label: "Total Stars", value: fmt(totalStars), icon: Star, color: "amber", delta: "+12 this week" },
                                            { label: "Total Forks", value: fmt(totalForks), icon: GitFork, color: "primary", delta: "+5 this week" },
                                            { label: "Total Views", value: fmt(totalViews), icon: Eye, color: "emerald", delta: "+234 this week" },
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

                                    {/* Recent projects */}
                                    <div>
                                        <div className="flex items-center justify-between mb-7">
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">My Projects</h3>
                                            <button onClick={() => setActiveNav("projects")} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors flex items-center gap-1.5">
                                                View All <ArrowRight size={13} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {myProjects.map(p => (
                                                <div key={p.id} className="bg-card/60 border border-border rounded-[24px] p-6 hover:border-primary/30 transition-all group flex gap-5">
                                                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                                                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-base font-black font-display text-foreground group-hover:text-primary transition-colors mb-1 truncate">{p.title}</h4>
                                                        <div className="flex gap-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest mb-3">
                                                            <span className="flex items-center gap-1"><Star size={11} className="text-amber-400" /> {fmt(p.stars)}</span>
                                                            <span className="flex items-center gap-1"><GitFork size={11} /> {fmt(p.forks)}</span>
                                                            <span className="flex items-center gap-1"><Eye size={11} /> {fmt(p.views)}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Link href={`/project/${p.id}/edit`}><button className="px-3 py-1 rounded-xl bg-muted/50 border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/40 transition-all flex items-center gap-1"><Edit2 size={11} /> Edit</button></Link>
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
                                            {mockNotifications.slice(0, 5).map(n => (
                                                <div key={n.id} className={`flex items-center gap-5 p-5 rounded-2xl border transition-all ${!n.read ? "bg-primary/5 border-primary/10" : "bg-card/40 border-border/50"} hover:border-primary/30`}>
                                                    <img src={n.actorAvatar} alt={n.actor} className="w-9 h-9 rounded-full border border-border shrink-0" />
                                                    <p className="text-sm font-medium text-foreground flex-1">
                                                        <span className="font-black text-primary">@{n.actor}</span> {n.message}
                                                        {n.projectTitle && <span className="font-black"> "{n.projectTitle}"</span>}
                                                    </p>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${notifColors[n.type]}`}>{n.type}</span>
                                                        <span className="text-[10px] font-bold text-muted-foreground/40">{timeAgo(n.createdAt)}</span>
                                                        {!n.read && <div className="w-2 h-2 rounded-full bg-primary" />}
                                                    </div>
                                                </div>
                                            ))}
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
                                                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xl font-black font-display text-foreground group-hover:text-primary transition-colors mb-2">{p.title}</h4>
                                                    <div className="flex flex-wrap gap-5 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1.5"><Star size={12} className="text-amber-400" /> {fmt(p.stars)}</span>
                                                        <span className="flex items-center gap-1.5"><GitFork size={12} /> {fmt(p.forks)}</span>
                                                        <span className="flex items-center gap-1.5"><Eye size={12} /> {fmt(p.views)}</span>
                                                        <span className="flex items-center gap-1.5"><Clock size={12} /> {timeAgo(p.createdAt)}</span>
                                                        <span className={`px-2.5 py-0.5 rounded-full border text-[9px] ${p.status === "published" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"}`}>{p.status}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 shrink-0">
                                                    <Link href={`/project/${p.id}/edit`}>
                                                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"><Edit2 size={13} /> Edit</button>
                                                    </Link>
                                                    <button onClick={() => toast.info("Archive", { description: `${p.title} archived.` })} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-rose-500 hover:border-rose-500/40 transition-all"><Archive size={13} /></button>
                                                    <Link href={`/project/${p.id}`}>
                                                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all"><ExternalLink size={13} /> View</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
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
                                                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                        <div className="absolute top-4 left-4"><Star size={18} className="text-amber-400 fill-amber-400" /></div>
                                                    </div>
                                                    <div className="p-6">
                                                        <h4 className="text-lg font-black font-display text-foreground group-hover:text-primary transition-colors mb-1">{p.title}</h4>
                                                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">@{p.author}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* ─── NOTIFICATIONS ─── */}
                            {activeNav === "notifications" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-3xl font-black font-display">Notifications</h1>
                                        <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">{unreadNotifs.length} unread</span>
                                    </div>
                                    <div className="space-y-3">
                                        {mockNotifications.map(n => (
                                            <div key={n.id} className={`flex items-start gap-5 p-6 rounded-[20px] border transition-all ${!n.read ? "bg-primary/5 border-primary/10" : "bg-card/40 border-border/50"} hover:border-primary/30`}>
                                                <img src={n.actorAvatar} alt={n.actor} className="w-11 h-11 rounded-full border-2 border-border shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-foreground leading-snug mb-2">
                                                        <span className="font-black text-primary">@{n.actor}</span> {n.message}
                                                        {n.projectTitle && <Link href={`/project/${n.projectId}`} className="font-black hover:text-primary transition-colors"> "{n.projectTitle}"</Link>}
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${notifColors[n.type]}`}>{n.type}</span>
                                                        <span className="text-[10px] font-bold text-muted-foreground/40">{timeAgo(n.createdAt)}</span>
                                                    </div>
                                                </div>
                                                {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1" />}
                                            </div>
                                        ))}
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
