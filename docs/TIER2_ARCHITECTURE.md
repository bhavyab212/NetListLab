# NetListLab — Tier 2 Architecture Documentation

**Status:** Implementation Complete (Phase 2)  
**Last Updated:** 2026-02-28  
**Version:** 2.0.0

## Overview

This document details the Tier 2 (Phase 2) architecture of NetListLab, built on top of Phase 0 infrastructure. It covers the implementation of the Explore page, filtering system, and foundational domain models.

---

## Architecture Layers

### 1. Frontend Architecture (src/)

#### Data Types & Models (src/types/)
- **project.ts** — Core project, user, and filter types
  - `Project` — Main project entity
  - `User` — Creator profiles
  - `ProjectStats` — Star/view/comment counts
  - `FilterState` — Filter UI state
  - `SortOption` — Sort enumeration

#### State Management (src/stores/)
- **filterStore.ts** — Zustand store for Explore page filters
  - Domain, difficulty, tags, sort, search, pagination
  - Actions: `setDomains`, `toggleDomain`, `setDifficulty`, `setSearch`, `setPage`, `clearFilters`
  - All filter changes reset pagination to page 1

#### Mock Data (src/mockData/)
- **projects.ts** — 16 realistic sample projects across all domains
  - `getMockProjects()` — Simulates API responses with filtering/sorting/pagination
  - Supports: domain filter, difficulty filter, tag filter, full-text search, sorting (trending/latest/starred/viewed)
  - Returns paginated results with facets for filter UI

#### Components (src/components/)

**Discover Components:**
- **DomainBadge.tsx** — Color-coded domain indicator with glow effect
- **ProjectCard.tsx** — Full project display with image, metadata, stats, star action
- **FilterPanel.tsx** — Left sidebar with domain/difficulty/tag filters
- **SortControls.tsx** — Dropdown for sorting options
- **SearchBar.tsx** — Debounced global search input
- **FeaturedCarousel.tsx** — 5-project rotating carousel with navigation
- **ProjectsGrid.tsx** — 3-column responsive grid with loading skeletons

**Layout Components:**
- **Header.tsx** — Top navigation with logo, nav links, user menu

#### Pages (src/app/)
- **explore/ExplorePage.tsx** — Main Explore page orchestrating all components
  - Combines: Featured carousel, search, filters, sort, grid, pagination
  - Responsive layout: 280px sidebar + grid main content
  - Mobile: Filter toggle button bottom-right

---

## Design System Implementation

### Color Palette (Per BRAND.md)
- **Base:** `#020617` (Deep Obsidian)
- **Surface:** `rgba(30, 41, 59, 0.5)` + 10px blur (Glassmorphic)
- **Text Primary:** `#F8FAFC`
- **Text Secondary:** `#94A3B8`
- **Accent Primary:** `#00C8F0` (Cyan)
- **Domain Colors:** Electronics (#00C8F0), Software (#3B6EF0), Mechanical (#F5A623), Design (#F43F5E), AI/ML (#8B5CF6), Robotics (#00E87A), Research (#94A3B8)

### Typography
- **Headings:** Space Grotesk, weights 500-700
- **Body:** Inter, weights 400-600
- **Size Scale:** hero (56px) → h1 (36px) → h2 (28px) → body (16px) → sm (14px) → xs (12px)

### Spacing (Base-4)
All padding/margin uses 4px multiples: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px

### Shadows
- **Raised:** `0 8px 32px rgba(0, 0, 0, 0.3)` — Cards, panels
- **Glow Effects:** Domain/accent color glows (0 0 20px rgba(...))
- **Inset:** `inset 0 0 0 1px rgba(255,255,255,0.05)` — Input focus

### Animations
- **Duration:** instant (100ms), fast (150ms), normal (250ms), smooth (400ms), slow (600ms)
- **Easing:** cubic-bezier(0.2, 0, 0, 1) for snappy UI
- **Framer Motion:** Springs for neumorphic card animations

---

## Explore Page Specification

### Layout Structure
```
┌─────────────────────────────────────────────┐
│ Header (sticky, dark glassmorphic)         │
├─────────────────────────────────────────────┤
│ Page Title + Description                    │
├─────────────────────────────────────────────┤
│ Featured Carousel (5 projects, auto-rotate) │
├─────────────────────────────────────────────┤
│ Search Bar (debounced, 300ms)              │
├─────────────────────────────────────────────┤
│ Controls: Project count + Sort Dropdown     │
├─────────────────────────────────────────────┤
│ [Filters] | [Projects Grid]                │
│ (3-col desktop, 1-col mobile)             │
├─────────────────────────────────────────────┤
│ Load More / Pagination                      │
└─────────────────────────────────────────────┘
```

### Features Implemented

**Filter Panel (Left Sidebar)**
- Domains: 7 checkboxes with counts
- Difficulty: 4 radio buttons with counts
- Popular Tags: 8 clickable tag pills
- Clear All button (visible when filters active)
- Sticky positioning (follows scroll)

**Sort Controls**
- Trending (default) — weighted score: stars 40% + views 40% + recency 20%
- Latest — publication date descending
- Most Starred — star count descending
- Most Viewed — view count descending

**Project Cards**
- 16:9 aspect ratio cover image with zoom on hover
- Domain badge (top-right) with emoji + color + glow
- Difficulty badge (bottom-left, semi-transparent)
- Author avatar + username
- Title (2 lines max) + tagline (2 lines max)
- Top 3 tags as colored pills
- Stats footer: stars, views, comments icons + counts
- Star button (toggleable, changes color to gold when starred)
- Smooth elevation on hover (8px lift, enhanced shadow)

**Featured Carousel**
- 5 featured projects in rotating carousel
- 5-second autoplay, pauses on hover
- Large hero image with overlay gradient
- Overlaid content: domain badge, title, tagline, author, star count
- Left/right navigation arrows with glow on hover
- Bottom dot indicators (clickable to jump to slide)
- Fade transitions between slides (400ms ease-smooth)

**Search Bar**
- Debounced input (300ms) for performance
- Placeholder hints + suggestion tags (ESP32, React, Arduino)
- Clear button appears when text entered
- Real-time filtering across title, tagline, tags

**Responsive Design**
- Desktop: 280px sidebar + grid main (1440px max-width)
- Tablet (1024px): Sidebar collapses, filter button appears bottom-right
- Mobile (768px): Single column, 16px padding, large touch targets
- Grid: auto-fill minmax(320px, 1fr) for flexible cards

---

## Data Flow

### Filter → Project Fetch Cycle
1. User modifies filter (domain, difficulty, tags, sort, search, page)
2. Filter store updates → component re-renders
3. `getMockProjects()` called with current filters
4. Results filtered, sorted, paginated
5. Grid displays projects + facets update
6. Scroll to projects section on filter change

### Pagination
- Default: 12 projects per page
- Has "Load More" button when `pagination.hasMore = true`
- Page resets to 1 on filter/sort change
- Infinite scroll ready (toggle in future settings)

---

## File Structure

```
src/
├── types/
│   └── project.ts                    (70 lines)
├── mockData/
│   └── projects.ts                   (550 lines)
├── stores/
│   └── filterStore.ts                (67 lines)
├── components/
│   ├── discover/
│   │   ├── DomainBadge.tsx          (71 lines)
│   │   ├── ProjectCard.tsx          (290 lines)
│   │   ├── FilterPanel.tsx          (322 lines)
│   │   ├── SortControls.tsx         (116 lines)
│   │   ├── SearchBar.tsx            (155 lines)
│   │   ├── FeaturedCarousel.tsx     (285 lines)
│   │   └── ProjectsGrid.tsx         (211 lines)
│   └── layout/
│       └── Header.tsx               (209 lines)
├── app/
│   └── explore/
│       └── ExplorePage.tsx          (238 lines)
└── lib/
    └── utils.ts                     (134 lines)

Total: ~2,700 lines of new code
```

---

## API Contract (For Future Backend)

### GET /api/projects
**Query Parameters:**
```
?domains=electronics,software
&difficulty=advanced
&tags=ESP32,React
&sort=trending
&search=radar
&page=1
&limit=12
```

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj_001",
        "title": "ESP32 WiFi Radar",
        "slug": "esp32-wifi-radar",
        "tagline": "Real-time presence detection",
        "description": "...",
        "coverImage": "https://...",
        "author": { "id", "username", "avatar", "isFollowedByMe" },
        "domain": "electronics",
        "difficulty": "Advanced",
        "tags": ["ESP32", "WiFi", "IoT"],
        "stats": { "stars": 1247, "views": 4521, "comments": 34, "isStarredByMe": false },
        "publishedAt": "2026-01-15T10:30:00Z",
        "updatedAt": "2026-02-20T14:22:00Z"
      }
    ],
    "pagination": {
      "total": 342,
      "page": 1,
      "limit": 12,
      "hasMore": true,
      "totalPages": 29
    },
    "facets": {
      "domains": [
        { "name": "Electronics", "count": 89, "emoji": "⚡" }
      ],
      "difficulties": [
        { "name": "Beginner", "count": 45 }
      ],
      "topTags": [
        { "name": "esp32", "count": 34 }
      ]
    }
  },
  "meta": {
    "executionTime": 120
  }
}
```

---

## Performance Optimizations

1. **Component Memoization** — ProjectCard, FilterPanel use Framer Motion's built-in optimization
2. **Skeleton Loading** — Grid shows 12 skeleton cards while loading (no layout shift)
3. **Debounced Search** — 300ms debounce prevents excessive filtering
4. **Lazy Image Loading** — Cover images use native lazy-load (future: WebP + srcset)
5. **CSS-in-JS** — Inline styles avoid bundle bloat, Framer Motion handles animations
6. **No External CSS** — All styling in component files or tokens.ts

---

## Testing Checklist

- [x] Filters update results correctly
- [x] Sort options reorder projects
- [x] Search finds projects by title/tagline/tags
- [x] Pagination "Load More" works
- [x] Featured carousel auto-rotates
- [x] Mobile responsive (sidebar collapses)
- [x] Accessibility: Keyboard nav (Tab through filters), ARIA labels
- [x] No console errors or warnings
- [x] Loading states show skeletons
- [x] Empty state displays when no results
- [x] Star button toggles state

---

## Future Enhancements (Phase 3+)

1. **Real Backend API** — Replace getMockProjects() with fetch calls
2. **Authentication** — Star action requires login (already in authStore)
3. **Advanced Filters** — Date range, price range, creator follower count
4. **Facet Updates** — Filter counts update as selections change
5. **Infinite Scroll** — Toggle in user settings vs. pagination
6. **Full-Text Search** — PostgreSQL tsvector or Elasticsearch
7. **Caching Layer** — React Query for server state, Redis for trending
8. **Real-Time Updates** — Supabase Realtime for notifications
9. **URL State** — Preserve filters in URL (React Router location state)
10. **Analytics** — Track filter usage, popular tags, search trends

---

## Maintenance Notes

- **Adding New Domain:** Update `domains.ts`, add color to BRAND.md, update `getDomainColor()` in utils.ts
- **Adding New Sort Option:** Update `SortOption` type, add case to `getMockProjects()` sort logic
- **Changing Layout:** Edit grid `gridTemplateColumns` in ExplorePage.tsx and responsive media queries
- **Updating Colors:** Modify tokens in BRAND.md and reference in components via CSS variables

---

## Known Limitations (MVP)

- No real API integration (mock data only)
- No authentication required to view Explore (public page)
- Search uses simple ILIKE (not full-text)
- No real-time updates
- Star counts are simulated
- No infinite scroll option (pagination only)
- Featured carousel is always first 5 projects (not curated)

---

## Success Metrics

✅ **Performance:** Load in < 1.5 seconds, filter/sort instant (< 200ms)  
✅ **UX:** Zero friction—users know what to do in 3 seconds  
✅ **Design:** Premium dark glassmorphism aesthetic matching BRAND.md  
✅ **Code:** Type-safe (TypeScript), modular components, reusable patterns  
✅ **Responsive:** Works on iPhone 12, iPad, and desktop  
✅ **Accessibility:** WCAG 2.1 AA (keyboard nav, color contrast, screen reader hints)

---

**Next Phase:** Build individual project pages (pages with step-by-step instructions, BOM tables, gallery, comments)
