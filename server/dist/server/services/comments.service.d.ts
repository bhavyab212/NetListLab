export declare function getProjectComments(projectId: string): Promise<({
    user: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string | null;
    };
    replies: ({
        user: {
            id: string;
            username: string;
            full_name: string;
            avatar_url: string | null;
        };
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        user_id: string;
        project_id: string;
        section_id: string | null;
        parent_comment_id: string | null;
        content: string;
        upvote_count: number;
        is_deleted: boolean;
    })[];
} & {
    id: string;
    created_at: Date;
    updated_at: Date;
    user_id: string;
    project_id: string;
    section_id: string | null;
    parent_comment_id: string | null;
    content: string;
    upvote_count: number;
    is_deleted: boolean;
})[]>;
export declare function getStepComments(projectId: string): Promise<({
    user: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string | null;
    };
    section: {
        id: string;
        title: string;
        order_index: number;
    } | null;
} & {
    id: string;
    created_at: Date;
    updated_at: Date;
    user_id: string;
    project_id: string;
    section_id: string | null;
    parent_comment_id: string | null;
    content: string;
    upvote_count: number;
    is_deleted: boolean;
})[]>;
export declare function addComment(userId: string, projectId: string, data: {
    content: string;
    section_id?: string;
    parent_comment_id?: string;
}): Promise<{
    user: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string | null;
    };
} & {
    id: string;
    created_at: Date;
    updated_at: Date;
    user_id: string;
    project_id: string;
    section_id: string | null;
    parent_comment_id: string | null;
    content: string;
    upvote_count: number;
    is_deleted: boolean;
}>;
export declare function deleteComment(commentId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare function toggleUpvote(commentId: string): Promise<{
    id: string;
    created_at: Date;
    updated_at: Date;
    user_id: string;
    project_id: string;
    section_id: string | null;
    parent_comment_id: string | null;
    content: string;
    upvote_count: number;
    is_deleted: boolean;
}>;
//# sourceMappingURL=comments.service.d.ts.map