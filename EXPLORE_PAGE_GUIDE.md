# Explore Page Implementation Guide

## Overview

The Explore page has been completely rebuilt following the reference design from the HTML mockup. This guide documents the architecture, components, and styling system.

## Architecture

### Components

**Layout Component** (`src/components/Layout.tsx`)
- Fixed header with logo, search bar (desktop), navigation, notifications, theme toggle, and user avatar
- Main content area with max-width container
- Footer with copyright information
- Theme toggle functionality

**Dashboard Component** (`src/components/Dashboard.tsx`)
- Filter area with category buttons, difficulty level selector, sort dropdown, and search input
- Projects grid displaying filtered/sorted results
- "Load More" button for pagination
- Empty state when no projects match filters

**ProjectCard Component** (`src/components/ProjectCard.tsx`)
- Individual project card with image, metadata, tags
- Hover effects with "View Project" overlay
- Author information with avatar
- Stats: stars, views, comments

## Data Structure

**Projects Data** (`src/data/projects.ts`)
- 6 sample engineering projects
- Categories: Electronics, Hardware, Software, Robotics, AI/ML
- Difficulty levels: Beginner, Intermediate, Advanced, Expert
- Each project includes: title, author, description, image, tags, stats

## Styling System

### Color Palette

**Primary Colors:**
- Primary Green: `#8ccc73`
- Primary Dark: `#5C9A4A`

**Light Mode:**
- Background: `#F2F0F0`
- Surface: `#FFFFFF`
- Text Main: `#2D3436`
- Text Muted: `#636E72`

**Dark Mode:**
- Background: `#08080C`
- Surface: `#1C1C24`
- Text Main: `#FFFFFF`
- Text Muted: `#9d9abc`

### Component Classes

**glass-nav** - Header styling with glassmorphism effect
**card-surface** - Project card containers with hover animations
**filter-area** - Filter panel with backdrop blur
**section-header-area** - Section titles with icons
**neumorphic-pill** - Category buttons with neumorphic design
**btn-depth** - Load More button with depth effect
**hide-scrollbar** - Remove scrollbars from overflow containers

## Features

### Filtering
- **Category Filter** - Multi-select buttons for project types
- **Difficulty Level** - Single-select toggle between Any/Beginner/Intermediate/Advanced/Expert
- **Search** - Full-text search across titles, descriptions, and tags

### Sorting
- Trending (currently static, can be enhanced with backend)

### Responsive Design
- Mobile-first approach
- Hidden elements on mobile: search bar, navigation links
- Responsive grid: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)

## Theme Support

- **Light Mode** - Soft, neumorphic design with subtle shadows
- **Dark Mode** - Deep backgrounds with accent glow effects
- Theme toggle in header preserves user preference

## Future Enhancements

1. Backend integration for real project data
2. Pagination with API calls
3. Advanced sorting options
4. User project uploads
5. Comments and discussions
6. Favorites/bookmarks system
7. Social sharing features

## File Structure

```
src/
├── components/
│   ├── Layout.tsx         # Header, footer, theme toggle
│   ├── Dashboard.tsx      # Main page with filters and grid
│   └── ProjectCard.tsx    # Individual project card
├── data/
│   └── projects.ts        # Mock project data
└── index.css              # Tailwind + component styles
```

## Usage

The Explore page is accessible at the `/explore` route. Navigate through the app after logging in or onboarding to access the portfolio dashboard.
