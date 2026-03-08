"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleStar = toggleStar;
exports.isProjectStarred = isProjectStarred;
const prisma_1 = __importDefault(require("../db/prisma"));
const notifications_service_1 = require("./notifications.service");
async function toggleStar(userId, projectId) {
    const existing = await prisma_1.default.star.findUnique({
        where: { user_id_project_id: { user_id: userId, project_id: projectId } },
    });
    if (existing) {
        // Unstar
        await prisma_1.default.$transaction([
            prisma_1.default.star.delete({ where: { id: existing.id } }),
            prisma_1.default.project.update({
                where: { id: projectId },
                data: { star_count: { decrement: 1 } },
            }),
        ]);
        return { starred: false };
    }
    else {
        // Star
        const [, project] = await prisma_1.default.$transaction([
            prisma_1.default.star.create({ data: { user_id: userId, project_id: projectId } }),
            prisma_1.default.project.update({
                where: { id: projectId },
                data: { star_count: { increment: 1 } },
                select: { author_id: true },
            }),
        ]);
        // Notify project author (don't notify yourself)
        if (project.author_id !== userId) {
            await (0, notifications_service_1.createNotification)({
                recipient_id: project.author_id,
                actor_id: userId,
                type: 'STAR',
                project_id: projectId,
            });
        }
        return { starred: true };
    }
}
async function isProjectStarred(userId, projectId) {
    const star = await prisma_1.default.star.findUnique({
        where: { user_id_project_id: { user_id: userId, project_id: projectId } },
    });
    return { starred: !!star };
}
