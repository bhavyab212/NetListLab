interface ProjectFilters {
    type?: string;
    difficulty?: string;
    tags?: string[];
    sort?: 'latest' | 'trending' | 'starred' | 'viewed';
    search?: string;
    page?: number;
    limit?: number;
}
export declare function listProjects(filters: ProjectFilters): Promise<{
    projects: ({
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
    })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}>;
export declare function getProjectById(id: string): Promise<({
    _count: {
        stars: number;
        comments: number;
        sections: number;
    };
    author: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string | null;
        bio: string | null;
        field_of_work: string[];
    };
    sections: ({
        media: {
            id: string;
            project_id: string;
            order_index: number;
            section_id: string | null;
            media_type: string;
            file_url: string;
            caption: string | null;
        }[];
    } & {
        id: string;
        created_at: Date;
        title: string;
        project_id: string;
        order_index: number;
        section_type: string;
        content_markdown: string | null;
    })[];
    media: {
        id: string;
        project_id: string;
        order_index: number;
        section_id: string | null;
        media_type: string;
        file_url: string;
        caption: string | null;
    }[];
    bom_items: {
        id: string;
        project_id: string;
        component_name: string;
        quantity: number;
        description: string | null;
        part_number: string | null;
        buy_link: string | null;
        estimated_price: import("@prisma/client/runtime/library").Decimal | null;
        currency: string;
    }[];
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
}) | null>;
export declare function createProject(authorId: string, data: {
    title: string;
    tagline?: string;
    project_type: string;
    difficulty: string;
    tags?: string[];
    github_url?: string;
    cover_image_url?: string;
}): Promise<{
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
}>;
export declare function updateProject(id: string, data: {
    title?: string;
    tagline?: string;
    project_type?: string;
    difficulty?: string;
    tags?: string[];
    github_url?: string;
    cover_image_url?: string;
    demo_video_url?: string;
}): Promise<{
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
}>;
export declare function deleteProject(id: string): Promise<{
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
}>;
export declare function publishProject(id: string): Promise<{
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
}>;
export declare function incrementViewCount(id: string): Promise<{
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
}>;
export {};
//# sourceMappingURL=projects.service.d.ts.map