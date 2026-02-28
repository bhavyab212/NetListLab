/**
 * Projects Grid Component
 * Displays projects in a responsive 3-column grid with pagination
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Project, ProjectsResponse } from '../../types/project';
import ProjectCard from './ProjectCard';
import Button from '../ui/Button';

interface ProjectsGridProps {
  data: ProjectsResponse;
  isLoading: boolean;
  onLoadMore?: () => void;
  onStar?: (projectId: string) => void;
}

export default function ProjectsGrid({
  data,
  isLoading,
  onLoadMore,
  onStar,
}: ProjectsGridProps) {
  const [skeletonCount] = useState(12);

  // Skeleton loader card
  const SkeletonCard = () => (
    <div
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        overflow: 'hidden',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        height: '100%',
      }}
    >
      <div
        style={{
          paddingBottom: '56.25%',
          backgroundColor: '#2A2720',
        }}
      />
      <div style={{ padding: '16px' }}>
        <div
          style={{
            height: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            marginBottom: '8px',
            width: '60%',
          }}
        />
        <div
          style={{
            height: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            marginBottom: '12px',
          }}
        />
        <div
          style={{
            height: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            marginBottom: '12px',
            width: '80%',
          }}
        />
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );

  // Empty state
  if (!isLoading && data.data.projects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          gridColumn: '1 / -1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          textAlign: 'center',
          backgroundColor: 'rgba(30, 41, 59, 0.3)',
          borderRadius: '12px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            fontSize: '3rem',
            marginBottom: '16px',
          }}
        >
          🔍
        </div>
        <h3
          style={{
            fontSize: '1.375rem',
            fontWeight: 600,
            color: '#F8FAFC',
            margin: '0 0 8px 0',
          }}
        >
          No projects found
        </h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#94A3B8',
            margin: '0 0 24px 0',
            maxWidth: '400px',
          }}
        >
          Try adjusting your filters or search terms to find more projects.
        </p>
        <Button variant="secondary">Try different filters</Button>
      </motion.div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '40px',
      }}
    >
      {/* Loading skeleton cards */}
      {isLoading && Array.from({ length: skeletonCount }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}

      {/* Project cards */}
      {!isLoading && data.data.projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onStar={onStar}
        />
      ))}

      {/* Load More Button */}
      {!isLoading && data.data.pagination.hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{
            gridColumn: '1 / -1',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <Button
            onClick={onLoadMore}
            variant="primary"
            style={{
              minWidth: '200px',
            }}
          >
            Load More Projects
          </Button>
        </motion.div>
      )}

      {/* End of results */}
      {!isLoading && !data.data.pagination.hasMore && data.data.projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            gridColumn: '1 / -1',
            display: 'flex',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: '#94A3B8',
              fontSize: '0.875rem',
            }}
          >
            You've reached the end • {data.data.pagination.total} projects total
          </p>
        </motion.div>
      )}
    </div>
  );
}
