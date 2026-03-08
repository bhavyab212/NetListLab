import prisma from '../db/prisma';

export async function createNotification(data: {
    recipient_id: string;
    actor_id: string;
    type: string;
    project_id?: string;
    comment_id?: string;
}) {
    return prisma.notification.create({ data });
}

export async function getNotifications(userId: string) {
    return prisma.notification.findMany({
        where: { recipient_id: userId },
        orderBy: { created_at: 'desc' },
        take: 50,
        include: {
            actor: { select: { username: true, full_name: true, avatar_url: true } },
            project: { select: { id: true, title: true } },
        },
    });
}

export async function markAllRead(userId: string) {
    return prisma.notification.updateMany({
        where: { recipient_id: userId, is_read: false },
        data: { is_read: true },
    });
}

export async function markOneRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
        where: { id: notificationId, recipient_id: userId },
        data: { is_read: true },
    });
}
