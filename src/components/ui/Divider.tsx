interface DividerProps {
    text?: string;
}

export default function Divider({ text = 'or' }: DividerProps) {
    const lineStyle: React.CSSProperties = {
        flex: 1,
        height: '1px',
        background: 'var(--border-default)',
        transition: 'background 200ms ease',
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
        }}>
            <div style={lineStyle} />
            {text && (
                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontFamily: "'Inter', sans-serif",
                    whiteSpace: 'nowrap',
                    transition: 'color 200ms ease',
                }}>
                    {text}
                </span>
            )}
            <div style={lineStyle} />
        </div>
    );
}
