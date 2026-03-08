import prisma from '../db/prisma';

export async function addSection(
    projectId: string,
    data: {
        section_type: string;
        title: string;
        content_markdown?: string;
        order_index: number;
    }
) {
    return prisma.projectSection.create({
        data: {
            project_id: projectId,
            section_type: data.section_type,
            title: data.title,
            content_markdown: data.content_markdown,
            order_index: data.order_index,
        },
    });
}

export async function updateSection(
    sectionId: string,
    data: {
        title?: string;
        content_markdown?: string;
        section_type?: string;
    }
) {
    return prisma.projectSection.update({
        where: { id: sectionId },
        data,
    });
}

export async function deleteSection(sectionId: string) {
    return prisma.projectSection.delete({ where: { id: sectionId } });
}

export async function reorderSections(
    projectId: string,
    orderedIds: { id: string; order_index: number }[]
) {
    const updates = orderedIds.map(({ id, order_index }) =>
        prisma.projectSection.update({
            where: { id, project_id: projectId },
            data: { order_index },
        })
    );
    return Promise.all(updates);
}

export async function getSectionById(sectionId: string) {
    return prisma.projectSection.findUnique({
        where: { id: sectionId },
        include: { project: { select: { author_id: true } } },
    });
}
