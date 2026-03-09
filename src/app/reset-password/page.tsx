"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import Input from '@/components/ui/CustomInput';
import Button from '@/components/ui/Button';
import CircuitBackground from '@/components/ui/CircuitBackground';
import LiquidCursor from '@/components/ui/LiquidCursor';
import { Sun, Moon, ShieldCheck } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type View = 'loading' | 'form' | 'invalid_link';

export default function ResetPasswordPage() {
    const [view, setView] = useState<View>('loading');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { isDark, toggle } = useThemeStore();
    const router = useRouter();

    // On mount — Supabase embeds the session in the URL hash after password reset click
    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (accessToken && refreshToken && type === 'recovery') {
            // Set the session so updateUser() works
            supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
                .then(({ error }) => {
                    if (error) {
                        setView('invalid_link');
                    } else {
                        setView('form');
                    }
                });
        } else {
            setView('invalid_link');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let hasError = false;

        if (!newPassword.trim() || newPassword.length < 8) {
            setNewPasswordError('Password must be at least 8 characters');
            hasError = true;
        } else {
            setNewPasswordError('');
        }

        if (!confirmPassword.trim()) {
            setConfirmPasswordError('Please confirm your password');
            hasError = true;
        } else if (newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords don't match");
            hasError = true;
        } else {
            setConfirmPasswordError('');
        }

        if (hasError) return;

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            toast.success("Password updated!", { description: "Please sign in with your new password." });
            router.push('/login');
        } catch (err) {
            toast.error("Update failed", { description: err instanceof Error ? err.message : 'Try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={isDark ? "dark" : ""}>
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                background: 'var(--bg-base)',
                position: 'relative',
                transition: 'background 350ms ease',
            }}>
                <CircuitBackground opacity={1} />
                <LiquidCursor />

                {/* Theme toggle */}
                <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 100 }}>
                    <button
                        onClick={toggle}
                        className="w-10 h-10 rounded-full bg-card/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '32px',
                        zIndex: 1,
                        width: '100%',
                        maxWidth: '480px',
                    }}
                >
                    <Logo size="lg" />

                    <div
                        className="glass-panel"
                        style={{
                            width: '100%',
                            borderRadius: '24px',
                            padding: '32px',
                            position: 'relative',
                            zIndex: 1,
                        }}
                        data-liquid-cursor
                    >
                        {/* ── LOADING ──────────────────────────────────────── */}
                        {view === 'loading' && (
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <p style={{ color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif", fontSize: '0.875rem' }}>
                                    Verifying your reset link…
                                </p>
                            </div>
                        )}

                        {/* ── INVALID LINK ─────────────────────────────────── */}
                        {view === 'invalid_link' && (
                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 600, fontSize: '1.5rem',
                                    color: 'var(--text-primary)', marginBottom: '8px',
                                }}>
                                    Invalid or expired link
                                </h2>
                                <p style={{
                                    fontSize: '0.875rem', color: 'var(--text-secondary)',
                                    fontFamily: "'Inter', sans-serif", marginBottom: '24px', lineHeight: 1.6,
                                }}>
                                    This password reset link has expired or already been used. Request a new one from the login page.
                                </p>
                                <Link href="/login" style={{
                                    color: 'var(--accent-primary)', fontWeight: 600,
                                    fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', textDecoration: 'none',
                                }}>
                                    ← Back to login
                                </Link>
                            </div>
                        )}

                        {/* ── RESET FORM ───────────────────────────────────── */}
                        {view === 'form' && (
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                    <ShieldCheck size={22} style={{ color: 'var(--accent-primary)' }} />
                                    <h2 style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontWeight: 600, fontSize: '1.75rem',
                                        lineHeight: 1.25, color: 'var(--text-primary)',
                                    }}>
                                        Set new password
                                    </h2>
                                </div>
                                <p style={{
                                    fontSize: '0.875rem', color: 'var(--text-secondary)',
                                    fontFamily: "'Inter', sans-serif", marginBottom: '24px',
                                }}>
                                    Choose a strong password for your account.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <Input
                                        label="New password"
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        value={newPassword}
                                        onChange={setNewPassword}
                                        error={newPasswordError}
                                        autoComplete="new-password"
                                    />
                                    <Input
                                        label="Confirm new password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={setConfirmPassword}
                                        error={confirmPasswordError}
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                                        Update password
                                    </Button>
                                    <Link href="/login" style={{
                                        textAlign: 'center', color: 'var(--accent-primary)',
                                        fontSize: '0.875rem', fontFamily: "'Inter', sans-serif", textDecoration: 'none',
                                    }}>
                                        ← Back to login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
