/**
 * Filter state store for Explore page
 * Manages domain, difficulty, tags, sorting, search, and pagination
 */

import { create } from 'zustand';
import { FilterState, DomainType, DifficultyLevel, SortOption } from '../types/project';

interface FilterStoreState extends FilterState {
  // Actions
  setDomains: (domains: DomainType[]) => void;
  toggleDomain: (domain: DomainType) => void;
  setDifficulty: (difficulty: DifficultyLevel | null) => void;
  setTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  setSort: (sort: SortOption) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  clearFilters: () => void;
  resetToDefaults: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  domains: [],
  difficulty: null,
  tags: [],
  sort: 'trending',
  search: '',
  page: 1,
};

export const useFilterStore = create<FilterStoreState>((set) => ({
  ...DEFAULT_FILTERS,

  setDomains: (domains) => set({ domains, page: 1 }),

  toggleDomain: (domain) =>
    set((state) => {
      const domains = state.domains.includes(domain)
        ? state.domains.filter(d => d !== domain)
        : [...state.domains, domain];
      return { domains, page: 1 };
    }),

  setDifficulty: (difficulty) => set({ difficulty, page: 1 }),

  setTags: (tags) => set({ tags, page: 1 }),

  toggleTag: (tag) =>
    set((state) => {
      const tags = state.tags.includes(tag)
        ? state.tags.filter(t => t !== tag)
        : [...state.tags, tag];
      return { tags, page: 1 };
    }),

  setSort: (sort) => set({ sort, page: 1 }),

  setSearch: (search) => set({ search, page: 1 }),

  setPage: (page) => set({ page }),

  clearFilters: () => set({ ...DEFAULT_FILTERS }),

  resetToDefaults: () => set({ ...DEFAULT_FILTERS }),
}));
