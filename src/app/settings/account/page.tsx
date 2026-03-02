"use client";

import { useState, useEffect } from "react";
import {
    ArrowLeft, Save, Sun, Moon, Mail, Lock, ShieldCheck, Trash2,
    AlertTriangle, Eye, EyeOff, Check, Bell, Phone
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

export default function AccountSettingsPage() {
    const { isDark, toggle } = useThemeStore();
    const { isAuthenticated, user: authUser, logout } = useAuthStore();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("email");

    // Email section
    const [email, setEmail] = useState(authUser?.email ?? "");
    const [newEmail, setNewEmail] = useState("");

    // Password section
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    // Notification prefs
    const [notifPrefs, setNotifPrefs] = useState({
        stars: true, forks: true, comments: true, follows: true,
        replies: true, newsletter: false, digest: true,
    });

    // 2FA
    const [twoFaEnabled, setTwoFaEnabled] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) router.push("/login");
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const handleEmailChange = () => {
        if (!newEmail.includes("@")) { toast.error("Invalid email address."); return; }
        const tid = toast.loading("Sending verification…");
        setTimeout(() => {
            toast.success("Verification Sent", { id: tid, description: `Check ${newEmail} to confirm the change.` });
            setNewEmail("");
        }, 1200);
    };

    const handlePwdChange = () => {
        if (!currentPwd) { toast.error("Enter your current password."); return; }
        if (newPwd.length < 8) { toast.error("Password must be at least 8 characters."); return; }
        if (newPwd !== confirmPwd) { toast.error("Passwords don't match."); return; }
        const tid = toast.loading("Updating password…");
        setTimeout(() => {
            toast.success("Password Updated", { id: tid, description: "Your credentials have been changed." });
            setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
        }, 900);
    };

    const handleDeleteAccount = () => {
        toast.error("Are you absolutely sure?", {
            description: "This action is permanent. All your projects and data will be deleted.",
            action: { label: "Yes, Delete", onClick: () => { logout(); router.push("/"); } },
        });
    };

    const inputCls = "w-full h-12 px-5 rounded-2xl bg-muted/40 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-sm placeholder:text-muted-foreground/40";
    const labelCls = "block text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-3";

    const sections = [
        { id: "email", label: "Email", icon: Mail },
        { id: "password", label: "Password", icon: Lock },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "2FA & Security", icon: ShieldCheck },
        { id: "danger", label: "Danger Zone", icon: AlertTriangle },
    ];

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
                    </div>
                    <button onClick={toggle} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all">
                        {isDark ? <Sun size={17} /> : <Moon size={17} />}
                    </button>
                </header>

                <main className="pt-28 pb-20 px-4 md:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                            {/* Section Nav */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-32 space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 mb-4 px-3">Account</p>
                                    {sections.map(s => (
                                        <button key={s.id} onClick={() => setActiveSection(s.id)}
                                            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeSection === s.id ? s.id === "danger" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}>
                                            <s.icon size={15} /> {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="lg:col-span-3">
                                <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

                                    {/* Email */}
                                    {activeSection === "email" && (
                                        <div className="bg-card/60 border border-border rounded-[28px] p-9 space-y-7">
                                            <h2 className="text-3xl font-black font-display">Email Address</h2>
                                            <div>
                                                <label className={labelCls}>Current Email</label>
                                                <div className="h-12 px-5 rounded-2xl bg-muted/20 border border-border flex items-center gap-3 text-muted-foreground font-medium text-sm">
                                                    <Mail size={15} className="text-muted-foreground/40" /> {authUser?.email}
                                                    <span className="ml-auto flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest"><Check size={12} /> Verified</span>
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-border">
                                                <label className={labelCls}>New Email</label>
                                                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="new@email.com" className={inputCls} />
                                                <p className="text-[10px] text-muted-foreground/40 font-bold mt-3">A verification link will be sent to the new address.</p>
                                                <Button variant="primary" icon={<Mail size={15} />} onClick={handleEmailChange} disabled={!newEmail} className="mt-5 h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-40">
                                                    Send Verification
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Password */}
                                    {activeSection === "password" && (
                                        <div className="bg-card/60 border border-border rounded-[28px] p-9 space-y-6">
                                            <h2 className="text-3xl font-black font-display">Change Password</h2>
                                            <div>
                                                <label className={labelCls}>Current Password</label>
                                                <div className="relative">
                                                    <input type={showPwd ? "text" : "password"} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="••••••••" className={`${inputCls} pr-12`} />
                                                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                                        {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className={labelCls}>New Password</label>
                                                <input type={showPwd ? "text" : "password"} value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Min 8 characters" className={inputCls} />
                                                {newPwd && (
                                                    <div className="flex gap-2 mt-3">
                                                        {["length", "upper", "number", "special"].map((check, i) => {
                                                            const met = i === 0 ? newPwd.length >= 8 : i === 1 ? /[A-Z]/.test(newPwd) : i === 2 ? /\d/.test(newPwd) : /[^a-zA-Z0-9]/.test(newPwd);
                                                            return <div key={check} className={`h-1 flex-1 rounded-full transition-all ${met ? "bg-emerald-500" : "bg-muted"}`} />;
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label className={labelCls}>Confirm New Password</label>
                                                <input type={showPwd ? "text" : "password"} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="••••••••" className={`${inputCls} ${confirmPwd && newPwd !== confirmPwd ? "border-rose-500 ring-2 ring-rose-500/10" : ""}`} />
                                                {confirmPwd && newPwd !== confirmPwd && <p className="text-rose-500 text-xs font-bold mt-2">Passwords don't match</p>}
                                            </div>
                                            <Button variant="primary" icon={<Lock size={15} />} onClick={handlePwdChange} className="h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                                Update Password
                                            </Button>
                                        </div>
                                    )}

                                    {/* Notifications */}
                                    {activeSection === "notifications" && (
                                        <div className="bg-card/60 border border-border rounded-[28px] p-9 space-y-6">
                                            <h2 className="text-3xl font-black font-display">Notification Preferences</h2>
                                            <div className="space-y-4">
                                                {Object.entries(notifPrefs).map(([key, val]) => {
                                                    const labels: Record<string, { label: string; desc: string }> = {
                                                        stars: { label: "Stars received", desc: "When someone stars your project" },
                                                        forks: { label: "Forks received", desc: "When someone forks your project" },
                                                        comments: { label: "New comments", desc: "When someone comments on your project" },
                                                        follows: { label: "New followers", desc: "When someone follows you" },
                                                        replies: { label: "Comment replies", desc: "When someone replies to your comment" },
                                                        newsletter: { label: "Lab newsletter", desc: "Monthly digest of top projects" },
                                                        digest: { label: "Weekly digest", desc: "A curated summary of your feed" },
                                                    };
                                                    const info = labels[key] ?? { label: key, desc: "" };
                                                    return (
                                                        <div key={key} className="flex items-center justify-between p-5 rounded-2xl bg-muted/20 border border-border hover:border-border/80 transition-all">
                                                            <div>
                                                                <p className="text-sm font-black text-foreground">{info.label}</p>
                                                                <p className="text-sm text-muted-foreground font-medium mt-0.5">{info.desc}</p>
                                                            </div>
                                                            <button onClick={() => setNotifPrefs(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                                                                className={`w-12 h-6 rounded-full border-2 transition-all relative ${val ? "bg-primary border-primary" : "bg-muted border-border"}`}>
                                                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${val ? "left-6" : "left-0.5"}`} />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <Button variant="primary" icon={<Save size={15} />} onClick={() => toast.success("Preferences saved")} className="h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Save Preferences</Button>
                                        </div>
                                    )}

                                    {/* 2FA */}
                                    {activeSection === "security" && (
                                        <div className="bg-card/60 border border-border rounded-[28px] p-9 space-y-7">
                                            <h2 className="text-3xl font-black font-display">2FA & Security</h2>
                                            <div className="bg-muted/20 border border-border rounded-2xl p-7 flex items-start gap-5">
                                                <div className={`p-3 rounded-2xl ${twoFaEnabled ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}><ShieldCheck size={24} /></div>
                                                <div className="flex-1">
                                                    <p className="font-black text-foreground mb-1">Two-Factor Authentication</p>
                                                    <p className="text-sm text-muted-foreground font-medium mb-5">{twoFaEnabled ? "2FA is active on your account. Your lab is secure." : "Add an extra layer of security to your account."}</p>
                                                    <Button variant={twoFaEnabled ? "secondary" : "primary"}
                                                        onClick={() => { setTwoFaEnabled(!twoFaEnabled); toast.success(twoFaEnabled ? "2FA Disabled" : "2FA Enabled", { description: twoFaEnabled ? "Two-factor auth removed." : "Your account is now extra secure." }); }}
                                                        className="h-11 px-7 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                                        {twoFaEnabled ? "Disable 2FA" : "Enable 2FA"}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-border">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-5">Active Sessions</h3>
                                                {[
                                                    { device: "Chrome on macOS", location: "Bangalore, IN", current: true, time: "Active now" },
                                                    { device: "Firefox on Windows", location: "Delhi, IN", current: false, time: "12h ago" },
                                                ].map((session, i) => (
                                                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-border mb-3 bg-muted/10">
                                                        <div className="flex-1">
                                                            <p className="font-black text-sm flex items-center gap-2">{session.device} {session.current && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">This device</span>}</p>
                                                            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-0.5">{session.location} · {session.time}</p>
                                                        </div>
                                                        {!session.current && <button onClick={() => toast.success("Session revoked")} className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors">Revoke</button>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Danger Zone */}
                                    {activeSection === "danger" && (
                                        <div className="space-y-6">
                                            <div className="bg-rose-500/5 border-2 border-rose-500/20 rounded-[28px] p-9">
                                                <h2 className="text-3xl font-black font-display text-rose-500 mb-2">Danger Zone</h2>
                                                <p className="text-muted-foreground font-medium mb-8">These actions are irreversible. Proceed with caution.</p>
                                                <div className="space-y-5">
                                                    <div className="p-7 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex items-start justify-between gap-6">
                                                        <div>
                                                            <p className="font-black text-foreground mb-1">Export Data</p>
                                                            <p className="text-sm text-muted-foreground font-medium">Download all your project data, comments, and account info.</p>
                                                        </div>
                                                        <button onClick={() => toast.success("Export started", { description: "You'll receive a download link via email." })}
                                                            className="shrink-0 px-5 h-11 rounded-2xl bg-muted/50 border border-border text-[10px] font-black uppercase tracking-widest text-foreground hover:border-primary/40 hover:text-primary transition-all">
                                                            Export
                                                        </button>
                                                    </div>
                                                    <div className="p-7 rounded-2xl border-2 border-rose-500/40 bg-rose-500/10 flex items-start justify-between gap-6">
                                                        <div>
                                                            <p className="font-black text-rose-500 mb-1">Delete Account</p>
                                                            <p className="text-sm text-muted-foreground font-medium">Permanently delete your account and all associated data.</p>
                                                        </div>
                                                        <button onClick={handleDeleteAccount}
                                                            className="shrink-0 flex items-center gap-2 px-5 h-11 rounded-2xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/30">
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </div>
                                                </div>
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
