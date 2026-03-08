export declare function getBOMItems(projectId: string): Promise<{
    id: string;
    project_id: string;
    component_name: string;
    quantity: number;
    description: string | null;
    part_number: string | null;
    buy_link: string | null;
    estimated_price: import("@prisma/client/runtime/library").Decimal | null;
    currency: string;
}[]>;
export declare function addBOMItem(projectId: string, data: {
    component_name: string;
    quantity: number;
    description?: string;
    part_number?: string;
    buy_link?: string;
    estimated_price?: number;
    currency?: string;
}): Promise<{
    id: string;
    project_id: string;
    component_name: string;
    quantity: number;
    description: string | null;
    part_number: string | null;
    buy_link: string | null;
    estimated_price: import("@prisma/client/runtime/library").Decimal | null;
    currency: string;
}>;
export declare function updateBOMItem(itemId: string, data: {
    component_name?: string;
    quantity?: number;
    description?: string;
    part_number?: string;
    buy_link?: string;
    estimated_price?: number;
    currency?: string;
}): Promise<{
    id: string;
    project_id: string;
    component_name: string;
    quantity: number;
    description: string | null;
    part_number: string | null;
    buy_link: string | null;
    estimated_price: import("@prisma/client/runtime/library").Decimal | null;
    currency: string;
}>;
export declare function deleteBOMItem(itemId: string): Promise<{
    id: string;
    project_id: string;
    component_name: string;
    quantity: number;
    description: string | null;
    part_number: string | null;
    buy_link: string | null;
    estimated_price: import("@prisma/client/runtime/library").Decimal | null;
    currency: string;
}>;
export declare function getBOMItemById(itemId: string): Promise<({
    project: {
        author_id: string;
    };
} & {
    id: string;
    project_id: string;
    component_name: string;
    quantity: number;
    description: string | null;
    part_number: string | null;
    buy_link: string | null;
    estimated_price: import("@prisma/client/runtime/library").Decimal | null;
    currency: string;
}) | null>;
/** Generate CSV string from BOM items */
export declare function generateCSV(items: Array<{
    component_name: string;
    quantity: number;
    description: string | null;
    part_number: string | null;
    estimated_price: unknown;
    currency: string;
    buy_link: string | null;
}>): string;
//# sourceMappingURL=bom.service.d.ts.map