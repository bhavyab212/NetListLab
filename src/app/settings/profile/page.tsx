"use client";

import { useState, useEffect } from "react";
import {
    ArrowLeft, Save, Sun, Moon, Camera, Plus, Trash2, MapPin,
    Briefcase, Link as LinkIcon, Github, Twitter, Linkedin
} from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { motion } from "framer-motion";
import CircuitBackground from "@/components/ui/CircuitBackground";
import LiquidCursor from "@/components/ui/LiquidCursor";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SKILLS_POOL = [
    "Verilog", "VHDL", "Python", "C++", "C", "Rust", "MATLAB",
    "ROS2", "KiCad", "Altium", "FPGA", "ASIC", "PCB Layout",
    "DSP", "Machine Learning", "Embedded Linux", "FreeRTOS",
    "PyTorch", "TensorFlow", "ARM Assembly", "SolidWorks"
];

export default function ProfileSettingsPage() {
    const { isDark, toggle } = useThemeStore();
    const { isAuthenticated, user: authUser, updateProfile } = useAuthStore();
    const router = useRouter();

    const [fullName, setFullName] = useState(authUser?.fullName ?? "");
    const [username, setUsername] = useState(authUser?.username ?? "");
    const [bio, setBio] = useState(authUser?.bio ?? "");
    const [role, setRole] = useState(authUser?.role ?? "");
    const [institution, setInstitution] = useState(authUser?.institution ?? "");
    const [location, setLocation] = useState(authUser?.location ?? "");
    const [avatar, setAvatar] = useState(authUser?.avatar ?? "");
    const [skills, setSkills] = useState<string[]>(authUser?.skills ?? []);
    const [github, setGithub] = useState("");
    const [twitter, setTwitter] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [website, setWebsite] = useState("");
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) router.push("/login");
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const toggleSkill = (skill: string) => {
        setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
        setIsDirty(true);
    };

    const handleSave = () => {
        if (!fullName.trim()) { toast.error("Full name is required."); return; }
        const tid = toast.loading("Saving profile…");
        setTimeout(() => {
            updateProfile({ fullName, username, bio, role, institution, location, avatar, skills });
            toast.success("Profile Updated", { id: tid, description: "Changes saved to your laboratory profile." });
            setIsDirty(false);
        }, 900);
    };

    const inputCls = "w-full h-12 px-5 rounded-2xl bg-muted/40 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm placeholder:text-muted-foreground/40";
    const labelCls = "block text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-3";

    return (
        <div className={isDark ? "dark" : ""}>
            <div className="glass-floor min-h-screen bg-background text-foreground font-sans relative transition-colors duration-700">
                <CircuitBackground />
                <LiquidCursor />

                <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-background/80 backdrop-blur-3xl border-b border-border">
                    <div className="flex items-center gap-5">
                        <button onClick={() => router.push("/dashboard")} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <Logo size="sm" />
                        {isDirty && <span className="hidden sm:block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest">Unsaved</span>}
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={toggle} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all">
                            {isDark ? <Sun size={17} /> : <Moon size={17} />}
                        </button>
                        <Button variant="primary" icon={<Save size={15} />} onClick={handleSave} className="h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Save</Button>
                    </div>
                </header>

                <main className="pt-28 pb-20 px-4 md:px-8">
                    <div className="max-w-2xl mx-auto space-y-10">
                        <div>
                            <h1 className="text-4xl font-black font-display tracking-tight mb-1">Profile Settings</h1>
                            <p className="text-muted-foreground font-medium">How the laboratory sees you.</p>
                        </div>

                        {/* Avatar */}
                        <div className="bg-card/60 border border-border rounded-[28px] p-9">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-7">Profile Photo</h2>
                            <div className="flex items-center gap-8">
                                <div className="relative group cursor-pointer">
                                    <img src={avatar || `https://i.pravatar.cc/120?u=${username}`} alt="avatar" className="w-24 h-24 rounded-[24px] object-cover border-4 border-border group-hover:border-primary transition-all" />
                                    <div className="absolute inset-0 flex items-center justify-center rounded-[24px] bg-black/50 opacity-0 group-hover:opacity-100 transition-all">
                                        <Camera size={24} className="text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className={labelCls}>Avatar URL</label>
                                    <input value={avatar} onChange={e => { setAvatar(e.target.value); setIsDirty(true); }} placeholder="https://i.pravatar.cc/…" className={inputCls} />
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="bg-card/60 border border-border rounded-[28px] p-9 space-y-6">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-7">Basic Information</h2>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className={labelCls}>Full Name *</label>
                                    <input value={fullName} onChange={e => { setFullName(e.target.value); setIsDirty(true); }} placeholder="Jane Doe" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Username *</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-black">@</span>
                                        <input value={username} onChange={e => { setUsername(e.target.value); setIsDirty(true); }} className={`${inputCls} pl-8`} placeholder="username" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Bio</label>
                                <textarea value={bio} onChange={e => { setBio(e.target.value); setIsDirty(true); }} rows={4} maxLength={280}
                                    className="w-full px-5 py-4 rounded-2xl bg-muted/40 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm placeholder:text-muted-foreground/40 resize-none"
                                    placeholder="Tell the laboratory about yourself…" />
                                <p className="text-right text-[10px] font-bold text-muted-foreground/40 mt-1">{bio.length}/280</p>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className={labelCls}><Briefcase className="inline w-4 h-4 mr-1" /> Role</label>
                                    <input value={role} onChange={e => { setRole(e.target.value); setIsDirty(true); }} placeholder="e.g. Hardware Engineer" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}><MapPin className="inline w-4 h-4 mr-1" /> Location</label>
                                    <input value={location} onChange={e => { setLocation(e.target.value); setIsDirty(true); }} placeholder="e.g. Bangalore, IN" className={inputCls} />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Institution / Company</label>
                                <input value={institution} onChange={e => { setInstitution(e.target.value); setIsDirty(true); }} placeholder="e.g. IIT Bombay" className={inputCls} />
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-card/60 border border-border rounded-[28px] p-9 space-y-5">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-7">Social Links</h2>
                            {[
                                { label: "GitHub", icon: Github, val: github, set: setGithub, placeholder: "https://github.com/username" },
                                { label: "Twitter / X", icon: Twitter, val: twitter, set: setTwitter, placeholder: "https://twitter.com/username" },
                                { label: "LinkedIn", icon: Linkedin, val: linkedin, set: setLinkedin, placeholder: "https://linkedin.com/in/username" },
                                { label: "Website", icon: LinkIcon, val: website, set: setWebsite, placeholder: "https://yoursite.dev" },
                            ].map(s => (
                                <div key={s.label}>
                                    <label className={labelCls}><s.icon className="inline w-4 h-4 mr-1" /> {s.label}</label>
                                    <input value={s.val} onChange={e => { s.set(e.target.value); setIsDirty(true); }} placeholder={s.placeholder} className={inputCls} />
                                </div>
                            ))}
                        </div>

                        {/* Skills */}
                        <div className="bg-card/60 border border-border rounded-[28px] p-9">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-7">Technical Skills</h2>
                            <p className="text-sm text-muted-foreground font-medium mb-6 opacity-80">Select all that apply.</p>
                            <div className="flex flex-wrap gap-2.5">
                                {SKILLS_POOL.map(skill => (
                                    <button key={skill} onClick={() => toggleSkill(skill)}
                                        className={`px-4 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-widest border transition-all ${skills.includes(skill) ? "bg-primary/10 border-primary text-primary scale-105" : "bg-muted/40 border-border text-muted-foreground hover:border-primary/40 hover:text-primary"}`}>
                                        {skill}
                                    </button>
                                ))}
                            </div>
                            {skills.length > 0 && (
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-5">{skills.length} skills selected</p>
                            )}
                        </div>

                        <Button variant="primary" fullWidth icon={<Save size={18} />} onClick={handleSave}
                            className="h-16 rounded-[24px] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20">
                            Save Profile
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
