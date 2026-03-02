"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, UserPlus, Compass } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import CircuitBackground from "@/components/ui/CircuitBackground";
import LiquidCursor from "@/components/ui/LiquidCursor";
import { useThemeStore } from "@/stores/themeStore";

export default function Home() {
  const { isDark } = useThemeStore();

  return (
    <div className={isDark ? "dark" : ""}>
      <main className="min-h-screen bg-[#141310] relative flex flex-col items-center justify-center p-6 text-foreground font-sans overflow-hidden">
        <CircuitBackground />
        <LiquidCursor />
        
        {/* Subtle radial gradient to center the content */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <Logo size="lg" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-black font-display text-white mb-6 leading-tight tracking-tight"
          >
            Every build deserves <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-gold">a stage.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl font-medium leading-relaxed opacity-80"
          >
            The premier platform for engineering portfolios. Document, showcase, 
            and replicate high-fidelity engineering projects with ease.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl"
          >
            <Link href="/explore" className="group">
              <div className="h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-primary/40 hover:bg-white/10 hover:shadow-glow-cyan group-active:scale-95">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 transition-transform duration-500 group-hover:rotate-12">
                  <Compass size={28} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest text-white mb-3">Explore</h3>
                <p className="text-sm text-muted-foreground font-medium mb-6">Discover amazing engineering artifacts.</p>
                <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-widest text-primary gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Enter Lab <ArrowRight size={14} />
                </div>
              </div>
            </Link>

            <Link href="/login" className="group">
              <div className="h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-primary/40 hover:bg-white/10 hover:shadow-glow-cyan group-active:scale-95">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 transition-transform duration-500 group-hover:rotate-12">
                  <LogIn size={28} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest text-white mb-3">Login</h3>
                <p className="text-sm text-muted-foreground font-medium mb-6">Access your workspace and projects.</p>
                <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-widest text-primary gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Sign In <ArrowRight size={14} />
                </div>
              </div>
            </Link>

            <Link href="/register" className="group">
              <div className="h-full bg-primary/10 backdrop-blur-xl rounded-2xl border border-primary/20 p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-primary/40 hover:bg-primary/20 hover:shadow-glow-cyan group-active:scale-95">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6 transition-transform duration-500 group-hover:rotate-12">
                  <UserPlus size={28} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest text-white mb-3 text-primary">Join</h3>
                <p className="text-sm text-muted-foreground font-medium mb-6">Create your engineering portfolio.</p>
                <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-widest text-primary gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Register <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
            className="mt-20 flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30"
          >
            <div className="h-px w-12 bg-white/5" />
            SECURED TRANSMISSION
            <div className="h-px w-12 bg-white/5" />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
