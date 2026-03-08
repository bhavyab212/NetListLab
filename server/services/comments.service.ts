import prisma from '../db/prisma';
import { createNotification } from './notifications.service';

export async function getProjectComments(projectId: string) {
    return prisma.comment.findMany({
        where: { project_id: projectId, parent_comment_id: null, is_deleted: false },
        orderBy: { created_at: 'asc' },
        include: {
            user: { select: { id: true, username: true, full_name: true, avatar_url: true } },
            replies: {
                where: { is_deleted: false },
                include: {
                    user: { select: { id: true, username: true, full_name: true, avatar_url: true } },
                },
                orderBy: { created_at: 'asc' },
            },
        },
    });
}

export async function getStepComments(projectId: string) {
    return prisma.comment.findMany({
        where: { project_id: projectId, section_id: { not: null }, is_deleted: false },
        orderBy: { created_at: 'asc' },
        include: {
            user: { select: { id: true, username: true, full_name: true, avatar_url: true } },
            section: { select: { id: true, title: true, order_index: true } },
        },
    });
}

export async function addComment(
    userId: string,
    projectId: string,
    data: {
        content: string;
        section_id?: string;
        parent_comment_id?: string;
    }
) {
    const comment = await prisma.comment.create({
        data: {
            user_id: userId,
            project_id: projectId,
            content: data.content,
            section_id: data.section_id,
            parent_comment_id: data.parent_comment_id,
        },
        include: {
            user: { select: { id: true, username: true, full_name: true, avatar_url: true } },
        },
    });

    // Notify project author
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { author_id: true },
    });
    if (project && project.author_id !== userId) {
        await createNotification({
            recipient_id: project.author_id,
            actor_id: userId,
            type: data.parent_comment_id ? 'REPLY' : 'COMMENT',
            project_id: projectId,
            comment_id: comment.id,
        });
    }

    return comment;
}

export async function deleteComment(commentId: string, userId: string) {
    // Soft delete
    return prisma.comment.updateMany({
        where: { id: commentId, user_id: userId },
        data: { is_deleted: true, content: '[deleted]' },
    });
}

export async function toggleUpvote(commentId: string) {
    // Simple increment — a real system would track per-user upvotes
    return prisma.comment.update({
        where: { id: commentId },
        data: { upvote_count: { increment: 1 } },
    });
}
