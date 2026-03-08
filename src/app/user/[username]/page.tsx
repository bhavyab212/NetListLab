"use client";

import { use, useState, useEffect } from "react";
import {
  ArrowLeft, MapPin, Briefcase, Calendar, Star, GitFork, ExternalLink,
  Github, Twitter, Linkedin, Mail, Sun, Moon, MessageSquare,
  TrendingUp, Cpu, ShieldCheck, UserPlus, UserCheck, Edit2, Loader2
} from "lucide-react";
import { useSocialStore } from "@/stores/socialStore";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { motion, AnimatePresence } from "framer-motion";
import CircuitBackground from "@/components/ui/CircuitBackground";
import LiquidCursor from "@/components/ui/LiquidCursor";
import LiquidBlob from "@/components/ui/LiquidBlob";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { api } from "@/lib/api";
import { ApiUser, ApiProject } from "@/lib/api-types";

// Category style mapping
const getCategoryStyles = (cat: string) => {
  const map: Record<string, string> = {
    "Analog": "text-rose-500 bg-rose-500/10 border-rose-500/20",
    "Digital": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    "Mixed-Signal": "text-violet-500 bg-violet-500/10 border-violet-500/20",
    "RF/Microwave": "text-amber-500 bg-amber-500/10 border-amber-500/20",
    "Power": "text-orange-500 bg-orange-500/10 border-orange-500/20"
  };
  return map[cat] || "text-primary bg-primary/10 border-primary/20";
};

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const router = useRouter();
  const { isDark, toggle } = useThemeStore();
  const { isAuthenticated, user: authUser } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const { isFollowing, toggleFollow } = useSocialStore();

  const [user, setUser] = useState<ApiUser | null>(null);
  const [userProjects, setUserProjects] = useState<ApiProject[]>([]);
  const [starredProjects, setStarredProjects] = useState<ApiProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userData, projectsData, starredData] = await Promise.all([
          api.getUser(username),
          api.getUserProjects(username),
          api.getUserStarred(username).catch(() => []) // Optional fallback
        ]);
        if (mounted) {
          setUser(userData);
          setUserProjects(projectsData);
          setStarredProjects(starredData);
        }
      } catch (err) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [username]);

  const isOwnProfile = authUser?.username === username;

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "dark bg-background" : "bg-background"}`}>
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "dark bg-background" : "bg-background"}`}>
        <div className="text-center p-12 rounded-[32px] bg-card border border-border shadow-2xl max-w-md">
          <h1 className="text-4xl font-black mb-4 font-display text-foreground">User not found</h1>
          <p className="text-muted-foreground mb-10 font-medium">This builder is not in our laboratory records.</p>
          <Button fullWidth variant="primary" onClick={() => router.push("/explore")} className="h-14 rounded-2xl font-black uppercase tracking-widest">Return to Explore</Button>
        </div>
      </div>
    );
  }

  const handleFollow = () => {
    if (!isAuthenticated || !authUser) {
      toast.error("Login Required", { description: "You need to be logged in to follow builders." });
      return;
    }
    toggleFollow(authUser.id, user.id);
    const nowFollowing = !isFollowing(user.id);
    toast.success(nowFollowing ? `Following @${user.username}!` : `Unfollowed @${user.username}`, {
      description: nowFollowing ? "Their artifacts will appear in your feed." : "Removed from your network.",
    });
  };

  const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);

  const socialLinks = [
    { icon: Github, label: "GitHub", value: user.github_url },
    { icon: Linkedin, label: "LinkedIn", value: user.linkedin_url },
    { icon: Twitter, label: "Twitter", value: user.twitter_url },
    { icon: Mail, label: "Email", value: user.email },
  ].filter(s => s.value);

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
              <button onClick={() => router.push("/explore")} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <Logo size="sm" />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggle} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all group">
                {isDark ? <Sun size={17} className="group-hover:rotate-45 transition-transform" /> : <Moon size={17} className="group-hover:-rotate-12 transition-transform" />}
              </button>
              <div className="h-5 w-px bg-border/50 mx-1 hidden sm:block" />
              {isOwnProfile ? (
                <Link href="/settings/profile">
                  <Button variant="ghost" icon={<Edit2 size={15} />} className="h-11 rounded-full px-5 uppercase text-[10px] font-black tracking-widest hidden sm:flex border border-border bg-muted/30">
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                <Button
                  variant={isFollowing(user.id) ? "secondary" : "primary"}
                  icon={isFollowing(user.id) ? <UserCheck size={15} /> : <UserPlus size={15} />}
                  onClick={handleFollow}
                  className="h-11 rounded-full px-7 uppercase text-[10px] font-black tracking-widest hidden sm:flex shadow-lg shadow-primary/10"
                >
                  {isFollowing(user.id) ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-5 md:px-8 pt-40 pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-14 lg:gap-20">

            {/* ─── Sidebar ─── */}
            <div className="lg:col-span-1 space-y-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center lg:items-start lg:text-left">
                {/* Avatar */}
                <div className="relative mb-9 group">
                  <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-[40px] overflow-hidden border-4 border-card shadow-3xl bg-muted p-1 group-hover:scale-105 transition-transform duration-500">
                    <img src={user.avatar_url ?? `https://i.pravatar.cc/150?u=${user.id}`} alt={user.full_name} className="w-full h-full object-cover rounded-[36px]" />
                  </div>
                  {user.is_verified && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full border-4 border-card flex items-center justify-center text-white shadow-xl">
                      <ShieldCheck size={18} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card shadow-lg" />
                </div>

                <h1 className="text-3xl font-black font-display tracking-tight mb-2 text-foreground">{user.full_name}</h1>
                <p className="text-muted-foreground/60 font-black text-[10px] uppercase tracking-[0.3em] mb-6 bg-muted/50 px-4 py-1.5 rounded-full border border-border">@{user.username}</p>
                {user.is_verified && <span className="mb-6 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">✓ Verified Builder</span>}
                <p className="text-base leading-relaxed text-muted-foreground font-medium mb-8 opacity-90">{user.bio}</p>

                {/* Meta */}
                <div className="space-y-4 w-full mb-8">
                  {[
                    { icon: Briefcase, text: `${user.current_role ?? "Builder"} @ ${user.institution ?? "Independent"}` },
                    { icon: MapPin, text: user.location ?? "Unknown" },
                    { icon: Calendar, text: `Joined ${new Date(user.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}` },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground/70">
                      <div className="p-2 rounded-lg bg-muted border border-border"><item.icon className="w-4 h-4" /></div>
                      {item.text}
                    </div>
                  ))}
                </div>

                {/* Socials */}
                {socialLinks.length > 0 && (
                  <div className="flex gap-3 mb-10">
                    {socialLinks.map((s, i) => (
                      <button key={i} onClick={() => window.open(s.value as string, '_blank')}
                        className="w-11 h-11 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all hover:-translate-y-1 shadow-sm">
                        <s.icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Mobile follow btn */}
                {!isOwnProfile && (
                  <Button variant={isFollowing(user.id) ? "secondary" : "primary"} fullWidth icon={isFollowing(user.id) ? <UserCheck size={15} /> : <UserPlus size={15} />}
                    onClick={handleFollow} className="h-12 rounded-2xl font-black uppercase tracking-widest sm:hidden mb-8">
                    {isFollowing(user.id) ? "Following" : "Follow"}
                  </Button>
                )}
              </motion.div>

              {/* Stats */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-4">
                {[
                  { label: "Followers", value: fmt(user.follower_count) },
                  { label: "Following", value: fmt(user.following_count) },
                  { label: "Projects", value: String(user.project_count) },
                  { label: "Stars", value: fmt(user.total_stars) },
                ].map(s => (
                  <div key={s.label} className="bg-card border border-border rounded-2xl p-5 text-center hover:border-primary/40 transition-all">
                    <p className="text-2xl font-black text-foreground font-display mb-1">{s.value}</p>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{s.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Skills */}
              {(user.skill_tags && user.skill_tags.length > 0) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-card border border-border rounded-[32px] p-8 shadow-xl">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 text-muted-foreground/50 flex items-center gap-2">
                    <TrendingUp size={15} /> Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {user.skill_tags.map(skill => (
                      <span key={skill} className="px-3 py-1.5 rounded-xl bg-muted border border-border text-[10px] font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all cursor-default">{skill}</span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ─── Main Content ─── */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="flex gap-2 border-b border-border mb-12 overflow-x-auto hide-scrollbar">
                {[
                  { id: "projects", label: "Documented Artifacts", count: userProjects.length },
                  { id: "starred", label: "Starred Records", count: starredProjects.length },
                  { id: "drafts", label: "Draft Systems", count: null },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`relative text-[11px] font-black uppercase tracking-[0.4em] px-4 py-5 whitespace-nowrap transition-colors ${activeTab === tab.id ? "text-primary" : "text-muted-foreground/40 hover:text-foreground"}`}>
                    {tab.label}
                    {tab.count !== null && <span className="ml-2 px-2 py-0.5 rounded-full bg-muted text-[9px] text-muted-foreground">{tab.count}</span>}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-glow-cyan" />}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {activeTab === "projects" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
                      {userProjects.length > 0 ? (
                        userProjects.map(p => (
                          <motion.article key={p.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                            className="bg-card/60 backdrop-blur-xl rounded-[28px] border border-border/50 overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-500 hover:shadow-2xl group cursor-pointer"
                            onClick={() => router.push(`/project/${p.id}`)}>
                            <div className="aspect-[16/10] relative overflow-hidden">
                              <img src={p.cover_image_url ?? `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={p.title} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-xl border border-white/10 ${getCategoryStyles(p.project_type)}`}>{p.project_type}</span>
                            </div>
                            <div className="p-7 flex-1 flex flex-col">
                              <h3 className="text-xl font-black font-display text-foreground group-hover:text-primary transition-colors mb-3 leading-tight">{p.title}</h3>
                              <p className="text-sm text-muted-foreground font-medium line-clamp-2 mb-6 opacity-80">{p.description ?? p.tagline}</p>
                              <div className="mt-auto pt-6 border-t border-border flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                <div className="flex gap-6">
                                  <span className="flex items-center gap-2 group-hover:text-amber-500 transition-colors"><Star className="w-3.5 h-3.5" /> {p.star_count >= 1000 ? (p.star_count / 1000).toFixed(1) + "k" : p.star_count}</span>
                                  <span className="flex items-center gap-2 group-hover:text-primary transition-colors"><GitFork className="w-3.5 h-3.5" /> {p.fork_count}</span>
                                </div>
                                <span className="flex items-center gap-2 text-primary font-black">View <ExternalLink className="w-3.5 h-3.5" /></span>
                              </div>
                            </div>
                          </motion.article>
                        ))
                      ) : (
                        <div className="col-span-full py-32 flex flex-col items-center text-center border-2 border-dashed border-muted rounded-[40px]">
                          <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center mb-6"><Cpu size={28} className="text-muted-foreground/20" /></div>
                          <h3 className="text-2xl font-black font-display mb-3">No artifacts documented</h3>
                          <p className="text-muted-foreground max-w-sm font-medium">This builder hasn&apos;t published any engineering records yet.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "starred" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
                      {starredProjects.length > 0 ? (
                        starredProjects.map(p => (
                          <motion.article key={p.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                            className="bg-card/60 backdrop-blur-xl rounded-[28px] border border-border/50 overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-500 hover:shadow-xl group cursor-pointer"
                            onClick={() => router.push(`/project/${p.id}`)}>
                            <div className="aspect-[16/10] relative overflow-hidden">
                              <img src={p.cover_image_url ?? `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={p.title} />
                              <div className="absolute top-4 left-4"><Star size={18} className="text-amber-400 fill-amber-400 drop-shadow-lg" /></div>
                            </div>
                            <div className="p-7">
                              <h3 className="text-xl font-black font-display text-foreground group-hover:text-primary transition-colors mb-2">{p.title}</h3>
                              <p className="text-sm text-muted-foreground font-medium opacity-70">@{p.author?.username ?? "unknown"}</p>
                            </div>
                          </motion.article>
                        ))
                      ) : (
                        <div className="col-span-full py-32 flex flex-col items-center text-center border-2 border-dashed border-muted rounded-[40px]">
                          <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center mb-6"><Star size={28} className="text-muted-foreground/20" /></div>
                          <h3 className="text-2xl font-black font-display mb-3">No starred artifacts</h3>
                          <p className="text-muted-foreground max-w-sm font-medium">This builder hasn&apos;t starred any projects yet.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "drafts" && (
                    <div className="py-32 flex flex-col items-center text-center border-2 border-dashed border-muted rounded-[40px]">
                      <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center mb-6"><Cpu size={28} className="text-muted-foreground/20" /></div>
                      <h3 className="text-2xl font-black font-display mb-3">No drafts</h3>
                      <p className="text-muted-foreground max-w-sm font-medium">Draft projects are private and only visible to the owner.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

        <footer className="relative z-10 py-14 border-t border-border bg-card/80 backdrop-blur-3xl mt-16">
          <div className="max-w-7xl mx-auto px-8 text-center"><Logo size="sm" /></div>
        </footer>
      </div>
    </div>
  );
}
