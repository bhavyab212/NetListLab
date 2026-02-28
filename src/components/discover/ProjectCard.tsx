/**
 * Project Card Component
 * Displays project info with cover image, stats, and action buttons
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Eye, MessageCircle, Share2 } from 'lucide-react';
import { Project } from '../../types/project';
import DomainBadge from './DomainBadge';

interface ProjectCardProps {
  project: Project;
  onStar?: (projectId: string) => void;
}

export default function ProjectCard({
  project,
  onStar,
}: ProjectCardProps) {
  const [isStarred, setIsStarred] = useState(project.stats.isStarredByMe);
  const [starCount, setStarCount] = useState(project.stats.stars);

  const handleStar = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsStarred(!isStarred);
    setStarCount(isStarred ? starCount - 1 : starCount + 1);
    onStar?.(project.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      whileHover={{
        y: -8,
        boxShadow: '0 20px 40px rgba(0, 200, 240, 0.2)',
      }}
    >
      {/* Cover Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          overflow: 'hidden',
          backgroundColor: '#1A1916',
        }}
      >
        <img
          src={project.coverImage}
          alt={project.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLImageElement).style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLImageElement).style.transform = 'scale(1)';
          }}
        />

        {/* Domain Badge - Top Right */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
          }}
        >
          <DomainBadge domain={project.domain} size="sm" />
        </div>

        {/* Difficulty Badge - Bottom Left */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#94A3B8',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            zIndex: 10,
          }}
        >
          {project.difficulty}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '16px',
        }}
      >
        {/* Author Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <img
            src={project.author.avatar}
            alt={project.author.username}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#2A2720',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#F8FAFC',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {project.author.username}
            </p>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#F8FAFC',
            margin: '0 0 8px 0',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.title}
        </h3>

        {/* Tagline */}
        <p
          style={{
            fontSize: '0.875rem',
            color: '#94A3B8',
            margin: '0 0 12px 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
          }}
        >
          {project.tagline}
        </p>

        {/* Tags */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            marginBottom: 'auto',
            marginTop: '8px',
          }}
        >
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                backgroundColor: 'rgba(0, 200, 240, 0.1)',
                color: '#00C8F0',
                borderRadius: '4px',
                fontWeight: 500,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats Footer */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            padding: '12px 0 0 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            marginTop: '12px',
            color: '#94A3B8',
            fontSize: '0.875rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Star size={16} fill={isStarred ? '#F5A623' : 'none'} color={isStarred ? '#F5A623' : 'currentColor'} />
            <span>{starCount}</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Eye size={16} />
            <span>{project.stats.views}</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <MessageCircle size={16} />
            <span>{project.stats.comments}</span>
          </div>

          {/* Star Button - Right Aligned */}
          <motion.button
            onClick={handleStar}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              color: isStarred ? '#F5A623' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 150ms ease',
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star size={18} fill={isStarred ? '#F5A623' : 'none'} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
