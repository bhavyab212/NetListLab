"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import Logo from '@/components/ui/Logo';
import Input from '@/components/ui/CustomInput';
import Button from '@/components/ui/Button';
import Divider from '@/components/ui/Divider';
import CircuitBackground from '@/components/ui/CircuitBackground';
import LiquidCursor from '@/components/ui/LiquidCursor';
import { Sun, Moon, Mail } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
);

const GitHubIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
);

// ─── View types ───────────────────────────────────────────────────────────────
type View = 'login' | 'forgot' | 'email_not_confirmed';

export default function LoginPage() {
    const [view, setView] = useState<View>('login');

    // Login form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [shake, setShake] = useState(false);

    const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password')
    const [otpSent, setOtpSent] = useState(false)
    const [otpValue, setOtpValue] = useState('')
    const [otpLoading, setOtpLoading] = useState(false)

    // Forgot password form state
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

    // Resend state
    const [resendLoading, setResendLoading] = useState(false);

    const { login, isLoading, sendOtp, verifyOtp } = useAuthStore();
    const { isDark, toggle } = useThemeStore();
    const router = useRouter();

    const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    // ── Login submit ──────────────────────────────────────────────────────────
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        let hasError = false;

        if (!email.trim()) { setEmailError('This field is required'); hasError = true; }
        else if (!validateEmail(email)) { setEmailError('Enter a valid email address'); hasError = true; }
        else setEmailError('');

        if (!password.trim()) { setPasswordError('This field is required'); hasError = true; }
        else setPasswordError('');

        if (hasError) return;

        const result = await login({ email, password });
        if (result === true) {
            toast.success("Welcome back!", { description: "Redirecting to your feed." });
            router.push('/explore');
        } else if (result === 'email_not_confirmed') {
            setView('email_not_confirmed');
            toast.warning("Email not confirmed", { description: "Check your inbox and click the confirmation link." });
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            toast.error("Login failed", { description: "Invalid email or password. Please try again." });
        }
    }, [email, password, login, router]);

    // ── Resend confirmation email ─────────────────────────────────────────────
    const handleResend = useCallback(async () => {
        setResendLoading(true);
        try {
            const { error } = await supabase.auth.resend({ type: 'signup', email });
            if (error) throw error;
            toast.success("Confirmation email resent", { description: "Check your inbox." });
        } catch (err) {
            toast.error("Failed to resend", { description: err instanceof Error ? err.message : 'Try again.' });
        } finally {
            setResendLoading(false);
        }
    }, [email]);

    // ── Forgot password submit ────────────────────────────────────────────────
    const handleForgotPassword = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail.trim() || !validateEmail(forgotEmail)) {
            toast.error("Enter a valid email address.");
            return;
        }
        setForgotLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
                redirectTo: 'https://netlistlab.vercel.app/reset-password',
            });
            if (error) throw error;
            toast.success("Password reset email sent!", { description: "Check your inbox for the reset link." });
            setForgotEmail('');
        } catch (err) {
            toast.error("Failed to send reset email", { description: err instanceof Error ? err.message : 'Try again.' });
        } finally {
            setForgotLoading(false);
        }
    }, [forgotEmail]);

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

                {/* Theme toggle — top right */}
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

                    <motion.div
                        animate={shake ? { x: [0, -6, 6, -6, 6, -6, 6, 0] } : {}}
                        transition={{ duration: 0.45 }}
                        className="glass-panel"
                        style={{
                            width: '100%',
                            borderRadius: '24px',
                            padding: '32px',
                            position: 'relative',
                            zIndex: 1,
                            transition: 'background 350ms ease, box-shadow 350ms ease, border-color 350ms ease',
                        }}
                        data-liquid-cursor
                    >
                        {/* ── LOGIN VIEW ──────────────────────────────────────── */}
                        {view === 'login' && (
                            <div style={{ width: '100%' }}>
                                {!(loginMode === 'otp' && otpSent) && (
                                    <>
                                        <h2 style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontWeight: 600,
                                            fontSize: '1.75rem',
                                            lineHeight: 1.25,
                                            color: 'var(--text-primary)',
                                            marginBottom: '4px',
                                        }}>
                                            Welcome back
                                        </h2>
                                        <p style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)',
                                            fontFamily: "'Inter', sans-serif",
                                            marginBottom: '24px',
                                        }}>
                                            Sign in to your workshop
                                        </p>
                                    </>
                                )}

                                {!(loginMode === 'otp' && otpSent) && (
                                    <div style={{
                                        display: 'flex',
                                        background: 'var(--bg-elevated, rgba(255,255,255,0.05))',
                                        borderRadius: '12px',
                                        padding: '4px',
                                        marginBottom: '24px',
                                        border: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
                                    }}>
                                        {(['password', 'otp'] as const).map(mode => (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => { setLoginMode(mode); setOtpSent(false); setOtpValue('') }}
                                                style={{
                                                    flex: 1,
                                                    padding: '8px 0',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontFamily: "'Inter', sans-serif",
                                                    fontSize: '0.875rem',
                                                    fontWeight: 500,
                                                    transition: 'all 200ms ease',
                                                    background: loginMode === mode ? 'var(--accent-primary)' : 'transparent',
                                                    color: loginMode === mode ? '#fff' : 'var(--text-secondary)',
                                                }}
                                            >
                                                {mode === 'password' ? '🔑 Password' : '✨ Magic Code'}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {loginMode === 'password' && (
                                    <form onSubmit={handleSubmit}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <Input
                                                label="Email address"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={setEmail}
                                                error={emailError}
                                                autoComplete="email"
                                            />
                                            <div>
                                                <Input
                                                    label="Password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={setPassword}
                                                    error={passwordError}
                                                    autoComplete="current-password"
                                                />
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                                                    <button type="button" onClick={() => { setForgotEmail(email); setView('forgot'); }} style={{
                                                        background: 'none', border: 'none',
                                                        color: 'var(--accent-primary)',
                                                        fontSize: '0.75rem',
                                                        fontFamily: "'Inter', sans-serif",
                                                        cursor: 'pointer',
                                                    }}>
                                                        Forgot password?
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '24px' }}>
                                            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                                                Sign In →
                                            </Button>
                                        </div>

                                        <div style={{ margin: '20px 0' }}>
                                            <Divider text="or continue with" />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <Button type="button" variant="secondary" fullWidth icon={<GoogleIcon />}
                                                onClick={() => toast.info('OAuth coming soon. Use email login for now.')}>
                                                Google
                                            </Button>
                                            <Button type="button" variant="secondary" fullWidth icon={<GitHubIcon />}
                                                onClick={() => toast.info('OAuth coming soon. Use email login for now.')}>
                                                GitHub
                                            </Button>
                                        </div>

                                        <p style={{
                                            textAlign: 'center',
                                            marginTop: '24px',
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)',
                                            fontFamily: "'Inter', sans-serif",
                                        }}>
                                            Don&apos;t have an account?{' '}
                                            <Link href="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
                                                Create one
                                            </Link>
                                        </p>
                                    </form>
                                )}

                                {loginMode === 'otp' && !otpSent && (
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        if (!email.trim() || !validateEmail(email)) {
                                            setEmailError('Enter a valid email address');
                                            return;
                                        }
                                        setEmailError('');
                                        setOtpLoading(true);
                                        const ok = await sendOtp(email);
                                        setOtpLoading(false);
                                        if (ok) {
                                            setOtpSent(true);
                                            toast.success("Magic code sent!", { description: "Check your inbox." });
                                        } else {
                                            toast.error("Failed to send code", { description: useAuthStore.getState().error || 'Try again.' });
                                            setShake(true); setTimeout(() => setShake(false), 500);
                                        }
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <Input
                                                label="Email address"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={setEmail}
                                                error={emailError}
                                                autoComplete="email"
                                            />
                                        </div>

                                        <div style={{ marginTop: '24px' }}>
                                            <Button type="submit" variant="primary" fullWidth isLoading={otpLoading}>
                                                Send Magic Code →
                                            </Button>
                                        </div>

                                        <p style={{
                                            textAlign: 'center',
                                            marginTop: '16px',
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)',
                                            fontFamily: "'Inter', sans-serif",
                                        }}>
                                            We&apos;ll email you a 6-digit code. No password needed.
                                        </p>

                                        <p style={{
                                            textAlign: 'center',
                                            marginTop: '24px',
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)',
                                            fontFamily: "'Inter', sans-serif",
                                        }}>
                                            Don&apos;t have an account?{' '}
                                            <Link href="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
                                                Create one
                                            </Link>
                                        </p>
                                    </form>
                                )}

                                {loginMode === 'otp' && otpSent && (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{
                                            width: '64px', height: '64px', borderRadius: '50%',
                                            background: 'var(--accent-primary-10, rgba(99,102,241,0.1))',
                                            border: '1px solid var(--accent-primary-30, rgba(99,102,241,0.3))',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 20px',
                                        }}>
                                            <Mail size={28} style={{ color: 'var(--accent-primary)' }} />
                                        </div>
                                        <h2 style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontWeight: 600, fontSize: '1.5rem',
                                            color: 'var(--text-primary)', marginBottom: '8px',
                                        }}>
                                            Enter your code
                                        </h2>
                                        <p style={{
                                            fontSize: '0.875rem', color: 'var(--text-secondary)',
                                            fontFamily: "'Inter', sans-serif", marginBottom: '24px', lineHeight: 1.6,
                                        }}>
                                            We sent a 6-digit code to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
                                        </p>

                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                                            <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <Button variant="primary" fullWidth isLoading={otpLoading} onClick={async () => {
                                                if (otpValue.length !== 6) return;
                                                setOtpLoading(true);
                                                const result = await verifyOtp(email, otpValue);
                                                setOtpLoading(false);
                                                if (result === 'authenticated') {
                                                    toast.success("Welcome back!");
                                                    router.push('/explore');
                                                } else if (result === 'new_user') {
                                                    toast.success("Account created!");
                                                    router.push('/onboarding');
                                                } else {
                                                    toast.error("Invalid or expired code. Try again.");
                                                    setShake(true); setTimeout(() => setShake(false), 500);
                                                    setOtpValue('');
                                                }
                                            }}>
                                                Verify & Sign In →
                                            </Button>

                                            <button type="button" onClick={async () => {
                                                setOtpLoading(true);
                                                const ok = await sendOtp(email);
                                                setOtpLoading(false);
                                                if (ok) toast.success("Magic code sent!", { description: "Check your inbox." });
                                                else toast.error("Failed to send code", { description: useAuthStore.getState().error || 'Try again.' });
                                            }} style={{
                                                background: 'none', border: 'none',
                                                color: 'var(--text-secondary)', fontSize: '0.875rem',
                                                fontFamily: "'Inter', sans-serif", cursor: 'pointer',
                                            }}>
                                                Resend code
                                            </button>

                                            <button type="button" onClick={() => { setLoginMode('password'); setOtpSent(false); }} style={{
                                                background: 'none', border: 'none',
                                                color: 'var(--accent-primary)', fontSize: '0.875rem',
                                                fontFamily: "'Inter', sans-serif", cursor: 'pointer',
                                                marginTop: '8px'
                                            }}>
                                                ← Use password instead
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── EMAIL NOT CONFIRMED VIEW ──────────────────────── */}
                        {view === 'email_not_confirmed' && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: 'var(--accent-primary-10, rgba(99,102,241,0.1))',
                                    border: '1px solid var(--accent-primary-30, rgba(99,102,241,0.3))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px',
                                }}>
                                    <Mail size={28} style={{ color: 'var(--accent-primary)' }} />
                                </div>
                                <h2 style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 600, fontSize: '1.5rem',
                                    color: 'var(--text-primary)', marginBottom: '8px',
                                }}>
                                    Email not confirmed
                                </h2>
                                <p style={{
                                    fontSize: '0.875rem', color: 'var(--text-secondary)',
                                    fontFamily: "'Inter', sans-serif", marginBottom: '24px', lineHeight: 1.6,
                                }}>
                                    We sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
                                    Click it to activate your account, then sign in here.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <Button variant="primary" fullWidth isLoading={resendLoading} onClick={handleResend}>
                                        Resend confirmation email
                                    </Button>
                                    <button type="button" onClick={() => setView('login')} style={{
                                        background: 'none', border: 'none',
                                        color: 'var(--accent-primary)', fontSize: '0.875rem',
                                        fontFamily: "'Inter', sans-serif", cursor: 'pointer',
                                    }}>
                                        ← Back to login
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── FORGOT PASSWORD VIEW ──────────────────────────── */}
                        {view === 'forgot' && (
                            <form onSubmit={handleForgotPassword}>
                                <h2 style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 600, fontSize: '1.75rem',
                                    lineHeight: 1.25, color: 'var(--text-primary)', marginBottom: '4px',
                                }}>
                                    Reset password
                                </h2>
                                <p style={{
                                    fontSize: '0.875rem', color: 'var(--text-secondary)',
                                    fontFamily: "'Inter', sans-serif", marginBottom: '24px',
                                }}>
                                    Enter your email and we&apos;ll send you a reset link.
                                </p>

                                <Input
                                    label="Email address"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={forgotEmail}
                                    onChange={setForgotEmail}
                                    autoComplete="email"
                                />

                                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <Button type="submit" variant="primary" fullWidth isLoading={forgotLoading}>
                                        Send reset link
                                    </Button>
                                    <button type="button" onClick={() => setView('login')} style={{
                                        background: 'none', border: 'none',
                                        color: 'var(--accent-primary)', fontSize: '0.875rem',
                                        fontFamily: "'Inter', sans-serif", cursor: 'pointer',
                                    }}>
                                        ← Back to login
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
