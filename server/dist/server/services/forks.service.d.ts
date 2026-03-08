export declare function forkProject(userId: string, originalProjectId: string): Promise<{
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
//# sourceMappingURL=forks.service.d.ts.map