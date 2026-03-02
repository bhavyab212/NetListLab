"use client";

import { motion } from 'framer-motion';

interface ProgressBarProps {
    totalSteps: number;
    currentStep: number; // 1-indexed
}

export default function ProgressBar({ totalSteps, currentStep }: ProgressBarProps) {
    return (
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            {Array.from({ length: totalSteps }, (_, i) => {
                const stepNum = i + 1;
                const isActive = stepNum <= currentStep;

                return (
                    <motion.div
                        key={i}
                        style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: '9999px',
                            background: isActive ? '#00C8F0' : '#2A2720',
                            overflow: 'hidden',
                        }}
                        initial={false}
                        animate={{
                            background: isActive ? '#00C8F0' : '#2A2720',
                        }}
                        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                    />
                );
            })}
        </div>
    );
}
