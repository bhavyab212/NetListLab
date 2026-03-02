"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, Bolt, Cpu, Bot as SmartToy, Brain, Terminal,
  ChevronDown, Filter, Star, MessageSquare, Bell, Plus,
  ArrowRight, GitFork, Download, Share2, ExternalLink,
  Flame, LayoutGrid, History, Menu, X, Sun, Moon,
  ArrowUpDown, TrendingUp, Clock, Zap,
} from "lucide-react";
import { projects, Project } from "@/mockData/projects";
import { mockNotifications } from "@/mockData/notifications";
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

/* ─── Project Card ─── */
const ProjectCard = ({ project }: { project: Project }) => {
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(project.stars);

  const handleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarred(!isStarred);
    setStarCount(prev => isStarred ? prev - 1 : prev + 1);
    toast.success(isStarred ? "Removed from library" : "Project starred!", {
      description: isStarred ? `Removed ${project.title}` : `Added ${project.title} to your library.`,
    });
  };

  const handleReplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = toast.loading("Connecting to Lab Node…");
    setTimeout(() => {
      toast.success("Artifacts Synced", {
        id,
        description: `Build Guide for ${project.title} is ready.`,
        action: { label: "Download", onClick: () => { } },
      });
    }, 2000);
  };

  const handleFork = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Workspace Created", {
      description: `Forked ${project.title} to your laboratory.`,
    });
  };

  const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card/60 backdrop-blur-xl rounded-[24px] border border-border/50 overflow-hidden flex flex-col relative hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
    >
      <Link href={`/project/${project.id}`} className="block relative aspect-[16/10] overflow-hidden">
        <img
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          src={project.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className={`absolute left-4 top-4 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest ${project.categoryStyles}`}>
          {project.category}
        </span>
        <span className="absolute right-4 top-4 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest backdrop-blur-xl border border-white/20 bg-white/90 text-black dark:bg-black/80 dark:text-white/90 shadow-lg">
          {project.level}
        </span>
      </Link>

      <div className="p-7 flex-1 flex flex-col">
        <div className="mb-5 flex items-center gap-3">
          <Link href={`/user/${project.author}`} className="relative group/avatar">
            <img alt="Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-border/50 shadow-sm group-hover/avatar:border-primary transition-all" src={project.authorAvatar} />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
          </Link>
          <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors tracking-[0.15em] uppercase">
            @{project.author}
          </span>
        </div>

        <Link href={`/project/${project.id}`}>
          <h3 className="mb-3 text-xl font-black font-display text-foreground leading-[1.2] group-hover:text-primary transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground/80 line-clamp-2 font-medium">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-7">
          {project.tags.slice(0, 3).map(t => (
            <span key={t} className="px-3 py-1 rounded-xl bg-muted/60 border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/40 transition-all">
              {t}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-7">
          <Button variant="secondary" onClick={handleReplicate} className="h-10 rounded-full text-[10px] font-black uppercase tracking-widest" icon={<Download size={13} />}>
            Replicate
          </Button>
          <Button variant="ghost" onClick={handleFork} className="h-10 rounded-full text-[10px] font-black uppercase tracking-widest border border-border bg-muted/30 hover:bg-muted/50 transition-all" icon={<GitFork size={13} />}>
            Fork
          </Button>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-5 text-[10px] font-black text-muted-foreground tracking-[0.2em] uppercase">
          <div className="flex gap-5">
            <button onClick={handleStar} className={`flex items-center gap-2 transition-all duration-300 ${isStarred ? "text-amber-500 scale-105" : "hover:text-foreground"}`}>
              <Star size={15} className={isStarred ? "fill-amber-500" : ""} /> {fmt(starCount)}
            </button>
            <span className="flex items-center gap-2 hover:text-foreground cursor-default">
              <GitFork size={15} /> {fmt(project.forks)}
            </span>
          </div>
          <span className="flex items-center gap-2 hover:text-foreground cursor-default">
            <MessageSquare size={15} /> {project.comments}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

/* ─── Category Pill ─── */
const CategoryPill = ({ label, icon: Icon, active, onClick }: { label: string; icon: React.ElementType; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-300 border font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap
      ${active ? "bg-primary/10 border-primary text-primary shadow-glow-cyan scale-105" : "bg-muted/50 border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5"}`}
  >
    <Icon size={13} className={active ? "animate-pulse" : ""} />
    {label}
  </button>
);

/* ─── Notification Dropdown ─── */
const NotificationDot = ({ type }: { type: string }) => {
  const colors: Record<string, string> = {
    star: "bg-amber-500", fork: "bg-primary", comment: "bg-emerald-500",
    follow: "bg-violet-500", reply: "bg-rose-500",
  };
  return <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors[type] || "bg-muted-foreground"}`} />;
};

const NotificationsDropdown = ({ onClose }: { onClose: () => void }) => {
  const [notifs, setNotifs] = useState(() =>
    mockNotifications.map(n => ({ ...n }))
  );
  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const clearAll = () => setNotifs([]);

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      className="absolute right-0 top-full mt-3 w-96 max-h-[520px] bg-card/95 backdrop-blur-3xl border border-border rounded-[28px] shadow-2xl overflow-hidden z-50"
    >
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Transmissions</span>
          {unread > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">{unread} new</span>
          )}
        </div>
        <div className="flex gap-3">
          {unread > 0 && <button onClick={markAllRead} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Mark read</button>}
          <button onClick={clearAll} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors">Clear</button>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[400px]">
        {notifs.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/40 flex items-center justify-center mb-4"><Bell size={20} className="text-muted-foreground/30" /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">No transmissions</p>
          </div>
        ) : (
          notifs.map(n => (
            <div key={n.id} className={`flex items-start gap-4 px-6 py-4 border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer ${!n.read ? "bg-primary/5" : ""}`}
              onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>
              <img src={n.actorAvatar} alt={n.actor} className="w-9 h-9 rounded-full object-cover border border-border shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground leading-snug">
                  <span className="text-primary">@{n.actor}</span>{" "}
                  {n.message}
                  {n.projectTitle && <span className="font-black"> "{n.projectTitle}"</span>}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <NotificationDot type={n.type} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">{n.type} · {timeAgo(n.createdAt)}</span>
                </div>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

/* ─── Main Page ─── */
export default function ExplorePage() {
  const { isDark, toggle } = useThemeStore();
  const { isAuthenticated, logout, user: authUser } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("Any");
  const [sortBy, setSortBy] = useState("Trending");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [showMoreCats, setShowMoreCats] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: "All", icon: LayoutGrid },
    { name: "Electronics", icon: Cpu },
    { name: "Hardware", icon: Bolt },
    { name: "Robotics", icon: SmartToy },
    { name: "Software", icon: Terminal },
    { name: "AI/ML", icon: Brain },
  ];

  const sortOptions = [
    { label: "Trending", icon: Flame },
    { label: "Newest", icon: Clock },
    { label: "Most Starred", icon: Star },
    { label: "Most Forked", icon: GitFork },
    { label: "Most Viewed", icon: TrendingUp },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sorted = [...projects].sort((a, b) => {
    if (sortBy === "Newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "Most Starred") return b.stars - a.stars;
    if (sortBy === "Most Forked") return b.forks - a.forks;
    if (sortBy === "Most Viewed") return b.views - a.views;
    return b.stars * 0.5 + b.views * 0.3 + b.forks * 0.2 - (a.stars * 0.5 + a.views * 0.3 + a.forks * 0.2);
  });

  const filteredProjects = sorted.filter(p => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDiff = difficulty === "Any" || p.level.toLowerCase() === difficulty.toLowerCase();
    return matchCat && matchSearch && matchDiff;
  });

  const featuredProject = sorted[0];
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleCreate = () => {
    if (!isAuthenticated) {
      toast.error("Authentication Required", {
        description: "Join the laboratory to document your artifacts.",
        action: { label: "Login", onClick: () => window.location.href = "/login" },
      });
      return;
    }
    window.location.href = "/project/new";
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background relative transition-colors duration-700 text-foreground font-sans overflow-x-hidden selection:bg-primary/30">
        <CircuitBackground />
        <LiquidBlob />
        <LiquidCursor />

        {/* ─── Header ─── */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 flex justify-center px-4 md:px-8 ${scrolled ? "py-4" : "py-8"}`}>
          <div className={`w-full max-w-7xl flex items-center justify-between px-6 md:px-10 transition-all duration-700 ${scrolled ? "h-16 rounded-full bg-card/80 backdrop-blur-3xl border border-border shadow-2xl" : "h-20 rounded-[32px] bg-card/40 backdrop-blur-xl border border-border/50"}`}>
            <div className="flex items-center gap-8">
              <Logo size="md" />
              <nav className="hidden xl:flex items-center gap-8">
                {[
                  { label: "Explore", href: "/explore" },
                  { label: "Feed", href: "/feed" },
                  { label: "Dashboard", href: "/dashboard" },
                ].map(item => (
                  <Link key={item.label} href={item.href} className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-all relative group">
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex-1 max-w-md mx-10 hidden lg:block">
              <div className="relative group">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search project, part, or builder…"
                  className="w-full h-11 pl-11 pr-5 rounded-full bg-muted/40 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={toggle} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all group">
                {isDark ? <Sun size={17} className="group-hover:rotate-45 transition-transform" /> : <Moon size={17} className="group-hover:-rotate-12 transition-transform" />}
              </button>
              <div className="h-5 w-px bg-border/50 mx-1 hidden sm:block" />

              {isAuthenticated ? (
                <>
                  {/* Notification bell */}
                  <div ref={notifRef} className="relative hidden sm:block">
                    <button onClick={() => setNotifOpen(!notifOpen)} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all relative group">
                      <Bell size={17} className="group-hover:animate-bounce" />
                      {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-card" />
                      )}
                    </button>
                    <AnimatePresence>
                      {notifOpen && <NotificationsDropdown onClose={() => setNotifOpen(false)} />}
                    </AnimatePresence>
                  </div>

                  <Button variant="primary" onClick={handleCreate} className="px-6 h-11 rounded-full text-[10px] font-black uppercase tracking-widest hidden sm:flex shadow-lg shadow-primary/20" icon={<Plus size={15} />}>
                    Create
                  </Button>

                  <Link href="/dashboard">
                    <div className="relative group cursor-pointer">
                      <img alt="Avatar" className="w-10 h-10 rounded-full border-2 border-border group-hover:border-primary transition-all" src={authUser?.avatar} />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card" />
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden sm:block">
                    <Button variant="ghost" className="px-6 h-11 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-muted/50">Login</Button>
                  </Link>
                  <Link href="/register" className="hidden sm:block">
                    <Button variant="primary" className="px-8 h-11 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Join</Button>
                  </Link>
                </>
              )}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all lg:hidden">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed inset-x-0 top-24 mx-4 z-40 p-8 rounded-[32px] bg-card/95 backdrop-blur-3xl border border-border shadow-2xl lg:hidden">
              <div className="flex flex-col gap-8">
                <div className="relative">
                  <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search…"
                    className="w-full h-14 pl-11 pr-5 rounded-2xl bg-muted/50 border border-border outline-none font-medium" />
                </div>
                <nav className="flex flex-col gap-6">
                  {["Explore", "Feed", "Dashboard"].map(item => (
                    <Link key={item} href={`/${item.toLowerCase()}`} className="text-2xl font-black text-foreground hover:text-primary transition-colors tracking-tight" onClick={() => setMobileMenuOpen(false)}>{item}</Link>
                  ))}
                  {!isAuthenticated && (
                    <div className="flex flex-col gap-4 pt-6 border-t border-border">
                      <Link href="/login" className="text-2xl font-black hover:text-primary transition-colors">Login</Link>
                      <Link href="/register" className="text-2xl font-black text-primary">Join Laboratory</Link>
                    </div>
                  )}
                </nav>
                <Button variant="primary" fullWidth onClick={handleCreate} className="h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                  {isAuthenticated ? "New Project" : "Become a Builder"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="relative z-10 pt-36 pb-24 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">

            {/* ─── Featured Hero (hidden during search) ─── */}
            <AnimatePresence>
              {!searchQuery && (
                <motion.section
                  key="hero"
                  initial={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mb-24"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500"><Flame size={20} className="animate-pulse" /></div>
                      <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Laboratory Trending</h2>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                      <History size={13} /> Last Updated: Mar 1
                    </div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="relative h-[500px] md:h-[600px] rounded-[48px] overflow-hidden border border-border group cursor-pointer shadow-3xl">
                    <img src={featuredProject.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Featured" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-10 md:p-16 w-full max-w-5xl">
                      <div className="flex gap-4 mb-8">
                        <span className="px-6 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-glow-cyan">Featured Artifact</span>
                        <span className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/20">{featuredProject.category}</span>
                      </div>
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-display text-white mb-8 leading-[1.1] tracking-tight">{featuredProject.title}</h1>
                      <p className="text-lg md:text-xl text-white/70 mb-12 line-clamp-2 font-medium max-w-3xl">{featuredProject.description}</p>
                      <div className="flex flex-wrap items-center gap-6">
                        <Link href={`/project/${featuredProject.id}`}>
                          <Button variant="primary" icon={<ArrowRight size={20} />} className="px-10 h-14 md:h-16 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40">
                            Explore Documentation
                          </Button>
                        </Link>
                        <div className="flex items-center gap-4 text-white/60 text-[10px] font-black uppercase tracking-widest">
                          <Star size={16} className="text-amber-400" /> {featuredProject.stars.toLocaleString()} stars
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* ─── Filter Bar ─── */}
            <section className="mb-20">
              <div className="bg-card/40 backdrop-blur-xl border border-border p-5 md:p-7 rounded-[36px] shadow-sm">
                {/* Top row: categories grid + right-side controls */}
                <div className="flex items-start gap-6">

                  {/* ── Categories: 2-row grid ── */}
                  <div className="flex-1">
                    <div className={`grid gap-2.5 ${showMoreCats ? "grid-cols-3 md:grid-cols-4 lg:grid-cols-6" : "grid-cols-3 md:grid-cols-6"}`}>
                      {(showMoreCats ? categories : categories.slice(0, 6)).map(cat => (
                        <CategoryPill
                          key={cat.name}
                          label={cat.name}
                          icon={cat.icon}
                          active={selectedCategory === cat.name}
                          onClick={() => setSelectedCategory(cat.name)}
                        />
                      ))}
                    </div>
                    {categories.length > 6 && (
                      <button
                        onClick={() => setShowMoreCats(!showMoreCats)}
                        className="mt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/50 hover:text-primary transition-colors ml-1"
                      >
                        <ChevronDown size={13} className={`transition-transform ${showMoreCats ? "rotate-180" : ""}`} />
                        {showMoreCats ? "Show Less" : `+${categories.length - 6} More`}
                      </button>
                    )}
                  </div>

                  {/* ── Right-side: difficulty + sort ── */}
                  <div className="flex flex-col items-end gap-3 shrink-0 ml-auto">
                    {/* Difficulty pill row */}
                    <div className="flex p-1.5 bg-muted/50 rounded-full border border-border shadow-inner">
                      {["Any", "Beginner", "Intermediate", "Advanced", "Expert"].map(l => (
                        <button key={l} onClick={() => setDifficulty(l)}
                          className={`px-3 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${difficulty === l ? "bg-card text-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                    {/* Sort — fixed right, high z-index */}
                    <div ref={sortRef} className="relative">
                      <button onClick={() => setSortOpen(!sortOpen)}
                        className="flex items-center gap-2.5 px-5 h-11 rounded-full bg-card border border-border text-foreground font-black text-[10px] uppercase tracking-widest hover:border-primary/50 transition-all shadow-sm">
                        <ArrowUpDown size={15} /> {sortBy} <ChevronDown size={13} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {sortOpen && (
                          <motion.div initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            className="absolute right-0 top-full mt-2 w-52 bg-card/95 backdrop-blur-3xl border border-border rounded-2xl shadow-2xl overflow-hidden z-[200]">
                            {sortOptions.map(opt => (
                              <button key={opt.label} onClick={() => { setSortBy(opt.label); setSortOpen(false); }}
                                className={`w-full flex items-center gap-3 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-muted/50 hover:text-primary ${sortBy === opt.label ? "text-primary bg-primary/5" : "text-muted-foreground"}`}>
                                <opt.icon size={14} /> {opt.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── Projects Grid ─── */}
            <section>
              <div className="flex items-center gap-5 mb-14">
                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground/50 whitespace-nowrap">
                  {searchQuery
                    ? <>Results for <span className="text-primary">&quot;{searchQuery}&quot;</span></>
                    : selectedCategory === "All" ? "Laboratory Records" : `${selectedCategory} Systems`
                  }
                </h3>
                <div className="h-px w-full bg-gradient-to-r from-border to-transparent" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 whitespace-nowrap">
                  {filteredProjects.length} Entries
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map(p => <ProjectCard key={p.id} project={p} />)
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="col-span-full py-40 flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-[32px] bg-muted/40 border-2 border-border/50 flex items-center justify-center mb-10">
                        <Search size={40} className="text-muted-foreground/20" />
                      </div>
                      <h3 className="text-3xl font-black font-display mb-6">System Cache Empty</h3>
                      <p className="text-muted-foreground max-w-md mx-auto font-medium mb-12">Adjust your parameters to discover engineering artifacts.</p>
                      <Button variant="secondary" className="px-12 h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em]"
                        onClick={() => { setSelectedCategory("All"); setSearchQuery(""); setDifficulty("Any"); }}>
                        Reset Parameters
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {filteredProjects.length > 0 && (
                <div className="mt-24 flex flex-col items-center gap-8">
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
                  <Button variant="ghost" className="px-12 h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border border-border bg-card/40 hover:bg-muted/50">
                    Sync More Records
                  </Button>
                </div>
              )}
            </section>
          </div>
        </main>

        {/* ─── Footer ─── */}
        <footer className="relative z-10 bg-card/80 backdrop-blur-3xl border-t border-border pt-24 pb-14">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
              <div className="col-span-1 md:col-span-2">
                <Logo size="lg" />
                <p className="mt-8 text-base text-muted-foreground max-w-md font-medium leading-relaxed">
                  The premier documentation and portfolio platform for multidisciplinary engineering. Built for builders, by builders.
                </p>
                <div className="flex gap-4 mt-12">
                  {[Share2, GitFork, ExternalLink, MessageSquare].map((Icon, i) => (
                    <button key={i} className="w-11 h-11 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all hover:-translate-y-1">
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8">Platform</h4>
                <ul className="flex flex-col gap-5">
                  {["Explore", "Laboratory", "Feed", "Dashboard"].map(item => (
                    <li key={item}><Link href={`/${item.toLowerCase()}`} className="text-muted-foreground hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest">{item}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-8">Resources</h4>
                <ul className="flex flex-col gap-5">
                  {["Documentation", "BOM Guide", "API", "Status"].map(item => (
                    <li key={item}><Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest">{item}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col items-center md:items-start gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40">© 2026 NetListLab. Transmission Secured.</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80">Systems Operational</span>
                </div>
              </div>
              <div className="flex gap-8">
                {["Privacy", "Terms", "Security"].map(item => (
                  <Link key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 hover:text-primary transition-colors">{item}</Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
