/**
 * Domain definitions matching BRAND.md domain badge color map.
 */
export interface Domain {
    id: string;
    name: string;
    emoji: string;
    color: string;
    glow: string;
}

export const domains: Domain[] = [
    { id: 'electronics', name: 'Electronics', emoji: '⚡', color: '#00C8F0', glow: 'rgba(0,200,240,0.35)' },
    { id: 'software', name: 'Software', emoji: '💻', color: '#3B6EF0', glow: 'rgba(59,110,240,0.35)' },
    { id: 'mechanical', name: 'Mechanical', emoji: '⚙️', color: '#F5A623', glow: 'rgba(245,166,35,0.35)' },
    { id: 'design', name: 'Design', emoji: '🎨', color: '#F43F5E', glow: 'rgba(244,63,94,0.35)' },
    { id: 'aiml', name: 'AI/ML', emoji: '🧠', color: '#8B5CF6', glow: 'rgba(139,92,246,0.35)' },
    { id: 'robotics', name: 'Robotics', emoji: '🤖', color: '#00E87A', glow: 'rgba(0,232,122,0.35)' },
    { id: 'research', name: 'Research', emoji: '🔬', color: '#94A3B8', glow: 'rgba(148,163,184,0.25)' },
];
