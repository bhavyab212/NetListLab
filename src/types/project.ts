/**
 * Project and related types for NetListLab Tier 2 Architecture
 * Aligned with database schema and API contracts
 */

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type DomainType = 'electronics' | 'software' | 'mechanical' | 'design' | 'aiml' | 'robotics' | 'research';
export type SortOption = 'trending' | 'latest' | 'most-starred' | 'most-viewed';

export interface User {
  id: string;
  username: string;
  avatar: string;
  isFollowedByMe: boolean;
}

export interface ProjectStats {
  stars: number;
  views: number;
  comments: number;
  isStarredByMe: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  coverImage: string;
  author: User;
  domain: DomainType;
  difficulty: DifficultyLevel;
  tags: string[];
  stats: ProjectStats;
  publishedAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  success: boolean;
  data: {
    projects: Project[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      hasMore: boolean;
      totalPages: number;
    };
    facets: {
      domains: { name: string; count: number; emoji: string }[];
      difficulties: { name: DifficultyLevel; count: number }[];
      topTags: { name: string; count: number }[];
    };
  };
  meta: {
    executionTime: number;
  };
}

export interface FilterState {
  domains: DomainType[];
  difficulty: DifficultyLevel | null;
  tags: string[];
  sort: SortOption;
  search: string;
  page: number;
}
