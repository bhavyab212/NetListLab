/**
 * Search Bar Component
 * Global search with debouncing for projects
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useFilterStore } from '../../stores/filterStore';

export default function SearchBar() {
  const { search, setSearch } = useFilterStore();
  const [inputValue, setInputValue] = useState(search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setSearch]);

  const handleClear = () => {
    setInputValue('');
    setSearch('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'relative',
        marginBottom: '32px',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Search
          size={20}
          style={{
            position: 'absolute',
            left: '16px',
            color: '#94A3B8',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Search projects by title, tags, or keywords..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px 12px 44px',
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            color: '#F8FAFC',
            fontSize: '1rem',
            fontFamily: 'inherit',
            backdropFilter: 'blur(10px)',
            transition: 'all 150ms ease',
            outline: 'none',
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'rgba(0, 200, 240, 0.4)';
            (e.target as HTMLInputElement).style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
            (e.target as HTMLInputElement).style.backgroundColor = 'rgba(30, 41, 59, 0.5)';
          }}
        />

        {/* Clear button */}
        {inputValue && (
          <motion.button
            onClick={handleClear}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              right: '12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 150ms ease',
            }}
            whileHover={{ color: '#F8FAFC' }}
          >
            <X size={20} />
          </motion.button>
        )}
      </div>

      {/* Search hint */}
      {!inputValue && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px',
            paddingLeft: '16px',
            fontSize: '0.875rem',
            color: '#94A3B8',
          }}
        >
          <span>Try searching:</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['ESP32', 'React', 'Arduino'].map((tag) => (
              <button
                key={tag}
                onClick={() => setInputValue(tag)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: 'transparent',
                  color: '#00C8F0',
                  border: '1px solid rgba(0, 200, 240, 0.3)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 200, 240, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
