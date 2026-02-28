/**
 * Explore Page
 * Main discovery interface for browsing and filtering projects
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFilterStore } from '../../stores/filterStore';
import { getMockProjects } from '../../mockData/projects';
import SearchBar from '../../components/discover/SearchBar';
import FilterPanel from '../../components/discover/FilterPanel';
import SortControls from '../../components/discover/SortControls';
import ProjectsGrid from '../../components/discover/ProjectsGrid';
import FeaturedCarousel from '../../components/discover/FeaturedCarousel';
import Header from '../../components/layout/Header';

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const {
    domains,
    difficulty,
    tags,
    sort,
    search,
    page,
    setPage,
  } = useFilterStore();

  // Fetch projects with current filters
  const projectsData = getMockProjects({
    domains: domains as string[],
    difficulty: difficulty || undefined,
    tags,
    sort,
    search,
    page,
    limit: 12,
  });

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [domains, difficulty, tags, sort, search, page]);

  const handleLoadMore = () => {
    setPage(page + 1);
    // Scroll to projects section
    document.querySelector('[data-explore-projects]')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStar = (projectId: string) => {
    // TODO: Implement star functionality with API call
    console.log('Starred project:', projectId);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#020617',
      }}
    >
      <Header currentPage="explore" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          flex: 1,
          width: '100%',
        }}
      >
      {/* Page Container */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '40px 20px',
        }}
      >
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            marginBottom: '40px',
          }}
        >
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              color: '#F8FAFC',
              margin: '0 0 8px 0',
              lineHeight: 1.2,
            }}
          >
            Explore Projects
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: '#94A3B8',
              margin: 0,
              maxWidth: '600px',
            }}
          >
            Discover amazing projects from our community. Filter by domain, difficulty, and tags to find projects that match your interests.
          </p>
        </motion.div>

        {/* Featured Carousel */}
        {projectsData.data.projects.length > 0 && (
          <FeaturedCarousel projects={projectsData.data.projects} />
        )}

        {/* Search Bar */}
        <SearchBar />

        {/* Controls Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#F8FAFC',
                margin: 0,
              }}
            >
              {projectsData.data.pagination.total} Projects
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#94A3B8',
                margin: '4px 0 0 0',
              }}
            >
              Page {projectsData.data.pagination.page} of {projectsData.data.pagination.totalPages}
            </p>
          </div>
          <SortControls />
        </motion.div>

        {/* Main Content Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '32px',
            alignItems: 'flex-start',
          }}
        >
          {/* Filter Sidebar */}
          {isFilterPanelOpen && (
            <FilterPanel
              facets={projectsData.data.facets}
              onClose={() => setIsFilterPanelOpen(false)}
            />
          )}

          {/* Projects Grid */}
          <div data-explore-projects>
            <ProjectsGrid
              data={projectsData}
              isLoading={isLoading}
              onLoadMore={handleLoadMore}
              onStar={handleStar}
            />
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div
          style={{
            display: 'none',
            '@media (max-width: 1024px)': {
              display: 'block',
            },
          }}
        >
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              padding: '12px 16px',
              backgroundColor: '#00C8F0',
              color: '#020617',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              zIndex: 40,
              boxShadow: '0 8px 24px rgba(0, 200, 240, 0.3)',
            }}
          >
            {isFilterPanelOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          [style*="grid-template-columns: 280px"] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          [style*="fontSize: 2.25rem"] {
            font-size: 1.75rem !important;
          }
        }
      `}</style>
      </motion.div>
    </div>
  );
}
