import prisma from '../db/prisma';
import { createNotification } from './notifications.service';

export async function forkProject(userId: string, originalProjectId: string) {
    const original = await prisma.project.findUnique({
        where: { id: originalProjectId },
        include: {
            sections: true,
            bom_items: true,
        },
    });

    if (!original) throw new Error('Project not found');
    if (original.status !== 'PUBLISHED') throw new Error('Can only fork published projects');

    // Create forked project
    const forked = await prisma.project.create({
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
        await prisma.projectSection.createMany({
            data: original.sections.map((s: { section_type: string; title: string; content_markdown: string | null; order_index: number }) => ({
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
        await prisma.bOMItem.createMany({
            data: original.bom_items.map((b: { component_name: string; quantity: number; description: string | null; part_number: string | null; buy_link: string | null; estimated_price: unknown; currency: string }) => ({
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
    await prisma.fork.create({
        data: {
            original_project_id: originalProjectId,
            forked_project_id: forked.id,
            forked_by_user_id: userId,
        },
    });

    // Increment fork count on original
    await prisma.project.update({
        where: { id: originalProjectId },
        data: { fork_count: { increment: 1 } },
    });

    // Notify original author
    if (original.author_id !== userId) {
        await createNotification({
            recipient_id: original.author_id,
            actor_id: userId,
            type: 'FORK',
            project_id: originalProjectId,
        });
    }

    return forked;
}
