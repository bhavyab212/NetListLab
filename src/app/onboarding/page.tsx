"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowLeft, Sun, Moon, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { domains } from '@/mockData/domains';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/CustomInput';
import ProgressBar from '@/components/ui/ProgressBar';
import PillToggle from '@/components/ui/PillToggle';
import TagInput from '@/components/ui/TagInput';
import CircuitBackground from '@/components/ui/CircuitBackground';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LiquidCursor from '@/components/ui/LiquidCursor';
import { toast } from 'sonner';

const ROLES = ['Student', 'Engineer', 'Researcher', 'Freelancer', 'Other'];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 200 : -200,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -200 : 200,
        opacity: 0,
    }),
};

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);

    const [avatar, setAvatar] = useState<string | null>(null);
    const [bio, setBio] = useState('');
    const [role, setRole] = useState('');
    const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [institution, setInstitution] = useState('');

    const { updateProfile } = useAuthStore();
    const { isDark } = useThemeStore();
    const router = useRouter();

    const goNext = useCallback(() => {
        setDirection(1);
        setStep(prev => Math.min(prev + 1, 4));
    }, []);

    const goBack = useCallback(() => {
        setDirection(-1);
        setStep(prev => Math.max(prev - 1, 1));
    }, []);

    const handleSkip = useCallback(() => {
        if (step < 4) {
            goNext();
        } else {
            toast.info('You can complete your profile anytime in Settings');
            router.push('/explore');
        }
    }, [step, goNext, router]);

    const handleFinish = useCallback(() => {
        updateProfile({
            bio,
            role: (role.toLowerCase() as any) || 'other',
            domains: selectedDomains.map((id: string) => {
                const d = domains.find(dom => dom.id === id);
                return d?.name || id;
            }),
            skills: selectedSkills,
            institution,
        });
        toast.success('Welcome to NetListLab! 🚀', { description: 'Profile setup complete.' });
        router.push('/explore');
    }, [bio, role, selectedDomains, selectedSkills, institution, updateProfile, router]);

    const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Upload failed', { description: 'Try a smaller image (max 5MB)' });
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setAvatar(reader.result as string);
        reader.readAsDataURL(file);
    }, []);

    const toggleDomain = useCallback((domainId: string) => {
        setSelectedDomains(prev =>
            prev.includes(domainId)
                ? prev.filter(d => d !== domainId)
                : [...prev, domainId]
        );
    }, []);

    const cardStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '640px',
        borderRadius: '24px',
        padding: '32px',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        transition: 'background 350ms ease, box-shadow 350ms ease, border-color 350ms ease',
    };

    return (
        <div className={isDark ? "dark" : ""} style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'var(--bg-base)',
            position: 'relative',
            transition: 'background 350ms ease, color 350ms ease',
        }}>
            <CircuitBackground />
            <LiquidCursor />

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
                    maxWidth: '640px',
                }}
            >
                <Logo size="lg" />

                <div className="glass-panel" style={cardStyle} data-liquid-cursor>
                    <ProgressBar totalSteps={4} currentStep={step} />

                    <div style={{ marginTop: '24px', minHeight: '340px' }}>
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={step}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                    duration: 0.3,
                                }}
                            >
                                {step === 1 && (
                                    <Step1
                                        avatar={avatar}
                                        bio={bio}
                                        role={role}
                                        onAvatarUpload={handleAvatarUpload}
                                        onAvatarSelect={setAvatar}
                                        onBioChange={setBio}
                                        onRoleChange={setRole}
                                    />
                                )}
                                {step === 2 && (
                                    <Step2
                                        selectedDomains={selectedDomains}
                                        selectedSkills={selectedSkills}
                                        onToggleDomain={toggleDomain}
                                        onSkillsChange={setSelectedSkills}
                                    />
                                )}
                                {step === 3 && (
                                    <Step3
                                        institution={institution}
                                        onInstitutionChange={setInstitution}
                                        bio={bio}
                                        role={role}
                                        selectedDomains={selectedDomains}
                                        selectedSkills={selectedSkills}
                                    />
                                )}
                                {step === 4 && (
                                    <Step4 />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '32px',
                    }}>
                        <div>
                            {step > 1 && (
                                <Button type="button" variant="ghost" onClick={goBack}>
                                    <ArrowLeft size={16} /> Back
                                </Button>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <button
                                type="button"
                                onClick={handleSkip}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.875rem',
                                    fontFamily: "'Inter', sans-serif",
                                    cursor: 'pointer',
                                    transition: 'color 150ms ease',
                                }}
                            >
                                Skip for now
                            </button>

                            {step < 4 ? (
                                <Button type="button" variant="primary" onClick={goNext}>
                                    Continue →
                                </Button>
                            ) : (
                                <Button type="button" variant="primary" onClick={handleFinish}>
                                    Launch My Workshop 🚀
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

const presetAvatars = [
    // Tech / Cyberpunk Humans
    ...Array.from({ length: 12 }).map((_, i) => `https://api.dicebear.com/9.x/micah/svg?seed=Builder${i}x&backgroundColor=transparent`),
    // Hardware / Robots
    ...Array.from({ length: 12 }).map((_, i) => `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Mech${i}x&backgroundColor=transparent`),
    // Pixel Art Hackers
    ...Array.from({ length: 12 }).map((_, i) => `https://api.dicebear.com/9.x/pixel-art/svg?seed=Code${i}x&backgroundColor=transparent`),
    // Anime / Adventurers
    ...Array.from({ length: 12 }).map((_, i) => `https://api.dicebear.com/9.x/adventurer/svg?seed=Hero${i}x&backgroundColor=transparent`),
    // Minimalist Avatars
    ...Array.from({ length: 12 }).map((_, i) => `https://api.dicebear.com/9.x/notionists/svg?seed=Dev${i}x&backgroundColor=transparent`),
];

function Step1({ avatar, bio, role, onAvatarUpload, onAvatarSelect, onBioChange, onRoleChange }: any) {
    return (
        <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Tell us about yourself
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                This helps other builders find you
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>Profile photo</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <label className="group relative" style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'var(--bg-base)', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0, transition: 'all 0.2s ease' }}>
                            {avatar && !presetAvatars.includes(avatar) ? (
                                <img src={avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                                    <Upload size={20} className="group-hover:text-primary transition-colors" />
                                    <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upload</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={onAvatarUpload} style={{ display: 'none' }} />
                        </label>

                        <div style={{ flex: 1, overflowX: 'auto', display: 'flex', gap: '12px', paddingBottom: '8px', scrollbarWidth: 'thin' }} className="pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                            {presetAvatars.map((url, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => onAvatarSelect(url)}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '12px',
                                        flexShrink: 0,
                                        border: avatar === url ? '2px solid var(--primary)' : '2px solid transparent',
                                        background: avatar === url ? 'var(--primary-glow)' : 'var(--bg-base)',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    className="hover:scale-105 hover:border-primary/50"
                                >
                                    <img src={url} alt={`Preset ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Upload your own (max 5MB) or choose a character</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Short bio</label>
                    <textarea
                        value={bio}
                        onChange={e => e.target.value.length <= 200 && onBioChange(e.target.value)}
                        placeholder="What do you build?"
                        maxLength={200}
                        rows={3}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid transparent', background: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif", boxShadow: 'var(--shadow-neu-inset)', outline: 'none', resize: 'none' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'right' }}>{bio.length}/200</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>What best describes you?</label>
                    <PillToggle options={ROLES} selected={role} onChange={onRoleChange} />
                </div>
            </div>
        </div>
    );
}

function Step2({ selectedDomains, selectedSkills, onToggleDomain, onSkillsChange }: any) {
    return (
        <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                What do you build?
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Select your fields and skills
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '12px', display: 'block' }}>Fields of work</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {domains.map(domain => {
                            const isSelected = selectedDomains.includes(domain.id);
                            return (
                                <motion.button
                                    key={domain.id}
                                    type="button"
                                    onClick={() => onToggleDomain(domain.id)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 12px', borderRadius: '12px', background: 'var(--bg-base)', border: `1.5px solid ${isSelected ? domain.color : 'var(--border-default)'}`, boxShadow: isSelected ? `var(--shadow-neu-raised), 0 0 20px ${domain.glow}` : 'var(--shadow-neu-raised)', cursor: 'pointer' }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>{domain.emoji}</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 500, color: isSelected ? domain.color : 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}>{domain.name}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Skill tags</label>
                    <TagInput selectedTags={selectedSkills} onChange={onSkillsChange} maxTags={15} placeholder="Type to search skills..." />
                </div>
            </div>
        </div>
    );
}

function Step3({ institution, onInstitutionChange, bio, role, selectedDomains, selectedSkills }: any) {
    return (
        <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Almost there
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Review your profile
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Input label="Where do you work or study?" placeholder="MIT, Google, IIT Delhi..." value={institution} onChange={onInstitutionChange} />
                <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--bg-base)', boxShadow: 'var(--shadow-neu-inset)' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', fontFamily: "'Space Grotesk', sans-serif" }}>Profile summary</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {role && <SummaryRow label="Role" value={role} />}
                        {bio && <SummaryRow label="Bio" value={bio.length > 80 ? bio.slice(0, 80) + '...' : bio} />}
                        {selectedDomains.length > 0 && (
                            <SummaryRow label="Fields" value={selectedDomains.map((id: any) => domains.find(dom => dom.id === id)?.name).join(', ')} />
                        )}
                        {selectedSkills.length > 0 && (
                            <SummaryRow label="Skills" value={selectedSkills.slice(0, 5).join(', ')} />
                        )}
                        {institution && <SummaryRow label="Institution" value={institution} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, minWidth: '70px', fontFamily: "'Inter', sans-serif" }}>{label}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>{value}</span>
        </div>
    );
}

function Step4() {
    const { isDark, setTheme } = useThemeStore();

    return (
        <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Select Your Theme
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Personalize your workspace experience
            </p>

            <div className="grid grid-cols-2 gap-6">
                {/* Light Mode Option */}
                <button
                    onClick={() => setTheme('light')}
                    style={{
                        padding: '16px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '24px',
                        transition: 'all 0.3s ease',
                    }}
                    className="group"
                >
                    <div style={{
                        width: '100%',
                        aspectRatio: '16/10',
                        background: '#f8f9fa',
                        border: !isDark ? '2px solid var(--primary)' : '2px solid rgba(0,0,0,0.1)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.05)',
                        transition: 'border 0.3s ease, transform 0.3s ease',
                    }}
                        className="group-hover:scale-[1.02]"
                    >
                        {/* Mini Dashboard Wireframe - Light Mode */}
                        <div style={{ display: 'flex', height: '100%' }}>
                            {/* Sidebar */}
                            <div style={{ width: '25%', height: '100%', background: '#ffffff', borderRight: '1px solid #e9ecef', padding: '12px 8px' }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--primary)', marginBottom: '16px' }}></div>
                                <div style={{ width: '80%', height: '6px', borderRadius: '4px', background: '#e9ecef', marginBottom: '8px' }}></div>
                                <div style={{ width: '70%', height: '6px', borderRadius: '4px', background: '#e9ecef', marginBottom: '8px' }}></div>
                                <div style={{ width: '85%', height: '6px', borderRadius: '4px', background: '#e9ecef' }}></div>
                            </div>
                            {/* Main Content */}
                            <div style={{ flex: 1, padding: '12px' }}>
                                {/* Nav */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div style={{ width: '40%', height: '8px', borderRadius: '4px', background: '#e9ecef' }}></div>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#dee2e6' }}></div>
                                </div>
                                {/* Cards */}
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <div style={{ flex: 1, height: '40px', background: '#ffffff', border: '1px solid #e9ecef', borderRadius: '8px' }}></div>
                                    <div style={{ flex: 1, height: '40px', background: '#ffffff', border: '1px solid #e9ecef', borderRadius: '8px' }}></div>
                                </div>
                                <div style={{ width: '100%', height: '50px', background: '#ffffff', border: '1px solid #e9ecef', borderRadius: '8px' }}></div>
                            </div>
                        </div>
                        {/* "Screenshot" label overlay */}
                        <div style={{ position: 'absolute', bottom: '8px', left: '8px', padding: '4px 8px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', borderRadius: '12px', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#495057' }}>Light</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: !isDark ? 'var(--primary)' : 'transparent' }}>
                            {!isDark && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}><Sun size={14} className="inline mr-1" /> Light Mode</span>
                    </div>
                </button>

                {/* Dark Mode Option */}
                <button
                    onClick={() => setTheme('dark')}
                    style={{
                        padding: '16px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '24px',
                        transition: 'all 0.3s ease',
                    }}
                    className="group"
                >
                    <div style={{
                        width: '100%',
                        aspectRatio: '16/10',
                        background: '#0a0a0b',
                        border: isDark ? '2px solid var(--primary)' : '2px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.02), 0 8px 24px rgba(0,0,0,0.5)',
                        transition: 'border 0.3s ease, transform 0.3s ease',
                    }}
                        className="group-hover:scale-[1.02]"
                    >
                        {/* Mini Dashboard Wireframe - Dark Mode */}
                        <div style={{ display: 'flex', height: '100%' }}>
                            {/* Sidebar */}
                            <div style={{ width: '25%', height: '100%', background: '#121214', borderRight: '1px solid #1c1c1f', padding: '12px 8px' }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--primary)', marginBottom: '16px' }}></div>
                                <div style={{ width: '80%', height: '6px', borderRadius: '4px', background: '#27272a', marginBottom: '8px' }}></div>
                                <div style={{ width: '70%', height: '6px', borderRadius: '4px', background: '#27272a', marginBottom: '8px' }}></div>
                                <div style={{ width: '85%', height: '6px', borderRadius: '4px', background: '#27272a' }}></div>
                            </div>
                            {/* Main Content */}
                            <div style={{ flex: 1, padding: '12px' }}>
                                {/* Nav */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div style={{ width: '40%', height: '8px', borderRadius: '4px', background: '#27272a' }}></div>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#3f3f46' }}></div>
                                </div>
                                {/* Cards */}
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <div style={{ flex: 1, height: '40px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}></div>
                                    <div style={{ flex: 1, height: '40px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}></div>
                                </div>
                                <div style={{ width: '100%', height: '50px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}></div>
                            </div>
                        </div>
                        {/* "Screenshot" label overlay */}
                        <div style={{ position: 'absolute', bottom: '8px', left: '8px', padding: '4px 8px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', borderRadius: '12px', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa' }}>Dark</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'var(--primary)' : 'transparent' }}>
                            {isDark && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#000' }} />}
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}><Moon size={14} className="inline mr-1" /> Dark Mode</span>
                    </div>
                </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '24px' }}>Click to instantly preview in real-time</p>
        </div>
    );
}
