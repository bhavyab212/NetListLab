import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useToast } from '../../components/ui/Toast';
import { domains } from '../../mockData/domains';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ProgressBar from '../../components/ui/ProgressBar';
import PillToggle from '../../components/ui/PillToggle';
import TagInput from '../../components/ui/TagInput';
import CircuitBackground from '../../components/ui/CircuitBackground';
import ThemeToggle from '../../components/ui/ThemeToggle';
import LiquidCursor from '../../components/ui/LiquidCursor';

const ROLES = ['Student', 'Engineer', 'Researcher', 'Freelancer', 'Other'];

// Slide directions for step transitions
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

    // Step 1 state
    const [avatar, setAvatar] = useState<string | null>(null);
    const [bio, setBio] = useState('');
    const [role, setRole] = useState('');

    // Step 2 state
    const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    // Step 3 state
    const [institution, setInstitution] = useState('');

    const { updateProfile } = useAuthStore();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const goNext = useCallback(() => {
        setDirection(1);
        setStep(prev => Math.min(prev + 1, 3));
    }, []);

    const goBack = useCallback(() => {
        setDirection(-1);
        setStep(prev => Math.max(prev - 1, 1));
    }, []);

    const handleSkip = useCallback(() => {
        if (step < 3) {
            goNext();
        } else {
            addToast('You can complete your profile anytime in Settings', 'info');
            navigate('/login');
        }
    }, [step, goNext, addToast, navigate]);

    const handleFinish = useCallback(() => {
        updateProfile({
            bio,
            role: (role.toLowerCase() as 'student' | 'engineer' | 'researcher' | 'freelancer' | 'other') || 'other',
            fields: selectedDomains.map(id => {
                const d = domains.find(dom => dom.id === id);
                return d?.name || id;
            }),
            skills: selectedSkills,
            institution,
        });
        addToast('Welcome to NetListLab! 🚀', 'success');
        navigate('/login');
    }, [bio, role, selectedDomains, selectedSkills, institution, updateProfile, addToast, navigate]);

    const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            addToast('Upload failed. Try a smaller image (max 5MB)', 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setAvatar(reader.result as string);
        reader.readAsDataURL(file);
    }, [addToast]);

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
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--border-default)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: 'var(--shadow-neu-raised)',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        transition: 'background 350ms ease, box-shadow 350ms ease, border-color 350ms ease',
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                background: 'var(--bg-base)',
                position: 'relative',
                transition: 'background 350ms ease',
            }}
        >
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
                    maxWidth: '640px',
                }}
            >
                <Logo size="lg" />

                <div style={cardStyle} data-liquid-cursor>
                    {/* Progress bar */}
                    <ProgressBar totalSteps={3} currentStep={step} />

                    {/* Step content with slide animation */}
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
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '32px',
                        }}
                    >
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
                                    color: 'var(--text-muted)',
                                    fontSize: '0.875rem',
                                    fontFamily: "'Inter', sans-serif",
                                    cursor: 'pointer',
                                    transition: 'color 150ms ease',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                            >
                                Skip for now
                            </button>

                            {step < 3 ? (
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

/* ─── STEP 1: Tell us about yourself ─────────────────── */
function Step1({
    avatar,
    bio,
    role,
    onAvatarUpload,
    onBioChange,
    onRoleChange,
}: {
    avatar: string | null;
    bio: string;
    role: string;
    onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBioChange: (val: string) => void;
    onRoleChange: (val: string) => void;
}) {
    return (
        <div>
            <h2
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: '1.75rem',
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                }}
            >
                Tell us about yourself
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                This helps other builders find you
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Avatar upload */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <label
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '8px',
                            background: 'var(--bg-base)',
                            boxShadow: 'var(--shadow-neu-inset)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            flexShrink: 0,
                        }}
                    >
                        {avatar ? (
                            <img src={avatar} alt="Avatar preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <Upload size={24} color="var(--text-muted)" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onAvatarUpload}
                            style={{ display: 'none' }}
                        />
                    </label>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                            Profile photo
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Click to upload (max 5MB)
                        </p>
                    </div>
                </div>

                {/* Bio */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        Short bio
                    </label>
                    <textarea
                        value={bio}
                        onChange={e => {
                            if (e.target.value.length <= 200) onBioChange(e.target.value);
                        }}
                        placeholder="What do you build?"
                        maxLength={200}
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid transparent',
                            background: 'var(--bg-base)',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            fontFamily: "'Inter', sans-serif",
                            boxShadow: 'var(--shadow-neu-inset)',
                            outline: 'none',
                            resize: 'none',
                            transition: 'all 150ms ease',
                        }}
                        onFocus={e => {
                            e.currentTarget.style.borderColor = 'var(--accent-primary)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-neu-inset), 0 0 12px rgba(0,200,240,0.15)';
                        }}
                        onBlur={e => {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.boxShadow = 'var(--shadow-neu-inset)';
                        }}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                        {bio.length}/200
                    </span>
                </div>

                {/* Role */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        What best describes you?
                    </label>
                    <PillToggle options={ROLES} selected={role} onChange={onRoleChange} />
                </div>
            </div>
        </div>
    );
}

/* ─── STEP 2: What do you build? ──────────────────────── */
function Step2({
    selectedDomains,
    selectedSkills,
    onToggleDomain,
    onSkillsChange,
}: {
    selectedDomains: string[];
    selectedSkills: string[];
    onToggleDomain: (id: string) => void;
    onSkillsChange: (skills: string[]) => void;
}) {
    return (
        <div>
            <h2
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: '1.75rem',
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                }}
            >
                What do you build?
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Select your fields and skills
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Domain cards grid */}
                <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '12px', display: 'block' }}>
                        Fields of work
                    </label>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '16px',
                        }}
                    >
                        {domains.map(domain => {
                            const isSelected = selectedDomains.includes(domain.id);
                            return (
                                <motion.button
                                    key={domain.id}
                                    type="button"
                                    onClick={() => onToggleDomain(domain.id)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '16px 12px',
                                        borderRadius: '12px',
                                        background: 'var(--bg-base)',
                                        border: `1.5px solid ${isSelected ? domain.color : 'var(--border-default)'}`,
                                        boxShadow: isSelected
                                            ? `var(--shadow-neu-raised), 0 0 20px ${domain.glow}`
                                            : 'var(--shadow-neu-raised)',
                                        cursor: 'pointer',
                                        transition: 'all 200ms ease',
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>{domain.emoji}</span>
                                    <span
                                        style={{
                                            fontSize: '0.8rem',
                                            fontWeight: 500,
                                            color: isSelected ? domain.color : 'var(--text-secondary)',
                                            fontFamily: "'Inter', sans-serif",
                                        }}
                                    >
                                        {domain.name}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Skill tags */}
                <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
                        Skill tags
                    </label>
                    <TagInput
                        selectedTags={selectedSkills}
                        onChange={onSkillsChange}
                        maxTags={15}
                        placeholder="Type to search skills..."
                    />
                </div>
            </div>
        </div>
    );
}

/* ─── STEP 3: Almost there ────────────────────────────── */
function Step3({
    institution,
    onInstitutionChange,
    bio,
    role,
    selectedDomains,
    selectedSkills,
}: {
    institution: string;
    onInstitutionChange: (val: string) => void;
    bio: string;
    role: string;
    selectedDomains: string[];
    selectedSkills: string[];
}) {
    return (
        <div>
            <h2
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: '1.75rem',
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                }}
            >
                Almost there
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Review your profile
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <Input
                    label="Where do you work or study?"
                    placeholder="MIT, Google, IIT Delhi..."
                    value={institution}
                    onChange={onInstitutionChange}
                />

                {/* Summary card */}
                <div
                    style={{
                        padding: '20px',
                        borderRadius: '12px',
                        background: 'var(--bg-base)',
                        boxShadow: 'var(--shadow-neu-inset)',
                    }}
                >
                    <h4
                        style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            marginBottom: '16px',
                            fontFamily: "'Space Grotesk', sans-serif",
                        }}
                    >
                        Profile summary
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {role && (
                            <SummaryRow label="Role" value={role} />
                        )}
                        {bio && (
                            <SummaryRow label="Bio" value={bio.length > 80 ? bio.slice(0, 80) + '...' : bio} />
                        )}
                        {selectedDomains.length > 0 && (
                            <SummaryRow
                                label="Fields"
                                value={selectedDomains.map(id => {
                                    const d = domains.find(dom => dom.id === id);
                                    return d ? `${d.emoji} ${d.name}` : id;
                                }).join(', ')}
                            />
                        )}
                        {selectedSkills.length > 0 && (
                            <SummaryRow
                                label="Skills"
                                value={selectedSkills.slice(0, 5).join(', ') + (selectedSkills.length > 5 ? ` +${selectedSkills.length - 5} more` : '')}
                            />
                        )}
                        {institution && (
                            <SummaryRow label="Institution" value={institution} />
                        )}
                        {!role && !bio && selectedDomains.length === 0 && selectedSkills.length === 0 && !institution && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                No info added yet — you can complete this later in Settings
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: 'flex', gap: '12px' }}>
            <span
                style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    minWidth: '70px',
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                {label}
            </span>
            <span
                style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                {value}
            </span>
        </div>
    );
}
