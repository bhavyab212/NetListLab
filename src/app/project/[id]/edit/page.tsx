"use client";

import { use, useState, useEffect } from "react";
import {
    ArrowLeft, Save, Sun, Moon, Plus, Trash2, Eye, AlertTriangle
} from "lucide-react";
import { projects } from "@/mockData/projects";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { motion } from "framer-motion";
import CircuitBackground from "@/components/ui/CircuitBackground";
import LiquidCursor from "@/components/ui/LiquidCursor";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = ["Electronics", "Hardware", "Robotics", "Software", "AI/ML"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { isDark, toggle } = useThemeStore();
    const { isAuthenticated, user: authUser } = useAuthStore();
    const router = useRouter();
    const project = projects.find(p => p.id === parseInt(id));

    const [title, setTitle] = useState(project?.title ?? "");
    const [category, setCategory] = useState(project?.category ?? "");
    const [difficulty, setDifficulty] = useState(project?.level ?? "");
    const [description, setDescription] = useState(project?.description ?? "");
    const [coverUrl, setCoverUrl] = useState(project?.image ?? "");
    const [tags, setTags] = useState<string[]>(project?.tags ?? []);
    const [tagInput, setTagInput] = useState("");
    const [status, setStatus] = useState<"published" | "draft">(project?.status ?? "published");
    const [isDirty, setIsDirty] = useState(false);
    const [activeSection, setActiveSection] = useState("basics");

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        if (!project) return;
        if (project.authorId !== "user-1") {
            toast.error("Unauthorized", { description: "You can only edit your own projects." });
            router.push("/dashboard");
        }
    }, [isAuthenticated, project, router]);

    if (!project) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? "dark bg-background" : "bg-background"}`}>
                <div className="text-center p-12 rounded-[32px] bg-card border border-border shadow-2xl max-w-md">
                    <AlertTriangle size={40} className="text-amber-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-black font-display mb-4 text-foreground">Project Not Found</h1>
                    <Button variant="primary" fullWidth onClick={() => router.push("/dashboard")} className="h-14 rounded-2xl font-black uppercase tracking-widest">Go to Dashboard</Button>
                </div>
            </div>
        );
    }

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(""); setIsDirty(true); }
    };

    const handleSave = () => {
        const tid = toast.loading("Saving changes…");
        setTimeout(() => {
            toast.success("Changes Saved", { id: tid, description: `${title} has been updated.` });
            setIsDirty(false);
        }, 1000);
    };

    const inputCls = "w-full h-12 px-5 rounded-2xl bg-muted/40 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm placeholder:text-muted-foreground/40";
    const labelCls = "block text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-3";

    const sections = ["basics", "cover", "tags", "status"];

    return (
        <div className={isDark ? "dark" : ""}>
            <div className="min-h-screen bg-background text-foreground font-sans relative transition-colors duration-700">
                <CircuitBackground />
                <LiquidCursor />

                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-background/80 backdrop-blur-3xl border-b border-border">
                    <div className="flex items-center gap-5">
                        <button onClick={() => router.push("/dashboard")} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <Logo size="sm" />
                        {isDirty && <span className="hidden sm:block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest">Unsaved</span>}
                    </div>
                    <h1 className="text-sm font-black uppercase tracking-[0.3em] text-foreground hidden md:block">Edit: {project.title}</h1>
                    <div className="flex items-center gap-3">
                        <button onClick={toggle} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all">
                            {isDark ? <Sun size={17} /> : <Moon size={17} />}
                        </button>
                        <Link href={`/project/${project.id}`}>
                            <Button variant="ghost" icon={<Eye size={15} />} className="h-10 px-5 rounded-full text-[10px] font-black uppercase tracking-widest border border-border hidden sm:flex">Preview</Button>
                        </Link>
                        <Button variant="primary" icon={<Save size={15} />} onClick={handleSave} className="h-10 px-5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Save</Button>
                    </div>
                </header>

                <main className="pt-28 pb-20 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                            {/* Section Nav */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-32 space-y-2">
                                    {sections.map(s => (
                                        <button key={s} onClick={() => setActiveSection(s)}
                                            className={`w-full text-left px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeSection === s ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}>
                                            {s === "basics" ? "Content" : s === "cover" ? "Cover Image" : s === "tags" ? "Tech Stack" : "Visibility"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Edit Form */}
                            <div className="lg:col-span-3">
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                                    {activeSection === "basics" && (
                                        <div className="space-y-7 bg-card/60 border border-border rounded-[28px] p-9">
                                            <h2 className="text-2xl font-black font-display mb-6">Content</h2>
                                            <div>
                                                <label className={labelCls}>Title *</label>
                                                <input value={title} onChange={e => { setTitle(e.target.value); setIsDirty(true); }} className={inputCls} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label className={labelCls}>Category</label>
                                                    <div className="flex flex-col gap-2">
                                                        {CATEGORIES.map(c => (
                                                            <button key={c} onClick={() => { setCategory(c); setIsDirty(true); }}
                                                                className={`py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${category === c ? "bg-primary/10 border-primary text-primary" : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"}`}>
                                                                {c}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Difficulty</label>
                                                    <div className="flex flex-col gap-2">
                                                        {DIFFICULTIES.map(d => (
                                                            <button key={d} onClick={() => { setDifficulty(d); setIsDirty(true); }}
                                                                className={`py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${difficulty === d ? "bg-primary/10 border-primary text-primary" : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"}`}>
                                                                {d}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className={labelCls}>Description</label>
                                                <textarea value={description} onChange={e => { setDescription(e.target.value); setIsDirty(true); }} rows={5}
                                                    className="w-full px-5 py-4 rounded-2xl bg-muted/40 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm placeholder:text-muted-foreground/40 resize-none" />
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === "cover" && (
                                        <div className="space-y-6 bg-card/60 border border-border rounded-[28px] p-9">
                                            <h2 className="text-2xl font-black font-display mb-6">Cover Image</h2>
                                            <div>
                                                <label className={labelCls}>Image URL</label>
                                                <input value={coverUrl} onChange={e => { setCoverUrl(e.target.value); setIsDirty(true); }} placeholder="https://images.unsplash.com/…" className={inputCls} />
                                            </div>
                                            {coverUrl && (
                                                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-border">
                                                    <img src={coverUrl} alt="cover" className="w-full h-full object-cover" onError={() => setCoverUrl("")} />
                                                    <button onClick={() => { setCoverUrl(""); setIsDirty(true); }} className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-white hover:text-rose-400 transition-colors"><Trash2 size={15} /></button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeSection === "tags" && (
                                        <div className="space-y-6 bg-card/60 border border-border rounded-[28px] p-9">
                                            <h2 className="text-2xl font-black font-display mb-6">Tech Stack Tags</h2>
                                            <div className="flex flex-wrap gap-2 min-h-12">
                                                {tags.map(t => (
                                                    <span key={t} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                                                        {t}
                                                        <button onClick={() => { setTags(tags.filter(x => x !== t)); setIsDirty(true); }} className="hover:text-rose-500 transition-colors"><Trash2 size={11} /></button>
                                                    </span>
                                                ))}
                                                {tags.length === 0 && <span className="text-sm text-muted-foreground/40 font-medium">No tags yet…</span>}
                                            </div>
                                            <div className="flex gap-3">
                                                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTag()} placeholder="Add tag…" className={`${inputCls} flex-1`} />
                                                <button onClick={addTag} className="px-5 h-12 rounded-2xl bg-muted/50 border border-border text-foreground font-black text-[10px] uppercase tracking-widest hover:border-primary/50 transition-all flex items-center gap-2"><Plus size={15} /> Add</button>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === "status" && (
                                        <div className="space-y-6 bg-card/60 border border-border rounded-[28px] p-9">
                                            <h2 className="text-2xl font-black font-display mb-6">Project Visibility</h2>
                                            <div className="grid grid-cols-2 gap-5">
                                                {[
                                                    { val: "published" as const, label: "Published", desc: "Live in the laboratory, visible to everyone." },
                                                    { val: "draft" as const, label: "Draft", desc: "Only visible to you. Not in public explore." },
                                                ].map(opt => (
                                                    <button key={opt.val} onClick={() => { setStatus(opt.val); setIsDirty(true); }}
                                                        className={`p-7 rounded-[24px] border-2 text-left transition-all ${status === opt.val ? "bg-primary/10 border-primary" : "bg-muted/40 border-border hover:border-primary/40"}`}>
                                                        <div className={`w-4 h-4 rounded-full border-2 mb-4 ${status === opt.val ? "bg-primary border-primary" : "border-border"}`} />
                                                        <p className={`font-black text-base mb-1 ${status === opt.val ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
                                                        <p className="text-sm text-muted-foreground font-medium">{opt.desc}</p>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex gap-3 pt-4">
                                                <Button variant="primary" icon={<Save size={15} />} onClick={handleSave} className="flex-1 h-14 rounded-[20px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">Save Changes</Button>
                                                <button onClick={() => { toast.error("Are you sure?", { description: "This will permanently delete the project.", action: { label: "Delete", onClick: () => router.push("/dashboard") } }); }}
                                                    className="px-5 h-14 rounded-[20px] bg-rose-500/5 border border-rose-500/20 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 transition-all flex items-center gap-2">
                                                    <Trash2 size={15} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
