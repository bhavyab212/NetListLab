"use client";

import { useState, useEffect } from "react";
import {
    ArrowLeft, ArrowRight, Check, Plus, Trash2, Sun, Moon,
    Upload, Tag, ShoppingCart, Code, Rocket, FileText
} from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { motion, AnimatePresence } from "framer-motion";
import CircuitBackground from "@/components/ui/CircuitBackground";
import LiquidCursor from "@/components/ui/LiquidCursor";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { useProjectsStore } from "@/stores/projectsStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STEPS = [
    { id: 1, label: "Basics", icon: FileText, desc: "Name your artifact" },
    { id: 2, label: "Metadata", icon: Tag, desc: "Objectives & tools" },
    { id: 3, label: "Build Steps", icon: ShoppingCart, desc: "Document the process" },
    { id: 4, label: "BOM", icon: Tag, desc: "Bill of materials" },
    { id: 5, label: "Schematics", icon: Rocket, desc: "Circuit diagrams" },
    { id: 6, label: "Code", icon: Code, desc: "Upload firmware" },
    { id: 7, label: "Media", icon: Rocket, desc: "Photos & vids" },
    { id: 8, label: "Publish", icon: Rocket, desc: "Review and launch" },
];

const CATEGORIES = ["Electronics", "Hardware", "Robotics", "Software", "AI/ML"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Expert"];

interface BOMRow { name: string; category: string; qty: number; price: string; supplier: string; link: string; }
interface BuildStep { title: string; body: string; time: string; imageUrl: string; }
interface CodeFile { name: string; language: string; content: string; id: string; }

export default function NewProjectPage() {
    const { isDark, toggle } = useThemeStore();
    const { isAuthenticated, user: authUser } = useAuthStore();
    const { addProject } = useProjectsStore();
    const router = useRouter();
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (!isAuthenticated) router.push("/login");
    }, [isAuthenticated, router]);

    // Step 1 State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [description, setDescription] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    // Step 2 State
    const [prerequisites, setPrerequisites] = useState<string[]>([]);
    const [prereqInput, setPrereqInput] = useState("");
    const [tools, setTools] = useState<string[]>([]);
    const [toolInput, setToolInput] = useState("");
    const [objectives, setObjectives] = useState<string[]>([]);
    const [objectiveInput, setObjectiveInput] = useState("");
    const [designDecisions, setDesignDecisions] = useState<{ q: string, a: string }[]>([]);
    const [githubUrl, setGithubUrl] = useState("");
    const [docsUrl, setDocsUrl] = useState("");
    const [version, setVersion] = useState("");
    const [license, setLicense] = useState("");
    const [safetyNotice, setSafetyNotice] = useState("");

    // Step 3 State
    const [buildSteps, setBuildSteps] = useState<BuildStep[]>([{ title: "", body: "", time: "", imageUrl: "" }]);

    // Step 4 State
    const [bomRows, setBomRows] = useState<BOMRow[]>([{ name: "", category: "", qty: 1, price: "", supplier: "", link: "" }]);

    // Step 5 State
    const [schematics, setSchematics] = useState<{ name: string, tag: string, tool: string, layers: string, desc: string, img: string }[]>([]);
    const [pcbLayers, setPcbLayers] = useState<{ num: string, color: string, type: string, weight: string }[]>([]);
    const [pcbBoardSpecs, setPcbBoardSpecs] = useState({ material: "", thickness: "", finish: "", silkscreen: "", soldermask: "", minTrace: "" });
    const [designRules, setDesignRules] = useState<{ rule: string, value: string, status: string }[]>([]);
    const [signalNotes, setSignalNotes] = useState<string[]>([]);
    const [signalInput, setSignalInput] = useState("");

    // Step 6 State
    const [codeFiles, setCodeFiles] = useState<CodeFile[]>([{ id: "1", name: "main.cpp", language: "cpp", content: "" }]);
    const [activeFileId, setActiveFileId] = useState("1");
    const [dependencies, setDependencies] = useState<{ name: string, ver: string, license: string, desc: string }[]>([]);
    const [buildInstructions, setBuildInstructions] = useState<{ step: string, cmd: string, note: string }[]>([]);
    const [envSetup, setEnvSetup] = useState<{ title: string, items: string[] }[]>([]);
    const [testSuite, setTestSuite] = useState<{ name: string, file: string, status: string, ms: string, desc: string }[]>([]);

    // Step 7 State
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [galleryInput, setGalleryInput] = useState("");
    const [videos, setVideos] = useState<{ title: string, url: string }[]>([]);
    const [simulations, setSimulations] = useState<{ title: string, desc: string, url: string, icon: string, badge: string }[]>([]);
    const [buildLogs, setBuildLogs] = useState<{ date: string, title: string, body: string, tag: string, images: string[] }[]>([]);
    const [downloads, setDownloads] = useState<{ name: string, size: string, fmt: string, url: string }[]>([]);

    // Step 8 State
    const [publishStatus, setPublishStatus] = useState<"draft" | "published">("published");

    if (!isAuthenticated) return null;

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(""); }
    };
    const removeTag = (t: string) => setTags(tags.filter(x => x !== t));

    const addBOMRow = () => setBomRows([...bomRows, { name: "", category: "", qty: 1, price: "", supplier: "", link: "" }]);
    const removeBOMRow = (i: number) => setBomRows(bomRows.filter((_, j) => j !== i));
    const updateBOMRow = (i: number, field: keyof BOMRow, val: string | number) =>
        setBomRows(bomRows.map((r, j) => j === i ? { ...r, [field]: val } : r));

    const addStep = () => setBuildSteps([...buildSteps, { title: "", body: "", time: "", imageUrl: "" }]);
    const removeStep = (i: number) => setBuildSteps(buildSteps.filter((_, j) => j !== i));
    const updateStep = (i: number, field: keyof BuildStep, val: string) =>
        setBuildSteps(buildSteps.map((s, j) => j === i ? { ...s, [field]: val } : s));

    const addCodeFile = () => {
        const newId = Date.now().toString();
        setCodeFiles([...codeFiles, { id: newId, name: "new_file.cpp", language: "cpp", content: "" }]);
        setActiveFileId(newId);
    };
    const removeCodeFile = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (codeFiles.length <= 1) return;
        const filtered = codeFiles.filter(f => f.id !== id);
        setCodeFiles(filtered);
        if (activeFileId === id) setActiveFileId(filtered[0].id);
    };
    const updateCodeFile = (id: string, field: keyof CodeFile, val: string) => {
        setCodeFiles(codeFiles.map(f => f.id === id ? { ...f, [field]: val } : f));
    };

    const activeFile = codeFiles.find(f => f.id === activeFileId) || codeFiles[0];

    const canNext = () => {
        if (step === 1) return title.trim() && category && difficulty && description.trim();
        if (step === 2) return buildSteps.every(s => s.title.trim() && s.body.trim());
        return true;
    };

    const handlePublish = () => {
        if (!authUser) return;
        const newId = Date.now();
        addProject({
            id: newId,
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            authorId: authUser.id,
            author: `@${authUser.username}`,
            authorAvatar: authUser.avatar,
            description,
            category,
            level: difficulty,
            image: coverUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
            stars: 0,
            views: 0,
            comments: 0,
            forks: 0,
            tags,
            status: publishStatus,
            bom: bomRows,
            buildSteps,
            codeFiles,
            prerequisites,
            tools,
            designDecisions,
            objectives,
            githubUrl,
            docsUrl,
            version,
            license,
            safetyNotice,
            schematics,
            pcbLayers,
            pcbBoardSpecs,
            designRules,
            signalNotes,
            dependencies,
            buildInstructions,
            envSetup,
            testSuite,
            galleryImages: galleryImages.map(url => ({ url, caption: "", label: "" })),
            videos,
            simulations,
            buildLogs,
            downloads,
            createdAt: new Date().toISOString()
        });

        const tid = toast.loading("Publishing artifact…");
        setTimeout(() => {
            toast.success(publishStatus === "published" ? "🚀 Artifact Published!" : "Draft Saved", {
                id: tid,
                description: publishStatus === "published" ? `${title} is now live in the laboratory.` : `${title} saved as draft.`,
                action: { label: "View", onClick: () => router.push(`/project/${newId}`) },
            });
            router.push("/dashboard");
        }, 800);
    };

    const inputCls = "w-full h-12 px-5 rounded-2xl bg-muted/40 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm placeholder:text-muted-foreground/40";
    const labelCls = "block text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-3";

    return (
        <div className={isDark ? "dark" : ""}>
            <div className="glass-floor min-h-screen bg-background text-foreground font-sans relative transition-colors duration-700 selection:bg-primary/30">
                <CircuitBackground />
                <LiquidCursor />

                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-background/80 backdrop-blur-3xl border-b border-border">
                    <div className="flex items-center gap-5">
                        <button onClick={() => router.push("/dashboard")} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <Logo size="sm" />
                    </div>
                    <div className="text-center hidden sm:block">
                        <h1 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">New Artifact</h1>
                        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Step {step} of {STEPS.length}</p>
                    </div>
                    <button onClick={toggle} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all">
                        {isDark ? <Sun size={17} /> : <Moon size={17} />}
                    </button>
                </header>

                <main className="pt-28 pb-20 px-4">
                    <div className="max-w-3xl mx-auto">

                        {/* Step Indicator */}
                        <div className="flex items-center justify-between mb-14">
                            {STEPS.map((s, i) => (
                                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => s.id < step && setStep(s.id)}>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${s.id < step ? "bg-primary border-primary text-white" : s.id === step ? "bg-primary/10 border-primary text-primary scale-110 shadow-glow-cyan" : "bg-muted/40 border-border text-muted-foreground/40"}`}>
                                            {s.id < step ? <Check size={20} /> : <s.icon size={18} />}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest hidden sm:block ${s.id === step ? "text-primary" : "text-muted-foreground/40"}`}>{s.label}</span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all duration-500 ${step > s.id ? "bg-primary" : "bg-border"}`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step Content */}
                        <AnimatePresence mode="wait">
                            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

                                {/* Step 1: Basics */}
                                {step === 1 && (
                                    <div className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-black font-display mb-3">Name Your Artifact</h2>
                                            <p className="text-muted-foreground font-medium">Give your build an identity in the laboratory.</p>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <label className={labelCls}>Project Title *</label>
                                                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. ESP32 Radar Intrusion System" className={inputCls} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label className={labelCls}>Category *</label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {CATEGORIES.map(c => (
                                                            <button key={c} onClick={() => setCategory(c)}
                                                                className={`py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${category === c ? "bg-primary/10 border-primary text-primary" : "bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:border-primary/40"}`}>
                                                                {c}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Difficulty *</label>
                                                    <div className="flex flex-col gap-2">
                                                        {DIFFICULTIES.map(d => (
                                                            <button key={d} onClick={() => setDifficulty(d)}
                                                                className={`py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${difficulty === d ? "bg-primary/10 border-primary text-primary" : "bg-muted/40 border-border text-muted-foreground hover:text-foreground hover:border-primary/40"}`}>
                                                                {d}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className={labelCls}>Description *</label>
                                                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe what you built, why, and what problem it solves…"
                                                    className="w-full px-5 py-4 rounded-2xl bg-muted/40 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm placeholder:text-muted-foreground/40 resize-none" />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Cover Image URL</label>
                                                <input value={coverUrl} onChange={e => setCoverUrl(e.target.value)} placeholder="https://images.unsplash.com/…" className={inputCls} />
                                                {coverUrl && <img src={coverUrl} alt="cover preview" className="mt-4 w-full h-48 object-cover rounded-2xl border border-border" onError={() => setCoverUrl("")} />}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Tech Stack Tags</label>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {tags.map(t => (
                                                        <span key={t} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                                                            {t} <button onClick={() => removeTag(t)} className="hover:text-rose-500 transition-colors"><Trash2 size={11} /></button>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-3">
                                                    <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTag()} placeholder="ESP32, Python, FPGA…" className={`${inputCls} flex-1`} />
                                                    <button onClick={addTag} className="px-5 h-12 rounded-2xl bg-muted/50 border border-border text-foreground font-black text-[10px] uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2"><Plus size={15} /> Add</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Metadata */}
                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-black font-display mb-3">Project Metadata</h2>
                                            <p className="text-muted-foreground font-medium">Add requirements, rationale, and external links.</p>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label className={labelCls}>Version (e.g. v1.0.0)</label>
                                                    <input value={version} onChange={e => setVersion(e.target.value)} className={inputCls} />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>License (e.g. MIT)</label>
                                                    <input value={license} onChange={e => setLicense(e.target.value)} className={inputCls} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className={labelCls}>Safety Notice</label>
                                                <textarea value={safetyNotice} onChange={e => setSafetyNotice(e.target.value)} rows={2} placeholder="e.g. High voltage present. Proceed with caution."
                                                    className="w-full px-5 py-4 rounded-2xl bg-muted/40 border border-border focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none font-medium text-sm placeholder:text-muted-foreground/40 resize-none" />
                                            </div>
                                            {/* Prerequisites */}
                                            <div>
                                                <label className={labelCls}>Prerequisites</label>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {prerequisites.map((p, i) => (
                                                        <span key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
                                                            {p} <button onClick={() => setPrerequisites(prerequisites.filter((_, idx) => idx !== i))} className="hover:text-rose-500 transition-colors"><Trash2 size={11} /></button>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-3">
                                                    <input value={prereqInput} onChange={e => setPrereqInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && prereqInput.trim()) { setPrerequisites([...prerequisites, prereqInput.trim()]); setPrereqInput(""); } }} placeholder="e.g. Basic soldering" className={`${inputCls} flex-1`} />
                                                    <button onClick={() => { if (prereqInput.trim()) { setPrerequisites([...prerequisites, prereqInput.trim()]); setPrereqInput(""); } }} className="px-5 h-12 rounded-2xl bg-muted/50 border border-border text-foreground font-black text-[10px] uppercase tracking-widest hover:border-accent/50 hover:text-accent transition-all flex items-center gap-2"><Plus size={15} /> Add</button>
                                                </div>
                                            </div>

                                            {/* Tools */}
                                            <div>
                                                <label className={labelCls}>Required Tools</label>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {tools.map((t, i) => (
                                                        <span key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                                                            {t} <button onClick={() => setTools(tools.filter((_, idx) => idx !== i))} className="hover:text-rose-500 transition-colors"><Trash2 size={11} /></button>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-3">
                                                    <input value={toolInput} onChange={e => setToolInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && toolInput.trim()) { setTools([...tools, toolInput.trim()]); setToolInput(""); } }} placeholder="e.g. Soldering Iron, Multimeter" className={`${inputCls} flex-1`} />
                                                    <button onClick={() => { if (toolInput.trim()) { setTools([...tools, toolInput.trim()]); setToolInput(""); } }} className="px-5 h-12 rounded-2xl bg-muted/50 border border-border text-foreground font-black text-[10px] uppercase tracking-widest hover:border-orange-500/50 hover:text-orange-500 transition-all flex items-center gap-2"><Plus size={15} /> Add</button>
                                                </div>
                                            </div>

                                            {/* Objectives */}
                                            <div>
                                                <label className={labelCls}>Technical Objectives</label>
                                                <div className="flex flex-col gap-2 mb-3">
                                                    {objectives.map((o, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border">
                                                            <span className="text-sm font-medium">{o}</span>
                                                            <button onClick={() => setObjectives(objectives.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex gap-3">
                                                    <input value={objectiveInput} onChange={e => setObjectiveInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && objectiveInput.trim()) { setObjectives([...objectives, objectiveInput.trim()]); setObjectiveInput(""); } }} placeholder="e.g. Sub-10uA sleep current" className={`${inputCls} flex-1`} />
                                                    <button onClick={() => { if (objectiveInput.trim()) { setObjectives([...objectives, objectiveInput.trim()]); setObjectiveInput(""); } }} className="px-5 h-12 rounded-2xl bg-muted/50 border border-border text-foreground font-black text-[10px] uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2"><Plus size={15} /> Add</button>
                                                </div>
                                            </div>

                                            {/* Design Decisions */}
                                            <div>
                                                <label className={labelCls}>Design Decisions & Rationale</label>
                                                <div className="space-y-4 mb-3">
                                                    {designDecisions.map((d, i) => (
                                                        <div key={i} className="p-4 rounded-xl bg-muted/20 border border-border relative group">
                                                            <button onClick={() => setDesignDecisions(designDecisions.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                                                            <input value={d.q} onChange={e => setDesignDecisions(designDecisions.map((x, idx) => idx === i ? { ...x, q: e.target.value } : x))} placeholder="Question (e.g. Why use this MCU?)" className="w-full bg-transparent outline-none font-bold text-sm mb-2 placeholder:text-muted-foreground/40" />
                                                            <textarea value={d.a} onChange={e => setDesignDecisions(designDecisions.map((x, idx) => idx === i ? { ...x, a: e.target.value } : x))} rows={2} placeholder="Rationale..." className="w-full bg-transparent outline-none text-sm text-foreground/80 resize-none placeholder:text-muted-foreground/30" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <button onClick={() => setDesignDecisions([...designDecisions, { q: "", a: "" }])} className="w-full h-12 rounded-xl border border-dashed border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center gap-2"><Plus size={14} /> Add Decision</button>
                                            </div>

                                            {/* External Links */}
                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label className={labelCls}>GitHub Repository</label>
                                                    <input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className={inputCls} />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Documentation URL</label>
                                                    <input value={docsUrl} onChange={e => setDocsUrl(e.target.value)} placeholder="https://docs..." className={inputCls} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Build Steps */}
                                {step === 3 && (
                                    <div className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-black font-display mb-3">Document the Process</h2>
                                            <p className="text-muted-foreground font-medium">Break down your build into reproducible steps.</p>
                                        </div>
                                        <div className="space-y-6">
                                            {buildSteps.map((s, i) => (
                                                <div key={i} className="bg-card/60 border border-border rounded-[24px] p-7 relative group flex flex-col gap-4">
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
                                                        <input value={s.imageUrl} onChange={e => updateStep(i, "imageUrl", e.target.value)} placeholder="Image URL (optional)" className={inputCls} />
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

                                {/* Step 4: BOM */}
                                {step === 4 && (
                                    <div className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-black font-display mb-3">Bill of Materials</h2>
                                            <p className="text-muted-foreground font-medium">List every component so others can replicate your build.</p>
                                        </div>
                                        <div className="bg-card/60 border border-border rounded-[28px] overflow-hidden">
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
                                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center justify-between">
                                            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Estimated Total</span>
                                            <span className="text-2xl font-black text-primary font-display">₹{bomRows.reduce((s, r) => s + (parseFloat(r.price) || 0) * r.qty, 0).toFixed(0)}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Schematics */}
                                {step === 5 && (
                                    <div className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-black font-display mb-3">Schematics & PCB</h2>
                                            <p className="text-muted-foreground font-medium">Upload circuit diagrams, stackup, and design rules.</p>
                                        </div>

                                        {/* Diagrams */}
                                        <div className="bg-card/60 p-6 border border-border rounded-[28px]">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Diagrams</h3>
                                                <button onClick={() => setSchematics([...schematics, { name: "", tag: "logic", tool: "", layers: "", desc: "", img: "" }])} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1 hover:brightness-125"><Plus size={12} /> Add Diagram</button>
                                            </div>
                                            <div className="space-y-4">
                                                {schematics.map((s, i) => (
                                                    <div key={i} className="p-4 rounded-2xl bg-muted/20 border border-border relative group flex flex-col gap-3">
                                                        <button onClick={() => setSchematics(schematics.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                                                        <div className="grid grid-cols-2 gap-3 pr-8">
                                                            <input value={s.name} onChange={e => setSchematics(schematics.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder="Diagram Name" className={inputCls} />
                                                            <input value={s.img} onChange={e => setSchematics(schematics.map((x, idx) => idx === i ? { ...x, img: e.target.value } : x))} placeholder="Image URL" className={inputCls} />
                                                            <input value={s.desc} onChange={e => setSchematics(schematics.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x))} placeholder="Description" className={`${inputCls} col-span-2`} />
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-3">
                                                            <select value={s.tag} onChange={e => setSchematics(schematics.map((x, idx) => idx === i ? { ...x, tag: e.target.value } : x))} className={`${inputCls} appearance-none`}>
                                                                <option value="logic">Logic</option>
                                                                <option value="power">Power</option>
                                                                <option value="wiring">Wiring</option>
                                                                <option value="arch">Architecture</option>
                                                            </select>
                                                            <input value={s.tool} onChange={e => setSchematics(schematics.map((x, idx) => idx === i ? { ...x, tool: e.target.value } : x))} placeholder="Tool (e.g. KiCad)" className={inputCls} />
                                                            <input value={s.layers} onChange={e => setSchematics(schematics.map((x, idx) => idx === i ? { ...x, layers: e.target.value } : x))} placeholder="Layers (e.g. 2-Layer)" className={inputCls} />
                                                        </div>
                                                    </div>
                                                ))}
                                                {schematics.length === 0 && <p className="text-xs text-muted-foreground/50 text-center py-4">No diagrams added yet.</p>}
                                            </div>
                                        </div>

                                        {/* Stackup */}
                                        <div className="bg-card/60 p-6 border border-border rounded-[28px]">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">PCB Stackup & Layers</h3>
                                                <button onClick={() => setPcbLayers([...pcbLayers, { num: "", color: "#22c55e", type: "", weight: "" }])} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1 hover:brightness-125"><Plus size={12} /> Add Layer</button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mb-4 p-4 rounded-xl border border-border bg-muted/10">
                                                <input value={pcbBoardSpecs?.material} onChange={e => setPcbBoardSpecs({ ...pcbBoardSpecs, material: e.target.value })} placeholder="Material (e.g. FR4-TG150)" className={inputCls} />
                                                <input value={pcbBoardSpecs?.thickness} onChange={e => setPcbBoardSpecs({ ...pcbBoardSpecs, thickness: e.target.value })} placeholder="Thickness (e.g. 1.6mm)" className={inputCls} />
                                                <input value={pcbBoardSpecs?.finish} onChange={e => setPcbBoardSpecs({ ...pcbBoardSpecs, finish: e.target.value })} placeholder="Finish (ENIG)" className={inputCls} />
                                                <input value={pcbBoardSpecs?.silkscreen} onChange={e => setPcbBoardSpecs({ ...pcbBoardSpecs, silkscreen: e.target.value })} placeholder="Silkscreen (White)" className={inputCls} />
                                                <input value={pcbBoardSpecs?.soldermask} onChange={e => setPcbBoardSpecs({ ...pcbBoardSpecs, soldermask: e.target.value })} placeholder="Soldermask (Matte Black)" className={inputCls} />
                                                <input value={pcbBoardSpecs?.minTrace} onChange={e => setPcbBoardSpecs({ ...pcbBoardSpecs, minTrace: e.target.value })} placeholder="Min Trace/Space (4/4 mil)" className={inputCls} />
                                            </div>
                                            <div className="space-y-2">
                                                {pcbLayers.map((l, i) => (
                                                    <div key={i} className="flex gap-2 items-center">
                                                        <input value={l.num} onChange={e => setPcbLayers(pcbLayers.map((x, idx) => idx === i ? { ...x, num: e.target.value } : x))} placeholder="Name (F.Cu)" className={`${inputCls} flex-1`} />
                                                        <input type="color" value={l.color} onChange={e => setPcbLayers(pcbLayers.map((x, idx) => idx === i ? { ...x, color: e.target.value } : x))} className="w-12 h-12 rounded-xl p-1 bg-muted/40 border border-border cursor-pointer appearance-none shrink-0" />
                                                        <input value={l.type} onChange={e => setPcbLayers(pcbLayers.map((x, idx) => idx === i ? { ...x, type: e.target.value } : x))} placeholder="Type (Signal)" className={`${inputCls} flex-[2]`} />
                                                        <input value={l.weight} onChange={e => setPcbLayers(pcbLayers.map((x, idx) => idx === i ? { ...x, weight: e.target.value } : x))} placeholder="Weight" className={`${inputCls} w-24`} />
                                                        <button onClick={() => setPcbLayers(pcbLayers.filter((_, idx) => idx !== i))} className="p-3 text-muted-foreground hover:text-rose-500"><Trash2 size={16} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Rules */}
                                        <div className="bg-card/60 p-6 border border-border rounded-[28px]">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Design Rules</h3>
                                                <button onClick={() => setDesignRules([...designRules, { rule: "", value: "", status: "pass" }])} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1 hover:brightness-125"><Plus size={12} /> Add Rule</button>
                                            </div>
                                            <div className="space-y-2">
                                                {designRules.map((r, i) => (
                                                    <div key={i} className="flex gap-2 items-center">
                                                        <select value={r.status} onChange={e => setDesignRules(designRules.map((x, idx) => idx === i ? { ...x, status: e.target.value } : x))} className={`${inputCls} w-32 appearance-none`}>
                                                            <option value="pass">Pass</option>
                                                            <option value="fail">Fail</option>
                                                            <option value="n/a">N/A</option>
                                                        </select>
                                                        <input value={r.rule} onChange={e => setDesignRules(designRules.map((x, idx) => idx === i ? { ...x, rule: e.target.value } : x))} placeholder="Rule (Min clearance)" className={`${inputCls} flex-1`} />
                                                        <input value={r.value} onChange={e => setDesignRules(designRules.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x))} placeholder="Value (0.2mm)" className={`${inputCls} w-32`} />
                                                        <button onClick={() => setDesignRules(designRules.filter((_, idx) => idx !== i))} className="p-3 text-muted-foreground hover:text-rose-500"><Trash2 size={16} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 6: Code */}
                                {step === 6 && (
                                    <div className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-black font-display mb-3">Upload Firmware / Code</h2>
                                            <p className="text-muted-foreground font-medium">Share the code that brings your build to life.</p>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Language</label>
                                            <div className="flex gap-2 mb-6">
                                                {["cpp", "python", "verilog", "javascript", "c"].map(l => (
                                                    <button key={l} onClick={() => updateCodeFile(activeFileId, "language", l)}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeFile.language === l ? "bg-primary/10 border-primary text-primary" : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"}`}>
                                                        {l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-[#0A0A0A] rounded-[28px] border border-white/10 overflow-hidden">
                                            <div className="border-b border-white/10 bg-white/5 flex items-center overflow-x-auto">
                                                {codeFiles.map((f) => (
                                                    <div key={f.id} onClick={() => setActiveFileId(f.id)}
                                                        className={`group flex items-center gap-3 px-5 py-4 border-r border-white/10 cursor-pointer transition-colors ${activeFileId === f.id ? "bg-white/10 text-emerald-400" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
                                                        <div className="flex gap-1.5 shrink-0">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
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
                                            <textarea value={activeFile.content} onChange={e => updateCodeFile(activeFileId, "content", e.target.value)} rows={18} placeholder={`// Write or paste your ${activeFile.language} code here…\n`}
                                                className="w-full bg-transparent px-8 py-6 font-mono text-sm text-emerald-400/90 outline-none resize-none placeholder:text-white/20 leading-relaxed" />
                                        </div>

                                        {/* Environment Setup */}
                                        <div className="bg-card/60 p-6 border border-border rounded-[28px] mt-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Environment Setup</h3>
                                                <button onClick={() => setEnvSetup([...envSetup, { title: "", items: [] }])} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1 hover:brightness-125"><Plus size={12} /> Add Group</button>
                                            </div>
                                            <div className="space-y-4">
                                                {envSetup.map((env, i) => (
                                                    <div key={i} className="p-4 rounded-xl bg-muted/20 border border-border relative group">
                                                        <button onClick={() => setEnvSetup(envSetup.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                                                        <input value={env.title} onChange={e => setEnvSetup(envSetup.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} placeholder="Group Title (e.g. Compiler)" className="w-full bg-transparent outline-none font-bold text-sm mb-2 placeholder:text-muted-foreground/40" />
                                                        <input value={env.items.join(", ")} onChange={e => setEnvSetup(envSetup.map((x, idx) => idx === i ? { ...x, items: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } : x))} placeholder="Items (comma separated)" className="w-full bg-transparent outline-none text-sm text-foreground/80 placeholder:text-muted-foreground/30" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Dependencies */}
                                        <div className="bg-card/60 p-6 border border-border rounded-[28px] mt-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Dependencies</h3>
                                                <button onClick={() => setDependencies([...dependencies, { name: "", ver: "", license: "", desc: "" }])} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1 hover:brightness-125"><Plus size={12} /> Add Dependency</button>
                                            </div>
                                            <div className="space-y-3">
                                                {dependencies.map((dep, i) => (
                                                    <div key={i} className="flex gap-2 items-center">
                                                        <input value={dep.name} onChange={e => setDependencies(dependencies.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder="Name (e.g. React)" className={`${inputCls} flex-[2]`} />
                                                        <input value={dep.ver} onChange={e => setDependencies(dependencies.map((x, idx) => idx === i ? { ...x, ver: e.target.value } : x))} placeholder="Version (e.g. ^18.0.0)" className={`${inputCls} flex-1`} />
                                                        <input value={dep.license} onChange={e => setDependencies(dependencies.map((x, idx) => idx === i ? { ...x, license: e.target.value } : x))} placeholder="License (MIT)" className={`${inputCls} flex-1`} />
                                                        <input value={dep.desc} onChange={e => setDependencies(dependencies.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x))} placeholder="Description" className={`${inputCls} flex-[3]`} />
                                                        <button onClick={() => setDependencies(dependencies.filter((_, idx) => idx !== i))} className="p-3 text-muted-foreground hover:text-rose-500"><Trash2 size={16} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Build Instructions */}
                                        <div className="bg-card/60 p-6 border border-border rounded-[28px] mt-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Build Instructions</h3>
                                                <button onClick={() => setBuildInstructions([...buildInstructions, { step: "", cmd: "", note: "" }])} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1 hover:brightness-125"><Plus size={12} /> Add Command</button>
                                            </div>
                                            <div className="space-y-3">
                                                {buildInstructions.map((b, i) => (
                                                    <div key={i} className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-muted/10 relative group">
                                                        <button onClick={() => setBuildInstructions(buildInstructions.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                                                        <input value={b.step} onChange={e => setBuildInstructions(buildInstructions.map((x, idx) => idx === i ? { ...x, step: e.target.value } : x))} placeholder="Step Name (e.g. Install dependencies)" className="w-1/2 bg-transparent outline-none font-bold text-sm mb-1 placeholder:text-muted-foreground/40" />
                                                        <input value={b.cmd} onChange={e => setBuildInstructions(buildInstructions.map((x, idx) => idx === i ? { ...x, cmd: e.target.value } : x))} placeholder="Command (e.g. npm run build)" className="w-full font-mono text-sm text-emerald-400 bg-black/20 p-2 rounded-lg outline-none placeholder:text-emerald-400/20" />
                                                        <input value={b.note} onChange={e => setBuildInstructions(buildInstructions.map((x, idx) => idx === i ? { ...x, note: e.target.value } : x))} placeholder="Note (e.g. Takes about 2 minutes)" className="w-full bg-transparent outline-none text-sm text-muted-foreground placeholder:text-muted-foreground/30 mt-1" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Test Suite */}
                                        <div className="bg-card/60 p-6 border border-border rounded-[28px] mt-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Test Results & Coverage</h3>
                                                <button onClick={() => setTestSuite([...testSuite, { name: "", file: "", status: "pass", ms: "", desc: "" }])} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1 hover:brightness-125"><Plus size={12} /> Add Test</button>
                                            </div>
                                            <div className="space-y-3">
                                                {testSuite.map((t, i) => (
                                                    <div key={i} className="flex gap-2 items-center flex-wrap md:flex-nowrap p-3 rounded-xl border border-border bg-muted/10 relative group">
                                                        <select value={t.status} onChange={e => setTestSuite(testSuite.map((x, idx) => idx === i ? { ...x, status: e.target.value } : x))} className={`${inputCls} w-24 appearance-none p-2 h-10`}>
                                                            <option value="pass">Pass</option>
                                                            <option value="fail">Fail</option>
                                                            <option value="skip">Skip</option>
                                                        </select>
                                                        <input value={t.name} onChange={e => setTestSuite(testSuite.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder="Test Name" className={`${inputCls} flex-[2] h-10`} />
                                                        <input value={t.file} onChange={e => setTestSuite(testSuite.map((x, idx) => idx === i ? { ...x, file: e.target.value } : x))} placeholder="File (test_foo.py)" className={`${inputCls} flex-[2] h-10 font-mono text-xs`} />
                                                        <input value={t.ms} onChange={e => setTestSuite(testSuite.map((x, idx) => idx === i ? { ...x, ms: e.target.value } : x))} placeholder="ms" className={`${inputCls} w-20 h-10`} />
                                                        <input value={t.desc} onChange={e => setTestSuite(testSuite.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x))} placeholder="Description" className={`${inputCls} w-full md:flex-[3] h-10 mt-2 md:mt-0`} />
                                                        <button onClick={() => setTestSuite(testSuite.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 p-1.5 rounded-full bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 7: Media */}
                                {step === 7 && (
                                    <div className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-black font-display mb-3">Media & Downloads</h2>
                                            <p className="text-muted-foreground font-medium">Add photos, videos, and attach downloadable files.</p>
                                        </div>

                                        {/* Gallery */}
                                        <div className="bg-card/60 p-6 border border-border rounded-[28px]">
                                            <label className={labelCls}>Photo Gallery URLs</label>
                                            <div className="grid grid-cols-3 gap-3 mb-4">
                                                {galleryImages.map((img, i) => (
                                                    <div key={i} className="relative aspect-video rounded-xl bg-muted border border-border overflow-hidden group">
                                                        <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                                        <button onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-3">
                                                <input value={galleryInput} onChange={e => setGalleryInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && galleryInput.trim()) { setGalleryImages([...galleryImages, galleryInput.trim()]); setGalleryInput(""); } }} placeholder="https://..." className={`${inputCls} flex-1`} />
                                                <button onClick={() => { if (galleryInput.trim()) { setGalleryImages([...galleryImages, galleryInput.trim()]); setGalleryInput(""); } }} className="px-5 h-12 rounded-2xl bg-muted/50 border border-border text-foreground font-black text-[10px] uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all flex items-center gap-2"><Plus size={15} /> Add</button>
                                            </div>
                                        </div>

                                        {/* Videos */}
                                        <div className="bg-card/60 p-6 border border-border rounded-[28px]">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Videos (YouTube, Vimeo, etc)</h3>
                                                <button onClick={() => setVideos([...videos, { title: "", url: "" }])} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1 hover:brightness-125"><Plus size={12} /> Add Video</button>
                                            </div>
                                            <div className="space-y-3">
                                                {videos.map((v, i) => (
                                                    <div key={i} className="flex gap-3 items-center">
                                                        <input value={v.title} onChange={e => setVideos(videos.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} placeholder="Video Title" className={`${inputCls} flex-[1]`} />
                                                        <input value={v.url} onChange={e => setVideos(videos.map((x, idx) => idx === i ? { ...x, url: e.target.value } : x))} placeholder="Video URL" className={`${inputCls} flex-[2]`} />
                                                        <button onClick={() => setVideos(videos.filter((_, idx) => idx !== i))} className="p-3 text-muted-foreground hover:text-rose-500"><Trash2 size={16} /></button>
                                                    </div>
                                                ))}
                                                {videos.length === 0 && <p className="text-xs text-muted-foreground/50 text-center py-2">No videos added.</p>}
                                            </div>
                                        </div>


                                        {/* Simulations */}
                                        <div className="bg-card/60 p-6 border border-border rounded-[28px]">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Interactive Simulations</h3>
                                                <button onClick={() => setSimulations([...simulations, { title: "", desc: "", url: "", icon: "🔬", badge: "Sim" }])} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1 hover:brightness-125"><Plus size={12} /> Add Sim</button>
                                            </div>
                                            <div className="space-y-3">
                                                {simulations.map((sim, i) => (
                                                    <div key={i} className="flex gap-2 items-center flex-wrap md:flex-nowrap p-3 rounded-xl border border-border bg-muted/10 relative group">
                                                        <input value={sim.icon} onChange={e => setSimulations(simulations.map((x, idx) => idx === i ? { ...x, icon: e.target.value } : x))} placeholder="🔬" className={`${inputCls} w-16 h-10 text-center`} />
                                                        <input value={sim.title} onChange={e => setSimulations(simulations.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} placeholder="Title (e.g. Wokwi ESP32)" className={`${inputCls} flex-[2] h-10`} />
                                                        <input value={sim.url} onChange={e => setSimulations(simulations.map((x, idx) => idx === i ? { ...x, url: e.target.value } : x))} placeholder="URL Link" className={`${inputCls} flex-[3] h-10`} />
                                                        <input value={sim.badge} onChange={e => setSimulations(simulations.map((x, idx) => idx === i ? { ...x, badge: e.target.value } : x))} placeholder="Badge" className={`${inputCls} w-24 h-10`} />
                                                        <input value={sim.desc} onChange={e => setSimulations(simulations.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x))} placeholder="Description" className={`${inputCls} w-full mt-2 md:mt-0 h-10`} />
                                                        <button onClick={() => setSimulations(simulations.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 p-1.5 rounded-full bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                                {simulations.length === 0 && <p className="text-xs text-muted-foreground/50 text-center py-2">No simulations added.</p>}
                                            </div>
                                        </div>

                                        {/* Build Logs */}
                                        <div className="bg-card/60 p-6 border border-border rounded-[28px]">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Build Logs & Updates</h3>
                                                <button onClick={() => setBuildLogs([...buildLogs, { date: new Date().toISOString().split("T")[0], title: "", body: "", tag: "Update", images: [] }])} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1 hover:brightness-125"><Plus size={12} /> Add Log</button>
                                            </div>
                                            <div className="space-y-4">
                                                {buildLogs.map((log, i) => (
                                                    <div key={i} className="p-4 rounded-xl border border-border bg-muted/10 relative group">
                                                        <button onClick={() => setBuildLogs(buildLogs.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                                                        <div className="flex gap-3 mb-3 pr-8">
                                                            <input type="date" value={log.date} onChange={e => setBuildLogs(buildLogs.map((x, idx) => idx === i ? { ...x, date: e.target.value } : x))} className={`${inputCls} w-40 h-10`} />
                                                            <input value={log.title} onChange={e => setBuildLogs(buildLogs.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} placeholder="Log Title" className={`${inputCls} flex-1 h-10`} />
                                                            <input value={log.tag} onChange={e => setBuildLogs(buildLogs.map((x, idx) => idx === i ? { ...x, tag: e.target.value } : x))} placeholder="Tag (e.g. Milestone)" className={`${inputCls} w-32 h-10`} />
                                                        </div>
                                                        <textarea value={log.body} onChange={e => setBuildLogs(buildLogs.map((x, idx) => idx === i ? { ...x, body: e.target.value } : x))} rows={3} placeholder="Log content..." className="w-full bg-transparent outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground/30 p-4 rounded-xl border border-border bg-black/20" />
                                                    </div>
                                                ))}
                                                {buildLogs.length === 0 && <p className="text-xs text-muted-foreground/50 text-center py-2">No logs added yet.</p>}
                                            </div>
                                        </div>

                                        {/* Downloads */}
                                        <div className="bg-card/60 p-6 border border-border rounded-[28px]">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] font-display">Downloadable Files</h3>
                                                <button onClick={() => setDownloads([...downloads, { name: "", size: "", fmt: "", url: "" }])} className="text-[10px] font-black tracking-widest uppercase text-primary flex items-center gap-1 hover:brightness-125"><Plus size={12} /> Add File</button>
                                            </div>
                                            <div className="space-y-3">
                                                {downloads.map((d, i) => (
                                                    <div key={i} className="flex gap-2 items-center bg-muted/20 p-2 border border-border rounded-xl">
                                                        <input value={d.name} onChange={e => setDownloads(downloads.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder="File Name" className={`${inputCls} bg-transparent border-none flex-[2] h-10 px-3`} />
                                                        <input value={d.size} onChange={e => setDownloads(downloads.map((x, idx) => idx === i ? { ...x, size: e.target.value } : x))} placeholder="Size (e.g. 2MB)" className={`${inputCls} bg-transparent border-none flex-1 h-10 px-3`} />
                                                        <input value={d.fmt} onChange={e => setDownloads(downloads.map((x, idx) => idx === i ? { ...x, fmt: e.target.value } : x))} placeholder="Format (PDF)" className={`${inputCls} bg-transparent border-none flex-1 h-10 px-3 uppercase`} />
                                                        <input value={d.url} onChange={e => setDownloads(downloads.map((x, idx) => idx === i ? { ...x, url: e.target.value } : x))} placeholder="File URL" className={`${inputCls} bg-transparent border-none flex-[2] h-10 px-3`} />
                                                        <button onClick={() => setDownloads(downloads.filter((_, idx) => idx !== i))} className="p-3 text-muted-foreground hover:text-rose-500"><Trash2 size={16} /></button>
                                                    </div>
                                                ))}
                                                {downloads.length === 0 && <p className="text-xs text-muted-foreground/50 text-center py-2">No files attached.</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 8: Publish */}
                                {step === 8 && (
                                    <div className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-black font-display mb-3">Review & Publish</h2>
                                            <p className="text-muted-foreground font-medium">Your artifact is ready for the laboratory.</p>
                                        </div>

                                        {/* Summary Card */}
                                        <div className="bg-card/60 border border-border rounded-[28px] overflow-hidden">
                                            {coverUrl && <img src={coverUrl} alt="cover" className="w-full h-48 object-cover" />}
                                            <div className="p-8">
                                                <div className="flex gap-3 mb-4">
                                                    {category && <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">{category}</span>}
                                                    {difficulty && <span className="px-3 py-1 rounded-full bg-muted border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground">{difficulty}</span>}
                                                </div>
                                                <h3 className="text-3xl font-black font-display mb-3">{title || "Untitled Project"}</h3>
                                                <p className="text-muted-foreground font-medium leading-relaxed mb-5">{description}</p>
                                                {tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {tags.map(t => <span key={t} className="px-3 py-1 rounded-xl bg-muted border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground">{t}</span>)}
                                                    </div>
                                                )}
                                                <div className="mt-5 pt-5 border-t border-border grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                                                    <span>{buildSteps.filter(s => s.title).length} build steps</span>
                                                    <span>{bomRows.filter(r => r.name).length} BOM items</span>
                                                    <span>{codeFiles.reduce((sum, f) => sum + (f.content.split("\n").length || 0), 0)} lines of code</span>
                                                    <span>@{authUser?.username}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Publish Status */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { val: "published" as const, label: "Publish Now", desc: "Go live in the laboratory immediately", icon: Rocket },
                                                { val: "draft" as const, label: "Save Draft", desc: "Keep private until you are ready", icon: FileText },
                                            ].map(opt => (
                                                <button key={opt.val} onClick={() => setPublishStatus(opt.val)}
                                                    className={`p-6 rounded-[24px] border-2 text-left transition-all ${publishStatus === opt.val ? "bg-primary/10 border-primary" : "bg-card/40 border-border hover:border-primary/40"}`}>
                                                    <opt.icon size={22} className={publishStatus === opt.val ? "text-primary mb-3" : "text-muted-foreground mb-3"} />
                                                    <p className={`font-black text-base mb-1 ${publishStatus === opt.val ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
                                                    <p className="text-sm text-muted-foreground font-medium">{opt.desc}</p>
                                                </button>
                                            ))}
                                        </div>

                                        <Button variant="primary" fullWidth onClick={handlePublish} icon={<Rocket size={18} />}
                                            className="h-16 rounded-[24px] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20">
                                            {publishStatus === "published" ? "🚀 Launch Artifact" : "💾 Save Draft"}
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        {step < 8 && (
                            <div className="flex justify-between mt-14">
                                <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 1} icon={<ArrowLeft size={16} />}
                                    className="h-14 px-8 rounded-[20px] border border-border bg-muted/30 font-black uppercase tracking-widest disabled:opacity-30">
                                    Back
                                </Button>
                                <Button variant="primary" onClick={() => canNext() && setStep(s => s + 1)} disabled={!canNext()}
                                    icon={<ArrowRight size={16} />}
                                    className="h-14 px-10 rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed">
                                    Next Step
                                </Button>
                            </div>
                        )}
                    </div>
                </main>
            </div >
        </div >
    );
}
