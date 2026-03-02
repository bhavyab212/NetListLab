"use client";

import { useState, useEffect } from "react";
import {
    ArrowLeft, Bell, Check, Trash2, Star, GitFork, MessageSquare,
    UserPlus, Reply, Sun, Moon, Inbox
} from "lucide-react";
import { mockNotifications, Notification } from "@/mockData/notifications";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { motion, AnimatePresence } from "framer-motion";
import CircuitBackground from "@/components/ui/CircuitBackground";
import LiquidCursor from "@/components/ui/LiquidCursor";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const typeStyles: Record<string, { color: string; bg: string; border: string; Icon: React.ElementType }> = {
    star: { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", Icon: Star },
    fork: { color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", Icon: GitFork },
    comment: { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", Icon: MessageSquare },
    follow: { color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20", Icon: UserPlus },
    reply: { color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", Icon: Reply },
};

const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};

export default function NotificationsPage() {
    const { isDark, toggle } = useThemeStore();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [notifs, setNotifs] = useState<Notification[]>(mockNotifications.map(n => ({ ...n })));
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        if (!isAuthenticated) router.push("/login");
    }, [isAuthenticated, router]);

    const unreadCount = notifs.filter(n => !n.read).length;
    const filters = ["all", "star", "fork", "comment", "follow", "reply"];
    const visible = filter === "all" ? notifs : notifs.filter(n => n.type === filter);

    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const clear = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));
    const clearAll = () => setNotifs([]);

    if (!isAuthenticated) return null;

    return (
        <div className={isDark ? "dark" : ""}>
            <div className="glass-floor min-h-screen bg-background text-foreground font-sans relative transition-colors duration-700 selection:bg-primary/30">
                <CircuitBackground />
                <LiquidCursor />

                <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-background/80 backdrop-blur-3xl border-b border-border">
                    <div className="flex items-center gap-5">
                        <button onClick={() => router.push("/dashboard")} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <Logo size="sm" />
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={toggle} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all">
                            {isDark ? <Sun size={17} /> : <Moon size={17} />}
                        </button>
                        {unreadCount > 0 && (
                            <Button variant="ghost" icon={<Check size={15} />} onClick={markAllRead} className="h-10 px-5 rounded-full text-[10px] font-black uppercase tracking-widest hidden sm:flex border border-border bg-muted/30">
                                Mark All Read
                            </Button>
                        )}
                        {notifs.length > 0 && (
                            <Button variant="ghost" icon={<Trash2 size={15} />} onClick={clearAll} className="h-10 px-5 rounded-full text-[10px] font-black uppercase tracking-widest hidden sm:flex border border-border bg-rose-500/5 text-rose-500 hover:bg-rose-500/10">
                                Clear All
                            </Button>
                        )}
                    </div>
                </header>

                <main className="pt-28 pb-20 px-4 md:px-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-4xl font-black font-display tracking-tight">Transmissions</h1>
                                {unreadCount > 0 && (
                                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/50 mt-2">{unreadCount} unread signal{unreadCount > 1 ? "s" : ""}</p>
                                )}
                            </div>
                            <div className="p-4 rounded-[20px] bg-primary/10 border border-primary/20 text-primary relative">
                                <Bell size={26} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-primary rounded-full text-white text-[10px] font-black flex items-center justify-center border-2 border-background">{unreadCount}</span>
                                )}
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8 pb-1">
                            {filters.map(f => {
                                const s = typeStyles[f];
                                return (
                                    <button key={f} onClick={() => setFilter(f)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${filter === f ? (f === "all" ? "bg-primary/10 text-primary border-primary/20" : `${s.bg} ${s.color} ${s.border}`) : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"}`}>
                                        {s && <s.Icon size={12} />} {f}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Notifications List */}
                        <AnimatePresence mode="popLayout">
                            {visible.length === 0 ? (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-40 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-[28px] bg-muted/40 border-2 border-border flex items-center justify-center mb-8"><Inbox size={36} className="text-muted-foreground/20" /></div>
                                    <h3 className="text-2xl font-black font-display mb-3">All Clear</h3>
                                    <p className="text-muted-foreground font-medium max-w-sm">No transmissions in this channel. Your lab is quiet.</p>
                                </motion.div>
                            ) : visible.map(n => {
                                const s = typeStyles[n.type] ?? typeStyles.star;
                                return (
                                    <motion.div key={n.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                        className={`flex items-start gap-5 p-6 rounded-[24px] border mb-3 transition-all cursor-pointer ${!n.read ? "bg-primary/5 border-primary/10 hover:bg-primary/8" : "bg-card/40 border-border/50 hover:border-primary/20"}`}
                                        onClick={() => markRead(n.id)}>
                                        <div className={`p-3 rounded-2xl border shrink-0 ${s.bg} ${s.border} ${s.color}`}><s.Icon size={17} /></div>
                                        <img src={n.actorAvatar} alt={n.actor} className="w-11 h-11 rounded-full border-2 border-border shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground leading-snug">
                                                <Link href={`/user/${n.actorId}`} className="font-black text-primary hover:underline" onClick={e => e.stopPropagation()}>@{n.actor}</Link>{" "}
                                                {n.message}
                                                {n.projectTitle && n.projectId && (
                                                    <Link href={`/project/${n.projectId}`} className="font-black hover:text-primary transition-colors" onClick={e => e.stopPropagation()}> "{n.projectTitle}"</Link>
                                                )}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${s.bg} ${s.border} ${s.color}`}>{n.type}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground/40">{timeAgo(n.createdAt)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            <button onClick={e => { e.stopPropagation(); clear(n.id); }}
                                                className="p-2 rounded-xl text-muted-foreground/40 hover:text-rose-500 hover:bg-rose-500/5 transition-all opacity-0 group-hover:opacity-100">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}
