/**
 * Featured Carousel Component
 * Displays hand-picked featured projects in a rotating carousel
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Project } from '../../types/project';
import DomainBadge from './DomainBadge';

interface FeaturedCarouselProps {
  projects: Project[];
}

export default function FeaturedCarousel({
  projects,
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const featured = projects.slice(0, 5);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, featured.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
    setAutoPlay(false);
  };

  const currentProject = featured[currentIndex];

  return (
    <div
      style={{
        marginBottom: '48px',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#F8FAFC',
            margin: 0,
          }}
        >
          Featured Projects
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#94A3B8',
            margin: '4px 0 0 0',
          }}
        >
          Discover handpicked community favorites
        </p>
      </div>

      {/* Carousel */}
      <div
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#1A1916',
          aspectRatio: '16/9',
          maxHeight: '500px',
        }}
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${currentProject.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(2, 6, 23, 0.7) 0%, rgba(2, 6, 23, 0.5) 50%, rgba(2, 6, 23, 0) 100%)',
              }}
            />

            {/* Content */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '40px',
                color: '#F8FAFC',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <DomainBadge domain={currentProject.domain} size="md" />
              </div>

              <h3
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  margin: '0 0 12px 0',
                  lineHeight: 1.2,
                  maxWidth: '80%',
                }}
              >
                {currentProject.title}
              </h3>

              <p
                style={{
                  fontSize: '1rem',
                  color: '#E2E8F0',
                  margin: '0 0 24px 0',
                  maxWidth: '70%',
                  lineHeight: 1.6,
                }}
              >
                {currentProject.tagline}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  fontSize: '0.875rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <img
                    src={currentProject.author.avatar}
                    alt={currentProject.author.username}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                    }}
                  />
                  <span>{currentProject.author.username}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Star size={16} fill="#F5A623" color="#F5A623" />
                  <span>{currentProject.stats.stars}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.button
          onClick={goToPrevious}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#F8FAFC',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 150ms ease',
          }}
          whileHover={{
            background: 'rgba(0, 200, 240, 0.2)',
            borderColor: 'rgba(0, 200, 240, 0.5)',
          }}
        >
          <ChevronLeft size={24} />
        </motion.button>

        <motion.button
          onClick={goToNext}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#F8FAFC',
            padding: '12px',
            borderRadius: '8px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 150ms ease',
          }}
          whileHover={{
            background: 'rgba(0, 200, 240, 0.2)',
            borderColor: 'rgba(0, 200, 240, 0.5)',
          }}
        >
          <ChevronRight size={24} />
        </motion.button>

        {/* Dots */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            display: 'flex',
            gap: '8px',
          }}
        >
          {featured.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: index === currentIndex ? '#00C8F0' : 'rgba(255, 255, 255, 0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
              whileHover={{
                scale: 1.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
