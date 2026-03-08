export declare function addSection(projectId: string, data: {
    section_type: string;
    title: string;
    content_markdown?: string;
    order_index: number;
}): Promise<{
    id: string;
    created_at: Date;
    title: string;
    project_id: string;
    order_index: number;
    section_type: string;
    content_markdown: string | null;
}>;
export declare function updateSection(sectionId: string, data: {
    title?: string;
    content_markdown?: string;
    section_type?: string;
}): Promise<{
    id: string;
    created_at: Date;
    title: string;
    project_id: string;
    order_index: number;
    section_type: string;
    content_markdown: string | null;
}>;
export declare function deleteSection(sectionId: string): Promise<{
    id: string;
    created_at: Date;
    title: string;
    project_id: string;
    order_index: number;
    section_type: string;
    content_markdown: string | null;
}>;
export declare function reorderSections(projectId: string, orderedIds: {
    id: string;
    order_index: number;
}[]): Promise<{
    id: string;
    created_at: Date;
    title: string;
    project_id: string;
    order_index: number;
    section_type: string;
    content_markdown: string | null;
}[]>;
export declare function getSectionById(sectionId: string): Promise<({
    project: {
        author_id: string;
    };
} & {
    id: string;
    created_at: Date;
    title: string;
    project_id: string;
    order_index: number;
    section_type: string;
    content_markdown: string | null;
}) | null>;
//# sourceMappingURL=sections.service.d.ts.map