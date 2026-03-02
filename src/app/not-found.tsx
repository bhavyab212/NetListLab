"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Compass, ArrowRight } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import CircuitBackground from "@/components/ui/CircuitBackground";
import LiquidCursor from "@/components/ui/LiquidCursor";
import LiquidBlob from "@/components/ui/LiquidBlob";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function NotFoundPage() {
    const { isDark } = useThemeStore();
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 200);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={isDark ? "dark" : ""}>
            <div className="min-h-screen bg-background text-foreground font-sans relative flex items-center justify-center overflow-hidden selection:bg-primary/30">
                <CircuitBackground />
                <LiquidBlob />
                <LiquidCursor />

                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
                    <Logo size="md" />
                </header>

                <main className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">
                    {/* 404 Glitch Number */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="relative mb-10"
                    >
                        <div className={`text-[180px] sm:text-[220px] font-black font-display leading-none tracking-tighter select-none relative transition-all duration-75 ${glitch ? "text-rose-500/50" : "text-muted/30"}`}
                            style={{ WebkitTextStroke: glitch ? "2px rgb(239 68 68 / 0.5)" : "2px rgb(var(--border-rgb, 128,128,128)/ 0.3)" }}>
                            404
                            {glitch && (
                                <>
                                    <div className="absolute inset-0 text-primary/30 translate-x-2 translate-y-1 select-none" style={{ WebkitTextStroke: "2px transparent" }}>404</div>
                                    <div className="absolute inset-0 text-rose-500/20 -translate-x-2 -translate-y-1 select-none" style={{ WebkitTextStroke: "2px transparent" }}>404</div>
                                </>
                            )}
                        </div>

                        {/* Scanline */}
                        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${glitch ? "opacity-100" : "opacity-0"}`}
                            style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(var(--primary-rgb, 0,229,255),.03) 2px, rgba(var(--primary-rgb,0,229,255),.03) 4px)" }} />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-rose-500/20 bg-rose-500/5 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            Signal Lost
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight mb-5 leading-[1.1]">
                            Artifact Not Found<br />in Laboratory
                        </h1>
                        <p className="text-xl text-muted-foreground font-medium mb-14 max-w-lg mx-auto leading-relaxed opacity-80">
                            The signal you sent was received — but the destination artifact doesn't exist in our database.
                        </p>
                    </motion.div>

                    {/* Diagnostic */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-border rounded-[28px] p-8 mb-14 text-left font-mono text-sm">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-rose-500/80" /><div className="w-3 h-3 rounded-full bg-amber-500/80" /><div className="w-3 h-3 rounded-full bg-emerald-500/80" /></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">netlistlab-system</span>
                        </div>
                        <div className="space-y-1.5 text-muted-foreground/60">
                            <p><span className="text-primary">❯</span> INIT_LOOKUP<span className="text-amber-400"> --target</span> <span className="text-emerald-400">"/route-not-found"</span></p>
                            <p><span className="text-primary">❯</span> <span className="text-rose-500">ERROR 404</span> - artifact.db returned null</p>
                            <p><span className="text-primary">❯</span> fallback <span className="text-muted-foreground/40">→ null route</span></p>
                            <p className="text-muted-foreground/30">// Try navigating to a known endpoint</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-5">
                        <Link href="/">
                            <Button variant="primary" icon={<Home size={18} />} className="h-14 px-10 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20">
                                Mission Control
                            </Button>
                        </Link>
                        <Link href="/explore">
                            <Button variant="ghost" icon={<Compass size={18} />} className="h-14 px-10 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] border border-border bg-muted/30 hover:bg-muted/50">
                                Explore Lab
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Floating particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                            <motion.div key={i}
                                className="absolute w-1.5 h-1.5 rounded-full bg-primary/30"
                                initial={{ x: Math.random() * 800, y: Math.random() * 600, opacity: 0 }}
                                animate={{ y: [null, Math.random() * -400 - 100], opacity: [0, 0.8, 0] }}
                                transition={{ duration: Math.random() * 6 + 4, repeat: Infinity, delay: Math.random() * 4, ease: "linear" }}
                                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
