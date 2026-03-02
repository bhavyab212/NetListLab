"use client" ; 

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { filterSkills } from '../../mockData/skills';

interface TagInputProps {
    selectedTags: string[];
    onChange: (tags: string[]) => void;
    maxTags?: number;
    placeholder?: string;
}

export default function TagInput({
    selectedTags,
    onChange,
    maxTags = 15,
    placeholder = 'Type to search skills...',
}: TagInputProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSuggestions(filterSkills(query, selectedTags));
        }, 300);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [query, selectedTags]);

    const addTag = (tag: string) => {
        if (selectedTags.length < maxTags && !selectedTags.includes(tag)) {
            onChange([...selectedTags, tag]);
        }
        setQuery('');
        setSuggestions([]);
        inputRef.current?.focus();
    };

    const removeTag = (tag: string) => {
        onChange(selectedTags.filter(t => t !== tag));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {selectedTags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <AnimatePresence>
                        {selectedTags.map(tag => (
                            <motion.span
                                key={tag}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '4px 12px',
                                    borderRadius: '9999px',
                                    background: 'rgba(0,200,240,0.12)',
                                    color: 'var(--accent-primary)',
                                    fontSize: '0.8rem',
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 500,
                                }}
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--accent-primary)',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex',
                                        opacity: 0.7,
                                    }}
                                >
                                    <X size={13} />
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <div style={{ position: 'relative' }}>
                <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 200)}
                    placeholder={selectedTags.length >= maxTags ? `Max ${maxTags} tags` : placeholder}
                    disabled={selectedTags.length >= maxTags}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: `1px solid ${focused ? 'var(--accent-primary)' : 'transparent'}`,
                        background: 'var(--bg-base)',
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem',
                        fontFamily: "'Inter', sans-serif",
                        boxShadow: focused
                            ? 'var(--shadow-neu-inset), 0 0 12px var(--glow-cyan)'
                            : 'var(--shadow-neu-inset)',
                        outline: 'none',
                        transition: 'all 150ms ease',
                    }}
                />

                <AnimatePresence>
                    {focused && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                marginTop: '4px',
                                background: 'var(--bg-elevated)',
                                borderRadius: '8px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                                border: '1px solid var(--border-default)',
                                zIndex: 50,
                                overflow: 'hidden',
                            }}
                        >
                            {suggestions.map(skill => (
                                <button
                                    key={skill}
                                    type="button"
                                    onMouseDown={e => { e.preventDefault(); addTag(skill); }}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        padding: '10px 16px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.875rem',
                                        fontFamily: "'Inter', sans-serif",
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'background 100ms ease',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,200,240,0.08)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    {skill}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif" }}>
                {selectedTags.length}/{maxTags} tags
            </span>
        </div>
    );
}
