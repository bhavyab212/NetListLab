"use client";

import { motion } from 'framer-motion';

export default function LiquidBlob() {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.20,  // 20% — subtle but visible
            }}
        >
            <motion.div
                animate={{
                    borderRadius: [
                        '60% 40% 30% 70% / 60% 30% 70% 40%',
                        '30% 60% 70% 40% / 50% 60% 30% 60%',
                        '60% 40% 30% 70% / 60% 30% 70% 40%',
                    ],
                }}
                transition={{ duration: 12, ease: 'linear', repeat: Infinity }}
                style={{
                    position: 'absolute',
                    top: '15%',
                    left: '20%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(0,200,240,0.9) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />
            <motion.div
                animate={{
                    borderRadius: [
                        '30% 60% 70% 40% / 50% 60% 30% 60%',
                        '60% 40% 30% 70% / 60% 30% 70% 40%',
                        '30% 60% 70% 40% / 50% 60% 30% 60%',
                    ],
                }}
                transition={{ duration: 15, ease: 'linear', repeat: Infinity }}
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '15%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(59,110,240,0.8) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />
        </div>
    );
}
