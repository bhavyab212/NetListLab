import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => { } });

export function useToast() {
    return useContext(ToastContext);
}

const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={18} color="#00E87A" />,
    error: <AlertCircle size={18} color="#F43F5E" />,
    info: <Info size={18} color="#00C8F0" />,
};

const borderColors: Record<ToastType, string> = {
    success: '#00E87A',
    error: '#F43F5E',
    info: '#00C8F0',
};

export function Toaster({ children }: { children?: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info', duration: number = 4000) => {
        const id = Date.now().toString() + Math.random().toString(36).slice(2);
        setToasts(prev => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Toast container */}
            <div
                style={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    pointerEvents: 'none',
                }}
            >
                <AnimatePresence>
                    {toasts.map(toast => (
                        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, toast.duration || 4000);
        return () => clearTimeout(timer);
    }, [toast.duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            style={{
                pointerEvents: 'auto',
                background: 'var(--bg-surface)',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '320px',
                maxWidth: '420px',
                boxShadow: '8px 8px 16px #0A0A08, -8px -8px 16px #2A2720',
                borderLeft: `3px solid ${borderColors[toast.type]}`,
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
            }}
        >
            {icons[toast.type]}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#6B6760',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                }}
            >
                <X size={16} />
            </button>
        </motion.div>
    );
}
