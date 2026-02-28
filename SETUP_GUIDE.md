# NetListLab Setup & Deployment Guide

## Current Status
All Tier 2 architecture and Explore page components have been built and are ready for deployment.

## Package Manager Configuration
This project uses **pnpm** as the package manager. The following files have been configured:

### Files Added/Updated:
- `.npmrc` - NPM configuration
- `.pnpmrc` - pnpm configuration  
- `package.json` - Updated with engine requirements and packageManager specification

## Installation Instructions

### Local Development (Recommended)
```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Using Docker (if environment issues persist)
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build

EXPOSE 5173
CMD ["pnpm", "dev"]
```

## Deployed Files Overview

### New Components Created:
- `src/components/discover/` - All discovery UI components
  - `ProjectCard.tsx` - Individual project cards
  - `FilterPanel.tsx` - Sidebar filters
  - `SortControls.tsx` - Sort dropdown
  - `SearchBar.tsx` - Search input with debouncing
  - `FeaturedCarousel.tsx` - Auto-rotating featured projects
  - `ProjectsGrid.tsx` - Main grid layout with pagination
  - `DomainBadge.tsx` - Domain-specific badge colors

- `src/components/layout/`
  - `Header.tsx` - Navigation header

- `src/app/explore/`
  - `ExplorePage.tsx` - Main Explore page component

### New Data & State:
- `src/types/project.ts` - TypeScript interfaces for projects
- `src/mockData/projects.ts` - 16 sample projects with full data
- `src/stores/filterStore.ts` - Zustand store for filter state
- `src/lib/utils.ts` - Utility functions and helpers

### Documentation:
- `docs/TIER2_ARCHITECTURE.md` - Complete architecture spec
- `docs/API_CONTRACTS.md` - API contract specifications
- `IMPLEMENTATION_SUMMARY.md` - Build summary
- `DEBUG_GUIDE.md` - Debugging guide

## Testing the Explore Page

1. After installation, the app will start at `http://localhost:5173`
2. Default route redirects to `/login`
3. Log in or navigate directly to `/explore` to see the Explore page
4. Features available:
   - Browse 16 sample projects
   - Filter by domain (multi-select), difficulty (single)
   - Sort by trending/latest/starred/viewed
   - Search across project names and descriptions
   - View featured carousel
   - Paginate through projects
   - Star/favorite projects (client-side)

## Browser Compatibility
- Modern browsers with ES2020+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Responsive design supports 480px to 1440px+ screens

## Performance Notes
- Search debouncing: 300ms
- Loading skeletons prevent layout shift
- All animations use GPU-accelerated transforms
- Components optimize re-renders with React.memo where appropriate

## Next Steps
1. Connect to real backend API (see API_CONTRACTS.md)
2. Implement user authentication flow
3. Add project detail pages
4. Set up database with project data
5. Deploy to production (Vercel recommended)

## Troubleshooting

### "pnpm not found" error
```bash
npm install -g pnpm@9.1.0
```

### Port 5173 already in use
```bash
pnpm dev -- --port 3000
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Support
For issues specific to the Explore page or Tier 2 architecture, refer to the inline code comments and the component README at `src/components/discover/README.md`.
