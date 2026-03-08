"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectComments = getProjectComments;
exports.getStepComments = getStepComments;
exports.addComment = addComment;
exports.deleteComment = deleteComment;
exports.toggleUpvote = toggleUpvote;
const prisma_1 = __importDefault(require("../db/prisma"));
const notifications_service_1 = require("./notifications.service");
async function getProjectComments(projectId) {
    return prisma_1.default.comment.findMany({
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
async function getStepComments(projectId) {
    return prisma_1.default.comment.findMany({
        where: { project_id: projectId, section_id: { not: null }, is_deleted: false },
        orderBy: { created_at: 'asc' },
        include: {
            user: { select: { id: true, username: true, full_name: true, avatar_url: true } },
            section: { select: { id: true, title: true, order_index: true } },
        },
    });
}
async function addComment(userId, projectId, data) {
    const comment = await prisma_1.default.comment.create({
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
    const project = await prisma_1.default.project.findUnique({
        where: { id: projectId },
        select: { author_id: true },
    });
    if (project && project.author_id !== userId) {
        await (0, notifications_service_1.createNotification)({
            recipient_id: project.author_id,
            actor_id: userId,
            type: data.parent_comment_id ? 'REPLY' : 'COMMENT',
            project_id: projectId,
            comment_id: comment.id,
        });
    }
    return comment;
}
async function deleteComment(commentId, userId) {
    // Soft delete
    return prisma_1.default.comment.updateMany({
        where: { id: commentId, user_id: userId },
        data: { is_deleted: true, content: '[deleted]' },
    });
}
async function toggleUpvote(commentId) {
    // Simple increment — a real system would track per-user upvotes
    return prisma_1.default.comment.update({
        where: { id: commentId },
        data: { upvote_count: { increment: 1 } },
    });
}
//# sourceMappingURL=comments.service.js.map