"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forkProject = forkProject;
const prisma_1 = __importDefault(require("../db/prisma"));
const notifications_service_1 = require("./notifications.service");
async function forkProject(userId, originalProjectId) {
    const original = await prisma_1.default.project.findUnique({
        where: { id: originalProjectId },
        include: {
            sections: true,
            bom_items: true,
        },
    });
    if (!original)
        throw new Error('Project not found');
    if (original.status !== 'PUBLISHED')
        throw new Error('Can only fork published projects');
    // Create forked project
    const forked = await prisma_1.default.project.create({
        data: {
            author_id: userId,
            title: `${original.title} (Fork)`,
            tagline: original.tagline ?? undefined,
            project_type: original.project_type,
            difficulty: original.difficulty,
            tags: original.tags,
            github_url: original.github_url ?? undefined,
            cover_image_url: original.cover_image_url ?? undefined,
            status: 'DRAFT',
        },
    });
    // Copy sections
    if (original.sections.length > 0) {
        await prisma_1.default.projectSection.createMany({
            data: original.sections.map((s) => ({
                project_id: forked.id,
                section_type: s.section_type,
                title: s.title,
                content_markdown: s.content_markdown,
                order_index: s.order_index,
            })),
        });
    }
    // Copy BOM items
    if (original.bom_items.length > 0) {
        await prisma_1.default.bOMItem.createMany({
            data: original.bom_items.map((b) => ({
                project_id: forked.id,
                component_name: b.component_name,
                quantity: b.quantity,
                description: b.description,
                part_number: b.part_number,
                buy_link: b.buy_link,
                estimated_price: b.estimated_price,
                currency: b.currency,
            })),
        });
    }
    // Record fork relationship
    await prisma_1.default.fork.create({
        data: {
            original_project_id: originalProjectId,
            forked_project_id: forked.id,
            forked_by_user_id: userId,
        },
    });
    // Increment fork count on original
    await prisma_1.default.project.update({
        where: { id: originalProjectId },
        data: { fork_count: { increment: 1 } },
    });
    // Notify original author
    if (original.author_id !== userId) {
        await (0, notifications_service_1.createNotification)({
            recipient_id: original.author_id,
            actor_id: userId,
            type: 'FORK',
            project_id: originalProjectId,
        });
    }
    return forked;
}
//# sourceMappingURL=forks.service.js.map