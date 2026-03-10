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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Sun, Moon, Mail } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { toast } from 'sonner';

// ── Password strength ────────────────────────────────────────────────────────
function getPasswordStrength(password: string): {
    score: 0 | 1 | 2 | 3 | 4;
    label: string;
    color: string;
} {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const capped = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
    return { score: capped, label: labels[capped], color: colors[capped] };
}

// ── Google icon ──────────────────────────────────────────────────────────────
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
);

// ── View ─────────────────────────────────────────────────────────────────────
type View = 'form' | 'verify_otp';

export default function RegisterPage() {
    const [view, setView] = useState<View>('form');

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [shake, setShake] = useState(false);

    // OTP verify
    const [otpValue, setOtpValue] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    const { registerWithOtp, sendOtp, verifyOtp, isLoading, loginWithGoogle } = useAuthStore();
    const { isDark, toggle } = useThemeStore();
    const router = useRouter();

    const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    const strength = getPasswordStrength(password);

    // ── Step 1: Submit form → create account + send OTP ──────────────────────
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!validateEmail(email)) newErrors.email = 'Enter a valid email address';
        if (!password.trim()) newErrors.password = 'Password is required';
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        const username = email.split('@')[0];
        const ok = await registerWithOtp({ fullName: name, username, email, password });

        if (ok) {
            setView('verify_otp');
            toast.success("Verification code sent!", { description: "Enter the 6-digit code from your inbox." });
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            const errorMsg = useAuthStore.getState().error;
            if (errorMsg?.includes('already exists')) {
                toast.error("Account already exists", {
                    description: "Try logging in instead.",
                    action: { label: "Sign in", onClick: () => router.push('/login') }
                });
            } else {
                toast.error("Registration failed", {
                    description: errorMsg || "Something went wrong. Please try again."
                });
            }
        }
    }, [name, email, password, registerWithOtp, router]);

    // ── Step 2: Verify OTP ────────────────────────────────────────────────────
    const handleVerify = useCallback(async () => {
        if (otpValue.length !== 6) return;
        setOtpLoading(true);
        const result = await verifyOtp(email, otpValue);
        setOtpLoading(false);
        if (result === 'authenticated' || result === 'new_user') {
            toast.success("Email verified! Welcome.", { description: "Setting up your profile." });
            router.push('/onboarding');
        } else {
            toast.error("Invalid or expired code.", { description: "Try again or resend." });
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setOtpValue('');
        }
    }, [otpValue, email, verifyOtp, router]);

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
                        }}
                        data-liquid-cursor
                    >

                        {/* ── VIEW: REGISTRATION FORM ──────────────────────── */}
                        {view === 'form' && (
                            <form onSubmit={handleSubmit}>
                                <h2 style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 600,
                                    fontSize: '1.75rem',
                                    lineHeight: 1.25,
                                    color: 'var(--text-primary)',
                                    marginBottom: '4px',
                                }}>
                                    Start Building
                                </h2>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    fontFamily: "'Inter', sans-serif",
                                    marginBottom: '24px',
                                }}>
                                    Create your professional engineering portfolio
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <Input
                                        label="Full Name"
                                        placeholder="M. Visvesvaraya"
                                        value={name}
                                        onChange={setName}
                                        error={errors.name}
                                    />
                                    <Input
                                        label="Email address"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={setEmail}
                                        error={errors.email}
                                        autoComplete="email"
                                    />
                                    <div>
                                        <Input
                                            label="Password"
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            value={password}
                                            onChange={setPassword}
                                            error={errors.password}
                                            autoComplete="new-password"
                                        />
                                        {/* Password strength meter */}
                                        {password.length > 0 && (
                                            <div style={{ marginTop: '8px' }}>
                                                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div
                                                            key={i}
                                                            style={{
                                                                flex: 1,
                                                                height: '4px',
                                                                borderRadius: '2px',
                                                                background: i <= strength.score
                                                                    ? strength.color
                                                                    : 'var(--border-subtle, rgba(156,163,175,0.2))',
                                                                transition: 'background 300ms ease',
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                {strength.label && (
                                                    <p style={{
                                                        fontSize: '0.75rem',
                                                        fontFamily: "'Inter', sans-serif",
                                                        color: strength.color,
                                                        textAlign: 'right',
                                                        margin: 0,
                                                    }}>
                                                        {strength.label}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ marginTop: '24px' }}>
                                    <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                                        Create Account →
                                    </Button>
                                </div>

                                <div style={{ margin: '20px 0' }}>
                                    <Divider text="or sign up with" />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        fullWidth
                                        icon={<GoogleIcon />}
                                        onClick={async () => { await loginWithGoogle(); }}
                                    >
                                        Continue with Google
                                    </Button>
                                </div>

                                <p style={{
                                    textAlign: 'center',
                                    marginTop: '24px',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    fontFamily: "'Inter', sans-serif",
                                }}>
                                    Already have an account?{' '}
                                    <Link href="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
                                        Sign in
                                    </Link>
                                </p>
                            </form>
                        )}

                        {/* ── VIEW: OTP VERIFICATION ───────────────────────── */}
                        {view === 'verify_otp' && (
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
                                    Verify your email
                                </h2>
                                <p style={{
                                    fontSize: '0.875rem', color: 'var(--text-secondary)',
                                    fontFamily: "'Inter', sans-serif", marginBottom: '6px', lineHeight: 1.6,
                                }}>
                                    Enter the 6-digit code sent to{' '}
                                    <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
                                </p>
                                <p style={{
                                    fontSize: '0.75rem', color: 'var(--text-secondary)',
                                    fontFamily: "'Inter', sans-serif", marginBottom: '24px',
                                }}>
                                    Your account is ready. This confirms your email.
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                                    <InputOTP
                                        maxLength={6}
                                        value={otpValue}
                                        onChange={setOtpValue}
                                        onComplete={handleVerify}
                                    >
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
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        isLoading={otpLoading}
                                        onClick={handleVerify}
                                    >
                                        Verify & Continue →
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setOtpLoading(true);
                                            const ok = await sendOtp(email);
                                            setOtpLoading(false);
                                            if (ok) toast.success("Code resent!", { description: "Check your inbox." });
                                            else toast.error("Failed to resend", { description: useAuthStore.getState().error || 'Try again.' });
                                        }}
                                        style={{
                                            background: 'none', border: 'none',
                                            color: 'var(--text-secondary)', fontSize: '0.875rem',
                                            fontFamily: "'Inter', sans-serif", cursor: 'pointer',
                                        }}
                                    >
                                        Resend code
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { setView('form'); setOtpValue(''); }}
                                        style={{
                                            background: 'none', border: 'none',
                                            color: 'var(--accent-primary)', fontSize: '0.875rem',
                                            fontFamily: "'Inter', sans-serif", cursor: 'pointer',
                                        }}
                                    >
                                        ← Back to form
                                    </button>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
