export declare function createNotification(data: {
    recipient_id: string;
    actor_id: string;
    type: string;
    project_id?: string;
    comment_id?: string;
}): Promise<{
    id: string;
    created_at: Date;
    type: string;
    project_id: string | null;
    comment_id: string | null;
    is_read: boolean;
    recipient_id: string;
    actor_id: string;
}>;
export declare function getNotifications(userId: string): Promise<({
    project: {
        id: string;
        title: string;
    } | null;
    actor: {
        username: string;
        full_name: string;
        avatar_url: string | null;
    };
} & {
    id: string;
    created_at: Date;
    type: string;
    project_id: string | null;
    comment_id: string | null;
    is_read: boolean;
    recipient_id: string;
    actor_id: string;
})[]>;
export declare function markAllRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
export declare function markOneRead(notificationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
//# sourceMappingURL=notifications.service.d.ts.map