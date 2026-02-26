import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../components/ui/Toast';
import { checkUsernameAvailability } from '../../mockData/auth';
import Logo from '../../components/ui/Logo';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Divider from '../../components/ui/Divider';
import CircuitBackground from '../../components/ui/CircuitBackground';
import ThemeToggle from '../../components/ui/ThemeToggle';
import LiquidCursor from '../../components/ui/LiquidCursor';

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

function getPasswordStrength(password: string): { level: number; color: string; label: string } {
    if (password.length < 6) return { level: 1, color: 'var(--accent-coral)', label: 'Weak' };
    if (password.length < 8) return { level: 2, color: 'var(--accent-gold)', label: 'Fair' };
    const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    if (hasMixedCase && hasNumbers) return { level: 3, color: 'var(--accent-green)', label: 'Strong' };
    return { level: 2, color: 'var(--accent-gold)', label: 'Fair' };
}

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [fullNameError, setFullNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [shake, setShake] = useState(false);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { register, isLoading } = useAuthStore();
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!username.trim() || username.length < 3) {
            setUsernameAvailable(null);
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setCheckingUsername(true);
        debounceRef.current = setTimeout(async () => {
            const available = await checkUsernameAvailability(username);
            setUsernameAvailable(available);
            setCheckingUsername(false);
            if (!available) setUsernameError('This username is taken');
            else setUsernameError('');
        }, 500);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [username]);

    const passwordStrength = getPasswordStrength(password);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        let hasError = false;

        if (!fullName.trim()) { setFullNameError('This field is required'); hasError = true; }
        else setFullNameError('');

        if (!username.trim()) { setUsernameError('This field is required'); hasError = true; }
        else if (usernameAvailable === false) { hasError = true; }
        else setUsernameError('');

        if (!email.trim()) { setEmailError('This field is required'); hasError = true; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Enter a valid email address'); hasError = true; }
        else setEmailError('');

        if (!password.trim()) { setPasswordError('This field is required'); hasError = true; }
        else if (password.length < 8) { setPasswordError('Password must be at least 8 characters'); hasError = true; }
        else setPasswordError('');

        if (hasError) return;

        const success = await register({ fullName, username, email, password });
        if (success) {
            navigate('/onboarding');
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            addToast('Registration failed. Please try again.', 'error');
        }
    }, [fullName, username, email, password, usernameAvailable, register, navigate, addToast]);

    return (
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
            <CircuitBackground />
            <LiquidCursor />

            {/* Theme toggle — top right */}
            <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 100 }}>
                <ThemeToggle />
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
                    style={{
                        width: '100%',
                        background: 'var(--bg-surface)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: 'var(--shadow-neu-raised)',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'background 350ms ease, box-shadow 350ms ease, border-color 350ms ease',
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
                            Create your workshop
                        </h2>
                        <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: '24px',
                        }}>
                            Join the builder community
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Input label="Full name" placeholder="Ada Lovelace"
                                value={fullName} onChange={setFullName} error={fullNameError} autoComplete="name" />

                            <Input
                                label="Username"
                                placeholder="ada-lovelace"
                                value={username}
                                onChange={setUsername}
                                error={usernameError}
                                autoComplete="username"
                                rightElement={
                                    username.length >= 3 ? (
                                        checkingUsername ? (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>...</span>
                                        ) : usernameAvailable === true ? (
                                            <Check size={16} color="var(--accent-green)" />
                                        ) : usernameAvailable === false ? (
                                            <X size={16} color="var(--accent-coral)" />
                                        ) : null
                                    ) : null
                                }
                            />

                            <Input label="Email address" type="email" placeholder="you@example.com"
                                value={email} onChange={setEmail} error={emailError} autoComplete="email" />

                            <div>
                                <Input label="Password" type="password" placeholder="••••••••"
                                    value={password} onChange={setPassword} error={passwordError} autoComplete="new-password" />
                                {password.length > 0 && (
                                    <div style={{ marginTop: '8px' }}>
                                        <div style={{
                                            height: '4px',
                                            borderRadius: '9999px',
                                            background: 'var(--border-default)',
                                            overflow: 'hidden',
                                        }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(passwordStrength.level / 3) * 100}%` }}
                                                transition={{ duration: 0.3 }}
                                                style={{ height: '100%', borderRadius: '9999px', background: passwordStrength.color }}
                                            />
                                        </div>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            color: passwordStrength.color,
                                            fontFamily: "'Inter', sans-serif",
                                            marginTop: '2px',
                                            display: 'block',
                                        }}>
                                            {passwordStrength.label}
                                        </span>
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
                            <Button type="button" variant="secondary" fullWidth icon={<GoogleIcon />}
                                onClick={() => addToast('OAuth coming soon. Use email for now.', 'info')}>
                                Google
                            </Button>
                            <Button type="button" variant="secondary" fullWidth icon={<GitHubIcon />}
                                onClick={() => addToast('OAuth coming soon. Use email for now.', 'info')}>
                                GitHub
                            </Button>
                        </div>

                        <p style={{
                            textAlign: 'center',
                            marginTop: '20px',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            fontFamily: "'Inter', sans-serif",
                            lineHeight: 1.5,
                        }}>
                            By signing up, you agree to our{' '}
                            <span style={{ color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>Terms</span>{' '}
                            and{' '}
                            <span style={{ color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span>
                        </p>

                        <p style={{
                            textAlign: 'center',
                            marginTop: '16px',
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                            fontFamily: "'Inter', sans-serif",
                        }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
                                Sign in
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
}
