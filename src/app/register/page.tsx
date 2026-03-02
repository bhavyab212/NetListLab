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
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { toast } from 'sonner';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [shake, setShake] = useState(false);

    const { register, isLoading } = useAuthStore();
    const { isDark, toggle } = useThemeStore();
    const router = useRouter();

    const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

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

        const username = email.split('@')[0];
        const success = await register({ fullName: name, username, email, password });
        if (success) {
            toast.success("Account created!", { description: "Setting up your profile." });
            router.push('/onboarding');
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            toast.error("Registration failed", { description: "Something went wrong. Please try again." });
        }
    }, [name, email, password, register, router]);

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
                                    placeholder="John Doe"
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
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChange={setPassword}
                                    error={errors.password}
                                />
                            </div>

                            <div style={{ marginTop: '24px' }}>
                                <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                                    Create Account →
                                </Button>
                            </div>

                            <div style={{ margin: '20px 0' }}>
                                <Divider text="or sign up with" />
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Button type="button" variant="secondary" fullWidth
                                    onClick={() => toast.info('OAuth coming soon.')}>
                                    Google
                                </Button>
                                <Button type="button" variant="secondary" fullWidth
                                    onClick={() => toast.info('OAuth coming soon.')}>
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
                                Already have an account?{' '}
                                <Link href="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
