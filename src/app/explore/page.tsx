"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import {
  Search, Cpu, Bot, Brain, Server, Binary,
  ChevronDown, Filter, Star, MessageSquare, Bell, Plus,
  ArrowRight, GitFork, Download, Share2, ExternalLink,
  Flame, LayoutGrid, History, Menu, X, Sun, Moon,
  ArrowUpDown, TrendingUp, Clock, Zap, Bookmark, ArrowLeft,
  Box, HardDrive, Wifi, AlertCircle, RefreshCw, Users, UserPlus
} from "lucide-react";
import React from 'react';
import { useNotificationStore } from "@/stores/notificationStore";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { useInteractionsStore } from "@/stores/interactionsStore";
import { api, buildQueryString } from "@/lib/api";
import type { ApiProject, ApiUser } from "@/lib/api-types";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import CircuitBackground from "@/components/ui/CircuitBackground";
import LiquidCursor from "@/components/ui/LiquidCursor";
import LiquidBlob from "@/components/ui/LiquidBlob";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ─── Loading Skeleton ─── */
const ProjectCardSkeleton = () => (
  <div className="bg-card/60 backdrop-blur-xl rounded-[24px] border border-border/50 overflow-hidden flex flex-col animate-pulse">
    <div className="aspect-[16/10] bg-muted/50" />
    <div className="p-7 flex-1 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-muted/60" />
        <div className="h-3 w-24 rounded-full bg-muted/60" />
      </div>
      <div className="h-5 w-3/4 rounded-full bg-muted/60" />
      <div className="h-3 w-full rounded-full bg-muted/60" />
      <div className="h-3 w-5/6 rounded-full bg-muted/50" />
      <div className="flex gap-2 mt-2">
        <div className="h-6 w-16 rounded-xl bg-muted/40" />
        <div className="h-6 w-16 rounded-xl bg-muted/40" />
        <div className="h-6 w-16 rounded-xl bg-muted/40" />
      </div>
    </div>
  </div>
);

/* ─── Error State ─── */
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="col-span-full py-40 flex flex-col items-center text-center">
    <div className="w-24 h-24 rounded-[32px] bg-rose-500/10 border-2 border-rose-500/20 flex items-center justify-center mb-10">
      <AlertCircle size={40} className="text-rose-500/60" />
    </div>
    <h3 className="text-3xl font-black font-display mb-6">Signal Lost</h3>
    <p className="text-muted-foreground max-w-md mx-auto font-medium mb-12">
      Failed to load projects. Check your connection and try again.
    </p>
    <Button
      variant="secondary"
      className="px-12 h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em]"
      icon={<RefreshCw size={16} />}
      onClick={onRetry}
    >
      Retry
    </Button>
  </div>
);

const ProjectCard = ({ project }: { project: ApiProject }) => {
  const { user: authUser, isAuthenticated } = useAuthStore();
  const isStarred = useInteractionsStore(s => s.isStarred(project.id));
  const toggleStarAction = useInteractionsStore(s => s.toggleStar);
  const router = useRouter();

  const handleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please log in to continue", { description: "Sign in to star projects." });
      return;
    }

    // Optimistic toggle is handled by the store, but we can still show the toast
    toast.success(!isStarred ? "Project starred ⭐" : "Star removed");
    try {
      await toggleStarAction(project.id);
    } catch {
      toast.error("Something went wrong. Please try again");
    }
  };

  const handleReplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/project/${project.id}`);
    toast.info("Opening Blueprint View", { description: "Download available on the project page." });
  };

  const handleFork = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please log in to continue", { description: "Please login to fork projects." });
      return;
    }
    const loadId = toast.loading("Forking project…");
    try {
      const forked = await api.forkProject(project.id);
      toast.success("Project forked successfully", { id: loadId, description: `Forked to your drafts.` });
      router.push(`/project/${forked.id}`);
    } catch (err) {
      toast.error("Something went wrong. Please try again", { id: loadId });
    }
  };

  const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);

  // Map project_type to a display category label
  const categoryLabel = project.project_type.replace('_', '/').replace('AI/ML', 'AI/ML').replace('IOT', 'IoT');
  const categoryStyleMap: Record<string, string> = {
    ELECTRONICS: "bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-xl shadow-lg",
    HARDWARE: "bg-blue-100/90 dark:bg-blue-950/90 text-blue-800 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-xl shadow-lg",
    ROBOTICS: "bg-orange-100/90 dark:bg-orange-950/90 text-orange-800 dark:text-orange-300 border-orange-200/50 dark:border-orange-800/50 backdrop-blur-xl shadow-lg",
    SOFTWARE: "bg-rose-100/90 dark:bg-rose-950/90 text-rose-800 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/50 backdrop-blur-xl shadow-lg",
    AI_ML: "bg-violet-100/90 dark:bg-violet-950/90 text-violet-800 dark:text-violet-300 border-violet-200/50 dark:border-violet-800/50 backdrop-blur-xl shadow-lg",
    IOT: "bg-cyan-100/90 dark:bg-cyan-950/90 text-cyan-800 dark:text-cyan-300 border-cyan-200/50 dark:border-cyan-800/50 backdrop-blur-xl shadow-lg",
    MECHANICAL: "bg-amber-100/90 dark:bg-amber-950/90 text-amber-800 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/50 backdrop-blur-xl shadow-lg",
    DESIGN: "bg-pink-100/90 dark:bg-pink-950/90 text-pink-800 dark:text-pink-300 border-pink-200/50 dark:border-pink-800/50 backdrop-blur-xl shadow-lg",
    RESEARCH: "bg-indigo-100/90 dark:bg-indigo-950/90 text-indigo-800 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-xl shadow-lg",
    OTHER: "bg-gray-100/90 dark:bg-gray-950/90 text-gray-800 dark:text-gray-300 border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl shadow-lg",
  };
  const categoryStyles = categoryStyleMap[project.project_type] ?? categoryStyleMap.OTHER;
  const authorUsername = project.author?.username ?? 'unknown';
  const authorAvatar = project.author?.avatar_url ?? `https://i.pravatar.cc/150?u=${project.author_id}`;

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
          src={project.cover_image_url ?? `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className={`absolute left-4 top-4 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest ${categoryStyles}`}>
          {categoryLabel}
        </span>
        <span className="absolute right-4 top-4 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest backdrop-blur-xl border border-white/20 bg-white/90 text-black dark:bg-black/80 dark:text-white/90 shadow-lg">
          {project.difficulty}
        </span>
      </Link>

      <div className="p-7 flex-1 flex flex-col">
        <div className="mb-5 flex items-center gap-3">
          <Link href={`/user/${authorUsername}`} className="relative group/avatar">
            <img loading="lazy" alt="Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-border/50 shadow-sm group-hover/avatar:border-primary transition-all" src={authorAvatar} />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
          </Link>
          <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors tracking-[0.15em] uppercase">
            @{authorUsername}
          </span>
        </div>

        <Link href={`/project/${project.id}`}>
          <h3 className="mb-3 text-xl font-black font-display text-foreground leading-[1.2] group-hover:text-primary transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground/80 line-clamp-2 font-medium">
          {project.tagline ?? project.description ?? ''}
        </p>

        <div className="flex flex-wrap gap-2 mb-7">
          {project.tags.slice(0, 3).map(t => (
            <Link href={`/explore?tags=${encodeURIComponent(t)}`} key={t} className="px-3 py-1 rounded-xl bg-muted/60 border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/40 transition-all">
              {t}
            </Link>
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
              <Star size={15} className={isStarred ? "fill-amber-500" : ""} /> {fmt(project.star_count + (isStarred ? 0 : 0))}
            </button>
            <span className="flex items-center gap-2 hover:text-foreground cursor-default">
              <GitFork size={15} /> {fmt(project.fork_count)}
            </span>
          </div>
          <span className="flex items-center gap-2 hover:text-foreground cursor-default">
            <MessageSquare size={15} /> {fmt(project.comment_count)}
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
    <Icon size={16} strokeWidth={2.5} className={active ? "animate-pulse" : ""} />
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
  const { notifications: notifs, unreadCount: unread, markAllRead, clearAll, markAsRead } = useNotificationStore();

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
              onClick={() => { if (!n.read) markAsRead(n.id); }}>
              <img loading="lazy" src={n.actorAvatar} alt={n.actor} className="w-9 h-9 rounded-full object-cover border border-border shrink-0 mt-0.5" />
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

// Map category UI labels → backend project_type values
const CATEGORY_TYPE_MAP: Record<string, string | null> = {
  "All": null,
  "Electronics": "ELECTRONICS",
  "Hardware": "HARDWARE",
  "Robotics": "ROBOTICS",
  "Software": "SOFTWARE",
  "AI/ML": "AI_ML",
  "3D Print": "OTHER",
  "Mechanics": "MECHANICAL",
  "IoT": "IOT",
};

const SORT_MAP: Record<string, string> = {
  "Trending": "trending",
  "Newest": "latest",
  "Most Starred": "starred",
  "Most Forked": "trending",
  "Most Viewed": "viewed",
};

const DIFFICULTY_MAP: Record<string, string | null> = {
  "Any": null,
  "Beginner": "BEGINNER",
  "Intermediate": "INTERMEDIATE",
  "Advanced": "ADVANCED",
  "Expert": "EXPERT",
};

/* ─── Main Page ─── */
function ExplorePageContent() {
  const { isDark, toggle } = useThemeStore();
  const { isAuthenticated, logout, user: authUser } = useAuthStore();
  const { unreadCount: unreadNotifs } = useNotificationStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

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

  // ── API State ──────────────────────────────────────────────────────────────
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0.5 });

  const fetchProjects = useCallback(async (search?: string, fetchPage = 1) => {
    if (fetchPage === 1) setIsLoading(true);
    else setIsFetchingNextPage(true);
    setError(null);
    try {
      const urlTags = searchParams.get("tags");
      const params = buildQueryString({
        type: CATEGORY_TYPE_MAP[selectedCategory] ?? undefined,
        difficulty: DIFFICULTY_MAP[difficulty] ?? undefined,
        sort: SORT_MAP[sortBy] ?? "trending",
        search: search !== undefined ? search : searchQuery,
        tags: urlTags ?? undefined,
        limit: 12, // smaller limit to observe pagination easily
        page: fetchPage,
      });
      const result = await api.getProjects(params || undefined);
      if (fetchPage === 1) {
        setProjects(result.projects ?? []);
      } else {
        setProjects(prev => {
          const newIds = new Set(result.projects.map(p => p.id));
          return [...prev, ...result.projects.filter(p => !prev.some(old => newIds.has(old.id)))];
        });
      }
      setTotalCount(result.total ?? 0);
      setHasMore(fetchPage < result.totalPages);
      setPage(fetchPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [selectedCategory, difficulty, sortBy, searchQuery, searchParams]);

  useEffect(() => {
    if (inView && hasMore && !isLoading && !isFetchingNextPage) {
      fetchProjects(undefined, page + 1);
    }
  }, [inView, hasMore, isLoading, isFetchingNextPage, fetchProjects, page]);

  // Fetch on filter change (immediate, no debounce)
  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, difficulty, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchProjects(searchQuery);
    }, 300);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const categories = [
    { name: "All", icon: LayoutGrid },
    { name: "Electronics", icon: Cpu },
    { name: "Hardware", icon: Server },
    { name: "Robotics", icon: Bot },
    { name: "Software", icon: Binary },
    { name: "AI/ML", icon: Brain },
    { name: "3D Print", icon: Box },
    { name: "Mechanics", icon: HardDrive },
    { name: "IoT", icon: Wifi },
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

  const featuredProject = projects[0] ?? null;

  const matchingBuilders = React.useMemo(() => {
    if (!searchQuery) return [];
    const seen = new Set<string>();
    const builders: ApiUser[] = [];
    const q = searchQuery.toLowerCase();
    for (const p of projects) {
      if (p.author && !seen.has(p.author.id)) {
        if (p.author.username.toLowerCase().includes(q) || p.author.full_name?.toLowerCase().includes(q)) {
          seen.add(p.author.id);
          builders.push(p.author);
        }
      }
    }
    return builders;
  }, [searchQuery, projects]);

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
          <div className={`w-full max-w-[1600px] flex items-center justify-between px-6 md:px-10 transition-all duration-700 ${scrolled ? "h-16 rounded-full bg-card/80 backdrop-blur-3xl border border-border shadow-2xl" : "h-20 rounded-[32px] bg-card/40 backdrop-blur-xl border border-border/50"}`}>
            <div className="flex items-center gap-5">
              <button onClick={() => router.back()} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <Logo size="md" />
              <nav className="hidden xl:flex items-center gap-8 pl-3">
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
                      {unreadNotifs > 0 && (
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
                      <img loading="lazy" alt="Avatar" className="w-10 h-10 rounded-full border-2 border-border group-hover:border-primary transition-all" src={authUser?.avatar_url ?? `https://i.pravatar.cc/150?u=${authUser?.id}`} />
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
          <div className="max-w-[1600px] mx-auto">

            {/* ─── Featured Hero (hidden during search) ─── */}
            <AnimatePresence>
              {!searchQuery && featuredProject && !isLoading && (
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
                      <History size={13} /> Live Data
                    </div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="relative h-[500px] md:h-[600px] rounded-[48px] overflow-hidden border border-border group cursor-pointer shadow-3xl">
                    <img
                      src={featuredProject.cover_image_url ?? `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      alt="Featured"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-10 md:p-16 w-full max-w-5xl">
                      <div className="flex gap-4 mb-8">
                        <span className="px-6 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-glow-cyan">Featured Artifact</span>
                        <span className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/20">{featuredProject.project_type}</span>
                      </div>
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-display text-white mb-8 leading-[1.1] tracking-tight">{featuredProject.title}</h1>
                      <p className="text-lg md:text-xl text-white/70 mb-12 line-clamp-2 font-medium max-w-3xl">{featuredProject.tagline ?? featuredProject.description ?? ''}</p>
                      <div className="flex flex-wrap items-center gap-6">
                        <Link href={`/project/${featuredProject.id}`}>
                          <Button variant="primary" icon={<ArrowRight size={20} />} className="px-10 h-14 md:h-16 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40">
                            Explore Documentation
                          </Button>
                        </Link>
                        <div className="flex items-center gap-4 text-white/60 text-[10px] font-black uppercase tracking-widest">
                          <Star size={16} className="text-amber-400" /> {featuredProject.star_count.toLocaleString()} stars
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
                <div className="flex items-start gap-6">
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

                  <div className="flex flex-col items-end gap-3 shrink-0 ml-auto">
                    <div className="flex p-1.5 bg-muted/50 rounded-full border border-border shadow-inner">
                      {["Any", "Beginner", "Intermediate", "Advanced", "Expert"].map(l => (
                        <button key={l} onClick={() => setDifficulty(l)}
                          className={`px-3 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${difficulty === l ? "bg-card text-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>
                          {l}
                        </button>
                      ))}
                    </div>
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
                    ? <><span>Results for </span><span className="text-primary">"{searchQuery}"</span></>
                    : searchParams.get("tags")
                      ? <><span>Filtered by </span><span className="text-primary">#{searchParams.get("tags")}</span></>
                      : selectedCategory === "All" ? "Laboratory Records" : `${selectedCategory} Systems`
                  }
                </h3>
                <div className="h-px w-full bg-gradient-to-r from-border to-transparent" />
                {!isLoading && !error && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 whitespace-nowrap">
                    {totalCount} Entries
                  </span>
                )}
              </div>

              {/* ─── Matching Builders (Users) ─── */}
              {searchQuery && matchingBuilders.length > 0 && (
                <div className="mb-14">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-6 flex items-center gap-2">
                    <Users size={14} className="text-primary" /> Matching Builders
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matchingBuilders.map(u => (
                      <div key={u.id} className="bg-card/40 border border-border rounded-3xl p-5 flex items-center gap-4 hover:border-primary/40 transition-all cursor-pointer group" onClick={() => window.location.href = `/user/${u.username}`}>
                        <img loading="lazy" src={u.avatar_url ?? `https://i.pravatar.cc/150?u=${u.id}`} alt={u.full_name} className="w-12 h-12 rounded-full border-2 border-border group-hover:border-primary transition-all object-cover" />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-black text-foreground group-hover:text-primary transition-colors truncate">{u.full_name}</h5>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/70 truncate">@{u.username}</p>
                        </div>
                        <Button variant="ghost" className="w-10 h-10 rounded-full border border-border bg-muted/30 p-0 flex items-center justify-center shrink-0 hover:bg-primary/10 hover:text-primary transition-all">
                          <UserPlus size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 6 }).map((_, i) => (
                      <motion.div key={`skeleton-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ProjectCardSkeleton />
                      </motion.div>
                    ))
                  ) : error ? (
                    <ErrorState onRetry={fetchProjects} />
                  ) : projects.length > 0 ? (
                    projects.map(p => <ProjectCard key={p.id} project={p} />)
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

              {!isLoading && !error && projects.length > 0 && (
                <div className="mt-24 flex flex-col items-center gap-8 text-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
                  {hasMore ? (
                    <div ref={loadMoreRef} className="py-10">
                      <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
                      <p className="text-[10px] mt-4 uppercase tracking-[0.2em] font-black text-muted-foreground">Syncing more records</p>
                    </div>
                  ) : (
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/40 mt-6">End of Archives</p>
                  )}
                </div>
              )}
            </section>
          </div>
        </main>

        {/* ─── Footer ─── */}
        <footer className="relative z-10 bg-card/80 backdrop-blur-3xl border-t border-border pt-24 pb-14">
          <div className="max-w-[1600px] mx-auto px-8">
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

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
      <ExplorePageContent />
    </Suspense>
  );
}
