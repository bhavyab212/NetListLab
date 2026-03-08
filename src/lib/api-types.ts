// ─── API Response Wrapper ──────────────────────────────────────────────────
export interface ApiResponse<T> {
    data: T
    message?: string
}

// ─── User ──────────────────────────────────────────────────────────────────
export interface ApiUser {
    id: string
    username: string
    full_name: string
    email: string
    avatar_url: string | null
    bio: string | null
    current_role: string | null
    institution: string | null
    location: string | null
    website_url: string | null
    github_url: string | null
    linkedin_url: string | null
    twitter_url: string | null
    skill_tags: string[]
    field_of_work: string[]
    is_verified: boolean
    follower_count: number
    following_count: number
    project_count: number
    total_stars: number
    created_at: string

    // ── Backward-compatible aliases (for unmigrated pages) ──
    // These will be removed as each page is migrated to the real API.
    avatar?: string | null       // alias for avatar_url
    fullName?: string            // alias for full_name
    role?: string                // alias for current_role
    skills?: string[]            // alias for skill_tags
    joinedAt?: string            // alias for created_at
    followers?: number           // alias for follower_count
    following?: number           // alias for following_count
    projectCount?: number        // alias for project_count
    totalStars?: number          // alias for total_stars
    isVerified?: boolean         // alias for is_verified
    domains?: string[]           // alias for field_of_work
    website?: string | null      // alias for website_url
    github?: string | null       // alias for github_url
    linkedin?: string | null     // alias for linkedin_url
    twitter?: string | null      // alias for twitter_url
}

// ─── Project ───────────────────────────────────────────────────────────────
export interface ApiProject {
    id: string
    title: string
    tagline: string | null
    description: string | null
    project_type: string
    difficulty: string
    status: 'DRAFT' | 'PUBLISHED'
    tags: string[]
    cover_image_url: string | null
    github_url: string | null
    demo_video_url: string | null
    star_count: number
    view_count: number
    fork_count: number
    comment_count: number
    author_id: string
    author: ApiUser | null
    created_at: string
    updated_at: string
}

export interface ApiProjectListResult {
    projects: ApiProject[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// ─── BOM ───────────────────────────────────────────────────────────────────
export interface ApiBOMItem {
    id: string
    project_id: string
    component_name: string
    quantity: number
    description: string | null
    part_number: string | null
    buy_link: string | null
    estimated_price: number | null
    currency: string | null
    created_at: string
}

// ─── Comment ───────────────────────────────────────────────────────────────
export interface ApiComment {
    id: string
    project_id: string
    user_id: string
    content: string
    section_id: string | null
    parent_comment_id: string | null
    upvote_count: number
    created_at: string
    author: ApiUser | null
    replies?: ApiComment[]
}

// ─── Notification ──────────────────────────────────────────────────────────
export interface ApiNotification {
    id: string
    recipient_id: string
    actor_id: string | null
    type: 'STAR' | 'FORK' | 'COMMENT' | 'FOLLOW' | 'REPLY'
    is_read: boolean
    project_id: string | null
    comment_id: string | null
    created_at: string
    actor: ApiUser | null
    project: ApiProject | null
}

// ─── Star ──────────────────────────────────────────────────────────────────
export interface ApiStarResult {
    starred: boolean
    star_count: number
}

// ─── Follow ────────────────────────────────────────────────────────────────
export interface ApiFollowResult {
    following: boolean
    follower_count: number
}

// ─── Upload ────────────────────────────────────────────────────────────────
export interface ApiUploadResult {
    url: string
}
