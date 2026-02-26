import { motion } from 'framer-motion';

interface PillToggleProps {
    options: string[];
    selected: string;
    onChange: (value: string) => void;
}

export default function PillToggle({ options, selected, onChange }: PillToggleProps) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {options.map(option => {
                const isActive = option === selected;
                return (
                    <motion.button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '9999px',
                            border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                            background: isActive ? 'rgba(0,200,240,0.12)' : 'transparent',
                            color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            fontFamily: "'Inter', sans-serif",
                            cursor: 'pointer',
                            transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
                            boxShadow: isActive
                                ? '0 0 12px rgba(0,200,240,0.15)'
                                : 'none',
                        }}
                    >
                        {option}
                    </motion.button>
                );
            })}
        </div>
    );
}
