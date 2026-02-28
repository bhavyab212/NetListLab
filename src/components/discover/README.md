# Discover Components

High-quality, reusable components for the NetListLab Explore page. All components follow the BRAND.md design system and are built with Framer Motion for smooth animations.

## Components

### DomainBadge
Displays project domain with color-coded background and glow effect.

```tsx
import DomainBadge from './DomainBadge';

<DomainBadge 
  domain="electronics"
  size="md"           // sm | md | lg
  variant="filled"    // filled | outlined
/>
```

**Props:**
- `domain` (DomainType) — electronics, software, mechanical, design, aiml, robotics, research
- `size` (string) — sm (12px), md (14px), lg (16px)
- `variant` (string) — filled (solid bg) or outlined (border only)

### ProjectCard
Complete project display with image, metadata, stats, and interactive star button.

```tsx
import ProjectCard from './ProjectCard';

<ProjectCard
  project={projectObject}
  onStar={(projectId) => console.log('Starred:', projectId)}
/>
```

**Props:**
- `project` (Project) — Full project object
- `onStar` (function) — Callback when star button clicked

**Features:**
- 16:9 aspect ratio cover image
- Domain badge with glow
- Difficulty indicator
- Author info with avatar
- Title + tagline (clamped to 2 lines)
- Top 3 tags as colored pills
- Stats footer (stars, views, comments)
- Interactive star button (toggles gold color)
- Smooth hover elevation (8px lift)

### FilterPanel
Left sidebar with multi-select domain, difficulty, and tag filters.

```tsx
import FilterPanel from './FilterPanel';

const facets = {
  domains: [
    { name: "Electronics", count: 89, emoji: "⚡" }
  ],
  difficulties: [
    { name: "Beginner", count: 45 }
  ],
  topTags: [
    { name: "ESP32", count: 34 }
  ]
};

<FilterPanel
  facets={facets}
  onClose={() => setFilterOpen(false)}
/>
```

**Props:**
- `facets` (object) — Domains, difficulties, tags with counts
- `onClose` (function) — Callback for mobile close button

**Features:**
- Domain checkboxes with counts
- Difficulty radio buttons
- Popular tag pills (clickable)
- "Clear All Filters" button
- Sticky positioning (follows scroll)
- Mobile: close button in header

### SortControls
Dropdown for sorting projects by different criteria.

```tsx
import SortControls from './SortControls';

<SortControls />
```

**Options:**
- Trending (default) — weighted score: stars 40% + views 40% + recency 20%
- Latest — publication date descending
- Most Starred — star count descending
- Most Viewed — view count descending

### SearchBar
Debounced global search input with suggestion hints.

```tsx
import SearchBar from './SearchBar';

<SearchBar />
```

**Features:**
- Debounced 300ms
- Search across title, tags, tagline
- Suggestion pills (ESP32, React, Arduino)
- Clear button (X) when text entered
- Real-time filtering

### FeaturedCarousel
Auto-rotating carousel of 5 featured projects.

```tsx
import FeaturedCarousel from './FeaturedCarousel';

<FeaturedCarousel projects={projectsArray} />
```

**Props:**
- `projects` (Project[]) — Array of projects to display

**Features:**
- 5-second autoplay
- Left/right navigation arrows
- Dot indicators (clickable)
- Pauses on hover
- Large hero layout with overlay
- 400ms fade transitions

### ProjectsGrid
Responsive 3-column grid with pagination and loading states.

```tsx
import ProjectsGrid from './ProjectsGrid';

<ProjectsGrid
  data={projectsResponse}
  isLoading={false}
  onLoadMore={() => setPage(page + 1)}
  onStar={(projectId) => console.log('Starred:', projectId)}
/>
```

**Props:**
- `data` (ProjectsResponse) — API response with projects and pagination
- `isLoading` (boolean) — Show skeleton cards
- `onLoadMore` (function) — Callback for "Load More" button
- `onStar` (function) — Callback for star actions

**Features:**
- 3-column grid on desktop (auto-fill minmax)
- Responsive to tablet/mobile
- Skeleton loading cards (12 cards)
- "Load More" button when hasMore = true
- Empty state with helpful message
- End-of-results indicator

## Usage Example

Complete Explore page integration:

```tsx
import React, { useState } from 'react';
import { useFilterStore } from '../../stores/filterStore';
import { getMockProjects } from '../../mockData/projects';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import SortControls from './SortControls';
import ProjectsGrid from './ProjectsGrid';
import FeaturedCarousel from './FeaturedCarousel';

export default function ExplorePage() {
  const { domains, difficulty, tags, sort, search, page, setPage } = useFilterStore();
  const [isLoading, setIsLoading] = useState(false);

  const projectsData = getMockProjects({
    domains,
    difficulty,
    tags,
    sort,
    search,
    page,
  });

  return (
    <div>
      <h1>Explore Projects</h1>
      <FeaturedCarousel projects={projectsData.data.projects} />
      <SearchBar />
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        <FilterPanel facets={projectsData.data.facets} />
        <div>
          <SortControls />
          <ProjectsGrid
            data={projectsData}
            isLoading={isLoading}
            onLoadMore={() => setPage(page + 1)}
          />
        </div>
      </div>
    </div>
  );
}
```

## Design Tokens

All components use inline styles referencing:
- **Colors:** BRAND.md color palette (dark mode first)
- **Typography:** Space Grotesk (headings), Inter (body)
- **Spacing:** Base-4 scale (4px, 8px, 12px, 16px, 20px, 24px...)
- **Shadows:** Glassmorphic shadows with 10px backdrop blur
- **Animations:** 400ms ease-smooth (cubic-bezier(0.4, 0, 0.2, 1))

## Responsive Breakpoints

- **Desktop:** 1440px max-width, 280px sidebar visible
- **Tablet:** 1024px, sidebar collapses
- **Mobile:** 480px, single column, 16px padding

## Accessibility

All components include:
- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Color contrast compliance (4.5:1 minimum)
- Focus indicators
- Screen reader hints

## Performance

- **Lazy Image Loading:** Native browser optimization
- **Skeleton Cards:** Prevent layout shift during loading
- **Debounced Search:** 300ms delay reduces re-renders
- **Memoized Components:** Framer Motion optimization
- **CSS-in-JS:** Inline styles avoid CSS parsing overhead

## Future Enhancements

- [ ] Image optimization (WebP, srcset)
- [ ] Infinite scroll option
- [ ] Advanced filter presets
- [ ] Project bookmarks
- [ ] Sort direction toggle
- [ ] View toggle (grid/list)
- [ ] Filter history
- [ ] Saved searches

## Dependencies

- **react** — UI framework
- **framer-motion** — Animations and transitions
- **lucide-react** — Icons
- **zustand** — State management (filterStore)

## Testing Checklist

- [ ] Filters update results
- [ ] Sort reorders correctly
- [ ] Search finds projects
- [ ] Pagination loads more
- [ ] Featured carousel rotates
- [ ] Mobile responsive
- [ ] Keyboard navigation
- [ ] No console errors

---

**Last Updated:** 2026-02-28  
**Component Set Version:** 2.0.0
