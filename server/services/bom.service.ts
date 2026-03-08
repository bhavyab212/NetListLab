import prisma from '../db/prisma';

export async function getBOMItems(projectId: string) {
    return prisma.bOMItem.findMany({
        where: { project_id: projectId },
        orderBy: { component_name: 'asc' },
    });
}

export async function addBOMItem(
    projectId: string,
    data: {
        component_name: string;
        quantity: number;
        description?: string;
        part_number?: string;
        buy_link?: string;
        estimated_price?: number;
        currency?: string;
    }
) {
    return prisma.bOMItem.create({
        data: {
            project_id: projectId,
            component_name: data.component_name,
            quantity: data.quantity,
            description: data.description,
            part_number: data.part_number,
            buy_link: data.buy_link,
            estimated_price: data.estimated_price,
            currency: data.currency ?? 'INR',
        },
    });
}

export async function updateBOMItem(
    itemId: string,
    data: {
        component_name?: string;
        quantity?: number;
        description?: string;
        part_number?: string;
        buy_link?: string;
        estimated_price?: number;
        currency?: string;
    }
) {
    return prisma.bOMItem.update({ where: { id: itemId }, data });
}

export async function deleteBOMItem(itemId: string) {
    return prisma.bOMItem.delete({ where: { id: itemId } });
}

export async function getBOMItemById(itemId: string) {
    return prisma.bOMItem.findUnique({
        where: { id: itemId },
        include: { project: { select: { author_id: true } } },
    });
}

/** Generate CSV string from BOM items */
export function generateCSV(
    items: Array<{
        component_name: string;
        quantity: number;
        description: string | null;
        part_number: string | null;
        estimated_price: unknown;
        currency: string;
        buy_link: string | null;
    }>
): string {
    const header = 'Component Name,Quantity,Description,Part Number,Estimated Price,Currency,Buy Link';
    const rows = items.map((item) =>
        [
            `"${item.component_name}"`,
            item.quantity,
            `"${item.description ?? ''}"`,
            `"${item.part_number ?? ''}"`,
            item.estimated_price ?? '',
            item.currency,
            `"${item.buy_link ?? ''}"`,
        ].join(',')
    );
    return [header, ...rows].join('\n');
}
