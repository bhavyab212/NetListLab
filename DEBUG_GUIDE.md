# NetListLab Explore Page - Debug Guide

## Issue Fixed
The application was redirecting unauthenticated users to `/explore`, but the default route should direct to `/login` first. This has been corrected in `src/App.tsx`.

## Application Flow
1. **Landing**: User starts at `/` → redirects to `/login`
2. **Auth**: User logs in/registers → can navigate to `/explore`
3. **Explore**: Public discovery page available to all authenticated users
4. **Onboarding**: After registration, onboarding → redirects back to `/login`

## Key Files Structure
```
src/
├── app/explore/
│   └── ExplorePage.tsx          # Main explore page component
├── components/
│   ├── discover/                # Explore page components
│   │   ├── ProjectCard.tsx      # Individual project card
│   │   ├── ProjectsGrid.tsx     # Grid layout with pagination
│   │   ├── FeaturedCarousel.tsx # Auto-rotating featured projects
│   │   ├── FilterPanel.tsx      # Left sidebar filters
│   │   ├── SortControls.tsx     # Sort dropdown
│   │   ├── SearchBar.tsx        # Search input with debouncing
│   │   ├── DomainBadge.tsx      # Domain badge component
│   │   └── README.md            # Component documentation
│   └── layout/
│       └── Header.tsx           # Top navigation bar
├── stores/
│   └── filterStore.ts           # Zustand store for filter state
├── types/
│   └── project.ts              # TypeScript interfaces
└── mockData/
    ├── projects.ts             # Mock project data & getMockProjects()
    └── domains.ts              # Domain definitions
```

## Component Dependencies
- **ExplorePage** uses: Header, SearchBar, FilterPanel, SortControls, ProjectsGrid, FeaturedCarousel
- **ProjectsGrid** uses: ProjectCard, Button
- **ProjectCard** uses: DomainBadge, motion
- **FilterPanel** uses: DomainBadge
- **FeaturedCarousel** uses: DomainBadge

## Store Usage
- **filterStore** manages: domains, difficulty, tags, sort, search, page
- Used by: SearchBar, FilterPanel, SortControls, ExplorePage

## Data Flow
1. User filters/searches → **filterStore** updates
2. **ExplorePage** reads filter state
3. Calls **getMockProjects()** with current filters
4. Renders **ProjectsGrid** with results
5. **ProjectsGrid** displays **ProjectCard** components

## Troubleshooting

### "Cannot find module" errors
- Verify all imports use correct paths
- Check that files exist in the expected locations
- Clear node_modules and reinstall with `pnpm install`

### Styling issues
- Check `src/index.css` for CSS variable definitions
- Verify `tailwindcss` is properly configured in `vite.config.ts`
- Review design tokens in BRAND.md

### Component not rendering
- Check browser console for errors
- Verify component exports `default export`
- Ensure all required props are being passed

### Filter/Sort not working
- Check **filterStore** selectors are correct
- Verify **getMockProjects** logic for filtering
- Ensure filter state is being read from store

## Testing the Explore Page

1. Navigate to `http://localhost:5173` (dev server)
2. Should redirect to login if not authenticated
3. Log in with any credentials (mock auth)
4. Navigate to `/explore` (or from header)
5. Test:
   - Search by project title/tags
   - Filter by domain (multi-select)
   - Filter by difficulty
   - Sort by different options
   - Featured carousel auto-rotation
   - Load more pagination
   - Responsive on mobile

## Performance Notes
- Search uses debouncing (300ms) to prevent excessive re-renders
- Carousel auto-rotates every 5 seconds
- Grid uses skeleton loaders during transitions
- Pagination loads 12 projects per page

## Next Steps
1. Connect to real API endpoints
2. Implement persistent authentication
3. Add user-specific starred projects
4. Real-time trending calculations
5. Full-text search with PostgreSQL
