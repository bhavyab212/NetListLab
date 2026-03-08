export declare function createUser(data: {
    id: string;
    email: string;
    username: string;
    full_name: string;
    avatar_url?: string;
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
export declare function syncUser(supabaseId: string, email: string): Promise<{
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
//# sourceMappingURL=auth.service.d.ts.map