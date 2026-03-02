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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const STEPS = [
    { id: 1, label: "Basics", icon: FileText, desc: "Name your artifact" },
    { id: 2, label: "Build Steps", icon: ShoppingCart, desc: "Document the process" },
    { id: 3, label: "BOM", icon: Tag, desc: "Bill of materials" },
    { id: 4, label: "Code", icon: Code, desc: "Upload firmware" },
    { id: 5, label: "Publish", icon: Rocket, desc: "Review and launch" },
];

const CATEGORIES = ["Electronics", "Hardware", "Robotics", "Software", "AI/ML"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Expert"];

interface BOMRow { name: string; category: string; qty: number; price: string; }
interface BuildStep { title: string; body: string; }

export default function NewProjectPage() {
    const { isDark, toggle } = useThemeStore();
    const { isAuthenticated, user: authUser } = useAuthStore();
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
    const [buildSteps, setBuildSteps] = useState<BuildStep[]>([{ title: "", body: "" }]);

    // Step 3 State
    const [bomRows, setBomRows] = useState<BOMRow[]>([{ name: "", category: "", qty: 1, price: "" }]);

    // Step 4 State
    const [code, setCode] = useState("");
    const [codeLang, setCodeLang] = useState("cpp");

    // Step 5 State
    const [publishStatus, setPublishStatus] = useState<"draft" | "published">("published");

    if (!isAuthenticated) return null;

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(""); }
    };
    const removeTag = (t: string) => setTags(tags.filter(x => x !== t));

    const addBOMRow = () => setBomRows([...bomRows, { name: "", category: "", qty: 1, price: "" }]);
    const removeBOMRow = (i: number) => setBomRows(bomRows.filter((_, j) => j !== i));
    const updateBOMRow = (i: number, field: keyof BOMRow, val: string | number) =>
        setBomRows(bomRows.map((r, j) => j === i ? { ...r, [field]: val } : r));

    const addStep = () => setBuildSteps([...buildSteps, { title: "", body: "" }]);
    const removeStep = (i: number) => setBuildSteps(buildSteps.filter((_, j) => j !== i));
    const updateStep = (i: number, field: keyof BuildStep, val: string) =>
        setBuildSteps(buildSteps.map((s, j) => j === i ? { ...s, [field]: val } : s));

    const canNext = () => {
        if (step === 1) return title.trim() && category && difficulty && description.trim();
        if (step === 2) return buildSteps.every(s => s.title.trim() && s.body.trim());
        return true;
    };

    const handlePublish = () => {
        const tid = toast.loading("Publishing artifact…");
        setTimeout(() => {
            toast.success(publishStatus === "published" ? "🚀 Artifact Published!" : "Draft Saved", {
                id: tid,
                description: publishStatus === "published" ? `${title} is now live in the laboratory.` : `${title} saved as draft.`,
                action: { label: "View", onClick: () => router.push("/dashboard") },
            });
            router.push("/dashboard");
        }, 1500);
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

                                {/* Step 2: Build Steps */}
                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-black font-display mb-3">Document the Process</h2>
                                            <p className="text-muted-foreground font-medium">Break down your build into reproducible steps.</p>
                                        </div>
                                        <div className="space-y-6">
                                            {buildSteps.map((s, i) => (
                                                <div key={i} className="bg-card/60 border border-border rounded-[24px] p-7 relative group">
                                                    <div className="flex items-center gap-4 mb-5">
                                                        <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg shrink-0">{i + 1}</div>
                                                        <input value={s.title} onChange={e => updateStep(i, "title", e.target.value)} placeholder={`Step ${i + 1} title…`}
                                                            className="flex-1 bg-transparent outline-none font-black text-foreground text-lg placeholder:text-muted-foreground/40" />
                                                        {buildSteps.length > 1 && (
                                                            <button onClick={() => removeStep(i)} className="opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 transition-all">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <textarea value={s.body} onChange={e => updateStep(i, "body", e.target.value)} rows={3} placeholder="Describe this step in detail…"
                                                        className="w-full bg-transparent outline-none resize-none text-sm font-medium text-muted-foreground placeholder:text-muted-foreground/30" />
                                                </div>
                                            ))}
                                            <button onClick={addStep} className="w-full h-14 rounded-[20px] border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest">
                                                <Plus size={16} /> Add Step
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: BOM */}
                                {step === 3 && (
                                    <div className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-black font-display mb-3">Bill of Materials</h2>
                                            <p className="text-muted-foreground font-medium">List every component so others can replicate your build.</p>
                                        </div>
                                        <div className="bg-card/60 border border-border rounded-[28px] overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-border bg-muted/20">
                                                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Component</th>
                                                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Category</th>
                                                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 w-20">Qty</th>
                                                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Price (₹)</th>
                                                        <th className="w-12" />
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border">
                                                    {bomRows.map((r, i) => (
                                                        <tr key={i}>
                                                            <td className="px-5 py-3"><input value={r.name} onChange={e => updateBOMRow(i, "name", e.target.value)} placeholder="Component name" className="bg-transparent outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/30 w-full" /></td>
                                                            <td className="px-5 py-3"><input value={r.category} onChange={e => updateBOMRow(i, "category", e.target.value)} placeholder="IC, Sensor…" className="bg-transparent outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/30 w-full" /></td>
                                                            <td className="px-5 py-3"><input type="number" min={1} value={r.qty} onChange={e => updateBOMRow(i, "qty", parseInt(e.target.value) || 1)} className="bg-transparent outline-none text-sm font-medium text-foreground w-14" /></td>
                                                            <td className="px-5 py-3"><input value={r.price} onChange={e => updateBOMRow(i, "price", e.target.value)} placeholder="0" className="bg-transparent outline-none text-sm font-medium text-primary w-full placeholder:text-muted-foreground/30" /></td>
                                                            <td className="px-3 py-3 text-right">{bomRows.length > 1 && <button onClick={() => removeBOMRow(i)} className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-rose-500 transition-colors"><Trash2 size={13} /></button>}</td>
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

                                {/* Step 4: Code */}
                                {step === 4 && (
                                    <div className="space-y-8">
                                        <div className="text-center mb-12">
                                            <h2 className="text-4xl font-black font-display mb-3">Upload Firmware / Code</h2>
                                            <p className="text-muted-foreground font-medium">Share the code that brings your build to life.</p>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Language</label>
                                            <div className="flex gap-2 mb-6">
                                                {["cpp", "python", "verilog", "javascript", "c"].map(l => (
                                                    <button key={l} onClick={() => setCodeLang(l)}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${codeLang === l ? "bg-primary/10 border-primary text-primary" : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"}`}>
                                                        {l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-[#0A0A0A] rounded-[28px] border border-white/10 overflow-hidden">
                                            <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center gap-4">
                                                <div className="flex gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                                                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                                </div>
                                                <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">main.{codeLang === "cpp" ? "cpp" : codeLang === "python" ? "py" : codeLang === "verilog" ? "v" : codeLang === "javascript" ? "js" : "c"}</span>
                                            </div>
                                            <textarea value={code} onChange={e => setCode(e.target.value)} rows={18} placeholder={`// Write or paste your ${codeLang} code here…\n`}
                                                className="w-full bg-transparent px-8 py-6 font-mono text-sm text-emerald-400/90 outline-none resize-none placeholder:text-white/20 leading-relaxed" />
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Publish */}
                                {step === 5 && (
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
                                                    <span>{code.split("\n").length} lines of code</span>
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
                        {step < 5 && (
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
            </div>
        </div>
    );
}
