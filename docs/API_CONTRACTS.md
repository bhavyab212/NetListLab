# NetListLab API Contracts

**Version:** 2.0.0  
**Status:** Design (Ready for Backend Implementation)  
**Updated:** 2026-02-28

This document defines the API contracts for NetListLab backend endpoints. All endpoints follow RESTful conventions with consistent JSON response shapes.

---

## Response Format

All endpoints return a consistent response structure:

```json
{
  "success": true | false,
  "data": {},
  "error": null | { "code": "...", "message": "..." },
  "meta": {
    "executionTime": 120,
    "timestamp": "2026-02-28T10:30:00Z",
    "version": "2.0.0"
  }
}
```

### Status Codes
- **200** — Success
- **201** — Created
- **400** — Bad request (validation error)
- **401** — Unauthorized (auth required)
- **403** — Forbidden (insufficient permissions)
- **404** — Not found
- **500** — Server error

---

## Authentication

All endpoints except `/explore` and `/projects` (GET) require authentication via:
- Header: `Authorization: Bearer <jwt_token>`
- Or: Session cookie (to be implemented)

---

## Projects Endpoints

### GET /api/projects

**Description:** Fetch projects with filtering, sorting, and pagination

**Query Parameters:**
```
domains?=electronics,software        # Multi-select domains (comma-separated)
difficulty?=advanced                # Single difficulty level
tags?=esp32,react                    # Multi-select tags (comma-separated)
sort?=trending                       # trending | latest | most-starred | most-viewed
search?=radar                        # Full-text search
page?=1                             # Page number (1-indexed)
limit?=12                           # Results per page (max 100)
```

**Example Request:**
```
GET /api/projects?domains=electronics,robotics&difficulty=advanced&sort=trending&page=1&limit=12
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj_001",
        "title": "ESP32 WiFi Radar Intrusion Detection",
        "slug": "esp32-wifi-radar-intrusion",
        "tagline": "Real-time presence detection using WiFi signal reflection",
        "description": "Advanced IoT system combining ESP32 microcontroller...",
        "coverImage": "https://images.example.com/esp32-radar.jpg",
        "author": {
          "id": "user_001",
          "username": "tech_wizard",
          "avatar": "https://avatars.example.com/tech_wizard.jpg",
          "isFollowedByMe": false
        },
        "domain": "electronics",
        "difficulty": "Advanced",
        "tags": ["ESP32", "WiFi", "IoT", "Signal Processing"],
        "stats": {
          "stars": 1247,
          "views": 4521,
          "comments": 34,
          "isStarredByMe": false
        },
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
        { "name": "Electronics", "count": 89, "emoji": "⚡" },
        { "name": "Software", "count": 72, "emoji": "💻" },
        { "name": "Mechanical", "count": 54, "emoji": "⚙️" },
        { "name": "Design", "count": 42, "emoji": "🎨" },
        { "name": "AI/ML", "count": 31, "emoji": "🧠" },
        { "name": "Robotics", "count": 28, "emoji": "🤖" },
        { "name": "Research", "count": 26, "emoji": "🔬" }
      ],
      "difficulties": [
        { "name": "Beginner", "count": 45 },
        { "name": "Intermediate", "count": 127 },
        { "name": "Advanced", "count": 98 },
        { "name": "Expert", "count": 72 }
      ],
      "topTags": [
        { "name": "ESP32", "count": 34 },
        { "name": "React", "count": 28 },
        { "name": "Arduino", "count": 25 },
        { "name": "Python", "count": 21 },
        { "name": "IoT", "count": 19 }
      ]
    }
  },
  "meta": {
    "executionTime": 120,
    "timestamp": "2026-02-28T10:30:00Z",
    "version": "2.0.0"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_SORT_OPTION",
    "message": "Sort option 'random' not supported. Use: trending, latest, most-starred, most-viewed"
  },
  "meta": {}
}
```

---

### GET /api/projects/:id

**Description:** Fetch a single project by ID or slug

**Example Request:**
```
GET /api/projects/esp32-wifi-radar-intrusion
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "proj_001",
    "title": "ESP32 WiFi Radar Intrusion Detection",
    "slug": "esp32-wifi-radar-intrusion",
    "tagline": "Real-time presence detection",
    "description": "Full description...",
    "content": {
      "sections": [
        {
          "id": "sec_001",
          "type": "overview",
          "title": "Project Overview",
          "content": "Markdown content..."
        },
        {
          "id": "sec_002",
          "type": "bom",
          "items": [
            { "quantity": 1, "part": "ESP32-WROOM", "notes": "Microcontroller" }
          ]
        }
      ]
    },
    "coverImage": "https://...",
    "gallery": [
      { "url": "https://...", "alt": "Circuit diagram" },
      { "url": "https://...", "alt": "Assembled prototype" }
    ],
    "author": { ... },
    "stats": { ... },
    "relatedProjects": [
      { "id": "proj_002", "title": "...", "slug": "..." }
    ]
  },
  "meta": {}
}
```

---

### GET /api/discover/featured

**Description:** Get featured/curated projects for homepage carousel

**Response (200):**
```json
{
  "success": true,
  "data": {
    "featured": [
      {
        "id": "proj_001",
        "title": "ESP32 WiFi Radar",
        "tagline": "...",
        "coverImage": "...",
        "stats": { "stars": 1247, ... },
        "author": { ... }
      }
    ]
  },
  "meta": {}
}
```

---

### GET /api/projects/:id/sections

**Description:** Fetch project sections (overview, BOM, code, gallery, etc.)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sections": [
      { "id": "sec_001", "type": "overview", "title": "Overview", "content": "..." },
      { "id": "sec_002", "type": "bom", "title": "Bill of Materials", "items": [...] },
      { "id": "sec_003", "type": "instructions", "title": "Build Instructions", "steps": [...] }
    ]
  },
  "meta": {}
}
```

---

## Star/Favorite Endpoints

### POST /api/projects/:id/star

**Description:** Star/favorite a project (requires auth)

**Request Body:**
```json
{
  "starred": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "proj_001",
    "isStarredByMe": true,
    "totalStars": 1248
  },
  "meta": {}
}
```

**Error (401):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required to star projects"
  }
}
```

---

### DELETE /api/projects/:id/star

**Description:** Remove star from project (requires auth)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "proj_001",
    "isStarredByMe": false,
    "totalStars": 1247
  },
  "meta": {}
}
```

---

## Comment Endpoints

### GET /api/projects/:id/comments

**Description:** Fetch comments on a project

**Query Parameters:**
```
page?=1
limit?=20
sort?=newest  # newest | oldest | most-liked
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "com_001",
        "author": { "id": "user_002", "username": "builder_joe", "avatar": "..." },
        "content": "Great project! I made one and...",
        "createdAt": "2026-02-25T14:22:00Z",
        "likes": 12,
        "isLikedByMe": false,
        "replies": [
          { "id": "com_002", "author": {...}, "content": "Thanks!..." }
        ]
      }
    ],
    "pagination": { "total": 34, "page": 1, "hasMore": true }
  },
  "meta": {}
}
```

---

### POST /api/projects/:id/comments

**Description:** Create a comment (requires auth)

**Request Body:**
```json
{
  "content": "Great project! How did you...",
  "parentCommentId": null  # null for top-level, or comment ID for replies
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "com_new_001",
    "author": { "id": "user_123", "username": "me", "avatar": "..." },
    "content": "Great project!...",
    "createdAt": "2026-02-28T10:30:00Z",
    "likes": 0,
    "isLikedByMe": false
  },
  "meta": {}
}
```

---

## Search Endpoints

### GET /api/search

**Description:** Global full-text search across projects

**Query Parameters:**
```
q=radar              # Search query
type=projects        # projects | users | tags
limit?=20
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "project",
        "id": "proj_001",
        "title": "ESP32 WiFi Radar",
        "slug": "esp32-wifi-radar-intrusion",
        "tagline": "Real-time presence detection...",
        "coverImage": "...",
        "domain": "electronics",
        "stats": { "stars": 1247 },
        "match": "Title contains 'radar'"
      }
    ],
    "facets": {
      "byType": { "projects": 42, "users": 3, "tags": 5 }
    }
  },
  "meta": {}
}
```

---

## User Endpoints

### GET /api/users/me

**Description:** Get authenticated user profile (requires auth)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "username": "tech_wizard",
    "email": "wizard@example.com",
    "avatar": "https://...",
    "bio": "Passionate about IoT and embedded systems",
    "website": "https://...",
    "stats": {
      "projectsCreated": 5,
      "followers": 342,
      "following": 128,
      "stars": 2341
    },
    "preferences": {
      "theme": "dark",
      "notifications": true
    }
  },
  "meta": {}
}
```

---

## Authentication Endpoints

### POST /api/auth/login

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "user_123", "username": "tech_wizard", ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  },
  "meta": {}
}
```

---

### POST /api/auth/register

**Request Body:**
```json
{
  "username": "tech_wizard",
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "user_123", "username": "tech_wizard", ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  },
  "meta": {}
}
```

---

## Validation Rules

### Projects Query
- `limit` max 100 (default 12)
- `page` min 1
- `sort` one of: trending, latest, most-starred, most-viewed
- `domains` comma-separated, valid domain IDs
- `difficulty` one of: Beginner, Intermediate, Advanced, Expert
- `search` max 200 characters

### Comments
- `content` required, 1-5000 characters
- Markdown supported (sanitized)

### User Registration
- `username` 3-30 chars, alphanumeric + underscore
- `email` valid email format
- `password` min 8 chars, must include uppercase, number, special char

---

## Rate Limiting

All endpoints rate limited:
- **Public endpoints** (GET /projects): 1000 req/hour per IP
- **Authenticated endpoints**: 5000 req/hour per user
- **Write endpoints** (POST/PUT/DELETE): 100 req/hour per user

Response includes headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

---

## Pagination Standards

All paginated responses include:
```json
{
  "pagination": {
    "total": 342,           # Total items
    "page": 1,             # Current page (1-indexed)
    "limit": 12,           # Items per page
    "hasMore": true,       # More pages available
    "totalPages": 29       # Total pages
  }
}
```

---

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_QUERY` | 400 | Invalid query parameters |
| `INVALID_SORT_OPTION` | 400 | Sort option not supported |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Future Enhancements

1. **Webhooks** — Real-time project updates
2. **GraphQL Layer** — Alternative query interface
3. **WebSocket** — Real-time notifications and comments
4. **CDN Integration** — Image optimization
5. **Analytics** — Popular searches, trending topics
6. **Recommendations** — Personalized project suggestions

---

## Implementation Priority

**Phase 1 (MVP):**
- ✅ GET /api/projects
- ✅ GET /api/projects/:id
- ✅ POST /api/auth/login
- ✅ POST /api/auth/register

**Phase 2:**
- GET /api/projects/:id/comments
- POST /api/projects/:id/comments
- POST /api/projects/:id/star
- GET /api/users/me

**Phase 3:**
- GET /api/discover/featured
- GET /api/search
- User profile endpoints
- Recommendation engine

---

This contract serves as the specification for backend development. All endpoints should follow these exact shapes and return codes for frontend compatibility.
