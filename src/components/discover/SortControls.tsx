/**
 * Sort Controls Component
 * Dropdown for sorting projects by different criteria
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useFilterStore } from '../../stores/filterStore';
import { SortOption } from '../../types/project';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'trending', label: 'Trending' },
  { value: 'latest', label: 'Latest' },
  { value: 'most-starred', label: 'Most Starred' },
  { value: 'most-viewed', label: 'Most Viewed' },
];

export default function SortControls() {
  const [isOpen, setIsOpen] = useState(false);
  const { sort, setSort } = useFilterStore();

  const currentLabel = sortOptions.find(o => o.value === sort)?.label || 'Trending';

  const handleSort = (value: SortOption) => {
    setSort(value);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          color: '#F8FAFC',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 150ms ease',
          backdropFilter: 'blur(10px)',
        }}
        whileHover={{
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          boxShadow: '0 0 20px rgba(0, 200, 240, 0.15)',
        }}
      >
        {currentLabel}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: 'rgba(21, 28, 38, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
              zIndex: 50,
              minWidth: '180px',
              boxShadow: '0 10px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            {sortOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleSort(option.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: sort === option.value ? 'rgba(0, 200, 240, 0.1)' : 'transparent',
                  border: 'none',
                  color: sort === option.value ? '#00C8F0' : '#94A3B8',
                  fontSize: '0.875rem',
                  fontWeight: sort === option.value ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 150ms ease',
                  borderLeft: sort === option.value ? '2px solid #00C8F0' : '2px solid transparent',
                }}
                whileHover={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#F8FAFC',
                }}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
