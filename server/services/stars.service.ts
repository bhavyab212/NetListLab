import prisma from '../db/prisma';
import { createNotification } from './notifications.service';

export async function toggleStar(userId: string, projectId: string) {
    const existing = await prisma.star.findUnique({
        where: { user_id_project_id: { user_id: userId, project_id: projectId } },
    });

    if (existing) {
        // Unstar
        await prisma.$transaction([
            prisma.star.delete({ where: { id: existing.id } }),
            prisma.project.update({
                where: { id: projectId },
                data: { star_count: { decrement: 1 } },
            }),
        ]);
        return { starred: false };
    } else {
        // Star
        const [, project] = await prisma.$transaction([
            prisma.star.create({ data: { user_id: userId, project_id: projectId } }),
            prisma.project.update({
                where: { id: projectId },
                data: { star_count: { increment: 1 } },
                select: { author_id: true },
            }),
        ]);

        // Notify project author (don't notify yourself)
        if (project.author_id !== userId) {
            await createNotification({
                recipient_id: project.author_id,
                actor_id: userId,
                type: 'STAR',
                project_id: projectId,
            });
        }

        return { starred: true };
    }
}

export async function isProjectStarred(userId: string, projectId: string) {
    const star = await prisma.star.findUnique({
        where: { user_id_project_id: { user_id: userId, project_id: projectId } },
    });
    return { starred: !!star };
}
