"use client";

import { use, useState, useEffect } from "react";
import {
    ArrowLeft, Save, Sun, Moon, Plus, Trash2, Eye, AlertTriangle,
    ShoppingCart, Tag, Code, FileText
} from "lucide-react";
import { useProjectsStore } from "@/stores/projectsStore";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { motion } from "framer-motion";
import CircuitBackground from "@/components/ui/CircuitBackground";
import LiquidCursor from "@/components/ui/LiquidCursor";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import ImageUploadInput from "@/components/ui/ImageUploadInput";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = ["Electronics", "Hardware", "Robotics", "Software", "AI/ML"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Expert"];

interface BOMRow { name: string; category: string; qty: number; price: string; supplier: string; link: string; }
interface BuildStep { title: string; body: string; time: string; imageUrl: string; }
interface CodeFile { name: string; language: string; content: string; id: string; }

export default function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { isDark, toggle } = useThemeStore();
    const { isAuthenticated, user: authUser } = useAuthStore();
    const router = useRouter();
    const { projects, updateProject } = useProjectsStore();
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

    // Additional editable state (mock initialization)
    const [buildSteps, setBuildSteps] = useState<BuildStep[]>(project?.buildSteps?.length ? project.buildSteps : [{ title: "Step 1", body: "Initial setup.", time: "", imageUrl: "" }]);
    const [bomRows, setBomRows] = useState<BOMRow[]>(project?.bom?.length ? project.bom : [{ name: "ESP32", category: "Microcontroller", qty: 1, price: "450", supplier: "", link: "" }]);
    const [codeFiles, setCodeFiles] = useState<CodeFile[]>(project?.codeFiles?.length ? project.codeFiles : [{ id: "1", name: "main.cpp", language: "cpp", content: "// Main project firmware" }]);
    const [activeFileId, setActiveFileId] = useState(project?.codeFiles?.[0]?.id || "1");

    // NEW STATES FOR FULL PARITY
    const [version, setVersion] = useState(project?.version || "");
    const [license, setLicense] = useState(project?.license || "");
    const [safetyNotice, setSafetyNotice] = useState(project?.safetyNotice || "");

    // Metadata
    const [prerequisites, setPrerequisites] = useState<string[]>(project?.prerequisites || []);
    const [prereqInput, setPrereqInput] = useState("");
    const [tools, setTools] = useState<string[]>(project?.tools || []);
    const [toolInput, setToolInput] = useState("");
    const [objectives, setObjectives] = useState<string[]>(project?.objectives || []);
    const [objectiveInput, setObjectiveInput] = useState("");
    const [designDecisions, setDesignDecisions] = useState<{ q: string, a: string }[]>(project?.designDecisions || []);
    const [githubUrl, setGithubUrl] = useState(project?.githubUrl || "");
    const [docsUrl, setDocsUrl] = useState(project?.docsUrl || "");

    // Schematics
    const [schematics, setSchematics] = useState<{ name: string, tag: string, tool: string, layers: string, desc: string, img: string }[]>(project?.schematics || []);
    const [pcbLayers, setPcbLayers] = useState<{ num: string, color: string, type: string, weight: string }[]>(project?.pcbLayers || []);
    const [pcbBoardSpecs, setPcbBoardSpecs] = useState(project?.pcbBoardSpecs || { material: "", thickness: "", finish: "", silkscreen: "", soldermask: "", minTrace: "" });
    const [designRules, setDesignRules] = useState<{ rule: string, value: string, status: string }[]>(project?.designRules || []);
    const [signalNotes, setSignalNotes] = useState<string[]>(project?.signalNotes || []);
    const [signalInput, setSignalInput] = useState("");

    // Code additions
    const [dependencies, setDependencies] = useState<{ name: string, ver: string, license: string, desc: string }[]>(project?.dependencies || []);
    const [buildInstructions, setBuildInstructions] = useState<{ step: string, cmd: string, note: string }[]>(project?.buildInstructions || []);
    const [envSetup, setEnvSetup] = useState<{ title: string, items: string[] }[]>(project?.envSetup || []);
    const [testSuite, setTestSuite] = useState<{ name: string, file: string, status: string, ms: string, desc: string }[]>(project?.testSuite || []);

    // Media additions
    const [galleryImages, setGalleryImages] = useState<{ url: string, caption: string, label: string }[]>(project?.galleryImages || []);
    const [videos, setVideos] = useState<{ title: string, url: string }[]>(project?.videos || []);
    const [simulations, setSimulations] = useState<{ title: string, desc: string, url: string, icon: string, badge: string }[]>(project?.simulations || []);
    const [buildLogs, setBuildLogs] = useState<{ date: string, title: string, body: string, tag: string, images: string[] }[]>(project?.buildLogs || []);
    const [downloads, setDownloads] = useState<{ name: string, size: string, fmt: string, url: string }[]>(project?.downloads || []);

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        if (!project) return;
        if (project.authorId !== authUser?.id) {
            toast.error("Unauthorized", { description: "You can only edit your own projects." });
            router.push("/dashboard");
        }
    }, [isAuthenticated, project, router, authUser]);

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
        if (!project) return;
        const tid = toast.loading("Saving changes…");
        updateProject(project.id, {
            title, category, difficulty, description, image: coverUrl, tags, status,
            version, license, safetyNotice,
            bom: bomRows, buildSteps, codeFiles,
            prerequisites, tools, objectives, designDecisions, githubUrl, docsUrl,
            schematics, pcbLayers, pcbBoardSpecs, designRules, signalNotes,
            dependencies, buildInstructions, envSetup, testSuite,
            galleryImages, videos, simulations, buildLogs, downloads
        });
        setTimeout(() => {
            toast.success("Changes Saved", { id: tid, description: `${title} has been updated.` });
            setIsDirty(false);
        }, 1000);
    };

    const addBOMRow = () => { setBomRows([...bomRows, { name: "", category: "", qty: 1, price: "", supplier: "", link: "" }]); setIsDirty(true); };
    const removeBOMRow = (i: number) => { setBomRows(bomRows.filter((_, j) => j !== i)); setIsDirty(true); };
    const updateBOMRow = (i: number, field: keyof BOMRow, val: string | number) => {
        setBomRows(bomRows.map((r, j) => j === i ? { ...r, [field]: val } : r));
        setIsDirty(true);
    };

    const addStep = () => { setBuildSteps([...buildSteps, { title: "", body: "", time: "", imageUrl: "" }]); setIsDirty(true); };
    const removeStep = (i: number) => { setBuildSteps(buildSteps.filter((_, j) => j !== i)); setIsDirty(true); };
    const updateStep = (i: number, field: keyof BuildStep, val: string) => {
        setBuildSteps(buildSteps.map((s, j) => j === i ? { ...s, [field]: val } : s));
        setIsDirty(true);
    };

    const addCodeFile = () => {
        const newId = Date.now().toString();
        setCodeFiles([...codeFiles, { id: newId, name: "new_file.cpp", language: "cpp", content: "" }]);
        setActiveFileId(newId);
        setIsDirty(true);
    };
    const removeCodeFile = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (codeFiles.length <= 1) return;
        const filtered = codeFiles.filter(f => f.id !== id);
        setCodeFiles(filtered);
        if (activeFileId === id) setActiveFileId(filtered[0].id);
        setIsDirty(true);
    };
    const updateCodeFile = (id: string, field: keyof CodeFile, val: string) => {
        setCodeFiles(codeFiles.map(f => f.id === id ? { ...f, [field]: val } : f));
        setIsDirty(true);
    };

    const activeFile = codeFiles.find(f => f.id === activeFileId) || codeFiles[0];

    const inputCls = "w-full h-12 px-5 rounded-2xl bg-muted/40 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm placeholder:text-muted-foreground/40";
    const labelCls = "block text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-3";

    const sections = ["basics", "metadata", "cover", "tags", "build_steps", "bom", "schematics", "code", "media", "status"];

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
                                            {s === "basics" ? "Content" : s === "metadata" ? "Metadata" : s === "cover" ? "Cover Image" : s === "tags" ? "Tech Stack" : s === "build_steps" ? "Build Steps" : s === "bom" ? "BOM" : s === "schematics" ? "Schematics" : s === "code" ? "Firmware" : s === "media" ? "Media" : "Visibility"}
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

                                    {activeSection === "metadata" && (
                                        <div className="space-y-7 bg-card/60 border border-border rounded-[28px] p-9">
                                            <h2 className="text-2xl font-black font-display mb-6">Metadata</h2>

                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label className={labelCls}>Version (e.g. v1.0.0)</label>
                                                    <input value={version} onChange={e => { setVersion(e.target.value); setIsDirty(true); }} className={inputCls} />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>License (e.g. MIT)</label>
                                                    <input value={license} onChange={e => { setLicense(e.target.value); setIsDirty(true); }} className={inputCls} />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={labelCls}>Safety Notice</label>
                                                <textarea value={safetyNotice} onChange={e => { setSafetyNotice(e.target.value); setIsDirty(true); }} rows={2} placeholder="e.g. High voltage present. Proceed with caution."
                                                    className="w-full px-5 py-4 rounded-2xl bg-muted/40 border border-border focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-medium text-sm placeholder:text-muted-foreground/40 resize-none" />
                                            </div>

                                            {/* Prerequisites */}
                                            <div>
                                                <label className={labelCls}>Prerequisites</label>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {prerequisites.map((p, i) => (
                                                        <span key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
                                                            {p} <button onClick={() => { setPrerequisites(prerequisites.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="hover:text-rose-500 transition-colors"><Trash2 size={11} /></button>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-3">
                                                    <input value={prereqInput} onChange={e => setPrereqInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && prereqInput.trim()) { setPrerequisites([...prerequisites, prereqInput.trim()]); setPrereqInput(""); setIsDirty(true); } }} placeholder="e.g. Basic soldering" className={`${inputCls} flex-1`} />
                                                    <button onClick={() => { if (prereqInput.trim()) { setPrerequisites([...prerequisites, prereqInput.trim()]); setPrereqInput(""); setIsDirty(true); } }} className="px-5 h-12 rounded-2xl bg-muted/50 border border-border text-foreground font-black text-[10px] uppercase tracking-widest hover:border-accent/50 hover:text-accent transition-all flex items-center gap-2"><Plus size={15} /> Add</button>
                                                </div>
                                            </div>

                                            {/* Tools */}
                                            <div>
                                                <label className={labelCls}>Required Tools</label>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {tools.map((t, i) => (
                                                        <span key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                                                            {t} <button onClick={() => { setTools(tools.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="hover:text-rose-500 transition-colors"><Trash2 size={11} /></button>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-3">
                                                    <input value={toolInput} onChange={e => setToolInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && toolInput.trim()) { setTools([...tools, toolInput.trim()]); setToolInput(""); setIsDirty(true); } }} placeholder="e.g. Soldering Iron" className={`${inputCls} flex-1`} />
                                                    <button onClick={() => { if (toolInput.trim()) { setTools([...tools, toolInput.trim()]); setToolInput(""); setIsDirty(true); } }} className="px-5 h-12 rounded-2xl bg-muted/50 border border-border text-foreground font-black text-[10px] uppercase tracking-widest hover:border-orange-500/50 hover:text-orange-500 transition-all flex items-center gap-2"><Plus size={15} /> Add</button>
                                                </div>
                                            </div>

                                            {/* Objectives */}
                                            <div>
                                                <label className={labelCls}>Technical Objectives</label>
                                                <div className="flex flex-col gap-2 mb-3">
                                                    {objectives.map((o, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border">
                                                            <span className="text-sm font-medium">{o}</span>
                                                            <button onClick={() => { setObjectives(objectives.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="text-muted-foreground hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex gap-3">
                                                    <input value={objectiveInput} onChange={e => setObjectiveInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && objectiveInput.trim()) { setObjectives([...objectives, objectiveInput.trim()]); setObjectiveInput(""); setIsDirty(true); } }} placeholder="e.g. Sub-10uA sleep current" className={`${inputCls} flex-1`} />
                                                    <button onClick={() => { if (objectiveInput.trim()) { setObjectives([...objectives, objectiveInput.trim()]); setObjectiveInput(""); setIsDirty(true); } }} className="px-5 h-12 rounded-2xl bg-muted/50 border border-border text-foreground font-black text-[10px] uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2"><Plus size={15} /> Add</button>
                                                </div>
                                            </div>

                                            {/* Design Decisions */}
                                            <div>
                                                <label className={labelCls}>Design Decisions & Rationale</label>
                                                <div className="space-y-4 mb-3">
                                                    {designDecisions.map((d, i) => (
                                                        <div key={i} className="p-4 rounded-xl bg-muted/20 border border-border relative group">
                                                            <button onClick={() => { setDesignDecisions(designDecisions.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="absolute top-3 right-3 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                                                            <input value={d.q} onChange={e => { setDesignDecisions(designDecisions.map((x, idx) => idx === i ? { ...x, q: e.target.value } : x)); setIsDirty(true); }} placeholder="Question (e.g. Why use this MCU?)" className="w-full bg-transparent outline-none font-bold text-sm mb-2 placeholder:text-muted-foreground/40" />
                                                            <textarea value={d.a} onChange={e => { setDesignDecisions(designDecisions.map((x, idx) => idx === i ? { ...x, a: e.target.value } : x)); setIsDirty(true); }} rows={2} placeholder="Rationale..." className="w-full bg-transparent outline-none text-sm text-foreground/80 resize-none placeholder:text-muted-foreground/30" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <button onClick={() => { setDesignDecisions([...designDecisions, { q: "", a: "" }]); setIsDirty(true); }} className="w-full h-12 rounded-xl border border-dashed border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center gap-2"><Plus size={14} /> Add Decision</button>
                                            </div>

                                            {/* Links */}
                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label className={labelCls}>GitHub Repository</label>
                                                    <input value={githubUrl} onChange={e => { setGithubUrl(e.target.value); setIsDirty(true); }} placeholder="https://github.com/..." className={inputCls} />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Documentation URL</label>
                                                    <input value={docsUrl} onChange={e => { setDocsUrl(e.target.value); setIsDirty(true); }} placeholder="https://docs..." className={inputCls} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === "cover" && (
                                        <div className="space-y-6 bg-card/60 border border-border rounded-[28px] p-9">
                                            <h2 className="text-2xl font-black font-display mb-6">Cover Image</h2>
                                            <div>
                                                <label className={labelCls}>Image URL</label>
                                                <ImageUploadInput value={coverUrl} onChange={url => { setCoverUrl(url); setIsDirty(true); }} placeholder="https://images.unsplash.com/…" className={inputCls} />
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

                                    {activeSection === "build_steps" && (
                                        <div className="space-y-6 bg-card/60 border border-border rounded-[28px] p-9">
                                            <h2 className="text-2xl font-black font-display mb-6">Build Steps</h2>
                                            <div className="space-y-6">
                                                {buildSteps.map((s, i) => (
                                                    <div key={i} className="bg-muted/10 border border-border rounded-[24px] p-7 relative group flex flex-col gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg shrink-0">{i + 1}</div>
                                                            <input value={s.title} onChange={e => updateStep(i, "title", e.target.value)} placeholder={`Step ${i + 1} title…`}
                                                                className="flex-1 bg-transparent outline-none font-black text-foreground text-lg placeholder:text-muted-foreground/40" />
                                                            {buildSteps.length > 1 && (
                                                                <button onClick={() => removeStep(i)} className="opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 transition-all">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <input value={s.time} onChange={e => updateStep(i, "time", e.target.value)} placeholder="Estimated Time (e.g. 15 mins)" className={inputCls} />
                                                            <ImageUploadInput value={s.imageUrl} onChange={url => updateStep(i, "imageUrl", url)} placeholder="Image URL (optional)" className={inputCls} />
                                                        </div>
                                                        <textarea value={s.body} onChange={e => updateStep(i, "body", e.target.value)} rows={3} placeholder="Describe this step in detail…"
                                                            className="w-full bg-transparent outline-none resize-none text-sm font-medium text-foreground placeholder:text-muted-foreground/30 p-4 rounded-xl border border-border bg-muted/20" />
                                                        {s.imageUrl && <img src={s.imageUrl} alt={`Step ${i + 1}`} className="w-full h-40 object-cover rounded-xl mt-2 border border-border" onError={(e) => (e.currentTarget.style.display = 'none')} />}
                                                    </div>
                                                ))}
                                                <button onClick={addStep} className="w-full h-14 rounded-[20px] border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest">
                                                    <Plus size={16} /> Add Step
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === "bom" && (
                                        <div className="space-y-6 bg-card/60 border border-border rounded-[28px] p-9">
                                            <h2 className="text-2xl font-black font-display mb-6">Bill of Materials</h2>
                                            <div className="bg-muted/10 border border-border rounded-[28px] overflow-hidden">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-border bg-muted/20">
                                                            <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 w-1/4">Component</th>
                                                            <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Details</th>
                                                            <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 w-16">Qty</th>
                                                            <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 w-24">Price (₹)</th>
                                                            <th className="w-10" />
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border">
                                                        {bomRows.map((r, i) => (
                                                            <tr key={i} className="group">
                                                                <td className="px-5 py-3 align-top">
                                                                    <input value={r.name} onChange={e => updateBOMRow(i, "name", e.target.value)} placeholder="Component name" className="bg-transparent outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/30 w-full mb-2" />
                                                                    <input value={r.category} onChange={e => updateBOMRow(i, "category", e.target.value)} placeholder="Category (e.g. Sensor)" className="bg-transparent outline-none text-[11px] font-medium text-muted-foreground w-full" />
                                                                </td>
                                                                <td className="px-5 py-3 align-top">
                                                                    <input value={r.supplier} onChange={e => updateBOMRow(i, "supplier", e.target.value)} placeholder="Supplier (e.g. Digikey)" className="bg-transparent outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/30 w-full mb-2" />
                                                                    <input value={r.link} onChange={e => updateBOMRow(i, "link", e.target.value)} placeholder="URL Link" className="bg-transparent outline-none text-[11px] font-medium text-primary w-full placeholder:text-primary/30" />
                                                                </td>
                                                                <td className="px-5 py-3 align-top"><input type="number" min={1} value={r.qty} onChange={e => updateBOMRow(i, "qty", parseInt(e.target.value) || 1)} className="bg-transparent outline-none text-sm font-medium text-foreground w-full" /></td>
                                                                <td className="px-5 py-3 align-top"><input value={r.price} onChange={e => updateBOMRow(i, "price", e.target.value)} placeholder="0.00" className="bg-transparent outline-none text-sm font-medium text-primary w-full placeholder:text-muted-foreground/30" /></td>
                                                                <td className="px-3 py-3 align-top text-right">{bomRows.length > 1 && <button onClick={() => removeBOMRow(i)} className="pt-1 p-1.5 rounded-lg text-muted-foreground/40 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={13} /></button>}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div className="p-5 border-t border-border">
                                                    <button onClick={addBOMRow} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                                                        <Plus size={14} /> Add Component
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center justify-between mt-6">
                                                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Estimated Total</span>
                                                <span className="text-2xl font-black text-primary font-display">₹{bomRows.reduce((s, r) => s + (parseFloat(r.price) || 0) * r.qty, 0).toFixed(0)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === "schematics" && (
                                        <div className="space-y-6 bg-card/60 border border-border rounded-[28px] p-9">
                                            <h2 className="text-2xl font-black font-display mb-6">Schematics & PCB</h2>

                                            {/* Diagrams */}
                                            <div className="mb-8">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Diagrams</h3>
                                                    <button onClick={() => { setSchematics([...schematics, { name: "", tag: "logic", tool: "", layers: "", desc: "", img: "" }]); setIsDirty(true); }} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1"><Plus size={12} /> Add Diagram</button>
                                                </div>
                                                <div className="space-y-4">
                                                    {schematics.map((s, i) => (
                                                        <div key={i} className="p-4 rounded-2xl bg-muted/20 border border-border relative group flex flex-col gap-3">
                                                            <button onClick={() => { setSchematics(schematics.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                                                            <div className="grid grid-cols-2 gap-3 pr-8">
                                                                <input value={s.name} onChange={e => { setSchematics(schematics.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x)); setIsDirty(true); }} placeholder="Diagram Name" className={inputCls} />
                                                                <ImageUploadInput value={s.img} onChange={url => { setSchematics(schematics.map((x, idx) => idx === i ? { ...x, img: url } : x)); setIsDirty(true); }} placeholder="Image URL" className={inputCls} />
                                                                <input value={s.desc} onChange={e => { setSchematics(schematics.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x)); setIsDirty(true); }} placeholder="Description" className={`${inputCls} col-span-2`} />
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-3">
                                                                <select value={s.tag} onChange={e => { setSchematics(schematics.map((x, idx) => idx === i ? { ...x, tag: e.target.value } : x)); setIsDirty(true); }} className={`${inputCls} appearance-none`}>
                                                                    <option value="logic">Logic</option>
                                                                    <option value="power">Power</option>
                                                                    <option value="wiring">Wiring</option>
                                                                    <option value="arch">Architecture</option>
                                                                </select>
                                                                <input value={s.tool} onChange={e => { setSchematics(schematics.map((x, idx) => idx === i ? { ...x, tool: e.target.value } : x)); setIsDirty(true); }} placeholder="Tool (e.g. KiCad)" className={inputCls} />
                                                                <input value={s.layers} onChange={e => { setSchematics(schematics.map((x, idx) => idx === i ? { ...x, layers: e.target.value } : x)); setIsDirty(true); }} placeholder="Layers (e.g. 2-Layer)" className={inputCls} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {schematics.length === 0 && <p className="text-xs text-muted-foreground/50 py-2">No diagrams added.</p>}
                                                </div>
                                            </div>

                                            {/* Stackup */}
                                            <div className="mb-8">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">PCB Stackup & Layers</h3>
                                                    <button onClick={() => { setPcbLayers([...pcbLayers, { num: "", color: "#22c55e", type: "", weight: "" }]); setIsDirty(true); }} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1"><Plus size={12} /> Add Layer</button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 mb-4 p-4 rounded-xl border border-border bg-muted/10">
                                                    <input value={pcbBoardSpecs?.material} onChange={e => { setPcbBoardSpecs({ ...pcbBoardSpecs, material: e.target.value }); setIsDirty(true); }} placeholder="Material (e.g. FR4-TG150)" className={inputCls} />
                                                    <input value={pcbBoardSpecs?.thickness} onChange={e => { setPcbBoardSpecs({ ...pcbBoardSpecs, thickness: e.target.value }); setIsDirty(true); }} placeholder="Thickness (e.g. 1.6mm)" className={inputCls} />
                                                    <input value={pcbBoardSpecs?.finish} onChange={e => { setPcbBoardSpecs({ ...pcbBoardSpecs, finish: e.target.value }); setIsDirty(true); }} placeholder="Finish (ENIG)" className={inputCls} />
                                                    <input value={pcbBoardSpecs?.silkscreen} onChange={e => { setPcbBoardSpecs({ ...pcbBoardSpecs, silkscreen: e.target.value }); setIsDirty(true); }} placeholder="Silkscreen (White)" className={inputCls} />
                                                    <input value={pcbBoardSpecs?.soldermask} onChange={e => { setPcbBoardSpecs({ ...pcbBoardSpecs, soldermask: e.target.value }); setIsDirty(true); }} placeholder="Soldermask (Matte Black)" className={inputCls} />
                                                    <input value={pcbBoardSpecs?.minTrace} onChange={e => { setPcbBoardSpecs({ ...pcbBoardSpecs, minTrace: e.target.value }); setIsDirty(true); }} placeholder="Min Trace/Space (4/4 mil)" className={inputCls} />
                                                </div>
                                                <div className="space-y-2">
                                                    {pcbLayers.map((l, i) => (
                                                        <div key={i} className="flex gap-2 items-center">
                                                            <input value={l.num} onChange={e => { setPcbLayers(pcbLayers.map((x, idx) => idx === i ? { ...x, num: e.target.value } : x)); setIsDirty(true); }} placeholder="Name (F.Cu)" className={`${inputCls} flex-1`} />
                                                            <input type="color" value={l.color} onChange={e => { setPcbLayers(pcbLayers.map((x, idx) => idx === i ? { ...x, color: e.target.value } : x)); setIsDirty(true); }} className="w-12 h-12 rounded-xl p-1 bg-muted/40 border border-border cursor-pointer appearance-none shrink-0" />
                                                            <input value={l.type} onChange={e => { setPcbLayers(pcbLayers.map((x, idx) => idx === i ? { ...x, type: e.target.value } : x)); setIsDirty(true); }} placeholder="Type (Signal)" className={`${inputCls} flex-[2]`} />
                                                            <input value={l.weight} onChange={e => { setPcbLayers(pcbLayers.map((x, idx) => idx === i ? { ...x, weight: e.target.value } : x)); setIsDirty(true); }} placeholder="Weight" className={`${inputCls} w-24`} />
                                                            <button onClick={() => { setPcbLayers(pcbLayers.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="p-3 text-muted-foreground hover:text-rose-500"><Trash2 size={16} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Rules */}
                                            <div className="mb-8">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Design Rules</h3>
                                                    <button onClick={() => { setDesignRules([...designRules, { rule: "", value: "", status: "pass" }]); setIsDirty(true); }} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1"><Plus size={12} /> Add Rule</button>
                                                </div>
                                                <div className="space-y-2">
                                                    {designRules.map((r, i) => (
                                                        <div key={i} className="flex gap-2 items-center">
                                                            <select value={r.status} onChange={e => { setDesignRules(designRules.map((x, idx) => idx === i ? { ...x, status: e.target.value } : x)); setIsDirty(true); }} className={`${inputCls} w-32 appearance-none`}>
                                                                <option value="pass">Pass</option>
                                                                <option value="fail">Fail</option>
                                                                <option value="n/a">N/A</option>
                                                            </select>
                                                            <input value={r.rule} onChange={e => { setDesignRules(designRules.map((x, idx) => idx === i ? { ...x, rule: e.target.value } : x)); setIsDirty(true); }} placeholder="Rule (Min clearance)" className={`${inputCls} flex-1`} />
                                                            <input value={r.value} onChange={e => { setDesignRules(designRules.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x)); setIsDirty(true); }} placeholder="Value (0.2mm)" className={`${inputCls} w-32`} />
                                                            <button onClick={() => { setDesignRules(designRules.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="p-3 text-muted-foreground hover:text-rose-500"><Trash2 size={16} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Signal Notes */}
                                            <div>
                                                <label className={labelCls}>Signal Integrity Notes</label>
                                                <div className="flex flex-col gap-2 mb-3">
                                                    {signalNotes.map((n, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border">
                                                            <span className="text-sm font-medium">{n}</span>
                                                            <button onClick={() => { setSignalNotes(signalNotes.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="text-muted-foreground hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex gap-3">
                                                    <input value={signalInput} onChange={e => setSignalInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && signalInput.trim()) { setSignalNotes([...signalNotes, signalInput.trim()]); setSignalInput(""); setIsDirty(true); } }} placeholder="e.g. Route high-speed traces with 90ohm differential impedance" className={`${inputCls} flex-1`} />
                                                    <button onClick={() => { if (signalInput.trim()) { setSignalNotes([...signalNotes, signalInput.trim()]); setSignalInput(""); setIsDirty(true); } }} className="px-5 h-12 rounded-2xl bg-muted/50 border border-border text-foreground font-black text-[10px] uppercase tracking-widest hover:border-primary/50 transition-all flex items-center gap-2"><Plus size={15} /> Add</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === "code" && (
                                        <div className="space-y-8 bg-card/60 border border-border rounded-[28px] p-9">
                                            <h2 className="text-2xl font-black font-display mb-6">Firmware & Code</h2>

                                            {/* Firmware Editor */}
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Source Files</h3>
                                                    <div className="flex gap-2">
                                                        {["cpp", "python", "verilog", "javascript", "c"].map(l => (
                                                            <button key={l} onClick={() => updateCodeFile(activeFileId, "language", l)}
                                                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${activeFile.language === l ? "bg-primary/10 border-primary text-primary" : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"}`}>
                                                                {l}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-[#0A0A0A] rounded-[24px] border border-white/10 overflow-hidden mb-8">
                                                    <div className="border-b border-white/10 bg-white/5 flex items-center overflow-x-auto">
                                                        {codeFiles.map((f) => (
                                                            <div key={f.id} onClick={() => setActiveFileId(f.id)}
                                                                className={`group flex items-center gap-3 px-5 py-4 border-r border-white/10 cursor-pointer transition-colors ${activeFileId === f.id ? "bg-white/10 text-emerald-400" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
                                                                <div className="flex gap-1.5 shrink-0">
                                                                    <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                                                                    <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                                                                    <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                                                                </div>
                                                                <input value={f.name} onChange={(e) => updateCodeFile(f.id, "name", e.target.value)}
                                                                    className={`bg-transparent outline-none text-[11px] font-black tracking-widest w-24 focus:w-32 transition-all ${activeFileId === f.id ? "text-emerald-400" : "text-white/40 group-hover:text-white"}`} />
                                                                {codeFiles.length > 1 && (
                                                                    <button onClick={(e) => removeCodeFile(f.id, e)} className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-rose-400 transition-colors shrink-0"><Trash2 size={11} /></button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <button onClick={addCodeFile} className="px-4 py-4 text-white/40 hover:text-white transition-colors flex items-center justify-center shrink-0">
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                    <textarea value={activeFile.content} onChange={e => updateCodeFile(activeFileId, "content", e.target.value)} rows={12} placeholder={`// Write or paste your ${activeFile.language} code here…\n`}
                                                        className="w-full bg-transparent px-8 py-6 font-mono text-sm text-emerald-400/90 outline-none resize-none placeholder:text-white/20 leading-relaxed" />
                                                </div>
                                            </div>

                                            {/* Dependencies */}
                                            <div className="mb-8">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Dependencies</h3>
                                                    <button onClick={() => { setDependencies([...dependencies, { name: "", ver: "", license: "", desc: "" }]); setIsDirty(true); }} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1"><Plus size={12} /> Add Dep</button>
                                                </div>
                                                <div className="space-y-3">
                                                    {dependencies.map((d, i) => (
                                                        <div key={i} className="flex gap-2 items-center bg-muted/10 p-2 border border-border rounded-xl">
                                                            <input value={d.name} onChange={e => { setDependencies(dependencies.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x)); setIsDirty(true); }} placeholder="Library name" className={`${inputCls} bg-transparent border-none flex-[2] h-10 px-3 font-mono text-xs`} />
                                                            <input value={d.ver} onChange={e => { setDependencies(dependencies.map((x, idx) => idx === i ? { ...x, ver: e.target.value } : x)); setIsDirty(true); }} placeholder="v2.1.0" className={`${inputCls} bg-transparent border-none flex-1 h-10 px-3 font-mono text-xs`} />
                                                            <input value={d.license} onChange={e => { setDependencies(dependencies.map((x, idx) => idx === i ? { ...x, license: e.target.value } : x)); setIsDirty(true); }} placeholder="MIT" className={`${inputCls} bg-transparent border-none flex-1 h-10 px-3 text-xs`} />
                                                            <input value={d.desc} onChange={e => { setDependencies(dependencies.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x)); setIsDirty(true); }} placeholder="Description" className={`${inputCls} bg-transparent border-none flex-[3] h-10 px-3 text-xs`} />
                                                            <button onClick={() => { setDependencies(dependencies.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="p-3 text-muted-foreground hover:text-rose-500"><Trash2 size={16} /></button>
                                                        </div>
                                                    ))}
                                                    {dependencies.length === 0 && <p className="text-xs text-muted-foreground/50 text-center py-2">No dependencies listed.</p>}
                                                </div>
                                            </div>

                                            {/* Env Setup */}
                                            <div className="mb-8">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Environment Setup</h3>
                                                    <button onClick={() => { setEnvSetup([...envSetup, { title: "", items: [""] }]); setIsDirty(true); }} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1"><Plus size={12} /> Add Group</button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {envSetup.map((env, i) => (
                                                        <div key={i} className="p-4 rounded-xl border border-border bg-muted/10 relative group text-sm">
                                                            <button onClick={() => { setEnvSetup(envSetup.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="absolute top-2 right-2 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                                                            <input value={env.title} onChange={e => { setEnvSetup(envSetup.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x)); setIsDirty(true); }} placeholder="Group Title (e.g. IDE)" className="w-full bg-transparent outline-none font-bold text-foreground mb-3 placeholder:text-muted-foreground/30" />
                                                            <div className="space-y-2">
                                                                {env.items.map((item, j) => (
                                                                    <div key={j} className="flex gap-2">
                                                                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 opacity-50" />
                                                                        <input value={item} onChange={e => { const newItems = [...env.items]; newItems[j] = e.target.value; setEnvSetup(envSetup.map((x, idx) => idx === i ? { ...x, items: newItems } : x)); setIsDirty(true); }} placeholder="Detail..." className="bg-transparent outline-none flex-1 text-muted-foreground placeholder:text-muted-foreground/30" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <button onClick={() => { const newItems = [...env.items, ""]; setEnvSetup(envSetup.map((x, idx) => idx === i ? { ...x, items: newItems } : x)); setIsDirty(true); }} className="text-[10px] font-bold text-muted-foreground hover:text-primary mt-3 uppercase tracking-widest">Add item</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Build Instructions */}
                                            <div className="mb-8">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Build & Compile Instructions</h3>
                                                    <button onClick={() => { setBuildInstructions([...buildInstructions, { step: "", cmd: "", note: "" }]); setIsDirty(true); }} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1"><Plus size={12} /> Add Cmd</button>
                                                </div>
                                                <div className="space-y-3">
                                                    {buildInstructions.map((b, i) => (
                                                        <div key={i} className="p-4 rounded-xl border border-border bg-[#0A0A0A] relative group">
                                                            <button onClick={() => { setBuildInstructions(buildInstructions.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="absolute top-4 right-4 text-white/40 opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                                                            <input value={b.step} onChange={e => { setBuildInstructions(buildInstructions.map((x, idx) => idx === i ? { ...x, step: e.target.value } : x)); setIsDirty(true); }} placeholder="Step Name" className="bg-transparent outline-none text-white/50 text-xs font-bold uppercase tracking-widest mb-2 w-full" />
                                                            <div className="flex items-center gap-2 font-mono text-sm text-emerald-400 mb-2">
                                                                <span className="text-white/20 select-none">$</span>
                                                                <input value={b.cmd} onChange={e => { setBuildInstructions(buildInstructions.map((x, idx) => idx === i ? { ...x, cmd: e.target.value } : x)); setIsDirty(true); }} placeholder="make build" className="bg-transparent outline-none flex-1 placeholder:text-white/10" />
                                                            </div>
                                                            <input value={b.note} onChange={e => { setBuildInstructions(buildInstructions.map((x, idx) => idx === i ? { ...x, note: e.target.value } : x)); setIsDirty(true); }} placeholder="Note: takes approx 2 mins" className="bg-transparent outline-none text-white/40 text-[11px] w-full mt-1 placeholder:text-white/20 italic" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Test Suite */}
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Test Results</h3>
                                                    <button onClick={() => { setTestSuite([...testSuite, { name: "", file: "", status: "pass", ms: "", desc: "" }]); setIsDirty(true); }} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1"><Plus size={12} /> Add Test</button>
                                                </div>
                                                <div className="space-y-2">
                                                    {testSuite.map((t, i) => (
                                                        <div key={i} className="flex gap-2 items-center bg-muted/10 p-2 border border-border rounded-xl">
                                                            <select value={t.status} onChange={e => { setTestSuite(testSuite.map((x, idx) => idx === i ? { ...x, status: e.target.value } : x)); setIsDirty(true); }} className={`${inputCls} bg-transparent border-none w-24 h-10 px-3 uppercase text-xs font-bold`}>
                                                                <option value="pass">PASS</option>
                                                                <option value="fail">FAIL</option>
                                                                <option value="skip">SKIP</option>
                                                            </select>
                                                            <input value={t.name} onChange={e => { setTestSuite(testSuite.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x)); setIsDirty(true); }} placeholder="Test Condition" className={`${inputCls} bg-transparent border-none flex-[2] h-10 px-3 text-sm font-bold`} />
                                                            <input value={t.file} onChange={e => { setTestSuite(testSuite.map((x, idx) => idx === i ? { ...x, file: e.target.value } : x)); setIsDirty(true); }} placeholder="test_core.cpp" className={`${inputCls} bg-transparent border-none flex-1 h-10 px-3 font-mono text-xs`} />
                                                            <input value={t.ms} onChange={e => { setTestSuite(testSuite.map((x, idx) => idx === i ? { ...x, ms: e.target.value } : x)); setIsDirty(true); }} placeholder="14ms" className={`${inputCls} bg-transparent border-none w-20 h-10 px-3 font-mono text-xs text-muted-foreground text-right`} />
                                                            <button onClick={() => { setTestSuite(testSuite.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="p-3 text-muted-foreground hover:text-rose-500"><Trash2 size={16} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === "media" && (
                                        <div className="space-y-6 bg-card/60 border border-border rounded-[28px] p-9">
                                            <h2 className="text-2xl font-black font-display mb-6">Media & Downloads</h2>

                                            {/* Gallery */}
                                            <div className="mb-8">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Photo Gallery</h3>
                                                    <button onClick={() => { setGalleryImages([...galleryImages, { url: "", caption: "", label: "Photo" }]); setIsDirty(true); }} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1"><Plus size={12} /> Add Photo</button>
                                                </div>
                                                <div className="space-y-3">
                                                    {galleryImages.map((img, i) => (
                                                        <div key={i} className="flex gap-3 items-center bg-muted/20 p-2 border border-border rounded-xl">
                                                            {img.url ? <img src={img.url} className="w-12 h-12 rounded-lg object-cover shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} /> : <div className="w-12 h-12 rounded-lg bg-muted border border-border shrink-0" />}
                                                            <input value={img.label} onChange={e => { setGalleryImages(galleryImages.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x)); setIsDirty(true); }} placeholder="Label (Hero)" className={`${inputCls} bg-transparent border-none w-24 h-10 px-3`} />
                                                            <input value={img.caption} onChange={e => { setGalleryImages(galleryImages.map((x, idx) => idx === i ? { ...x, caption: e.target.value } : x)); setIsDirty(true); }} placeholder="Caption" className={`${inputCls} bg-transparent border-none flex-1 h-10 px-3`} />
                                                            <ImageUploadInput value={img.url} onChange={url => { setGalleryImages(galleryImages.map((x, idx) => idx === i ? { ...x, url } : x)); setIsDirty(true); }} placeholder="Image URL" className={`${inputCls} bg-transparent border-none flex-1 h-10 px-3`} />
                                                            <button onClick={() => { setGalleryImages(galleryImages.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="p-3 text-muted-foreground hover:text-rose-500"><Trash2 size={16} /></button>
                                                        </div>
                                                    ))}
                                                    {galleryImages.length === 0 && <p className="text-xs text-muted-foreground/50 text-center py-2">No photos added.</p>}
                                                </div>
                                            </div>

                                            {/* Videos */}
                                            <div className="mb-8">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Videos</h3>
                                                    <button onClick={() => { setVideos([...videos, { title: "", url: "" }]); setIsDirty(true); }} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1"><Plus size={12} /> Add Video</button>
                                                </div>
                                                <div className="space-y-3">
                                                    {videos.map((v, i) => (
                                                        <div key={i} className="flex gap-3 items-center">
                                                            <input value={v.title} onChange={e => { setVideos(videos.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x)); setIsDirty(true); }} placeholder="Video Title" className={`${inputCls} flex-[1]`} />
                                                            <input value={v.url} onChange={e => { setVideos(videos.map((x, idx) => idx === i ? { ...x, url: e.target.value } : x)); setIsDirty(true); }} placeholder="Video URL / ID" className={`${inputCls} flex-[2]`} />
                                                            <button onClick={() => { setVideos(videos.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="p-3 text-muted-foreground hover:text-rose-500"><Trash2 size={16} /></button>
                                                        </div>
                                                    ))}
                                                    {videos.length === 0 && <p className="text-xs text-muted-foreground/50 text-center py-2">No videos added.</p>}
                                                </div>
                                            </div>

                                            {/* Simulations */}
                                            <div className="mb-8">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Simulation Links</h3>
                                                    <button onClick={() => { setSimulations([...simulations, { title: "", desc: "", url: "", icon: "⚡", badge: "Wokwi" }]); setIsDirty(true); }} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1"><Plus size={12} /> Add Sim</button>
                                                </div>
                                                <div className="space-y-3">
                                                    {simulations.map((s, i) => (
                                                        <div key={i} className="p-4 rounded-xl border border-border bg-muted/10 relative group">
                                                            <button onClick={() => { setSimulations(simulations.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="absolute top-2 right-2 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                                                            <div className="grid grid-cols-3 gap-3 pr-6 mb-2">
                                                                <input value={s.title} onChange={e => { setSimulations(simulations.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x)); setIsDirty(true); }} placeholder="Sim Title (Wokwi)" className={inputCls} />
                                                                <input value={s.badge} onChange={e => { setSimulations(simulations.map((x, idx) => idx === i ? { ...x, badge: e.target.value } : x)); setIsDirty(true); }} placeholder="Badge" className={inputCls} />
                                                                <input value={s.icon} onChange={e => { setSimulations(simulations.map((x, idx) => idx === i ? { ...x, icon: e.target.value } : x)); setIsDirty(true); }} placeholder="Icon (emoji)" className={inputCls} />
                                                            </div>
                                                            <input value={s.url} onChange={e => { setSimulations(simulations.map((x, idx) => idx === i ? { ...x, url: e.target.value } : x)); setIsDirty(true); }} placeholder="Simulation URL" className={`${inputCls} mb-2`} />
                                                            <input value={s.desc} onChange={e => { setSimulations(simulations.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x)); setIsDirty(true); }} placeholder="Short description" className={inputCls} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Build Logs */}
                                            <div className="mb-8">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Build Logs</h3>
                                                    <button onClick={() => { setBuildLogs([...buildLogs, { date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), title: "", body: "", tag: "Progress", images: [] }]); setIsDirty(true); }} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1"><Plus size={12} /> Add Log Entry</button>
                                                </div>
                                                <div className="space-y-4">
                                                    {buildLogs.map((log, i) => (
                                                        <div key={i} className="p-4 rounded-2xl border border-border bg-muted/20 relative group">
                                                            <button onClick={() => { setBuildLogs(buildLogs.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                                                            <div className="grid grid-cols-3 gap-3 pr-8 mb-3">
                                                                <input value={log.title} onChange={e => { setBuildLogs(buildLogs.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x)); setIsDirty(true); }} placeholder="Log Title" className={inputCls} />
                                                                <input value={log.date} onChange={e => { setBuildLogs(buildLogs.map((x, idx) => idx === i ? { ...x, date: e.target.value } : x)); setIsDirty(true); }} placeholder="Date (Jan 1 2026)" className={inputCls} />
                                                                <select value={log.tag} onChange={e => { setBuildLogs(buildLogs.map((x, idx) => idx === i ? { ...x, tag: e.target.value } : x)); setIsDirty(true); }} className={`${inputCls} appearance-none`}>
                                                                    <option value="Progress">Progress</option>
                                                                    <option value="Bug">Bug</option>
                                                                    <option value="Release">Release</option>
                                                                </select>
                                                            </div>
                                                            <textarea value={log.body} onChange={e => { setBuildLogs(buildLogs.map((x, idx) => idx === i ? { ...x, body: e.target.value } : x)); setIsDirty(true); }} rows={2} placeholder="Log body text..." className="w-full bg-transparent outline-none resize-none text-sm p-4 rounded-xl border border-border bg-card mb-3" />
                                                            <ImageUploadInput value={log.images.join(",")} onChange={url => { setBuildLogs(buildLogs.map((x, idx) => idx === i ? { ...x, images: url.split(",").filter(v => v) } : x)); setIsDirty(true); }} placeholder="Comma-separated image URLs" className={inputCls} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Downloads */}
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Downloadable Files</h3>
                                                    <button onClick={() => { setDownloads([...downloads, { name: "", size: "", fmt: "", url: "" }]); setIsDirty(true); }} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1"><Plus size={12} /> Add File</button>
                                                </div>
                                                <div className="space-y-3">
                                                    {downloads.map((d, i) => (
                                                        <div key={i} className="flex gap-2 items-center bg-muted/20 p-2 border border-border rounded-xl">
                                                            <input value={d.name} onChange={e => { setDownloads(downloads.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x)); setIsDirty(true); }} placeholder="File Name" className={`${inputCls} bg-transparent border-none flex-[2] h-10 px-3`} />
                                                            <input value={d.size} onChange={e => { setDownloads(downloads.map((x, idx) => idx === i ? { ...x, size: e.target.value } : x)); setIsDirty(true); }} placeholder="Size (e.g. 2MB)" className={`${inputCls} bg-transparent border-none flex-1 h-10 px-3`} />
                                                            <input value={d.fmt} onChange={e => { setDownloads(downloads.map((x, idx) => idx === i ? { ...x, fmt: e.target.value } : x)); setIsDirty(true); }} placeholder="Format (PDF)" className={`${inputCls} bg-transparent border-none flex-1 h-10 px-3 uppercase`} />
                                                            <input value={d.url} onChange={e => { setDownloads(downloads.map((x, idx) => idx === i ? { ...x, url: e.target.value } : x)); setIsDirty(true); }} placeholder="File URL" className={`${inputCls} bg-transparent border-none flex-[2] h-10 px-3`} />
                                                            <button onClick={() => { setDownloads(downloads.filter((_, idx) => idx !== i)); setIsDirty(true); }} className="p-3 text-muted-foreground hover:text-rose-500"><Trash2 size={16} /></button>
                                                        </div>
                                                    ))}
                                                    {downloads.length === 0 && <p className="text-xs text-muted-foreground/50 text-center py-2">No files attached.</p>}
                                                </div>
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
