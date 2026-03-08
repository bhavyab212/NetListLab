export declare function getUserByUsername(username: string): Promise<{
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    bio: string | null;
    location: string | null;
    website_url: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    twitter_url: string | null;
    field_of_work: string[];
    skill_tags: string[];
    current_role: string | null;
    institution: string | null;
    created_at: Date;
    _count: {
        projects: number;
        following: number;
        followers: number;
    };
} | null>;
export declare function getUserById(id: string): Promise<{
    id: string;
    email: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    bio: string | null;
    location: string | null;
    website_url: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    twitter_url: string | null;
    field_of_work: string[];
    skill_tags: string[];
    current_role: string | null;
    institution: string | null;
    created_at: Date;
    updated_at: Date;
    _count: {
        projects: number;
        following: number;
        followers: number;
    };
} | null>;
export declare function updateUser(id: string, data: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    website_url?: string;
    github_url?: string;
    linkedin_url?: string;
    twitter_url?: string;
    field_of_work?: string[];
    skill_tags?: string[];
    current_role?: string;
    institution?: string;
}): Promise<{
    id: string;
    email: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    bio: string | null;
    location: string | null;
    website_url: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    twitter_url: string | null;
    field_of_work: string[];
    skill_tags: string[];
    current_role: string | null;
    institution: string | null;
    created_at: Date;
    updated_at: Date;
}>;
export declare function getUserProjects(username: string, viewerId?: string): Promise<({
    _count: {
        stars: number;
        comments: number;
    };
    author: {
        username: string;
        full_name: string;
        avatar_url: string | null;
    };
} & {
    id: string;
    github_url: string | null;
    created_at: Date;
    updated_at: Date;
    status: string;
    author_id: string;
    title: string;
    tagline: string | null;
    cover_image_url: string | null;
    demo_video_url: string | null;
    project_type: string;
    difficulty: string;
    tags: string[];
    view_count: number;
    star_count: number;
    fork_count: number;
    published_at: Date | null;
})[] | null>;
export declare function getUserStarred(username: string): Promise<unknown[] | null>;
//# sourceMappingURL=users.service.d.ts.map