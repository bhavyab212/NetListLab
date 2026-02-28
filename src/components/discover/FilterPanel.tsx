/**
 * Filter Panel Component
 * Left sidebar with domain, difficulty, and tag filters
 */

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useFilterStore } from '../../stores/filterStore';
import { domains } from '../../mockData/domains';
import { DifficultyLevel, DomainType } from '../../types/project';

interface FilterPanelProps {
  onClose?: () => void;
  facets: {
    domains: { name: string; count: number; emoji: string }[];
    difficulties: { name: DifficultyLevel; count: number }[];
    topTags: { name: string; count: number }[];
  };
}

export default function FilterPanel({
  onClose,
  facets,
}: FilterPanelProps) {
  const {
    domains: selectedDomains,
    difficulty: selectedDifficulty,
    tags: selectedTags,
    toggleDomain,
    setDifficulty,
    toggleTag,
    clearFilters,
  } = useFilterStore();

  const hasActiveFilters = selectedDomains.length > 0 || selectedDifficulty || selectedTags.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '20px',
        height: 'fit-content',
        position: 'sticky',
        top: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <h2
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#F8FAFC',
            margin: 0,
          }}
        >
          Filters
        </h2>
        {onClose && (
          <motion.button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            whileHover={{ color: '#F8FAFC' }}
          >
            <X size={20} />
          </motion.button>
        )}
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <motion.button
          onClick={clearFilters}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '16px',
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            color: '#F43F5E',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          whileHover={{
            backgroundColor: 'rgba(244, 63, 94, 0.2)',
          }}
        >
          Clear All Filters
        </motion.button>
      )}

      {/* Domains Section */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#94A3B8',
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Domains
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {facets.domains.map((domain) => {
            const domainId = domain.name.toLowerCase().replace(/\//g, '').replace(/\s/g, '') as DomainType;
            const isSelected = selectedDomains.includes(domainId);

            return (
              <motion.label
                key={domainId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 150ms ease',
                  backgroundColor: isSelected ? 'rgba(0, 200, 240, 0.1)' : 'transparent',
                }}
                whileHover={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleDomain(domainId)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#00C8F0',
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: '0.875rem',
                    color: isSelected ? '#00C8F0' : '#94A3B8',
                  }}
                >
                  {domain.emoji} {domain.name}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#475569',
                  }}
                >
                  {domain.count}
                </span>
              </motion.label>
            );
          })}
        </div>
      </div>

      {/* Difficulty Section */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#94A3B8',
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Difficulty
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {facets.difficulties.map((diff) => {
            const isSelected = selectedDifficulty === diff.name;

            return (
              <motion.label
                key={diff.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 150ms ease',
                  backgroundColor: isSelected ? 'rgba(0, 200, 240, 0.1)' : 'transparent',
                }}
                whileHover={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <input
                  type="radio"
                  name="difficulty"
                  checked={isSelected}
                  onChange={() => setDifficulty(isSelected ? null : diff.name)}
                  style={{
                    cursor: 'pointer',
                    accentColor: '#00C8F0',
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: '0.875rem',
                    color: isSelected ? '#00C8F0' : '#94A3B8',
                  }}
                >
                  {diff.name}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#475569',
                  }}
                >
                  {diff.count}
                </span>
              </motion.label>
            );
          })}
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <h3
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#94A3B8',
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Popular Tags
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {facets.topTags.slice(0, 8).map((tag) => {
            const isSelected = selectedTags.includes(tag.name);

            return (
              <motion.button
                key={tag.name}
                onClick={() => toggleTag(tag.name)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: isSelected ? '#00C8F0' : 'rgba(0, 200, 240, 0.1)',
                  color: isSelected ? '#020617' : '#00C8F0',
                  border: `1px solid ${isSelected ? '#00C8F0' : 'rgba(0, 200, 240, 0.2)'}`,
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  textAlign: 'left',
                }}
                whileHover={{
                  backgroundColor: isSelected ? '#00B0D8' : 'rgba(0, 200, 240, 0.15)',
                }}
              >
                {tag.name}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
